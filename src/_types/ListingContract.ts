import {
  SignedTransaction,
  TransactionSigner,
  TransactionWithSigner,
} from 'algosdk';

export interface ListingContract {
  makeCreateListingTransaction(
    signer: TransactionSigner,
    senderAddress: string,
    isNegotiatable: boolean,
    sellerAccountAddress: string
  ): Promise<SignedTransaction[]>;

  makePurchaseListingBundledTransaction(
    signer: TransactionSigner,
    senderAddress: string,
    sellerAccountAddress: string,
    buyerAccountAddress: string,
    royaltieEnforcerAddress: string,
    offeredAssets: number
  ): Promise<SignedTransaction[]>;

  makePurchaseListingUnbundledTransaction(
    signer: TransactionSigner,
    senderAddress: string,
    sellerAccountAddress: string,
    buyerAccountAddress: string,
    royaltieEnforcerAddress: string,
    offeredAsset: number
  ): Promise<SignedTransaction[]>;

  makeProposeAlternativePriceTransaction(
    signer: TransactionSigner,
    senderAddress: string,
    proposedPrice: number
  ): Promise<SignedTransaction[]>;

  makeAddOfferedAssetTransaction(
    signer: TransactionSigner,
    senderAddress: string,
    platformCall: TransactionWithSigner,
    offerAsset: number,
    royaltieEnforcerAddress: string
  ): Promise<SignedTransaction[]>;

  makeSetFloorPriceTransaction(
    signer: TransactionSigner,
    senderAddress: string,
    floorPrice: number
  ): Promise<SignedTransaction[]>;

  makeSetStartRoundTransaction(
    signer: TransactionSigner,
    senderAddress: string,
    startRound: number
  ): Promise<SignedTransaction[]>;

  makeSetSellerTransaction(
    signer: TransactionSigner,
    senderAddress: string,
    platformCall: TransactionWithSigner,
    sellerAccountAddress: number
  ): Promise<SignedTransaction[]>;

  makeChangeBundleStateTransaction(
    signer: TransactionSigner,
    senderAddress: string,
    isBundleState: boolean
  ): Promise<SignedTransaction[]>;

  makeAdminSetListingHashTransaction(
    signer: TransactionSigner,
    senderAddress: string,
    listingHash: string
  ): Promise<SignedTransaction[]>;
}
