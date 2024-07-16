import { IStackContext } from "../stack/StackContext";
import { BoolType } from "./Bool";
import { IntType } from "./Int";
import { StringType } from "./String";
import { IType } from "./Type";
import { UIntType } from "./UInt";
export type TypeCreateParams = boolean | number | string | any[] | IType | CreateTypeHandler;
export type CreateTypeHandler = (converter: TypeSource) => IType;
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
    /**
     * Resolves a Type based on the raw Type data.
     *
     * Supported cases
     *    : Bool - BoolType, & true/false
     *    : Int -
     *       * IntType
     *       * A number. All raw numbers are assigned the Int Type
     *    : List
     *       * ListType
     *       * A JS Array [] with 1 element. The first (and only) element determines the List ItemType.
     *    : ObjectRef
     *       * ObjectRefType
     *    : String
     *       * StringType
     *       * Raw string
     *    : UInt
     *       * UIntType
     *    : CreateTypeHandler which resolves to the Type
     *
     *
     * @param source The raw Type information
     * @param context Stack Context
     * @returns The Type
     */
    static resolve(source: TypeCreateParams, context: IStackContext): IType;
    list(itemType: TypeCreateParams): IType;
    ref(modelName: string): IType;
}
