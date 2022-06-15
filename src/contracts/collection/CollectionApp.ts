import {
  Algodv2,
  SignedTransaction,
  TransactionSigner,
  TransactionWithSigner,
} from 'algosdk';
import { CollectionContract } from '../../_types';
import { StateSchema } from '../../_types/algorand-typeextender';
import { BaseContract } from '../../_types/base';
import { decodedSignedTransactionBuffer } from '../utils';
import collectionInterface from './CollectionInterface.json';

export class CollectionApp extends BaseContract implements CollectionContract {
  appID: number;

  constructor(appID: number = 0, client?: Algodv2) {
    super(
      collectionInterface,
      appID,
      new StateSchema(0, 1),
      new StateSchema(0, 2),
      client
    );
    this.appID = appID;
  }

  async makeAdminSetCollectionHashTransaction(
    signer: TransactionSigner,
    senderAddress: string,
    collectionHash: string
  ): Promise<SignedTransaction[]> {
    const suggestedParams = await this.getSuggested(1000);
    suggestedParams.flatFee = false;
    suggestedParams.fee = 0; //get txnfees

    this.atomicTransactionComposer.addMethodCall({
      appID: 0,
      method: this.getMethodByName('adminSetCollectionHash'),
      sender: senderAddress,
      methodArgs: [collectionHash],
      suggestedParams: suggestedParams,
      signer: signer,
    });

    const adminSetCollectionHashAbiGroup = await this.atomicTransactionComposer.gatherSignatures();
    return adminSetCollectionHashAbiGroup.map(decodedSignedTransactionBuffer);
  }

  async makeChangeAdminTransaction(
    signer: TransactionSigner,
    senderAddress: string,
    newAdminAddress: string
  ): Promise<SignedTransaction[]> {
    const suggestedParams = await this.getSuggested(1000);
    suggestedParams.flatFee = false;
    suggestedParams.fee = 0; //get txnfees

    this.atomicTransactionComposer.addMethodCall({
      appID: 0,
      method: this.getMethodByName('changeAdmin'),
      sender: senderAddress,
      methodArgs: [newAdminAddress],
      suggestedParams: suggestedParams,
      signer: signer,
    });

    const changeAdminAbiGroup = await this.atomicTransactionComposer.gatherSignatures();
    return changeAdminAbiGroup.map(decodedSignedTransactionBuffer);
  }

  async makeChangeEnforcerTransaction(
    signer: TransactionSigner,
    senderAddress: string,
    newEnforcer: string
  ): Promise<SignedTransaction[]> {
    const suggestedParams = await this.getSuggested(1000);
    suggestedParams.flatFee = false;
    suggestedParams.fee = 0; //get txnfees

    this.atomicTransactionComposer.addMethodCall({
      appID: 0,
      method: this.getMethodByName('changeEnforcer'),
      sender: senderAddress,
      methodArgs: [newEnforcer],
      suggestedParams: suggestedParams,
      signer: signer,
    });

    const changeEnforcerAbiGroup = await this.atomicTransactionComposer.gatherSignatures();
    return changeEnforcerAbiGroup.map(decodedSignedTransactionBuffer);
  }

  async makeCreateTransaction(
    signer: TransactionSigner,
    senderAddress: string,
    collectionDetails: [string, boolean],
    collectionName: string
  ): Promise<SignedTransaction[]> {
    const suggestedParams = await this.getSuggested(1000);
    suggestedParams.flatFee = false;
    suggestedParams.fee = 0; //get txnfees

    const createAssetManagerTransaction: TransactionWithSigner = undefined; //TODO add Transaction

    this.atomicTransactionComposer.addMethodCall({
      appID: 0,
      method: this.getMethodByName('create'),
      sender: senderAddress,
      methodArgs: [
        createAssetManagerTransaction,
        collectionDetails,
        collectionName,
      ],
      suggestedParams: suggestedParams,
      signer: signer,
    });

    const createAbiGroup = await this.atomicTransactionComposer.gatherSignatures();
    return createAbiGroup.map(decodedSignedTransactionBuffer);
  }

  async makeSwapinTransaction(
    signer: TransactionSigner,
    senderAddress: string,
    assetID: number
  ): Promise<SignedTransaction[]> {
    const suggestedParams = await this.getSuggested(1000);
    suggestedParams.flatFee = false;
    suggestedParams.fee = 0; //get txnfees

    this.atomicTransactionComposer.addMethodCall({
      appID: 0,
      method: this.getMethodByName('swapin'),
      sender: senderAddress,
      methodArgs: [assetID],
      suggestedParams: suggestedParams,
      signer: signer,
    });

    const swapinAbiGroup = await this.atomicTransactionComposer.gatherSignatures();
    return swapinAbiGroup.map(decodedSignedTransactionBuffer);
  }
}
