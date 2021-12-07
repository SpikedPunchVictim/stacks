import { ValueSerializer } from "../serialize/ValueSerializer";
import { BasicType, IType, ValidateResult } from "./Type";
import { BasicValue, IValue } from "./Value";
export declare class UIntType extends BasicType<number> {
    static readonly Singleton: UIntType;
    constructor();
    validate<T>(obj: T): Promise<ValidateResult>;
}
export declare class UIntValue extends BasicValue<number> {
    constructor(value?: number);
    clone(): IValue;
    deserialize(value: any): Promise<IValue>;
}
export declare class UIntSerializer extends ValueSerializer {
    constructor();
    toJs(value: IValue): Promise<any>;
    fromJs(type: IType, obj: any): Promise<IValue>;
}
