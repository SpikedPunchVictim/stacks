import { StackObject } from '@spikedpunch/stacks'

export type RestResponseMinimal = {
   id: string
}

export type RestResponseDetailed = {
   id: string
   [key: string]: any
}

export type RestErrorResponse = {
   message: string
}

export type RestSuccessResponse = {
   message: string
}

export function buildErrorResponse(errors: Error | Error[]): RestErrorResponse {
   if(!Array.isArray(errors)) {
      errors = [errors]
   }

   let message = errors.reduce((msg, error) => {
      msg.push(error.toString())
      return msg
   }, new Array<string>())

   return {
      message: message.join('\n')
   }
}

export function buildMinimalResponse(objects: StackObject[], props: string[] = new Array<string>()): RestResponseMinimal[] {
   return objects.map(obj => {
      let res: any = { id: obj.id }

      for (let prop of props) {
         res[prop] = obj[prop]
      }

      return res
   })
}

export function buildDetailedResponse(object: StackObject, props?: string[]): RestResponseDetailed {
   if (props == null) {
      props = new Array<string>()
      props.push(...Object.keys(object))
   }

   let response: RestResponseDetailed = {
      id: object.id
   }

   props.reduce((res, prop) => {
      res[prop] = object[prop]
      return res
   }, response)

   return response
}