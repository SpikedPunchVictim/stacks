import { IModel } from "../Model";
import { Event } from "./Event";
export declare class ModelDeleteEvent extends Event {
    readonly model: IModel;
    constructor(model: IModel);
}
