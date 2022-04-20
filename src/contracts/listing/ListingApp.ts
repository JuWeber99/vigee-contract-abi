import {
  Account,
  Algodv2,
  AtomicTransactionComposer, getApplicationAddress, makeBasicAccountTransactionSigner,
  makePaymentTxnWithSuggestedParamsFromObject, SignedTransaction,
  TransactionWithSigner
} from 'algosdk';
import { ListingContract } from '../../_types';
import { BaseContract } from '../../_types/base';
import listingInterface from './ListingInterface.json';
import {StateSchema} from "../../_types/algorand-typeextender";
import {ALGORAND_ZERO_ADDRESS_STRING} from "algosdk/dist/types/src/encoding/address";
import {decodedSignedTransactionBuffer} from "../utils";

export class ListingApp extends BaseContract implements ListingContract {
  appID: number;
  constructor(appID: number = 0, client: Algodv2) {
    super(
      listingInterface,
      client,
      appID,
      new StateSchema(0, 1),
      new StateSchema(0, 2)
    );
    this.appID = appID
  }

  async makeAddOfferedAssetTransaction(
      signer: Account,
      platformCall: TransactionWithSigner,
      offerAsset: number,
      royaltieEnforcerAddress: string): Promise<SignedTransaction[]> {
    const atomicTransactionComposer = new AtomicTransactionComposer();
    const suggestedParams = await this.getSuggested(10);
    suggestedParams.flatFee = false;
    suggestedParams.fee = 0; //get txnfees

    atomicTransactionComposer.addMethodCall({
      appID: 0,
      method: this.getMethodByName('addOfferedAsset'),
      sender: signer.addr,
      methodArgs: [
        platformCall,
        offerAsset,
        royaltieEnforcerAddress
      ],
      suggestedParams: suggestedParams,
      signer: makeBasicAccountTransactionSigner(signer),
    });

    const addOfferedAssetAbiGroup = await atomicTransactionComposer.gatherSignatures();
    return addOfferedAssetAbiGroup.map(decodedSignedTransactionBuffer);
  }

  async makeChangeBundleStateTransaction(signer: Account, isBundleState: boolean): Promise<SignedTransaction[]> {
    const atomicTransactionComposer = new AtomicTransactionComposer();
    const suggestedParams = await this.getSuggested(10);
    suggestedParams.flatFee = false;
    suggestedParams.fee = 0; //get txnfees

    atomicTransactionComposer.addMethodCall({
      appID: 0,
      method: this.getMethodByName('changeBundleState'),
      sender: signer.addr,
      methodArgs: [
        isBundleState
      ],
      suggestedParams: suggestedParams,
      signer: makeBasicAccountTransactionSigner(signer),
    });

    const changeBundleStateAbiGroup = await atomicTransactionComposer.gatherSignatures();
    return changeBundleStateAbiGroup.map(decodedSignedTransactionBuffer);
  }

  async makeCreateListingTransaction(
      signer: Account,
      isNegotiatable: boolean,
      sellerAccountAddress: string): Promise<SignedTransaction[]> {
    const atomicTransactionComposer = new AtomicTransactionComposer();
    const suggestedParams = await this.getSuggested(10);
    suggestedParams.flatFee = false;
    suggestedParams.fee = 0; //get txnfees

    atomicTransactionComposer.addMethodCall({
      appID: 0,
      method: this.getMethodByName('createListing'),
      sender: signer.addr,
      methodArgs: [
        isNegotiatable,
        sellerAccountAddress
      ],
      suggestedParams: suggestedParams,
      signer: makeBasicAccountTransactionSigner(signer),
    });

    const createListingAbiGroup = await atomicTransactionComposer.gatherSignatures();
    return createListingAbiGroup.map(decodedSignedTransactionBuffer);
  }

  async makeProposeAlternativePriceTransaction(signer: Account, proposedPrice: number): Promise<SignedTransaction[]> {
    const atomicTransactionComposer = new AtomicTransactionComposer();
    const suggestedParams = await this.getSuggested(10);
    suggestedParams.flatFee = false;
    suggestedParams.fee = 0; //get txnfees

    atomicTransactionComposer.addMethodCall({
      appID: 0,
      method: this.getMethodByName('proposeAlternativePrice'),
      sender: signer.addr,
      methodArgs: [
        proposedPrice
      ],
      suggestedParams: suggestedParams,
      signer: makeBasicAccountTransactionSigner(signer),
    });

    const proposeAlternativePriceAbiGroup = await atomicTransactionComposer.gatherSignatures();
    return proposeAlternativePriceAbiGroup.map(decodedSignedTransactionBuffer);
  }

