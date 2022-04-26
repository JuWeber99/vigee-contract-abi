import algosdk, {
  Account,
  Algodv2,
  AtomicTransactionComposer,
  getApplicationAddress, makeAssetConfigTxnWithSuggestedParamsFromObject,
  makeAssetCreateTxnWithSuggestedParamsFromObject,
  makeBasicAccountTransactionSigner,
  makePaymentTxnWithSuggestedParamsFromObject,
  SignedTransaction, TransactionWithSigner
} from 'algosdk';
import { RoyaltieContract } from '../../_types';
import { MintInformation, StateSchema } from '../../_types/algorand-typeextender';
import {
  BaseContract
} from '../../_types/base';
import {
  decodedSignedTransactionBuffer
} from '../utils';
import { royaltieB64, royaltieClearB64 } from './royaltieConstant';
import royaltieInterface from './RoyaltieInterface.json';

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
    );
    this.mainAppID = mainAppID
  }

  makeSetAdminTransaction(signer: algosdk.Account, newAdmin: string): Promise<algosdk.SignedTransaction[]> {
    console.log(signer)
    console.log(newAdmin)
    throw new Error("signer.addr.join(newAdmin)");
  }

  async makeCreateTransaction(signer: algosdk.Account): Promise<algosdk.AtomicTransactionComposer> {
    const atomicTransactionComposer = new AtomicTransactionComposer();
    const transactionSigner = makeBasicAccountTransactionSigner(signer);

    const suggestedParams = await this.getSuggested(10);
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

    atomicTransactionComposer.addMethodCall({
      method: this.getMethodByName("create"),
      sender: signer.addr,
      appID: 0,
      signer: transactionSigner,
      suggestedParams: suggestedParams,
      onComplete: algosdk.OnApplicationComplete.NoOpOC,
      approvalProgram: approvalProgram,
      clearProgram: clearProgram,
      numLocalByteSlices: this.localSchema.numByteSlice as number,
      numLocalInts: this.localSchema.numUint as number,
      numGlobalByteSlices: this.globalSchema.numByteSlice as number,
      numGlobalInts: this.globalSchema.numUint as number,
    })

    return atomicTransactionComposer
  }

  async makeSetupTransaction(
    signer: algosdk.Account,
    defaultRoyaltieReceiverAddress: string,
    defaultRoyaltieShare: number
  ): Promise<AtomicTransactionComposer> {

    const atomicTransactionComposer = new AtomicTransactionComposer();
    const transactionSigner = makeBasicAccountTransactionSigner(signer);

    const suggestedParams = await this.getSuggested(10);
    // suggestedParams.flatFee = false;
    // suggestedParams.fee = 0; //get txnfees

    const royaltieSetupColleteral = 100000 + 5 * 50000;
    const taxPaymentTransaction: TransactionWithSigner = {
      txn: makePaymentTxnWithSuggestedParamsFromObject({
        from: signer.addr,
        to: getApplicationAddress(this.appID),
        amount: royaltieSetupColleteral,
        suggestedParams,
        rekeyTo: undefined
      }),
      signer: transactionSigner,
    };

    atomicTransactionComposer.addMethodCall({
      appID: this.appID,
      method: this.getMethodByName('setup'),
      sender: signer.addr,
      methodArgs: [
        defaultRoyaltieReceiverAddress,
        defaultRoyaltieShare,
        getApplicationAddress(this.mainAppID),
        this.mainAppID,
        taxPaymentTransaction
      ],
      suggestedParams: suggestedParams,
      rekeyTo: undefined,
      signer: transactionSigner,
    });

    return atomicTransactionComposer
  }

  async makeCreateNFTTransaction(
    signer: algosdk.Account,
    mintInformation: MintInformation
  ): Promise<AtomicTransactionComposer> {
    const atomicTransactionComposer = new AtomicTransactionComposer();
    const suggestedParams = await this.getSuggested(10);
    const transactionSigner = makeBasicAccountTransactionSigner(signer);

    // suggestedParams.flatFee = false;
    // suggestedParams.fee = 0; //get txnfees
    const royaltieMintColleteral = 100000;
    const taxPaymentTransaction: TransactionWithSigner = {
      txn: makePaymentTxnWithSuggestedParamsFromObject({
        from: signer.addr,
        to: getApplicationAddress(this.appID),
        amount: royaltieMintColleteral,
        suggestedParams,
        rekeyTo: undefined
      }),
      signer: transactionSigner,
    };

    const selfAddress = getApplicationAddress(this.appID)
    const assetCreateTransaction = {
      txn: makeAssetCreateTxnWithSuggestedParamsFromObject({
        from: signer.addr,
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
      signer: transactionSigner,
    };

    atomicTransactionComposer.addMethodCall({
      appID: this.appID,
      method: this.getMethodByName('createNFT'),
      sender: signer.addr,
      methodArgs: [taxPaymentTransaction, assetCreateTransaction],
      suggestedParams: suggestedParams,
      signer: transactionSigner
    });

    return atomicTransactionComposer
  }

  async makeSwapinNFTTransaction(
    signer: algosdk.Account,
    assetID: number
  ): Promise<SignedTransaction[]> {
    const atomicTransactionComposer = new AtomicTransactionComposer();
    const suggestedParams = await this.getSuggested(10);

    const transactionSigner = makeBasicAccountTransactionSigner(signer);

    // suggestedParams.flatFee = false;
    // suggestedParams.fee = 0; //get txnfees
    const royaltieSetupColleteral = 100000;
    const taxPaymentTransaction: TransactionWithSigner = {
      txn: makePaymentTxnWithSuggestedParamsFromObject({
        from: signer.addr,
        to: getApplicationAddress(this.appID),
        amount: royaltieSetupColleteral,
        suggestedParams: suggestedParams,
        rekeyTo: undefined,
      }),
      signer: transactionSigner,
    };

    const assetReconfigurationTxn: TransactionWithSigner = {
      txn: makeAssetConfigTxnWithSuggestedParamsFromObject({
        from: signer.addr,
        freeze: getApplicationAddress(this.appID),
        manager: getApplicationAddress(this.appID),
        clawback: getApplicationAddress(this.appID),
        reserve: getApplicationAddress(this.appID),
        assetIndex: assetID,
        suggestedParams,
        strictEmptyAddressChecking: true,
        rekeyTo: undefined,
      }),
      signer: makeBasicAccountTransactionSigner(signer),
    };

    atomicTransactionComposer.addMethodCall({
      appID: this.appID,
      method: this.getMethodByName('createNFT'),
      sender: signer.addr,
      methodArgs: [taxPaymentTransaction, assetReconfigurationTxn],
      suggestedParams: suggestedParams,
      signer: transactionSigner,
    });
    const swapinNFTAbiGroup = await atomicTransactionComposer.gatherSignatures();
    return swapinNFTAbiGroup.map(decodedSignedTransactionBuffer);
  }

  async makeAddToCollectionTransaction(
    signer: algosdk.Account,
    collectionAppID: number
  ): Promise<SignedTransaction[]> {
    const atomicTransactionComposer = new AtomicTransactionComposer();
    const suggestedParams = await this.getSuggested(10);

    suggestedParams.flatFee = false;
    suggestedParams.fee = 0; //get txnfees

    atomicTransactionComposer.addMethodCall({
      appID: this.appID,
      method: this.getMethodByName('addToCollection'),
      sender: signer.addr,
      methodArgs: [collectionAppID],
      suggestedParams: suggestedParams,
      signer: makeBasicAccountTransactionSigner(signer),
    });

    const addToCollectionAbiGroup = await atomicTransactionComposer.gatherSignatures();
    return addToCollectionAbiGroup.map(decodedSignedTransactionBuffer);
  }

  async makeLockForOfferTransaction(
    signer: algosdk.Account,
    royaltyAsset: number,
    royaltyAssetAmount: number,
    authorizedAddress: string
  ): Promise<SignedTransaction[]> {
    const atomicTransactionComposer = new AtomicTransactionComposer();
    const suggestedParams = await this.getSuggested(10);

    suggestedParams.flatFee = false;
    suggestedParams.fee = 0; //get txnfees

    atomicTransactionComposer.addMethodCall({
      appID: this.appID,
      method: this.getMethodByName('lockForOffer'),
      sender: signer.addr,
      methodArgs: [royaltyAsset, royaltyAssetAmount, authorizedAddress],
      suggestedParams: suggestedParams,
      signer: makeBasicAccountTransactionSigner(signer),
    });

    const lockForOfferGroup = await atomicTransactionComposer.gatherSignatures();
    return lockForOfferGroup.map(decodedSignedTransactionBuffer);
  }

  async makeOfferRescindTransaction(
    signer: algosdk.Account,
    assetToRescindID: number
  ): Promise<SignedTransaction[]> {
    const atomicTransactionComposer = new AtomicTransactionComposer();
    const suggestedParams = await this.getSuggested(10);

    suggestedParams.flatFee = false;
    suggestedParams.fee = 0; //get txnfees

    atomicTransactionComposer.addMethodCall({
      appID: this.appID,
      method: this.getMethodByName('rescind'),
      sender: signer.addr,
      methodArgs: [assetToRescindID],
      suggestedParams: suggestedParams,
      signer: makeBasicAccountTransactionSigner(signer),
    });

    const rescindOfferLockGroup = await atomicTransactionComposer.gatherSignatures();
    return rescindOfferLockGroup.map(decodedSignedTransactionBuffer);
  }

  async makeRoyaltyFreeMoveTransaction(
    signer: algosdk.Account,
    royaltyAsset: number,
    royaltyAssetAmount: number,
    from: Account,
    to: Account
  ): Promise<SignedTransaction[]> {
    const atomicTransactionComposer = new AtomicTransactionComposer();
    const suggestedParams = await this.getSuggested(10);

    suggestedParams.flatFee = false;
    suggestedParams.fee = 0; //get txnfees

    atomicTransactionComposer.addMethodCall({
      appID: this.appID,
      method: this.getMethodByName('royaltyFreeMove'),
      sender: signer.addr,
      methodArgs: [royaltyAsset, royaltyAssetAmount, from.addr, to.addr],
      suggestedParams: suggestedParams,
      signer: makeBasicAccountTransactionSigner(signer),
    });

    const royaltieFreeMoveGroup = await atomicTransactionComposer.gatherSignatures();
    return royaltieFreeMoveGroup.map(decodedSignedTransactionBuffer);
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

  async makeAddPaymentAssetTransaction(
    signer: algosdk.Account,
    assetID: number,
  ): Promise<algosdk.SignedTransaction[]> {
    const atomicTransactionComposer = new AtomicTransactionComposer();
    const suggestedParams = await this.getSuggested(10);

    suggestedParams.flatFee = false;
    suggestedParams.fee = 0; //get txnfees

    atomicTransactionComposer.addMethodCall({
      appID: this.appID,
      method: this.getMethodByName('setPaymentAsset'),
      sender: signer.addr,
      methodArgs: [assetID],
      suggestedParams: suggestedParams,
      signer: makeBasicAccountTransactionSigner(signer),
    });

    const setPolicyGroup = await atomicTransactionComposer.gatherSignatures();
    return setPolicyGroup.map(decodedSignedTransactionBuffer);
  }

  async makeSetBasisPointsTransaction(
    signer: algosdk.Account,
    royaltieShare: number
  ): Promise<SignedTransaction[]> {
    const atomicTransactionComposer = new AtomicTransactionComposer();
    const suggestedParams = await this.getSuggested(10);

    suggestedParams.flatFee = false;
    suggestedParams.fee = 0; //get txnfees

    atomicTransactionComposer.addMethodCall({
      appID: this.appID,
      method: this.getMethodByName('setBasisPoints'),
      sender: signer.addr,
      methodArgs: [royaltieShare],
      suggestedParams: suggestedParams,
      signer: makeBasicAccountTransactionSigner(signer),
    });

    const setPolicyGroup = await atomicTransactionComposer.gatherSignatures();
    return setPolicyGroup.map(decodedSignedTransactionBuffer);
  }

  async makeSetRoyaltieReceiverTransaction(
    signer: algosdk.Account,
    royaltieReceiver: string
  ): Promise<SignedTransaction[]> {
    const atomicTransactionComposer = new AtomicTransactionComposer();
    const suggestedParams = await this.getSuggested(10);

    suggestedParams.flatFee = false;
    suggestedParams.fee = 0; //get txnfees

    atomicTransactionComposer.addMethodCall({
      appID: this.appID,
      method: this.getMethodByName('setRoyaltieReceiver'),
      sender: signer.addr,
      methodArgs: [royaltieReceiver],
      suggestedParams: suggestedParams,
      signer: makeBasicAccountTransactionSigner(signer),
    });

    const setPolicyGroup = await atomicTransactionComposer.gatherSignatures();
    return setPolicyGroup.map(decodedSignedTransactionBuffer);
  }

  async makeGetOffersTransaction(
    signer: algosdk.Account,
    royaltyAsset: number,
    from: Account
  ): Promise<SignedTransaction[]> {
    const atomicTransactionComposer = new AtomicTransactionComposer();
    const suggestedParams = await this.getSuggested(10);

    suggestedParams.flatFee = false;
    suggestedParams.fee = 0; //get txnfees

    atomicTransactionComposer.addMethodCall({
      appID: this.appID,
      method: this.getMethodByName('getOffer'),
      sender: signer.addr,
      methodArgs: [royaltyAsset, from.addr],
      suggestedParams: suggestedParams,
      signer: makeBasicAccountTransactionSigner(signer),
    });

    const getOfferGroup = await atomicTransactionComposer.gatherSignatures();
    return getOfferGroup.map(decodedSignedTransactionBuffer);
  }

  async makeGetBasisPointsTransaction(
    signer: algosdk.Account,
    royaltyAsset: number
  ): Promise<SignedTransaction[]> {
    const atomicTransactionComposer = new AtomicTransactionComposer();
    const suggestedParams = await this.getSuggested(10);

    suggestedParams.flatFee = false;
    suggestedParams.fee = 0; //get txnfees

    atomicTransactionComposer.addMethodCall({
      appID: this.appID,
      method: this.getMethodByName('getPolicy'),
      sender: signer.addr,
      methodArgs: [royaltyAsset],
      suggestedParams: suggestedParams,
      signer: makeBasicAccountTransactionSigner(signer),
    });

    const getAbiGroup = await atomicTransactionComposer.gatherSignatures();
    return getAbiGroup.map(decodedSignedTransactionBuffer);
  }

  async makeAdminSetRoyaltieEnforcerHashTransaction(signer: algosdk.Account, royaltieEnforcerHash: string): Promise<SignedTransaction[]> {
    const atomicTransactionComposer = new AtomicTransactionComposer();
    const suggestedParams = await this.getSuggested(10);

    suggestedParams.flatFee = false;
    suggestedParams.fee = 0; //get txnfees

    atomicTransactionComposer.addMethodCall({
      appID: this.appID,
      method: this.getMethodByName('adminSetRoyaltieEnforcerHash'),
      sender: signer.addr,
      methodArgs: [royaltieEnforcerHash],
      suggestedParams: suggestedParams,
      signer: makeBasicAccountTransactionSigner(signer),
    });

    const adminSetRoyaltieEnforcerHashAbiGroup = await atomicTransactionComposer.gatherSignatures();
    return adminSetRoyaltieEnforcerHashAbiGroup.map(decodedSignedTransactionBuffer);
  }
}

// function get_royaltie_approval_compiled(arg0: string): Uint8Array {
//   throw new Error("Function not implemented.")
// }
// function get_royaltie_clear_compiled(arg0: string): Uint8Array {
//   throw new Error("Function not implemented.")
// }



