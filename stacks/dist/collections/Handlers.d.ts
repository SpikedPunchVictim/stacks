export declare type VisitHandler<T, TResult> = (value: T, index: number, array: Array<T>) => TResult;
export declare type PredicateHandler<T> = (value: T, index: number, array: Array<T>) => boolean;
