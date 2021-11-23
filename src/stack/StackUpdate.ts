import { StackObject } from "..";
import { ExistState } from "../events/Event";
import { IModel } from "../Model";
import { IOrchestrator } from "../orchestrator/Orchestrator";
import { IStackContext } from "./StackContext";

export type UpdateObjectHandler<T extends StackObject> = (updated: T | undefined, exist: ExistState) => Promise<void>

export interface IStackUpdate {
   model(name: string): Promise<void>
   object<T extends StackObject>(model: IModel, object: T, onUpdate: UpdateObjectHandler<T>): Promise<void>
}

export class StackUpdate implements IStackUpdate {
   get orchestrator(): IOrchestrator {
      return this.context.orchestrator
   }

   constructor(readonly context: IStackContext) {

   }

   model(name: string): Promise<void> {
      // Allow updating Models? ATM No. The client should be authoritative over the Model
      throw new Error("Method not implemented.");
   }

   async object<T extends StackObject>(model: IModel, object: T, onUpdate: UpdateObjectHandler<T>): Promise<void> {
      await this.orchestrator.updateObject(model, object, onUpdate)
   }
}