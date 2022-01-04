import { BeaconWallet } from '@taquito/beacon-wallet'
import { MichelsonV1Expression } from '@taquito/rpc'
import { ContractAbstraction, MichelsonMap, OpKind, TezosToolkit, Wallet } from '@taquito/taquito'
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
  UpdateGenerativeCallData 
} from '../types/ContractCalls'
import { 
  ContractInteractionMethod,
  ContractOperationStatus, 
  FxhashContract
} from '../types/Contracts'
import { shuffleArray } from '../utils/array'
import { stringToByteString } from '../utils/convert'


// short
const addresses: Record<FxhashContract, string> = {
  ISSUER: process.env.NEXT_PUBLIC_TZ_CT_ADDRESS_ISSUER!,
  MARKETPLACE: process.env.NEXT_PUBLIC_TZ_CT_ADDRESS_MARKETPLACE!,
  OBJKT: process.env.NEXT_PUBLIC_TZ_CT_ADDRESS_OBJKT!,
  REGISTER: process.env.NEXT_PUBLIC_TZ_CT_ADDRESS_USERREGISTER!,
  MODERATION: process.env.NEXT_PUBLIC_TZ_CT_ADDRESS_TOK_MODERATION!,
  USER_MODERATION: process.env.NEXT_PUBLIC_TZ_CT_ADDRESS_USER_MODERATION!,
}

/**
 * The Wallet Manager class can be used to interract with Taquito API, by providing a level of abstration
 * so that the rest of the app is simpler to write
 * It is responsible for handlinf interactions with the contracts as well
 */
export class WalletManager {
  beaconWallet: BeaconWallet|null = null
  tezosToolkit: TezosToolkit
  contracts: Record<FxhashContract, ContractAbstraction<Wallet>|null> = {
    ISSUER: null,
    MARKETPLACE: null,
    OBJKT: null,
    REGISTER: null,
    MODERATION: null,
    USER_MODERATION: null,
  }
  rpcNodes: string[]

  constructor() {
    this.rpcNodes = shuffleArray((process.env.NEXT_PUBLIC_RPC_NODES!).split(','))
    this.tezosToolkit = new TezosToolkit(this.rpcNodes[0])
    this.instanciateBeaconWallet()
  }

