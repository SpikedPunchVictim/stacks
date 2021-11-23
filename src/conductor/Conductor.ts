
export interface IConductor {
   modelCreate(name: string)
}

export class Conductor {
   // private async ensureUniqueId(id: string): Promise<void> {
   //    let found = await this.uidWarden.get(id)

   //    if(!found) {
   //       await this.uidWarden.register(id, obj)
   //    } else {
   //       // Ensure it's the same object
   //       let obj = await this.uidWarden.get(id)

   //       if(obj !== obj) {
   //          throw new DuplicateUidError(id, `Duplicate IDs have been detected when trying to create a new Object.`)
   //       }
   //    }
   // }
}