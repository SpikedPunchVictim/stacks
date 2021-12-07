"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoolSerializer = exports.BoolValue = exports.BoolType = void 0;
const ValueSerializer_1 = require("../serialize/ValueSerializer");
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
    clone() {
        return new BoolValue(this.value);
    }
    async deserialize(value) {
        if (typeof value === 'string') {
            return new BoolValue(value.toLowerCase() === 'true');
        }
        return new BoolValue(value);
    }
}
exports.BoolValue = BoolValue;
class BoolSerializer extends ValueSerializer_1.ValueSerializer {
    constructor() {
        super(Type_1.TypeSet.Bool);
    }
    async toJs(value) {
        this.validate(value.type);
        let bool = value;
        return bool.value;
    }
    async fromJs(type, obj) {
        this.validate(type);
        if (typeof obj !== 'boolean') {
            throw new Error(`The JS object type does not match what's expected when serializing`);
        }
        return new BoolValue(obj);
    }
}
exports.BoolSerializer = BoolSerializer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQm9vbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy92YWx1ZXMvQm9vbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxrRUFBK0Q7QUFDL0QsaUNBQW1FO0FBQ25FLG1DQUE2QztBQUc3QyxNQUFhLFFBQVMsU0FBUSxnQkFBa0I7SUFHN0M7UUFDRyxLQUFLLENBQUMsY0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQ3RCLENBQUM7SUFFRCxLQUFLLENBQUMsUUFBUSxDQUFJLEdBQU07UUFDckIsSUFBSSxPQUFPLEdBQUcsT0FBTyxHQUFHLEtBQUssU0FBUyxDQUFBO1FBRXRDLElBQUcsT0FBTyxFQUFFO1lBQ1QsT0FBTyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQTtTQUMxQjthQUFNO1lBQ0osT0FBTyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLElBQUksS0FBSyxDQUFDLDBEQUEwRCxPQUFPLEdBQUcsR0FBRyxDQUFDLEVBQUMsQ0FBQTtTQUNySDtJQUNKLENBQUM7O0FBZkosNEJBZ0JDO0FBZmtCLGtCQUFTLEdBQWEsSUFBSSxRQUFRLEVBQUUsQ0FBQTtBQWlCdkQsTUFBYSxTQUFVLFNBQVEsa0JBQW1CO0lBQy9DLFlBQVksUUFBaUIsSUFBSTtRQUM5QixLQUFLLENBQUMsUUFBUSxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQTtJQUNuQyxDQUFDO0lBRUQsS0FBSztRQUNGLE9BQU8sSUFBSSxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO0lBQ25DLENBQUM7SUFFRCxLQUFLLENBQUMsV0FBVyxDQUFDLEtBQVU7UUFDekIsSUFBRyxPQUFPLEtBQUssS0FBSyxRQUFRLEVBQUU7WUFDM0IsT0FBTyxJQUFJLFNBQVMsQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLEtBQUssTUFBTSxDQUFDLENBQUE7U0FDdEQ7UUFFRCxPQUFPLElBQUksU0FBUyxDQUFDLEtBQWdCLENBQUMsQ0FBQTtJQUN6QyxDQUFDO0NBQ0g7QUFoQkQsOEJBZ0JDO0FBR0QsTUFBYSxjQUFlLFNBQVEsaUNBQWU7SUFDaEQ7UUFDRyxLQUFLLENBQUMsY0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQ3RCLENBQUM7SUFFRCxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQWE7UUFDckIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUE7UUFFekIsSUFBSSxJQUFJLEdBQUcsS0FBa0IsQ0FBQTtRQUM3QixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUE7SUFDcEIsQ0FBQztJQUVELEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBVyxFQUFFLEdBQVE7UUFDL0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUVuQixJQUFHLE9BQU8sR0FBRyxLQUFLLFNBQVMsRUFBRTtZQUMxQixNQUFNLElBQUksS0FBSyxDQUFDLG9FQUFvRSxDQUFDLENBQUE7U0FDdkY7UUFFRCxPQUFPLElBQUksU0FBUyxDQUFDLEdBQWMsQ0FBQyxDQUFBO0lBQ3ZDLENBQUM7Q0FDSDtBQXJCRCx3Q0FxQkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBWYWx1ZVNlcmlhbGl6ZXIgfSBmcm9tIFwiLi4vc2VyaWFsaXplL1ZhbHVlU2VyaWFsaXplclwiO1xuaW1wb3J0IHsgQmFzaWNUeXBlLCBJVHlwZSwgVHlwZVNldCwgVmFsaWRhdGVSZXN1bHQgfSBmcm9tIFwiLi9UeXBlXCI7XG5pbXBvcnQgeyBCYXNpY1ZhbHVlLCBJVmFsdWUgfSBmcm9tIFwiLi9WYWx1ZVwiO1xuXG5cbmV4cG9ydCBjbGFzcyBCb29sVHlwZSBleHRlbmRzIEJhc2ljVHlwZTxib29sZWFuPiB7XG4gICBzdGF0aWMgcmVhZG9ubHkgU2luZ2xldG9uOiBCb29sVHlwZSA9IG5ldyBCb29sVHlwZSgpXG5cbiAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgc3VwZXIoVHlwZVNldC5Cb29sKVxuICAgfVxuXG4gICBhc3luYyB2YWxpZGF0ZTxUPihvYmo6IFQpOiBQcm9taXNlPFZhbGlkYXRlUmVzdWx0PiB7XG4gICAgICBsZXQgaXNWYWxpZCA9IHR5cGVvZiBvYmogPT09ICdib29sZWFuJ1xuXG4gICAgICBpZihpc1ZhbGlkKSB7XG4gICAgICAgICByZXR1cm4geyBzdWNjZXNzOiB0cnVlIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IG5ldyBFcnJvcihgVHlwZSBkb2VzIG5vdCBtYXRjaC4gRXhwZWN0ZWQgJ2Jvb2xlYW4nIGFuZCByZWNlaWV2ZWQgJyR7dHlwZW9mIG9ian0nYCl9XG4gICAgICB9XG4gICB9XG59XG5cbmV4cG9ydCBjbGFzcyBCb29sVmFsdWUgZXh0ZW5kcyBCYXNpY1ZhbHVlPGJvb2xlYW4+IHtcbiAgIGNvbnN0cnVjdG9yKHZhbHVlOiBib29sZWFuID0gdHJ1ZSkge1xuICAgICAgc3VwZXIoQm9vbFR5cGUuU2luZ2xldG9uLCB2YWx1ZSlcbiAgIH1cblxuICAgY2xvbmUoKTogSVZhbHVlIHtcbiAgICAgIHJldHVybiBuZXcgQm9vbFZhbHVlKHRoaXMudmFsdWUpXG4gICB9XG5cbiAgIGFzeW5jIGRlc2VyaWFsaXplKHZhbHVlOiBhbnkpOiBQcm9taXNlPElWYWx1ZT4ge1xuICAgICAgaWYodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgICAgICAgcmV0dXJuIG5ldyBCb29sVmFsdWUodmFsdWUudG9Mb3dlckNhc2UoKSA9PT0gJ3RydWUnKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gbmV3IEJvb2xWYWx1ZSh2YWx1ZSBhcyBib29sZWFuKVxuICAgfVxufVxuXG5cbmV4cG9ydCBjbGFzcyBCb29sU2VyaWFsaXplciBleHRlbmRzIFZhbHVlU2VyaWFsaXplciB7XG4gICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgIHN1cGVyKFR5cGVTZXQuQm9vbClcbiAgIH1cblxuICAgYXN5bmMgdG9Kcyh2YWx1ZTogSVZhbHVlKTogUHJvbWlzZTxhbnk+IHtcbiAgICAgIHRoaXMudmFsaWRhdGUodmFsdWUudHlwZSlcblxuICAgICAgbGV0IGJvb2wgPSB2YWx1ZSBhcyBCb29sVmFsdWVcbiAgICAgIHJldHVybiBib29sLnZhbHVlXG4gICB9XG5cbiAgIGFzeW5jIGZyb21Kcyh0eXBlOiBJVHlwZSwgb2JqOiBhbnkpOiBQcm9taXNlPElWYWx1ZT4ge1xuICAgICAgdGhpcy52YWxpZGF0ZSh0eXBlKVxuXG4gICAgICBpZih0eXBlb2Ygb2JqICE9PSAnYm9vbGVhbicpIHtcbiAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVGhlIEpTIG9iamVjdCB0eXBlIGRvZXMgbm90IG1hdGNoIHdoYXQncyBleHBlY3RlZCB3aGVuIHNlcmlhbGl6aW5nYClcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG5ldyBCb29sVmFsdWUob2JqIGFzIGJvb2xlYW4pXG4gICB9XG59XG4iXX0=