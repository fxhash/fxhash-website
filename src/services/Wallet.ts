import { BeaconWallet } from "@taquito/beacon-wallet"
import {
  ContractAbstraction,
  MichelsonMap,
  OpKind,
  TezosToolkit,
  Wallet,
  WalletProvider,
} from "@taquito/taquito"
import autonomyIRL from "autonomy-irl-js"
import {
  BurnSupplyCallData,
  CancelOfferCall,
  CollectCall,
  MintCall,
  MintGenerativeCallData,
  ModerateCall,
  ModerateUserStateCall,
  PlaceOfferCall,
  ProfileUpdateCallData,
  ReportCall,
  UpdateGenerativeCallData,
} from "../types/ContractCalls"
import {
  ContractInteractionMethod,
  ContractOperationCallback,
  ContractOperationStatus,
  FxhashContracts,
} from "../types/Contracts"
import { stringToByteString } from "../utils/convert"
import { isOperationApplied } from "./Blockchain"
import {
  ContractOperation,
  TContractOperation,
} from "./contract-operations/ContractOperation"

// the different operations which can be performed by the wallet
export enum EWalletOperations {
  UPDATE_PROFILE = "UPDATE_PROFILE",
  PUBLISH_GENERATIVE = "PUBLISH_GENERATIVE",
  UPDATE_GENERATIVE = "UPDATE_GENERATIVE",
  BURN_GENERATIVE = "BURN_GENERATIVE",
  BURN_GENERATIVE_SUPPLY = "BURN_GENERATIVE_SUPPLY",
  MINT_ITERATION = "MINT_ITERATION",
  LIST_TOKEN = "LIST_TOKEN",
  CANCEL_LISTING = "CANCEL_LISTING",
  COLLECT = "COLLECT",
  REPORT = "REPORT",
  MODERATE_TOKEN = "MODERATE_TOKEN",
  MODERATE_USER = "MODERATE_USER",
  VERIFY_USER = "VERIFY_USER",
  BAN_USER = "BAN_USER",
}

/**
 * The Wallet Manager class can be used to interract with Taquito API, by providing a level of abstration
 * so that the rest of the app is simpler to write
 * It is responsible for handlinf interactions with the contracts as well
 */
export class WalletManager {
  beaconWallet: BeaconWallet | null = null
  tezosToolkit: TezosToolkit
  contracts: Record<string, ContractAbstraction<Wallet> | null> = {}
  rpcNodes: string[]

  constructor() {
    // !todo: REMOVE THE SHUFFLE once tests are done
    // for now 1/2 of the traffic is going to go through the fxhash RPC endpoint
    // to test if it works properly with some pretty high traffic
    let RPCS = [...process.env.NEXT_PUBLIC_RPC_NODES!.split(",")]
    // 1/2 chances to shuffle the array, and so it's about 1/2 to always have the
    // fxhash RPC first
    // if (Math.random() < 1) {
    //   RPCS = shuffleArray(RPCS)
    // }
    this.rpcNodes = RPCS
    this.tezosToolkit = new TezosToolkit(this.rpcNodes[0])
    this.instanciateBeaconWallet()
  }

  instanciateBeaconWallet() {
    this.beaconWallet = new BeaconWallet({
      name: "fxhash",
      iconUrl: "https://tezostaquito.io/img/favicon.png",
      // @ts-ignore
      preferredNetwork: process.env.NEXT_PUBLIC_TZ_NET,
    })
  }

  getBeaconWallet(): BeaconWallet {
    if (!this.beaconWallet) {
      this.instanciateBeaconWallet()
    }
    return this.beaconWallet!
  }

  async connectAutonomyWallet() {
    const { result: pkh } = await autonomyIRL.getAddress({
      chain: autonomyIRL.chain.tez,
      // params: params,
    })

    const provider: Pick<
      WalletProvider,
      "getPKH" | "mapTransferParamsToWalletParams" | "sendOperations"
    > = {
      getPKH: () => pkh,
      mapTransferParamsToWalletParams: (params) => {
        return params()
      },
      sendOperations: async (operations) => {
        const { value, errorMessage } = await autonomyIRL.sendTransaction({
          transactions: operations.map((op) => ({
            kind: "transaction",
            destination: op.to,
            amount: 0,
            mutez: true,
            entrypoint: op.parameter.entrypoint,
            parameters: op.parameter.value,
            storageLimit: op.storageLimit.toString(),
          })),
          sourceAddress: pkh,
          metadata: {
            metadata: {
              name: "app_name",
              description: "app_description",
              url: "#",
              icons: ["url_icon"],
            },
          },
          chain: autonomyIRL.chain.tez,
        })

        alert(JSON.stringify(errorMessage))
        alert(JSON.stringify(value))

        return value
      },
    }

    this.beaconWallet = provider as BeaconWallet
    this.tezosToolkit.setWalletProvider(provider as WalletProvider)
    return provider.getPKH()
  }

