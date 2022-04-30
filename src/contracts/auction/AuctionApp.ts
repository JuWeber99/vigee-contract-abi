import { Algodv2, AtomicTransactionComposer, getApplicationAddress, makePaymentTxnWithSuggestedParamsFromObject, OnApplicationComplete, TransactionSigner, TransactionWithSigner } from 'algosdk'
import { AuctionContract, AUCTION_TYPES } from '../../_types'
import { StateSchema } from '../../_types/algorand-typeextender'
import { BaseContract } from '../../_types/base'
import { auctionB64, auctionClearB64 } from './auctionConstant'
import auctionInterface from './AuctionInterface.json'
export class AuctionApp extends BaseContract implements AuctionContract {
  appID: number
  constructor(appID = 0, client: Algodv2) {
    super(
      auctionInterface,
      client,
      appID,
      new StateSchema(0, 1),
      new StateSchema(4, 2),
      auctionB64,
      auctionClearB64
    )
    this.appID = appID
  }

  async makeAddOfferedAssetTransaction(signer: TransactionSigner, senderAddress: string, offerAsset: number, royaltieAppID: number): Promise<AtomicTransactionComposer> {

    const suggestedParams = await this.getSuggested(1000)

    const royaltieSetupColleteral = 100000 + 64 * 50000
    const taxPaymentTransaction: TransactionWithSigner = {
      txn: makePaymentTxnWithSuggestedParamsFromObject({
        from: senderAddress,
        to: getApplicationAddress(this.appID),
        amount: royaltieSetupColleteral,
        suggestedParams,
        rekeyTo: undefined,
      }),
      signer: signer,
    }

    this.atomicTransactionComposer.addMethodCall({
      appID: this.appID,
      method: this.getMethodByName('addOfferedAsset'),
      sender: senderAddress,
      methodArgs: [
        taxPaymentTransaction,
        royaltieAppID,
        offerAsset,
        1
      ],
      suggestedParams: suggestedParams,
      signer: signer,
    })
    return this.atomicTransactionComposer
  }

  async makeBidTransaction(signer: TransactionSigner, senderAddress: string, bidAmount: number, bidderToRefundAddress: string): Promise<AtomicTransactionComposer> {

    const suggestedParams = await this.getSuggested(1000)
    suggestedParams.flatFee = false
    suggestedParams.fee = 0 //get txnfees

    const royaltieSetupColleteral = 100000 + 64 * 50000
    const taxPaymentTransaction: TransactionWithSigner = {
      txn: makePaymentTxnWithSuggestedParamsFromObject({
        from: senderAddress,
        to: getApplicationAddress(this.appID),
        amount: royaltieSetupColleteral,
        suggestedParams,
        rekeyTo: undefined,
      }),
      signer: signer,
    }

    this.atomicTransactionComposer.addMethodCall({
      appID: this.appID,
      method: this.getMethodByName('bid'),
      sender: senderAddress,
      methodArgs: [
        bidAmount,
        taxPaymentTransaction,
        bidderToRefundAddress
      ],
      suggestedParams: suggestedParams,
      signer: signer,
    })

    return this.atomicTransactionComposer
  }

  async makeChangeBundleStateTransaction(signer: TransactionSigner, senderAddress: string, bundleState: boolean): Promise<AtomicTransactionComposer> {

    const suggestedParams = await this.getSuggested(1000)
    suggestedParams.flatFee = false
    suggestedParams.fee = 0 //get txnfees

    this.atomicTransactionComposer.addMethodCall({
      appID: this.appID,
      method: this.getMethodByName('changeBundleState'),
      sender: senderAddress,
      methodArgs: [
        bundleState
      ],
      suggestedParams: suggestedParams,
      signer: signer,
    })

    return this.atomicTransactionComposer
  }

  async makeCreateAuctionWithDetailsTransaction(
    signer: TransactionSigner, senderAddress: string,
    floorPrice: number,
    minimumPriceIncrement: number,
    startRound: number,
    timeToLive: number,
    auctionType: AUCTION_TYPES): Promise<AtomicTransactionComposer> {


    const suggestedParams = await this.getSuggested(1000)
    const approvalProgram = new Uint8Array(
      Buffer.from(await AuctionApp.getCompiledProgram(this.approvalTemplate, AuctionApp.client), "base64")
    )
    const clearProgram = new Uint8Array(
      Buffer.from(await AuctionApp.getCompiledProgram(this.clearTemplate, AuctionApp.client), "base64")
    )

    this.atomicTransactionComposer.addMethodCall({
      appID: 0,
      method: this.getMethodByName('create'),
      sender: senderAddress,
      onComplete: OnApplicationComplete.NoOpOC,
      methodArgs: [
        floorPrice,
        minimumPriceIncrement,
        startRound,
        timeToLive,
        auctionType
      ],
      approvalProgram: approvalProgram,
      clearProgram: clearProgram,
      numLocalByteSlices: this.localSchema.numByteSlice as number,
      numLocalInts: this.localSchema.numUint as number,
      numGlobalByteSlices: this.globalSchema.numByteSlice as number,
      numGlobalInts: this.globalSchema.numUint as number,
      suggestedParams: suggestedParams,
      signer: signer,
    })

    return this.atomicTransactionComposer
  }

