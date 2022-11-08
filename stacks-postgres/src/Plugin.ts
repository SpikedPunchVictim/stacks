import path from 'path'
import fs from 'fs-extra'
import { CreateTableBuilder } from 'kysely'
import { Client } from 'pg'

import {
   BootstrapEvent,
   EventSet,
   GetObjectEvent,
   GetStoreContextEvent,
   HasIdEvent,
   IEventRouter,
   IMember,
   IModel,
   IPlugin,
   IStack,
   ObjectSaveEvent,
   StackObject,
   TypeInfo,
   TypeSet
} from '@spikedpunch/stacks'
import { SymbolTable } from './SymbolTable'
import { StacksPostgresError } from './StacksPostgresError'
import { PostgresConfig } from './PostgresConfig'
import { PluginContext } from './PluginContext'
import { StoredObject } from './StoredObject'
import { MemberSymbols, ModelSymbols } from './Symbols'

/*
   Model:
      tablename: model.name,
      custom: async () => { },
      compositetype: false


   Member:
      datatype: this.getColumnType(member.value.type.info),
      columname: member.name,
      customcolumn: undefined

*/


/*
   TODOS:
      - Add Error messages to the try/cacthes

*/

export class PostgresPlugin implements IPlugin {
   readonly name: string = "stacks-postgres"

   private version: string | undefined = undefined
   private symbols: SymbolTable = new SymbolTable()
   private context: PluginContext

   constructor(readonly config: PostgresConfig) {
      this.context = new PluginContext(config)
   }

   /**
    * Drops a Database from the server. Ensure the credentials provided
    * have the right permissions to Drop the Table.
    * 
    * @param dbName The Database name to drop
    */
   async dropDb(dbName: string): Promise<void> {
      let client = new Client({
         host: this.config.host,
         port: this.config.port,
         user: this.config.user,
         password: this.config.password,
         database: 'postgres'
      })

      try {
         await client.connect()
         await client.query(`DROP DATABASE IF EXISTS ${dbName}`)
      } catch (err) {
         throw err
      } finally {
         await client.end()
      }
   }

   async createDbIfNotExists(dbName: string): Promise<void> {
      /*
         Note:
         In order to create a database table, you need to be connected to
         some database. We connect to the 'postgres' database, and run our
         queries from there.
      */

      let client = new Client({
         host: this.config.host,
         port: this.config.port,
         user: this.config.user,
         password: this.config.password,
         database: 'postgres'
      })

      try {
         await client.connect()

         let res = await client.query(`SELECT FROM pg_database WHERE datname = '${dbName}'`)

         if (res.rows.length == 0) {
            await client.query(`CREATE DATABASE ${dbName}`)
         }
         //await client.query(`SELECT 'CREATE DATABASE ${dbName}' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '${dbName}')`)
      } catch (err) {
         throw err
      } finally {
         await client.end()
      }
   }

   /*
  export enum EventSet {
      GetModel = 'get-model',
      ModelCreated = 'model-created',
      ModelDeleted = 'model-deleted',
      ModelUpdated = 'model-updated',

  }

      Bootstrap = 'bootstrap',
      GetObject = 'get-object',
      GetManyObjects = 'get-many-objects',
      GetStoreContext = 'get-store-context',
      HasId = 'has-id',
      ObjectCreated = 'object-created',
      ObjectDeleted = 'object-deleted',
      ObjectUpdated = 'object-updated',
      ObjectSaved = 'object-saved'
     */

