import { IType } from "./Type";
export interface IValue {
    readonly type: IType;
    /**
     * Makes a clone of this Value
     */
    clone(): IValue;
    /**
     * Determines if this value and another value are equal
     *
     * @param other The other value to compare
     */
    equals(other: IValue): boolean;
    /**
     * Sets the value to the new value.
     *
     * Note: This is not an async function. Setting values
     * should be synchronous. Any validation should be done
     * when validate() is called.
     * @param value The value to set
     */
    set(value: IValue): IValue;
}
export declare abstract class Value implements IValue {
    readonly type: IType;
    constructor(type: IType);
    clone(): IValue;
    equals(other: IValue): boolean;
    set(value: IValue): IValue;
}
export declare abstract class BasicValue<T> extends Value {
    get value(): T;
    private _value;
    constructor(type: IType, value: T);
    clone(): IValue;
    set(value: IValue): IValue;
}
