import { IMember, Member, MemberValue } from "../Member";
import { IModel, Model, ModelCreateParams } from '../Model'
import { IStackContext } from "../stack/StackContext";
import { IUidKeeper } from "../UidKeeper";
import { PredicateHandler, VisitHandler } from "./Handlers";

export interface IMemberCollection {
   readonly model: IModel
   readonly length: number

   [Symbol.iterator](): Iterator<IMember>

   add(name: string, value: MemberValue): Promise<void>
   append(obj: ModelCreateParams): Promise<void>
   delete(name: string): Promise<void>
   find(predicate: PredicateHandler<IMember>): IMember | undefined

   /**
    * Maps the Members into another structure
    * 
    * @param visit Handler used to transform each Field
    */
   map<T>(visit: VisitHandler<IMember, T>): T[]

   get(name: string): IMember | undefined
}

export class NoOpMemberCollection implements IMemberCollection {
   model: IModel;

   get length(): number {
      throw new Error("Method not implemented.");
   }

   constructor() {
      this.model = Model.NoOp
   }
   
   add(name: string, value: MemberValue): Promise<void> {
      throw new Error("Method not implemented.");
   }
   append(obj: ModelCreateParams): Promise<void> {
      throw new Error("Method not implemented.");
   }
   delete(name: string): Promise<void> {
      throw new Error("Method not implemented.");
   }
   find(predicate: PredicateHandler<IMember>): IMember | undefined {
      throw new Error("Method not implemented.");
   }
   map<T>(visit: VisitHandler<IMember, T>): T[] {
      throw new Error("Method not implemented.");
   }
   get(name: string): IMember | undefined {
      throw new Error("Method not implemented.");
   }
   [Symbol.iterator](): Iterator<IMember, any, undefined> {
      throw new Error("Method not implemented.");
   }
   
}

export class MemberCollection implements IMemberCollection {
   readonly model: IModel
   readonly context: IStackContext

   get length(): number {
      return this.members.length
   }

   get uid(): IUidKeeper {
      return this.context.uid
   }

   private members: IMember[]

   constructor(model: IModel, context: IStackContext) {
      this.model = model
      this.context = context
      this.members = new Array<IMember>()
   }

   [Symbol.iterator](): Iterator<IMember> {
      let index = 0
      let self = this
      return {
         next(): IteratorResult<IMember> {
            return index == self.members.length ?
               { value: undefined, done: true } :
               { value: self.members[index++], done: false }
         }
      }
   }

   async add(name: string, value: MemberValue): Promise<void> {
      let found = this.members.find(m => m.name === name)

      let member = Member.create({ [name]: value }, this.model, { model: this.model }, this.context)

      if (found !== undefined) {
         found.value = member[0].value
         return
      }

      this.members.push(...member)
   }

   async append(obj: ModelCreateParams): Promise<void> {
      let members = Member.create(obj, this.model, { model: this.model }, this.context)

      for (let member of members) {
         let found = this.members.find(m => m.name === member.name)

         // Replace an existing Member if the Types match
         if (found !== undefined) {
            found.value = member.value
            continue
         }

         this.members.push(member)
      }
   }

   async delete(name: string): Promise<void> {
      let found = this.members.findIndex(m => m.name === name)

      if (found) {
         this.members.splice(found, 1)
      }
   }

   find(predicate: PredicateHandler<IMember>): IMember | undefined {
      return this.members.find(predicate)
   }

   map<T>(visit: VisitHandler<IMember, T>): T[] {
      return this.members.map(visit)
   }

   get(name: string): IMember | undefined {
      return this.members.find(m => m.name === name)
   }
}