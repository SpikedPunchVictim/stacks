import { StacksRest } from '../src/Rest'
import axios from 'axios'
import { IStack, Stack } from '@spikedpunch/stacks'

type RestTestHandler = (stack: IStack, rest: StacksRest, locals: any) => Promise<void>

const TestPort = 3401
const TestUrl = `http://localhost:${TestPort}`

// type FlatType = {
//    string: string
//    int: number
//    uint: number
//    list: any[]
// } & StackObject

let FlatTypeCreater = {
   string: 'flat',
   int: -90,
   uint: 90,
   list: [true, false, false, true]
}

// let FlatTypeValidater = {
//    string: 'flat',
//    int: -90,
//    uint: 90,
//    list: [true, false, false, true]
// }

async function restTest(description: string, setup: RestTestHandler, test: RestTestHandler): Promise<void> {
   it(description, async function () {
      let stack = Stack.create()
      let rest = new StacksRest(stack)
      let locals: any = {}

      await setup(stack, rest, locals)
      let server = rest.listen(TestPort)

      try {
         await test(stack, rest, locals)
      } finally {
         server.close()
      }
   })
}

/*
   TODO:
      * GET/PUT/POST/DEL nested Objects
      * GET custom handlers
*/

describe('Stacks routes test', function () {
   //---------------------------------------------------------------------
   // Objects
   //---------------------------------------------------------------------
   describe(`# Objects`, function () {
      restTest(
         `[GET] Many`,
         async (stack, rest) => {
            let model = await stack.create.model('objects', FlatTypeCreater)
            rest.get('/objects', { model: model })
         },
         async (stack, rest) => {
            let model = await stack.get.model('objects')
            let count = 3

            if (model === undefined) {
               expect(model).not.toBeUndefined()
               return
            }

            for (let i = 0; i < count; ++i) {
               let obj = await model.create()
               await model.save(obj)
            }

            let response = await get(`${TestUrl}/objects`)
            expect(response.data).toHaveLength(count)
         })

      restTest(
         `[GET] Many: Custom Handler`,
         async (stack, rest, locals) => {
            let model = await stack.create.model('objects', FlatTypeCreater)

            locals.handlerCalled = false

            rest.get('/objects', {
               model: model,
               many: async (ctx, next) => {
                  locals.handlerCalled = true
                  ctx.status = 200
                  ctx.body = 'Ok'
               }
            })
         },
         async (stack, rest, locals) => {
            let model = await stack.get.model('objects')

            if (model === undefined) {
               expect(model).not.toBeUndefined()
               return
            }

            await get(`${TestUrl}/objects`)
            expect(locals.handlerCalled).toBeTruthy()
         })

      restTest(
         `[GET] Single`,
         async (stack, rest) => {
            let model = await stack.create.model('test', FlatTypeCreater)
            rest.get('/objects', { model })
         },
         async (stack, rest) => {
            let model = await stack.get.model('test')

            if (model === undefined) {
               expect(model).not.toBeUndefined()
               return
            }

            let obj = await model.create()
            await model.save(obj)

            let response = await get(`${TestUrl}/objects`)
            let body = response.data

            expect(body).not.toBeUndefined()
            expect(Array.isArray(body)).toBeTruthy()

            expect(body).toHaveLength(1)

            //@ts-ignore
            let id = response.data[0].id

            response = await get(`${TestUrl}/objects/${id}`)
            body = response.data

            //@ts-ignore
            expect(body.id).toEqual(id)
         })

      restTest(
         `[GET] Single: Custom Handler`,
         async (stack, rest, locals) => {
            let model = await stack.create.model('objects', FlatTypeCreater)

            locals.handlerCalled = false

            rest.get('/objects', {
               model: model,
               single: async (ctx, next) => {
                  locals.handlerCalled = true
                  ctx.status = 200
                  ctx.body = 'Ok'
               }
            })
         },
         async (stack, rest, locals) => {
            let model = await stack.get.model('objects')

            if (model === undefined) {
               expect(model).not.toBeUndefined()
               return
            }

            for (let i = 0; i < 3; ++i) {
               let temp = await model.create()
               await model.save(temp)
            }

            let response = await get(`${TestUrl}/objects`)
            expect(response.data).toHaveLength(3)

            //@ts-ignore
            let id = response.data[0].id

            await get(`${TestUrl}/objects/${id}`)
            expect(locals.handlerCalled).toBeTruthy()
         })

      restTest(
         `[PUT] Update existing`,
         async (stack, rest) => {
            let model = await stack.create.model('test', FlatTypeCreater)
            rest.get('/objects', { model })
            rest.put('/objects', { model })
         },
         async (stack, rest) => {
            let model = await stack.get.model('test')

            if (model === undefined) {
               expect(model).not.toBeUndefined()
               return
            }

            let obj = await model.create()
            await model.save(obj)

            await put(`${TestUrl}/objects/${obj.id}`, {
               string: 'changed'
            })

            let res = await get(`${TestUrl}/objects/${obj.id}`)
            expect(res.data).toBeTruthy()
            expect(res.data.string).toEqual('changed')
         }
      )

      restTest(
         `[PUT] Custom Handler`,
         async (stack, rest, locals) => {
            locals.handlerCalled = false
            rest.put('/objects', {
               handler: (async (ctx, next) => {
                  locals.handlerCalled = true
                  ctx.status = 200
                  ctx.body = 'Ok'
               })
            })
         },
         async (stack, rest, locals) => {
            let model = await stack.create.model('test', FlatTypeCreater)

            let obj = await model.create()
            await model.save(obj)

            await put(`${TestUrl}/objects`, {
               string: 'changed'
            })

            expect(locals.handlerCalled).toBeTruthy()
         }
      )

      restTest(
         `[POST] Create New`,
         async (stack, rest) => {
            let model = await stack.create.model('test', FlatTypeCreater)
            rest.get('/objects', { model })
            rest.post('/objects', { model })
         },
         async (stack, rest) => {
            let model = await stack.get.model('test')

            if (model === undefined) {
               expect(model).not.toBeUndefined()
               return
            }

            let res = await post(`${TestUrl}/objects`, {
               string: `I'm new here!`
            })

            expect(res.data.id).toBeTruthy()

            res = await get(`${TestUrl}/objects/${res.data.id}`)
            expect(res.data).toBeTruthy()
            expect(res.data.string).toEqual(`I'm new here!`)
         }
      )

      restTest(
         `[POST] Custom Handler`,
         async (stack, rest, locals) => {
            locals.handlerCalled = false
            rest.post('/objects', {
               handler: (async (ctx, next) => {
                  locals.handlerCalled = true
                  ctx.status = 200
                  ctx.body = 'Ok'
               })
            })
         },
         async (stack, rest, locals) => {
            let model = await stack.create.model('test', FlatTypeCreater)

            if (model === undefined) {
               expect(model).not.toBeUndefined()
               return
            }

            await post(`${TestUrl}/objects`, {
               string: `I'm new here!`
            })

            expect(locals.handlerCalled).toBeTruthy()
         }
      )

      restTest(
         `[DELETE] Delete Object`,
         async (stack, rest) => {
            let model = await stack.create.model('test', FlatTypeCreater)
            rest.get('/objects', { model })
            rest.del('/objects', { model })
         },
         async (stack, rest) => {
            let model = await stack.get.model('test')

            if (model === undefined) {
               expect(model).not.toBeUndefined()
               return
            }

            let obj = await model.create()
            await model.save(obj)

            let res = await get(`${TestUrl}/objects/${obj.id}`)

            expect(res.status).toEqual(200)

            let delRes = await del(`${TestUrl}/objects/${obj.id}`)
            //@ts-ignore
            expect(delRes.data).toBeTruthy()

            let getRes = await get(`${TestUrl}/objects/${obj.id}`)
            expect(getRes.status).toEqual(400)
         }
      )

      // restTest(
      //    `[DELETE] Custom Handler`,
      //    async (stack, rest, locals) => {
      //       locals.handlerCalled = false
      //       rest.del('/objects', {
      //          handler: (async (ctx, next) => {
      //             locals.handlerCalled = true
      //             ctx.status = 200
      //             ctx.body = 'Ok'
      //          })
      //       })
      //    },
      //    async (stack, rest, locals) => {
      //       let model = await stack.create.model('test', FlatTypeCreater)

      //       if (model === undefined) {
      //          expect(model).not.toBeUndefined()
      //          return
      //       }

      //       await del(`${TestUrl}/objects`)

      //       expect(locals.handlerCalled).toBeTruthy()
      //    }
      // )
   })

})

async function get(urlPath) {
   try {
      return await axios.get(urlPath, {
         responseType: 'json'
      })
   } catch(err) {
      //@ts-ignore
      return err.response
   }
}

async function post(urlPath, body) {
   return await axios.post(urlPath, body, {
      responseType: 'json'
   })
}

async function put(urlPath, body) {
   return await axios.put(urlPath, body, {
      responseType: 'json'
   })
}

async function del(urlPath) {
   try {
      return await axios.delete(urlPath, {
         responseType: 'json'
      })
   } catch(err) {
      console.dir(err)
      return err
   }

}