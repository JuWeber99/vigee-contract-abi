import { Algodv2, getApplicationAddress, makePaymentTxnWithSuggestedParamsFromObject, SignedTransaction, TransactionSigner, TransactionWithSigner } from 'algosdk'
import { AuctionContract, AUCTION_TYPES } from '../../_types'
import { StateSchema } from '../../_types/algorand-typeextender'
import { BaseContract } from '../../_types/base'
import { decodedSignedTransactionBuffer } from "../utils"
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

  async makeAddOfferedAssetTransaction(signer: TransactionSigner, senderAddress: string, offerAsset: number, royaltieAppID: number): Promise<SignedTransaction[]> {

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

    const addOfferedAssetAbiGroup = await this.atomicTransactionComposer.gatherSignatures()
    return addOfferedAssetAbiGroup.map(decodedSignedTransactionBuffer)
  }

  async makeBidTransaction(signer: TransactionSigner, senderAddress: string, bidAmount: number, bidderToRefundAddress: string): Promise<SignedTransaction[]> {

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
      appID: 0,
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

    const bidAbiGroup = await this.atomicTransactionComposer.gatherSignatures()
    return bidAbiGroup.map(decodedSignedTransactionBuffer)
  }

  async makeChangeBundleStateTransaction(signer: TransactionSigner, senderAddress: string, bundleState: boolean): Promise<SignedTransaction[]> {

    const suggestedParams = await this.getSuggested(1000)
    suggestedParams.flatFee = false
    suggestedParams.fee = 0 //get txnfees

    this.atomicTransactionComposer.addMethodCall({
      appID: 0,
      method: this.getMethodByName('changeBundleState'),
      sender: senderAddress,
      methodArgs: [
        bundleState
      ],
      suggestedParams: suggestedParams,
      signer: signer,
    })

    const changeBundleStateAbiGroup = await this.atomicTransactionComposer.gatherSignatures()
    return changeBundleStateAbiGroup.map(decodedSignedTransactionBuffer)
  }

  async makeCreateAuctionWithDetailsTransaction(
    signer: TransactionSigner, senderAddress: string,
    floorPrice: number,
    minimumPriceIncrement: number,
    startRound: number,
    timeToLive: number,
    auctionType: AUCTION_TYPES): Promise<SignedTransaction[]> {


    const suggestedParams = await this.getSuggested(1000)
    // suggestedParams.flatFee = false
    // suggestedParams.fee = 0 //get txnfees


    this.atomicTransactionComposer.addMethodCall({
      appID: 0,
      approvalProgram: new Uint8Array(
        Buffer.from(await AuctionApp.getCompiledProgram(this.approvalTemplate, AuctionApp.client), "base64")
      ),
      clearProgram: new Uint8Array(
        Buffer.from(await AuctionApp.getCompiledProgram(this.clearTemplate, AuctionApp.client), "base64")
      ),
      numLocalByteSlices: this.localSchema.numByteSlice as number,
      numLocalInts: this.localSchema.numUint as number,
      numGlobalByteSlices: this.globalSchema.numByteSlice as number,
      numGlobalInts: this.globalSchema.numUint as number,
      method: this.getMethodByName('create'),
      sender: senderAddress,
      methodArgs: [
        floorPrice,
        minimumPriceIncrement,
        startRound,
        timeToLive,
        auctionType
      ],
      suggestedParams: suggestedParams,
      signer: signer,
    })

    const setBulkDetailsAbiGroup = await this.atomicTransactionComposer.gatherSignatures()
    return setBulkDetailsAbiGroup.map(decodedSignedTransactionBuffer)
  }

  async makeSetFloorPriceTransaction(signer: TransactionSigner, senderAddress: string, floorPrice: number): Promise<SignedTransaction[]> {

    const suggestedParams = await this.getSuggested(1000)
    suggestedParams.flatFee = false
    suggestedParams.fee = 0 //get txnfees

    this.atomicTransactionComposer.addMethodCall({
      appID: 0,
      method: this.getMethodByName('setFloorPrice'),
      sender: senderAddress,
      methodArgs: [
        floorPrice
      ],
      suggestedParams: suggestedParams,
      signer: signer,
    })

    const setFloorPriceAbiGroup = await this.atomicTransactionComposer.gatherSignatures()
    return setFloorPriceAbiGroup.map(decodedSignedTransactionBuffer)
  }

  async makeSetMinimumPriceIncrementTransaction(signer: TransactionSigner, senderAddress: string, minimumPriceIncrement: number): Promise<SignedTransaction[]> {

    const suggestedParams = await this.getSuggested(1000)
    suggestedParams.flatFee = false
    suggestedParams.fee = 0 //get txnfees

    this.atomicTransactionComposer.addMethodCall({
      appID: 0,
      method: this.getMethodByName('setMinimumPriceIncrement'),
      sender: senderAddress,
      methodArgs: [
        minimumPriceIncrement
      ],
      suggestedParams: suggestedParams,
      signer: signer,
    })

    const setMinimumPriceIncrementAbiGroup = await this.atomicTransactionComposer.gatherSignatures()
    return setMinimumPriceIncrementAbiGroup.map(decodedSignedTransactionBuffer)
  }

  async makeSetSellerTransaction(signer: TransactionSigner, senderAddress: string, sellerAddress: string): Promise<SignedTransaction[]> {

    const suggestedParams = await this.getSuggested(1000)
    suggestedParams.flatFee = false
    suggestedParams.fee = 0 //get txnfees

    this.atomicTransactionComposer.addMethodCall({
      appID: 0,
      method: this.getMethodByName('setSeller'),
      sender: senderAddress,
      methodArgs: [
        sellerAddress
      ],
      suggestedParams: suggestedParams,
      signer: signer,
    })

    const setSellerAbiGroup = await this.atomicTransactionComposer.gatherSignatures()
    return setSellerAbiGroup.map(decodedSignedTransactionBuffer)
  }

  async makeSetStartRoundTransaction(signer: TransactionSigner, senderAddress: string, startRound: number): Promise<SignedTransaction[]> {

    const suggestedParams = await this.getSuggested(1000)
    suggestedParams.flatFee = false
    suggestedParams.fee = 0 //get txnfees

    this.atomicTransactionComposer.addMethodCall({
      appID: 0,
      method: this.getMethodByName('setStartRound'),
      sender: senderAddress,
      methodArgs: [
        startRound
      ],
      suggestedParams: suggestedParams,
      signer: signer,
    })

    const setStartRoundAbiGroup = await this.atomicTransactionComposer.gatherSignatures()
    return setStartRoundAbiGroup.map(decodedSignedTransactionBuffer)
  }

  async makeSettleBundledAuctionTransaction(
    signer: TransactionSigner, senderAddress: string,
    sellerAddress: string,
    buyerAddress: string,
    royaltieEnforcerAddress: string,
    offeredAsset: number): Promise<SignedTransaction[]> {


    const suggestedParams = await this.getSuggested(1000)
    suggestedParams.flatFee = false
    suggestedParams.fee = 0 //get txnfees

    this.atomicTransactionComposer.addMethodCall({
      appID: 0,
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

    const settleBundledAuctionAbiGroup = await this.atomicTransactionComposer.gatherSignatures()
    return settleBundledAuctionAbiGroup.map(decodedSignedTransactionBuffer)
  }

  async makeSettleUnbundledAuctionTransaction(
    signer: TransactionSigner, senderAddress: string,
    creatorAddress: string,
    buyerAddress: string,
    royaltieEnforcerAddress: string,
    offeredAsset: number): Promise<SignedTransaction[]> {


    const suggestedParams = await this.getSuggested(1000)
    suggestedParams.flatFee = false
    suggestedParams.fee = 0 //get txnfees

    this.atomicTransactionComposer.addMethodCall({
      appID: 0,
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

    const settleUnbundledAuctionAbiGroup = await this.atomicTransactionComposer.gatherSignatures()
    return settleUnbundledAuctionAbiGroup.map(decodedSignedTransactionBuffer)
  }

  async makeAdminSetAuctionHashTransaction(signer: TransactionSigner, senderAddress: string, auctionHash: string): Promise<SignedTransaction[]> {

    const suggestedParams = await this.getSuggested(1000)
    suggestedParams.flatFee = false
    suggestedParams.fee = 0 //get txnfees

    this.atomicTransactionComposer.addMethodCall({
      appID: 0,
      method: this.getMethodByName('adminSetAuctionHash'),
      sender: senderAddress,
      methodArgs: [
        auctionHash
      ],
      suggestedParams: suggestedParams,
      signer: signer,
    })

    const adminSetAuctionHashAbiGroup = await this.atomicTransactionComposer.gatherSignatures()
    return adminSetAuctionHashAbiGroup.map(decodedSignedTransactionBuffer)
  }
}
