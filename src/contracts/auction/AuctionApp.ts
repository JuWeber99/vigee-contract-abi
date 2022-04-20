import algosdk, {
  Account, Algodv2, AtomicTransactionComposer, getApplicationAddress,
  makeBasicAccountTransactionSigner, makePaymentTxnWithSuggestedParamsFromObject, SignedTransaction, TransactionWithSigner
} from 'algosdk';
import { AuctionContract } from '../../_types';
import { StateSchema } from '../../_types/algorand-typeextender';
import { BaseContract } from '../../_types/base';
import { ALGORAND_ZERO_ADDRESS, decodedSignedTransactionBuffer } from "../utils";
import auctionInterface from './AuctionInterface.json';
export class AuctionApp extends BaseContract implements AuctionContract {
  appID: number;
  constructor(appID = 0, client: Algodv2) {
    super(
      auctionInterface,
      client,
      appID,
      new StateSchema(0, 1),
      new StateSchema(0, 2)
    );
    this.appID = appID;
  }


  async makeAddOfferedAssetTransaction(signer: Account, offerAsset: number, defaultRoyaltieEnforcerAddress: string, offerAppID: number): Promise<SignedTransaction[]> {
    const atomicTransactionComposer = new AtomicTransactionComposer();
    const suggestedParams = await this.getSuggested(10);
    suggestedParams.flatFee = false;
    suggestedParams.fee = 0; //get txnfees

    const royaltieSetupColleteral = 100000 + 64 * 50000;
    const taxPaymentTransaction: TransactionWithSigner = {
      txn: makePaymentTxnWithSuggestedParamsFromObject({
        from: signer.addr,
        to: getApplicationAddress(this.appID),
        amount: royaltieSetupColleteral,
        suggestedParams,
        rekeyTo: ALGORAND_ZERO_ADDRESS,
      }),
      signer: makeBasicAccountTransactionSigner(signer),
    };

    atomicTransactionComposer.addMethodCall({
      appID: 0,
      method: this.getMethodByName('addOfferedAsset'),
      sender: signer.addr,
      methodArgs: [
        taxPaymentTransaction,
        offerAsset,
        defaultRoyaltieEnforcerAddress,
        offerAppID
      ],
      suggestedParams: suggestedParams,
      signer: makeBasicAccountTransactionSigner(signer),
    });

    const addOfferedAssetAbiGroup = await atomicTransactionComposer.gatherSignatures();
    return addOfferedAssetAbiGroup.map(decodedSignedTransactionBuffer);
  }

  async makeBidTransaction(signer: Account, bidAmount: number, bidderToRefundAddress: string): Promise<SignedTransaction[]> {
    const atomicTransactionComposer = new AtomicTransactionComposer();
    const suggestedParams = await this.getSuggested(10);
    suggestedParams.flatFee = false;
    suggestedParams.fee = 0; //get txnfees

    const royaltieSetupColleteral = 100000 + 64 * 50000;
    const taxPaymentTransaction: TransactionWithSigner = {
      txn: makePaymentTxnWithSuggestedParamsFromObject({
        from: signer.addr,
        to: getApplicationAddress(this.appID),
        amount: royaltieSetupColleteral,
        suggestedParams,
        rekeyTo: ALGORAND_ZERO_ADDRESS,
      }),
      signer: makeBasicAccountTransactionSigner(signer),
    };

    atomicTransactionComposer.addMethodCall({
      appID: 0,
      method: this.getMethodByName('bid'),
      sender: signer.addr,
      methodArgs: [
        bidAmount,
        taxPaymentTransaction,
        bidderToRefundAddress
      ],
      suggestedParams: suggestedParams,
      signer: makeBasicAccountTransactionSigner(signer),
    });

    const bidAbiGroup = await atomicTransactionComposer.gatherSignatures();
    return bidAbiGroup.map(decodedSignedTransactionBuffer);
  }

  async makeChangeBundleStateTransaction(signer: Account, bundleState: boolean): Promise<SignedTransaction[]> {
    const atomicTransactionComposer = new AtomicTransactionComposer();
    const suggestedParams = await this.getSuggested(10);
    suggestedParams.flatFee = false;
    suggestedParams.fee = 0; //get txnfees

    atomicTransactionComposer.addMethodCall({
      appID: 0,
      method: this.getMethodByName('changeBundleState'),
      sender: signer.addr,
      methodArgs: [
        bundleState
      ],
      suggestedParams: suggestedParams,
      signer: makeBasicAccountTransactionSigner(signer),
    });

    const changeBundleStateAbiGroup = await atomicTransactionComposer.gatherSignatures();
    return changeBundleStateAbiGroup.map(decodedSignedTransactionBuffer);
  }

