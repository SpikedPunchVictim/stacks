import { IValueSerializer, ValueSerializer } from "../serialize/ValueSerializer";
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
    readonly serializer: IValueSerializer;
    private items;
    constructor(itemType: IType, serializer: IValueSerializer);
    [Symbol.iterator](): Iterator<IValue>;
    at(index: number): IValue | undefined;
    clear(): void;
    clone(): IValue;
    equals(other: IValue): boolean;
    push(...items: IValue[]): number;
    set(value: IValue): IValue;
    toJs(): Promise<any>;
}
export declare class ListSerializer extends ValueSerializer {
    readonly serializer: IValueSerializer;
    constructor(serializer: IValueSerializer);
    toJs(value: IValue): Promise<any>;
    fromJs(type: IType, obj: any): Promise<IValue>;
}
