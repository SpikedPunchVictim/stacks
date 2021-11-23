import { IMemberCollection, MemberCollection } from "./collections/MemberCollection";
import { IOrchestrator } from "./orchestrator/Orchestrator";
import { IStackContext } from "./stack/StackContext";
import { IType, ValidationReport } from "./values/Type";
import { CreateValueHandler, ValueSource } from "./values/ValueSource";
import { CreateTypeHandler } from "./values/TypeSource";
import { MemberValue } from "./Member";
import { StackObject } from ".";

export type ObjectCreateParams = {
   [key: string]: boolean | number | string | CreateValueHandler
}

export type ModelCreateParams = {
   [key: string]: string | number | boolean | CreateValueHandler | ModelProperty
}

export type ModelCreateContext = {
   model: IModel  // The Model being created
}

export type SymbolEntry = {
   name: string,
   value: any
}

export type ModelProperty = {
   type: IType | CreateTypeHandler,
   value: MemberValue,
   symbols: SymbolEntry[]
}

export type PageResponse<T> = {
   cursor: string
   items: T[]
}

export type PageRequest = {
   cursor?: string
   limit?: number
}

export interface IModel {
   readonly id: string
   readonly name: string

   readonly members: IMemberCollection

   /**
    * Appends additional Members to the Model
    * 
    * @param obj The additional members to add
    */
   append(obj: ModelCreateParams): Promise<void>

   /**
    * Commits the object to storage
    * 
    * @param object The object to commit
    */
   commit<T extends StackObject>(object: T): Promise<void>

   /**
    * Creates a new Object based on this Model
    */
   create<T>(obj: ObjectCreateParams): Promise<T>

   /**
    * Deletes an object derived from this Model
    * 
    * @param object The object to delete
    */
   delete<T extends StackObject>(object: T): Promise<void>

   /**
    * Retrieves an instance by ID
    * 
    * @param id The ID of the instance
    */
   get<T extends StackObject>(id: string): Promise<T | undefined>

   /**
    * Gets many Objects
    * 
    * @param req The PagedRequest 
    */
   getMany<T>(req?: PageRequest): Promise<PageResponse<T>>

   /**
    * Converts the Model into a JS object
    */
   toJs<T>(): Promise<T>

   /**
    * Validates an Object against the Model's schema
    * 
    * @param obj The Object to validate
    */
   validate<T>(obj: T): Promise<ValidationReport>
}

export class Model implements IModel {
   readonly id: string
   readonly name: string
   readonly context: IStackContext

   private get orchestrator(): IOrchestrator {
      return this.context.orchestrator
   }

   readonly members: IMemberCollection

   constructor(name: string, id: string, context: IStackContext) {
      this.name = name
      this.id = id
      this.context = context

      this.members = new MemberCollection(this, this.context)
   }

   async append(obj: ModelCreateParams): Promise<void> {
      return this.members.append(obj)
   }

   async commit<T extends StackObject>(obj: T): Promise<void> {
      await this.orchestrator.commitObject<T>(this, obj)
   }

   async create<T>(obj: ObjectCreateParams): Promise<T> {
      let result = {}

      for (let key of Object.keys(obj)) {
         let value = ValueSource.resolve(obj[key], this.context)
         result[key] = value.toJs()
      }

      for (let member of this.members) {
         if (result[member.name] != null) {
            continue
         }

         result[member.name] = await member.value.toJs()
      }

      return result as T
   }

   async delete<T extends StackObject>(object: T): Promise<void> {
      await this.orchestrator.deleteObject<T>(this, object)
   }

   async get<T extends StackObject>(id: string): Promise<T | undefined> {
      return await this.orchestrator.getObject<T>(this, id)
   }

   async getMany<T>(req?: PageRequest): Promise<PageResponse<T>> {
      return this.getMany<T>(req)
   }

   async toJs<T>(): Promise<T> {
      let result = {
         id: this.id
      }

      for (let member of this.members) {
         result[member.name] = await member.value.toJs()
      }

      //@ts-ignore
      return result as T
   }

   async validate<T>(obj: T): Promise<ValidationReport> {
      let report = new ValidationReport()

      for (let key of Object.keys(obj)) {
         let member = this.members.get(key)

         if (member === undefined) {
            report.addError(new Error(`Object contains a key that does not exist int he Model: ${key}`))
            continue
         }

         let result = await member.type.validate(obj[key])

         if (result.success === false && result.error) {
            report.addError(result.error)
         }
      }

      return report
   }
}