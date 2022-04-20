import algosdk, { ABIContractParams, Algodv2, SignedTransaction, SuggestedParams } from 'algosdk';
import { Transaction } from 'algosdk';
import { getApplicationAddress } from 'algosdk';
import { ContractProgramCompilationContext } from '.';
import { ABIStateSchema, StateSchema } from '../algorand-typeextender';

export enum PROGRAM_TYPE {
  APPROVAL,
  CLEAR,
}


export abstract class BaseContract extends algosdk.ABIContract {
  client: Algodv2;
  localSchema: StateSchema;
  globalSchema: StateSchema;
  appID: number
  address: string

  static abiInterface: ABIContractParams & Partial<ABIStateSchema>;
  approvalProgram: Uint8Array = new Uint8Array();
  clearProgram: Uint8Array = new Uint8Array();

  constructor(
    contractAbiDefinition: ABIContractParams & Partial<ABIStateSchema>,
    client: Algodv2,
    appID: number = 0,
    localSchema = new StateSchema(0, 0),
    globalSchema = new StateSchema(0, 0),

  ) {
    super(contractAbiDefinition);
    delete contractAbiDefinition.globals;
    delete contractAbiDefinition.locals;
    this.appID = appID
    this.client = client;
    this.globalSchema = globalSchema;
    this.localSchema = localSchema;
    this.address = getApplicationAddress(appID)
  }

  static getTransactionsFromGroup(signedArray: SignedTransaction[]): Transaction[] {
    return signedArray.map((item) => item.txn)
  }

  getMethodByName(name: string): algosdk.ABIMethod {
    const m = this.methods.find((mt: algosdk.ABIMethod) => {
      return mt.name == name;
    });
    if (m === undefined) throw Error('Method undefined: ' + name);
    return m;
  }

  async getSuggested(rounds: number): Promise<SuggestedParams> {
    const txParams = await this.client.getTransactionParams().do();
    return { ...txParams, lastRound: txParams.firstRound + rounds };
  }

  populateContract(template: string, vars: any): string {
    for (const v of vars) {
      let val = vars[v];
      if (val === '') {
        val = 'dummy'; // TODO
      }
      template = template.replace(new RegExp(v, 'g'), val);
    }
    return template;
  }

  async getCompiledProgram(
    TYPE: PROGRAM_TYPE,
    programCompilationContext?: ContractProgramCompilationContext
  ): Promise<Uint8Array> {
    const compiled = await this.client
      .compile(
        this.populateContract(
          programCompilationContext.programTemplate,
          programCompilationContext.templateVariables
        )
      )
      .do()
      .then();
    const programBytes = new Uint8Array(Buffer.from(compiled.result, 'base64'));

    switch (TYPE) {
      case PROGRAM_TYPE.APPROVAL:
        this.approvalProgram = programBytes;
        break;
      case PROGRAM_TYPE.CLEAR:
        this.clearProgram = programBytes;
        break;
      default:
        throw Error('WRONG INPUT');
    }

    return programBytes;
  }
}

// import algosdk from 'algosdk'
// import * as fs from 'fs'
// import {getAccounts, getAlgodClient, getSuggested} from '../services/lib/algorand'
// import {LoadVigeeMainConfiguration} from '../services/models/application-configuration'

// function getMethodByName(contract: algosdk.ABIInterface, name: string): algosdk.ABIMethod  {
//   const m = contract.methods.find((mt: algosdk.ABIMethod)=>{ return mt.name==name })
//   if(m === undefined)
//     throw Error("Method undefined: "+name)
//   return m
// }

// export function buildGroup(methods: Array<any>): algosdk.TransactionWithSigner[] {
//   const comp = new algosdk.AtomicTransactionComposer()
//   methods.forEach(x => {
//     comp.addMethodCall(x)
//   })
//   const group = comp.buildGroup()

//   console.log(group)
//   for(const x in group){
//     console.log(group[x].txn.appArgs)
//   }

