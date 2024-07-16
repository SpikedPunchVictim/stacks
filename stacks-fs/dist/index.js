"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FsPlugin = void 0;
const path = require("path");
const stacks_1 = require("@spikedpunch/stacks");
const fs = require("fs-extra");
const TempFileExt = '.temp';
/**
 * File system plugin for Stacks
 *
 * Notes:
 *    * GetMany cursor points to the next file in a sorted list
 */
class FsPlugin {
    constructor(baseDir, options) {
        this.baseDir = baseDir;
        this.name = 'stacks-fs';
        this.version = undefined; // The plugin version
        // TODO: Normalize baseDir (~, .., etc)
        this.options = options || {};
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
        await fs.ensureDir(this.baseDir);
        //-------------------------------------------------------------------------------------------
        router.on(stacks_1.EventSet.Bootstrap, async (event) => {
            for (let model of stack.get.models()) {
                await this.setupModel(model);
            }
        });
        //-------------------------------------------------------------------------------------------
        router.on(stacks_1.EventSet.GetManyObjects, async (event) => {
            let modelDir = this.getModelDir(event.model.name);
            let reqCursor = event.page.cursor || '';
            let reqCount = event.page.limit == null ? 100 : event.page.limit;
            // Ignore any Temp files that may be in the directory
            let files = await fs.readdir(modelDir);
            files = files.filter(it => path.parse(it).ext !== TempFileExt);
            files.sort();
            let cursor = '';
            let startIndex = 0;
            let requestedFiles = new Array();
            // The cursor becomes the next file one in the sorted list
            if (reqCursor !== '') {
                let names = files.map(f => path.parse(f).name);
                let decodedCursor = Buffer.from(reqCursor, 'base64').toString('ascii');
                let found = names.findIndex(it => it === decodedCursor);
                if (found < 0) {
                    found = 0;
                    event.wasCursorFound = false;
                }
                else {
                    startIndex = found;
                }
            }
            let endIndex = reqCount + startIndex;
            requestedFiles = files.slice(startIndex, endIndex);
            if (endIndex < (files.length - 1)) {
                let parsed = path.parse(path.join(this.baseDir, files[endIndex]));
                cursor = parsed.name;
            }
            else {
                cursor = '';
            }
            let objects = new Array();
            for (let file of requestedFiles) {
                objects.push(await fs.readJson(path.join(modelDir, file)));
            }
            event.results = {
                cursor: cursor === '' ? '' : Buffer.from(cursor).toString('base64'),
                items: objects
            };
        });
        router.on(stacks_1.EventSet.GetStoreContext, async (event) => {
            if (this.version === undefined) {
                let pkg = await fs.readJson(path.join(__dirname, '..', 'package.json'));
                this.version = pkg.version;
            }
            event.contexts.push({
                name: 'stacks:fs',
                version: this.version || 'version-not-set',
                store: {
                    baseDir: this.baseDir,
                    options: this.options,
                    fs: fs
                }
            });
        });
        //-------------------------------------------------------------------------------------------
        router.on(stacks_1.EventSet.ObjectSaved, async (event) => {
            let modelDir = this.getModelDir(event.model.name);
            try {
                await fs.ensureDir(modelDir);
                await fs.writeJson(path.join(modelDir, `${event.serialize.id}.json`), event.serialize.toJs(), { spaces: 2 });
            }
            catch (err) {
                throw new Error(`[stacks-fs] Failed to save object. Reason: ${err}`);
            }
        });
        //-------------------------------------------------------------------------------------------
        router.on(stacks_1.EventSet.GetObject, async (event) => {
            let objectPath = this.getObjectPath(event.model.id, event.id);
            try {
                let obj = await fs.readJson(objectPath);
                event.object = obj;
            }
            catch (err) {
                throw new Error(`[stacks-fs] Failed to retrieve Object ${event.id}. Reason ${err}`);
            }
        });
        //-------------------------------------------------------------------------------------------
        router.on(stacks_1.EventSet.ObjectDeleted, async (event) => {
            let objectPath = this.getObjectPath(event.model.name, event.object.id);
            try {
                await fs.remove(objectPath);
            }
            catch (err) {
                throw new Error(`[stacks-fs] Failed to delete an Object ${event.object.id}. Reason ${err}`);
            }
        });
        //-------------------------------------------------------------------------------------------
        router.on(stacks_1.EventSet.ObjectUpdated, async (event) => {
            let objectPath = this.getObjectPath(event.model.name, event.object.id);
            try {
                await fs.access(objectPath);
                event.exists = stacks_1.ExistState.Exists;
                event.updated = await fs.readJson(objectPath);
            }
            catch (err) {
                event.exists = stacks_1.ExistState.DoesNotExist;
            }
        });
    }
    getModelDir(modelName) {
        return path.join(this.baseDir, modelName);
    }
    getObjectPath(modelName, objectId) {
        let modelDir = this.getModelDir(modelName);
        return path.join(modelDir, `${objectId}.json`);
    }
    async setupModel(model) {
        let modelDir = this.getModelDir(model.name);
        await fs.ensureDir(modelDir);
    }
}
exports.FsPlugin = FsPlugin;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNkJBQTRCO0FBQzVCLGdEQWU0QjtBQUU1QiwrQkFBOEI7QUFFOUIsTUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFBO0FBTTNCOzs7OztHQUtHO0FBQ0gsTUFBYSxRQUFRO0lBTWxCLFlBQXFCLE9BQWUsRUFBRSxPQUFrQjtRQUFuQyxZQUFPLEdBQVAsT0FBTyxDQUFRO1FBTDNCLFNBQUksR0FBVyxXQUFXLENBQUE7UUFHM0IsWUFBTyxHQUF1QixTQUFTLENBQUEsQ0FBQyxxQkFBcUI7UUFHbEUsdUNBQXVDO1FBQ3ZDLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxJQUFJLEVBQUUsQ0FBQTtJQUMvQixDQUFDO0lBR0Q7Ozs7Ozs7Ozs7Ozs7OztNQWVFO0lBQ0YsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFhLEVBQUUsTUFBb0I7UUFDNUMsTUFBTSxFQUFFLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUVoQyw2RkFBNkY7UUFDN0YsTUFBTSxDQUFDLEVBQUUsQ0FBaUIsaUJBQVEsQ0FBQyxTQUFTLEVBQUUsS0FBSyxFQUFFLEtBQXFCLEVBQUUsRUFBRTtZQUMzRSxLQUFLLElBQUksS0FBSyxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQztnQkFDcEMsTUFBTSxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFBO1lBQy9CLENBQUM7UUFDSixDQUFDLENBQUMsQ0FBQTtRQUVGLDZGQUE2RjtRQUM3RixNQUFNLENBQUMsRUFBRSxDQUFtQyxpQkFBUSxDQUFDLGNBQWMsRUFBRSxLQUFLLEVBQUUsS0FBdUMsRUFBRSxFQUFFO1lBQ3BILElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMs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LFdBQVcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDM0MsTUFBTSxFQUFFLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFBO0lBQy9CLENBQUM7Q0FTSDtBQW5MRCw0QkFtTEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQge1xuICAgQm9vdHN0cmFwRXZlbnQsXG4gICBFdmVudFNldCxcbiAgIEV4aXN0U3RhdGUsXG4gICBHZXRPYmplY3RFdmVudCxcbiAgIElQbHVnaW4sXG4gICBJU3RhY2ssXG4gICBJRXZlbnRSb3V0ZXIsXG4gICBTdGFja09iamVjdCxcbiAgIEdldE1hbnlPYmplY3RzRXZlbnQsXG4gICBHZXRTdG9yZUNvbnRleHRFdmVudCxcbiAgIElNb2RlbCxcbiAgIE9iamVjdERlbGV0ZUV2ZW50LFxuICAgT2JqZWN0U2F2ZUV2ZW50LFxuICAgT2JqZWN0VXBkYXRlRXZlbnRcbn0gZnJvbSAnQHNwaWtlZHB1bmNoL3N0YWNrcydcblxuaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMtZXh0cmEnXG5cbmNvbnN0IFRlbXBGaWxlRXh0ID0gJy50ZW1wJ1xuXG5leHBvcnQgdHlwZSBGc09wdGlvbnMgPSB7XG4gICBvYmplY3ROYW1lRmllbGQ/OiBzdHJpbmcgICAvLyBUaGUgZmllbGQgdG8gdXNlIGZvciB0aGUgT2JqZWN0J3MgZmlsZSBuYW1lLiBEZWZhdWx0cyB0byAnaWQnXG59XG5cbi8qKlxuICogRmlsZSBzeXN0ZW0gcGx1Z2luIGZvciBTdGFja3NcbiAqIFxuICogTm90ZXM6XG4gKiAgICAqIEdldE1hbnkgY3Vyc29yIHBvaW50cyB0byB0aGUgbmV4dCBmaWxlIGluIGEgc29ydGVkIGxpc3RcbiAqL1xuZXhwb3J0IGNsYXNzIEZzUGx1Z2luIGltcGxlbWVudHMgSVBsdWdpbiB7XG4gICByZWFkb25seSBuYW1lOiBzdHJpbmcgPSAnc3RhY2tzLWZzJ1xuICAgcmVhZG9ubHkgb3B0aW9uczogRnNPcHRpb25zXG5cbiAgIHByaXZhdGUgdmVyc2lvbjogc3RyaW5nIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkIC8vIFRoZSBwbHVnaW4gdmVyc2lvblxuXG4gICBjb25zdHJ1Y3RvcihyZWFkb25seSBiYXNlRGlyOiBzdHJpbmcsIG9wdGlvbnM6IEZzT3B0aW9ucykge1xuICAgICAgLy8gVE9ETzogTm9ybWFsaXplIGJhc2VEaXIgKH4sIC4uLCBldGMpXG4gICAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zIHx8IHt9XG4gICB9XG5cblxuICAgLypcbmV4cG9ydCBlbnVtIEV2ZW50U2V0IHtcbiAgIEJvb3RzdHJhcCA9ICdib290c3RyYXAnLFxuICAgR2V0TWFueU9iamVjdHMgPSAnZ2V0LW1hbnktb2JqZWN0cycsXG4gICBHZXRNb2RlbCA9ICdnZXQtbW9kZWwnLFxuICAgR2V0T2JqZWN0ID0gJ2dldC1vYmplY3QnLFxuICAgSGFzSWQgPSAnaGFzLWlkJyxcbiAgIE1vZGVsQ3JlYXRlZCA9ICdtb2RlbC1jcmVhdGVkJyxcbiAgIE1vZGVsRGVsZXRlZCA9ICdtb2RlbC1kZWxldGVkJyxcbiAgIE1vZGVsVXBkYXRlZCA9ICdtb2RlbC11cGRhdGVkJyxcbiAgIE9iamVjdENyZWF0ZWQgPSAnb2JqZWN0LWNyZWF0ZWQnLFxuICAgT2JqZWN0RGVsZXRlZCA9ICdvYmplY3QtZGVsZXRlZCcsXG4gICBPYmplY3RVcGRhdGVkID0gJ29iamVjdC11cGRhdGVkJyxcbiAgIE9iamVjdFNhdmVkID0gJ29iamVjdC1zYXZlZCdcbn1cbiAgICovXG4gICBhc3luYyBzZXR1cChzdGFjazogSVN0YWNrLCByb3V0ZXI6IElFdmVudFJvdXRlcik6IFByb21pc2U8dm9pZD4ge1xuICAgICAgYXdhaXQgZnMuZW5zdXJlRGlyKHRoaXMuYmFzZURpcilcblxuICAgICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICByb3V0ZXIub248Qm9vdHN0cmFwRXZlbnQ+KEV2ZW50U2V0LkJvb3RzdHJhcCwgYXN5bmMgKGV2ZW50OiBCb290c3RyYXBFdmVudCkgPT4ge1xuICAgICAgICAgZm9yIChsZXQgbW9kZWwgb2Ygc3RhY2suZ2V0Lm1vZGVscygpKSB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnNldHVwTW9kZWwobW9kZWwpXG4gICAgICAgICB9XG4gICAgICB9KVxuXG4gICAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgIHJvdXRlci5vbjxHZXRNYW55T2JqZWN0c0V2ZW50PFN0YWNrT2JqZWN0Pj4oRXZlbnRTZXQuR2V0TWFueU9iamVjdHMsIGFzeW5jIChldmVudDogR2V0TWFueU9iamVjdHNFdmVudDxTdGFja09iamVjdD4pID0+IHtcbiAgICAgICAgIGxldCBtb2RlbERpciA9IHRoaXMuZ2V0TW9kZWxEaXIoZXZlbnQubW9kZWwubmFtZSlcbiAgICAgICAgIGxldCByZXFDdXJzb3IgPSBldmVudC5wYWdlLmN1cnNvciB8fCAnJ1xuICAgICAgICAgbGV0IHJlcUNvdW50ID0gZXZlbnQucGFnZS5saW1pdCA9PSBudWxsID8gMTAwIDogZXZlbnQucGFnZS5saW1pdFxuXG4gICAgICAgICAvLyBJZ25vcmUgYW55IFRlbXAgZmlsZXMgdGhhdCBtYXkgYmUgaW4gdGhlIGRpcmVjdG9yeVxuICAgICAgICAgbGV0IGZpbGVzID0gYXdhaXQgZnMucmVhZGRpcihtb2RlbERpcilcbiAgICAgICAgIGZpbGVzID0gZmlsZXMuZmlsdGVyKGl0ID0+IHBhdGgucGFyc2UoaXQpLmV4dCAhPT0gVGVtcEZpbGVFeHQpXG4gICAgICAgICBmaWxlcy5zb3J0KClcblxuICAgICAgICAgbGV0IGN1cnNvciA9ICcnXG4gICAgICAgICBsZXQgc3RhcnRJbmRleCA9IDBcbiAgICAgICAgIGxldCByZXF1ZXN0ZWRGaWxlcyA9IG5ldyBBcnJheTxzdHJpbmc+KClcblxuICAgICAgICAgLy8gVGhlIGN1cnNvciBiZWNvbWVzIHRoZSBuZXh0IGZpbGUgb25lIGluIHRoZSBzb3J0ZWQgbGlzdFxuICAgICAgICAgaWYgKHJlcUN1cnNvciAhPT0gJycpIHtcbiAgICAgICAgICAgIGxldCBuYW1lcyA9IGZpbGVzLm1hcChmID0+IHBhdGgucGFyc2UoZikubmFtZSlcblxuICAgICAgICAgICAgbGV0IGRlY29kZWRDdXJzb3IgPSBCdWZmZXIuZnJvbShyZXFDdXJzb3IsICdiYXNlNjQnKS50b1N0cmluZygnYXNjaWknKVxuICAgICAgICAgICAgbGV0IGZvdW5kID0gbmFtZXMuZmluZEluZGV4KGl0ID0+IGl0ID09PSBkZWNvZGVkQ3Vyc29yKVxuXG4gICAgICAgICAgICBpZiAoZm91bmQgPCAwKSB7XG4gICAgICAgICAgICAgICBmb3VuZCA9IDBcbiAgICAgICAgICAgICAgIGV2ZW50Lndhc0N1cnNvckZvdW5kID0gZmFsc2VcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICBzdGFydEluZGV4ID0gZm91bmRcbiAgICAgICAgICAgIH1cbiAgICAgICAgIH1cblxuICAgICAgICAgbGV0IGVuZEluZGV4ID0gcmVxQ291bnQgKyBzdGFydEluZGV4XG4gICAgICAgICByZXF1ZXN0ZWRGaWxlcyA9IGZpbGVzLnNsaWNlKHN0YXJ0SW5kZXgsIGVuZEluZGV4KVxuXG4gICAgICAgICBpZiAoZW5kSW5kZXggPCAoZmlsZXMubGVuZ3RoIC0gMSkpIHtcbiAgICAgICAgICAgIGxldCBwYXJzZWQgPSBwYXRoLnBhcnNlKHBhdGguam9pbih0aGlzLmJhc2VEaXIsIGZpbGVzW2VuZEluZGV4XSkpXG4gICAgICAgICAgICBjdXJzb3IgPSBwYXJzZWQubmFtZVxuICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGN1cnNvciA9ICcnXG4gICAgICAgICB9XG5cbiAgICAgICAgIGxldCBvYmplY3RzID0gbmV3IEFycmF5PFN0YWNrT2JqZWN0PigpXG5cbiAgICAgICAgIGZvciAobGV0IGZpbGUgb2YgcmVxdWVzdGVkRmlsZXMpIHtcbiAgICAgICAgICAgIG9iamVjdHMucHVzaChhd2FpdCBmcy5yZWFkSnNvbihwYXRoLmpvaW4obW9kZWxEaXIsIGZpbGUpKSlcbiAgICAgICAgIH1cblxuICAgICAgICAgZXZlbnQucmVzdWx0cyA9IHtcbiAgICAgICAgICAgIGN1cnNvcjogY3Vyc29yID09PSAnJyA/ICcnIDogQnVmZmVyLmZyb20oY3Vyc29yKS50b1N0cmluZygnYmFzZTY0JyksXG4gICAgICAgICAgICBpdGVtczogb2JqZWN0c1xuICAgICAgICAgfVxuICAgICAgfSlcblxuICAgICAgcm91dGVyLm9uKEV2ZW50U2V0LkdldFN0b3JlQ29udGV4dCwgYXN5bmMgKGV2ZW50OiBHZXRTdG9yZUNvbnRleHRFdmVudCkgPT4ge1xuICAgICAgICAgaWYodGhpcy52ZXJzaW9uID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGxldCBwa2cgPSBhd2FpdCBmcy5yZWFkSnNvbihwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4nLCAncGFja2FnZS5qc29uJykpXG4gICAgICAgICAgICB0aGlzLnZlcnNpb24gPSBwa2cudmVyc2lvblxuICAgICAgICAgfVxuXG4gICAgICAgICBldmVudC5jb250ZXh0cy5wdXNoKHtcbiAgICAgICAgICAgIG5hbWU6ICdzdGFja3M6ZnMnLFxuICAgICAgICAgICAgdmVyc2lvbjogdGhpcy52ZXJzaW9uIHx8ICd2ZXJzaW9uLW5vdC1zZXQnLFxuICAgICAgICAgICAgc3RvcmU6IHtcbiAgICAgICAgICAgICAgIGJhc2VEaXI6IHRoaXMuYmFzZURpcixcbiAgICAgICAgICAgICAgIG9wdGlvbnM6IHRoaXMub3B0aW9ucyxcbiAgICAgICAgICAgICAgIGZzOiBmc1xuICAgICAgICAgICAgfVxuICAgICAgICAgfSlcbiAgICAgIH0pXG5cbiAgICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgcm91dGVyLm9uPE9iamVjdFNhdmVFdmVudDxTdGFja09iamVjdD4+KEV2ZW50U2V0Lk9iamVjdFNhdmVkLCBhc3luYyAoZXZlbnQ6IE9iamVjdFNhdmVFdmVudDxTdGFja09iamVjdD4pID0+IHtcbiAgICAgICAgIGxldCBtb2RlbERpciA9IHRoaXMuZ2V0TW9kZWxEaXIoZXZlbnQubW9kZWwubmFtZSlcblxuICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGF3YWl0IGZzLmVuc3VyZURpcihtb2RlbERpcilcbiAgICAgICAgICAgIGF3YWl0IGZzLndyaXRlSnNvbihwYXRoLmpvaW4obW9kZWxEaXIsIGAke2V2ZW50LnNlcmlhbGl6ZS5pZH0uanNvbmApLCBldmVudC5zZXJpYWxpemUudG9KcygpLCB7IHNwYWNlczogMiB9KVxuICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFtzdGFja3MtZnNdIEZhaWxlZCB0byBzYXZlIG9iamVjdC4gUmVhc29uOiAke2Vycn1gKVxuICAgICAgICAgfVxuICAgICAgfSlcblxuICAgICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICByb3V0ZXIub248R2V0T2JqZWN0RXZlbnQ8U3RhY2tPYmplY3Q+PihFdmVudFNldC5HZXRPYmplY3QsIGFzeW5jIChldmVudDogR2V0T2JqZWN0RXZlbnQ8U3RhY2tPYmplY3Q+KSA9PiB7XG4gICAgICAgICBsZXQgb2JqZWN0UGF0aCA9IHRoaXMuZ2V0T2JqZWN0UGF0aChldmVudC5tb2RlbC5pZCwgZXZlbnQuaWQpXG5cbiAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsZXQgb2JqID0gYXdhaXQgZnMucmVhZEpzb24ob2JqZWN0UGF0aClcbiAgICAgICAgICAgIGV2ZW50Lm9iamVjdCA9IG9ialxuICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFtzdGFja3MtZnNdIEZhaWxlZCB0byByZXRyaWV2ZSBPYmplY3QgJHtldmVudC5pZH0uIFJlYXNvbiAke2Vycn1gKVxuICAgICAgICAgfVxuICAgICAgfSlcblxuICAgICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICByb3V0ZXIub248T2JqZWN0RGVsZXRlRXZlbnQ8U3RhY2tPYmplY3Q+PihFdmVudFNldC5PYmplY3REZWxldGVkLCBhc3luYyAoZXZlbnQ6IE9iamVjdERlbGV0ZUV2ZW50PFN0YWNrT2JqZWN0PikgPT4ge1xuICAgICAgICAgbGV0IG9iamVjdFBhdGggPSB0aGlzLmdldE9iamVjdFBhdGgoZXZlbnQubW9kZWwubmFtZSwgZXZlbnQub2JqZWN0LmlkKVxuXG4gICAgICAgICB0cnkge1xuICAgICAgICAgICAgYXdhaXQgZnMucmVtb3ZlKG9iamVjdFBhdGgpXG4gICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgW3N0YWNrcy1mc10gRmFpbGVkIHRvIGRlbGV0ZSBhbiBPYmplY3QgJHtldmVudC5vYmplY3QuaWR9LiBSZWFzb24gJHtlcnJ9YClcbiAgICAgICAgIH1cbiAgICAgIH0pXG5cbiAgICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgcm91dGVyLm9uPE9iamVjdFVwZGF0ZUV2ZW50PFN0YWNrT2JqZWN0Pj4oRXZlbnRTZXQuT2JqZWN0VXBkYXRlZCwgYXN5bmMgKGV2ZW50OiBPYmplY3RVcGRhdGVFdmVudDxTdGFja09iamVjdD4pID0+IHtcbiAgICAgICAgIGxldCBvYmplY3RQYXRoID0gdGhpcy5nZXRPYmplY3RQYXRoKGV2ZW50Lm1vZGVsLm5hbWUsIGV2ZW50Lm9iamVjdC5pZClcblxuICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGF3YWl0IGZzLmFjY2VzcyhvYmplY3RQYXRoKVxuXG4gICAgICAgICAgICBldmVudC5leGlzdHMgPSBFeGlzdFN0YXRlLkV4aXN0c1xuXG4gICAgICAgICAgICBldmVudC51cGRhdGVkID0gYXdhaXQgZnMucmVhZEpzb24ob2JqZWN0UGF0aClcbiAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgZXZlbnQuZXhpc3RzID0gRXhpc3RTdGF0ZS5Eb2VzTm90RXhpc3RcbiAgICAgICAgIH1cbiAgICAgIH0pXG4gICB9XG5cbiAgIHByaXZhdGUgZ2V0TW9kZWxEaXIobW9kZWxOYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuIHBhdGguam9pbih0aGlzLmJhc2VEaXIsIG1vZGVsTmFtZSlcbiAgIH1cblxuICAgcHJpdmF0ZSBnZXRPYmplY3RQYXRoKG1vZGVsTmFtZTogc3RyaW5nLCBvYmplY3RJZDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgIGxldCBtb2RlbERpciA9IHRoaXMuZ2V0TW9kZWxEaXIobW9kZWxOYW1lKVxuICAgICAgcmV0dXJuIHBhdGguam9pbihtb2RlbERpciwgYCR7b2JqZWN0SWR9Lmpzb25gKVxuICAgfVxuXG4gICBwcml2YXRlIGFzeW5jIHNldHVwTW9kZWwobW9kZWw6IElNb2RlbCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgbGV0IG1vZGVsRGlyID0gdGhpcy5nZXRNb2RlbERpcihtb2RlbC5uYW1lKVxuICAgICAgYXdhaXQgZnMuZW5zdXJlRGlyKG1vZGVsRGlyKVxuICAgfVxuXG4gICAvLyBwcml2YXRlIGFzeW5jIHdyaXRlT2JqZWN0KG1vZGVsOiBJTW9kZWwsIG9iamVjdDogU3RhY2tPYmplY3QpOiBQcm9taXNlPHZvaWQ+IHtcbiAgIC8vICAgIGxldCBvYmogPSB7fVxuXG4gICAvLyAgICBmb3IobGV0IG1lbWJlciBvZiBtb2RlbC5tZW1iZXJzKSB7XG4gICAvLyAgICAgICBtZW1iZXIudmFsdWUuXG4gICAvLyAgICB9XG4gICAvLyB9XG59Il19