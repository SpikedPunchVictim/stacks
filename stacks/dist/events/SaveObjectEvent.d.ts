import { StackObject } from "../StackObject";
import { IModel } from "../Model";
import { Event } from "./Event";
import { IProxyObject } from "../ProxyObject";
export declare class SaveObjectEvent<T extends StackObject> extends Event {
    readonly model: IModel;
    readonly obj: T;
    readonly serialize: IProxyObject;
    constructor(model: IModel, obj: T, serialize: IProxyObject);
}
