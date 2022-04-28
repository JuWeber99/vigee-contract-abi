import algosdk, { AtomicTransactionComposer } from 'algosdk'

export interface SolidarityContract {
    makeCreateTransaction(
        signer: algosdk.Account
    ): Promise<AtomicTransactionComposer>

    makeInitiateApplicationTransaction(
        signer: algosdk.Account
    ): Promise<AtomicTransactionComposer>

    makeChangeIndividualSolidarityTransaction(
        signer: algosdk.Account,
        solidarityAddress: string,
        basisPoints: number
    ): Promise<AtomicTransactionComposer>

    makeAddSolidarityForUserTransaction(
        signer: algosdk.Account,
        solidaritySenderAddress: string,
        appName: string
    ): Promise<AtomicTransactionComposer>

    makeGetOfferCountTransaction(
        signer: algosdk.Account,
        solidarityAddress: string
    ): Promise<AtomicTransactionComposer>

    makeRaiseOfferCountTransaction(
        signer: algosdk.Account,
        solidarityAddress: string
    ): Promise<AtomicTransactionComposer>

    makeRaiseCollectionCountTransaction(
        signer: algosdk.Account,
        solidarityAddress: string
    ): Promise<AtomicTransactionComposer>
}