  instanciateBeaconWallet() {
    this.beaconWallet = new BeaconWallet({
      name: "fxhash",
      iconUrl: 'https://tezostaquito.io/img/favicon.png',
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
   * If a beacon session can be found in the storage, then we can assume that the user is still connected
   * to the platform and thus register its wallet to the tezos toolkit
   */
  async connectFromStorage(): Promise<string|false> {
    try {
      const pkh = await this.getBeaconWallet().getPKH()
      if (pkh) {
        this.tezosToolkit.setWalletProvider(this.getBeaconWallet())
        return pkh
      }
      else {
        return false
      }
    }
    catch (err) {
      return false
    }
  }

  async disconnect() {
    await this.getBeaconWallet().disconnect()
    this.tezosToolkit.setWalletProvider(undefined)
    this.beaconWallet = null
    this.contracts = {
      ISSUER: null,
      MARKETPLACE: null,
      OBJKT: null,
      REGISTER: null,
      MODERATION: null,
      USER_MODERATION: null,
    }
  }

  async connect(): Promise<string|false> {
    try {
      await this.getBeaconWallet().requestPermissions({
        network: {
          // @ts-ignore
          type: process.env.NEXT_PUBLIC_TZ_NET
        }
      })
  
      const userAddress = await this.getBeaconWallet().getPKH()
      this.tezosToolkit.setWalletProvider(this.getBeaconWallet())

      return userAddress
    }
    catch (err) {
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
    return err && (err.name === "HttpRequestFailed" || err.status === 500 || err.status === 408)
  }

  //---------------------
  //---CONTRACTS STUFF---
  //---------------------

  /**
   * Search for the contract in the in-memory record of the class, creates it if it doesn't exist,
   * and then returns it.
   */
  async getContract(contract: FxhashContract): Promise<ContractAbstraction<Wallet>> {
    if (!this.contracts[contract]) {
      this.contracts[contract] = await this.tezosToolkit.wallet.at(addresses[contract])
    }
    return this.contracts[contract]!
  }

  /**
   * Updates the profile 
   */
  updateProfile: ContractInteractionMethod<ProfileUpdateCallData> = async (profileData, statusCallback, currentTry = 1) => {
    try {
      // get/create the contract interface
      const userContract = await this.getContract(FxhashContract.REGISTER)
  
      // call the contract (open wallet)
      statusCallback && statusCallback(ContractOperationStatus.CALLING)
      const opSend = await userContract.methodsObject.update_profile({
        metadata: stringToByteString(profileData.metadata),
        name: stringToByteString(profileData.name)
      }).send()
  
      // wait for confirmation
      statusCallback && statusCallback(ContractOperationStatus.WAITING_CONFIRMATION)
      await opSend.confirmation(2)
  
      // OK, injected
      statusCallback && statusCallback(ContractOperationStatus.INJECTED)
    }
    catch(err: any) {
      console.log({err})
      
      // if network error, and the nodes have not been all tried
      if (this.canErrorBeCycled(err) && currentTry < this.rpcNodes.length) {
        this.cycleRpcNode()
        await this.updateProfile(profileData, statusCallback, currentTry++)
      }
      else {
        // any error
        statusCallback && statusCallback(ContractOperationStatus.ERROR)
      }
    }
  }

  /**
   * Mint a Generative Token
   */
  mintGenerative: ContractInteractionMethod<MintGenerativeCallData> = async (tokenData, statusCallback, currentTry = 1) => {
    try {
      // get/create the contract interface
      const issuerContract = await this.getContract(FxhashContract.ISSUER)
  
      // call the contract (open wallet)
      statusCallback && statusCallback(ContractOperationStatus.CALLING)
      const opSend = await issuerContract.methodsObject.mint_issuer(tokenData).send()
  
      // wait for confirmation
      statusCallback && statusCallback(ContractOperationStatus.WAITING_CONFIRMATION)
      await opSend.confirmation(1)
  
      // OK, injected
      statusCallback && statusCallback(ContractOperationStatus.INJECTED)
    }
    catch(err: any) {
      console.log({err})
      
      // if network error, and the nodes have not been all tried
      if (this.canErrorBeCycled(err) && currentTry < this.rpcNodes.length) {
        this.cycleRpcNode()
        await this.mintGenerative(tokenData, statusCallback, currentTry++)
      }
      else {
        // any error
        statusCallback && statusCallback(ContractOperationStatus.ERROR)
      }
    }
  }

  /**
   * Mint a Token from generative token
   */
   mintToken: ContractInteractionMethod<MintCall> = async (tokenData, statusCallback, currentTry = 1) => {
    try {
      // get/create the contract interface
      const issuerContract = await this.getContract(FxhashContract.ISSUER)
  
      // call the contract (open wallet)
      statusCallback && statusCallback(ContractOperationStatus.CALLING)
      const opSend = await issuerContract.methodsObject.mint(tokenData.issuer_id).send({
        amount: tokenData.price,
        mutez: true,
        storageLimit: 450
      })
  
      // wait for confirmation
      statusCallback && statusCallback(ContractOperationStatus.WAITING_CONFIRMATION)
      await opSend.confirmation(1)
  
      // OK, injected
      statusCallback && statusCallback(ContractOperationStatus.INJECTED, opSend.opHash)
    }
    catch(err: any) {
      console.log({err})
      
      // if network error, and the nodes have not been all tried
      if (this.canErrorBeCycled(err) && currentTry < this.rpcNodes.length) {
        this.cycleRpcNode()
        await this.mintToken(tokenData, statusCallback, currentTry++)
      }
      else {
        // any error
        statusCallback && statusCallback(ContractOperationStatus.ERROR)
      }
    }
  }

  /**
   * Updates the profile 
   */
  updateGenerativeToken: ContractInteractionMethod<UpdateGenerativeCallData> = async (genData, statusCallback, currentTry = 1) => {
    try {
      // get/create the contract interface
      const issuerContract = await this.getContract(FxhashContract.ISSUER)
  
      // call the contract (open wallet)
      statusCallback && statusCallback(ContractOperationStatus.CALLING)
      const opSend = await issuerContract.methodsObject.update_issuer(genData).send()
  
      // wait for confirmation
      statusCallback && statusCallback(ContractOperationStatus.WAITING_CONFIRMATION)
      await opSend.confirmation(1)
  
      // OK, injected
      statusCallback && statusCallback(ContractOperationStatus.INJECTED)
    }
    catch(err: any) {
      console.log({err})
      
      // if network error, and the nodes have not been all tried
      if (this.canErrorBeCycled(err) && currentTry < this.rpcNodes.length) {
        this.cycleRpcNode()
        await this.updateGenerativeToken(genData, statusCallback, currentTry++)
      }
      else {
        // any error
        statusCallback && statusCallback(ContractOperationStatus.ERROR)
      }
    }
  }

  /**
   * Burn a Token
   */
  burnGenerativeToken: ContractInteractionMethod<number> = async (tokenID, statusCallback, currentTry = 1) => {
    try {
      // get/create the contract interface
      const issuerContract = await this.getContract(FxhashContract.ISSUER)
  
      // call the contract (open wallet)
      statusCallback && statusCallback(ContractOperationStatus.CALLING)
      const opSend = await issuerContract.methodsObject.burn(tokenID).send()
  
      // wait for confirmation
      statusCallback && statusCallback(ContractOperationStatus.WAITING_CONFIRMATION)
      await opSend.confirmation(2)
  
      // OK, injected
      statusCallback && statusCallback(ContractOperationStatus.INJECTED)
    }
    catch(err: any) {
      console.log({err})
      
      // if network error, and the nodes have not been all tried
      if (this.canErrorBeCycled(err) && currentTry < this.rpcNodes.length) {
        this.cycleRpcNode()
        await this.burnGenerativeToken(tokenID, statusCallback, currentTry++)
      }
      else {
        // any error
        statusCallback && statusCallback(ContractOperationStatus.ERROR)
      }
    }
  }

  /**
   * Burn N editions of a token
   */
  burnSupply: ContractInteractionMethod<BurnSupplyCallData> = async (data, statusCallback, currentTry = 1) => {
    try {
      // get/create the contract interface
      const issuerContract = await this.getContract(FxhashContract.ISSUER)
  
      // call the contract (open wallet)
      statusCallback && statusCallback(ContractOperationStatus.CALLING)
      const opSend = await issuerContract.methodsObject.burn_supply(data).send()
  
      // wait for confirmation
      statusCallback && statusCallback(ContractOperationStatus.WAITING_CONFIRMATION)
      await opSend.confirmation(2)
  
      // OK, injected
      statusCallback && statusCallback(ContractOperationStatus.INJECTED)
    }
    catch(err: any) {
      console.log({err})
      
      // if network error, and the nodes have not been all tried
      if (this.canErrorBeCycled(err) && currentTry < this.rpcNodes.length) {
        this.cycleRpcNode()
        await this.burnSupply(data, statusCallback, currentTry++)
      }
      else {
        // any error
        statusCallback && statusCallback(ContractOperationStatus.ERROR)
      }
    }
  }

  /**
   * Place an offer on an Objkt
   */
  placeOffer: ContractInteractionMethod<PlaceOfferCall> = async (data, statusCallback, currentTry = 1) => {
    try {
      // get/create the contract interface
      const objktContract = await this.getContract(FxhashContract.OBJKT)
      const marketContract = await this.getContract(FxhashContract.MARKETPLACE)

      // the origination parameters
      const updateOperatorsValue: MichelsonV1Expression = [{
        "prim": "Left",
        "args": [
          {
            "prim": "Pair",
            "args": [
              {
                "string": data.ownerAddress
              },
              {
                "prim": "Pair",
                "args": [
                  {
                    "string": addresses.MARKETPLACE
                  },
                  {
                    "int": ""+data.tokenId
                  }
                ]
              }
            ]
          }
        ]
      }]

      const listItemValue: MichelsonV1Expression = {
        "prim": "Pair",
        "args": [
          {
            "prim": "Pair",
            "args": [
              {
                "string": data.creatorAddress
              },
              {
                "int": ""+data.tokenId
              }
            ]
          },
          {
            "prim": "Pair",
            "args": [
              {
                "int": ""+data.price
              },
              {
                "int": ""+data.royalties
              }
            ]
          }
        ]
      }

      // call the contract (open wallet)
      statusCallback && statusCallback(ContractOperationStatus.CALLING)
      // const opSend = await objktContract.methodsObject.update_operators().getSignature()
      const batchOp = await this.tezosToolkit.wallet.batch() 
        // .withContractCall(
        //   objktContract.methodsObject.update_operators([
        //     {
        //       add_operator: {
        //         owner: data.ownerAddress,
        //         operator: addresses.MARKETPLACE,
        //         token_id: data.tokenId
        //       }
        //     }
        //   ])
        // )
        // .withContractCall(
        //   marketContract.methodsObject.offer({
        //     price: data.price,
        //     objkt_id: data.tokenId,
        //     creator: data.creatorAddress, 
        //     royalties: data.royalties
        //   })
        // )
        .with([
          {
            kind: OpKind.TRANSACTION,
            to: addresses.OBJKT,
            fee: 1000,
            amount: 0,
            parameter: {
              entrypoint: "update_operators",
              value: updateOperatorsValue
            },
            gasLimit: 8000,
            storageLimit: 250,
          },
          {
            kind: OpKind.TRANSACTION,
            to: addresses.MARKETPLACE,
            fee: 1500,
            amount: 0,
            parameter: {
              entrypoint: "offer",
              value: listItemValue,
            },
            gasLimit: 10000,
            storageLimit: 250
          }
        ])
        .send()
  
      // wait for confirmation
      statusCallback && statusCallback(ContractOperationStatus.WAITING_CONFIRMATION)
      await batchOp.confirmation(2)
  
      // OK, injected
      statusCallback && statusCallback(ContractOperationStatus.INJECTED)
    }
    catch(err: any) {
      console.log({err})
      
      // if network error, and the nodes have not been all tried
      if (this.canErrorBeCycled(err) && currentTry < this.rpcNodes.length) {
        this.cycleRpcNode()
        await this.placeOffer(data, statusCallback, currentTry++)
      }
      else {
        // any error
        statusCallback && statusCallback(ContractOperationStatus.ERROR)
      }
    }
  }

  /**
   * Cancel the offer on an objky
   */
   cancelOffer: ContractInteractionMethod<CancelOfferCall> = async (data, statusCallback, currentTry = 1) => {
    try {
      // get/create the contract interface
      const marketContract = await this.getContract(FxhashContract.MARKETPLACE)
  
      // call the contract (open wallet)
      statusCallback && statusCallback(ContractOperationStatus.CALLING)
      const opSend = await marketContract.methodsObject.cancel_offer(data.offerId).send()
  
      // wait for confirmation
      statusCallback && statusCallback(ContractOperationStatus.WAITING_CONFIRMATION)
      await opSend.confirmation(2)
  
      // OK, injected
      statusCallback && statusCallback(ContractOperationStatus.INJECTED)
    }
    catch(err: any) {
      console.log({err})
      
      // if network error, and the nodes have not been all tried
      if (this.canErrorBeCycled(err) && currentTry < this.rpcNodes.length) {
        this.cycleRpcNode()
        await this.cancelOffer(data, statusCallback, currentTry++)
      }
      else {
        // any error
        statusCallback && statusCallback(ContractOperationStatus.ERROR)
      }
    }
  }

  /**
   * Cancel the offer on an objky
   */
  collect: ContractInteractionMethod<CollectCall> = async (data, statusCallback, currentTry = 1) => {
    try {
      // get/create the contract interface
      const marketContract = await this.getContract(FxhashContract.MARKETPLACE)
  
      // call the contract (open wallet)
      statusCallback && statusCallback(ContractOperationStatus.CALLING)
      const opSend = await marketContract.methodsObject.collect(data.offerId).send({
        mutez: true,
        amount: data.price,
        storageLimit: 150
      })
  
      // wait for confirmation
      statusCallback && statusCallback(ContractOperationStatus.WAITING_CONFIRMATION)
      await opSend.confirmation(2)
  
      // OK, injected
      statusCallback && statusCallback(ContractOperationStatus.INJECTED)
    }
    catch(err: any) {
      console.log({err})
      
      // if network error, and the nodes have not been all tried
      if (this.canErrorBeCycled(err) && currentTry < this.rpcNodes.length) {
        this.cycleRpcNode()
        await this.collect(data, statusCallback, currentTry++)
      }
      else {
        // any error
        statusCallback && statusCallback(ContractOperationStatus.ERROR)
      }
    }
  }

  /**
   * Trigger a report
   */
  report: ContractInteractionMethod<ReportCall> = async (data, statusCallback, currentTry = 1) => {
    try {
      // get/create the contract interface
      const modContract = await this.getContract(FxhashContract.MODERATION)
  
      // call the contract (open wallet)
      statusCallback && statusCallback(ContractOperationStatus.CALLING)
      const opSend = await modContract.methodsObject.report(data.tokenId).send()
  
      // wait for confirmation
      statusCallback && statusCallback(ContractOperationStatus.WAITING_CONFIRMATION)
      await opSend.confirmation(2)
  
      // OK, injected
      statusCallback && statusCallback(ContractOperationStatus.INJECTED)
    }
    catch(err: any) {
      console.log({err})
      
      // if network error, and the nodes have not been all tried
      if (err && err.name === "HttpRequestFailed" && currentTry < this.rpcNodes.length) {
        this.cycleRpcNode()
        await this.report(data, statusCallback, currentTry++)
      }
      else {
        // any error
        statusCallback && statusCallback(ContractOperationStatus.ERROR)
      }
    }
  }

  /**
   * Trigger a report
   */
  moderateToken: ContractInteractionMethod<ModerateCall> = async (data, statusCallback, currentTry = 1) => {
    try {
      // get/create the contract interface
      const modContract = await this.getContract(FxhashContract.MODERATION)
  
      // call the contract (open wallet)
      statusCallback && statusCallback(ContractOperationStatus.CALLING)
      const opSend = await modContract.methodsObject.moderate({
        id: data.tokenId,
        state: data.state
      }).send()
  
      // wait for confirmation
      statusCallback && statusCallback(ContractOperationStatus.WAITING_CONFIRMATION)
      await opSend.confirmation(1)
  
      // OK, injected
      statusCallback && statusCallback(ContractOperationStatus.INJECTED)
    }
    catch(err: any) {
      console.log({err})
      
      // if network error, and the nodes have not been all tried
      if (err && err.name === "HttpRequestFailed" && currentTry < this.rpcNodes.length) {
        this.cycleRpcNode()
        await this.moderateToken(data, statusCallback, currentTry++)
      }
      else {
        // any error
        statusCallback && statusCallback(ContractOperationStatus.ERROR)
      }
    }
  }

  /**
   * Moderates a user using generic endpoint (address, state)
   */
  moderateUser: ContractInteractionMethod<ModerateUserStateCall> = async (data, statusCallback, currentTry = 1) => {
    try {
      // get/create the contract interface
      const modContract = await this.getContract(FxhashContract.USER_MODERATION)
  
      // call the contract (open wallet)
      statusCallback && statusCallback(ContractOperationStatus.CALLING)
      const opSend = await modContract.methodsObject.moderate({
        address: data.address,
        state: data.state
      }).send()
  
      // wait for confirmation
      statusCallback && statusCallback(ContractOperationStatus.WAITING_CONFIRMATION)
      await opSend.confirmation(1)
  
      // OK, injected
      statusCallback && statusCallback(ContractOperationStatus.INJECTED)
    }
    catch(err: any) {
      console.log({err})
      
      // if network error, and the nodes have not been all tried
      if (err && err.name === "HttpRequestFailed" && currentTry < this.rpcNodes.length) {
        this.cycleRpcNode()
        await this.moderateUser(data, statusCallback, currentTry++)
      }
      else {
        // any error
        statusCallback && statusCallback(ContractOperationStatus.ERROR)
      }
    }
  }

  /**
   * Verifies a user by calling the entry point verify(address)
   * This entry point is a shortcut for moderate(address, verify_state)
   */
  verifyUser: ContractInteractionMethod<string> = async (address, statusCallback, currentTry = 1) => {
    try {
      // get/create the contract interface
      const modContract = await this.getContract(FxhashContract.USER_MODERATION)
  
      // call the contract (open wallet)
      statusCallback && statusCallback(ContractOperationStatus.CALLING)
      const opSend = await modContract.methods.verify(address).send()
  
      // wait for confirmation
      statusCallback && statusCallback(ContractOperationStatus.WAITING_CONFIRMATION)
      await opSend.confirmation(1)
  
      // OK, injected
      statusCallback && statusCallback(ContractOperationStatus.INJECTED)
    }
    catch(err: any) {
      console.log({err})
      
      // if network error, and the nodes have not been all tried
      if (err && err.name === "HttpRequestFailed" && currentTry < this.rpcNodes.length) {
        this.cycleRpcNode()
        await this.verifyUser(address, statusCallback, currentTry++)
      }
      else {
        // any error
        statusCallback && statusCallback(ContractOperationStatus.ERROR)
      }
    }
  }

  /**
   * Bans a user by calling the entry point verify(address)
   * This entry point is a shortcut for moderate(address, malicious_state)
   */
  banUser: ContractInteractionMethod<string> = async (address, statusCallback, currentTry = 1) => {
    try {
      // get/create the contract interface
      const modContract = await this.getContract(FxhashContract.USER_MODERATION)
  
      // call the contract (open wallet)
      statusCallback && statusCallback(ContractOperationStatus.CALLING)
      const opSend = await modContract.methods.ban(address).send()
  
      // wait for confirmation
      statusCallback && statusCallback(ContractOperationStatus.WAITING_CONFIRMATION)
      await opSend.confirmation(1)
  
      // OK, injected
      statusCallback && statusCallback(ContractOperationStatus.INJECTED)
    }
    catch(err: any) {
      console.log({err})
      
      // if network error, and the nodes have not been all tried
      if (err && err.name === "HttpRequestFailed" && currentTry < this.rpcNodes.length) {
        this.cycleRpcNode()
        await this.banUser(address, statusCallback, currentTry++)
      }
      else {
        // any error
        statusCallback && statusCallback(ContractOperationStatus.ERROR)
      }
    }
  }
}