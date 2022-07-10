import { IModel } from "../Model";
import { StackObject } from "../StackObject";
import { Event, ExistState } from "./Event";
export declare class GetObjectEvent<T extends StackObject> extends Event {
    readonly model: IModel;
    readonly id: string;
    /**
     * The serialized version of the Object
     */
    get object(): T | undefined;
    set object(value: T | undefined);
    exists: ExistState;
    private _object;
    constructor(model: IModel, id: string);
}
