import { IModel, StackObject } from "@spikedpunch/stacks"
import { PluginContext } from "./PluginContext"
import { StacksPostgresError } from "./StacksPostgresError"


export class StoredObject {
   private constructor(readonly model: IModel, readonly obj: StackObject, readonly context: PluginContext) {

   }

   static async fromId(model: IModel, id: string, context: PluginContext): Promise<StoredObject | undefined> {
      let info = context.getTable(model)

      if (info === undefined) {
         throw new StacksPostgresError(`Failed to find the Table for Model ${model.name}. Ensure the Postgres Plugin has been properly initialized.`)
      }

      try {
         let result = await context.db.selectFrom(info.tableName)
            .selectAll(info.tableName)
            .where('id', '=', id)
            .execute()

         if(result.length === 0) {
            return undefined
         }

         console.log(":: From DB")
         console.dir(result[0], { depth: null })

         console.log(":: Transformed")
         console.dir(context.fromDbObj(model.name, result[0] as any), { depth: null })
         
         return result.length === 0 ? undefined : new StoredObject(model, result[0] as StackObject, context)
      } catch (err) {
         throw err
      }
   }

   static async getOrCreate(model: IModel, obj: StackObject, context: PluginContext): Promise<StoredObject> {
      let found = await StoredObject.fromId(model, obj.id, context)

      if(found) {
         return found
      }

      return StoredObject.create(model, obj, context)
   }

   static create(model: IModel, obj: StackObject, context: PluginContext): StoredObject {
      let dbObj = context.toDbObj(model.name, obj)
      return new StoredObject(model, dbObj, context)
   }

   static async delete(model: IModel, id: string, context: PluginContext): Promise<void> {
      let info = context.getTable(model)

      if (info === undefined) {
         throw new StacksPostgresError(`Could not match Model with a Table when saving Object ${id}`)
      }

      try {
         await context.db
            .deleteFrom(info.tableName)
            .where('id', '=', id)
            .execute()
      } catch (err) {
         console.error(`[stacks-postgres] Failed to delete an Object from Postgres. Model ${model.name}, Object ID ${id}. Reason: ${err}`)
         throw err
      }
   }

   static async update(model: IModel, obj: StackObject, context: PluginContext): Promise<void> {
      let table = context.getTable(model)

      if (table === undefined) {
         throw new StacksPostgresError(`Failed to find the Table for Model ${model.name}. Ensure the Postgres Plugin has been properly initialized.`)
      }

      await context.db.updateTable(table.tableName)
         .where('id', '=', obj.id)
         .set(obj)
         .execute()
   }

   async save(): Promise<void> {
      let table = this.context.getTable(this.model)

      if (table == undefined) {
         throw new StacksPostgresError(`Could not match Model with a Table when saving Object ${this.obj.id}`)
      }

      // Store any seperate Object Refs in their own table; nested.
      let refColumns = table.columns.filter(col => col.reference != null)

      let savedObj = {}

      for (let refColumn of refColumns) {
         if (this.obj[refColumn.columnName] == null) {
            continue
         }

         if (refColumn.reference == null) {
            throw new StacksPostgresError(`Failed to Save the Object. No reference has been recorded for a Model Property. On Model ${this.model.name}, Member ${refColumn.member.name}`)
         }

         let refTableInfo = this.context.getTable(refColumn.reference.model)

         if(refTableInfo === undefined) {
            throw new StacksPostgresError(`Failed to find the reference information for a column in Model ${refColumn.reference.model}`)
         }

         let storedObj = StoredObject.create(refColumn.reference.model, this.context.toDbObj(refTableInfo.model.name, this.obj[refColumn.columnName]), this.context)
         await storedObj.save()

         savedObj[refColumn.columnName] = this.obj[refColumn.columnName].id
      }

      for (let colName of Object.keys(this.obj)) {
         savedObj[colName]= this.obj[colName]
      }

      savedObj['id'] = this.obj.id

      let result = await this.context.db
         .insertInto(table.tableName)
         .values(savedObj)
         .execute()

      console.dir(result, { depth: null })

      return
   }

   async delete(): Promise<void> {
      await StoredObject.delete(this.model, this.obj.id, this.context)
   }
}
