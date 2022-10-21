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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUHJveHlPYmplY3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvUHJveHlPYmplY3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsd0JBQXFDO0FBQ3JDLG1FQUFrRjtBQUNsRixtQ0FBd0M7QUFLeEMsMkNBQXdDO0FBRXhDLHNEQUFzRTtBQXlCdEUsSUFBSSxPQUFPLEdBQUc7SUFDWCxHQUFHLENBQUMsTUFBb0IsRUFBRSxRQUFnQjtRQUN2QyxJQUFHLFFBQVEsS0FBSyxTQUFTLEVBQUU7WUFDeEIsNkNBQTZDO1lBQzdDLE9BQU87Z0JBQ0osT0FBTyxNQUFNLENBQUE7WUFDaEIsQ0FBQyxDQUFBO1NBQ0g7UUFFRCxJQUFHLFFBQVEsS0FBSyxJQUFJLEVBQUU7WUFDbkIsT0FBTyxNQUFNLENBQUMsRUFBRSxDQUFBO1NBQ2xCO1FBRUQsSUFBSSxLQUFLLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUE7UUFFdkMsSUFBRyxLQUFLLEtBQUssU0FBUyxFQUFFO1lBQ3JCLGtEQUFrRDtZQUNsRCxpREFBaUQ7WUFDakQsbURBQW1EO1lBQ25ELCtDQUErQztZQUMvQyxPQUFPLFNBQVMsQ0FBQTtTQUNsQjtRQUVELE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBQTtJQUNwQixDQUFDO0lBQ0QsR0FBRyxDQUFDLE1BQW9CLEVBQUUsUUFBZ0IsRUFBRSxLQUFVO1FBQ25ELElBQUcsUUFBUSxLQUFLLElBQUksRUFBRTtZQUNuQixJQUFJLElBQUksR0FBRyxNQUFxQixDQUFBO1lBQ2hDLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUE7WUFDMUIsT0FBTyxJQUFJLENBQUE7U0FDYjtRQUVELElBQUksS0FBSyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFBO1FBRXZDLElBQUcsS0FBSyxLQUFLLFNBQVMsRUFBRTtZQUNyQixPQUFPLEtBQUssQ0FB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QVEsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFO1lBQzVDLElBQUksVUFBVSxHQUFHLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQTtZQUV2QyxJQUFJLFdBQVcsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssUUFBUSxDQUFDLENBQUE7WUFFOUQsa0VBQWtFO1lBQ2xFLDBFQUEwRTtZQUMxRSxJQUFHLFdBQVcsS0FBSyxTQUFTLEVBQUU7Z0JBQzNCLFNBQVE7YUFDVjtZQUVELElBQUcsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssVUFBTyxDQUFDLFNBQVMsRUFBRTtnQkFDN0MsT0FBTyxDQUFDLFFBQVEsQ0FBQyxHQUFHLE1BQU0sSUFBSSxDQUFDLHFCQUFxQixDQUFDLFdBQVcsRUFBRSxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUE7Z0JBQ3RGLFNBQVE7YUFDVjtZQUVELElBQUksS0FBSyxHQUFHLHlCQUFXLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQTtZQUNwRCxPQUFPLENBQUMsUUFBUSxDQUFDLEdBQUcsTUFBTSxPQUFPLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtTQUMxRDtRQUVELE9BQU8sT0FBTyxDQUFBO0lBQ2pCLENBQUM7SUFFRCxjQUFjLENBQUMsRUFBVTtRQUN0QixJQUFJLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQTtJQUNoQixDQUFDO0NBQ0g7QUF4TEQsa0NBd0xDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSU1lbWJlciwgVHlwZVNldCB9IGZyb20gXCIuXCI7XG5pbXBvcnQgeyBGaWVsZENvbGxlY3Rpb24sIElGaWVsZENvbGxlY3Rpb24gfSBmcm9tIFwiLi9jb2xsZWN0aW9ucy9GaWVsZENvbGxlY3Rpb25cIjtcbmltcG9ydCB7IEZpZWxkLCBJRmllbGQgfSBmcm9tIFwiLi9GaWVsZFwiO1xuaW1wb3J0IHsgSU1vZGVsLCBPYmplY3RDcmVhdGVQYXJhbXMgfSBmcm9tIFwiLi9Nb2RlbFwiO1xuaW1wb3J0IHsgSVZhbHVlU2VyaWFsaXplciB9IGZyb20gXCIuL3NlcmlhbGl6ZS9WYWx1ZVNlcmlhbGl6ZXJcIjtcbmltcG9ydCB7IElTdGFja0NvbnRleHQgfSBmcm9tIFwiLi9zdGFjay9TdGFja0NvbnRleHRcIjtcbmltcG9ydCB7IFN0YWNrT2JqZWN0IH0gZnJvbSBcIi4vU3RhY2tPYmplY3RcIjtcbmltcG9ydCB7IFVpZEtlZXBlciB9IGZyb20gXCIuL1VpZEtlZXBlclwiO1xuaW1wb3J0IHsgT2JqZWN0UmVmVHlwZSB9IGZyb20gXCIuL3ZhbHVlcy9PYmplY3RSZWZcIjtcbmltcG9ydCB7IFZhbHVlQ3JlYXRlUGFyYW1zLCBWYWx1ZVNvdXJjZSB9IGZyb20gXCIuL3ZhbHVlcy9WYWx1ZVNvdXJjZVwiO1xuXG4vKipcbiAqIFRoZSBTZXJpYWxpemVkT2JqZWN0IHN0b3JlcyB0aGUgZGF0YSBiZXR3ZWVuIHRoZSBiYWNrZW5kIGFuZCB0aGUgZnJvbnRlbmQuXG4gKiBJdCBzdG9yZXMgdGhlIG1ldGEgZGF0YSBuZWNlc3NhcnkgdG8gdGllIHRoZSBvYmplY3RzIHVzZWQgb3V0c2lkZSB0aGUgQVBJXG4gKiB0byB0aGVpciBiYWNrZW5kIGNvdW50ZXJwYXJ0cy5cbiAqIFxuICogU2VyaWFsaXplZDogXG4gKiBUaGUgb2JqZWN0IHJlcHJlc2VudGluZyB3aGF0IGlzIHN0b3JlZCBpbiB0aGUgYmFja2VuZFxuICogXG4gKiBEZXNlcmlhbGl6ZWQ6XG4gKiBUaGUgb2JqZWN0IHVzZWQgaW4gdGhlIGZyb250IGVuZC4gVGhlIGZvY3VzIGlzIHRvIHN0YXkgYXMgY2xvc2VcbiAqIHRvIHJhdyBKUyBvYmplY3RzIGFzIHBvc3NpYmxlLiAgIFxuICovXG5cbmV4cG9ydCBpbnRlcmZhY2UgSVByb3h5T2JqZWN0IHtcbiAgIHJlYWRvbmx5IGlkOiBzdHJpbmdcbiAgIHJlYWRvbmx5IGZpZWxkczogSUZpZWxkQ29sbGVjdGlvblxuXG4gICAvKipcbiAgICAqIENvbnZlcnRzIHRoZSBQcm94eSBPYmplY3QgaW50byBhIEphdmFzY3JpcHQgT2JqZWN0XG4gICAgKi9cbiAgIHRvSnM8VCBleHRlbmRzIFN0YWNrT2JqZWN0PigpOiBUXG59XG5cbmxldCBoYW5kbGVyID0ge1xuICAgZ2V0KHRhcmdldDogSVByb3h5T2JqZWN0LCBwcm9wZXJ0eTogc3RyaW5nKTogYW55IHtcbiAgICAgIGlmKHByb3BlcnR5ID09PSAnX3Vud3JhcCcpIHtcbiAgICAgICAgIC8vIFVud3JhcCB0aGUgU2VyaWFsaXplZE9iamVjdCBmcm9tIHRoZSBQcm94eVxuICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRhcmdldFxuICAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZihwcm9wZXJ0eSA9PT0gJ2lkJykge1xuICAgICAgICAgcmV0dXJuIHRhcmdldC5pZFxuICAgICAgfVxuXG4gICAgICBsZXQgZmllbGQgPSB0YXJnZXQuZmllbGRzLmdldChwcm9wZXJ0eSlcblxuICAgICAgaWYoZmllbGQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgLy8gUmV0dXJuaW5nIHVuZGVmaW5lZCBoZXJlIHRvIG5vdCBvbmx5IGdldCBhcm91bmRcbiAgICAgICAgIC8vIG5vdCBoYXZpbmcgdGhlIHByb3BlcnR5LCBidXQgYWxzbyBpbiB0aGUgY2FzZXNcbiAgICAgICAgIC8vIHdoZW4gdGhlIFByb3h5IGlzIGF3YWl0J2QsIHRoZSB1bmRlcmx5aW5nIHN5c3RlbVxuICAgICAgICAgLy8gY2FsbHMgdGhlbigpIHVudGlsIGFuIHVuZGVmaW5lZCBpcyByZXR1cm5lZC5cbiAgICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGZpZWxkLmVkaXRcbiAgIH0sXG4gICBzZXQodGFyZ2V0OiBJUHJveHlPYmplY3QsIHByb3BlcnR5OiBzdHJpbmcsIHZhbHVlOiBhbnkpOiBib29sZWFuIHtcbiAgICAgIGlmKHByb3BlcnR5ID09PSAnaWQnKSB7XG4gICAgICAgICBsZXQgY2FzdCA9IHRhcmdldCBhcyBQcm94eU9iamVjdFxuICAgICAgICAgY2FzdC5pbnRlcm5hbGVTZXRJZCh2YWx1ZSlcbiAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICB9XG5cbiAgICAgIGxldCBmaWVsZCA9IHRhcmdldC5maWVsZHMuZ2V0KHByb3BlcnR5KVxuXG4gICAgICBpZihmaWVsZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cblxuICAgICAgZmllbGQuZWRpdCA9IHZhbHVlXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgfSxcbiAgIG93bktleXModGFyZ2V0OiBJUHJveHlPYmplY3QpOiB2b2lkW10ge1xuICAgICAgcmV0dXJuIHRhcmdldC5maWVsZHMubWFwKGYgPT4gZi5uYW1lIGFzIHN0cmluZylcbiAgIH0sXG4gICBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0OiBJUHJveHlPYmplY3QsIGtleTogc3RyaW5nKSB7XG4gICAgICBsZXQgZmllbGQgPSB0YXJnZXQuZmllbGRzLmdldChrZXkpXG5cbiAgICAgIGlmKGZpZWxkID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgICAgICB2YWx1ZTogdW5kZWZpbmVkXG4gICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICAgdmFsdWU6IGZpZWxkLmVkaXRcbiAgICAgIH1cbiAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFByb3h5T2JqZWN0IGltcGxlbWVudHMgSVByb3h5T2JqZWN0IHtcbiAgIHJlYWRvbmx5IGZpZWxkczogSUZpZWxkQ29sbGVjdGlvblxuXG4gICBnZXQgaWQoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiB0aGlzLl9pZFxuICAgfVxuXG4gICBwcml2YXRlIF9pZDogc3RyaW5nXG5cbiAgIHByaXZhdGUgY29uc3RydWN0b3IocmVhZG9ubHkgbW9kZWw6IElNb2RlbCwgaWQ6IHN0cmluZywgZmllbGRzOiBJRmllbGRbXSkge1xuICAgICAgdGhpcy5maWVsZHMgPSBuZXcgRmllbGRDb2xsZWN0aW9uKGZpZWxkcylcbiAgICAgIHRoaXMuX2lkID0gaWRcbiAgIH1cblxuICAgc3RhdGljIGFzeW5jIGZyb21Nb2RlbDxUIGV4dGVuZHMgU3RhY2tPYmplY3Q+KG1vZGVsOiBJTW9kZWwsIGNvbnRleHQ6IElTdGFja0NvbnRleHQpOiBQcm9taXNlPFQ+IHtcbiAgICAgIGxldCBmaWVsZHMgPSBuZXcgQXJyYXk8SUZpZWxkPigpXG5cbiAgICAgIGZvciAobGV0IG1lbWJlciBvZiBtb2RlbC5tZW1iZXJzKSB7XG4gICAgICAgICBsZXQgZWRpdE9iaiA9IGF3YWl0IGNvbnRleHQuc2VyaWFsaXplci50b0pzKG1lbWJlci52YWx1ZSlcbiAgICAgICAgIGZpZWxkcy5wdXNoKG5ldyBGaWVsZChtZW1iZXIubmFtZSwgbWVtYmVyLnZhbHVlLmNsb25lKCksIGVkaXRPYmopKVxuICAgICAgfVxuXG4gICAgICBsZXQgcHJveHkgPSBuZXcgUHJveHlPYmplY3QobW9kZWwsIFVpZEtlZXBlci5JZE5vdFNldCwgZmllbGRzKVxuXG4gICAgICAvL0B0cy1pZ25vcmVcbiAgICAgIHJldHVybiBuZXcgUHJveHk8SVByb3h5T2JqZWN0Pihwcm94eSwgaGFuZGxlcilcbiAgIH1cblxuICAgLyoqXG4gICAgKiBUaGlzIGNvbnZlcnRzIGEgU2VyaWFsaXplZCBPYmplY3QgKHR5cGljYWxseSBmcm9tIHRoZSBkYXRhIHN0b3JlKSwgYW5kIGNvbnZlcnRzXG4gICAgKiBpdCBpbnRvIGEgUHJveHlPYmplY3QgdGhhdCB0aGUgY2FsbGVyIGNhbiBpbnRlcmFjdCB3aXRoLlxuICAgICogXG4gICAgKiBAcGFyYW0gbW9kZWwgVGhlIE1vZGVsXG4gICAgKiBAcGFyYW0gc2VyaWFsaXplZCBSYXcgc2VyaWFsaXplZCBkYXRhIHRoYXQgaGFzIGJlZW4gc3RvcmVkXG4gICAgKiBAcGFyYW0gc2VyaWFsaXplciBUaGUgU2VyaWFsaXplciB1c2VkIHRvIGRlc2VyaWFsaXplZCB0aGUgc2VyaWFsaXplZCByYXcgZGF0YVxuICAgICogQHJldHVybnMgUHJveHlPYmplY3RcbiAgICAqL1xuICAgc3RhdGljIGFzeW5jIGZyb21TdG9yZWQobW9kZWw6IElNb2RlbCwgc2VyaWFsaXplZDogYW55LCBzZXJpYWxpemVyOiBJVmFsdWVTZXJpYWxpemVyKTogUHJvbWlzZTxJUHJveHlPYmplY3Q+IHtcbiAgICAgIC8qXG4gICAgICAgICBCb29sIC0+IHRydWVcbiAgICAgICAgIEludCAtPiAwXG4gICAgICAgICBMaXN0IC0+XG5cbiAgICAgICovXG5cbiAgICAgIGxldCBmaWVsZHMgPSBuZXcgQXJyYXk8SUZpZWxkPigpXG5cbiAgICAgIGZvcihsZXQga2V5IG9mIE9iamVjdC5rZXlzKHNlcmlhbGl6ZWQpKSB7XG4gICAgICAgICBsZXQgbWVtYmVyID0gbW9kZWwubWVtYmVycy5nZXQoa2V5KVxuXG4gICAgICAgICBpZihtZW1iZXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgLy8gVE9ETzogUG90ZW50aWFsbHkgYWRkIGEgdmVyc2lvbiBjb21wYXRpYmlsaXR5IG1vZGUgd2hlcmUgaXQgZG9lc24ndCB0aHJvdyBhbiBlcnJvcj9cbiAgICAgICAgICAgIC8vIE1heSBuZWVkIHRvIHN1cHBvcnQgbm90IHRocm93aW5nIGFuIEVycm9yIGZvciBtaWdyYXRpb25zXG4gICAgICAgICAgICAvLyBDb25zaWRlciB0dXJuaW5nIHRoZSBJVmFsdWUgb2JqZWN0cyBpbnRvIGxpdHRsZSBQcm94aWVzIHRoYXQgY2FuIHVwZGF0ZVxuICAgICAgICAgICAgLy8gdGhlaXIgb3duIGZpZWxkcy5cbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgQSBwcm9wZXJ0eSBleGlzdHMgb24gdGhlciBzZXJpYWxpemVkIG9iamVjdCwgdGhhdCBkb2Vzbid0IGV4aXN0IGluIHRoZSBNb2RlbC4gTW9kZWwgJHttb2RlbC5uYW1lfSwgUHJvcGVydHkgJHtrZXl9YClcbiAgICAgICAgIH1cblxuICAgICAgICAgbGV0IHZhbHVlID0gYXdhaXQgc2VyaWFsaXplci5mcm9tSnMobWVtYmVyLnR5cGUsIHNlcmlhbGl6ZWRba2V5XSlcblxuICAgICAgICAgZmllbGRzLnB1c2gobmV3IEZpZWxkKGtleSwgdmFsdWUsIGF3YWl0IHNlcmlhbGl6ZXIudG9Kcyh2YWx1ZSkpKVxuICAgICAgfVxuXG4gICAgICBsZXQgcHJveHkgPSBuZXcgUHJveHlPYmplY3QobW9kZWwsIHNlcmlhbGl6ZWQuaWQsIGZpZWxkcylcblxuICAgICAgLy9AdHMtaWdub3JlXG4gICAgICByZXR1cm4gbmV3IFByb3h5PElQcm94eU9iamVjdD4ocHJveHksIGhhbmRsZXIpXG4gICB9XG5cbiAgIC8qKlxuICAgICogQ3JlYXRlcyBhIFByb3h5IE9iamVjdCB3aGVuIGFuIE9iamVjdCBpcyBiZWluZyBjcmVhdGVkIGluLW1lbW9yeSAoYmVmb3JlIGJlaW5nIHNhdmVkKVxuICAgICogXG4gICAgKiBAcGFyYW0gbW9kZWwgVGhlIE1vZGVsXG4gICAgKiBAcGFyYW0gb2JqIFRoZSBvYmplY3QgYmVpbmcgY3JlYXRlZFxuICAgICogQHBhcmFtIGNvbnRleHQgVGhlIFN0YWNrQ29udGV4dFxuICAgICogQHJldHVybnMgXG4gICAgKi9cbiAgIHN0YXRpYyBhc3luYyBmcm9tQ3JlYXRlZDxUIGV4dGVuZHMgU3RhY2tPYmplY3Q+KG1vZGVsOiBJTW9kZWwsIG9iajogT2JqZWN0Q3JlYXRlUGFyYW1zLCBjb250ZXh0OiBJU3RhY2tDb250ZXh0KTogUHJvbWlzZTxUPiB7XG4gICAgICBsZXQgZmllbGRzID0gbmV3IEFycmF5PElGaWVsZD4oKVxuXG4gICAgICBmb3IgKGxldCBrZXkgb2YgT2JqZWN0LmtleXMob2JqKSkge1xuICAgICAgICAgbGV0IG1lbWJlciA9IG1vZGVsLm1lbWJlcnMuZmluZChtID0+IG0ubmFtZSA9PT0ga2V5KVxuXG4gICAgICAgICBpZihtZW1iZXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgLy8gSWdub3JlIGtleXMgdGhhdCBkb24ndCBoYXZlIG1hdGNoaW5nIG1lbWJlcnNcbiAgICAgICAgICAgIC8vIE5vdGU6IFRoaXMgY291bGQgYmUgYSB2ZXJzaW9uIG1pc21hdGNoIGJldHdlZW4gdGhlIGRhdGFcbiAgICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgICB9XG5cbiAgICAgICAgIGlmKG1lbWJlci50eXBlLnR5cGUgPT09IFR5cGVTZXQuT2JqZWN0UmVmKSB7XG4gICAgICAgICAgICBsZXQgZWRpdE9iaiA9IGF3YWl0IHRoaXMuYnVpbGROZXN0ZWRFZGl0T2JqZWN0KG1lbWJlciwgb2JqW2tleV0sIGNvbnRleHQpXG4gICAgICAgICAgICBsZXQgb2JqUmVmVHlwZSA9IG1lbWJlci50eXBlIGFzIE9iamVjdFJlZlR5cGVcbiAgICAgICAgICAgIGxldCB2YWx1ZSA9IGNvbnRleHQudmFsdWUucmVmKG9ialJlZlR5cGUubW9kZWxOYW1lKVxuXG4gICAgICAgICAgICBmaWVsZHMucHVzaChuZXcgRmllbGQoa2V5LCB2YWx1ZSwgZWRpdE9iaikpXG5cbiAgICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgICB9XG5cbiAgICAgICAgIGxldCB2YWx1ZSA9IFZhbHVlU291cmNlLnJlc29sdmUob2JqW2tleV0gYXMgVmFsdWVDcmVhdGVQYXJhbXMsIGNvbnRleHQpXG4gICAgICAgICBsZXQganNPYmogPSBhd2FpdCBjb250ZXh0LnNlcmlhbGl6ZXIudG9Kcyh2YWx1ZSlcbiAgICAgICAgIGZpZWxkcy5wdXNoKG5ldyBGaWVsZChrZXksIHZhbHVlLCBqc09iaikpXG4gICAgICB9XG5cbiAgICAgIGZvciAobGV0IG1lbWJlciBvZiBtb2RlbC5tZW1iZXJzKSB7XG4gICAgICAgICBpZiAoZmllbGRzLmZpbmQoZiA9PiBmLm5hbWUgPT09IG1lbWJlci5uYW1lKSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjb250aW51ZVxuICAgICAgICAgfVxuXG4gICAgICAgICBsZXQgZWRpdE9iaiA9IGF3YWl0IGNvbnRleHQuc2VyaWFsaXplci50b0pzKG1lbWJlci52YWx1ZSlcblxuICAgICAgICAgZmllbGRzLnB1c2gobmV3IEZpZWxkKG1lbWJlci5uYW1lLCBtZW1iZXIudmFsdWUuY2xvbmUoKSwgZWRpdE9iaikpXG4gICAgICB9XG5cbiAgICAgIC8vIFdlIGNyZWF0ZSB0aGUgSUQgd2hlbiB0aGUgT2JqZWN0IGlzIHN0b3JlZC5cbiAgICAgIC8vIFRoaXMgc2F2ZXMgcm91bmQgdHJpcCB0aW1lLCBhbmQgY292ZXJzIHRoZSBjYXNlIHdoZXJlIGFuIFxuICAgICAgLy8gSUQgbWF5IGJlIGdlbmVyYXRlZCwgYW5kIG5vdCBzdG9yZWQgaW4gdGhlIGJhY2tlbmQsIGFuZFxuICAgICAgLy8gYW5vdGhlciBlcXVhbCBJRCBpcyBnZW5lcmF0ZWQgZm9yIGEgZGlmZmVyZW50IG9iamVjdC5cbiAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgcmV0dXJuIG5ldyBQcm94eTxJUHJveHlPYmplY3Q+KG5ldyBQcm94eU9iamVjdChtb2RlbCwgVWlkS2VlcGVyLklkTm90U2V0LCBmaWVsZHMpLCBoYW5kbGVyKSBhcyBUXG4gICB9XG5cbiAgIC8qKlxuICAgICogUmV0dXJucyB0aGUgSVByb3h5T2JqZWN0IHRoYXQgaXMgd3JhcHBlZCBpbiB0aGUgcHJvdmlkZWQgUHJveHlcbiAgICAqIFxuICAgICogQHBhcmFtIHNlcmlhbGl6ZWQgQSBQcm94eS4gVHlwZSAnYW55JyBpcyB1c2VkIGhlcmUgc2luY2UgdGhlcmUgYXJlIG5vIHRlc3RzIGZvciBQcm94eVxuICAgICogQHJldHVybnMgXG4gICAgKi9cbiAgIHN0YXRpYyB1bndyYXAoc2VyaWFsaXplZDogYW55KTogSVByb3h5T2JqZWN0IHtcbiAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgcmV0dXJuIHNlcmlhbGl6ZWQuX3Vud3JhcCgpXG4gICB9XG5cbiAgIHRvSnM8VCBleHRlbmRzIFN0YWNrT2JqZWN0PigpOiBUIHtcbiAgICAgIGxldCByZXN1bHQgPSB7fVxuXG4gICAgICBmb3IobGV0IGZpZWxkIG9mIHRoaXMuZmllbGRzKSB7XG4gICAgICAgICBpZihmaWVsZC5lZGl0IGluc3RhbmNlb2YgUHJveHlPYmplY3QpIHtcbiAgICAgICAgICAgIGxldCB1bndyYXBwZWQgPSBQcm94eU9iamVjdC51bndyYXAoZmllbGQuZWRpdClcbiAgICAgICAgICAgIHJlc3VsdFtmaWVsZC5uYW1lXSA9IHVud3JhcHBlZC50b0pzKClcbiAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXN1bHRbZmllbGQubmFtZV0gPSBmaWVsZC5lZGl0XG4gICAgICAgICB9ICAgICAgICAgXG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXN1bHQgYXMgVFxuICAgfVxuXG4gICBwcml2YXRlIHN0YXRpYyBhc3luYyBidWlsZE5lc3RlZEVkaXRPYmplY3QobWVtYmVyOiBJTWVtYmVyLCBjcmVhdGVWYWx1ZXM6IFZhbHVlQ3JlYXRlUGFyYW1zIHwgT2JqZWN0Q3JlYXRlUGFyYW1zLCBjb250ZXh0OiBJU3RhY2tDb250ZXh0KTogUHJvbWlzZTxhbnk+IHtcbiAgICAgIGxldCBvYmpSZWZUeXBlID0gbWVtYmVyLnR5cGUgYXMgT2JqZWN0UmVmVHlwZVxuICAgICAgbGV0IHJlZlZhbHVlID0gY29udGV4dC52YWx1ZS5yZWYob2JqUmVmVHlwZS5tb2RlbE5hbWUpXG4gICAgICBsZXQgZWRpdE9iaiA9IGF3YWl0IGNvbnRleHQuc2VyaWFsaXplci50b0pzKHJlZlZhbHVlKVxuICAgICAgbGV0IG1vZGVsID0gY29udGV4dC5jYWNoZS5nZXRNb2RlbChvYmpSZWZUeXBlLm1vZGVsTmFtZSlcblxuICAgICAgaWYobW9kZWwgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBFbmNvdW50ZXJlZCBhbiBlcnJvciB3aGVuIGJ1aWxkaW5nIGFuIEVkaXQgT2JqZWN0LiBUaGUgTW9kZWwgZm9yIHRoZSBuZXN0ZWQgcHJvcGVydHkgJHttZW1iZXIubmFtZX0gZG9lcyBub3QgZXhpc3QgYClcbiAgICAgIH1cblxuICAgICAgZm9yKGxldCBjaGlsZEtleSBvZiBPYmplY3Qua2V5cyhjcmVhdGVWYWx1ZXMpKSB7XG4gICAgICAgICBsZXQgY2hpbGRWYWx1ZSA9IGNyZWF0ZVZhbHVlc1tjaGlsZEtleV1cblxuICAgICAgICAgbGV0IGNoaWxkTWVtYmVyID0gbW9kZWwubWVtYmVycy5maW5kKG0gPT4gbS5uYW1lID09PSBjaGlsZEtleSlcblxuICAgICAgICAgLy8gSWdub3JlIHZhbHVlcyB0aGF0IGFyZSBwcm92aWRlZCBhbmQgd2UgZG9uJ3QgaGF2ZSBhIE1lbWJlciBmb3IuXG4gICAgICAgICAvLyBUaGlzIGNvdWxkIHNpZ25hbCB0aGF0IHRoZSBkYXRhIHZlcnNpb25zIGFyZSBtaXNtYXRjaGVkLCBhbmQgdGhhdCdzIG9rLlxuICAgICAgICAgaWYoY2hpbGRNZW1iZXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgY29udGludWVcbiAgICAgICAgIH1cblxuICAgICAgICAgaWYoY2hpbGRNZW1iZXIudHlwZS50eXBlID09PSBUeXBlU2V0Lk9iamVjdFJlZikge1xuICAgICAgICAgICAgZWRpdE9ialtjaGlsZEtleV0gPSBhd2FpdCB0aGlzLmJ1aWxkTmVzdGVkRWRpdE9iamVjdChjaGlsZE1lbWJlciwgY2hpbGRWYWx1ZSwgY29udGV4dClcbiAgICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgICB9XG5cbiAgICAgICAgIGxldCB2YWx1ZSA9IFZhbHVlU291cmNlLnJlc29sdmUoY2hpbGRWYWx1ZSwgY29udGV4dClcbiAgICAgICAgIGVkaXRPYmpbY2hpbGRLZXldID0gYXdhaXQgY29udGV4dC5zZXJpYWxpemVyLnRvSnModmFsdWUpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBlZGl0T2JqXG4gICB9XG5cbiAgIGludGVybmFsZVNldElkKGlkOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgIHRoaXMuX2lkID0gaWRcbiAgIH1cbn0iXX0=