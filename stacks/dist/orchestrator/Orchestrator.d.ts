import { StackObject } from "../StackObject";
import { ICache } from "../Cache";
import { IModel, ModelCreateParams, ObjectCreateParams, PageRequest, PageResponse } from "../Model";
import { ApplyStoreContextHandler, IStack } from "../stack/Stack";
import { IStackContext } from "../stack/StackContext";
import { UpdateObjectHandler } from "../stack/StackUpdate";
import { IUidKeeper } from "../UidKeeper";
import { IValueSerializer } from "../serialize/ValueSerializer";
import { IRequestForChangeSource } from '../events';
export interface IOrchestrator {
    /**
     * Bootstraps the Stack.
     */
    boostrap(): Promise<void>;
    /**
     * Creates a Model
     *
     * @param name The name of the Model
     * @param params The Params used to create the Model
     */
    createModel(name: string, params: ModelCreateParams): Promise<IModel>;
    /**
     * Deletes a Model
     *
     * @param model The Model to delete
     */
    deleteModel(model: IModel): Promise<void>;
    /**
     * Retrieves a Model if it exists, or undefiend if not.
     *
     * @param name The Model name
     */
    getModel(name: string): Promise<IModel | undefined>;
    /**
     * Updates an existing Model
     *
     * @param model The Model to update
     * @param params The Params
     */
    updateModel(model: IModel, params: ModelCreateParams): Promise<void>;
    /**
     * Creates a new Object in memory only. Not indended to be stored on the backend.
     * Objects created this way have no ID assigned to them until they are saved.
     *
     * @param model The Model
     * @param params The Object Creation Params
     */
    createObject<T extends StackObject>(model: IModel, params: ObjectCreateParams): Promise<T>;
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
     * @param model The associated Model
     */
    hasId(id: string, model: IModel): Promise<boolean>;
    /**
     * Creates and stores a custom Query Object
     *
     * @param handler The handler to create the custom Query Object
     */
    storeQueryObject<T>(handler: ApplyStoreContextHandler<T>): Promise<T | undefined>;
    /**
     * Updates an already existing object with the latest from the stored version.
     * This method is intended to be used on long lived objects where we want them
     * to be updated locally, and not saved.
     *
     * @param model The Model
     * @param obj The Object
     * @param onUpdate Function to update the Object based on the latest version
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
    boostrap(): Promise<void>;
    createModel(name: string, params: ModelCreateParams): Promise<IModel>;
    deleteModel(model: IModel): Promise<void>;
    getModel(name: string): Promise<IModel | undefined>;
    updateModel(model: IModel, params: ModelCreateParams): Promise<void>;
    createObject<T extends StackObject>(model: IModel, params: ObjectCreateParams): Promise<T>;
    /**
     *
     * @param model The Model
     * @param obj The Object to save. Note that this is really a Proxy'd SerializableObject
     */
    saveObject<T extends StackObject>(model: IModel, obj: T): Promise<void>;
    getManyObjects<T extends StackObject>(model: IModel, options?: PageRequest): Promise<PageResponse<T>>;
    deleteObject<T extends StackObject>(model: IModel, obj: T): Promise<void>;
    getObject<T extends StackObject>(model: IModel, id: string): Promise<T | undefined>;
    hasId(id: string, model: IModel): Promise<boolean>;
    storeQueryObject<T>(handler: ApplyStoreContextHandler<T>): Promise<T | undefined>;
    /**
     * Updates an already existing object with the latest from the stored version.
     * This method is intended to be used on long lived objects where we want them
     * to be updated locally, and not saved.
     *
     * @param model The Model
     * @param obj The Object
     * @param onUpdate Function to update the Object based on the latest version
     */
    updateObject<T extends StackObject>(model: IModel, obj: T, onUpdate: UpdateObjectHandler<T>): Promise<void>;
}
