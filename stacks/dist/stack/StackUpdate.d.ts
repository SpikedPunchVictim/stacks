import { StackObject } from "../StackObject";
import { ExistState } from "../events/Event";
import { IModel } from "../Model";
import { IOrchestrator } from "../orchestrator/Orchestrator";
import { IStackContext } from "./StackContext";
import { ModelCreateParams } from "..";
export type UpdateObjectHandler<T extends StackObject> = (updated: T | undefined, exist: ExistState) => Promise<void>;
export interface IStackUpdate {
    /**
     * Updates a Model
     *
     * @param model The Model name or the Model to update
     * @param params The values to update
     */
    model(model: string | IModel, params: ModelCreateParams): Promise<void>;
    /**
     * Updates an Object
     *
     * @param model The Object's Model
     * @param object The Object to update
     * @param onUpdate Handler that gets called after the update
     */
    object<T extends StackObject>(model: IModel, object: T, onUpdate: UpdateObjectHandler<T>): Promise<void>;
}
export declare class StackUpdate implements IStackUpdate {
    readonly context: IStackContext;
    get orchestrator(): IOrchestrator;
    constructor(context: IStackContext);
    model(model: string | IModel, params: ModelCreateParams): Promise<void>;
    object<T extends StackObject>(model: IModel, object: T, onUpdate: UpdateObjectHandler<T>): Promise<void>;
}
