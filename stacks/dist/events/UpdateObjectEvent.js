"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateObjectEvent = void 0;
const Event_1 = require("./Event");
class UpdateObjectEvent extends Event_1.Event {
    constructor(model, object, serialize) {
        super(Event_1.EventSet.ObjectUpdated);
        this.model = model;
        this.object = object;
        this.serialize = serialize;
        this._exists = Event_1.ExistState.Unset;
    }
    get updated() {
        return this._updated;
    }
    set updated(value) {
        if (value == null) {
            return;
        }
        this._updated = value;
        this._exists = Event_1.ExistState.Exists;
    }
    get exists() {
        return this._exists;
    }
    set exists(value) {
        if (value == Event_1.ExistState.DoesNotExist && this._exists == Event_1.ExistState.Exists) {
            return;
        }
        if (value == Event_1.ExistState.Unset) {
            throw new Error(`Cannot set the 'Unset' ExistState on a value from outside of the Event. This is a reserved state for a virgin Event.`);
        }
        this._exists = value;
    }
}
exports.UpdateObjectEvent = UpdateObjectEvent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVXBkYXRlT2JqZWN0RXZlbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZXZlbnRzL1VwZGF0ZU9iamVjdEV2ZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLG1DQUFzRDtBQUl0RCxNQUFhLGlCQUF5QyxTQUFRLGFBQUs7SUFpQ2hFLFlBQXFCLEtBQWEsRUFBVyxNQUFTLEVBQVcsU0FBdUI7UUFDckYsS0FBSyxDQUFDLGdCQUFRLENBQUMsYUFBYSxDQUFDLENBQUE7UUFEWCxVQUFLLEdBQUwsS0FBSyxDQUFRO1FBQVcsV0FBTSxHQUFOLE1BQU0sQ0FBRztRQUFXLGNBQVMsR0FBVCxTQUFTLENBQWM7UUFIaEYsWUFBTyxHQUFlLGtCQUFVLENBQUMsS0FBSyxDQUFBO0lBSzlDLENBQUM7SUFsQ0QsSUFBSSxPQUFPO1FBQ1IsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFBO0lBQ3ZCLENBQUM7SUFFRCxJQUFJLE9BQU8sQ0FBQyxLQUFvQjtRQUM3QixJQUFHLEtBQUssSUFBSSxJQUFJLEVBQUU7WUFDZixPQUFNO1NBQ1I7UUFFRCxJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQTtRQUNyQixJQUFJLENBQUMsT0FBTyxHQUFHLGtCQUFVLENBQUMsTUFBTSxDQUFBO0lBQ25DLENBQUM7SUFFRCxJQUFJLE1BQU07UUFDUCxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUE7SUFDdEIsQ0FBQztJQUVELElBQUksTUFBTSxDQUFDLEtBQWlCO1FBQ3pCLElBQUcsS0FBSyxJQUFJLGtCQUFVLENBQUMsWUFBWSxJQUFJLElBQUksQ0FBQyxPQUFPLElBQUksa0JBQVUsQ0FBQyxNQUFNLEVBQUU7WUFDdkUsT0FBTTtTQUNSO1FBRUQsSUFBRyxLQUFLLElBQUksa0JBQVUsQ0FBQyxLQUFLLEVBQUU7WUFDM0IsTUFBTSxJQUFJLEtBQUssQ0FBQyxzSEFBc0gsQ0FBQyxDQUFBO1NBQ3pJO1FBRUQsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUE7SUFDdkIsQ0FBQztDQVFIO0FBcENELDhDQW9DQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFN0YWNrT2JqZWN0IH0gZnJvbSBcIi4uL1N0YWNrT2JqZWN0XCI7XG5pbXBvcnQgeyBJTW9kZWwgfSBmcm9tIFwiLi4vTW9kZWxcIjtcbmltcG9ydCB7IEV2ZW50LCBFdmVudFNldCwgRXhpc3RTdGF0ZSB9IGZyb20gXCIuL0V2ZW50XCI7XG5pbXBvcnQgeyBJUHJveHlPYmplY3QgfSBmcm9tIFwiLi4vUHJveHlPYmplY3RcIjtcblxuXG5leHBvcnQgY2xhc3MgVXBkYXRlT2JqZWN0RXZlbnQ8VCBleHRlbmRzIFN0YWNrT2JqZWN0PiBleHRlbmRzIEV2ZW50IHtcbiAgIGdldCB1cGRhdGVkKCk6IFQgfCB1bmRlZmluZWQge1xuICAgICAgcmV0dXJuIHRoaXMuX3VwZGF0ZWRcbiAgIH1cblxuICAgc2V0IHVwZGF0ZWQodmFsdWU6IFQgfCB1bmRlZmluZWQpIHtcbiAgICAgIGlmKHZhbHVlID09IG51bGwpIHtcbiAgICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICB0aGlzLl91cGRhdGVkID0gdmFsdWVcbiAgICAgIHRoaXMuX2V4aXN0cyA9IEV4aXN0U3RhdGUuRXhpc3RzXG4gICB9XG5cbiAgIGdldCBleGlzdHMoKTogRXhpc3RTdGF0ZSB7XG4gICAgICByZXR1cm4gdGhpcy5fZXhpc3RzXG4gICB9XG5cbiAgIHNldCBleGlzdHModmFsdWU6IEV4aXN0U3RhdGUpIHtcbiAgICAgIGlmKHZhbHVlID09IEV4aXN0U3RhdGUuRG9lc05vdEV4aXN0ICYmIHRoaXMuX2V4aXN0cyA9PSBFeGlzdFN0YXRlLkV4aXN0cykge1xuICAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGlmKHZhbHVlID09IEV4aXN0U3RhdGUuVW5zZXQpIHtcbiAgICAgICAgIHRocm93IG5ldyBFcnJvcihgQ2Fubm90IHNldCB0aGUgJ1Vuc2V0JyBFeGlzdFN0YXRlIG9uIGEgdmFsdWUgZnJvbSBvdXRzaWRlIG9mIHRoZSBFdmVudC4gVGhpcyBpcyBhIHJlc2VydmVkIHN0YXRlIGZvciBhIHZpcmdpbiBFdmVudC5gKVxuICAgICAgfVxuXG4gICAgICB0aGlzLl9leGlzdHMgPSB2YWx1ZVxuICAgfVxuXG4gICBwcml2YXRlIF9leGlzdHM6IEV4aXN0U3RhdGUgPSBFeGlzdFN0YXRlLlVuc2V0XG4gICBwcml2YXRlIF91cGRhdGVkOiBUIHwgdW5kZWZpbmVkXG5cbiAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IG1vZGVsOiBJTW9kZWwsIHJlYWRvbmx5IG9iamVjdDogVCwgcmVhZG9ubHkgc2VyaWFsaXplOiBJUHJveHlPYmplY3QpIHtcbiAgICAgIHN1cGVyKEV2ZW50U2V0Lk9iamVjdFVwZGF0ZWQpXG4gICB9XG59Il19