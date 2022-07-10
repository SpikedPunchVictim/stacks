import { IModel, ModelCreateParams } from "../Model";
import { UidKeeper } from "../UidKeeper";
import { Event, EventSet, ExistState } from "./Event";

export class GetModelEvent extends Event {
   readonly params: ModelCreateParams[] = new Array<ModelCreateParams>()

   /**
    * The serialized version of the Object
    */
   get model(): IModel | undefined {
      return this._model
   }

   set model(value: IModel | undefined) {
      if(value === undefined) {
         return
      }

      this._model = value
      this.exists = ExistState.Exists
   }

   get id(): string {
      return this._id
   }

   exists: ExistState = ExistState.Unset

   private _model: IModel | undefined = undefined
   private _id: string = UidKeeper.IdNotSet

   constructor(readonly name: string) {
      super(EventSet.GetModel)
   }

   setId(id: string): GetModelEvent {
      this._id = id
      return this
   }
}