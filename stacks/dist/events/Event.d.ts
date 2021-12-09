export declare enum EventSet {
    GetManyObjects = "get-many-objects",
    GetObject = "get-object",
    HasId = "has-id",
    ObjectCreated = "object-created",
    ObjectDeleted = "object-deleted",
    ObjectUpdated = "object-updated",
    SaveObject = "commit-object"
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
