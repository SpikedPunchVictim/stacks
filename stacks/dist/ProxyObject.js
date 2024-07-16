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
        let fields = target.fields.map(f => f.name);
        fields.push("id");
        return fields;
    },
    getOwnPropertyDescriptor(target, key) {
        if (key === 'id') {
            return {
                configurable: true,
                enumerable: true,
                value: target.id
            };
        }
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
    get id() {
        return this._id;
    }
    constructor(model, id, fields) {
        this.model = model;
        this.fields = new FieldCollection_1.FieldCollection(fields);
        this._id = id;
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
    /**
     * Returns the IProxyObject that is wrapped in the provided Proxy
     *
     * @param serialized A Proxy. Type 'any' is used here since there are no tests for Proxy
     * @returns
     */
    static unwrap(serialized) {
        //@ts-ignore
        return serialized._unwrap();
    }
    toJs() {
        let result = {};
        for (let field of this.fields) {
            if (field.edit instanceof ProxyObject) {
                let unwrapped = ProxyObject.unwrap(field.edit);
                result[field.name] = unwrapped.toJs();
            }
            else {
                result[field.name] = field.edit;
            }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUHJveHlPYmplY3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvUHJveHlPYmplY3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsd0JBQXFDO0FBQ3JDLG1FQUFrRjtBQUNsRixtQ0FBd0M7QUFLeEMsMkNBQXdDO0FBRXhDLHNEQUFzRTtBQXlCdEUsSUFBSSxPQUFPLEdBQUc7SUFDWCxHQUFHLENBQUMsTUFBb0IsRUFBRSxRQUFnQjtRQUN2QyxJQUFHLFFBQVEsS0FBSyxTQUFTLEVBQUUsQ0FBQztZQUN6Qiw2Q0FBNkM7WUFDN0MsT0FBTztnQkFDSixPQUFPLE1BQU0sQ0FBQTtZQUNoQixDQUFDLENBQUE7UUFDSixDQUFDO1FBRUQsSUFBRyxRQUFRLEtBQUssSUFBSSxFQUFFLENBQUM7WUFDcEIsT0FBTyxNQUFNLENBQUMsRUFBRSxDQUFBO1FBQ25CLENBQUM7UUFFRCxJQUFJLEtBQUssR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQTtRQUV2QyxJQUFHLEtBQUssS0FBSyxTQUFTLEVBQUUsQ0FBQztZQUN0QixrREFBa0Q7WUFDbEQsaURBQWlEO1lBQ2pELG1EQUFtRDtZQUNuRCwrQ0FBK0M7WUFDL0MsT0FBTyxTQUFTLENBQUE7UUFDbkIsQ0FBQztRQUVELE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBQTtJQUNwQixDQUFDO0lBQ0QsR0FBRyxDQUFDLE1BQW9CLEVBQUUsUUFBZ0IsRUFBRSxLQUFVO1FBQ25ELElBQUcsUUFBUSxLQUFLLElBQUksRUFBRSxDQUFDO1lBQ3BCLElBQUksSUFBSSxHQUFHLE1BQXFCLENBQUE7WUFDaEMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQTtZQUMxQixPQUFPLElBQUksQ0FBQTtRQUNkLENBQUM7UUFFRCxJQUFJLEtBQUssR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQTtRQUV2QyxJQUFH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QUFVLEVBQUUsT0FBTyxDQUFDLENBQUE7WUFDcEQsT0FBTyxDQUFDLFFBQVEsQ0FBQyxHQUFHLE1BQU0sT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDM0QsQ0FBQztRQUVELE9BQU8sT0FBTyxDQUFBO0lBQ2pCLENBQUM7SUFFRCxjQUFjLENBQUMsRUFBVTtRQUN0QixJQUFJLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQTtJQUNoQixDQUFDO0NBQ0g7QUF4TEQsa0NBd0xDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSU1lbWJlciwgVHlwZVNldCB9IGZyb20gXCIuXCI7XG5pbXBvcnQgeyBGaWVsZENvbGxlY3Rpb24sIElGaWVsZENvbGxlY3Rpb24gfSBmcm9tIFwiLi9jb2xsZWN0aW9ucy9GaWVsZENvbGxlY3Rpb25cIjtcbmltcG9ydCB7IEZpZWxkLCBJRmllbGQgfSBmcm9tIFwiLi9GaWVsZFwiO1xuaW1wb3J0IHsgSU1vZGVsLCBPYmplY3RDcmVhdGVQYXJhbXMgfSBmcm9tIFwiLi9Nb2RlbFwiO1xuaW1wb3J0IHsgSVZhbHVlU2VyaWFsaXplciB9IGZyb20gXCIuL3NlcmlhbGl6ZS9WYWx1ZVNlcmlhbGl6ZXJcIjtcbmltcG9ydCB7IElTdGFja0NvbnRleHQgfSBmcm9tIFwiLi9zdGFjay9TdGFja0NvbnRleHRcIjtcbmltcG9ydCB7IFN0YWNrT2JqZWN0IH0gZnJvbSBcIi4vU3RhY2tPYmplY3RcIjtcbmltcG9ydCB7IFVpZEtlZXBlciB9IGZyb20gXCIuL1VpZEtlZXBlclwiO1xuaW1wb3J0IHsgT2JqZWN0UmVmVHlwZSB9IGZyb20gXCIuL3ZhbHVlcy9PYmplY3RSZWZcIjtcbmltcG9ydCB7IFZhbHVlQ3JlYXRlUGFyYW1zLCBWYWx1ZVNvdXJjZSB9IGZyb20gXCIuL3ZhbHVlcy9WYWx1ZVNvdXJjZVwiO1xuXG4vKipcbiAqIFRoZSBTZXJpYWxpemVkT2JqZWN0IHN0b3JlcyB0aGUgZGF0YSBiZXR3ZWVuIHRoZSBiYWNrZW5kIGFuZCB0aGUgZnJvbnRlbmQuXG4gKiBJdCBzdG9yZXMgdGhlIG1ldGEgZGF0YSBuZWNlc3NhcnkgdG8gdGllIHRoZSBvYmplY3RzIHVzZWQgb3V0c2lkZSB0aGUgQVBJXG4gKiB0byB0aGVpciBiYWNrZW5kIGNvdW50ZXJwYXJ0cy5cbiAqIFxuICogU2VyaWFsaXplZDogXG4gKiBUaGUgb2JqZWN0IHJlcHJlc2VudGluZyB3aGF0IGlzIHN0b3JlZCBpbiB0aGUgYmFja2VuZFxuICogXG4gKiBEZXNlcmlhbGl6ZWQ6XG4gKiBUaGUgb2JqZWN0IHVzZWQgaW4gdGhlIGZyb250IGVuZC4gVGhlIGZvY3VzIGlzIHRvIHN0YXkgYXMgY2xvc2VcbiAqIHRvIHJhdyBKUyBvYmplY3RzIGFzIHBvc3NpYmxlLiAgIFxuICovXG5cbmV4cG9ydCBpbnRlcmZhY2UgSVByb3h5T2JqZWN0IHtcbiAgIHJlYWRvbmx5IGlkOiBzdHJpbmdcbiAgIHJlYWRvbmx5IGZpZWxkczogSUZpZWxkQ29sbGVjdGlvblxuXG4gICAvKipcbiAgICAqIENvbnZlcnRzIHRoZSBQcm94eSBPYmplY3QgaW50byBhIEphdmFzY3JpcHQgT2JqZWN0XG4gICAgKi9cbiAgIHRvSnM8VCBleHRlbmRzIFN0YWNrT2JqZWN0PigpOiBUXG59XG5cbmxldCBoYW5kbGVyID0ge1xuICAgZ2V0KHRhcmdldDogSVByb3h5T2JqZWN0LCBwcm9wZXJ0eTogc3RyaW5nKTogYW55IHtcbiAgICAgIGlmKHByb3BlcnR5ID09PSAnX3Vud3JhcCcpIHtcbiAgICAgICAgIC8vIFVud3JhcCB0aGUgU2VyaWFsaXplZE9iamVjdCBmcm9tIHRoZSBQcm94eVxuICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRhcmdldFxuICAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZihwcm9wZXJ0eSA9PT0gJ2lkJykge1xuICAgICAgICAgcmV0dXJuIHRhcmdldC5pZFxuICAgICAgfVxuXG4gICAgICBsZXQgZmllbGQgPSB0YXJnZXQuZmllbGRzLmdldChwcm9wZXJ0eSlcblxuICAgICAgaWYoZmllbGQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgLy8gUmV0dXJuaW5nIHVuZGVmaW5lZCBoZXJlIHRvIG5vdCBvbmx5IGdldCBhcm91bmRcbiAgICAgICAgIC8vIG5vdCBoYXZpbmcgdGhlIHByb3BlcnR5LCBidXQgYWxzbyBpbiB0aGUgY2FzZXNcbiAgICAgICAgIC8vIHdoZW4gdGhlIFByb3h5IGlzIGF3YWl0J2QsIHRoZSB1bmRlcmx5aW5nIHN5c3RlbVxuICAgICAgICAgLy8gY2FsbHMgdGhlbigpIHVudGlsIGFuIHVuZGVmaW5lZCBpcyByZXR1cm5lZC5cbiAgICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGZpZWxkLmVkaXRcbiAgIH0sXG4gICBzZXQodGFyZ2V0OiBJUHJveHlPYmplY3QsIHByb3BlcnR5OiBzdHJpbmcsIHZhbHVlOiBhbnkpOiBib29sZWFuIHtcbiAgICAgIGlmKHByb3BlcnR5ID09PSAnaWQnKSB7XG4gICAgICAgICBsZXQgY2FzdCA9IHRhcmdldCBhcyBQcm94eU9iamVjdFxuICAgICAgICAgY2FzdC5pbnRlcm5hbGVTZXRJZCh2YWx1ZSlcbiAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICB9XG5cbiAgICAgIGxldCBmaWVsZCA9IHRhcmdldC5maWVsZHMuZ2V0KHByb3BlcnR5KVxuXG4gICAgICBpZihmaWVsZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cblxuICAgICAgZmllbGQuZWRpdCA9IHZhbHVlXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgfSxcbiAgIG93bktleXModGFyZ2V0OiBJUHJveHlPYmplY3QpOiBzdHJpbmdbXSB7XG4gICAgICBsZXQgZmllbGRzOiBzdHJpbmdbXSA9IHRhcmdldC5maWVsZHMubWFwPHN0cmluZz4oZiA9PiBmLm5hbWUgYXMgc3RyaW5nKVxuICAgICAgZmllbGRzLnB1c2goXCJpZFwiKVxuICAgICAgcmV0dXJuIGZpZWxkc1xuICAgfSxcbiAgIGdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQ6IElQcm94eU9iamVjdCwga2V5OiBzdHJpbmcpIHtcbiAgICAgIGlmKGtleSA9PT0gJ2lkJykge1xuICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgICAgICB2YWx1ZTogdGFyZ2V0LmlkXG4gICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGxldCBmaWVsZCA9IHRhcmdldC5maWVsZHMuZ2V0KGtleSlcblxuICAgICAgaWYoZmllbGQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIHZhbHVlOiB1bmRlZmluZWRcbiAgICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgICB2YWx1ZTogZmllbGQuZWRpdFxuICAgICAgfVxuICAgfVxufVxuXG5leHBvcnQgY2xhc3MgUHJveHlPYmplY3QgaW1wbGVtZW50cyBJUHJveHlPYmplY3Qge1xuICAgcmVhZG9ubHkgZmllbGRzOiBJRmllbGRDb2xsZWN0aW9uXG5cbiAgIGdldCBpZCgpOiBzdHJpbmcge1xuICAgICAgcmV0dXJuIHRoaXMuX2lkXG4gICB9XG5cbiAgIHByaXZhdGUgX2lkOiBzdHJpbmdcblxuICAgcHJpdmF0ZSBjb25zdHJ1Y3RvcihyZWFkb25seSBtb2RlbDogSU1vZGVsLCBpZDogc3RyaW5nLCBmaWVsZHM6IElGaWVsZFtdKSB7XG4gICAgICB0aGlzLmZpZWxkcyA9IG5ldyBGaWVsZENvbGxlY3Rpb24oZmllbGRzKVxuICAgICAgdGhpcy5faWQgPSBpZFxuICAgfVxuXG4gICBzdGF0aWMgYXN5bmMgZnJvbU1vZGVsPFQgZXh0ZW5kcyBTdGFja09iamVjdD4obW9kZWw6IElNb2RlbCwgY29udGV4dDogSVN0YWNrQ29udGV4dCk6IFByb21pc2U8VD4ge1xuICAgICAgbGV0IGZpZWxkcyA9IG5ldyBBcnJheTxJRmllbGQ+KClcblxuICAgICAgZm9yIChsZXQgbWVtYmVyIG9mIG1vZGVsLm1lbWJlcnMpIHtcbiAgICAgICAgIGxldCBlZGl0T2JqID0gYXdhaXQgY29udGV4dC5zZXJpYWxpemVyLnRvSnMobWVtYmVyLnZhbHVlKVxuICAgICAgICAgZmllbGRzLnB1c2gobmV3IEZpZWxkKG1lbWJlci5uYW1lLCBtZW1iZXIudmFsdWUuY2xvbmUoKSwgZWRpdE9iaikpXG4gICAgICB9XG5cbiAgICAgIGxldCBwcm94eSA9IG5ldyBQcm94eU9iamVjdChtb2RlbCwgVWlkS2VlcGVyLklkTm90U2V0LCBmaWVsZHMpXG5cbiAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgcmV0dXJuIG5ldyBQcm94eTxJUHJveHlPYmplY3Q+KHByb3h5LCBoYW5kbGVyKVxuICAgfVxuXG4gICAvKipcbiAgICAqIFRoaXMgY29udmVydHMgYSBTZXJpYWxpemVkIE9iamVjdCAodHlwaWNhbGx5IGZyb20gdGhlIGRhdGEgc3RvcmUpLCBhbmQgY29udmVydHNcbiAgICAqIGl0IGludG8gYSBQcm94eU9iamVjdCB0aGF0IHRoZSBjYWxsZXIgY2FuIGludGVyYWN0IHdpdGguXG4gICAgKiBcbiAgICAqIEBwYXJhbSBtb2RlbCBUaGUgTW9kZWxcbiAgICAqIEBwYXJhbSBzZXJpYWxpemVkIFJhdyBzZXJpYWxpemVkIGRhdGEgdGhhdCBoYXMgYmVlbiBzdG9yZWRcbiAgICAqIEBwYXJhbSBzZXJpYWxpemVyIFRoZSBTZXJpYWxpemVyIHVzZWQgdG8gZGVzZXJpYWxpemVkIHRoZSBzZXJpYWxpemVkIHJhdyBkYXRhXG4gICAgKiBAcmV0dXJucyBQcm94eU9iamVjdFxuICAgICovXG4gICBzdGF0aWMgYXN5bmMgZnJvbVN0b3JlZChtb2RlbDogSU1vZGVsLCBzZXJpYWxpemVkOiBhbnksIHNlcmlhbGl6ZXI6IElWYWx1ZVNlcmlhbGl6ZXIpOiBQcm9taXNlPElQcm94eU9iamVjdD4ge1xuICAgICAgLypcbiAgICAgICAgIEJvb2wgLT4gdHJ1ZVxuICAgICAgICAgSW50IC0+IDBcbiAgICAgICAgIExpc3QgLT5cblxuICAgICAgKi9cblxuICAgICAgbGV0IGZpZWxkcyA9IG5ldyBBcnJheTxJRmllbGQ+KClcblxuICAgICAgZm9yKGxldCBrZXkgb2YgT2JqZWN0LmtleXMoc2VyaWFsaXplZCkpIHtcbiAgICAgICAgIGxldCBtZW1iZXIgPSBtb2RlbC5tZW1iZXJzLmdldChrZXkpXG5cbiAgICAgICAgIGlmKG1lbWJlciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAvLyBUT0RPOiBQb3RlbnRpYWxseSBhZGQgYSB2ZXJzaW9uIGNvbXBhdGliaWxpdHkgbW9kZSB3aGVyZSBpdCBkb2Vzbid0IHRocm93IGFuIGVycm9yP1xuICAgICAgICAgICAgLy8gTWF5IG5lZWQgdG8gc3VwcG9ydCBub3QgdGhyb3dpbmcgYW4gRXJyb3IgZm9yIG1pZ3JhdGlvbnNcbiAgICAgICAgICAgIC8vIENvbnNpZGVyIHR1cm5pbmcgdGhlIElWYWx1ZSBvYmplY3RzIGludG8gbGl0dGxlIFByb3hpZXMgdGhhdCBjYW4gdXBkYXRlXG4gICAgICAgICAgICAvLyB0aGVpciBvd24gZmllbGRzLlxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBBIHByb3BlcnR5IGV4aXN0cyBvbiB0aGVyIHNlcmlhbGl6ZWQgb2JqZWN0LCB0aGF0IGRvZXNuJ3QgZXhpc3QgaW4gdGhlIE1vZGVsLiBNb2RlbCAke21vZGVsLm5hbWV9LCBQcm9wZXJ0eSAke2tleX1gKVxuICAgICAgICAgfVxuXG4gICAgICAgICBsZXQgdmFsdWUgPSBhd2FpdCBzZXJpYWxpemVyLmZyb21KcyhtZW1iZXIudHlwZSwgc2VyaWFsaXplZFtrZXldKVxuXG4gICAgICAgICBmaWVsZHMucHVzaChuZXcgRmllbGQoa2V5LCB2YWx1ZSwgYXdhaXQgc2VyaWFsaXplci50b0pzKHZhbHVlKSkpXG4gICAgICB9XG5cbiAgICAgIGxldCBwcm94eSA9IG5ldyBQcm94eU9iamVjdChtb2RlbCwgc2VyaWFsaXplZC5pZCwgZmllbGRzKVxuXG4gICAgICAvL0B0cy1pZ25vcmVcbiAgICAgIHJldHVybiBuZXcgUHJveHk8SVByb3h5T2JqZWN0Pihwcm94eSwgaGFuZGxlcilcbiAgIH1cblxuICAgLyoqXG4gICAgKiBDcmVhdGVzIGEgUHJveHkgT2JqZWN0IHdoZW4gYW4gT2JqZWN0IGlzIGJlaW5nIGNyZWF0ZWQgaW4tbWVtb3J5IChiZWZvcmUgYmVpbmcgc2F2ZWQpXG4gICAgKiBcbiAgICAqIEBwYXJhbSBtb2RlbCBUaGUgTW9kZWxcbiAgICAqIEBwYXJhbSBvYmogVGhlIG9iamVjdCBiZWluZyBjcmVhdGVkXG4gICAgKiBAcGFyYW0gY29udGV4dCBUaGUgU3RhY2tDb250ZXh0XG4gICAgKiBAcmV0dXJucyBcbiAgICAqL1xuICAgc3RhdGljIGFzeW5jIGZyb21DcmVhdGVkPFQgZXh0ZW5kcyBTdGFja09iamVjdD4obW9kZWw6IElNb2RlbCwgb2JqOiBPYmplY3RDcmVhdGVQYXJhbXMsIGNvbnRleHQ6IElTdGFja0NvbnRleHQpOiBQcm9taXNlPFQ+IHtcbiAgICAgIGxldCBmaWVsZHMgPSBuZXcgQXJyYXk8SUZpZWxkPigpXG5cbiAgICAgIGZvciAobGV0IGtleSBvZiBPYmplY3Qua2V5cyhvYmopKSB7XG4gICAgICAgICBsZXQgbWVtYmVyID0gbW9kZWwubWVtYmVycy5maW5kKG0gPT4gbS5uYW1lID09PSBrZXkpXG5cbiAgICAgICAgIGlmKG1lbWJlciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAvLyBJZ25vcmUga2V5cyB0aGF0IGRvbid0IGhhdmUgbWF0Y2hpbmcgbWVtYmVyc1xuICAgICAgICAgICAgLy8gTm90ZTogVGhpcyBjb3VsZCBiZSBhIHZlcnNpb24gbWlzbWF0Y2ggYmV0d2VlbiB0aGUgZGF0YVxuICAgICAgICAgICAgY29udGludWVcbiAgICAgICAgIH1cblxuICAgICAgICAgaWYobWVtYmVyLnR5cGUudHlwZSA9PT0gVHlwZVNldC5PYmplY3RSZWYpIHtcbiAgICAgICAgICAgIGxldCBlZGl0T2JqID0gYXdhaXQgdGhpcy5idWlsZE5lc3RlZEVkaXRPYmplY3QobWVtYmVyLCBvYmpba2V5XSwgY29udGV4dClcbiAgICAgICAgICAgIGxldCBvYmpSZWZUeXBlID0gbWVtYmVyLnR5cGUgYXMgT2JqZWN0UmVmVHlwZVxuICAgICAgICAgICAgbGV0IHZhbHVlID0gY29udGV4dC52YWx1ZS5yZWYob2JqUmVmVHlwZS5tb2RlbE5hbWUpXG5cbiAgICAgICAgICAgIGZpZWxkcy5wdXNoKG5ldyBGaWVsZChrZXksIHZhbHVlLCBlZGl0T2JqKSlcblxuICAgICAgICAgICAgY29udGludWVcbiAgICAgICAgIH1cblxuICAgICAgICAgbGV0IHZhbHVlID0gVmFsdWVTb3VyY2UucmVzb2x2ZShvYmpba2V5XSBhcyBWYWx1ZUNyZWF0ZVBhcmFtcywgY29udGV4dClcbiAgICAgICAgIGxldCBqc09iaiA9IGF3YWl0IGNvbnRleHQuc2VyaWFsaXplci50b0pzKHZhbHVlKVxuICAgICAgICAgZmllbGRzLnB1c2gobmV3IEZpZWxkKGtleSwgdmFsdWUsIGpzT2JqKSlcbiAgICAgIH1cblxuICAgICAgZm9yIChsZXQgbWVtYmVyIG9mIG1vZGVsLm1lbWJlcnMpIHtcbiAgICAgICAgIGlmIChmaWVsZHMuZmluZChmID0+IGYubmFtZSA9PT0gbWVtYmVyLm5hbWUpICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgICB9XG5cbiAgICAgICAgIGxldCBlZGl0T2JqID0gYXdhaXQgY29udGV4dC5zZXJpYWxpemVyLnRvSnMobWVtYmVyLnZhbHVlKVxuXG4gICAgICAgICBmaWVsZHMucHVzaChuZXcgRmllbGQobWVtYmVyLm5hbWUsIG1lbWJlci52YWx1ZS5jbG9uZSgpLCBlZGl0T2JqKSlcbiAgICAgIH1cblxuICAgICAgLy8gV2UgY3JlYXRlIHRoZSBJRCB3aGVuIHRoZSBPYmplY3QgaXMgc3RvcmVkLlxuICAgICAgLy8gVGhpcyBzYXZlcyByb3VuZCB0cmlwIHRpbWUsIGFuZCBjb3ZlcnMgdGhlIGNhc2Ugd2hlcmUgYW4gXG4gICAgICAvLyBJRCBtYXkgYmUgZ2VuZXJhdGVkLCBhbmQgbm90IHN0b3JlZCBpbiB0aGUgYmFja2VuZCwgYW5kXG4gICAgICAvLyBhbm90aGVyIGVxdWFsIElEIGlzIGdlbmVyYXRlZCBmb3IgYSBkaWZmZXJlbnQgb2JqZWN0LlxuICAgICAgLy9AdHMtaWdub3JlXG4gICAgICByZXR1cm4gbmV3IFByb3h5PElQcm94eU9iamVjdD4obmV3IFByb3h5T2JqZWN0KG1vZGVsLCBVaWRLZWVwZXIuSWROb3RTZXQsIGZpZWxkcyksIGhhbmRsZXIpIGFzIFRcbiAgIH1cblxuICAgLyoqXG4gICAgKiBSZXR1cm5zIHRoZSBJUHJveHlPYmplY3QgdGhhdCBpcyB3cmFwcGVkIGluIHRoZSBwcm92aWRlZCBQcm94eVxuICAgICogXG4gICAgKiBAcGFyYW0gc2VyaWFsaXplZCBBIFByb3h5LiBUeXBlICdhbnknIGlzIHVzZWQgaGVyZSBzaW5jZSB0aGVyZSBhcmUgbm8gdGVzdHMgZm9yIFByb3h5XG4gICAgKiBAcmV0dXJucyBcbiAgICAqL1xuICAgc3RhdGljIHVud3JhcChzZXJpYWxpemVkOiBhbnkpOiBJUHJveHlPYmplY3Qge1xuICAgICAgLy9AdHMtaWdub3JlXG4gICAgICByZXR1cm4gc2VyaWFsaXplZC5fdW53cmFwKClcbiAgIH1cblxuICAgdG9KczxUIGV4dGVuZHMgU3RhY2tPYmplY3Q+KCk6IFQge1xuICAgICAgbGV0IHJlc3VsdCA9IHt9XG5cbiAgICAgIGZvcihsZXQgZmllbGQgb2YgdGhpcy5maWVsZHMpIHtcbiAgICAgICAgIGlmKGZpZWxkLmVkaXQgaW5zdGFuY2VvZiBQcm94eU9iamVjdCkge1xuICAgICAgICAgICAgbGV0IHVud3JhcHBlZCA9IFByb3h5T2JqZWN0LnVud3JhcChmaWVsZC5lZGl0KVxuICAgICAgICAgICAgcmVzdWx0W2ZpZWxkLm5hbWVdID0gdW53cmFwcGVkLnRvSnMoKVxuICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc3VsdFtmaWVsZC5uYW1lXSA9IGZpZWxkLmVkaXRcbiAgICAgICAgIH0gICAgICAgICBcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlc3VsdCBhcyBUXG4gICB9XG5cbiAgIHByaXZhdGUgc3RhdGljIGFzeW5jIGJ1aWxkTmVzdGVkRWRpdE9iamVjdChtZW1iZXI6IElNZW1iZXIsIGNyZWF0ZVZhbHVlczogVmFsdWVDcmVhdGVQYXJhbXMgfCBPYmplY3RDcmVhdGVQYXJhbXMsIGNvbnRleHQ6IElTdGFja0NvbnRleHQpOiBQcm9taXNlPGFueT4ge1xuICAgICAgbGV0IG9ialJlZlR5cGUgPSBtZW1iZXIudHlwZSBhcyBPYmplY3RSZWZUeXBlXG4gICAgICBsZXQgcmVmVmFsdWUgPSBjb250ZXh0LnZhbHVlLnJlZihvYmpSZWZUeXBlLm1vZGVsTmFtZSlcbiAgICAgIGxldCBlZGl0T2JqID0gYXdhaXQgY29udGV4dC5zZXJpYWxpemVyLnRvSnMocmVmVmFsdWUpXG4gICAgICBsZXQgbW9kZWwgPSBjb250ZXh0LmNhY2hlLmdldE1vZGVsKG9ialJlZlR5cGUubW9kZWxOYW1lKVxuXG4gICAgICBpZihtb2RlbCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEVuY291bnRlcmVkIGFuIGVycm9yIHdoZW4gYnVpbGRpbmcgYW4gRWRpdCBPYmplY3QuIFRoZSBNb2RlbCBmb3IgdGhlIG5lc3RlZCBwcm9wZXJ0eSAke21lbWJlci5uYW1lfSBkb2VzIG5vdCBleGlzdCBgKVxuICAgICAgfVxuXG4gICAgICBmb3IobGV0IGNoaWxkS2V5IG9mIE9iamVjdC5rZXlzKGNyZWF0ZVZhbHVlcykpIHtcbiAgICAgICAgIGxldCBjaGlsZFZhbHVlID0gY3JlYXRlVmFsdWVzW2NoaWxkS2V5XVxuXG4gICAgICAgICBsZXQgY2hpbGRNZW1iZXIgPSBtb2RlbC5tZW1iZXJzLmZpbmQobSA9PiBtLm5hbWUgPT09IGNoaWxkS2V5KVxuXG4gICAgICAgICAvLyBJZ25vcmUgdmFsdWVzIHRoYXQgYXJlIHByb3ZpZGVkIGFuZCB3ZSBkb24ndCBoYXZlIGEgTWVtYmVyIGZvci5cbiAgICAgICAgIC8vIFRoaXMgY291bGQgc2lnbmFsIHRoYXQgdGhlIGRhdGEgdmVyc2lvbnMgYXJlIG1pc21hdGNoZWQsIGFuZCB0aGF0J3Mgb2suXG4gICAgICAgICBpZihjaGlsZE1lbWJlciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjb250aW51ZVxuICAgICAgICAgfVxuXG4gICAgICAgICBpZihjaGlsZE1lbWJlci50eXBlLnR5cGUgPT09IFR5cGVTZXQuT2JqZWN0UmVmKSB7XG4gICAgICAgICAgICBlZGl0T2JqW2NoaWxkS2V5XSA9IGF3YWl0IHRoaXMuYnVpbGROZXN0ZWRFZGl0T2JqZWN0KGNoaWxkTWVtYmVyLCBjaGlsZFZhbHVlLCBjb250ZXh0KVxuICAgICAgICAgICAgY29udGludWVcbiAgICAgICAgIH1cblxuICAgICAgICAgbGV0IHZhbHVlID0gVmFsdWVTb3VyY2UucmVzb2x2ZShjaGlsZFZhbHVlLCBjb250ZXh0KVxuICAgICAgICAgZWRpdE9ialtjaGlsZEtleV0gPSBhd2FpdCBjb250ZXh0LnNlcmlhbGl6ZXIudG9Kcyh2YWx1ZSlcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGVkaXRPYmpcbiAgIH1cblxuICAgaW50ZXJuYWxlU2V0SWQoaWQ6IHN0cmluZyk6IHZvaWQge1xuICAgICAgdGhpcy5faWQgPSBpZFxuICAgfVxufSJdfQ==