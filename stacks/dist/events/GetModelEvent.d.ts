import { IModel, ModelCreateParams } from "../Model";
import { Event, ExistState } from "./Event";
export declare class GetModelEvent extends Event {
    readonly name: string;
    readonly params: ModelCreateParams[];
    /**
     * The serialized version of the Object
     */
    get model(): IModel | undefined;
    set model(value: IModel | undefined);
    get id(): string;
    exists: ExistState;
    private _model;
    private _id;
    constructor(name: string);
    setId(id: string): GetModelEvent;
}
