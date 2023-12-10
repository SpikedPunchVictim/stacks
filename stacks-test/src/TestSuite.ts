import { IModel, IPlugin, IStack, Stack } from "@spikedpunch/stacks"
import { AssertionError, expect } from "chai"

export type TestHandler = (scenario: TestScenario) => Promise<void>
export type HookHandler = () => Promise<void>

export type TestContext = {
   plugin?: IPlugin
   hooks?: {
      beforeAll?: HookHandler    // Called before all tests are run
      beforeTest?: HookHandler   // Called before every test
      afterTest?: HookHandler    // Called after every test
      afterAll?: HookHandler     // Called after all etsts have finished
   }
}

export type TestScenario = {
   stack: IStack
   models: IModel[]
   // plugins: IPlugin[]
}

type Test = {
   name: string
   handler: TestHandler
}

// type Depth0 = {
//    bool: boolean
//    int: number,
//    string: string
//    uint: number
//    list: string[]
// } & StackObject

const ObjDepth0 = {
   bool: true,
   int: -1,
   string: `I'm a string`,
   uint: 12,
   list: ['a', 'b', 'c']
}

export class TestSuite {
   private tests: Test[] = new Array<Test>()
   
   private constructor(readonly context: TestContext) {

   }

   static async create(context: TestContext): Promise<TestSuite> {
      return new TestSuite(context)
   }

   addAllTests(): TestSuite {
      return this.getModel()
         .getModelById()
         .getModels()
         .getObject()
         .createModel()
         .createObject()
         .doubleObjectSave()
   }

   /**
    * Create a custom Test against the provided TestContext
    * 
    * @param name The Name of the Test
    * @param handler The test to run
    * @returns 
    */
   custom(name: string, handler: TestHandler): TestSuite {
      this.test(name, handler)
      return this
   }

   /**
    * Creates and retrieves Models
    * @returns 
    */
   getModel(): TestSuite {
      this.test("Stack:Get | Model One by One", async ({ stack, models }) => {
         for(let model of models) {
            let mdl = await stack.get.model(model.name)
            expect(mdl).to.not.be.undefined
            this.validateModel(model, mdl!)
         }
      })

      return this
   }

   /**
    * Creates and retrieves Models by ID
    * @returns 
    */
   getModelById(): TestSuite {
      this.test("Stack: | Get Model By ID", async ({ stack, models }) => {
         for(let model of models) {
            let mdl = await stack.get.modelById(model.id)
            expect(mdl).to.not.be.undefined
            this.validateModel(model, mdl!)
         }
      })

      return this
   }

   /**
    * Creates and retrieves Models
    * @returns 
    */
   getModels(): TestSuite {
      this.test('Stack:Get | Models All at one time', async ({ stack, models }) => {
         let many = await stack.get.models()

         expect(many).to.have.lengthOf(models.length)
         
         for(let mdl of many) {
            let found = models.find(m => m.id === mdl.id)

            expect(found).to.not.be.undefined

            this.validateModel(found!, mdl)
         }
      })

      return this
   }

   /**
    * Creates a StackObject and retrieves it
    * @returns 
    */
   getObject(): TestSuite {
      this.test('Stack:Get | Object', async ({ stack, models }) => {
         expect(models.length).to.be.above(0)

         let obj = await stack.create.object(models[0].name, {})
         await models[0].save(obj)
       
         let ret = await stack.get.object(models[0].name, obj.id)

         expect(ret).to.not.be.undefined
      })

      return this
   }

   /**
    * Double saves an Object to ensure only one exists when retrieving
    * @returns 
    */
   doubleObjectSave(): TestSuite {
      this.test('Stack:Get | Object', async ({ stack, models }) => {
         expect(models.length).to.be.above(0)

         let model = models[0]

         let obj = await stack.create.object(model.name, {})
         await model.save(obj)
         await model.save(obj)
       
         let ret = await stack.get.object(model.name, obj.id)
         expect(ret).to.not.be.undefined

         let objects = await model.getAll()
         expect(objects).to.not.be.undefined
         expect(objects).to.have.lengthOf(1)
      })

      return this
   }

   /**
    * Creates a Model and ensures it exists (using the create() api)
    * @returns 
    */
   createModel(): TestSuite {
      this.test('Stack:Create | Model', async ({ stack, models }) => {
         let model = await stack.create.model('some-long-name', {
            bool: true,
            int: 42,
            str: `I'm a string`,
            array: ['']
         })

         expect(model).to.not.be.undefined
      })

      return this
   }

   createObject(): TestSuite {
      this.test('Stack:Create | Object', async ({ stack, models }) => {
         expect(models.length).to.be.above(0)
         let obj = await stack.create.object(models[0].name, {})
         expect(obj).to.not.be.undefined
      })

      return this
   }

   async run(): Promise<void> {
      if(this.context.hooks?.beforeAll) {
         await this.context.hooks.beforeAll()
      }

      for(let test of this.tests) {
         if(this.context.hooks?.beforeTest) {
            await this.context.hooks.beforeTest()
         }

         try {
            let scenario = await this.createScenario()
            await test.handler(scenario)
            console.log(`${test.name} passed`)
         } catch(e) {
            let err = e as AssertionError
            console.error(`${test.name} failed`)

            if(err.actual) {
               console.error(`     actual: ${err.actual!}`)
            }

            //@ts-ignore
            if(err.expected) {
               console.error(`   expected: ${err.expected!}`)
            }

            if(err.message) {
               console.error(`    message: ${err.message!}`)
            }

            if(err.stack) {
               console.error(`   Stack:\n\t${err.stack}`)
            }
         }

         if(this.context.hooks?.afterTest) {
            await this.context.hooks.afterTest()
         }
      }

      if(this.context.hooks?.afterAll) {
         await this.context.hooks.afterAll()
      }
   }

   private async createScenario(): Promise<TestScenario> {
      let stack = Stack.create()
      
      if(this.context.plugin) {
         await stack.use(this.context.plugin)
      }

      let models = new Array<IModel>()

      for(let i = 0; i < 5; ++i) {
         models.push(await stack.create.model(`${i}`, ObjDepth0))
      }

      await stack.bootstrap()

      return {
         stack,
         models
      }
   }

   private test(name: string, handler: TestHandler): void {
      this.tests.push({ name, handler })
   }

   /**
    * Validates that two Models are equal
    * 
    * @param primary The Primary Model
    * @param other The Other Model
    */
   private validateModel(primary: IModel, other: IModel): void {
      expect(primary.members.length).to.equal(other.members.length)

      for( let member of primary.members) {
         let pMember = primary.members.get(member.name)
         let oMember = other.members.get(member.name)

         expect(pMember).to.not.be.undefined
         expect(oMember).to.not.be.undefined

         expect(pMember!.value.equals(oMember!.value)).to.be.true
      }
   }
}