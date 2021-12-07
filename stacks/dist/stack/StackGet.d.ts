import { StackObject } from "../StackObject";
import { ICache } from "../Cache";
import { IModel } from "../Model";
import { IOrchestrator } from "../orchestrator/Orchestrator";
import { IStackContext } from "./StackContext";
export interface IStackGet {
    model(name: string): Promise<IModel | undefined>;
    modelById(id: string): Promise<IModel | undefined>;
    object<T extends StackObject>(modelName: string, id: string): Promise<T | undefined>;
}
export declare class StackGet implements IStackGet {
    readonly context: IStackContext;
    get cache(): ICache;
    get orchestrator(): IOrchestrator;
    constructor(context: IStackContext);
    model(name: string): Promise<IModel | undefined>;
    modelById(id: string): Promise<IModel | undefined>;
    object<T extends StackObject>(modelName: string, id: string): Promise<T | undefined>;
}
