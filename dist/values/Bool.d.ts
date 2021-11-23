import { BasicType, ValidateResult } from "./Type";
import { BasicValue } from "./Value";
export declare class BoolType extends BasicType<boolean> {
    static readonly Singleton: BoolType;
    constructor();
    validate<T>(obj: T): Promise<ValidateResult>;
}
export declare class BoolValue extends BasicValue<boolean> {
    constructor(value?: boolean);
}
