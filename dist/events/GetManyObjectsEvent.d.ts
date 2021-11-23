import { IModel, PageRequest, PageResponse } from "../Model";
import { Event } from "./Event";
export declare class GetManyObjectsEvent<T> extends Event {
    readonly model: IModel;
    readonly options: PageRequest;
    results: PageResponse<T> | undefined;
    constructor(model: IModel, options: PageRequest);
}