  /**
   * If a beacon session can be found in the storage, then we can assume that the user is still connected
   * to the platform and thus register its wallet to the tezos toolkit
   */
  async connectFromStorage(): Promise<string | false> {
    try {
      const pkh = await this.getBeaconWallet().getPKH()
      if (pkh) {
        this.tezosToolkit.setWalletProvider(this.getBeaconWallet())
        return pkh
      } else {
        return false
      }
    } catch (err) {
      return false
    }
  }

  async disconnect() {
    try {
      await this.getBeaconWallet().disconnect()
    } catch (_) {
      // do nothing TODO comment
    }
    this.tezosToolkit.setWalletProvider(undefined)
    this.beaconWallet = null
    this.contracts = {}
  }

  async connect(): Promise<string | false> {
    try {
      await this.getBeaconWallet().requestPermissions({
        network: {
          // @ts-ignore
          type: process.env.NEXT_PUBLIC_TZ_NET,
        },
      })

      const userAddress = await this.getBeaconWallet().getPKH()
      this.tezosToolkit.setWalletProvider(this.getBeaconWallet())

      return userAddress
    } catch (err) {
      return false
    }
  }

  cycleRpcNode() {
    // re-arrange the RPC nodes array
    const out = this.rpcNodes.shift()!
    this.rpcNodes.push(out)
    console.log(`update RPC provider: ${this.rpcNodes[0]}`)
    this.tezosToolkit.setRpcProvider(this.rpcNodes[0])
  }

  // given an error, returns true if request can be cycled to another RPC node
  canErrorBeCycled(err: any): boolean {
    return (
      err &&
      (err.name === "HttpRequestFailed" ||
        err.status === 500 ||
        err.status === 408)
    )
  }

  /**
   * Generic method to wrap Contract Interaction methods to add some general
   * logic required for each contract call (refetch, RPC cycling, checking
   * if operation is applied... etc)
   */
  async runContractOperation<Params>(
    OperationClass: TContractOperation<Params>,
    params: Params,
    statusCallback: ContractOperationCallback
  ) {
    // instanciate the class
    const contractOperation = new OperationClass(this, params)

    // we create a loop over the number of available nodes, representing retry
    // operations on failure. (exits under certain criteria)
    for (let i = 0; i < this.rpcNodes.length + 2; i++) {
      try {
        // run the preparations
        statusCallback?.(ContractOperationStatus.CALLING)
        await contractOperation.prepare()

        // now run the contract call
        const op = await contractOperation.call()

        // wait for the confirmation of the operation
        statusCallback?.(ContractOperationStatus.WAITING_CONFIRMATION)
        await isOperationApplied(op.opHash)

        // operation is injected, display a success message and exits loop
        return statusCallback?.(ContractOperationStatus.INJECTED, {
          hash: op.opHash,
          operation: op,
          // todo: remove this
          operationType: EWalletOperations.UPDATE_PROFILE,
          message: contractOperation.success(),
        })
      } catch (err: any) {
        console.log({ err })

        // if network error, and the nodes have not been all tried
        if (this.canErrorBeCycled(err) && i < this.rpcNodes.length) {
          this.cycleRpcNode()
          // retry after RPCs were swapped
          continue
        } else {
          // we just fail, and exit the loop
          return statusCallback?.(
            ContractOperationStatus.ERROR,
            err.description || err.message || null
          )
        }
      }
    }
  }

  //---------------------
  //---CONTRACTS STUFF---
  //---------------------

  /**
   * Search for the contract in the in-memory record of the class, creates it if it doesn't exist,
   * and then returns it.
   */
  async getContract(address: string): Promise<ContractAbstraction<Wallet>> {
    if (!this.contracts[address]) {
      this.contracts[address] = await this.tezosToolkit.wallet.at(address)
    }
    return this.contracts[address]!
  }

