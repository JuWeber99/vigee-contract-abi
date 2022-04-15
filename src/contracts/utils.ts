import algosdk, { SignedTransaction } from 'algosdk';

export const decodedSignedTransactionBuffer = (
  encodedTxnBuffer: Uint8Array
): SignedTransaction => algosdk.decodeSignedTransaction(encodedTxnBuffer);
