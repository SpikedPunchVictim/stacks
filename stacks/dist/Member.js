"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Member = void 0;
const Model_1 = require("./Model");
const UidKeeper_1 = require("./UidKeeper");
const ObjectRef_1 = require("./values/ObjectRef");
const TypeSource_1 = require("./values/TypeSource");
const ValueSource_1 = require("./values/ValueSource");
class Member {
    get type() {
        return this.value.type;
    }
    constructor(id, name, model, value, symbols) {
        this.id = id;
        this.name = name;
        this.model = model;
        this.value = value;
        this.symbols = symbols || new Array();
    }
    /**
     * Creates an Array of Members from the ModelCreate Parameters
     *
     * @param params The ModelCreate parameters
     * @param model The Parent Model
     * @param createContext The ValueCreateContext
     * @param context The StackContext
     * @returns An Array of Members based on the ModelCreate
     */
    static create(params, model, createContext, context) {
        let results = new Array();
        for (let key of Object.keys(params)) {
            let value = params[key];
            let id = context.uid.generateLocal();
            if ((createContext === null || createContext === void 0 ? void 0 : createContext.model) != null) {
                let model = createContext.model;
                let found = model.members.find(m => m.id === id);
                while (found !== undefined) {
                    id = context.uid.generateLocal();
                    found = model.members.find(m => m.id === id);
                }
            }
            if (typeof value === 'function') {
                let resolvedValue = ValueSource_1.ValueSource.resolve(value, context, createContext);
                results.push(new Member(id, key, model, resolvedValue));
            }
            else if (typeof value === 'string' ||
                typeof value === 'number' ||
                typeof value === 'boolean' ||
                Array.isArray(value)) {
                let resolvedValue = ValueSource_1.ValueSource.resolve(value, context);
                results.push(new Member(id, key, model, resolvedValue));
            }
            else if (typeof value === 'object') {
                /*
                   As an Object, it can be either:
                      * Model, which would create a reference Value
                      * MemberInfo, which details out the type information
                */
                let castModel = Model_1.Model.asModel(value);
                if (castModel !== undefined) {
                    let refValue = new ObjectRef_1.ObjectRefValue(castModel.name, UidKeeper_1.UidKeeper.IdNotSet, context);
                    results.push(new Member(id, key, model, refValue));
                }
                else {
                    if (value.type == null) {
                        throw new Error(`Encountered an error when building a Model. Failed to determine the Type for ${key}. Ensure 'type' is provided when creating the Model.`);
                    }
                    if (value.value == null) {
                        throw new Error(`Encountered an error when building a Model. Failed to determine the Value for ${key}. Ensure 'value' is provided when creating the Model.`);
                    }
                    if (typeof value.type !== 'function') {
                        throw new Error(`Encountered an error when building a Model. Expected 'type' to be a function for ${key}. Received a ${typeof value.type} instead.`);
                    }
                    let types = new TypeSource_1.TypeSource(context);
                    let type = value.type(types);
                    let subResolve = value.value;
                    let resolvedValue = ValueSource_1.ValueSource.resolve(subResolve, context, createContext, type);
                    let symbols = value.symbols || new Array();
                    if (!type.equals(resolvedValue.type)) {
                        throw new Error(`Encountered an error when determining a Model's type. The default values provided do not match the type provided for ${key}.`);
                    }
                    results.push(new Member(id, key, model, resolvedValue, symbols));
                }
            }
            else {
                throw new Error(`Unsupported value when resolving a type: ${typeof value}`);
            }
        }
        return results;
    }
}
exports.Member = Member;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWVtYmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL01lbWJlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxtQ0FBdUU7QUFFdkUsMkNBQXVDO0FBQ3ZDLGtEQUFtRDtBQUVuRCxvREFBbUU7QUFFbkUsc0RBQXlGO0FBdUJ6RixNQUFhLE1BQU07SUFFaEIsSUFBSSxJQUFJO1FBQ0wsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQTtJQUN6QixDQUFDO0lBS0QsWUFDWSxFQUFVLEVBQ1YsSUFBWSxFQUNaLEtBQWEsRUFDdEIsS0FBYSxFQUNiLE9BQXVCO1FBSmQsT0FBRSxHQUFGLEVBQUUsQ0FBUTtRQUNWLFNBQUksR0FBSixJQUFJLENBQVE7UUFDWixVQUFLLEdBQUwsS0FBSyxDQUFRO1FBSXRCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFBO1FBQ2xCLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxJQUFJLElBQUksS0FBSyxFQUFlLENBQUE7SUFDckQsQ0FBQztJQUVEOzs7Ozs7OztPQVFHO0lBQ0gsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUF5QixFQUFFLEtBQWEsRUFBRSxhQUFpQyxFQUFFLE9BQXNCO1FBQzlHLElBQUksT0FBTyxHQUFHLElBQUksS0FBSyxFQUFXLENBQUE7UUFFbEMsS0FBSyxJQUFJLEdBQUcsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUM7WUFDbkMsSUFBSSxLQUFLLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFBO1lBRXZCLElBQUksRUFBRSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLENBQUE7WUFFcEMsSUFBRyxDQUFBLGFBQWEsYUFBYixhQUFhLHVCQUFiLGFBQWEsQ0FBRSxLQUFLLEtBQUksSUFBSSxFQUFFLENBQUM7Z0JBQy9CLElBQUksS0FBSyxHQUFHLGFBQWEsQ0FBQyxLQUFLLENBQUE7Z0JBRS9CLElB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QyxDQUFBO29CQUNqRixJQUFJLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxJQUFJLElBQUksS0FBSyxFQUFlLENBQUE7b0JBRXZELElBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO3dCQUNuQyxNQUFNLElBQUksS0FBSyxDQUFDLHdIQUF3SCxHQUFHLEdBQUcsQ0FBQyxDQUFBO29CQUNsSixDQUFDO29CQUVELE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxNQUFNLENBQUMsRUFBRSxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsYUFBYSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUE7Z0JBQ25FLENBQUM7WUFDSixDQUFDO2lCQUNJLENBQUM7Z0JBQ0gsTUFBTSxJQUFJLEtBQUssQ0FBQyw0Q0FBNEMsT0FBTyxLQUFLLEVBQUUsQ0FBQyxDQUFBO1lBQzlFLENBQUM7UUFDSixDQUFDO1FBRUQsT0FBTyxPQUFPLENBQUE7SUFDakIsQ0FBQztDQUNIO0FBMUdELHdCQTBHQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElNb2RlbCwgTW9kZWwsIE1vZGVsQ3JlYXRlUGFyYW1zLCBTeW1ib2xFbnRyeSB9IGZyb20gXCIuL01vZGVsXCJcbmltcG9ydCB7IElTdGFja0NvbnRleHQgfSBmcm9tIFwiLi9zdGFjay9TdGFja0NvbnRleHRcIlxuaW1wb3J0IHsgVWlkS2VlcGVyIH0gZnJvbSBcIi4vVWlkS2VlcGVyXCJcbmltcG9ydCB7IE9iamVjdFJlZlZhbHVlIH0gZnJvbSBcIi4vdmFsdWVzL09iamVjdFJlZlwiXG5pbXBvcnQgeyBJVHlwZSB9IGZyb20gXCIuL3ZhbHVlcy9UeXBlXCJcbmltcG9ydCB7IENyZWF0ZVR5cGVIYW5kbGVyLCBUeXBlU291cmNlIH0gZnJvbSBcIi4vdmFsdWVzL1R5cGVTb3VyY2VcIlxuaW1wb3J0IHsgSVZhbHVlIH0gZnJvbSBcIi4vdmFsdWVzL1ZhbHVlXCJcbmltcG9ydCB7IFZhbHVlQ3JlYXRlQ29udGV4dCwgVmFsdWVDcmVhdGVQYXJhbXMsIFZhbHVlU291cmNlIH0gZnJvbSBcIi4vdmFsdWVzL1ZhbHVlU291cmNlXCJcblxuZXhwb3J0IHR5cGUgTWVtYmVySW5mbyA9IHtcbiAgIHR5cGU6IElUeXBlIHwgQ3JlYXRlVHlwZUhhbmRsZXIsXG4gICB2YWx1ZTogTWVtYmVyVmFsdWUsXG4gICBzeW1ib2xzPzogU3ltYm9sRW50cnlbXVxufVxuXG5leHBvcnQgdHlwZSBNZW1iZXJWYWx1ZSA9IFZhbHVlQ3JlYXRlUGFyYW1zIHwgTWVtYmVySW5mb1xuXG4vKipcbiAqIFRoaXMgaW50ZXJmYWNlIHJlcHJlc2VudHMgdGhlIGRhdGEgc3RydWN0dXJlIHN0b3JpbmcgYW4gaW5kaXZpZHVhbFxuICogTWVtYmVyIGluIGEgTW9kZWxcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJTWVtYmVyIHtcbiAgIHJlYWRvbmx5IGlkOiBzdHJpbmdcbiAgIHJlYWRvbmx5IG1vZGVsOiBJTW9kZWxcbiAgIHJlYWRvbmx5IHR5cGU6IElUeXBlXG4gICBuYW1lOiBzdHJpbmdcbiAgIHN5bWJvbHM6IFN5bWJvbEVudHJ5W11cbiAgIHZhbHVlOiBJVmFsdWVcbn1cblxuZXhwb3J0IGNsYXNzIE1lbWJlciBpbXBsZW1lbnRzIElNZW1iZXIge1xuXG4gICBnZXQgdHlwZSgpOiBJVHlwZSB7XG4gICAgICByZXR1cm4gdGhpcy52YWx1ZS50eXBlXG4gICB9XG5cbiAgIHN5bWJvbHM6IFN5bWJvbEVudHJ5W11cbiAgIHZhbHVlOiBJVmFsdWVcblxuICAgY29uc3RydWN0b3IoXG4gICAgICByZWFkb25seSBpZDogc3RyaW5nLFxuICAgICAgcmVhZG9ubHkgbmFtZTogc3RyaW5nLFxuICAgICAgcmVhZG9ubHkgbW9kZWw6IElNb2RlbCxcbiAgICAgIHZhbHVlOiBJVmFsdWUsXG4gICAgICBzeW1ib2xzPzogU3ltYm9sRW50cnlbXVxuICAgKSB7XG4gICAgICB0aGlzLnZhbHVlID0gdmFsdWVcbiAgICAgIHRoaXMuc3ltYm9scyA9IHN5bWJvbHMgfHwgbmV3IEFycmF5PFN5bWJvbEVudHJ5PigpXG4gICB9XG5cbiAgIC8qKlxuICAgICogQ3JlYXRlcyBhbiBBcnJheSBvZiBNZW1iZXJzIGZyb20gdGhlIE1vZGVsQ3JlYXRlIFBhcmFtZXRlcnNcbiAgICAqIFxuICAgICogQHBhcmFtIHBhcmFtcyBUaGUgTW9kZWxDcmVhdGUgcGFyYW1ldGVyc1xuICAgICogQHBhcmFtIG1vZGVsIFRoZSBQYXJlbnQgTW9kZWxcbiAgICAqIEBwYXJhbSBjcmVhdGVDb250ZXh0IFRoZSBWYWx1ZUNyZWF0ZUNvbnRleHRcbiAgICAqIEBwYXJhbSBjb250ZXh0IFRoZSBTdGFja0NvbnRleHRcbiAgICAqIEByZXR1cm5zIEFuIEFycmF5IG9mIE1lbWJlcnMgYmFzZWQgb24gdGhlIE1vZGVsQ3JlYXRlXG4gICAgKi9cbiAgIHN0YXRpYyBjcmVhdGUocGFyYW1zOiBNb2RlbENyZWF0ZVBhcmFtcywgbW9kZWw6IElNb2RlbCwgY3JlYXRlQ29udGV4dDogVmFsdWVDcmVhdGVDb250ZXh0LCBjb250ZXh0OiBJU3RhY2tDb250ZXh0KTogSU1lbWJlcltdIHtcbiAgICAgIGxldCByZXN1bHRzID0gbmV3IEFycmF5PElNZW1iZXI+KClcblxuICAgICAgZm9yIChsZXQga2V5IG9mIE9iamVjdC5rZXlzKHBhcmFtcykpIHtcbiAgICAgICAgIGxldCB2YWx1ZSA9IHBhcmFtc1trZXldXG5cbiAgICAgICAgIGxldCBpZCA9IGNvbnRleHQudWlkLmdlbmVyYXRlTG9jYWwoKVxuXG4gICAgICAgICBpZihjcmVhdGVDb250ZXh0Py5tb2RlbCAhPSBudWxsKSB7XG4gICAgICAgICAgICBsZXQgbW9kZWwgPSBjcmVhdGVDb250ZXh0Lm1vZGVsXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGxldCBmb3VuZCA9IG1vZGVsLm1lbWJlcnMuZmluZChtID0+IG0uaWQgPT09IGlkKVxuICAgICAgICAgICAgXG4gICAgICAgICAgICB3aGlsZShmb3VuZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICBpZCA9IGNvbnRleHQudWlkLmdlbmVyYXRlTG9jYWwoKVxuICAgICAgICAgICAgICAgZm91bmQgPSBtb2RlbC5tZW1iZXJzLmZpbmQobSA9PiBtLmlkID09PSBpZClcbiAgICAgICAgICAgIH1cbiAgICAgICAgIH1cblxuICAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgbGV0IHJlc29sdmVkVmFsdWUgPSBWYWx1ZVNvdXJjZS5yZXNvbHZlKHZhbHVlLCBjb250ZXh0LCBjcmVhdGVDb250ZXh0KVxuICAgICAgICAgICAgcmVzdWx0cy5wdXNoKG5ldyBNZW1iZXIoaWQsIGtleSwgbW9kZWwsIHJlc29sdmVkVmFsdWUpKVxuICAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICAgIHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgfHxcbiAgICAgICAgICAgIHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgfHxcbiAgICAgICAgICAgIHR5cGVvZiB2YWx1ZSA9PT0gJ2Jvb2xlYW4nIHx8XG4gICAgICAgICAgICBBcnJheS5pc0FycmF5KHZhbHVlKVxuICAgICAgICAgKSB7XG4gICAgICAgICAgICBsZXQgcmVzb2x2ZWRWYWx1ZSA9IFZhbHVlU291cmNlLnJlc29sdmUodmFsdWUsIGNvbnRleHQpXG4gICAgICAgICAgICByZXN1bHRzLnB1c2gobmV3IE1lbWJlcihpZCwga2V5LCBtb2RlbCwgcmVzb2x2ZWRWYWx1ZSkpXG4gICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgICBBcyBhbiBPYmplY3QsIGl0IGNhbiBiZSBlaXRoZXI6XG4gICAgICAgICAgICAgICAgICAqIE1vZGVsLCB3aGljaCB3b3VsZCBjcmVhdGUgYSByZWZlcmVuY2UgVmFsdWVcbiAgICAgICAgICAgICAgICAgICogTWVtYmVySW5mbywgd2hpY2ggZGV0YWlscyBvdXQgdGhlIHR5cGUgaW5mb3JtYXRpb25cbiAgICAgICAgICAgICovXG5cbiAgICAgICAgICAgIGxldCBjYXN0TW9kZWwgPSBNb2RlbC5hc01vZGVsKHZhbHVlKVxuXG4gICAgICAgICAgICBpZihjYXN0TW9kZWwgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgbGV0IHJlZlZhbHVlID0gbmV3IE9iamVjdFJlZlZhbHVlKGNhc3RNb2RlbC5uYW1lLCBVaWRLZWVwZXIuSWROb3RTZXQsIGNvbnRleHQpXG4gICAgICAgICAgICAgICByZXN1bHRzLnB1c2gobmV3IE1lbWJlcihpZCwga2V5LCBtb2RlbCwgcmVmVmFsdWUpKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgIGlmICh2YWx1ZS50eXBlID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgRW5jb3VudGVyZWQgYW4gZXJyb3Igd2hlbiBidWlsZGluZyBhIE1vZGVsLiBGYWlsZWQgdG8gZGV0ZXJtaW5lIHRoZSBUeXBlIGZvciAke2tleX0uIEVuc3VyZSAndHlwZScgaXMgcHJvdmlkZWQgd2hlbiBjcmVhdGluZyB0aGUgTW9kZWwuYClcbiAgICAgICAgICAgICAgIH1cbiAgIFxuICAgICAgICAgICAgICAgaWYgKHZhbHVlLnZhbHVlID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgRW5jb3VudGVyZWQgYW4gZXJyb3Igd2hlbiBidWlsZGluZyBhIE1vZGVsLiBGYWlsZWQgdG8gZGV0ZXJtaW5lIHRoZSBWYWx1ZSBmb3IgJHtrZXl9LiBFbnN1cmUgJ3ZhbHVlJyBpcyBwcm92aWRlZCB3aGVuIGNyZWF0aW5nIHRoZSBNb2RlbC5gKVxuICAgICAgICAgICAgICAgfVxuICAgXG4gICAgICAgICAgICAgICBpZih0eXBlb2YgdmFsdWUudHlwZSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBFbmNvdW50ZXJlZCBhbiBlcnJvciB3aGVuIGJ1aWxkaW5nIGEgTW9kZWwuIEV4cGVjdGVkICd0eXBlJyB0byBiZSBhIGZ1bmN0aW9uIGZvciAke2tleX0uIFJlY2VpdmVkIGEgJHt0eXBlb2YgdmFsdWUudHlwZX0gaW5zdGVhZC5gKVxuICAgICAgICAgICAgICAgfVxuICAgXG4gICAgICAgICAgICAgICBsZXQgdHlwZXMgPSBuZXcgVHlwZVNvdXJjZShjb250ZXh0KVxuICAgICAgICAgICAgICAgbGV0IHR5cGUgPSB2YWx1ZS50eXBlKHR5cGVzKVxuICAgXG4gICAgICAgICAgICAgICBsZXQgc3ViUmVzb2x2ZTogRXhjbHVkZTxNZW1iZXJWYWx1ZSwgTWVtYmVySW5mbz4gPSB2YWx1ZS52YWx1ZSBhcyBFeGNsdWRlPE1lbWJlclZhbHVlLCBNZW1iZXJJbmZvPlxuICAgXG4gICAgICAgICAgICAgICBsZXQgcmVzb2x2ZWRWYWx1ZSA9IFZhbHVlU291cmNlLnJlc29sdmUoc3ViUmVzb2x2ZSwgY29udGV4dCwgY3JlYXRlQ29udGV4dCwgdHlwZSlcbiAgICAgICAgICAgICAgIGxldCBzeW1ib2xzID0gdmFsdWUuc3ltYm9scyB8fCBuZXcgQXJyYXk8U3ltYm9sRW50cnk+KClcbiAgIFxuICAgICAgICAgICAgICAgaWYoIXR5cGUuZXF1YWxzKHJlc29sdmVkVmFsdWUudHlwZSkpIHtcbiAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgRW5jb3VudGVyZWQgYW4gZXJyb3Igd2hlbiBkZXRlcm1pbmluZyBhIE1vZGVsJ3MgdHlwZS4gVGhlIGRlZmF1bHQgdmFsdWVzIHByb3ZpZGVkIGRvIG5vdCBtYXRjaCB0aGUgdHlwZSBwcm92aWRlZCBmb3IgJHtrZXl9LmApXG4gICAgICAgICAgICAgICB9XG4gICBcbiAgICAgICAgICAgICAgIHJlc3VsdHMucHVzaChuZXcgTWVtYmVyKGlkLCBrZXksIG1vZGVsLCByZXNvbHZlZFZhbHVlLCBzeW1ib2xzKSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgIH1cbiAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbnN1cHBvcnRlZCB2YWx1ZSB3aGVuIHJlc29sdmluZyBhIHR5cGU6ICR7dHlwZW9mIHZhbHVlfWApXG4gICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXN1bHRzXG4gICB9XG59Il19