  /**
   * Updates the profile
   */
  updateProfile: ContractInteractionMethod<ProfileUpdateCallData> = async (
    profileData,
    statusCallback,
    currentTry = 1
  ) => {
    try {
      // get/create the contract interface
      const userContract = await this.getContract(FxhashContracts.REGISTER)

      // call the contract (open wallet)
      statusCallback && statusCallback(ContractOperationStatus.CALLING)
      const opSend = await userContract.methodsObject
        .update_profile({
          metadata: stringToByteString(profileData.metadata),
          name: stringToByteString(profileData.name),
        })
        .send()

      // wait for confirmation
      statusCallback &&
        statusCallback(ContractOperationStatus.WAITING_CONFIRMATION)
      await isOperationApplied(opSend.opHash)

      // OK, injected
      statusCallback &&
        statusCallback(ContractOperationStatus.INJECTED, {
          hash: opSend.opHash,
          operationType: EWalletOperations.UPDATE_PROFILE,
        })
    } catch (err: any) {
      console.log({ err })

      // if network error, and the nodes have not been all tried
      if (this.canErrorBeCycled(err) && currentTry < this.rpcNodes.length) {
        this.cycleRpcNode()
        await this.updateProfile(profileData, statusCallback, currentTry++)
      } else {
        // any error
        statusCallback &&
          statusCallback(
            ContractOperationStatus.ERROR,
            err.description || err.message || null
          )
      }
    }
  }

  /**
   * Mint a Generative Token
   */
  mintGenerative: ContractInteractionMethod<MintGenerativeCallData> = async (
    tokenData,
    statusCallback,
    currentTry = 1
  ) => {
    try {
      // get/create the contract interface
      const issuerContract = await this.getContract(FxhashContracts.ISSUER)

      // call the contract (open wallet)
      statusCallback && statusCallback(ContractOperationStatus.CALLING)
      const opSend = await issuerContract.methodsObject
        .mint_issuer(tokenData)
        .send()

      // wait for confirmation
      statusCallback &&
        statusCallback(ContractOperationStatus.WAITING_CONFIRMATION)
      await isOperationApplied(opSend.opHash)

      // OK, injected
      statusCallback &&
        statusCallback(ContractOperationStatus.INJECTED, {
          hash: opSend.opHash,
          operationType: EWalletOperations.PUBLISH_GENERATIVE,
        })
    } catch (err: any) {
      console.log({ err })

      // if network error, and the nodes have not been all tried
      if (this.canErrorBeCycled(err) && currentTry < this.rpcNodes.length) {
        this.cycleRpcNode()
        await this.mintGenerative(tokenData, statusCallback, currentTry++)
      } else {
        // any error
        statusCallback &&
          statusCallback(
            ContractOperationStatus.ERROR,
            err.description || err.message || null
          )
      }
    }
  }

  /**
   * Updates the profile
   */
  updateGenerativeToken: ContractInteractionMethod<UpdateGenerativeCallData> =
    async (genData, statusCallback, currentTry = 1) => {
      try {
        // get/create the contract interface
        const issuerContract = await this.getContract(FxhashContracts.ISSUER)

        // call the contract (open wallet)
        statusCallback && statusCallback(ContractOperationStatus.CALLING)
        const opSend = await issuerContract.methodsObject
          .update_issuer(genData)
          .send()

        // wait for confirmation
        statusCallback &&
          statusCallback(ContractOperationStatus.WAITING_CONFIRMATION)
        await isOperationApplied(opSend.opHash)

        // OK, injected
        statusCallback &&
          statusCallback(ContractOperationStatus.INJECTED, {
            hash: opSend.opHash,
            operationType: EWalletOperations.UPDATE_GENERATIVE,
          })
      } catch (err: any) {
        console.log({ err })

        // if network error, and the nodes have not been all tried
        if (this.canErrorBeCycled(err) && currentTry < this.rpcNodes.length) {
          this.cycleRpcNode()
          await this.updateGenerativeToken(
            genData,
            statusCallback,
            currentTry++
          )
        } else {
          // any error
          statusCallback &&
            statusCallback(
              ContractOperationStatus.ERROR,
              err.description || err.message || null
            )
        }
      }
    }

