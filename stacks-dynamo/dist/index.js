"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamoDbPlugin = void 0;
const stacks_1 = require("@spikedpunch/stacks");
const dynatron_1 = require("dynatron");
/**
 * File system plugin for Stacks
 *
 * Notes:
 *    * GetMany cursor points to the next file in a sorted list
 */
class DynamoDbPlugin {
    constructor(baseDir, options) {
        this.baseDir = baseDir;
        this.options = options;
        this.name = 'stacks-dynamo';
        // TODO: Normalize options
        this.client = new dynatron_1.Dynatron(new dynatron_1.DynatronClient(options));
    }
    /*
 export enum EventSet {
    Bootstrap = 'bootstrap',
    GetManyObjects = 'get-many-objects',
    GetModel = 'get-model',
    GetObject = 'get-object',
    HasId = 'has-id',
    ModelCreated = 'model-created',
    ModelDeleted = 'model-deleted',
    ModelUpdated = 'model-updated',
    ObjectCreated = 'object-created',
    ObjectDeleted = 'object-deleted',
    ObjectUpdated = 'object-updated',
    ObjectSaved = 'object-saved'
 }
    */
    async setup(stack, router) {
        //-------------------------------------------------------------------------------------------
        router.on(stacks_1.EventSet.Bootstrap, async (event) => {
            // for(let model of stack.get.models()) {
            //    //model.
            // }
        });
        //-------------------------------------------------------------------------------------------
        // router.on<GetManyObjectsEvent<StackObject>>(EventSet.GetManyObjects, async (event: GetManyObjectsEvent<StackObject>) => {
        //    let modelDir = this.getModelDir(event.model.name)
        //    let reqCursor = event.options.cursor || ''
        //    let reqCount = event.options.limit == null ? 100 : event.options.limit
        //    // Ignore any Temp files that may be in the directory
        //    let files = await fs.readdir(modelDir)
        //    files = files.filter(it => path.parse(it).ext !== TempFileExt)
        //    files.sort()
        //    let cursor = ''
        //    let startIndex = 0
        //    let requestedFiles = new Array<string>()
        //    // The cursor becomes the next file one in the sorted list
        //    if (reqCursor !== '') {
        //       let names = files.map(f => path.parse(f).name)
        //       let decodedCursor = Buffer.from(reqCursor, 'base64').toString('ascii')
        //       let found = names.findIndex(it => it === decodedCursor)
        //       if (found < 0) {
        //          found = 0
        //          event.wasCursorFound = false
        //       } else {
        //          startIndex = found
        //       }
        //    }
        //    let endIndex = reqCount + startIndex
        //    requestedFiles = files.slice(startIndex, endIndex)
        //    if (endIndex < (files.length - 1)) {
        //       let parsed = path.parse(path.join(this.baseDir, files[endIndex]))
        //       cursor = parsed.name
        //    } else {
        //       cursor = ''
        //    }
        //    let objects = new Array<StackObject>()
        //    for (let file of requestedFiles) {
        //       objects.push(await fs.readJson(path.join(modelDir, file)))
        //    }
        //    event.results = {
        //       cursor: cursor === '' ? '' : Buffer.from(cursor).toString('base64'),
        //       items: objects
        //    }
        // })
        //-------------------------------------------------------------------------------------------
        router.on(stacks_1.EventSet.ObjectSaved, async (event) => {
            /*
               readonly model: IModel
               readonly object: T
               readonly serialize: IProxyObject
            */
            let saved = await this.client.Items(event.model.name)
                .put(event.serialize.toJs())
                .$();
            console.dir(saved, { depth: null });
        });
        // //-------------------------------------------------------------------------------------------
        // router.on<GetObjectEvent<StackObject>>(EventSet.GetObject, async (event: GetObjectEvent<StackObject>) => {
        //    let objectPath = this.getObjectPath(event.model.id, event.id)
        //    try {
        //       let obj = await fs.readJson(objectPath)
        //       event.object = obj
        //    } catch (err) {
        //       throw new Error(`[stacks-fs] Failed to retrieve Object ${event.id}. Reason ${err}`)
        //    }
        // })
        // //-------------------------------------------------------------------------------------------
        // router.on<DeleteObjectEvent<StackObject>>(EventSet.ObjectDeleted, async (event: DeleteObjectEvent<StackObject>) => {
        //    let objectPath = this.getObjectPath(event.model.name, event.object.id)
        //    try {
        //       await fs.remove(objectPath)
        //    } catch (err) {
        //       throw new Error(`[stacks-fs] Failed to delete an Object ${event.object.id}. Reason ${err}`)
        //    }
        // })
        // //-------------------------------------------------------------------------------------------
        // router.on<UpdateObjectEvent<StackObject>>(EventSet.ObjectUpdated, async (event: UpdateObjectEvent<StackObject>) => {
        //    let objectPath = this.getObjectPath(event.model.name, event.object.id)
        //    let tempPath = `${objectPath}${TempFileExt}`
        //    try {
        //       await fs.access(objectPath)
        //       event.exists = ExistState.Exists
        //       // We ensure we always have a copy of the original until we're done writing
        //       // the changed file. We remove the copy if the write is sucessful, otherwise
        //       // we rollback the change and keep the copy.
        //       await fs.copy(objectPath, tempPath)
        //       await fs.remove(objectPath)
        //       await fs.writeJson(objectPath, event.serialize.toJs(), { spaces: 2 })
        //       event.updated = 
        //    } catch (err) {
        //       try {
        //          await fs.access(tempPath)
        //          await fs.move(tempPath, objectPath, { overwrite: true })
        //       } catch (err) {
        //          // swallow
        //       }
        //       throw new Error(`[stacks-fs] Failed to update an Object ${event.object.id}. Reason ${err}`)
        //    } finally {
        //       try {
        //          await fs.access(tempPath)
        //          await fs.remove(tempPath)
        //       } catch (err) {
        //          // swallow
        //       }
        //    }
        // })
    }
}
exports.DynamoDbPlugin = DynamoDbPlugin;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsZ0RBYzRCO0FBRTVCLHVDQUtpQjtBQVFqQjs7Ozs7R0FLRztBQUNILE1BQWEsY0FBYztJQUt4QixZQUFxQixPQUFlLEVBQVcsT0FBNkI7UUFBdkQsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQUFXLFlBQU8sR0FBUCxPQUFPLENBQXNCO1FBSm5FLFNBQUksR0FBVyxlQUFlLENBQUE7UUFLcEMsMEJBQTBCO1FBQzFCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxtQkFBUSxDQUFDLElBQUkseUJBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFBO0lBQzFELENBQUM7SUFHRDs7Ozs7Ozs7Ozs7Ozs7O01BZUU7SUFDRixLQUFLLENBQUMsS0FBSyxDQUFDLEtBQWEsRUFBRSxNQUFvQjtRQUU1Qyw2RkFBNkY7UUFDN0YsTUFBTSxDQUFDLEVBQUUsQ0FBaUIsaUJBQVEsQ0FBQyxTQUFTLEVBQUUsS0FBSyxFQUFFLEtBQXFCLEVBQUUsRUFBRTtZQUMzRSx5Q0FBeUM7WUFDekMsY0FBYztZQUNkLElBQUk7UUFDUCxDQUFDLENBQUMsQ0FBQTtRQUVGLDZGQUE2RjtRQUM3Riw0SEFBNEg7UUFDNUgsdURBQXVEO1FBQ3ZELGdEQUFnRDtRQUNoRCw0RUFBNEU7UUFFNUUsMkRBQTJEO1FBQzNELDRDQUE0QztRQUM1QyxvRUFBb0U7UUFDcEUsa0JBQWtCO1FBRWxCLHFCQUFxQjtRQUNyQix3QkFBd0I7UUFDeEIsOENBQThDO1FBRTlDLGdFQUFnRTtRQUNoRSw2QkFBNkI7UUFDN0IsdURBQXVEO1FBRXZELCtFQUErRTtRQUMvRSxnRUFBZ0U7UUFFaEUseUJBQXlCO1FBQ3pCLHFCQUFxQjtRQUNyQix3Q0FBd0M7UUFDeEMsaUJBQWlCO1FBQ2pCLDhCQUE4QjtRQUM5QixVQUFVO1FBQ1YsT0FBTztRQUVQLDBDQUEwQztRQUMxQyx3REFBd0Q7UUFFeEQsMENBQTBDO1FBQzFDLDBFQUEwRTtRQUMxRSw2QkFBNkI7UUFDN0IsY0FBYztRQUNkLG9CQUFvQjtRQUNwQixPQUFPO1FBRVAsNENBQTRDO1FBRTVDLHdDQUF3QztRQUN4QyxtRUFBbUU7UUFDbkUsT0FBTztRQUVQLHVCQUF1QjtRQUN2Qiw2RUFBNkU7UUFDN0UsdUJBQXVCO1FBQ3ZCLE9BQU87UUFDUCxLQUFLO1FBRUwsNkZBQTZGO1FBQzdGLE1BQU0sQ0FBQyxFQUFFLENBQStCLGlCQUFRLENBQUMsV0FBVyxFQUFFLEtBQUssRUFBRSxLQUFtQyxFQUFFLEVBQUU7WUFDekc7Ozs7Y0FJRTtZQUNGLElBQUksS0FBSyxHQUFHLE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUM7aUJBQ2pELEdBQUcsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxDQUFDO2lCQUMzQixDQUFDLEVBQWUsQ0FBQTtZQUVwQixPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFBO1FBQ3RDLENBQUMsQ0FBQyxDQUFBO1FBRUYsZ0dBQWdHO1FBQ2hHLDZHQUE2RztRQUM3RyxtRUFBbUU7UUFFbkUsV0FBVztRQUNYLGdEQUFnRDtRQUNoRCwyQkFBMkI7UUFDM0IscUJBQXFCO1FBQ3JCLDRGQUE0RjtRQUM1RixPQUFPO1FBQ1AsS0FBSztRQUVMLGdHQUFnRztRQUNoRyx1SEFBdUg7UUFDdkgsNEVBQTRFO1FBRTVFLFdBQVc7UUFDWCxvQ0FBb0M7UUFDcEMscUJBQXFCO1FBQ3JCLG9HQUFvRztRQUNwRyxPQUFPO1FBQ1AsS0FBSztRQUVMLGdHQUFnRztRQUNoRyx1SEFBdUg7UUFDdkgsNEVBQTRFO1FBQzVFLGtEQUFrRDtRQUVsRCxXQUFXO1FBQ1gsb0NBQW9DO1FBRXBDLHlDQUF5QztRQUV6QyxvRkFBb0Y7UUFDcEYscUZBQXFGO1FBQ3JGLHFEQUFxRDtRQUNyRCw0Q0FBNEM7UUFDNUMsb0NBQW9DO1FBQ3BDLDhFQUE4RTtRQUM5RSx5QkFBeUI7UUFDekIscUJBQXFCO1FBQ3JCLGNBQWM7UUFDZCxxQ0FBcUM7UUFDckMsb0VBQW9FO1FBQ3BFLHdCQUF3QjtRQUN4QixzQkFBc0I7UUFDdEIsVUFBVTtRQUVWLG9HQUFvRztRQUNwRyxpQkFBaUI7UUFDakIsY0FBYztRQUNkLHFDQUFxQztRQUNyQyxxQ0FBcUM7UUFDckMsd0JBQXdCO1FBQ3hCLHNCQUFzQjtRQUN0QixVQUFVO1FBQ1YsT0FBTztRQUNQLEtBQUs7SUFDUixDQUFDO0NBdUJIO0FBdkxELHdDQXVMQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gICBCb290c3RyYXBFdmVudCxcbiAgIEV2ZW50U2V0LFxuICAgLy8gRXhpc3RTdGF0ZSxcbiAgIC8vIEdldE9iamVjdEV2ZW50LFxuICAgSVBsdWdpbixcbiAgIElTdGFjayxcbiAgIElFdmVudFJvdXRlcixcbiAgIFNhdmVPYmplY3RFdmVudCxcbiAgIFN0YWNrT2JqZWN0LFxuICAgLy8gR2V0TWFueU9iamVjdHNFdmVudCxcbiAgIC8vIElNb2RlbCxcbiAgIC8vIERlbGV0ZU9iamVjdEV2ZW50LFxuICAgLy8gVXBkYXRlT2JqZWN0RXZlbnRcbn0gZnJvbSBcIkBzcGlrZWRwdW5jaC9zdGFja3NcIlxuXG5pbXBvcnQge1xuICAgRHluYXRyb24sXG4gICBEeW5hdHJvbkNsaWVudCxcbiAgIER5bmF0cm9uQ2xpZW50Q29uZmlnLFxuXG59IGZyb20gJ2R5bmF0cm9uJ1xuXG5cbmV4cG9ydCB0eXBlIER5bmFtb0RiUGx1Z2luQ29uZmlnID0ge1xuXG59ICYgRHluYXRyb25DbGllbnRDb25maWdcblxuXG4vKipcbiAqIEZpbGUgc3lzdGVtIHBsdWdpbiBmb3IgU3RhY2tzXG4gKiBcbiAqIE5vdGVzOlxuICogICAgKiBHZXRNYW55IGN1cnNvciBwb2ludHMgdG8gdGhlIG5leHQgZmlsZSBpbiBhIHNvcnRlZCBsaXN0XG4gKi9cbmV4cG9ydCBjbGFzcyBEeW5hbW9EYlBsdWdpbiBpbXBsZW1lbnRzIElQbHVnaW4ge1xuICAgcmVhZG9ubHkgbmFtZTogc3RyaW5nID0gJ3N0YWNrcy1keW5hbW8nXG5cbiAgIHByaXZhdGUgY2xpZW50OiBEeW5hdHJvblxuXG4gICBjb25zdHJ1Y3RvcihyZWFkb25seSBiYXNlRGlyOiBzdHJpbmcsIHJlYWRvbmx5IG9wdGlvbnM6IER5bmFtb0RiUGx1Z2luQ29uZmlnKSB7XG4gICAgICAvLyBUT0RPOiBOb3JtYWxpemUgb3B0aW9uc1xuICAgICAgdGhpcy5jbGllbnQgPSBuZXcgRHluYXRyb24obmV3IER5bmF0cm9uQ2xpZW50KG9wdGlvbnMpKVxuICAgfVxuXG5cbiAgIC8qXG5leHBvcnQgZW51bSBFdmVudFNldCB7XG4gICBCb290c3RyYXAgPSAnYm9vdHN0cmFwJyxcbiAgIEdldE1hbnlPYmplY3RzID0gJ2dldC1tYW55LW9iamVjdHMnLFxuICAgR2V0TW9kZWwgPSAnZ2V0LW1vZGVsJyxcbiAgIEdldE9iamVjdCA9ICdnZXQtb2JqZWN0JyxcbiAgIEhhc0lkID0gJ2hhcy1pZCcsXG4gICBNb2RlbENyZWF0ZWQgPSAnbW9kZWwtY3JlYXRlZCcsXG4gICBNb2RlbERlbGV0ZWQgPSAnbW9kZWwtZGVsZXRlZCcsXG4gICBNb2RlbFVwZGF0ZWQgPSAnbW9kZWwtdXBkYXRlZCcsXG4gICBPYmplY3RDcmVhdGVkID0gJ29iamVjdC1jcmVhdGVkJyxcbiAgIE9iamVjdERlbGV0ZWQgPSAnb2JqZWN0LWRlbGV0ZWQnLFxuICAgT2JqZWN0VXBkYXRlZCA9ICdvYmplY3QtdXBkYXRlZCcsXG4gICBPYmplY3RTYXZlZCA9ICdvYmplY3Qtc2F2ZWQnXG59XG4gICAqL1xuICAgYXN5bmMgc2V0dXAoc3RhY2s6IElTdGFjaywgcm91dGVyOiBJRXZlbnRSb3V0ZXIpOiBQcm9taXNlPHZvaWQ+IHtcblxuICAgICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICByb3V0ZXIub248Qm9vdHN0cmFwRXZlbnQ+KEV2ZW50U2V0LkJvb3RzdHJhcCwgYXN5bmMgKGV2ZW50OiBCb290c3RyYXBFdmVudCkgPT4ge1xuICAgICAgICAgLy8gZm9yKGxldCBtb2RlbCBvZiBzdGFjay5nZXQubW9kZWxzKCkpIHtcbiAgICAgICAgIC8vICAgIC8vbW9kZWwuXG4gICAgICAgICAvLyB9XG4gICAgICB9KVxuXG4gICAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIC8vIHJvdXRlci5vbjxHZXRNYW55T2JqZWN0c0V2ZW50PFN0YWNrT2JqZWN0Pj4oRXZlbnRTZXQuR2V0TWFueU9iamVjdHMsIGFzeW5jIChldmVudDogR2V0TWFueU9iamVjdHNFdmVudDxTdGFja09iamVjdD4pID0+IHtcbiAgICAgIC8vICAgIGxldCBtb2RlbERpciA9IHRoaXMuZ2V0TW9kZWxEaXIoZXZlbnQubW9kZWwubmFtZSlcbiAgICAgIC8vICAgIGxldCByZXFDdXJzb3IgPSBldmVudC5vcHRpb25zLmN1cnNvciB8fCAnJ1xuICAgICAgLy8gICAgbGV0IHJlcUNvdW50ID0gZXZlbnQub3B0aW9ucy5saW1pdCA9PSBudWxsID8gMTAwIDogZXZlbnQub3B0aW9ucy5saW1pdFxuXG4gICAgICAvLyAgICAvLyBJZ25vcmUgYW55IFRlbXAgZmlsZXMgdGhhdCBtYXkgYmUgaW4gdGhlIGRpcmVjdG9yeVxuICAgICAgLy8gICAgbGV0IGZpbGVzID0gYXdhaXQgZnMucmVhZGRpcihtb2RlbERpcilcbiAgICAgIC8vICAgIGZpbGVzID0gZmlsZXMuZmlsdGVyKGl0ID0+IHBhdGgucGFyc2UoaXQpLmV4dCAhPT0gVGVtcEZpbGVFeHQpXG4gICAgICAvLyAgICBmaWxlcy5zb3J0KClcblxuICAgICAgLy8gICAgbGV0IGN1cnNvciA9ICcnXG4gICAgICAvLyAgICBsZXQgc3RhcnRJbmRleCA9IDBcbiAgICAgIC8vICAgIGxldCByZXF1ZXN0ZWRGaWxlcyA9IG5ldyBBcnJheTxzdHJpbmc+KClcblxuICAgICAgLy8gICAgLy8gVGhlIGN1cnNvciBiZWNvbWVzIHRoZSBuZXh0IGZpbGUgb25lIGluIHRoZSBzb3J0ZWQgbGlzdFxuICAgICAgLy8gICAgaWYgKHJlcUN1cnNvciAhPT0gJycpIHtcbiAgICAgIC8vICAgICAgIGxldCBuYW1lcyA9IGZpbGVzLm1hcChmID0+IHBhdGgucGFyc2UoZikubmFtZSlcblxuICAgICAgLy8gICAgICAgbGV0IGRlY29kZWRDdXJzb3IgPSBCdWZmZXIuZnJvbShyZXFDdXJzb3IsICdiYXNlNjQnKS50b1N0cmluZygnYXNjaWknKVxuICAgICAgLy8gICAgICAgbGV0IGZvdW5kID0gbmFtZXMuZmluZEluZGV4KGl0ID0+IGl0ID09PSBkZWNvZGVkQ3Vyc29yKVxuXG4gICAgICAvLyAgICAgICBpZiAoZm91bmQgPCAwKSB7XG4gICAgICAvLyAgICAgICAgICBmb3VuZCA9IDBcbiAgICAgIC8vICAgICAgICAgIGV2ZW50Lndhc0N1cnNvckZvdW5kID0gZmFsc2VcbiAgICAgIC8vICAgICAgIH0gZWxzZSB7XG4gICAgICAvLyAgICAgICAgICBzdGFydEluZGV4ID0gZm91bmRcbiAgICAgIC8vICAgICAgIH1cbiAgICAgIC8vICAgIH1cblxuICAgICAgLy8gICAgbGV0IGVuZEluZGV4ID0gcmVxQ291bnQgKyBzdGFydEluZGV4XG4gICAgICAvLyAgICByZXF1ZXN0ZWRGaWxlcyA9IGZpbGVzLnNsaWNlKHN0YXJ0SW5kZXgsIGVuZEluZGV4KVxuXG4gICAgICAvLyAgICBpZiAoZW5kSW5kZXggPCAoZmlsZXMubGVuZ3RoIC0gMSkpIHtcbiAgICAgIC8vICAgICAgIGxldCBwYXJzZWQgPSBwYXRoLnBhcnNlKHBhdGguam9pbih0aGlzLmJhc2VEaXIsIGZpbGVzW2VuZEluZGV4XSkpXG4gICAgICAvLyAgICAgICBjdXJzb3IgPSBwYXJzZWQubmFtZVxuICAgICAgLy8gICAgfSBlbHNlIHtcbiAgICAgIC8vICAgICAgIGN1cnNvciA9ICcnXG4gICAgICAvLyAgICB9XG5cbiAgICAgIC8vICAgIGxldCBvYmplY3RzID0gbmV3IEFycmF5PFN0YWNrT2JqZWN0PigpXG5cbiAgICAgIC8vICAgIGZvciAobGV0IGZpbGUgb2YgcmVxdWVzdGVkRmlsZXMpIHtcbiAgICAgIC8vICAgICAgIG9iamVjdHMucHVzaChhd2FpdCBmcy5yZWFkSnNvbihwYXRoLmpvaW4obW9kZWxEaXIsIGZpbGUpKSlcbiAgICAgIC8vICAgIH1cblxuICAgICAgLy8gICAgZXZlbnQucmVzdWx0cyA9IHtcbiAgICAgIC8vICAgICAgIGN1cnNvcjogY3Vyc29yID09PSAnJyA/ICcnIDogQnVmZmVyLmZyb20oY3Vyc29yKS50b1N0cmluZygnYmFzZTY0JyksXG4gICAgICAvLyAgICAgICBpdGVtczogb2JqZWN0c1xuICAgICAgLy8gICAgfVxuICAgICAgLy8gfSlcblxuICAgICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICByb3V0ZXIub248U2F2ZU9iamVjdEV2ZW50PFN0YWNrT2JqZWN0Pj4oRXZlbnRTZXQuT2JqZWN0U2F2ZWQsIGFzeW5jIChldmVudDogU2F2ZU9iamVjdEV2ZW50PFN0YWNrT2JqZWN0PikgPT4ge1xuICAgICAgICAgLypcbiAgICAgICAgICAgIHJlYWRvbmx5IG1vZGVsOiBJTW9kZWxcbiAgICAgICAgICAgIHJlYWRvbmx5IG9iamVjdDogVFxuICAgICAgICAgICAgcmVhZG9ubHkgc2VyaWFsaXplOiBJUHJveHlPYmplY3RcbiAgICAgICAgICovXG4gICAgICAgICBsZXQgc2F2ZWQgPSBhd2FpdCB0aGlzLmNsaWVudC5JdGVtcyhldmVudC5tb2RlbC5uYW1lKVxuICAgICAgICAgICAgLnB1dChldmVudC5zZXJpYWxpemUudG9KcygpKVxuICAgICAgICAgICAgLiQ8U3RhY2tPYmplY3Q+KClcblxuICAgICAgICAgY29uc29sZS5kaXIoc2F2ZWQsIHsgZGVwdGg6IG51bGwgfSlcbiAgICAgIH0pXG5cbiAgICAgIC8vIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgLy8gcm91dGVyLm9uPEdldE9iamVjdEV2ZW50PFN0YWNrT2JqZWN0Pj4oRXZlbnRTZXQuR2V0T2JqZWN0LCBhc3luYyAoZXZlbnQ6IEdldE9iamVjdEV2ZW50PFN0YWNrT2JqZWN0PikgPT4ge1xuICAgICAgLy8gICAgbGV0IG9iamVjdFBhdGggPSB0aGlzLmdldE9iamVjdFBhdGgoZXZlbnQubW9kZWwuaWQsIGV2ZW50LmlkKVxuXG4gICAgICAvLyAgICB0cnkge1xuICAgICAgLy8gICAgICAgbGV0IG9iaiA9IGF3YWl0IGZzLnJlYWRKc29uKG9iamVjdFBhdGgpXG4gICAgICAvLyAgICAgICBldmVudC5vYmplY3QgPSBvYmpcbiAgICAgIC8vICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgLy8gICAgICAgdGhyb3cgbmV3IEVycm9yKGBbc3RhY2tzLWZzXSBGYWlsZWQgdG8gcmV0cmlldmUgT2JqZWN0ICR7ZXZlbnQuaWR9LiBSZWFzb24gJHtlcnJ9YClcbiAgICAgIC8vICAgIH1cbiAgICAgIC8vIH0pXG5cbiAgICAgIC8vIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgLy8gcm91dGVyLm9uPERlbGV0ZU9iamVjdEV2ZW50PFN0YWNrT2JqZWN0Pj4oRXZlbnRTZXQuT2JqZWN0RGVsZXRlZCwgYXN5bmMgKGV2ZW50OiBEZWxldGVPYmplY3RFdmVudDxTdGFja09iamVjdD4pID0+IHtcbiAgICAgIC8vICAgIGxldCBvYmplY3RQYXRoID0gdGhpcy5nZXRPYmplY3RQYXRoKGV2ZW50Lm1vZGVsLm5hbWUsIGV2ZW50Lm9iamVjdC5pZClcblxuICAgICAgLy8gICAgdHJ5IHtcbiAgICAgIC8vICAgICAgIGF3YWl0IGZzLnJlbW92ZShvYmplY3RQYXRoKVxuICAgICAgLy8gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAvLyAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFtzdGFja3MtZnNdIEZhaWxlZCB0byBkZWxldGUgYW4gT2JqZWN0ICR7ZXZlbnQub2JqZWN0LmlkfS4gUmVhc29uICR7ZXJyfWApXG4gICAgICAvLyAgICB9XG4gICAgICAvLyB9KVxuXG4gICAgICAvLyAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIC8vIHJvdXRlci5vbjxVcGRhdGVPYmplY3RFdmVudDxTdGFja09iamVjdD4+KEV2ZW50U2V0Lk9iamVjdFVwZGF0ZWQsIGFzeW5jIChldmVudDogVXBkYXRlT2JqZWN0RXZlbnQ8U3RhY2tPYmplY3Q+KSA9PiB7XG4gICAgICAvLyAgICBsZXQgb2JqZWN0UGF0aCA9IHRoaXMuZ2V0T2JqZWN0UGF0aChldmVudC5tb2RlbC5uYW1lLCBldmVudC5vYmplY3QuaWQpXG4gICAgICAvLyAgICBsZXQgdGVtcFBhdGggPSBgJHtvYmplY3RQYXRofSR7VGVtcEZpbGVFeHR9YFxuXG4gICAgICAvLyAgICB0cnkge1xuICAgICAgLy8gICAgICAgYXdhaXQgZnMuYWNjZXNzKG9iamVjdFBhdGgpXG5cbiAgICAgIC8vICAgICAgIGV2ZW50LmV4aXN0cyA9IEV4aXN0U3RhdGUuRXhpc3RzXG5cbiAgICAgIC8vICAgICAgIC8vIFdlIGVuc3VyZSB3ZSBhbHdheXMgaGF2ZSBhIGNvcHkgb2YgdGhlIG9yaWdpbmFsIHVudGlsIHdlJ3JlIGRvbmUgd3JpdGluZ1xuICAgICAgLy8gICAgICAgLy8gdGhlIGNoYW5nZWQgZmlsZS4gV2UgcmVtb3ZlIHRoZSBjb3B5IGlmIHRoZSB3cml0ZSBpcyBzdWNlc3NmdWwsIG90aGVyd2lzZVxuICAgICAgLy8gICAgICAgLy8gd2Ugcm9sbGJhY2sgdGhlIGNoYW5nZSBhbmQga2VlcCB0aGUgY29weS5cbiAgICAgIC8vICAgICAgIGF3YWl0IGZzLmNvcHkob2JqZWN0UGF0aCwgdGVtcFBhdGgpXG4gICAgICAvLyAgICAgICBhd2FpdCBmcy5yZW1vdmUob2JqZWN0UGF0aClcbiAgICAgIC8vICAgICAgIGF3YWl0IGZzLndyaXRlSnNvbihvYmplY3RQYXRoLCBldmVudC5zZXJpYWxpemUudG9KcygpLCB7IHNwYWNlczogMiB9KVxuICAgICAgLy8gICAgICAgZXZlbnQudXBkYXRlZCA9IFxuICAgICAgLy8gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAvLyAgICAgICB0cnkge1xuICAgICAgLy8gICAgICAgICAgYXdhaXQgZnMuYWNjZXNzKHRlbXBQYXRoKVxuICAgICAgLy8gICAgICAgICAgYXdhaXQgZnMubW92ZSh0ZW1wUGF0aCwgb2JqZWN0UGF0aCwgeyBvdmVyd3JpdGU6IHRydWUgfSlcbiAgICAgIC8vICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgLy8gICAgICAgICAgLy8gc3dhbGxvd1xuICAgICAgLy8gICAgICAgfVxuXG4gICAgICAvLyAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFtzdGFja3MtZnNdIEZhaWxlZCB0byB1cGRhdGUgYW4gT2JqZWN0ICR7ZXZlbnQub2JqZWN0LmlkfS4gUmVhc29uICR7ZXJyfWApXG4gICAgICAvLyAgICB9IGZpbmFsbHkge1xuICAgICAgLy8gICAgICAgdHJ5IHtcbiAgICAgIC8vICAgICAgICAgIGF3YWl0IGZzLmFjY2Vzcyh0ZW1wUGF0aClcbiAgICAgIC8vICAgICAgICAgIGF3YWl0IGZzLnJlbW92ZSh0ZW1wUGF0aClcbiAgICAgIC8vICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgLy8gICAgICAgICAgLy8gc3dhbGxvd1xuICAgICAgLy8gICAgICAgfVxuICAgICAgLy8gICAgfVxuICAgICAgLy8gfSlcbiAgIH1cblxuICAgLy8gcHJpdmF0ZSBnZXRNb2RlbERpcihtb2RlbE5hbWU6IHN0cmluZyk6IHN0cmluZyB7XG4gICAvLyAgICByZXR1cm4gcGF0aC5qb2luKHRoaXMuYmFzZURpciwgbW9kZWxOYW1lKVxuICAgLy8gfVxuXG4gICAvLyBwcml2YXRlIGdldE9iamVjdFBhdGgobW9kZWxOYW1lOiBzdHJpbmcsIG9iamVjdElkOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgLy8gICAgbGV0IG1vZGVsRGlyID0gdGhpcy5nZXRNb2RlbERpcihtb2RlbE5hbWUpXG4gICAvLyAgICByZXR1cm4gcGF0aC5qb2luKG1vZGVsRGlyLCBgJHtvYmplY3RJZH0uanNvbmApXG4gICAvLyB9XG5cbiAgIC8vIHByaXZhdGUgYXN5bmMgc2V0dXBNb2RlbChtb2RlbDogSU1vZGVsKTogUHJvbWlzZTx2b2lkPiB7XG4gICAvLyAgICBsZXQgbW9kZWxEaXIgPSB0aGlzLmdldE1vZGVsRGlyKG1vZGVsLm5hbWUpXG4gICAvLyAgICBhd2FpdCBmcy5lbnN1cmVEaXIobW9kZWxEaXIpXG4gICAvLyB9XG5cbiAgIC8vIHByaXZhdGUgYXN5bmMgd3JpdGVPYmplY3QobW9kZWw6IElNb2RlbCwgb2JqZWN0OiBTdGFja09iamVjdCk6IFByb21pc2U8dm9pZD4ge1xuICAgLy8gICAgbGV0IG9iaiA9IHt9XG5cbiAgIC8vICAgIGZvcihsZXQgbWVtYmVyIG9mIG1vZGVsLm1lbWJlcnMpIHtcbiAgIC8vICAgICAgIG1lbWJlci52YWx1ZS5cbiAgIC8vICAgIH1cbiAgIC8vIH1cbn0iXX0=