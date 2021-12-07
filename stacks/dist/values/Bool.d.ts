import { ValueSerializer } from "../serialize/ValueSerializer";
import { BasicType, IType, ValidateResult } from "./Type";
import { BasicValue, IValue } from "./Value";
export declare class BoolType extends BasicType<boolean> {
    static readonly Singleton: BoolType;
    constructor();
    validate<T>(obj: T): Promise<ValidateResult>;
}
export declare class BoolValue extends BasicValue<boolean> {
    constructor(value?: boolean);
    clone(): IValue;
    deserialize(value: any): Promise<IValue>;
}
export declare class BoolSerializer extends ValueSerializer {
    constructor();
    toJs(value: IValue): Promise<any>;
    fromJs(type: IType, obj: any): Promise<IValue>;
}
