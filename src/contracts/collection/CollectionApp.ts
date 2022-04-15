import { Algodv2 } from "algosdk"
import { CollectionContract } from "../../_types"
import { BaseContract } from "../../_types/base"
import collectionInterface from "./CollectionInterface.json"

export class CollectionApp extends BaseContract implements CollectionContract {
    constructor(client: Algodv2) {
        super(collectionInterface, client)
    }
}


