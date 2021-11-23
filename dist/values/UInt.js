"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIntValue = exports.UIntType = void 0;
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
}
exports.UIntValue = UIntValue;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVUludC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy92YWx1ZXMvVUludC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxpQ0FBNEQ7QUFDNUQsbUNBQXFDO0FBRXJDLE1BQWEsUUFBUyxTQUFRLGdCQUFpQjtJQUc1QztRQUNHLEtBQUssQ0FBQyxjQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDdEIsQ0FBQztJQUVELEtBQUssQ0FBQyxRQUFRLENBQUksR0FBTTtRQUNyQixJQUFJLE9BQU8sR0FBRyxPQUFPLEdBQUcsS0FBSyxRQUFRLENBQUE7UUFFckMsWUFBWTtRQUNaLElBQUksSUFBSSxHQUFHLEdBQWEsQ0FBQTtRQUV4QixJQUFJLElBQUksR0FBRyxDQUFDLEVBQUU7WUFDWCxPQUFPLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsSUFBSSxLQUFLLENBQUMsK0RBQStELEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQTtTQUNuSDtRQUVELElBQUksT0FBTyxFQUFFO1lBQ1YsT0FBTyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQTtTQUMxQjthQUFNO1lBQ0osT0FBTyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLElBQUksS0FBSyxDQUFDLHlEQUF5RCxPQUFPLEdBQUcsR0FBRyxDQUFDLEVBQUUsQ0FBQTtTQUNySDtJQUNKLENBQUM7O0FBdEJKLDRCQXVCQztBQXRCa0Isa0JBQVMsR0FBYSxJQUFJLFFBQVEsRUFBRSxDQUFBO0FBd0J2RCxNQUFhLFNBQVUsU0FBUSxrQkFBa0I7SUFDOUMsWUFBWSxRQUFnQixDQUFDO1FBQzFCLEtBQUssQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFBO0lBQ25DLENBQUM7Q0FDSDtBQUpELDhCQUlDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQmFzaWNUeXBlLCBUeXBlU2V0LCBWYWxpZGF0ZVJlc3VsdCB9IGZyb20gXCIuL1R5cGVcIjtcbmltcG9ydCB7IEJhc2ljVmFsdWUgfSBmcm9tIFwiLi9WYWx1ZVwiO1xuXG5leHBvcnQgY2xhc3MgVUludFR5cGUgZXh0ZW5kcyBCYXNpY1R5cGU8bnVtYmVyPiB7XG4gICBzdGF0aWMgcmVhZG9ubHkgU2luZ2xldG9uOiBVSW50VHlwZSA9IG5ldyBVSW50VHlwZSgpXG5cbiAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgc3VwZXIoVHlwZVNldC5VSW50KVxuICAgfVxuXG4gICBhc3luYyB2YWxpZGF0ZTxUPihvYmo6IFQpOiBQcm9taXNlPFZhbGlkYXRlUmVzdWx0PiB7XG4gICAgICBsZXQgaXNWYWxpZCA9IHR5cGVvZiBvYmogPT09ICdudW1iZXInXG5cbiAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgbGV0IGNhc3QgPSBvYmogYXMgbnVtYmVyXG5cbiAgICAgIGlmIChjYXN0IDwgMCkge1xuICAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBuZXcgRXJyb3IoYENhbm5vdCBzZXQgYSBuZWdhdGl2ZSB2YWx1ZSBmb3IgYSBVSW50IHR5cGUuIFJlY2VpdmVkIHZhbHVlICR7b2JqfWApIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGlzVmFsaWQpIHtcbiAgICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IHRydWUgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogbmV3IEVycm9yKGBUeXBlIGRvZXMgbm90IG1hdGNoLiBFeHBlY3RlZCAnbnVtYmVyJyBhbmQgcmVjZWlldmVkICcke3R5cGVvZiBvYmp9J2ApIH1cbiAgICAgIH1cbiAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFVJbnRWYWx1ZSBleHRlbmRzIEJhc2ljVmFsdWU8bnVtYmVyPiB7XG4gICBjb25zdHJ1Y3Rvcih2YWx1ZTogbnVtYmVyID0gMCkge1xuICAgICAgc3VwZXIoVUludFR5cGUuU2luZ2xldG9uLCB2YWx1ZSlcbiAgIH1cbn0iXX0=