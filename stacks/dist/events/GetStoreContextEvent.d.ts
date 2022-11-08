import { StoreContext } from "../stack/Stack";
import { Event } from "./Event";
export declare class GetStoreContextEvent extends Event {
    readonly contexts: StoreContext[];
    constructor();
}
