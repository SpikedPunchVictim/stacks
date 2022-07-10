import { IModel } from "../Model";
import { Event } from "./Event";
export declare class CreateModelEvent extends Event {
    readonly model: IModel;
    constructor(model: IModel);
}
