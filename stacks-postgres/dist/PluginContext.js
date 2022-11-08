"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginContext = void 0;
const stacks_1 = require("@spikedpunch/stacks");
const kysely_1 = require("kysely");
const pg_1 = require("pg");
const StacksPostgresError_1 = require("./StacksPostgresError");
class PluginContext {
    constructor(config) {
        this.config = config;
        this._tableMap = new Map();
        // Config for Postgres Dialect: https://koskimas.github.io/kysely/classes/PostgresDialect.html
        this.db = new kysely_1.Kysely({
            dialect: new kysely_1.PostgresDialect({
                pool: new pg_1.Pool({
                    database: config.database,
                    host: config.host,
                    port: config.port,
                    user: config.user,
                    password: config.password
                })
            }),
            log: ['query', 'error']
        });
    }
    get tableMap() {
        return this._tableMap;
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
    buildModelToTableMap(stack, table) {
        // Key: Model Name
        // Value: TableInfo
        let cache = new Map();
        // Determine tables and columns
        for (let model of stack.get.models()) {
            let tableConfig = table.getModelSymbols(model.id);
            if (tableConfig === undefined) {
                throw new Error(`Failed to find any Symbol configuration for Model ${model.name}`);
            }
            let columns = new Array();
            for (let member of model.members) {
                let columnConfig = table.getMemberSymbols(model.id, member.id);
                if (columnConfig === undefined) {
                    throw new Error(`Failed to find any Symbols for MEmber ${member.name} in Model ${model.name}`);
                }
                columns.push({
                    member,
                    columnName: columnConfig.columname
                });
            }
            cache.set(model.name.toLowerCase(), {
                model,
                tableName: tableConfig.tablename,
                columns
            });
        }
        // Determine references
        for (let model of stack.get.models()) {
            let table = cache.get(model.name.toLowerCase());
            if (table === undefined) {
                throw new StacksPostgresError_1.StacksPostgresError(`Failed to properly build the table cache. Model ${model.name}`);
            }
            for (let member of model.members) {
                if (member.type.type !== stacks_1.TypeSet.ObjectRef) {
                    continue;
                }
                let info = member.type.info;
                if (info.modelName == null) {
                    throw new StacksPostgresError_1.StacksPostgresError(`No ObjectRef Model name was set for a Member of Type ObjectRef. Model ${model.name}, Member ${member.name}`);
                }
                let refTable = cache.get(info.modelName.toLowerCase());
                if (refTable === undefined) {
                    throw new StacksPostgresError_1.StacksPostgresError(`A Model "${info.modelName}" is being referenced in a Model property, but the Model cannot be found. Ensure you create the Model before referencing it.`);
                }
                let columnInfo = table.columns.find(it => it.member.id === member.id);
                if (columnInfo === undefined) {
                    throw new StacksPostgresError_1.StacksPostgresError(`A Column in the Model "${member.model.name}" could not be found`);
                }
                // We record the referenced table here for lookup later when we save.
                // We could also do this when we create the ColumnInfo, but it would require
                // additional logic to lookup everything. By doing it here, we're doing
                // at the site we create the actual column and setup the reference, so there's
                // less room for error should we move logic around.
                columnInfo.reference = {
                    model: refTable.model,
                    table: refTable.tableName
                };
            }
        }
        this._tableMap = cache;
    }
    /**
     * Get's the TableInfo for a Model
     *
     * @param model The Model or Model Name
     * @returns
     */
    getTable(model) {
        if (typeof model === 'string') {
            return this.tableMap.get(model.toLowerCase());
        }
        else {
            return this.tableMap.get(model.name.toLowerCase());
        }
    }
    fromDbObj(modelName, dbObj) {
        let info = this.tableMap.get(modelName.toLowerCase());
        if (info === undefined) {
            throw new StacksPostgresError_1.StacksPostgresError(`Cannot find table associated with Model ${modelName}`);
        }
        let result = {};
        for (let col of info.columns) {
            result[col.member.name] = dbObj[col.columnName];
        }
        return result;
    }
    /**
     * Creates an Object whose keys are the column name, and the values are the
     * matching Member name
     *
     * @param modelName The Model Name
     * @param object The Object to map
     * @returns
     */
    toDbObj(modelName, object) {
        let info = this.tableMap.get(modelName.toLowerCase());
        if (info === undefined) {
            throw new StacksPostgresError_1.StacksPostgresError(`Cannot find table associated with Model ${modelName}`);
        }
        let result = {};
        for (let col of info.columns) {
            result[col.columnName] = object[col.member.name];
        }
        return result;
    }
}
exports.PluginContext = PluginContext;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGx1Z2luQ29udGV4dC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9QbHVnaW5Db250ZXh0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLGdEQUEwRTtBQUMxRSxtQ0FBZ0Q7QUFDaEQsMkJBQXlCO0FBRXpCLCtEQUEyRDtBQVUzRCxNQUFhLGFBQWE7SUFTdkIsWUFBcUIsTUFBc0I7UUFBdEIsV0FBTSxHQUFOLE1BQU0sQ0FBZ0I7UUFGbkMsY0FBUyxHQUEyQixJQUFJLEdBQUcsRUFBcUIsQ0FBQTtRQUdyRSw4RkFBOEY7UUFDOUYsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLGVBQU0sQ0FBVztZQUM1QixPQUFPLEVBQUUsSUFBSSx3QkFBZSxDQUFDO2dCQUMxQixJQUFJLEVBQUUsSUFBSSxTQUFJLENBQUM7b0JBQ1osUUFBUSxFQUFFLE1BQU0sQ0FBQyxRQUFRO29CQUN6QixJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUk7b0JBQ2pCLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSTtvQkFDakIsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJO29CQUNqQixRQUFRLEVBQUUsTUFBTSxDQUFDLFFBQVE7aUJBQzNCLENBQUM7YUFDSixDQUFDO1lBQ0YsR0FBRyxFQUFFLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQztTQUN6QixDQUFDLENBQUE7SUFDTCxDQUFDO0lBcEJELElBQUksUUFBUTtRQUNULE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQTtJQUN4QixDQUFDO0lBb0JEOzs7Ozs7OztPQVFHO0lBQ0gsb0JBQW9CLENBQUMsS0FBYSxFQUFFLEtBQWtCO1FBQ25ELGtCQUFrQjtRQUNsQixtQkFBbUI7UUFDbkIsSUFBSSxLQUFLLEdBQUcsSUFBSSxHQUFHLEVBQXFCLENBQUE7UUFFeEMsK0JBQStCO1FBQy9CLEtBQUssSUFBSSxLQUFLLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsRUFBRTtZQUNuQyxJQUFJLFdBQVcs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QUssU0FBUyxFQUFFO1lBQ3JCLE1BQU0sSUFBSSx5Q0FBbUIsQ0FBQywyQ0FBMkMsU0FBUyxFQUFFLENBQUMsQ0FBQTtTQUN2RjtRQUVELElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQTtRQUNmLEtBQUssSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUMzQixNQUFNLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFBO1NBQ2xEO1FBRUQsT0FBTyxNQUFNLENBQUE7SUFDaEIsQ0FBQztDQUNIO0FBdEtELHNDQXNLQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElNb2RlbCwgSVN0YWNrLCBTdGFja09iamVjdCwgVHlwZVNldCB9IGZyb20gJ0BzcGlrZWRwdW5jaC9zdGFja3MnXG5pbXBvcnQgeyBLeXNlbHksIFBvc3RncmVzRGlhbGVjdCB9IGZyb20gJ2t5c2VseSdcbmltcG9ydCB7IFBvb2wgfSBmcm9tICdwZydcbmltcG9ydCB7IFBvc3RncmVzQ29uZmlnIH0gZnJvbSAnLi9Qb3N0Z3Jlc0NvbmZpZydcbmltcG9ydCB7IFN0YWNrc1Bvc3RncmVzRXJyb3IgfSBmcm9tICcuL1N0YWNrc1Bvc3RncmVzRXJyb3InXG5pbXBvcnQgeyBNZW1iZXJTeW1ib2xzLCBNb2RlbFN5bWJvbHMgfSBmcm9tICcuL1N5bWJvbHMnXG5pbXBvcnQgeyBTeW1ib2xUYWJsZSB9IGZyb20gJy4vU3ltYm9sVGFibGUnXG5pbXBvcnQgeyBDb2x1bW5JbmZvLCBUYWJsZUluZm8gfSBmcm9tICcuL1RhYmxlJ1xuXG5cbmV4cG9ydCB0eXBlIERhdGFiYXNlID0ge1xuICAgW2tleTogc3RyaW5nXTogYW55XG59XG5cbmV4cG9ydCBjbGFzcyBQbHVnaW5Db250ZXh0IHtcbiAgIHJlYWRvbmx5IGRiOiBLeXNlbHk8RGF0YWJhc2U+XG4gICBcbiAgIGdldCB0YWJsZU1hcCgpOiBNYXA8c3RyaW5nLCBUYWJsZUluZm8+IHtcbiAgICAgIHJldHVybiB0aGlzLl90YWJsZU1hcFxuICAgfVxuXG4gICBwcml2YXRlIF90YWJsZU1hcDogTWFwPHN0cmluZywgVGFibGVJbmZvPiA9IG5ldyBNYXA8c3RyaW5nLCBUYWJsZUluZm8+KClcblxuICAgY29uc3RydWN0b3IocmVhZG9ubHkgY29uZmlnOiBQb3N0Z3Jlc0NvbmZpZykge1xuICAgICAgLy8gQ29uZmlnIGZvciBQb3N0Z3JlcyBEaWFsZWN0OiBodHRwczovL2tvc2tpbWFzLmdpdGh1Yi5pby9reXNlbHkvY2xhc3Nlcy9Qb3N0Z3Jlc0RpYWxlY3QuaHRtbFxuICAgICAgdGhpcy5kYiA9IG5ldyBLeXNlbHk8RGF0YWJhc2U+KHtcbiAgICAgICAgIGRpYWxlY3Q6IG5ldyBQb3N0Z3Jlc0RpYWxlY3Qoe1xuICAgICAgICAgICAgcG9vbDogbmV3IFBvb2woe1xuICAgICAgICAgICAgICAgZGF0YWJhc2U6IGNvbmZpZy5kYXRhYmFzZSxcbiAgICAgICAgICAgICAgIGhvc3Q6IGNvbmZpZy5ob3N0LFxuICAgICAgICAgICAgICAgcG9ydDogY29uZmlnLnBvcnQsXG4gICAgICAgICAgICAgICB1c2VyOiBjb25maWcudXNlcixcbiAgICAgICAgICAgICAgIHBhc3N3b3JkOiBjb25maWcucGFzc3dvcmRcbiAgICAgICAgICAgIH0pXG4gICAgICAgICB9KSxcbiAgICAgICAgIGxvZzogWydxdWVyeScsICdlcnJvciddXG4gICAgICB9KVxuICAgfVxuXG4gICAvKipcbiAgICAqIEJ1aWxkcyB0aGUgbWFwcGluZyBiZXR3ZWVuIHRoZSBNb2RlbHMgYW5kIHRoZSBQb3N0Z3JlcyBUYWJsZXNcbiAgICAqIFxuICAgICogQHBhcmFtIHN0YWNrIFRoZSBTdGFja1xuICAgICogQHBhcmFtIHRhYmxlIFRoZSBTeW1ib2xzVGFibGVcbiAgICAqIEByZXR1cm5zIEEgTWFwIHdoZXJlOlxuICAgICogICAgLSBLZXk6IE1vZGVsIE5hbWUsIGxvd2VyLWNhc2VkXG4gICAgKiAgICAtIFZhbHVlOiBUaGUgVGFibGUgaW5mbyBmb3IgdGhhdCBNb2RlbFxuICAgICovXG4gICBidWlsZE1vZGVsVG9UYWJsZU1hcChzdGFjazogSVN0YWNrLCB0YWJsZTogU3ltYm9sVGFibGUpOiB2b2lkIHtcbiAgICAgIC8vIEtleTogTW9kZWwgTmFtZVxuICAgICAgLy8gVmFsdWU6IFRhYmxlSW5mb1xuICAgICAgbGV0IGNhY2hlID0gbmV3IE1hcDxzdHJpbmcsIFRhYmxlSW5mbz4oKVxuXG4gICAgICAvLyBEZXRlcm1pbmUgdGFibGVzIGFuZCBjb2x1bW5zXG4gICAgICBmb3IgKGxldCBtb2RlbCBvZiBzdGFjay5nZXQubW9kZWxzKCkpIHtcbiAgICAgICAgIGxldCB0YWJsZUNvbmZpZyA9IHRhYmxlLmdldE1vZGVsU3ltYm9sczxNb2RlbFN5bWJvbHM+KG1vZGVsLmlkKVxuXG4gICAgICAgICBpZiAodGFibGVDb25maWcgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBGYWlsZWQgdG8gZmluZCBhbnkgU3ltYm9sIGNvbmZpZ3VyYXRpb24gZm9yIE1vZGVsICR7bW9kZWwubmFtZX1gKVxuICAgICAgICAgfVxuXG4gICAgICAgICBsZXQgY29sdW1ucyA9IG5ldyBBcnJheTxDb2x1bW5JbmZvPigpXG5cbiAgICAgICAgIGZvciAobGV0IG1lbWJlciBvZiBtb2RlbC5tZW1iZXJzKSB7XG4gICAgICAgICAgICBsZXQgY29sdW1uQ29uZmlnID0gdGFibGUuZ2V0TWVtYmVyU3ltYm9sczxNZW1iZXJTeW1ib2xzPihtb2RlbC5pZCwgbWVtYmVyLmlkKVxuXG4gICAgICAgICAgICBpZiAoY29sdW1uQ29uZmlnID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgRmFpbGVkIHRvIGZpbmQgYW55IFN5bWJvbHMgZm9yIE1FbWJlciAke21lbWJlci5uYW1lfSBpbiBNb2RlbCAke21vZGVsLm5hbWV9YClcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29sdW1ucy5wdXNoKHtcbiAgICAgICAgICAgICAgIG1lbWJlcixcbiAgICAgICAgICAgICAgIGNvbHVtbk5hbWU6IGNvbHVtbkNvbmZpZy5jb2x1bW5hbWVcbiAgICAgICAgICAgIH0pXG4gICAgICAgICB9XG5cbiAgICAgICAgIGNhY2hlLnNldChtb2RlbC5uYW1lLnRvTG93ZXJDYXNlKCksIHtcbiAgICAgICAgICAgIG1vZGVsLFxuICAgICAgICAgICAgdGFibGVOYW1lOiB0YWJsZUNvbmZpZy50YWJsZW5hbWUsXG4gICAgICAgICAgICBjb2x1bW5zXG4gICAgICAgICB9KVxuICAgICAgfVxuXG4gICAgICAvLyBEZXRlcm1pbmUgcmVmZXJlbmNlc1xuICAgICAgZm9yIChsZXQgbW9kZWwgb2Ygc3RhY2suZ2V0Lm1vZGVscygpKSB7XG4gICAgICAgICBsZXQgdGFibGUgPSBjYWNoZS5nZXQobW9kZWwubmFtZS50b0xvd2VyQ2FzZSgpKVxuXG4gICAgICAgICBpZiAodGFibGUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFN0YWNrc1Bvc3RncmVzRXJyb3IoYEZhaWxlZCB0byBwcm9wZXJseSBidWlsZCB0aGUgdGFibGUgY2FjaGUuIE1vZGVsICR7bW9kZWwubmFtZX1gKVxuICAgICAgICAgfVxuXG4gICAgICAgICBmb3IgKGxldCBtZW1iZXIgb2YgbW9kZWwubWVtYmVycykge1xuICAgICAgICAgICAgaWYgKG1lbWJlci50eXBlLnR5cGUgIT09IFR5cGVTZXQuT2JqZWN0UmVmKSB7XG4gICAgICAgICAgICAgICBjb250aW51ZVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgaW5mbyA9IG1lbWJlci50eXBlLmluZm9cblxuICAgICAgICAgICAgaWYgKGluZm8ubW9kZWxOYW1lID09IG51bGwpIHtcbiAgICAgICAgICAgICAgIHRocm93IG5ldyBTdGFja3NQb3N0Z3Jlc0Vycm9yKGBObyBPYmplY3RSZWYgTW9kZWwgbmFtZSB3YXMgc2V0IGZvciBhIE1lbWJlciBvZiBUeXBlIE9iamVjdFJlZi4gTW9kZWwgJHttb2RlbC5uYW1lfSwgTWVtYmVyICR7bWVtYmVyLm5hbWV9YClcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IHJlZlRhYmxlID0gY2FjaGUuZ2V0KGluZm8ubW9kZWxOYW1lIS50b0xvd2VyQ2FzZSgpKVxuXG4gICAgICAgICAgICBpZiAocmVmVGFibGUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgdGhyb3cgbmV3IFN0YWNrc1Bvc3RncmVzRXJyb3IoYEEgTW9kZWwgXCIke2luZm8ubW9kZWxOYW1lfVwiIGlzIGJlaW5nIHJlZmVyZW5jZWQgaW4gYSBNb2RlbCBwcm9wZXJ0eSwgYnV0IHRoZSBNb2RlbCBjYW5ub3QgYmUgZm91bmQuIEVuc3VyZSB5b3UgY3JlYXRlIHRoZSBNb2RlbCBiZWZvcmUgcmVmZXJlbmNpbmcgaXQuYClcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IGNvbHVtbkluZm8gPSB0YWJsZS5jb2x1bW5zLmZpbmQoaXQgPT4gaXQubWVtYmVyLmlkID09PSBtZW1iZXIuaWQpXG5cbiAgICAgICAgICAgIGlmIChjb2x1bW5JbmZvID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgIHRocm93IG5ldyBTdGFja3NQb3N0Z3Jlc0Vycm9yKGBBIENvbHVtbiBpbiB0aGUgTW9kZWwgXCIke21lbWJlci5tb2RlbC5uYW1lfVwiIGNvdWxkIG5vdCBiZSBmb3VuZGApXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFdlIHJlY29yZCB0aGUgcmVmZXJlbmNlZCB0YWJsZSBoZXJlIGZvciBsb29rdXAgbGF0ZXIgd2hlbiB3ZSBzYXZlLlxuICAgICAgICAgICAgLy8gV2UgY291bGQgYWxzbyBkbyB0aGlzIHdoZW4gd2UgY3JlYXRlIHRoZSBDb2x1bW5JbmZvLCBidXQgaXQgd291bGQgcmVxdWlyZVxuICAgICAgICAgICAgLy8gYWRkaXRpb25hbCBsb2dpYyB0byBsb29rdXAgZXZlcnl0aGluZy4gQnkgZG9pbmcgaXQgaGVyZSwgd2UncmUgZG9pbmdcbiAgICAgICAgICAgIC8vIGF0IHRoZSBzaXRlIHdlIGNyZWF0ZSB0aGUgYWN0dWFsIGNvbHVtbiBhbmQgc2V0dXAgdGhlIHJlZmVyZW5jZSwgc28gdGhlcmUnc1xuICAgICAgICAgICAgLy8gbGVzcyByb29tIGZvciBlcnJvciBzaG91bGQgd2UgbW92ZSBsb2dpYyBhcm91bmQuXG4gICAgICAgICAgICBjb2x1bW5JbmZvLnJlZmVyZW5jZSA9IHtcbiAgICAgICAgICAgICAgIG1vZGVsOiByZWZUYWJsZS5tb2RlbCxcbiAgICAgICAgICAgICAgIHRhYmxlOiByZWZUYWJsZS50YWJsZU5hbWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5fdGFibGVNYXAgPSBjYWNoZVxuICAgfVxuXG4gICAvKipcbiAgICAqIEdldCdzIHRoZSBUYWJsZUluZm8gZm9yIGEgTW9kZWxcbiAgICAqIFxuICAgICogQHBhcmFtIG1vZGVsIFRoZSBNb2RlbCBvciBNb2RlbCBOYW1lXG4gICAgKiBAcmV0dXJucyBcbiAgICAqL1xuICAgZ2V0VGFibGUobW9kZWw6IElNb2RlbCB8IHN0cmluZyk6IFRhYmxlSW5mbyB8IHVuZGVmaW5lZCB7XG4gICAgICBpZih0eXBlb2YgbW9kZWwgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICByZXR1cm4gdGhpcy50YWJsZU1hcC5nZXQobW9kZWwudG9Mb3dlckNhc2UoKSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICByZXR1cm4gdGhpcy50YWJsZU1hcC5nZXQobW9kZWwubmFtZS50b0xvd2VyQ2FzZSgpKVxuICAgICAgfVxuICAgfVxuXG4gICBmcm9tRGJPYmoobW9kZWxOYW1lOiBzdHJpbmcsIGRiT2JqOiBTdGFja09iamVjdCk6IGFueSB7XG4gICAgICBsZXQgaW5mbyA9IHRoaXMudGFibGVNYXAuZ2V0KG1vZGVsTmFtZS50b0xvd2VyQ2FzZSgpKVxuXG4gICAgICBpZiAoaW5mbyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICB0aHJvdyBuZXcgU3RhY2tzUG9zdGdyZXNFcnJvcihgQ2Fubm90IGZpbmQgdGFibGUgYXNzb2NpYXRlZCB3aXRoIE1vZGVsICR7bW9kZWxOYW1lfWApXG4gICAgICB9XG5cbiAgICAgIGxldCByZXN1bHQgPSB7fVxuICAgICAgZm9yIChsZXQgY29sIG9mIGluZm8uY29sdW1ucykge1xuICAgICAgICAgcmVzdWx0W2NvbC5tZW1iZXIubmFtZV0gPSBkYk9ialtjb2wuY29sdW1uTmFtZV1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlc3VsdFxuICAgfVxuXG4gICAvKipcbiAgICAqIENyZWF0ZXMgYW4gT2JqZWN0IHdob3NlIGtleXMgYXJlIHRoZSBjb2x1bW4gbmFtZSwgYW5kIHRoZSB2YWx1ZXMgYXJlIHRoZSBcbiAgICAqIG1hdGNoaW5nIE1lbWJlciBuYW1lXG4gICAgKiBcbiAgICAqIEBwYXJhbSBtb2RlbE5hbWUgVGhlIE1vZGVsIE5hbWVcbiAgICAqIEBwYXJhbSBvYmplY3QgVGhlIE9iamVjdCB0byBtYXBcbiAgICAqIEByZXR1cm5zIFxuICAgICovXG4gICB0b0RiT2JqKG1vZGVsTmFtZTogc3RyaW5nLCBvYmplY3Q6IFN0YWNrT2JqZWN0KTogYW55IHtcbiAgICAgIGxldCBpbmZvID0gdGhpcy50YWJsZU1hcC5nZXQobW9kZWxOYW1lLnRvTG93ZXJDYXNlKCkpXG5cbiAgICAgIGlmIChpbmZvID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgIHRocm93IG5ldyBTdGFja3NQb3N0Z3Jlc0Vycm9yKGBDYW5ub3QgZmluZCB0YWJsZSBhc3NvY2lhdGVkIHdpdGggTW9kZWwgJHttb2RlbE5hbWV9YClcbiAgICAgIH1cblxuICAgICAgbGV0IHJlc3VsdCA9IHt9XG4gICAgICBmb3IgKGxldCBjb2wgb2YgaW5mby5jb2x1bW5zKSB7XG4gICAgICAgICByZXN1bHRbY29sLmNvbHVtbk5hbWVdID0gb2JqZWN0W2NvbC5tZW1iZXIubmFtZV1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlc3VsdFxuICAgfVxufSJdfQ==