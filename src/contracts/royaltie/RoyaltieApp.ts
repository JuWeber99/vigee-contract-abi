import algosdk, {
  Account,
  Algodv2,
  AtomicTransactionComposer,
  getApplicationAddress, makeAssetConfigTxnWithSuggestedParamsFromObject,
  makeAssetCreateTxnWithSuggestedParamsFromObject, makePaymentTxnWithSuggestedParamsFromObject,
  SignedTransaction, TransactionSigner, TransactionWithSigner
} from 'algosdk'
import { RoyaltieContract } from '../../_types'
import { MintInformation, StateSchema } from '../../_types/algorand-typeextender'
import {
  BaseContract
} from '../../_types/base'
import {
  decodedSignedTransactionBuffer
} from '../utils'
import { royaltieB64, royaltieClearB64 } from './royaltieConstant'
import royaltieInterface from './RoyaltieInterface.json'

export class RoyaltieApp extends BaseContract implements RoyaltieContract {
  mainAppID: number

  constructor(mainAppID: number, client: Algodv2, appID: number = 0) {
    super(
      royaltieInterface,
      client,
      appID,
      new StateSchema(0, 1),
      new StateSchema(1, 4),
      royaltieB64,
      royaltieClearB64
    )
    this.mainAppID = mainAppID
  }

  makeSetAdminTransaction(signer: TransactionSigner, senderAddress: string, newAdmin: string): Promise<algosdk.SignedTransaction[]> {
    console.log(signer)
    console.log(senderAddress)
    console.log(newAdmin)
    throw new Error("senderAddress.join(newAdmin)")
  }

  async makeCreateTransaction(signer: TransactionSigner, senderAddress: string): Promise<algosdk.AtomicTransactionComposer> {


    const suggestedParams = await this.getSuggested(10)
    // suggestedParams.flatFee = false;
    // suggestedParams.fee = 0; //get txnfees

    const approvalProgram: Uint8Array = new Uint8Array(
      Buffer.from(
        await RoyaltieApp.getCompiledProgram(
          this.approvalTemplate, RoyaltieApp.client, { "TMPL_VID": this.mainAppID }), "base64"
      )
    )

    const clearProgram: Uint8Array = new Uint8Array(
      Buffer.from(
        await RoyaltieApp.getCompiledProgram(
          this.clearTemplate, RoyaltieApp.client), "base64"
      )
    )

    this.atomicTransactionComposer.addMethodCall({
      method: this.getMethodByName("create"),
      sender: senderAddress,
      appID: 0,
      signer: signer,
      suggestedParams: suggestedParams,
      onComplete: algosdk.OnApplicationComplete.NoOpOC,
      approvalProgram: approvalProgram,
      clearProgram: clearProgram,
      numLocalByteSlices: this.localSchema.numByteSlice as number,
      numLocalInts: this.localSchema.numUint as number,
      numGlobalByteSlices: this.globalSchema.numByteSlice as number,
      numGlobalInts: this.globalSchema.numUint as number,
    })

    return this.atomicTransactionComposer
  }

  async makeSetupTransaction(
    signer: TransactionSigner, senderAddress: string,
    defaultRoyaltieReceiverAddress: string,
    defaultRoyaltieShare: number
  ): Promise<AtomicTransactionComposer> {



    const suggestedParams = await this.getSuggested(10)
    // suggestedParams.flatFee = false;
    // suggestedParams.fee = 0; //get txnfees

    const royaltieSetupColleteral = 100000 + 5 * 50000
    const taxPaymentTransaction: TransactionWithSigner = {
      txn: makePaymentTxnWithSuggestedParamsFromObject({
        from: senderAddress,
        to: getApplicationAddress(this.appID),
        amount: royaltieSetupColleteral,
        suggestedParams,
        rekeyTo: undefined
      }),
      signer: signer,
    }

    const approvalProgram: Uint8Array = new Uint8Array(
      Buffer.from(
        await RoyaltieApp.getCompiledProgram(
          this.approvalTemplate, RoyaltieApp.client, { "TMPL_VID": this.mainAppID }), "base64"
      )
    )

    const clearProgram: Uint8Array = new Uint8Array(
      Buffer.from(
        await RoyaltieApp.getCompiledProgram(
          this.clearTemplate, RoyaltieApp.client), "base64"
      )
    )

    this.atomicTransactionComposer.addMethodCall({
      appID: 0,
      method: this.getMethodByName('setup'),
      sender: senderAddress,
      methodArgs: [
        defaultRoyaltieReceiverAddress,
        defaultRoyaltieShare,
        getApplicationAddress(this.mainAppID),
        this.mainAppID,
        taxPaymentTransaction
      ],
      suggestedParams: suggestedParams,
      rekeyTo: undefined,
      signer: signer,
      onComplete: algosdk.OnApplicationComplete.NoOpOC,
      approvalProgram: approvalProgram,
      clearProgram: clearProgram,
      numLocalByteSlices: this.localSchema.numByteSlice as number,
      numLocalInts: this.localSchema.numUint as number,
      numGlobalByteSlices: this.globalSchema.numByteSlice as number,
      numGlobalInts: this.globalSchema.numUint as number,
    })

    return this.atomicTransactionComposer
  }

