import { StackObject } from "..";
import { IModel } from "../Model";
import { Event } from "./Event";
export declare class CommitObjectEvent<T extends StackObject> extends Event {
    readonly model: IModel;
    readonly obj: T;
    constructor(model: IModel, obj: T);
}
