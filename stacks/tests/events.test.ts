
/*
export enum EventSet {
   GetManyObjects = 'get-many-objects',
   GetObject = 'get-object',
   HasId = 'has-id',
   ObjectCreated = 'object-created',
   ObjectDeleted = 'object-deleted',
   ObjectUpdated = 'object-updated',
   SaveObject = 'commit-object'
}
*/

import { EventSet } from "../src/events/Event"
import { createScenario, TestScenario } from "./Utils"

type EventTest = {
   event: EventSet
   run: (scenario: TestScenario) => Promise<void>
}

let tests: EventTest[] = [
   {
      event: EventSet.GetManyObjects,
      run: async ({ stack, model }) => {
         await model.getMany()
      }
   },
   {
      event: EventSet.GetObject,
      run: async ({ model, objects }) => {
         await model.get(objects[0].id)
      }
   },
   {
      event: EventSet.HasId,
      run: async ({ stack }) => {
         await stack.hasId('0')
      }
   },
   {
      event: EventSet.ObjectCreated,
      run: async ({ model }) => {
         await model.create()
      }
   },
   {
      event: EventSet.ObjectDeleted,
      run: async ({ model, objects }) => {
         await model.delete(objects[0])
      }
   },
   {
      event: EventSet.SaveObject,
      run: async ({ model, objects }) => {
         await model.save(objects[0])
      }
   }
]

describe(`# Events`, () => {
   for(let eventTest of tests) {
      test(`# ${eventTest.event}`, async () => {
         let scenario = await createScenario()

         let mock = jest.fn()
         scenario.stack.on(eventTest.event, mock, mock)
         await eventTest.run(scenario)   
         expect(mock).toHaveBeenCalled()
      })
   }
})