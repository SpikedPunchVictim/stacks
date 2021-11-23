import { BasicType, ValidateResult } from "./Type";
import { BasicValue } from "./Value";
export declare class StringType extends BasicType<number> {
    static readonly Singleton: StringType;
    constructor();
    validate<T>(obj: T): Promise<ValidateResult>;
}
export declare class StringValue extends BasicValue<string> {
    constructor(value?: string);
}
