import { Algodv2 } from "algosdk";
import { AuctionContract } from "../../_types";
import { BaseContract } from "../../_types/base";
import auctionInterface from "./AuctionInterface.json";

export class AuctionApp extends BaseContract implements AuctionContract {
    constructor(client: Algodv2) {
        super(auctionInterface, client)
    }
}


