import {
  Account,
  Algodv2,
  AtomicTransactionComposer,
  makeBasicAccountTransactionSigner,
  SignedTransaction,
  TransactionWithSigner
} from 'algosdk';
import { CollectionContract } from '../../_types';
import { BaseContract } from '../../_types/base';
import collectionInterface from './CollectionInterface.json';
import {StateSchema} from "../../_types/algorand-typeextender";
import {decodedSignedTransactionBuffer} from "../utils";

export class CollectionApp extends BaseContract implements CollectionContract {
  appID: number;

  constructor(appID: number = 0, client: Algodv2) {
    super(
      collectionInterface,
      client,
      appID,
      new StateSchema(0, 1),
      new StateSchema(0, 2)
    );
    this.appID = appID
  }

  async makeAdminSetCollectionHashTransaction(signer: Account, collectionHash: string): Promise<SignedTransaction[]> {
    const atomicTransactionComposer = new AtomicTransactionComposer();
    const suggestedParams = await this.getSuggested(10);
    suggestedParams.flatFee = false;
    suggestedParams.fee = 0; //get txnfees

    atomicTransactionComposer.addMethodCall({
      appID: 0,
      method: this.getMethodByName('adminSetCollectionHash'),
      sender: signer.addr,
      methodArgs: [
        collectionHash
      ],
      suggestedParams: suggestedParams,
      signer: makeBasicAccountTransactionSigner(signer),
    });

    const adminSetCollectionHashAbiGroup = await atomicTransactionComposer.gatherSignatures();
    return adminSetCollectionHashAbiGroup.map(decodedSignedTransactionBuffer);
  }

  async makeChangeAdminTransaction(signer: Account, newAdminAddress: string): Promise<SignedTransaction[]> {
    const atomicTransactionComposer = new AtomicTransactionComposer();
    const suggestedParams = await this.getSuggested(10);
    suggestedParams.flatFee = false;
    suggestedParams.fee = 0; //get txnfees

    atomicTransactionComposer.addMethodCall({
      appID: 0,
      method: this.getMethodByName('changeAdmin'),
      sender: signer.addr,
      methodArgs: [
        newAdminAddress
      ],
      suggestedParams: suggestedParams,
      signer: makeBasicAccountTransactionSigner(signer),
    });

    const changeAdminAbiGroup = await atomicTransactionComposer.gatherSignatures();
    return changeAdminAbiGroup.map(decodedSignedTransactionBuffer);
  }

  async makeChangeEnforcerTransaction(signer: Account, newEnforcer: string): Promise<SignedTransaction[]> {
    const atomicTransactionComposer = new AtomicTransactionComposer();
    const suggestedParams = await this.getSuggested(10);
    suggestedParams.flatFee = false;
    suggestedParams.fee = 0; //get txnfees

    atomicTransactionComposer.addMethodCall({
      appID: 0,
      method: this.getMethodByName('changeEnforcer'),
      sender: signer.addr,
      methodArgs: [
        newEnforcer
      ],
      suggestedParams: suggestedParams,
      signer: makeBasicAccountTransactionSigner(signer),
    });

    const changeEnforcerAbiGroup = await atomicTransactionComposer.gatherSignatures();
    return changeEnforcerAbiGroup.map(decodedSignedTransactionBuffer);
  }

  async makeCreateTransaction(signer: Account, collectionDetails: [string, boolean], collectionName: string): Promise<SignedTransaction[]> {
    const atomicTransactionComposer = new AtomicTransactionComposer();
    const suggestedParams = await this.getSuggested(10);
    suggestedParams.flatFee = false;
    suggestedParams.fee = 0; //get txnfees

    const createAssetManagerTransaction: TransactionWithSigner = undefined //TODO add Transaction

    atomicTransactionComposer.addMethodCall({
      appID: 0,
      method: this.getMethodByName('create'),
      sender: signer.addr,
      methodArgs: [
        createAssetManagerTransaction,
          collectionDetails,
          collectionName
      ],
      suggestedParams: suggestedParams,
      signer: makeBasicAccountTransactionSigner(signer),
    });

    const createAbiGroup = await atomicTransactionComposer.gatherSignatures();
    return createAbiGroup.map(decodedSignedTransactionBuffer);
  }

  async makeSwapinTransaction(signer: Account, assetID: number): Promise<SignedTransaction[]> {
    const atomicTransactionComposer = new AtomicTransactionComposer();
    const suggestedParams = await this.getSuggested(10);
    suggestedParams.flatFee = false;
    suggestedParams.fee = 0; //get txnfees

    atomicTransactionComposer.addMethodCall({
      appID: 0,
      method: this.getMethodByName('swapin'),
      sender: signer.addr,
      methodArgs: [
        assetID
      ],
      suggestedParams: suggestedParams,
      signer: makeBasicAccountTransactionSigner(signer),
    });

    const swapinAbiGroup = await atomicTransactionComposer.gatherSignatures();
    return swapinAbiGroup.map(decodedSignedTransactionBuffer);
  }
}
