import algosdk, { Account, SignedTransaction } from 'algosdk'
import { AtomicTransactionComposer } from 'algosdk'
import { MintInformation } from './algorand-typeextender'

export interface RoyaltieContract {
  makeCreateTransaction(
    signer: algosdk.Account
  ): Promise<AtomicTransactionComposer>

  makeSetupTransaction(
    signer: algosdk.Account,
    defaultRoyaltieReceiverAddress: string,
    defaultRoyaltieShare: number
  ): Promise<AtomicTransactionComposer>

  makeCreateNFTTransaction(
    signer: algosdk.Account,
    nftdata: MintInformation,
    solidarityAssetID: number
  ): Promise<AtomicTransactionComposer>

  makeSwapinNFTTransaction(
    signer: algosdk.Account,
    assetID: number
  ): Promise<SignedTransaction[]>

  makeAddToCollectionTransaction(
    signer: algosdk.Account,
    collectionAppID: number
  ): Promise<SignedTransaction[]>

  makeSetBasisPointsTransaction(
    signer: algosdk.Account,
    basisPoints: number,
  ): Promise<SignedTransaction[]>

  makeSetRoyaltieReceiverTransaction(
    signer: algosdk.Account,
    royaltieReceiver: string
  ): Promise<SignedTransaction[]>

  makeGetBasisPointsTransaction(
    signer: algosdk.Account,
    assetID: number
  ): Promise<SignedTransaction[]>

  makeGetOffersTransaction(
    signer: algosdk.Account,
    assetID: number,
    stateAccountAddr: Account
  ): Promise<SignedTransaction[]>

  makeAddPaymentAssetTransaction(
    signer: algosdk.Account,
    assetID: number
  ): Promise<SignedTransaction[]>

  makeOfferRescindTransaction(
    signer: algosdk.Account,
    assetToRescindID: number
  ): Promise<SignedTransaction[]>

  makeSetAdminTransaction(
    signer: algosdk.Account,
    newAdmin: string
  ): Promise<SignedTransaction[]>

  //inner_transfer(signer: algosdk.Account): Promise<SignedTransaction[]>

  // inner_royaltyFreeMove(): Promise<SignedTransaction[]>
  //inner_lockForOffer(): Promise<SignedTransaction[]>
}