//   return group
// }

// export async function executeGroupOfTransactions(group: algosdk.TransactionWithSigner[]) {
//   const client = getAlgodClient()
//   const comp = new algosdk.AtomicTransactionComposer()
//   group.forEach(x => {
//     comp.addTransaction(x)
//   })

//   const result = await comp.execute(client, 2)
//   return JSON.stringify(result)
// }

// async function getCommonParams() {
//   const accounts = await getAccounts()
//   const acct = accounts[0]
//   const ac = await LoadVigeeMainConfiguration()
//   return {
//     appID: ac.application.id,
//     sender: acct.addr,
//     suggestedParams: await getSuggested(10),
//     signer: algosdk.makeBasicAccountTransactionSigner(acct)
//   }
// }

// export async function createAssetManager(collectionDetails: string, collectionName: string) {
//   const commonParams = getCommonParams()
//   const abiInterface = getAssetManagerInterface()

//   return {
//     method: getMethodByName(abiInterface, "create"),
//     methodArgs: [collectionDetails, collectionName],
//     ...commonParams}
// }

// export async function mintAssetManager(assetName: string, unitName: string, url: string, decimals: number) {
//   const commonParams = getCommonParams()
//   const abiInterface = getAssetManagerInterface()

//   return {
//     method: getMethodByName(abiInterface, "mint"),
//     methodArgs: [assetName, unitName, url, decimals],
//     ...commonParams}
// }

// export async function swapinAssetManager(assetId: number) {
//   const commonParams = getCommonParams()
//   const abiInterface = getAssetManagerInterface()

//   return {
//     method: getMethodByName(abiInterface, "swapin"),
//     methodArgs: [assetId],
//     ...commonParams}
// }

// export async function changeEnforcerAssetManager(address: string) {
//   const commonParams = getCommonParams()
//   const abiInterface = getAssetManagerInterface()

//   return {
//     method: getMethodByName(abiInterface, "changeEnforcer"),
//     methodArgs: [address],
//     ...commonParams}
// }

// export async function changeAdminAssetManager(address: string) {
//   const commonParams = getCommonParams()
//   const abiInterface = getAssetManagerInterface()

//   return {
//     method: getMethodByName(abiInterface, "changeAdmin"),
//     methodArgs: [address],
//     ...commonParams}
// }

// export async function createNFTRoyaltieEnforcer(taxTransaction,
//                                                 platformCheckTransaction,
//                                                 assetCreateTransaction) {
//   const commonParams = getCommonParams()
//   const abiInterface = getRoyaltieEnforcerInterface()

//   return {
//     method: getMethodByName(abiInterface, "createPlatformNFT"),
//     methodArgs: [taxTransaction, platformCheckTransaction, assetCreateTransaction],
//     ...commonParams}
// }

// export async function swapinNFTRoyaltieEnforcer(taxTransaction,
//                                                 platformCheckTransaction,
//                                                 assetReconfigurationTransaction) {
//   const commonParams = getCommonParams()
//   const abiInterface = getRoyaltieEnforcerInterface()

//   return {
//     method: getMethodByName(abiInterface, "nftPlatformSwapin"),
//     methodArgs: [taxTransaction, platformCheckTransaction, assetReconfigurationTransaction],
//     ...commonParams}
// }

// export async function addToCollectionRoyaltieEnforcer(collectionAccount) {
//   const commonParams = getCommonParams()
//   const abiInterface = getRoyaltieEnforcerInterface()

//   return {
//     method: getMethodByName(abiInterface, "addToCollection"),
//     methodArgs: [collectionAccount],
//     ...commonParams}
// }

// export async function setPolicyRoyaltieEnforcer(royaltyAsset, royaltyReceiver, royaltyShare,
//                                                 allowedAsset_1, allowedAsset_2, allowedAsset_3, allowedAsset_4) {
//   const commonParams = getCommonParams()
//   const abiInterface = getRoyaltieEnforcerInterface()