  async makeCreateNFTTransaction(
    signer: TransactionSigner, senderAddress: string,
    mintInformation: MintInformation,
    solidarityAssetID: number
  ): Promise<AtomicTransactionComposer> {

    const suggestedParams = await this.getSuggested(10)

    suggestedParams.flatFee = false
    suggestedParams.fee = 5000
    const royaltieMintColleteral = 100000 + 100000 * 0.18
    const taxPaymentTransaction: TransactionWithSigner = {
      txn: makePaymentTxnWithSuggestedParamsFromObject({
        from: senderAddress,
        to: getApplicationAddress(this.appID),
        amount: royaltieMintColleteral,
        suggestedParams,
        rekeyTo: undefined
      }),
      signer: signer,
    }
    suggestedParams.fee = 0
    const selfAddress = getApplicationAddress(this.appID)
    const assetCreateTransaction = {
      txn: makeAssetCreateTxnWithSuggestedParamsFromObject({
        from: senderAddress,
        suggestedParams,
        assetName: mintInformation.assetName,
        unitName: mintInformation.unitName,
        manager: selfAddress,
        clawback: selfAddress,
        freeze: selfAddress,
        reserve: selfAddress,
        total: mintInformation.total,
        decimals: mintInformation.decimals,
        defaultFrozen: true,
        assetMetadataHash: mintInformation.assetMetadataHash,
        assetURL: mintInformation.metadataInfoURL,
        rekeyTo: undefined
      }),
      signer: signer,
    }

    this.atomicTransactionComposer.addMethodCall({
      appID: this.appID,
      method: this.getMethodByName('createNFT'),
      sender: senderAddress,
      methodArgs: [
        taxPaymentTransaction,
        assetCreateTransaction,
        this.mainAppID,
        getApplicationAddress(this.mainAppID),
        solidarityAssetID
      ],
      suggestedParams: suggestedParams,
      signer: signer
    })

    return this.atomicTransactionComposer
  }

  async makeSwapinNFTTransaction(
    signer: TransactionSigner, senderAddress: string,
    assetID: number
  ): Promise<SignedTransaction[]> {

    const suggestedParams = await this.getSuggested(10)

    // suggestedParams.flatFee = false;
    // suggestedParams.fee = 0; //get txnfees
    const royaltieSetupColleteral = 100000
    const taxPaymentTransaction: TransactionWithSigner = {
      txn: makePaymentTxnWithSuggestedParamsFromObject({
        from: senderAddress,
        to: getApplicationAddress(this.appID),
        amount: royaltieSetupColleteral,
        suggestedParams: suggestedParams,
        rekeyTo: undefined,
      }),
      signer: signer,
    }

    const assetReconfigurationTxn: TransactionWithSigner = {
      txn: makeAssetConfigTxnWithSuggestedParamsFromObject({
        from: senderAddress,
        freeze: getApplicationAddress(this.appID),
        manager: getApplicationAddress(this.appID),
        clawback: getApplicationAddress(this.appID),
        reserve: getApplicationAddress(this.appID),
        assetIndex: assetID,
        suggestedParams,
        strictEmptyAddressChecking: true,
        rekeyTo: undefined,
      }),
      signer: signer,
    }

    this.atomicTransactionComposer.addMethodCall({
      appID: this.appID,
      method: this.getMethodByName('createNFT'),
      sender: senderAddress,
      methodArgs: [taxPaymentTransaction, assetReconfigurationTxn],
      suggestedParams: suggestedParams,
      signer: signer,
    })
    const swapinNFTAbiGroup = await this.atomicTransactionComposer.gatherSignatures()
    return swapinNFTAbiGroup.map(decodedSignedTransactionBuffer)
  }

