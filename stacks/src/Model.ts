import { IMemberCollection, MemberCollection } from "./collections/MemberCollection";
import { IOrchestrator } from "./orchestrator/Orchestrator";
import { IStackContext } from "./stack/StackContext";
import { ValidationReport } from "./values/Type";
import { CreateValueHandler, ValueCreateParams } from "./values/ValueSource";
import { StackObject } from "./StackObject";
import { IValueSerializer } from "./serialize/ValueSerializer";
import { MemberInfo } from "./Member";

/**
 * The parameters used to create an Object based on a Model.
 * The additional ObjectCreateParams on the type supports nested
 * values.
 */
export type ObjectCreateParams = {
   [key: string]: ValueCreateParams | ObjectCreateParams
}

export type ModelCreateParams = {
   [key: string]: string | number | boolean | any[] | CreateValueHandler | MemberInfo
}

export type SymbolEntry = {
   name: string,
   value: any
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
   readonly symbols: SymbolEntry[]

   /**
    * Appends additional Members to the Model
    * 
    * @param obj The additional members to add
    */
   append(obj: ModelCreateParams): Promise<void>

   /**
    * Ssves the object to storage
    * 
    * @param object The object to commit
    */
   save<T extends StackObject>(object: T): Promise<void>

   /**
    * Creates a new Object based on this Model
    */
   create<T extends StackObject>(obj?: ObjectCreateParams): Promise<T>

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
    * Gets all Objects based on a Model
    */
   getAll<T extends StackObject>(): Promise<T[]>

   /**
    * Gets many Objects
    * 
    * @param req The PagedRequest 
    */
   getMany<T extends StackObject>(req?: PageRequest): Promise<PageResponse<T>>

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

   private get serializer(): IValueSerializer {
      return this.context.serializer
   }   

   readonly members: IMemberCollection
   readonly symbols: SymbolEntry[]

   constructor(name: string, id: string, context: IStackContext) {
      this.name = name
      this.id = id
      this.context = context

      this.members = new MemberCollection(this, this.context)
      this.symbols = new Array<SymbolEntry>()
   }

   async append(obj: ModelCreateParams): Promise<void> {
      return this.members.append(obj)
   }

   async save<T extends StackObject>(obj: T): Promise<void> {
      await this.orchestrator.saveObject<T>(this, obj)
   }

   async create<T extends StackObject>(params: ObjectCreateParams = {}): Promise<T> {
      return await this.orchestrator.createObject(this, params)
   }

   async delete<T extends StackObject>(object: T): Promise<void> {
      await this.orchestrator.deleteObject<T>(this, object)
   }

   async get<T extends StackObject>(id: string): Promise<T | undefined> {
      return await this.orchestrator.getObject<T>(this, id)
   }

   async getAll<T extends StackObject>(): Promise<T[]> {
      let cursor = ''
      let results = new Array<T>()
      
      do {
         let paged = await this.orchestrator.getManyObjects<T>(this, { cursor })
         results.push(...paged.items)
         cursor = paged.cursor
      } while(cursor !== '')

      return results
   }

   async getMany<T extends StackObject>(req: PageRequest = {}): Promise<PageResponse<T>> {
      return this.orchestrator.getManyObjects<T>(this, req)
   }

   async toJs<T>(): Promise<T> {
      let result = {
         id: this.id
      }

      for (let member of this.members) {
         result[member.name] = await this.serializer.toJs(member.value)
      }

      //@ts-ignore
      return result as T
   }

   async validate<T>(obj: T): Promise<ValidationReport> {
      let report = new ValidationReport()

      for (let key of Object.keys(obj)) {
         let member = this.members.get(key)

         if (member === undefined) {
            report.addError(new Error(`Object contains a key that does not exist in the Model: ${key}`))
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