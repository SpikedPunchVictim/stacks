import { StackObject } from "../BondedObject";
import { ICache } from "../Cache";
import { IRequestForChangeSource } from "../events/RequestForChange";
import { IModel, PageRequest, PageResponse } from "../Model";
import { IStack } from "../stack/Stack";
import { IStackContext } from "../stack/StackContext";
import { UpdateObjectHandler } from "../stack/StackUpdate";
export interface IOrchestrator {
    commitObject<T extends StackObject>(model: IModel, obj: T): Promise<void>;
    createObject<T extends StackObject>(model: IModel, obj: T): Promise<void>;
    deleteObject<T extends StackObject>(model: IModel, obj: T): Promise<void>;
    /**
     * Retrieves many objects in a paged fashion.
     *
     * @param model The Model representing the Objects
     * @param options PageRequest Options
     */
    getManyObjects<T extends StackObject>(model: IModel, options: PageRequest): Promise<PageResponse<T>>;
    getObject<T extends StackObject>(model: IModel, id: string): Promise<T | undefined>;
    hasId(id: string): Promise<boolean>;
    updateObject<T extends StackObject>(model: IModel, obj: T, onUpdate: UpdateObjectHandler<T>): Promise<void>;
}
export declare class Orchestrator implements IOrchestrator {
    readonly context: IStackContext;
    get cache(): ICache;
    get rfc(): IRequestForChangeSource;
    get stack(): IStack;
    constructor(context: IStackContext);
    commitObject<T extends StackObject>(model: IModel, obj: T): Promise<void>;
    createObject<T extends StackObject>(model: IModel, obj: T): Promise<void>;
    getManyObjects<T extends StackObject>(model: IModel, options?: PageRequest): Promise<PageResponse<T>>;
    deleteObject<T extends StackObject>(model: IModel, obj: T): Promise<void>;
    getObject<T extends StackObject>(model: IModel, id: string): Promise<T | undefined>;
    hasId(id: string): Promise<boolean>;
    updateObject<T extends StackObject>(model: IModel, obj: T, onUpdate: UpdateObjectHandler<T>): Promise<void>;
}
