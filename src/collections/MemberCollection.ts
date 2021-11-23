import { VisitHandler } from ".";
import { IMember, Member, MemberValue } from "../Member";
import { IModel, ModelCreateParams } from '../Model'
import { IStackContext } from "../stack/StackContext";
import { IUidKeeper } from "../UidKeeper";

export interface IMemberCollection {
   readonly model: IModel

   [Symbol.iterator](): Iterator<IMember>

   add(name: string, value: MemberValue): Promise<void>
   append(obj: ModelCreateParams): Promise<void>
   delete(name: string): Promise<void>
   find(predicate: VisitHandler<IMember>): IMember | undefined
   get(name: string): IMember | undefined
}

export class MemberCollection implements IMemberCollection {
   readonly model: IModel
   readonly context : IStackContext

   get uid(): IUidKeeper {
      return this.context.uid
   }

   private members: Array<IMember>
   
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

      let member = Member.create({ [name]: value }, { model: this.model }, this.context)

      if(found !== undefined) {
         found.value = member[0].value
         return
      }
      
      this.members.push(...member)
   }

   async append(obj: ModelCreateParams): Promise<void> {
      let members = Member.create(obj, { model: this.model }, this.context)
      
      for(let member of members) {
         let found = this.members.find(m => m.name === member.name)

         // Replace an existing Member if the Types match
         if(found !== undefined) {
            found.value = member.value
            continue
         }

         this.members.push(member)
      }
   }

   async delete(name: string): Promise<void> {
      let found = this.members.findIndex(m => m.name === name)

      if(found) {
         this.members.splice(found, 1)
      }
   }

   find(predicate: VisitHandler<IMember>): IMember | undefined {
      return this.members.find(predicate)
   } 

   get(name: string): IMember | undefined {
      return this.members.find(m => m.name === name)
   }
}