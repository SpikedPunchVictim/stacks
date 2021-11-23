import { StackObject } from "../BondedObject";
import { IModel } from "../Model";
import { Event } from "./Event";
export declare class CreateObjectEvent<T extends StackObject> extends Event {
    readonly model: IModel;
    readonly object: T;
    constructor(model: IModel, object: T);
}
