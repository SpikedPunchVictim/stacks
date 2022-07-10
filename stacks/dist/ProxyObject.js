"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProxyObject = void 0;
const _1 = require(".");
const FieldCollection_1 = require("./collections/FieldCollection");
const Field_1 = require("./Field");
const UidKeeper_1 = require("./UidKeeper");
const ValueSource_1 = require("./values/ValueSource");
let handler = {
    get(target, property) {
        if (property === '_unwrap') {
            // Unwrap the SerializedObject from the Proxy
            return function () {
                return target;
            };
        }
        if (property === 'id') {
            return target.id;
        }
        let field = target.fields.get(property);
        if (field === undefined) {
            // Returning undefined here to not only get around
            // not having the property, but also in the cases
            // when the Proxy is await'd, the underlying system
            // calls then() until an undefined is returned.
            return undefined;
        }
        return field.edit;
    },
    set(target, property, value) {
        if (property === 'id') {
            let cast = target;
            cast.internaleSetId(value);
            return true;
        }
        let field = target.fields.get(property);
        if (field === undefined) {
            return false;
        }
        field.edit = value;
        return true;
    },
    ownKeys(target) {
        return target.fields.map(f => f.name);
    },
    getOwnPropertyDescriptor(target, key) {
        let field = target.fields.get(key);
        if (field === undefined) {
            return {
                configurable: false,
                enumerable: false,
                value: undefined
            };
        }
        return {
            configurable: true,
            enumerable: true,
            value: field.edit
        };
    }
};
class ProxyObject {
    constructor(model, id, fields) {
        this.model = model;
        this.fields = new FieldCollection_1.FieldCollection(fields);
        this._id = id;
    }
    get id() {
        return this._id;
    }
    static async fromModel(model, context) {
        let fields = new Array();
        for (let member of model.members) {
            let editObj = await context.serializer.toJs(member.value);
            fields.push(new Field_1.Field(member.name, member.value.clone(), editObj));
        }
        let proxy = new ProxyObject(model, UidKeeper_1.UidKeeper.IdNotSet, fields);
        //@ts-ignore
        return new Proxy(proxy, handler);
    }
    /**
     * This converts a Serialized Object (typically from the data store), and converts
     * it into a ProxyObject that the caller can interact with.
     *
     * @param model The Model
     * @param serialized Raw serialized data that has been stored
     * @param serializer The Serializer used to deserialized the serialized raw data
     * @returns ProxyObject
     */
    static async fromStored(model, serialized, serializer) {
        /*
           Bool -> true
           Int -> 0
           List ->
  
        */
        let fields = new Array();
        for (let key of Object.keys(serialized)) {
            let member = model.members.get(key);
            if (member === undefined) {
                // TODO: Potentially add a version compatibility mode where it doesn't throw an error?
                // May need to support not throwing an Error for migrations
                // Consider turning the IValue objects into little Proxies that can update
                // their own fields.
                throw new Error(`A property exists on ther serialized object, that doesn't exist in the Model. Model ${model.name}, Property ${key}`);
            }
            let value = await serializer.fromJs(member.type, serialized[key]);
            fields.push(new Field_1.Field(key, value, await serializer.toJs(value)));
        }
        let proxy = new ProxyObject(model, serialized.id, fields);
        //@ts-ignore
        return new Proxy(proxy, handler);
    }
    /**
     * Creates a Proxy Object when an Object is being created in-memory (before being saved)
     *
     * @param model The Model
     * @param obj The object being created
     * @param context The StackContext
     * @returns
     */
    static async fromCreated(model, obj, context) {
        let fields = new Array();
        for (let key of Object.keys(obj)) {
            let member = model.members.find(m => m.name === key);
            if (member === undefined) {
                // Ignore keys that don't have matching members
                // Note: This could be a version mismatch between the data
                continue;
            }
            if (member.type.type === _1.TypeSet.ObjectRef) {
                let editObj = await this.buildNestedEditObject(member, obj[key], context);
                let objRefType = member.type;
                let value = context.value.ref(objRefType.modelName);
                fields.push(new Field_1.Field(key, value, editObj));
                continue;
            }
            let value = ValueSource_1.ValueSource.resolve(obj[key], context);
            let jsObj = await context.serializer.toJs(value);
            fields.push(new Field_1.Field(key, value, jsObj));
        }
        for (let member of model.members) {
            if (fields.find(f => f.name === member.name) !== undefined) {
                continue;
            }
            let editObj = await context.serializer.toJs(member.value);
            fields.push(new Field_1.Field(member.name, member.value.clone(), editObj));
        }
        // We create the ID when the Object is stored.
        // This saves round trip time, and covers the case where an 
        // ID may be generated, and not stored in the backend, and
        // another equal ID is generated for a different object.
        //@ts-ignore
        return new Proxy(new ProxyObject(model, UidKeeper_1.UidKeeper.IdNotSet, fields), handler);
    }
    static unwrap(serialized) {
        //@ts-ignore
        return serialized._unwrap();
    }
    toJs() {
        let result = {};
        for (let field of this.fields) {
            result[field.name] = field.edit;
        }
        return result;
    }
    static async buildNestedEditObject(member, createValues, context) {
        let objRefType = member.type;
        let refValue = context.value.ref(objRefType.modelName);
        let editObj = await context.serializer.toJs(refValue);
        let model = context.cache.getModel(objRefType.modelName);
        if (model === undefined) {
            throw new Error(`Encountered an error when building an Edit Object. The Model for the nested property ${member.name} does not exist `);
        }
        for (let childKey of Object.keys(createValues)) {
            let childValue = createValues[childKey];
            let childMember = model.members.find(m => m.name === childKey);
            // Ignore values that are provided and we don't have a Member for.
            // This could signal that the data versions are mismatched, and that's ok.
            if (childMember === undefined) {
                continue;
            }
            if (childMember.type.type === _1.TypeSet.ObjectRef) {
                editObj[childKey] = await this.buildNestedEditObject(childMember, childValue, context);
                continue;
            }
            let value = ValueSource_1.ValueSource.resolve(childValue, context);
            editObj[childKey] = await context.serializer.toJs(value);
        }
        return editObj;
    }
    internaleSetId(id) {
        this._id = id;
    }
}
exports.ProxyObject = ProxyObject;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUHJveHlPYmplY3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvUHJveHlPYmplY3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsd0JBQXFDO0FBQ3JDLG1FQUFrRjtBQUNsRixtQ0FBd0M7QUFLeEMsMkNBQXdDO0FBRXhDLHNEQUFzRTtBQXlCdEUsSUFBSSxPQUFPLEdBQUc7SUFDWCxHQUFHLENBQUMsTUFBb0IsRUFBRSxRQUFnQjtRQUN2QyxJQUFHLFFBQVEsS0FBSyxTQUFTLEVBQUU7WUFDeEIsNkNBQTZDO1lBQzdDLE9BQU87Z0JBQ0osT0FBTyxNQUFNLENBQUE7WUFDaEIsQ0FBQyxDQUFBO1NBQ0g7UUFFRCxJQUFHLFFBQVEsS0FBSyxJQUFJLEVBQUU7WUFDbkIsT0FBTyxNQUFNLENBQUMsRUFBRSxDQUFBO1NBQ2xCO1FBRUQsSUFBSSxLQUFLLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUE7UUFFdkMsSUFBRyxLQUFLLEtBQUssU0FBUyxFQUFFO1lBQ3JCLGtEQUFrRDtZQUNsRCxpREFBaUQ7WUFDakQsbURBQW1EO1lBQ25ELCtDQUErQztZQUMvQyxPQUFPLFNBQVMsQ0FBQTtTQUNsQjtRQUVELE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBQTtJQUNwQixDQUFDO0lBQ0QsR0FBRyxDQUFDLE1BQW9CLEVBQUUsUUFBZ0IsRUFBRSxLQUFVO1FBQ25ELElBQUcsUUFBUSxLQUFLLElBQUksRUFBRTtZQUNuQixJQUFJLElBQUksR0FBRyxNQUFxQixDQUFBO1lBQ2hDLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUE7WUFDMUIsT0FBTyxJQUFJLENBQUE7U0FDYjtRQUVELElBQUksS0FBSyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFBO1FBRXZDLElBQUcsS0FBSyxLQUFLLFNBQVMsRUFBRTtZQUNyQixPQUFPLEtBQUssQ0FB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a0U7WUFDbEUsMEVBQTBFO1lBQzFFLElBQUcsV0FBVyxLQUFLLFNBQVMsRUFBRTtnQkFDM0IsU0FBUTthQUNWO1lBRUQsSUFBRyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxVQUFPLENBQUMsU0FBUyxFQUFFO2dCQUM3QyxPQUFPLENBQUMsUUFBUSxDQUFDLEdBQUcsTUFBTSxJQUFJLENBQUMscUJBQXFCLENBQUMsV0FBVyxFQUFFLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQTtnQkFDdEYsU0FBUTthQUNWO1lBRUQsSUFBSSxLQUFLLEdBQUcseUJBQVcsQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFBO1lBQ3BELE9BQU8sQ0FBQyxRQUFRLENBQUMsR0FBRyxNQUFNLE9BQU8sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO1NBQzFEO1FBRUQsT0FBTyxPQUFPLENBQUE7SUFDakIsQ0FBQztJQUVELGNBQWMsQ0FBQyxFQUFVO1FBQ3RCLElBQUksQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFBO0lBQ2hCLENBQUM7Q0FDSDtBQTdLRCxrQ0E2S0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJTWVtYmVyLCBUeXBlU2V0IH0gZnJvbSBcIi5cIjtcbmltcG9ydCB7IEZpZWxkQ29sbGVjdGlvbiwgSUZpZWxkQ29sbGVjdGlvbiB9IGZyb20gXCIuL2NvbGxlY3Rpb25zL0ZpZWxkQ29sbGVjdGlvblwiO1xuaW1wb3J0IHsgRmllbGQsIElGaWVsZCB9IGZyb20gXCIuL0ZpZWxkXCI7XG5pbXBvcnQgeyBJTW9kZWwsIE9iamVjdENyZWF0ZVBhcmFtcyB9IGZyb20gXCIuL01vZGVsXCI7XG5pbXBvcnQgeyBJVmFsdWVTZXJpYWxpemVyIH0gZnJvbSBcIi4vc2VyaWFsaXplL1ZhbHVlU2VyaWFsaXplclwiO1xuaW1wb3J0IHsgSVN0YWNrQ29udGV4dCB9IGZyb20gXCIuL3N0YWNrL1N0YWNrQ29udGV4dFwiO1xuaW1wb3J0IHsgU3RhY2tPYmplY3QgfSBmcm9tIFwiLi9TdGFja09iamVjdFwiO1xuaW1wb3J0IHsgVWlkS2VlcGVyIH0gZnJvbSBcIi4vVWlkS2VlcGVyXCI7XG5pbXBvcnQgeyBPYmplY3RSZWZUeXBlIH0gZnJvbSBcIi4vdmFsdWVzL09iamVjdFJlZlwiO1xuaW1wb3J0IHsgVmFsdWVDcmVhdGVQYXJhbXMsIFZhbHVlU291cmNlIH0gZnJvbSBcIi4vdmFsdWVzL1ZhbHVlU291cmNlXCI7XG5cbi8qKlxuICogVGhlIFNlcmlhbGl6ZWRPYmplY3Qgc3RvcmVzIHRoZSBkYXRhIGJldHdlZW4gdGhlIGJhY2tlbmQgYW5kIHRoZSBmcm9udGVuZC5cbiAqIEl0IHN0b3JlcyB0aGUgbWV0YSBkYXRhIG5lY2Vzc2FyeSB0byB0aWUgdGhlIG9iamVjdHMgdXNlZCBvdXRzaWRlIHRoZSBBUElcbiAqIHRvIHRoZWlyIGJhY2tlbmQgY291bnRlcnBhcnRzLlxuICogXG4gKiBTZXJpYWxpemVkOiBcbiAqIFRoZSBvYmplY3QgcmVwcmVzZW50aW5nIHdoYXQgaXMgc3RvcmVkIGluIHRoZSBiYWNrZW5kXG4gKiBcbiAqIERlc2VyaWFsaXplZDpcbiAqIFRoZSBvYmplY3QgdXNlZCBpbiB0aGUgZnJvbnQgZW5kLiBUaGUgZm9jdXMgaXMgdG8gc3RheSBhcyBjbG9zZVxuICogdG8gcmF3IEpTIG9iamVjdHMgYXMgcG9zc2libGUuICAgXG4gKi9cblxuZXhwb3J0IGludGVyZmFjZSBJUHJveHlPYmplY3Qge1xuICAgcmVhZG9ubHkgaWQ6IHN0cmluZ1xuICAgcmVhZG9ubHkgZmllbGRzOiBJRmllbGRDb2xsZWN0aW9uXG5cbiAgIC8qKlxuICAgICogQ29udmVydHMgdGhlIFByb3h5IE9iamVjdCBpbnRvIGEgSmF2YXNjcmlwdCBPYmplY3RcbiAgICAqL1xuICAgdG9KczxUIGV4dGVuZHMgU3RhY2tPYmplY3Q+KCk6IFRcbn1cblxubGV0IGhhbmRsZXIgPSB7XG4gICBnZXQodGFyZ2V0OiBJUHJveHlPYmplY3QsIHByb3BlcnR5OiBzdHJpbmcpOiBhbnkge1xuICAgICAgaWYocHJvcGVydHkgPT09ICdfdW53cmFwJykge1xuICAgICAgICAgLy8gVW53cmFwIHRoZSBTZXJpYWxpemVkT2JqZWN0IGZyb20gdGhlIFByb3h5XG4gICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGFyZ2V0XG4gICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmKHByb3BlcnR5ID09PSAnaWQnKSB7XG4gICAgICAgICByZXR1cm4gdGFyZ2V0LmlkXG4gICAgICB9XG5cbiAgICAgIGxldCBmaWVsZCA9IHRhcmdldC5maWVsZHMuZ2V0KHByb3BlcnR5KVxuXG4gICAgICBpZihmaWVsZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAvLyBSZXR1cm5pbmcgdW5kZWZpbmVkIGhlcmUgdG8gbm90IG9ubHkgZ2V0IGFyb3VuZFxuICAgICAgICAgLy8gbm90IGhhdmluZyB0aGUgcHJvcGVydHksIGJ1dCBhbHNvIGluIHRoZSBjYXNlc1xuICAgICAgICAgLy8gd2hlbiB0aGUgUHJveHkgaXMgYXdhaXQnZCwgdGhlIHVuZGVybHlpbmcgc3lzdGVtXG4gICAgICAgICAvLyBjYWxscyB0aGVuKCkgdW50aWwgYW4gdW5kZWZpbmVkIGlzIHJldHVybmVkLlxuICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgICAgfVxuXG4gICAgICByZXR1cm4gZmllbGQuZWRpdFxuICAgfSxcbiAgIHNldCh0YXJnZXQ6IElQcm94eU9iamVjdCwgcHJvcGVydHk6IHN0cmluZywgdmFsdWU6IGFueSk6IGJvb2xlYW4ge1xuICAgICAgaWYocHJvcGVydHkgPT09ICdpZCcpIHtcbiAgICAgICAgIGxldCBjYXN0ID0gdGFyZ2V0IGFzIFByb3h5T2JqZWN0XG4gICAgICAgICBjYXN0LmludGVybmFsZVNldElkKHZhbHVlKVxuICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH1cblxuICAgICAgbGV0IGZpZWxkID0gdGFyZ2V0LmZpZWxkcy5nZXQocHJvcGVydHkpXG5cbiAgICAgIGlmKGZpZWxkID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuXG4gICAgICBmaWVsZC5lZGl0ID0gdmFsdWVcbiAgICAgIHJldHVybiB0cnVlXG4gICB9LFxuICAgb3duS2V5cyh0YXJnZXQ6IElQcm94eU9iamVjdCk6IHZvaWRbXSB7XG4gICAgICByZXR1cm4gdGFyZ2V0LmZpZWxkcy5tYXAoZiA9PiBmLm5hbWUgYXMgc3RyaW5nKVxuICAgfSxcbiAgIGdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQ6IElQcm94eU9iamVjdCwga2V5OiBzdHJpbmcpIHtcbiAgICAgIGxldCBmaWVsZCA9IHRhcmdldC5maWVsZHMuZ2V0KGtleSlcblxuICAgICAgaWYoZmllbGQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIHZhbHVlOiB1bmRlZmluZWRcbiAgICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgICB2YWx1ZTogZmllbGQuZWRpdFxuICAgICAgfVxuICAgfVxufVxuXG5leHBvcnQgY2xhc3MgUHJveHlPYmplY3QgaW1wbGVtZW50cyBJUHJveHlPYmplY3Qge1xuICAgcmVhZG9ubHkgZmllbGRzOiBJRmllbGRDb2xsZWN0aW9uXG5cbiAgIGdldCBpZCgpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuIHRoaXMuX2lkXG4gICB9XG5cbiAgIHByaXZhdGUgX2lkOiBzdHJpbmdcblxuICAgcHJpdmF0ZSBjb25zdHJ1Y3RvcihyZWFkb25seSBtb2RlbDogSU1vZGVsLCBpZDogc3RyaW5nLCBmaWVsZHM6IElGaWVsZFtdKSB7XG4gICAgICB0aGlzLmZpZWxkcyA9IG5ldyBGaWVsZENvbGxlY3Rpb24oZmllbGRzKVxuICAgICAgdGhpcy5faWQgPSBpZFxuICAgfVxuXG4gICBzdGF0aWMgYXN5bmMgZnJvbU1vZGVsPFQgZXh0ZW5kcyBTdGFja09iamVjdD4obW9kZWw6IElNb2RlbCwgY29udGV4dDogSVN0YWNrQ29udGV4dCk6IFByb21pc2U8VD4ge1xuICAgICAgbGV0IGZpZWxkcyA9IG5ldyBBcnJheTxJRmllbGQ+KClcblxuICAgICAgZm9yIChsZXQgbWVtYmVyIG9mIG1vZGVsLm1lbWJlcnMpIHtcbiAgICAgICAgIGxldCBlZGl0T2JqID0gYXdhaXQgY29udGV4dC5zZXJpYWxpemVyLnRvSnMobWVtYmVyLnZhbHVlKVxuICAgICAgICAgZmllbGRzLnB1c2gobmV3IEZpZWxkKG1lbWJlci5uYW1lLCBtZW1iZXIudmFsdWUuY2xvbmUoKSwgZWRpdE9iaikpXG4gICAgICB9XG5cbiAgICAgIGxldCBwcm94eSA9IG5ldyBQcm94eU9iamVjdChtb2RlbCwgVWlkS2VlcGVyLklkTm90U2V0LCBmaWVsZHMpXG5cbiAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgcmV0dXJuIG5ldyBQcm94eTxJUHJveHlPYmplY3Q+KHByb3h5LCBoYW5kbGVyKVxuICAgfVxuXG4gICAvKipcbiAgICAqIFRoaXMgY29udmVydHMgYSBTZXJpYWxpemVkIE9iamVjdCAodHlwaWNhbGx5IGZyb20gdGhlIGRhdGEgc3RvcmUpLCBhbmQgY29udmVydHNcbiAgICAqIGl0IGludG8gYSBQcm94eU9iamVjdCB0aGF0IHRoZSBjYWxsZXIgY2FuIGludGVyYWN0IHdpdGguXG4gICAgKiBcbiAgICAqIEBwYXJhbSBtb2RlbCBUaGUgTW9kZWxcbiAgICAqIEBwYXJhbSBzZXJpYWxpemVkIFJhdyBzZXJpYWxpemVkIGRhdGEgdGhhdCBoYXMgYmVlbiBzdG9yZWRcbiAgICAqIEBwYXJhbSBzZXJpYWxpemVyIFRoZSBTZXJpYWxpemVyIHVzZWQgdG8gZGVzZXJpYWxpemVkIHRoZSBzZXJpYWxpemVkIHJhdyBkYXRhXG4gICAgKiBAcmV0dXJucyBQcm94eU9iamVjdFxuICAgICovXG4gICBzdGF0aWMgYXN5bmMgZnJvbVN0b3JlZChtb2RlbDogSU1vZGVsLCBzZXJpYWxpemVkOiBhbnksIHNlcmlhbGl6ZXI6IElWYWx1ZVNlcmlhbGl6ZXIpOiBQcm9taXNlPElQcm94eU9iamVjdD4ge1xuICAgICAgLypcbiAgICAgICAgIEJvb2wgLT4gdHJ1ZVxuICAgICAgICAgSW50IC0+IDBcbiAgICAgICAgIExpc3QgLT5cblxuICAgICAgKi9cblxuICAgICAgbGV0IGZpZWxkcyA9IG5ldyBBcnJheTxJRmllbGQ+KClcblxuICAgICAgZm9yKGxldCBrZXkgb2YgT2JqZWN0LmtleXMoc2VyaWFsaXplZCkpIHtcbiAgICAgICAgIGxldCBtZW1iZXIgPSBtb2RlbC5tZW1iZXJzLmdldChrZXkpXG5cbiAgICAgICAgIGlmKG1lbWJlciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAvLyBUT0RPOiBQb3RlbnRpYWxseSBhZGQgYSB2ZXJzaW9uIGNvbXBhdGliaWxpdHkgbW9kZSB3aGVyZSBpdCBkb2Vzbid0IHRocm93IGFuIGVycm9yP1xuICAgICAgICAgICAgLy8gTWF5IG5lZWQgdG8gc3VwcG9ydCBub3QgdGhyb3dpbmcgYW4gRXJyb3IgZm9yIG1pZ3JhdGlvbnNcbiAgICAgICAgICAgIC8vIENvbnNpZGVyIHR1cm5pbmcgdGhlIElWYWx1ZSBvYmplY3RzIGludG8gbGl0dGxlIFByb3hpZXMgdGhhdCBjYW4gdXBkYXRlXG4gICAgICAgICAgICAvLyB0aGVpciBvd24gZmllbGRzLlxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBBIHByb3BlcnR5IGV4aXN0cyBvbiB0aGVyIHNlcmlhbGl6ZWQgb2JqZWN0LCB0aGF0IGRvZXNuJ3QgZXhpc3QgaW4gdGhlIE1vZGVsLiBNb2RlbCAke21vZGVsLm5hbWV9LCBQcm9wZXJ0eSAke2tleX1gKVxuICAgICAgICAgfVxuXG4gICAgICAgICBsZXQgdmFsdWUgPSBhd2FpdCBzZXJpYWxpemVyLmZyb21KcyhtZW1iZXIudHlwZSwgc2VyaWFsaXplZFtrZXldKVxuXG4gICAgICAgICBmaWVsZHMucHVzaChuZXcgRmllbGQoa2V5LCB2YWx1ZSwgYXdhaXQgc2VyaWFsaXplci50b0pzKHZhbHVlKSkpXG4gICAgICB9XG5cbiAgICAgIGxldCBwcm94eSA9IG5ldyBQcm94eU9iamVjdChtb2RlbCwgc2VyaWFsaXplZC5pZCwgZmllbGRzKVxuXG4gICAgICAvL0B0cy1pZ25vcmVcbiAgICAgIHJldHVybiBuZXcgUHJveHk8SVByb3h5T2JqZWN0Pihwcm94eSwgaGFuZGxlcilcbiAgIH1cblxuICAgLyoqXG4gICAgKiBDcmVhdGVzIGEgUHJveHkgT2JqZWN0IHdoZW4gYW4gT2JqZWN0IGlzIGJlaW5nIGNyZWF0ZWQgaW4tbWVtb3J5IChiZWZvcmUgYmVpbmcgc2F2ZWQpXG4gICAgKiBcbiAgICAqIEBwYXJhbSBtb2RlbCBUaGUgTW9kZWxcbiAgICAqIEBwYXJhbSBvYmogVGhlIG9iamVjdCBiZWluZyBjcmVhdGVkXG4gICAgKiBAcGFyYW0gY29udGV4dCBUaGUgU3RhY2tDb250ZXh0XG4gICAgKiBAcmV0dXJucyBcbiAgICAqL1xuICAgc3RhdGljIGFzeW5jIGZyb21DcmVhdGVkPFQgZXh0ZW5kcyBTdGFja09iamVjdD4obW9kZWw6IElNb2RlbCwgb2JqOiBPYmplY3RDcmVhdGVQYXJhbXMsIGNvbnRleHQ6IElTdGFja0NvbnRleHQpOiBQcm9taXNlPFQ+IHtcbiAgICAgIGxldCBmaWVsZHMgPSBuZXcgQXJyYXk8SUZpZWxkPigpXG5cbiAgICAgIGZvciAobGV0IGtleSBvZiBPYmplY3Qua2V5cyhvYmopKSB7XG4gICAgICAgICBsZXQgbWVtYmVyID0gbW9kZWwubWVtYmVycy5maW5kKG0gPT4gbS5uYW1lID09PSBrZXkpXG5cbiAgICAgICAgIGlmKG1lbWJlciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAvLyBJZ25vcmUga2V5cyB0aGF0IGRvbid0IGhhdmUgbWF0Y2hpbmcgbWVtYmVyc1xuICAgICAgICAgICAgLy8gTm90ZTogVGhpcyBjb3VsZCBiZSBhIHZlcnNpb24gbWlzbWF0Y2ggYmV0d2VlbiB0aGUgZGF0YVxuICAgICAgICAgICAgY29udGludWVcbiAgICAgICAgIH1cblxuICAgICAgICAgaWYobWVtYmVyLnR5cGUudHlwZSA9PT0gVHlwZVNldC5PYmplY3RSZWYpIHtcbiAgICAgICAgICAgIGxldCBlZGl0T2JqID0gYXdhaXQgdGhpcy5idWlsZE5lc3RlZEVkaXRPYmplY3QobWVtYmVyLCBvYmpba2V5XSwgY29udGV4dClcbiAgICAgICAgICAgIGxldCBvYmpSZWZUeXBlID0gbWVtYmVyLnR5cGUgYXMgT2JqZWN0UmVmVHlwZVxuICAgICAgICAgICAgbGV0IHZhbHVlID0gY29udGV4dC52YWx1ZS5yZWYob2JqUmVmVHlwZS5tb2RlbE5hbWUpXG5cbiAgICAgICAgICAgIGZpZWxkcy5wdXNoKG5ldyBGaWVsZChrZXksIHZhbHVlLCBlZGl0T2JqKSlcblxuICAgICAgICAgICAgY29udGludWVcbiAgICAgICAgIH1cblxuICAgICAgICAgbGV0IHZhbHVlID0gVmFsdWVTb3VyY2UucmVzb2x2ZShvYmpba2V5XSBhcyBWYWx1ZUNyZWF0ZVBhcmFtcywgY29udGV4dClcbiAgICAgICAgIGxldCBqc09iaiA9IGF3YWl0IGNvbnRleHQuc2VyaWFsaXplci50b0pzKHZhbHVlKVxuICAgICAgICAgZmllbGRzLnB1c2gobmV3IEZpZWxkKGtleSwgdmFsdWUsIGpzT2JqKSlcbiAgICAgIH1cblxuICAgICAgZm9yIChsZXQgbWVtYmVyIG9mIG1vZGVsLm1lbWJlcnMpIHtcbiAgICAgICAgIGlmIChmaWVsZHMuZmluZChmID0+IGYubmFtZSA9PT0gbWVtYmVyLm5hbWUpICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgICB9XG5cbiAgICAgICAgIGxldCBlZGl0T2JqID0gYXdhaXQgY29udGV4dC5zZXJpYWxpemVyLnRvSnMobWVtYmVyLnZhbHVlKVxuXG4gICAgICAgICBmaWVsZHMucHVzaChuZXcgRmllbGQobWVtYmVyLm5hbWUsIG1lbWJlci52YWx1ZS5jbG9uZSgpLCBlZGl0T2JqKSlcbiAgICAgIH1cblxuICAgICAgLy8gV2UgY3JlYXRlIHRoZSBJRCB3aGVuIHRoZSBPYmplY3QgaXMgc3RvcmVkLlxuICAgICAgLy8gVGhpcyBzYXZlcyByb3VuZCB0cmlwIHRpbWUsIGFuZCBjb3ZlcnMgdGhlIGNhc2Ugd2hlcmUgYW4gXG4gICAgICAvLyBJRCBtYXkgYmUgZ2VuZXJhdGVkLCBhbmQgbm90IHN0b3JlZCBpbiB0aGUgYmFja2VuZCwgYW5kXG4gICAgICAvLyBhbm90aGVyIGVxdWFsIElEIGlzIGdlbmVyYXRlZCBmb3IgYSBkaWZmZXJlbnQgb2JqZWN0LlxuICAgICAgLy9AdHMtaWdub3JlXG4gICAgICByZXR1cm4gbmV3IFByb3h5PElQcm94eU9iamVjdD4obmV3IFByb3h5T2JqZWN0KG1vZGVsLCBVaWRLZWVwZXIuSWROb3RTZXQsIGZpZWxkcyksIGhhbmRsZXIpIGFzIFRcbiAgIH1cblxuICAgc3RhdGljIHVud3JhcChzZXJpYWxpemVkOiBJUHJveHlPYmplY3QpOiBJUHJveHlPYmplY3Qge1xuICAgICAgLy9AdHMtaWdub3JlXG4gICAgICByZXR1cm4gc2VyaWFsaXplZC5fdW53cmFwKClcbiAgIH1cblxuICAgdG9KczxUIGV4dGVuZHMgU3RhY2tPYmplY3Q+KCk6IFQge1xuICAgICAgbGV0IHJlc3VsdCA9IHt9XG5cbiAgICAgIGZvcihsZXQgZmllbGQgb2YgdGhpcy5maWVsZHMpIHtcbiAgICAgICAgIHJlc3VsdFtmaWVsZC5uYW1lXSA9IGZpZWxkLmVkaXRcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlc3VsdCBhcyBUXG4gICB9XG5cbiAgIHByaXZhdGUgc3RhdGljIGFzeW5jIGJ1aWxkTmVzdGVkRWRpdE9iamVjdChtZW1iZXI6IElNZW1iZXIsIGNyZWF0ZVZhbHVlczogVmFsdWVDcmVhdGVQYXJhbXMgfCBPYmplY3RDcmVhdGVQYXJhbXMsIGNvbnRleHQ6IElTdGFja0NvbnRleHQpOiBQcm9taXNlPGFueT4ge1xuICAgICAgbGV0IG9ialJlZlR5cGUgPSBtZW1iZXIudHlwZSBhcyBPYmplY3RSZWZUeXBlXG4gICAgICBsZXQgcmVmVmFsdWUgPSBjb250ZXh0LnZhbHVlLnJlZihvYmpSZWZUeXBlLm1vZGVsTmFtZSlcbiAgICAgIGxldCBlZGl0T2JqID0gYXdhaXQgY29udGV4dC5zZXJpYWxpemVyLnRvSnMocmVmVmFsdWUpXG4gICAgICBsZXQgbW9kZWwgPSBjb250ZXh0LmNhY2hlLmdldE1vZGVsKG9ialJlZlR5cGUubW9kZWxOYW1lKVxuXG4gICAgICBpZihtb2RlbCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEVuY291bnRlcmVkIGFuIGVycm9yIHdoZW4gYnVpbGRpbmcgYW4gRWRpdCBPYmplY3QuIFRoZSBNb2RlbCBmb3IgdGhlIG5lc3RlZCBwcm9wZXJ0eSAke21lbWJlci5uYW1lfSBkb2VzIG5vdCBleGlzdCBgKVxuICAgICAgfVxuXG4gICAgICBmb3IobGV0IGNoaWxkS2V5IG9mIE9iamVjdC5rZXlzKGNyZWF0ZVZhbHVlcykpIHtcbiAgICAgICAgIGxldCBjaGlsZFZhbHVlID0gY3JlYXRlVmFsdWVzW2NoaWxkS2V5XVxuXG4gICAgICAgICBsZXQgY2hpbGRNZW1iZXIgPSBtb2RlbC5tZW1iZXJzLmZpbmQobSA9PiBtLm5hbWUgPT09IGNoaWxkS2V5KVxuXG4gICAgICAgICAvLyBJZ25vcmUgdmFsdWVzIHRoYXQgYXJlIHByb3ZpZGVkIGFuZCB3ZSBkb24ndCBoYXZlIGEgTWVtYmVyIGZvci5cbiAgICAgICAgIC8vIFRoaXMgY291bGQgc2lnbmFsIHRoYXQgdGhlIGRhdGEgdmVyc2lvbnMgYXJlIG1pc21hdGNoZWQsIGFuZCB0aGF0J3Mgb2suXG4gICAgICAgICBpZihjaGlsZE1lbWJlciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjb250aW51ZVxuICAgICAgICAgfVxuXG4gICAgICAgICBpZihjaGlsZE1lbWJlci50eXBlLnR5cGUgPT09IFR5cGVTZXQuT2JqZWN0UmVmKSB7XG4gICAgICAgICAgICBlZGl0T2JqW2NoaWxkS2V5XSA9IGF3YWl0IHRoaXMuYnVpbGROZXN0ZWRFZGl0T2JqZWN0KGNoaWxkTWVtYmVyLCBjaGlsZFZhbHVlLCBjb250ZXh0KVxuICAgICAgICAgICAgY29udGludWVcbiAgICAgICAgIH1cblxuICAgICAgICAgbGV0IHZhbHVlID0gVmFsdWVTb3VyY2UucmVzb2x2ZShjaGlsZFZhbHVlLCBjb250ZXh0KVxuICAgICAgICAgZWRpdE9ialtjaGlsZEtleV0gPSBhd2FpdCBjb250ZXh0LnNlcmlhbGl6ZXIudG9Kcyh2YWx1ZSlcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGVkaXRPYmpcbiAgIH1cblxuICAgaW50ZXJuYWxlU2V0SWQoaWQ6IHN0cmluZyk6IHZvaWQge1xuICAgICAgdGhpcy5faWQgPSBpZFxuICAgfVxufSJdfQ==