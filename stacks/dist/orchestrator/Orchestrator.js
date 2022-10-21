"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Orchestrator = void 0;
const events_1 = require("../events");
const SaveObjectEvent_1 = require("../events/SaveObjectEvent");
const DeleteObjectEvent_1 = require("../events/DeleteObjectEvent");
const Event_1 = require("../events/Event");
const GetManyObjectsEvent_1 = require("../events/GetManyObjectsEvent");
const HasIdEvent_1 = require("../events/HasIdEvent");
const UpdateObjectEvent_1 = require("../events/UpdateObjectEvent");
const Model_1 = require("../Model");
const ProxyObject_1 = require("../ProxyObject");
const UidKeeper_1 = require("../UidKeeper");
const CreateObjectEvent_1 = require("../events/CreateObjectEvent");
const CreateModelEvent_1 = require("../events/CreateModelEvent");
const DeleteModelEvent_1 = require("../events/DeleteModelEvent");
const GetModelEvent_1 = require("../events/GetModelEvent");
const BootstrapEvent_1 = require("../events/BootstrapEvent");
class Orchestrator {
    constructor(context) {
        this.context = context;
    }
    get cache() {
        return this.context.cache;
    }
    get rfc() {
        return this.context.rfc;
    }
    get serializer() {
        return this.context.serializer;
    }
    get stack() {
        return this.context.stack;
    }
    get uid() {
        return this.context.uid;
    }
    async boostrap() {
        await this.rfc.create(new BootstrapEvent_1.BootstrapEvent())
            .fulfill(async (event) => {
            await this.stack.emit(Event_1.EventSet.Bootstrap, event);
        })
            .commit();
    }
    async createModel(name, params) {
        let model = await this.stack.get.model(name);
        if (model !== undefined) {
            throw new Error(`A Model with the name ${name} already exists`);
        }
        let id = await this.uid.generate();
        model = new Model_1.Model(name, id, this.context);
        await model.append(params);
        this.cache.saveModel(model);
        await this.rfc.create(new CreateModelEvent_1.CreateModelEvent(model))
            .fulfill(async (event) => {
            await this.stack.emit(Event_1.EventSet.ModelCreated, event);
        })
            .commit();
        return model;
    }
    async deleteModel(model) {
        await this.rfc.create(new DeleteModelEvent_1.DeleteModelEvent(model))
            .fulfill(async (event) => {
            this.cache.deleteModel(model.name);
        })
            .commit();
    }
    // Note: This may not be needed. Watch for this.
    // Model's are stored in local cache because they are
    // defined locally, and are the contract between the
    // the expected data set and what is stored.
    async getModel(name) {
        let model;
        await this.rfc.create(new GetModelEvent_1.GetModelEvent(name))
            .fulfill(async (event) => {
            let getModel = event;
            model = getModel.model;
            if (model !== undefined) {
                this.cache.saveModel(model);
            }
            await this.stack.emit(Event_1.EventSet.GetModel, event);
        })
            .commit();
        return model;
    }
    async updateModel(model, params) {
    }
    async createObject(model, params) {
        let created = await ProxyObject_1.ProxyObject.fromCreated(model, params, this.context);
        await this.rfc.create(new CreateObjectEvent_1.CreateObjectEvent(model, created))
            .fulfill(async (event) => {
            await this.stack.emit(Event_1.EventSet.ObjectCreated, event);
        })
            .commit();
        return created;
    }
    /**
     *
     * @param model The Model
     * @param obj The Object to save. Note that this is really a Proxy'd SerializableObject
     */
    async saveObject(model, obj) {
        if (obj.id === UidKeeper_1.UidKeeper.IdNotSet) {
            obj.id = await this.uid.generate();
        }
        let validations = await model.validate(obj);
        if (!validations.success) {
            throw new Error(`Cannot Save Object with ID ${obj.id} since it fails validation. Reason: ${validations.results.map(r => r.error)}`);
        }
        //@ts-ignore
        let serialized = ProxyObject_1.ProxyObject.unwrap(obj);
        await this.rfc.create(new SaveObjectEvent_1.SaveObjectEvent(model, obj, serialized))
            .fulfill(async (event) => {
            this.cache.saveObject(model, obj);
            await this.stack.emit(Event_1.EventSet.ObjectSaved, event);
        })
            .commit();
    }
    async getManyObjects(model, options = { cursor: '', limit: 100 }) {
        let results = {
            cursor: '',
            items: new Array()
        };
        await this.rfc.create(new GetManyObjectsEvent_1.GetManyObjectsEvent(model, options))
            .fulfill(async (event) => {
            let cast = event;
            await this.stack.emit(Event_1.EventSet.GetManyObjects, cast);
            if (cast.results !== undefined) {
                results = cast.results;
                return;
            }
            let objects = this.cache.getObjects(model);
            if (objects.length == 0) {
                return;
            }
            let cursor = options.cursor || '';
            let limit = options.limit || 100;
            // Sort by ID. The resulting paged set is not perfect, and will have
            // holes when new entries are added in between queries.
            objects.sort((a, b) => {
                let aId = a.id.toLowerCase();
                let bId = b.id.toLowerCase();
                return (aId < bId) ? -1 : (aId > bId) ? 1 : 0;
            });
            if (cursor === '') {
                // For an empty cursor we start from the beginning
                let items = objects.slice(0, Math.min(objects.length, limit));
                if (items.length == limit && objects.length > limit) {
                    results.cursor = Buffer.from(objects[limit].id).toString('base64');
                }
                else {
                    // If there are no more entries in thenext set, we default the cursor
                    // to empty string
                    results.cursor = '';
                }
                results.items = items;
                return;
            }
            else {
                // We have a cursor and continue from whence we left off
                cursor = Buffer.from(cursor, 'base64').toString('ascii');
                let index = objects.findIndex(o => o.id === cursor);
                if (index === -1) {
                    // We get here when the object that's next has been deleted
                    // return early
                    return;
                }
                let nextIndex = index + limit;
                results.items = objects.slice(index, nextIndex);
                if (objects.length > nextIndex) {
                    results.cursor = Buffer.from(objects[nextIndex].id).toString('base64');
                }
                else {
                    // If there are no more entries in the next set, we default the cursor
                    // to empty string
                    results.cursor = '';
                }
                return;
            }
            return;
        })
            .commit();
        return results;
    }
    async deleteObject(model, obj) {
        await this.rfc.create(new DeleteObjectEvent_1.DeleteObjectEvent(model, obj))
            .fulfill(async (event) => {
            this.cache.deleteObject(model, obj);
            await this.stack.emit(Event_1.EventSet.ObjectDeleted, event);
        })
            .commit();
    }
    async getObject(model, id) {
        let object;
        await this.rfc.create(new events_1.GetObjectEvent(model, id))
            .fulfill(async (event) => {
            let cast = event;
            if (cast.object === undefined) {
                object = cast.exists === Event_1.ExistState.DoesNotExist ?
                    undefined :
                    this.cache.getObject(model, id);
            }
            else {
                // We get a serialized version of the Object
                let serialized = await ProxyObject_1.ProxyObject.fromStored(model, cast.object, this.context.serializer);
                this.cache.saveObject(model, serialized);
                //@ts-ignore
                object = serialized;
            }
            await this.stack.emit(Event_1.EventSet.GetObject, event);
        })
            .commit();
        return object;
    }
    async hasId(id) {
        let hasId = false;
        await this.rfc.create(new HasIdEvent_1.HasIdEvent(id))
            .fulfill(async (event) => {
            let cast = event;
            await this.stack.emit(Event_1.EventSet.HasId, event);
            if (cast.hasId) {
                hasId = true;
                return;
            }
            // Has it a plugin attempted to set it?
            if (cast.attemptedSet) {
                // If so, we can trust that an external system doesn't have it
                hasId = false;
                return;
            }
            // If no external system attempted to set it, do we have it cached?
            hasId = this.cache.hasId(id);
        })
            .commit();
        return hasId;
    }
    /**
     * Updates an already existing object with the latest from the stored version.
     * This method is intended to be used on long lived objects where we want them
     * to be updated locally, and not saved.
     *
     * @param model The Model
     * @param obj The Object
     * @param onUpdate Function to update the Object based on the latest version
     */
    async updateObject(model, obj, onUpdate) {
        await this.rfc.create(new UpdateObjectEvent_1.UpdateObjectEvent(model, obj, ProxyObject_1.ProxyObject.unwrap(obj)))
            .fulfill(async (event) => {
            let cast = event;
            let updated = cast.updated;
            await onUpdate(updated, cast.exists);
            await this.stack.emit(Event_1.EventSet.ObjectUpdated, event);
        })
            .commit();
    }
}
exports.Orchestrator = Orchestrator;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiT3JjaGVzdHJhdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL29yY2hlc3RyYXRvci9PcmNoZXN0cmF0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEsc0NBQTJDO0FBQzNDLCtEQUE0RDtBQUM1RCxtRUFBZ0U7QUFDaEUsMkNBQXVEO0FBQ3ZELHVFQUFvRTtBQUNwRSxxREFBa0Q7QUFFbEQsbUVBQWdFO0FBQ2hFLG9DQUEyRztBQUkzRyxnREFBNkM7QUFDN0MsNENBQXFEO0FBRXJELG1FQUFnRTtBQUNoRSxpRUFBOEQ7QUFDOUQsaUVBQThEO0FBQzlELDJEQUF3RDtBQUN4RCw2REFBMEQ7QUFtRzFELE1BQWEsWUFBWTtJQXFCdEIsWUFBcUIsT0FBc0I7UUFBdEIsWUFBTyxHQUFQLE9BQU8sQ0FBZTtJQUUzQyxDQUFDO0lBdEJELElBQUksS0FBSztRQUNOLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUE7SUFDNUIsQ0FBQztJQUVELElBQUksR0FBRztRQUNKLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUE7SUFDMUIsQ0FBQztJQUVELElBQUksVUFBVTtRQUNYLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUE7SUFDakMsQ0FBQztJQUVELElBQUksS0FBSztRQUNOLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUE7SUFDNUIsQ0FBQztJQUVELElBQUksR0FBRztRQUNKLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUE7SUFDMUIsQ0FBQztJQU1ELEtBQUssQ0FBQyxRQUFRO1FBQ1gsTUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLCtCQUFjLEVBQUUsQ0FBQzthQUN2QyxPQUFPLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFO1lBQ3RCLE1BQU0sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsZ0JBQVEsQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUE7UUFDbkQsQ0FBQyxDQUFDO2FBQ0QsTUFBTSxFQUFFLENBQUE7SUFDZixDQUFDO0lBRUQsS0FBSyxDQUFDLFdBQVcsQ0FBQyxJQUFZLEVBQUUsTUFBeUI7UUFDdEQsSUFBSSxLQUFLLEdBQUcsTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUE7UUFFNUMsSUFBRyxLQUFLLEtBQUssU0FBUyxFQUFFO1lBQ3JCLE1BQU0sSUFBSSxLQUFLLENBQUMseUJBQXlCLElBQUksaUJBQWlCLENBQUMsQ0FBQTtTQUNqRTtRQUVELElBQUksRUFBRSxHQUFHLE1BQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQTtRQUVsQyxLQUFLLEdBQUcsSUFBSSxhQUFLLENBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7UUFDekMsTUFBTSxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFBO1FBRTFCLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBRTNCLE1BQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxtQ0FBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUM5QyxPQUFPLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFO1lBQ3RCLE1BQU0sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsZ0JBQVEsQ0FBQyxZQUFZLEVBQUUsS0FBSyxDQUFDLENBQUE7UUFDdEQsQ0FBQyxDQUFDO2FBQ0QsTUFBTSxFQUFFLENBQUE7UUFFWixPQUFPLEtBQUssQ0FBQTtJQUNmLENBQUM7SUFFRCxLQUFLLENBQUMsV0FBVyxDQUFDLEtBQWE7UUFDNUIsTUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLG1DQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQzlDLE9BQU8sQ0FBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUU7WUFDdkIsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQ3JDLENBQUMsQ0FBQzthQUNELE1BQU0sRUFBRSxDQUFBO0lBQ2YsQ0FBQztJQUVELGdEQUFnRDtJQUNoRCxxREFBcUQ7SUFDckQsb0RBQW9EO0lBQ3BELDRDQUE0QztJQUM1QyxLQUFLLENBQUMsUUFBUSxDQUFDLElBQVk7UUFDeEIsSUFBSSxLQUF5QixDQUFBO1FBRTdCLE1BQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSw2QkFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQzFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUU7WUFDdEIsSUFBSSxRQUFRLEdBQUcsS0FBc0IsQ0FBQTtZQUNyQyxLQUFLLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQTtZQUV0QixJQUFHLEtBQUssS0FBSyxTQUFTLEVBQUU7Z0JBQ3JCLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFBO2FBQzdCO1lBRUQsTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxnQkFBUSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQTtRQUNsRCxDQUFDLENBQUM7YUFDRCxNQUFNLEVBQUUsQ0FBQTtRQUVaLE9BQU8sS0FBSyxDQUFBO0lBQ2YsQ0FBQztJQUVELEtBQUssQ0FBQyxXQUFXLENBQUMsS0FBYSxFQUFFLE1BQXlCO0lBRTFELENBQUM7SUFFRCxLQUFLLENBQUMsWUFBWSxDQUF3QixLQUFhLEVBQUUsTUFBMEI7UUFDaEYsSUFBSSxPQUFPLEdBQUcsTUFBTSx5QkFBVyxDQUFDLFdBQVcsQ0FBSSxLQUFLLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQU0sQ0FBQTtRQUVoRixNQUFNLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUkscUNBQWlCLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO2FBQ3hELE9BQU8sQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUU7WUFDdEIsTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxnQkFBUSxDQUFDLGFBQWEsRUFBRSxLQUFLLENBQUMsQ0FBQTtRQUN2RCxDQUFDLENBQUM7YUFDRCxNQUFNLEVBQUUsQ0FBQTtRQUVaLE9BQU8sT0FBTyxDQUFBO0lBQ2pCLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsS0FBSyxDQUFDLFVBQVUsQ0FBd0IsS0FBYSxFQUFFLEdBQU07UUFDMUQsSUFBRyxHQUFHLENBQUMsRUFBRSxLQUFLLHFCQUFTLENBQUMsUUFBUSxFQUFFO1lBQy9CLEdBQUcsQ0FBQyxFQUFFLEdBQUcsTUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFBO1NBQ3BDO1FBRUQsSUFBSSxXQUFXLEdBQUcsTUFBTSxLQUFLLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFBO1FBRTNDLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFO1lBQ3ZCLE1BQU0sSUFBSSxLQUFLLENBQUMsOEJBQThCLEdBQUcsQ0FBQyxFQUFFLHVDQUF1QyxXQUFXLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUE7U0FDckk7UUFFRCxZQUFZO1FBQ1osSUFBSSxVQUFVLEdBQUcseUJBQVcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUE7UUFFeEMsTUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLGlDQUFlLENBQUksS0FBSyxFQUFFLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQzthQUNqRSxPQUFPLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFO1lBQ3RCLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQTtZQUNqQyxNQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLGdCQUFRLENBQUMsV0FBVyxFQUFFLEtBQUssQ0FBQyxDQUFBO1FBQ3JELENBQUMsQ0FBQzthQUNELE1BQU0sRUFBRSxDQUFBO0lBQ2YsQ0FBQztJQUVELEtBQUssQ0FBQyxjQUFjLENBQXdCLEtBQWEsRUFBRSxVQUF1QixFQUFFLE1BQU0sRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRTtRQUN6RyxJQUFJLE9BQU8sR0FBRztZQUNYLE1BQU0sRUFBRSxFQUFFO1lBQ1YsS0FBSyxFQUFFLElBQUksS0FBSyxFQUFLO1NBQ3ZCLENBQUE7UUFFRCxNQUFNLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUkseUNBQW1CLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO2FBQzFELE9BQU8sQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUU7WUFDdEIsSUFBSSxJQUFJLEdBQUcsS0FBK0IsQ0FBQTtZQUUxQyxNQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLGdCQUFRLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxDQUFBO1lBRXBELElBQUksSUFBSSxDQUFDLE9BQU8sS0FBSyxTQUFTLEVBQUU7Z0JBQzdCLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFBO2dCQUN0QixPQUFNO2FBQ1I7WUFFRCxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBSSxLQUFLLENBQUMsQ0FBQTtZQUU3QyxJQUFJLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFO2dCQUN0QixPQUFNO2FBQ1I7WUFFRCxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxJQUFJLEVBQUUsQ0FBQTtZQUNqQyxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsS0FBSyxJQUFJLEdBQUcsQ0FBQTtZQUVoQyxvRUFBb0U7WUFDcEUsdURBQXVEO1lBQ3ZELE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ25CLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsV0FBVyxFQUFFLENBQUE7Z0JBQzVCLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsV0FBVyxFQUFFLENBQUE7Z0JBQzVCLE9BQU8sQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFDaEQsQ0FBQyxDQUFDLENBQUE7WUFFRixJQUFJLE1BQU0sS0FBSyxFQUFFLEVBQUU7Z0JBQ2hCLGtEQUFrRDtnQkFDbEQsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUE7Z0JBRTdELElBQUksS0FBSyxDQUFDLE1BQU0sSUFBSSxLQUFLLElBQUksT0FBTyxDQUFDLE1BQU0sR0FBRyxLQUFLLEVBQUU7b0JBQ2xELE9BQU8sQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFBO2lCQUNwRTtxQkFBTTtvQkFDSixxRUFBcUU7b0JBQ3JFLGtCQUFrQjtvQkFDbEIsT0FBTyxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUE7aUJBQ3JCO2dCQUVELE9BQU8sQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFBO2dCQUNyQixPQUFNO2FBQ1I7aUJBQU07Z0JBQ0osd0RBQXdEO2dCQUN4RCxNQUFNLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFBO2dCQUV4RCxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxNQUFNLENBQUMsQ0FBQTtnQkFFbkQsSUFBSSxLQUFLLEtBQUssQ0FBQyxDQUFDLEVBQUU7b0JBQ2YsMkRBQTJEO29CQUMzRCxlQUFlO29CQUNmLE9BQU07aUJBQ1I7Z0JBRUQsSUFBSSxTQUFTLEdBQUcsS0FBSyxHQUFHLEtBQUssQ0FBQTtnQkFDN0IsT0FBTyxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsQ0FBQTtnQkFFL0MsSUFBSSxPQUFPLENBQUMsTUFBTSxHQUFHLFNBQVMsRUFBRTtvQkFDN0IsT0FBTyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUE7aUJBQ3hFO3FCQUFNO29CQUNKLHNFQUFzRTtvQkFDdEUsa0JBQWtCO29CQUNsQixPQUFPLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQTtpQkFDckI7Z0JBRUQsT0FBTTthQUNSO1lBRUQsT0FBTTtRQUNULENBQUMsQ0FBQzthQUNELE1BQU0sRUFBRSxDQUFBO1FBRVosT0FBTyxPQUFPLENBQUE7SUFDakIsQ0FBQztJQUVELEtBQUssQ0FBQyxZQUFZLENBQXdCLEtBQWEsRUFBRSxHQUFNO1FBQzVELE1BQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxxQ0FBaUIsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7YUFDcEQsT0FBTyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsRUFBRTtZQUN0QixJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUE7WUFDbkMsTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxnQkFBUSxDQUFDLGFBQWEsRUFBRSxLQUFLLENBQUMsQ0FBQTtRQUN2RCxDQUFDLENBQUM7YUFDRCxNQUFNLEVBQUUsQ0FBQTtJQUNmLENBQUM7SUFFRCxLQUFLLENBQUMsU0FBUyxDQUF3QixLQUFhLEVBQUUsRUFBVTtRQUM3RCxJQUFJLE1BQXFCLENBQUE7UUFFekIsTUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLHVCQUFjLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO2FBQ2hELE9BQU8sQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUU7WUFDdEIsSUFBSSxJQUFJLEdBQUcsS0FBMEIsQ0FBQTtZQUVyQyxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssU0FBUyxFQUFFO2dCQUM1QixNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sS0FBSyxrQkFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDO29CQUMvQyxTQUFTLENBQUMsQ0FBQztvQkFDWCxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUE7YUFDcEM7aUJBQU07Z0JBQ0osNENBQTRDO2dCQUM1QyxJQUFJLFVBQVUsR0FBRyxNQUFNLHlCQUFXLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUE7Z0JBQzFGLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxVQUFVLENBQUMsQ0FBQTtnQkFFeEMsWUFBWTtnQkFDWixNQUFNLEdBQUcsVUFBZSxDQUFBO2FBQzFCO1lBRUQsTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxnQkFBUSxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQTtRQUNuRCxDQUFDLENBQUM7YUFDRCxNQUFNLEVBQUUsQ0FBQTtRQUVaLE9BQU8sTUFBTSxDQUFBO0lBQ2hCLENBQUM7SUFFRCxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQVU7UUFDbkIsSUFBSSxLQUFLLEdBQUcsS0FBSyxDQUFBO1FBRWpCLE1BQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSx1QkFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDO2FBQ3JDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUU7WUFDdEIsSUFBSSxJQUFJLEdBQUcsS0FBbUIsQ0FBQTtZQUU5QixNQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLGdCQUFRLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFBO1lBRTVDLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtnQkFDYixLQUFLLEdBQUcsSUFBSSxDQUFBO2dCQUNaLE9BQU07YUFDUjtZQUVELHVDQUF1QztZQUN2QyxJQUFJLElBQUksQ0FBQyxZQUFZLEVBQUU7Z0JBQ3BCLDhEQUE4RDtnQkFDOUQsS0FBSyxHQUFHLEtBQUssQ0FBQTtnQkFDYixPQUFNO2FBQ1I7WUFFRCxtRUFBbUU7WUFDbkUsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBRS9CLENBQUMsQ0FBQzthQUNELE1BQU0sRUFBRSxDQUFBO1FBRVosT0FBTyxLQUFLLENBQUE7SUFDZixDQUFDO0lBRUQ7Ozs7Ozs7O09BUUc7SUFDSCxLQUFLLENBQUMsWUFBWSxDQUF3QixLQUFhLEVBQUUsR0FBTSxFQUFFLFFBQWdDO1FBQzlGLE1BQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxxQ0FBaUIsQ0FBSSxLQUFLLEVBQUUsR0FBRyxFQUFFLHlCQUFXLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7YUFDaEYsT0FBTyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsRUFBRTtZQUN0QixJQUFJLElBQUksR0FBRyxLQUE2QixDQUFBO1lBRXhDLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUE7WUFFMUIsTUFBTSxRQUFRLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQTtZQUVwQyxNQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLGdCQUFRLENBQUMsYUFBYSxFQUFFLEtBQUssQ0FBQyxDQUFBO1FBQ3ZELENBQUMsQ0FBQzthQUNELE1BQU0sRUFBRSxDQUFBO0lBQ2YsQ0FBQztDQUNIO0FBM1NELG9DQTJTQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFN0YWNrT2JqZWN0IH0gZnJvbSBcIi4uL1N0YWNrT2JqZWN0XCI7XG5pbXBvcnQgeyBJQ2FjaGUgfSBmcm9tIFwiLi4vQ2FjaGVcIjtcbmltcG9ydCB7IEdldE9iamVjdEV2ZW50IH0gZnJvbSBcIi4uL2V2ZW50c1wiO1xuaW1wb3J0IHsgU2F2ZU9iamVjdEV2ZW50IH0gZnJvbSBcIi4uL2V2ZW50cy9TYXZlT2JqZWN0RXZlbnRcIjtcbmltcG9ydCB7IERlbGV0ZU9iamVjdEV2ZW50IH0gZnJvbSBcIi4uL2V2ZW50cy9EZWxldGVPYmplY3RFdmVudFwiO1xuaW1wb3J0IHsgRXZlbnRTZXQsIEV4aXN0U3RhdGUgfSBmcm9tIFwiLi4vZXZlbnRzL0V2ZW50XCI7XG5pbXBvcnQgeyBHZXRNYW55T2JqZWN0c0V2ZW50IH0gZnJvbSBcIi4uL2V2ZW50cy9HZXRNYW55T2JqZWN0c0V2ZW50XCI7XG5pbXBvcnQgeyBIYXNJZEV2ZW50IH0gZnJvbSBcIi4uL2V2ZW50cy9IYXNJZEV2ZW50XCI7XG5pbXBvcnQgeyBJUmVxdWVzdEZvckNoYW5nZVNvdXJjZSB9IGZyb20gXCIuLi9ldmVudHMvUmVxdWVzdEZvckNoYW5nZVwiO1xuaW1wb3J0IHsgVXBkYXRlT2JqZWN0RXZlbnQgfSBmcm9tIFwiLi4vZXZlbnRzL1VwZGF0ZU9iamVjdEV2ZW50XCI7XG5pbXBvcnQgeyBJTW9kZWwsIE1vZGVsLCBNb2RlbENyZWF0ZVBhcmFtcywgT2JqZWN0Q3JlYXRlUGFyYW1zLCBQYWdlUmVxdWVzdCwgUGFnZVJlc3BvbnNlIH0gZnJvbSBcIi4uL01vZGVsXCI7XG5pbXBvcnQgeyBJU3RhY2sgfSBmcm9tIFwiLi4vc3RhY2svU3RhY2tcIjtcbmltcG9ydCB7IElTdGFja0NvbnRleHQgfSBmcm9tIFwiLi4vc3RhY2svU3RhY2tDb250ZXh0XCI7XG5pbXBvcnQgeyBVcGRhdGVPYmplY3RIYW5kbGVyIH0gZnJvbSBcIi4uL3N0YWNrL1N0YWNrVXBkYXRlXCI7XG5pbXBvcnQgeyBQcm94eU9iamVjdCB9IGZyb20gXCIuLi9Qcm94eU9iamVjdFwiO1xuaW1wb3J0IHsgSVVpZEtlZXBlciwgVWlkS2VlcGVyIH0gZnJvbSBcIi4uL1VpZEtlZXBlclwiO1xuaW1wb3J0IHsgSVZhbHVlU2VyaWFsaXplciB9IGZyb20gXCIuLi9zZXJpYWxpemUvVmFsdWVTZXJpYWxpemVyXCI7XG5pbXBvcnQgeyBDcmVhdGVPYmplY3RFdmVudCB9IGZyb20gXCIuLi9ldmVudHMvQ3JlYXRlT2JqZWN0RXZlbnRcIjtcbmltcG9ydCB7IENyZWF0ZU1vZGVsRXZlbnQgfSBmcm9tIFwiLi4vZXZlbnRzL0NyZWF0ZU1vZGVsRXZlbnRcIjtcbmltcG9ydCB7IERlbGV0ZU1vZGVsRXZlbnQgfSBmcm9tIFwiLi4vZXZlbnRzL0RlbGV0ZU1vZGVsRXZlbnRcIjtcbmltcG9ydCB7IEdldE1vZGVsRXZlbnQgfSBmcm9tIFwiLi4vZXZlbnRzL0dldE1vZGVsRXZlbnRcIjtcbmltcG9ydCB7IEJvb3RzdHJhcEV2ZW50IH0gZnJvbSBcIi4uL2V2ZW50cy9Cb290c3RyYXBFdmVudFwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIElPcmNoZXN0cmF0b3Ige1xuICAgLy8gVE9ETzogQWRkOiBjcmVhdGVNb2RlbCwgZGVsZXRlTW9kZWwgKHRoZXNlIHNob3VsZCBhc3Npc3QgaW4gcnVubmluZyB0ZXN0cylcblxuICAgLyoqXG4gICAgKiBCb290c3RyYXBzIHRoZSBTdGFjay5cbiAgICAqL1xuICAgYm9vc3RyYXAoKTogUHJvbWlzZTx2b2lkPlxuXG4gICAvKipcbiAgICAqIENyZWF0ZXMgYSBNb2RlbFxuICAgICogXG4gICAgKiBAcGFyYW0gbmFtZSBUaGUgbmFtZSBvZiB0aGUgTW9kZWxcbiAgICAqIEBwYXJhbSBwYXJhbXMgVGhlIFBhcmFtcyB1c2VkIHRvIGNyZWF0ZSB0aGUgTW9kZWxcbiAgICAqL1xuICAgY3JlYXRlTW9kZWwobmFtZTogc3RyaW5nLCBwYXJhbXM6IE1vZGVsQ3JlYXRlUGFyYW1zKTogUHJvbWlzZTxJTW9kZWw+XG5cbiAgIC8qKlxuICAgICogRGVsZXRlcyBhIE1vZGVsXG4gICAgKiBcbiAgICAqIEBwYXJhbSBtb2RlbCBUaGUgTW9kZWwgdG8gZGVsZXRlXG4gICAgKi9cbiAgIGRlbGV0ZU1vZGVsKG1vZGVsOiBJTW9kZWwpOiBQcm9taXNlPHZvaWQ+XG5cbiAgIC8qKlxuICAgICogUmV0cmlldmVzIGEgTW9kZWwgaWYgaXQgZXhpc3RzLCBvciB1bmRlZmllbmQgaWYgbm90LlxuICAgICogXG4gICAgKiBAcGFyYW0gbmFtZSBUaGUgTW9kZWwgbmFtZVxuICAgICovXG4gICBnZXRNb2RlbChuYW1lOiBzdHJpbmcpOiBQcm9taXNlPElNb2RlbCB8IHVuZGVmaW5lZD5cblxuICAgLyoqXG4gICAgKiBVcGRhdGVzIGFuIGV4aXN0aW5nIE1vZGVsXG4gICAgKiBcbiAgICAqIEBwYXJhbSBtb2RlbCBUaGUgTW9kZWwgdG8gdXBkYXRlXG4gICAgKiBAcGFyYW0gcGFyYW1zIFRoZSBQYXJhbXNcbiAgICAqL1xuICAgdXBkYXRlTW9kZWwobW9kZWw6IElNb2RlbCwgcGFyYW1zOiBNb2RlbENyZWF0ZVBhcmFtcyk6IFByb21pc2U8dm9pZD5cblxuICAgLyoqXG4gICAgKiBDcmVhdGVzIGEgbmV3IE9iamVjdCBpbiBtZW1vcnkgb25seS4gTm90IGluZGVuZGVkIHRvIGJlIHN0b3JlZCBvbiB0aGUgYmFja2VuZC5cbiAgICAqIE9iamVjdHMgY3JlYXRlZCB0aGlzIHdheSBoYXZlIG5vIElEIGFzc2lnbmVkIHRvIHRoZW0gdW50aWwgdGhleSBhcmUgc2F2ZWQuXG4gICAgKiBcbiAgICAqIEBwYXJhbSBtb2RlbCBUaGUgTW9kZWxcbiAgICAqIEBwYXJhbSBwYXJhbXMgVGhlIE9iamVjdCBDcmVhdGlvbiBQYXJhbXMgXG4gICAgKi9cbiAgIGNyZWF0ZU9iamVjdDxUIGV4dGVuZHMgU3RhY2tPYmplY3Q+KG1vZGVsOiBJTW9kZWwsIHBhcmFtczogT2JqZWN0Q3JlYXRlUGFyYW1zKTogUHJvbWlzZTxUPlxuXG4gICAvKipcbiAgICAqIFNhdmVzIGFuIE9iamVjdCB0byB0aGUgYmFja2VuZC5cbiAgICAqIFxuICAgICogQHBhcmFtIG1vZGVsIFRoZSBNb2RlbFxuICAgICogQHBhcmFtIG9iaiBUaGUgT2JqZWN0IHRvIFNhdmVcbiAgICAqL1xuICAgc2F2ZU9iamVjdDxUIGV4dGVuZHMgU3RhY2tPYmplY3Q+KG1vZGVsOiBJTW9kZWwsIG9iajogVCk6IFByb21pc2U8dm9pZD5cblxuICAgLyoqXG4gICAgKiBEZWxldGVzIGFuIE9iamVjdCBmcm9tIHRoZSBiYWNrZW5kXG4gICAgKiBcbiAgICAqIEBwYXJhbSBtb2RlbCBUaGUgTW9kZWxcbiAgICAqIEBwYXJhbSBvYmogVGhlIE9iamVjdCB0byBkZWxldGVcbiAgICAqL1xuICAgZGVsZXRlT2JqZWN0PFQgZXh0ZW5kcyBTdGFja09iamVjdD4obW9kZWw6IElNb2RlbCwgb2JqOiBUKTogUHJvbWlzZTx2b2lkPlxuXG4gICAvKipcbiAgICAqIFJldHJpZXZlcyBtYW55IG9iamVjdHMgaW4gYSBwYWdlZCBmYXNoaW9uLlxuICAgICogXG4gICAgKiBAcGFyYW0gbW9kZWwgVGhlIE1vZGVsIHJlcHJlc2VudGluZyB0aGUgT2JqZWN0c1xuICAgICogQHBhcmFtIG9wdGlvbnMgUGFnZVJlcXVlc3QgT3B0aW9uc1xuICAgICovXG4gICBnZXRNYW55T2JqZWN0czxUIGV4dGVuZHMgU3RhY2tPYmplY3Q+KG1vZGVsOiBJTW9kZWwsIG9wdGlvbnM6IFBhZ2VSZXF1ZXN0KTogUHJvbWlzZTxQYWdlUmVzcG9uc2U8VD4+XG4gICBcbiAgIC8qKlxuICAgICogUmV0cmlldmVzIHRoZSBFZGl0IHZlcnNpb24gb2YgdGhlIE9iamVjdFxuICAgICogXG4gICAgKiBAcGFyYW0gbW9kZWwgVGhlIE1vZGVsIG9mIHRoZSBPYmplY3RcbiAgICAqIEBwYXJhbSBpZCBUaGUgT2JqZWN0J3MgSURcbiAgICAqL1xuICAgZ2V0T2JqZWN0PFQgZXh0ZW5kcyBTdGFja09iamVjdD4obW9kZWw6IElNb2RlbCwgaWQ6IHN0cmluZyk6IFByb21pc2U8VCB8IHVuZGVmaW5lZD5cblxuICAgLyoqXG4gICAgKiBEZXRlcm1pbmVzIGlmIGFuIElEIGlzIGFscmVhZHkgaW4gdXNlLlxuICAgICogXG4gICAgKiBAcGFyYW0gaWQgVGhlIElEIHRvIHRlc3RcbiAgICAqL1xuICAgaGFzSWQoaWQ6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj5cbiAgIFxuICAgLyoqXG4gICAgKiBVcGRhdGVzIHRoZSB2YWx1ZXMgb2YgYW4gT2JqZWN0XG4gICAgKiBcbiAgICAqIEBwYXJhbSBtb2RlbCBUaGUgTW9kZWwgb2YgdGhlIE9iamVjdFxuICAgICogQHBhcmFtIG9iaiBUaGUgT2JqZWN0IHRvIHVwZGF0ZVxuICAgICogQHBhcmFtIG9uVXBkYXRlIEhhbmRsZXIgdGhhdCBpcyBjYWxsZWQgYWZ0ZXIgYW4gT2JqZWN0IGhhcyBiZWVuIHVwZGF0ZWRcbiAgICAqL1xuICAgdXBkYXRlT2JqZWN0PFQgZXh0ZW5kcyBTdGFja09iamVjdD4obW9kZWw6IElNb2RlbCwgb2JqOiBULCBvblVwZGF0ZTogVXBkYXRlT2JqZWN0SGFuZGxlcjxUPik6IFByb21pc2U8dm9pZD5cbn1cblxuXG5leHBvcnQgY2xhc3MgT3JjaGVzdHJhdG9yIGltcGxlbWVudHMgSU9yY2hlc3RyYXRvciB7XG4gICBnZXQgY2FjaGUoKTogSUNhY2hlIHtcbiAgICAgIHJldHVybiB0aGlzLmNvbnRleHQuY2FjaGVcbiAgIH1cblxuICAgZ2V0IHJmYygpOiBJUmVxdWVzdEZvckNoYW5nZVNvdXJjZSB7XG4gICAgICByZXR1cm4gdGhpcy5jb250ZXh0LnJmY1xuICAgfVxuXG4gICBnZXQgc2VyaWFsaXplcigpOiBJVmFsdWVTZXJpYWxpemVyIHtcbiAgICAgIHJldHVybiB0aGlzLmNvbnRleHQuc2VyaWFsaXplclxuICAgfVxuXG4gICBnZXQgc3RhY2soKTogSVN0YWNrIHtcbiAgICAgIHJldHVybiB0aGlzLmNvbnRleHQuc3RhY2tcbiAgIH1cblxuICAgZ2V0IHVpZCgpOiBJVWlkS2VlcGVyIHtcbiAgICAgIHJldHVybiB0aGlzLmNvbnRleHQudWlkXG4gICB9XG5cbiAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IGNvbnRleHQ6IElTdGFja0NvbnRleHQpIHtcblxuICAgfVxuXG4gICBhc3luYyBib29zdHJhcCgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgIGF3YWl0IHRoaXMucmZjLmNyZWF0ZShuZXcgQm9vdHN0cmFwRXZlbnQoKSlcbiAgICAgICAgIC5mdWxmaWxsKGFzeW5jIChldmVudCkgPT4ge1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5zdGFjay5lbWl0KEV2ZW50U2V0LkJvb3RzdHJhcCwgZXZlbnQpXG4gICAgICAgICB9KVxuICAgICAgICAgLmNvbW1pdCgpXG4gICB9XG5cbiAgIGFzeW5jIGNyZWF0ZU1vZGVsKG5hbWU6IHN0cmluZywgcGFyYW1zOiBNb2RlbENyZWF0ZVBhcmFtcyk6IFByb21pc2U8SU1vZGVsPiB7XG4gICAgICBsZXQgbW9kZWwgPSBhd2FpdCB0aGlzLnN0YWNrLmdldC5tb2RlbChuYW1lKVxuXG4gICAgICBpZihtb2RlbCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEEgTW9kZWwgd2l0aCB0aGUgbmFtZSAke25hbWV9IGFscmVhZHkgZXhpc3RzYClcbiAgICAgIH1cblxuICAgICAgbGV0IGlkID0gYXdhaXQgdGhpcy51aWQuZ2VuZXJhdGUoKVxuXG4gICAgICBtb2RlbCA9IG5ldyBNb2RlbChuYW1lLCBpZCwgdGhpcy5jb250ZXh0KVxuICAgICAgYXdhaXQgbW9kZWwuYXBwZW5kKHBhcmFtcylcblxuICAgICAgdGhpcy5jYWNoZS5zYXZlTW9kZWwobW9kZWwpXG5cbiAgICAgIGF3YWl0IHRoaXMucmZjLmNyZWF0ZShuZXcgQ3JlYXRlTW9kZWxFdmVudChtb2RlbCkpXG4gICAgICAgICAuZnVsZmlsbChhc3luYyAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuc3RhY2suZW1pdChFdmVudFNldC5Nb2RlbENyZWF0ZWQsIGV2ZW50KVxuICAgICAgICAgfSlcbiAgICAgICAgIC5jb21taXQoKVxuXG4gICAgICByZXR1cm4gbW9kZWxcbiAgIH1cblxuICAgYXN5bmMgZGVsZXRlTW9kZWwobW9kZWw6IElNb2RlbCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgYXdhaXQgdGhpcy5yZmMuY3JlYXRlKG5ldyBEZWxldGVNb2RlbEV2ZW50KG1vZGVsKSlcbiAgICAgICAgIC5mdWxmaWxsKCBhc3luYyAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIHRoaXMuY2FjaGUuZGVsZXRlTW9kZWwobW9kZWwubmFtZSlcbiAgICAgICAgIH0pXG4gICAgICAgICAuY29tbWl0KClcbiAgIH1cblxuICAgLy8gTm90ZTogVGhpcyBtYXkgbm90IGJlIG5lZWRlZC4gV2F0Y2ggZm9yIHRoaXMuXG4gICAvLyBNb2RlbCdzIGFyZSBzdG9yZWQgaW4gbG9jYWwgY2FjaGUgYmVjYXVzZSB0aGV5IGFyZVxuICAgLy8gZGVmaW5lZCBsb2NhbGx5LCBhbmQgYXJlIHRoZSBjb250cmFjdCBiZXR3ZWVuIHRoZVxuICAgLy8gdGhlIGV4cGVjdGVkIGRhdGEgc2V0IGFuZCB3aGF0IGlzIHN0b3JlZC5cbiAgIGFzeW5jIGdldE1vZGVsKG5hbWU6IHN0cmluZyk6IFByb21pc2U8SU1vZGVsIHwgdW5kZWZpbmVkPiB7XG4gICAgICBsZXQgbW9kZWw6IElNb2RlbCB8IHVuZGVmaW5lZFxuXG4gICAgICBhd2FpdCB0aGlzLnJmYy5jcmVhdGUobmV3IEdldE1vZGVsRXZlbnQobmFtZSkpXG4gICAgICAgICAuZnVsZmlsbChhc3luYyAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGxldCBnZXRNb2RlbCA9IGV2ZW50IGFzIEdldE1vZGVsRXZlbnRcbiAgICAgICAgICAgIG1vZGVsID0gZ2V0TW9kZWwubW9kZWxcblxuICAgICAgICAgICAgaWYobW9kZWwgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgdGhpcy5jYWNoZS5zYXZlTW9kZWwobW9kZWwpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGF3YWl0IHRoaXMuc3RhY2suZW1pdChFdmVudFNldC5HZXRNb2RlbCwgZXZlbnQpXG4gICAgICAgICB9KVxuICAgICAgICAgLmNvbW1pdCgpXG5cbiAgICAgIHJldHVybiBtb2RlbFxuICAgfVxuXG4gICBhc3luYyB1cGRhdGVNb2RlbChtb2RlbDogSU1vZGVsLCBwYXJhbXM6IE1vZGVsQ3JlYXRlUGFyYW1zKTogUHJvbWlzZTx2b2lkPiB7XG5cbiAgIH1cblxuICAgYXN5bmMgY3JlYXRlT2JqZWN0PFQgZXh0ZW5kcyBTdGFja09iamVjdD4obW9kZWw6IElNb2RlbCwgcGFyYW1zOiBPYmplY3RDcmVhdGVQYXJhbXMpOiBQcm9taXNlPFQ+IHtcbiAgICAgIGxldCBjcmVhdGVkID0gYXdhaXQgUHJveHlPYmplY3QuZnJvbUNyZWF0ZWQ8VD4obW9kZWwsIHBhcmFtcywgdGhpcy5jb250ZXh0KSBhcyBUXG5cbiAgICAgIGF3YWl0IHRoaXMucmZjLmNyZWF0ZShuZXcgQ3JlYXRlT2JqZWN0RXZlbnQobW9kZWwsIGNyZWF0ZWQpKVxuICAgICAgICAgLmZ1bGZpbGwoYXN5bmMgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLnN0YWNrLmVtaXQoRXZlbnRTZXQuT2JqZWN0Q3JlYXRlZCwgZXZlbnQpXG4gICAgICAgICB9KVxuICAgICAgICAgLmNvbW1pdCgpXG5cbiAgICAgIHJldHVybiBjcmVhdGVkXG4gICB9XG5cbiAgIC8qKlxuICAgICogXG4gICAgKiBAcGFyYW0gbW9kZWwgVGhlIE1vZGVsXG4gICAgKiBAcGFyYW0gb2JqIFRoZSBPYmplY3QgdG8gc2F2ZS4gTm90ZSB0aGF0IHRoaXMgaXMgcmVhbGx5IGEgUHJveHknZCBTZXJpYWxpemFibGVPYmplY3RcbiAgICAqL1xuICAgYXN5bmMgc2F2ZU9iamVjdDxUIGV4dGVuZHMgU3RhY2tPYmplY3Q+KG1vZGVsOiBJTW9kZWwsIG9iajogVCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgaWYob2JqLmlkID09PSBVaWRLZWVwZXIuSWROb3RTZXQpIHtcbiAgICAgICAgIG9iai5pZCA9IGF3YWl0IHRoaXMudWlkLmdlbmVyYXRlKClcbiAgICAgIH1cbiAgICAgIFxuICAgICAgbGV0IHZhbGlkYXRpb25zID0gYXdhaXQgbW9kZWwudmFsaWRhdGUob2JqKVxuXG4gICAgICBpZiAoIXZhbGlkYXRpb25zLnN1Y2Nlc3MpIHtcbiAgICAgICAgIHRocm93IG5ldyBFcnJvcihgQ2Fubm90IFNhdmUgT2JqZWN0IHdpdGggSUQgJHtvYmouaWR9IHNpbmNlIGl0IGZhaWxzIHZhbGlkYXRpb24uIFJlYXNvbjogJHt2YWxpZGF0aW9ucy5yZXN1bHRzLm1hcChyID0+IHIuZXJyb3IpfWApXG4gICAgICB9XG5cbiAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgbGV0IHNlcmlhbGl6ZWQgPSBQcm94eU9iamVjdC51bndyYXAob2JqKVxuXG4gICAgICBhd2FpdCB0aGlzLnJmYy5jcmVhdGUobmV3IFNhdmVPYmplY3RFdmVudDxUPihtb2RlbCwgb2JqLCBzZXJpYWxpemVkKSlcbiAgICAgICAgIC5mdWxmaWxsKGFzeW5jIChldmVudCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5jYWNoZS5zYXZlT2JqZWN0KG1vZGVsLCBvYmopXG4gICAgICAgICAgICBhd2FpdCB0aGlzLnN0YWNrLmVtaXQoRXZlbnRTZXQuT2JqZWN0U2F2ZWQsIGV2ZW50KVxuICAgICAgICAgfSlcbiAgICAgICAgIC5jb21taXQoKVxuICAgfVxuXG4gICBhc3luYyBnZXRNYW55T2JqZWN0czxUIGV4dGVuZHMgU3RhY2tPYmplY3Q+KG1vZGVsOiBJTW9kZWwsIG9wdGlvbnM6IFBhZ2VSZXF1ZXN0ID0geyBjdXJzb3I6ICcnLCBsaW1pdDogMTAwIH0pOiBQcm9taXNlPFBhZ2VSZXNwb25zZTxUPj4ge1xuICAgICAgbGV0IHJlc3VsdHMgPSB7XG4gICAgICAgICBjdXJzb3I6ICcnLFxuICAgICAgICAgaXRlbXM6IG5ldyBBcnJheTxUPigpXG4gICAgICB9XG5cbiAgICAgIGF3YWl0IHRoaXMucmZjLmNyZWF0ZShuZXcgR2V0TWFueU9iamVjdHNFdmVudChtb2RlbCwgb3B0aW9ucykpXG4gICAgICAgICAuZnVsZmlsbChhc3luYyAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGxldCBjYXN0ID0gZXZlbnQgYXMgR2V0TWFueU9iamVjdHNFdmVudDxUPlxuXG4gICAgICAgICAgICBhd2FpdCB0aGlzLnN0YWNrLmVtaXQoRXZlbnRTZXQuR2V0TWFueU9iamVjdHMsIGNhc3QpXG5cbiAgICAgICAgICAgIGlmIChjYXN0LnJlc3VsdHMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgcmVzdWx0cyA9IGNhc3QucmVzdWx0c1xuICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBvYmplY3RzID0gdGhpcy5jYWNoZS5nZXRPYmplY3RzPFQ+KG1vZGVsKVxuXG4gICAgICAgICAgICBpZiAob2JqZWN0cy5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBjdXJzb3IgPSBvcHRpb25zLmN1cnNvciB8fCAnJ1xuICAgICAgICAgICAgbGV0IGxpbWl0ID0gb3B0aW9ucy5saW1pdCB8fCAxMDBcblxuICAgICAgICAgICAgLy8gU29ydCBieSBJRC4gVGhlIHJlc3VsdGluZyBwYWdlZCBzZXQgaXMgbm90IHBlcmZlY3QsIGFuZCB3aWxsIGhhdmVcbiAgICAgICAgICAgIC8vIGhvbGVzIHdoZW4gbmV3IGVudHJpZXMgYXJlIGFkZGVkIGluIGJldHdlZW4gcXVlcmllcy5cbiAgICAgICAgICAgIG9iamVjdHMuc29ydCgoYSwgYikgPT4ge1xuICAgICAgICAgICAgICAgbGV0IGFJZCA9IGEuaWQudG9Mb3dlckNhc2UoKVxuICAgICAgICAgICAgICAgbGV0IGJJZCA9IGIuaWQudG9Mb3dlckNhc2UoKVxuICAgICAgICAgICAgICAgcmV0dXJuIChhSWQgPCBiSWQpID8gLTEgOiAoYUlkID4gYklkKSA/IDEgOiAwXG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICBpZiAoY3Vyc29yID09PSAnJykge1xuICAgICAgICAgICAgICAgLy8gRm9yIGFuIGVtcHR5IGN1cnNvciB3ZSBzdGFydCBmcm9tIHRoZSBiZWdpbm5pbmdcbiAgICAgICAgICAgICAgIGxldCBpdGVtcyA9IG9iamVjdHMuc2xpY2UoMCwgTWF0aC5taW4ob2JqZWN0cy5sZW5ndGgsIGxpbWl0KSlcblxuICAgICAgICAgICAgICAgaWYgKGl0ZW1zLmxlbmd0aCA9PSBsaW1pdCAmJiBvYmplY3RzLmxlbmd0aCA+IGxpbWl0KSB7XG4gICAgICAgICAgICAgICAgICByZXN1bHRzLmN1cnNvciA9IEJ1ZmZlci5mcm9tKG9iamVjdHNbbGltaXRdLmlkKS50b1N0cmluZygnYmFzZTY0JylcbiAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAvLyBJZiB0aGVyZSBhcmUgbm8gbW9yZSBlbnRyaWVzIGluIHRoZW5leHQgc2V0LCB3ZSBkZWZhdWx0IHRoZSBjdXJzb3JcbiAgICAgICAgICAgICAgICAgIC8vIHRvIGVtcHR5IHN0cmluZ1xuICAgICAgICAgICAgICAgICAgcmVzdWx0cy5jdXJzb3IgPSAnJ1xuICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICByZXN1bHRzLml0ZW1zID0gaXRlbXNcbiAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgIC8vIFdlIGhhdmUgYSBjdXJzb3IgYW5kIGNvbnRpbnVlIGZyb20gd2hlbmNlIHdlIGxlZnQgb2ZmXG4gICAgICAgICAgICAgICBjdXJzb3IgPSBCdWZmZXIuZnJvbShjdXJzb3IsICdiYXNlNjQnKS50b1N0cmluZygnYXNjaWknKVxuXG4gICAgICAgICAgICAgICBsZXQgaW5kZXggPSBvYmplY3RzLmZpbmRJbmRleChvID0+IG8uaWQgPT09IGN1cnNvcilcblxuICAgICAgICAgICAgICAgaWYgKGluZGV4ID09PSAtMSkge1xuICAgICAgICAgICAgICAgICAgLy8gV2UgZ2V0IGhlcmUgd2hlbiB0aGUgb2JqZWN0IHRoYXQncyBuZXh0IGhhcyBiZWVuIGRlbGV0ZWRcbiAgICAgICAgICAgICAgICAgIC8vIHJldHVybiBlYXJseVxuICAgICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgIGxldCBuZXh0SW5kZXggPSBpbmRleCArIGxpbWl0XG4gICAgICAgICAgICAgICByZXN1bHRzLml0ZW1zID0gb2JqZWN0cy5zbGljZShpbmRleCwgbmV4dEluZGV4KVxuXG4gICAgICAgICAgICAgICBpZiAob2JqZWN0cy5sZW5ndGggPiBuZXh0SW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgIHJlc3VsdHMuY3Vyc29yID0gQnVmZmVyLmZyb20ob2JqZWN0c1tuZXh0SW5kZXhdLmlkKS50b1N0cmluZygnYmFzZTY0JylcbiAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAvLyBJZiB0aGVyZSBhcmUgbm8gbW9yZSBlbnRyaWVzIGluIHRoZSBuZXh0IHNldCwgd2UgZGVmYXVsdCB0aGUgY3Vyc29yXG4gICAgICAgICAgICAgICAgICAvLyB0byBlbXB0eSBzdHJpbmdcbiAgICAgICAgICAgICAgICAgIHJlc3VsdHMuY3Vyc29yID0gJydcbiAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgfSlcbiAgICAgICAgIC5jb21taXQoKVxuXG4gICAgICByZXR1cm4gcmVzdWx0c1xuICAgfVxuXG4gICBhc3luYyBkZWxldGVPYmplY3Q8VCBleHRlbmRzIFN0YWNrT2JqZWN0Pihtb2RlbDogSU1vZGVsLCBvYmo6IFQpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgIGF3YWl0IHRoaXMucmZjLmNyZWF0ZShuZXcgRGVsZXRlT2JqZWN0RXZlbnQobW9kZWwsIG9iaikpXG4gICAgICAgICAuZnVsZmlsbChhc3luYyAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIHRoaXMuY2FjaGUuZGVsZXRlT2JqZWN0KG1vZGVsLCBvYmopXG4gICAgICAgICAgICBhd2FpdCB0aGlzLnN0YWNrLmVtaXQoRXZlbnRTZXQuT2JqZWN0RGVsZXRlZCwgZXZlbnQpXG4gICAgICAgICB9KVxuICAgICAgICAgLmNvbW1pdCgpXG4gICB9XG5cbiAgIGFzeW5jIGdldE9iamVjdDxUIGV4dGVuZHMgU3RhY2tPYmplY3Q+KG1vZGVsOiBJTW9kZWwsIGlkOiBzdHJpbmcpOiBQcm9taXNlPFQgfCB1bmRlZmluZWQ+IHtcbiAgICAgIGxldCBvYmplY3Q6IFQgfCB1bmRlZmluZWRcblxuICAgICAgYXdhaXQgdGhpcy5yZmMuY3JlYXRlKG5ldyBHZXRPYmplY3RFdmVudChtb2RlbCwgaWQpKVxuICAgICAgICAgLmZ1bGZpbGwoYXN5bmMgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBsZXQgY2FzdCA9IGV2ZW50IGFzIEdldE9iamVjdEV2ZW50PFQ+XG5cbiAgICAgICAgICAgIGlmIChjYXN0Lm9iamVjdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICBvYmplY3QgPSBjYXN0LmV4aXN0cyA9PT0gRXhpc3RTdGF0ZS5Eb2VzTm90RXhpc3QgP1xuICAgICAgICAgICAgICAgICAgdW5kZWZpbmVkIDpcbiAgICAgICAgICAgICAgICAgIHRoaXMuY2FjaGUuZ2V0T2JqZWN0KG1vZGVsLCBpZClcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAvLyBXZSBnZXQgYSBzZXJpYWxpemVkIHZlcnNpb24gb2YgdGhlIE9iamVjdFxuICAgICAgICAgICAgICAgbGV0IHNlcmlhbGl6ZWQgPSBhd2FpdCBQcm94eU9iamVjdC5mcm9tU3RvcmVkKG1vZGVsLCBjYXN0Lm9iamVjdCwgdGhpcy5jb250ZXh0LnNlcmlhbGl6ZXIpXG4gICAgICAgICAgICAgICB0aGlzLmNhY2hlLnNhdmVPYmplY3QobW9kZWwsIHNlcmlhbGl6ZWQpXG5cbiAgICAgICAgICAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgICAgICAgICAgb2JqZWN0ID0gc2VyaWFsaXplZCBhcyBUXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGF3YWl0IHRoaXMuc3RhY2suZW1pdChFdmVudFNldC5HZXRPYmplY3QsIGV2ZW50KVxuICAgICAgICAgfSlcbiAgICAgICAgIC5jb21taXQoKVxuXG4gICAgICByZXR1cm4gb2JqZWN0XG4gICB9XG5cbiAgIGFzeW5jIGhhc0lkKGlkOiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICAgIGxldCBoYXNJZCA9IGZhbHNlXG5cbiAgICAgIGF3YWl0IHRoaXMucmZjLmNyZWF0ZShuZXcgSGFzSWRFdmVudChpZCkpXG4gICAgICAgICAuZnVsZmlsbChhc3luYyAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGxldCBjYXN0ID0gZXZlbnQgYXMgSGFzSWRFdmVudFxuXG4gICAgICAgICAgICBhd2FpdCB0aGlzLnN0YWNrLmVtaXQoRXZlbnRTZXQuSGFzSWQsIGV2ZW50KVxuXG4gICAgICAgICAgICBpZiAoY2FzdC5oYXNJZCkge1xuICAgICAgICAgICAgICAgaGFzSWQgPSB0cnVlXG4gICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gSGFzIGl0IGEgcGx1Z2luIGF0dGVtcHRlZCB0byBzZXQgaXQ/XG4gICAgICAgICAgICBpZiAoY2FzdC5hdHRlbXB0ZWRTZXQpIHtcbiAgICAgICAgICAgICAgIC8vIElmIHNvLCB3ZSBjYW4gdHJ1c3QgdGhhdCBhbiBleHRlcm5hbCBzeXN0ZW0gZG9lc24ndCBoYXZlIGl0XG4gICAgICAgICAgICAgICBoYXNJZCA9IGZhbHNlXG4gICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gSWYgbm8gZXh0ZXJuYWwgc3lzdGVtIGF0dGVtcHRlZCB0byBzZXQgaXQsIGRvIHdlIGhhdmUgaXQgY2FjaGVkP1xuICAgICAgICAgICAgaGFzSWQgPSB0aGlzLmNhY2hlLmhhc0lkKGlkKVxuXG4gICAgICAgICB9KVxuICAgICAgICAgLmNvbW1pdCgpXG5cbiAgICAgIHJldHVybiBoYXNJZFxuICAgfVxuXG4gICAvKipcbiAgICAqIFVwZGF0ZXMgYW4gYWxyZWFkeSBleGlzdGluZyBvYmplY3Qgd2l0aCB0aGUgbGF0ZXN0IGZyb20gdGhlIHN0b3JlZCB2ZXJzaW9uLlxuICAgICogVGhpcyBtZXRob2QgaXMgaW50ZW5kZWQgdG8gYmUgdXNlZCBvbiBsb25nIGxpdmVkIG9iamVjdHMgd2hlcmUgd2Ugd2FudCB0aGVtXG4gICAgKiB0byBiZSB1cGRhdGVkIGxvY2FsbHksIGFuZCBub3Qgc2F2ZWQuXG4gICAgKiBcbiAgICAqIEBwYXJhbSBtb2RlbCBUaGUgTW9kZWxcbiAgICAqIEBwYXJhbSBvYmogVGhlIE9iamVjdFxuICAgICogQHBhcmFtIG9uVXBkYXRlIEZ1bmN0aW9uIHRvIHVwZGF0ZSB0aGUgT2JqZWN0IGJhc2VkIG9uIHRoZSBsYXRlc3QgdmVyc2lvblxuICAgICovXG4gICBhc3luYyB1cGRhdGVPYmplY3Q8VCBleHRlbmRzIFN0YWNrT2JqZWN0Pihtb2RlbDogSU1vZGVsLCBvYmo6IFQsIG9uVXBkYXRlOiBVcGRhdGVPYmplY3RIYW5kbGVyPFQ+KTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICBhd2FpdCB0aGlzLnJmYy5jcmVhdGUobmV3IFVwZGF0ZU9iamVjdEV2ZW50PFQ+KG1vZGVsLCBvYmosIFByb3h5T2JqZWN0LnVud3JhcChvYmopKSlcbiAgICAgICAgIC5mdWxmaWxsKGFzeW5jIChldmVudCkgPT4ge1xuICAgICAgICAgICAgbGV0IGNhc3QgPSBldmVudCBhcyBVcGRhdGVPYmplY3RFdmVudDxUPlxuXG4gICAgICAgICAgICBsZXQgdXBkYXRlZCA9IGNhc3QudXBkYXRlZFxuXG4gICAgICAgICAgICBhd2FpdCBvblVwZGF0ZSh1cGRhdGVkLCBjYXN0LmV4aXN0cylcblxuICAgICAgICAgICAgYXdhaXQgdGhpcy5zdGFjay5lbWl0KEV2ZW50U2V0Lk9iamVjdFVwZGF0ZWQsIGV2ZW50KVxuICAgICAgICAgfSlcbiAgICAgICAgIC5jb21taXQoKVxuICAgfVxufSJdfQ==