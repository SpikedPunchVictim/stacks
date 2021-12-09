import { StackObject } from "../StackObject";
import { ICache } from "../Cache";
import { IRequestForChangeSource } from "../events/RequestForChange";
import { IModel, PageRequest, PageResponse } from "../Model";
import { IStack } from "../stack/Stack";
import { IStackContext } from "../stack/StackContext";
import { UpdateObjectHandler } from "../stack/StackUpdate";
import { IUidKeeper } from "../UidKeeper";
import { IValueSerializer } from "../serialize/ValueSerializer";
export interface IOrchestrator {
    /**
     * Saves an Object to the backend.
     *
     * @param model The Model
     * @param obj The Object to Save
     */
    saveObject<T extends StackObject>(model: IModel, obj: T): Promise<void>;
    /**
     * Deletes an Object from the backend
     *
     * @param model The Model
     * @param obj The Object to delete
     */
    deleteObject<T extends StackObject>(model: IModel, obj: T): Promise<void>;
    /**
     * Retrieves many objects in a paged fashion.
     *
     * @param model The Model representing the Objects
     * @param options PageRequest Options
     */
    getManyObjects<T extends StackObject>(model: IModel, options: PageRequest): Promise<PageResponse<T>>;
    /**
     * Retrieves the Edit version of the Object
     *
     * @param model The Model of the Object
     * @param id The Object's ID
     */
    getObject<T extends StackObject>(model: IModel, id: string): Promise<T | undefined>;
    /**
     * Determines if an ID is already in use.
     *
     * @param id The ID to test
     */
    hasId(id: string): Promise<boolean>;
    /**
     * Updates the values of an Object
     *
     * @param model The Model of the Object
     * @param obj The Object to update
     * @param onUpdate Handler that is called after an Object has been updated
     */
    updateObject<T extends StackObject>(model: IModel, obj: T, onUpdate: UpdateObjectHandler<T>): Promise<void>;
}
export declare class Orchestrator implements IOrchestrator {
    readonly context: IStackContext;
    get cache(): ICache;
    get rfc(): IRequestForChangeSource;
    get serializer(): IValueSerializer;
    get stack(): IStack;
    get uid(): IUidKeeper;
    constructor(context: IStackContext);
    /**
     *
     * @param model The Model
     * @param obj The Object to save. Note that this is really a Proxy'd SerializableObject
     */
    saveObject<T extends StackObject>(model: IModel, obj: T): Promise<void>;
    getManyObjects<T extends StackObject>(model: IModel, options?: PageRequest): Promise<PageResponse<T>>;
    deleteObject<T extends StackObject>(model: IModel, obj: T): Promise<void>;
    getObject<T extends StackObject>(model: IModel, id: string): Promise<T | undefined>;
    hasId(id: string): Promise<boolean>;
    updateObject<T extends StackObject>(model: IModel, obj: T, onUpdate: UpdateObjectHandler<T>): Promise<void>;
}
