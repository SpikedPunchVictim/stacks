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
        config.pageLimit = config.pageLimit || 100;
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
 
       - Bootstrap = 'bootstrap',
       - GetObject = 'get-object',
       GetManyObjects = 'get-many-objects',
       - GetStoreContext = 'get-store-context',
       - HasId = 'has-id',
       X ObjectCreated = 'object-created' (Don't need this),
       - ObjectDeleted = 'object-deleted',
       ObjectUpdated = 'object-updated',
       - ObjectSaved = 'object-saved'
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
                    db: this.context.db,
                    tables: Array.from(this.context.tableMap.values())
                }
            });
        });
        //-------------------------------------------------------------------------------------------
        router.on(stacks_1.EventSet.GetObject, async (event) => {
            try {
                let found = await StoredObject_1.StoredObject.fromId(event.model, event.id, this.context);
                console.dir(found, { depth: null });
                if (found === undefined) {
                    event.exists = stacks_1.ExistState.DoesNotExist;
                }
                else {
                    event.object = found.obj;
                }
            }
            catch (err) {
                throw err;
            }
        });
        //-------------------------------------------------------------------------------------------
        router.on(stacks_1.EventSet.GetManyObjects, async (event) => {
            let tableInfo = this.context.getTable(event.model);
            if (tableInfo === undefined) {
                throw new StacksPostgresError_1.StacksPostgresError(`Failed to find the table for Model "${event.model.name}" when performing an Object search`);
            }
            if (event.page.cursor == null || event.page.cursor === '') {
                let limit = event.page.limit || this.config.pageLimit || 100;
                let objs = await this.context.db
                    .selectFrom(tableInfo.tableName)
                    .orderBy('id')
                    .limit(limit)
                    .execute();
                if (objs.length === 0) {
                    event.results = {
                        cursor: '',
                        items: []
                    };
                    return;
                }
                let lastObj = objs[objs.length - 1];
                event.results = {
                    cursor: Buffer.from(lastObj.id).toString('base64'),
                    items: objs.map(obj => this.context.fromDbObj(event.model.name, obj))
                };
            }
        });
        //-------------------------------------------------------------------------------------------
        router.on(stacks_1.EventSet.ObjectSaved, async (event) => {
            try {
                let storedObj = await StoredObject_1.StoredObject.getOrCreate(event.model, event.object, this.context);
                await storedObj.save();
            }
            catch (err) {
                console.dir(err);
                throw err;
            }
        });
        //-------------------------------------------------------------------------------------------
        router.on(stacks_1.EventSet.GetObject, async (event) => {
            try {
                let stored = await StoredObject_1.StoredObject.fromId(event.model, event.id, this.context);
                if (stored === undefined) {
                    event.exists = stacks_1.ExistState.DoesNotExist;
                    return;
                }
                event.object = stored.obj;
            }
            catch (err) {
                throw new Error(`[stacks-fs] Failed to retrieve Object ${event.id}. Reason ${err}`);
            }
        });
        //-------------------------------------------------------------------------------------------
        router.on(stacks_1.EventSet.ObjectDeleted, async (event) => {
            try {
                await StoredObject_1.StoredObject.delete(event.model, event.object.id, this.context);
            }
            catch (err) {
                throw new StacksPostgresError_1.StacksPostgresError(`Failed to delete an Object ${event.object.id}. Reason ${err}`);
            }
        });
        // //-------------------------------------------------------------------------------------------
        router.on(stacks_1.EventSet.ObjectUpdated, async (event) => {
            try {
                await StoredObject_1.StoredObject.update(event.model, event.serialize.toJs(), this.context);
            }
            catch (err) {
                throw new Error(`[stacks-fs] Failed to update an Object ${event.object.id}. Reason ${err}`);
            }
        });
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
        await this.buildSearchIndexes();
    }
    async buildSearchIndexes() {
        for (let info of this.context.tableMap.values()) {
            let tableInfo = await this.context.db
                .selectFrom('pg_indexes')
                .selectAll()
                .where('tablename', '=', info.tableName)
                .execute();
            let found = tableInfo.find(it => it.indexname === info.indexes.id);
            if (found) {
                continue;
            }
            await this.context.db.schema
                .createIndex(info.indexes.id)
                .on(info.tableName)
                .column('id')
                .execute();
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
                    throw new Error(`Failed to find any Symbols for Member ${member.name} in Model ${model.name}`);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGx1Z2luLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL1BsdWdpbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxnREFBdUI7QUFDdkIsd0RBQXlCO0FBRXpCLDJCQUEyQjtBQUUzQixnREFtQjRCO0FBQzVCLCtDQUEyQztBQUMzQywrREFBMkQ7QUFFM0QsbURBQStDO0FBQy9DLGlEQUE2QztBQUc3Qzs7Ozs7Ozs7Ozs7O0VBWUU7QUFHRjs7OztFQUlFO0FBRUYsTUFBYSxjQUFjO0lBT3hCLFlBQXFCLE1BQXNCO1FBQXRCLFdBQU0sR0FBTixNQUFNLENBQWdCO1FBTmxDLFNBQUksR0FBVyxpQkFBaUIsQ0FBQTtRQUVqQyxZQUFPLEdBQXVCLFNBQVMsQ0FBQTtRQUN2QyxZQUFPLEdBQWdCLElBQUkseUJBQVcsRUFBRSxDQUFBO1FBSTdDLE1BQU0sQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDLFNBQVMsSUFBSSxHQUFHLENBQUE7UUFDMUMsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLDZCQUFhLENBQUMsTUFBTSxDQUFDLENBQUE7SUFDM0MsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFjO1FBQ3hCLElBQUksTUFBTSxHQUFHLElBQUksV0FBTSxDQUFDO1lBQ3JCLElBQUksRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUk7WUFDdEIsSUFBSSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSTtZQUN0QixJQUFJLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJO1lBQ3RCLFFBQVEsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVE7WUFDOUIsUUFBUSxFQUFFLFVBQVU7U0FDdEIsQ0FBQyxDQUFBO1FBRUYsSUFBSSxDQUFDO1lBQ0YsTUFBTSxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUE7WUFDdEIsTUFBTSxNQUFNLENBQUMsS0FBSyxDQUFDLDJCQUEyQixNQUFNLEVB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QUFvRixDQUFDLENBQUE7Z0JBQ3RILENBQUM7Z0JBRUQsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFBO2dCQUNyRCxPQUFPLGFBQWEsQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLElBQUksQ0FBQTtZQUMzRCxDQUFDO1lBQ0QsS0FBSyxnQkFBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3RCLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFVLENBQUMsQ0FBQTtnQkFFaEQsSUFBSSxHQUFHLEtBQUssU0FBUyxFQUFFLENBQUM7b0JBQ3JCLE1BQU0sSUFBSSx5Q0FBbUIsQ0FBQyxZQUFZLElBQUksQ0FBQyxTQUFTLDhIQUE4SCxDQUFDLENBQUE7Z0JBQzFMLENBQUM7Z0JBRUQsT0FBTyxHQUFHLENBQUMsU0FBUyxDQUFBO1lBQ3ZCLENBQUM7WUFDRCxLQUFLLGdCQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDbkIsT0FBTyxNQUFNLENBQUE7WUFDaEIsQ0FBQztZQUNELE9BQU8sQ0FBQyxDQUFDLENBQUM7Z0JBQ1AsTUFBTSxJQUFJLHlDQUFtQixDQUFDLGlFQUFpRSxDQUFDLENBQUE7WUFDbkcsQ0FBQztRQUNKLENBQUM7SUFDSixDQUFDO0NBQ0g7QUF4YUQsd0NBd2FDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCBmcyBmcm9tICdmcy1leHRyYSdcbmltcG9ydCB7IENyZWF0ZVRhYmxlQnVpbGRlciB9IGZyb20gJ2t5c2VseSdcbmltcG9ydCB7IENsaWVudCB9IGZyb20gJ3BnJ1xuXG5pbXBvcnQge1xuICAgQm9vdHN0cmFwRXZlbnQsXG4gICBFdmVudFNldCxcbiAgIEV4aXN0U3RhdGUsXG4gICBHZXRNYW55T2JqZWN0c0V2ZW50LFxuICAgR2V0T2JqZWN0RXZlbnQsXG4gICBHZXRTdG9yZUNvbnRleHRFdmVudCxcbiAgIEhhc0lkRXZlbnQsXG4gICBJRXZlbnRSb3V0ZXIsXG4gICBJTWVtYmVyLFxuICAgSU1vZGVsLFxuICAgSVBsdWdpbixcbiAgIElTdGFjayxcbiAgIE9iamVjdERlbGV0ZUV2ZW50LFxuICAgT2JqZWN0U2F2ZUV2ZW50LFxuICAgT2JqZWN0VXBkYXRlRXZlbnQsXG4gICBTdGFja09iamVjdCxcbiAgIFR5cGVJbmZvLFxuICAgVHlwZVNldFxufSBmcm9tICdAc3Bpa2VkcHVuY2gvc3RhY2tzJ1xuaW1wb3J0IHsgU3ltYm9sVGFibGUgfSBmcm9tICcuL1N5bWJvbFRhYmxlJ1xuaW1wb3J0IHsgU3RhY2tzUG9zdGdyZXNFcnJvciB9IGZyb20gJy4vU3RhY2tzUG9zdGdyZXNFcnJvcidcbmltcG9ydCB7IFBvc3RncmVzQ29uZmlnIH0gZnJvbSAnLi9Qb3N0Z3Jlc0NvbmZpZydcbmltcG9ydCB7IFBsdWdpbkNvbnRleHQgfSBmcm9tICcuL1BsdWdpbkNvbnRleHQnXG5pbXBvcnQgeyBTdG9yZWRPYmplY3QgfSBmcm9tICcuL1N0b3JlZE9iamVjdCdcbmltcG9ydCB7IE1lbWJlclN5bWJvbHMsIE1vZGVsU3ltYm9scyB9IGZyb20gJy4vU3ltYm9scydcblxuLypcbiAgIE1vZGVsOlxuICAgICAgdGFibGVuYW1lOiBtb2RlbC5uYW1lLFxuICAgICAgY3VzdG9tOiBhc3luYyAoKSA9PiB7IH0sXG4gICAgICBjb21wb3NpdGV0eXBlOiBmYWxzZVxuXG5cbiAgIE1lbWJlcjpcbiAgICAgIGRhdGF0eXBlOiB0aGlzLmdldENvbHVtblR5cGUobWVtYmVyLnZhbHVlLnR5cGUuaW5mbyksXG4gICAgICBjb2x1bW5hbWU6IG1lbWJlci5uYW1lLFxuICAgICAgY3VzdG9tY29sdW1uOiB1bmRlZmluZWRcblxuKi9cblxuXG4vKlxuICAgVE9ET1M6XG4gICAgICAtIEFkZCBFcnJvciBtZXNzYWdlcyB0byB0aGUgdHJ5L2NhY3RoZXNcblxuKi9cblxuZXhwb3J0IGNsYXNzIFBvc3RncmVzUGx1Z2luIGltcGxlbWVudHMgSVBsdWdpbiB7XG4gICByZWFkb25seSBuYW1lOiBzdHJpbmcgPSBcInN0YWNrcy1wb3N0Z3Jlc1wiXG5cbiAgIHByaXZhdGUgdmVyc2lvbjogc3RyaW5nIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkXG4gICBwcml2YXRlIHN5bWJvbHM6IFN5bWJvbFRhYmxlID0gbmV3IFN5bWJvbFRhYmxlKClcbiAgIHByaXZhdGUgY29udGV4dDogUGx1Z2luQ29udGV4dFxuXG4gICBjb25zdHJ1Y3RvcihyZWFkb25seSBjb25maWc6IFBvc3RncmVzQ29uZmlnKSB7XG4gICAgICBjb25maWcucGFnZUxpbWl0ID0gY29uZmlnLnBhZ2VMaW1pdCB8fCAxMDBcbiAgICAgIHRoaXMuY29udGV4dCA9IG5ldyBQbHVnaW5Db250ZXh0KGNvbmZpZylcbiAgIH1cblxuICAgLyoqXG4gICAgKiBEcm9wcyBhIERhdGFiYXNlIGZyb20gdGhlIHNlcnZlci4gRW5zdXJlIHRoZSBjcmVkZW50aWFscyBwcm92aWRlZFxuICAgICogaGF2ZSB0aGUgcmlnaHQgcGVybWlzc2lvbnMgdG8gRHJvcCB0aGUgVGFibGUuXG4gICAgKiBcbiAgICAqIEBwYXJhbSBkYk5hbWUgVGhlIERhdGFiYXNlIG5hbWUgdG8gZHJvcFxuICAgICovXG4gICBhc3luYyBkcm9wRGIoZGJOYW1lOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgIGxldCBjbGllbnQgPSBuZXcgQ2xpZW50KHtcbiAgICAgICAgIGhvc3Q6IHRoaXMuY29uZmlnLmhvc3QsXG4gICAgICAgICBwb3J0OiB0aGlzLmNvbmZpZy5wb3J0LFxuICAgICAgICAgdXNlcjogdGhpcy5jb25maWcudXNlcixcbiAgICAgICAgIHBhc3N3b3JkOiB0aGlzLmNvbmZpZy5wYXNzd29yZCxcbiAgICAgICAgIGRhdGFiYXNlOiAncG9zdGdyZXMnXG4gICAgICB9KVxuXG4gICAgICB0cnkge1xuICAgICAgICAgYXdhaXQgY2xpZW50LmNvbm5lY3QoKVxuICAgICAgICAgYXdhaXQgY2xpZW50LnF1ZXJ5KGBEUk9QIERBVEFCQVNFIElGIEVYSVNUUyAke2RiTmFtZX1gKVxuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICB0aHJvdyBlcnJcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICBhd2FpdCBjbGllbnQuZW5kKClcbiAgICAgIH1cbiAgIH1cblxuICAgYXN5bmMgY3JlYXRlRGJJZk5vdEV4aXN0cyhkYk5hbWU6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgLypcbiAgICAgICAgIE5vdGU6XG4gICAgICAgICBJbiBvcmRlciB0byBjcmVhdGUgYSBkYXRhYmFzZSB0YWJsZSwgeW91IG5lZWQgdG8gYmUgY29ubmVjdGVkIHRvXG4gICAgICAgICBzb21lIGRhdGFiYXNlLiBXZSBjb25uZWN0IHRvIHRoZSAncG9zdGdyZXMnIGRhdGFiYXNlLCBhbmQgcnVuIG91clxuICAgICAgICAgcXVlcmllcyBmcm9tIHRoZXJlLlxuICAgICAgKi9cblxuICAgICAgbGV0IGNsaWVudCA9IG5ldyBDbGllbnQoe1xuICAgICAgICAgaG9zdDogdGhpcy5jb25maWcuaG9zdCxcbiAgICAgICAgIHBvcnQ6IHRoaXMuY29uZmlnLnBvcnQsXG4gICAgICAgICB1c2VyOiB0aGlzLmNvbmZpZy51c2VyLFxuICAgICAgICAgcGFzc3dvcmQ6IHRoaXMuY29uZmlnLnBhc3N3b3JkLFxuICAgICAgICAgZGF0YWJhc2U6ICdwb3N0Z3JlcydcbiAgICAgIH0pXG5cbiAgICAgIHRyeSB7XG4gICAgICAgICBhd2FpdCBjbGllbnQuY29ubmVjdCgpXG5cbiAgICAgICAgIGxldCByZXMgPSBhd2FpdCBjbGllbnQucXVlcnkoYFNFTEVDVCBGUk9NIHBnX2RhdGFiYXNlIFdIRVJFIGRhdG5hbWUgPSAnJHtkYk5hbWV9J2ApXG5cbiAgICAgICAgIGlmIChyZXMucm93cy5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgYXdhaXQgY2xpZW50LnF1ZXJ5KGBDUkVBVEUgREFUQUJBU0UgJHtkYk5hbWV9YClcbiAgICAgICAgIH1cbiAgICAgICAgIC8vYXdhaXQgY2xpZW50LnF1ZXJ5KGBTRUxFQ1QgJ0NSRUFURSBEQVRBQkFTRSAke2RiTmFtZX0nIFdIRVJFIE5PVCBFWElTVFMgKFNFTEVDVCBGUk9NIHBnX2RhdGFiYXNlIFdIRVJFIGRhdG5hbWUgPSAnJHtkYk5hbWV9JylgKVxuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICB0aHJvdyBlcnJcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICBhd2FpdCBjbGllbnQuZW5kKClcbiAgICAgIH1cbiAgIH1cblxuICAgLypcbiAgZXhwb3J0IGVudW0gRXZlbnRTZXQge1xuICAgICAgR2V0TW9kZWwgPSAnZ2V0LW1vZGVsJyxcbiAgICAgIE1vZGVsQ3JlYXRlZCA9ICdtb2RlbC1jcmVhdGVkJyxcbiAgICAgIE1vZGVsRGVsZXRlZCA9ICdtb2RlbC1kZWxldGVkJyxcbiAgICAgIE1vZGVsVXBkYXRlZCA9ICdtb2RlbC11cGRhdGVkJyxcblxuICB9XG5cbiAgICAgIC0gQm9vdHN0cmFwID0gJ2Jvb3RzdHJhcCcsXG4gICAgICAtIEdldE9iamVjdCA9ICdnZXQtb2JqZWN0JyxcbiAgICAgIEdldE1hbnlPYmplY3RzID0gJ2dldC1tYW55LW9iamVjdHMnLFxuICAgICAgLSBHZXRTdG9yZUNvbnRleHQgPSAnZ2V0LXN0b3JlLWNvbnRleHQnLFxuICAgICAgLSBIYXNJZCA9ICdoYXMtaWQnLFxuICAgICAgWCBPYmplY3RDcmVhdGVkID0gJ29iamVjdC1jcmVhdGVkJyAoRG9uJ3QgbmVlZCB0aGlzKSxcbiAgICAgIC0gT2JqZWN0RGVsZXRlZCA9ICdvYmplY3QtZGVsZXRlZCcsXG4gICAgICBPYmplY3RVcGRhdGVkID0gJ29iamVjdC11cGRhdGVkJyxcbiAgICAgIC0gT2JqZWN0U2F2ZWQgPSAnb2JqZWN0LXNhdmVkJ1xuICAgICAqL1xuXG4gICBhc3luYyBzZXR1cChzdGFjazogSVN0YWNrLCByb3V0ZXI6IElFdmVudFJvdXRlcik6IFByb21pc2U8dm9pZD4ge1xuXG4gICAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIHJvdXRlci5vbjxCb290c3RyYXBFdmVudD4oRXZlbnRTZXQuQm9vdHN0cmFwLCBhc3luYyAoZXZlbnQ6IEJvb3RzdHJhcEV2ZW50KSA9PiB7XG4gICAgICAgICAvLyBhd2FpdCB0aGlzLmRiLnNjaGVtYVxuICAgICAgICAgLy8gICAgLmNyZWF0ZVRhYmxlKCdwZXQnKVxuICAgICAgICAgLy8gICAgLmFkZENvbHVtbignbmFtZScsICd0ZXh0JylcbiAgICAgICAgIC8vICAgIC5hZGRDb2x1bW4oJ3NwZWNpZXMnLCAndGV4dCcpXG4gICAgICAgICAvLyAgICAuYWRkQ29sdW1uKCdudW1iZXJfb2ZfbGVncycsICdpbnRlZ2VyJywgKGNvbCkgPT4gY29sLmRlZmF1bHRUbyg0KSlcbiAgICAgICAgIC8vICAgIC5leGVjdXRlKClcblxuICAgICAgICAgLy8gYXdhaXQgdGhpcy5kYlxuICAgICAgICAgLy8gICAgLmluc2VydEludG8oJ3BldCcpXG4gICAgICAgICAvLyAgICAudmFsdWVzKHtcbiAgICAgICAgIC8vICAgICAgIG5hbWU6ICdDYXR0bycsXG4gICAgICAgICAvLyAgICAgICBzcGVjaWVzOiAnY2F0JyxcbiAgICAgICAgIC8vICAgICAgIG51bWJlcl9vZl9sZWdzOiA0XG4gICAgICAgICAvLyAgICB9KVxuICAgICAgICAgLy8gICAgLmV4ZWN1dGUoKVxuXG4gICAgICAgICBhd2FpdCB0aGlzLnN5bWJvbHMuY29sbGVjdChzdGFjaywge1xuICAgICAgICAgICAgbW9kZWw6IHtcbiAgICAgICAgICAgICAgIHByZWZpeDogJ3Bvc3RncmVzOicsXG4gICAgICAgICAgICAgICBkZWZhdWx0czoge1xuICAgICAgICAgICAgICAgICAgdGFibGVuYW1lOiBhc3luYyAobW9kZWw6IElNb2RlbCk6IFByb21pc2U8c3RyaW5nPiA9PiBtb2RlbC5uYW1lLFxuICAgICAgICAgICAgICAgICAgY3VzdG9tOiBhc3luYyAoKSA9PiB7IH1cbiAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbWVtYmVyczoge1xuICAgICAgICAgICAgICAgcHJlZml4OiAncG9zdGdyZXM6JyxcbiAgICAgICAgICAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgICAgICAgICAgICBkYXRhdHlwZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgY29sdW1uYW1lOiBhc3luYyAobWVtYmVyOiBJTWVtYmVyKTogUHJvbWlzZTxzdHJpbmc+ID0+IG1lbWJlci5uYW1lLFxuICAgICAgICAgICAgICAgICAgY3VzdG9tY29sdW1uOiB1bmRlZmluZWRcbiAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgIH0pXG5cbiAgICAgICAgIHRoaXMuY29udGV4dC5idWlsZE1vZGVsVG9UYWJsZU1hcChzdGFjaywgdGhpcy5zeW1ib2xzKVxuXG4gICAgICAgICBhd2FpdCB0aGlzLmJvb3RzdHJhcERiKHN0YWNrKVxuICAgICAgfSlcblxuICAgICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICByb3V0ZXIub248SGFzSWRFdmVudD4oRXZlbnRTZXQuSGFzSWQsIGFzeW5jIChldmVudDogSGFzSWRFdmVudCkgPT4ge1xuICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxldCBmb3VuZCA9IGF3YWl0IFN0b3JlZE9iamVjdC5mcm9tSWQoZXZlbnQubW9kZWwsIGV2ZW50LmlkLCB0aGlzLmNvbnRleHQpXG4gICAgICAgICAgICBldmVudC5oYXNJZCA9IGZvdW5kICE9PSB1bmRlZmluZWRcbiAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgdGhyb3cgZXJyXG4gICAgICAgICB9XG4gICAgICB9KVxuXG4gICAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIHJvdXRlci5vbihFdmVudFNldC5HZXRTdG9yZUNvbnRleHQsIGFzeW5jIChldmVudDogR2V0U3RvcmVDb250ZXh0RXZlbnQpID0+IHtcbiAgICAgICAgIGlmICh0aGlzLnZlcnNpb24gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgbGV0IHBrZyA9IGF3YWl0IGZzLnJlYWRKc29uKHBhdGguam9pbihfX2Rpcm5hbWUsICcuLicsICdwYWNrYWdlLmpzb24nKSlcbiAgICAgICAgICAgIHRoaXMudmVyc2lvbiA9IHBrZy52ZXJzaW9uXG4gICAgICAgICB9XG5cbiAgICAgICAgIGV2ZW50LmNvbnRleHRzLnB1c2goe1xuICAgICAgICAgICAgbmFtZTogJ3N0YWNrczpwb3N0Z3JlcycsXG4gICAgICAgICAgICB2ZXJzaW9uOiB0aGlzLnZlcnNpb24gfHwgJ3ZlcnNpb24tbm90LXNldCcsXG4gICAgICAgICAgICBzdG9yZToge1xuICAgICAgICAgICAgICAgY29uZmlnOiB0aGlzLmNvbmZpZyxcbiAgICAgICAgICAgICAgIGRiOiB0aGlzLmNvbnRleHQuZGIsXG4gICAgICAgICAgICAgICB0YWJsZXM6IEFycmF5LmZyb20odGhpcy5jb250ZXh0LnRhYmxlTWFwLnZhbHVlcygpKVxuICAgICAgICAgICAgfVxuICAgICAgICAgfSlcbiAgICAgIH0pXG5cbiAgICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgcm91dGVyLm9uPEdldE9iamVjdEV2ZW50PFN0YWNrT2JqZWN0Pj4oRXZlbnRTZXQuR2V0T2JqZWN0LCBhc3luYyAoZXZlbnQ6IEdldE9iamVjdEV2ZW50PFN0YWNrT2JqZWN0PikgPT4ge1xuICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxldCBmb3VuZCA9IGF3YWl0IFN0b3JlZE9iamVjdC5mcm9tSWQoZXZlbnQubW9kZWwsIGV2ZW50LmlkLCB0aGlzLmNvbnRleHQpXG5cbiAgICAgICAgICAgIGNvbnNvbGUuZGlyKGZvdW5kLCB7IGRlcHRoOiBudWxsIH0pXG5cbiAgICAgICAgICAgIGlmKGZvdW5kID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgIGV2ZW50LmV4aXN0cyA9IEV4aXN0U3RhdGUuRG9lc05vdEV4aXN0XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgZXZlbnQub2JqZWN0ID0gZm91bmQub2JqXG4gICAgICAgICAgICB9XG4gICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIHRocm93IGVyclxuICAgICAgICAgfVxuICAgICAgfSlcblxuICAgICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICByb3V0ZXIub248R2V0TWFueU9iamVjdHNFdmVudDxTdGFja09iamVjdD4+KEV2ZW50U2V0LkdldE1hbnlPYmplY3RzLCBhc3luYyAoZXZlbnQ6IEdldE1hbnlPYmplY3RzRXZlbnQ8U3RhY2tPYmplY3Q+KSA9PiB7XG4gICAgICAgICBsZXQgdGFibGVJbmZvID0gdGhpcy5jb250ZXh0LmdldFRhYmxlKGV2ZW50Lm1vZGVsKVxuXG4gICAgICAgICBpZih0YWJsZUluZm8gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFN0YWNrc1Bvc3RncmVzRXJyb3IoYEZhaWxlZCB0byBmaW5kIHRoZSB0YWJsZSBmb3IgTW9kZWwgXCIke2V2ZW50Lm1vZGVsLm5hbWV9XCIgd2hlbiBwZXJmb3JtaW5nIGFuIE9iamVjdCBzZWFyY2hgKVxuICAgICAgICAgfVxuXG4gICAgICAgICBpZihldmVudC5wYWdlLmN1cnNvciA9PSBudWxsIHx8IGV2ZW50LnBhZ2UuY3Vyc29yID09PSAnJykge1xuICAgICAgICAgICAgbGV0IGxpbWl0ID0gZXZlbnQucGFnZS5saW1pdCB8fCB0aGlzLmNvbmZpZy5wYWdlTGltaXQgfHwgMTAwXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGxldCBvYmpzID0gYXdhaXQgdGhpcy5jb250ZXh0LmRiXG4gICAgICAgICAgICAgICAuc2VsZWN0RnJvbSh0YWJsZUluZm8udGFibGVOYW1lKVxuICAgICAgICAgICAgICAgLm9yZGVyQnkoJ2lkJylcbiAgICAgICAgICAgICAgIC5saW1pdChsaW1pdClcbiAgICAgICAgICAgICAgIC5leGVjdXRlKCkgYXMgU3RhY2tPYmplY3RbXSAgICAgICAgICAgIFxuXG4gICAgICAgICAgICBpZihvYmpzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgZXZlbnQucmVzdWx0cyA9IHtcbiAgICAgICAgICAgICAgICAgIGN1cnNvcjogJycsXG4gICAgICAgICAgICAgICAgICBpdGVtczogW11cbiAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBsYXN0T2JqID0gb2Jqc1tvYmpzLmxlbmd0aCAtIDFdXG5cbiAgICAgICAgICAgIGV2ZW50LnJlc3VsdHMgPSB7XG4gICAgICAgICAgICAgICBjdXJzb3I6IEJ1ZmZlci5mcm9tKGxhc3RPYmouaWQpLnRvU3RyaW5nKCdiYXNlNjQnKSxcbiAgICAgICAgICAgICAgIGl0ZW1zOiBvYmpzLm1hcChvYmogPT4gdGhpcy5jb250ZXh0LmZyb21EYk9iaihldmVudC5tb2RlbC5uYW1lLCBvYmopKVxuICAgICAgICAgICAgfVxuICAgICAgICAgfVxuXG4gICAgICB9KVxuXG4gICAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIHJvdXRlci5vbjxPYmplY3RTYXZlRXZlbnQ8U3RhY2tPYmplY3Q+PihFdmVudFNldC5PYmplY3RTYXZlZCwgYXN5bmMgKGV2ZW50OiBPYmplY3RTYXZlRXZlbnQ8U3RhY2tPYmplY3Q+KSA9PiB7XG4gICAgICAgICB0cnkge1xuICAgICAgICAgICAgbGV0IHN0b3JlZE9iaiA9IGF3YWl0IFN0b3JlZE9iamVjdC5nZXRPckNyZWF0ZShldmVudC5tb2RlbCwgZXZlbnQub2JqZWN0LCB0aGlzLmNvbnRleHQpXG4gICAgICAgICAgICBhd2FpdCBzdG9yZWRPYmouc2F2ZSgpXG4gICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZGlyKGVycilcbiAgICAgICAgICAgIHRocm93IGVyclxuICAgICAgICAgfVxuICAgICAgfSlcblxuICAgICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICByb3V0ZXIub248R2V0T2JqZWN0RXZlbnQ8U3RhY2tPYmplY3Q+PihFdmVudFNldC5HZXRPYmplY3QsIGFzeW5jIChldmVudDogR2V0T2JqZWN0RXZlbnQ8U3RhY2tPYmplY3Q+KSA9PiB7XG4gICAgICAgICB0cnkge1xuICAgICAgICAgICAgbGV0IHN0b3JlZCA9IGF3YWl0IFN0b3JlZE9iamVjdC5mcm9tSWQoZXZlbnQubW9kZWwsIGV2ZW50LmlkLCB0aGlzLmNvbnRleHQpXG5cbiAgICAgICAgICAgIGlmKHN0b3JlZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICBldmVudC5leGlzdHMgPSBFeGlzdFN0YXRlLkRvZXNOb3RFeGlzdFxuICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGV2ZW50Lm9iamVjdCA9IHN0b3JlZC5vYmpcbiAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBbc3RhY2tzLWZzXSBGYWlsZWQgdG8gcmV0cmlldmUgT2JqZWN0ICR7ZXZlbnQuaWR9LiBSZWFzb24gJHtlcnJ9YClcbiAgICAgICAgIH1cbiAgICAgIH0pXG5cbiAgICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgcm91dGVyLm9uPE9iamVjdERlbGV0ZUV2ZW50PFN0YWNrT2JqZWN0Pj4oRXZlbnRTZXQuT2JqZWN0RGVsZXRlZCwgYXN5bmMgKGV2ZW50OiBPYmplY3REZWxldGVFdmVudDxTdGFja09iamVjdD4pID0+IHtcbiAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBhd2FpdCBTdG9yZWRPYmplY3QuZGVsZXRlKGV2ZW50Lm1vZGVsLCBldmVudC5vYmplY3QuaWQsIHRoaXMuY29udGV4dClcbiAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFN0YWNrc1Bvc3RncmVzRXJyb3IoYEZhaWxlZCB0byBkZWxldGUgYW4gT2JqZWN0ICR7ZXZlbnQub2JqZWN0LmlkfS4gUmVhc29uICR7ZXJyfWApXG4gICAgICAgICB9XG4gICAgICB9KVxuXG4gICAgICAvLyAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIHJvdXRlci5vbjxPYmplY3RVcGRhdGVFdmVudDxTdGFja09iamVjdD4+KEV2ZW50U2V0Lk9iamVjdFVwZGF0ZWQsIGFzeW5jIChldmVudDogT2JqZWN0VXBkYXRlRXZlbnQ8U3RhY2tPYmplY3Q+KSA9PiB7XG4gICAgICAgICB0cnkge1xuICAgICAgICAgICAgYXdhaXQgU3RvcmVkT2JqZWN0LnVwZGF0ZShldmVudC5tb2RlbCwgZXZlbnQuc2VyaWFsaXplLnRvSnMoKSwgdGhpcy5jb250ZXh0KVxuICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFtzdGFja3MtZnNdIEZhaWxlZCB0byB1cGRhdGUgYW4gT2JqZWN0ICR7ZXZlbnQub2JqZWN0LmlkfS4gUmVhc29uICR7ZXJyfWApXG4gICAgICAgICB9XG4gICAgICB9KVxuICAgfVxuXG4gICBwcml2YXRlIGFzeW5jIGJvb3RzdHJhcERiKHN0YWNrOiBJU3RhY2spOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgIHRyeSB7XG4gICAgICAgICBhd2FpdCB0aGlzLmNyZWF0ZURiSWZOb3RFeGlzdHModGhpcy5jb25maWcuZGF0YWJhc2UpXG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgIHRocm93IG5ldyBFcnJvcihgRmFpbGVkIHRvIGNvbm5lY3QgdG8gUG9zdGdyZXMgREIuIFJlYXNvbjogJHtlcnJ9YClcbiAgICAgIH1cblxuICAgICAgZm9yIChsZXQgbW9kZWwgb2Ygc3RhY2suZ2V0Lm1vZGVscygpKSB7XG4gICAgICAgICBhd2FpdCB0aGlzLmNyZWF0ZVRhYmxlKG1vZGVsKVxuICAgICAgfVxuXG4gICAgICBhd2FpdCB0aGlzLmJ1aWxkU2VhcmNoSW5kZXhlcygpXG4gICB9XG5cbiAgIHByaXZhdGUgYXN5bmMgYnVpbGRTZWFyY2hJbmRleGVzKCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgZm9yKGxldCBpbmZvIG9mIHRoaXMuY29udGV4dC50YWJsZU1hcC52YWx1ZXMoKSkge1xuICAgICAgICAgbGV0IHRhYmxlSW5mbyA9IGF3YWl0IHRoaXMuY29udGV4dC5kYlxuICAgICAgICAgICAgLnNlbGVjdEZyb20oJ3BnX2luZGV4ZXMnKVxuICAgICAgICAgICAgLnNlbGVjdEFsbCgpXG4gICAgICAgICAgICAud2hlcmUoJ3RhYmxlbmFtZScgLCAnPScsIGluZm8udGFibGVOYW1lKVxuICAgICAgICAgICAgLmV4ZWN1dGUoKVxuXG4gICAgICAgICBsZXQgZm91bmQgPSB0YWJsZUluZm8uZmluZChpdCA9PiBpdC5pbmRleG5hbWUgPT09IGluZm8uaW5kZXhlcy5pZClcblxuICAgICAgICAgaWYoZm91bmQpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgICB9XG5cbiAgICAgICAgIGF3YWl0IHRoaXMuY29udGV4dC5kYi5zY2hlbWFcbiAgICAgICAgICAgIC5jcmVhdGVJbmRleChpbmZvLmluZGV4ZXMuaWQpXG4gICAgICAgICAgICAub24oaW5mby50YWJsZU5hbWUpXG4gICAgICAgICAgICAuY29sdW1uKCdpZCcpXG4gICAgICAgICAgICAuZXhlY3V0ZSgpXG4gICAgICB9XG4gICB9XG5cbiAgIHByaXZhdGUgYXN5bmMgY3JlYXRlVGFibGUobW9kZWw6IElNb2RlbCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgIGxldCBzY2hlbWEgPSB0aGlzLmNvbnRleHQuZGIuc2NoZW1hXG5cbiAgICAgICAgIGxldCB0YWJsZUNvbmZpZyA9IGF3YWl0IHRoaXMuc3ltYm9scy5nZXRNb2RlbFN5bWJvbHM8TW9kZWxTeW1ib2xzPihtb2RlbC5pZClcblxuICAgICAgICAgaWYgKHRhYmxlQ29uZmlnID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgRmFpbGVkIHRvIGZpbmQgYW55IFN5bWJvbCBjb25maWd1cmF0aW9uIGZvciBNb2RlbCAke21vZGVsLm5hbWV9YClcbiAgICAgICAgIH1cblxuICAgICAgICAgbGV0IGJ1aWxkZXIgPSBzY2hlbWFcbiAgICAgICAgICAgIC5jcmVhdGVUYWJsZSh0YWJsZUNvbmZpZy50YWJsZW5hbWUpXG4gICAgICAgICAgICAuaWZOb3RFeGlzdHMoKVxuXG4gICAgICAgICBidWlsZGVyID0gYnVpbGRlci5hZGRDb2x1bW4oJ2lkJywgJ3RleHQnLCAoY29sKSA9PiBjb2wucHJpbWFyeUtleSgpKVxuXG4gICAgICAgICBmb3IgKGxldCBtZW1iZXIgb2YgbW9kZWwubWVtYmVycykge1xuICAgICAgICAgICAgLy8gVE9ETzogR2V0IHRoZSBUeXBlIHRvIGJlIGFibGUgdG8gYXNzaWduIGEgZGVmYXVsdCB0eXBlIGZvciBpdFxuICAgICAgICAgICAgbGV0IGNvbHVtbkNvbmZpZyA9IHRoaXMuc3ltYm9scy5nZXRNZW1iZXJTeW1ib2xzPE1lbWJlclN5bWJvbHM+KG1vZGVsLmlkLCBtZW1iZXIuaWQpXG5cbiAgICAgICAgICAgIGlmIChjb2x1bW5Db25maWcgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBGYWlsZWQgdG8gZmluZCBhbnkgU3ltYm9scyBmb3IgTWVtYmVyICR7bWVtYmVyLm5hbWV9IGluIE1vZGVsICR7bW9kZWwubmFtZX1gKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgb2JqID0gYXdhaXQgdGhpcy5jcmVhdGVDb2x1bW4obWVtYmVyLCBjb2x1bW5Db25maWcsIGJ1aWxkZXIpXG4gICAgICAgICAgICBidWlsZGVyID0gb2JqLmJ1aWxkZXJcbiAgICAgICAgIH1cblxuICAgICAgICAgaWYgKHRhYmxlQ29uZmlnLmN1c3RvbSAhPSBudWxsKSB7XG4gICAgICAgICAgICBidWlsZGVyID0gYXdhaXQgdGFibGVDb25maWcuY3VzdG9tKGJ1aWxkZXIpXG4gICAgICAgICB9XG5cbiAgICAgICAgIGF3YWl0IGJ1aWxkZXIuZXhlY3V0ZSgpXG5cbiAgICAgICAgIHJldHVyblxuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICBjb25zb2xlLmVycm9yKGVycilcbiAgICAgICAgIHRocm93IGVyclxuICAgICAgfVxuICAgfVxuXG4gICAvKipcbiAgICAqIENyZWF0ZXMgYSBDb2x1bW4gZm9yIGEgTWVtYmVyLiBcbiAgICAqIFxuICAgICogTm90ZTogXG4gICAgKiBUaGlzIGZ1bmN0aW9uIGNhbm5vdCByZXR1cm4gYSBDcmVhdGVUYWJsZUJ1aWxkZXIgYXMgYSBQcm9taXNlLiBUaGVyZSBpcyBjb2RlXG4gICAgKiBpbiB0aGUga2VzbGV5IGxpYnJhcnkgdGhhdCBlcnJvcnMgd2hlbiB5b3UgYXdhaXQgYSBDcmVhdGVUYWJsZUJ1aWxkZXIgdGhhdCBnZXRzXG4gICAgKiB0cmlnZ2VyZWQgd2hlbiByZXR1cm5pbmcgZnJvbSBhIFByb21pc2UuXG4gICAgKiBcbiAgICAqIEBwYXJhbSBtZW1iZXIgVGhlIE1lbWJlciB0aGF0IHJlcHJlc2VudHMgdGhlIENvbHVtblxuICAgICogQHBhcmFtIGNvbmZpZyBUaGUgUG9zdGdyZXMgU3ltYm9sIHRhYmxlIGZvciB0aGUgTWVtYmVyXG4gICAgKiBAcGFyYW0gYnVpbGRlciBUaGUgY3VycmVudCBCdWlsZGVyXG4gICAgKiBAcmV0dXJucyBcbiAgICAqL1xuICAgcHJpdmF0ZSBhc3luYyBjcmVhdGVDb2x1bW4obWVtYmVyOiBJTWVtYmVyLCBjb25maWc6IE1lbWJlclN5bWJvbHMsIGJ1aWxkZXI6IENyZWF0ZVRhYmxlQnVpbGRlcjxhbnksIGFueT4pOiBQcm9taXNlPHsgYnVpbGRlcjogQ3JlYXRlVGFibGVCdWlsZGVyPGFueSwgYW55PiB9PiB7XG4gICAgICBpZiAodHlwZW9mIGNvbmZpZy5jdXN0b21jb2x1bW4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgIGJ1aWxkZXIgPSBhd2FpdCBjb25maWcuY3VzdG9tY29sdW1uKGJ1aWxkZXIpXG4gICAgICAgICByZXR1cm4geyBidWlsZGVyIH1cbiAgICAgIH1cblxuICAgICAgbGV0IGluZm8gPSBtZW1iZXIudHlwZS5pbmZvXG5cbiAgICAgIHN3aXRjaCAoaW5mby50eXBlKSB7XG4gICAgICAgICBjYXNlIFR5cGVTZXQuQm9vbDpcbiAgICAgICAgIGNhc2UgVHlwZVNldC5JbnQ6XG4gICAgICAgICBjYXNlIFR5cGVTZXQuVUludDpcbiAgICAgICAgIGNhc2UgVHlwZVNldC5TdHJpbmc6XG4gICAgICAgICBjYXNlIFR5cGVTZXQuTGlzdDoge1xuICAgICAgICAgICAgbGV0IHR5cGUgPSB0aGlzLmdldENvbHVtblR5cGUobWVtYmVyLnR5cGUuaW5mbylcblxuICAgICAgICAgICAgLy9AdHMtaWdub3JlXG4gICAgICAgICAgICBidWlsZGVyID0gYnVpbGRlci5hZGRDb2x1bW4oY29uZmlnLmNvbHVtbmFtZSwgdHlwZSlcbiAgICAgICAgICAgIHJldHVybiB7IGJ1aWxkZXIgfVxuICAgICAgICAgfVxuICAgICAgICAgY2FzZSBUeXBlU2V0Lk9iamVjdFJlZjoge1xuICAgICAgICAgICAgbGV0IHJlZlRhYmxlID0gdGhpcy5jb250ZXh0LmdldFRhYmxlKGluZm8ubW9kZWxOYW1lISlcblxuICAgICAgICAgICAgaWYgKHJlZlRhYmxlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgW3N0YWNrcy1wb3N0Z3Jlc10gQSBNb2RlbCBcIiR7aW5mby5tb2RlbE5hbWV9XCIgaXMgYmVpbmcgcmVmZXJlbmNlZCBpbiBhIE1vZGVsIHByb3BlcnR5LCBidXQgdGhlIE1vZGVsIGNhbm5vdCBiZSBmb3VuZC4gRW5zdXJlIHlvdSBjcmVhdGUgdGhlIE1vZGVsIGJlZm9yZSByZWZlcmVuY2luZyBpdC5gKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBidWlsZGVyID0gYnVpbGRlci5hZGRDb2x1bW4oY29uZmlnLmNvbHVtbmFtZSwgJ3RleHQnLCAoY29sKSA9PiBjb2wucmVmZXJlbmNlcyhgJHtyZWZUYWJsZSEudGFibGVOYW1lfS5pZGApLnVuaXF1ZSgpKVxuXG4gICAgICAgICAgICByZXR1cm4geyBidWlsZGVyIH1cbiAgICAgICAgIH1cbiAgICAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5zdXBwb3J0ZWQgVHlwZSBlbmNvdW50ZXJlZCB3aGVuIEJvb3RzdHJhcHBpbmcgdGhlIFBvc3RncmVzIERCYClcbiAgICAgICAgIH1cbiAgICAgIH1cbiAgIH1cblxuICAgcHJpdmF0ZSBnZXRDb2x1bW5UeXBlKGluZm86IFR5cGVJbmZvLCBpc0FscmVhZHlMaXN0OiBib29sZWFuID0gZmFsc2UpOiBzdHJpbmcge1xuICAgICAgc3dpdGNoIChpbmZvLnR5cGUpIHtcbiAgICAgICAgIGNhc2UgVHlwZVNldC5Cb29sOiB7XG4gICAgICAgICAgICByZXR1cm4gJ2Jvb2xlYW4nXG4gICAgICAgICB9XG4gICAgICAgICBjYXNlIFR5cGVTZXQuSW50OlxuICAgICAgICAgY2FzZSBUeXBlU2V0LlVJbnQ6IHtcbiAgICAgICAgICAgIHJldHVybiAnaW50ZWdlcidcbiAgICAgICAgIH1cbiAgICAgICAgIGNhc2UgVHlwZVNldC5MaXN0OiB7XG4gICAgICAgICAgICBpZiAoaW5mby5pdGVtVHlwZSA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICB0aHJvdyBuZXcgU3RhY2tzUG9zdGdyZXNFcnJvcihgRW5jb3VudGVyZWQgYW4gaXNzdWUgd2hlbiBhdHRlbXB0aW5nIGRldGVybWluZSB0aGUgZGVmYXVsdCBmb3IgYSBMaXN0IFR5cGUuIEl0J3Mgc3ViIHR5cGUgaXMgbm90IGRlZmluZWQuYClcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGluZm8uaXRlbVR5cGUudHlwZSA9PSBUeXBlU2V0Lkxpc3QgJiYgaXNBbHJlYWR5TGlzdCkge1xuICAgICAgICAgICAgICAgdGhyb3cgbmV3IFN0YWNrc1Bvc3RncmVzRXJyb3IoYFRoZSBQb3N0Z3JlcyBQbHVnaW4gZG9lcyBub3Qgc3VwcG9ydCBMaXN0IG9mIExpc3RzIHdoZW4gZ2VuZXJhdGluZyBQb3N0Z3JlcyBUYWJsZXNgKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgc3ViVHlwZSA9IHRoaXMuZ2V0Q29sdW1uVHlwZShpbmZvLml0ZW1UeXBlLCB0cnVlKVxuICAgICAgICAgICAgcmV0dXJuIGlzQWxyZWFkeUxpc3QgPyBgJHtzdWJUeXBlfVtdW11gIDogYCR7c3ViVHlwZX1bXWBcbiAgICAgICAgIH1cbiAgICAgICAgIGNhc2UgVHlwZVNldC5PYmplY3RSZWY6IHtcbiAgICAgICAgICAgIGxldCBuZm8gPSB0aGlzLmNvbnRleHQuZ2V0VGFibGUoaW5mby5tb2RlbE5hbWUhKVxuXG4gICAgICAgICAgICBpZiAobmZvID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgIHRocm93IG5ldyBTdGFja3NQb3N0Z3Jlc0Vycm9yKGBBIE1vZGVsIFwiJHtpbmZvLm1vZGVsTmFtZX1cIiBpcyBiZWluZyByZWZlcmVuY2VkIGluIGEgTW9kZWwgcHJvcGVydHksIGJ1dCB0aGUgTW9kZWwgY2Fubm90IGJlIGZvdW5kLiBFbnN1cmUgeW91IGNyZWF0ZSB0aGUgTW9kZWwgYmVmb3JlIHJlZmVyZW5jaW5nIGl0LmApXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBuZm8udGFibGVOYW1lXG4gICAgICAgICB9XG4gICAgICAgICBjYXNlIFR5cGVTZXQuU3RyaW5nOiB7XG4gICAgICAgICAgICByZXR1cm4gJ3RleHQnXG4gICAgICAgICB9XG4gICAgICAgICBkZWZhdWx0OiB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgU3RhY2tzUG9zdGdyZXNFcnJvcihgVW5zdXBwb3J0ZWQgVHlwZSBlbmNvdW50ZXJlZCB3aGVuIEJvb3RzdHJhcHBpbmcgdGhlIFBvc3RncmVzIERCYClcbiAgICAgICAgIH1cbiAgICAgIH1cbiAgIH1cbn0iXX0=