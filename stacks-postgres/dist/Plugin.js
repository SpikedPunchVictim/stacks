"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostgresPlugin = void 0;
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const pg_1 = require("pg");
const stacks_1 = require("@spikedpunch/stacks");
const SymbolTable_1 = require("./SymbolTable");
const StacksPostgresError_1 = require("./StacksPostgresError");
const PluginContext_1 = require("./PluginContext");
const StoredObject_1 = require("./StoredObject");
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
class PostgresPlugin {
    constructor(config) {
        this.config = config;
        this.name = "stacks-postgres";
        this.version = undefined;
        this.symbols = new SymbolTable_1.SymbolTable();
        this.context = new PluginContext_1.PluginContext(config);
    }
    /**
     * Drops a Database from the server. Ensure the credentials provided
     * have the right permissions to Drop the Table.
     *
     * @param dbName The Database name to drop
     */
    async dropDb(dbName) {
        let client = new pg_1.Client({
            host: this.config.host,
            port: this.config.port,
            user: this.config.user,
            password: this.config.password,
            database: 'postgres'
        });
        try {
            await client.connect();
            await client.query(`DROP DATABASE IF EXISTS ${dbName}`);
        }
        catch (err) {
            throw err;
        }
        finally {
            await client.end();
        }
    }
    async createDbIfNotExists(dbName) {
        /*
           Note:
           In order to create a database table, you need to be connected to
           some database. We connect to the 'postgres' database, and run our
           queries from there.
        */
        let client = new pg_1.Client({
            host: this.config.host,
            port: this.config.port,
            user: this.config.user,
            password: this.config.password,
            database: 'postgres'
        });
        try {
            await client.connect();
            let res = await client.query(`SELECT FROM pg_database WHERE datname = '${dbName}'`);
            if (res.rows.length == 0) {
                await client.query(`CREATE DATABASE ${dbName}`);
            }
            //await client.query(`SELECT 'CREATE DATABASE ${dbName}' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '${dbName}')`)
        }
        catch (err) {
            throw err;
        }
        finally {
            await client.end();
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
    async setup(stack, router) {
        //-------------------------------------------------------------------------------------------
        router.on(stacks_1.EventSet.Bootstrap, async (event) => {
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
                        tablename: async (model) => model.name,
                        custom: async () => { }
                    },
                },
                members: {
                    prefix: 'postgres:',
                    defaults: {
                        datatype: undefined,
                        columname: async (member) => member.name,
                        customcolumn: undefined
                    }
                }
            });
            this.context.buildModelToTableMap(stack, this.symbols);
            await this.bootstrapDb(stack);
        });
        //-------------------------------------------------------------------------------------------
        router.on(stacks_1.EventSet.HasId, async (event) => {
            try {
                let found = await StoredObject_1.StoredObject.fromId(event.model, event.id, this.context);
                event.hasId = found !== undefined;
            }
            catch (err) {
                throw err;
            }
        });
        //-------------------------------------------------------------------------------------------
        router.on(stacks_1.EventSet.GetStoreContext, async (event) => {
            if (this.version === undefined) {
                let pkg = await fs_extra_1.default.readJson(path_1.default.join(__dirname, '..', 'package.json'));
                this.version = pkg.version;
            }
            event.contexts.push({
                name: 'stacks:postgres',
                version: this.version || 'version-not-set',
                store: {
                    config: this.config,
                    db: this.context.db
                }
            });
        });
        //-------------------------------------------------------------------------------------------
        router.on(stacks_1.EventSet.GetObject, async (event) => {
            try {
                let found = await StoredObject_1.StoredObject.fromId(event.model, event.id, this.context);
                console.dir(found, { depth: null });
                // if (result.length === 0) {
                //    event.exists = ExistState.DoesNotExist
                //    return
                // }
                //event.object = result.
            }
            catch (err) {
                throw err;
            }
        });
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
        router.on(stacks_1.EventSet.ObjectSaved, async (event) => {
            try {
                let storedObj = await StoredObject_1.StoredObject.create(event.model, event.object, this.context);
                await storedObj.save();
            }
            catch (err) {
                console.dir(err);
                throw err;
            }
        });
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
    async bootstrapDb(stack) {
        try {
            await this.createDbIfNotExists(this.config.database);
        }
        catch (err) {
            throw new Error(`Failed to connect to Postgres DB. Reason: ${err}`);
        }
        for (let model of stack.get.models()) {
            await this.createTable(model);
        }
    }
    async createTable(model) {
        try {
            let schema = this.context.db.schema;
            let tableConfig = await this.symbols.getModelSymbols(model.id);
            if (tableConfig === undefined) {
                throw new Error(`Failed to find any Symbol configuration for Model ${model.name}`);
            }
            let builder = schema
                .createTable(tableConfig.tablename)
                .ifNotExists();
            builder = builder.addColumn('id', 'text', (col) => col.primaryKey());
            for (let member of model.members) {
                // TODO: Get the Type to be able to assign a default type for it
                let columnConfig = this.symbols.getMemberSymbols(model.id, member.id);
                if (columnConfig === undefined) {
                    throw new Error(`Failed to find any Symbols for MEmber ${member.name} in Model ${model.name}`);
                }
                let obj = await this.createColumn(member, columnConfig, builder);
                builder = obj.builder;
            }
            if (tableConfig.custom != null) {
                builder = await tableConfig.custom(builder);
            }
            await builder.execute();
            return;
        }
        catch (err) {
            console.error(err);
            throw err;
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
    async createColumn(member, config, builder) {
        if (typeof config.customcolumn === 'function') {
            builder = await config.customcolumn(builder);
            return { builder };
        }
        let info = member.type.info;
        switch (info.type) {
            case stacks_1.TypeSet.Bool:
            case stacks_1.TypeSet.Int:
            case stacks_1.TypeSet.UInt:
            case stacks_1.TypeSet.String:
            case stacks_1.TypeSet.List: {
                let type = this.getColumnType(member.type.info);
                //@ts-ignore
                builder = builder.addColumn(config.columname, type);
                return { builder };
            }
            case stacks_1.TypeSet.ObjectRef: {
                let refTable = this.context.getTable(info.modelName);
                if (refTable === undefined) {
                    throw new Error(`[stacks-postgres] A Model "${info.modelName}" is being referenced in a Model property, but the Model cannot be found. Ensure you create the Model before referencing it.`);
                }
                builder = builder.addColumn(config.columname, 'text', (col) => col.references(`${refTable.tableName}.id`).unique());
                return { builder };
            }
            default: {
                throw new Error(`Unsupported Type encountered when Bootstrapping the Postgres DB`);
            }
        }
    }
    getColumnType(info, isAlreadyList = false) {
        switch (info.type) {
            case stacks_1.TypeSet.Bool: {
                return 'boolean';
            }
            case stacks_1.TypeSet.Int:
            case stacks_1.TypeSet.UInt: {
                return 'integer';
            }
            case stacks_1.TypeSet.List: {
                if (info.itemType == null) {
                    throw new StacksPostgresError_1.StacksPostgresError(`Encountered an issue when attempting determine the default for a List Type. It's sub type is not defined.`);
                }
                if (info.itemType.type == stacks_1.TypeSet.List && isAlreadyList) {
                    throw new StacksPostgresError_1.StacksPostgresError(`The Postgres Plugin does not support List of Lists when generating Postgres Tables`);
                }
                let subType = this.getColumnType(info.itemType, true);
                return isAlreadyList ? `${subType}[][]` : `${subType}[]`;
            }
            case stacks_1.TypeSet.ObjectRef: {
                let nfo = this.context.getTable(info.modelName);
                if (nfo === undefined) {
                    throw new StacksPostgresError_1.StacksPostgresError(`A Model "${info.modelName}" is being referenced in a Model property, but the Model cannot be found. Ensure you create the Model before referencing it.`);
                }
                return nfo.tableName;
            }
            case stacks_1.TypeSet.String: {
                return 'text';
            }
            default: {
                throw new StacksPostgresError_1.StacksPostgresError(`Unsupported Type encountered when Bootstrapping the Postgres DB`);
            }
        }
    }
}
exports.PostgresPlugin = PostgresPlugin;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGx1Z2luLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL1BsdWdpbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxnREFBdUI7QUFDdkIsd0RBQXlCO0FBRXpCLDJCQUEyQjtBQUUzQixnREFlNEI7QUFDNUIsK0NBQTJDO0FBQzNDLCtEQUEyRDtBQUUzRCxtREFBK0M7QUFDL0MsaURBQTZDO0FBRzdDOzs7Ozs7Ozs7Ozs7RUFZRTtBQUdGOzs7O0VBSUU7QUFFRixNQUFhLGNBQWM7SUFPeEIsWUFBcUIsTUFBc0I7UUFBdEIsV0FBTSxHQUFOLE1BQU0sQ0FBZ0I7UUFObEMsU0FBSSxHQUFXLGlCQUFpQixDQUFBO1FBRWpDLFlBQU8sR0FBdUIsU0FBUyxDQUFBO1FBQ3ZDLFlBQU8sR0FBZ0IsSUFBSSx5QkFBVyxFQUFFLENBQUE7UUFJN0MsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLDZCQUFhLENBQUMsTUFBTSxDQUFDLENBQUE7SUFDM0MsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFjO1FBQ3hCLElBQUksTUFBTSxHQUFHLElBQUksV0FBTSxDQUFDO1lBQ3JCLElBQUksRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUk7WUFDdEIsSUFBSSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSTtZQUN0QixJQUFJLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJO1lBQ3RCLFFBQVEsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVE7WUFDOUIsUUFBUSxFQUFFLFVBQVU7U0FDdEIsQ0FBQyxDQUFBO1FBRUYsSUFBSTtZQUNELE1BQU0sTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFBO1lBQ3RCLE1BQU0sTUFBTSxDQUFDLEtBQUssQ0FBQywyQkFBMkIsTUFBTSxFQUFFLENBQUMsQ0FBQTtTQUN6RDtRQUFDLE9BQU8sR0FBRyxFQUFFO1lBQ1gsTUFBTSxHQUFHLENBQUE7U0FDWDtnQkFBUztZQUNQLE1BQU0sTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFBO1NBQ3BCO0lBQ0osQ0FBQztJQUVELEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxNQUFjO1FBQ3JDOzs7OztVQUtFO1FBRUYsSUFBSSxNQUFNLEdBQUcsSUFBSSxXQUFNLENBQUM7WUFDckIsSUFBSSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSTtZQUN0QixJQUFJLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJO1lBQ3RCLElBQUksRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUk7WUFDdEIsUUFBUSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUTtZQUM5QixRQUFRLEVBQUUsVUFBVTtTQUN0QixDQUFDLENBQUE7UUFFRixJQUFJO1lBQ0QsTUFBTSxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUE7WUFFdEIsSUFBSSxHQUFHLEdBQUcsTUFBTSxNQUFNLENBQUMsS0FBSyxDQUFDLDRDQUE0QyxNQUFNLEdBQUcsQ0FBQyxDQUFBO1lBRW5GLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFO2dCQUN2QixNQUFNLE1BQU0sQ0FBQyxLQUFLLENBQUMsbUJBQW1CLE1BQU0sRUFBRSxDQUFDLENBQUE7YUFDakQ7WUFDRCxpSUFBaUk7U0FDbkk7UUFBQyxPQUFPLEdBQUcsRUFBRTtZQUNYLE1BQU0sR0FBRyxDQUFBO1NBQ1g7Z0JBQVM7WUFDUCxNQUFNLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQTtTQUNwQjtJQUNKLENBQUM7SUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7O1FBa0JJO0lBRUosS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFhLEVBQUUsTUFBb0I7UUFFNUMsNkZBQTZGO1FBQzdGLE1BQU0sQ0FBQyxFQUFFLENBQWlCLGlCQUFRLENBQUMsU0FBUyxFQUFFLEtBQUssRUFBRSxLQUFxQixFQUFFLEVBQUU7WUFDM0UsdUJBQXVCO1lBQ3ZCLHlCQUF5QjtZQUN6QixnQ0FBZ0M7WUFDaEMsbUNBQW1DO1lBQ25DLHdFQUF3RTtZQUN4RSxnQkFBZ0I7WUFFaEIsZ0JBQWdCO1lBQ2hCLHdCQUF3QjtZQUN4QixlQUFlO1lBQ2YsdUJBQXVCO1lBQ3ZCLHdCQUF3QjtZQUN4QiwwQkFBMEI7WUFDMUIsUUFBUTtZQUNSLGdCQUFnQjtZQUVoQixNQUFNLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRTtnQkFDL0IsS0FBSyxFQUFFO29CQUNKLE1BQU0sRUFBRSxXQUFXO29CQUNuQixRQUFRLEVBQUU7d0JBQ1AsU0FBUyxFQUFFLEtBQUssRUFBRSxLQUFhLEVBQW1CLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSTt3QkFDL0QsTUFBTSxFQUFFLEtBQUssSUFBSSxFQUFFLEdBQUcsQ0FBQztxQkFDekI7aUJBQ0g7Z0JBQ0QsT0FBTyxFQUFFO29CQUNOLE1BQU0sRUFBRSxXQUFXO29CQUNuQixRQUFRLEVBQUU7d0JBQ1AsUUFBUSxFQUFFLFNBQVM7d0JBQ25CLFNBQVMsRUFBRSxLQUFLLEVBQUUsTUFBZSxFQUFtQixFQUFFLENBQUMsTUFBTSxDQUFDLElBQUk7d0JBQ2xFLFlBQVksRUFBRSxTQUFTO3FCQUN6QjtpQkFDSDthQUNILENBQUMsQ0FBQTtZQUVGLElBQUksQ0FBQyxPQUFPLENBQUMsb0JBQW9CLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtZQUV0RCxNQUFNLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDaEMsQ0FBQyxDQUFDLENBQUE7UUFFRiw2RkFBNkY7UUFDN0YsTUFBTSxDQUFDLEVBQUUsQ0FBYSxpQkFBUSxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBaUIsRUFBRSxFQUFFO1lBQy9ELElBQUk7Z0JBQ0QsSUFBSSxLQUFLLEdBQUcsTUFBTSwyQkFBWSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO2dCQUMxRSxLQUFLLENBQUMsS0FBSyxHQUFHLEtBQUssS0FBSyxTQUFTLENBQUE7YUFDbkM7WUFBQyxPQUFPLEdBQUcsRUFBRTtnQkFDWCxNQUFNLEdBQUcsQ0FBQTthQUNYO1FBQ0osQ0FBQyxDQUFDLENBQUE7UUFFRiw2RkFBNkY7UUFDN0YsTUFBTSxDQUFDLEVBQUUsQ0FBQyxpQkFBUSxDQUFDLGVBQWUsRUFBRSxLQUFLLEVBQUUsS0FBMkIsRUFBRSxFQUFFO1lBQ3ZFLElBQUksSUFBSSxDQUFDLE9BQU8sS0FBSyxTQUFTLEVBQUU7Z0JBQzdCLElBQUksR0FBRyxHQUFHLE1BQU0sa0JBQUUsQ0FBQyxRQUFRLENBQUMsY0FBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLGNBQWMsQ0FBQyxDQUFDLENBQUE7Z0JBQ3ZFLElBQUksQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQTthQUM1QjtZQUVELEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDO2dCQUNqQixJQUFJLEVBQUUsaUJBQWlCO2dCQUN2QixPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sSUFBSSxpQkFBaUI7Z0JBQzFDLEtBQUssRUFBRTtvQkFDSixNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU07b0JBQ25CLEVBQUUsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUU7aUJBQ3JCO2FBQ0gsQ0FBQyxDQUFBO1FBQ0wsQ0FBQyxDQUFDLENBQUE7UUFFRiw2RkFBNkY7UUFDN0YsTUFBTSxDQUFDLEVBQUUsQ0FBOEIsaUJBQVEsQ0FBQyxTQUFTLEVBQUUsS0FBSyxFQUFFLEtBQWtDLEVBQUUsRUFBRTtZQUNyRyxJQUFJO2dCQUNELElBQUksS0FBSyxHQUFHLE1BQU0sMkJBQVksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtnQkFFMUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQTtnQkFFbkMsNkJBQTZCO2dCQUM3Qiw0Q0FBNEM7Z0JBQzVDLFlBQVk7Z0JBQ1osSUFBSTtnQkFDSix3QkFBd0I7YUFDMUI7WUFBQyxPQUFPLEdBQUcsRUFBRTtnQkFDWCxNQUFNLEdBQUcsQ0FBQTthQUNYO1FBQ0osQ0FBQyxDQUFDLENBQUE7UUFFRiw2RkFBNkY7UUFDN0YsNEhBQTRIO1FBQzVILHVEQUF1RDtRQUN2RCxnREFBZ0Q7UUFDaEQsNEVBQTRFO1FBRTVFLDJEQUEyRDtRQUMzRCw0Q0FBNEM7UUFDNUMsb0VBQW9FO1FBQ3BFLGtCQUFrQjtRQUVsQixxQkFBcUI7UUFDckIsd0JBQXdCO1FBQ3hCLDhDQUE4QztRQUU5QyxnRUFBZ0U7UUFDaEUsNkJBQTZCO1FBQzdCLHVEQUF1RDtRQUV2RCwrRUFBK0U7UUFDL0UsZ0VBQWdFO1FBRWhFLHlCQUF5QjtRQUN6QixxQkFBcUI7UUFDckIsd0NBQXdDO1FBQ3hDLGlCQUFpQjtRQUNqQiw4QkFBOEI7UUFDOUIsVUFBVTtRQUNWLE9BQU87UUFFUCwwQ0FBMEM7UUFDMUMsd0RBQXdEO1FBRXhELDBDQUEwQztRQUMxQywwRUFBMEU7UUFDMUUsNkJBQTZCO1FBQzdCLGNBQWM7UUFDZCxvQkFBb0I7UUFDcEIsT0FBTztRQUVQLDRDQUE0QztRQUU1Qyx3Q0FBd0M7UUFDeEMsbUVBQW1FO1FBQ25FLE9BQU87UUFFUCx1QkFBdUI7UUFDdkIsNkVBQTZFO1FBQzdFLHVCQUF1QjtRQUN2QixPQUFPO1FBQ1AsS0FBSztRQUVMLDZGQUE2RjtRQUM3RixNQUFNLENBQUMsRUFBRSxDQUErQixpQkFBUSxDQUFDLFdBQVcsRUFBRSxLQUFLLEVBQUUsS0FBbUMsRUFBRSxFQUFFO1lBQ3pHLElBQUk7Z0JBQ0QsSUFBSSxTQUFTLEdBQUcsTUFBTSwyQkFBWSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO2dCQUNsRixNQUFNLFNBQVMsQ0FBQyxJQUFJLEVBQUUsQ0FBQTthQUN4QjtZQUFDLE9BQU8sR0FBRyxFQUFFO2dCQUNYLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUE7Z0JBQ2hCLE1BQU0sR0FBRyxDQUFBO2FBQ1g7UUFDSixDQUFDLENBQUMsQ0FBQTtRQUVGLGdHQUFnRztRQUNoRyw2R0FBNkc7UUFDN0csbUVBQW1FO1FBRW5FLFdBQVc7UUFDWCxnREFBZ0Q7UUFDaEQsMkJBQTJCO1FBQzNCLHFCQUFxQjtRQUNyQiw0RkFBNEY7UUFDNUYsT0FBTztRQUNQLEtBQUs7UUFFTCxnR0FBZ0c7UUFDaEcsdUhBQXVIO1FBQ3ZILDRFQUE0RTtRQUU1RSxXQUFXO1FBQ1gsb0NBQW9DO1FBQ3BDLHFCQUFxQjtRQUNyQixvR0FBb0c7UUFDcEcsT0FBTztRQUNQLEtBQUs7UUFFTCxnR0FBZ0c7UUFDaEcsdUhBQXVIO1FBQ3ZILDRFQUE0RTtRQUM1RSxrREFBa0Q7UUFFbEQsV0FBVztRQUNYLG9DQUFvQztRQUVwQyx5Q0FBeUM7UUFFekMsb0ZBQW9GO1FBQ3BGLHFGQUFxRjtRQUNyRixxREFBcUQ7UUFDckQsNENBQTRDO1FBQzVDLG9DQUFvQztRQUNwQyw4RUFBOEU7UUFDOUUseUJBQXlCO1FBQ3pCLHFCQUFxQjtRQUNyQixjQUFjO1FBQ2QscUNBQXFDO1FBQ3JDLG9FQUFvRTtRQUNwRSx3QkFBd0I7UUFDeEIsc0JBQXNCO1FBQ3RCLFVBQVU7UUFFVixvR0FBb0c7UUFDcEcsaUJBQWlCO1FBQ2pCLGNBQWM7UUFDZCxxQ0FBcUM7UUFDckMscUNBQXFDO1FBQ3JDLHdCQUF3QjtRQUN4QixzQkFBc0I7UUFDdEIsVUFBVTtRQUNWLE9BQU87UUFDUCxLQUFLO0lBQ1IsQ0FBQztJQUVPLEtBQUssQ0FBQyxXQUFXLENBQUMsS0FBYTtRQUNwQyxJQUFJO1lBQ0QsTUFBTSxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQTtTQUN0RDtRQUFDLE9BQU8sR0FBRyxFQUFFO1lBQ1gsTUFBTSxJQUFJLEtBQUssQ0FBQyw2Q0FBNkMsR0FBRyxFQUFFLENBQUMsQ0FBQTtTQUNyRTtRQUVELEtBQUssSUFBSSxLQUFLLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsRUFBRTtZQUNuQyxNQUFNLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUE7U0FDL0I7SUFDSixDQUFDO0lBRU8sS0FBSyxDQUFDLFdBQVcsQ0FBQyxLQUFhO1FBQ3BDLElBQUk7WUFDRCxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUE7WUFFbkMsSUFBSSxXQUFXLEdBQUcsTUFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBZSxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUE7WUFFNUUsSUFBSSxXQUFXLEtBQUssU0FBUyxFQUFFO2dCQUM1QixNQUFNLElBQUksS0FBSyxDQUFDLHFEQUFxRCxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQTthQUNwRjtZQUVELElBQUksT0FBTyxHQUFHLE1BQU07aUJBQ2hCLFdBQVcsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDO2lCQUNsQyxXQUFXLEVBQUUsQ0FBQTtZQUVqQixPQUFPLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQTtZQUVwRSxLQUFLLElBQUksTUFBTSxJQUFJLEtBQUssQ0FBQyxPQUFPLEVBQUU7Z0JBQy9CLGdFQUFnRTtnQkFDaEUsSUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBZ0IsS0FBSyxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUE7Z0JBRXBGLElBQUksWUFBWSxLQUFLLFNBQVMsRUFBRTtvQkFDN0IsTUFBTSxJQUFJLEtBQUssQ0FBQyx5Q0FBeUMsTUFBTSxDQUFDLElBQUksYUFBYSxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQTtpQkFDaEc7Z0JBRUQsSUFBSSxHQUFHLEdBQUcsTUFBTSxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxZQUFZLEVBQUUsT0FBTyxDQUFDLENBQUE7Z0JBQ2hFLE9BQU8sR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFBO2FBQ3ZCO1lBRUQsSUFBSSxXQUFXLENBQUMsTUFBTSxJQUFJLElBQUksRUFBRTtnQkFDN0IsT0FBTyxHQUFHLE1BQU0sV0FBVyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQTthQUM3QztZQUVELE1BQU0sT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFBO1lBRXZCLE9BQU07U0FDUjtRQUFDLE9BQU8sR0FBRyxFQUFFO1lBQ1gsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQTtZQUNsQixNQUFNLEdBQUcsQ0FBQTtTQUNYO0lBQ0osQ0FBQztJQUVEOzs7Ozs7Ozs7Ozs7T0FZRztJQUNLLEtBQUssQ0FBQyxZQUFZLENBQUMsTUFBZSxFQUFFLE1BQXFCLEVBQUUsT0FBcUM7UUFDckcsSUFBSSxPQUFPLE1BQU0sQ0FBQyxZQUFZLEtBQUssVUFBVSxFQUFFO1lBQzVDLE9BQU8sR0FBRyxNQUFNLE1BQU0sQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUE7WUFDNUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxDQUFBO1NBQ3BCO1FBRUQsSUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUE7UUFFM0IsUUFBUSxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ2hCLEtBQUssZ0JBQU8sQ0FBQyxJQUFJLENBQUM7WUFDbEIsS0FBSyxnQkFBTyxDQUFDLEdBQUcsQ0FBQztZQUNqQixLQUFLLGdCQUFPLENBQUMsSUFBSSxDQUFDO1lBQ2xCLEtBQUssZ0JBQU8sQ0FBQyxNQUFNLENBQUM7WUFDcEIsS0FBSyxnQkFBTyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNoQixJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7Z0JBRS9DLFlBQVk7Z0JBQ1osT0FBTyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQTtnQkFDbkQsT0FBTyxFQUFFLE9BQU8sRUFBRSxDQUFBO2FBQ3BCO1lBQ0QsS0FBSyxnQkFBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUNyQixJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBVSxDQUFDLENBQUE7Z0JBRXJELElBQUksUUFBUSxLQUFLLFNBQVMsRUFBRTtvQkFDekIsTUFBTSxJQUFJLEtBQUssQ0FBQyw4QkFBOEIsSUFBSSxDQUFDLFNBQVMsOEhBQThILENBQUMsQ0FBQTtpQkFDN0w7Z0JBRUQsT0FBTyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsR0FBRyxRQUFTLENBQUMsU0FBUyxLQUFLLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFBO2dCQUVwSCxPQUFPLEVBQUUsT0FBTyxFQUFFLENBQUE7YUFDcEI7WUFDRCxPQUFPLENBQUMsQ0FBQztnQkFDTixNQUFNLElBQUksS0FBSyxDQUFDLGlFQUFpRSxDQUFDLENBQUE7YUFDcEY7U0FDSDtJQUNKLENBQUM7SUFFTyxhQUFhLENBQUMsSUFBYyxFQUFFLGdCQUF5QixLQUFLO1FBQ2pFLFFBQVEsSUFBSSxDQUFDLElBQUksRUFBRTtZQUNoQixLQUFLLGdCQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ2hCLE9BQU8sU0FBUyxDQUFBO2FBQ2xCO1lBQ0QsS0FBSyxnQkFBTyxDQUFDLEdBQUcsQ0FBQztZQUNqQixLQUFLLGdCQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ2hCLE9BQU8sU0FBUyxDQUFBO2FBQ2xCO1lBQ0QsS0FBSyxnQkFBTyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNoQixJQUFJLElBQUksQ0FBQyxRQUFRLElBQUksSUFBSSxFQUFFO29CQUN4QixNQUFNLElBQUkseUNBQW1CLENBQUMsMkdBQTJHLENBQUMsQ0FBQTtpQkFDNUk7Z0JBRUQsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksSUFBSSxnQkFBTyxDQUFDLElBQUksSUFBSSxhQUFhLEVBQUU7b0JBQ3RELE1BQU0sSUFBSSx5Q0FBbUIsQ0FBQyxvRkFBb0YsQ0FBQyxDQUFBO2lCQUNySDtnQkFFRCxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUE7Z0JBQ3JELE9BQU8sYUFBYSxDQUFDLENBQUMsQ0FBQyxHQUFHLE9BQU8sTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLE9BQU8sSUFBSSxDQUFBO2FBQzFEO1lBQ0QsS0FBSyxnQkFBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUNyQixJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBVSxDQUFDLENBQUE7Z0JBRWhELElBQUksR0FBRyxLQUFLLFNBQVMsRUFBRTtvQkFDcEIsTUFBTSxJQUFJLHlDQUFtQixDQUFDLFlBQVksSUFBSSxDQUFDLFNBQVMsOEhBQThILENBQUMsQ0FBQTtpQkFDekw7Z0JBRUQsT0FBTyxHQUFHLENBQUMsU0FBUyxDQUFBO2FBQ3RCO1lBQ0QsS0FBSyxnQkFBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUNsQixPQUFPLE1BQU0sQ0FBQTthQUNmO1lBQ0QsT0FBTyxDQUFDLENBQUM7Z0JBQ04sTUFBTSxJQUFJLHlDQUFtQixDQUFDLGlFQUFpRSxDQUFDLENBQUE7YUFDbEc7U0FDSDtJQUNKLENBQUM7Q0FDSDtBQXZiRCx3Q0F1YkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IGZzIGZyb20gJ2ZzLWV4dHJhJ1xuaW1wb3J0IHsgQ3JlYXRlVGFibGVCdWlsZGVyIH0gZnJvbSAna3lzZWx5J1xuaW1wb3J0IHsgQ2xpZW50IH0gZnJvbSAncGcnXG5cbmltcG9ydCB7XG4gICBCb290c3RyYXBFdmVudCxcbiAgIEV2ZW50U2V0LFxuICAgR2V0T2JqZWN0RXZlbnQsXG4gICBHZXRTdG9yZUNvbnRleHRFdmVudCxcbiAgIEhhc0lkRXZlbnQsXG4gICBJRXZlbnRSb3V0ZXIsXG4gICBJTWVtYmVyLFxuICAgSU1vZGVsLFxuICAgSVBsdWdpbixcbiAgIElTdGFjayxcbiAgIE9iamVjdFNhdmVFdmVudCxcbiAgIFN0YWNrT2JqZWN0LFxuICAgVHlwZUluZm8sXG4gICBUeXBlU2V0XG59IGZyb20gJ0BzcGlrZWRwdW5jaC9zdGFja3MnXG5pbXBvcnQgeyBTeW1ib2xUYWJsZSB9IGZyb20gJy4vU3ltYm9sVGFibGUnXG5pbXBvcnQgeyBTdGFja3NQb3N0Z3Jlc0Vycm9yIH0gZnJvbSAnLi9TdGFja3NQb3N0Z3Jlc0Vycm9yJ1xuaW1wb3J0IHsgUG9zdGdyZXNDb25maWcgfSBmcm9tICcuL1Bvc3RncmVzQ29uZmlnJ1xuaW1wb3J0IHsgUGx1Z2luQ29udGV4dCB9IGZyb20gJy4vUGx1Z2luQ29udGV4dCdcbmltcG9ydCB7IFN0b3JlZE9iamVjdCB9IGZyb20gJy4vU3RvcmVkT2JqZWN0J1xuaW1wb3J0IHsgTWVtYmVyU3ltYm9scywgTW9kZWxTeW1ib2xzIH0gZnJvbSAnLi9TeW1ib2xzJ1xuXG4vKlxuICAgTW9kZWw6XG4gICAgICB0YWJsZW5hbWU6IG1vZGVsLm5hbWUsXG4gICAgICBjdXN0b206IGFzeW5jICgpID0+IHsgfSxcbiAgICAgIGNvbXBvc2l0ZXR5cGU6IGZhbHNlXG5cblxuICAgTWVtYmVyOlxuICAgICAgZGF0YXR5cGU6IHRoaXMuZ2V0Q29sdW1uVHlwZShtZW1iZXIudmFsdWUudHlwZS5pbmZvKSxcbiAgICAgIGNvbHVtbmFtZTogbWVtYmVyLm5hbWUsXG4gICAgICBjdXN0b21jb2x1bW46IHVuZGVmaW5lZFxuXG4qL1xuXG5cbi8qXG4gICBUT0RPUzpcbiAgICAgIC0gQWRkIEVycm9yIG1lc3NhZ2VzIHRvIHRoZSB0cnkvY2FjdGhlc1xuXG4qL1xuXG5leHBvcnQgY2xhc3MgUG9zdGdyZXNQbHVnaW4gaW1wbGVtZW50cyBJUGx1Z2luIHtcbiAgIHJlYWRvbmx5IG5hbWU6IHN0cmluZyA9IFwic3RhY2tzLXBvc3RncmVzXCJcblxuICAgcHJpdmF0ZSB2ZXJzaW9uOiBzdHJpbmcgfCB1bmRlZmluZWQgPSB1bmRlZmluZWRcbiAgIHByaXZhdGUgc3ltYm9sczogU3ltYm9sVGFibGUgPSBuZXcgU3ltYm9sVGFibGUoKVxuICAgcHJpdmF0ZSBjb250ZXh0OiBQbHVnaW5Db250ZXh0XG5cbiAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IGNvbmZpZzogUG9zdGdyZXNDb25maWcpIHtcbiAgICAgIHRoaXMuY29udGV4dCA9IG5ldyBQbHVnaW5Db250ZXh0KGNvbmZpZylcbiAgIH1cblxuICAgLyoqXG4gICAgKiBEcm9wcyBhIERhdGFiYXNlIGZyb20gdGhlIHNlcnZlci4gRW5zdXJlIHRoZSBjcmVkZW50aWFscyBwcm92aWRlZFxuICAgICogaGF2ZSB0aGUgcmlnaHQgcGVybWlzc2lvbnMgdG8gRHJvcCB0aGUgVGFibGUuXG4gICAgKiBcbiAgICAqIEBwYXJhbSBkYk5hbWUgVGhlIERhdGFiYXNlIG5hbWUgdG8gZHJvcFxuICAgICovXG4gICBhc3luYyBkcm9wRGIoZGJOYW1lOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgIGxldCBjbGllbnQgPSBuZXcgQ2xpZW50KHtcbiAgICAgICAgIGhvc3Q6IHRoaXMuY29uZmlnLmhvc3QsXG4gICAgICAgICBwb3J0OiB0aGlzLmNvbmZpZy5wb3J0LFxuICAgICAgICAgdXNlcjogdGhpcy5jb25maWcudXNlcixcbiAgICAgICAgIHBhc3N3b3JkOiB0aGlzLmNvbmZpZy5wYXNzd29yZCxcbiAgICAgICAgIGRhdGFiYXNlOiAncG9zdGdyZXMnXG4gICAgICB9KVxuXG4gICAgICB0cnkge1xuICAgICAgICAgYXdhaXQgY2xpZW50LmNvbm5lY3QoKVxuICAgICAgICAgYXdhaXQgY2xpZW50LnF1ZXJ5KGBEUk9QIERBVEFCQVNFIElGIEVYSVNUUyAke2RiTmFtZX1gKVxuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICB0aHJvdyBlcnJcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICBhd2FpdCBjbGllbnQuZW5kKClcbiAgICAgIH1cbiAgIH1cblxuICAgYXN5bmMgY3JlYXRlRGJJZk5vdEV4aXN0cyhkYk5hbWU6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgLypcbiAgICAgICAgIE5vdGU6XG4gICAgICAgICBJbiBvcmRlciB0byBjcmVhdGUgYSBkYXRhYmFzZSB0YWJsZSwgeW91IG5lZWQgdG8gYmUgY29ubmVjdGVkIHRvXG4gICAgICAgICBzb21lIGRhdGFiYXNlLiBXZSBjb25uZWN0IHRvIHRoZSAncG9zdGdyZXMnIGRhdGFiYXNlLCBhbmQgcnVuIG91clxuICAgICAgICAgcXVlcmllcyBmcm9tIHRoZXJlLlxuICAgICAgKi9cblxuICAgICAgbGV0IGNsaWVudCA9IG5ldyBDbGllbnQoe1xuICAgICAgICAgaG9zdDogdGhpcy5jb25maWcuaG9zdCxcbiAgICAgICAgIHBvcnQ6IHRoaXMuY29uZmlnLnBvcnQsXG4gICAgICAgICB1c2VyOiB0aGlzLmNvbmZpZy51c2VyLFxuICAgICAgICAgcGFzc3dvcmQ6IHRoaXMuY29uZmlnLnBhc3N3b3JkLFxuICAgICAgICAgZGF0YWJhc2U6ICdwb3N0Z3JlcydcbiAgICAgIH0pXG5cbiAgICAgIHRyeSB7XG4gICAgICAgICBhd2FpdCBjbGllbnQuY29ubmVjdCgpXG5cbiAgICAgICAgIGxldCByZXMgPSBhd2FpdCBjbGllbnQucXVlcnkoYFNFTEVDVCBGUk9NIHBnX2RhdGFiYXNlIFdIRVJFIGRhdG5hbWUgPSAnJHtkYk5hbWV9J2ApXG5cbiAgICAgICAgIGlmIChyZXMucm93cy5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgYXdhaXQgY2xpZW50LnF1ZXJ5KGBDUkVBVEUgREFUQUJBU0UgJHtkYk5hbWV9YClcbiAgICAgICAgIH1cbiAgICAgICAgIC8vYXdhaXQgY2xpZW50LnF1ZXJ5KGBTRUxFQ1QgJ0NSRUFURSBEQVRBQkFTRSAke2RiTmFtZX0nIFdIRVJFIE5PVCBFWElTVFMgKFNFTEVDVCBGUk9NIHBnX2RhdGFiYXNlIFdIRVJFIGRhdG5hbWUgPSAnJHtkYk5hbWV9JylgKVxuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICB0aHJvdyBlcnJcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICBhd2FpdCBjbGllbnQuZW5kKClcbiAgICAgIH1cbiAgIH1cblxuICAgLypcbiAgZXhwb3J0IGVudW0gRXZlbnRTZXQge1xuICAgICAgR2V0TW9kZWwgPSAnZ2V0LW1vZGVsJyxcbiAgICAgIE1vZGVsQ3JlYXRlZCA9ICdtb2RlbC1jcmVhdGVkJyxcbiAgICAgIE1vZGVsRGVsZXRlZCA9ICdtb2RlbC1kZWxldGVkJyxcbiAgICAgIE1vZGVsVXBkYXRlZCA9ICdtb2RlbC11cGRhdGVkJyxcblxuICB9XG5cbiAgICAgIEJvb3RzdHJhcCA9ICdib290c3RyYXAnLFxuICAgICAgR2V0T2JqZWN0ID0gJ2dldC1vYmplY3QnLFxuICAgICAgR2V0TWFueU9iamVjdHMgPSAnZ2V0LW1hbnktb2JqZWN0cycsXG4gICAgICBHZXRTdG9yZUNvbnRleHQgPSAnZ2V0LXN0b3JlLWNvbnRleHQnLFxuICAgICAgSGFzSWQgPSAnaGFzLWlkJyxcbiAgICAgIE9iamVjdENyZWF0ZWQgPSAnb2JqZWN0LWNyZWF0ZWQnLFxuICAgICAgT2JqZWN0RGVsZXRlZCA9ICdvYmplY3QtZGVsZXRlZCcsXG4gICAgICBPYmplY3RVcGRhdGVkID0gJ29iamVjdC11cGRhdGVkJyxcbiAgICAgIE9iamVjdFNhdmVkID0gJ29iamVjdC1zYXZlZCdcbiAgICAgKi9cblxuICAgYXN5bmMgc2V0dXAoc3RhY2s6IElTdGFjaywgcm91dGVyOiBJRXZlbnRSb3V0ZXIpOiBQcm9taXNlPHZvaWQ+IHtcblxuICAgICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICByb3V0ZXIub248Qm9vdHN0cmFwRXZlbnQ+KEV2ZW50U2V0LkJvb3RzdHJhcCwgYXN5bmMgKGV2ZW50OiBCb290c3RyYXBFdmVudCkgPT4ge1xuICAgICAgICAgLy8gYXdhaXQgdGhpcy5kYi5zY2hlbWFcbiAgICAgICAgIC8vICAgIC5jcmVhdGVUYWJsZSgncGV0JylcbiAgICAgICAgIC8vICAgIC5hZGRDb2x1bW4oJ25hbWUnLCAndGV4dCcpXG4gICAgICAgICAvLyAgICAuYWRkQ29sdW1uKCdzcGVjaWVzJywgJ3RleHQnKVxuICAgICAgICAgLy8gICAgLmFkZENvbHVtbignbnVtYmVyX29mX2xlZ3MnLCAnaW50ZWdlcicsIChjb2wpID0+IGNvbC5kZWZhdWx0VG8oNCkpXG4gICAgICAgICAvLyAgICAuZXhlY3V0ZSgpXG5cbiAgICAgICAgIC8vIGF3YWl0IHRoaXMuZGJcbiAgICAgICAgIC8vICAgIC5pbnNlcnRJbnRvKCdwZXQnKVxuICAgICAgICAgLy8gICAgLnZhbHVlcyh7XG4gICAgICAgICAvLyAgICAgICBuYW1lOiAnQ2F0dG8nLFxuICAgICAgICAgLy8gICAgICAgc3BlY2llczogJ2NhdCcsXG4gICAgICAgICAvLyAgICAgICBudW1iZXJfb2ZfbGVnczogNFxuICAgICAgICAgLy8gICAgfSlcbiAgICAgICAgIC8vICAgIC5leGVjdXRlKClcblxuICAgICAgICAgYXdhaXQgdGhpcy5zeW1ib2xzLmNvbGxlY3Qoc3RhY2ssIHtcbiAgICAgICAgICAgIG1vZGVsOiB7XG4gICAgICAgICAgICAgICBwcmVmaXg6ICdwb3N0Z3JlczonLFxuICAgICAgICAgICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgICAgICAgICAgIHRhYmxlbmFtZTogYXN5bmMgKG1vZGVsOiBJTW9kZWwpOiBQcm9taXNlPHN0cmluZz4gPT4gbW9kZWwubmFtZSxcbiAgICAgICAgICAgICAgICAgIGN1c3RvbTogYXN5bmMgKCkgPT4geyB9XG4gICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG1lbWJlcnM6IHtcbiAgICAgICAgICAgICAgIHByZWZpeDogJ3Bvc3RncmVzOicsXG4gICAgICAgICAgICAgICBkZWZhdWx0czoge1xuICAgICAgICAgICAgICAgICAgZGF0YXR5cGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICAgIGNvbHVtbmFtZTogYXN5bmMgKG1lbWJlcjogSU1lbWJlcik6IFByb21pc2U8c3RyaW5nPiA9PiBtZW1iZXIubmFtZSxcbiAgICAgICAgICAgICAgICAgIGN1c3RvbWNvbHVtbjogdW5kZWZpbmVkXG4gICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICB9KVxuXG4gICAgICAgICB0aGlzLmNvbnRleHQuYnVpbGRNb2RlbFRvVGFibGVNYXAoc3RhY2ssIHRoaXMuc3ltYm9scylcblxuICAgICAgICAgYXdhaXQgdGhpcy5ib290c3RyYXBEYihzdGFjaylcbiAgICAgIH0pXG5cbiAgICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgcm91dGVyLm9uPEhhc0lkRXZlbnQ+KEV2ZW50U2V0Lkhhc0lkLCBhc3luYyAoZXZlbnQ6IEhhc0lkRXZlbnQpID0+IHtcbiAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsZXQgZm91bmQgPSBhd2FpdCBTdG9yZWRPYmplY3QuZnJvbUlkKGV2ZW50Lm1vZGVsLCBldmVudC5pZCwgdGhpcy5jb250ZXh0KVxuICAgICAgICAgICAgZXZlbnQuaGFzSWQgPSBmb3VuZCAhPT0gdW5kZWZpbmVkXG4gICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIHRocm93IGVyclxuICAgICAgICAgfVxuICAgICAgfSlcblxuICAgICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICByb3V0ZXIub24oRXZlbnRTZXQuR2V0U3RvcmVDb250ZXh0LCBhc3luYyAoZXZlbnQ6IEdldFN0b3JlQ29udGV4dEV2ZW50KSA9PiB7XG4gICAgICAgICBpZiAodGhpcy52ZXJzaW9uID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGxldCBwa2cgPSBhd2FpdCBmcy5yZWFkSnNvbihwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4nLCAncGFja2FnZS5qc29uJykpXG4gICAgICAgICAgICB0aGlzLnZlcnNpb24gPSBwa2cudmVyc2lvblxuICAgICAgICAgfVxuXG4gICAgICAgICBldmVudC5jb250ZXh0cy5wdXNoKHtcbiAgICAgICAgICAgIG5hbWU6ICdzdGFja3M6cG9zdGdyZXMnLFxuICAgICAgICAgICAgdmVyc2lvbjogdGhpcy52ZXJzaW9uIHx8ICd2ZXJzaW9uLW5vdC1zZXQnLFxuICAgICAgICAgICAgc3RvcmU6IHtcbiAgICAgICAgICAgICAgIGNvbmZpZzogdGhpcy5jb25maWcsXG4gICAgICAgICAgICAgICBkYjogdGhpcy5jb250ZXh0LmRiXG4gICAgICAgICAgICB9XG4gICAgICAgICB9KVxuICAgICAgfSlcblxuICAgICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICByb3V0ZXIub248R2V0T2JqZWN0RXZlbnQ8U3RhY2tPYmplY3Q+PihFdmVudFNldC5HZXRPYmplY3QsIGFzeW5jIChldmVudDogR2V0T2JqZWN0RXZlbnQ8U3RhY2tPYmplY3Q+KSA9PiB7XG4gICAgICAgICB0cnkge1xuICAgICAgICAgICAgbGV0IGZvdW5kID0gYXdhaXQgU3RvcmVkT2JqZWN0LmZyb21JZChldmVudC5tb2RlbCwgZXZlbnQuaWQsIHRoaXMuY29udGV4dClcblxuICAgICAgICAgICAgY29uc29sZS5kaXIoZm91bmQsIHsgZGVwdGg6IG51bGwgfSlcblxuICAgICAgICAgICAgLy8gaWYgKHJlc3VsdC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIC8vICAgIGV2ZW50LmV4aXN0cyA9IEV4aXN0U3RhdGUuRG9lc05vdEV4aXN0XG4gICAgICAgICAgICAvLyAgICByZXR1cm5cbiAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgIC8vZXZlbnQub2JqZWN0ID0gcmVzdWx0LlxuICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICB0aHJvdyBlcnJcbiAgICAgICAgIH1cbiAgICAgIH0pXG5cbiAgICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgLy8gcm91dGVyLm9uPEdldE1hbnlPYmplY3RzRXZlbnQ8U3RhY2tPYmplY3Q+PihFdmVudFNldC5HZXRNYW55T2JqZWN0cywgYXN5bmMgKGV2ZW50OiBHZXRNYW55T2JqZWN0c0V2ZW50PFN0YWNrT2JqZWN0PikgPT4ge1xuICAgICAgLy8gICAgbGV0IG1vZGVsRGlyID0gdGhpcy5nZXRNb2RlbERpcihldmVudC5tb2RlbC5uYW1lKVxuICAgICAgLy8gICAgbGV0IHJlcUN1cnNvciA9IGV2ZW50Lm9wdGlvbnMuY3Vyc29yIHx8ICcnXG4gICAgICAvLyAgICBsZXQgcmVxQ291bnQgPSBldmVudC5vcHRpb25zLmxpbWl0ID09IG51bGwgPyAxMDAgOiBldmVudC5vcHRpb25zLmxpbWl0XG5cbiAgICAgIC8vICAgIC8vIElnbm9yZSBhbnkgVGVtcCBmaWxlcyB0aGF0IG1heSBiZSBpbiB0aGUgZGlyZWN0b3J5XG4gICAgICAvLyAgICBsZXQgZmlsZXMgPSBhd2FpdCBmcy5yZWFkZGlyKG1vZGVsRGlyKVxuICAgICAgLy8gICAgZmlsZXMgPSBmaWxlcy5maWx0ZXIoaXQgPT4gcGF0aC5wYXJzZShpdCkuZXh0ICE9PSBUZW1wRmlsZUV4dClcbiAgICAgIC8vICAgIGZpbGVzLnNvcnQoKVxuXG4gICAgICAvLyAgICBsZXQgY3Vyc29yID0gJydcbiAgICAgIC8vICAgIGxldCBzdGFydEluZGV4ID0gMFxuICAgICAgLy8gICAgbGV0IHJlcXVlc3RlZEZpbGVzID0gbmV3IEFycmF5PHN0cmluZz4oKVxuXG4gICAgICAvLyAgICAvLyBUaGUgY3Vyc29yIGJlY29tZXMgdGhlIG5leHQgZmlsZSBvbmUgaW4gdGhlIHNvcnRlZCBsaXN0XG4gICAgICAvLyAgICBpZiAocmVxQ3Vyc29yICE9PSAnJykge1xuICAgICAgLy8gICAgICAgbGV0IG5hbWVzID0gZmlsZXMubWFwKGYgPT4gcGF0aC5wYXJzZShmKS5uYW1lKVxuXG4gICAgICAvLyAgICAgICBsZXQgZGVjb2RlZEN1cnNvciA9IEJ1ZmZlci5mcm9tKHJlcUN1cnNvciwgJ2Jhc2U2NCcpLnRvU3RyaW5nKCdhc2NpaScpXG4gICAgICAvLyAgICAgICBsZXQgZm91bmQgPSBuYW1lcy5maW5kSW5kZXgoaXQgPT4gaXQgPT09IGRlY29kZWRDdXJzb3IpXG5cbiAgICAgIC8vICAgICAgIGlmIChmb3VuZCA8IDApIHtcbiAgICAgIC8vICAgICAgICAgIGZvdW5kID0gMFxuICAgICAgLy8gICAgICAgICAgZXZlbnQud2FzQ3Vyc29yRm91bmQgPSBmYWxzZVxuICAgICAgLy8gICAgICAgfSBlbHNlIHtcbiAgICAgIC8vICAgICAgICAgIHN0YXJ0SW5kZXggPSBmb3VuZFxuICAgICAgLy8gICAgICAgfVxuICAgICAgLy8gICAgfVxuXG4gICAgICAvLyAgICBsZXQgZW5kSW5kZXggPSByZXFDb3VudCArIHN0YXJ0SW5kZXhcbiAgICAgIC8vICAgIHJlcXVlc3RlZEZpbGVzID0gZmlsZXMuc2xpY2Uoc3RhcnRJbmRleCwgZW5kSW5kZXgpXG5cbiAgICAgIC8vICAgIGlmIChlbmRJbmRleCA8IChmaWxlcy5sZW5ndGggLSAxKSkge1xuICAgICAgLy8gICAgICAgbGV0IHBhcnNlZCA9IHBhdGgucGFyc2UocGF0aC5qb2luKHRoaXMuYmFzZURpciwgZmlsZXNbZW5kSW5kZXhdKSlcbiAgICAgIC8vICAgICAgIGN1cnNvciA9IHBhcnNlZC5uYW1lXG4gICAgICAvLyAgICB9IGVsc2Uge1xuICAgICAgLy8gICAgICAgY3Vyc29yID0gJydcbiAgICAgIC8vICAgIH1cblxuICAgICAgLy8gICAgbGV0IG9iamVjdHMgPSBuZXcgQXJyYXk8U3RhY2tPYmplY3Q+KClcblxuICAgICAgLy8gICAgZm9yIChsZXQgZmlsZSBvZiByZXF1ZXN0ZWRGaWxlcykge1xuICAgICAgLy8gICAgICAgb2JqZWN0cy5wdXNoKGF3YWl0IGZzLnJlYWRKc29uKHBhdGguam9pbihtb2RlbERpciwgZmlsZSkpKVxuICAgICAgLy8gICAgfVxuXG4gICAgICAvLyAgICBldmVudC5yZXN1bHRzID0ge1xuICAgICAgLy8gICAgICAgY3Vyc29yOiBjdXJzb3IgPT09ICcnID8gJycgOiBCdWZmZXIuZnJvbShjdXJzb3IpLnRvU3RyaW5nKCdiYXNlNjQnKSxcbiAgICAgIC8vICAgICAgIGl0ZW1zOiBvYmplY3RzXG4gICAgICAvLyAgICB9XG4gICAgICAvLyB9KVxuXG4gICAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIHJvdXRlci5vbjxPYmplY3RTYXZlRXZlbnQ8U3RhY2tPYmplY3Q+PihFdmVudFNldC5PYmplY3RTYXZlZCwgYXN5bmMgKGV2ZW50OiBPYmplY3RTYXZlRXZlbnQ8U3RhY2tPYmplY3Q+KSA9PiB7XG4gICAgICAgICB0cnkge1xuICAgICAgICAgICAgbGV0IHN0b3JlZE9iaiA9IGF3YWl0IFN0b3JlZE9iamVjdC5jcmVhdGUoZXZlbnQubW9kZWwsIGV2ZW50Lm9iamVjdCwgdGhpcy5jb250ZXh0KVxuICAgICAgICAgICAgYXdhaXQgc3RvcmVkT2JqLnNhdmUoKVxuICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBjb25zb2xlLmRpcihlcnIpXG4gICAgICAgICAgICB0aHJvdyBlcnJcbiAgICAgICAgIH1cbiAgICAgIH0pXG5cbiAgICAgIC8vIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgLy8gcm91dGVyLm9uPEdldE9iamVjdEV2ZW50PFN0YWNrT2JqZWN0Pj4oRXZlbnRTZXQuR2V0T2JqZWN0LCBhc3luYyAoZXZlbnQ6IEdldE9iamVjdEV2ZW50PFN0YWNrT2JqZWN0PikgPT4ge1xuICAgICAgLy8gICAgbGV0IG9iamVjdFBhdGggPSB0aGlzLmdldE9iamVjdFBhdGgoZXZlbnQubW9kZWwuaWQsIGV2ZW50LmlkKVxuXG4gICAgICAvLyAgICB0cnkge1xuICAgICAgLy8gICAgICAgbGV0IG9iaiA9IGF3YWl0IGZzLnJlYWRKc29uKG9iamVjdFBhdGgpXG4gICAgICAvLyAgICAgICBldmVudC5vYmplY3QgPSBvYmpcbiAgICAgIC8vICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgLy8gICAgICAgdGhyb3cgbmV3IEVycm9yKGBbc3RhY2tzLWZzXSBGYWlsZWQgdG8gcmV0cmlldmUgT2JqZWN0ICR7ZXZlbnQuaWR9LiBSZWFzb24gJHtlcnJ9YClcbiAgICAgIC8vICAgIH1cbiAgICAgIC8vIH0pXG5cbiAgICAgIC8vIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgLy8gcm91dGVyLm9uPERlbGV0ZU9iamVjdEV2ZW50PFN0YWNrT2JqZWN0Pj4oRXZlbnRTZXQuT2JqZWN0RGVsZXRlZCwgYXN5bmMgKGV2ZW50OiBEZWxldGVPYmplY3RFdmVudDxTdGFja09iamVjdD4pID0+IHtcbiAgICAgIC8vICAgIGxldCBvYmplY3RQYXRoID0gdGhpcy5nZXRPYmplY3RQYXRoKGV2ZW50Lm1vZGVsLm5hbWUsIGV2ZW50Lm9iamVjdC5pZClcblxuICAgICAgLy8gICAgdHJ5IHtcbiAgICAgIC8vICAgICAgIGF3YWl0IGZzLnJlbW92ZShvYmplY3RQYXRoKVxuICAgICAgLy8gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAvLyAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFtzdGFja3MtZnNdIEZhaWxlZCB0byBkZWxldGUgYW4gT2JqZWN0ICR7ZXZlbnQub2JqZWN0LmlkfS4gUmVhc29uICR7ZXJyfWApXG4gICAgICAvLyAgICB9XG4gICAgICAvLyB9KVxuXG4gICAgICAvLyAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIC8vIHJvdXRlci5vbjxVcGRhdGVPYmplY3RFdmVudDxTdGFja09iamVjdD4+KEV2ZW50U2V0Lk9iamVjdFVwZGF0ZWQsIGFzeW5jIChldmVudDogVXBkYXRlT2JqZWN0RXZlbnQ8U3RhY2tPYmplY3Q+KSA9PiB7XG4gICAgICAvLyAgICBsZXQgb2JqZWN0UGF0aCA9IHRoaXMuZ2V0T2JqZWN0UGF0aChldmVudC5tb2RlbC5uYW1lLCBldmVudC5vYmplY3QuaWQpXG4gICAgICAvLyAgICBsZXQgdGVtcFBhdGggPSBgJHtvYmplY3RQYXRofSR7VGVtcEZpbGVFeHR9YFxuXG4gICAgICAvLyAgICB0cnkge1xuICAgICAgLy8gICAgICAgYXdhaXQgZnMuYWNjZXNzKG9iamVjdFBhdGgpXG5cbiAgICAgIC8vICAgICAgIGV2ZW50LmV4aXN0cyA9IEV4aXN0U3RhdGUuRXhpc3RzXG5cbiAgICAgIC8vICAgICAgIC8vIFdlIGVuc3VyZSB3ZSBhbHdheXMgaGF2ZSBhIGNvcHkgb2YgdGhlIG9yaWdpbmFsIHVudGlsIHdlJ3JlIGRvbmUgd3JpdGluZ1xuICAgICAgLy8gICAgICAgLy8gdGhlIGNoYW5nZWQgZmlsZS4gV2UgcmVtb3ZlIHRoZSBjb3B5IGlmIHRoZSB3cml0ZSBpcyBzdWNlc3NmdWwsIG90aGVyd2lzZVxuICAgICAgLy8gICAgICAgLy8gd2Ugcm9sbGJhY2sgdGhlIGNoYW5nZSBhbmQga2VlcCB0aGUgY29weS5cbiAgICAgIC8vICAgICAgIGF3YWl0IGZzLmNvcHkob2JqZWN0UGF0aCwgdGVtcFBhdGgpXG4gICAgICAvLyAgICAgICBhd2FpdCBmcy5yZW1vdmUob2JqZWN0UGF0aClcbiAgICAgIC8vICAgICAgIGF3YWl0IGZzLndyaXRlSnNvbihvYmplY3RQYXRoLCBldmVudC5zZXJpYWxpemUudG9KcygpLCB7IHNwYWNlczogMiB9KVxuICAgICAgLy8gICAgICAgZXZlbnQudXBkYXRlZCA9IFxuICAgICAgLy8gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAvLyAgICAgICB0cnkge1xuICAgICAgLy8gICAgICAgICAgYXdhaXQgZnMuYWNjZXNzKHRlbXBQYXRoKVxuICAgICAgLy8gICAgICAgICAgYXdhaXQgZnMubW92ZSh0ZW1wUGF0aCwgb2JqZWN0UGF0aCwgeyBvdmVyd3JpdGU6IHRydWUgfSlcbiAgICAgIC8vICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgLy8gICAgICAgICAgLy8gc3dhbGxvd1xuICAgICAgLy8gICAgICAgfVxuXG4gICAgICAvLyAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFtzdGFja3MtZnNdIEZhaWxlZCB0byB1cGRhdGUgYW4gT2JqZWN0ICR7ZXZlbnQub2JqZWN0LmlkfS4gUmVhc29uICR7ZXJyfWApXG4gICAgICAvLyAgICB9IGZpbmFsbHkge1xuICAgICAgLy8gICAgICAgdHJ5IHtcbiAgICAgIC8vICAgICAgICAgIGF3YWl0IGZzLmFjY2Vzcyh0ZW1wUGF0aClcbiAgICAgIC8vICAgICAgICAgIGF3YWl0IGZzLnJlbW92ZSh0ZW1wUGF0aClcbiAgICAgIC8vICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgLy8gICAgICAgICAgLy8gc3dhbGxvd1xuICAgICAgLy8gICAgICAgfVxuICAgICAgLy8gICAgfVxuICAgICAgLy8gfSlcbiAgIH1cblxuICAgcHJpdmF0ZSBhc3luYyBib290c3RyYXBEYihzdGFjazogSVN0YWNrKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICB0cnkge1xuICAgICAgICAgYXdhaXQgdGhpcy5jcmVhdGVEYklmTm90RXhpc3RzKHRoaXMuY29uZmlnLmRhdGFiYXNlKVxuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEZhaWxlZCB0byBjb25uZWN0IHRvIFBvc3RncmVzIERCLiBSZWFzb246ICR7ZXJyfWApXG4gICAgICB9XG5cbiAgICAgIGZvciAobGV0IG1vZGVsIG9mIHN0YWNrLmdldC5tb2RlbHMoKSkge1xuICAgICAgICAgYXdhaXQgdGhpcy5jcmVhdGVUYWJsZShtb2RlbClcbiAgICAgIH1cbiAgIH1cblxuICAgcHJpdmF0ZSBhc3luYyBjcmVhdGVUYWJsZShtb2RlbDogSU1vZGVsKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICB0cnkge1xuICAgICAgICAgbGV0IHNjaGVtYSA9IHRoaXMuY29udGV4dC5kYi5zY2hlbWFcblxuICAgICAgICAgbGV0IHRhYmxlQ29uZmlnID0gYXdhaXQgdGhpcy5zeW1ib2xzLmdldE1vZGVsU3ltYm9sczxNb2RlbFN5bWJvbHM+KG1vZGVsLmlkKVxuXG4gICAgICAgICBpZiAodGFibGVDb25maWcgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBGYWlsZWQgdG8gZmluZCBhbnkgU3ltYm9sIGNvbmZpZ3VyYXRpb24gZm9yIE1vZGVsICR7bW9kZWwubmFtZX1gKVxuICAgICAgICAgfVxuXG4gICAgICAgICBsZXQgYnVpbGRlciA9IHNjaGVtYVxuICAgICAgICAgICAgLmNyZWF0ZVRhYmxlKHRhYmxlQ29uZmlnLnRhYmxlbmFtZSlcbiAgICAgICAgICAgIC5pZk5vdEV4aXN0cygpXG5cbiAgICAgICAgIGJ1aWxkZXIgPSBidWlsZGVyLmFkZENvbHVtbignaWQnLCAndGV4dCcsIChjb2wpID0+IGNvbC5wcmltYXJ5S2V5KCkpXG5cbiAgICAgICAgIGZvciAobGV0IG1lbWJlciBvZiBtb2RlbC5tZW1iZXJzKSB7XG4gICAgICAgICAgICAvLyBUT0RPOiBHZXQgdGhlIFR5cGUgdG8gYmUgYWJsZSB0byBhc3NpZ24gYSBkZWZhdWx0IHR5cGUgZm9yIGl0XG4gICAgICAgICAgICBsZXQgY29sdW1uQ29uZmlnID0gdGhpcy5zeW1ib2xzLmdldE1lbWJlclN5bWJvbHM8TWVtYmVyU3ltYm9scz4obW9kZWwuaWQsIG1lbWJlci5pZClcblxuICAgICAgICAgICAgaWYgKGNvbHVtbkNvbmZpZyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEZhaWxlZCB0byBmaW5kIGFueSBTeW1ib2xzIGZvciBNRW1iZXIgJHttZW1iZXIubmFtZX0gaW4gTW9kZWwgJHttb2RlbC5uYW1lfWApXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBvYmogPSBhd2FpdCB0aGlzLmNyZWF0ZUNvbHVtbihtZW1iZXIsIGNvbHVtbkNvbmZpZywgYnVpbGRlcilcbiAgICAgICAgICAgIGJ1aWxkZXIgPSBvYmouYnVpbGRlclxuICAgICAgICAgfVxuXG4gICAgICAgICBpZiAodGFibGVDb25maWcuY3VzdG9tICE9IG51bGwpIHtcbiAgICAgICAgICAgIGJ1aWxkZXIgPSBhd2FpdCB0YWJsZUNvbmZpZy5jdXN0b20oYnVpbGRlcilcbiAgICAgICAgIH1cblxuICAgICAgICAgYXdhaXQgYnVpbGRlci5leGVjdXRlKClcblxuICAgICAgICAgcmV0dXJuXG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKVxuICAgICAgICAgdGhyb3cgZXJyXG4gICAgICB9XG4gICB9XG5cbiAgIC8qKlxuICAgICogQ3JlYXRlcyBhIENvbHVtbiBmb3IgYSBNZW1iZXIuIFxuICAgICogXG4gICAgKiBOb3RlOiBcbiAgICAqIFRoaXMgZnVuY3Rpb24gY2Fubm90IHJldHVybiBhIENyZWF0ZVRhYmxlQnVpbGRlciBhcyBhIFByb21pc2UuIFRoZXJlIGlzIGNvZGVcbiAgICAqIGluIHRoZSBrZXNsZXkgbGlicmFyeSB0aGF0IGVycm9ycyB3aGVuIHlvdSBhd2FpdCBhIENyZWF0ZVRhYmxlQnVpbGRlciB0aGF0IGdldHNcbiAgICAqIHRyaWdnZXJlZCB3aGVuIHJldHVybmluZyBmcm9tIGEgUHJvbWlzZS5cbiAgICAqIFxuICAgICogQHBhcmFtIG1lbWJlciBUaGUgTWVtYmVyIHRoYXQgcmVwcmVzZW50cyB0aGUgQ29sdW1uXG4gICAgKiBAcGFyYW0gY29uZmlnIFRoZSBQb3N0Z3JlcyBTeW1ib2wgdGFibGUgZm9yIHRoZSBNZW1iZXJcbiAgICAqIEBwYXJhbSBidWlsZGVyIFRoZSBjdXJyZW50IEJ1aWxkZXJcbiAgICAqIEByZXR1cm5zIFxuICAgICovXG4gICBwcml2YXRlIGFzeW5jIGNyZWF0ZUNvbHVtbihtZW1iZXI6IElNZW1iZXIsIGNvbmZpZzogTWVtYmVyU3ltYm9scywgYnVpbGRlcjogQ3JlYXRlVGFibGVCdWlsZGVyPGFueSwgYW55Pik6IFByb21pc2U8eyBidWlsZGVyOiBDcmVhdGVUYWJsZUJ1aWxkZXI8YW55LCBhbnk+IH0+IHtcbiAgICAgIGlmICh0eXBlb2YgY29uZmlnLmN1c3RvbWNvbHVtbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgYnVpbGRlciA9IGF3YWl0IGNvbmZpZy5jdXN0b21jb2x1bW4oYnVpbGRlcilcbiAgICAgICAgIHJldHVybiB7IGJ1aWxkZXIgfVxuICAgICAgfVxuXG4gICAgICBsZXQgaW5mbyA9IG1lbWJlci50eXBlLmluZm9cblxuICAgICAgc3dpdGNoIChpbmZvLnR5cGUpIHtcbiAgICAgICAgIGNhc2UgVHlwZVNldC5Cb29sOlxuICAgICAgICAgY2FzZSBUeXBlU2V0LkludDpcbiAgICAgICAgIGNhc2UgVHlwZVNldC5VSW50OlxuICAgICAgICAgY2FzZSBUeXBlU2V0LlN0cmluZzpcbiAgICAgICAgIGNhc2UgVHlwZVNldC5MaXN0OiB7XG4gICAgICAgICAgICBsZXQgdHlwZSA9IHRoaXMuZ2V0Q29sdW1uVHlwZShtZW1iZXIudHlwZS5pbmZvKVxuXG4gICAgICAgICAgICAvL0B0cy1pZ25vcmVcbiAgICAgICAgICAgIGJ1aWxkZXIgPSBidWlsZGVyLmFkZENvbHVtbihjb25maWcuY29sdW1uYW1lLCB0eXBlKVxuICAgICAgICAgICAgcmV0dXJuIHsgYnVpbGRlciB9XG4gICAgICAgICB9XG4gICAgICAgICBjYXNlIFR5cGVTZXQuT2JqZWN0UmVmOiB7XG4gICAgICAgICAgICBsZXQgcmVmVGFibGUgPSB0aGlzLmNvbnRleHQuZ2V0VGFibGUoaW5mby5tb2RlbE5hbWUhKVxuXG4gICAgICAgICAgICBpZiAocmVmVGFibGUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBbc3RhY2tzLXBvc3RncmVzXSBBIE1vZGVsIFwiJHtpbmZvLm1vZGVsTmFtZX1cIiBpcyBiZWluZyByZWZlcmVuY2VkIGluIGEgTW9kZWwgcHJvcGVydHksIGJ1dCB0aGUgTW9kZWwgY2Fubm90IGJlIGZvdW5kLiBFbnN1cmUgeW91IGNyZWF0ZSB0aGUgTW9kZWwgYmVmb3JlIHJlZmVyZW5jaW5nIGl0LmApXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGJ1aWxkZXIgPSBidWlsZGVyLmFkZENvbHVtbihjb25maWcuY29sdW1uYW1lLCAndGV4dCcsIChjb2wpID0+IGNvbC5yZWZlcmVuY2VzKGAke3JlZlRhYmxlIS50YWJsZU5hbWV9LmlkYCkudW5pcXVlKCkpXG5cbiAgICAgICAgICAgIHJldHVybiB7IGJ1aWxkZXIgfVxuICAgICAgICAgfVxuICAgICAgICAgZGVmYXVsdDoge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbnN1cHBvcnRlZCBUeXBlIGVuY291bnRlcmVkIHdoZW4gQm9vdHN0cmFwcGluZyB0aGUgUG9zdGdyZXMgREJgKVxuICAgICAgICAgfVxuICAgICAgfVxuICAgfVxuXG4gICBwcml2YXRlIGdldENvbHVtblR5cGUoaW5mbzogVHlwZUluZm8sIGlzQWxyZWFkeUxpc3Q6IGJvb2xlYW4gPSBmYWxzZSk6IHN0cmluZyB7XG4gICAgICBzd2l0Y2ggKGluZm8udHlwZSkge1xuICAgICAgICAgY2FzZSBUeXBlU2V0LkJvb2w6IHtcbiAgICAgICAgICAgIHJldHVybiAnYm9vbGVhbidcbiAgICAgICAgIH1cbiAgICAgICAgIGNhc2UgVHlwZVNldC5JbnQ6XG4gICAgICAgICBjYXNlIFR5cGVTZXQuVUludDoge1xuICAgICAgICAgICAgcmV0dXJuICdpbnRlZ2VyJ1xuICAgICAgICAgfVxuICAgICAgICAgY2FzZSBUeXBlU2V0Lkxpc3Q6IHtcbiAgICAgICAgICAgIGlmIChpbmZvLml0ZW1UeXBlID09IG51bGwpIHtcbiAgICAgICAgICAgICAgIHRocm93IG5ldyBTdGFja3NQb3N0Z3Jlc0Vycm9yKGBFbmNvdW50ZXJlZCBhbiBpc3N1ZSB3aGVuIGF0dGVtcHRpbmcgZGV0ZXJtaW5lIHRoZSBkZWZhdWx0IGZvciBhIExpc3QgVHlwZS4gSXQncyBzdWIgdHlwZSBpcyBub3QgZGVmaW5lZC5gKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoaW5mby5pdGVtVHlwZS50eXBlID09IFR5cGVTZXQuTGlzdCAmJiBpc0FscmVhZHlMaXN0KSB7XG4gICAgICAgICAgICAgICB0aHJvdyBuZXcgU3RhY2tzUG9zdGdyZXNFcnJvcihgVGhlIFBvc3RncmVzIFBsdWdpbiBkb2VzIG5vdCBzdXBwb3J0IExpc3Qgb2YgTGlzdHMgd2hlbiBnZW5lcmF0aW5nIFBvc3RncmVzIFRhYmxlc2ApXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBzdWJUeXBlID0gdGhpcy5nZXRDb2x1bW5UeXBlKGluZm8uaXRlbVR5cGUsIHRydWUpXG4gICAgICAgICAgICByZXR1cm4gaXNBbHJlYWR5TGlzdCA/IGAke3N1YlR5cGV9W11bXWAgOiBgJHtzdWJUeXBlfVtdYFxuICAgICAgICAgfVxuICAgICAgICAgY2FzZSBUeXBlU2V0Lk9iamVjdFJlZjoge1xuICAgICAgICAgICAgbGV0IG5mbyA9IHRoaXMuY29udGV4dC5nZXRUYWJsZShpbmZvLm1vZGVsTmFtZSEpXG5cbiAgICAgICAgICAgIGlmIChuZm8gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgdGhyb3cgbmV3IFN0YWNrc1Bvc3RncmVzRXJyb3IoYEEgTW9kZWwgXCIke2luZm8ubW9kZWxOYW1lfVwiIGlzIGJlaW5nIHJlZmVyZW5jZWQgaW4gYSBNb2RlbCBwcm9wZXJ0eSwgYnV0IHRoZSBNb2RlbCBjYW5ub3QgYmUgZm91bmQuIEVuc3VyZSB5b3UgY3JlYXRlIHRoZSBNb2RlbCBiZWZvcmUgcmVmZXJlbmNpbmcgaXQuYClcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIG5mby50YWJsZU5hbWVcbiAgICAgICAgIH1cbiAgICAgICAgIGNhc2UgVHlwZVNldC5TdHJpbmc6IHtcbiAgICAgICAgICAgIHJldHVybiAndGV4dCdcbiAgICAgICAgIH1cbiAgICAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgICAgIHRocm93IG5ldyBTdGFja3NQb3N0Z3Jlc0Vycm9yKGBVbnN1cHBvcnRlZCBUeXBlIGVuY291bnRlcmVkIHdoZW4gQm9vdHN0cmFwcGluZyB0aGUgUG9zdGdyZXMgREJgKVxuICAgICAgICAgfVxuICAgICAgfVxuICAgfVxufSJdfQ==