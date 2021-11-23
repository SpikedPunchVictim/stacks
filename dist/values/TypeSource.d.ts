import { IStackContext } from "../stack/StackContext";
import { BoolType } from "./Bool";
import { IntType } from "./Int";
import { StringType } from "./String";
import { IType } from "./Type";
import { UIntType } from "./UInt";
export declare type CreateTypeHandler = (converter: TypeSource) => IType;
export interface ITypeSource {
    readonly bool: BoolType;
    readonly int: IntType;
    readonly uint: UIntType;
    readonly string: StringType;
    list(itemType: IType): IType;
    ref(modelName: string): IType;
}
export declare class TypeSource {
    private readonly context;
    readonly bool: BoolType;
    readonly int: IntType;
    readonly uint: UIntType;
    readonly string: StringType;
    constructor(context: IStackContext);
    list(itemType: IType): IType;
    ref(modelName: string): IType;
}
