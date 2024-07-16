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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQm9vbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy92YWx1ZXMvQm9vbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxrRUFBK0Q7QUFDL0QsaUNBQW1FO0FBQ25FLG1DQUE2QztBQUc3QyxNQUFhLFFBQVMsU0FBUSxnQkFBa0I7SUFHN0M7UUFDRyxLQUFLLENBQUMsY0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQ3RCLENBQUM7SUFFRCxLQUFLLENBQUMsUUFBUSxDQUFJLEdBQU07UUFDckIsSUFBSSxPQUFPLEdBQUcsT0FBTyxHQUFHLEtBQUssU0FBUyxDQUFBO1FBRXRDLElBQUcsT0FBTyxFQUFFLENBQUM7WUFDVixPQUFPLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFBO1FBQzNCLENBQUM7YUFBTSxDQUFDO1lBQ0wsT0FBTyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLElBQUksS0FBSyxDQUFDLDBEQUEwRCxPQUFPLEdBQUcsR0FBRyxDQUFDLEVBQUMsQ0FBQTtRQUN0SCxDQUFDO0lBQ0osQ0FBQzs7QUFmSiw0QkFnQkM7QUFma0Isa0JBQVMsR0FBYSxJQUFJLFFBQVEsRUFBRSxDQUFBO0FBaUJ2RCxNQUFhLFNBQVUsU0FBUSxrQkFBbUI7SUFDL0MsWUFBWSxRQUFpQixJQUFJO1FBQzlCLEtBQUssQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFBO0lBQ25DLENBQUM7SUFFRCxLQUFLO1FBQ0YsT0FBTyxJQUFJLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7SUFDbkMsQ0FBQztJQUVELEtBQUssQ0FBQyxXQUFXLENBQUMsS0FBVTtRQUN6QixJQUFHLE9BQU8sS0FBSyxLQUFLLFFBQVEsRUFBRSxDQUFDO1lBQzVCLE9BQU8sSUFBSSxTQUFTLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRSxLQUFLLE1BQU0sQ0FBQyxDQUFBO1FBQ3ZELENBQUM7UUFFRCxPQUFPLElBQUksU0FBUyxDQUFDLEtBQWdCLENBQUMsQ0FBQTtJQUN6QyxDQUFDO0NBQ0g7QUFoQkQsOEJBZ0JDO0FBR0QsTUFBYSxjQUFlLFNBQVEsaUNBQWU7SUFDaEQ7UUFDRyxLQUFLLENBQUMsY0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQ3RCLENBQUM7SUFFRCxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQWE7UUFDckIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUE7UUFFekIsSUFBSSxJQUFJLEdBQUcsS0FBa0IsQ0FBQTtRQUM3QixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUE7SUFDcEIsQ0FBQztJQUVELEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBVyxFQUFFLEdBQVE7UUFDL0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUVuQixJQUFHLE9BQU8sR0FBRyxLQUFLLFNBQVMsRUFBRSxDQUFDO1lBQzNCLE1BQU0sSUFBSSxLQUFLLENBQUMsb0VBQW9FLENBQUMsQ0FBQTtRQUN4RixDQUFDO1FBRUQsT0FBTyxJQUFJLFNBQVMsQ0FBQyxHQUFjLENBQUMsQ0FBQTtJQUN2QyxDQUFDO0NBQ0g7QUFyQkQsd0NBcUJDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVmFsdWVTZXJpYWxpemVyIH0gZnJvbSBcIi4uL3NlcmlhbGl6ZS9WYWx1ZVNlcmlhbGl6ZXJcIjtcbmltcG9ydCB7IEJhc2ljVHlwZSwgSVR5cGUsIFR5cGVTZXQsIFZhbGlkYXRlUmVzdWx0IH0gZnJvbSBcIi4vVHlwZVwiO1xuaW1wb3J0IHsgQmFzaWNWYWx1ZSwgSVZhbHVlIH0gZnJvbSBcIi4vVmFsdWVcIjtcblxuXG5leHBvcnQgY2xhc3MgQm9vbFR5cGUgZXh0ZW5kcyBCYXNpY1R5cGU8Ym9vbGVhbj4ge1xuICAgc3RhdGljIHJlYWRvbmx5IFNpbmdsZXRvbjogQm9vbFR5cGUgPSBuZXcgQm9vbFR5cGUoKVxuXG4gICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgIHN1cGVyKFR5cGVTZXQuQm9vbClcbiAgIH1cblxuICAgYXN5bmMgdmFsaWRhdGU8VD4ob2JqOiBUKTogUHJvbWlzZTxWYWxpZGF0ZVJlc3VsdD4ge1xuICAgICAgbGV0IGlzVmFsaWQgPSB0eXBlb2Ygb2JqID09PSAnYm9vbGVhbidcblxuICAgICAgaWYoaXNWYWxpZCkge1xuICAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBuZXcgRXJyb3IoYFR5cGUgZG9lcyBub3QgbWF0Y2guIEV4cGVjdGVkICdib29sZWFuJyBhbmQgcmVjZWlldmVkICcke3R5cGVvZiBvYmp9J2ApfVxuICAgICAgfVxuICAgfVxufVxuXG5leHBvcnQgY2xhc3MgQm9vbFZhbHVlIGV4dGVuZHMgQmFzaWNWYWx1ZTxib29sZWFuPiB7XG4gICBjb25zdHJ1Y3Rvcih2YWx1ZTogYm9vbGVhbiA9IHRydWUpIHtcbiAgICAgIHN1cGVyKEJvb2xUeXBlLlNpbmdsZXRvbiwgdmFsdWUpXG4gICB9XG5cbiAgIGNsb25lKCk6IElWYWx1ZSB7XG4gICAgICByZXR1cm4gbmV3IEJvb2xWYWx1ZSh0aGlzLnZhbHVlKVxuICAgfVxuXG4gICBhc3luYyBkZXNlcmlhbGl6ZSh2YWx1ZTogYW55KTogUHJvbWlzZTxJVmFsdWU+IHtcbiAgICAgIGlmKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgIHJldHVybiBuZXcgQm9vbFZhbHVlKHZhbHVlLnRvTG93ZXJDYXNlKCkgPT09ICd0cnVlJylcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG5ldyBCb29sVmFsdWUodmFsdWUgYXMgYm9vbGVhbilcbiAgIH1cbn1cblxuXG5leHBvcnQgY2xhc3MgQm9vbFNlcmlhbGl6ZXIgZXh0ZW5kcyBWYWx1ZVNlcmlhbGl6ZXIge1xuICAgY29uc3RydWN0b3IoKSB7XG4gICAgICBzdXBlcihUeXBlU2V0LkJvb2wpXG4gICB9XG5cbiAgIGFzeW5jIHRvSnModmFsdWU6IElWYWx1ZSk6IFByb21pc2U8YW55PiB7XG4gICAgICB0aGlzLnZhbGlkYXRlKHZhbHVlLnR5cGUpXG5cbiAgICAgIGxldCBib29sID0gdmFsdWUgYXMgQm9vbFZhbHVlXG4gICAgICByZXR1cm4gYm9vbC52YWx1ZVxuICAgfVxuXG4gICBhc3luYyBmcm9tSnModHlwZTogSVR5cGUsIG9iajogYW55KTogUHJvbWlzZTxJVmFsdWU+IHtcbiAgICAgIHRoaXMudmFsaWRhdGUodHlwZSlcblxuICAgICAgaWYodHlwZW9mIG9iaiAhPT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFRoZSBKUyBvYmplY3QgdHlwZSBkb2VzIG5vdCBtYXRjaCB3aGF0J3MgZXhwZWN0ZWQgd2hlbiBzZXJpYWxpemluZ2ApXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBuZXcgQm9vbFZhbHVlKG9iaiBhcyBib29sZWFuKVxuICAgfVxufVxuIl19