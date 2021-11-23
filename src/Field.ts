import { IType } from "./values/Type";


export interface IField {
   readonly name: string
   readonly type: IType
}

export class Field implements IField {
   readonly name: string
   readonly type: IType

   constructor(name: string, type: IType) {
      this.name = name
      this.type = type
   }
}