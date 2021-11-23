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
     * @param createContext The ModelCreateContext
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
                typeof value === 'boolean') {
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
                let resolvedValue = ValueSource_1.ValueSource.resolve(subResolve, context, createContext);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWVtYmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL01lbWJlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFHQSxvREFBZ0Q7QUFFaEQsc0RBQXFFO0FBZ0JyRSxNQUFhLE1BQU07SUFTaEIsWUFDWSxFQUFVLEVBQ1YsSUFBWSxFQUNyQixLQUFhLEVBQ2IsT0FBdUI7UUFIZCxPQUFFLEdBQUYsRUFBRSxDQUFRO1FBQ1YsU0FBSSxHQUFKLElBQUksQ0FBUTtRQUlyQixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQTtRQUNsQixJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sSUFBSSxJQUFJLEtBQUssRUFBZSxDQUFBO0lBQ3JELENBQUM7SUFmRCxJQUFJLElBQUk7UUFDTCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFBO0lBQ3pCLENBQUM7SUFlRDs7Ozs7OztPQU9HO0lBQ0gsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFzQixFQUFFLGFBQWlDLEVBQUUsT0FBc0I7UUFDNUYsSUFBSSxPQUFPLEdBQUcsSUFBSSxLQUFLLEVBQVcsQ0FBQTtRQUVsQyxLQUFLLElBQUksR0FBRyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDL0IsSUFBSSxLQUFLLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFBO1lBRXBCLElBQUksRUFBRSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLENBQUE7WUFFcEMsSUFBRyxhQUFhLElBQUksSUFBSSxJQUFJLGFBQWEsQ0FBQyxLQUFLLElBQUksSUFBSSxFQUFFO2dCQUN0RCxJQUFJLEtBQUssR0FBRyxhQUFhLENBQUMsS0FBSyxDQUFBO2dCQUUvQixJQUFJLEtBQUssR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUE7Z0JBRWhELE9BQU0sS0FBSyxLQUFLLFNBQVMsRUFBRTtvQkFDeEIsRUFBRSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLENBQUE7b0JBQ2hDLEtBQUssR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUE7aUJBQzlDO2FBQ0g7WUFFRCxJQUFJLE9BQU8sS0FBSyxLQUFLLFVBQVUsRUFBRTtnQkFDOUIsSUFBSSxhQUFhLEdBQUcseUJBQVcsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxhQUFhLENBQUMsQ0FBQTtnQkFDdEUsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLE1BQU0sQ0FBQyxFQUFFLEVBQUUsR0FBRyxFQUFFLGFBQWEsQ0FBQyxDQUFDLENBQUE7YUFDbEQ7aUJBQU0sSUFDSixPQUFPLEtBQUssS0FBSyxRQUFRO2dCQUN6QixPQUFPLEtBQUssS0FBSyxRQUFRO2dCQUN6QixPQUFPLEtBQUssS0FBSyxTQUFTLEVBQzNCO2dCQUNDLElBQUksYUFBYSxHQUFHLHlCQUFXLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQTtnQkFDdkQsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLE1BQU0sQ0FBQyxFQUFFLEVBQUUsR0FBRyxFQUFFLGFBQWEsQ0FBQyxDQUFDLENBQUE7YUFDbEQ7aUJBQU0sSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLEVBQUU7Z0JBQ25DLElBQUksS0FBSyxDQUFDLElBQUksSUFBSSxJQUFJLEVBQUU7b0JBQ3JCLE1BQU0sSUFBSSxLQUFLLENBQUMsZ0ZBQWdGLEdBQUcsc0RBQXNELENBQUMsQ0FBQTtpQkFDNUo7Z0JBRUQsSUFBSSxLQUFLLENBQUMsS0FBSyxJQUFJLElBQUksRUFBRTtvQkFDdEIsTUFBTSxJQUFJLEtBQUssQ0FBQyxpRkFBaUYsR0FBRyx1REFBdUQsQ0FBQyxDQUFBO2lCQUM5SjtnQkFFRCxJQUFHLE9BQU8sS0FBSyxDQUFDLElBQUksS0FBSyxVQUFVLEVBQUU7b0JBQ2xDLE1BQU0sSUFBSSxLQUFLLENBQUMsb0ZBQW9GLEdBQUcsZ0JBQWdCLE9BQU8sS0FBSyxDQUFDLElBQUksV0FBVyxDQUFDLENBQUE7aUJBQ3RKO2dCQUVELElBQUksS0FBSyxHQUFHLElBQUksdUJBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQTtnQkFDbkMsSUFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtnQkFFNUIsSUFBSSxVQUFVLEdBQXdDLEtBQUssQ0FBQyxLQUE0QyxDQUFBO2dCQUV4RyxJQUFJLGFBQWEsR0FBRyx5QkFBVyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsT0FBTyxFQUFFLGFBQWEsQ0FBQyxDQUFBO2dCQUMzRSxJQUFJLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxJQUFJLElBQUksS0FBSyxFQUFlLENBQUE7Z0JBRXZELElBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsRUFBRTtvQkFDbEMsTUFBTSxJQUFJLEtBQUssQ0FBQyx3SEFBd0gsR0FBRyxHQUFHLENBQUMsQ0FBQTtpQkFDako7Z0JBRUQsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLE1BQU0sQ0FBQyxFQUFFLEVBQUUsR0FBRyxFQUFFLGFBQWEsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFBO2FBQzNEO2lCQUNJO2dCQUNGLE1BQU0sSUFBSSxLQUFLLENBQUMsNENBQTRDLE9BQU8sS0FBSyxFQUFFLENBQUMsQ0FBQTthQUM3RTtTQUNIO1FBRUQsT0FBTyxPQUFPLENBQUE7SUFDakIsQ0FBQztDQUNIO0FBMUZELHdCQTBGQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE1vZGVsQ3JlYXRlQ29udGV4dCwgTW9kZWxDcmVhdGVQYXJhbXMsIE1vZGVsUHJvcGVydHksIFN5bWJvbEVudHJ5IH0gZnJvbSBcIi4vTW9kZWxcIlxuaW1wb3J0IHsgSVN0YWNrQ29udGV4dCB9IGZyb20gXCIuL3N0YWNrL1N0YWNrQ29udGV4dFwiXG5pbXBvcnQgeyBJVHlwZSB9IGZyb20gXCIuL3ZhbHVlcy9UeXBlXCJcbmltcG9ydCB7IFR5cGVTb3VyY2UgfSBmcm9tIFwiLi92YWx1ZXMvVHlwZVNvdXJjZVwiXG5pbXBvcnQgeyBJVmFsdWUgfSBmcm9tIFwiLi92YWx1ZXMvVmFsdWVcIlxuaW1wb3J0IHsgVmFsdWVDcmVhdGVQYXJhbXMsIFZhbHVlU291cmNlIH0gZnJvbSBcIi4vdmFsdWVzL1ZhbHVlU291cmNlXCJcblxuZXhwb3J0IHR5cGUgTWVtYmVyVmFsdWUgPSBWYWx1ZUNyZWF0ZVBhcmFtcyB8IE1vZGVsUHJvcGVydHlcblxuLyoqXG4gKiBUaGlzIGludGVyZmFjZSByZXByZXNlbnRzIHRoZSBkYXRhIHN0cnVjdHVyZSBzdG9yaW5nIGFuIGluZGl2aWR1YWxcbiAqIE1lbWJlciBpbiBhIE1vZGVsXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSU1lbWJlciB7XG4gICByZWFkb25seSBpZDogc3RyaW5nXG4gICByZWFkb25seSB0eXBlOiBJVHlwZVxuICAgbmFtZTogc3RyaW5nXG4gICBzeW1ib2xzOiBTeW1ib2xFbnRyeVtdXG4gICB2YWx1ZTogSVZhbHVlXG59XG5cbmV4cG9ydCBjbGFzcyBNZW1iZXIgaW1wbGVtZW50cyBJTWVtYmVyIHtcblxuICAgZ2V0IHR5cGUoKTogSVR5cGUge1xuICAgICAgcmV0dXJuIHRoaXMudmFsdWUudHlwZVxuICAgfVxuXG4gICBzeW1ib2xzOiBTeW1ib2xFbnRyeVtdXG4gICB2YWx1ZTogSVZhbHVlXG5cbiAgIGNvbnN0cnVjdG9yKFxuICAgICAgcmVhZG9ubHkgaWQ6IHN0cmluZyxcbiAgICAgIHJlYWRvbmx5IG5hbWU6IHN0cmluZyxcbiAgICAgIHZhbHVlOiBJVmFsdWUsXG4gICAgICBzeW1ib2xzPzogU3ltYm9sRW50cnlbXVxuICAgKSB7XG4gICAgICB0aGlzLnZhbHVlID0gdmFsdWVcbiAgICAgIHRoaXMuc3ltYm9scyA9IHN5bWJvbHMgfHwgbmV3IEFycmF5PFN5bWJvbEVudHJ5PigpXG4gICB9XG5cbiAgIC8qKlxuICAgICogQ3JlYXRlcyBhbiBBcnJheSBvZiBNZW1iZXJzIGZyb20gdGhlIE1vZGVsQ3JlYXRlIFBhcmFtZXRlcnNcbiAgICAqIFxuICAgICogQHBhcmFtIG9iaiBUaGUgTW9kZWxDcmVhdGUgcGFyYW1ldGVyc1xuICAgICogQHBhcmFtIGNyZWF0ZUNvbnRleHQgVGhlIE1vZGVsQ3JlYXRlQ29udGV4dFxuICAgICogQHBhcmFtIGNvbnRleHQgVGhlIFN0YWNrQ29udGV4dFxuICAgICogQHJldHVybnMgQW4gQXJyYXkgb2YgTWVtYmVycyBiYXNlZCBvbiB0aGUgTW9kZWxDcmVhdGVcbiAgICAqL1xuICAgc3RhdGljIGNyZWF0ZShvYmo6IE1vZGVsQ3JlYXRlUGFyYW1zLCBjcmVhdGVDb250ZXh0OiBNb2RlbENyZWF0ZUNvbnRleHQsIGNvbnRleHQ6IElTdGFja0NvbnRleHQpOiBJTWVtYmVyW10ge1xuICAgICAgbGV0IHJlc3VsdHMgPSBuZXcgQXJyYXk8SU1lbWJlcj4oKVxuXG4gICAgICBmb3IgKGxldCBrZXkgb2YgT2JqZWN0LmtleXMob2JqKSkge1xuICAgICAgICAgbGV0IHZhbHVlID0gb2JqW2tleV1cblxuICAgICAgICAgbGV0IGlkID0gY29udGV4dC51aWQuZ2VuZXJhdGVMb2NhbCgpXG5cbiAgICAgICAgIGlmKGNyZWF0ZUNvbnRleHQgIT0gbnVsbCAmJiBjcmVhdGVDb250ZXh0Lm1vZGVsICE9IG51bGwpIHtcbiAgICAgICAgICAgIGxldCBtb2RlbCA9IGNyZWF0ZUNvbnRleHQubW9kZWxcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgbGV0IGZvdW5kID0gbW9kZWwubWVtYmVycy5maW5kKG0gPT4gbS5pZCA9PT0gaWQpXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHdoaWxlKGZvdW5kICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgIGlkID0gY29udGV4dC51aWQuZ2VuZXJhdGVMb2NhbCgpXG4gICAgICAgICAgICAgICBmb3VuZCA9IG1vZGVsLm1lbWJlcnMuZmluZChtID0+IG0uaWQgPT09IGlkKVxuICAgICAgICAgICAgfVxuICAgICAgICAgfVxuXG4gICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBsZXQgcmVzb2x2ZWRWYWx1ZSA9IFZhbHVlU291cmNlLnJlc29sdmUodmFsdWUsIGNvbnRleHQsIGNyZWF0ZUNvbnRleHQpXG4gICAgICAgICAgICByZXN1bHRzLnB1c2gobmV3IE1lbWJlcihpZCwga2V5LCByZXNvbHZlZFZhbHVlKSlcbiAgICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnIHx8XG4gICAgICAgICAgICB0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInIHx8XG4gICAgICAgICAgICB0eXBlb2YgdmFsdWUgPT09ICdib29sZWFuJ1xuICAgICAgICAgKSB7XG4gICAgICAgICAgICBsZXQgcmVzb2x2ZWRWYWx1ZSA9IFZhbHVlU291cmNlLnJlc29sdmUodmFsdWUsIGNvbnRleHQpXG4gICAgICAgICAgICByZXN1bHRzLnB1c2gobmV3IE1lbWJlcihpZCwga2V5LCByZXNvbHZlZFZhbHVlKSlcbiAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgaWYgKHZhbHVlLnR5cGUgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBFbmNvdW50ZXJlZCBhbiBlcnJvciB3aGVuIGJ1aWxkaW5nIGEgTW9kZWwuIEZhaWxlZCB0byBkZXRlcm1pbmUgdGhlIFR5cGUgZm9yICR7a2V5fS4gRW5zdXJlICd0eXBlJyBpcyBwcm92aWRlZCB3aGVuIGNyZWF0aW5nIHRoZSBNb2RlbC5gKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodmFsdWUudmFsdWUgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBFbmNvdW50ZXJlZCBhbiBlcnJvciB3aGVuIGJ1aWxkaW5nIGEgTW9kZWwuIEZhaWxlZCB0byBkZXRlcm1pbmUgdGhlIFZhbHVlIGZvciAke2tleX0uIEVuc3VyZSAndmFsdWUnIGlzIHByb3ZpZGVkIHdoZW4gY3JlYXRpbmcgdGhlIE1vZGVsLmApXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKHR5cGVvZiB2YWx1ZS50eXBlICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEVuY291bnRlcmVkIGFuIGVycm9yIHdoZW4gYnVpbGRpbmcgYSBNb2RlbC4gRXhwZWN0ZWQgJ3R5cGUnIHRvIGJlIGEgZnVuY3Rpb24gZm9yICR7a2V5fS4gUmVjZWl2ZWQgYSAke3R5cGVvZiB2YWx1ZS50eXBlfSBpbnN0ZWFkLmApXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCB0eXBlcyA9IG5ldyBUeXBlU291cmNlKGNvbnRleHQpXG4gICAgICAgICAgICBsZXQgdHlwZSA9IHZhbHVlLnR5cGUodHlwZXMpXG5cbiAgICAgICAgICAgIGxldCBzdWJSZXNvbHZlOiBFeGNsdWRlPE1lbWJlclZhbHVlLCBNb2RlbFByb3BlcnR5PiA9IHZhbHVlLnZhbHVlIGFzIEV4Y2x1ZGU8TWVtYmVyVmFsdWUsIE1vZGVsUHJvcGVydHk+XG5cbiAgICAgICAgICAgIGxldCByZXNvbHZlZFZhbHVlID0gVmFsdWVTb3VyY2UucmVzb2x2ZShzdWJSZXNvbHZlLCBjb250ZXh0LCBjcmVhdGVDb250ZXh0KVxuICAgICAgICAgICAgbGV0IHN5bWJvbHMgPSB2YWx1ZS5zeW1ib2xzIHx8IG5ldyBBcnJheTxTeW1ib2xFbnRyeT4oKVxuXG4gICAgICAgICAgICBpZighdHlwZS5lcXVhbHMocmVzb2x2ZWRWYWx1ZS50eXBlKSkge1xuICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBFbmNvdW50ZXJlZCBhbiBlcnJvciB3aGVuIGRldGVybWluaW5nIGEgTW9kZWwncyB0eXBlLiBUaGUgZGVmYXVsdCB2YWx1ZXMgcHJvdmlkZWQgZG8gbm90IG1hdGNoIHRoZSB0eXBlIHByb3ZpZGVkIGZvciAke2tleX0uYClcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmVzdWx0cy5wdXNoKG5ldyBNZW1iZXIoaWQsIGtleSwgcmVzb2x2ZWRWYWx1ZSwgc3ltYm9scykpXG4gICAgICAgICB9XG4gICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5zdXBwb3J0ZWQgdmFsdWUgd2hlbiByZXNvbHZpbmcgYSB0eXBlOiAke3R5cGVvZiB2YWx1ZX1gKVxuICAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzdWx0c1xuICAgfVxufSJdfQ==