import { IType } from "./values/Type";
export interface IField {
    readonly name: string;
    readonly type: IType;
}
export declare class Field implements IField {
    readonly name: string;
    readonly type: IType;
    constructor(name: string, type: IType);
}
