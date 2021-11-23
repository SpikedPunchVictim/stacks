import { BasicType, ValidateResult } from "./Type";
import { BasicValue } from "./Value";
export declare class UIntType extends BasicType<number> {
    static readonly Singleton: UIntType;
    constructor();
    validate<T>(obj: T): Promise<ValidateResult>;
}
export declare class UIntValue extends BasicValue<number> {
    constructor(value?: number);
}
