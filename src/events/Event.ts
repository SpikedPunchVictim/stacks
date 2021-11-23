
export enum EventSet {
   CommitObject = 'commit-object',
   GetManyObjects = 'get-many-objects',
   GetObject = 'get-object',
   HasId = 'has-id',
   ObjectCreated = 'object-created',
   ObjectDeleted = 'object-deleted',
   ObjectUpdated = 'object-updated'
}

export enum EventState {
   Raised = 'raised',
   Rollback = 'rollback'
}

export enum ExistState {
   DoesNotExist = 0,
   Exists = 1,
   Unset = 2
}

export interface IEvent {
   readonly type: EventSet
   readonly state: EventState
}

export abstract class Event implements IEvent {
   get state(): EventState {
      return this._state
   }

   private _state: EventState = EventState.Raised

   constructor(readonly type: EventSet) {

   }

   rollback(): void {
      this._state = EventState.Rollback
   }
}