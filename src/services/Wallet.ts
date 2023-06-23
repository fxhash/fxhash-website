import { BeaconWallet } from "@taquito/beacon-wallet"
import { char2Bytes } from "@taquito/utils"
import {
  BurnSupplyCallData,
  MintGenerativeCallData,
  ModerateCall,
  ModerateUserStateCall,
  ProfileUpdateCallData,
  ReportCall,
  UpdateGenerativeCallData,
} from "../types/ContractCalls"
import {
  ContractAbstraction,
  TezosToolkit,
  Wallet,
  WalletProvider,
} from "@taquito/taquito"
// @ts-expect-error no types for autonomy
import autonomyIRL from "autonomy-irl-js"
import {
  ContractOperationCallback,
  ContractOperationStatus,
} from "../types/Contracts"
import { isOperationApplied } from "./Blockchain"
import { RequestSignPayloadInput, SigningType } from "@airgap/beacon-sdk"
import { TContractOperation } from "./contract-operations/ContractOperation"

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

  /**
   * FOR LIVE MINTING:
   * construct a fake wallet provider using autonomyIRL to be able to reuse
   * our beacon wallet implementation
   */
  async connectAutonomyWallet() {
    const { result: pkh } = await autonomyIRL.getAddress({
      chain: autonomyIRL.chain.tez,
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
        const { result } = await autonomyIRL.sendTransaction({
          transactions: operations.map((op) => ({
            kind: "transaction",
            destination: op.to,
            amount: op.amount.toString(),
            mutez: true,
            entrypoint: op.parameter.entrypoint,
            parameters: op.parameter.value,
            storageLimit: op.storageLimit.toString(),
          })),
          sourceAddress: pkh,
          metadata: {
            metadata: {
              name: "fxhash",
              description:
                "The tezos platform for artists and collectors to live out their passion for generative art.",
              url: "https://fxhash.xyz",
              // icons: ["url_icon"],
            },
          },
          chain: autonomyIRL.chain.tez,
        })

        return result
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
      /**
       * If an autonomy wallet is connected, then the disconnect method will throw an error
       * because it's a fake wallet provider. We can ignore this error
       */
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
        const opData = await isOperationApplied(op.opHash)

        // operation is injected, display a success message and exits loop
        return statusCallback?.(ContractOperationStatus.INJECTED, {
          hash: op.opHash,
          operation: op,
          opData: opData,
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

  /**
   * Sign a bytes payload with the wallet currently synced
   */
  async signPayload(bytes: string) {
    const payload: RequestSignPayloadInput = {
      signingType: SigningType.MICHELINE,
      payload: bytes,
      sourceAddress: await this.tezosToolkit.wallet.pkh(),
    }
    return await this.beaconWallet?.client.requestSignPayload(payload)
  }

  /**
   * Crafts a string to enhance the payload with application, time and generic
   * sign payload message.
   */
  private stringPayloadCraft(string: string) {
    return `Tezos Signed Message: fxhash ${new Date().toISOString()} ${string}`
  }

  /**
   * Sign a string payload with the wallet currently synced
   */
  async signString(string: string) {
    const payload = this.stringPayloadCraft(string)
    const bytes = char2Bytes(payload)
    const payloadBytes = `050100${char2Bytes("" + bytes.length)}${bytes}`

    return {
      payload,
      payloadBytes,
      signature: await this.signPayload(payloadBytes),
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
}
