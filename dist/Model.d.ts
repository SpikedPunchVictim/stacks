import { IMemberCollection } from "./collections/MemberCollection";
import { IStackContext } from "./stack/StackContext";
import { IType, ValidationReport } from "./values/Type";
import { CreateValueHandler } from "./values/ValueSource";
import { CreateTypeHandler } from "./values/TypeSource";
import { MemberValue } from "./Member";
import { StackObject } from ".";
export declare type ObjectCreateParams = {
    [key: string]: boolean | number | string | CreateValueHandler;
};
export declare type ModelCreateParams = {
    [key: string]: string | number | boolean | CreateValueHandler | ModelProperty;
};
export declare type ModelCreateContext = {
    model: IModel;
};
export declare type SymbolEntry = {
    name: string;
    value: any;
};
export declare type ModelProperty = {
    type: IType | CreateTypeHandler;
    value: MemberValue;
    symbols: SymbolEntry[];
};
export declare type PageResponse<T> = {
    cursor: string;
    items: T[];
};
export declare type PageRequest = {
    cursor?: string;
    limit?: number;
};
export interface IModel {
    readonly id: string;
    readonly name: string;
    readonly members: IMemberCollection;
    /**
     * Appends additional Members to the Model
     *
     * @param obj The additional members to add
     */
    append(obj: ModelCreateParams): Promise<void>;
    /**
     * Commits the object to storage
     *
     * @param object The object to commit
     */
    commit<T extends StackObject>(object: T): Promise<void>;
    /**
     * Creates a new Object based on this Model
     */
    create<T>(obj: ObjectCreateParams): Promise<T>;
    /**
     * Deletes an object derived from this Model
     *
     * @param object The object to delete
     */
    delete<T extends StackObject>(object: T): Promise<void>;
    /**
     * Retrieves an instance by ID
     *
     * @param id The ID of the instance
     */
    get<T extends StackObject>(id: string): Promise<T | undefined>;
    /**
     * Gets many Objects
     *
     * @param req The PagedRequest
     */
    getMany<T>(req?: PageRequest): Promise<PageResponse<T>>;
    /**
     * Converts the Model into a JS object
     */
    toJs<T>(): Promise<T>;
    /**
     * Validates an Object against the Model's schema
     *
     * @param obj The Object to validate
     */
    validate<T>(obj: T): Promise<ValidationReport>;
}
export declare class Model implements IModel {
    readonly id: string;
    readonly name: string;
    readonly context: IStackContext;
    private get orchestrator();
    readonly members: IMemberCollection;
    constructor(name: string, id: string, context: IStackContext);
    append(obj: ModelCreateParams): Promise<void>;
    commit<T extends StackObject>(obj: T): Promise<void>;
    create<T>(obj: ObjectCreateParams): Promise<T>;
    delete<T extends StackObject>(object: T): Promise<void>;
    get<T extends StackObject>(id: string): Promise<T | undefined>;
    getMany<T>(req?: PageRequest): Promise<PageResponse<T>>;
    toJs<T>(): Promise<T>;
    validate<T>(obj: T): Promise<ValidationReport>;
}
