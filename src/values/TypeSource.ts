import { IStackContext } from "../stack/StackContext";
import { BoolType } from "./Bool";
import { IntType } from "./Int";
import { ListType } from "./List";
import { ObjectRefType } from "./ObjectRef";
import { StringType } from "./String";
import { IType } from "./Type";
import { UIntType } from "./UInt";

export type CreateTypeHandler = (converter: TypeSource) => IType

export interface ITypeSource {
   readonly bool: BoolType
   readonly int: IntType
   readonly uint: UIntType
   readonly string: StringType
   
   list(itemType: IType): IType
   ref(modelName: string): IType
}

export class TypeSource {
   readonly bool: BoolType = BoolType.Singleton
   readonly int: IntType = IntType.Singleton
   readonly uint: UIntType = UIntType.Singleton
   readonly string: StringType = StringType.Singleton

   constructor(
      private readonly context: IStackContext
   ) {

   }

   list(itemType: IType): IType {
      return new ListType(itemType)
   }

   ref(modelName: string): IType {
      return new ObjectRefType(modelName, this.context)
   }
}