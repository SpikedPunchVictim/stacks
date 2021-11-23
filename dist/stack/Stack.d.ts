import { IUidKeeper } from "../UidKeeper";
import { CombinedEventEmitter, ICombinedEventEmitter } from "../utils/Eventing";
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
    /**
     * Determines if an id is already in use.
     *
     * @param id The id
     */
    hasId(id: string): Promise<boolean>;
}
export declare class Stack extends CombinedEventEmitter implements IStack {
    readonly get: IStackGet;
    readonly create: IStackCreate;
    readonly update: IStackUpdate;
    readonly delete: IStackDelete;
    readonly uid: IUidKeeper;
    private rfc;
    private router;
    private context;
    private cache;
    constructor(options?: StackOptions);
    static create(options?: StackOptions): IStack;
    hasId(id: string): Promise<boolean>;
}
