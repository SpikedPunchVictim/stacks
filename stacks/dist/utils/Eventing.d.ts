import { EventEmitter } from "events";
export type EmitInfo = {
    source: EventEmitter | ICombinedEventEmitter;
    event: string;
    data: any;
};
export type AsyncEmitInfo = {
    event: string;
    data: any;
};
export type EventBusHandler = (data: any) => void;
export type AsyncEventBusHandler = (data: any) => Promise<void>;
/**
 * Emits events from multiple objects. It will emit the event for
 * an EventEmitter and ICombinedEventEmitter source.
 *
 * @param info The Event Info used to emit an event from multiple sources
 */
export declare function emit(info: EmitInfo[]): Promise<void>;
export declare function emitAsync(eventBus: IAsyncEventEmitter, info: AsyncEmitInfo[]): Promise<void>;
export interface IAsyncEventEmitter {
    emit(event: string, data: any): Promise<void>;
    on(event: string, handler: AsyncEventBusHandler): void;
    off(event: string, handler: AsyncEventBusHandler): void;
}
export interface ICombinedEventEmitter {
    sync: EventEmitter;
    async: IAsyncEventEmitter;
    /**
     * Emits an event to both sync and async emitters
     *
     * @param event The event to emit
     * @param data The data to pass to the handler
     */
    emit(event: string, data: any): Promise<void>;
    /**
     * Subscribes a handler to both sync and async emitters
     *
     * @param event The event to subscribe to
     * @param data The data to pass along with the event
     */
    on(event: string, syncHandler: EventBusHandler, asyncHandler: AsyncEventBusHandler): void;
    /**
     * Unsubscribes handlers from an event
     *
     * @param event The event to unsubscribe from
     * @param syncHandler The sync handler that was subscribed to the event
     * @param asyncHandler The async handler that was subscribed to the event
     */
    off(event: string, syncHandler: EventBusHandler, asyncHandler: AsyncEventBusHandler): void;
}
export declare class CombinedEventEmitter {
    readonly sync: EventEmitter;
    readonly async: IAsyncEventEmitter;
    constructor();
    static isCombinedEventEmitter(other: any): boolean;
    emit(event: string, data: any): Promise<void>;
    on(event: string, syncHandler: EventBusHandler, asyncHandler: AsyncEventBusHandler): void;
    off(event: string, syncHandler: EventBusHandler, asyncHandler: AsyncEventBusHandler): void;
}
export declare class AsyncEventEmitter implements IAsyncEventEmitter {
    private handlers;
    constructor();
    emit(event: string, data: any): Promise<void>;
    on(event: string, handler: AsyncEventBusHandler): void;
    off(event: string, handler: AsyncEventBusHandler): void;
    private getHandlers;
}
