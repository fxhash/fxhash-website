import { BeaconWallet } from '@taquito/beacon-wallet'
import { ContractAbstraction, ContractProvider, DefaultLambdaAddresses, MichelsonMap, TezosToolkit, Wallet } from '@taquito/taquito'
import { CancelOfferCall, CollectCall, MintCall, MintGenerativeCallData, MintGenerativeRawCall, PlaceOfferCall, ProfileUpdateCallData, UpdateGenerativeCallData } from '../types/ContractCalls'
import { ContractInteractionMethod, ContractOperationStatus, FxhashContract } from '../types/Contracts'
import { stringToByteString } from '../utils/convert'


// short
const addresses: Record<FxhashContract, string> = {
  ISSUER: process.env.NEXT_PUBLIC_TZ_CT_ADDRESS_ISSUER!,
  MARKETPLACE: process.env.NEXT_PUBLIC_TZ_CT_ADDRESS_MARKETPLACE!,
  OBJKT: process.env.NEXT_PUBLIC_TZ_CT_ADDRESS_OBJKT!,
  REGISTER: process.env.NEXT_PUBLIC_TZ_CT_ADDRESS_USERREGISTER!,
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
  }

  constructor() {
    this.tezosToolkit = new TezosToolkit(process.env.NEXT_PUBLIC_RPC_NODE!)
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
  updateProfile: ContractInteractionMethod<ProfileUpdateCallData> = async (profileData, statusCallback) => {
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
    catch(err) {
      // any error
      statusCallback && statusCallback(ContractOperationStatus.ERROR)
    }
  }

  /**
   * Mint a Generative Token
   */
  mintGenerative: ContractInteractionMethod<MintGenerativeCallData> = async (tokenData, statusCallback) => {
    try {
      // get/create the contract interface
      const issuerContract = await this.getContract(FxhashContract.ISSUER)
  
      // the Metadata needs to be turned into a Michelson map
      const metaMap = new MichelsonMap<string, string>()
      metaMap.set("", stringToByteString(tokenData.metadata[""]))
  
      // build the raw data to send
      const rawData: MintGenerativeRawCall = {
        ...tokenData,
        metadata: metaMap
      }
  
      // call the contract (open wallet)
      statusCallback && statusCallback(ContractOperationStatus.CALLING)
      const opSend = await issuerContract.methodsObject.mint_issuer(rawData).send()
  
      // wait for confirmation
      statusCallback && statusCallback(ContractOperationStatus.WAITING_CONFIRMATION)
      await opSend.confirmation(1)
  
      // OK, injected
      statusCallback && statusCallback(ContractOperationStatus.INJECTED)
    }
    catch(err) {
      console.log(err)
      // any error
      statusCallback && statusCallback(ContractOperationStatus.ERROR)
    }
  }

  /**
   * Mint a Token from generative token
   */
   mintToken: ContractInteractionMethod<MintCall> = async (tokenData, statusCallback) => {
    try {
      // get/create the contract interface
      const issuerContract = await this.getContract(FxhashContract.ISSUER)
      
      // don't send everyting
      const sendData: Partial<MintCall> = {
        issuer_address: tokenData.issuer_address,
        issuer_id: tokenData.issuer_id
      }
  
      // call the contract (open wallet)
      statusCallback && statusCallback(ContractOperationStatus.CALLING)
      const opSend = await issuerContract.methodsObject.mint(sendData).send({
        amount: tokenData.price,
        mutez: true
      })
  
      // wait for confirmation
      statusCallback && statusCallback(ContractOperationStatus.WAITING_CONFIRMATION)
      await opSend.confirmation(1)
  
      // OK, injected
      statusCallback && statusCallback(ContractOperationStatus.INJECTED, opSend.opHash)
    }
    catch(err) {
      console.log(err)
      // any error
      statusCallback && statusCallback(ContractOperationStatus.ERROR)
    }
  }

  /**
   * Updates the profile 
   */
  updateGenerativeToken: ContractInteractionMethod<UpdateGenerativeCallData> = async (genData, statusCallback) => {
    try {
      // get/create the contract interface
      const issuerContract = await this.getContract(FxhashContract.ISSUER)
  
      // call the contract (open wallet)
      statusCallback && statusCallback(ContractOperationStatus.CALLING)
      const opSend = await issuerContract.methodsObject.update_issuer(genData).send()
  
      // wait for confirmation
      statusCallback && statusCallback(ContractOperationStatus.WAITING_CONFIRMATION)
      await opSend.confirmation(2)
  
      // OK, injected
      statusCallback && statusCallback(ContractOperationStatus.INJECTED)
    }
    catch(err) {
      // any error
      statusCallback && statusCallback(ContractOperationStatus.ERROR)
    }
  }

  /**
   * Place an offer on an Objkt
   */
  placeOffer: ContractInteractionMethod<PlaceOfferCall> = async (data, statusCallback) => {
    try {
      // get/create the contract interface
      const objktContract = await this.getContract(FxhashContract.OBJKT)
      const marketContract = await this.getContract(FxhashContract.MARKETPLACE)
  
      // call the contract (open wallet)
      statusCallback && statusCallback(ContractOperationStatus.CALLING)
      // const opSend = await objktContract.methodsObject.update_operators().getSignature()
      const batchOp = await this.tezosToolkit.wallet.batch() 
        .withContractCall(
          objktContract.methodsObject.update_operators([
            {
              add_operator: {
                owner: data.ownerAddress,
                operator: addresses.MARKETPLACE,
                token_id: data.tokenId
              }
            }
          ])
        )
        .withContractCall(
          marketContract.methodsObject.offer({
            price: data.price,
            objkt_id: data.tokenId,
            creator: data.creatorAddress, 
            royalties: data.royalties
          })
        )
        .send()
  
      // wait for confirmation
      statusCallback && statusCallback(ContractOperationStatus.WAITING_CONFIRMATION)
      await batchOp.confirmation(2)
  
      // OK, injected
      statusCallback && statusCallback(ContractOperationStatus.INJECTED)
    }
    catch(err) {
      // any error
      statusCallback && statusCallback(ContractOperationStatus.ERROR)
    }
  }

  /**
   * Cancel the offer on an objky
   */
   cancelOffer: ContractInteractionMethod<CancelOfferCall> = async (data, statusCallback) => {
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
    catch(err) {
      // any error
      statusCallback && statusCallback(ContractOperationStatus.ERROR)
    }
  }

  /**
   * Cancel the offer on an objky
   */
  collect: ContractInteractionMethod<CollectCall> = async (data, statusCallback) => {
    try {
      // get/create the contract interface
      const marketContract = await this.getContract(FxhashContract.MARKETPLACE)
  
      // call the contract (open wallet)
      statusCallback && statusCallback(ContractOperationStatus.CALLING)
      const opSend = await marketContract.methodsObject.collect(data.offerId).send({
        mutez: true,
        amount: data.price
      })
  
      // wait for confirmation
      statusCallback && statusCallback(ContractOperationStatus.WAITING_CONFIRMATION)
      await opSend.confirmation(2)
  
      // OK, injected
      statusCallback && statusCallback(ContractOperationStatus.INJECTED)
    }
    catch(err) {
      // any error
      statusCallback && statusCallback(ContractOperationStatus.ERROR)
    }
  }
}