
import algosdk, { Account, Algodv2, AtomicTransactionComposer, getApplicationAddress, makeAssetConfigTxnWithSuggestedParamsFromObject, makeAssetCreateTxnWithSuggestedParamsFromObject, makeBasicAccountTransactionSigner, makePaymentTxnWithSuggestedParamsFromObject, SignedTransaction, TransactionWithSigner } from "algosdk"
import { ApplicationStateSchema } from "algosdk/dist/types/src/client/v2/algod/models/types"
import { ALGORAND_ZERO_ADDRESS_STRING } from "algosdk/dist/types/src/encoding/address"
import { RoyaltieContract } from "../../_types"
import { BaseContract, ContractProgramCompilationContext, PROGRAM_TYPE } from "../../_types/base"
import { decodedSignedTransactionBuffer } from "../utils"
import royaltieInterface from "./RoyaltieInterface.json"

export class RoyaltieApp extends BaseContract implements RoyaltieContract {
  appID: number
  constructor(appID = 0, client: Algodv2) {
    super(
      royaltieInterface,
      client,
      new ApplicationStateSchema(0, 1),
      new ApplicationStateSchema(0, 2),
    )
    this.appID = appID
  }


  async setup(
    signer: algosdk.Account,
    defaultRoyaltieReceiverAddress: string,
    defaultRoyaltieShareAddress: string,
    approvalCompilationContext: ContractProgramCompilationContext,
    clearCompilationContext: ContractProgramCompilationContext
  ): Promise<SignedTransaction[]> {

    const atomicTransactionComposer = new AtomicTransactionComposer()
    const suggestedParams = await this.getSuggested(10)
    suggestedParams.flatFee = false
    suggestedParams.fee = 0 //get txnfees

    const royaltieSetupColleteral = (100000 + (64 * 50000))
    const taxPaymentTransaction: TransactionWithSigner =
    {
      txn: makePaymentTxnWithSuggestedParamsFromObject(
        {
          from: signer.addr,
          to: getApplicationAddress(this.appID),
          amount: royaltieSetupColleteral,
          suggestedParams,
          rekeyTo: ALGORAND_ZERO_ADDRESS_STRING
        }),
      signer: makeBasicAccountTransactionSigner(signer)
    }

    atomicTransactionComposer.addMethodCall({
      appID: 0,
      method: this.getMethodByName('setup'),
      sender: signer.addr,
      approvalProgram: await this.getCompiledProgram(approvalCompilationContext, PROGRAM_TYPE.APPROVAL),
      clearProgram: await this.getCompiledProgram(clearCompilationContext, PROGRAM_TYPE.CLEAR),
      methodArgs: [
        taxPaymentTransaction,
        defaultRoyaltieReceiverAddress,
        defaultRoyaltieShareAddress
      ],
      suggestedParams: suggestedParams,
      numLocalByteSlices: this.localSchema.numByteSlice as number,
      numLocalInts: this.localSchema.numUint as number,
      numGlobalByteSlices: this.globalSchema.numByteSlice as number,
      numGlobalInts: this.globalSchema.numUint as number,
      signer: makeBasicAccountTransactionSigner(signer),
    })

    const setupAbiGroup = await atomicTransactionComposer.gatherSignatures()
    return setupAbiGroup.map(decodedSignedTransactionBuffer)
  }

  async createNFT(signer: algosdk.Account, assetData: any): Promise<SignedTransaction[]> {
    const atomicTransactionComposer = new AtomicTransactionComposer()
    const suggestedParams = await this.getSuggested(10)
    const transactionSigner = makeBasicAccountTransactionSigner(signer)

    suggestedParams.flatFee = false
    suggestedParams.fee = 0 //get txnfees
    const royaltieMintColleteral = (100000)
    const taxPaymentTransaction: TransactionWithSigner =
    {
      txn: makePaymentTxnWithSuggestedParamsFromObject(
        {
          from: signer.addr,
          to: getApplicationAddress(this.appID),
          amount: royaltieMintColleteral,
          suggestedParams,
          rekeyTo: ALGORAND_ZERO_ADDRESS_STRING
        }),
      signer: transactionSigner
    }

    const assetCreateTransaction =
    {
      txn: makeAssetCreateTxnWithSuggestedParamsFromObject(
        {
          from: signer.addr,
          to: getApplicationAddress(this.appID),
          suggestedParams,
          ...assetData
        }
      ),
      signer: transactionSigner
    }

    atomicTransactionComposer.addMethodCall({
      appID: 0,
      method: this.getMethodByName('createNFT'),
      sender: signer.addr,
      methodArgs: [
        taxPaymentTransaction,
        assetCreateTransaction
      ],
      suggestedParams: suggestedParams,
      signer: transactionSigner
    })

    const createNFTAbiGroup = await atomicTransactionComposer.gatherSignatures()
    return createNFTAbiGroup.map(decodedSignedTransactionBuffer)
  }

