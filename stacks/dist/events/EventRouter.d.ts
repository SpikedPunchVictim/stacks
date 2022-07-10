import { EventSet, IEvent } from "./Event";
export declare type EventHandler<T extends IEvent> = (action: T) => Promise<void>;
export interface IEventRouter {
    on<T extends IEvent>(type: EventSet, handler: EventHandler<T>): void;
    raise(action: IEvent): Promise<void>;
}
export declare class EventRouter implements IEventRouter {
    private _handlerMap;
    constructor();
    on<T extends IEvent>(type: EventSet, handler: EventHandler<T>): void;
    raise(event: IEvent): Promise<void>;
    raiseAction(event: IEvent): Promise<void>;
    private monitor;
}
