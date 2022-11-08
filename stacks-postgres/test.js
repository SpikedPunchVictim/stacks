const { PostgresPlugin } = require('./dist')
const { Stack } = require('@spikedpunch/stacks')


async function main() {
   let stack = Stack.create()

   let postgres = new PostgresPlugin({
      database: "test",
      host: "localhost",
      user: "admin",
      password: "admin",
      port: 5432
   })

   await stack.use(postgres)

   await postgres.dropDb('test')
   await postgres.createDbIfNotExists('test')

   let Ore = await stack.create.model('ore', {
      name: '',
      weight: 0
   })


   let Region = await stack.create.model('region', {
      ore2: Ore,
      ore: ({ ref }) => ref(Ore.name),
      ores: [Ore], // TODO: Make work with [Ore],
      // populatedArrayOre: await Ore.array([
      //    { name: 'steel', weight: 15 },
      //    { name: 'cobalt', weight: 12 }
      // ])
   })

   let Race = await stack.create.model('race', {
      name: ''
   })

   let Lore = await stack.create.model('lore', {
      user: '',
      description: '',
      race: ({ ref }) => ref(Race.name)
   })

   let Sword = await stack.create.model('sword', {
      name: '',
      price: 0,
      used: false,
      lore: ({ ref }) => ref(Lore.name),
      race: ({ ref }) => ref(Race.name)
   })

   await stack.bootstrap()

   await Race.create({ name: 'human' })
   await Race.create({ name: 'orc' })
   await Race.create({ name: 'dwarf' })
   await Race.create({ name: 'elf' })

   let iceSword = await Sword.create({
      name: 'Ice Sword',
      price: 100,
      used: true,
      lore: {
         user: 'jesus',
         description: 'Like a snowball to the face'
      }
   })

   let fireSword = await Sword.create({
      name: 'Fire Sword',
      price: 250,
      used: true,
      lore: {
         user: 'joleen',
         description: 'It burns'
      }
   })

   await Sword.save(iceSword)
   await Sword.save(fireSword)

   let count = 3

   for(let i = 0; i < count; ++i) {
      let sword = await Sword.create({
         name: `${i}`,
         used: true,
         lore: {
            user: `auto-${i}`,
            description: `auto created ${i}`
         }
      })

      await Sword.save(sword)
   }

   let swords = await Sword.getAll()
   console.log(swords.length)
   
   await Sword.delete(iceSword)

   swords = await Sword.getAll()
   console.log(swords.length)

   fireSword.price = 6969
   await stack.update.object(Sword, fireSword, async (updated, exists) => {
      console.log(`\n:: Updated ( ${exists})`)
      console.dir(updated)
   })
}

main()
   .then(_ => {
      console.log('Done')
      process.exit(0)
   })
   .catch(err => {
      console.error(`Failed. Reason: ${err}`)
      process.exit(1)
   })