import { ModelCreateParams, SymbolEntry } from "./Model";
import { IStackContext } from "./stack/StackContext";
import { IType } from "./values/Type";
import { CreateTypeHandler } from "./values/TypeSource";
import { IValue } from "./values/Value";
import { ValueCreateContext, ValueCreateParams } from "./values/ValueSource";
export declare type MemberInfo = {
    type: IType | CreateTypeHandler;
    value: MemberValue;
    symbols?: SymbolEntry[];
};
export declare type MemberValue = ValueCreateParams | MemberInfo;
/**
 * This interface represents the data structure storing an individual
 * Member in a Model
 */
export interface IMember {
    readonly id: string;
    readonly type: IType;
    name: string;
    symbols: SymbolEntry[];
    value: IValue;
}
export declare class Member implements IMember {
    readonly id: string;
    readonly name: string;
    get type(): IType;
    symbols: SymbolEntry[];
    value: IValue;
    constructor(id: string, name: string, value: IValue, symbols?: SymbolEntry[]);
    /**
     * Creates an Array of Members from the ModelCreate Parameters
     *
     * @param obj The ModelCreate parameters
     * @param createContext The ValueCreateContext
     * @param context The StackContext
     * @returns An Array of Members based on the ModelCreate
     */
    static create(obj: ModelCreateParams, createContext: ValueCreateContext, context: IStackContext): IMember[];
}
