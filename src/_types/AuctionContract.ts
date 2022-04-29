import { SignedTransaction, TransactionSigner } from "algosdk"

export interface AuctionContract {
    makeCreateAuctionTransaction(
        signer: TransactionSigner, senderAddress: string,
        defaultsellerAddress: string
    ): Promise<SignedTransaction[]>

    makeSetBulkDetailsTransaction(
        signer: TransactionSigner, senderAddress: string,
        creatorAddress: string,
        floorPrice: number,
        minimumPriceIncrement: number,
        startRound: number,
        timeToLive: number,
        auctionType: number
    ): Promise<SignedTransaction[]>

    makeAddOfferedAssetTransaction(
        signer: TransactionSigner, senderAddress: string,
        offerAsset: number,
        defaultRoyaltieEnforcerAddress: string,
        offerAppID: number
    ): Promise<SignedTransaction[]>

    makeSetMinimumPriceIncrementTransaction(
        signer: TransactionSigner, senderAddress: string,
        minimumPriceIncrement: number
    ): Promise<SignedTransaction[]>

    makeSetFloorPriceTransaction(
        signer: TransactionSigner, senderAddress: string,
        floorPrice: number
    ): Promise<SignedTransaction[]>

    makeSetStartRoundTransaction(
        signer: TransactionSigner, senderAddress: string,
        startRound: number
    ): Promise<SignedTransaction[]>

    makeSetSellerTransaction(
        signer: TransactionSigner, senderAddress: string,
        sellerAddress: string
    ): Promise<SignedTransaction[]>

    makeChangeBundleStateTransaction(
        signer: TransactionSigner, senderAddress: string,
        bundleState: boolean
    ): Promise<SignedTransaction[]>

    makeBidTransaction(
        signer: TransactionSigner, senderAddress: string,
        bidAmount: number,
        bidderToRefundAddress: string
    ): Promise<SignedTransaction[]>

    makeSettleUnbundledAuctionTransaction(
        signer: TransactionSigner, senderAddress: string,
        creatorAddress: string,
        buyerAddress: string,
        royaltieEnforcerAddress: string,
        offeredAsset: number
    ): Promise<SignedTransaction[]>

    makeSettleBundledAuctionTransaction(
        signer: TransactionSigner, senderAddress: string,
        sellerAddress: string,
        buyerAddress: string,
        royaltieEnforcerAddress: string,
        offeredAsset: number
    ): Promise<SignedTransaction[]>

    makeAdminSetAuctionHashTransaction(
        signer: TransactionSigner, senderAddress: string,
        auctionHash: string,
    ): Promise<SignedTransaction[]>
}
