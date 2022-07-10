import { Stack } from "../stacks/src";

let stack = Stack.create()
let rest = StackRest.create(stack)

let User = await stack.create.model('user', { 
   name: ''
})

rest.get('/user', User)
rest.post('/user', User)
rest.put('/user', User)
rest.del('/user', User)
rest.patch('/user', User)

rest.get('/user', {
   model: User,
   minimal: async (ctx) => { },
   detailed: async (ctx) => { },
   props: [ 'name', 'size', 'color' ]
})

rest.get


rest.post('/user', {
   model: User
})

rest.post('/user', {
   handler: async (ctx) => {
      
   }
})

