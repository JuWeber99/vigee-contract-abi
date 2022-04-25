import algosdk, { Account, SignedTransaction } from 'algosdk';
import { AtomicTransactionComposer } from 'algosdk';

export interface RoyaltieContract {
  makeSignedCreateTransaction(
    signer: algosdk.Account
  ): Promise<AtomicTransactionComposer>;

  makeSignedSetupTransaction(
    signer: algosdk.Account,
    defaultRoyaltieReceiverAddress: string,
    defaultRoyaltieShare: number
  ): Promise<AtomicTransactionComposer>;

  makeSignedCreateNFTTransaction(
    signer: algosdk.Account,
    nftdata: any
  ): Promise<SignedTransaction[]>;

  makeSwapinNFTTransaction(
    signer: algosdk.Account,
    assetID: number
  ): Promise<SignedTransaction[]>;

  makeAddToCollectionTransaction(
    signer: algosdk.Account,
    collectionAppID: number
  ): Promise<SignedTransaction[]>;

  makeSetPolicyTransaction(
    signer: algosdk.Account,
    royaltieShare: number,
    royaltieReceiver: string
  ): Promise<SignedTransaction[]>;

  makegetPolicyTransaction(
    signer: algosdk.Account,
    assetID: number
  ): Promise<SignedTransaction[]>;

  makeGetOfferTransaction(
    signer: algosdk.Account,
    assetID: number,
    stateAccountAddr: Account
  ): Promise<SignedTransaction[]>;

  makeSetPaymentAssetTransaction(
    signer: algosdk.Account,
    assetID: number,
    isNowAllowed: boolean
  ): Promise<SignedTransaction[]>;

  makeOfferRescindTransaction(
    signer: algosdk.Account,
    assetToRescindID: number
  ): Promise<SignedTransaction[]>;

  makeAdminSetRoyaltieEnforcerHashTransaction(
    signer: algosdk.Account,
    royaltieEnforcerHash: string
  ): Promise<SignedTransaction[]>;

  //inner_transfer(signer: algosdk.Account): Promise<SignedTransaction[]>

  // inner_royaltyFreeMove(): Promise<SignedTransaction[]>
  //inner_lockForOffer(): Promise<SignedTransaction[]>
}