  async makeCreateAuctionTransaction(signer: Account, defaultsellerAddress: string): Promise<SignedTransaction[]> {
    const atomicTransactionComposer = new AtomicTransactionComposer();
    const suggestedParams = await this.getSuggested(10);
    suggestedParams.flatFee = false;
    suggestedParams.fee = 0; //get txnfees

    const royaltieSetupColleteral = 100000 + 64 * 50000;
    const taxPaymentTransaction: TransactionWithSigner = {
      txn: makePaymentTxnWithSuggestedParamsFromObject({
        from: signer.addr,
        to: getApplicationAddress(this.appID),
        amount: royaltieSetupColleteral,
        suggestedParams,
        rekeyTo: ALGORAND_ZERO_ADDRESS,
      }),
      signer: makeBasicAccountTransactionSigner(signer),
    };

    atomicTransactionComposer.addMethodCall({
      appID: 0,
      method: this.getMethodByName('createAuction'),
      sender: signer.addr,
      methodArgs: [
        taxPaymentTransaction,
        defaultsellerAddress
      ],
      suggestedParams: suggestedParams,
      signer: makeBasicAccountTransactionSigner(signer),
    });

    const createAuctionAbiGroup = await atomicTransactionComposer.gatherSignatures();
    return createAuctionAbiGroup.map(decodedSignedTransactionBuffer);
  }

  async makeSetBulkDetailsTransaction(
    signer: algosdk.Account,
    creatorAddress: string,
    floorPrice: number,
    minimumPriceIncrement: number,
    startRound: number,
    timeToLive: number,
    auctionType: number): Promise<SignedTransaction[]> {

    const atomicTransactionComposer = new AtomicTransactionComposer();
    const suggestedParams = await this.getSuggested(10);
    suggestedParams.flatFee = false;
    suggestedParams.fee = 0; //get txnfees

    atomicTransactionComposer.addMethodCall({
      appID: 0,
      method: this.getMethodByName('setBulkDetails'),
      sender: signer.addr,
      methodArgs: [
        creatorAddress,
        floorPrice,
        minimumPriceIncrement,
        startRound,
        timeToLive,
        auctionType
      ],
      suggestedParams: suggestedParams,
      signer: makeBasicAccountTransactionSigner(signer),
    });

    const setBulkDetailsAbiGroup = await atomicTransactionComposer.gatherSignatures();
    return setBulkDetailsAbiGroup.map(decodedSignedTransactionBuffer);
  }

  async makeSetFloorPriceTransaction(signer: Account, floorPrice: number): Promise<SignedTransaction[]> {
    const atomicTransactionComposer = new AtomicTransactionComposer();
    const suggestedParams = await this.getSuggested(10);
    suggestedParams.flatFee = false;
    suggestedParams.fee = 0; //get txnfees

    atomicTransactionComposer.addMethodCall({
      appID: 0,
      method: this.getMethodByName('setFloorPrice'),
      sender: signer.addr,
      methodArgs: [
        floorPrice
      ],
      suggestedParams: suggestedParams,
      signer: makeBasicAccountTransactionSigner(signer),
    });

    const setFloorPriceAbiGroup = await atomicTransactionComposer.gatherSignatures();
    return setFloorPriceAbiGroup.map(decodedSignedTransactionBuffer);
  }

  async makeSetMinimumPriceIncrementTransaction(signer: Account, minimumPriceIncrement: number): Promise<SignedTransaction[]> {
    const atomicTransactionComposer = new AtomicTransactionComposer();
    const suggestedParams = await this.getSuggested(10);
    suggestedParams.flatFee = false;
    suggestedParams.fee = 0; //get txnfees

    atomicTransactionComposer.addMethodCall({
      appID: 0,
      method: this.getMethodByName('setMinimumPriceIncrement'),
      sender: signer.addr,
      methodArgs: [
        minimumPriceIncrement
      ],
      suggestedParams: suggestedParams,
      signer: makeBasicAccountTransactionSigner(signer),
    });

    const setMinimumPriceIncrementAbiGroup = await atomicTransactionComposer.gatherSignatures();
    return setMinimumPriceIncrementAbiGroup.map(decodedSignedTransactionBuffer);
  }

