import { SignedTransaction, TransactionSigner } from "algosdk"

export interface CollectionContract {
    makeCreateTransaction(
        signer: TransactionSigner, senderAddress: string,
        collectionDetails: [string, boolean],
        collectionName: string
    ): Promise<SignedTransaction[]>

    makeSwapinTransaction(
        signer: TransactionSigner, senderAddress: string,
        assetID: number
    ): Promise<SignedTransaction[]>

    makeChangeEnforcerTransaction(
        signer: TransactionSigner, senderAddress: string,
        newEnforcer: string
    ): Promise<SignedTransaction[]>

    makeChangeAdminTransaction(
        signer: TransactionSigner, senderAddress: string,
        newAdminAddress: string
    ): Promise<SignedTransaction[]>

    makeAdminSetCollectionHashTransaction(
        signer: TransactionSigner, senderAddress: string,
        collectionHash: string
    ): Promise<SignedTransaction[]>
}
