import algosdk, { SignedTransaction } from 'algosdk';

export interface SolidarityContract {
    makeChangeIndividualSolidarityTransaction(
        signer: algosdk.Account,
        solidarityAddress: string,
        basisPoints: number
    ): Promise<SignedTransaction[]>

    makeAddSolidarityForUserTransaction(
        signer: algosdk.Account,
        solidaritySenderAddress: string,
        appName: string
    ): Promise<SignedTransaction[]>

    makeGetOfferCountTransaction(
        signer: algosdk.Account,
        solidarityAddress: string
    ): Promise<SignedTransaction[]>

    makeRaiseOfferCountTransaction(
        signer: algosdk.Account,
        solidarityAddress: string
    ): Promise<SignedTransaction[]>

    makeRaiseCollectionCountTransaction(
        signer: algosdk.Account,
        solidarityAddress: string
    ): Promise<SignedTransaction[]>
}
