"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StackGet = void 0;
class StackGet {
    constructor(context) {
        this.context = context;
    }
    get cache() {
        return this.context.cache;
    }
    get orchestrator() {
        return this.context.orchestrator;
    }
    async model(name) {
        return this.cache.getModel(name);
    }
    async modelById(id) {
        return this.cache.getModelById(id);
    }
    async object(modelName, id) {
        let model = this.cache.getModel(modelName);
        if (model === undefined) {
            throw new Error(`Encountered an error when retrieving an object. No Model with the name ${modelName} exists.`);
        }
        return this.orchestrator.getObject(model, id);
    }
}
exports.StackGet = StackGet;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3RhY2tHZXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc3RhY2svU3RhY2tHZXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBWUEsTUFBYSxRQUFRO0lBU2xCLFlBQXFCLE9BQXNCO1FBQXRCLFlBQU8sR0FBUCxPQUFPLENBQWU7SUFFM0MsQ0FBQztJQVZELElBQUksS0FBSztRQUNOLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUE7SUFDNUIsQ0FBQztJQUVELElBQUksWUFBWTtRQUNiLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUE7SUFDbkMsQ0FBQztJQU1ELEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBWTtRQUNyQixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQ25DLENBQUM7SUFFRCxLQUFLLENBQUMsU0FBUyxDQUFDLEVBQVU7UUFDdkIsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsQ0FBQTtJQUNyQyxDQUFDO0lBRUQsS0FBSyxDQUFDLE1BQU0sQ0FBd0IsU0FBaUIsRUFBRSxFQUFVO1FBQzlELElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFBO1FBRTFDLElBQUcsS0FBSyxLQUFLLFNBQVMsRUFBRTtZQUNyQixNQUFNLElBQUksS0FBSyxDQUFDLDBFQUEwRSxTQUFTLFVBQVUsQ0FBQyxDQUFBO1NBQ2hIO1FBRUQsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBSSxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUE7SUFDbkQsQ0FBQztDQUNIO0FBOUJELDRCQThCQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFN0YWNrT2JqZWN0IH0gZnJvbSBcIi4uXCI7XG5pbXBvcnQgeyBJQ2FjaGUgfSBmcm9tIFwiLi4vQ2FjaGVcIjtcbmltcG9ydCB7IElNb2RlbCB9IGZyb20gXCIuLi9Nb2RlbFwiO1xuaW1wb3J0IHsgSU9yY2hlc3RyYXRvciB9IGZyb20gXCIuLi9vcmNoZXN0cmF0b3IvT3JjaGVzdHJhdG9yXCI7XG5pbXBvcnQgeyBJU3RhY2tDb250ZXh0IH0gZnJvbSBcIi4vU3RhY2tDb250ZXh0XCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVN0YWNrR2V0IHtcbiAgIG1vZGVsKG5hbWU6IHN0cmluZyk6IFByb21pc2U8SU1vZGVsIHwgdW5kZWZpbmVkPlxuICAgbW9kZWxCeUlkKGlkOiBzdHJpbmcpOiBQcm9taXNlPElNb2RlbCB8IHVuZGVmaW5lZD5cbiAgIG9iamVjdDxUIGV4dGVuZHMgU3RhY2tPYmplY3Q+KG1vZGVsTmFtZTogc3RyaW5nLCBpZDogc3RyaW5nKTogUHJvbWlzZTxUIHwgdW5kZWZpbmVkPlxufVxuXG5leHBvcnQgY2xhc3MgU3RhY2tHZXQgaW1wbGVtZW50cyBJU3RhY2tHZXQge1xuICAgZ2V0IGNhY2hlKCk6IElDYWNoZSB7XG4gICAgICByZXR1cm4gdGhpcy5jb250ZXh0LmNhY2hlXG4gICB9XG5cbiAgIGdldCBvcmNoZXN0cmF0b3IoKTogSU9yY2hlc3RyYXRvciB7XG4gICAgICByZXR1cm4gdGhpcy5jb250ZXh0Lm9yY2hlc3RyYXRvclxuICAgfVxuXG4gICBjb25zdHJ1Y3RvcihyZWFkb25seSBjb250ZXh0OiBJU3RhY2tDb250ZXh0KSB7XG5cbiAgIH1cblxuICAgYXN5bmMgbW9kZWwobmFtZTogc3RyaW5nKTogUHJvbWlzZTxJTW9kZWwgfCB1bmRlZmluZWQ+IHtcbiAgICAgIHJldHVybiB0aGlzLmNhY2hlLmdldE1vZGVsKG5hbWUpXG4gICB9XG5cbiAgIGFzeW5jIG1vZGVsQnlJZChpZDogc3RyaW5nKTogUHJvbWlzZTxJTW9kZWwgfCB1bmRlZmluZWQ+IHtcbiAgICAgIHJldHVybiB0aGlzLmNhY2hlLmdldE1vZGVsQnlJZChpZClcbiAgIH1cblxuICAgYXN5bmMgb2JqZWN0PFQgZXh0ZW5kcyBTdGFja09iamVjdD4obW9kZWxOYW1lOiBzdHJpbmcsIGlkOiBzdHJpbmcpOiBQcm9taXNlPFQgfCB1bmRlZmluZWQ+IHtcbiAgICAgIGxldCBtb2RlbCA9IHRoaXMuY2FjaGUuZ2V0TW9kZWwobW9kZWxOYW1lKVxuXG4gICAgICBpZihtb2RlbCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEVuY291bnRlcmVkIGFuIGVycm9yIHdoZW4gcmV0cmlldmluZyBhbiBvYmplY3QuIE5vIE1vZGVsIHdpdGggdGhlIG5hbWUgJHttb2RlbE5hbWV9IGV4aXN0cy5gKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5vcmNoZXN0cmF0b3IuZ2V0T2JqZWN0PFQ+KG1vZGVsLCBpZClcbiAgIH0gICBcbn0iXX0=