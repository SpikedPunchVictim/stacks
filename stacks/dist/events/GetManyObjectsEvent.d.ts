import { IModel, PageRequest, PageResponse } from "../Model";
import { Event } from "./Event";
export declare class GetManyObjectsEvent<T> extends Event {
    readonly model: IModel;
    readonly page: PageRequest;
    results: PageResponse<T> | undefined;
    /**
     * Gets a flag that determines if the provided cursor was found.
     * The default beahvior when the cursor is not found is to return
     * data from the beginning of the set.
     */
    wasCursorFound: boolean;
    constructor(model: IModel, page: PageRequest);
}
