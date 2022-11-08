import { ExistState, Stack, StackObject } from '.'

async function main(): Promise<void> {
   let stack = Stack.create()

   type UserType = {
      name: string
      age: number
      money: number
      team: TeamType
   } & StackObject

   type TeamType = {
      name: string
      manager: string
   } & StackObject

   let ReferenceType = await stack.create.model('reference', {
      string: 'use me',
      items: [0, 1, 2, 3, 4]
   })

   let GG = await stack.create.model('gg', {
      name: {
         type: ({ string }) => string,
         value: '',
         symbols: [
            { name: 'no-re', value: { some: 'thing', is: -1, not: { anything: true } } }
         ]
      },
      int: -42,
      uint: ({ uint }) => uint(42),
      bool: false,
      list: [''],
      ref: ({ ref }) => ref(ReferenceType.name),
      string: 'Oh man!'
   })

   let ggs = new Array<StackObject>()

   for(let i = 0; i < 99; ++i) {
      let created = await GG.create()
      await GG.save(created)
      ggs.push(created)
   }

   let paged = await GG.getAll()

   console.dir(paged)

   let Team = await stack.create.model('team', {
      name: '',
      manager: 'mother'
   })

   let defaultTeam = await Team.create<TeamType>({
      name: 'default',
      manager: 'jefe'
   })

   let User = await stack.create.model('user', {
      name: '',
      age: 0,
      money: -100,
      team: ({ ref }) => ref('team', defaultTeam.id)
   })

   let chris = await User.create<UserType>({
      name: 'chris'
   })

   stack.update.object(User, chris, async (obj, state) => {
      if(state === ExistState.DoesNotExist) {
         return
      }

      obj!.age = 34
   })

   /*
      type StoreContext = {
         name: string      // The data store name (ie stacks:dynamo)
         version: string   // The data store version
         store: any
      }

      stack.setQuery(async (context: StoreContext) => {
         let query = new CustomQueryObject(context)
      })
   */

   console.dir(chris, { depth: null })
}

main()
   .then(() => {
      console.log(`Succeeded`)
      process.exit(0)
   })
   .catch(err => {
      console.error(`Failed`)
      console.error(`Reason:\n${err}\nStack:\n${err.stack}`)
      process.exit(1)
   })