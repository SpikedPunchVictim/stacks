import { StackObject } from "..";
import { ICache } from "../Cache";
export interface IStackDelete {
    /**
     * Deletes a Model and all Objects associated with the Model
     *
     * @param name The name of the Model to delete
     */
    model(name: string): Promise<void>;
    /**
     * Deletes an Object
     *
     * @param object The Object to delete
     */
    object<T extends StackObject>(modelName: string, object: T): Promise<void>;
}
export declare class StackDelete implements IStackDelete {
    readonly cache: ICache;
    constructor(cache: ICache);
    model(name: string): Promise<void>;
    object<T extends StackObject>(modelName: string, object: T): Promise<void>;
}
