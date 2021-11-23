import { ModelCreateContext } from "../Model";
import { IStackContext } from "../stack/StackContext";
import { BoolValue } from "./Bool";
import { IntValue } from "./Int";
import { ListValue } from "./List";
import { ObjectRefValue } from "./ObjectRef";
import { StringValue } from "./String";
import { IType } from "./Type";
import { UIntValue } from "./UInt";
import { IValue } from "./Value";
export declare type CreateValueHandler = (value: ValueSource) => IValue;
export declare type ValueCreateParams = boolean | number | string | CreateValueHandler;
export declare type NormalizedType = {
    [key: string]: IType;
};
export interface IValueSource {
    bool(value: boolean): BoolValue;
    int(value: number): IntValue;
    list(itemType: IType): ListValue;
    ref(modelName: string, id: string): ObjectRefValue;
    string(value: string): StringValue;
    uint(value: number): UIntValue;
}
export declare class ValueSource implements IValueSource {
    readonly context: IStackContext;
    constructor(context: IStackContext);
    static resolve(source: ValueCreateParams, context: IStackContext, createContext?: ModelCreateContext): IValue;
    bool(value?: boolean): BoolValue;
    int(value?: number): IntValue;
    list(itemType: IType): ListValue;
    ref(modelName: string, id: string): ObjectRefValue;
    string(value?: string): StringValue;
    uint(value?: number): UIntValue;
}
