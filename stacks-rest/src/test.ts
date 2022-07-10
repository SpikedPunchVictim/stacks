import { Stack } from '@spikedpunch/stacks'
import { StacksRest } from './Rest'
//import got from 'got'
//import got from 'got'

async function main(): Promise<void> {

   await new Promise(async (resolve, reject) => {
      let stack = Stack.create()
      let rest = new StacksRest(stack)
   
      // type UserType = {
      //    name: string
      //    age: number
      //    money: number
      // } & StackObject
   
      // type TeamType = {
      //    name: string
      //    manager: string
      // } & StackObject
   
      let Team = await stack.create.model('team', {
         name: '',
         manager: 'dave'
      })
   
      let ReferenceType = await stack.create.model('reference', {
         string: 'use me',
         items: [0, 1, 2, 3, 4],
         ref: ({ ref }) => ref(Team.name)
      })
   
      let GG = await stack.create.model('gg', {
         id: '',
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

      for(let i = 0; i < 100; ++i) {
         let temp = await GG.create()
         await GG.save(temp)
      }
   
      //-- Default
      rest.get('/user', { model: GG, many: ['name', 'int'] })
      rest.put('/user', { model: GG })
      rest.post('/user', { model: GG })
      rest.del('/user', { model: GG })
   
      let server = rest.listen(4200, () => console.log(`Server up on port 4200`))
   
      server.on('close', resolve)  
   })


   // let res = await got("http://localhost:4200/user")
   // console.dir(res)
}

main()
   .then(() => {
      console.log(`Succeeded`)
      //process.exit(0)
   })
   .catch(err => {
      console.error(`Failed`)
      console.error(`Reason:\n${err}\nStack:\n${err.stack}`)
      process.exit(1)
   })