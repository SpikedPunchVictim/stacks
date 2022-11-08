export declare enum EventSet {
    Bootstrap = "bootstrap",
    GetManyObjects = "get-many-objects",
    GetModel = "get-model",
    GetObject = "get-object",
    GetStoreContext = "get-store-context",
    HasId = "has-id",
    ModelCreated = "model-created",
    ModelDeleted = "model-deleted",
    ModelUpdated = "model-updated",
    ObjectCreated = "object-created",
    ObjectDeleted = "object-deleted",
    ObjectUpdated = "object-updated",
    ObjectSaved = "object-saved"
}
export declare enum EventState {
    Raised = "raised",
    Rollback = "rollback"
}
export declare enum ExistState {
    DoesNotExist = 0,
    Exists = 1,
    Unset = 2
}
export interface IEvent {
    readonly type: EventSet;
    readonly state: EventState;
}
export declare abstract class Event implements IEvent {
    readonly type: EventSet;
    get state(): EventState;
    private _state;
    constructor(type: EventSet);
    rollback(): void;
}
