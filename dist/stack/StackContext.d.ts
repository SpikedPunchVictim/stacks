import { ICache } from "../Cache";
import { IRequestForChangeSource } from "../events/RequestForChange";
import { IOrchestrator } from "../orchestrator/Orchestrator";
import { IUidKeeper } from "../UidKeeper";
import { TypeSource } from "../values/TypeSource";
import { IValueSource, ValueSource } from "../values/ValueSource";
import { IStack } from "./Stack";
export interface IStackContext {
    readonly stack: IStack;
    readonly rfc: IRequestForChangeSource;
    readonly cache: ICache;
    readonly uid: IUidKeeper;
    readonly orchestrator: IOrchestrator;
    readonly type: TypeSource;
    readonly value: IValueSource;
}
export declare class StackContext implements IStackContext {
    readonly stack: IStack;
    readonly rfc: IRequestForChangeSource;
    readonly cache: ICache;
    readonly uid: IUidKeeper;
    readonly type: TypeSource;
    readonly value: ValueSource;
    readonly orchestrator: IOrchestrator;
    constructor(stack: IStack, rfc: IRequestForChangeSource, cache: ICache, uid: IUidKeeper);
}
