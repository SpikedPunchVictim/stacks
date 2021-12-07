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
    generate(): Promise<string>;
    /**
     * Generates an ID used locally. These are used for Model Members
     * where they are not expected to be consistent between runs.
     */
    generateLocal(): string;
    /**
     * Determines if an ID has already been reserved.
     *
     * @param id The ID to check
     */
    has(id: string): Promise<boolean>;
    /**
     * Registers an ID with the UidKeeper. Registered IDs won't be used again
     *
     * @param id The id to register
     */
    register(id: string): Promise<void>;
    /**
     * Unregisters an ID with the UidKeeper.
     *
     * @param id The id to unregister
     */
    unregister(id: string): Promise<void>;
}
export declare class UidKeeper implements IUidKeeper {
    get stack(): IStack | undefined;
    static IdNotSet: string;
    private ids;
    private _stack;
    constructor();
    attach(stack: IStack): void;
    generate(): Promise<string>;
    generateLocal(): string;
    has(id: string): Promise<boolean>;
    register(id: string): Promise<void>;
    unregister(id: string): Promise<void>;
}
