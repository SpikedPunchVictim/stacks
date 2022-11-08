import { IModel, ModelCreateParams, SymbolEntry } from "./Model";
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
    readonly model: IModel;
    readonly type: IType;
    name: string;
    symbols: SymbolEntry[];
    value: IValue;
}
export declare class Member implements IMember {
    readonly id: string;
    readonly name: string;
    readonly model: IModel;
    get type(): IType;
    symbols: SymbolEntry[];
    value: IValue;
    constructor(id: string, name: string, model: IModel, value: IValue, symbols?: SymbolEntry[]);
    /**
     * Creates an Array of Members from the ModelCreate Parameters
     *
     * @param params The ModelCreate parameters
     * @param model The Parent Model
     * @param createContext The ValueCreateContext
     * @param context The StackContext
     * @returns An Array of Members based on the ModelCreate
     */
    static create(params: ModelCreateParams, model: IModel, createContext: ValueCreateContext, context: IStackContext): IMember[];
}
