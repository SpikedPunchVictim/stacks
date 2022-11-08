import { IEventRouter } from "../events/EventRouter";
import { IModel } from "../Model";
import { IValueSerializer } from "../serialize/ValueSerializer";
import { IUidKeeper } from "../UidKeeper";
import { CombinedEventEmitter, ICombinedEventEmitter } from "../utils/Eventing";
import { IPlugin } from "./Plugin";
import { IStackCreate } from "./StackCreate";
import { IStackDelete } from "./StackDelete";
import { IStackGet } from "./StackGet";
import { IStackUpdate } from "./StackUpdate";
export declare type StackOptions = {
    uidKeeper?: IUidKeeper;
};
export declare type StoreContext = {
    name: string;
    version: string;
    store: any;
};
export declare type ApplyStoreContextHandler<T> = (contexts: StoreContext[]) => Promise<T>;
export interface IStack extends ICombinedEventEmitter {
    readonly create: IStackCreate;
    readonly delete: IStackDelete;
    readonly get: IStackGet;
    readonly update: IStackUpdate;
    readonly serializer: IValueSerializer;
    readonly router: IEventRouter;
    /**
     * Called after all Models have been defined. Calling
     * this method is optional, but provides a hook for
     * Plugins that require initialization.
     */
    bootstrap(): Promise<void>;
    /**
     * Gets the Query object that has been set.
     */
    getQueryObject<T>(): T | undefined;
    /**
     * Determines if an id is already in use.
     *
     * @param id The id
     * @param model The associated Model
     */
    hasId(id: string, model: IModel): Promise<boolean>;
    /**
     * Sets a custom Query object that can be used throughout an application,
     * that extends the functionality that's built into Stacks.
     *
     * @param query The custom Query Object
     */
    setQueryObject<T>(handler: ApplyStoreContextHandler<T>): Promise<void>;
    /**
     * Adds a Plugin to the Stack
     *
     * @param plugin The Plugin to use
     */
    use(plugin: IPlugin): Promise<void>;
}
export declare class Stack extends CombinedEventEmitter implements IStack {
    readonly get: IStackGet;
    readonly create: IStackCreate;
    readonly update: IStackUpdate;
    readonly delete: IStackDelete;
    readonly uid: IUidKeeper;
    readonly serializer: IValueSerializer;
    readonly router: IEventRouter;
    private rfc;
    private context;
    private cache;
    private queryObject;
    constructor(options?: StackOptions);
    static create(options?: StackOptions): IStack;
    bootstrap(): Promise<void>;
    getQueryObject<T>(): T | undefined;
    hasId(id: string, model: IModel): Promise<boolean>;
    setQueryObject<T>(handler: ApplyStoreContextHandler<T>): Promise<void>;
    use(plugin: IPlugin): Promise<void>;
}
