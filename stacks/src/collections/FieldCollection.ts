import { VisitHandler } from ".";
import { IField } from "../Field";
import { ValueCreateParams } from "../values/ValueSource";

/**
 * Each Property is one of the TyepSet enums
 */
export type FieldSwitchHandler = {
   [key: string]: (field: IField) => Promise<void>
}


export interface IFieldCollection {
   [Symbol.iterator](): Iterator<IField>

   /**
    * Utility method to process each Field based on their Type
    * 
    * @param handler The Handler for the ValueSet types
    */
   switch(handler: FieldSwitchHandler): Promise<void>

   /**
    * Gets a Field
    * 
    * @param name The name of the Field
    */
   get(name: string): IField | undefined

   /**
    * Maps the Fields into another structure
    * 
    * @param visit Handler used to transform each Field
    */
   map<T>(visit: VisitHandler<IField>): void[]

   /**
    * Sets a Field's value
    * 
    * @param name The name of the Field
    * @param value The value to set
    */
   set(name: string, value: ValueCreateParams): Promise<void>
}

export class FieldCollection implements IFieldCollection {
   constructor(private readonly fields: IField[]) {

   }

   [Symbol.iterator](): Iterator<IField> {
      let index = 0
      let self = this
      return {
         next(): IteratorResult<IField> {
            return index == self.fields.length ?
               { value: undefined, done: true } :
               { value: self.fields[index++], done: false }
         }
      }
   }

   get(name: string): IField | undefined {
      return this.fields.find(f => f.name === name)
   }

   map<T>(visit: VisitHandler<IField>): void[] {
      return this.fields.map(visit)
   }

   async set(name: string, value: ValueCreateParams): Promise<void> {
      let field = this.fields.find(f => f.name === name)

      if(field === undefined) {
         throw new Error(`No Field with the name ${name} exists`)
      }

      field.value
   }

   async switch(handler: FieldSwitchHandler): Promise<void> {
      for(let field of this.fields) {
         let fn = handler[field.value.type.type]
         if(fn) {
            await fn(field)
         }
      }
   }
}