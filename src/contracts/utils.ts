import algosdk, { SignedTransaction } from 'algosdk';

export const decodedSignedTransactionBuffer = (
  encodedTxnBuffer: Uint8Array
): SignedTransaction => algosdk.decodeSignedTransaction(encodedTxnBuffer);

export const ALGORAND_ZERO_ADDRESS =
  'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HFKQ';