  async makeAddToCollectionTransaction(
    signer: TransactionSigner, senderAddress: string,
    collectionAppID: number
  ): Promise<SignedTransaction[]> {

    const suggestedParams = await this.getSuggested(10)

    suggestedParams.flatFee = false
    suggestedParams.fee = 0 //get txnfees

    this.atomicTransactionComposer.addMethodCall({
      appID: this.appID,
      method: this.getMethodByName('addToCollection'),
      sender: senderAddress,
      methodArgs: [collectionAppID],
      suggestedParams: suggestedParams,
      signer: signer,
    })

    const addToCollectionAbiGroup = await this.atomicTransactionComposer.gatherSignatures()
    return addToCollectionAbiGroup.map(decodedSignedTransactionBuffer)
  }

  async makeLockForOfferTransaction(
    signer: TransactionSigner, senderAddress: string,
    royaltyAsset: number,
    royaltyAssetAmount: number,
    authorizedAddress: string
  ): Promise<SignedTransaction[]> {

    const suggestedParams = await this.getSuggested(10)

    suggestedParams.flatFee = false
    suggestedParams.fee = 0 //get txnfees

    this.atomicTransactionComposer.addMethodCall({
      appID: this.appID,
      method: this.getMethodByName('lockForOffer'),
      sender: senderAddress,
      methodArgs: [royaltyAsset, royaltyAssetAmount, authorizedAddress],
      suggestedParams: suggestedParams,
      signer: signer,
    })

    const lockForOfferGroup = await this.atomicTransactionComposer.gatherSignatures()
    return lockForOfferGroup.map(decodedSignedTransactionBuffer)
  }

  async makeOfferRescindTransaction(
    signer: TransactionSigner, senderAddress: string,
    assetToRescindID: number
  ): Promise<SignedTransaction[]> {

    const suggestedParams = await this.getSuggested(10)

    suggestedParams.flatFee = false
    suggestedParams.fee = 0 //get txnfees

    this.atomicTransactionComposer.addMethodCall({
      appID: this.appID,
      method: this.getMethodByName('rescind'),
      sender: senderAddress,
      methodArgs: [assetToRescindID],
      suggestedParams: suggestedParams,
      signer: signer,
    })

    const rescindOfferLockGroup = await this.atomicTransactionComposer.gatherSignatures()
    return rescindOfferLockGroup.map(decodedSignedTransactionBuffer)
  }

  async makeRoyaltyFreeMoveTransaction(
    signer: TransactionSigner, senderAddress: string,
    royaltyAsset: number,
    royaltyAssetAmount: number,
    from: Account,
    to: Account
  ): Promise<SignedTransaction[]> {

    const suggestedParams = await this.getSuggested(10)

    suggestedParams.flatFee = false
    suggestedParams.fee = 0 //get txnfees

    this.atomicTransactionComposer.addMethodCall({
      appID: this.appID,
      method: this.getMethodByName('royaltyFreeMove'),
      sender: senderAddress,
      methodArgs: [royaltyAsset, royaltyAssetAmount, from.addr, to.addr],
      suggestedParams: suggestedParams,
      signer: signer,
    })

    const royaltieFreeMoveGroup = await this.atomicTransactionComposer.gatherSignatures()
    return royaltieFreeMoveGroup.map(decodedSignedTransactionBuffer)
  }

  // async transfer(signer: TransactionSigner, senderAddress: string, royaltyAsset: number, royaltyAssetAmount: number, royaltyReceiver, from, to, payment:, paymentAsset:): Promise<SignedTransaction[]> {
  //   
  //   const suggestedParams = await this.getSuggested(10)

  //   suggestedParams.flatFee = false
  //   suggestedParams.fee = 0 //get txnfees

  //   const paymentTransactionWithSigner = {
  //     txn: payment,
  //     signer: signer
  //   }

  //   this.atomicTransactionComposer.addMethodCall({
  //     appID: 0,
  //     method: this.getMethodByName('transfer'),
  //     sender: senderAddress,
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
  //     signer: signer,
  //   })

  //   const transferAssetAbiGroup = await this.atomicTransactionComposer.gatherSignatures()
  //   return transferAssetAbiGroup.map(decodedSignedTransactionBuffer)
  // }

  async makeAddPaymentAssetTransaction(
    signer: TransactionSigner, senderAddress: string,
    assetID: number,
  ): Promise<algosdk.SignedTransaction[]> {

    const suggestedParams = await this.getSuggested(10)

    suggestedParams.flatFee = false
    suggestedParams.fee = 0 //get txnfees

    this.atomicTransactionComposer.addMethodCall({
      appID: this.appID,
      method: this.getMethodByName('setPaymentAsset'),
      sender: senderAddress,
      methodArgs: [assetID],
      suggestedParams: suggestedParams,
      signer: signer,
    })

    const setPolicyGroup = await this.atomicTransactionComposer.gatherSignatures()
    return setPolicyGroup.map(decodedSignedTransactionBuffer)
  }

