"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectRefSerializer = exports.ObjectRefValue = exports.ObjectRefType = void 0;
const ProxyObject_1 = require("../ProxyObject");
const ValueSerializer_1 = require("../serialize/ValueSerializer");
const UidKeeper_1 = require("../UidKeeper");
const Type_1 = require("./Type");
const Value_1 = require("./Value");
class ObjectRefType extends Type_1.Type {
    constructor(modelName, context) {
        super(Type_1.TypeSet.ObjectRef);
        this.modelName = modelName;
        this.context = context;
    }
    get orchestrator() {
        return this.context.orchestrator;
    }
    equals(other) {
        if (other.type !== Type_1.TypeSet.ObjectRef) {
            return false;
        }
        let cast = other;
        if (cast.modelName.toLowerCase() !== this.modelName.toLowerCase()) {
            return false;
        }
        return true;
    }
    async validate(obj) {
        if (typeof obj !== 'string') {
            return { success: false, error: new Error(`Type does not match. Expected 'string' for id and receieved '${typeof obj}'`) };
        }
        let id = obj;
        let model = this.context.cache.getModel(this.modelName);
        if (model === undefined) {
            return { success: false, error: new Error(`No Model exists with the name ${this.modelName}.`) };
        }
        let found = await this.orchestrator.getObject(model, id);
        if (found === undefined) {
            return { success: false, error: new Error(`The Object referenced (id: ${id}) doesn't exist`) };
        }
        return { success: true };
    }
}
exports.ObjectRefType = ObjectRefType;
class ObjectRefValue extends Value_1.Value {
    constructor(modelName, id, context) {
        super(new ObjectRefType(modelName, context));
        this.id = id;
    }
    clone() {
        let refType = this.type;
        return new ObjectRefValue(refType.modelName, this.id, refType.context);
    }
}
exports.ObjectRefValue = ObjectRefValue;
class ObjectRefSerializer extends ValueSerializer_1.ValueSerializer {
    constructor(context) {
        super(Type_1.TypeSet.ObjectRef);
        this.context = context;
    }
    async toJs(value) {
        this.validate(value.type);
        let type = value.type;
        let objRef = value;
        let model = this.context.cache.getModel(type.modelName);
        if (model === undefined) {
            throw new Error(`Encountered an error when serializing an ObjectRef. The Model referenced (${type.modelName}) does not exist.`);
        }
        if (objRef.id === UidKeeper_1.UidKeeper.IdNotSet) {
            return await ProxyObject_1.ProxyObject.fromModel(model, this.context);
        }
        return await this.context.orchestrator.getObject(model, objRef.id);
    }
    async fromJs(type, obj) {
        this.validate(type);
        let castObj = obj;
        let castType = type;
        let model = this.context.cache.getModel(castType.modelName);
        if (model === undefined) {
            throw new Error(`Error encountered while trying to serialize an edited value (ObjectRef). The Model (${castType.modelName}) does not exist.`);
        }
        return new ObjectRefValue(castType.modelName, castObj.id, this.context);
    }
}
exports.ObjectRefSerializer = ObjectRefSerializer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiT2JqZWN0UmVmLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3ZhbHVlcy9PYmplY3RSZWYudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsZ0RBQTZDO0FBQzdDLGtFQUErRDtBQUcvRCw0Q0FBeUM7QUFDekMsaUNBQThEO0FBQzlELG1DQUF3QztBQUV4QyxNQUFhLGFBQWMsU0FBUSxXQUFJO0lBS3BDLFlBQXFCLFNBQWlCLEVBQVcsT0FBc0I7UUFDcEUsS0FBSyxDQUFDLGNBQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQTtRQUROLGNBQVMsR0FBVCxTQUFTLENBQVE7UUFBVyxZQUFPLEdBQVAsT0FBTyxDQUFlO0lBRXZFLENBQUM7SUFORCxJQUFJLFlBQVk7UUFDYixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFBO0lBQ25DLENBQUM7SUFNRCxNQUFNLENBQUMsS0FBWTtRQUNoQixJQUFHLEtBQUssQ0FBQyxJQUFJLEtBQUssY0FBTyxDQUFDLFNBQVMsRUFBRTtZQUNsQyxPQUFPLEtBQUssQ0FBQTtTQUNkO1FBRUQsSUFBSSxJQUFJLEdBQUcsS0FBc0IsQ0FBQTtRQUVqQyxJQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxFQUFFLEtBQUssSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLEVBQUUsRUFBRTtZQUMvRCxPQUFPLEtBQUssQ0FBQTtTQUNkO1FBRUQsT0FBTyxJQUFJLENBQUE7SUFDZCxDQUFDO0lBRUQsS0FBSyxDQUFDLFFBQVEsQ0FBSSxHQUFNO1FBQ3JCLElBQUcsT0FBTyxHQUFHLEtBQUssUUFBUSxFQUFFO1lBQ3pCLE9BQU8sRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxJQUFJLEtBQUssQ0FBQyxnRUFBZ0UsT0FBTyxHQUFHLEdBQUcsQ0FBQyxFQUFDLENBQUE7U0FDM0g7UUFFRCxJQUFJLEVBQUUsR0FBRyxHQUFhLENBQUE7UUFFdEIsSUFBSSxLQUFLLEdBQUcsSUFBSSxD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QUMsdUZBQXVGLFFBQVEsQ0FBQyxTQUFTLG1CQUFtQixDQUFDLENBQUE7U0FDL0k7UUFFRCxPQUFPLElBQUksY0FBYyxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7SUFDMUUsQ0FBQztDQUNIO0FBckNELGtEQXFDQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElPcmNoZXN0cmF0b3IgfSBmcm9tIFwiLi4vb3JjaGVzdHJhdG9yL09yY2hlc3RyYXRvclwiO1xuaW1wb3J0IHsgUHJveHlPYmplY3QgfSBmcm9tIFwiLi4vUHJveHlPYmplY3RcIjtcbmltcG9ydCB7IFZhbHVlU2VyaWFsaXplciB9IGZyb20gXCIuLi9zZXJpYWxpemUvVmFsdWVTZXJpYWxpemVyXCI7XG5pbXBvcnQgeyBJU3RhY2tDb250ZXh0IH0gZnJvbSBcIi4uL3N0YWNrL1N0YWNrQ29udGV4dFwiO1xuaW1wb3J0IHsgU3RhY2tPYmplY3QgfSBmcm9tIFwiLi4vU3RhY2tPYmplY3RcIjtcbmltcG9ydCB7IFVpZEtlZXBlciB9IGZyb20gXCIuLi9VaWRLZWVwZXJcIjtcbmltcG9ydCB7IElUeXBlLCBUeXBlLCBUeXBlU2V0LCBWYWxpZGF0ZVJlc3VsdCB9IGZyb20gXCIuL1R5cGVcIjtcbmltcG9ydCB7IElWYWx1ZSwgVmFsdWUgfSBmcm9tIFwiLi9WYWx1ZVwiO1xuXG5leHBvcnQgY2xhc3MgT2JqZWN0UmVmVHlwZSBleHRlbmRzIFR5cGUge1xuICAgZ2V0IG9yY2hlc3RyYXRvcigpOiBJT3JjaGVzdHJhdG9yIHtcbiAgICAgIHJldHVybiB0aGlzLmNvbnRleHQub3JjaGVzdHJhdG9yXG4gICB9XG5cbiAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IG1vZGVsTmFtZTogc3RyaW5nLCByZWFkb25seSBjb250ZXh0OiBJU3RhY2tDb250ZXh0KSB7XG4gICAgICBzdXBlcihUeXBlU2V0Lk9iamVjdFJlZilcbiAgIH1cblxuICAgZXF1YWxzKG90aGVyOiBJVHlwZSk6IGJvb2xlYW4ge1xuICAgICAgaWYob3RoZXIudHlwZSAhPT0gVHlwZVNldC5PYmplY3RSZWYpIHtcbiAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuXG4gICAgICBsZXQgY2FzdCA9IG90aGVyIGFzIE9iamVjdFJlZlR5cGVcblxuICAgICAgaWYoY2FzdC5tb2RlbE5hbWUudG9Mb3dlckNhc2UoKSAhPT0gdGhpcy5tb2RlbE5hbWUudG9Mb3dlckNhc2UoKSkge1xuICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0cnVlXG4gICB9XG5cbiAgIGFzeW5jIHZhbGlkYXRlPFQ+KG9iajogVCk6IFByb21pc2U8VmFsaWRhdGVSZXN1bHQ+IHtcbiAgICAgIGlmKHR5cGVvZiBvYmogIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IG5ldyBFcnJvcihgVHlwZSBkb2VzIG5vdCBtYXRjaC4gRXhwZWN0ZWQgJ3N0cmluZycgZm9yIGlkIGFuZCByZWNlaWV2ZWQgJyR7dHlwZW9mIG9ian0nYCl9XG4gICAgICB9XG5cbiAgICAgIGxldCBpZCA9IG9iaiBhcyBzdHJpbmdcblxuICAgICAgbGV0IG1vZGVsID0gdGhpcy5jb250ZXh0LmNhY2hlLmdldE1vZGVsKHRoaXMubW9kZWxOYW1lKVxuXG4gICAgICBpZihtb2RlbCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IG5ldyBFcnJvcihgTm8gTW9kZWwgZXhpc3RzIHdpdGggdGhlIG5hbWUgJHt0aGlzLm1vZGVsTmFtZX0uYCkgfVxuICAgICAgfVxuXG4gICAgICBsZXQgZm91bmQgPSBhd2FpdCB0aGlzLm9yY2hlc3RyYXRvci5nZXRPYmplY3QobW9kZWwsIGlkKVxuXG4gICAgICBpZihmb3VuZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IG5ldyBFcnJvcihgVGhlIE9iamVjdCByZWZlcmVuY2VkIChpZDogJHtpZH0pIGRvZXNuJ3QgZXhpc3RgKX1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSB9XG4gICB9XG59XG5cbmV4cG9ydCBjbGFzcyBPYmplY3RSZWZWYWx1ZSBleHRlbmRzIFZhbHVlIHtcbiAgIGlkOiBzdHJpbmdcblxuICAgY29uc3RydWN0b3IobW9kZWxOYW1lOiBzdHJpbmcsIGlkOiBzdHJpbmcsIGNvbnRleHQ6IElTdGFja0NvbnRleHQpIHtcbiAgICAgIHN1cGVyKG5ldyBPYmplY3RSZWZUeXBlKG1vZGVsTmFtZSwgY29udGV4dCkpXG4gICAgICB0aGlzLmlkID0gaWRcbiAgIH1cblxuICAgY2xvbmUoKTogSVZhbHVlIHtcbiAgICAgIGxldCByZWZUeXBlID0gdGhpcy50eXBlIGFzIE9iamVjdFJlZlR5cGVcbiAgICAgIHJldHVybiBuZXcgT2JqZWN0UmVmVmFsdWUocmVmVHlwZS5tb2RlbE5hbWUsIHRoaXMuaWQsIHJlZlR5cGUuY29udGV4dClcbiAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIE9iamVjdFJlZlNlcmlhbGl6ZXIgZXh0ZW5kcyBWYWx1ZVNlcmlhbGl6ZXIge1xuICAgY29uc3RydWN0b3IocmVhZG9ubHkgY29udGV4dDogSVN0YWNrQ29udGV4dCkge1xuICAgICAgc3VwZXIoVHlwZVNldC5PYmplY3RSZWYpXG4gICB9XG5cbiAgIGFzeW5jIHRvSnModmFsdWU6IElWYWx1ZSk6IFByb21pc2U8YW55PiB7XG4gICAgICB0aGlzLnZhbGlkYXRlKHZhbHVlLnR5cGUpXG5cbiAgICAgIGxldCB0eXBlID0gdmFsdWUudHlwZSBhcyBPYmplY3RSZWZUeXBlXG4gICAgICBsZXQgb2JqUmVmID0gdmFsdWUgYXMgT2JqZWN0UmVmVmFsdWVcbiAgICAgIFxuICAgICAgbGV0IG1vZGVsID0gdGhpcy5jb250ZXh0LmNhY2hlLmdldE1vZGVsKHR5cGUubW9kZWxOYW1lKVxuXG4gICAgICBpZihtb2RlbCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEVuY291bnRlcmVkIGFuIGVycm9yIHdoZW4gc2VyaWFsaXppbmcgYW4gT2JqZWN0UmVmLiBUaGUgTW9kZWwgcmVmZXJlbmNlZCAoJHt0eXBlLm1vZGVsTmFtZX0pIGRvZXMgbm90IGV4aXN0LmApXG4gICAgICB9XG5cbiAgICAgIGlmKG9ialJlZi5pZCA9PT0gVWlkS2VlcGVyLklkTm90U2V0KSB7XG4gICAgICAgICByZXR1cm4gYXdhaXQgUHJveHlPYmplY3QuZnJvbU1vZGVsKG1vZGVsLCB0aGlzLmNvbnRleHQpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBhd2FpdCB0aGlzLmNvbnRleHQub3JjaGVzdHJhdG9yLmdldE9iamVjdChtb2RlbCwgb2JqUmVmLmlkKVxuICAgfVxuXG4gICBhc3luYyBmcm9tSnModHlwZTogSVR5cGUsIG9iajogYW55KTogUHJvbWlzZTxJVmFsdWU+IHtcbiAgICAgIHRoaXMudmFsaWRhdGUodHlwZSlcblxuICAgICAgbGV0IGNhc3RPYmogPSBvYmogYXMgU3RhY2tPYmplY3RcbiAgICAgIGxldCBjYXN0VHlwZSA9IHR5cGUgYXMgT2JqZWN0UmVmVHlwZVxuICAgICAgbGV0IG1vZGVsID0gdGhpcy5jb250ZXh0LmNhY2hlLmdldE1vZGVsKGNhc3RUeXBlLm1vZGVsTmFtZSlcblxuICAgICAgaWYobW9kZWwgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBFcnJvciBlbmNvdW50ZXJlZCB3aGlsZSB0cnlpbmcgdG8gc2VyaWFsaXplIGFuIGVkaXRlZCB2YWx1ZSAoT2JqZWN0UmVmKS4gVGhlIE1vZGVsICgke2Nhc3RUeXBlLm1vZGVsTmFtZX0pIGRvZXMgbm90IGV4aXN0LmApXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBuZXcgT2JqZWN0UmVmVmFsdWUoY2FzdFR5cGUubW9kZWxOYW1lLCBjYXN0T2JqLmlkLCB0aGlzLmNvbnRleHQpXG4gICB9XG59XG4iXX0=