  async makePurchaseListingBundledTransaction(
      signer: Account,
      sellerAccountAddress: string,
      buyerAccountAddress: string,
      royaltieEnforcerAddress: string,
      offeredAssets: number): Promise<SignedTransaction[]> {
    const atomicTransactionComposer = new AtomicTransactionComposer();
    const suggestedParams = await this.getSuggested(10);
    suggestedParams.flatFee = false;
    suggestedParams.fee = 0; //get txnfees

    const purchaseListingColleteral = 100000 + 64 * 50000;
    const taxPaymentTransaction: TransactionWithSigner = {
      txn: makePaymentTxnWithSuggestedParamsFromObject({
        from: signer.addr,
        to: getApplicationAddress(this.appID),
        amount: purchaseListingColleteral,
        suggestedParams,
        rekeyTo: ALGORAND_ZERO_ADDRESS_STRING,
      }),
      signer: makeBasicAccountTransactionSigner(signer),
    };

    atomicTransactionComposer.addMethodCall({
      appID: 0,
      method: this.getMethodByName('purchaseListingBundled'),
      sender: signer.addr,
      methodArgs: [
        taxPaymentTransaction,
        sellerAccountAddress,
        buyerAccountAddress,
        royaltieEnforcerAddress,
        offeredAssets
      ],
      suggestedParams: suggestedParams,
      signer: makeBasicAccountTransactionSigner(signer),
    });

    const purchaseListingBundledAbiGroup = await atomicTransactionComposer.gatherSignatures();
    return purchaseListingBundledAbiGroup.map(decodedSignedTransactionBuffer);
  }

  async makePurchaseListingUnbundledTransaction(
      signer: Account,
      sellerAccountAddress: string,
      buyerAccountAddress: string,
      royaltieEnforcerAddress: string,
      offeredAsset: number): Promise<SignedTransaction[]> {
    const atomicTransactionComposer = new AtomicTransactionComposer();
    const suggestedParams = await this.getSuggested(10);
    suggestedParams.flatFee = false;
    suggestedParams.fee = 0; //get txnfees

    const purchaseListingColleteral = 100000 + 64 * 50000;
    const taxPaymentTransaction: TransactionWithSigner = {
    txn: makePaymentTxnWithSuggestedParamsFromObject({
      from: signer.addr,
      to: getApplicationAddress(this.appID),
      amount: purchaseListingColleteral,
      suggestedParams,
      rekeyTo: ALGORAND_ZERO_ADDRESS_STRING,
    }),
    signer: makeBasicAccountTransactionSigner(signer),
    };

    atomicTransactionComposer.addMethodCall({
      appID: 0,
      method: this.getMethodByName('purchaseListingUnbundled'),
      sender: signer.addr,
      methodArgs: [
        taxPaymentTransaction,
        sellerAccountAddress,
        buyerAccountAddress,
        royaltieEnforcerAddress,
        offeredAsset
      ],
      suggestedParams: suggestedParams,
      signer: makeBasicAccountTransactionSigner(signer),
    });

    const purchaseListingUnbundledAbiGroup = await atomicTransactionComposer.gatherSignatures();
    return purchaseListingUnbundledAbiGroup.map(decodedSignedTransactionBuffer);
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

  async makeSetSellerTransaction(signer: Account, platformCall: TransactionWithSigner, sellerAccountAddress: number): Promise<SignedTransaction[]> {
    const atomicTransactionComposer = new AtomicTransactionComposer();
    const suggestedParams = await this.getSuggested(10);
    suggestedParams.flatFee = false;
    suggestedParams.fee = 0; //get txnfees

    atomicTransactionComposer.addMethodCall({
      appID: 0,
      method: this.getMethodByName('setSeller'),
      sender: signer.addr,
      methodArgs: [
        platformCall,
        sellerAccountAddress
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

  async makeAdminSetListingHashTransaction(signer: Account, listingHash: string): Promise<SignedTransaction[]> {
    const atomicTransactionComposer = new AtomicTransactionComposer();
    const suggestedParams = await this.getSuggested(10);
    suggestedParams.flatFee = false;
    suggestedParams.fee = 0; //get txnfees

    atomicTransactionComposer.addMethodCall({
      appID: 0,
      method: this.getMethodByName('adminSetListingHash'),
      sender: signer.addr,
      methodArgs: [
        listingHash
      ],
      suggestedParams: suggestedParams,
      signer: makeBasicAccountTransactionSigner(signer),
    });

    const adminSetListingHashAbiGroup = await atomicTransactionComposer.gatherSignatures();
    return adminSetListingHashAbiGroup.map(decodedSignedTransactionBuffer);
  }
}
