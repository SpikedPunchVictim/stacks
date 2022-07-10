import { IFieldCollection } from "./collections/FieldCollection";
import { IModel, ObjectCreateParams } from "./Model";
import { IValueSerializer } from "./serialize/ValueSerializer";
import { IStackContext } from "./stack/StackContext";
import { StackObject } from "./StackObject";
/**
 * The SerializedObject stores the data between the backend and the frontend.
 * It stores the meta data necessary to tie the objects used outside the API
 * to their backend counterparts.
 *
 * Serialized:
 * The object representing what is stored in the backend
 *
 * Deserialized:
 * The object used in the front end. The focus is to stay as close
 * to raw JS objects as possible.
 */
export interface IProxyObject {
    readonly id: string;
    readonly fields: IFieldCollection;
    /**
     * Converts the Proxy Object into a Javascript Object
     */
    toJs<T extends StackObject>(): T;
}
export declare class ProxyObject implements IProxyObject {
    readonly model: IModel;
    readonly fields: IFieldCollection;
    get id(): string;
    private _id;
    private constructor();
    static fromModel<T extends StackObject>(model: IModel, context: IStackContext): Promise<T>;
    /**
     * This converts a Serialized Object (typically from the data store), and converts
     * it into a ProxyObject that the caller can interact with.
     *
     * @param model The Model
     * @param serialized Raw serialized data that has been stored
     * @param serializer The Serializer used to deserialized the serialized raw data
     * @returns ProxyObject
     */
    static fromStored(model: IModel, serialized: any, serializer: IValueSerializer): Promise<IProxyObject>;
    /**
     * Creates a Proxy Object when an Object is being created in-memory (before being saved)
     *
     * @param model The Model
     * @param obj The object being created
     * @param context The StackContext
     * @returns
     */
    static fromCreated<T extends StackObject>(model: IModel, obj: ObjectCreateParams, context: IStackContext): Promise<T>;
    static unwrap(serialized: IProxyObject): IProxyObject;
    toJs<T extends StackObject>(): T;
    private static buildNestedEditObject;
    internaleSetId(id: string): void;
}