   async setup(stack: IStack, router: IEventRouter): Promise<void> {

      //-------------------------------------------------------------------------------------------
      router.on<BootstrapEvent>(EventSet.Bootstrap, async (event: BootstrapEvent) => {
         // await this.db.schema
         //    .createTable('pet')
         //    .addColumn('name', 'text')
         //    .addColumn('species', 'text')
         //    .addColumn('number_of_legs', 'integer', (col) => col.defaultTo(4))
         //    .execute()

         // await this.db
         //    .insertInto('pet')
         //    .values({
         //       name: 'Catto',
         //       species: 'cat',
         //       number_of_legs: 4
         //    })
         //    .execute()

         await this.symbols.collect(stack, {
            model: {
               prefix: 'postgres:',
               defaults: {
                  tablename: async (model: IModel): Promise<string> => model.name,
                  custom: async () => { }
               },
            },
            members: {
               prefix: 'postgres:',
               defaults: {
                  datatype: undefined,
                  columname: async (member: IMember): Promise<string> => member.name,
                  customcolumn: undefined
               }
            }
         })

         this.context.buildModelToTableMap(stack, this.symbols)

         await this.bootstrapDb(stack)
      })

      //-------------------------------------------------------------------------------------------
      router.on<HasIdEvent>(EventSet.HasId, async (event: HasIdEvent) => {
         try {
            let found = await StoredObject.fromId(event.model, event.id, this.context)
            event.hasId = found !== undefined
         } catch (err) {
            throw err
         }
      })

      //-------------------------------------------------------------------------------------------
      router.on(EventSet.GetStoreContext, async (event: GetStoreContextEvent) => {
         if (this.version === undefined) {
            let pkg = await fs.readJson(path.join(__dirname, '..', 'package.json'))
            this.version = pkg.version
         }

         event.contexts.push({
            name: 'stacks:postgres',
            version: this.version || 'version-not-set',
            store: {
               config: this.config,
               db: this.context.db
            }
         })
      })

      //-------------------------------------------------------------------------------------------
      router.on<GetObjectEvent<StackObject>>(EventSet.GetObject, async (event: GetObjectEvent<StackObject>) => {
         try {
            let found = await StoredObject.fromId(event.model, event.id, this.context)

            console.dir(found, { depth: null })

            // if (result.length === 0) {
            //    event.exists = ExistState.DoesNotExist
            //    return
            // }
            //event.object = result.
         } catch (err) {
            throw err
         }
      })

      //-------------------------------------------------------------------------------------------
      // router.on<GetManyObjectsEvent<StackObject>>(EventSet.GetManyObjects, async (event: GetManyObjectsEvent<StackObject>) => {
      //    let modelDir = this.getModelDir(event.model.name)
      //    let reqCursor = event.options.cursor || ''
      //    let reqCount = event.options.limit == null ? 100 : event.options.limit

      //    // Ignore any Temp files that may be in the directory
      //    let files = await fs.readdir(modelDir)
      //    files = files.filter(it => path.parse(it).ext !== TempFileExt)
      //    files.sort()

      //    let cursor = ''
      //    let startIndex = 0
      //    let requestedFiles = new Array<string>()

      //    // The cursor becomes the next file one in the sorted list
      //    if (reqCursor !== '') {
      //       let names = files.map(f => path.parse(f).name)

      //       let decodedCursor = Buffer.from(reqCursor, 'base64').toString('ascii')
      //       let found = names.findIndex(it => it === decodedCursor)

      //       if (found < 0) {
      //          found = 0
      //          event.wasCursorFound = false
      //       } else {
      //          startIndex = found
      //       }
      //    }

      //    let endIndex = reqCount + startIndex
      //    requestedFiles = files.slice(startIndex, endIndex)

      //    if (endIndex < (files.length - 1)) {
      //       let parsed = path.parse(path.join(this.baseDir, files[endIndex]))
      //       cursor = parsed.name
      //    } else {
      //       cursor = ''
      //    }

      //    let objects = new Array<StackObject>()

      //    for (let file of requestedFiles) {
      //       objects.push(await fs.readJson(path.join(modelDir, file)))
      //    }

      //    event.results = {
      //       cursor: cursor === '' ? '' : Buffer.from(cursor).toString('base64'),
      //       items: objects
      //    }
      // })

      //-------------------------------------------------------------------------------------------
      router.on<ObjectSaveEvent<StackObject>>(EventSet.ObjectSaved, async (event: ObjectSaveEvent<StackObject>) => {
         try {
            let storedObj = await StoredObject.create(event.model, event.object, this.context)
            await storedObj.save()
         } catch (err) {
            console.dir(err)
            throw err
         }
      })

      // //-------------------------------------------------------------------------------------------
      // router.on<GetObjectEvent<StackObject>>(EventSet.GetObject, async (event: GetObjectEvent<StackObject>) => {
      //    let objectPath = this.getObjectPath(event.model.id, event.id)

      //    try {
      //       let obj = await fs.readJson(objectPath)
      //       event.object = obj
      //    } catch (err) {
      //       throw new Error(`[stacks-fs] Failed to retrieve Object ${event.id}. Reason ${err}`)
      //    }
      // })

      // //-------------------------------------------------------------------------------------------
      // router.on<DeleteObjectEvent<StackObject>>(EventSet.ObjectDeleted, async (event: DeleteObjectEvent<StackObject>) => {
      //    let objectPath = this.getObjectPath(event.model.name, event.object.id)

      //    try {
      //       await fs.remove(objectPath)
      //    } catch (err) {
      //       throw new Error(`[stacks-fs] Failed to delete an Object ${event.object.id}. Reason ${err}`)
      //    }
      // })

      // //-------------------------------------------------------------------------------------------
      // router.on<UpdateObjectEvent<StackObject>>(EventSet.ObjectUpdated, async (event: UpdateObjectEvent<StackObject>) => {
      //    let objectPath = this.getObjectPath(event.model.name, event.object.id)
      //    let tempPath = `${objectPath}${TempFileExt}`

      //    try {
      //       await fs.access(objectPath)

      //       event.exists = ExistState.Exists

      //       // We ensure we always have a copy of the original until we're done writing
      //       // the changed file. We remove the copy if the write is sucessful, otherwise
      //       // we rollback the change and keep the copy.
      //       await fs.copy(objectPath, tempPath)
      //       await fs.remove(objectPath)
      //       await fs.writeJson(objectPath, event.serialize.toJs(), { spaces: 2 })
      //       event.updated = 
      //    } catch (err) {
      //       try {
      //          await fs.access(tempPath)
      //          await fs.move(tempPath, objectPath, { overwrite: true })
      //       } catch (err) {
      //          // swallow
      //       }

      //       throw new Error(`[stacks-fs] Failed to update an Object ${event.object.id}. Reason ${err}`)
      //    } finally {
      //       try {
      //          await fs.access(tempPath)
      //          await fs.remove(tempPath)
      //       } catch (err) {
      //          // swallow
      //       }
      //    }
      // })
   }

