import { IType, Type, ValidateResult } from "./Type";
import { IValue, Value } from "./Value";
export declare class ListType extends Type {
    readonly itemType: IType;
    constructor(itemType: IType);
    equals(other: IType): boolean;
    validate<T>(obj: T): Promise<ValidateResult>;
}
export declare class ListValue extends Value {
    readonly itemType: IType;
    private items;
    constructor(itemType: IType);
    [Symbol.iterator](): Iterator<IValue>;
    at(index: number): IValue | undefined;
    clear(): void;
    equals(other: IValue): boolean;
    push(...items: IValue[]): number;
    set(value: IValue): IValue;
    toJs(): Promise<any>;
}
