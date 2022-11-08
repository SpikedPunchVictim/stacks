"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeSource = void 0;
const Model_1 = require("../Model");
const Bool_1 = require("./Bool");
const Int_1 = require("./Int");
const List_1 = require("./List");
const ObjectRef_1 = require("./ObjectRef");
const String_1 = require("./String");
const Type_1 = require("./Type");
const UInt_1 = require("./UInt");
class TypeSource {
    constructor(context) {
        this.context = context;
        this.bool = Bool_1.BoolType.Singleton;
        this.int = Int_1.IntType.Singleton;
        this.uint = UInt_1.UIntType.Singleton;
        this.string = String_1.StringType.Singleton;
    }
    /**
     * Resolves a Type based on the raw Type data.
     *
     * Supported cases
     *    : Bool - BoolType, & true/false
     *    : Int -
     *       * IntType
     *       * A number. All raw numbers are assigned the Int Type
     *    : List
     *       * ListType
     *       * A JS Array [] with 1 element. The first (and only) element determines the List ItemType.
     *    : ObjectRef
     *       * ObjectRefType
     *    : String
     *       * StringType
     *       * Raw string
     *    : UInt
     *       * UIntType
     *    : CreateTypeHandler which resolves to the Type
     *
     *
     * @param source The raw Type information
     * @param context Stack Context
     * @returns The Type
     */
    static resolve(source, context) {
        let types = new TypeSource(context);
        if (typeof source === 'function') {
            return source(types);
        }
        else if (Array.isArray(source)) {
            let array = source;
            if (array.length == 0) {
                throw new Error(`Error resolving a Type. At least one item must be present in the Array to determine the List ItemType when resolving ${source}.`);
            }
            let itemType = TypeSource.resolve(array[0], context);
            return new List_1.ListType(itemType);
        }
        else if (typeof source === 'object') {
            let model = Model_1.Model.asModel(source);
            if (model !== undefined) {
                return new ObjectRef_1.ObjectRefType(model.name, context);
            }
            if (!Type_1.Type.isType(source)) {
                throw new Error(`Error resolving a Type. Expected a Type Object but received something else instead.`);
            }
            return source;
        }
        else if (typeof source === 'string') {
            return types.string;
        }
        else if (typeof source === 'number') {
            return types.int;
        }
        else if (typeof source === 'boolean') {
            return types.bool;
        }
        else {
            throw new Error(`Unsupported source when resolving a type: ${typeof source}`);
        }
    }
    list(itemType) {
        let item = TypeSource.resolve(itemType, this.context);
        return new List_1.ListType(item);
    }
    ref(modelName) {
        return new ObjectRef_1.ObjectRefType(modelName, this.context);
    }
}
exports.TypeSource = TypeSource;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVHlwZVNvdXJjZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy92YWx1ZXMvVHlwZVNvdXJjZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxvQ0FBaUM7QUFFakMsaUNBQWtDO0FBQ2xDLCtCQUFnQztBQUNoQyxpQ0FBa0M7QUFDbEMsMkNBQTRDO0FBQzVDLHFDQUFzQztBQUN0QyxpQ0FBcUM7QUFDckMsaUNBQWtDO0FBZ0JsQyxNQUFhLFVBQVU7SUFNcEIsWUFDb0IsT0FBc0I7UUFBdEIsWUFBTyxHQUFQLE9BQU8sQ0FBZTtRQU5qQyxTQUFJLEdBQWEsZUFBUSxDQUFDLFNBQVMsQ0FBQTtRQUNuQyxRQUFHLEdBQVksYUFBTyxDQUFDLFNBQVMsQ0FBQTtRQUNoQyxTQUFJLEdBQWEsZUFBUSxDQUFDLFNBQVMsQ0FBQTtRQUNuQyxXQUFNLEdBQWUsbUJBQVUsQ0FBQyxTQUFTLENBQUE7SUFNbEQsQ0FBQztJQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7T0F3Qkc7SUFDSCxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQXdCLEVBQUUsT0FBc0I7UUFDNUQsSUFBSSxLQUFLLEdBQUcsSUFBSSxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUE7UUFFbkMsSUFBSSxPQUFPLE1BQU0sS0FBSyxVQUFVLEVBQUU7WUFDL0IsT0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUE7U0FDdEI7YUFBTSxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDL0IsSUFBSSxLQUFLLEdBQUcsTUFBZSxDQUFBO1lBRTNCLElBQUcsS0FBSyxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUU7Z0JBQ25CLE1BQU0sSUFBSSxLQUFLLENBQUMsd0hBQXdILE1BQU0sR0FBRyxDQUFDLENBQUE7YUFDcEo7WUFFRCxJQUFJLFFBQVEsR0FBRyxVQUFVLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQTtZQUVwRCxPQUFPLElBQUksZUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFBO1NBRS9CO2FBQU0sSUFBRyxPQUFPLE1BQU0sS0FBSyxRQUFRLEVBQUU7WUFDbkMsSUFBSSxLQUFLLEdBQUcsYUFBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTtZQUNqQyxJQUFHLEtBQUssS0FBSyxTQUFTLEVBQUU7Z0JBQ3JCLE9BQU8sSUFBSSx5QkFBYSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUE7YUFDL0M7WUFFRCxJQUFHLENBQUMsV0FBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRTtnQkFDdEIsTUFBTSxJQUFJLEtBQUssQ0FBQyxxRkFBcUYsQ0FBQyxDQUFBO2FBQ3hHO1lBRUQsT0FBTyxNQUFNLENBQUE7U0FDZjthQUFNLElBQUksT0FBTyxNQUFNLEtBQUssUUFBUSxFQUFFO1lBQ3BDLE9BQU8sS0FBSyxDQUFDLE1BQU0sQ0FBQTtTQUNyQjthQUFNLElBQUksT0FBTyxNQUFNLEtBQUssUUFBUSxFQUFFO1lBQ3BDLE9BQU8sS0FBSyxDQUFDLEdBQUcsQ0FBQTtTQUNsQjthQUFNLElBQUksT0FBTyxNQUFNLEtBQUssU0FBUyxFQUFFO1lBQ3JDLE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBQTtTQUNuQjthQUFNO1lBQ0osTUFBTSxJQUFJLEtBQUssQ0FBQyw2Q0FBNkMsT0FBTyxNQUFNLEVBQUUsQ0FBQyxDQUFBO1NBQy9FO0lBQ0osQ0FBQztJQUVELElBQUksQ0FBQyxRQUEwQjtRQUM1QixJQUFJLElBQUksR0FBRyxVQUFVLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7UUFDckQsT0FBTyxJQUFJLGVBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUM1QixDQUFDO0lBRUQsR0FBRyxDQUFDLFNBQWlCO1FBQ2xCLE9BQU8sSUFBSSx5QkFBYSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7SUFDcEQsQ0FBQztDQUNIO0FBbkZELGdDQW1GQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE1vZGVsIH0gZnJvbSBcIi4uL01vZGVsXCI7XG5pbXBvcnQgeyBJU3RhY2tDb250ZXh0IH0gZnJvbSBcIi4uL3N0YWNrL1N0YWNrQ29udGV4dFwiO1xuaW1wb3J0IHsgQm9vbFR5cGUgfSBmcm9tIFwiLi9Cb29sXCI7XG5pbXBvcnQgeyBJbnRUeXBlIH0gZnJvbSBcIi4vSW50XCI7XG5pbXBvcnQgeyBMaXN0VHlwZSB9IGZyb20gXCIuL0xpc3RcIjtcbmltcG9ydCB7IE9iamVjdFJlZlR5cGUgfSBmcm9tIFwiLi9PYmplY3RSZWZcIjtcbmltcG9ydCB7IFN0cmluZ1R5cGUgfSBmcm9tIFwiLi9TdHJpbmdcIjtcbmltcG9ydCB7IElUeXBlLCBUeXBlIH0gZnJvbSBcIi4vVHlwZVwiO1xuaW1wb3J0IHsgVUludFR5cGUgfSBmcm9tIFwiLi9VSW50XCI7XG5cbmV4cG9ydCB0eXBlIFR5cGVDcmVhdGVQYXJhbXMgPSBib29sZWFuIHwgbnVtYmVyIHwgc3RyaW5nIHwgYW55W10gfCBJVHlwZSB8IENyZWF0ZVR5cGVIYW5kbGVyXG5cbmV4cG9ydCB0eXBlIENyZWF0ZVR5cGVIYW5kbGVyID0gKGNvbnZlcnRlcjogVHlwZVNvdXJjZSkgPT4gSVR5cGVcblxuZXhwb3J0IGludGVyZmFjZSBJVHlwZVNvdXJjZSB7XG4gICByZWFkb25seSBib29sOiBCb29sVHlwZVxuICAgcmVhZG9ubHkgaW50OiBJbnRUeXBlXG4gICByZWFkb25seSB1aW50OiBVSW50VHlwZVxuICAgcmVhZG9ubHkgc3RyaW5nOiBTdHJpbmdUeXBlXG4gICBcbiAgIGxpc3QoaXRlbVR5cGU6IElUeXBlKTogSVR5cGVcbiAgIHJlZihtb2RlbE5hbWU6IHN0cmluZyk6IElUeXBlXG59XG5cbmV4cG9ydCBjbGFzcyBUeXBlU291cmNlIHtcbiAgIHJlYWRvbmx5IGJvb2w6IEJvb2xUeXBlID0gQm9vbFR5cGUuU2luZ2xldG9uXG4gICByZWFkb25seSBpbnQ6IEludFR5cGUgPSBJbnRUeXBlLlNpbmdsZXRvblxuICAgcmVhZG9ubHkgdWludDogVUludFR5cGUgPSBVSW50VHlwZS5TaW5nbGV0b25cbiAgIHJlYWRvbmx5IHN0cmluZzogU3RyaW5nVHlwZSA9IFN0cmluZ1R5cGUuU2luZ2xldG9uXG5cbiAgIGNvbnN0cnVjdG9yKFxuICAgICAgcHJpdmF0ZSByZWFkb25seSBjb250ZXh0OiBJU3RhY2tDb250ZXh0XG4gICApIHtcblxuICAgfVxuXG4gICAvKipcbiAgICAqIFJlc29sdmVzIGEgVHlwZSBiYXNlZCBvbiB0aGUgcmF3IFR5cGUgZGF0YS5cbiAgICAqIFxuICAgICogU3VwcG9ydGVkIGNhc2VzXG4gICAgKiAgICA6IEJvb2wgLSBCb29sVHlwZSwgJiB0cnVlL2ZhbHNlXG4gICAgKiAgICA6IEludCAtIFxuICAgICogICAgICAgKiBJbnRUeXBlXG4gICAgKiAgICAgICAqIEEgbnVtYmVyLiBBbGwgcmF3IG51bWJlcnMgYXJlIGFzc2lnbmVkIHRoZSBJbnQgVHlwZVxuICAgICogICAgOiBMaXN0XG4gICAgKiAgICAgICAqIExpc3RUeXBlXG4gICAgKiAgICAgICAqIEEgSlMgQXJyYXkgW10gd2l0aCAxIGVsZW1lbnQuIFRoZSBmaXJzdCAoYW5kIG9ubHkpIGVsZW1lbnQgZGV0ZXJtaW5lcyB0aGUgTGlzdCBJdGVtVHlwZS5cbiAgICAqICAgIDogT2JqZWN0UmVmXG4gICAgKiAgICAgICAqIE9iamVjdFJlZlR5cGVcbiAgICAqICAgIDogU3RyaW5nXG4gICAgKiAgICAgICAqIFN0cmluZ1R5cGVcbiAgICAqICAgICAgICogUmF3IHN0cmluZ1xuICAgICogICAgOiBVSW50XG4gICAgKiAgICAgICAqIFVJbnRUeXBlXG4gICAgKiAgICA6IENyZWF0ZVR5cGVIYW5kbGVyIHdoaWNoIHJlc29sdmVzIHRvIHRoZSBUeXBlXG4gICAgKiBcbiAgICAqIFxuICAgICogQHBhcmFtIHNvdXJjZSBUaGUgcmF3IFR5cGUgaW5mb3JtYXRpb25cbiAgICAqIEBwYXJhbSBjb250ZXh0IFN0YWNrIENvbnRleHRcbiAgICAqIEByZXR1cm5zIFRoZSBUeXBlXG4gICAgKi9cbiAgIHN0YXRpYyByZXNvbHZlKHNvdXJjZTogVHlwZUNyZWF0ZVBhcmFtcywgY29udGV4dDogSVN0YWNrQ29udGV4dCk6IElUeXBlIHtcbiAgICAgIGxldCB0eXBlcyA9IG5ldyBUeXBlU291cmNlKGNvbnRleHQpXG5cbiAgICAgIGlmICh0eXBlb2Ygc291cmNlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICByZXR1cm4gc291cmNlKHR5cGVzKVxuICAgICAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KHNvdXJjZSkpIHtcbiAgICAgICAgIGxldCBhcnJheSA9IHNvdXJjZSBhcyBhbnlbXVxuXG4gICAgICAgICBpZihhcnJheS5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBFcnJvciByZXNvbHZpbmcgYSBUeXBlLiBBdCBsZWFzdCBvbmUgaXRlbSBtdXN0IGJlIHByZXNlbnQgaW4gdGhlIEFycmF5IHRvIGRldGVybWluZSB0aGUgTGlzdCBJdGVtVHlwZSB3aGVuIHJlc29sdmluZyAke3NvdXJjZX0uYClcbiAgICAgICAgIH1cblxuICAgICAgICAgbGV0IGl0ZW1UeXBlID0gVHlwZVNvdXJjZS5yZXNvbHZlKGFycmF5WzBdLCBjb250ZXh0KVxuXG4gICAgICAgICByZXR1cm4gbmV3IExpc3RUeXBlKGl0ZW1UeXBlKVxuXG4gICAgICB9IGVsc2UgaWYodHlwZW9mIHNvdXJjZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgIGxldCBtb2RlbCA9IE1vZGVsLmFzTW9kZWwoc291cmNlKVxuICAgICAgICAgaWYobW9kZWwgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBPYmplY3RSZWZUeXBlKG1vZGVsLm5hbWUsIGNvbnRleHQpXG4gICAgICAgICB9XG5cbiAgICAgICAgIGlmKCFUeXBlLmlzVHlwZShzb3VyY2UpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEVycm9yIHJlc29sdmluZyBhIFR5cGUuIEV4cGVjdGVkIGEgVHlwZSBPYmplY3QgYnV0IHJlY2VpdmVkIHNvbWV0aGluZyBlbHNlIGluc3RlYWQuYClcbiAgICAgICAgIH1cblxuICAgICAgICAgcmV0dXJuIHNvdXJjZSAgICAgIFxuICAgICAgfSBlbHNlIGlmICh0eXBlb2Ygc291cmNlID09PSAnc3RyaW5nJykge1xuICAgICAgICAgcmV0dXJuIHR5cGVzLnN0cmluZ1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2Ygc291cmNlID09PSAnbnVtYmVyJykge1xuICAgICAgICAgcmV0dXJuIHR5cGVzLmludFxuICAgICAgfSBlbHNlIGlmICh0eXBlb2Ygc291cmNlID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgIHJldHVybiB0eXBlcy5ib29sXG4gICAgICB9IGVsc2Uge1xuICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbnN1cHBvcnRlZCBzb3VyY2Ugd2hlbiByZXNvbHZpbmcgYSB0eXBlOiAke3R5cGVvZiBzb3VyY2V9YClcbiAgICAgIH1cbiAgIH1cblxuICAgbGlzdChpdGVtVHlwZTogVHlwZUNyZWF0ZVBhcmFtcyk6IElUeXBlIHtcbiAgICAgIGxldCBpdGVtID0gVHlwZVNvdXJjZS5yZXNvbHZlKGl0ZW1UeXBlLCB0aGlzLmNvbnRleHQpXG4gICAgICByZXR1cm4gbmV3IExpc3RUeXBlKGl0ZW0pXG4gICB9XG5cbiAgIHJlZihtb2RlbE5hbWU6IHN0cmluZyk6IElUeXBlIHtcbiAgICAgIHJldHVybiBuZXcgT2JqZWN0UmVmVHlwZShtb2RlbE5hbWUsIHRoaXMuY29udGV4dClcbiAgIH1cbn0iXX0=