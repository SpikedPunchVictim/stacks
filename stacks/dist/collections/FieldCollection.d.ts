import { VisitHandler } from ".";
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
    /**
     * Gets a Field
     *
     * @param name The name of the Field
     */
    get(name: string): IField | undefined;
    /**
     * Maps the Fields into another structure
     *
     * @param visit Handler used to transform each Field
     */
    map<T>(visit: VisitHandler<IField>): void[];
    /**
     * Sets a Field's value
     *
     * @param name The name of the Field
     * @param value The value to set
     */
    set(name: string, value: ValueCreateParams): Promise<void>;
}
export declare class FieldCollection implements IFieldCollection {
    private readonly fields;
    constructor(fields: IField[]);
    [Symbol.iterator](): Iterator<IField>;
    get(name: string): IField | undefined;
    map<T>(visit: VisitHandler<IField>): void[];
    set(name: string, value: ValueCreateParams): Promise<void>;
    switch(handler: FieldSwitchHandler): Promise<void>;
}
