import { IModel } from "../Model";
import { Event } from "./Event";
export declare class ModelUpdateEvent extends Event {
    readonly model: IModel;
    constructor(model: IModel);
}
