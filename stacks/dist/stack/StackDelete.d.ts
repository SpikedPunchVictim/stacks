import { StackObject } from "..";
import { ICache } from "../Cache";
import { IOrchestrator } from "../orchestrator/Orchestrator";
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
    readonly orchestrator: IOrchestrator;
    constructor(cache: ICache, orchestrator: IOrchestrator);
    model(name: string): Promise<void>;
    object<T extends StackObject>(modelName: string, object: T): Promise<void>;
}
