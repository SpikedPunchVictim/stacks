import { ModelCreateContext, ModelCreateParams, ModelProperty, SymbolEntry } from "./Model";
import { IStackContext } from "./stack/StackContext";
import { IType } from "./values/Type";
import { IValue } from "./values/Value";
import { ValueCreateParams } from "./values/ValueSource";
export declare type MemberValue = ValueCreateParams | ModelProperty;
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
     * @param createContext The ModelCreateContext
     * @param context The StackContext
     * @returns An Array of Members based on the ModelCreate
     */
    static create(obj: ModelCreateParams, createContext: ModelCreateContext, context: IStackContext): IMember[];
}
