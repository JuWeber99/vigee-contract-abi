import {
  TransactionSigner,
  Algodv2,
  getApplicationAddress,
  makePaymentTxnWithSuggestedParamsFromObject,
  SignedTransaction,
  TransactionWithSigner,
} from 'algosdk';
import { ListingContract } from '../../_types';
import { StateSchema } from '../../_types/algorand-typeextender';
import { BaseContract } from '../../_types/base';
import {
  ALGORAND_ZERO_ADDRESS,
  decodedSignedTransactionBuffer,
} from '../utils';
import listingInterface from './ListingInterface.json';

export class ListingApp extends BaseContract implements ListingContract {
  appID: number;
  constructor(appID: number = 0, client?: Algodv2) {
    super(
      listingInterface,
      appID,
      new StateSchema(0, 1),
      new StateSchema(3, 3),
      client
    );
    this.appID = appID;
  }

  async makeAddOfferedAssetTransaction(
    signer: TransactionSigner,
    senderAddress: string,
    platformCall: TransactionWithSigner,
    offerAsset: number,
    royaltieEnforcerAddress: string
  ): Promise<SignedTransaction[]> {
    const suggestedParams = await this.getSuggested(1000);
    // suggestedParams.flatFee = false
    // suggestedParams.fee = 0 //get txnfees

    this.atomicTransactionComposer.addMethodCall({
      appID: 0,
      method: this.getMethodByName('addOfferedAsset'),
      sender: senderAddress,
      methodArgs: [platformCall, offerAsset, royaltieEnforcerAddress],
      suggestedParams: suggestedParams,
      signer: signer,
    });

    const addOfferedAssetAbiGroup = await this.atomicTransactionComposer.gatherSignatures();
    return addOfferedAssetAbiGroup.map(decodedSignedTransactionBuffer);
  }

  async makeChangeBundleStateTransaction(
    signer: TransactionSigner,
    senderAddress: string,
    isBundleState: boolean
  ): Promise<SignedTransaction[]> {
    const suggestedParams = await this.getSuggested(1000);
    suggestedParams.flatFee = false;
    suggestedParams.fee = 0; //get txnfees

    this.atomicTransactionComposer.addMethodCall({
      appID: 0,
      method: this.getMethodByName('changeBundleState'),
      sender: senderAddress,
      methodArgs: [isBundleState],
      suggestedParams: suggestedParams,
      signer: signer,
    });

    const changeBundleStateAbiGroup = await this.atomicTransactionComposer.gatherSignatures();
    return changeBundleStateAbiGroup.map(decodedSignedTransactionBuffer);
  }

  async makeCreateListingTransaction(
    signer: TransactionSigner,
    senderAddress: string,
    isNegotiatable: boolean,
    sellerAccountAddress: string
  ): Promise<SignedTransaction[]> {
    const suggestedParams = await this.getSuggested(1000);
    suggestedParams.flatFee = false;
    suggestedParams.fee = 0; //get txnfees

    this.atomicTransactionComposer.addMethodCall({
      appID: 0,
      method: this.getMethodByName('createListing'),
      sender: senderAddress,
      methodArgs: [isNegotiatable, sellerAccountAddress],
      suggestedParams: suggestedParams,
      signer: signer,
    });

    const createListingAbiGroup = await this.atomicTransactionComposer.gatherSignatures();
    return createListingAbiGroup.map(decodedSignedTransactionBuffer);
  }

  async makeProposeAlternativePriceTransaction(
    signer: TransactionSigner,
    senderAddress: string,
    proposedPrice: number
  ): Promise<SignedTransaction[]> {
    const suggestedParams = await this.getSuggested(1000);
    suggestedParams.flatFee = false;
    suggestedParams.fee = 0; //get txnfees

    this.atomicTransactionComposer.addMethodCall({
      appID: 0,
      method: this.getMethodByName('proposeAlternativePrice'),
      sender: senderAddress,
      methodArgs: [proposedPrice],
      suggestedParams: suggestedParams,
      signer: signer,
    });

    const proposeAlternativePriceAbiGroup = await this.atomicTransactionComposer.gatherSignatures();
    return proposeAlternativePriceAbiGroup.map(decodedSignedTransactionBuffer);
  }

  async makePurchaseListingBundledTransaction(
    signer: TransactionSigner,
    senderAddress: string,
    sellerAccountAddress: string,
    buyerAccountAddress: string,
    royaltieEnforcerAddress: string,
    offeredAssets: number
  ): Promise<SignedTransaction[]> {
    const suggestedParams = await this.getSuggested(1000);
    suggestedParams.flatFee = false;
    suggestedParams.fee = 0; //get txnfees

    const purchaseListingColleteral = 100000 + 64 * 50000;
    const taxPaymentTransaction: TransactionWithSigner = {
      txn: makePaymentTxnWithSuggestedParamsFromObject({
        from: senderAddress,
        to: getApplicationAddress(this.appID),
        amount: purchaseListingColleteral,
        suggestedParams,
        rekeyTo: ALGORAND_ZERO_ADDRESS,
      }),
      signer: signer,
    };

    this.atomicTransactionComposer.addMethodCall({
      appID: 0,
      method: this.getMethodByName('purchaseListingBundled'),
      sender: senderAddress,
      methodArgs: [
        taxPaymentTransaction,
        sellerAccountAddress,
        buyerAccountAddress,
        royaltieEnforcerAddress,
        offeredAssets,
      ],
      suggestedParams: suggestedParams,
      signer: signer,
    });

    const purchaseListingBundledAbiGroup = await this.atomicTransactionComposer.gatherSignatures();
    return purchaseListingBundledAbiGroup.map(decodedSignedTransactionBuffer);
  }

