"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateObjectEvent = void 0;
const Event_1 = require("./Event");
class UpdateObjectEvent extends Event_1.Event {
    constructor(model, object) {
        super(Event_1.EventSet.ObjectUpdated);
        this.model = model;
        this.object = object;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVXBkYXRlT2JqZWN0RXZlbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZXZlbnRzL1VwZGF0ZU9iamVjdEV2ZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLG1DQUFzRDtBQUd0RCxNQUFhLGlCQUF5QyxTQUFRLGFBQUs7SUFpQ2hFLFlBQXFCLEtBQWEsRUFBVyxNQUFTO1FBQ25ELEtBQUssQ0FBQyxnQkFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFBO1FBRFgsVUFBSyxHQUFMLEtBQUssQ0FBUTtRQUFXLFdBQU0sR0FBTixNQUFNLENBQUc7UUFIOUMsWUFBTyxHQUFlLGtCQUFVLENBQUMsS0FBSyxDQUFBO0lBSzlDLENBQUM7SUFsQ0QsSUFBSSxPQUFPO1FBQ1IsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFBO0lBQ3ZCLENBQUM7SUFFRCxJQUFJLE9BQU8sQ0FBQyxLQUFvQjtRQUM3QixJQUFHLEtBQUssSUFBSSxJQUFJLEVBQUU7WUFDZixPQUFNO1NBQ1I7UUFFRCxJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQTtRQUNyQixJQUFJLENBQUMsT0FBTyxHQUFHLGtCQUFVLENBQUMsTUFBTSxDQUFBO0lBQ25DLENBQUM7SUFFRCxJQUFJLE1BQU07UUFDUCxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUE7SUFDdEIsQ0FBQztJQUVELElBQUksTUFBTSxDQUFDLEtBQWlCO1FBQ3pCLElBQUcsS0FBSyxJQUFJLGtCQUFVLENBQUMsWUFBWSxJQUFJLElBQUksQ0FBQyxPQUFPLElBQUksa0JBQVUsQ0FBQyxNQUFNLEVBQUU7WUFDdkUsT0FBTTtTQUNSO1FBRUQsSUFBRyxLQUFLLElBQUksa0JBQVUsQ0FBQyxLQUFLLEVBQUU7WUFDM0IsTUFBTSxJQUFJLEtBQUssQ0FBQyxzSEFBc0gsQ0FBQyxDQUFBO1NBQ3pJO1FBRUQsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUE7SUFDdkIsQ0FBQztDQVFIO0FBcENELDhDQW9DQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFN0YWNrT2JqZWN0IH0gZnJvbSBcIi4uL0JvbmRlZE9iamVjdFwiO1xuaW1wb3J0IHsgSU1vZGVsIH0gZnJvbSBcIi4uL01vZGVsXCI7XG5pbXBvcnQgeyBFdmVudCwgRXZlbnRTZXQsIEV4aXN0U3RhdGUgfSBmcm9tIFwiLi9FdmVudFwiO1xuXG5cbmV4cG9ydCBjbGFzcyBVcGRhdGVPYmplY3RFdmVudDxUIGV4dGVuZHMgU3RhY2tPYmplY3Q+IGV4dGVuZHMgRXZlbnQge1xuICAgZ2V0IHVwZGF0ZWQoKTogVCB8IHVuZGVmaW5lZCB7XG4gICAgICByZXR1cm4gdGhpcy5fdXBkYXRlZFxuICAgfVxuXG4gICBzZXQgdXBkYXRlZCh2YWx1ZTogVCB8IHVuZGVmaW5lZCkge1xuICAgICAgaWYodmFsdWUgPT0gbnVsbCkge1xuICAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIHRoaXMuX3VwZGF0ZWQgPSB2YWx1ZVxuICAgICAgdGhpcy5fZXhpc3RzID0gRXhpc3RTdGF0ZS5FeGlzdHNcbiAgIH1cblxuICAgZ2V0IGV4aXN0cygpOiBFeGlzdFN0YXRlIHtcbiAgICAgIHJldHVybiB0aGlzLl9leGlzdHNcbiAgIH1cblxuICAgc2V0IGV4aXN0cyh2YWx1ZTogRXhpc3RTdGF0ZSkge1xuICAgICAgaWYodmFsdWUgPT0gRXhpc3RTdGF0ZS5Eb2VzTm90RXhpc3QgJiYgdGhpcy5fZXhpc3RzID09IEV4aXN0U3RhdGUuRXhpc3RzKSB7XG4gICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgaWYodmFsdWUgPT0gRXhpc3RTdGF0ZS5VbnNldCkge1xuICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDYW5ub3Qgc2V0IHRoZSAnVW5zZXQnIEV4aXN0U3RhdGUgb24gYSB2YWx1ZSBmcm9tIG91dHNpZGUgb2YgdGhlIEV2ZW50LiBUaGlzIGlzIGEgcmVzZXJ2ZWQgc3RhdGUgZm9yIGEgdmlyZ2luIEV2ZW50LmApXG4gICAgICB9XG5cbiAgICAgIHRoaXMuX2V4aXN0cyA9IHZhbHVlXG4gICB9XG5cbiAgIHByaXZhdGUgX2V4aXN0czogRXhpc3RTdGF0ZSA9IEV4aXN0U3RhdGUuVW5zZXRcbiAgIHByaXZhdGUgX3VwZGF0ZWQ6IFQgfCB1bmRlZmluZWRcblxuICAgY29uc3RydWN0b3IocmVhZG9ubHkgbW9kZWw6IElNb2RlbCwgcmVhZG9ubHkgb2JqZWN0OiBUKSB7XG4gICAgICBzdXBlcihFdmVudFNldC5PYmplY3RVcGRhdGVkKVxuICAgfVxufSJdfQ==