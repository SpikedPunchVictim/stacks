import { Stack, StackObject } from '.'

async function main(): Promise<void> {
   let stack = Stack.create()

   type UserType = {
      nme: string
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

   let ggs = []
   for(let i = 0; i < 1000; ++i) {
      ggs.push(await GG.create())
   }

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