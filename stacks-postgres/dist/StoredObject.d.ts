import { IModel, StackObject } from "@spikedpunch/stacks";
import { PluginContext } from "./PluginContext";
export declare class StoredObject {
    readonly model: IModel;
    readonly obj: StackObject;
    readonly context: PluginContext;
    private constructor();
    static fromId(model: IModel, id: string, context: PluginContext): Promise<StoredObject | undefined>;
    static getOrCreate(model: IModel, obj: StackObject, context: PluginContext): Promise<StoredObject>;
    static create(model: IModel, obj: StackObject, context: PluginContext): StoredObject;
    static delete(model: IModel, id: string, context: PluginContext): Promise<void>;
    static update(model: IModel, obj: StackObject, context: PluginContext): Promise<void>;
    save(): Promise<void>;
    delete(): Promise<void>;
}
