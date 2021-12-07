import { IType, TypeSet } from "../values/Type";
import { IValue } from "../values/Value";
export interface IValueSerializer {
    toJs(value: IValue): Promise<any>;
    fromJs(type: IType, obj: any): Promise<IValue>;
}
export declare abstract class ValueSerializer implements IValueSerializer {
    readonly typeSet: TypeSet;
    constructor(typeSet: TypeSet);
    toJs(value: IValue): Promise<any>;
    fromJs(type: IType, obj: any): Promise<IValue>;
    protected validate(type: IType): void;
}
export declare class CompositeSerializer implements IValueSerializer {
    private serializerMap;
    constructor();
    register(type: TypeSet, serializer: IValueSerializer): void;
    toJs(value: IValue): Promise<any>;
    fromJs(type: IType, obj: any): Promise<IValue>;
}
