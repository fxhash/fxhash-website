import { BeaconWallet } from '@taquito/beacon-wallet'
import { TezosToolkit } from '@taquito/taquito'


/**
 * The Wallet Manager class can be used to interract with Taquito API, by providing a level of abstration
 * so that the rest of the app is simpler to write
 */
export class WalletManager {
  beaconWallet: BeaconWallet|null = null
  tezosToolkit: TezosToolkit

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
      return await this.getBeaconWallet().getPKH()
    }
    catch (err) {
      return false
    }
  }

  async disconnect() {
    await this.getBeaconWallet().disconnect()
    this.tezosToolkit.setWalletProvider(undefined)
    this.beaconWallet = null
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
}