import {
  Account,
  Algodv2,
  AtomicTransactionComposer,
  getApplicationAddress,
  makeBasicAccountTransactionSigner,
  makePaymentTxnWithSuggestedParamsFromObject,
  SignedTransaction,
  TransactionWithSigner
} from 'algosdk';
import { SolidarityContract } from '../../_types';
import { StateSchema } from '../../_types/algorand-typeextender';
import { BaseContract } from '../../_types/base';
import solidarityInterface from './SolidarityInterface.json';
import {ALGORAND_ZERO_ADDRESS, decodedSignedTransactionBuffer} from "../utils";

export class SolidarityApp extends BaseContract implements SolidarityContract {
  constructor(appID: number = 0, client: Algodv2) {
    super(
      solidarityInterface,
      client,
      appID,
      new StateSchema(0, 1),
      new StateSchema(0, 2),
    );
    this.appID = appID;
  }

  async makeAddSolidarityForUserTransaction(
      signer: Account,
      solidaritySenderAddress: string,
      appName: string): Promise<SignedTransaction[]> {

    const atomicTransactionComposer = new AtomicTransactionComposer();
    const suggestedParams = await this.getSuggested(10);
    const transactionSigner = makeBasicAccountTransactionSigner(signer);

    suggestedParams.flatFee = false;
    suggestedParams.fee = 0; //get txnfees
    const royaltieMintColleteral = 100000;
    const taxPaymentTransaction: TransactionWithSigner = {
      txn: makePaymentTxnWithSuggestedParamsFromObject({
        from: signer.addr,
        to: getApplicationAddress(this.appID),
        amount: royaltieMintColleteral,
        suggestedParams,
        rekeyTo: ALGORAND_ZERO_ADDRESS
      }),
      signer: transactionSigner,
    };

    atomicTransactionComposer.addMethodCall({
      appID: 0,
      method: this.getMethodByName('addSolidarityForUser'),
      sender: signer.addr,
      methodArgs: [
          taxPaymentTransaction,
          solidaritySenderAddress,
          appName
      ],
      suggestedParams: suggestedParams,
      signer: transactionSigner,
    });

    const addSolidarityForUserAbiGroup = await atomicTransactionComposer.gatherSignatures();
    return addSolidarityForUserAbiGroup.map(decodedSignedTransactionBuffer);
  }

  async makeChangeIndividualSolidarityTransaction(
      signer: Account,
      solidarityAddress: string,
      basisPoints: number): Promise<SignedTransaction[]> {

    const atomicTransactionComposer = new AtomicTransactionComposer();
    const suggestedParams = await this.getSuggested(10);
    suggestedParams.flatFee = false;
    suggestedParams.fee = 0; //get txnfees

    atomicTransactionComposer.addMethodCall({
      appID: 0,
      method: this.getMethodByName('changeIndividualSolidarity'),
      sender: signer.addr,
      methodArgs: [
        solidarityAddress,
          basisPoints
      ],
      suggestedParams: suggestedParams,
      signer: makeBasicAccountTransactionSigner(signer),
    });

    const changeIndividualSolidarityAbiGroup = await atomicTransactionComposer.gatherSignatures();
    return changeIndividualSolidarityAbiGroup.map(decodedSignedTransactionBuffer);
  }

  async makeGetOfferCountTransaction(signer: Account, solidarityAddress: string): Promise<SignedTransaction[]> {
    const atomicTransactionComposer = new AtomicTransactionComposer();
    const suggestedParams = await this.getSuggested(10);
    suggestedParams.flatFee = false;
    suggestedParams.fee = 0; //get txnfees

    atomicTransactionComposer.addMethodCall({
      appID: 0,
      method: this.getMethodByName('getOfferCount'),
      sender: signer.addr,
      methodArgs: [
        solidarityAddress
      ],
      suggestedParams: suggestedParams,
      signer: makeBasicAccountTransactionSigner(signer),
    });

    const getOfferCountAbiGroup = await atomicTransactionComposer.gatherSignatures();
    return getOfferCountAbiGroup.map(decodedSignedTransactionBuffer);
  }

  async makeRaiseCollectionCountTransaction(signer: Account, solidarityAddress: string): Promise<SignedTransaction[]> {
    const atomicTransactionComposer = new AtomicTransactionComposer();
    const suggestedParams = await this.getSuggested(10);
    suggestedParams.flatFee = false;
    suggestedParams.fee = 0; //get txnfees

    atomicTransactionComposer.addMethodCall({
      appID: 0,
      method: this.getMethodByName('raiseCollectionCount'),
      sender: signer.addr,
      methodArgs: [
        solidarityAddress
      ],
      suggestedParams: suggestedParams,
      signer: makeBasicAccountTransactionSigner(signer),
    });

    const raiseCollectionCountAbiGroup = await atomicTransactionComposer.gatherSignatures();
    return raiseCollectionCountAbiGroup.map(decodedSignedTransactionBuffer);
  }

  async makeRaiseOfferCountTransaction(signer: Account, solidarityAddress: string): Promise<SignedTransaction[]> {
    const atomicTransactionComposer = new AtomicTransactionComposer();
    const suggestedParams = await this.getSuggested(10);
    suggestedParams.flatFee = false;
    suggestedParams.fee = 0; //get txnfees

    atomicTransactionComposer.addMethodCall({
      appID: 0,
      method: this.getMethodByName('raiseOfferCount'),
      sender: signer.addr,
      methodArgs: [
        solidarityAddress
      ],
      suggestedParams: suggestedParams,
      signer: makeBasicAccountTransactionSigner(signer),
    });

    const raiseOfferCountAbiGroup = await atomicTransactionComposer.gatherSignatures();
    return raiseOfferCountAbiGroup.map(decodedSignedTransactionBuffer);
  }

}
