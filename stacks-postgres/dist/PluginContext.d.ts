import { IModel, IStack, StackObject } from '@spikedpunch/stacks';
import { Kysely } from 'kysely';
import { PostgresConfig } from './PostgresConfig';
import { SymbolTable } from './SymbolTable';
import { TableInfo } from './Table';
export declare type Database = {
    [key: string]: any;
};
export declare class PluginContext {
    readonly config: PostgresConfig;
    readonly db: Kysely<Database>;
    get tableMap(): Map<string, TableInfo>;
    private _tableMap;
    constructor(config: PostgresConfig);
    /**
     * Builds the mapping between the Models and the Postgres Tables
     *
     * @param stack The Stack
     * @param table The SymbolsTable
     * @returns A Map where:
     *    - Key: Model Name, lower-cased
     *    - Value: The Table info for that Model
     */
    buildModelToTableMap(stack: IStack, table: SymbolTable): void;
    /**
     * Get's the TableInfo for a Model
     *
     * @param model The Model or Model Name
     * @returns
     */
    getTable(model: IModel | string): TableInfo | undefined;
    fromDbObj(modelName: string, dbObj: StackObject): any;
    /**
     * Creates an Object whose keys are the column name, and the values are the
     * matching Member name
     *
     * @param modelName The Model Name
     * @param object The Object to map
     * @returns
     */
    toDbObj(modelName: string, object: StackObject): any;
}
