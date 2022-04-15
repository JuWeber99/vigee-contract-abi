import algosdk, { Account, SignedTransaction } from 'algosdk';
import { ContractProgramCompilationContext } from './base';

export interface RoyaltieContract {
  setup(
    signer: algosdk.Account,
    defaultRoyaltieReceiverAddress: string,
    defaultRoyaltieShareAddress: string,
    approvalCompilationContext: ContractProgramCompilationContext,
    clearCompilationContext: ContractProgramCompilationContext
  ): Promise<SignedTransaction[]>;

  createNFT(
    signer: algosdk.Account,
    nftdata: any
  ): Promise<SignedTransaction[]>;

  swapinNFT(
    signer: algosdk.Account,
    assetID: number
  ): Promise<SignedTransaction[]>;

  addToCollection(
    signer: algosdk.Account,
    collectionAppID: number
  ): Promise<SignedTransaction[]>;

  setPolicy(
    signer: algosdk.Account,
    royaltieShare: number,
    royaltieReceiver: string
  ): Promise<SignedTransaction[]>;

  getPolicy(
    signer: algosdk.Account,
    assetID: number
  ): Promise<SignedTransaction[]>;

  getOffer(
    signer: algosdk.Account,
    assetID: number,
    stateAccountAddr: Account
  ): Promise<SignedTransaction[]>;

  setPaymentAsset(
    signer: algosdk.Account,
    assetID: number,
    isNowAllowed: boolean
  ): Promise<SignedTransaction[]>;

  rescind(
    signer: algosdk.Account,
    assetToRescindID: number
  ): Promise<SignedTransaction[]>;

  //inner_transfer(signer: algosdk.Account): Promise<SignedTransaction[]>

  // inner_royaltyFreeMove(): Promise<SignedTransaction[]>
  //inner_lockForOffer(): Promise<SignedTransaction[]>
}
