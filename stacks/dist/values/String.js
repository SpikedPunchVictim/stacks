"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringSerializer = exports.StringValue = exports.StringType = void 0;
const ValueSerializer_1 = require("../serialize/ValueSerializer");
const Type_1 = require("./Type");
const Value_1 = require("./Value");
class StringType extends Type_1.BasicType {
    constructor() {
        super(Type_1.TypeSet.String);
    }
    async validate(obj) {
        let isValid = typeof obj === 'string';
        if (isValid) {
            return { success: true };
        }
        else {
            return { success: false, error: new Error(`Type does not match. Expected 'string' and receieved '${typeof obj}'`) };
        }
    }
}
exports.StringType = StringType;
StringType.Singleton = new StringType();
class StringValue extends Value_1.BasicValue {
    constructor(value = '') {
        super(StringType.Singleton, value);
    }
    clone() {
        return new StringValue(this.value);
    }
}
exports.StringValue = StringValue;
class StringSerializer extends ValueSerializer_1.ValueSerializer {
    constructor() {
        super(Type_1.TypeSet.String);
    }
    async toJs(value) {
        this.validate(value.type);
        let str = value;
        return str.value;
    }
    async fromJs(type, obj) {
        this.validate(type);
        if (typeof obj !== 'string') {
            throw new Error(`The JS object type does not match what's expected when serializing`);
        }
        return new StringValue(obj);
    }
}
exports.StringSerializer = StringSerializer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3RyaW5nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3ZhbHVlcy9TdHJpbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0Esa0VBQStEO0FBQy9ELGlDQUFtRTtBQUNuRSxtQ0FBNkM7QUFFN0MsTUFBYSxVQUFXLFNBQVEsZ0JBQWlCO0lBRzlDO1FBQ0csS0FBSyxDQUFDLGNBQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTtJQUN4QixDQUFDO0lBRUQsS0FBSyxDQUFDLFFBQVEsQ0FBSSxHQUFNO1FBQ3JCLElBQUksT0FBTyxHQUFHLE9BQU8sR0FBRyxLQUFLLFFBQVEsQ0FBQTtRQUVyQyxJQUFHLE9BQU8sRUFBRTtZQUNULE9BQU8sRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUE7U0FDMUI7YUFBTTtZQUNKLE9BQU8sRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxJQUFJLEtBQUssQ0FBQyx5REFBeUQsT0FBTyxHQUFHLEdBQUcsQ0FBQyxFQUFDLENBQUE7U0FDcEg7SUFDSixDQUFDOztBQWZKLGdDQWdCQztBQWZrQixvQkFBUyxHQUFlLElBQUksVUFBVSxFQUFFLENBQUE7QUFpQjNELE1BQWEsV0FBWSxTQUFRLGtCQUFrQjtJQUNoRCxZQUFZLFFBQWdCLEVBQUU7UUFDM0IsS0FBSyxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUE7SUFDckMsQ0FBQztJQUVELEtBQUs7UUFDRixPQUFPLElBQUksV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtJQUNyQyxDQUFDO0NBQ0g7QUFSRCxrQ0FRQztBQUVELE1BQWEsZ0JBQWlCLFNBQVEsaUNBQWU7SUFDbEQ7UUFDRyxLQUFLLENBQUMsY0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFBO0lBQ3hCLENBQUM7SUFFRCxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQWE7UUFDckIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUE7UUFFekIsSUFBSSxHQUFHLEdBQUcsS0FBb0IsQ0FBQTtRQUM5QixPQUFPLEdBQUcsQ0FBQyxLQUFLLENBQUE7SUFDbkIsQ0FBQztJQUVELEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBVyxFQUFFLEdBQVE7UUFDL0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUVuQixJQUFHLE9BQU8sR0FBRyxLQUFLLFFBQVEsRUFBRTtZQUN6QixNQUFNLElBQUksS0FBSyxDQUFDLG9FQUFvRSxDQUFDLENBQUE7U0FDdkY7UUFFRCxPQUFPLElBQUksV0FBVyxDQUFDLEdBQWEsQ0FBQyxDQUFBO0lBQ3hDLENBQUM7Q0FDSDtBQXJCRCw0Q0FxQkMiLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCB7IFZhbHVlU2VyaWFsaXplciB9IGZyb20gXCIuLi9zZXJpYWxpemUvVmFsdWVTZXJpYWxpemVyXCI7XG5pbXBvcnQgeyBCYXNpY1R5cGUsIElUeXBlLCBUeXBlU2V0LCBWYWxpZGF0ZVJlc3VsdCB9IGZyb20gXCIuL1R5cGVcIjtcbmltcG9ydCB7IEJhc2ljVmFsdWUsIElWYWx1ZSB9IGZyb20gXCIuL1ZhbHVlXCI7XG5cbmV4cG9ydCBjbGFzcyBTdHJpbmdUeXBlIGV4dGVuZHMgQmFzaWNUeXBlPG51bWJlcj4ge1xuICAgc3RhdGljIHJlYWRvbmx5IFNpbmdsZXRvbjogU3RyaW5nVHlwZSA9IG5ldyBTdHJpbmdUeXBlKClcblxuICAgY29uc3RydWN0b3IoKSB7XG4gICAgICBzdXBlcihUeXBlU2V0LlN0cmluZylcbiAgIH1cblxuICAgYXN5bmMgdmFsaWRhdGU8VD4ob2JqOiBUKTogUHJvbWlzZTxWYWxpZGF0ZVJlc3VsdD4ge1xuICAgICAgbGV0IGlzVmFsaWQgPSB0eXBlb2Ygb2JqID09PSAnc3RyaW5nJ1xuXG4gICAgICBpZihpc1ZhbGlkKSB7XG4gICAgICAgICByZXR1cm4geyBzdWNjZXNzOiB0cnVlIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IG5ldyBFcnJvcihgVHlwZSBkb2VzIG5vdCBtYXRjaC4gRXhwZWN0ZWQgJ3N0cmluZycgYW5kIHJlY2VpZXZlZCAnJHt0eXBlb2Ygb2JqfSdgKX1cbiAgICAgIH1cbiAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFN0cmluZ1ZhbHVlIGV4dGVuZHMgQmFzaWNWYWx1ZTxzdHJpbmc+IHtcbiAgIGNvbnN0cnVjdG9yKHZhbHVlOiBzdHJpbmcgPSAnJykge1xuICAgICAgc3VwZXIoU3RyaW5nVHlwZS5TaW5nbGV0b24sIHZhbHVlKVxuICAgfVxuXG4gICBjbG9uZSgpOiBJVmFsdWUge1xuICAgICAgcmV0dXJuIG5ldyBTdHJpbmdWYWx1ZSh0aGlzLnZhbHVlKVxuICAgfVxufVxuXG5leHBvcnQgY2xhc3MgU3RyaW5nU2VyaWFsaXplciBleHRlbmRzIFZhbHVlU2VyaWFsaXplciB7XG4gICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgIHN1cGVyKFR5cGVTZXQuU3RyaW5nKVxuICAgfVxuXG4gICBhc3luYyB0b0pzKHZhbHVlOiBJVmFsdWUpOiBQcm9taXNlPGFueT4ge1xuICAgICAgdGhpcy52YWxpZGF0ZSh2YWx1ZS50eXBlKVxuXG4gICAgICBsZXQgc3RyID0gdmFsdWUgYXMgU3RyaW5nVmFsdWVcbiAgICAgIHJldHVybiBzdHIudmFsdWVcbiAgIH1cblxuICAgYXN5bmMgZnJvbUpzKHR5cGU6IElUeXBlLCBvYmo6IGFueSk6IFByb21pc2U8SVZhbHVlPiB7XG4gICAgICB0aGlzLnZhbGlkYXRlKHR5cGUpXG5cbiAgICAgIGlmKHR5cGVvZiBvYmogIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFRoZSBKUyBvYmplY3QgdHlwZSBkb2VzIG5vdCBtYXRjaCB3aGF0J3MgZXhwZWN0ZWQgd2hlbiBzZXJpYWxpemluZ2ApXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBuZXcgU3RyaW5nVmFsdWUob2JqIGFzIHN0cmluZylcbiAgIH1cbn0iXX0=