"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntSerializer = exports.IntValue = exports.IntType = void 0;
const ValueSerializer_1 = require("../serialize/ValueSerializer");
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
    clone() {
        return new IntValue(this.value);
    }
    async deserialize(value) {
        if (typeof value !== 'number') {
            throw new Error(`Cannot deserialize a ${typeof value}. Expected a number`);
        }
        return new IntValue(value);
    }
}
exports.IntValue = IntValue;
class IntSerializer extends ValueSerializer_1.ValueSerializer {
    constructor() {
        super(Type_1.TypeSet.Int);
    }
    async toJs(value) {
        this.validate(value.type);
        let int = value;
        return int.value;
    }
    async fromJs(type, obj) {
        this.validate(type);
        if (typeof obj !== 'number') {
            throw new Error(`The JS object type does not match what's expected when serializing`);
        }
        return new IntValue(obj);
    }
}
exports.IntSerializer = IntSerializer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3ZhbHVlcy9JbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsa0VBQStEO0FBQy9ELGlDQUFtRTtBQUNuRSxtQ0FBNkM7QUFFN0MsTUFBYSxPQUFRLFNBQVEsZ0JBQWlCO0lBRzNDO1FBQ0csS0FBSyxDQUFDLGNBQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQTtJQUNyQixDQUFDO0lBRUQsS0FBSyxDQUFDLFFBQVEsQ0FBSSxHQUFNO1FBQ3JCLElBQUksT0FBTyxHQUFHLE9BQU8sR0FBRyxLQUFLLFFBQVEsQ0FBQTtRQUVyQyxJQUFHLE9BQU8sRUFBRSxDQUFDO1lBQ1YsT0FBTyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQTtRQUMzQixDQUFDO2FBQU0sQ0FBQztZQUNMLE9BQU8sRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxJQUFJLEtBQUssQ0FBQyx5REFBeUQsT0FBTyxHQUFHLEdBQUcsQ0FBQyxFQUFDLENBQUE7UUFDckgsQ0FBQztJQUNKLENBQUM7O0FBZkosMEJBZ0JDO0FBZmtCLGlCQUFTLEdBQVksSUFBSSxPQUFPLEVBQUUsQ0FBQTtBQWlCckQsTUFBYSxRQUFTLFNBQVEsa0JBQWtCO0lBQzdDLFlBQVksUUFBZ0IsQ0FBQztRQUMxQixLQUFLLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQTtJQUNsQyxDQUFDO0lBRUQsS0FBSztRQUNGLE9BQU8sSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO0lBQ2xDLENBQUM7SUFFRCxLQUFLLENBQUMsV0FBVyxDQUFDLEtBQVU7UUFDekIsSUFBRyxPQUFPLEtBQUssS0FBSyxRQUFRLEVBQUUsQ0FBQztZQUM1QixNQUFNLElBQUksS0FBSyxDQUFDLHdCQUF3QixPQUFPLEtBQUsscUJBQXFCLENBQUMsQ0FBQTtRQUM3RSxDQUFDO1FBRUQsT0FBTyxJQUFJLFFBQVEsQ0FBQyxLQUFlLENBQUMsQ0FBQTtJQUN2QyxDQUFDO0NBQ0g7QUFoQkQsNEJBZ0JDO0FBRUQsTUFBYSxhQUFjLFNBQVEsaUNBQWU7SUFDL0M7UUFDRyxLQUFLLENBQUMsY0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFBO0lBQ3JCLENBQUM7SUFFRCxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQWE7UUFDckIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUE7UUFFekIsSUFBSSxHQUFHLEdBQUcsS0FBaUIsQ0FBQTtRQUMzQixPQUFPLEdBQUcsQ0FBQyxLQUFLLENBQUE7SUFDbkIsQ0FBQztJQUVELEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBVyxFQUFFLEdBQVE7UUFDL0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUVuQixJQUFHLE9BQU8sR0FBRyxLQUFLLFFBQVEsRUFBRSxDQUFDO1lBQzFCLE1BQU0sSUFBSSxLQUFLLENBQUMsb0VBQW9FLENBQUMsQ0FBQTtRQUN4RixDQUFDO1FBRUQsT0FBTyxJQUFJLFFBQVEsQ0FBQyxHQUFhLENBQUMsQ0FBQTtJQUNyQyxDQUFDO0NBQ0g7QUFyQkQsc0NBcUJDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVmFsdWVTZXJpYWxpemVyIH0gZnJvbSBcIi4uL3NlcmlhbGl6ZS9WYWx1ZVNlcmlhbGl6ZXJcIjtcbmltcG9ydCB7IEJhc2ljVHlwZSwgSVR5cGUsIFR5cGVTZXQsIFZhbGlkYXRlUmVzdWx0IH0gZnJvbSBcIi4vVHlwZVwiO1xuaW1wb3J0IHsgQmFzaWNWYWx1ZSwgSVZhbHVlIH0gZnJvbSBcIi4vVmFsdWVcIjtcblxuZXhwb3J0IGNsYXNzIEludFR5cGUgZXh0ZW5kcyBCYXNpY1R5cGU8bnVtYmVyPiB7XG4gICBzdGF0aWMgcmVhZG9ubHkgU2luZ2xldG9uOiBJbnRUeXBlID0gbmV3IEludFR5cGUoKVxuXG4gICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgIHN1cGVyKFR5cGVTZXQuSW50KVxuICAgfVxuXG4gICBhc3luYyB2YWxpZGF0ZTxUPihvYmo6IFQpOiBQcm9taXNlPFZhbGlkYXRlUmVzdWx0PiB7XG4gICAgICBsZXQgaXNWYWxpZCA9IHR5cGVvZiBvYmogPT09ICdudW1iZXInXG5cbiAgICAgIGlmKGlzVmFsaWQpIHtcbiAgICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IHRydWUgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogbmV3IEVycm9yKGBUeXBlIGRvZXMgbm90IG1hdGNoLiBFeHBlY3RlZCAnbnVtYmVyJyBhbmQgcmVjZWlldmVkICcke3R5cGVvZiBvYmp9J2ApfVxuICAgICAgfVxuICAgfVxufVxuXG5leHBvcnQgY2xhc3MgSW50VmFsdWUgZXh0ZW5kcyBCYXNpY1ZhbHVlPG51bWJlcj4ge1xuICAgY29uc3RydWN0b3IodmFsdWU6IG51bWJlciA9IDApIHtcbiAgICAgIHN1cGVyKEludFR5cGUuU2luZ2xldG9uLCB2YWx1ZSlcbiAgIH1cblxuICAgY2xvbmUoKTogSVZhbHVlIHtcbiAgICAgIHJldHVybiBuZXcgSW50VmFsdWUodGhpcy52YWx1ZSlcbiAgIH1cblxuICAgYXN5bmMgZGVzZXJpYWxpemUodmFsdWU6IGFueSk6IFByb21pc2U8SVZhbHVlPiB7XG4gICAgICBpZih0eXBlb2YgdmFsdWUgIT09ICdudW1iZXInKSB7XG4gICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCBkZXNlcmlhbGl6ZSBhICR7dHlwZW9mIHZhbHVlfS4gRXhwZWN0ZWQgYSBudW1iZXJgKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gbmV3IEludFZhbHVlKHZhbHVlIGFzIG51bWJlcilcbiAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIEludFNlcmlhbGl6ZXIgZXh0ZW5kcyBWYWx1ZVNlcmlhbGl6ZXIge1xuICAgY29uc3RydWN0b3IoKSB7XG4gICAgICBzdXBlcihUeXBlU2V0LkludClcbiAgIH1cblxuICAgYXN5bmMgdG9Kcyh2YWx1ZTogSVZhbHVlKTogUHJvbWlzZTxhbnk+IHtcbiAgICAgIHRoaXMudmFsaWRhdGUodmFsdWUudHlwZSlcblxuICAgICAgbGV0IGludCA9IHZhbHVlIGFzIEludFZhbHVlXG4gICAgICByZXR1cm4gaW50LnZhbHVlXG4gICB9XG5cbiAgIGFzeW5jIGZyb21Kcyh0eXBlOiBJVHlwZSwgb2JqOiBhbnkpOiBQcm9taXNlPElWYWx1ZT4ge1xuICAgICAgdGhpcy52YWxpZGF0ZSh0eXBlKVxuXG4gICAgICBpZih0eXBlb2Ygb2JqICE9PSAnbnVtYmVyJykge1xuICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBUaGUgSlMgb2JqZWN0IHR5cGUgZG9lcyBub3QgbWF0Y2ggd2hhdCdzIGV4cGVjdGVkIHdoZW4gc2VyaWFsaXppbmdgKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gbmV3IEludFZhbHVlKG9iaiBhcyBudW1iZXIpXG4gICB9XG59Il19