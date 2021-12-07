import { Event } from "./Event";
export declare class HasIdEvent extends Event {
    readonly id: string;
    get attemptedSet(): boolean;
    get hasId(): boolean;
    set hasId(value: boolean);
    private _hasId;
    private _attemptedSet;
    constructor(id: string);
}
