
export enum EventSet {
   Bootstrap = 'bootstrap',
   GetManyObjects = 'get-many-objects',
   GetModel = 'get-model',
   GetObject = 'get-object',
   HasId = 'has-id',
   ModelCreated = 'model-created',
   ModelDeleted = 'model-deleted',
   ModelUpdated = 'model-updated',
   ObjectCreated = 'object-created',
   ObjectDeleted = 'object-deleted',
   ObjectUpdated = 'object-updated',
   ObjectSaved = 'object-saved'
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