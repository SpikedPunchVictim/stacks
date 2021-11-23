import { IOrchestrator } from "../orchestrator/Orchestrator";
import { IStackContext } from "../stack/StackContext";
import { IType, Type, ValidateResult } from "./Type";
import { Value } from "./Value";
export declare class ObjectRefType extends Type {
    readonly modelName: string;
    readonly context: IStackContext;
    get orchestrator(): IOrchestrator;
    constructor(modelName: string, context: IStackContext);
    equals(other: IType): boolean;
    validate<T>(obj: T): Promise<ValidateResult>;
}
export declare class ObjectRefValue extends Value {
    id: string;
    constructor(modelName: string, id: string, context: IStackContext);
}
