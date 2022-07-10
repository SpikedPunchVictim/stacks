import { StackObject } from "./StackObject";
import { IModel } from "./Model";
export interface ICache {
    /**
     * Gets a list of defined Models
     */
    readonly models: IModel[];
    /**
     * Deletes a Model from the cache
     *
     * @param name The Model's name
     */
    deleteModel(name: string): void;
    /**
     * Gets a Model by name
     *
     * @param name The Model's name
     */
    getModel(name: string): IModel | undefined;
    /**
     * Gets a Model by ID
     *
     * @param id The Model's ID
     */
    getModelById(id: string): IModel | undefined;
    /**
     * Searches the Cache for an ID
     *
     * @param id The ID to search for
     */
    hasId(id: string): boolean;
    /**
     * Stores a Model in the cache
     *
     * @param model The Model to store
     */
    saveModel(model: IModel): void;
    /**
     * Stores an Object in the cache
     *
     * @param model The Object's Model
     * @param obj The Object to Store. This is an ProxyObject
     */
    saveObject<T extends StackObject>(model: IModel, obj: T): void;
    /**
     * Deletes an Object from the cache
     *
     * @param model The Object's Model
     * @param obj The Object to delete
     */
    deleteObject<T extends StackObject>(model: IModel, obj: T): void;
    /**
     * Gets an Object (ProxyObject) from the Cache
     *
     * @param model The Object's Model
     * @param id The Object's ID
     */
    getObject<T extends StackObject>(model: IModel, id: string): T | undefined;
    /**
     * Gets many Objects (ProxyObjects) from the cache based on the Model
     *
     * @param model The Model of the Objects
     */
    getObjects<T extends StackObject>(model: IModel): T[];
}
export declare class Cache implements ICache {
    get models(): IModel[];
    /**
     * Key: Model name
     * Value: Model
     */
    private modelMap;
    /**
     * Key: Model Name
     * Value: Object
     */
    private objects;
    constructor();
    deleteModel(name: string): void;
    getModel(name: string): IModel | undefined;
    getModelById(id: string): IModel | undefined;
    hasId(id: string): boolean;
    saveModel(model: IModel): void;
    saveObject<T extends StackObject>(model: IModel, obj: T): void;
    deleteObject<T extends StackObject>(model: IModel, obj: T): void;
    getObject<T extends StackObject>(model: IModel, id: string): T | undefined;
    getObjects<T extends StackObject>(model: IModel): T[];
}
