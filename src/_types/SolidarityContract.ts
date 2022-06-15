import { AtomicTransactionComposer, TransactionSigner } from 'algosdk';

export interface SolidarityContract {
  makeCreateTransaction(
    signer: TransactionSigner,
    senderAddress: string
  ): Promise<AtomicTransactionComposer>;

  makeInitiateApplicationTransaction(
    signer: TransactionSigner,
    senderAddress: string
  ): Promise<AtomicTransactionComposer>;

  makeChangeIndividualSolidarityTransaction(
    signer: TransactionSigner,
    senderAddress: string,
    solidarityAddress: string,
    basisPoints: number
  ): Promise<AtomicTransactionComposer>;

  makeAddSolidarityForUserTransaction(
    signer: TransactionSigner,
    senderAddress: string,
    solidaritySenderAddress: string,
    appName: string
  ): Promise<AtomicTransactionComposer>;

  makeGetOfferCountTransaction(
    signer: TransactionSigner,
    senderAddress: string,
    solidarityAddress: string
  ): Promise<AtomicTransactionComposer>;

  makeRaiseOfferCountTransaction(
    signer: TransactionSigner,
    senderAddress: string,
    solidarityAddress: string
  ): Promise<AtomicTransactionComposer>;

  makeRaiseCollectionCountTransaction(
    signer: TransactionSigner,
    senderAddress: string,
    solidarityAddress: string
  ): Promise<AtomicTransactionComposer>;
}
