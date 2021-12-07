import { ValueSerializer } from "../serialize/ValueSerializer";
import { BasicType, IType, ValidateResult } from "./Type";
import { BasicValue, IValue } from "./Value";
export declare class StringType extends BasicType<number> {
    static readonly Singleton: StringType;
    constructor();
    validate<T>(obj: T): Promise<ValidateResult>;
}
export declare class StringValue extends BasicValue<string> {
    constructor(value?: string);
    clone(): IValue;
}
export declare class StringSerializer extends ValueSerializer {
    constructor();
    toJs(value: IValue): Promise<any>;
    fromJs(type: IType, obj: any): Promise<IValue>;
}
