import algosdk, {
  Algodv2,
  AtomicTransactionComposer,
  getApplicationAddress, makePaymentTxnWithSuggestedParamsFromObject, TransactionSigner, TransactionWithSigner
} from 'algosdk'
import { SolidarityContract } from '../../_types'
import { StateSchema } from '../../_types/algorand-typeextender'
import { BaseContract } from '../../_types/base'
import { ALGORAND_ZERO_ADDRESS } from "../utils"
import { solidarityB64, solidarityClearB64 } from './solidarityConstant'
import solidarityInterface from './SolidarityInterface.json'

export class SolidarityApp extends BaseContract implements SolidarityContract {
  constructor(client: Algodv2, appID: number = 0) {
    super(
      solidarityInterface,
      client,
      appID,
      new StateSchema(5, 0),
      new StateSchema(5, 4),
      solidarityB64,
      solidarityClearB64
    )
  }


  async makeCreateTransaction(signer: TransactionSigner, senderAddress: string): Promise<AtomicTransactionComposer> {

    const suggestedParams = await this.getSuggested(10)
    this.atomicTransactionComposer.addMethodCall({
      appID: 0,
      method: this.getMethodByName("create"),
      methodArgs: [],
      approvalProgram: new Uint8Array(
        Buffer.from(await SolidarityApp.getCompiledProgram(this.approvalTemplate, SolidarityApp.client), "base64")
      ),
      clearProgram: new Uint8Array(
        Buffer.from(await SolidarityApp.getCompiledProgram(this.clearTemplate, SolidarityApp.client), "base64")
      ),
      onComplete: algosdk.OnApplicationComplete.NoOpOC,
      signer: signer,
      sender: senderAddress,
      suggestedParams: suggestedParams,
      numLocalInts: this.localSchema.numUint as number,
      numLocalByteSlices: this.localSchema.numByteSlice as number,
      numGlobalInts: this.globalSchema.numUint as number,
      numGlobalByteSlices: this.globalSchema.numByteSlice as number
    })
    // this.atomicTransactionComposer.addTransaction({ txn: appCreateTxn, signer: signer })
    return this.atomicTransactionComposer
  }

  async makeInitiateApplicationTransaction(signer: TransactionSigner, senderAddress: string): Promise<algosdk.AtomicTransactionComposer> {

    const suggestedParams = await this.getSuggested(10)
    suggestedParams.flatFee = false
    suggestedParams.fee = 3000 //get txnfees

    this.atomicTransactionComposer.addMethodCall({
      appID: this.appID,
      method: this.getMethodByName('initiatePlatform'),
      sender: senderAddress,
      methodArgs: [],
      suggestedParams: suggestedParams,
      signer: signer
    })

    return this.atomicTransactionComposer
  }

  async makeAddSolidarityForUserTransaction(
    signer: TransactionSigner,
    senderAddress: string,
    solidaritySenderAddress: string,
    appName: string): Promise<AtomicTransactionComposer> {


    const suggestedParams = await this.getSuggested(10)

    // suggestedParams.flatFee = false;
    // suggestedParams.fee = 0; //get txnfees
    const royaltieMintColleteral = 100000
    const taxPaymentTransaction: TransactionWithSigner = {
      txn: makePaymentTxnWithSuggestedParamsFromObject({
        from: senderAddress,
        to: getApplicationAddress(this.appID),
        amount: royaltieMintColleteral,
        suggestedParams,
        rekeyTo: ALGORAND_ZERO_ADDRESS
      }),
      signer: signer,
    }

    this.atomicTransactionComposer.addMethodCall({
      appID: this.appID,
      method: this.getMethodByName('addSolidarityForUser'),
      sender: senderAddress,
      methodArgs: [
        taxPaymentTransaction,
        solidaritySenderAddress,
        appName
      ],
      suggestedParams: suggestedParams,
      signer: signer,
    })

    return this.atomicTransactionComposer
  }

  async makeChangeIndividualSolidarityTransaction(
    signer: TransactionSigner, senderAddress: string,
    userAccount: string,
    basisPoints: number): Promise<AtomicTransactionComposer> {


    const suggestedParams = await this.getSuggested(10)
    // suggestedParams.flatFee = false;
    // suggestedParams.fee = 0; //get txnfees

    this.atomicTransactionComposer.addMethodCall({
      appID: this.appID,
      method: this.getMethodByName('changeIndividualSolidarity'),
      sender: senderAddress,
      methodArgs: [
        userAccount,
        basisPoints
      ],
      suggestedParams: suggestedParams,
      signer: signer
    })

    return this.atomicTransactionComposer
    // return changeIndividualSolidarityAbiGroup.map(decodedSignedTransactionBuffer);
  }

  async makeGetOfferCountTransaction(signer: TransactionSigner, senderAddress: string, userAccount: string): Promise<AtomicTransactionComposer> {

    const suggestedParams = await this.getSuggested(10)
    // suggestedParams.flatFee = false;
    // suggestedParams.fee = 0; //get txnfees

    this.atomicTransactionComposer.addMethodCall({
      appID: this.appID,
      method: this.getMethodByName('getOfferCount'),
      sender: senderAddress,
      methodArgs: [
        userAccount
      ],
      suggestedParams: suggestedParams,
      signer: signer,
    })

    return this.atomicTransactionComposer
  }

  async makeRaiseCollectionCountTransaction(signer: TransactionSigner, senderAddress: string, solidarityAddress: string): Promise<AtomicTransactionComposer> {

    const suggestedParams = await this.getSuggested(10)
    // suggestedParams.flatFee = false;
    // suggestedParams.fee = 0; //get txnfees

    this.atomicTransactionComposer.addMethodCall({
      appID: this.appID,
      method: this.getMethodByName('raiseCollectionCount'),
      sender: senderAddress,
      methodArgs: [
        solidarityAddress
      ],
      suggestedParams: suggestedParams,
      signer: signer,
    })

    return this.atomicTransactionComposer
  }

  async makeRaiseOfferCountTransaction(signer: TransactionSigner, senderAddress: string, userAccount: string): Promise<AtomicTransactionComposer> {

    const suggestedParams = await this.getSuggested(10)
    // suggestedParams.flatFee = false;
    // suggestedParams.fee = 0; //get txnfees

    this.atomicTransactionComposer.addMethodCall({
      appID: this.appID,
      method: this.getMethodByName('raiseOfferCount'),
      sender: senderAddress,
      methodArgs: [
        userAccount
      ],
      suggestedParams: suggestedParams,
      signer: signer,
    })

    return this.atomicTransactionComposer
  }

}
