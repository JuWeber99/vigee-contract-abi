import { Algodv2 } from 'algosdk';
import { ApplicationStateSchema } from 'algosdk/dist/types/src/client/v2/algod/models/types';
import { SolidarityContract } from '../../_types';
import { BaseContract } from '../../_types/base';
import solidarityInterface from './SolidarityInterface.json';

export class SolidarityApp extends BaseContract implements SolidarityContract {
  constructor(client: Algodv2) {
    super(
      solidarityInterface,
      client,
      new ApplicationStateSchema(0, 1),
      new ApplicationStateSchema(0, 2)
    );
  }
}
