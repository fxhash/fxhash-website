import { BeaconWallet } from '@taquito/beacon-wallet'
import { TezosToolkit } from '@taquito/taquito'


/**
 * The Wallet Manager class can be used to interract with Taquito API, by providing a level of abstration
 * so that the rest of the app is simpler to write
 */
export class WalletManager {
  beaconWallet: BeaconWallet
  tezosToolkit: TezosToolkit

  constructor() {
    this.tezosToolkit = new TezosToolkit(process.env.NEXT_PUBLIC_RPC_NODE!)
    this.beaconWallet = new BeaconWallet({
      name: "fxhash",
      iconUrl: 'https://tezostaquito.io/img/favicon.png',
      // @ts-ignore
      preferredNetwork: "florencenet",
    })
  }

  /**
   * If a beacon session can be found in the storage, then we can assume that the user is still connected
   * to the platform and thus register its wallet to the tezos toolkit
   */
  async connectFromStorage(): Promise<string|false> {
    try {
      return await this.beaconWallet.getPKH()
    }
    catch (err) {
      return false
    }
  }

  disconnect() {
    return this.beaconWallet.disconnect()
  }

  async connect(): Promise<string|false> {
    console.log("connect")
    try {
      await this.beaconWallet.requestPermissions({
        network: {
          // @ts-ignore
          type: "florencenet"
        }
      })
  
      const userAddress = await this.beaconWallet.getPKH()
      this.tezosToolkit.setWalletProvider(this.beaconWallet)

      console.log("enter here")

      return userAddress
    }
    catch (err) {
      return false
    }
  }
}