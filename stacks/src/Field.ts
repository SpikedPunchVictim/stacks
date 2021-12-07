import { IValue } from "./values/Value";


export interface IField {
   /**
    * The property name associated with this Field
    */
   readonly name: string

   /**
    * The underlying IValue
    */
   readonly value: IValue

   /**
    * The current editing object for this property.
    */
   edit: any
}

export class Field implements IField {
   readonly name: string
   readonly value: IValue
   edit: any

   constructor(name: string, value: IValue, edit: any) {
      this.name = name
      this.value = value
      this.edit = edit
   }
}