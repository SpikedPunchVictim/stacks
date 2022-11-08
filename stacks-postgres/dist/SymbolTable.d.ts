import { IStack } from "@spikedpunch/stacks";
export declare type SymbolValueMap = {
    model: {
        prefix: string;
        defaults: {
            [key: string]: any;
        };
    };
    members: {
        prefix: string;
        defaults: {
            [key: string]: any;
        };
    };
};
/**
 * This class assists in gathering Symbols from Models and Members, and
 * makes them easier to query and use.
 */
export declare class SymbolTable {
    private cache;
    constructor();
    getModelSymbols<T>(modelId: string): T | undefined;
    getMemberSymbols<T>(modelId: string, memberId: string): T | undefined;
    collect(stack: IStack, map: SymbolValueMap): Promise<void>;
    /**
     * Collects the Symbol data in a Symbol Collection
     *
     * @param symbols Symbol collection
     * @param prefix The prefix of the symbols to collect
     * @param map Map of default values, where the keys match the name field keys, minus the prefix
     * @param context Context that is used when creating dynamic values
     */
    private collectSymbols;
}
