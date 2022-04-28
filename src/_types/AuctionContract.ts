import algosdk, { SignedTransaction } from "algosdk"

export interface AuctionContract {
    makeCreateAuctionTransaction(
        signer: algosdk.Account,
        defaultsellerAddress: string
    ): Promise<SignedTransaction[]>

    makeSetBulkDetailsTransaction(
        signer: algosdk.Account,
        creatorAddress: string,
        floorPrice: number,
        minimumPriceIncrement: number,
        startRound: number,
        timeToLive: number,
        auctionType: number
    ): Promise<SignedTransaction[]>

    makeAddOfferedAssetTransaction(
        signer: algosdk.Account,
        offerAsset: number,
        defaultRoyaltieEnforcerAddress: string,
        offerAppID: number
    ): Promise<SignedTransaction[]>

    makeSetMinimumPriceIncrementTransaction(
        signer: algosdk.Account,
        minimumPriceIncrement: number
    ): Promise<SignedTransaction[]>

    makeSetFloorPriceTransaction(
        signer: algosdk.Account,
        floorPrice: number
    ): Promise<SignedTransaction[]>

    makeSetStartRoundTransaction(
        signer: algosdk.Account,
        startRound: number
    ): Promise<SignedTransaction[]>

    makeSetSellerTransaction(
        signer: algosdk.Account,
        sellerAddress: string
    ): Promise<SignedTransaction[]>

    makeChangeBundleStateTransaction(
        signer: algosdk.Account,
        bundleState: boolean
    ): Promise<SignedTransaction[]>

    makeBidTransaction(
        signer: algosdk.Account,
        bidAmount: number,
        bidderToRefundAddress: string
    ): Promise<SignedTransaction[]>

    makeSettleUnbundledAuctionTransaction(
        signer: algosdk.Account,
        creatorAddress: string,
        buyerAddress: string,
        royaltieEnforcerAddress: string,
        offeredAsset: number
    ): Promise<SignedTransaction[]>

    makeSettleBundledAuctionTransaction(
        signer: algosdk.Account,
        sellerAddress: string,
        buyerAddress: string,
        royaltieEnforcerAddress: string,
        offeredAsset: number
    ): Promise<SignedTransaction[]>

    makeAdminSetAuctionHashTransaction(
        signer: algosdk.Account,
        auctionHash: string,
    ): Promise<SignedTransaction[]>
}
