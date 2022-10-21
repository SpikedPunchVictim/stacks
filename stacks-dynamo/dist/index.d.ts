import { IPlugin, IStack, IEventRouter } from "@spikedpunch/stacks";
import { DynatronClientConfig } from 'dynatron';
export declare type DynamoDbPluginConfig = {} & DynatronClientConfig;
/**
 * File system plugin for Stacks
 *
 * Notes:
 *    * GetMany cursor points to the next file in a sorted list
 */
export declare class DynamoDbPlugin implements IPlugin {
    readonly baseDir: string;
    readonly options: DynamoDbPluginConfig;
    readonly name: string;
    private client;
    constructor(baseDir: string, options: DynamoDbPluginConfig);
    setup(stack: IStack, router: IEventRouter): Promise<void>;
}
