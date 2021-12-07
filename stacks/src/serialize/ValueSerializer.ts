import { IType, TypeSet } from "../values/Type";
import { IValue } from "../values/Value";


export interface IValueSerializer {
   toJs(value: IValue): Promise<any>
   fromJs(type: IType, obj: any): Promise<IValue>
}

export abstract class ValueSerializer implements IValueSerializer {
   constructor(readonly typeSet: TypeSet) {

   }

   toJs(value: IValue): Promise<any> {
      throw new Error("toJs() not implemented.");
   }

   fromJs(type: IType, obj: any): Promise<IValue> {
      throw new Error("fromJs() not implemented.");
   }

   protected validate(type: IType): void {
      if(this.typeSet !== type.type) {
         throw new Error(`Invalid Type encountered when serializing`)
      }
   }
}

export class CompositeSerializer implements IValueSerializer {
   private serializerMap: Map<TypeSet, IValueSerializer> = new Map<TypeSet, IValueSerializer>()

   constructor() {

   }

   register(type: TypeSet, serializer: IValueSerializer): void {
      this.serializerMap.set(type, serializer)
   }
   
   async toJs(value: IValue): Promise<any> {
      let serializer = this.serializerMap.get(value.type.type)

      if(serializer === undefined) {
         throw new Error(`Unsupported Type (${value.type.type}) encountered when serializing toJs`)
      }

      return await serializer.toJs(value)
   }

   async fromJs(type: IType, obj: any): Promise<IValue> {
      let serializer = this.serializerMap.get(type.type)

      if(serializer === undefined) {
         throw new Error(`Unsupported Type (${type.type}) encountered when serializing fromJs`)
      }

      return await serializer.fromJs(type, obj)
   }
}