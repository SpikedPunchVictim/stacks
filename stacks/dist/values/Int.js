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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3ZhbHVlcy9JbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsa0VBQStEO0FBQy9ELGlDQUFtRTtBQUNuRSxtQ0FBNkM7QUFFN0MsTUFBYSxPQUFRLFNBQVEsZ0JBQWlCO0lBRzNDO1FBQ0csS0FBSyxDQUFDLGNBQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQTtJQUNyQixDQUFDO0lBRUQsS0FBSyxDQUFDLFFBQVEsQ0FBSSxHQUFNO1FBQ3JCLElBQUksT0FBTyxHQUFHLE9BQU8sR0FBRyxLQUFLLFFBQVEsQ0FBQTtRQUVyQyxJQUFHLE9BQU8sRUFBRTtZQUNULE9BQU8sRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUE7U0FDMUI7YUFBTTtZQUNKLE9BQU8sRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxJQUFJLEtBQUssQ0FBQyx5REFBeUQsT0FBTyxHQUFHLEdBQUcsQ0FBQyxFQUFDLENBQUE7U0FDcEg7SUFDSixDQUFDOztBQWZKLDBCQWdCQztBQWZrQixpQkFBUyxHQUFZLElBQUksT0FBTyxFQUFFLENBQUE7QUFpQnJELE1BQWEsUUFBUyxTQUFRLGtCQUFrQjtJQUM3QyxZQUFZLFFBQWdCLENBQUM7UUFDMUIsS0FBSyxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUE7SUFDbEMsQ0FBQztJQUVELEtBQUs7UUFDRixPQUFPLElBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtJQUNsQyxDQUFDO0lBRUQsS0FBSyxDQUFDLFdBQVcsQ0FBQyxLQUFVO1FBQ3pCLElBQUcsT0FBTyxLQUFLLEtBQUssUUFBUSxFQUFFO1lBQzNCLE1BQU0sSUFBSSxLQUFLLENBQUMsd0JBQXdCLE9BQU8sS0FBSyxxQkFBcUIsQ0FBQyxDQUFBO1NBQzVFO1FBRUQsT0FBTyxJQUFJLFFBQVEsQ0FBQyxLQUFlLENBQUMsQ0FBQTtJQUN2QyxDQUFDO0NBQ0g7QUFoQkQsNEJBZ0JDO0FBRUQsTUFBYSxhQUFjLFNBQVEsaUNBQWU7SUFDL0M7UUFDRyxLQUFLLENBQUMsY0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFBO0lBQ3JCLENBQUM7SUFFRCxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQWE7UUFDckIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUE7UUFFekIsSUFBSSxHQUFHLEdBQUcsS0FBaUIsQ0FBQTtRQUMzQixPQUFPLEdBQUcsQ0FBQyxLQUFLLENBQUE7SUFDbkIsQ0FBQztJQUVELEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBVyxFQUFFLEdBQVE7UUFDL0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUVuQixJQUFHLE9BQU8sR0FBRyxLQUFLLFFBQVEsRUFBRTtZQUN6QixNQUFNLElBQUksS0FBSyxDQUFDLG9FQUFvRSxDQUFDLENBQUE7U0FDdkY7UUFFRCxPQUFPLElBQUksUUFBUSxDQUFDLEdBQWEsQ0FBQyxDQUFBO0lBQ3JDLENBQUM7Q0FDSDtBQXJCRCxzQ0FxQkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBWYWx1ZVNlcmlhbGl6ZXIgfSBmcm9tIFwiLi4vc2VyaWFsaXplL1ZhbHVlU2VyaWFsaXplclwiO1xuaW1wb3J0IHsgQmFzaWNUeXBlLCBJVHlwZSwgVHlwZVNldCwgVmFsaWRhdGVSZXN1bHQgfSBmcm9tIFwiLi9UeXBlXCI7XG5pbXBvcnQgeyBCYXNpY1ZhbHVlLCBJVmFsdWUgfSBmcm9tIFwiLi9WYWx1ZVwiO1xuXG5leHBvcnQgY2xhc3MgSW50VHlwZSBleHRlbmRzIEJhc2ljVHlwZTxudW1iZXI+IHtcbiAgIHN0YXRpYyByZWFkb25seSBTaW5nbGV0b246IEludFR5cGUgPSBuZXcgSW50VHlwZSgpXG5cbiAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgc3VwZXIoVHlwZVNldC5JbnQpXG4gICB9XG5cbiAgIGFzeW5jIHZhbGlkYXRlPFQ+KG9iajogVCk6IFByb21pc2U8VmFsaWRhdGVSZXN1bHQ+IHtcbiAgICAgIGxldCBpc1ZhbGlkID0gdHlwZW9mIG9iaiA9PT0gJ251bWJlcidcblxuICAgICAgaWYoaXNWYWxpZCkge1xuICAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBuZXcgRXJyb3IoYFR5cGUgZG9lcyBub3QgbWF0Y2guIEV4cGVjdGVkICdudW1iZXInIGFuZCByZWNlaWV2ZWQgJyR7dHlwZW9mIG9ian0nYCl9XG4gICAgICB9XG4gICB9XG59XG5cbmV4cG9ydCBjbGFzcyBJbnRWYWx1ZSBleHRlbmRzIEJhc2ljVmFsdWU8bnVtYmVyPiB7XG4gICBjb25zdHJ1Y3Rvcih2YWx1ZTogbnVtYmVyID0gMCkge1xuICAgICAgc3VwZXIoSW50VHlwZS5TaW5nbGV0b24sIHZhbHVlKVxuICAgfVxuXG4gICBjbG9uZSgpOiBJVmFsdWUge1xuICAgICAgcmV0dXJuIG5ldyBJbnRWYWx1ZSh0aGlzLnZhbHVlKVxuICAgfVxuXG4gICBhc3luYyBkZXNlcmlhbGl6ZSh2YWx1ZTogYW55KTogUHJvbWlzZTxJVmFsdWU+IHtcbiAgICAgIGlmKHR5cGVvZiB2YWx1ZSAhPT0gJ251bWJlcicpIHtcbiAgICAgICAgIHRocm93IG5ldyBFcnJvcihgQ2Fubm90IGRlc2VyaWFsaXplIGEgJHt0eXBlb2YgdmFsdWV9LiBFeHBlY3RlZCBhIG51bWJlcmApXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBuZXcgSW50VmFsdWUodmFsdWUgYXMgbnVtYmVyKVxuICAgfVxufVxuXG5leHBvcnQgY2xhc3MgSW50U2VyaWFsaXplciBleHRlbmRzIFZhbHVlU2VyaWFsaXplciB7XG4gICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgIHN1cGVyKFR5cGVTZXQuSW50KVxuICAgfVxuXG4gICBhc3luYyB0b0pzKHZhbHVlOiBJVmFsdWUpOiBQcm9taXNlPGFueT4ge1xuICAgICAgdGhpcy52YWxpZGF0ZSh2YWx1ZS50eXBlKVxuXG4gICAgICBsZXQgaW50ID0gdmFsdWUgYXMgSW50VmFsdWVcbiAgICAgIHJldHVybiBpbnQudmFsdWVcbiAgIH1cblxuICAgYXN5bmMgZnJvbUpzKHR5cGU6IElUeXBlLCBvYmo6IGFueSk6IFByb21pc2U8SVZhbHVlPiB7XG4gICAgICB0aGlzLnZhbGlkYXRlKHR5cGUpXG5cbiAgICAgIGlmKHR5cGVvZiBvYmogIT09ICdudW1iZXInKSB7XG4gICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFRoZSBKUyBvYmplY3QgdHlwZSBkb2VzIG5vdCBtYXRjaCB3aGF0J3MgZXhwZWN0ZWQgd2hlbiBzZXJpYWxpemluZ2ApXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBuZXcgSW50VmFsdWUob2JqIGFzIG51bWJlcilcbiAgIH1cbn0iXX0=