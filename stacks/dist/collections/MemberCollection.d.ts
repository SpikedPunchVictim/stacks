import { IMember, MemberValue } from "../Member";
import { IModel, ModelCreateParams } from '../Model';
import { IStackContext } from "../stack/StackContext";
import { IUidKeeper } from "../UidKeeper";
export declare type VisitHandler<T> = (value: T, index: number, array: Array<T>) => void;
export interface IMemberCollection {
    readonly model: IModel;
    [Symbol.iterator](): Iterator<IMember>;
    add(name: string, value: MemberValue): Promise<void>;
    append(obj: ModelCreateParams): Promise<void>;
    delete(name: string): Promise<void>;
    find(predicate: VisitHandler<IMember>): IMember | undefined;
    get(name: string): IMember | undefined;
}
export declare class MemberCollection implements IMemberCollection {
    readonly model: IModel;
    readonly context: IStackContext;
    get uid(): IUidKeeper;
    private members;
    constructor(model: IModel, context: IStackContext);
    [Symbol.iterator](): Iterator<IMember>;
    add(name: string, value: MemberValue): Promise<void>;
    append(obj: ModelCreateParams): Promise<void>;
    delete(name: string): Promise<void>;
    find(predicate: VisitHandler<IMember>): IMember | undefined;
    get(name: string): IMember | undefined;
}
