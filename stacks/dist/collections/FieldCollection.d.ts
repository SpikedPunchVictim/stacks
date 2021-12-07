import { IField } from "../Field";
import { ValueCreateParams } from "../values/ValueSource";
/**
 * Each Property is one of the TyepSet enums
 */
export declare type FieldSwitchHandler = {
    [key: string]: (field: IField) => Promise<void>;
};
export interface IFieldCollection {
    [Symbol.iterator](): Iterator<IField>;
    /**
     * Utility method to process each Field based on their Type
     *
     * @param handler The Handler for the ValueSet types
     */
    switch(handler: FieldSwitchHandler): Promise<void>;
    get(name: string): IField | undefined;
    set(name: string, value: ValueCreateParams): Promise<void>;
}
export declare class FieldCollection implements IFieldCollection {
    private readonly fields;
    constructor(fields: IField[]);
    [Symbol.iterator](): Iterator<IField>;
    get(name: string): IField | undefined;
    set(name: string, value: ValueCreateParams): Promise<void>;
    switch(handler: FieldSwitchHandler): Promise<void>;
}
