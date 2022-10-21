import { IPlugin, IStack, IEventRouter } from '@spikedpunch/stacks';
export declare type FsOptions = {
    objectNameField?: string;
};
/**
 * File system plugin for Stacks
 *
 * Notes:
 *    * GetMany cursor points to the next file in a sorted list
 */
export declare class FsPlugin implements IPlugin {
    readonly baseDir: string;
    readonly name: string;
    readonly options: FsOptions;
    constructor(baseDir: string, options: FsOptions);
    setup(stack: IStack, router: IEventRouter): Promise<void>;
    private getModelDir;
    private getObjectPath;
    private setupModel;
}
