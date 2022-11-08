import { IOrchestrator } from "../orchestrator/Orchestrator";
import { ValueSerializer } from "../serialize/ValueSerializer";
import { IStackContext } from "../stack/StackContext";
import { IType, Type, TypeInfo, ValidateResult } from "./Type";
import { IValue, Value } from "./Value";
export declare class ObjectRefType extends Type {
    readonly modelName: string;
    readonly context: IStackContext;
    get orchestrator(): IOrchestrator;
    get info(): TypeInfo;
    constructor(modelName: string, context: IStackContext);
    equals(other: IType): boolean;
    validate<T>(obj: T): Promise<ValidateResult>;
}
export declare class ObjectRefValue extends Value {
    id: string;
    constructor(modelName: string, id: string, context: IStackContext);
    clone(): IValue;
}
export declare class ObjectRefSerializer extends ValueSerializer {
    readonly context: IStackContext;
    constructor(context: IStackContext);
    toJs(value: IValue): Promise<any>;
    fromJs(type: IType, obj: any): Promise<IValue>;
}
