import {
   IModel,
   IStack,
   ObjectCreateParams,
   StackObject
} from '@spikedpunch/stacks'

import { 
   buildDetailedResponse,
   buildErrorResponse,
   buildMinimalResponse 
} from './Response'

import { Server } from 'http'
import Koa from 'koa'
import Router from '@koa/router'
import bodyparser from 'koa-bodyparser'

export type RestContext = {
   app: Koa
   router: Router
   stack: IStack
}

export interface IRestMiddleware {
   setup(context: RestContext): Promise<void>
}

export type RequestHandler = (ctx: Koa.Context, rest: RestContext, next: Koa.Next) => Promise<void>
export type ListenHandler = () => void

export type GetRequestOptions = {
   model?: IModel
   many?: RequestHandler | string[]
   single?: RequestHandler | string[]
}

export type PutRequestOptions = {
   model?: IModel
   handler?: RequestHandler
}

export type PostRequestOptions = {
   model?: IModel
   handler?: RequestHandler
}

export type DeleteRequestOptions = {
   model?: IModel
   handler?: RequestHandler
}

export class StacksRest {
   readonly app: Koa
   readonly router: Router
   readonly stack: IStack

   get restContext(): RestContext {
      return {
         app: this.app,
         router: this.router,
         stack: this.stack
      }
   }

   constructor(stack: IStack) {
      this.stack = stack
      this.app = new Koa()
      this.router = new Router()
   }

   async use(middleware: IRestMiddleware): Promise<void> {
      await middleware.setup(this.restContext)
   }

   /**
    * Defines a GET REST endpoint.
    * 
    * many { function | string[] }
    *    If many is a function, it defines the many handler (ctx) => Promise<void>
    *    If many is a string[], it defines the properties that will be returned from
    *    the reterieved object.
    * 
    * single { function | string[] }
    *    If single is a function, it handles the REST call that includes the 'id'.
    *    If single is a string[], it will be default behavior, but will only return 
    *    the properties in the string[].
    * 
    * model { IModel }
    *    The Model
    * 
    * 
    * 
    * @param urlPath The URL path
    * @param options The options for GET
    */
   get(urlPath: string, options: GetRequestOptions): void {
      options = options || {}
      options.model = options.model || undefined
      options.many = options.many || undefined
      options.single = options.single || undefined

      if (options.many === undefined &&
         options.single === undefined &&
         options.model === undefined) {
         throw new Error(`When defining the ${urlPath} GET endpoint, the 'model' or at least one of the 'detailed' or 'minimal' handlers must be defined.`)
      }

      if (typeof options.many === 'function') {
         this.router.get(urlPath, async (ctx: Koa.Context, next: Koa.Next) => {
            if (typeof options.many !== 'function') {
               throw new Error(`When defining the GET endpoint for ${urlPath}, the 'minimal' property is expected to be a RequestHandler.`)
            }

            await options.many(ctx, this.restContext, next)
         })
      } else {
         let props = new Array<string>()

         if (options.model == null || options.model === undefined) {
            throw new Error(`When defining the ${urlPath} GET endpoint, the Model must be provided`)
         }

         if (Array.isArray(options.many)) {
            props.push(...options.many)
         }

         this.router.get(urlPath, async (ctx: Koa.Context, next: Koa.Next) => {
            let model = options.model

            let query = ctx.request.query
            let cursor = query.page || ''
            let limit = query.limit || 100

            //@ts-ignore
            let results = await model.getMany<StackObject>({ cursor, limit })

            ctx.body = buildMinimalResponse(results.items, props)
            ctx.status = 200
         })
      }

      if (typeof options.single === 'function') {
         this.router.get(`${urlPath}/:id`, async (ctx: Koa.Context, next: Koa.Next) => {
            if (typeof options.single !== 'function') {
               throw new Error(`When defining the GET endpoint for ${urlPath}, the 'detailed' property is expected to be a RequestHandler.`)
            }

            await options.single(ctx, this.restContext, next)
         })
      } else {
         let props = new Array<string>()

         if (Array.isArray(options.single)) {
            if (options.model == null) {
               throw new Error(`When defining the ${urlPath} GET endpoint, when supplying a string Array for the 'detailed' property, the Model must be also be provided`)
            }

            props.push(...options.single)
         } else if(options.single == null) {
            // Default is to use the Model's properties
            //@ts-ignore
            for(let member of options.model?.members) {
               props.push(member.name)
            }
         }

         this.router.get(`${urlPath}/:id`, async (ctx: Koa.Context, next: Koa.Next) => {
            let model = options.model as IModel

            let id = ctx.params.id

            let result = await model.get<StackObject>(id)

            if(result === undefined) {
               ctx.status = 400
               ctx.body = { message: `No Object with id ${id} exists `}
               return
            }

            if (typeof options.single === 'function') {
               // Should never get here
               throw new Error(`When defining the ${urlPath} GET endoint, the 'detailed' property is expected to be a string Array, received a 'function' instead.`)
            }

            ctx.body = buildDetailedResponse(result, props)
            ctx.status = 200
         })
      }
   }

