import { StackObject } from "../StackObject";
import { IModel } from "../Model";
import { Event } from "./Event";
import { IProxyObject } from "../ProxyObject";
export declare class ObjectSaveEvent<T extends StackObject> extends Event {
    readonly model: IModel;
    readonly object: T;
    readonly serialize: IProxyObject;
    constructor(model: IModel, object: T, serialize: IProxyObject);
}
