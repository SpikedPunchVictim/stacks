"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetObjectEvent = void 0;
const Event_1 = require("./Event");
class GetObjectEvent extends Event_1.Event {
    constructor(model, id) {
        super(Event_1.EventSet.GetObject);
        this.model = model;
        this.id = id;
        this.exists = Event_1.ExistState.Unset;
        this._object = undefined;
    }
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
}
exports.GetObjectEvent = GetObjectEvent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR2V0T2JqZWN0RXZlbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZXZlbnRzL0dldE9iamVjdEV2ZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLG1DQUFzRDtBQUV0RCxNQUFhLGNBQWtCLFNBQVEsYUFBSztJQWtCekMsWUFBcUIsS0FBYSxFQUFXLEVBQVU7UUFDcEQsS0FBSyxDQUFDLGdCQUFRLENBQUMsU0FBUyxDQUFDLENBQUE7UUFEUCxVQUFLLEdBQUwsS0FBSyxDQUFRO1FBQVcsT0FBRSxHQUFGLEVBQUUsQ0FBUTtRQUp2RCxXQUFNLEdBQWUsa0JBQVUsQ0FBQyxLQUFLLENBQUE7UUFFN0IsWUFBTyxHQUFrQixTQUFTLENBQUE7SUFJMUMsQ0FBQztJQW5CRCxJQUFJLE1BQU07UUFDUCxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUE7SUFDdEIsQ0FBQztJQUVELElBQUksTUFBTSxDQUFDLEtBQW9CO1FBQzVCLElBQUcsS0FBSyxLQUFLLFNBQVMsRUFBRTtZQUNyQixPQUFNO1NBQ1I7UUFFRCxJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQTtRQUNwQixJQUFJLENBQUMsTUFBTSxHQUFHLGtCQUFVLENBQUMsTUFBTSxDQUFBO0lBQ2xDLENBQUM7Q0FTSDtBQXJCRCx3Q0FxQkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJTW9kZWwgfSBmcm9tIFwiLi4vTW9kZWxcIjtcbmltcG9ydCB7IEV2ZW50LCBFdmVudFNldCwgRXhpc3RTdGF0ZSB9IGZyb20gXCIuL0V2ZW50XCI7XG5cbmV4cG9ydCBjbGFzcyBHZXRPYmplY3RFdmVudDxUPiBleHRlbmRzIEV2ZW50IHtcbiAgIGdldCBvYmplY3QoKTogVCB8IHVuZGVmaW5lZCB7XG4gICAgICByZXR1cm4gdGhpcy5fb2JqZWN0XG4gICB9XG5cbiAgIHNldCBvYmplY3QodmFsdWU6IFQgfCB1bmRlZmluZWQpIHtcbiAgICAgIGlmKHZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICB0aGlzLl9vYmplY3QgPSB2YWx1ZVxuICAgICAgdGhpcy5leGlzdHMgPSBFeGlzdFN0YXRlLkV4aXN0c1xuICAgfVxuXG4gICBleGlzdHM6IEV4aXN0U3RhdGUgPSBFeGlzdFN0YXRlLlVuc2V0XG5cbiAgIHByaXZhdGUgX29iamVjdDogVCB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZFxuXG4gICBjb25zdHJ1Y3RvcihyZWFkb25seSBtb2RlbDogSU1vZGVsLCByZWFkb25seSBpZDogc3RyaW5nKSB7XG4gICAgICBzdXBlcihFdmVudFNldC5HZXRPYmplY3QpXG4gICB9XG59Il19