  async swapinNFT(signer: algosdk.Account, assetID: number): Promise<SignedTransaction[]> {
    const atomicTransactionComposer = new AtomicTransactionComposer()
    const suggestedParams = await this.getSuggested(10)

    const transactionSigner = makeBasicAccountTransactionSigner(signer)

    suggestedParams.flatFee = false
    suggestedParams.fee = 0 //get txnfees
    const royaltieSetupColleteral = (100000)
    const taxPaymentTransaction: TransactionWithSigner =
    {
      txn: makePaymentTxnWithSuggestedParamsFromObject(
        {
          from: signer.addr,
          to: getApplicationAddress(this.appID),
          amount: royaltieSetupColleteral,
          suggestedParams: suggestedParams,
          rekeyTo: ALGORAND_ZERO_ADDRESS_STRING
        }),
      signer: transactionSigner
    }

    const assetReconfigurationTxn: TransactionWithSigner =
    {
      txn: makeAssetConfigTxnWithSuggestedParamsFromObject({
        from: signer.addr,
        freeze: getApplicationAddress(this.appID),
        manager: getApplicationAddress(this.appID),
        clawback: getApplicationAddress(this.appID),
        reserve: getApplicationAddress(this.appID),
        assetIndex: assetID,
        suggestedParams,
        strictEmptyAddressChecking: true,
        rekeyTo: ALGORAND_ZERO_ADDRESS_STRING
      }),
      signer: makeBasicAccountTransactionSigner(signer)
    }

    atomicTransactionComposer.addMethodCall({
      appID: 0,
      method: this.getMethodByName('createNFT'),
      sender: signer.addr,
      methodArgs: [
        taxPaymentTransaction,
        assetReconfigurationTxn
      ],
      suggestedParams: suggestedParams,
      signer: transactionSigner
    })
    const swapinNFTAbiGroup = await atomicTransactionComposer.gatherSignatures()
    return swapinNFTAbiGroup.map(decodedSignedTransactionBuffer)

  }

  async addToCollection(signer: algosdk.Account, collectionAppID: number): Promise<SignedTransaction[]> {
    const atomicTransactionComposer = new AtomicTransactionComposer()
    const suggestedParams = await this.getSuggested(10)

    suggestedParams.flatFee = false
    suggestedParams.fee = 0 //get txnfees

    atomicTransactionComposer.addMethodCall({
      appID: 0,
      method: this.getMethodByName('addToCollection'),
      sender: signer.addr,
      methodArgs: [collectionAppID],
      suggestedParams: suggestedParams,
      signer: makeBasicAccountTransactionSigner(signer),
    })

    const addToCollectionAbiGroup = await atomicTransactionComposer.gatherSignatures()
    return addToCollectionAbiGroup.map(decodedSignedTransactionBuffer)
  }

  async lockForOffer(signer: algosdk.Account, royaltyAsset: number, royaltyAssetAmount: number, authorizedAddress: string): Promise<SignedTransaction[]> {
    const atomicTransactionComposer = new AtomicTransactionComposer()
    const suggestedParams = await this.getSuggested(10)

    suggestedParams.flatFee = false
    suggestedParams.fee = 0 //get txnfees

    atomicTransactionComposer.addMethodCall({
      appID: 0,
      method: this.getMethodByName('lockForOffer'),
      sender: signer.addr,
      methodArgs: [
        royaltyAsset,
        royaltyAssetAmount,
        authorizedAddress
      ],
      suggestedParams: suggestedParams,
      signer: makeBasicAccountTransactionSigner(signer),
    })

    const lockForOfferGroup = await atomicTransactionComposer.gatherSignatures()
    return lockForOfferGroup.map(decodedSignedTransactionBuffer)
  }

  async rescind(signer: algosdk.Account, assetToRescindID: number): Promise<SignedTransaction[]> {
    const atomicTransactionComposer = new AtomicTransactionComposer()
    const suggestedParams = await this.getSuggested(10)

    suggestedParams.flatFee = false
    suggestedParams.fee = 0 //get txnfees

    atomicTransactionComposer.addMethodCall({
      appID: 0,
      method: this.getMethodByName('rescind'),
      sender: signer.addr,
      methodArgs: [
        assetToRescindID
      ],
      suggestedParams: suggestedParams,
      signer: makeBasicAccountTransactionSigner(signer),
    })

    const rescindOfferLockGroup = await atomicTransactionComposer.gatherSignatures()
    return rescindOfferLockGroup.map(decodedSignedTransactionBuffer)
  }

  async royaltyFreeMove(signer: algosdk.Account, royaltyAsset: number, royaltyAssetAmount: number, from: Account, to: Account): Promise<SignedTransaction[]> {
    const atomicTransactionComposer = new AtomicTransactionComposer()
    const suggestedParams = await this.getSuggested(10)

    suggestedParams.flatFee = false
    suggestedParams.fee = 0 //get txnfees

    atomicTransactionComposer.addMethodCall({
      appID: 0,
      method: this.getMethodByName('royaltyFreeMove'),
      sender: signer.addr,
      methodArgs: [
        royaltyAsset,
        royaltyAssetAmount,
        from.addr,
        to.addr
      ],
      suggestedParams: suggestedParams,
      signer: makeBasicAccountTransactionSigner(signer),
    })

    const royaltieFreeMoveGroup = await atomicTransactionComposer.gatherSignatures()
    return royaltieFreeMoveGroup.map(decodedSignedTransactionBuffer)
  }

