import { IMemberCollection } from "./collections/MemberCollection";
import { IStackContext } from "./stack/StackContext";
import { ValidationReport } from "./values/Type";
import { CreateValueHandler, ValueCreateParams } from "./values/ValueSource";
import { StackObject } from "./StackObject";
import { MemberInfo } from "./Member";
/**
 * The parameters used to create an Object based on a Model.
 * The additional ObjectCreateParams on the type supports nested
 * values.
 */
export declare type ObjectCreateParams = {
    [key: string]: ValueCreateParams | ObjectCreateParams;
};
export declare type ModelCreateParams = {
    [key: string]: string | number | boolean | any[] | CreateValueHandler | MemberInfo;
};
export declare type SymbolEntry = {
    name: string;
    value: any;
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
     * Ssves the object to storage
     *
     * @param object The object to commit
     */
    save<T extends StackObject>(object: T): Promise<void>;
    /**
     * Creates a new Object based on this Model
     */
    create<T extends StackObject>(obj?: ObjectCreateParams): Promise<T>;
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
    private get serializer();
    readonly members: IMemberCollection;
    constructor(name: string, id: string, context: IStackContext);
    append(obj: ModelCreateParams): Promise<void>;
    save<T extends StackObject>(obj: T): Promise<void>;
    create<T extends StackObject>(obj?: ObjectCreateParams): Promise<T>;
    delete<T extends StackObject>(object: T): Promise<void>;
    get<T extends StackObject>(id: string): Promise<T | undefined>;
    getMany<T>(req?: PageRequest): Promise<PageResponse<T>>;
    toJs<T>(): Promise<T>;
    validate<T>(obj: T): Promise<ValidationReport>;
}
