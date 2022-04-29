import { AtomicTransactionComposer, SignedTransaction, TransactionSigner } from 'algosdk'
import { MintInformation } from './algorand-typeextender'

export interface RoyaltieContract {
  makeCreateTransaction(
    signer: TransactionSigner,
    senderAddress: string
  ): Promise<AtomicTransactionComposer>

  makeSetupTransaction(
    signer: TransactionSigner, senderAddress: string,
    defaultRoyaltieReceiverAddress: string,
    defaultRoyaltieShare: number
  ): Promise<AtomicTransactionComposer>

  makeCreateNFTTransaction(
    signer: TransactionSigner, senderAddress: string,
    nftdata: MintInformation,
    solidarityAssetID: number
  ): Promise<AtomicTransactionComposer>

  makeSwapinNFTTransaction(
    signer: TransactionSigner, senderAddress: string,
    assetID: number
  ): Promise<SignedTransaction[]>

  makeAddToCollectionTransaction(
    signer: TransactionSigner, senderAddress: string,
    collectionAppID: number
  ): Promise<SignedTransaction[]>

  makeSetBasisPointsTransaction(
    signer: TransactionSigner, senderAddress: string,
    basisPoints: number,
  ): Promise<SignedTransaction[]>

  makeSetRoyaltieReceiverTransaction(
    signer: TransactionSigner, senderAddress: string,
    royaltieReceiver: string
  ): Promise<SignedTransaction[]>

  makeGetBasisPointsTransaction(
    signer: TransactionSigner, senderAddress: string,
    assetID: number
  ): Promise<SignedTransaction[]>

  makeGetOffersTransaction(
    signer: TransactionSigner, senderAddress: string,
    assetID: number,
    stateHolderAddress: string
  ): Promise<SignedTransaction[]>

  makeAddPaymentAssetTransaction(
    signer: TransactionSigner, senderAddress: string,
    assetID: number
  ): Promise<SignedTransaction[]>

  makeOfferRescindTransaction(
    signer: TransactionSigner, senderAddress: string,
    assetToRescindID: number
  ): Promise<SignedTransaction[]>

  makeSetAdminTransaction(
    signer: TransactionSigner, senderAddress: string,
    newAdmin: string
  ): Promise<SignedTransaction[]>

  //inner_transfer(signer: algosdk.Account): Promise<SignedTransaction[]>

  // inner_royaltyFreeMove(): Promise<SignedTransaction[]>
  //inner_lockForOffer(): Promise<SignedTransaction[]>
}
