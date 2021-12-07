import { ValueSerializer } from "../serialize/ValueSerializer";
import { BasicType, IType, ValidateResult } from "./Type";
import { BasicValue, IValue } from "./Value";
export declare class IntType extends BasicType<number> {
    static readonly Singleton: IntType;
    constructor();
    validate<T>(obj: T): Promise<ValidateResult>;
}
export declare class IntValue extends BasicValue<number> {
    constructor(value?: number);
    clone(): IValue;
    deserialize(value: any): Promise<IValue>;
}
export declare class IntSerializer extends ValueSerializer {
    constructor();
    toJs(value: IValue): Promise<any>;
    fromJs(type: IType, obj: any): Promise<IValue>;
}
