# Plugins

Plugins respond to events emitted by the core system.




# Plugin Template

During the `setup()` call, the plugin can register events with the `stacks` runtime.

```js
   async setup(stack: IStack, router: IEventRouter): Promise<void> {

      // BootstrapEvent
      router.on<BootstrapEvent>(EventSet.Bootstrap, async (event: BootstrapEvent) => {

      })

      // GetManyObjectsEvent<StackObject>
      router.on<GetManyObjectsEvent<StackObject>>(EventSet.GetManyObjects, async (event: GetManyObjectsEvent<StackObject>) => {
         /*
            Set event.result for the returned results

            event.results = {
               cursor: cursor === '' ? '' : Buffer.from(cursor).toString('base64'),
               items: objects
            }
         */
      })

      // SaveObjectEvent<StackObject>
      router.on<SaveObjectEvent<StackObject>>(EventSet.ObjectSaved, async (event: SaveObjectEvent<StackObject>) => {

      })

      // GetObjectEvent<StackObject>
      router.on<GetObjectEvent<StackObject>>(EventSet.GetObject, async (event: GetObjectEvent<StackObject>) => {
         /*
            Set event.object with the requested Object
         */
      })

      // DeleteObjectEvent<StackObject>
      router.on<DeleteObjectEvent<StackObject>>(EventSet.ObjectDeleted, async (event: DeleteObjectEvent<StackObject>) => {
         // Delete the Object
      })

      // UpdateObjectEvent<StackObject>
      router.on<UpdateObjectEvent<StackObject>>(EventSet.ObjectUpdated, async (event: UpdateObjectEvent<StackObject>) => {
         let objectPath = this.getObjectPath(event.model.name, event.object.id)
         let tempPath = `${objectPath}${TempFileExt}`

         try {
            await fs.access(objectPath)

            event.exists = ExistState.Exists

            // We ensure we always have a copy of the original until we're done writing
            // the changed file. We remove the copy if the write is sucessful, otherwise
            // we rollback the change and keep the copy.
            await fs.copy(objectPath, tempPath)
            await fs.remove(objectPath)
            await fs.writeJson(objectPath, event.serialize.toJs(), { spaces: 2 })
         } catch (err) {
            try {
               await fs.access(tempPath)
               await fs.move(tempPath, objectPath, { overwrite: true })
            } catch (err) {
               // swallow
            }

            throw new Error(`[stacks-fs] Failed to update an Object ${event.object.id}. Reason ${err}`)
         } finally {
            try {
               await fs.access(tempPath)
               await fs.remove(tempPath)
            } catch (err) {
               // swallow
            }
         }
      })
   }

```