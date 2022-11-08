import { IMember, MemberValue } from "../Member";
import { IModel, ModelCreateParams } from '../Model';
import { IStackContext } from "../stack/StackContext";
import { IUidKeeper } from "../UidKeeper";
import { PredicateHandler, VisitHandler } from "./Handlers";
export interface IMemberCollection {
    readonly model: IModel;
    [Symbol.iterator](): Iterator<IMember>;
    add(name: string, value: MemberValue): Promise<void>;
    append(obj: ModelCreateParams): Promise<void>;
    delete(name: string): Promise<void>;
    find(predicate: PredicateHandler<IMember>): IMember | undefined;
    /**
     * Maps the Members into another structure
     *
     * @param visit Handler used to transform each Field
     */
    map<T>(visit: VisitHandler<IMember, T>): T[];
    get(name: string): IMember | undefined;
}
export declare class NoOpMemberCollection implements IMemberCollection {
    model: IModel;
    constructor();
    add(name: string, value: MemberValue): Promise<void>;
    append(obj: ModelCreateParams): Promise<void>;
    delete(name: string): Promise<void>;
    find(predicate: PredicateHandler<IMember>): IMember | undefined;
    map<T>(visit: VisitHandler<IMember, T>): T[];
    get(name: string): IMember | undefined;
    [Symbol.iterator](): Iterator<IMember, any, undefined>;
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
    find(predicate: PredicateHandler<IMember>): IMember | undefined;
    map<T>(visit: VisitHandler<IMember, T>): T[];
    get(name: string): IMember | undefined;
}