  async makeSetBasisPointsTransaction(
    signer: TransactionSigner, senderAddress: string,
    royaltieShare: number
  ): Promise<SignedTransaction[]> {

    const suggestedParams = await this.getSuggested(10)

    suggestedParams.flatFee = false
    suggestedParams.fee = 0 //get txnfees

    this.atomicTransactionComposer.addMethodCall({
      appID: this.appID,
      method: this.getMethodByName('setBasisPoints'),
      sender: senderAddress,
      methodArgs: [royaltieShare],
      suggestedParams: suggestedParams,
      signer: signer,
    })

    const setPolicyGroup = await this.atomicTransactionComposer.gatherSignatures()
    return setPolicyGroup.map(decodedSignedTransactionBuffer)
  }

  async makeSetRoyaltieReceiverTransaction(
    signer: TransactionSigner, senderAddress: string,
    royaltieReceiver: string
  ): Promise<SignedTransaction[]> {

    const suggestedParams = await this.getSuggested(10)

    suggestedParams.flatFee = false
    suggestedParams.fee = 0 //get txnfees

    this.atomicTransactionComposer.addMethodCall({
      appID: this.appID,
      method: this.getMethodByName('setRoyaltieReceiver'),
      sender: senderAddress,
      methodArgs: [royaltieReceiver],
      suggestedParams: suggestedParams,
      signer: signer,
    })

    const setPolicyGroup = await this.atomicTransactionComposer.gatherSignatures()
    return setPolicyGroup.map(decodedSignedTransactionBuffer)
  }

  async makeGetOffersTransaction(
    signer: TransactionSigner, senderAddress: string,
    royaltyAsset: number,
    stateHolderAddress: string
  ): Promise<SignedTransaction[]> {

    const suggestedParams = await this.getSuggested(10)

    suggestedParams.flatFee = false
    suggestedParams.fee = 0 //get txnfees

    this.atomicTransactionComposer.addMethodCall({
      appID: this.appID,
      method: this.getMethodByName('getOffer'),
      sender: senderAddress,
      methodArgs: [royaltyAsset, stateHolderAddress],
      suggestedParams: suggestedParams,
      signer: signer,
    })

    const getOfferGroup = await this.atomicTransactionComposer.gatherSignatures()
    return getOfferGroup.map(decodedSignedTransactionBuffer)
  }

  async makeGetBasisPointsTransaction(
    signer: TransactionSigner, senderAddress: string,
    royaltyAsset: number
  ): Promise<SignedTransaction[]> {

    const suggestedParams = await this.getSuggested(10)

    suggestedParams.flatFee = false
    suggestedParams.fee = 0 //get txnfees

    this.atomicTransactionComposer.addMethodCall({
      appID: this.appID,
      method: this.getMethodByName('getPolicy'),
      sender: senderAddress,
      methodArgs: [royaltyAsset],
      suggestedParams: suggestedParams,
      signer: signer,
    })

    const getAbiGroup = await this.atomicTransactionComposer.gatherSignatures()
    return getAbiGroup.map(decodedSignedTransactionBuffer)
  }

  async makeAdminSetRoyaltieEnforcerHashTransaction(signer: TransactionSigner, senderAddress: string, royaltieEnforcerHash: string): Promise<SignedTransaction[]> {

    const suggestedParams = await this.getSuggested(10)

    suggestedParams.flatFee = false
    suggestedParams.fee = 0 //get txnfees

    this.atomicTransactionComposer.addMethodCall({
      appID: this.appID,
      method: this.getMethodByName('adminSetRoyaltieEnforcerHash'),
      sender: senderAddress,
      methodArgs: [royaltieEnforcerHash],
      suggestedParams: suggestedParams,
      signer: signer,
    })

    const adminSetRoyaltieEnforcerHashAbiGroup = await this.atomicTransactionComposer.gatherSignatures()
    return adminSetRoyaltieEnforcerHashAbiGroup.map(decodedSignedTransactionBuffer)
  }
}

// function get_royaltie_approval_compiled(arg0: string): Uint8Array {
//   throw new Error("Function not implemented.")
// }
// function get_royaltie_clear_compiled(arg0: string): Uint8Array {
//   throw new Error("Function not implemented.")
// }



