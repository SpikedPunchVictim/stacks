"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Member = void 0;
const Model_1 = require("./Model");
const UidKeeper_1 = require("./UidKeeper");
const ObjectRef_1 = require("./values/ObjectRef");
const TypeSource_1 = require("./values/TypeSource");
const ValueSource_1 = require("./values/ValueSource");
class Member {
    constructor(id, name, model, value, symbols) {
        this.id = id;
        this.name = name;
        this.model = model;
        this.value = value;
        this.symbols = symbols || new Array();
    }
    get type() {
        return this.value.type;
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
            if (createContext != null && createContext.model != null) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWVtYmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL01lbWJlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxtQ0FBdUU7QUFFdkUsMkNBQXVDO0FBQ3ZDLGtEQUFtRDtBQUVuRCxvREFBbUU7QUFFbkUsc0RBQXlGO0FBdUJ6RixNQUFhLE1BQU07SUFTaEIsWUFDWSxFQUFVLEVBQ1YsSUFBWSxFQUNaLEtBQWEsRUFDdEIsS0FBYSxFQUNiLE9BQXVCO1FBSmQsT0FBRSxHQUFGLEVBQUUsQ0FBUTtRQUNWLFNBQUksR0FBSixJQUFJLENBQVE7UUFDWixVQUFLLEdBQUwsS0FBSyxDQUFRO1FBSXRCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFBO1FBQ2xCLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxJQUFJLElBQUksS0FBSyxFQUFlLENBQUE7SUFDckQsQ0FBQztJQWhCRCxJQUFJLElBQUk7UUFDTCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFBO0lBQ3pCLENBQUM7SUFnQkQ7Ozs7Ozs7O09BUUc7SUFDSCxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQXlCLEVBQUUsS0FBYSxFQUFFLGFBQWlDLEVBQUUsT0FBc0I7UUFDOUcsSUFBSSxPQUFPLEdBQUcsSUFBSSxLQUFLLEVBQVcsQ0FBQTtRQUVsQyxLQUFLLElBQUksR0FBRyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDbEMsSUFBSSxLQUFLLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFBO1lBRXZCLElBQUksRUFBRSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLENBQUE7WUFFcEMsSUFBRyxhQUFhLElBQUksSUFBSSxJQUFJLGFBQWEsQ0FBQyxLQUFLLElBQUksSUFBSSxFQUFFO2dCQUN0RCxJQUFJLEtBQUssR0FBRyxhQUFhLENBQUMsS0FBSyxDQUFBO2dCQUUvQixJQUFJLEtBQUssR0FBRyxL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TSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsRUFBRTt3QkFDbEMsTUFBTSxJQUFJLEtBQUssQ0FBQyx3SEFBd0gsR0FBRyxHQUFHLENBQUMsQ0FBQTtxQkFDako7b0JBRUQsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLE1BQU0sQ0FBQyxFQUFFLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxhQUFhLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQTtpQkFDbEU7YUFDSDtpQkFDSTtnQkFDRixNQUFNLElBQUksS0FBSyxDQUFDLDRDQUE0QyxPQUFPLEtBQUssRUFBRSxDQUFDLENBQUE7YUFDN0U7U0FDSDtRQUVELE9BQU8sT0FBTyxDQUFBO0lBQ2pCLENBQUM7Q0FDSDtBQTFHRCx3QkEwR0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJTW9kZWwsIE1vZGVsLCBNb2RlbENyZWF0ZVBhcmFtcywgU3ltYm9sRW50cnkgfSBmcm9tIFwiLi9Nb2RlbFwiXG5pbXBvcnQgeyBJU3RhY2tDb250ZXh0IH0gZnJvbSBcIi4vc3RhY2svU3RhY2tDb250ZXh0XCJcbmltcG9ydCB7IFVpZEtlZXBlciB9IGZyb20gXCIuL1VpZEtlZXBlclwiXG5pbXBvcnQgeyBPYmplY3RSZWZWYWx1ZSB9IGZyb20gXCIuL3ZhbHVlcy9PYmplY3RSZWZcIlxuaW1wb3J0IHsgSVR5cGUgfSBmcm9tIFwiLi92YWx1ZXMvVHlwZVwiXG5pbXBvcnQgeyBDcmVhdGVUeXBlSGFuZGxlciwgVHlwZVNvdXJjZSB9IGZyb20gXCIuL3ZhbHVlcy9UeXBlU291cmNlXCJcbmltcG9ydCB7IElWYWx1ZSB9IGZyb20gXCIuL3ZhbHVlcy9WYWx1ZVwiXG5pbXBvcnQgeyBWYWx1ZUNyZWF0ZUNvbnRleHQsIFZhbHVlQ3JlYXRlUGFyYW1zLCBWYWx1ZVNvdXJjZSB9IGZyb20gXCIuL3ZhbHVlcy9WYWx1ZVNvdXJjZVwiXG5cbmV4cG9ydCB0eXBlIE1lbWJlckluZm8gPSB7XG4gICB0eXBlOiBJVHlwZSB8IENyZWF0ZVR5cGVIYW5kbGVyLFxuICAgdmFsdWU6IE1lbWJlclZhbHVlLFxuICAgc3ltYm9scz86IFN5bWJvbEVudHJ5W11cbn1cblxuZXhwb3J0IHR5cGUgTWVtYmVyVmFsdWUgPSBWYWx1ZUNyZWF0ZVBhcmFtcyB8IE1lbWJlckluZm9cblxuLyoqXG4gKiBUaGlzIGludGVyZmFjZSByZXByZXNlbnRzIHRoZSBkYXRhIHN0cnVjdHVyZSBzdG9yaW5nIGFuIGluZGl2aWR1YWxcbiAqIE1lbWJlciBpbiBhIE1vZGVsXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSU1lbWJlciB7XG4gICByZWFkb25seSBpZDogc3RyaW5nXG4gICByZWFkb25seSBtb2RlbDogSU1vZGVsXG4gICByZWFkb25seSB0eXBlOiBJVHlwZVxuICAgbmFtZTogc3RyaW5nXG4gICBzeW1ib2xzOiBTeW1ib2xFbnRyeVtdXG4gICB2YWx1ZTogSVZhbHVlXG59XG5cbmV4cG9ydCBjbGFzcyBNZW1iZXIgaW1wbGVtZW50cyBJTWVtYmVyIHtcblxuICAgZ2V0IHR5cGUoKTogSVR5cGUge1xuICAgICAgcmV0dXJuIHRoaXMudmFsdWUudHlwZVxuICAgfVxuXG4gICBzeW1ib2xzOiBTeW1ib2xFbnRyeVtdXG4gICB2YWx1ZTogSVZhbHVlXG5cbiAgIGNvbnN0cnVjdG9yKFxuICAgICAgcmVhZG9ubHkgaWQ6IHN0cmluZyxcbiAgICAgIHJlYWRvbmx5IG5hbWU6IHN0cmluZyxcbiAgICAgIHJlYWRvbmx5IG1vZGVsOiBJTW9kZWwsXG4gICAgICB2YWx1ZTogSVZhbHVlLFxuICAgICAgc3ltYm9scz86IFN5bWJvbEVudHJ5W11cbiAgICkge1xuICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlXG4gICAgICB0aGlzLnN5bWJvbHMgPSBzeW1ib2xzIHx8IG5ldyBBcnJheTxTeW1ib2xFbnRyeT4oKVxuICAgfVxuXG4gICAvKipcbiAgICAqIENyZWF0ZXMgYW4gQXJyYXkgb2YgTWVtYmVycyBmcm9tIHRoZSBNb2RlbENyZWF0ZSBQYXJhbWV0ZXJzXG4gICAgKiBcbiAgICAqIEBwYXJhbSBwYXJhbXMgVGhlIE1vZGVsQ3JlYXRlIHBhcmFtZXRlcnNcbiAgICAqIEBwYXJhbSBtb2RlbCBUaGUgUGFyZW50IE1vZGVsXG4gICAgKiBAcGFyYW0gY3JlYXRlQ29udGV4dCBUaGUgVmFsdWVDcmVhdGVDb250ZXh0XG4gICAgKiBAcGFyYW0gY29udGV4dCBUaGUgU3RhY2tDb250ZXh0XG4gICAgKiBAcmV0dXJucyBBbiBBcnJheSBvZiBNZW1iZXJzIGJhc2VkIG9uIHRoZSBNb2RlbENyZWF0ZVxuICAgICovXG4gICBzdGF0aWMgY3JlYXRlKHBhcmFtczogTW9kZWxDcmVhdGVQYXJhbXMsIG1vZGVsOiBJTW9kZWwsIGNyZWF0ZUNvbnRleHQ6IFZhbHVlQ3JlYXRlQ29udGV4dCwgY29udGV4dDogSVN0YWNrQ29udGV4dCk6IElNZW1iZXJbXSB7XG4gICAgICBsZXQgcmVzdWx0cyA9IG5ldyBBcnJheTxJTWVtYmVyPigpXG5cbiAgICAgIGZvciAobGV0IGtleSBvZiBPYmplY3Qua2V5cyhwYXJhbXMpKSB7XG4gICAgICAgICBsZXQgdmFsdWUgPSBwYXJhbXNba2V5XVxuXG4gICAgICAgICBsZXQgaWQgPSBjb250ZXh0LnVpZC5nZW5lcmF0ZUxvY2FsKClcblxuICAgICAgICAgaWYoY3JlYXRlQ29udGV4dCAhPSBudWxsICYmIGNyZWF0ZUNvbnRleHQubW9kZWwgIT0gbnVsbCkge1xuICAgICAgICAgICAgbGV0IG1vZGVsID0gY3JlYXRlQ29udGV4dC5tb2RlbFxuICAgICAgICAgICAgXG4gICAgICAgICAgICBsZXQgZm91bmQgPSBtb2RlbC5tZW1iZXJzLmZpbmQobSA9PiBtLmlkID09PSBpZClcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgd2hpbGUoZm91bmQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgaWQgPSBjb250ZXh0LnVpZC5nZW5lcmF0ZUxvY2FsKClcbiAgICAgICAgICAgICAgIGZvdW5kID0gbW9kZWwubWVtYmVycy5maW5kKG0gPT4gbS5pZCA9PT0gaWQpXG4gICAgICAgICAgICB9XG4gICAgICAgICB9XG5cbiAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGxldCByZXNvbHZlZFZhbHVlID0gVmFsdWVTb3VyY2UucmVzb2x2ZSh2YWx1ZSwgY29udGV4dCwgY3JlYXRlQ29udGV4dClcbiAgICAgICAgICAgIHJlc3VsdHMucHVzaChuZXcgTWVtYmVyKGlkLCBrZXksIG1vZGVsLCByZXNvbHZlZFZhbHVlKSlcbiAgICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnIHx8XG4gICAgICAgICAgICB0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInIHx8XG4gICAgICAgICAgICB0eXBlb2YgdmFsdWUgPT09ICdib29sZWFuJyB8fFxuICAgICAgICAgICAgQXJyYXkuaXNBcnJheSh2YWx1ZSlcbiAgICAgICAgICkge1xuICAgICAgICAgICAgbGV0IHJlc29sdmVkVmFsdWUgPSBWYWx1ZVNvdXJjZS5yZXNvbHZlKHZhbHVlLCBjb250ZXh0KVxuICAgICAgICAgICAgcmVzdWx0cy5wdXNoKG5ldyBNZW1iZXIoaWQsIGtleSwgbW9kZWwsIHJlc29sdmVkVmFsdWUpKVxuICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgICAgQXMgYW4gT2JqZWN0LCBpdCBjYW4gYmUgZWl0aGVyOlxuICAgICAgICAgICAgICAgICAgKiBNb2RlbCwgd2hpY2ggd291bGQgY3JlYXRlIGEgcmVmZXJlbmNlIFZhbHVlXG4gICAgICAgICAgICAgICAgICAqIE1lbWJlckluZm8sIHdoaWNoIGRldGFpbHMgb3V0IHRoZSB0eXBlIGluZm9ybWF0aW9uXG4gICAgICAgICAgICAqL1xuXG4gICAgICAgICAgICBsZXQgY2FzdE1vZGVsID0gTW9kZWwuYXNNb2RlbCh2YWx1ZSlcblxuICAgICAgICAgICAgaWYoY2FzdE1vZGVsICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgIGxldCByZWZWYWx1ZSA9IG5ldyBPYmplY3RSZWZWYWx1ZShjYXN0TW9kZWwubmFtZSwgVWlkS2VlcGVyLklkTm90U2V0LCBjb250ZXh0KVxuICAgICAgICAgICAgICAgcmVzdWx0cy5wdXNoKG5ldyBNZW1iZXIoaWQsIGtleSwgbW9kZWwsIHJlZlZhbHVlKSlcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICBpZiAodmFsdWUudHlwZSA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEVuY291bnRlcmVkIGFuIGVycm9yIHdoZW4gYnVpbGRpbmcgYSBNb2RlbC4gRmFpbGVkIHRvIGRldGVybWluZSB0aGUgVHlwZSBmb3IgJHtrZXl9LiBFbnN1cmUgJ3R5cGUnIGlzIHByb3ZpZGVkIHdoZW4gY3JlYXRpbmcgdGhlIE1vZGVsLmApXG4gICAgICAgICAgICAgICB9XG4gICBcbiAgICAgICAgICAgICAgIGlmICh2YWx1ZS52YWx1ZSA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEVuY291bnRlcmVkIGFuIGVycm9yIHdoZW4gYnVpbGRpbmcgYSBNb2RlbC4gRmFpbGVkIHRvIGRldGVybWluZSB0aGUgVmFsdWUgZm9yICR7a2V5fS4gRW5zdXJlICd2YWx1ZScgaXMgcHJvdmlkZWQgd2hlbiBjcmVhdGluZyB0aGUgTW9kZWwuYClcbiAgICAgICAgICAgICAgIH1cbiAgIFxuICAgICAgICAgICAgICAgaWYodHlwZW9mIHZhbHVlLnR5cGUgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgRW5jb3VudGVyZWQgYW4gZXJyb3Igd2hlbiBidWlsZGluZyBhIE1vZGVsLiBFeHBlY3RlZCAndHlwZScgdG8gYmUgYSBmdW5jdGlvbiBmb3IgJHtrZXl9LiBSZWNlaXZlZCBhICR7dHlwZW9mIHZhbHVlLnR5cGV9IGluc3RlYWQuYClcbiAgICAgICAgICAgICAgIH1cbiAgIFxuICAgICAgICAgICAgICAgbGV0IHR5cGVzID0gbmV3IFR5cGVTb3VyY2UoY29udGV4dClcbiAgICAgICAgICAgICAgIGxldCB0eXBlID0gdmFsdWUudHlwZSh0eXBlcylcbiAgIFxuICAgICAgICAgICAgICAgbGV0IHN1YlJlc29sdmU6IEV4Y2x1ZGU8TWVtYmVyVmFsdWUsIE1lbWJlckluZm8+ID0gdmFsdWUudmFsdWUgYXMgRXhjbHVkZTxNZW1iZXJWYWx1ZSwgTWVtYmVySW5mbz5cbiAgIFxuICAgICAgICAgICAgICAgbGV0IHJlc29sdmVkVmFsdWUgPSBWYWx1ZVNvdXJjZS5yZXNvbHZlKHN1YlJlc29sdmUsIGNvbnRleHQsIGNyZWF0ZUNvbnRleHQsIHR5cGUpXG4gICAgICAgICAgICAgICBsZXQgc3ltYm9scyA9IHZhbHVlLnN5bWJvbHMgfHwgbmV3IEFycmF5PFN5bWJvbEVudHJ5PigpXG4gICBcbiAgICAgICAgICAgICAgIGlmKCF0eXBlLmVxdWFscyhyZXNvbHZlZFZhbHVlLnR5cGUpKSB7XG4gICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEVuY291bnRlcmVkIGFuIGVycm9yIHdoZW4gZGV0ZXJtaW5pbmcgYSBNb2RlbCdzIHR5cGUuIFRoZSBkZWZhdWx0IHZhbHVlcyBwcm92aWRlZCBkbyBub3QgbWF0Y2ggdGhlIHR5cGUgcHJvdmlkZWQgZm9yICR7a2V5fS5gKVxuICAgICAgICAgICAgICAgfVxuICAgXG4gICAgICAgICAgICAgICByZXN1bHRzLnB1c2gobmV3IE1lbWJlcihpZCwga2V5LCBtb2RlbCwgcmVzb2x2ZWRWYWx1ZSwgc3ltYm9scykpXG4gICAgICAgICAgICB9XG4gICAgICAgICB9XG4gICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5zdXBwb3J0ZWQgdmFsdWUgd2hlbiByZXNvbHZpbmcgYSB0eXBlOiAke3R5cGVvZiB2YWx1ZX1gKVxuICAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzdWx0c1xuICAgfVxufSJdfQ==