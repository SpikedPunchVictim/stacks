// import { IBondedObject } from "../BondedObject";
// import { IField } from "../Field";
// import { CreateTypeHandler, TypeSource } from "../values/TypeSource";


// export interface IFieldCollection {
//    readonly object: IBondedObject

//    [Symbol.iterator](): Iterator<IField>

//    get(name: string): IField | undefined
//    set(name: string, value: string | number | boolean | CreateTypeHandler): Promise<void>
// }

// export class FieldCollection implements IFieldCollection {
//    private fields: Array<IField> = new Array<IField>()

//    constructor(readonly obj: IBondedObject) {

//    }

//    [Symbol.iterator](): Iterator<IField> {
//       let index = 0
//       let self = this
//       return {
//          next(): IteratorResult<IField> {
//             return index == self.fields.length ?
//                { value: undefined, done: true } :
//                { value: self.fields[index++], done: false }
//          }
//       }
//    }

//    get(name: string): IField | undefined {
//       return this.fields.find(f => f.name === name)
//    }

//    async set(name: string, value: string | number | boolean | CreateTypeHandler): Promise<void> {
//       let field = this.fields.find(f => f.name === name)

//       if(field === undefined) {
//          throw new Error(`No Field with the name ${name} exists`)
//       }

//       field.type
//    }
// }