import algosdk, {SignedTransaction} from "algosdk";

export interface AuctionContract {
    createAuction(
        signer: algosdk.Account,
        defaultsellerAddress: string
    ): Promise<SignedTransaction[]>;

    setBulkDetails(
        signer: algosdk.Account,
        creatorAddress: string,
        floorPrice: number,
        minimumPriceIncrement: number,
        startRound: number,
        timeToLive: number,
        auctionType: number
    ): Promise<SignedTransaction[]>;

    addOfferedAsset(
        signer: algosdk.Account,
        offerAsset: number,
        defaultRoyaltieEnforcerAddress: string,
        offerAppID: number
    ): Promise<SignedTransaction[]>

    setMinimumPriceIncrement(
        signer: algosdk.Account,
        minimumPriceIncrement: number
    ): Promise<SignedTransaction[]>

    setFloorPrice(
        signer: algosdk.Account,
        floorPrice: number
    ): Promise<SignedTransaction[]>

    setStartRound(
        signer: algosdk.Account,
        startRound: number
    ): Promise<SignedTransaction[]>

    setSeller(
        signer: algosdk.Account,
        sellerAddress: string
    ): Promise<SignedTransaction[]>

    changeBundleState(
        signer: algosdk.Account,
        bundleState: boolean
    ): Promise<SignedTransaction[]>

    bid(
        signer: algosdk.Account,
        bidAmount: number,
        bidderToRefundAddress: string
    ): Promise<SignedTransaction[]>

    settleUnbundledAuction(
        signer: algosdk.Account,
        creatorAddress: string,
        buyerAddress: string,
        royaltieEnforcerAddress: string,
        offeredAsset: number
    ): Promise<SignedTransaction[]>

    settleBundledAuction(
        signer: algosdk.Account,
        sellerAddress: string,
        buyerAddress: string,
        royaltieEnforcerAddress: string,
        offeredAsset: number
    ): Promise<SignedTransaction[]>
}
