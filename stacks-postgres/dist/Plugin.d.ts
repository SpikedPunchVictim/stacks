import { IEventRouter, IPlugin, IStack } from '@spikedpunch/stacks';
import { PostgresConfig } from './PostgresConfig';
export declare class PostgresPlugin implements IPlugin {
    readonly config: PostgresConfig;
    readonly name: string;
    private version;
    private symbols;
    private context;
    constructor(config: PostgresConfig);
    /**
     * Drops a Database from the server. Ensure the credentials provided
     * have the right permissions to Drop the Table.
     *
     * @param dbName The Database name to drop
     */
    dropDb(dbName: string): Promise<void>;
    createDbIfNotExists(dbName: string): Promise<void>;
    setup(stack: IStack, router: IEventRouter): Promise<void>;
    private bootstrapDb;
    private buildSearchIndexes;
    private createTable;
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
    private createColumn;
    private getColumnType;
}