  /**
   * Burn a Token
   */
  burnGenerativeToken: ContractInteractionMethod<number> = async (
    tokenID,
    statusCallback,
    currentTry = 1
  ) => {
    try {
      // get/create the contract interface
      const issuerContract = await this.getContract(FxhashContracts.ISSUER)

      // call the contract (open wallet)
      statusCallback && statusCallback(ContractOperationStatus.CALLING)
      const opSend = await issuerContract.methodsObject.burn(tokenID).send()

      // wait for confirmation
      statusCallback &&
        statusCallback(ContractOperationStatus.WAITING_CONFIRMATION)
      await isOperationApplied(opSend.opHash)

      // OK, injected
      statusCallback &&
        statusCallback(ContractOperationStatus.INJECTED, {
          hash: opSend.opHash,
          operationType: EWalletOperations.BURN_GENERATIVE,
        })
    } catch (err: any) {
      console.log({ err })

      // if network error, and the nodes have not been all tried
      if (this.canErrorBeCycled(err) && currentTry < this.rpcNodes.length) {
        this.cycleRpcNode()
        await this.burnGenerativeToken(tokenID, statusCallback, currentTry++)
      } else {
        // any error
        statusCallback &&
          statusCallback(
            ContractOperationStatus.ERROR,
            err.description || err.message || null
          )
      }
    }
  }

  /**
   * Burn N editions of a token
   */
  burnSupply: ContractInteractionMethod<BurnSupplyCallData> = async (
    data,
    statusCallback,
    currentTry = 1
  ) => {
    try {
      // get/create the contract interface
      const issuerContract = await this.getContract(FxhashContracts.ISSUER)

      // call the contract (open wallet)
      statusCallback && statusCallback(ContractOperationStatus.CALLING)
      const opSend = await issuerContract.methodsObject.burn_supply(data).send()

      // wait for confirmation
      statusCallback &&
        statusCallback(ContractOperationStatus.WAITING_CONFIRMATION)
      await isOperationApplied(opSend.opHash)

      // OK, injected
      statusCallback &&
        statusCallback(ContractOperationStatus.INJECTED, {
          hash: opSend.opHash,
          operationType: EWalletOperations.BURN_GENERATIVE_SUPPLY,
        })
    } catch (err: any) {
      console.log({ err })

      // if network error, and the nodes have not been all tried
      if (this.canErrorBeCycled(err) && currentTry < this.rpcNodes.length) {
        this.cycleRpcNode()
        await this.burnSupply(data, statusCallback, currentTry++)
      } else {
        // any error
        statusCallback &&
          statusCallback(
            ContractOperationStatus.ERROR,
            err.description || err.message || null
          )
      }
    }
  }

  /**
   * Trigger a report
   */
  report: ContractInteractionMethod<ReportCall> = async (
    data,
    statusCallback,
    currentTry = 1
  ) => {
    try {
      // get/create the contract interface
      const modContract = await this.getContract(FxhashContracts.MODERATION)

      // call the contract (open wallet)
      statusCallback && statusCallback(ContractOperationStatus.CALLING)
      const opSend = await modContract.methodsObject
        .report({
          token_id: data.tokenId,
        })
        .send()

      // wait for confirmation
      statusCallback &&
        statusCallback(ContractOperationStatus.WAITING_CONFIRMATION)
      await isOperationApplied(opSend.opHash)

      // OK, injected
      statusCallback &&
        statusCallback(ContractOperationStatus.INJECTED, {
          hash: opSend.opHash,
          operationType: EWalletOperations.REPORT,
        })
    } catch (err: any) {
      console.log({ err })

      // if network error, and the nodes have not been all tried
      if (
        err &&
        err.name === "HttpRequestFailed" &&
        currentTry < this.rpcNodes.length
      ) {
        this.cycleRpcNode()
        await this.report(data, statusCallback, currentTry++)
      } else {
        // any error
        statusCallback &&
          statusCallback(
            ContractOperationStatus.ERROR,
            err.description || err.message || null
          )
      }
    }
  }

  /**
   * Trigger a report
   */
  moderateToken: ContractInteractionMethod<ModerateCall> = async (
    data,
    statusCallback,
    currentTry = 1
  ) => {
    try {
      // get/create the contract interface
      const modContract = await this.getContract(FxhashContracts.MODERATION)

      // call the contract (open wallet)
      statusCallback && statusCallback(ContractOperationStatus.CALLING)
      const opSend = await modContract.methodsObject
        .moderate({
          token_id: data.tokenId,
          state: data.state,
        })
        .send()

      // wait for confirmation
      statusCallback &&
        statusCallback(ContractOperationStatus.WAITING_CONFIRMATION)
      await isOperationApplied(opSend.opHash)

      // OK, injected
      statusCallback &&
        statusCallback(ContractOperationStatus.INJECTED, {
          hash: opSend.opHash,
          operationType: EWalletOperations.MODERATE_TOKEN,
        })
    } catch (err: any) {
      console.log({ err })

      // if network error, and the nodes have not been all tried
      if (
        err &&
        err.name === "HttpRequestFailed" &&
        currentTry < this.rpcNodes.length
      ) {
        this.cycleRpcNode()
        await this.moderateToken(data, statusCallback, currentTry++)
      } else {
        // any error
        statusCallback &&
          statusCallback(
            ContractOperationStatus.ERROR,
            err.description || err.message || null
          )
      }
    }
  }

