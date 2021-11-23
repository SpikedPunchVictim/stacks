import { IType } from "./Type";
export interface IValue {
    readonly type: IType;
    /**
     * Determiens if this value and another value are equal
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
    /**
     * Converts the Value into its JS Object counterpart
     */
    toJs(): Promise<any>;
}
export declare abstract class Value implements IValue {
    readonly type: IType;
    constructor(type: IType);
    equals(other: IValue): boolean;
    set(value: IValue): IValue;
    toJs(): Promise<any>;
}
export declare abstract class BasicValue<T> extends Value {
    get value(): T;
    private _value;
    constructor(type: IType, value: T);
    set(value: IValue): IValue;
    toJs(): Promise<any>;
}
