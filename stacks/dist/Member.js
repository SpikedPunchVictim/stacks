"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Member = void 0;
const TypeSource_1 = require("./values/TypeSource");
const ValueSource_1 = require("./values/ValueSource");
class Member {
    constructor(id, name, value, symbols) {
        this.id = id;
        this.name = name;
        this.value = value;
        this.symbols = symbols || new Array();
    }
    get type() {
        return this.value.type;
    }
    /**
     * Creates an Array of Members from the ModelCreate Parameters
     *
     * @param obj The ModelCreate parameters
     * @param createContext The ValueCreateContext
     * @param context The StackContext
     * @returns An Array of Members based on the ModelCreate
     */
    static create(obj, createContext, context) {
        let results = new Array();
        for (let key of Object.keys(obj)) {
            let value = obj[key];
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
                results.push(new Member(id, key, resolvedValue));
            }
            else if (typeof value === 'string' ||
                typeof value === 'number' ||
                typeof value === 'boolean' ||
                Array.isArray(value)) {
                let resolvedValue = ValueSource_1.ValueSource.resolve(value, context);
                results.push(new Member(id, key, resolvedValue));
            }
            else if (typeof value === 'object') {
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
                results.push(new Member(id, key, resolvedValue, symbols));
            }
            else {
                throw new Error(`Unsupported value when resolving a type: ${typeof value}`);
            }
        }
        return results;
    }
}
exports.Member = Member;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWVtYmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL01lbWJlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFHQSxvREFBbUU7QUFFbkUsc0RBQXlGO0FBc0J6RixNQUFhLE1BQU07SUFTaEIsWUFDWSxFQUFVLEVBQ1YsSUFBWSxFQUNyQixLQUFhLEVBQ2IsT0FBdUI7UUFIZCxPQUFFLEdBQUYsRUFBRSxDQUFRO1FBQ1YsU0FBSSxHQUFKLElBQUksQ0FBUTtRQUlyQixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQTtRQUNsQixJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sSUFBSSxJQUFJLEtBQUssRUFBZSxDQUFBO0lBQ3JELENBQUM7SUFmRCxJQUFJLElBQUk7UUFDTCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFBO0lBQ3pCLENBQUM7SUFlRDs7Ozs7OztPQU9HO0lBQ0gsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFzQixFQUFFLGFBQWlDLEVBQUUsT0FBc0I7UUFDNUYsSUFBSSxPQUFPLEdBQUcsSUFBSSxLQUFLLEVBQVcsQ0FBQTtRQUVsQyxLQUFLLElBQUksR0FBRyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDL0IsSUFBSSxLQUFLLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFBO1lBRXBCLElBQUksRUFBRSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLENBQUE7WUFFcEMsSUFBRyxhQUFhLElBQUksSUFBSSxJQUFJLGFBQWEsQ0FBQyxLQUFLLElBQUksSUFBSSxFQUFFO2dCQUN0RCxJQUFJLEtBQUssR0FBRyxhQUFhLENBQUMsS0FBSyxDQUFBO2dCQUUvQixJQUFJLEtBQUssR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUE7Z0JBRWhELE9BQU0sS0FBSyxLQUFLLFNBQVMsRUFBRTtvQkFDeEIsRUFBRSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLENBQUE7b0JBQ2hDLEtBQUssR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUE7aUJBQzlDO2FBQ0g7WUFFRCxJQUFJLE9BQU8sS0FBSyxLQUFLLFVBQVUsRUFBRTtnQkFDOUIsSUFBSSxhQUFhLEdBQUcseUJBQVcsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxhQUFhLENBQUMsQ0FBQTtnQkFDdEUsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLE1BQU0sQ0FBQyxFQUFFLEVBQUUsR0FBRyxFQUFFLGFBQWEsQ0FBQyxDQUFDLENBQUE7YUFDbEQ7aUJBQU0sSUFDSixPQUFPLEtBQUssS0FBSyxRQUFRO2dCQUN6QixPQUFPLEtBQUssS0FBSyxRQUFRO2dCQUN6QixPQUFPLEtBQUssS0FBSyxTQUFTO2dCQUMxQixLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUNyQjtnQkFDQyxJQUFJLGFBQWEsR0FBRyx5QkFBVyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUE7Z0JBQ3ZELE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxNQUFNLENBQUMsRUFBRSxFQUFFLEdBQUcsRUFBRSxhQUFhLENBQUMsQ0FBQyxDQUFBO2FBQ2xEO2lCQUFNLElBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxFQUFFO2dCQUNuQyxJQUFJLEtBQUssQ0FBQyxJQUFJLElBQUksSUFBSSxFQUFFO29CQUNyQixNQUFNLElBQUksS0FBSyxDQUFDLGdGQUFnRixHQUFHLHNEQUFzRCxDQUFDLENBQUE7aUJBQzVKO2dCQUVELElBQUksS0FBSyxDQUFDLEtBQUssSUFBSSxJQUFJLEVBQUU7b0JBQ3RCLE1BQU0sSUFBSSxLQUFLLENBQUMsaUZBQWlGLEdBQUcsdURBQXVELENBQUMsQ0FBQTtpQkFDOUo7Z0JBRUQsSUFBRyxPQUFPLEtBQUssQ0FBQyxJQUFJLEtBQUssVUFBVSxFQUFFO29CQUNsQyxNQUFNLElBQUksS0FBSyxDQUFDLG9GQUFvRixHQUFHLGdCQUFnQixPQUFPLEtBQUssQ0FBQyxJQUFJLFdBQVcsQ0FBQyxDQUFBO2lCQUN0SjtnQkFFRCxJQUFJLEtBQUssR0FBRyxJQUFJLHVCQUFVLENBQUMsT0FBTyxDQUFDLENBQUE7Z0JBQ25DLElBQUksSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7Z0JBRTVCLElBQUksVUFBVSxHQUFxQyxLQUFLLENBQUMsS0FBeUMsQ0FBQTtnQkFFbEcsSUFBSSxhQUFhLEdBQUcseUJBQVcsQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLE9BQU8sRUFBRSxhQUFhLEVBQUUsSUFBSSxDQUFDLENBQUE7Z0JBQ2pGLElBQUksT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLElBQUksSUFBSSxLQUFLLEVBQWUsQ0FBQTtnQkFFdkQsSUFBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxFQUFFO29CQUNsQyxNQUFNLElBQUksS0FBSyxDQUFDLHdIQUF3SCxHQUFHLEdBQUcsQ0FBQyxDQUFBO2lCQUNqSjtnQkFFRCxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksTUFBTSxDQUFDLEVBQUUsRUFBRSxHQUFHLEVBQUUsYUFBYSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUE7YUFDM0Q7aUJBQ0k7Z0JBQ0YsTUFBTSxJQUFJLEtBQUssQ0FBQyw0Q0FBNEMsT0FBTyxLQUFLLEVBQUUsQ0FBQyxDQUFBO2FBQzdFO1NBQ0g7UUFFRCxPQUFPLE9BQU8sQ0FBQTtJQUNqQixDQUFDO0NBQ0g7QUEzRkQsd0JBMkZDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTW9kZWxDcmVhdGVQYXJhbXMsIFN5bWJvbEVudHJ5IH0gZnJvbSBcIi4vTW9kZWxcIlxuaW1wb3J0IHsgSVN0YWNrQ29udGV4dCB9IGZyb20gXCIuL3N0YWNrL1N0YWNrQ29udGV4dFwiXG5pbXBvcnQgeyBJVHlwZSB9IGZyb20gXCIuL3ZhbHVlcy9UeXBlXCJcbmltcG9ydCB7IENyZWF0ZVR5cGVIYW5kbGVyLCBUeXBlU291cmNlIH0gZnJvbSBcIi4vdmFsdWVzL1R5cGVTb3VyY2VcIlxuaW1wb3J0IHsgSVZhbHVlIH0gZnJvbSBcIi4vdmFsdWVzL1ZhbHVlXCJcbmltcG9ydCB7IFZhbHVlQ3JlYXRlQ29udGV4dCwgVmFsdWVDcmVhdGVQYXJhbXMsIFZhbHVlU291cmNlIH0gZnJvbSBcIi4vdmFsdWVzL1ZhbHVlU291cmNlXCJcblxuZXhwb3J0IHR5cGUgTWVtYmVySW5mbyA9IHtcbiAgIHR5cGU6IElUeXBlIHwgQ3JlYXRlVHlwZUhhbmRsZXIsXG4gICB2YWx1ZTogTWVtYmVyVmFsdWUsXG4gICBzeW1ib2xzPzogU3ltYm9sRW50cnlbXVxufVxuXG5leHBvcnQgdHlwZSBNZW1iZXJWYWx1ZSA9IFZhbHVlQ3JlYXRlUGFyYW1zIHwgTWVtYmVySW5mb1xuXG4vKipcbiAqIFRoaXMgaW50ZXJmYWNlIHJlcHJlc2VudHMgdGhlIGRhdGEgc3RydWN0dXJlIHN0b3JpbmcgYW4gaW5kaXZpZHVhbFxuICogTWVtYmVyIGluIGEgTW9kZWxcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJTWVtYmVyIHtcbiAgIHJlYWRvbmx5IGlkOiBzdHJpbmdcbiAgIHJlYWRvbmx5IHR5cGU6IElUeXBlXG4gICBuYW1lOiBzdHJpbmdcbiAgIHN5bWJvbHM6IFN5bWJvbEVudHJ5W11cbiAgIHZhbHVlOiBJVmFsdWVcbn1cblxuZXhwb3J0IGNsYXNzIE1lbWJlciBpbXBsZW1lbnRzIElNZW1iZXIge1xuXG4gICBnZXQgdHlwZSgpOiBJVHlwZSB7XG4gICAgICByZXR1cm4gdGhpcy52YWx1ZS50eXBlXG4gICB9XG5cbiAgIHN5bWJvbHM6IFN5bWJvbEVudHJ5W11cbiAgIHZhbHVlOiBJVmFsdWVcblxuICAgY29uc3RydWN0b3IoXG4gICAgICByZWFkb25seSBpZDogc3RyaW5nLFxuICAgICAgcmVhZG9ubHkgbmFtZTogc3RyaW5nLFxuICAgICAgdmFsdWU6IElWYWx1ZSxcbiAgICAgIHN5bWJvbHM/OiBTeW1ib2xFbnRyeVtdXG4gICApIHtcbiAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZVxuICAgICAgdGhpcy5zeW1ib2xzID0gc3ltYm9scyB8fCBuZXcgQXJyYXk8U3ltYm9sRW50cnk+KClcbiAgIH1cblxuICAgLyoqXG4gICAgKiBDcmVhdGVzIGFuIEFycmF5IG9mIE1lbWJlcnMgZnJvbSB0aGUgTW9kZWxDcmVhdGUgUGFyYW1ldGVyc1xuICAgICogXG4gICAgKiBAcGFyYW0gb2JqIFRoZSBNb2RlbENyZWF0ZSBwYXJhbWV0ZXJzXG4gICAgKiBAcGFyYW0gY3JlYXRlQ29udGV4dCBUaGUgVmFsdWVDcmVhdGVDb250ZXh0XG4gICAgKiBAcGFyYW0gY29udGV4dCBUaGUgU3RhY2tDb250ZXh0XG4gICAgKiBAcmV0dXJucyBBbiBBcnJheSBvZiBNZW1iZXJzIGJhc2VkIG9uIHRoZSBNb2RlbENyZWF0ZVxuICAgICovXG4gICBzdGF0aWMgY3JlYXRlKG9iajogTW9kZWxDcmVhdGVQYXJhbXMsIGNyZWF0ZUNvbnRleHQ6IFZhbHVlQ3JlYXRlQ29udGV4dCwgY29udGV4dDogSVN0YWNrQ29udGV4dCk6IElNZW1iZXJbXSB7XG4gICAgICBsZXQgcmVzdWx0cyA9IG5ldyBBcnJheTxJTWVtYmVyPigpXG5cbiAgICAgIGZvciAobGV0IGtleSBvZiBPYmplY3Qua2V5cyhvYmopKSB7XG4gICAgICAgICBsZXQgdmFsdWUgPSBvYmpba2V5XVxuXG4gICAgICAgICBsZXQgaWQgPSBjb250ZXh0LnVpZC5nZW5lcmF0ZUxvY2FsKClcblxuICAgICAgICAgaWYoY3JlYXRlQ29udGV4dCAhPSBudWxsICYmIGNyZWF0ZUNvbnRleHQubW9kZWwgIT0gbnVsbCkge1xuICAgICAgICAgICAgbGV0IG1vZGVsID0gY3JlYXRlQ29udGV4dC5tb2RlbFxuICAgICAgICAgICAgXG4gICAgICAgICAgICBsZXQgZm91bmQgPSBtb2RlbC5tZW1iZXJzLmZpbmQobSA9PiBtLmlkID09PSBpZClcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgd2hpbGUoZm91bmQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgaWQgPSBjb250ZXh0LnVpZC5nZW5lcmF0ZUxvY2FsKClcbiAgICAgICAgICAgICAgIGZvdW5kID0gbW9kZWwubWVtYmVycy5maW5kKG0gPT4gbS5pZCA9PT0gaWQpXG4gICAgICAgICAgICB9XG4gICAgICAgICB9XG5cbiAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGxldCByZXNvbHZlZFZhbHVlID0gVmFsdWVTb3VyY2UucmVzb2x2ZSh2YWx1ZSwgY29udGV4dCwgY3JlYXRlQ29udGV4dClcbiAgICAgICAgICAgIHJlc3VsdHMucHVzaChuZXcgTWVtYmVyKGlkLCBrZXksIHJlc29sdmVkVmFsdWUpKVxuICAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICAgIHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgfHxcbiAgICAgICAgICAgIHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgfHxcbiAgICAgICAgICAgIHR5cGVvZiB2YWx1ZSA9PT0gJ2Jvb2xlYW4nIHx8XG4gICAgICAgICAgICBBcnJheS5pc0FycmF5KHZhbHVlKVxuICAgICAgICAgKSB7XG4gICAgICAgICAgICBsZXQgcmVzb2x2ZWRWYWx1ZSA9IFZhbHVlU291cmNlLnJlc29sdmUodmFsdWUsIGNvbnRleHQpXG4gICAgICAgICAgICByZXN1bHRzLnB1c2gobmV3IE1lbWJlcihpZCwga2V5LCByZXNvbHZlZFZhbHVlKSlcbiAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgaWYgKHZhbHVlLnR5cGUgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBFbmNvdW50ZXJlZCBhbiBlcnJvciB3aGVuIGJ1aWxkaW5nIGEgTW9kZWwuIEZhaWxlZCB0byBkZXRlcm1pbmUgdGhlIFR5cGUgZm9yICR7a2V5fS4gRW5zdXJlICd0eXBlJyBpcyBwcm92aWRlZCB3aGVuIGNyZWF0aW5nIHRoZSBNb2RlbC5gKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodmFsdWUudmFsdWUgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBFbmNvdW50ZXJlZCBhbiBlcnJvciB3aGVuIGJ1aWxkaW5nIGEgTW9kZWwuIEZhaWxlZCB0byBkZXRlcm1pbmUgdGhlIFZhbHVlIGZvciAke2tleX0uIEVuc3VyZSAndmFsdWUnIGlzIHByb3ZpZGVkIHdoZW4gY3JlYXRpbmcgdGhlIE1vZGVsLmApXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKHR5cGVvZiB2YWx1ZS50eXBlICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEVuY291bnRlcmVkIGFuIGVycm9yIHdoZW4gYnVpbGRpbmcgYSBNb2RlbC4gRXhwZWN0ZWQgJ3R5cGUnIHRvIGJlIGEgZnVuY3Rpb24gZm9yICR7a2V5fS4gUmVjZWl2ZWQgYSAke3R5cGVvZiB2YWx1ZS50eXBlfSBpbnN0ZWFkLmApXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCB0eXBlcyA9IG5ldyBUeXBlU291cmNlKGNvbnRleHQpXG4gICAgICAgICAgICBsZXQgdHlwZSA9IHZhbHVlLnR5cGUodHlwZXMpXG5cbiAgICAgICAgICAgIGxldCBzdWJSZXNvbHZlOiBFeGNsdWRlPE1lbWJlclZhbHVlLCBNZW1iZXJJbmZvPiA9IHZhbHVlLnZhbHVlIGFzIEV4Y2x1ZGU8TWVtYmVyVmFsdWUsIE1lbWJlckluZm8+XG5cbiAgICAgICAgICAgIGxldCByZXNvbHZlZFZhbHVlID0gVmFsdWVTb3VyY2UucmVzb2x2ZShzdWJSZXNvbHZlLCBjb250ZXh0LCBjcmVhdGVDb250ZXh0LCB0eXBlKVxuICAgICAgICAgICAgbGV0IHN5bWJvbHMgPSB2YWx1ZS5zeW1ib2xzIHx8IG5ldyBBcnJheTxTeW1ib2xFbnRyeT4oKVxuXG4gICAgICAgICAgICBpZighdHlwZS5lcXVhbHMocmVzb2x2ZWRWYWx1ZS50eXBlKSkge1xuICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBFbmNvdW50ZXJlZCBhbiBlcnJvciB3aGVuIGRldGVybWluaW5nIGEgTW9kZWwncyB0eXBlLiBUaGUgZGVmYXVsdCB2YWx1ZXMgcHJvdmlkZWQgZG8gbm90IG1hdGNoIHRoZSB0eXBlIHByb3ZpZGVkIGZvciAke2tleX0uYClcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmVzdWx0cy5wdXNoKG5ldyBNZW1iZXIoaWQsIGtleSwgcmVzb2x2ZWRWYWx1ZSwgc3ltYm9scykpXG4gICAgICAgICB9XG4gICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5zdXBwb3J0ZWQgdmFsdWUgd2hlbiByZXNvbHZpbmcgYSB0eXBlOiAke3R5cGVvZiB2YWx1ZX1gKVxuICAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzdWx0c1xuICAgfVxufSJdfQ==