  /**
   * Moderates a user using generic endpoint (address, state)
   */
  moderateUser: ContractInteractionMethod<ModerateUserStateCall> = async (
    data,
    statusCallback,
    currentTry = 1
  ) => {
    try {
      // get/create the contract interface
      const modContract = await this.getContract(
        FxhashContracts.USER_MODERATION
      )

      // call the contract (open wallet)
      statusCallback && statusCallback(ContractOperationStatus.CALLING)
      const opSend = await modContract.methodsObject
        .moderate({
          address: data.address,
          state: data.state,
        })
        .send()

      // wait for confirmation
      statusCallback &&
        statusCallback(ContractOperationStatus.WAITING_CONFIRMATION)
      await isOperationApplied(opSend.opHash)

      // OK, injected
      statusCallback &&
        statusCallback(ContractOperationStatus.INJECTED, {
          hash: opSend.opHash,
          operationType: EWalletOperations.MODERATE_USER,
        })
    } catch (err: any) {
      console.log({ err })

      // if network error, and the nodes have not been all tried
      if (
        err &&
        err.name === "HttpRequestFailed" &&
        currentTry < this.rpcNodes.length
      ) {
        this.cycleRpcNode()
        await this.moderateUser(data, statusCallback, currentTry++)
      } else {
        // any error
        statusCallback &&
          statusCallback(
            ContractOperationStatus.ERROR,
            err.description || err.message || null
          )
      }
    }
  }

  /**
   * Verifies a user by calling the entry point verify(address)
   * This entry point is a shortcut for moderate(address, verify_state)
   */
  verifyUser: ContractInteractionMethod<string> = async (
    address,
    statusCallback,
    currentTry = 1
  ) => {
    try {
      // get/create the contract interface
      const modContract = await this.getContract(
        FxhashContracts.USER_MODERATION
      )

      // call the contract (open wallet)
      statusCallback && statusCallback(ContractOperationStatus.CALLING)
      const opSend = await modContract.methods.verify(address).send()

      // wait for confirmation
      statusCallback &&
        statusCallback(ContractOperationStatus.WAITING_CONFIRMATION)
      await isOperationApplied(opSend.opHash)

      // OK, injected
      statusCallback &&
        statusCallback(ContractOperationStatus.INJECTED, {
          hash: opSend.opHash,
          operationType: EWalletOperations.VERIFY_USER,
        })
    } catch (err: any) {
      console.log({ err })

      // if network error, and the nodes have not been all tried
      if (
        err &&
        err.name === "HttpRequestFailed" &&
        currentTry < this.rpcNodes.length
      ) {
        this.cycleRpcNode()
        await this.verifyUser(address, statusCallback, currentTry++)
      } else {
        // any error
        statusCallback &&
          statusCallback(
            ContractOperationStatus.ERROR,
            err.description || err.message || null
          )
      }
    }
  }

  /**
   * Bans a user by calling the entry point verify(address)
   * This entry point is a shortcut for moderate(address, malicious_state)
   */
  banUser: ContractInteractionMethod<string> = async (
    address,
    statusCallback,
    currentTry = 1
  ) => {
    try {
      // get/create the contract interface
      const modContract = await this.getContract(
        FxhashContracts.USER_MODERATION
      )

      // call the contract (open wallet)
      statusCallback && statusCallback(ContractOperationStatus.CALLING)
      const opSend = await modContract.methods.ban(address).send()

      // wait for confirmation
      statusCallback &&
        statusCallback(ContractOperationStatus.WAITING_CONFIRMATION)
      await isOperationApplied(opSend.opHash)

      // OK, injected
      statusCallback &&
        statusCallback(ContractOperationStatus.INJECTED, {
          hash: opSend.opHash,
          operationType: EWalletOperations.BAN_USER,
        })
    } catch (err: any) {
      console.log({ err })

      // if network error, and the nodes have not been all tried
      if (
        err &&
        err.name === "HttpRequestFailed" &&
        currentTry < this.rpcNodes.length
      ) {
        this.cycleRpcNode()
        await this.banUser(address, statusCallback, currentTry++)
      } else {
        // any error
        statusCallback &&
          statusCallback(
            ContractOperationStatus.ERROR,
            err.description || err.message || null
          )
      }
    }
  }
}
