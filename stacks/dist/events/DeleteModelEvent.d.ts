import { IModel } from "../Model";
import { Event } from "./Event";
export declare class DeleteModelEvent extends Event {
    readonly model: IModel;
    constructor(model: IModel);
}
