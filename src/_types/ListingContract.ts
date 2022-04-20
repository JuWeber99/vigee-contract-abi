import {Account, SignedTransaction, TransactionWithSigner} from "algosdk";


export interface ListingContract {
    makeCreateListingTransaction(
        signer: Account,
        isNegotiatable: boolean,
        sellerAccountAddress: string
    ):Promise<SignedTransaction[]>

    makePurchaseListingBundledTransaction(
        signer: Account,
        sellerAccountAddress: string,
        buyerAccountAddress: string,
        royaltieEnforcerAddress: string,
        offeredAssets: number
    ):Promise<SignedTransaction[]>

    makePurchaseListingUnbundledTransaction(
        signer: Account,
        sellerAccountAddress: string,
        buyerAccountAddress: string,
        royaltieEnforcerAddress: string,
        offeredAsset: number
    ):Promise<SignedTransaction[]>

    makeProposeAlternativePriceTransaction(
        signer: Account,
        proposedPrice: number
    ):Promise<SignedTransaction[]>

    makeAddOfferedAssetTransaction(
        signer: Account,
        platformCall: TransactionWithSigner,
        offerAsset: number,
        royaltieEnforcerAddress: string
    ):Promise<SignedTransaction[]>

    makeSetFloorPriceTransaction(
        signer: Account,
        floorPrice: number
    ):Promise<SignedTransaction[]>

    makeSetStartRoundTransaction(
        signer: Account,
        startRound: number
    ):Promise<SignedTransaction[]>

    makeSetSellerTransaction(
        signer: Account,
        platformCall: TransactionWithSigner,
        sellerAccountAddress: number
    ):Promise<SignedTransaction[]>

    makeChangeBundleStateTransaction(
        signer: Account,
        isBundleState: boolean
    ): Promise<SignedTransaction[]>

    makeAdminSetListingHashTransaction(
        signer: Account,
        listingHash: string
    ): Promise<SignedTransaction[]>
}
