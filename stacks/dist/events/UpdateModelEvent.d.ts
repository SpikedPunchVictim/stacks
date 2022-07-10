import { IModel } from "../Model";
import { Event } from "./Event";
export declare class UpdateModelEvent extends Event {
    readonly model: IModel;
    constructor(model: IModel);
}
