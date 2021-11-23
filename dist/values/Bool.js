"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoolValue = exports.BoolType = void 0;
const Type_1 = require("./Type");
const Value_1 = require("./Value");
class BoolType extends Type_1.BasicType {
    constructor() {
        super(Type_1.TypeSet.Bool);
    }
    async validate(obj) {
        let isValid = typeof obj === 'boolean';
        if (isValid) {
            return { success: true };
        }
        else {
            return { success: false, error: new Error(`Type does not match. Expected 'boolean' and receieved '${typeof obj}'`) };
        }
    }
}
exports.BoolType = BoolType;
BoolType.Singleton = new BoolType();
class BoolValue extends Value_1.BasicValue {
    constructor(value = true) {
        super(BoolType.Singleton, value);
    }
}
exports.BoolValue = BoolValue;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQm9vbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy92YWx1ZXMvQm9vbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxpQ0FBNEQ7QUFDNUQsbUNBQXFDO0FBR3JDLE1BQWEsUUFBUyxTQUFRLGdCQUFrQjtJQUc3QztRQUNHLEtBQUssQ0FBQyxjQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDdEIsQ0FBQztJQUVELEtBQUssQ0FBQyxRQUFRLENBQUksR0FBTTtRQUNyQixJQUFJLE9BQU8sR0FBRyxPQUFPLEdBQUcsS0FBSyxTQUFTLENBQUE7UUFFdEMsSUFBRyxPQUFPLEVBQUU7WUFDVCxPQUFPLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFBO1NBQzFCO2FBQU07WUFDSixPQUFPLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsSUFBSSxLQUFLLENBQUMsMERBQTBELE9BQU8sR0FBRyxHQUFHLENBQUMsRUFBQyxDQUFBO1NBQ3JIO0lBQ0osQ0FBQzs7QUFmSiw0QkFnQkM7QUFma0Isa0JBQVMsR0FBYSxJQUFJLFFBQVEsRUFBRSxDQUFBO0FBaUJ2RCxNQUFhLFNBQVUsU0FBUSxrQkFBbUI7SUFDL0MsWUFBWSxRQUFpQixJQUFJO1FBQzlCLEtBQUssQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFBO0lBQ25DLENBQUM7Q0FDSDtBQUpELDhCQUlDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQmFzaWNUeXBlLCBUeXBlU2V0LCBWYWxpZGF0ZVJlc3VsdCB9IGZyb20gXCIuL1R5cGVcIjtcbmltcG9ydCB7IEJhc2ljVmFsdWUgfSBmcm9tIFwiLi9WYWx1ZVwiO1xuXG5cbmV4cG9ydCBjbGFzcyBCb29sVHlwZSBleHRlbmRzIEJhc2ljVHlwZTxib29sZWFuPiB7XG4gICBzdGF0aWMgcmVhZG9ubHkgU2luZ2xldG9uOiBCb29sVHlwZSA9IG5ldyBCb29sVHlwZSgpXG5cbiAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgc3VwZXIoVHlwZVNldC5Cb29sKVxuICAgfVxuXG4gICBhc3luYyB2YWxpZGF0ZTxUPihvYmo6IFQpOiBQcm9taXNlPFZhbGlkYXRlUmVzdWx0PiB7XG4gICAgICBsZXQgaXNWYWxpZCA9IHR5cGVvZiBvYmogPT09ICdib29sZWFuJ1xuXG4gICAgICBpZihpc1ZhbGlkKSB7XG4gICAgICAgICByZXR1cm4geyBzdWNjZXNzOiB0cnVlIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IG5ldyBFcnJvcihgVHlwZSBkb2VzIG5vdCBtYXRjaC4gRXhwZWN0ZWQgJ2Jvb2xlYW4nIGFuZCByZWNlaWV2ZWQgJyR7dHlwZW9mIG9ian0nYCl9XG4gICAgICB9XG4gICB9XG59XG5cbmV4cG9ydCBjbGFzcyBCb29sVmFsdWUgZXh0ZW5kcyBCYXNpY1ZhbHVlPGJvb2xlYW4+IHtcbiAgIGNvbnN0cnVjdG9yKHZhbHVlOiBib29sZWFuID0gdHJ1ZSkge1xuICAgICAgc3VwZXIoQm9vbFR5cGUuU2luZ2xldG9uLCB2YWx1ZSlcbiAgIH1cbn1cblxuIl19