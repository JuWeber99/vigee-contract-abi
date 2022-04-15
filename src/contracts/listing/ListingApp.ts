import { Algodv2 } from 'algosdk';
import { ListingContract } from '../../_types';
import { BaseContract } from '../../_types/base';
import listingInterface from './ListingInterface.json';

export class ListingApp extends BaseContract implements ListingContract {
  constructor(client: Algodv2) {
    super(listingInterface, client);
  }
}
