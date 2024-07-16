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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVHlwZVNvdXJjZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy92YWx1ZXMvVHlwZVNvdXJjZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxvQ0FBaUM7QUFFakMsaUNBQWtDO0FBQ2xDLCtCQUFnQztBQUNoQyxpQ0FBa0M7QUFDbEMsMkNBQTRDO0FBQzVDLHFDQUFzQztBQUN0QyxpQ0FBcUM7QUFDckMsaUNBQWtDO0FBZ0JsQyxNQUFhLFVBQVU7SUFNcEIsWUFDb0IsT0FBc0I7UUFBdEIsWUFBTyxHQUFQLE9BQU8sQ0FBZTtRQU5qQyxTQUFJLEdBQWEsZUFBUSxDQUFDLFNBQVMsQ0FBQTtRQUNuQyxRQUFHLEdBQVksYUFBTyxDQUFDLFNBQVMsQ0FBQTtRQUNoQyxTQUFJLEdBQWEsZUFBUSxDQUFDLFNBQVMsQ0FBQTtRQUNuQyxXQUFNLEdBQWUsbUJBQVUsQ0FBQyxTQUFTLENBQUE7SUFNbEQsQ0FBQztJQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7T0F3Qkc7SUFDSCxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQXdCLEVBQUUsT0FBc0I7UUFDNUQsSUFBSSxLQUFLLEdBQUcsSUFBSSxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUE7UUFFbkMsSUFBSSxPQUFPLE1BQU0sS0FBSyxVQUFVLEVBQUUsQ0FBQztZQUNoQyxPQUFPLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUN2QixDQUFDO2FBQU0sSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUM7WUFDaEMsSUFBSSxLQUFLLEdBQUcsTUFBZSxDQUFBO1lBRTNCLElBQUcsS0FBSyxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUUsQ0FBQztnQkFDcEIsTUFBTSxJQUFJLEtBQUssQ0FBQyx3SEFBd0gsTUFBTSxHQUFHLENBQUMsQ0FBQTtZQUNySixDQUFDO1lBRUQsSUFBSSxRQUFRLEdBQUcsVUFBVSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUE7WUFFcEQsT0FBTyxJQUFJLGVBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQTtRQUVoQyxDQUFDO2FBQU0sSUFBRyxPQUFPLE1BQU0sS0FBSyxRQUFRLEVBQUUsQ0FBQztZQUNwQyxJQUFJLEtBQUssR0FBRyxhQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFBO1lBQ2pDLElBQUcsS0FBSyxLQUFLLFNBQVMsRUFBRSxDQUFDO2dCQUN0QixPQUFPLElBQUkseUJBQWEsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFBO1lBQ2hELENBQUM7WUFFRCxJQUFHLENBQUMsV0FBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDO2dCQUN2QixNQUFNLElBQUksS0FBSyxDQUFDLHFGQUFxRixDQUFDLENBQUE7WUFDekcsQ0FBQztZQUVELE9BQU8sTUFBTSxDQUFBO1FBQ2hCLENBQUM7YUFBTSxJQUFJLE9BQU8sTUFBTSxLQUFLLFFBQVEsRUFBRSxDQUFDO1lBQ3JDLE9BQU8sS0FBSyxDQUFDLE1BQU0sQ0FBQTtRQUN0QixDQUFDO2FBQU0sSUFBSSxPQUFPLE1BQU0sS0FBSyxRQUFRLEVBQUUsQ0FBQztZQUNyQyxPQUFPLEtBQUssQ0FBQyxHQUFHLENBQUE7UUFDbkIsQ0FBQzthQUFNLElBQUksT0FBTyxNQUFNLEtBQUssU0FBUyxFQUFFLENBQUM7WUFDdEMsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFBO1FBQ3BCLENBQUM7YUFBTSxDQUFDO1lBQ0wsTUFBTSxJQUFJLEtBQUssQ0FBQyw2Q0FBNkMsT0FBTyxNQUFNLEVBQUUsQ0FBQyxDQUFBO1FBQ2hGLENBQUM7SUFDSixDQUFDO0lBRUQsSUFBSSxDQUFDLFFBQTBCO1FBQzVCLElBQUksSUFBSSxHQUFHLFVBQVUsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUNyRCxPQUFPLElBQUksZUFBUSxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQzVCLENBQUM7SUFFRCxHQUFHLENBQUMsU0FBaUI7UUFDbEIsT0FBTyxJQUFJLHlCQUFhLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtJQUNwRCxDQUFDO0NBQ0g7QUFuRkQsZ0NBbUZDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTW9kZWwgfSBmcm9tIFwiLi4vTW9kZWxcIjtcbmltcG9ydCB7IElTdGFja0NvbnRleHQgfSBmcm9tIFwiLi4vc3RhY2svU3RhY2tDb250ZXh0XCI7XG5pbXBvcnQgeyBCb29sVHlwZSB9IGZyb20gXCIuL0Jvb2xcIjtcbmltcG9ydCB7IEludFR5cGUgfSBmcm9tIFwiLi9JbnRcIjtcbmltcG9ydCB7IExpc3RUeXBlIH0gZnJvbSBcIi4vTGlzdFwiO1xuaW1wb3J0IHsgT2JqZWN0UmVmVHlwZSB9IGZyb20gXCIuL09iamVjdFJlZlwiO1xuaW1wb3J0IHsgU3RyaW5nVHlwZSB9IGZyb20gXCIuL1N0cmluZ1wiO1xuaW1wb3J0IHsgSVR5cGUsIFR5cGUgfSBmcm9tIFwiLi9UeXBlXCI7XG5pbXBvcnQgeyBVSW50VHlwZSB9IGZyb20gXCIuL1VJbnRcIjtcblxuZXhwb3J0IHR5cGUgVHlwZUNyZWF0ZVBhcmFtcyA9IGJvb2xlYW4gfCBudW1iZXIgfCBzdHJpbmcgfCBhbnlbXSB8IElUeXBlIHwgQ3JlYXRlVHlwZUhhbmRsZXJcblxuZXhwb3J0IHR5cGUgQ3JlYXRlVHlwZUhhbmRsZXIgPSAoY29udmVydGVyOiBUeXBlU291cmNlKSA9PiBJVHlwZVxuXG5leHBvcnQgaW50ZXJmYWNlIElUeXBlU291cmNlIHtcbiAgIHJlYWRvbmx5IGJvb2w6IEJvb2xUeXBlXG4gICByZWFkb25seSBpbnQ6IEludFR5cGVcbiAgIHJlYWRvbmx5IHVpbnQ6IFVJbnRUeXBlXG4gICByZWFkb25seSBzdHJpbmc6IFN0cmluZ1R5cGVcbiAgIFxuICAgbGlzdChpdGVtVHlwZTogSVR5cGUpOiBJVHlwZVxuICAgcmVmKG1vZGVsTmFtZTogc3RyaW5nKTogSVR5cGVcbn1cblxuZXhwb3J0IGNsYXNzIFR5cGVTb3VyY2Uge1xuICAgcmVhZG9ubHkgYm9vbDogQm9vbFR5cGUgPSBCb29sVHlwZS5TaW5nbGV0b25cbiAgIHJlYWRvbmx5IGludDogSW50VHlwZSA9IEludFR5cGUuU2luZ2xldG9uXG4gICByZWFkb25seSB1aW50OiBVSW50VHlwZSA9IFVJbnRUeXBlLlNpbmdsZXRvblxuICAgcmVhZG9ubHkgc3RyaW5nOiBTdHJpbmdUeXBlID0gU3RyaW5nVHlwZS5TaW5nbGV0b25cblxuICAgY29uc3RydWN0b3IoXG4gICAgICBwcml2YXRlIHJlYWRvbmx5IGNvbnRleHQ6IElTdGFja0NvbnRleHRcbiAgICkge1xuXG4gICB9XG5cbiAgIC8qKlxuICAgICogUmVzb2x2ZXMgYSBUeXBlIGJhc2VkIG9uIHRoZSByYXcgVHlwZSBkYXRhLlxuICAgICogXG4gICAgKiBTdXBwb3J0ZWQgY2FzZXNcbiAgICAqICAgIDogQm9vbCAtIEJvb2xUeXBlLCAmIHRydWUvZmFsc2VcbiAgICAqICAgIDogSW50IC0gXG4gICAgKiAgICAgICAqIEludFR5cGVcbiAgICAqICAgICAgICogQSBudW1iZXIuIEFsbCByYXcgbnVtYmVycyBhcmUgYXNzaWduZWQgdGhlIEludCBUeXBlXG4gICAgKiAgICA6IExpc3RcbiAgICAqICAgICAgICogTGlzdFR5cGVcbiAgICAqICAgICAgICogQSBKUyBBcnJheSBbXSB3aXRoIDEgZWxlbWVudC4gVGhlIGZpcnN0IChhbmQgb25seSkgZWxlbWVudCBkZXRlcm1pbmVzIHRoZSBMaXN0IEl0ZW1UeXBlLlxuICAgICogICAgOiBPYmplY3RSZWZcbiAgICAqICAgICAgICogT2JqZWN0UmVmVHlwZVxuICAgICogICAgOiBTdHJpbmdcbiAgICAqICAgICAgICogU3RyaW5nVHlwZVxuICAgICogICAgICAgKiBSYXcgc3RyaW5nXG4gICAgKiAgICA6IFVJbnRcbiAgICAqICAgICAgICogVUludFR5cGVcbiAgICAqICAgIDogQ3JlYXRlVHlwZUhhbmRsZXIgd2hpY2ggcmVzb2x2ZXMgdG8gdGhlIFR5cGVcbiAgICAqIFxuICAgICogXG4gICAgKiBAcGFyYW0gc291cmNlIFRoZSByYXcgVHlwZSBpbmZvcm1hdGlvblxuICAgICogQHBhcmFtIGNvbnRleHQgU3RhY2sgQ29udGV4dFxuICAgICogQHJldHVybnMgVGhlIFR5cGVcbiAgICAqL1xuICAgc3RhdGljIHJlc29sdmUoc291cmNlOiBUeXBlQ3JlYXRlUGFyYW1zLCBjb250ZXh0OiBJU3RhY2tDb250ZXh0KTogSVR5cGUge1xuICAgICAgbGV0IHR5cGVzID0gbmV3IFR5cGVTb3VyY2UoY29udGV4dClcblxuICAgICAgaWYgKHR5cGVvZiBzb3VyY2UgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgIHJldHVybiBzb3VyY2UodHlwZXMpXG4gICAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoc291cmNlKSkge1xuICAgICAgICAgbGV0IGFycmF5ID0gc291cmNlIGFzIGFueVtdXG5cbiAgICAgICAgIGlmKGFycmF5Lmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEVycm9yIHJlc29sdmluZyBhIFR5cGUuIEF0IGxlYXN0IG9uZSBpdGVtIG11c3QgYmUgcHJlc2VudCBpbiB0aGUgQXJyYXkgdG8gZGV0ZXJtaW5lIHRoZSBMaXN0IEl0ZW1UeXBlIHdoZW4gcmVzb2x2aW5nICR7c291cmNlfS5gKVxuICAgICAgICAgfVxuXG4gICAgICAgICBsZXQgaXRlbVR5cGUgPSBUeXBlU291cmNlLnJlc29sdmUoYXJyYXlbMF0sIGNvbnRleHQpXG5cbiAgICAgICAgIHJldHVybiBuZXcgTGlzdFR5cGUoaXRlbVR5cGUpXG5cbiAgICAgIH0gZWxzZSBpZih0eXBlb2Ygc291cmNlID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgbGV0IG1vZGVsID0gTW9kZWwuYXNNb2RlbChzb3VyY2UpXG4gICAgICAgICBpZihtb2RlbCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IE9iamVjdFJlZlR5cGUobW9kZWwubmFtZSwgY29udGV4dClcbiAgICAgICAgIH1cblxuICAgICAgICAgaWYoIVR5cGUuaXNUeXBlKHNvdXJjZSkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgRXJyb3IgcmVzb2x2aW5nIGEgVHlwZS4gRXhwZWN0ZWQgYSBUeXBlIE9iamVjdCBidXQgcmVjZWl2ZWQgc29tZXRoaW5nIGVsc2UgaW5zdGVhZC5gKVxuICAgICAgICAgfVxuXG4gICAgICAgICByZXR1cm4gc291cmNlICAgICAgXG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiBzb3VyY2UgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICByZXR1cm4gdHlwZXMuc3RyaW5nXG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiBzb3VyY2UgPT09ICdudW1iZXInKSB7XG4gICAgICAgICByZXR1cm4gdHlwZXMuaW50XG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiBzb3VyY2UgPT09ICdib29sZWFuJykge1xuICAgICAgICAgcmV0dXJuIHR5cGVzLmJvb2xcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVuc3VwcG9ydGVkIHNvdXJjZSB3aGVuIHJlc29sdmluZyBhIHR5cGU6ICR7dHlwZW9mIHNvdXJjZX1gKVxuICAgICAgfVxuICAgfVxuXG4gICBsaXN0KGl0ZW1UeXBlOiBUeXBlQ3JlYXRlUGFyYW1zKTogSVR5cGUge1xuICAgICAgbGV0IGl0ZW0gPSBUeXBlU291cmNlLnJlc29sdmUoaXRlbVR5cGUsIHRoaXMuY29udGV4dClcbiAgICAgIHJldHVybiBuZXcgTGlzdFR5cGUoaXRlbSlcbiAgIH1cblxuICAgcmVmKG1vZGVsTmFtZTogc3RyaW5nKTogSVR5cGUge1xuICAgICAgcmV0dXJuIG5ldyBPYmplY3RSZWZUeXBlKG1vZGVsTmFtZSwgdGhpcy5jb250ZXh0KVxuICAgfVxufSJdfQ==