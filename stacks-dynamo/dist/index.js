"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamoDbPlugin = void 0;
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
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
        this.version = undefined;
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
            for (let model of stack.get.models()) {
                let symbols = new Array();
                for (let symbol of model.symbols) {
                    if (symbol.name.startsWith('dynamo:')) {
                        symbols.push(symbol);
                    }
                }
                if (symbols.length == 0) {
                    continue;
                }
            }
        });
        router.on(stacks_1.EventSet.GetStoreContext, async (event) => {
            if (this.version === undefined) {
                let pkg = await fs_extra_1.default.readJson(path_1.default.join(__dirname, '..', 'package.json'));
                this.version = pkg.version;
            }
            event.contexts.push({
                name: 'stacks:fs',
                version: this.version || 'version-not-set',
                store: {
                    client: this.client,
                    options: this.options
                }
            });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsZ0RBQXVCO0FBQ3ZCLHdEQUF5QjtBQUV6QixnREFnQjRCO0FBRTVCLHVDQUlpQjtBQVFqQjs7Ozs7R0FLRztBQUNILE1BQWEsY0FBYztJQU14QixZQUFxQixPQUFlLEVBQVcsT0FBNkI7UUFBdkQsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQUFXLFlBQU8sR0FBUCxPQUFPLENBQXNCO1FBTG5FLFNBQUksR0FBVyxlQUFlLENBQUE7UUFHL0IsWUFBTyxHQUF1QixTQUFTLENBQUE7UUFHNUMsMEJBQTBCO1FBQzFCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxtQkFBUSxDQUFDLElBQUkseUJBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFBO0lBQzFELENBQUM7SUFHRDs7Ozs7Ozs7Ozs7Ozs7O01BZUU7SUFDRixLQUFLLENBQUMsS0FBSyxDQUFDLEtBQWEsRUFBRSxNQUFvQjtRQUU1Qyw2RkFBNkY7UUFDN0YsTUFBTSxDQUFDLEVBQUUsQ0FBaUIsaUJBQVEsQ0FBQyxTQUFTLEVBQUUsS0FBSyxFQUFFLEtBQXFCLEVBQUUsRUFBRTtZQUMzRSxLQUFJLElBQUksS0FBSyxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLEVBQUU7Z0JBQ2xDLElBQUksT0FBTyxHQUFHLElBQUksS0FBSyxFQUFlLENBQUE7Z0JBRXRDLEtBQUksSUFBSSxNQUFNLElBQUksS0FBSyxDQUFDLE9BQU8sRUFBRTtvQkFDOUIsSUFBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsRUFBRTt3QkFDbkMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQTtxQkFDdEI7aUJBQ0g7Z0JBRUQsSUFBRyxPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRTtvQkFDckIsU0FBUTtpQkFDVjthQUdI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O1FBQ3JCLGNBQWM7UUFDZCxxQ0FBcUM7UUFDckMsb0VBQW9FO1FBQ3BFLHdCQUF3QjtRQUN4QixzQkFBc0I7UUFDdEIsVUFBVTtRQUVWLG9HQUFvRztRQUNwRyxpQkFBaUI7UUFDakIsY0FBYztRQUNkLHFDQUFxQztRQUNyQyxxQ0FBcUM7UUFDckMsd0JBQXdCO1FBQ3hCLHNCQUFzQjtRQUN0QixVQUFVO1FBQ1YsT0FBTztRQUNQLEtBQUs7SUFDUixDQUFDO0NBdUJIO0FBcE5ELHdDQW9OQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgZnMgZnJvbSAnZnMtZXh0cmEnXG5cbmltcG9ydCB7XG4gICBCb290c3RyYXBFdmVudCxcbiAgIEV2ZW50U2V0LFxuICAgLy8gRXhpc3RTdGF0ZSxcbiAgIC8vIEdldE9iamVjdEV2ZW50LFxuICAgR2V0U3RvcmVDb250ZXh0RXZlbnQsXG4gICBJUGx1Z2luLFxuICAgSVN0YWNrLFxuICAgSUV2ZW50Um91dGVyLFxuICAgT2JqZWN0U2F2ZUV2ZW50LFxuICAgU3RhY2tPYmplY3QsXG4gICBTeW1ib2xFbnRyeVxuICAgLy8gR2V0TWFueU9iamVjdHNFdmVudCxcbiAgIC8vIElNb2RlbCxcbiAgIC8vIERlbGV0ZU9iamVjdEV2ZW50LFxuICAgLy8gVXBkYXRlT2JqZWN0RXZlbnRcbn0gZnJvbSBcIkBzcGlrZWRwdW5jaC9zdGFja3NcIlxuXG5pbXBvcnQge1xuICAgRHluYXRyb24sXG4gICBEeW5hdHJvbkNsaWVudCxcbiAgIER5bmF0cm9uQ2xpZW50Q29uZmlnLFxufSBmcm9tICdkeW5hdHJvbidcblxuXG5leHBvcnQgdHlwZSBEeW5hbW9EYlBsdWdpbkNvbmZpZyA9IHtcblxufSAmIER5bmF0cm9uQ2xpZW50Q29uZmlnXG5cblxuLyoqXG4gKiBGaWxlIHN5c3RlbSBwbHVnaW4gZm9yIFN0YWNrc1xuICogXG4gKiBOb3RlczpcbiAqICAgICogR2V0TWFueSBjdXJzb3IgcG9pbnRzIHRvIHRoZSBuZXh0IGZpbGUgaW4gYSBzb3J0ZWQgbGlzdFxuICovXG5leHBvcnQgY2xhc3MgRHluYW1vRGJQbHVnaW4gaW1wbGVtZW50cyBJUGx1Z2luIHtcbiAgIHJlYWRvbmx5IG5hbWU6IHN0cmluZyA9ICdzdGFja3MtZHluYW1vJ1xuXG4gICBwcml2YXRlIGNsaWVudDogRHluYXRyb25cbiAgIHByaXZhdGUgdmVyc2lvbjogc3RyaW5nIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkXG5cbiAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IGJhc2VEaXI6IHN0cmluZywgcmVhZG9ubHkgb3B0aW9uczogRHluYW1vRGJQbHVnaW5Db25maWcpIHtcbiAgICAgIC8vIFRPRE86IE5vcm1hbGl6ZSBvcHRpb25zXG4gICAgICB0aGlzLmNsaWVudCA9IG5ldyBEeW5hdHJvbihuZXcgRHluYXRyb25DbGllbnQob3B0aW9ucykpXG4gICB9XG5cblxuICAgLypcbmV4cG9ydCBlbnVtIEV2ZW50U2V0IHtcbiAgIEJvb3RzdHJhcCA9ICdib290c3RyYXAnLFxuICAgR2V0TWFueU9iamVjdHMgPSAnZ2V0LW1hbnktb2JqZWN0cycsXG4gICBHZXRNb2RlbCA9ICdnZXQtbW9kZWwnLFxuICAgR2V0T2JqZWN0ID0gJ2dldC1vYmplY3QnLFxuICAgSGFzSWQgPSAnaGFzLWlkJyxcbiAgIE1vZGVsQ3JlYXRlZCA9ICdtb2RlbC1jcmVhdGVkJyxcbiAgIE1vZGVsRGVsZXRlZCA9ICdtb2RlbC1kZWxldGVkJyxcbiAgIE1vZGVsVXBkYXRlZCA9ICdtb2RlbC11cGRhdGVkJyxcbiAgIE9iamVjdENyZWF0ZWQgPSAnb2JqZWN0LWNyZWF0ZWQnLFxuICAgT2JqZWN0RGVsZXRlZCA9ICdvYmplY3QtZGVsZXRlZCcsXG4gICBPYmplY3RVcGRhdGVkID0gJ29iamVjdC11cGRhdGVkJyxcbiAgIE9iamVjdFNhdmVkID0gJ29iamVjdC1zYXZlZCdcbn1cbiAgICovXG4gICBhc3luYyBzZXR1cChzdGFjazogSVN0YWNrLCByb3V0ZXI6IElFdmVudFJvdXRlcik6IFByb21pc2U8dm9pZD4ge1xuXG4gICAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIHJvdXRlci5vbjxCb290c3RyYXBFdmVudD4oRXZlbnRTZXQuQm9vdHN0cmFwLCBhc3luYyAoZXZlbnQ6IEJvb3RzdHJhcEV2ZW50KSA9PiB7XG4gICAgICAgICBmb3IobGV0IG1vZGVsIG9mIHN0YWNrLmdldC5tb2RlbHMoKSkge1xuICAgICAgICAgICAgbGV0IHN5bWJvbHMgPSBuZXcgQXJyYXk8U3ltYm9sRW50cnk+KClcblxuICAgICAgICAgICAgZm9yKGxldCBzeW1ib2wgb2YgbW9kZWwuc3ltYm9scykge1xuICAgICAgICAgICAgICAgaWYoc3ltYm9sLm5hbWUuc3RhcnRzV2l0aCgnZHluYW1vOicpKSB7XG4gICAgICAgICAgICAgICAgICBzeW1ib2xzLnB1c2goc3ltYm9sKVxuICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZihzeW1ib2xzLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICAgICBjb250aW51ZVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBcbiAgICAgICAgIH1cbiAgICAgIH0pXG5cbiAgICAgIHJvdXRlci5vbihFdmVudFNldC5HZXRTdG9yZUNvbnRleHQsIGFzeW5jIChldmVudDogR2V0U3RvcmVDb250ZXh0RXZlbnQpID0+IHtcbiAgICAgICAgIGlmKHRoaXMudmVyc2lvbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBsZXQgcGtnID0gYXdhaXQgZnMucmVhZEpzb24ocGF0aC5qb2luKF9fZGlybmFtZSwgJy4uJywgJ3BhY2thZ2UuanNvbicpKVxuICAgICAgICAgICAgdGhpcy52ZXJzaW9uID0gcGtnLnZlcnNpb25cbiAgICAgICAgIH1cblxuICAgICAgICAgZXZlbnQuY29udGV4dHMucHVzaCh7XG4gICAgICAgICAgICBuYW1lOiAnc3RhY2tzOmZzJyxcbiAgICAgICAgICAgIHZlcnNpb246IHRoaXMudmVyc2lvbiB8fCAndmVyc2lvbi1ub3Qtc2V0JyxcbiAgICAgICAgICAgIHN0b3JlOiB7XG4gICAgICAgICAgICAgICBjbGllbnQ6IHRoaXMuY2xpZW50LFxuICAgICAgICAgICAgICAgb3B0aW9uczogdGhpcy5vcHRpb25zXG4gICAgICAgICAgICB9XG4gICAgICAgICB9KVxuICAgICAgfSlcblxuICAgICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAvLyByb3V0ZXIub248R2V0TWFueU9iamVjdHNFdmVudDxTdGFja09iamVjdD4+KEV2ZW50U2V0LkdldE1hbnlPYmplY3RzLCBhc3luYyAoZXZlbnQ6IEdldE1hbnlPYmplY3RzRXZlbnQ8U3RhY2tPYmplY3Q+KSA9PiB7XG4gICAgICAvLyAgICBsZXQgbW9kZWxEaXIgPSB0aGlzLmdldE1vZGVsRGlyKGV2ZW50Lm1vZGVsLm5hbWUpXG4gICAgICAvLyAgICBsZXQgcmVxQ3Vyc29yID0gZXZlbnQub3B0aW9ucy5jdXJzb3IgfHwgJydcbiAgICAgIC8vICAgIGxldCByZXFDb3VudCA9IGV2ZW50Lm9wdGlvbnMubGltaXQgPT0gbnVsbCA/IDEwMCA6IGV2ZW50Lm9wdGlvbnMubGltaXRcblxuICAgICAgLy8gICAgLy8gSWdub3JlIGFueSBUZW1wIGZpbGVzIHRoYXQgbWF5IGJlIGluIHRoZSBkaXJlY3RvcnlcbiAgICAgIC8vICAgIGxldCBmaWxlcyA9IGF3YWl0IGZzLnJlYWRkaXIobW9kZWxEaXIpXG4gICAgICAvLyAgICBmaWxlcyA9IGZpbGVzLmZpbHRlcihpdCA9PiBwYXRoLnBhcnNlKGl0KS5leHQgIT09IFRlbXBGaWxlRXh0KVxuICAgICAgLy8gICAgZmlsZXMuc29ydCgpXG5cbiAgICAgIC8vICAgIGxldCBjdXJzb3IgPSAnJ1xuICAgICAgLy8gICAgbGV0IHN0YXJ0SW5kZXggPSAwXG4gICAgICAvLyAgICBsZXQgcmVxdWVzdGVkRmlsZXMgPSBuZXcgQXJyYXk8c3RyaW5nPigpXG5cbiAgICAgIC8vICAgIC8vIFRoZSBjdXJzb3IgYmVjb21lcyB0aGUgbmV4dCBmaWxlIG9uZSBpbiB0aGUgc29ydGVkIGxpc3RcbiAgICAgIC8vICAgIGlmIChyZXFDdXJzb3IgIT09ICcnKSB7XG4gICAgICAvLyAgICAgICBsZXQgbmFtZXMgPSBmaWxlcy5tYXAoZiA9PiBwYXRoLnBhcnNlKGYpLm5hbWUpXG5cbiAgICAgIC8vICAgICAgIGxldCBkZWNvZGVkQ3Vyc29yID0gQnVmZmVyLmZyb20ocmVxQ3Vyc29yLCAnYmFzZTY0JykudG9TdHJpbmcoJ2FzY2lpJylcbiAgICAgIC8vICAgICAgIGxldCBmb3VuZCA9IG5hbWVzLmZpbmRJbmRleChpdCA9PiBpdCA9PT0gZGVjb2RlZEN1cnNvcilcblxuICAgICAgLy8gICAgICAgaWYgKGZvdW5kIDwgMCkge1xuICAgICAgLy8gICAgICAgICAgZm91bmQgPSAwXG4gICAgICAvLyAgICAgICAgICBldmVudC53YXNDdXJzb3JGb3VuZCA9IGZhbHNlXG4gICAgICAvLyAgICAgICB9IGVsc2Uge1xuICAgICAgLy8gICAgICAgICAgc3RhcnRJbmRleCA9IGZvdW5kXG4gICAgICAvLyAgICAgICB9XG4gICAgICAvLyAgICB9XG5cbiAgICAgIC8vICAgIGxldCBlbmRJbmRleCA9IHJlcUNvdW50ICsgc3RhcnRJbmRleFxuICAgICAgLy8gICAgcmVxdWVzdGVkRmlsZXMgPSBmaWxlcy5zbGljZShzdGFydEluZGV4LCBlbmRJbmRleClcblxuICAgICAgLy8gICAgaWYgKGVuZEluZGV4IDwgKGZpbGVzLmxlbmd0aCAtIDEpKSB7XG4gICAgICAvLyAgICAgICBsZXQgcGFyc2VkID0gcGF0aC5wYXJzZShwYXRoLmpvaW4odGhpcy5iYXNlRGlyLCBmaWxlc1tlbmRJbmRleF0pKVxuICAgICAgLy8gICAgICAgY3Vyc29yID0gcGFyc2VkLm5hbWVcbiAgICAgIC8vICAgIH0gZWxzZSB7XG4gICAgICAvLyAgICAgICBjdXJzb3IgPSAnJ1xuICAgICAgLy8gICAgfVxuXG4gICAgICAvLyAgICBsZXQgb2JqZWN0cyA9IG5ldyBBcnJheTxTdGFja09iamVjdD4oKVxuXG4gICAgICAvLyAgICBmb3IgKGxldCBmaWxlIG9mIHJlcXVlc3RlZEZpbGVzKSB7XG4gICAgICAvLyAgICAgICBvYmplY3RzLnB1c2goYXdhaXQgZnMucmVhZEpzb24ocGF0aC5qb2luKG1vZGVsRGlyLCBmaWxlKSkpXG4gICAgICAvLyAgICB9XG5cbiAgICAgIC8vICAgIGV2ZW50LnJlc3VsdHMgPSB7XG4gICAgICAvLyAgICAgICBjdXJzb3I6IGN1cnNvciA9PT0gJycgPyAnJyA6IEJ1ZmZlci5mcm9tKGN1cnNvcikudG9TdHJpbmcoJ2Jhc2U2NCcpLFxuICAgICAgLy8gICAgICAgaXRlbXM6IG9iamVjdHNcbiAgICAgIC8vICAgIH1cbiAgICAgIC8vIH0pXG5cbiAgICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgcm91dGVyLm9uPE9iamVjdFNhdmVFdmVudDxTdGFja09iamVjdD4+KEV2ZW50U2V0Lk9iamVjdFNhdmVkLCBhc3luYyAoZXZlbnQ6IE9iamVjdFNhdmVFdmVudDxTdGFja09iamVjdD4pID0+IHtcbiAgICAgICAgIC8qXG4gICAgICAgICAgICByZWFkb25seSBtb2RlbDogSU1vZGVsXG4gICAgICAgICAgICByZWFkb25seSBvYmplY3Q6IFRcbiAgICAgICAgICAgIHJlYWRvbmx5IHNlcmlhbGl6ZTogSVByb3h5T2JqZWN0XG4gICAgICAgICAqL1xuICAgICAgICAgbGV0IHNhdmVkID0gYXdhaXQgdGhpcy5jbGllbnQuSXRlbXMoZXZlbnQubW9kZWwubmFtZSlcbiAgICAgICAgICAgIC5wdXQoZXZlbnQuc2VyaWFsaXplLnRvSnMoKSlcbiAgICAgICAgICAgIC4kPFN0YWNrT2JqZWN0PigpXG5cbiAgICAgICAgIGNvbnNvbGUuZGlyKHNhdmVkLCB7IGRlcHRoOiBudWxsIH0pXG4gICAgICB9KVxuXG4gICAgICAvLyAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIC8vIHJvdXRlci5vbjxHZXRPYmplY3RFdmVudDxTdGFja09iamVjdD4+KEV2ZW50U2V0LkdldE9iamVjdCwgYXN5bmMgKGV2ZW50OiBHZXRPYmplY3RFdmVudDxTdGFja09iamVjdD4pID0+IHtcbiAgICAgIC8vICAgIGxldCBvYmplY3RQYXRoID0gdGhpcy5nZXRPYmplY3RQYXRoKGV2ZW50Lm1vZGVsLmlkLCBldmVudC5pZClcblxuICAgICAgLy8gICAgdHJ5IHtcbiAgICAgIC8vICAgICAgIGxldCBvYmogPSBhd2FpdCBmcy5yZWFkSnNvbihvYmplY3RQYXRoKVxuICAgICAgLy8gICAgICAgZXZlbnQub2JqZWN0ID0gb2JqXG4gICAgICAvLyAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIC8vICAgICAgIHRocm93IG5ldyBFcnJvcihgW3N0YWNrcy1mc10gRmFpbGVkIHRvIHJldHJpZXZlIE9iamVjdCAke2V2ZW50LmlkfS4gUmVhc29uICR7ZXJyfWApXG4gICAgICAvLyAgICB9XG4gICAgICAvLyB9KVxuXG4gICAgICAvLyAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIC8vIHJvdXRlci5vbjxEZWxldGVPYmplY3RFdmVudDxTdGFja09iamVjdD4+KEV2ZW50U2V0Lk9iamVjdERlbGV0ZWQsIGFzeW5jIChldmVudDogRGVsZXRlT2JqZWN0RXZlbnQ8U3RhY2tPYmplY3Q+KSA9PiB7XG4gICAgICAvLyAgICBsZXQgb2JqZWN0UGF0aCA9IHRoaXMuZ2V0T2JqZWN0UGF0aChldmVudC5tb2RlbC5uYW1lLCBldmVudC5vYmplY3QuaWQpXG5cbiAgICAgIC8vICAgIHRyeSB7XG4gICAgICAvLyAgICAgICBhd2FpdCBmcy5yZW1vdmUob2JqZWN0UGF0aClcbiAgICAgIC8vICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgLy8gICAgICAgdGhyb3cgbmV3IEVycm9yKGBbc3RhY2tzLWZzXSBGYWlsZWQgdG8gZGVsZXRlIGFuIE9iamVjdCAke2V2ZW50Lm9iamVjdC5pZH0uIFJlYXNvbiAke2Vycn1gKVxuICAgICAgLy8gICAgfVxuICAgICAgLy8gfSlcblxuICAgICAgLy8gLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAvLyByb3V0ZXIub248VXBkYXRlT2JqZWN0RXZlbnQ8U3RhY2tPYmplY3Q+PihFdmVudFNldC5PYmplY3RVcGRhdGVkLCBhc3luYyAoZXZlbnQ6IFVwZGF0ZU9iamVjdEV2ZW50PFN0YWNrT2JqZWN0PikgPT4ge1xuICAgICAgLy8gICAgbGV0IG9iamVjdFBhdGggPSB0aGlzLmdldE9iamVjdFBhdGgoZXZlbnQubW9kZWwubmFtZSwgZXZlbnQub2JqZWN0LmlkKVxuICAgICAgLy8gICAgbGV0IHRlbXBQYXRoID0gYCR7b2JqZWN0UGF0aH0ke1RlbXBGaWxlRXh0fWBcblxuICAgICAgLy8gICAgdHJ5IHtcbiAgICAgIC8vICAgICAgIGF3YWl0IGZzLmFjY2VzcyhvYmplY3RQYXRoKVxuXG4gICAgICAvLyAgICAgICBldmVudC5leGlzdHMgPSBFeGlzdFN0YXRlLkV4aXN0c1xuXG4gICAgICAvLyAgICAgICAvLyBXZSBlbnN1cmUgd2UgYWx3YXlzIGhhdmUgYSBjb3B5IG9mIHRoZSBvcmlnaW5hbCB1bnRpbCB3ZSdyZSBkb25lIHdyaXRpbmdcbiAgICAgIC8vICAgICAgIC8vIHRoZSBjaGFuZ2VkIGZpbGUuIFdlIHJlbW92ZSB0aGUgY29weSBpZiB0aGUgd3JpdGUgaXMgc3VjZXNzZnVsLCBvdGhlcndpc2VcbiAgICAgIC8vICAgICAgIC8vIHdlIHJvbGxiYWNrIHRoZSBjaGFuZ2UgYW5kIGtlZXAgdGhlIGNvcHkuXG4gICAgICAvLyAgICAgICBhd2FpdCBmcy5jb3B5KG9iamVjdFBhdGgsIHRlbXBQYXRoKVxuICAgICAgLy8gICAgICAgYXdhaXQgZnMucmVtb3ZlKG9iamVjdFBhdGgpXG4gICAgICAvLyAgICAgICBhd2FpdCBmcy53cml0ZUpzb24ob2JqZWN0UGF0aCwgZXZlbnQuc2VyaWFsaXplLnRvSnMoKSwgeyBzcGFjZXM6IDIgfSlcbiAgICAgIC8vICAgICAgIGV2ZW50LnVwZGF0ZWQgPSBcbiAgICAgIC8vICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgLy8gICAgICAgdHJ5IHtcbiAgICAgIC8vICAgICAgICAgIGF3YWl0IGZzLmFjY2Vzcyh0ZW1wUGF0aClcbiAgICAgIC8vICAgICAgICAgIGF3YWl0IGZzLm1vdmUodGVtcFBhdGgsIG9iamVjdFBhdGgsIHsgb3ZlcndyaXRlOiB0cnVlIH0pXG4gICAgICAvLyAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIC8vICAgICAgICAgIC8vIHN3YWxsb3dcbiAgICAgIC8vICAgICAgIH1cblxuICAgICAgLy8gICAgICAgdGhyb3cgbmV3IEVycm9yKGBbc3RhY2tzLWZzXSBGYWlsZWQgdG8gdXBkYXRlIGFuIE9iamVjdCAke2V2ZW50Lm9iamVjdC5pZH0uIFJlYXNvbiAke2Vycn1gKVxuICAgICAgLy8gICAgfSBmaW5hbGx5IHtcbiAgICAgIC8vICAgICAgIHRyeSB7XG4gICAgICAvLyAgICAgICAgICBhd2FpdCBmcy5hY2Nlc3ModGVtcFBhdGgpXG4gICAgICAvLyAgICAgICAgICBhd2FpdCBmcy5yZW1vdmUodGVtcFBhdGgpXG4gICAgICAvLyAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIC8vICAgICAgICAgIC8vIHN3YWxsb3dcbiAgICAgIC8vICAgICAgIH1cbiAgICAgIC8vICAgIH1cbiAgICAgIC8vIH0pXG4gICB9XG5cbiAgIC8vIHByaXZhdGUgZ2V0TW9kZWxEaXIobW9kZWxOYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgLy8gICAgcmV0dXJuIHBhdGguam9pbih0aGlzLmJhc2VEaXIsIG1vZGVsTmFtZSlcbiAgIC8vIH1cblxuICAgLy8gcHJpdmF0ZSBnZXRPYmplY3RQYXRoKG1vZGVsTmFtZTogc3RyaW5nLCBvYmplY3RJZDogc3RyaW5nKTogc3RyaW5nIHtcbiAgIC8vICAgIGxldCBtb2RlbERpciA9IHRoaXMuZ2V0TW9kZWxEaXIobW9kZWxOYW1lKVxuICAgLy8gICAgcmV0dXJuIHBhdGguam9pbihtb2RlbERpciwgYCR7b2JqZWN0SWR9Lmpzb25gKVxuICAgLy8gfVxuXG4gICAvLyBwcml2YXRlIGFzeW5jIHNldHVwTW9kZWwobW9kZWw6IElNb2RlbCk6IFByb21pc2U8dm9pZD4ge1xuICAgLy8gICAgbGV0IG1vZGVsRGlyID0gdGhpcy5nZXRNb2RlbERpcihtb2RlbC5uYW1lKVxuICAgLy8gICAgYXdhaXQgZnMuZW5zdXJlRGlyKG1vZGVsRGlyKVxuICAgLy8gfVxuXG4gICAvLyBwcml2YXRlIGFzeW5jIHdyaXRlT2JqZWN0KG1vZGVsOiBJTW9kZWwsIG9iamVjdDogU3RhY2tPYmplY3QpOiBQcm9taXNlPHZvaWQ+IHtcbiAgIC8vICAgIGxldCBvYmogPSB7fVxuXG4gICAvLyAgICBmb3IobGV0IG1lbWJlciBvZiBtb2RlbC5tZW1iZXJzKSB7XG4gICAvLyAgICAgICBtZW1iZXIudmFsdWUuXG4gICAvLyAgICB9XG4gICAvLyB9XG59Il19