  async makeSetSellerTransaction(signer: Account, sellerAddress: string): Promise<SignedTransaction[]> {
    const atomicTransactionComposer = new AtomicTransactionComposer();
    const suggestedParams = await this.getSuggested(10);
    suggestedParams.flatFee = false;
    suggestedParams.fee = 0; //get txnfees

    atomicTransactionComposer.addMethodCall({
      appID: 0,
      method: this.getMethodByName('setSeller'),
      sender: signer.addr,
      methodArgs: [
        sellerAddress
      ],
      suggestedParams: suggestedParams,
      signer: makeBasicAccountTransactionSigner(signer),
    });

    const setSellerAbiGroup = await atomicTransactionComposer.gatherSignatures();
    return setSellerAbiGroup.map(decodedSignedTransactionBuffer);
  }

  async makeSetStartRoundTransaction(signer: Account, startRound: number): Promise<SignedTransaction[]> {
    const atomicTransactionComposer = new AtomicTransactionComposer();
    const suggestedParams = await this.getSuggested(10);
    suggestedParams.flatFee = false;
    suggestedParams.fee = 0; //get txnfees

    atomicTransactionComposer.addMethodCall({
      appID: 0,
      method: this.getMethodByName('setStartRound'),
      sender: signer.addr,
      methodArgs: [
        startRound
      ],
      suggestedParams: suggestedParams,
      signer: makeBasicAccountTransactionSigner(signer),
    });

    const setStartRoundAbiGroup = await atomicTransactionComposer.gatherSignatures();
    return setStartRoundAbiGroup.map(decodedSignedTransactionBuffer);
  }

  async makeSettleBundledAuctionTransaction(
    signer: Account,
    sellerAddress: string,
    buyerAddress: string,
    royaltieEnforcerAddress: string,
    offeredAsset: number): Promise<SignedTransaction[]> {

    const atomicTransactionComposer = new AtomicTransactionComposer();
    const suggestedParams = await this.getSuggested(10);
    suggestedParams.flatFee = false;
    suggestedParams.fee = 0; //get txnfees

    atomicTransactionComposer.addMethodCall({
      appID: 0,
      method: this.getMethodByName('settleBundledAuction'),
      sender: signer.addr,
      methodArgs: [
        sellerAddress,
        buyerAddress,
        royaltieEnforcerAddress,
        offeredAsset
      ],
      suggestedParams: suggestedParams,
      signer: makeBasicAccountTransactionSigner(signer),
    });

    const settleBundledAuctionAbiGroup = await atomicTransactionComposer.gatherSignatures();
    return settleBundledAuctionAbiGroup.map(decodedSignedTransactionBuffer);
  }

  async makeSettleUnbundledAuctionTransaction(
    signer: Account,
    creatorAddress: string,
    buyerAddress: string,
    royaltieEnforcerAddress: string,
    offeredAsset: number): Promise<SignedTransaction[]> {

    const atomicTransactionComposer = new AtomicTransactionComposer();
    const suggestedParams = await this.getSuggested(10);
    suggestedParams.flatFee = false;
    suggestedParams.fee = 0; //get txnfees

    atomicTransactionComposer.addMethodCall({
      appID: 0,
      method: this.getMethodByName('settleUnbundledAuction'),
      sender: signer.addr,
      methodArgs: [
        creatorAddress,
        buyerAddress,
        royaltieEnforcerAddress,
        offeredAsset
      ],
      suggestedParams: suggestedParams,
      signer: makeBasicAccountTransactionSigner(signer),
    });

    const settleUnbundledAuctionAbiGroup = await atomicTransactionComposer.gatherSignatures();
    return settleUnbundledAuctionAbiGroup.map(decodedSignedTransactionBuffer);
  }

  async makeAdminSetAuctionHashTransaction(signer: algosdk.Account, auctionHash: string): Promise<SignedTransaction[]> {
    const atomicTransactionComposer = new AtomicTransactionComposer();
    const suggestedParams = await this.getSuggested(10);
    suggestedParams.flatFee = false;
    suggestedParams.fee = 0; //get txnfees

    atomicTransactionComposer.addMethodCall({
      appID: 0,
      method: this.getMethodByName('adminSetAuctionHash'),
      sender: signer.addr,
      methodArgs: [
        auctionHash
      ],
      suggestedParams: suggestedParams,
      signer: makeBasicAccountTransactionSigner(signer),
    });

    const adminSetAuctionHashAbiGroup = await atomicTransactionComposer.gatherSignatures();
    return adminSetAuctionHashAbiGroup.map(decodedSignedTransactionBuffer);
  }
}
