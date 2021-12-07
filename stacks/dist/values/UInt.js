"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIntSerializer = exports.UIntValue = exports.UIntType = void 0;
const ValueSerializer_1 = require("../serialize/ValueSerializer");
const Type_1 = require("./Type");
const Value_1 = require("./Value");
class UIntType extends Type_1.BasicType {
    constructor() {
        super(Type_1.TypeSet.UInt);
    }
    async validate(obj) {
        let isValid = typeof obj === 'number';
        //@ts-ignore
        let cast = obj;
        if (cast < 0) {
            return { success: false, error: new Error(`Cannot set a negative value for a UInt type. Received value ${obj}`) };
        }
        if (isValid) {
            return { success: true };
        }
        else {
            return { success: false, error: new Error(`Type does not match. Expected 'number' and receieved '${typeof obj}'`) };
        }
    }
}
exports.UIntType = UIntType;
UIntType.Singleton = new UIntType();
class UIntValue extends Value_1.BasicValue {
    constructor(value = 0) {
        super(UIntType.Singleton, value);
    }
    clone() {
        return new UIntValue(this.value);
    }
    async deserialize(value) {
        if (typeof value !== 'number') {
            throw new Error(`Cannot deserialize a ${typeof value}. Expected a number`);
        }
        if (value < 0) {
            throw new Error(`Failed to deserialize an unsigned number ${value}. The value is expected to be positive.`);
        }
        return new UIntValue(value);
    }
}
exports.UIntValue = UIntValue;
class UIntSerializer extends ValueSerializer_1.ValueSerializer {
    constructor() {
        super(Type_1.TypeSet.UInt);
    }
    async toJs(value) {
        this.validate(value.type);
        let int = value;
        return int.value;
    }
    async fromJs(type, obj) {
        this.validate(type);
        if (typeof obj !== 'number') {
            throw new Error(`The JS object type dfoes not match what's expected when serializing`);
        }
        let uint = obj;
        if (uint < 0) {
            throw new Error(`Encountered a negative value when serializing a UINT value`);
        }
        return new UIntValue(obj);
    }
}
exports.UIntSerializer = UIntSerializer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVUludC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy92YWx1ZXMvVUludC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxrRUFBK0Q7QUFDL0QsaUNBQW1FO0FBQ25FLG1DQUE2QztBQUU3QyxNQUFhLFFBQVMsU0FBUSxnQkFBaUI7SUFHNUM7UUFDRyxLQUFLLENBQUMsY0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQ3RCLENBQUM7SUFFRCxLQUFLLENBQUMsUUFBUSxDQUFJLEdBQU07UUFDckIsSUFBSSxPQUFPLEdBQUcsT0FBTyxHQUFHLEtBQUssUUFBUSxDQUFBO1FBRXJDLFlBQVk7UUFDWixJQUFJLElBQUksR0FBRyxHQUFhLENBQUE7UUFFeEIsSUFBSSxJQUFJLEdBQUcsQ0FBQyxFQUFFO1lBQ1gsT0FBTyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLElBQUksS0FBSyxDQUFDLCtEQUErRCxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUE7U0FDbkg7UUFFRCxJQUFJLE9BQU8sRUFBRTtZQUNWLE9BQU8sRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUE7U0FDMUI7YUFBTTtZQUNKLE9BQU8sRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxJQUFJLEtBQUssQ0FBQyx5REFBeUQsT0FBTyxHQUFHLEdBQUcsQ0FBQyxFQUFFLENBQUE7U0FDckg7SUFDSixDQUFDOztBQXRCSiw0QkF1QkM7QUF0QmtCLGtCQUFTLEdBQWEsSUFBSSxRQUFRLEVBQUUsQ0FBQTtBQXdCdkQsTUFBYSxTQUFVLFNBQVEsa0JBQWtCO0lBQzlDLFlBQVksUUFBZ0IsQ0FBQztRQUMxQixLQUFLLENBQUMsUUFBUSxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQTtJQUNuQyxDQUFDO0lBRUQsS0FBSztRQUNGLE9BQU8sSUFBSSxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO0lBQ25DLENBQUM7SUFFRCxLQUFLLENBQUMsV0FBVyxDQUFDLEtBQVU7UUFDekIsSUFBRyxPQUFPLEtBQUssS0FBSyxRQUFRLEVBQUU7WUFDM0IsTUFBTSxJQUFJLEtBQUssQ0FBQyx3QkFBd0IsT0FBTyxLQUFLLHFCQUFxQixDQUFDLENBQUE7U0FDNUU7UUFFRCxJQUFHLEtBQUssR0FBRyxDQUFDLEVBQUU7WUFDWCxNQUFNLElBQUksS0FBSyxDQUFDLDRDQUE0QyxLQUFLLHlDQUF5QyxDQUFDLENBQUE7U0FDN0c7UUFFRCxPQUFPLElBQUksU0FBUyxDQUFDLEtBQWUsQ0FBQyxDQUFBO0lBQ3hDLENBQUM7Q0FDSDtBQXBCRCw4QkFvQkM7QUFFRCxNQUFhLGNBQWUsU0FBUSxpQ0FBZTtJQUNoRDtRQUNHLEtBQUssQ0FBQyxjQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDdEIsQ0FBQztJQUVELEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBYTtRQUNyQixJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUV6QixJQUFJLEdBQUcsR0FBRyxLQUFrQixDQUFBO1FBQzVCLE9BQU8sR0FBRyxDQUFDLEtBQUssQ0FBQTtJQUNuQixDQUFDO0lBRUQsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFXLEVBQUUsR0FBUTtRQUMvQixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFBO1FBRW5CLElBQUcsT0FBTyxHQUFHLEtBQUssUUFBUSxFQUFFO1lBQ3pCLE1BQU0sSUFBSSxLQUFLLENBQUMscUVBQXFFLENBQUMsQ0FBQTtTQUN4RjtRQUVELElBQUksSUFBSSxHQUFHLEdBQWEsQ0FBQTtRQUV4QixJQUFHLElBQUksR0FBRyxDQUFDLEVBQUU7WUFDVixNQUFNLElBQUksS0FBSyxDQUFDLDREQUE0RCxDQUFDLENBQUE7U0FDL0U7UUFFRCxPQUFPLElBQUksU0FBUyxDQUFDLEdBQWEsQ0FBQyxDQUFBO0lBQ3RDLENBQUM7Q0FDSDtBQTNCRCx3Q0EyQkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBWYWx1ZVNlcmlhbGl6ZXIgfSBmcm9tIFwiLi4vc2VyaWFsaXplL1ZhbHVlU2VyaWFsaXplclwiO1xuaW1wb3J0IHsgQmFzaWNUeXBlLCBJVHlwZSwgVHlwZVNldCwgVmFsaWRhdGVSZXN1bHQgfSBmcm9tIFwiLi9UeXBlXCI7XG5pbXBvcnQgeyBCYXNpY1ZhbHVlLCBJVmFsdWUgfSBmcm9tIFwiLi9WYWx1ZVwiO1xuXG5leHBvcnQgY2xhc3MgVUludFR5cGUgZXh0ZW5kcyBCYXNpY1R5cGU8bnVtYmVyPiB7XG4gICBzdGF0aWMgcmVhZG9ubHkgU2luZ2xldG9uOiBVSW50VHlwZSA9IG5ldyBVSW50VHlwZSgpXG5cbiAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgc3VwZXIoVHlwZVNldC5VSW50KVxuICAgfVxuXG4gICBhc3luYyB2YWxpZGF0ZTxUPihvYmo6IFQpOiBQcm9taXNlPFZhbGlkYXRlUmVzdWx0PiB7XG4gICAgICBsZXQgaXNWYWxpZCA9IHR5cGVvZiBvYmogPT09ICdudW1iZXInXG5cbiAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgbGV0IGNhc3QgPSBvYmogYXMgbnVtYmVyXG5cbiAgICAgIGlmIChjYXN0IDwgMCkge1xuICAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBuZXcgRXJyb3IoYENhbm5vdCBzZXQgYSBuZWdhdGl2ZSB2YWx1ZSBmb3IgYSBVSW50IHR5cGUuIFJlY2VpdmVkIHZhbHVlICR7b2JqfWApIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGlzVmFsaWQpIHtcbiAgICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IHRydWUgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogbmV3IEVycm9yKGBUeXBlIGRvZXMgbm90IG1hdGNoLiBFeHBlY3RlZCAnbnVtYmVyJyBhbmQgcmVjZWlldmVkICcke3R5cGVvZiBvYmp9J2ApIH1cbiAgICAgIH1cbiAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFVJbnRWYWx1ZSBleHRlbmRzIEJhc2ljVmFsdWU8bnVtYmVyPiB7XG4gICBjb25zdHJ1Y3Rvcih2YWx1ZTogbnVtYmVyID0gMCkge1xuICAgICAgc3VwZXIoVUludFR5cGUuU2luZ2xldG9uLCB2YWx1ZSlcbiAgIH1cblxuICAgY2xvbmUoKTogSVZhbHVlIHtcbiAgICAgIHJldHVybiBuZXcgVUludFZhbHVlKHRoaXMudmFsdWUpXG4gICB9XG5cbiAgIGFzeW5jIGRlc2VyaWFsaXplKHZhbHVlOiBhbnkpOiBQcm9taXNlPElWYWx1ZT4ge1xuICAgICAgaWYodHlwZW9mIHZhbHVlICE9PSAnbnVtYmVyJykge1xuICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDYW5ub3QgZGVzZXJpYWxpemUgYSAke3R5cGVvZiB2YWx1ZX0uIEV4cGVjdGVkIGEgbnVtYmVyYClcbiAgICAgIH1cblxuICAgICAgaWYodmFsdWUgPCAwKSB7XG4gICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEZhaWxlZCB0byBkZXNlcmlhbGl6ZSBhbiB1bnNpZ25lZCBudW1iZXIgJHt2YWx1ZX0uIFRoZSB2YWx1ZSBpcyBleHBlY3RlZCB0byBiZSBwb3NpdGl2ZS5gKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gbmV3IFVJbnRWYWx1ZSh2YWx1ZSBhcyBudW1iZXIpXG4gICB9XG59XG5cbmV4cG9ydCBjbGFzcyBVSW50U2VyaWFsaXplciBleHRlbmRzIFZhbHVlU2VyaWFsaXplciB7XG4gICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgIHN1cGVyKFR5cGVTZXQuVUludClcbiAgIH1cblxuICAgYXN5bmMgdG9Kcyh2YWx1ZTogSVZhbHVlKTogUHJvbWlzZTxhbnk+IHtcbiAgICAgIHRoaXMudmFsaWRhdGUodmFsdWUudHlwZSlcblxuICAgICAgbGV0IGludCA9IHZhbHVlIGFzIFVJbnRWYWx1ZVxuICAgICAgcmV0dXJuIGludC52YWx1ZVxuICAgfVxuXG4gICBhc3luYyBmcm9tSnModHlwZTogSVR5cGUsIG9iajogYW55KTogUHJvbWlzZTxJVmFsdWU+IHtcbiAgICAgIHRoaXMudmFsaWRhdGUodHlwZSlcblxuICAgICAgaWYodHlwZW9mIG9iaiAhPT0gJ251bWJlcicpIHtcbiAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVGhlIEpTIG9iamVjdCB0eXBlIGRmb2VzIG5vdCBtYXRjaCB3aGF0J3MgZXhwZWN0ZWQgd2hlbiBzZXJpYWxpemluZ2ApXG4gICAgICB9XG5cbiAgICAgIGxldCB1aW50ID0gb2JqIGFzIG51bWJlclxuXG4gICAgICBpZih1aW50IDwgMCkge1xuICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBFbmNvdW50ZXJlZCBhIG5lZ2F0aXZlIHZhbHVlIHdoZW4gc2VyaWFsaXppbmcgYSBVSU5UIHZhbHVlYClcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG5ldyBVSW50VmFsdWUob2JqIGFzIG51bWJlcilcbiAgIH1cbn0iXX0=