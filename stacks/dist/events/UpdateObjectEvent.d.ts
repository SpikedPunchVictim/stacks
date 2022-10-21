import { StackObject } from "../StackObject";
import { IModel } from "../Model";
import { Event, ExistState } from "./Event";
import { IProxyObject } from "../ProxyObject";
export declare class UpdateObjectEvent<T extends StackObject> extends Event {
    readonly model: IModel;
    readonly object: T;
    readonly serialize: IProxyObject;
    get updated(): T | undefined;
    set updated(value: T | undefined);
    get exists(): ExistState;
    set exists(value: ExistState);
    private _exists;
    private _updated;
    constructor(model: IModel, object: T, serialize: IProxyObject);
}
