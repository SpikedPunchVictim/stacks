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
            if (cast.length === 0) {
                throw new Error("Encountered an error when determining the Type of a value. Received an empty Array. Array notation can only be used if it contains at least 1 element.");
            }
            let coercedItemType = undefined;
            if (coercedType !== undefined) {
                if (coercedType.type === _1.TypeSet.List) {
                    let list = coercedType;
                    coercedItemType = list.itemType;
                }
            }
            let firstType = coercedItemType || cast[0].type;
            let allTypesEqual = cast.every(it => firstType.equals(it.type));
            if (!allTypesEqual) {
                throw new Error("Encountered an error when determinging the Type of a value. When specifying a List Type using Array notation, all Types in the Array must be the same.");
            }
            let list = new List_1.ListValue(firstType, context.serializer);
            list.push(...cast);
            return list;
        }
        else if (Array.isArray(source)) {
            let array = source;
            if (array.length === 0) {
                throw new Error(`Error resolving a Value. At least one item must be present in the Array to determine the List ItemType when resolving ${source}.`);
            }
            let coercedItemType = undefined;
            if (coercedType !== undefined) {
                if (coercedType.type === _1.TypeSet.List) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVmFsdWVTb3VyY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdmFsdWVzL1ZhbHVlU291cmNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHdCQUE0QjtBQUc1Qiw0Q0FBeUM7QUFDekMsaUNBQW1DO0FBQ25DLCtCQUFpQztBQUNqQyxpQ0FBNkM7QUFDN0MsMkNBQTZDO0FBQzdDLHFDQUF1QztBQUV2Qyw2Q0FBK0U7QUFDL0UsaUNBQW1DO0FBeUJuQyxNQUFhLFdBQVc7SUFFckIsWUFBcUIsT0FBc0I7UUFBdEIsWUFBTyxHQUFQLE9BQU8sQ0FBZTtJQUUzQyxDQUFDO0lBRUQ7Ozs7Ozs7Ozs7OztPQVlHO0lBQ0gsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFvQjtRQUNoQyxJQUFJLE9BQU8sR0FBRztZQUNYLEdBQUcsQ0FBQyxNQUFvQixFQUFFLFFBQWdCO2dCQUN2QyxJQUFHLE9BQU8sTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLFVBQVUsRUFBRSxDQUFDO29CQUN6QyxPQUFPLFVBQVMsR0FBRyxJQUFXO3dCQUMzQixPQUFPLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFBO29CQUNuQyxDQUFDLENBQUE7Z0JBQ0osQ0FBQztnQkFFRCxPQUFPLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQTtZQUMxQixDQUFDO1NBQ0gsQ0FBQTtRQUVELE9BQU8sSUFBSSxLQUFLLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFBO0lBQ3BDLENBQUM7SUFFRDs7Ozs7Ozs7T0FRRztJQUNILE1BQU0sQ0FBQyxPQUFPLENBQ1gsTUFBeUIsRUFDekIsT0FBc0IsRUFDdEIsYUFBa0MsRUFDbEMsV0FBbUI7UUFFbkIsSUFBSSxNQUFNLEdBQUcsSUFBSSxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUE7UUFDckMsSUFBSSxhQUFhLEdBQUcsV0FBVyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTtRQUUv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QyxRQUFnQixFQUFFO1FBQ3RCLE9BQU8sSUFBSSxvQkFBVyxDQUFDLEtBQUssQ0FBQyxDQUFBO0lBQ2hDLENBQUM7SUFFRCxJQUFJLENBQUMsUUFBZ0IsQ0FBQztRQUNuQixJQUFJLEtBQUssR0FBRyxDQUFDLEVBQUUsQ0FBQztZQUNiLE1BQU0sSUFBSSxLQUFLLENBQUMsNkRBQTZELENBQUMsQ0FBQTtRQUNqRixDQUFDO1FBRUQsT0FBTyxJQUFJLGdCQUFTLENBQUMsS0FBSyxDQUFDLENBQUE7SUFDOUIsQ0FBQztDQUNIO0FBN0pELGtDQTZKQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFR5cGVTZXQgfSBmcm9tIFwiLlwiO1xuaW1wb3J0IHsgSU1vZGVsIH0gZnJvbSBcIi4uL01vZGVsXCI7XG5pbXBvcnQgeyBJU3RhY2tDb250ZXh0IH0gZnJvbSBcIi4uL3N0YWNrL1N0YWNrQ29udGV4dFwiO1xuaW1wb3J0IHsgVWlkS2VlcGVyIH0gZnJvbSBcIi4uL1VpZEtlZXBlclwiO1xuaW1wb3J0IHsgQm9vbFZhbHVlIH0gZnJvbSBcIi4vQm9vbFwiO1xuaW1wb3J0IHsgSW50VmFsdWUgfSBmcm9tIFwiLi9JbnRcIjtcbmltcG9ydCB7IExpc3RUeXBlLCBMaXN0VmFsdWUgfSBmcm9tIFwiLi9MaXN0XCI7XG5pbXBvcnQgeyBPYmplY3RSZWZWYWx1ZSB9IGZyb20gXCIuL09iamVjdFJlZlwiO1xuaW1wb3J0IHsgU3RyaW5nVmFsdWUgfSBmcm9tIFwiLi9TdHJpbmdcIjtcbmltcG9ydCB7IElUeXBlIH0gZnJvbSBcIi4vVHlwZVwiO1xuaW1wb3J0IHsgQ3JlYXRlVHlwZUhhbmRsZXIsIFR5cGVDcmVhdGVQYXJhbXMsIFR5cGVTb3VyY2UgfSBmcm9tIFwiLi9UeXBlU291cmNlXCI7XG5pbXBvcnQgeyBVSW50VmFsdWUgfSBmcm9tIFwiLi9VSW50XCI7XG5pbXBvcnQgeyBJVmFsdWUgfSBmcm9tIFwiLi9WYWx1ZVwiO1xuXG5leHBvcnQgdHlwZSBWYWx1ZUNyZWF0ZUNvbnRleHQgPSB7XG4gICBtb2RlbD86IElNb2RlbFxufVxuXG5leHBvcnQgdHlwZSBDcmVhdGVWYWx1ZUhhbmRsZXIgPSAodmFsdWU6IElWYWx1ZVNvdXJjZSwgY3R4PzogVmFsdWVDcmVhdGVDb250ZXh0KSA9PiBJVmFsdWUgfCBJVmFsdWVbXVxuZXhwb3J0IHR5cGUgVmFsdWVDcmVhdGVQYXJhbXMgPSBib29sZWFuIHwgbnVtYmVyIHwgc3RyaW5nIHwgYW55W10gfCBDcmVhdGVWYWx1ZUhhbmRsZXJcblxuZXhwb3J0IHR5cGUgTm9ybWFsaXplZFR5cGUgPSB7XG4gICBba2V5OiBzdHJpbmddOiBJVHlwZVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIElWYWx1ZVNvdXJjZSB7XG4gICBib29sKHZhbHVlOiBib29sZWFuKTogQm9vbFZhbHVlXG4gICBpbnQodmFsdWU6IG51bWJlcik6IEludFZhbHVlXG4gICBsaXN0KGl0ZW1UeXBlOiBDcmVhdGVUeXBlSGFuZGxlcik6IExpc3RWYWx1ZVxuXG4gICAvLyBUT0RPOiBBZGQgcmVmKG1vZGVsOiBJTW9kZWwpIHZlcnNpb25cbiAgIHJlZihtb2RlbE5hbWU6IHN0cmluZywgaWQ/OiBzdHJpbmcpOiBPYmplY3RSZWZWYWx1ZVxuICAgc3RyaW5nKHZhbHVlOiBzdHJpbmcpOiBTdHJpbmdWYWx1ZVxuICAgdWludCh2YWx1ZTogbnVtYmVyKTogVUludFZhbHVlXG59XG5cbmV4cG9ydCBjbGFzcyBWYWx1ZVNvdXJjZSBpbXBsZW1lbnRzIElWYWx1ZVNvdXJjZSB7XG5cbiAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IGNvbnRleHQ6IElTdGFja0NvbnRleHQpIHtcblxuICAgfVxuXG4gICAvKipcbiAgICAqIFdyYXBzIGFuIElWYWx1ZVNvdXJjZSBpbiBhIFByb3h5LiBcbiAgICAqIFxuICAgICogTm90ZTpcbiAgICAqIFRoaXMgaXMgbmVjZXNzYXJ5IHNpbmNlIGl0IHR1cm5zIG91dCB0aGF0IHdoZW4gd2UgdXNlIGRlc3RydWN0dXJpbmdcbiAgICAqIGZvciBkZWZpbmluZyBNb2RlbHMsIHRoZSAndGhpcycgcG9pbnRlciBpbnNpZGUgb2YgYW55IG1ldGhvZHMgYmVpbmcgY2FsbGVkXG4gICAgKiBvbiB0aGUgSVZhbHVlU291cmNlLCBsb3NlcyBpdHMgc2NvcGUsIGFuZCBiZWNvbWVzICd1bmRlZmluZWQnLlxuICAgICogVG8gd29yayBhcm91bmQgdGhpcywgYSBQcm94eSBpcyB1c2VkIGluc3RlYWQgdGhhdCByZXRhaW5zXG4gICAgKiB0aGUgJ3RoaXMnIHBvaW50ZXIgcmVnYXJkbGVzcyBob3cvd2hlbiBkZXN0cnVjdHVyaW5nIGlzIHVzZWQuIFxuICAgICogXG4gICAgKiBAcGFyYW0gdmFsdWVzIFRoZSBJVmFsdWVTb3VyY2UgdG8gd3JhcFxuICAgICogQHJldHVybnMgQSBQcm94eSdkIElWYWx1ZVNvdXJjZVxuICAgICovXG4gICBzdGF0aWMgdG9Qcm94eSh2YWx1ZXM6IElWYWx1ZVNvdXJjZSk6IElWYWx1ZVNvdXJjZSB7XG4gICAgICBsZXQgaGFuZGxlciA9IHtcbiAgICAgICAgIGdldCh0YXJnZXQ6IElWYWx1ZVNvdXJjZSwgcHJvcGVydHk6IHN0cmluZyk6IGFueSB7XG4gICAgICAgICAgICBpZih0eXBlb2YgdGFyZ2V0W3Byb3BlcnR5XSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKC4uLmFyZ3M6IGFueVtdKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gdGFyZ2V0W3Byb3BlcnR5XSguLi5hcmdzKVxuICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGFyZ2V0W3Byb3BlcnR5XVxuICAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gbmV3IFByb3h5KHZhbHVlcywgaGFuZGxlcilcbiAgIH1cblxuICAgLyoqXG4gICAgKiBSZXNvbHZlcyBhIHNldCBvZiBWYWx1ZVBhcmFtcyBpbnRvIGEgVmFsdWVcbiAgICAqIFxuICAgICogQHBhcmFtIHNvdXJjZSBUaGUgUGFyYW1TXG4gICAgKiBAcGFyYW0gY29udGV4dCBTdGFja0NvbnRleHRcbiAgICAqIEBwYXJhbSBjcmVhdGVDb250ZXh0IENyZWF0aW9uIGNvbnRleHQgaWYgYXZhaWxhYmxlXG4gICAgKiBAcGFyYW0gY29lcmNlZFR5cGUgSUYgdGhlIHR5cGUgaXMga25vd24gYWhlYWQgb2YgdGltZSwgdGhpcyBjYW4gaGVscCBkZXRlcm1pbmUgdGhlIFR5cGUgbW9wcmUgYWNjdXJhdGVseVxuICAgICogQHJldHVybnMgXG4gICAgKi9cbiAgIHN0YXRpYyByZXNvbHZlKFxuICAgICAgc291cmNlOiBWYWx1ZUNyZWF0ZVBhcmFtcyxcbiAgICAgIGNvbnRleHQ6IElTdGFja0NvbnRleHQsXG4gICAgICBjcmVhdGVDb250ZXh0PzogVmFsdWVDcmVhdGVDb250ZXh0LFxuICAgICAgY29lcmNlZFR5cGU/OiBJVHlwZVxuICAgKTogSVZhbHVlIHtcbiAgICAgIGxldCB2YWx1ZXMgPSBuZXcgVmFsdWVTb3VyY2UoY29udGV4dClcbiAgICAgIGxldCBwcm94aWVkVmFsdWVzID0gVmFsdWVTb3VyY2UudG9Qcm94eSh2YWx1ZXMpXG5cbiAgICAgIGlmICh0eXBlb2Ygc291cmNlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICBjcmVhdGVDb250ZXh0ID0gY3JlYXRlQ29udGV4dCB8fCB7fVxuXG4gICAgICAgICBsZXQgdmFsdWUgPSBzb3VyY2UocHJveGllZFZhbHVlcywgY3JlYXRlQ29udGV4dClcblxuICAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlXG4gICAgICAgICB9XG5cbiAgICAgICAgIGxldCBjYXN0ID0gdmFsdWUgYXMgSVZhbHVlW11cblxuICAgICAgICAgaWYgKGNhc3QubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJFbmNvdW50ZXJlZCBhbiBlcnJvciB3aGVuIGRldGVybWluaW5nIHRoZSBUeXBlIG9mIGEgdmFsdWUuIFJlY2VpdmVkIGFuIGVtcHR5IEFycmF5LiBBcnJheSBub3RhdGlvbiBjYW4gb25seSBiZSB1c2VkIGlmIGl0IGNvbnRhaW5zIGF0IGxlYXN0IDEgZWxlbWVudC5cIilcbiAgICAgICAgIH1cblxuICAgICAgICAgbGV0IGNvZXJjZWRJdGVtVHlwZTogSVR5cGUgfCB1bmRlZmluZWQgPSB1bmRlZmluZWRcblxuICAgICAgICAgaWYoY29lcmNlZFR5cGUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgaWYoY29lcmNlZFR5cGUudHlwZSA9PT0gVHlwZVNldC5MaXN0KSB7XG4gICAgICAgICAgICAgICBsZXQgbGlzdCA9IGNvZXJjZWRUeXBlIGFzIExpc3RUeXBlXG4gICAgICAgICAgICAgICBjb2VyY2VkSXRlbVR5cGUgPSBsaXN0Lml0ZW1UeXBlXG4gICAgICAgICAgICB9XG4gICAgICAgICB9XG5cbiAgICAgICAgIGxldCBmaXJzdFR5cGUgPSBjb2VyY2VkSXRlbVR5cGUgfHwgY2FzdFswXS50eXBlXG5cbiAgICAgICAgIGxldCBhbGxUeXBlc0VxdWFsID0gY2FzdC5ldmVyeShpdCA9PiBmaXJzdFR5cGUuZXF1YWxzKGl0LnR5cGUpKVxuXG4gICAgICAgICBpZiAoIWFsbFR5cGVzRXF1YWwpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkVuY291bnRlcmVkIGFuIGVycm9yIHdoZW4gZGV0ZXJtaW5naW5nIHRoZSBUeXBlIG9mIGEgdmFsdWUuIFdoZW4gc3BlY2lmeWluZyBhIExpc3QgVHlwZSB1c2luZyBBcnJheSBub3RhdGlvbiwgYWxsIFR5cGVzIGluIHRoZSBBcnJheSBtdXN0IGJlIHRoZSBzYW1lLlwiKVxuICAgICAgICAgfVxuXG4gICAgICAgICBsZXQgbGlzdCA9IG5ldyBMaXN0VmFsdWUoZmlyc3RUeXBlLCBjb250ZXh0LnNlcmlhbGl6ZXIpXG4gICAgICAgICBsaXN0LnB1c2goLi4uY2FzdClcblxuICAgICAgICAgcmV0dXJuIGxpc3RcbiAgICAgIH0gZWxzZSBpZihBcnJheS5pc0FycmF5KHNvdXJjZSkpIHtcbiAgICAgICAgIGxldCBhcnJheSA9IHNvdXJjZSBhcyBhbnlbXVxuXG4gICAgICAgICBpZihhcnJheS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgRXJyb3IgcmVzb2x2aW5nIGEgVmFsdWUuIEF0IGxlYXN0IG9uZSBpdGVtIG11c3QgYmUgcHJlc2VudCBpbiB0aGUgQXJyYXkgdG8gZGV0ZXJtaW5lIHRoZSBMaXN0IEl0ZW1UeXBlIHdoZW4gcmVzb2x2aW5nICR7c291cmNlfS5gKVxuICAgICAgICAgfVxuXG4gICAgICAgICBsZXQgY29lcmNlZEl0ZW1UeXBlOiBJVHlwZSB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZFxuXG4gICAgICAgICBpZihjb2VyY2VkVHlwZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBpZihjb2VyY2VkVHlwZS50eXBlID09PSBUeXBlU2V0Lkxpc3QpIHtcbiAgICAgICAgICAgICAgIGxldCBsaXN0ID0gY29lcmNlZFR5cGUgYXMgTGlzdFR5cGVcbiAgICAgICAgICAgICAgIGNvZXJjZWRJdGVtVHlwZSA9IGxpc3QuaXRlbVR5cGVcbiAgICAgICAgICAgIH1cbiAgICAgICAgIH1cblxuICAgICAgICAgbGV0IGl0ZW1UeXBlID0gY29lcmNlZEl0ZW1UeXBlID09PSB1bmRlZmluZWQgP1xuICAgICAgICAgICAgVHlwZVNvdXJjZS5yZXNvbHZlKGFycmF5WzBdLCBjb250ZXh0KSA6XG4gICAgICAgICAgICBjb2VyY2VkSXRlbVR5cGVcbiAgICAgICAgIFxuICAgICAgICAgbGV0IGxpc3QgPSBuZXcgTGlzdFZhbHVlKGl0ZW1UeXBlLCBjb250ZXh0LnNlcmlhbGl6ZXIpXG5cbiAgICAgICAgIGlmKGl0ZW1UeXBlLnR5cGUgIT09IFR5cGVTZXQuT2JqZWN0UmVmKSB7XG4gICAgICAgICAgICBsaXN0LnB1c2goLi4uYXJyYXkubWFwKGl0ID0+IFZhbHVlU291cmNlLnJlc29sdmUoaXQsIGNvbnRleHQpKSkgICAgICAgICAgICBcbiAgICAgICAgIH1cbiAgIFxuICAgICAgICAgcmV0dXJuIGxpc3RcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHNvdXJjZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgIHJldHVybiB2YWx1ZXMuc3RyaW5nKHNvdXJjZSlcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHNvdXJjZSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgIHJldHVybiB2YWx1ZXMuaW50KHNvdXJjZSlcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHNvdXJjZSA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgICByZXR1cm4gdmFsdWVzLmJvb2woc291cmNlKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5zdXBwb3J0ZWQgc291cmNlIHdoZW4gcmVzb2x2aW5nIGEgdHlwZTogJHt0eXBlb2Ygc291cmNlfWApXG4gICAgICB9XG4gICB9XG5cbiAgIGJvb2wodmFsdWU6IGJvb2xlYW4gPSB0cnVlKTogQm9vbFZhbHVlIHtcbiAgICAgIHJldHVybiBuZXcgQm9vbFZhbHVlKHZhbHVlKVxuICAgfVxuXG4gICBpbnQodmFsdWU6IG51bWJlciA9IDApOiBJbnRWYWx1ZSB7XG4gICAgICByZXR1cm4gbmV3IEludFZhbHVlKHZhbHVlKVxuICAgfVxuXG4gICAvLyBUT0RPOiBFeHRlbmQgdGhlIG9wdGlvbnMgaGVyZVxuICAgbGlzdChpdGVtVHlwZTogVHlwZUNyZWF0ZVBhcmFtcyk6IExpc3RWYWx1ZSB7XG4gICAgICBsZXQgdHlwZSA9IFR5cGVTb3VyY2UucmVzb2x2ZShpdGVtVHlwZSwgdGhpcy5jb250ZXh0KVxuICAgICAgcmV0dXJuIG5ldyBMaXN0VmFsdWUodHlwZSwgdGhpcy5jb250ZXh0LnNlcmlhbGl6ZXIpXG4gICB9XG5cbiAgIC8vIFRPRE86IEFkZCByZWYobW9kZWw6IElNb2RlbCkgdmVyc2lvblxuICAgcmVmKG1vZGVsTmFtZTogc3RyaW5nLCBpZDogc3RyaW5nID0gVWlkS2VlcGVyLklkTm90U2V0KTogT2JqZWN0UmVmVmFsdWUge1xuICAgICAgcmV0dXJuIG5ldyBPYmplY3RSZWZWYWx1ZShtb2RlbE5hbWUsIGlkLCB0aGlzLmNvbnRleHQpXG4gICB9XG5cbiAgIHN0cmluZyh2YWx1ZTogc3RyaW5nID0gJycpOiBTdHJpbmdWYWx1ZSB7XG4gICAgICByZXR1cm4gbmV3IFN0cmluZ1ZhbHVlKHZhbHVlKVxuICAgfVxuXG4gICB1aW50KHZhbHVlOiBudW1iZXIgPSAwKTogVUludFZhbHVlIHtcbiAgICAgIGlmICh2YWx1ZSA8IDApIHtcbiAgICAgICAgIHRocm93IG5ldyBFcnJvcihgV2hlbiBjcmVhdGluZyBhIFVJbnQgdmFsdWUsIHRoZSBudW1iZXIgbXVzdCBub3QgYmUgbmVnYXRpdmVgKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gbmV3IFVJbnRWYWx1ZSh2YWx1ZSlcbiAgIH1cbn0iXX0=