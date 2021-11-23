import { IOrchestrator } from "../orchestrator/Orchestrator";
import { IStackContext } from "../stack/StackContext";
import { IType, Type, TypeSet, ValidateResult } from "./Type";
import { Value } from "./Value";

export class ObjectRefType extends Type {
   get orchestrator(): IOrchestrator {
      return this.context.orchestrator
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
      if(typeof obj !== 'string') {
         return { success: false, error: new Error(`Type does not match. Expected 'string' for id and receieved '${typeof obj}'`)}
      }

      let id = obj as string

      let model = this.context.cache.getModel(this.modelName)

      if(model === undefined) {
         throw new Error(`Error encountered when validating an Object. No Model exists with the name ${this.modelName}.`)
      }

      let found = await this.orchestrator.getObject(model, id)

      if(found === undefined) {
         return { success: false, error: new Error(`The Object referenced (id: ${id}) doesn't exist`)}
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
}