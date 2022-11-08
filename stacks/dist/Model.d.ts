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
    readonly symbols: SymbolEntry[];
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
     * Gets all Objects based on a Model
     */
    getAll<T extends StackObject>(): Promise<T[]>;
    /**
     * Gets many Objects
     *
     * @param req The PagedRequest
     */
    getMany<T extends StackObject>(req?: PageRequest): Promise<PageResponse<T>>;
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
export declare class NoOpModel implements IModel {
    readonly id: string;
    readonly name: string;
    readonly members: IMemberCollection;
    readonly symbols: SymbolEntry[];
    constructor();
    append(obj: ModelCreateParams): Promise<void>;
    save<T extends StackObject>(object: T): Promise<void>;
    create<T extends StackObject>(obj?: ObjectCreateParams): Promise<T>;
    delete<T extends StackObject>(object: T): Promise<void>;
    get<T extends StackObject>(id: string): Promise<T | undefined>;
    getAll<T extends StackObject>(): Promise<T[]>;
    getMany<T extends StackObject>(req?: PageRequest): Promise<PageResponse<T>>;
    toJs<T>(): Promise<T>;
    validate<T>(obj: T): Promise<ValidationReport>;
}
export declare class Model implements IModel {
    get id(): string;
    readonly name: string;
    readonly context: IStackContext;
    readonly members: IMemberCollection;
    readonly symbols: SymbolEntry[];
    static get NoOp(): IModel;
    private get orchestrator();
    private get serializer();
    private static _noop;
    private _id;
    private constructor();
    static create(name: string, context: IStackContext): Promise<IModel>;
    static isModel(obj: any): boolean;
    /**
     * Determines if an Object is a Model. If it is, then it will return a
     * cast value of the Model, otherwise undefined.
     *
     * @param obj The Object to cast
     * @returns
     */
    static asModel(obj: any): IModel | undefined;
    append(obj: ModelCreateParams): Promise<void>;
    save<T extends StackObject>(obj: T): Promise<void>;
    create<T extends StackObject>(params?: ObjectCreateParams): Promise<T>;
    delete<T extends StackObject>(object: T): Promise<void>;
    get<T extends StackObject>(id: string): Promise<T | undefined>;
    getAll<T extends StackObject>(): Promise<T[]>;
    getMany<T extends StackObject>(req?: PageRequest): Promise<PageResponse<T>>;
    toJs<T>(): Promise<T>;
    validate<T>(obj: T): Promise<ValidationReport>;
    private setId;
}
