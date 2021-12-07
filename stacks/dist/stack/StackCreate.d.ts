import { StackObject } from "..";
import { IModel, ModelCreateParams, ObjectCreateParams } from "../Model";
import { IStackContext } from "./StackContext";
import { IStackGet } from "./StackGet";
export interface IStackCreate {
    /**
     * Creates a Model
     *
     * @param name The name of the Model
     * @param obj The initialized values
     */
    model(name: string, obj?: ModelCreateParams): Promise<IModel>;
    /**
     * Creates an Object based on a Model
     *
     * @param modelName The name of the Model used to create the Object
     */
    object<T extends StackObject>(modelName: string, obj: ObjectCreateParams): Promise<T>;
}
export declare class StackCreate implements IStackCreate {
    readonly get: IStackGet;
    readonly context: IStackContext;
    private get cache();
    private get uid();
    constructor(get: IStackGet, context: IStackContext);
    model(name: string, obj?: ModelCreateParams): Promise<IModel>;
    object<T extends StackObject>(modelName: string, obj: ObjectCreateParams): Promise<T>;
}
