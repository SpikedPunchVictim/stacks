import { IModel } from "../Model";
import { Event, ExistState } from "./Event";
export declare class GetObjectEvent<T> extends Event {
    readonly model: IModel;
    readonly id: string;
    get object(): T | undefined;
    set object(value: T | undefined);
    exists: ExistState;
    private _object;
    constructor(model: IModel, id: string);
}
