"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetObjectEvent = void 0;
const Event_1 = require("./Event");
class GetObjectEvent extends Event_1.Event {
    /**
     * The serialized version of the Object
     */
    get object() {
        return this._object;
    }
    set object(value) {
        if (value === undefined) {
            return;
        }
        this._object = value;
        this.exists = Event_1.ExistState.Exists;
    }
    constructor(model, id) {
        super(Event_1.EventSet.GetObject);
        this.model = model;
        this.id = id;
        this.exists = Event_1.ExistState.Unset;
        this._object = undefined;
    }
}
exports.GetObjectEvent = GetObjectEvent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR2V0T2JqZWN0RXZlbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZXZlbnRzL0dldE9iamVjdEV2ZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLG1DQUFzRDtBQUV0RCxNQUFhLGNBQXNDLFNBQVEsYUFBSztJQUM3RDs7T0FFRztJQUNILElBQUksTUFBTTtRQUNQLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQTtJQUN0QixDQUFDO0lBRUQsSUFBSSxNQUFNLENBQUMsS0FBb0I7UUFDNUIsSUFBRyxLQUFLLEtBQUssU0FBUyxFQUFFLENBQUM7WUFDdEIsT0FBTTtRQUNULENBQUM7UUFFRCxJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQTtRQUNwQixJQUFJLENBQUMsTUFBTSxHQUFHLGtCQUFVLENBQUMsTUFBTSxDQUFBO0lBQ2xDLENBQUM7SUFNRCxZQUFxQixLQUFhLEVBQVcsRUFBVTtRQUNwRCxLQUFLLENBQUMsZ0JBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQTtRQURQLFVBQUssR0FBTCxLQUFLLENBQVE7UUFBVyxPQUFFLEdBQUYsRUFBRSxDQUFRO1FBSnZELFdBQU0sR0FBZSxrQkFBVSxDQUFDLEtBQUssQ0FBQTtRQUU3QixZQUFPLEdBQWtCLFNBQVMsQ0FBQTtJQUkxQyxDQUFDO0NBQ0g7QUF4QkQsd0NBd0JDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSU1vZGVsIH0gZnJvbSBcIi4uL01vZGVsXCI7XG5pbXBvcnQgeyBTdGFja09iamVjdCB9IGZyb20gXCIuLi9TdGFja09iamVjdFwiO1xuaW1wb3J0IHsgRXZlbnQsIEV2ZW50U2V0LCBFeGlzdFN0YXRlIH0gZnJvbSBcIi4vRXZlbnRcIjtcblxuZXhwb3J0IGNsYXNzIEdldE9iamVjdEV2ZW50PFQgZXh0ZW5kcyBTdGFja09iamVjdD4gZXh0ZW5kcyBFdmVudCB7XG4gICAvKipcbiAgICAqIFRoZSBzZXJpYWxpemVkIHZlcnNpb24gb2YgdGhlIE9iamVjdFxuICAgICovXG4gICBnZXQgb2JqZWN0KCk6IFQgfCB1bmRlZmluZWQge1xuICAgICAgcmV0dXJuIHRoaXMuX29iamVjdFxuICAgfVxuXG4gICBzZXQgb2JqZWN0KHZhbHVlOiBUIHwgdW5kZWZpbmVkKSB7XG4gICAgICBpZih2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgdGhpcy5fb2JqZWN0ID0gdmFsdWVcbiAgICAgIHRoaXMuZXhpc3RzID0gRXhpc3RTdGF0ZS5FeGlzdHNcbiAgIH1cblxuICAgZXhpc3RzOiBFeGlzdFN0YXRlID0gRXhpc3RTdGF0ZS5VbnNldFxuXG4gICBwcml2YXRlIF9vYmplY3Q6IFQgfCB1bmRlZmluZWQgPSB1bmRlZmluZWRcblxuICAgY29uc3RydWN0b3IocmVhZG9ubHkgbW9kZWw6IElNb2RlbCwgcmVhZG9ubHkgaWQ6IHN0cmluZykge1xuICAgICAgc3VwZXIoRXZlbnRTZXQuR2V0T2JqZWN0KVxuICAgfVxufSJdfQ==