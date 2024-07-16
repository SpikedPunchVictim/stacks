import { IEvent } from "./Event";
import { IEventRouter } from "./EventRouter";
export type RfcHandler = (event: IEvent, err?: Error) => Promise<void>;
export interface IRequestForChangeSource {
    create(action: IEvent): IRequestForChange;
}
export declare class RequestForChangeSource implements IRequestForChangeSource {
    readonly router: IEventRouter;
    constructor(router: IEventRouter);
    create(action: IEvent): IRequestForChange;
}
export interface IRequestForChange {
    commit(): Promise<void>;
    fulfill(handler: RfcHandler): IRequestForChange;
    reject(handler: RfcHandler): IRequestForChange;
}
export declare class RequestForChange implements IRequestForChange {
    readonly router: IEventRouter;
    readonly action: IEvent;
    private rejects;
    private fulfills;
    constructor(action: IEvent, router: IEventRouter);
    fulfill(handler: RfcHandler): IRequestForChange;
    reject(handler: RfcHandler): IRequestForChange;
    commit(): Promise<void>;
}
