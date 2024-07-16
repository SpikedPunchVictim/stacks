"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginContext = void 0;
const stacks_1 = require("@spikedpunch/stacks");
const kysely_1 = require("kysely");
const pg_1 = require("pg");
const StacksPostgresError_1 = require("./StacksPostgresError");
class PluginContext {
    get tableMap() {
        return this._tableMap;
    }
    constructor(config) {
        this.config = config;
        // Key: Model Name
        // Value: TableInfo
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
            // Add 'query' to debug the queries
            log: ['error']
        });
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
                columns,
                indexes: {
                    id: `${tableConfig.tablename}_id_idx`
                }
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
        result['id'] = dbObj['id'];
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
        result['id'] = object['id'];
        return result;
    }
}
exports.PluginContext = PluginContext;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGx1Z2luQ29udGV4dC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9QbHVnaW5Db250ZXh0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLGdEQUEwRTtBQUMxRSxtQ0FBZ0Q7QUFDaEQsMkJBQXlCO0FBRXpCLCtEQUEyRDtBQVUzRCxNQUFhLGFBQWE7SUFHdkIsSUFBSSxRQUFRO1FBQ1QsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFBO0lBQ3hCLENBQUM7SUFNRCxZQUFxQixNQUFzQjtRQUF0QixXQUFNLEdBQU4sTUFBTSxDQUFnQjtRQUozQyxrQkFBa0I7UUFDbEIsbUJBQW1CO1FBQ1gsY0FBUyxHQUEyQixJQUFJLEdBQUcsRUFBcUIsQ0FBQTtRQUdyRSw4RkFBOEY7UUFDOUYsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLGVBQU0sQ0FBVztZQUM1QixPQUFPLEVBQUUsSUFBSSx3QkFBZSxDQUFDO2dCQUMxQixJQUFJLEVBQUUsSUFBSSxTQUFJLENBQUM7b0JBQ1osUUFBUSxFQUFFLE1BQU0sQ0FBQyxRQUFRO29CQUN6QixJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUk7b0JBQ2pCLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSTtvQkFDakIsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJO29CQUNqQixRQUFRLEVBQUUsTUFBTSxDQUFDLFFBQVE7aUJBQzNCLENBQUM7YUFDSixDQUFDO1lBQ0YsbUNBQW1DO1lBQ25DLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQztTQUNoQixDQUFDLENBQUE7SUFDTCxDQUFDO0lBRUQ7Ozs7Ozs7O09BUUc7SUFDSCxvQkFBb0IsQ0FBQyxLQUFhLEVBQUUsS0FBa0I7UUFDbkQsa0JBQWtCO1FBQ2xCLG1CQUFtQjtRQUNuQixJQUFJLEtBQUssR0FBRyxJQUFJLEdBQUcsRUFBcUIsQ0FBQTtRQUV4QywrQkFBK0I7UUFDL0IsS0FBSyxJQUFJLEtBQUssSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0s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LElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUE7UUFDbEQsQ0FBQztRQUVELE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUE7UUFFMUIsT0FBTyxNQUFNLENBQUE7SUFDaEIsQ0FBQztJQUVEOzs7Ozs7O09BT0c7SUFDSCxPQUFPLENBQUMsU0FBaUIsRUFBRSxNQUFtQjtRQUMzQyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQTtRQUVyRCxJQUFJLElBQUksS0FBSyxTQUFTLEVBQUUsQ0FBQztZQUN0QixNQUFNLElBQUkseUNBQW1CLENBQUMsMkNBQTJDLFNBQVMsRUFBRSxDQUFDLENBQUE7UUFDeEYsQ0FBQztRQUVELElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQTtRQUNmLEtBQUssSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQzVCLE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDbkQsQ0FBQztRQUVELE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUE7UUFFM0IsT0FBTyxNQUFNLENBQUE7SUFDaEIsQ0FBQztDQUNIO0FBaExELHNDQWdMQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElNb2RlbCwgSVN0YWNrLCBTdGFja09iamVjdCwgVHlwZVNldCB9IGZyb20gJ0BzcGlrZWRwdW5jaC9zdGFja3MnXG5pbXBvcnQgeyBLeXNlbHksIFBvc3RncmVzRGlhbGVjdCB9IGZyb20gJ2t5c2VseSdcbmltcG9ydCB7IFBvb2wgfSBmcm9tICdwZydcbmltcG9ydCB7IFBvc3RncmVzQ29uZmlnIH0gZnJvbSAnLi9Qb3N0Z3Jlc0NvbmZpZydcbmltcG9ydCB7IFN0YWNrc1Bvc3RncmVzRXJyb3IgfSBmcm9tICcuL1N0YWNrc1Bvc3RncmVzRXJyb3InXG5pbXBvcnQgeyBNZW1iZXJTeW1ib2xzLCBNb2RlbFN5bWJvbHMgfSBmcm9tICcuL1N5bWJvbHMnXG5pbXBvcnQgeyBTeW1ib2xUYWJsZSB9IGZyb20gJy4vU3ltYm9sVGFibGUnXG5pbXBvcnQgeyBDb2x1bW5JbmZvLCBUYWJsZUluZm8gfSBmcm9tICcuL1RhYmxlJ1xuXG5cbmV4cG9ydCB0eXBlIERhdGFiYXNlID0ge1xuICAgW2tleTogc3RyaW5nXTogYW55XG59XG5cbmV4cG9ydCBjbGFzcyBQbHVnaW5Db250ZXh0IHtcbiAgIHJlYWRvbmx5IGRiOiBLeXNlbHk8RGF0YWJhc2U+XG4gICBcbiAgIGdldCB0YWJsZU1hcCgpOiBNYXA8c3RyaW5nLCBUYWJsZUluZm8+IHtcbiAgICAgIHJldHVybiB0aGlzLl90YWJsZU1hcFxuICAgfVxuXG4gICAvLyBLZXk6IE1vZGVsIE5hbWVcbiAgIC8vIFZhbHVlOiBUYWJsZUluZm9cbiAgIHByaXZhdGUgX3RhYmxlTWFwOiBNYXA8c3RyaW5nLCBUYWJsZUluZm8+ID0gbmV3IE1hcDxzdHJpbmcsIFRhYmxlSW5mbz4oKVxuXG4gICBjb25zdHJ1Y3RvcihyZWFkb25seSBjb25maWc6IFBvc3RncmVzQ29uZmlnKSB7XG4gICAgICAvLyBDb25maWcgZm9yIFBvc3RncmVzIERpYWxlY3Q6IGh0dHBzOi8va29za2ltYXMuZ2l0aHViLmlvL2t5c2VseS9jbGFzc2VzL1Bvc3RncmVzRGlhbGVjdC5odG1sXG4gICAgICB0aGlzLmRiID0gbmV3IEt5c2VseTxEYXRhYmFzZT4oe1xuICAgICAgICAgZGlhbGVjdDogbmV3IFBvc3RncmVzRGlhbGVjdCh7XG4gICAgICAgICAgICBwb29sOiBuZXcgUG9vbCh7XG4gICAgICAgICAgICAgICBkYXRhYmFzZTogY29uZmlnLmRhdGFiYXNlLFxuICAgICAgICAgICAgICAgaG9zdDogY29uZmlnLmhvc3QsXG4gICAgICAgICAgICAgICBwb3J0OiBjb25maWcucG9ydCxcbiAgICAgICAgICAgICAgIHVzZXI6IGNvbmZpZy51c2VyLFxuICAgICAgICAgICAgICAgcGFzc3dvcmQ6IGNvbmZpZy5wYXNzd29yZFxuICAgICAgICAgICAgfSlcbiAgICAgICAgIH0pLFxuICAgICAgICAgLy8gQWRkICdxdWVyeScgdG8gZGVidWcgdGhlIHF1ZXJpZXNcbiAgICAgICAgIGxvZzogWydlcnJvciddXG4gICAgICB9KVxuICAgfVxuXG4gICAvKipcbiAgICAqIEJ1aWxkcyB0aGUgbWFwcGluZyBiZXR3ZWVuIHRoZSBNb2RlbHMgYW5kIHRoZSBQb3N0Z3JlcyBUYWJsZXNcbiAgICAqIFxuICAgICogQHBhcmFtIHN0YWNrIFRoZSBTdGFja1xuICAgICogQHBhcmFtIHRhYmxlIFRoZSBTeW1ib2xzVGFibGVcbiAgICAqIEByZXR1cm5zIEEgTWFwIHdoZXJlOlxuICAgICogICAgLSBLZXk6IE1vZGVsIE5hbWUsIGxvd2VyLWNhc2VkXG4gICAgKiAgICAtIFZhbHVlOiBUaGUgVGFibGUgaW5mbyBmb3IgdGhhdCBNb2RlbFxuICAgICovXG4gICBidWlsZE1vZGVsVG9UYWJsZU1hcChzdGFjazogSVN0YWNrLCB0YWJsZTogU3ltYm9sVGFibGUpOiB2b2lkIHtcbiAgICAgIC8vIEtleTogTW9kZWwgTmFtZVxuICAgICAgLy8gVmFsdWU6IFRhYmxlSW5mb1xuICAgICAgbGV0IGNhY2hlID0gbmV3IE1hcDxzdHJpbmcsIFRhYmxlSW5mbz4oKVxuXG4gICAgICAvLyBEZXRlcm1pbmUgdGFibGVzIGFuZCBjb2x1bW5zXG4gICAgICBmb3IgKGxldCBtb2RlbCBvZiBzdGFjay5nZXQubW9kZWxzKCkpIHtcbiAgICAgICAgIGxldCB0YWJsZUNvbmZpZyA9IHRhYmxlLmdldE1vZGVsU3ltYm9sczxNb2RlbFN5bWJvbHM+KG1vZGVsLmlkKVxuXG4gICAgICAgICBpZiAodGFibGVDb25maWcgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBGYWlsZWQgdG8gZmluZCBhbnkgU3ltYm9sIGNvbmZpZ3VyYXRpb24gZm9yIE1vZGVsICR7bW9kZWwubmFtZX1gKVxuICAgICAgICAgfVxuXG4gICAgICAgICBsZXQgY29sdW1ucyA9IG5ldyBBcnJheTxDb2x1bW5JbmZvPigpXG5cbiAgICAgICAgIGZvciAobGV0IG1lbWJlciBvZiBtb2RlbC5tZW1iZXJzKSB7XG4gICAgICAgICAgICBsZXQgY29sdW1uQ29uZmlnID0gdGFibGUuZ2V0TWVtYmVyU3ltYm9sczxNZW1iZXJTeW1ib2xzPihtb2RlbC5pZCwgbWVtYmVyLmlkKVxuXG4gICAgICAgICAgICBpZiAoY29sdW1uQ29uZmlnID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgRmFpbGVkIHRvIGZpbmQgYW55IFN5bWJvbHMgZm9yIE1FbWJlciAke21lbWJlci5uYW1lfSBpbiBNb2RlbCAke21vZGVsLm5hbWV9YClcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29sdW1ucy5wdXNoKHtcbiAgICAgICAgICAgICAgIG1lbWJlcixcbiAgICAgICAgICAgICAgIGNvbHVtbk5hbWU6IGNvbHVtbkNvbmZpZy5jb2x1bW5hbWVcbiAgICAgICAgICAgIH0pXG4gICAgICAgICB9XG5cbiAgICAgICAgIGNhY2hlLnNldChtb2RlbC5uYW1lLnRvTG93ZXJDYXNlKCksIHtcbiAgICAgICAgICAgIG1vZGVsLFxuICAgICAgICAgICAgdGFibGVOYW1lOiB0YWJsZUNvbmZpZy50YWJsZW5hbWUsXG4gICAgICAgICAgICBjb2x1bW5zLFxuICAgICAgICAgICAgaW5kZXhlczoge1xuICAgICAgICAgICAgICAgaWQ6IGAke3RhYmxlQ29uZmlnLnRhYmxlbmFtZX1faWRfaWR4YFxuICAgICAgICAgICAgfVxuICAgICAgICAgfSlcbiAgICAgIH1cblxuICAgICAgLy8gRGV0ZXJtaW5lIHJlZmVyZW5jZXNcbiAgICAgIGZvciAobGV0IG1vZGVsIG9mIHN0YWNrLmdldC5tb2RlbHMoKSkge1xuICAgICAgICAgbGV0IHRhYmxlID0gY2FjaGUuZ2V0KG1vZGVsLm5hbWUudG9Mb3dlckNhc2UoKSlcblxuICAgICAgICAgaWYgKHRhYmxlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBTdGFja3NQb3N0Z3Jlc0Vycm9yKGBGYWlsZWQgdG8gcHJvcGVybHkgYnVpbGQgdGhlIHRhYmxlIGNhY2hlLiBNb2RlbCAke21vZGVsLm5hbWV9YClcbiAgICAgICAgIH1cblxuICAgICAgICAgZm9yIChsZXQgbWVtYmVyIG9mIG1vZGVsLm1lbWJlcnMpIHtcbiAgICAgICAgICAgIGlmIChtZW1iZXIudHlwZS50eXBlICE9PSBUeXBlU2V0Lk9iamVjdFJlZikge1xuICAgICAgICAgICAgICAgY29udGludWVcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IGluZm8gPSBtZW1iZXIudHlwZS5pbmZvXG5cbiAgICAgICAgICAgIGlmIChpbmZvLm1vZGVsTmFtZSA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICB0aHJvdyBuZXcgU3RhY2tzUG9zdGdyZXNFcnJvcihgTm8gT2JqZWN0UmVmIE1vZGVsIG5hbWUgd2FzIHNldCBmb3IgYSBNZW1iZXIgb2YgVHlwZSBPYmplY3RSZWYuIE1vZGVsICR7bW9kZWwubmFtZX0sIE1lbWJlciAke21lbWJlci5uYW1lfWApXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCByZWZUYWJsZSA9IGNhY2hlLmdldChpbmZvLm1vZGVsTmFtZSEudG9Mb3dlckNhc2UoKSlcblxuICAgICAgICAgICAgaWYgKHJlZlRhYmxlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgIHRocm93IG5ldyBTdGFja3NQb3N0Z3Jlc0Vycm9yKGBBIE1vZGVsIFwiJHtpbmZvLm1vZGVsTmFtZX1cIiBpcyBiZWluZyByZWZlcmVuY2VkIGluIGEgTW9kZWwgcHJvcGVydHksIGJ1dCB0aGUgTW9kZWwgY2Fubm90IGJlIGZvdW5kLiBFbnN1cmUgeW91IGNyZWF0ZSB0aGUgTW9kZWwgYmVmb3JlIHJlZmVyZW5jaW5nIGl0LmApXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBjb2x1bW5JbmZvID0gdGFibGUuY29sdW1ucy5maW5kKGl0ID0+IGl0Lm1lbWJlci5pZCA9PT0gbWVtYmVyLmlkKVxuXG4gICAgICAgICAgICBpZiAoY29sdW1uSW5mbyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICB0aHJvdyBuZXcgU3RhY2tzUG9zdGdyZXNFcnJvcihgQSBDb2x1bW4gaW4gdGhlIE1vZGVsIFwiJHttZW1iZXIubW9kZWwubmFtZX1cIiBjb3VsZCBub3QgYmUgZm91bmRgKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBXZSByZWNvcmQgdGhlIHJlZmVyZW5jZWQgdGFibGUgaGVyZSBmb3IgbG9va3VwIGxhdGVyIHdoZW4gd2Ugc2F2ZS5cbiAgICAgICAgICAgIC8vIFdlIGNvdWxkIGFsc28gZG8gdGhpcyB3aGVuIHdlIGNyZWF0ZSB0aGUgQ29sdW1uSW5mbywgYnV0IGl0IHdvdWxkIHJlcXVpcmVcbiAgICAgICAgICAgIC8vIGFkZGl0aW9uYWwgbG9naWMgdG8gbG9va3VwIGV2ZXJ5dGhpbmcuIEJ5IGRvaW5nIGl0IGhlcmUsIHdlJ3JlIGRvaW5nXG4gICAgICAgICAgICAvLyBhdCB0aGUgc2l0ZSB3ZSBjcmVhdGUgdGhlIGFjdHVhbCBjb2x1bW4gYW5kIHNldHVwIHRoZSByZWZlcmVuY2UsIHNvIHRoZXJlJ3NcbiAgICAgICAgICAgIC8vIGxlc3Mgcm9vbSBmb3IgZXJyb3Igc2hvdWxkIHdlIG1vdmUgbG9naWMgYXJvdW5kLlxuICAgICAgICAgICAgY29sdW1uSW5mby5yZWZlcmVuY2UgPSB7XG4gICAgICAgICAgICAgICBtb2RlbDogcmVmVGFibGUubW9kZWwsXG4gICAgICAgICAgICAgICB0YWJsZTogcmVmVGFibGUudGFibGVOYW1lXG4gICAgICAgICAgICB9XG4gICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX3RhYmxlTWFwID0gY2FjaGVcbiAgIH1cblxuICAgLyoqXG4gICAgKiBHZXQncyB0aGUgVGFibGVJbmZvIGZvciBhIE1vZGVsXG4gICAgKiBcbiAgICAqIEBwYXJhbSBtb2RlbCBUaGUgTW9kZWwgb3IgTW9kZWwgTmFtZVxuICAgICogQHJldHVybnMgXG4gICAgKi9cbiAgIGdldFRhYmxlKG1vZGVsOiBJTW9kZWwgfCBzdHJpbmcpOiBUYWJsZUluZm8gfCB1bmRlZmluZWQge1xuICAgICAgaWYodHlwZW9mIG1vZGVsID09PSAnc3RyaW5nJykge1xuICAgICAgICAgcmV0dXJuIHRoaXMudGFibGVNYXAuZ2V0KG1vZGVsLnRvTG93ZXJDYXNlKCkpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICAgcmV0dXJuIHRoaXMudGFibGVNYXAuZ2V0KG1vZGVsLm5hbWUudG9Mb3dlckNhc2UoKSlcbiAgICAgIH1cbiAgIH1cblxuICAgZnJvbURiT2JqKG1vZGVsTmFtZTogc3RyaW5nLCBkYk9iajogU3RhY2tPYmplY3QpOiBhbnkge1xuICAgICAgbGV0IGluZm8gPSB0aGlzLnRhYmxlTWFwLmdldChtb2RlbE5hbWUudG9Mb3dlckNhc2UoKSlcblxuICAgICAgaWYgKGluZm8gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgdGhyb3cgbmV3IFN0YWNrc1Bvc3RncmVzRXJyb3IoYENhbm5vdCBmaW5kIHRhYmxlIGFzc29jaWF0ZWQgd2l0aCBNb2RlbCAke21vZGVsTmFtZX1gKVxuICAgICAgfVxuXG4gICAgICBsZXQgcmVzdWx0ID0ge31cbiAgICAgIGZvciAobGV0IGNvbCBvZiBpbmZvLmNvbHVtbnMpIHtcbiAgICAgICAgIHJlc3VsdFtjb2wubWVtYmVyLm5hbWVdID0gZGJPYmpbY29sLmNvbHVtbk5hbWVdXG4gICAgICB9XG5cbiAgICAgIHJlc3VsdFsnaWQnXSA9IGRiT2JqWydpZCddXG5cbiAgICAgIHJldHVybiByZXN1bHRcbiAgIH1cblxuICAgLyoqXG4gICAgKiBDcmVhdGVzIGFuIE9iamVjdCB3aG9zZSBrZXlzIGFyZSB0aGUgY29sdW1uIG5hbWUsIGFuZCB0aGUgdmFsdWVzIGFyZSB0aGUgXG4gICAgKiBtYXRjaGluZyBNZW1iZXIgbmFtZVxuICAgICogXG4gICAgKiBAcGFyYW0gbW9kZWxOYW1lIFRoZSBNb2RlbCBOYW1lXG4gICAgKiBAcGFyYW0gb2JqZWN0IFRoZSBPYmplY3QgdG8gbWFwXG4gICAgKiBAcmV0dXJucyBcbiAgICAqL1xuICAgdG9EYk9iaihtb2RlbE5hbWU6IHN0cmluZywgb2JqZWN0OiBTdGFja09iamVjdCk6IGFueSB7XG4gICAgICBsZXQgaW5mbyA9IHRoaXMudGFibGVNYXAuZ2V0KG1vZGVsTmFtZS50b0xvd2VyQ2FzZSgpKVxuXG4gICAgICBpZiAoaW5mbyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICB0aHJvdyBuZXcgU3RhY2tzUG9zdGdyZXNFcnJvcihgQ2Fubm90IGZpbmQgdGFibGUgYXNzb2NpYXRlZCB3aXRoIE1vZGVsICR7bW9kZWxOYW1lfWApXG4gICAgICB9XG5cbiAgICAgIGxldCByZXN1bHQgPSB7fVxuICAgICAgZm9yIChsZXQgY29sIG9mIGluZm8uY29sdW1ucykge1xuICAgICAgICAgcmVzdWx0W2NvbC5jb2x1bW5OYW1lXSA9IG9iamVjdFtjb2wubWVtYmVyLm5hbWVdXG4gICAgICB9XG5cbiAgICAgIHJlc3VsdFsnaWQnXSA9IG9iamVjdFsnaWQnXVxuXG4gICAgICByZXR1cm4gcmVzdWx0XG4gICB9XG59Il19