   /**
    * Defines a PUT endpoint
    * 
    * @param urlPath The URL path
    * @param options The options that define the endpoint
    */
   put(urlPath: string, options: PutRequestOptions): void {
      options = options || {}
      options.model = options.model || undefined
      options.handler = options.handler || undefined

      if(options.handler !== undefined) {
         this.router.put(urlPath, async (ctx: Koa.Context, next: Koa.Next) => {
            if(options.handler === undefined) {
               throw new Error(`When defining the ${urlPath} PUT endoint, the 'handler' property is expected to be a function, received a 'undefined' instead.`)
            }
            
            await options.handler(ctx, this.restContext, next)
         })
      } else {
         if(options.model == null) {
            throw new Error(`When defining the ${urlPath} PUT request, the 'model' property is expected when a 'handler' function is not provided.`)
         }

         this.router.put(`${urlPath}/:id`, async (ctx: Koa.Context) => {
            let body = ctx.request.body

            if (!body) {
               ctx.throw(400, `A body must be provided`)
               return
            }

            let id = ctx.params.id
            let model = options.model as IModel

            let obj = await model.get(id)

            if(obj === undefined) {
               ctx.throw(400, { message: `No Object with id ${id} exists `})
               return
            }

            for(let prop of Object.keys(body)) {
               obj[prop] = body[prop]
            }

            let valid = await model.validate(obj)

            if(!valid.success) {
               let errors = new Array<Error>()
               for(let result of valid.results) {
                  if(result.success == false && result.error != null) {
                     errors.push(result.error)
                  }
               }

               ctx.throw(400, buildErrorResponse(errors))
               return                 
            }

            await model.save(obj)

            let props = new Array<string>()

            for(let member of model.members) {
               props.push(member.name)
            }

            ctx.body = buildDetailedResponse(obj, props)
            ctx.status = 200
         })
      }
   }

   post(urlPath: string, options: PostRequestOptions): void {
      options = options || {}
      options.model = options.model || undefined
      options.handler = options.handler || undefined

      if(options.handler !== undefined) {
         this.router.post(urlPath, async (ctx: Koa.Context, next: Koa.Next) => {
            if(options.handler != null) {
               await options.handler(ctx, this.restContext, next)
            }
         })

         return
      }

      if(options.model === undefined) {
         throw new Error(`When defining the POST ${urlPath} endpoint, 'model' must be defined if a handler isn't provided`)
      }

      this.router.post(urlPath, async (ctx: Koa.Context, next: Koa.Next) => {
         let model = options.model as IModel
         let body = ctx.request.body

         if (!body) {
            ctx.throw(400, `A body must be provided`)
            return
         }

         let obj = await model.create(body as ObjectCreateParams)
         await model.save(obj)

         ctx.body = buildDetailedResponse(obj)
         ctx.status = 200
      })
   }

   del(urlPath: string, options: DeleteRequestOptions): void {
      options = options || {}
      options.model = options.model || undefined
      options.handler = options.handler || undefined

      if(options.handler !== undefined) {
         this.router.delete(urlPath, async (ctx: Koa.Context, next: Koa.Next) => {
            if(options.handler != null) {
               await options.handler(ctx, this.restContext, next)
            }
         })

         return
      }

      if(options.model === undefined) {
         throw new Error(`When defining the DELETE ${urlPath} endpoint, 'model' must be defined if a handler isn't provided`)
      }

      this.router.delete(`${urlPath}/:id`, async (ctx: Koa.Context, next: Koa.Next) => {
         let model = options.model as IModel
         let id = ctx.params.id

         let obj = await model.get(id)

         if(obj === undefined) {
            ctx.status = 200
            ctx.body = undefined
            return
         }

         await model.delete(obj)

         ctx.status = 200
         ctx.body = buildDetailedResponse(obj)
      })
   }

   listen(port: number = 3401, handler: ListenHandler = () => {}): Server {
      this.app
         .use(bodyparser())
         .use(this.router.routes())
         .use(this.router.allowedMethods())

      this.app.use(async (ctx: Koa.Context) => {
         // the parsed body will store in ctx.request.body
         // if nothing was parsed, body will be an empty object {}
         ctx.body = ctx.request.body
      })

      return this.app.listen(port, () => {
         handler()
      })
   }
}