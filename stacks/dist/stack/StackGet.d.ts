import { StackObject } from "../StackObject";
import { ICache } from "../Cache";
import { IModel } from "../Model";
import { IOrchestrator } from "../orchestrator/Orchestrator";
import { IStackContext } from "./StackContext";
export interface IStackGet {
    /**
     * Gets aModel by name
     *
     * @param name The name of the Model
     */
    model(name: string): Promise<IModel | undefined>;
    /**
     * Gets a Model by ID
     *
     * @param id The Model's ID
     */
    modelById(id: string): Promise<IModel | undefined>;
    /**
     * Gets all Models
     */
    models(): IModel[];
    /**
     * Gets a Model's Object
     *
     * @param modelName Model's name
     * @param id The Object's ID
     */
    object<T extends StackObject>(modelName: string, id: string): Promise<T | undefined>;
}
export declare class StackGet implements IStackGet {
    readonly context: IStackContext;
    get cache(): ICache;
    get orchestrator(): IOrchestrator;
    constructor(context: IStackContext);
    model(name: string): Promise<IModel | undefined>;
    modelById(id: string): Promise<IModel | undefined>;
    models(): IModel[];
    object<T extends StackObject>(modelName: string, id: string): Promise<T | undefined>;
}