  async makeSetFloorPriceTransaction(signer: TransactionSigner, senderAddress: string, floorPrice: number): Promise<AtomicTransactionComposer> {

    const suggestedParams = await this.getSuggested(1000)
    suggestedParams.flatFee = false
    suggestedParams.fee = 0 //get txnfees

    this.atomicTransactionComposer.addMethodCall({
      appID: this.appID,
      method: this.getMethodByName('setFloorPrice'),
      sender: senderAddress,
      methodArgs: [
        floorPrice
      ],
      suggestedParams: suggestedParams,
      signer: signer,
    })

    return this.atomicTransactionComposer
  }

  async makeSetMinimumPriceIncrementTransaction(signer: TransactionSigner, senderAddress: string, minimumPriceIncrement: number): Promise<AtomicTransactionComposer> {

    const suggestedParams = await this.getSuggested(1000)
    suggestedParams.flatFee = false
    suggestedParams.fee = 0 //get txnfees

    this.atomicTransactionComposer.addMethodCall({
      appID: this.appID,
      method: this.getMethodByName('setMinimumPriceIncrement'),
      sender: senderAddress,
      methodArgs: [
        minimumPriceIncrement
      ],
      suggestedParams: suggestedParams,
      signer: signer,
    })

    return this.atomicTransactionComposer
  }

  async makeSetSellerTransaction(signer: TransactionSigner, senderAddress: string, sellerAddress: string): Promise<AtomicTransactionComposer> {

    const suggestedParams = await this.getSuggested(1000)
    suggestedParams.flatFee = false
    suggestedParams.fee = 0 //get txnfees

    this.atomicTransactionComposer.addMethodCall({
      appID: this.appID,
      method: this.getMethodByName('setSeller'),
      sender: senderAddress,
      methodArgs: [
        sellerAddress
      ],
      suggestedParams: suggestedParams,
      signer: signer,
    })

    return this.atomicTransactionComposer
  }

  async makeSetStartRoundTransaction(signer: TransactionSigner, senderAddress: string, startRound: number): Promise<AtomicTransactionComposer> {

    const suggestedParams = await this.getSuggested(1000)
    suggestedParams.flatFee = false
    suggestedParams.fee = 0 //get txnfees

    this.atomicTransactionComposer.addMethodCall({
      appID: this.appID,
      method: this.getMethodByName('setStartRound'),
      sender: senderAddress,
      methodArgs: [
        startRound
      ],
      suggestedParams: suggestedParams,
      signer: signer,
    })

    return this.atomicTransactionComposer
  }

  async makeSettleBundledAuctionTransaction(
    signer: TransactionSigner, senderAddress: string,
    sellerAddress: string,
    buyerAddress: string,
    royaltieEnforcerAddress: string,
    offeredAsset: number): Promise<AtomicTransactionComposer> {


    const suggestedParams = await this.getSuggested(1000)
    suggestedParams.flatFee = false
    suggestedParams.fee = 0 //get txnfees

    this.atomicTransactionComposer.addMethodCall({
      appID: this.appID,
      method: this.getMethodByName('settleBundledAuction'),
      sender: senderAddress,
      methodArgs: [
        sellerAddress,
        buyerAddress,
        royaltieEnforcerAddress,
        offeredAsset
      ],
      suggestedParams: suggestedParams,
      signer: signer,
    })

    return this.atomicTransactionComposer
  }

  async makeSettleUnbundledAuctionTransaction(
    signer: TransactionSigner, senderAddress: string,
    creatorAddress: string,
    buyerAddress: string,
    royaltieEnforcerAddress: string,
    offeredAsset: number): Promise<AtomicTransactionComposer> {


    const suggestedParams = await this.getSuggested(1000)
    suggestedParams.flatFee = false
    suggestedParams.fee = 0 //get txnfees

    this.atomicTransactionComposer.addMethodCall({
      appID: this.appID,
      method: this.getMethodByName('settleUnbundledAuction'),
      sender: senderAddress,
      methodArgs: [
        creatorAddress,
        buyerAddress,
        royaltieEnforcerAddress,
        offeredAsset
      ],
      suggestedParams: suggestedParams,
      signer: signer,
    })

    return this.atomicTransactionComposer
  }

  async makeAdminSetAuctionHashTransaction(signer: TransactionSigner, senderAddress: string, auctionHash: string): Promise<AtomicTransactionComposer> {

    const suggestedParams = await this.getSuggested(1000)
    suggestedParams.flatFee = false
    suggestedParams.fee = 0 //get txnfees

    this.atomicTransactionComposer.addMethodCall({
      appID: this.appID,
      method: this.getMethodByName('adminSetAuctionHash'),
      sender: senderAddress,
      methodArgs: [
        auctionHash
      ],
      suggestedParams: suggestedParams,
      signer: signer,
    })

    return this.atomicTransactionComposer
  }
}
