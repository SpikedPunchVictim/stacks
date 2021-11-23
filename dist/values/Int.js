"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntValue = exports.IntType = void 0;
const Type_1 = require("./Type");
const Value_1 = require("./Value");
class IntType extends Type_1.BasicType {
    constructor() {
        super(Type_1.TypeSet.Int);
    }
    async validate(obj) {
        let isValid = typeof obj === 'number';
        if (isValid) {
            return { success: true };
        }
        else {
            return { success: false, error: new Error(`Type does not match. Expected 'number' and receieved '${typeof obj}'`) };
        }
    }
}
exports.IntType = IntType;
IntType.Singleton = new IntType();
class IntValue extends Value_1.BasicValue {
    constructor(value = 0) {
        super(IntType.Singleton, value);
    }
}
exports.IntValue = IntValue;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3ZhbHVlcy9JbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsaUNBQTREO0FBQzVELG1DQUFxQztBQUVyQyxNQUFhLE9BQVEsU0FBUSxnQkFBaUI7SUFHM0M7UUFDRyxLQUFLLENBQUMsY0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFBO0lBQ3JCLENBQUM7SUFFRCxLQUFLLENBQUMsUUFBUSxDQUFJLEdBQU07UUFDckIsSUFBSSxPQUFPLEdBQUcsT0FBTyxHQUFHLEtBQUssUUFBUSxDQUFBO1FBRXJDLElBQUcsT0FBTyxFQUFFO1lBQ1QsT0FBTyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQTtTQUMxQjthQUFNO1lBQ0osT0FBTyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLElBQUksS0FBSyxDQUFDLHlEQUF5RCxPQUFPLEdBQUcsR0FBRyxDQUFDLEVBQUMsQ0FBQTtTQUNwSDtJQUNKLENBQUM7O0FBZkosMEJBZ0JDO0FBZmtCLGlCQUFTLEdBQVksSUFBSSxPQUFPLEVBQUUsQ0FBQTtBQWlCckQsTUFBYSxRQUFTLFNBQVEsa0JBQWtCO0lBQzdDLFlBQVksUUFBZ0IsQ0FBQztRQUMxQixLQUFLLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQTtJQUNsQyxDQUFDO0NBQ0g7QUFKRCw0QkFJQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEJhc2ljVHlwZSwgVHlwZVNldCwgVmFsaWRhdGVSZXN1bHQgfSBmcm9tIFwiLi9UeXBlXCI7XG5pbXBvcnQgeyBCYXNpY1ZhbHVlIH0gZnJvbSBcIi4vVmFsdWVcIjtcblxuZXhwb3J0IGNsYXNzIEludFR5cGUgZXh0ZW5kcyBCYXNpY1R5cGU8bnVtYmVyPiB7XG4gICBzdGF0aWMgcmVhZG9ubHkgU2luZ2xldG9uOiBJbnRUeXBlID0gbmV3IEludFR5cGUoKVxuXG4gICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgIHN1cGVyKFR5cGVTZXQuSW50KVxuICAgfVxuXG4gICBhc3luYyB2YWxpZGF0ZTxUPihvYmo6IFQpOiBQcm9taXNlPFZhbGlkYXRlUmVzdWx0PiB7XG4gICAgICBsZXQgaXNWYWxpZCA9IHR5cGVvZiBvYmogPT09ICdudW1iZXInXG5cbiAgICAgIGlmKGlzVmFsaWQpIHtcbiAgICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IHRydWUgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogbmV3IEVycm9yKGBUeXBlIGRvZXMgbm90IG1hdGNoLiBFeHBlY3RlZCAnbnVtYmVyJyBhbmQgcmVjZWlldmVkICcke3R5cGVvZiBvYmp9J2ApfVxuICAgICAgfVxuICAgfVxufVxuXG5leHBvcnQgY2xhc3MgSW50VmFsdWUgZXh0ZW5kcyBCYXNpY1ZhbHVlPG51bWJlcj4ge1xuICAgY29uc3RydWN0b3IodmFsdWU6IG51bWJlciA9IDApIHtcbiAgICAgIHN1cGVyKEludFR5cGUuU2luZ2xldG9uLCB2YWx1ZSlcbiAgIH1cbn0iXX0=