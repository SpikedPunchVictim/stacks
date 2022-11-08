import { IModel, IStack, StackObject, TypeSet } from '@spikedpunch/stacks'
import { Kysely, PostgresDialect } from 'kysely'
import { Pool } from 'pg'
import { PostgresConfig } from './PostgresConfig'
import { StacksPostgresError } from './StacksPostgresError'
import { MemberSymbols, ModelSymbols } from './Symbols'
import { SymbolTable } from './SymbolTable'
import { ColumnInfo, TableInfo } from './Table'


export type Database = {
   [key: string]: any
}

export class PluginContext {
   readonly db: Kysely<Database>
   
   get tableMap(): Map<string, TableInfo> {
      return this._tableMap
   }

   private _tableMap: Map<string, TableInfo> = new Map<string, TableInfo>()

   constructor(readonly config: PostgresConfig) {
      // Config for Postgres Dialect: https://koskimas.github.io/kysely/classes/PostgresDialect.html
      this.db = new Kysely<Database>({
         dialect: new PostgresDialect({
            pool: new Pool({
               database: config.database,
               host: config.host,
               port: config.port,
               user: config.user,
               password: config.password
            })
         }),
         log: ['query', 'error']
      })
   }

   /**
    * Builds the mapping between the Models and the Postgres Tables
    * 
    * @param stack The Stack
    * @param table The SymbolsTable
    * @returns A Map where:
    *    - Key: Model Name, lower-cased
    *    - Value: The Table info for that Model
    */
   buildModelToTableMap(stack: IStack, table: SymbolTable): void {
      // Key: Model Name
      // Value: TableInfo
      let cache = new Map<string, TableInfo>()

      // Determine tables and columns
      for (let model of stack.get.models()) {
         let tableConfig = table.getModelSymbols<ModelSymbols>(model.id)

         if (tableConfig === undefined) {
            throw new Error(`Failed to find any Symbol configuration for Model ${model.name}`)
         }

         let columns = new Array<ColumnInfo>()

         for (let member of model.members) {
            let columnConfig = table.getMemberSymbols<MemberSymbols>(model.id, member.id)

            if (columnConfig === undefined) {
               throw new Error(`Failed to find any Symbols for MEmber ${member.name} in Model ${model.name}`)
            }

            columns.push({
               member,
               columnName: columnConfig.columname
            })
         }

         cache.set(model.name.toLowerCase(), {
            model,
            tableName: tableConfig.tablename,
            columns
         })
      }

      // Determine references
      for (let model of stack.get.models()) {
         let table = cache.get(model.name.toLowerCase())

         if (table === undefined) {
            throw new StacksPostgresError(`Failed to properly build the table cache. Model ${model.name}`)
         }

         for (let member of model.members) {
            if (member.type.type !== TypeSet.ObjectRef) {
               continue
            }

            let info = member.type.info

            if (info.modelName == null) {
               throw new StacksPostgresError(`No ObjectRef Model name was set for a Member of Type ObjectRef. Model ${model.name}, Member ${member.name}`)
            }

            let refTable = cache.get(info.modelName!.toLowerCase())

            if (refTable === undefined) {
               throw new StacksPostgresError(`A Model "${info.modelName}" is being referenced in a Model property, but the Model cannot be found. Ensure you create the Model before referencing it.`)
            }

            let columnInfo = table.columns.find(it => it.member.id === member.id)

            if (columnInfo === undefined) {
               throw new StacksPostgresError(`A Column in the Model "${member.model.name}" could not be found`)
            }

            // We record the referenced table here for lookup later when we save.
            // We could also do this when we create the ColumnInfo, but it would require
            // additional logic to lookup everything. By doing it here, we're doing
            // at the site we create the actual column and setup the reference, so there's
            // less room for error should we move logic around.
            columnInfo.reference = {
               model: refTable.model,
               table: refTable.tableName
            }
         }
      }

      this._tableMap = cache
   }

   /**
    * Get's the TableInfo for a Model
    * 
    * @param model The Model or Model Name
    * @returns 
    */
   getTable(model: IModel | string): TableInfo | undefined {
      if(typeof model === 'string') {
         return this.tableMap.get(model.toLowerCase())
      } else {
         return this.tableMap.get(model.name.toLowerCase())
      }
   }

   fromDbObj(modelName: string, dbObj: StackObject): any {
      let info = this.tableMap.get(modelName.toLowerCase())

      if (info === undefined) {
         throw new StacksPostgresError(`Cannot find table associated with Model ${modelName}`)
      }

      let result = {}
      for (let col of info.columns) {
         result[col.member.name] = dbObj[col.columnName]
      }

      return result
   }

   /**
    * Creates an Object whose keys are the column name, and the values are the 
    * matching Member name
    * 
    * @param modelName The Model Name
    * @param object The Object to map
    * @returns 
    */
   toDbObj(modelName: string, object: StackObject): any {
      let info = this.tableMap.get(modelName.toLowerCase())

      if (info === undefined) {
         throw new StacksPostgresError(`Cannot find table associated with Model ${modelName}`)
      }

      let result = {}
      for (let col of info.columns) {
         result[col.columnName] = object[col.member.name]
      }

      return result
   }
}