import { BasicType, ValidateResult } from "./Type";
import { BasicValue } from "./Value";
export declare class IntType extends BasicType<number> {
    static readonly Singleton: IntType;
    constructor();
    validate<T>(obj: T): Promise<ValidateResult>;
}
export declare class IntValue extends BasicValue<number> {
    constructor(value?: number);
}
