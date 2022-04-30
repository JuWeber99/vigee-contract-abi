import { AtomicTransactionComposer, TransactionSigner } from "algosdk"

export enum AUCTION_TYPES {
    DUTCH = 1,
    CANDLE = 2
}
export interface AuctionContract {
    // makeCreateAuctionTransaction(
    //     signer: TransactionSigner, senderAddress: string,
    //     defaultsellerAddress: string
    // ): Promise<AtomicTransactionComposer>

    makeCreateAuctionWithDetailsTransaction(
        signer: TransactionSigner, senderAddress: string,
        floorPrice: number,
        minimumPriceIncrement: number,
        startRound: number,
        timeToLive: number,
        auctionType: number
    ): Promise<AtomicTransactionComposer>

    makeAddOfferedAssetTransaction(
        signer: TransactionSigner,
        senderAddress: string,
        offerAsset: number,
        royaltieAppID: number)
        : Promise<AtomicTransactionComposer>

    makeSetMinimumPriceIncrementTransaction(
        signer: TransactionSigner, senderAddress: string,
        minimumPriceIncrement: number
    ): Promise<AtomicTransactionComposer>

    makeSetFloorPriceTransaction(
        signer: TransactionSigner, senderAddress: string,
        floorPrice: number
    ): Promise<AtomicTransactionComposer>

    makeSetStartRoundTransaction(
        signer: TransactionSigner, senderAddress: string,
        startRound: number
    ): Promise<AtomicTransactionComposer>

    makeSetSellerTransaction(
        signer: TransactionSigner, senderAddress: string,
        sellerAddress: string
    ): Promise<AtomicTransactionComposer>

    makeChangeBundleStateTransaction(
        signer: TransactionSigner, senderAddress: string,
        bundleState: boolean
    ): Promise<AtomicTransactionComposer>

    makeBidTransaction(
        signer: TransactionSigner, senderAddress: string,
        bidAmount: number,
        bidderToRefundAddress: string
    ): Promise<AtomicTransactionComposer>

    makeSettleUnbundledAuctionTransaction(
        signer: TransactionSigner, senderAddress: string,
        creatorAddress: string,
        buyerAddress: string,
        royaltieEnforcerAddress: string,
        offeredAsset: number
    ): Promise<AtomicTransactionComposer>

    makeSettleBundledAuctionTransaction(
        signer: TransactionSigner, senderAddress: string,
        sellerAddress: string,
        buyerAddress: string,
        royaltieEnforcerAddress: string,
        offeredAsset: number
    ): Promise<AtomicTransactionComposer>

    makeAdminSetAuctionHashTransaction(
        signer: TransactionSigner, senderAddress: string,
        auctionHash: string,
    ): Promise<AtomicTransactionComposer>
}
