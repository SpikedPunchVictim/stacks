"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringValue = exports.StringType = void 0;
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
}
exports.StringValue = StringValue;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3RyaW5nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3ZhbHVlcy9TdHJpbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsaUNBQTREO0FBQzVELG1DQUFxQztBQUVyQyxNQUFhLFVBQVcsU0FBUSxnQkFBaUI7SUFHOUM7UUFDRyxLQUFLLENBQUMsY0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFBO0lBQ3hCLENBQUM7SUFFRCxLQUFLLENBQUMsUUFBUSxDQUFJLEdBQU07UUFDckIsSUFBSSxPQUFPLEdBQUcsT0FBTyxHQUFHLEtBQUssUUFBUSxDQUFBO1FBRXJDLElBQUcsT0FBTyxFQUFFO1lBQ1QsT0FBTyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQTtTQUMxQjthQUFNO1lBQ0osT0FBTyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLElBQUksS0FBSyxDQUFDLHlEQUF5RCxPQUFPLEdBQUcsR0FBRyxDQUFDLEVBQUMsQ0FBQTtTQUNwSDtJQUNKLENBQUM7O0FBZkosZ0NBZ0JDO0FBZmtCLG9CQUFTLEdBQWUsSUFBSSxVQUFVLEVBQUUsQ0FBQTtBQWlCM0QsTUFBYSxXQUFZLFNBQVEsa0JBQWtCO0lBQ2hELFlBQVksUUFBZ0IsRUFBRTtRQUMzQixLQUFLLENBQUMsVUFBVSxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQTtJQUNyQyxDQUFDO0NBQ0g7QUFKRCxrQ0FJQyIsInNvdXJjZXNDb250ZW50IjpbIlxuaW1wb3J0IHsgQmFzaWNUeXBlLCBUeXBlU2V0LCBWYWxpZGF0ZVJlc3VsdCB9IGZyb20gXCIuL1R5cGVcIjtcbmltcG9ydCB7IEJhc2ljVmFsdWUgfSBmcm9tIFwiLi9WYWx1ZVwiO1xuXG5leHBvcnQgY2xhc3MgU3RyaW5nVHlwZSBleHRlbmRzIEJhc2ljVHlwZTxudW1iZXI+IHtcbiAgIHN0YXRpYyByZWFkb25seSBTaW5nbGV0b246IFN0cmluZ1R5cGUgPSBuZXcgU3RyaW5nVHlwZSgpXG5cbiAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgc3VwZXIoVHlwZVNldC5TdHJpbmcpXG4gICB9XG5cbiAgIGFzeW5jIHZhbGlkYXRlPFQ+KG9iajogVCk6IFByb21pc2U8VmFsaWRhdGVSZXN1bHQ+IHtcbiAgICAgIGxldCBpc1ZhbGlkID0gdHlwZW9mIG9iaiA9PT0gJ3N0cmluZydcblxuICAgICAgaWYoaXNWYWxpZCkge1xuICAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBuZXcgRXJyb3IoYFR5cGUgZG9lcyBub3QgbWF0Y2guIEV4cGVjdGVkICdzdHJpbmcnIGFuZCByZWNlaWV2ZWQgJyR7dHlwZW9mIG9ian0nYCl9XG4gICAgICB9XG4gICB9XG59XG5cbmV4cG9ydCBjbGFzcyBTdHJpbmdWYWx1ZSBleHRlbmRzIEJhc2ljVmFsdWU8c3RyaW5nPiB7XG4gICBjb25zdHJ1Y3Rvcih2YWx1ZTogc3RyaW5nID0gJycpIHtcbiAgICAgIHN1cGVyKFN0cmluZ1R5cGUuU2luZ2xldG9uLCB2YWx1ZSlcbiAgIH1cbn0iXX0=