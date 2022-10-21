import { IModel } from "../Model";
import { IStackContext } from "../stack/StackContext";
import { BoolValue } from "./Bool";
import { IntValue } from "./Int";
import { ListValue } from "./List";
import { ObjectRefValue } from "./ObjectRef";
import { StringValue } from "./String";
import { IType } from "./Type";
import { CreateTypeHandler, TypeCreateParams } from "./TypeSource";
import { UIntValue } from "./UInt";
import { IValue } from "./Value";
export declare type ValueCreateContext = {
    model?: IModel;
};
export declare type CreateValueHandler = (value: IValueSource, ctx?: ValueCreateContext) => IValue | IValue[];
export declare type ValueCreateParams = boolean | number | string | any[] | CreateValueHandler;
export declare type NormalizedType = {
    [key: string]: IType;
};
export interface IValueSource {
    bool(value: boolean): BoolValue;
    int(value: number): IntValue;
    list(itemType: CreateTypeHandler): ListValue;
    ref(modelName: string, id?: string): ObjectRefValue;
    string(value: string): StringValue;
    uint(value: number): UIntValue;
}
export declare class ValueSource implements IValueSource {
    readonly context: IStackContext;
    constructor(context: IStackContext);
    /**
     * Wraps an IValueSource in a Proxy.
     *
     * Note:
     * This is necessary since it turns out that when we use destructuring
     * for defining Models, the 'this' pointer inside of any methods being called
     * on the IValueSource, loses its scope, and becomes 'undefined'.
     * To work around this, a Proxy is used instead that retains
     * the 'this' pointer regardless how/when destructuring is used.
     *
     * @param values The IValueSource to wrap
     * @returns A Proxy'd IValueSource
     */
    static toProxy(values: IValueSource): IValueSource;
    /**
     * Resolves a set of ValueParams into a Value
     *
     * @param source The ParamS
     * @param context StackContext
     * @param createContext Creation context if available
     * @param coercedType IF the type is known ahead of time, this can help determine the Type mopre accurately
     * @returns
     */
    static resolve(source: ValueCreateParams, context: IStackContext, createContext?: ValueCreateContext, coercedType?: IType): IValue;
    bool(value?: boolean): BoolValue;
    int(value?: number): IntValue;
    list(itemType: TypeCreateParams): ListValue;
    ref(modelName: string, id?: string): ObjectRefValue;
    string(value?: string): StringValue;
    uint(value?: number): UIntValue;
}
