import { StackObject } from "./BondedObject";
import { IModel } from "./Model";
export interface ICache {
    getModel(name: string): IModel | undefined;
    getModelById(id: string): IModel | undefined;
    hasId(id: string): boolean;
    saveModel(model: IModel): void;
    saveObject<T extends StackObject>(model: IModel, obj: T): void;
    deleteObject<T extends StackObject>(model: IModel, obj: T): void;
    getObject<T extends StackObject>(model: IModel, id: string): T | undefined;
    getObjects<T extends StackObject>(model: IModel): T[];
}
export declare class Cache implements ICache {
    /**
     * Key: Model name
     * Value: Model
     */
    private cache;
    /**
     * Key: Model Name
     * Value: Object
     */
    private objects;
    constructor();
    getModel(name: string): IModel | undefined;
    getModelById(id: string): IModel | undefined;
    hasId(id: string): boolean;
    saveModel(model: IModel): void;
    saveObject<T extends StackObject>(model: IModel, obj: T): void;
    deleteObject<T extends StackObject>(model: IModel, obj: T): void;
    getObject<T extends StackObject>(model: IModel, id: string): T | undefined;
    getObjects<T extends StackObject>(model: IModel): T[];
}
