import { IStack } from ".";
import { IEventRouter } from "..";
export interface IPlugin {
    readonly name: string;
    setup(stack: IStack, router: IEventRouter): Promise<void>;
}
