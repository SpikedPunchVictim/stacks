import { StackObject } from "../StackObject";
import { IModel } from "../Model";
import { Event } from "./Event";
export declare class DeleteObjectEvent<T extends StackObject> extends Event {
    readonly model: IModel;
    readonly object: T;
    constructor(model: IModel, object: T);
}
