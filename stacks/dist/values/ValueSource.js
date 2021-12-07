"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValueSource = void 0;
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
    static resolve(source, context, createContext) {
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
            let firstType = cast[0].type;
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
            let itemType = TypeSource_1.TypeSource.resolve(array[0], context);
            let list = new List_1.ListValue(itemType, context.serializer);
            list.push(...array.map(it => ValueSource.resolve(it, context)));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVmFsdWVTb3VyY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdmFsdWVzL1ZhbHVlU291cmNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLDRDQUF5QztBQUN6QyxpQ0FBbUM7QUFDbkMsK0JBQWlDO0FBQ2pDLGlDQUFtQztBQUNuQywyQ0FBNkM7QUFDN0MscUNBQXVDO0FBRXZDLDZDQUErRTtBQUMvRSxpQ0FBbUM7QUF5Qm5DLE1BQWEsV0FBVztJQUVyQixZQUFxQixPQUFzQjtRQUF0QixZQUFPLEdBQVAsT0FBTyxDQUFlO0lBRTNDLENBQUM7SUFFRDs7Ozs7Ozs7Ozs7O09BWUc7SUFDSCxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQW9CO1FBQ2hDLElBQUksT0FBTyxHQUFHO1lBQ1gsR0FBRyxDQUFDLE1BQW9CLEVBQUUsUUFBZ0I7Z0JBQ3ZDLElBQUcsT0FBTyxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssVUFBVSxFQUFFO29CQUN4QyxPQUFPLFVBQVMsR0FBRyxJQUFXO3dCQUMzQixPQUFPLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFBO29CQUNuQyxDQUFDLENBQUE7aUJBQ0g7Z0JBRUQsT0FBTyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUE7WUFDMUIsQ0FBQztTQUNILENBQUE7UUFFRCxPQUFPLElBQUksS0FBSyxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQTtJQUNwQyxDQUFDO0lBRUQsTUFBTSxDQUFDLE9BQU8sQ0FDWCxNQUF5QixFQUN6QixPQUFzQixFQUN0QixhQUFrQztRQUVsQyxJQUFJLE1BQU0sR0FBRyxJQUFJLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUNyQyxJQUFJLGFBQWEsR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFBO1FBRS9DLElBQUksT0FBTyxNQUFNLEtBQUssVUFBVSxFQUFFO1lBQy9CLGFBQWEsR0FBRyxhQUFh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QUMsVUFBVSxDQUFDLENBQUE7SUFDdEQsQ0FBQztJQUVELHVDQUF1QztJQUN2QyxHQUFHLENBQUMsU0FBaUIsRUFBRSxLQUFhLHFCQUFTLENBQUMsUUFBUTtRQUNuRCxPQUFPLElBQUksMEJBQWMsQ0FBQyxTQUFTLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtJQUN6RCxDQUFDO0lBRUQsTUFBTSxDQUFDLFFBQWdCLEVBQUU7UUFDdEIsT0FBTyxJQUFJLG9CQUFXLENBQUMsS0FBSyxDQUFDLENBQUE7SUFDaEMsQ0FBQztJQUVELElBQUksQ0FBQyxRQUFnQixDQUFDO1FBQ25CLElBQUksS0FBSyxHQUFHLENBQUMsRUFBRTtZQUNaLE1BQU0sSUFBSSxLQUFLLENBQUMsNkRBQTZELENBQUMsQ0FBQTtTQUNoRjtRQUVELE9BQU8sSUFBSSxnQkFBUyxDQUFDLEtBQUssQ0FBQyxDQUFBO0lBQzlCLENBQUM7Q0FDSDtBQTVIRCxrQ0E0SEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJTW9kZWwgfSBmcm9tIFwiLi4vTW9kZWxcIjtcbmltcG9ydCB7IElTdGFja0NvbnRleHQgfSBmcm9tIFwiLi4vc3RhY2svU3RhY2tDb250ZXh0XCI7XG5pbXBvcnQgeyBVaWRLZWVwZXIgfSBmcm9tIFwiLi4vVWlkS2VlcGVyXCI7XG5pbXBvcnQgeyBCb29sVmFsdWUgfSBmcm9tIFwiLi9Cb29sXCI7XG5pbXBvcnQgeyBJbnRWYWx1ZSB9IGZyb20gXCIuL0ludFwiO1xuaW1wb3J0IHsgTGlzdFZhbHVlIH0gZnJvbSBcIi4vTGlzdFwiO1xuaW1wb3J0IHsgT2JqZWN0UmVmVmFsdWUgfSBmcm9tIFwiLi9PYmplY3RSZWZcIjtcbmltcG9ydCB7IFN0cmluZ1ZhbHVlIH0gZnJvbSBcIi4vU3RyaW5nXCI7XG5pbXBvcnQgeyBJVHlwZSB9IGZyb20gXCIuL1R5cGVcIjtcbmltcG9ydCB7IENyZWF0ZVR5cGVIYW5kbGVyLCBUeXBlQ3JlYXRlUGFyYW1zLCBUeXBlU291cmNlIH0gZnJvbSBcIi4vVHlwZVNvdXJjZVwiO1xuaW1wb3J0IHsgVUludFZhbHVlIH0gZnJvbSBcIi4vVUludFwiO1xuaW1wb3J0IHsgSVZhbHVlIH0gZnJvbSBcIi4vVmFsdWVcIjtcblxuZXhwb3J0IHR5cGUgVmFsdWVDcmVhdGVDb250ZXh0ID0ge1xuICAgbW9kZWw/OiBJTW9kZWxcbn1cblxuZXhwb3J0IHR5cGUgQ3JlYXRlVmFsdWVIYW5kbGVyID0gKHZhbHVlOiBJVmFsdWVTb3VyY2UsIGN0eD86IFZhbHVlQ3JlYXRlQ29udGV4dCkgPT4gSVZhbHVlIHwgSVZhbHVlW11cbmV4cG9ydCB0eXBlIFZhbHVlQ3JlYXRlUGFyYW1zID0gYm9vbGVhbiB8IG51bWJlciB8IHN0cmluZyB8IGFueVtdIHwgQ3JlYXRlVmFsdWVIYW5kbGVyXG5cbmV4cG9ydCB0eXBlIE5vcm1hbGl6ZWRUeXBlID0ge1xuICAgW2tleTogc3RyaW5nXTogSVR5cGVcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJVmFsdWVTb3VyY2Uge1xuICAgYm9vbCh2YWx1ZTogYm9vbGVhbik6IEJvb2xWYWx1ZVxuICAgaW50KHZhbHVlOiBudW1iZXIpOiBJbnRWYWx1ZVxuICAgbGlzdChpdGVtVHlwZTogQ3JlYXRlVHlwZUhhbmRsZXIpOiBMaXN0VmFsdWVcblxuICAgLy8gVE9ETzogQWRkIHJlZihtb2RlbDogSU1vZGVsKSB2ZXJzaW9uXG4gICByZWYobW9kZWxOYW1lOiBzdHJpbmcsIGlkPzogc3RyaW5nKTogT2JqZWN0UmVmVmFsdWVcbiAgIHN0cmluZyh2YWx1ZTogc3RyaW5nKTogU3RyaW5nVmFsdWVcbiAgIHVpbnQodmFsdWU6IG51bWJlcik6IFVJbnRWYWx1ZVxufVxuXG5leHBvcnQgY2xhc3MgVmFsdWVTb3VyY2UgaW1wbGVtZW50cyBJVmFsdWVTb3VyY2Uge1xuXG4gICBjb25zdHJ1Y3RvcihyZWFkb25seSBjb250ZXh0OiBJU3RhY2tDb250ZXh0KSB7XG5cbiAgIH1cblxuICAgLyoqXG4gICAgKiBXcmFwcyBhbiBJVmFsdWVTb3VyY2UgaW4gYSBQcm94eS4gXG4gICAgKiBcbiAgICAqIE5vdGU6XG4gICAgKiBUaGlzIGlzIG5lY2Vzc2FyeSBzaW5jZSBpdCB0dXJucyBvdXQgdGhhdCB3aGVuIHdlIHVzZSBkZXN0cnVjdHVyaW5nXG4gICAgKiBmb3IgZGVmaW5pbmcgTW9kZWxzLCB0aGUgJ3RoaXMnIHBvaW50ZXIgaW5zaWRlIG9mIGFueSBtZXRob2RzIGJlaW5nIGNhbGxlZFxuICAgICogb24gdGhlIElWYWx1ZVNvdXJjZSwgbG9zZXMgaXRzIHNjb3BlLCBhbmQgYmVjb21lcyAndW5kZWZpbmVkJy5cbiAgICAqIFRvIHdvcmsgYXJvdW5kIHRoaXMsIGEgUHJveHkgaXMgdXNlZCBpbnN0ZWFkIHRoYXQgcmV0YWluc1xuICAgICogdGhlICd0aGlzJyBwb2ludGVyIHJlZ2FyZGxlc3MgaG93L3doZW4gZGVzdHJ1Y3R1cmluZyBpcyB1c2VkLiBcbiAgICAqIFxuICAgICogQHBhcmFtIHZhbHVlcyBUaGUgSVZhbHVlU291cmNlIHRvIHdyYXBcbiAgICAqIEByZXR1cm5zIEEgUHJveHknZCBJVmFsdWVTb3VyY2VcbiAgICAqL1xuICAgc3RhdGljIHRvUHJveHkodmFsdWVzOiBJVmFsdWVTb3VyY2UpOiBJVmFsdWVTb3VyY2Uge1xuICAgICAgbGV0IGhhbmRsZXIgPSB7XG4gICAgICAgICBnZXQodGFyZ2V0OiBJVmFsdWVTb3VyY2UsIHByb3BlcnR5OiBzdHJpbmcpOiBhbnkge1xuICAgICAgICAgICAgaWYodHlwZW9mIHRhcmdldFtwcm9wZXJ0eV0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiguLi5hcmdzOiBhbnlbXSkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIHRhcmdldFtwcm9wZXJ0eV0oLi4uYXJncylcbiAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRhcmdldFtwcm9wZXJ0eV1cbiAgICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG5ldyBQcm94eSh2YWx1ZXMsIGhhbmRsZXIpXG4gICB9XG5cbiAgIHN0YXRpYyByZXNvbHZlKFxuICAgICAgc291cmNlOiBWYWx1ZUNyZWF0ZVBhcmFtcyxcbiAgICAgIGNvbnRleHQ6IElTdGFja0NvbnRleHQsXG4gICAgICBjcmVhdGVDb250ZXh0PzogVmFsdWVDcmVhdGVDb250ZXh0XG4gICApOiBJVmFsdWUge1xuICAgICAgbGV0IHZhbHVlcyA9IG5ldyBWYWx1ZVNvdXJjZShjb250ZXh0KVxuICAgICAgbGV0IHByb3hpZWRWYWx1ZXMgPSBWYWx1ZVNvdXJjZS50b1Byb3h5KHZhbHVlcylcblxuICAgICAgaWYgKHR5cGVvZiBzb3VyY2UgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgIGNyZWF0ZUNvbnRleHQgPSBjcmVhdGVDb250ZXh0IHx8IHt9XG5cbiAgICAgICAgIGxldCB2YWx1ZSA9IHNvdXJjZShwcm94aWVkVmFsdWVzLCBjcmVhdGVDb250ZXh0KVxuXG4gICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWVcbiAgICAgICAgIH1cblxuICAgICAgICAgbGV0IGNhc3QgPSB2YWx1ZSBhcyBBcnJheTxJVmFsdWU+XG5cbiAgICAgICAgIGlmIChjYXN0Lmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEVuY291bnRlcmVkIGFuIGVycm9yIHdoZW4gZGV0ZXJtaW5pbmcgdGhlIFR5cGUgb2YgYSB2YWx1ZS4gUmVjZWl2ZWQgYW4gZW1wdHkgQXJyYXkuIEFycmF5IG5vdGF0aW9uIGNhbiBvbmx5IGJlIHVzZWQgaWYgaXQgY29udGFpbnMgYXQgbGVhc3QgMSBlbGVtZW50LmApXG4gICAgICAgICB9XG5cbiAgICAgICAgIGxldCBmaXJzdFR5cGUgPSBjYXN0WzBdLnR5cGVcblxuICAgICAgICAgbGV0IGFsbFR5cGVzRXF1YWwgPSBjYXN0LmV2ZXJ5KGl0ID0+IGZpcnN0VHlwZS5lcXVhbHMoaXQudHlwZSkpXG5cbiAgICAgICAgIGlmICghYWxsVHlwZXNFcXVhbCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBFbmNvdW50ZXJlZCBhbiBlcnJvciB3aGVuIGRldGVybWluZ2luZyB0aGUgVHlwZSBvZiBhIHZhbHVlLiBXaGVuIHNwZWNpZnlpbmcgYSBMaXN0IFR5cGUgdXNpbmcgQXJyYXkgbm90YXRpb24sIGFsbCBUeXBlcyBpbiB0aGUgQXJyYXkgbXVzdCBiZSB0aGUgc2FtZS5gKVxuICAgICAgICAgfVxuXG4gICAgICAgICBsZXQgbGlzdCA9IG5ldyBMaXN0VmFsdWUoZmlyc3RUeXBlLCBjb250ZXh0LnNlcmlhbGl6ZXIpXG4gICAgICAgICBsaXN0LnB1c2goLi4uY2FzdClcblxuICAgICAgICAgcmV0dXJuIGxpc3RcbiAgICAgIH0gZWxzZSBpZihBcnJheS5pc0FycmF5KHNvdXJjZSkpIHtcbiAgICAgICAgIGxldCBhcnJheSA9IHNvdXJjZSBhcyBhbnlbXVxuXG4gICAgICAgICBpZihhcnJheS5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBFcnJvciByZXNvbHZpbmcgYSBWYWx1ZS4gQXQgbGVhc3Qgb25lIGl0ZW0gbXVzdCBiZSBwcmVzZW50IGluIHRoZSBBcnJheSB0byBkZXRlcm1pbmUgdGhlIExpc3QgSXRlbVR5cGUgd2hlbiByZXNvbHZpbmcgJHtzb3VyY2V9LmApXG4gICAgICAgICB9XG5cbiAgICAgICAgIGxldCBpdGVtVHlwZSA9IFR5cGVTb3VyY2UucmVzb2x2ZShhcnJheVswXSwgY29udGV4dClcbiAgICAgICAgIFxuICAgICAgICAgbGV0IGxpc3QgPSBuZXcgTGlzdFZhbHVlKGl0ZW1UeXBlLCBjb250ZXh0LnNlcmlhbGl6ZXIpXG4gICAgICAgICBsaXN0LnB1c2goLi4uYXJyYXkubWFwKGl0ID0+IFZhbHVlU291cmNlLnJlc29sdmUoaXQsIGNvbnRleHQpKSlcbiAgIFxuICAgICAgICAgcmV0dXJuIGxpc3RcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHNvdXJjZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgIHJldHVybiB2YWx1ZXMuc3RyaW5nKHNvdXJjZSlcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHNvdXJjZSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgIHJldHVybiB2YWx1ZXMuaW50KHNvdXJjZSlcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHNvdXJjZSA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgICByZXR1cm4gdmFsdWVzLmJvb2woc291cmNlKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5zdXBwb3J0ZWQgc291cmNlIHdoZW4gcmVzb2x2aW5nIGEgdHlwZTogJHt0eXBlb2Ygc291cmNlfWApXG4gICAgICB9XG4gICB9XG5cbiAgIGJvb2wodmFsdWU6IGJvb2xlYW4gPSB0cnVlKTogQm9vbFZhbHVlIHtcbiAgICAgIHJldHVybiBuZXcgQm9vbFZhbHVlKHZhbHVlKVxuICAgfVxuXG4gICBpbnQodmFsdWU6IG51bWJlciA9IDApOiBJbnRWYWx1ZSB7XG4gICAgICByZXR1cm4gbmV3IEludFZhbHVlKHZhbHVlKVxuICAgfVxuXG4gICAvLyBUT0RPOiBFeHRlbmQgdGhlIG9wdGlvbnMgaGVyZVxuICAgbGlzdChpdGVtVHlwZTogVHlwZUNyZWF0ZVBhcmFtcyk6IExpc3RWYWx1ZSB7XG4gICAgICBsZXQgdHlwZSA9IFR5cGVTb3VyY2UucmVzb2x2ZShpdGVtVHlwZSwgdGhpcy5jb250ZXh0KVxuICAgICAgcmV0dXJuIG5ldyBMaXN0VmFsdWUodHlwZSwgdGhpcy5jb250ZXh0LnNlcmlhbGl6ZXIpXG4gICB9XG5cbiAgIC8vIFRPRE86IEFkZCByZWYobW9kZWw6IElNb2RlbCkgdmVyc2lvblxuICAgcmVmKG1vZGVsTmFtZTogc3RyaW5nLCBpZDogc3RyaW5nID0gVWlkS2VlcGVyLklkTm90U2V0KTogT2JqZWN0UmVmVmFsdWUge1xuICAgICAgcmV0dXJuIG5ldyBPYmplY3RSZWZWYWx1ZShtb2RlbE5hbWUsIGlkLCB0aGlzLmNvbnRleHQpXG4gICB9XG5cbiAgIHN0cmluZyh2YWx1ZTogc3RyaW5nID0gJycpOiBTdHJpbmdWYWx1ZSB7XG4gICAgICByZXR1cm4gbmV3IFN0cmluZ1ZhbHVlKHZhbHVlKVxuICAgfVxuXG4gICB1aW50KHZhbHVlOiBudW1iZXIgPSAwKTogVUludFZhbHVlIHtcbiAgICAgIGlmICh2YWx1ZSA8IDApIHtcbiAgICAgICAgIHRocm93IG5ldyBFcnJvcihgV2hlbiBjcmVhdGluZyBhIFVJbnQgdmFsdWUsIHRoZSBudW1iZXIgbXVzdCBub3QgYmUgbmVnYXRpdmVgKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gbmV3IFVJbnRWYWx1ZSh2YWx1ZSlcbiAgIH1cbn0iXX0=