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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWVtYmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL01lbWJlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFHQSxvREFBbUU7QUFFbkUsc0RBQXlGO0FBc0J6RixNQUFhLE1BQU07SUFTaEIsWUFDWSxFQUFVLEVBQ1YsSUFBWSxFQUNyQixLQUFhLEVBQ2IsT0FBdUI7UUFIZCxPQUFFLEdBQUYsRUFBRSxDQUFRO1FBQ1YsU0FBSSxHQUFKLElBQUksQ0FBUTtRQUlyQixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQTtRQUNsQixJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sSUFBSSxJQUFJLEtBQUssRUFBZSxDQUFBO0lBQ3JELENBQUM7SUFmRCxJQUFJLElBQUk7UUFDTCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFBO0lBQ3pCLENBQUM7SUFlRDs7Ozs7OztPQU9HO0lBQ0gsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFzQixFQUFFLGFBQWlDLEVBQUUsT0FBc0I7UUFDNUYsSUFBSSxPQUFPLEdBQUcsSUFBSSxLQUFLLEVBQVcsQ0FBQTtRQUVsQyxLQUFLLElBQUksR0FBRyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDL0IsSUFBSSxLQUFLLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFBO1lBRXBCLElBQUksRUFBRSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLENBQUE7WUFFcEMsSUFBRyxhQUFhLElBQUksSUFBSSxJQUFJLGFBQWEsQ0FBQyxLQUFLLElBQUksSUFBSSxFQUFFO2dCQUN0RCxJQUFJLEtBQUssR0FBRyxhQUFhLENBQUMsS0FBSyxDQUFBO2dCQUUvQixJQUFJLEtBQUssR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUE7Z0JBRWhELE9BQU0sS0FBSyxLQUFLLFNBQVMsRUFBRTtvQkFDeEIsRUFBRSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLENBQUE7b0JBQ2hDLEtBQUssR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUE7aUJBQzlDO2FBQ0g7WUFFRCxJQUFJLE9BQU8sS0FBSyxLQUFLLFVBQVUsRUFBRTtnQkFDOUIsSUFBSSxhQUFhLEdBQUcseUJBQVcsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxhQUFhLENBQUMsQ0FBQTtnQkFDdEUsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLE1BQU0sQ0FBQyxFQUFFLEVBQUUsR0FBRyxFQUFFLGFBQWEsQ0FBQyxDQUFDLENBQUE7YUFDbEQ7aUJBQU0sSUFDSixPQUFPLEtBQUssS0FBSyxRQUFRO2dCQUN6QixPQUFPLEtBQUssS0FBSyxRQUFRO2dCQUN6QixPQUFPLEtBQUssS0FBSyxTQUFTO2dCQUMxQixLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUNyQjtnQkFDQyxJQUFJLGFBQWEsR0FBRyx5QkFBVyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUE7Z0JBQ3ZELE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxNQUFNLENBQUMsRUFBRSxFQUFFLEdBQUcsRUFBRSxhQUFhLENBQUMsQ0FBQyxDQUFBO2FBQ2xEO2lCQUFNLElBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxFQUFFO2dCQUNuQyxJQUFJLEtBQUssQ0FBQyxJQUFJLElBQUksSUFBSSxFQUFFO29CQUNyQixNQUFNLElBQUksS0FBSyxDQUFDLGdGQUFnRixHQUFHLHNEQUFzRCxDQUFDLENBQUE7aUJBQzVKO2dCQUVELElBQUksS0FBSyxDQUFDLEtBQUssSUFBSSxJQUFJLEVBQUU7b0JBQ3RCLE1BQU0sSUFBSSxLQUFLLENBQUMsaUZBQWlGLEdBQUcsdURBQXVELENBQUMsQ0FBQTtpQkFDOUo7Z0JBRUQsSUFBRyxPQUFPLEtBQUssQ0FBQyxJQUFJLEtBQUssVUFBVSxFQUFFO29CQUNsQyxNQUFNLElBQUksS0FBSyxDQUFDLG9GQUFvRixHQUFHLGdCQUFnQixPQUFPLEtBQUssQ0FBQyxJQUFJLFdBQVcsQ0FBQyxDQUFBO2lCQUN0SjtnQkFFRCxJQUFJLEtBQUssR0FBRyxJQUFJLHVCQUFVLENBQUMsT0FBTyxDQUFDLENBQUE7Z0JBQ25DLElBQUksSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7Z0JBRTVCLElBQUksVUFBVSxHQUFxQyxLQUFLLENBQUMsS0FBeUMsQ0FBQTtnQkFFbEcsSUFBSSxhQUFhLEdBQUcseUJBQVcsQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLE9BQU8sRUFBRSxhQUFhLENBQUMsQ0FBQTtnQkFDM0UsSUFBSSxPQUFPLEdBQUcsS0FBSyxDQUFDLE9BQU8sSUFBSSxJQUFJLEtBQUssRUFBZSxDQUFBO2dCQUV2RCxJQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEVBQUU7b0JBQ2xDLE1BQU0sSUFBSSxLQUFLLENBQUMsd0hBQXdILEdBQUcsR0FBRyxDQUFDLENBQUE7aUJBQ2pKO2dCQUVELE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxNQUFNLENBQUMsRUFBRSxFQUFFLEdBQUcsRUFBRSxhQUFhLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQTthQUMzRDtpQkFDSTtnQkFDRixNQUFNLElBQUksS0FBSyxDQUFDLDRDQUE0QyxPQUFPLEtBQUssRUFBRSxDQUFDLENBQUE7YUFDN0U7U0FDSDtRQUVELE9BQU8sT0FBTyxDQUFBO0lBQ2pCLENBQUM7Q0FDSDtBQTNGRCx3QkEyRkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBNb2RlbENyZWF0ZVBhcmFtcywgU3ltYm9sRW50cnkgfSBmcm9tIFwiLi9Nb2RlbFwiXG5pbXBvcnQgeyBJU3RhY2tDb250ZXh0IH0gZnJvbSBcIi4vc3RhY2svU3RhY2tDb250ZXh0XCJcbmltcG9ydCB7IElUeXBlIH0gZnJvbSBcIi4vdmFsdWVzL1R5cGVcIlxuaW1wb3J0IHsgQ3JlYXRlVHlwZUhhbmRsZXIsIFR5cGVTb3VyY2UgfSBmcm9tIFwiLi92YWx1ZXMvVHlwZVNvdXJjZVwiXG5pbXBvcnQgeyBJVmFsdWUgfSBmcm9tIFwiLi92YWx1ZXMvVmFsdWVcIlxuaW1wb3J0IHsgVmFsdWVDcmVhdGVDb250ZXh0LCBWYWx1ZUNyZWF0ZVBhcmFtcywgVmFsdWVTb3VyY2UgfSBmcm9tIFwiLi92YWx1ZXMvVmFsdWVTb3VyY2VcIlxuXG5leHBvcnQgdHlwZSBNZW1iZXJJbmZvID0ge1xuICAgdHlwZTogSVR5cGUgfCBDcmVhdGVUeXBlSGFuZGxlcixcbiAgIHZhbHVlOiBNZW1iZXJWYWx1ZSxcbiAgIHN5bWJvbHM/OiBTeW1ib2xFbnRyeVtdXG59XG5cbmV4cG9ydCB0eXBlIE1lbWJlclZhbHVlID0gVmFsdWVDcmVhdGVQYXJhbXMgfCBNZW1iZXJJbmZvXG5cbi8qKlxuICogVGhpcyBpbnRlcmZhY2UgcmVwcmVzZW50cyB0aGUgZGF0YSBzdHJ1Y3R1cmUgc3RvcmluZyBhbiBpbmRpdmlkdWFsXG4gKiBNZW1iZXIgaW4gYSBNb2RlbFxuICovXG5leHBvcnQgaW50ZXJmYWNlIElNZW1iZXIge1xuICAgcmVhZG9ubHkgaWQ6IHN0cmluZ1xuICAgcmVhZG9ubHkgdHlwZTogSVR5cGVcbiAgIG5hbWU6IHN0cmluZ1xuICAgc3ltYm9sczogU3ltYm9sRW50cnlbXVxuICAgdmFsdWU6IElWYWx1ZVxufVxuXG5leHBvcnQgY2xhc3MgTWVtYmVyIGltcGxlbWVudHMgSU1lbWJlciB7XG5cbiAgIGdldCB0eXBlKCk6IElUeXBlIHtcbiAgICAgIHJldHVybiB0aGlzLnZhbHVlLnR5cGVcbiAgIH1cblxuICAgc3ltYm9sczogU3ltYm9sRW50cnlbXVxuICAgdmFsdWU6IElWYWx1ZVxuXG4gICBjb25zdHJ1Y3RvcihcbiAgICAgIHJlYWRvbmx5IGlkOiBzdHJpbmcsXG4gICAgICByZWFkb25seSBuYW1lOiBzdHJpbmcsXG4gICAgICB2YWx1ZTogSVZhbHVlLFxuICAgICAgc3ltYm9scz86IFN5bWJvbEVudHJ5W11cbiAgICkge1xuICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlXG4gICAgICB0aGlzLnN5bWJvbHMgPSBzeW1ib2xzIHx8IG5ldyBBcnJheTxTeW1ib2xFbnRyeT4oKVxuICAgfVxuXG4gICAvKipcbiAgICAqIENyZWF0ZXMgYW4gQXJyYXkgb2YgTWVtYmVycyBmcm9tIHRoZSBNb2RlbENyZWF0ZSBQYXJhbWV0ZXJzXG4gICAgKiBcbiAgICAqIEBwYXJhbSBvYmogVGhlIE1vZGVsQ3JlYXRlIHBhcmFtZXRlcnNcbiAgICAqIEBwYXJhbSBjcmVhdGVDb250ZXh0IFRoZSBWYWx1ZUNyZWF0ZUNvbnRleHRcbiAgICAqIEBwYXJhbSBjb250ZXh0IFRoZSBTdGFja0NvbnRleHRcbiAgICAqIEByZXR1cm5zIEFuIEFycmF5IG9mIE1lbWJlcnMgYmFzZWQgb24gdGhlIE1vZGVsQ3JlYXRlXG4gICAgKi9cbiAgIHN0YXRpYyBjcmVhdGUob2JqOiBNb2RlbENyZWF0ZVBhcmFtcywgY3JlYXRlQ29udGV4dDogVmFsdWVDcmVhdGVDb250ZXh0LCBjb250ZXh0OiBJU3RhY2tDb250ZXh0KTogSU1lbWJlcltdIHtcbiAgICAgIGxldCByZXN1bHRzID0gbmV3IEFycmF5PElNZW1iZXI+KClcblxuICAgICAgZm9yIChsZXQga2V5IG9mIE9iamVjdC5rZXlzKG9iaikpIHtcbiAgICAgICAgIGxldCB2YWx1ZSA9IG9ialtrZXldXG5cbiAgICAgICAgIGxldCBpZCA9IGNvbnRleHQudWlkLmdlbmVyYXRlTG9jYWwoKVxuXG4gICAgICAgICBpZihjcmVhdGVDb250ZXh0ICE9IG51bGwgJiYgY3JlYXRlQ29udGV4dC5tb2RlbCAhPSBudWxsKSB7XG4gICAgICAgICAgICBsZXQgbW9kZWwgPSBjcmVhdGVDb250ZXh0Lm1vZGVsXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGxldCBmb3VuZCA9IG1vZGVsLm1lbWJlcnMuZmluZChtID0+IG0uaWQgPT09IGlkKVxuICAgICAgICAgICAgXG4gICAgICAgICAgICB3aGlsZShmb3VuZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICBpZCA9IGNvbnRleHQudWlkLmdlbmVyYXRlTG9jYWwoKVxuICAgICAgICAgICAgICAgZm91bmQgPSBtb2RlbC5tZW1iZXJzLmZpbmQobSA9PiBtLmlkID09PSBpZClcbiAgICAgICAgICAgIH1cbiAgICAgICAgIH1cblxuICAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgbGV0IHJlc29sdmVkVmFsdWUgPSBWYWx1ZVNvdXJjZS5yZXNvbHZlKHZhbHVlLCBjb250ZXh0LCBjcmVhdGVDb250ZXh0KVxuICAgICAgICAgICAgcmVzdWx0cy5wdXNoKG5ldyBNZW1iZXIoaWQsIGtleSwgcmVzb2x2ZWRWYWx1ZSkpXG4gICAgICAgICB9IGVsc2UgaWYgKFxuICAgICAgICAgICAgdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyB8fFxuICAgICAgICAgICAgdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyB8fFxuICAgICAgICAgICAgdHlwZW9mIHZhbHVlID09PSAnYm9vbGVhbicgfHxcbiAgICAgICAgICAgIEFycmF5LmlzQXJyYXkodmFsdWUpXG4gICAgICAgICApIHtcbiAgICAgICAgICAgIGxldCByZXNvbHZlZFZhbHVlID0gVmFsdWVTb3VyY2UucmVzb2x2ZSh2YWx1ZSwgY29udGV4dClcbiAgICAgICAgICAgIHJlc3VsdHMucHVzaChuZXcgTWVtYmVyKGlkLCBrZXksIHJlc29sdmVkVmFsdWUpKVxuICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICBpZiAodmFsdWUudHlwZSA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEVuY291bnRlcmVkIGFuIGVycm9yIHdoZW4gYnVpbGRpbmcgYSBNb2RlbC4gRmFpbGVkIHRvIGRldGVybWluZSB0aGUgVHlwZSBmb3IgJHtrZXl9LiBFbnN1cmUgJ3R5cGUnIGlzIHByb3ZpZGVkIHdoZW4gY3JlYXRpbmcgdGhlIE1vZGVsLmApXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh2YWx1ZS52YWx1ZSA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEVuY291bnRlcmVkIGFuIGVycm9yIHdoZW4gYnVpbGRpbmcgYSBNb2RlbC4gRmFpbGVkIHRvIGRldGVybWluZSB0aGUgVmFsdWUgZm9yICR7a2V5fS4gRW5zdXJlICd2YWx1ZScgaXMgcHJvdmlkZWQgd2hlbiBjcmVhdGluZyB0aGUgTW9kZWwuYClcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYodHlwZW9mIHZhbHVlLnR5cGUgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgRW5jb3VudGVyZWQgYW4gZXJyb3Igd2hlbiBidWlsZGluZyBhIE1vZGVsLiBFeHBlY3RlZCAndHlwZScgdG8gYmUgYSBmdW5jdGlvbiBmb3IgJHtrZXl9LiBSZWNlaXZlZCBhICR7dHlwZW9mIHZhbHVlLnR5cGV9IGluc3RlYWQuYClcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IHR5cGVzID0gbmV3IFR5cGVTb3VyY2UoY29udGV4dClcbiAgICAgICAgICAgIGxldCB0eXBlID0gdmFsdWUudHlwZSh0eXBlcylcblxuICAgICAgICAgICAgbGV0IHN1YlJlc29sdmU6IEV4Y2x1ZGU8TWVtYmVyVmFsdWUsIE1lbWJlckluZm8+ID0gdmFsdWUudmFsdWUgYXMgRXhjbHVkZTxNZW1iZXJWYWx1ZSwgTWVtYmVySW5mbz5cblxuICAgICAgICAgICAgbGV0IHJlc29sdmVkVmFsdWUgPSBWYWx1ZVNvdXJjZS5yZXNvbHZlKHN1YlJlc29sdmUsIGNvbnRleHQsIGNyZWF0ZUNvbnRleHQpXG4gICAgICAgICAgICBsZXQgc3ltYm9scyA9IHZhbHVlLnN5bWJvbHMgfHwgbmV3IEFycmF5PFN5bWJvbEVudHJ5PigpXG5cbiAgICAgICAgICAgIGlmKCF0eXBlLmVxdWFscyhyZXNvbHZlZFZhbHVlLnR5cGUpKSB7XG4gICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEVuY291bnRlcmVkIGFuIGVycm9yIHdoZW4gZGV0ZXJtaW5pbmcgYSBNb2RlbCdzIHR5cGUuIFRoZSBkZWZhdWx0IHZhbHVlcyBwcm92aWRlZCBkbyBub3QgbWF0Y2ggdGhlIHR5cGUgcHJvdmlkZWQgZm9yICR7a2V5fS5gKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXN1bHRzLnB1c2gobmV3IE1lbWJlcihpZCwga2V5LCByZXNvbHZlZFZhbHVlLCBzeW1ib2xzKSlcbiAgICAgICAgIH1cbiAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbnN1cHBvcnRlZCB2YWx1ZSB3aGVuIHJlc29sdmluZyBhIHR5cGU6ICR7dHlwZW9mIHZhbHVlfWApXG4gICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXN1bHRzXG4gICB9XG59Il19