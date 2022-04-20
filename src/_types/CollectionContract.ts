import {Account, SignedTransaction} from "algosdk";

export interface CollectionContract {
    makeCreateTransaction(
        signer: Account,
        collectionDetails: [string, boolean],
        collectionName: string
    ): Promise<SignedTransaction[]>

    makeSwapinTransaction(
        signer: Account,
        assetID: number
    ): Promise<SignedTransaction[]>

    makeChangeEnforcerTransaction(
        signer: Account,
        newEnforcer: string
    ): Promise<SignedTransaction[]>

    makeChangeAdminTransaction(
        signer: Account,
        newAdminAddress: string
    ): Promise<SignedTransaction[]>

    makeAdminSetCollectionHashTransaction(
        signer: Account,
        collectionHash: string
    ): Promise<SignedTransaction[]>
}
