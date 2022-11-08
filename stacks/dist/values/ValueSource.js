"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValueSource = void 0;
const _1 = require(".");
const UidKeeper_1 = require("../UidKeeper");
const Bool_1 = require("./Bool");
const Int_1 = require("./Int");
const List_1 = require("./List");
const ObjectRef_1 = require("./ObjectRef");
const String_1 = require("./String");
const TypeSource_1 = require("./TypeSource");
const UInt_1 = require("./UInt");
class ValueSource {
    constructor(context) {
        this.context = context;
    }
    /**
     * Wraps an IValueSource in a Proxy.
     *
     * Note:
     * This is necessary since it turns out that when we use destructuring
     * for defining Models, the 'this' pointer inside of any methods being called
     * on the IValueSource, loses its scope, and becomes 'undefined'.
     * To work around this, a Proxy is used instead that retains
     * the 'this' pointer regardless how/when destructuring is used.
     *
     * @param values The IValueSource to wrap
     * @returns A Proxy'd IValueSource
     */
    static toProxy(values) {
        let handler = {
            get(target, property) {
                if (typeof target[property] === 'function') {
                    return function (...args) {
                        return target[property](...args);
                    };
                }
                return target[property];
            }
        };
        return new Proxy(values, handler);
    }
    /**
     * Resolves a set of ValueParams into a Value
     *
     * @param source The ParamS
     * @param context StackContext
     * @param createContext Creation context if available
     * @param coercedType IF the type is known ahead of time, this can help determine the Type mopre accurately
     * @returns
     */
    static resolve(source, context, createContext, coercedType) {
        let values = new ValueSource(context);
        let proxiedValues = ValueSource.toProxy(values);
        if (typeof source === 'function') {
            createContext = createContext || {};
            let value = source(proxiedValues, createContext);
            if (!Array.isArray(value)) {
                return value;
            }
            let cast = value;
            if (cast.length == 0) {
                throw new Error(`Encountered an error when determining the Type of a value. Received an empty Array. Array notation can only be used if it contains at least 1 element.`);
            }
            let coercedItemType = undefined;
            if (coercedType !== undefined) {
                if (coercedType.type == _1.TypeSet.List) {
                    let list = coercedType;
                    coercedItemType = list.itemType;
                }
            }
            let firstType = coercedItemType || cast[0].type;
            let allTypesEqual = cast.every(it => firstType.equals(it.type));
            if (!allTypesEqual) {
                throw new Error(`Encountered an error when determinging the Type of a value. When specifying a List Type using Array notation, all Types in the Array must be the same.`);
            }
            let list = new List_1.ListValue(firstType, context.serializer);
            list.push(...cast);
            return list;
        }
        else if (Array.isArray(source)) {
            let array = source;
            if (array.length == 0) {
                throw new Error(`Error resolving a Value. At least one item must be present in the Array to determine the List ItemType when resolving ${source}.`);
            }
            let coercedItemType = undefined;
            if (coercedType !== undefined) {
                if (coercedType.type == _1.TypeSet.List) {
                    let list = coercedType;
                    coercedItemType = list.itemType;
                }
            }
            let itemType = coercedItemType === undefined ?
                TypeSource_1.TypeSource.resolve(array[0], context) :
                coercedItemType;
            let list = new List_1.ListValue(itemType, context.serializer);
            if (itemType.type !== _1.TypeSet.ObjectRef) {
                list.push(...array.map(it => ValueSource.resolve(it, context)));
            }
            return list;
        }
        else if (typeof source === 'string') {
            return values.string(source);
        }
        else if (typeof source === 'number') {
            return values.int(source);
        }
        else if (typeof source === 'boolean') {
            return values.bool(source);
        }
        else {
            throw new Error(`Unsupported source when resolving a type: ${typeof source}`);
        }
    }
    bool(value = true) {
        return new Bool_1.BoolValue(value);
    }
    int(value = 0) {
        return new Int_1.IntValue(value);
    }
    // TODO: Extend the options here
    list(itemType) {
        let type = TypeSource_1.TypeSource.resolve(itemType, this.context);
        return new List_1.ListValue(type, this.context.serializer);
    }
    // TODO: Add ref(model: IModel) version
    ref(modelName, id = UidKeeper_1.UidKeeper.IdNotSet) {
        return new ObjectRef_1.ObjectRefValue(modelName, id, this.context);
    }
    string(value = '') {
        return new String_1.StringValue(value);
    }
    uint(value = 0) {
        if (value < 0) {
            throw new Error(`When creating a UInt value, the number must not be negative`);
        }
        return new UInt_1.UIntValue(value);
    }
}
exports.ValueSource = ValueSource;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVmFsdWVTb3VyY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdmFsdWVzL1ZhbHVlU291cmNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHdCQUE0QjtBQUc1Qiw0Q0FBeUM7QUFDekMsaUNBQW1DO0FBQ25DLCtCQUFpQztBQUNqQyxpQ0FBNkM7QUFDN0MsMkNBQTZDO0FBQzdDLHFDQUF1QztBQUV2Qyw2Q0FBK0U7QUFDL0UsaUNBQW1DO0FBeUJuQyxNQUFhLFdBQVc7SUFFckIsWUFBcUIsT0FBc0I7UUFBdEIsWUFBTyxHQUFQLE9BQU8sQ0FBZTtJQUUzQyxDQUFDO0lBRUQ7Ozs7Ozs7Ozs7OztPQVlHO0lBQ0gsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFvQjtRQUNoQyxJQUFJLE9BQU8sR0FBRztZQUNYLEdBQUcsQ0FBQyxNQUFvQixFQUFFLFFBQWdCO2dCQUN2QyxJQUFHLE9BQU8sTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLFVBQVUsRUFBRTtvQkFDeEMsT0FBTyxVQUFTLEdBQUcsSUFBVzt3QkFDM0IsT0FBTyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQTtvQkFDbkMsQ0FBQyxDQUFBO2lCQUNIO2dCQUVELE9BQU8sTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFBO1lBQzFCLENBQUM7U0FDSCxDQUFBO1FBRUQsT0FBTyxJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUE7SUFDcEMsQ0FBQztJQUVEOzs7Ozs7OztPQVFHO0lBQ0gsTUFBTSxDQUFDLE9BQU8sQ0FDWCxNQUF5QixFQUN6QixPQUFzQixFQUN0QixhQUFrQyxFQUNsQyxXQUFtQjtRQUVuQixJQUFJLE1BQU0sR0FBRyxJQUFJLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUNyQyxJQUFJLGFBQWEsR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFBO1FBRS9DLElBQUksT0FB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Q0FBQTtTQUNoRjtRQUVELE9BQU8sSUFBSSxnQkFBUyxDQUFDLEtBQUssQ0FBQyxDQUFBO0lBQzlCLENBQUM7Q0FDSDtBQTdKRCxrQ0E2SkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBUeXBlU2V0IH0gZnJvbSBcIi5cIjtcbmltcG9ydCB7IElNb2RlbCB9IGZyb20gXCIuLi9Nb2RlbFwiO1xuaW1wb3J0IHsgSVN0YWNrQ29udGV4dCB9IGZyb20gXCIuLi9zdGFjay9TdGFja0NvbnRleHRcIjtcbmltcG9ydCB7IFVpZEtlZXBlciB9IGZyb20gXCIuLi9VaWRLZWVwZXJcIjtcbmltcG9ydCB7IEJvb2xWYWx1ZSB9IGZyb20gXCIuL0Jvb2xcIjtcbmltcG9ydCB7IEludFZhbHVlIH0gZnJvbSBcIi4vSW50XCI7XG5pbXBvcnQgeyBMaXN0VHlwZSwgTGlzdFZhbHVlIH0gZnJvbSBcIi4vTGlzdFwiO1xuaW1wb3J0IHsgT2JqZWN0UmVmVmFsdWUgfSBmcm9tIFwiLi9PYmplY3RSZWZcIjtcbmltcG9ydCB7IFN0cmluZ1ZhbHVlIH0gZnJvbSBcIi4vU3RyaW5nXCI7XG5pbXBvcnQgeyBJVHlwZSB9IGZyb20gXCIuL1R5cGVcIjtcbmltcG9ydCB7IENyZWF0ZVR5cGVIYW5kbGVyLCBUeXBlQ3JlYXRlUGFyYW1zLCBUeXBlU291cmNlIH0gZnJvbSBcIi4vVHlwZVNvdXJjZVwiO1xuaW1wb3J0IHsgVUludFZhbHVlIH0gZnJvbSBcIi4vVUludFwiO1xuaW1wb3J0IHsgSVZhbHVlIH0gZnJvbSBcIi4vVmFsdWVcIjtcblxuZXhwb3J0IHR5cGUgVmFsdWVDcmVhdGVDb250ZXh0ID0ge1xuICAgbW9kZWw/OiBJTW9kZWxcbn1cblxuZXhwb3J0IHR5cGUgQ3JlYXRlVmFsdWVIYW5kbGVyID0gKHZhbHVlOiBJVmFsdWVTb3VyY2UsIGN0eD86IFZhbHVlQ3JlYXRlQ29udGV4dCkgPT4gSVZhbHVlIHwgSVZhbHVlW11cbmV4cG9ydCB0eXBlIFZhbHVlQ3JlYXRlUGFyYW1zID0gYm9vbGVhbiB8IG51bWJlciB8IHN0cmluZyB8IGFueVtdIHwgQ3JlYXRlVmFsdWVIYW5kbGVyXG5cbmV4cG9ydCB0eXBlIE5vcm1hbGl6ZWRUeXBlID0ge1xuICAgW2tleTogc3RyaW5nXTogSVR5cGVcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJVmFsdWVTb3VyY2Uge1xuICAgYm9vbCh2YWx1ZTogYm9vbGVhbik6IEJvb2xWYWx1ZVxuICAgaW50KHZhbHVlOiBudW1iZXIpOiBJbnRWYWx1ZVxuICAgbGlzdChpdGVtVHlwZTogQ3JlYXRlVHlwZUhhbmRsZXIpOiBMaXN0VmFsdWVcblxuICAgLy8gVE9ETzogQWRkIHJlZihtb2RlbDogSU1vZGVsKSB2ZXJzaW9uXG4gICByZWYobW9kZWxOYW1lOiBzdHJpbmcsIGlkPzogc3RyaW5nKTogT2JqZWN0UmVmVmFsdWVcbiAgIHN0cmluZyh2YWx1ZTogc3RyaW5nKTogU3RyaW5nVmFsdWVcbiAgIHVpbnQodmFsdWU6IG51bWJlcik6IFVJbnRWYWx1ZVxufVxuXG5leHBvcnQgY2xhc3MgVmFsdWVTb3VyY2UgaW1wbGVtZW50cyBJVmFsdWVTb3VyY2Uge1xuXG4gICBjb25zdHJ1Y3RvcihyZWFkb25seSBjb250ZXh0OiBJU3RhY2tDb250ZXh0KSB7XG5cbiAgIH1cblxuICAgLyoqXG4gICAgKiBXcmFwcyBhbiBJVmFsdWVTb3VyY2UgaW4gYSBQcm94eS4gXG4gICAgKiBcbiAgICAqIE5vdGU6XG4gICAgKiBUaGlzIGlzIG5lY2Vzc2FyeSBzaW5jZSBpdCB0dXJucyBvdXQgdGhhdCB3aGVuIHdlIHVzZSBkZXN0cnVjdHVyaW5nXG4gICAgKiBmb3IgZGVmaW5pbmcgTW9kZWxzLCB0aGUgJ3RoaXMnIHBvaW50ZXIgaW5zaWRlIG9mIGFueSBtZXRob2RzIGJlaW5nIGNhbGxlZFxuICAgICogb24gdGhlIElWYWx1ZVNvdXJjZSwgbG9zZXMgaXRzIHNjb3BlLCBhbmQgYmVjb21lcyAndW5kZWZpbmVkJy5cbiAgICAqIFRvIHdvcmsgYXJvdW5kIHRoaXMsIGEgUHJveHkgaXMgdXNlZCBpbnN0ZWFkIHRoYXQgcmV0YWluc1xuICAgICogdGhlICd0aGlzJyBwb2ludGVyIHJlZ2FyZGxlc3MgaG93L3doZW4gZGVzdHJ1Y3R1cmluZyBpcyB1c2VkLiBcbiAgICAqIFxuICAgICogQHBhcmFtIHZhbHVlcyBUaGUgSVZhbHVlU291cmNlIHRvIHdyYXBcbiAgICAqIEByZXR1cm5zIEEgUHJveHknZCBJVmFsdWVTb3VyY2VcbiAgICAqL1xuICAgc3RhdGljIHRvUHJveHkodmFsdWVzOiBJVmFsdWVTb3VyY2UpOiBJVmFsdWVTb3VyY2Uge1xuICAgICAgbGV0IGhhbmRsZXIgPSB7XG4gICAgICAgICBnZXQodGFyZ2V0OiBJVmFsdWVTb3VyY2UsIHByb3BlcnR5OiBzdHJpbmcpOiBhbnkge1xuICAgICAgICAgICAgaWYodHlwZW9mIHRhcmdldFtwcm9wZXJ0eV0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiguLi5hcmdzOiBhbnlbXSkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIHRhcmdldFtwcm9wZXJ0eV0oLi4uYXJncylcbiAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRhcmdldFtwcm9wZXJ0eV1cbiAgICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG5ldyBQcm94eSh2YWx1ZXMsIGhhbmRsZXIpXG4gICB9XG5cbiAgIC8qKlxuICAgICogUmVzb2x2ZXMgYSBzZXQgb2YgVmFsdWVQYXJhbXMgaW50byBhIFZhbHVlXG4gICAgKiBcbiAgICAqIEBwYXJhbSBzb3VyY2UgVGhlIFBhcmFtU1xuICAgICogQHBhcmFtIGNvbnRleHQgU3RhY2tDb250ZXh0XG4gICAgKiBAcGFyYW0gY3JlYXRlQ29udGV4dCBDcmVhdGlvbiBjb250ZXh0IGlmIGF2YWlsYWJsZVxuICAgICogQHBhcmFtIGNvZXJjZWRUeXBlIElGIHRoZSB0eXBlIGlzIGtub3duIGFoZWFkIG9mIHRpbWUsIHRoaXMgY2FuIGhlbHAgZGV0ZXJtaW5lIHRoZSBUeXBlIG1vcHJlIGFjY3VyYXRlbHlcbiAgICAqIEByZXR1cm5zIFxuICAgICovXG4gICBzdGF0aWMgcmVzb2x2ZShcbiAgICAgIHNvdXJjZTogVmFsdWVDcmVhdGVQYXJhbXMsXG4gICAgICBjb250ZXh0OiBJU3RhY2tDb250ZXh0LFxuICAgICAgY3JlYXRlQ29udGV4dD86IFZhbHVlQ3JlYXRlQ29udGV4dCxcbiAgICAgIGNvZXJjZWRUeXBlPzogSVR5cGVcbiAgICk6IElWYWx1ZSB7XG4gICAgICBsZXQgdmFsdWVzID0gbmV3IFZhbHVlU291cmNlKGNvbnRleHQpXG4gICAgICBsZXQgcHJveGllZFZhbHVlcyA9IFZhbHVlU291cmNlLnRvUHJveHkodmFsdWVzKVxuXG4gICAgICBpZiAodHlwZW9mIHNvdXJjZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgY3JlYXRlQ29udGV4dCA9IGNyZWF0ZUNvbnRleHQgfHwge31cblxuICAgICAgICAgbGV0IHZhbHVlID0gc291cmNlKHByb3hpZWRWYWx1ZXMsIGNyZWF0ZUNvbnRleHQpXG5cbiAgICAgICAgIGlmICghQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZVxuICAgICAgICAgfVxuXG4gICAgICAgICBsZXQgY2FzdCA9IHZhbHVlIGFzIEFycmF5PElWYWx1ZT5cblxuICAgICAgICAgaWYgKGNhc3QubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgRW5jb3VudGVyZWQgYW4gZXJyb3Igd2hlbiBkZXRlcm1pbmluZyB0aGUgVHlwZSBvZiBhIHZhbHVlLiBSZWNlaXZlZCBhbiBlbXB0eSBBcnJheS4gQXJyYXkgbm90YXRpb24gY2FuIG9ubHkgYmUgdXNlZCBpZiBpdCBjb250YWlucyBhdCBsZWFzdCAxIGVsZW1lbnQuYClcbiAgICAgICAgIH1cblxuICAgICAgICAgbGV0IGNvZXJjZWRJdGVtVHlwZTogSVR5cGUgfCB1bmRlZmluZWQgPSB1bmRlZmluZWRcblxuICAgICAgICAgaWYoY29lcmNlZFR5cGUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgaWYoY29lcmNlZFR5cGUudHlwZSA9PSBUeXBlU2V0Lkxpc3QpIHtcbiAgICAgICAgICAgICAgIGxldCBsaXN0ID0gY29lcmNlZFR5cGUgYXMgTGlzdFR5cGVcbiAgICAgICAgICAgICAgIGNvZXJjZWRJdGVtVHlwZSA9IGxpc3QuaXRlbVR5cGVcbiAgICAgICAgICAgIH1cbiAgICAgICAgIH1cblxuICAgICAgICAgbGV0IGZpcnN0VHlwZSA9IGNvZXJjZWRJdGVtVHlwZSB8fCBjYXN0WzBdLnR5cGVcblxuICAgICAgICAgbGV0IGFsbFR5cGVzRXF1YWwgPSBjYXN0LmV2ZXJ5KGl0ID0+IGZpcnN0VHlwZS5lcXVhbHMoaXQudHlwZSkpXG5cbiAgICAgICAgIGlmICghYWxsVHlwZXNFcXVhbCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBFbmNvdW50ZXJlZCBhbiBlcnJvciB3aGVuIGRldGVybWluZ2luZyB0aGUgVHlwZSBvZiBhIHZhbHVlLiBXaGVuIHNwZWNpZnlpbmcgYSBMaXN0IFR5cGUgdXNpbmcgQXJyYXkgbm90YXRpb24sIGFsbCBUeXBlcyBpbiB0aGUgQXJyYXkgbXVzdCBiZSB0aGUgc2FtZS5gKVxuICAgICAgICAgfVxuXG4gICAgICAgICBsZXQgbGlzdCA9IG5ldyBMaXN0VmFsdWUoZmlyc3RUeXBlLCBjb250ZXh0LnNlcmlhbGl6ZXIpXG4gICAgICAgICBsaXN0LnB1c2goLi4uY2FzdClcblxuICAgICAgICAgcmV0dXJuIGxpc3RcbiAgICAgIH0gZWxzZSBpZihBcnJheS5pc0FycmF5KHNvdXJjZSkpIHtcbiAgICAgICAgIGxldCBhcnJheSA9IHNvdXJjZSBhcyBhbnlbXVxuXG4gICAgICAgICBpZihhcnJheS5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBFcnJvciByZXNvbHZpbmcgYSBWYWx1ZS4gQXQgbGVhc3Qgb25lIGl0ZW0gbXVzdCBiZSBwcmVzZW50IGluIHRoZSBBcnJheSB0byBkZXRlcm1pbmUgdGhlIExpc3QgSXRlbVR5cGUgd2hlbiByZXNvbHZpbmcgJHtzb3VyY2V9LmApXG4gICAgICAgICB9XG5cbiAgICAgICAgIGxldCBjb2VyY2VkSXRlbVR5cGU6IElUeXBlIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkXG5cbiAgICAgICAgIGlmKGNvZXJjZWRUeXBlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGlmKGNvZXJjZWRUeXBlLnR5cGUgPT0gVHlwZVNldC5MaXN0KSB7XG4gICAgICAgICAgICAgICBsZXQgbGlzdCA9IGNvZXJjZWRUeXBlIGFzIExpc3RUeXBlXG4gICAgICAgICAgICAgICBjb2VyY2VkSXRlbVR5cGUgPSBsaXN0Lml0ZW1UeXBlXG4gICAgICAgICAgICB9XG4gICAgICAgICB9XG5cbiAgICAgICAgIGxldCBpdGVtVHlwZSA9IGNvZXJjZWRJdGVtVHlwZSA9PT0gdW5kZWZpbmVkID9cbiAgICAgICAgICAgIFR5cGVTb3VyY2UucmVzb2x2ZShhcnJheVswXSwgY29udGV4dCkgOlxuICAgICAgICAgICAgY29lcmNlZEl0ZW1UeXBlXG4gICAgICAgICBcbiAgICAgICAgIGxldCBsaXN0ID0gbmV3IExpc3RWYWx1ZShpdGVtVHlwZSwgY29udGV4dC5zZXJpYWxpemVyKVxuXG4gICAgICAgICBpZihpdGVtVHlwZS50eXBlICE9PSBUeXBlU2V0Lk9iamVjdFJlZikge1xuICAgICAgICAgICAgbGlzdC5wdXNoKC4uLmFycmF5Lm1hcChpdCA9PiBWYWx1ZVNvdXJjZS5yZXNvbHZlKGl0LCBjb250ZXh0KSkpICAgICAgICAgICAgXG4gICAgICAgICB9XG4gICBcbiAgICAgICAgIHJldHVybiBsaXN0XG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiBzb3VyY2UgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICByZXR1cm4gdmFsdWVzLnN0cmluZyhzb3VyY2UpXG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiBzb3VyY2UgPT09ICdudW1iZXInKSB7XG4gICAgICAgICByZXR1cm4gdmFsdWVzLmludChzb3VyY2UpXG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiBzb3VyY2UgPT09ICdib29sZWFuJykge1xuICAgICAgICAgcmV0dXJuIHZhbHVlcy5ib29sKHNvdXJjZSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVuc3VwcG9ydGVkIHNvdXJjZSB3aGVuIHJlc29sdmluZyBhIHR5cGU6ICR7dHlwZW9mIHNvdXJjZX1gKVxuICAgICAgfVxuICAgfVxuXG4gICBib29sKHZhbHVlOiBib29sZWFuID0gdHJ1ZSk6IEJvb2xWYWx1ZSB7XG4gICAgICByZXR1cm4gbmV3IEJvb2xWYWx1ZSh2YWx1ZSlcbiAgIH1cblxuICAgaW50KHZhbHVlOiBudW1iZXIgPSAwKTogSW50VmFsdWUge1xuICAgICAgcmV0dXJuIG5ldyBJbnRWYWx1ZSh2YWx1ZSlcbiAgIH1cblxuICAgLy8gVE9ETzogRXh0ZW5kIHRoZSBvcHRpb25zIGhlcmVcbiAgIGxpc3QoaXRlbVR5cGU6IFR5cGVDcmVhdGVQYXJhbXMpOiBMaXN0VmFsdWUge1xuICAgICAgbGV0IHR5cGUgPSBUeXBlU291cmNlLnJlc29sdmUoaXRlbVR5cGUsIHRoaXMuY29udGV4dClcbiAgICAgIHJldHVybiBuZXcgTGlzdFZhbHVlKHR5cGUsIHRoaXMuY29udGV4dC5zZXJpYWxpemVyKVxuICAgfVxuXG4gICAvLyBUT0RPOiBBZGQgcmVmKG1vZGVsOiBJTW9kZWwpIHZlcnNpb25cbiAgIHJlZihtb2RlbE5hbWU6IHN0cmluZywgaWQ6IHN0cmluZyA9IFVpZEtlZXBlci5JZE5vdFNldCk6IE9iamVjdFJlZlZhbHVlIHtcbiAgICAgIHJldHVybiBuZXcgT2JqZWN0UmVmVmFsdWUobW9kZWxOYW1lLCBpZCwgdGhpcy5jb250ZXh0KVxuICAgfVxuXG4gICBzdHJpbmcodmFsdWU6IHN0cmluZyA9ICcnKTogU3RyaW5nVmFsdWUge1xuICAgICAgcmV0dXJuIG5ldyBTdHJpbmdWYWx1ZSh2YWx1ZSlcbiAgIH1cblxuICAgdWludCh2YWx1ZTogbnVtYmVyID0gMCk6IFVJbnRWYWx1ZSB7XG4gICAgICBpZiAodmFsdWUgPCAwKSB7XG4gICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFdoZW4gY3JlYXRpbmcgYSBVSW50IHZhbHVlLCB0aGUgbnVtYmVyIG11c3Qgbm90IGJlIG5lZ2F0aXZlYClcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG5ldyBVSW50VmFsdWUodmFsdWUpXG4gICB9XG59Il19