   private async bootstrapDb(stack: IStack): Promise<void> {
      try {
         await this.createDbIfNotExists(this.config.database)
      } catch (err) {
         throw new Error(`Failed to connect to Postgres DB. Reason: ${err}`)
      }

      for (let model of stack.get.models()) {
         await this.createTable(model)
      }
   }

   private async createTable(model: IModel): Promise<void> {
      try {
         let schema = this.context.db.schema

         let tableConfig = await this.symbols.getModelSymbols<ModelSymbols>(model.id)

         if (tableConfig === undefined) {
            throw new Error(`Failed to find any Symbol configuration for Model ${model.name}`)
         }

         let builder = schema
            .createTable(tableConfig.tablename)
            .ifNotExists()

         builder = builder.addColumn('id', 'text', (col) => col.primaryKey())

         for (let member of model.members) {
            // TODO: Get the Type to be able to assign a default type for it
            let columnConfig = this.symbols.getMemberSymbols<MemberSymbols>(model.id, member.id)

            if (columnConfig === undefined) {
               throw new Error(`Failed to find any Symbols for MEmber ${member.name} in Model ${model.name}`)
            }

            let obj = await this.createColumn(member, columnConfig, builder)
            builder = obj.builder
         }

         if (tableConfig.custom != null) {
            builder = await tableConfig.custom(builder)
         }

         await builder.execute()

         return
      } catch (err) {
         console.error(err)
         throw err
      }
   }

   /**
    * Creates a Column for a Member. 
    * 
    * Note: 
    * This function cannot return a CreateTableBuilder as a Promise. There is code
    * in the kesley library that errors when you await a CreateTableBuilder that gets
    * triggered when returning from a Promise.
    * 
    * @param member The Member that represents the Column
    * @param config The Postgres Symbol table for the Member
    * @param builder The current Builder
    * @returns 
    */
   private async createColumn(member: IMember, config: MemberSymbols, builder: CreateTableBuilder<any, any>): Promise<{ builder: CreateTableBuilder<any, any> }> {
      if (typeof config.customcolumn === 'function') {
         builder = await config.customcolumn(builder)
         return { builder }
      }

      let info = member.type.info

      switch (info.type) {
         case TypeSet.Bool:
         case TypeSet.Int:
         case TypeSet.UInt:
         case TypeSet.String:
         case TypeSet.List: {
            let type = this.getColumnType(member.type.info)

            //@ts-ignore
            builder = builder.addColumn(config.columname, type)
            return { builder }
         }
         case TypeSet.ObjectRef: {
            let refTable = this.context.getTable(info.modelName!)

            if (refTable === undefined) {
               throw new Error(`[stacks-postgres] A Model "${info.modelName}" is being referenced in a Model property, but the Model cannot be found. Ensure you create the Model before referencing it.`)
            }

            builder = builder.addColumn(config.columname, 'text', (col) => col.references(`${refTable!.tableName}.id`).unique())

            return { builder }
         }
         default: {
            throw new Error(`Unsupported Type encountered when Bootstrapping the Postgres DB`)
         }
      }
   }

   private getColumnType(info: TypeInfo, isAlreadyList: boolean = false): string {
      switch (info.type) {
         case TypeSet.Bool: {
            return 'boolean'
         }
         case TypeSet.Int:
         case TypeSet.UInt: {
            return 'integer'
         }
         case TypeSet.List: {
            if (info.itemType == null) {
               throw new StacksPostgresError(`Encountered an issue when attempting determine the default for a List Type. It's sub type is not defined.`)
            }

            if (info.itemType.type == TypeSet.List && isAlreadyList) {
               throw new StacksPostgresError(`The Postgres Plugin does not support List of Lists when generating Postgres Tables`)
            }

            let subType = this.getColumnType(info.itemType, true)
            return isAlreadyList ? `${subType}[][]` : `${subType}[]`
         }
         case TypeSet.ObjectRef: {
            let nfo = this.context.getTable(info.modelName!)

            if (nfo === undefined) {
               throw new StacksPostgresError(`A Model "${info.modelName}" is being referenced in a Model property, but the Model cannot be found. Ensure you create the Model before referencing it.`)
            }

            return nfo.tableName
         }
         case TypeSet.String: {
            return 'text'
         }
         default: {
            throw new StacksPostgresError(`Unsupported Type encountered when Bootstrapping the Postgres DB`)
         }
      }
   }
}