import { Algodv2 } from 'algosdk';
import { SolidarityContract } from '../../_types';
import { StateSchema } from '../../_types/algorand-typeextender';
import { BaseContract } from '../../_types/base';
import solidarityInterface from './SolidarityInterface.json';

export class SolidarityApp extends BaseContract implements SolidarityContract {
  constructor(client: Algodv2, appID: number = 0,) {
    super(
      solidarityInterface,
      client,
      appID,
      new StateSchema(0, 1),
      new StateSchema(0, 2),
    );
  }
}