  async makePurchaseListingUnbundledTransaction(
    signer: TransactionSigner,
    senderAddress: string,
    sellerAccountAddress: string,
    buyerAccountAddress: string,
    royaltieEnforcerAddress: string,
    offeredAsset: number
  ): Promise<SignedTransaction[]> {
    const suggestedParams = await this.getSuggested(1000);
    suggestedParams.flatFee = false;
    suggestedParams.fee = 0; //get txnfees

    const purchaseListingColleteral = 100000 + 64 * 50000;
    const taxPaymentTransaction: TransactionWithSigner = {
      txn: makePaymentTxnWithSuggestedParamsFromObject({
        from: senderAddress,
        to: getApplicationAddress(this.appID),
        amount: purchaseListingColleteral,
        suggestedParams,
        rekeyTo: ALGORAND_ZERO_ADDRESS,
      }),
      signer: signer,
    };

    this.atomicTransactionComposer.addMethodCall({
      appID: 0,
      method: this.getMethodByName('purchaseListingUnbundled'),
      sender: senderAddress,
      methodArgs: [
        taxPaymentTransaction,
        sellerAccountAddress,
        buyerAccountAddress,
        royaltieEnforcerAddress,
        offeredAsset,
      ],
      suggestedParams: suggestedParams,
      signer: signer,
    });

    const purchaseListingUnbundledAbiGroup = await this.atomicTransactionComposer.gatherSignatures();
    return purchaseListingUnbundledAbiGroup.map(decodedSignedTransactionBuffer);
  }

  async makeSetFloorPriceTransaction(
    signer: TransactionSigner,
    senderAddress: string,
    floorPrice: number
  ): Promise<SignedTransaction[]> {
    const suggestedParams = await this.getSuggested(1000);
    suggestedParams.flatFee = false;
    suggestedParams.fee = 0; //get txnfees

    this.atomicTransactionComposer.addMethodCall({
      appID: 0,
      method: this.getMethodByName('setFloorPrice'),
      sender: senderAddress,
      methodArgs: [floorPrice],
      suggestedParams: suggestedParams,
      signer: signer,
    });

    const setFloorPriceAbiGroup = await this.atomicTransactionComposer.gatherSignatures();
    return setFloorPriceAbiGroup.map(decodedSignedTransactionBuffer);
  }

  async makeSetSellerTransaction(
    signer: TransactionSigner,
    senderAddress: string,
    platformCall: TransactionWithSigner,
    sellerAccountAddress: number
  ): Promise<SignedTransaction[]> {
    const suggestedParams = await this.getSuggested(1000);
    suggestedParams.flatFee = false;
    suggestedParams.fee = 0; //get txnfees

    this.atomicTransactionComposer.addMethodCall({
      appID: 0,
      method: this.getMethodByName('setSeller'),
      sender: senderAddress,
      methodArgs: [platformCall, sellerAccountAddress],
      suggestedParams: suggestedParams,
      signer: signer,
    });

    const setSellerAbiGroup = await this.atomicTransactionComposer.gatherSignatures();
    return setSellerAbiGroup.map(decodedSignedTransactionBuffer);
  }

  async makeSetStartRoundTransaction(
    signer: TransactionSigner,
    senderAddress: string,
    startRound: number
  ): Promise<SignedTransaction[]> {
    const suggestedParams = await this.getSuggested(1000);
    suggestedParams.flatFee = false;
    suggestedParams.fee = 0; //get txnfees

    this.atomicTransactionComposer.addMethodCall({
      appID: 0,
      method: this.getMethodByName('setStartRound'),
      sender: senderAddress,
      methodArgs: [startRound],
      suggestedParams: suggestedParams,
      signer: signer,
    });

    const setStartRoundAbiGroup = await this.atomicTransactionComposer.gatherSignatures();
    return setStartRoundAbiGroup.map(decodedSignedTransactionBuffer);
  }

  async makeAdminSetListingHashTransaction(
    signer: TransactionSigner,
    senderAddress: string,
    listingHash: string
  ): Promise<SignedTransaction[]> {
    const suggestedParams = await this.getSuggested(1000);
    suggestedParams.flatFee = false;
    suggestedParams.fee = 0; //get txnfees

    this.atomicTransactionComposer.addMethodCall({
      appID: 0,
      method: this.getMethodByName('adminSetListingHash'),
      sender: senderAddress,
      methodArgs: [listingHash],
      suggestedParams: suggestedParams,
      signer: signer,
    });

    const adminSetListingHashAbiGroup = await this.atomicTransactionComposer.gatherSignatures();
    return adminSetListingHashAbiGroup.map(decodedSignedTransactionBuffer);
  }
}