//   return {
//     method: getMethodByName(abiInterface, "setPolicy"),
//     methodArgs: [royaltyAsset, royaltyReceiver, royaltyShare, allowedAsset_1, allowedAsset_2,
//       allowedAsset_3, allowedAsset_4],
//     ...commonParams}
// }

// export async function getPolicyRoyaltieEnforcer(royaltyAsset) {
//   const commonParams = getCommonParams()
//   const abiInterface = getRoyaltieEnforcerInterface()

//   return {
//     method: getMethodByName(abiInterface, "getPolicy"),
//     methodArgs: [royaltyAsset],
//     ...commonParams}
// }

// export async function offerRoyaltieEnforcer(royaltyAsset, royaltyAssetAmount, authorizedAddress) {
//   const commonParams = getCommonParams()
//   const abiInterface = getRoyaltieEnforcerInterface()

//   return {
//     method: getMethodByName(abiInterface, "offer"),
//     methodArgs: [royaltyAsset, royaltyAssetAmount, authorizedAddress],
//     ...commonParams}
// }

// export async function getOfferRoyaltieEnforcer(royaltyAsset, from) {
//   const commonParams = getCommonParams()
//   const abiInterface = getRoyaltieEnforcerInterface()

//   return {
//     method: getMethodByName(abiInterface, "getOffer"),
//     methodArgs: [royaltyAsset, from],
//     ...commonParams}
// }

// export async function rescindRoyaltieEnforcer(royaltyAsset) {
//   const commonParams = getCommonParams()
//   const abiInterface = getRoyaltieEnforcerInterface()

//   return {
//     method: getMethodByName(abiInterface, "rescind"),
//     methodArgs: [royaltyAsset],
//     ...commonParams}
// }

// export async function freeMoveRoyaltieEnforcer(royaltyAsset, royaltyAssetAmount, from, to) {
//   const commonParams = getCommonParams()
//   const abiInterface = getRoyaltieEnforcerInterface()

//   return {
//     method: getMethodByName(abiInterface, "royaltyFreeMove"),
//     methodArgs: [royaltyAsset, royaltyAssetAmount, from, to],
//     ...commonParams}
// }

// export async function transferRoyaltieEnforcer(royaltyAsset, from, to, royaltyReceiver, royaltyAssetAmount,
//                                                payment, paymentAsset) {
//   const commonParams = getCommonParams()
//   const abiInterface = getRoyaltieEnforcerInterface()

//   return {
//     method: getMethodByName(abiInterface, "transfer"),
//     methodArgs: [royaltyAsset, from, to, royaltyReceiver, royaltyAssetAmount, payment, paymentAsset],
//     ...commonParams}
// }

// const path = '../../../abi/'

// function getAssetManagerInterface(): algosdk.ABIInterface {
//   const buff = fs.readFileSync(path + 'assetManagerInterface.json')
//   return new algosdk.ABIInterface(JSON.parse(buff.toString()))
// }

// function getAuctionInterface(): algosdk.ABIInterface {
//   const buff = fs.readFileSync(path + 'auctionInterface.json')
//   return new algosdk.ABIInterface(JSON.parse(buff.toString()))
// }

// function getListingInterface(): algosdk.ABIInterface {
//   const buff = fs.readFileSync(path + 'ListingInterface.json')
//   return new algosdk.ABIInterface(JSON.parse(buff.toString()))
// }

// function getRoyaltieEnforcerInterface(): algosdk.ABIInterface {
//   const buff = fs.readFileSync(path + 'royaltieEnforcerInterface.json')
//   return new algosdk.ABIInterface(JSON.parse(buff.toString()))
// }

// function getVigeeMainInterface(): algosdk.ABIInterface {
//   const buff = fs.readFileSync(path + 'vigeeMain.json')
//   return new algosdk.ABIInterface(JSON.parse(buff.toString()))
// }
