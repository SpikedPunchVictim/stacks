# stacks-test

This module provides a suite of tests to help test stacks `Plugins` during development.

# Example

```js
import { TestSuite } from '@spikedpunch/stacks-test'
import { PostgresPlugin } from '../src'


async function main() {
   // Create a TestSuite
   let suite = await TestSuite.create({
      // Pass in the plugin you're developing
      plugin: new PostgresPlugin({
         database: 'stacks',
         host: 'localhost',
         port: 5432,
         user: 'admin',
         password: 'admin'
      },
      // Optional hooks that run during the lifecycle of a test
      hooks: {
         beforeAll: async () => void,  // Called before all tests are run
         beforeTest: async () => void, // Called before every test
         afterTest: async () => void,  // Called after every test
         afterAll: async () => void    // Called after all etsts have finished
      })
   })

   // Add any tests you want. Tests are broken out individually
   // to help you test as you develop.
   suite = suite.addAllTests()

   // Run tests
   await suite.run()
}

main()
   .catch(err => {
      console.error(`Failed. Reason: ${err}`)
      process.exit(1)
   })
```

# Hooks

```js
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
```