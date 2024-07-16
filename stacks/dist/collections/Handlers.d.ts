export type VisitHandler<T, TResult> = (value: T, index: number, array: Array<T>) => TResult;
export type PredicateHandler<T> = (value: T, index: number, array: Array<T>) => boolean;