  // async transfer(signer: algosdk.Account, royaltyAsset: number, royaltyAssetAmount: number, royaltyReceiver, from, to, payment:, paymentAsset:): Promise<SignedTransaction[]> {
  //   const atomicTransactionComposer = new AtomicTransactionComposer()
  //   const suggestedParams = await this.getSuggested(10)

  //   suggestedParams.flatFee = false
  //   suggestedParams.fee = 0 //get txnfees

  //   const paymentTransactionWithSigner = {
  //     txn: payment,
  //     signer: makeBasicAccountTransactionSigner(signer)
  //   }

  //   atomicTransactionComposer.addMethodCall({
  //     appID: 0,
  //     method: this.getMethodByName('transfer'),
  //     sender: signer.addr,
  //     methodArgs: [
  //       royaltyAsset,
  //       from,
  //       to,
  //       royaltyReceiver,
  //       royaltyAssetAmount,
  //       paymentTransactionWithSigner,
  //       paymentAsset
  //     ],
  //     suggestedParams: suggestedParams,
  //     signer: makeBasicAccountTransactionSigner(signer),
  //   })

  //   const transferAssetAbiGroup = await atomicTransactionComposer.gatherSignatures()
  //   return transferAssetAbiGroup.map(decodedSignedTransactionBuffer)
  // }


  async setPaymentAsset(signer: algosdk.Account, assetID: number, isNowAllowed: boolean): Promise<algosdk.SignedTransaction[]> {
    const atomicTransactionComposer = new AtomicTransactionComposer()
    const suggestedParams = await this.getSuggested(10)

    suggestedParams.flatFee = false
    suggestedParams.fee = 0 //get txnfees

    atomicTransactionComposer.addMethodCall({
      appID: 0,
      method: this.getMethodByName('setPaymentAsset'),
      sender: signer.addr,
      methodArgs: [assetID, isNowAllowed],
      suggestedParams: suggestedParams,
      signer: makeBasicAccountTransactionSigner(signer),
    })

    const setPolicyGroup = await atomicTransactionComposer.gatherSignatures()
    return setPolicyGroup.map(decodedSignedTransactionBuffer)
  }

  async setPolicy(signer: algosdk.Account, royaltieShare: number, royaltyReceiver: string): Promise<SignedTransaction[]> {
    const atomicTransactionComposer = new AtomicTransactionComposer()
    const suggestedParams = await this.getSuggested(10)

    suggestedParams.flatFee = false
    suggestedParams.fee = 0 //get txnfees

    atomicTransactionComposer.addMethodCall({
      appID: 0,
      method: this.getMethodByName('setPolicy'),
      sender: signer.addr,
      methodArgs: [royaltyReceiver, royaltieShare],
      suggestedParams: suggestedParams,
      signer: makeBasicAccountTransactionSigner(signer),
    })

    const setPolicyGroup = await atomicTransactionComposer.gatherSignatures()
    return setPolicyGroup.map(decodedSignedTransactionBuffer)
  }

  async getOffer(signer: algosdk.Account, royaltyAsset: number, from: Account): Promise<SignedTransaction[]> {
    const atomicTransactionComposer = new AtomicTransactionComposer()
    const suggestedParams = await this.getSuggested(10)

    suggestedParams.flatFee = false
    suggestedParams.fee = 0 //get txnfees

    atomicTransactionComposer.addMethodCall({
      appID: 0,
      method: this.getMethodByName('getOffer'),
      sender: signer.addr,
      methodArgs: [
        royaltyAsset,
        from.addr
      ],
      suggestedParams: suggestedParams,
      signer: makeBasicAccountTransactionSigner(signer),
    })

    const getOfferGroup = await atomicTransactionComposer.gatherSignatures()
    return getOfferGroup.map(decodedSignedTransactionBuffer)
  }

  async getPolicy(signer: algosdk.Account, royaltyAsset: number): Promise<SignedTransaction[]> {
    const atomicTransactionComposer = new AtomicTransactionComposer()
    const suggestedParams = await this.getSuggested(10)

    suggestedParams.flatFee = false
    suggestedParams.fee = 0 //get txnfees

    atomicTransactionComposer.addMethodCall({
      appID: 0,
      method: this.getMethodByName('getPolicy'),
      sender: signer.addr,
      methodArgs: [
        royaltyAsset
      ],
      suggestedParams: suggestedParams,
      signer: makeBasicAccountTransactionSigner(signer),
    })

    const getAbiGroup = await atomicTransactionComposer.gatherSignatures()
    return getAbiGroup.map(decodedSignedTransactionBuffer)
  }

}

// function get_royaltie_approval_compiled(arg0: string): Uint8Array {
//   throw new Error("Function not implemented.")
// }
// function get_royaltie_clear_compiled(arg0: string): Uint8Array {
//   throw new Error("Function not implemented.")
// }



