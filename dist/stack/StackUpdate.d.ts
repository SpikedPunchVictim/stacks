import { StackObject } from "..";
import { ExistState } from "../events/Event";
import { IModel } from "../Model";
import { IOrchestrator } from "../orchestrator/Orchestrator";
import { IStackContext } from "./StackContext";
export declare type UpdateObjectHandler<T extends StackObject> = (updated: T | undefined, exist: ExistState) => Promise<void>;
export interface IStackUpdate {
    model(name: string): Promise<void>;
    object<T extends StackObject>(model: IModel, object: T, onUpdate: UpdateObjectHandler<T>): Promise<void>;
}
export declare class StackUpdate implements IStackUpdate {
    readonly context: IStackContext;
    get orchestrator(): IOrchestrator;
    constructor(context: IStackContext);
    model(name: string): Promise<void>;
    object<T extends StackObject>(model: IModel, object: T, onUpdate: UpdateObjectHandler<T>): Promise<void>;
}
