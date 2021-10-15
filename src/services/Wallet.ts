import { BeaconWallet } from '@taquito/beacon-wallet'
import { ContractAbstraction, ContractProvider, TezosToolkit, Wallet } from '@taquito/taquito'
import { ProfileUpdateCallData } from '../types/ContractCalls'
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
      preferredNetwork: "florencenet",
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
    console.log("connect")
    try {
      await this.getBeaconWallet().requestPermissions({
        network: {
          // @ts-ignore
          type: "florencenet"
        }
      })
  
      const userAddress = await this.getBeaconWallet().getPKH()
      this.tezosToolkit.setWalletProvider(this.getBeaconWallet())

      console.log("enter here")

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
  updateProfile: ContractInteractionMethod<ProfileUpdateCallData> = async (profileData, operationStatusCallback) => {
    // get/create the contract interface
    const userContract = await this.getContract(FxhashContract.REGISTER)

    // call the contract (open wallet)
    operationStatusCallback && operationStatusCallback(ContractOperationStatus.CALLING)
    const opSend = await userContract.methodsObject.update_profile({
      metadata: stringToByteString(profileData.metadata),
      name: profileData.name
    }).send()

    // wait for confirmation
    operationStatusCallback && operationStatusCallback(ContractOperationStatus.WAITING_CONFIRMATION)
    const opConf = await opSend.confirmation(2)

    // OK, injected
    operationStatusCallback && operationStatusCallback(ContractOperationStatus.INJECTED)
  }
}