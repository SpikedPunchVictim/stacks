import { TestSuite } from '@spikedpunch/stacks-test'
import { PostgresPlugin } from '../src'


async function main() {
   let dbname = 'stacks_test'

   let postgres = new PostgresPlugin({
      database: dbname,
      host: 'localhost',
      port: 5432,
      user: 'admin',
      password: 'admin'
   })

   let suite = await TestSuite.create({
      plugin: postgres,
      hooks: {
         beforeAll: async () => {
            await postgres.dropDb(dbname)
         },
         afterTest: async () => {
            await postgres.dropDb(dbname)
         }
      }
   })

   suite = suite.addAllTests()

   await suite.run()
}

main()
   .catch(err => {
      console.error(`Failed. Reason: ${err}`)
      process.exit(1)
   })