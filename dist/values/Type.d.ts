export declare enum TypeSet {
    Bool = "bool",
    Int = "int",
    List = "list",
    Object = "object",
    ObjectRef = "object-reference",
    String = "string",
    UInt = "uint"
}
/**
 * Tracks multiple errors in a Validation call
 */
export declare class ValidationReport {
    readonly results: ValidateResult[];
    get success(): boolean;
    constructor();
    addError(error: Error): void;
}
export declare type ValidateResult = {
    success: boolean;
    error?: Error;
};
export interface IType {
    readonly type: TypeSet;
    /**
     * Determines if another Type is equal
     *
     * @param other The value to test
     */
    equals(other: IType): boolean;
    /**
     * Validates a JS object matches the Type.
     *
     * Note: Validation is not performed when setting
     * the Value since we want that to remain synchronous.
     * We trust the developer to put the correct safeguards
     * in place in order for us to make the API easy to
     * work with. It allows us to use Proxies.
     *
     * @param obj The JS object to validate
     */
    validate<T>(obj: T): Promise<ValidateResult>;
}
export declare abstract class Type implements IType {
    readonly type: TypeSet;
    constructor(type: TypeSet);
    equals(other: IType): boolean;
    validate<T>(obj: T): Promise<ValidateResult>;
}
export declare abstract class BasicType<T> implements IType {
    readonly type: TypeSet;
    constructor(type: TypeSet);
    equals(other: IType): boolean;
    validate<T>(obj: T): Promise<ValidateResult>;
}
