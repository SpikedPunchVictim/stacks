import { ICache } from "../Cache";
import { IRequestForChangeSource } from "../events/RequestForChange";
import { IOrchestrator, Orchestrator } from "../orchestrator/Orchestrator";
import { IValueSerializer } from "../serialize/ValueSerializer";
import { IUidKeeper } from "../UidKeeper";
import { TypeSource } from "../values/TypeSource";
import { IValueSource, ValueSource } from "../values/ValueSource";
import { IStack } from "./Stack";

export interface IStackContext {
   readonly stack: IStack
   readonly rfc: IRequestForChangeSource
   readonly cache: ICache
   readonly uid: IUidKeeper
   readonly orchestrator: IOrchestrator
   readonly type: TypeSource
   readonly value: IValueSource
   readonly serializer: IValueSerializer
}


export class StackContext implements IStackContext {
   readonly type: TypeSource
   readonly value: ValueSource
   readonly orchestrator: IOrchestrator

   constructor(
      readonly stack: IStack,
      readonly rfc: IRequestForChangeSource,
      readonly cache: ICache,
      readonly uid: IUidKeeper,
      readonly serializer: IValueSerializer
   ) {
      this.type = new TypeSource(this)
      this.value = new ValueSource(this)
      this.orchestrator = new Orchestrator(this)
   }
}