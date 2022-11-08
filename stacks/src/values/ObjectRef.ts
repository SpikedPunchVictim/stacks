import { IOrchestrator } from "../orchestrator/Orchestrator";
import { ProxyObject } from "../ProxyObject";
import { ValueSerializer } from "../serialize/ValueSerializer";
import { IStackContext } from "../stack/StackContext";
import { isStackObject, StackObject } from "../StackObject";
import { UidKeeper } from "../UidKeeper";
import { IType, Type, TypeInfo, TypeSet, ValidateResult } from "./Type";
import { IValue, Value } from "./Value";

export class ObjectRefType extends Type {
   get orchestrator(): IOrchestrator {
      return this.context.orchestrator
   }

   get info(): TypeInfo {
      return {
         type: this.type,
         modelName: this.modelName
      }
   }

   constructor(readonly modelName: string, readonly context: IStackContext) {
      super(TypeSet.ObjectRef)
   }

   equals(other: IType): boolean {
      if(other.type !== TypeSet.ObjectRef) {
         return false
      }

      let cast = other as ObjectRefType

      if(cast.modelName.toLowerCase() !== this.modelName.toLowerCase()) {
         return false
      }

      return true
   }

   async validate<T>(obj: T): Promise<ValidateResult> {
      if(typeof obj !== 'object') {
         return { success: false, error: new Error(`Type does not match. Expected 'object' for a reference type but receieved '${typeof obj}'`)}
      }

      if(!isStackObject(obj)) {
         return { success: false, error: new Error(`The Object is expected to be a StackObject.`)}
      }

      return { success: true }
   }
}

export class ObjectRefValue extends Value {
   id: string

   constructor(modelName: string, id: string, context: IStackContext) {
      super(new ObjectRefType(modelName, context))
      this.id = id
   }

   clone(): IValue {
      let refType = this.type as ObjectRefType
      return new ObjectRefValue(refType.modelName, this.id, refType.context)
   }
}

export class ObjectRefSerializer extends ValueSerializer {
   constructor(readonly context: IStackContext) {
      super(TypeSet.ObjectRef)
   }

   async toJs(value: IValue): Promise<any> {
      this.validate(value.type)

      let type = value.type as ObjectRefType
      let objRef = value as ObjectRefValue
      
      let model = this.context.cache.getModel(type.modelName)

      if(model === undefined) {
         throw new Error(`Encountered an error when serializing an ObjectRef. The Model referenced (${type.modelName}) does not exist.`)
      }

      if(objRef.id === UidKeeper.IdNotSet) {
         return await ProxyObject.fromModel(model, this.context)
      }

      return await this.context.orchestrator.getObject(model, objRef.id)
   }

   async fromJs(type: IType, obj: any): Promise<IValue> {
      this.validate(type)

      let castObj = obj as StackObject
      let castType = type as ObjectRefType
      let model = this.context.cache.getModel(castType.modelName)

      if(model === undefined) {
         throw new Error(`Error encountered while trying to serialize an edited value (ObjectRef). The Model (${castType.modelName}) does not exist.`)
      }

      return new ObjectRefValue(castType.modelName, castObj.id, this.context)
   }
}
