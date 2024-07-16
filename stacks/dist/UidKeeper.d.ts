import { IModel } from './Model';
import { IStack } from './stack/Stack';
/**
 * This class is responsible for generating IDs for the objects
 */
export interface IUidKeeper {
    /**
     * Attahces the Stack to this UidKeeper
     *
     * @param stack The Stack
     */
    attach(stack: IStack): void;
    /**
     * Generates a unique ID
     */
    generate(model: IModel): Promise<string>;
    /**
     * Generates an ID used locally. These are used for Model Members
     * where they are not expected to be consistent between runs.
     */
    generateLocal(): string;
    /**
     * Determines if an ID has already been reserved.
     *
     * @param id The ID to check
     * @param modelId The associated Model ID
     */
    has(id: string, model: IModel): Promise<boolean>;
}
export declare class UidKeeper implements IUidKeeper {
    get stack(): IStack | undefined;
    static IdNotSet: string;
    private ids;
    private _stack;
    constructor();
    attach(stack: IStack): void;
    generate(model: IModel): Promise<string>;
    generateLocal(): string;
    has(id: string, model: IModel): Promise<boolean>;
}
