import { IEventRouter } from "../events/EventRouter";
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
     * Determines if an id is already in use.
     *
     * @param id The id
     */
    hasId(id: string): Promise<boolean>;
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
    constructor(options?: StackOptions);
    static create(options?: StackOptions): IStack;
    bootstrap(): Promise<void>;
    use(plugin: IPlugin): Promise<void>;
    hasId(id: string): Promise<boolean>;
}
