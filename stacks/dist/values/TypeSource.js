"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeSource = void 0;
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
            if (!Type_1.Type.isType(source)) {
                throw new Error(`Error resolving a Type. Expected a Type Obejct but received something else instead.`);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVHlwZVNvdXJjZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy92YWx1ZXMvVHlwZVNvdXJjZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxpQ0FBa0M7QUFDbEMsK0JBQWdDO0FBQ2hDLGlDQUFrQztBQUNsQywyQ0FBNEM7QUFDNUMscUNBQXNDO0FBQ3RDLGlDQUFxQztBQUNyQyxpQ0FBa0M7QUFnQmxDLE1BQWEsVUFBVTtJQU1wQixZQUNvQixPQUFzQjtRQUF0QixZQUFPLEdBQVAsT0FBTyxDQUFlO1FBTmpDLFNBQUksR0FBYSxlQUFRLENBQUMsU0FBUyxDQUFBO1FBQ25DLFFBQUcsR0FBWSxhQUFPLENBQUMsU0FBUyxDQUFBO1FBQ2hDLFNBQUksR0FBYSxlQUFRLENBQUMsU0FBUyxDQUFBO1FBQ25DLFdBQU0sR0FBZSxtQkFBVSxDQUFDLFNBQVMsQ0FBQTtJQU1sRCxDQUFDO0lBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztPQXdCRztJQUNILE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBd0IsRUFBRSxPQUFzQjtRQUM1RCxJQUFJLEtBQUssR0FBRyxJQUFJLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUVuQyxJQUFJLE9BQU8sTUFBTSxLQUFLLFVBQVUsRUFBRTtZQUMvQixPQUFPLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQTtTQUN0QjthQUFNLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUMvQixJQUFJLEtBQUssR0FBRyxNQUFlLENBQUE7WUFFM0IsSUFBRyxLQUFLLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRTtnQkFDbkIsTUFBTSxJQUFJLEtBQUssQ0FBQyx3SEFBd0gsTUFBTSxHQUFHLENBQUMsQ0FBQTthQUNwSjtZQUVELElBQUksUUFBUSxHQUFHLFVBQVUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFBO1lBRXBELE9BQU8sSUFBSSxlQUFRLENBQUMsUUFBUSxDQUFDLENBQUE7U0FFL0I7YUFBTSxJQUFHLE9BQU8sTUFBTSxLQUFLLFFBQVEsRUFBRTtZQUNuQyxJQUFHLENBQUMsV0FBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRTtnQkFDdEIsTUFBTSxJQUFJLEtBQUssQ0FBQyxxRkFBcUYsQ0FBQyxDQUFBO2FBQ3hHO1lBRUQsT0FBTyxNQUFNLENBQUE7U0FDZjthQUFNLElBQUksT0FBTyxNQUFNLEtBQUssUUFBUSxFQUFFO1lBQ3BDLE9BQU8sS0FBSyxDQUFDLE1BQU0sQ0FBQTtTQUNyQjthQUFNLElBQUksT0FBTyxNQUFNLEtBQUssUUFBUSxFQUFFO1lBQ3BDLE9BQU8sS0FBSyxDQUFDLEdBQUcsQ0FBQTtTQUNsQjthQUFNLElBQUksT0FBTyxNQUFNLEtBQUssU0FBUyxFQUFFO1lBQ3JDLE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBQTtTQUNuQjthQUFNO1lBQ0osTUFBTSxJQUFJLEtBQUssQ0FBQyw2Q0FBNkMsT0FBTyxNQUFNLEVBQUUsQ0FBQyxDQUFBO1NBQy9FO0lBQ0osQ0FBQztJQUVELElBQUksQ0FBQyxRQUEwQjtRQUM1QixJQUFJLElBQUksR0FBRyxVQUFVLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7UUFDckQsT0FBTyxJQUFJLGVBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUM1QixDQUFDO0lBRUQsR0FBRyxDQUFDLFNBQWlCO1FBQ2xCLE9BQU8sSUFBSSx5QkFBYSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7SUFDcEQsQ0FBQztDQUNIO0FBOUVELGdDQThFQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElTdGFja0NvbnRleHQgfSBmcm9tIFwiLi4vc3RhY2svU3RhY2tDb250ZXh0XCI7XG5pbXBvcnQgeyBCb29sVHlwZSB9IGZyb20gXCIuL0Jvb2xcIjtcbmltcG9ydCB7IEludFR5cGUgfSBmcm9tIFwiLi9JbnRcIjtcbmltcG9ydCB7IExpc3RUeXBlIH0gZnJvbSBcIi4vTGlzdFwiO1xuaW1wb3J0IHsgT2JqZWN0UmVmVHlwZSB9IGZyb20gXCIuL09iamVjdFJlZlwiO1xuaW1wb3J0IHsgU3RyaW5nVHlwZSB9IGZyb20gXCIuL1N0cmluZ1wiO1xuaW1wb3J0IHsgSVR5cGUsIFR5cGUgfSBmcm9tIFwiLi9UeXBlXCI7XG5pbXBvcnQgeyBVSW50VHlwZSB9IGZyb20gXCIuL1VJbnRcIjtcblxuZXhwb3J0IHR5cGUgVHlwZUNyZWF0ZVBhcmFtcyA9IGJvb2xlYW4gfCBudW1iZXIgfCBzdHJpbmcgfCBhbnlbXSB8IElUeXBlIHwgQ3JlYXRlVHlwZUhhbmRsZXJcblxuZXhwb3J0IHR5cGUgQ3JlYXRlVHlwZUhhbmRsZXIgPSAoY29udmVydGVyOiBUeXBlU291cmNlKSA9PiBJVHlwZVxuXG5leHBvcnQgaW50ZXJmYWNlIElUeXBlU291cmNlIHtcbiAgIHJlYWRvbmx5IGJvb2w6IEJvb2xUeXBlXG4gICByZWFkb25seSBpbnQ6IEludFR5cGVcbiAgIHJlYWRvbmx5IHVpbnQ6IFVJbnRUeXBlXG4gICByZWFkb25seSBzdHJpbmc6IFN0cmluZ1R5cGVcbiAgIFxuICAgbGlzdChpdGVtVHlwZTogSVR5cGUpOiBJVHlwZVxuICAgcmVmKG1vZGVsTmFtZTogc3RyaW5nKTogSVR5cGVcbn1cblxuZXhwb3J0IGNsYXNzIFR5cGVTb3VyY2Uge1xuICAgcmVhZG9ubHkgYm9vbDogQm9vbFR5cGUgPSBCb29sVHlwZS5TaW5nbGV0b25cbiAgIHJlYWRvbmx5IGludDogSW50VHlwZSA9IEludFR5cGUuU2luZ2xldG9uXG4gICByZWFkb25seSB1aW50OiBVSW50VHlwZSA9IFVJbnRUeXBlLlNpbmdsZXRvblxuICAgcmVhZG9ubHkgc3RyaW5nOiBTdHJpbmdUeXBlID0gU3RyaW5nVHlwZS5TaW5nbGV0b25cblxuICAgY29uc3RydWN0b3IoXG4gICAgICBwcml2YXRlIHJlYWRvbmx5IGNvbnRleHQ6IElTdGFja0NvbnRleHRcbiAgICkge1xuXG4gICB9XG5cbiAgIC8qKlxuICAgICogUmVzb2x2ZXMgYSBUeXBlIGJhc2VkIG9uIHRoZSByYXcgVHlwZSBkYXRhLlxuICAgICogXG4gICAgKiBTdXBwb3J0ZWQgY2FzZXNcbiAgICAqICAgIDogQm9vbCAtIEJvb2xUeXBlLCAmIHRydWUvZmFsc2VcbiAgICAqICAgIDogSW50IC0gXG4gICAgKiAgICAgICAqIEludFR5cGVcbiAgICAqICAgICAgICogQSBudW1iZXIuIEFsbCByYXcgbnVtYmVycyBhcmUgYXNzaWduZWQgdGhlIEludCBUeXBlXG4gICAgKiAgICA6IExpc3RcbiAgICAqICAgICAgICogTGlzdFR5cGVcbiAgICAqICAgICAgICogQSBKUyBBcnJheSBbXSB3aXRoIDEgZWxlbWVudC4gVGhlIGZpcnN0IChhbmQgb25seSkgZWxlbWVudCBkZXRlcm1pbmVzIHRoZSBMaXN0IEl0ZW1UeXBlLlxuICAgICogICAgOiBPYmplY3RSZWZcbiAgICAqICAgICAgICogT2JqZWN0UmVmVHlwZVxuICAgICogICAgOiBTdHJpbmdcbiAgICAqICAgICAgICogU3RyaW5nVHlwZVxuICAgICogICAgICAgKiBSYXcgc3RyaW5nXG4gICAgKiAgICA6IFVJbnRcbiAgICAqICAgICAgICogVUludFR5cGVcbiAgICAqICAgIDogQ3JlYXRlVHlwZUhhbmRsZXIgd2hpY2ggcmVzb2x2ZXMgdG8gdGhlIFR5cGVcbiAgICAqIFxuICAgICogXG4gICAgKiBAcGFyYW0gc291cmNlIFRoZSByYXcgVHlwZSBpbmZvcm1hdGlvblxuICAgICogQHBhcmFtIGNvbnRleHQgU3RhY2sgQ29udGV4dFxuICAgICogQHJldHVybnMgVGhlIFR5cGVcbiAgICAqL1xuICAgc3RhdGljIHJlc29sdmUoc291cmNlOiBUeXBlQ3JlYXRlUGFyYW1zLCBjb250ZXh0OiBJU3RhY2tDb250ZXh0KTogSVR5cGUge1xuICAgICAgbGV0IHR5cGVzID0gbmV3IFR5cGVTb3VyY2UoY29udGV4dClcblxuICAgICAgaWYgKHR5cGVvZiBzb3VyY2UgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgIHJldHVybiBzb3VyY2UodHlwZXMpXG4gICAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoc291cmNlKSkge1xuICAgICAgICAgbGV0IGFycmF5ID0gc291cmNlIGFzIGFueVtdXG5cbiAgICAgICAgIGlmKGFycmF5Lmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEVycm9yIHJlc29sdmluZyBhIFR5cGUuIEF0IGxlYXN0IG9uZSBpdGVtIG11c3QgYmUgcHJlc2VudCBpbiB0aGUgQXJyYXkgdG8gZGV0ZXJtaW5lIHRoZSBMaXN0IEl0ZW1UeXBlIHdoZW4gcmVzb2x2aW5nICR7c291cmNlfS5gKVxuICAgICAgICAgfVxuXG4gICAgICAgICBsZXQgaXRlbVR5cGUgPSBUeXBlU291cmNlLnJlc29sdmUoYXJyYXlbMF0sIGNvbnRleHQpXG5cbiAgICAgICAgIHJldHVybiBuZXcgTGlzdFR5cGUoaXRlbVR5cGUpXG5cbiAgICAgIH0gZWxzZSBpZih0eXBlb2Ygc291cmNlID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgaWYoIVR5cGUuaXNUeXBlKHNvdXJjZSkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgRXJyb3IgcmVzb2x2aW5nIGEgVHlwZS4gRXhwZWN0ZWQgYSBUeXBlIE9iZWpjdCBidXQgcmVjZWl2ZWQgc29tZXRoaW5nIGVsc2UgaW5zdGVhZC5gKVxuICAgICAgICAgfVxuXG4gICAgICAgICByZXR1cm4gc291cmNlICAgICAgXG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiBzb3VyY2UgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICByZXR1cm4gdHlwZXMuc3RyaW5nXG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiBzb3VyY2UgPT09ICdudW1iZXInKSB7XG4gICAgICAgICByZXR1cm4gdHlwZXMuaW50XG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiBzb3VyY2UgPT09ICdib29sZWFuJykge1xuICAgICAgICAgcmV0dXJuIHR5cGVzLmJvb2xcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVuc3VwcG9ydGVkIHNvdXJjZSB3aGVuIHJlc29sdmluZyBhIHR5cGU6ICR7dHlwZW9mIHNvdXJjZX1gKVxuICAgICAgfVxuICAgfVxuXG4gICBsaXN0KGl0ZW1UeXBlOiBUeXBlQ3JlYXRlUGFyYW1zKTogSVR5cGUge1xuICAgICAgbGV0IGl0ZW0gPSBUeXBlU291cmNlLnJlc29sdmUoaXRlbVR5cGUsIHRoaXMuY29udGV4dClcbiAgICAgIHJldHVybiBuZXcgTGlzdFR5cGUoaXRlbSlcbiAgIH1cblxuICAgcmVmKG1vZGVsTmFtZTogc3RyaW5nKTogSVR5cGUge1xuICAgICAgcmV0dXJuIG5ldyBPYmplY3RSZWZUeXBlKG1vZGVsTmFtZSwgdGhpcy5jb250ZXh0KVxuICAgfVxufSJdfQ==