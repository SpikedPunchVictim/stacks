"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectUpdateEvent = void 0;
const Event_1 = require("./Event");
class ObjectUpdateEvent extends Event_1.Event {
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
    constructor(model, object, serialize) {
        super(Event_1.EventSet.ObjectUpdated);
        this.model = model;
        this.object = object;
        this.serialize = serialize;
        this._exists = Event_1.ExistState.Unset;
    }
}
exports.ObjectUpdateEvent = ObjectUpdateEvent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiT2JqZWN0VXBkYXRlRXZlbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZXZlbnRzL09iamVjdFVwZGF0ZUV2ZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLG1DQUFzRDtBQUl0RCxNQUFhLGlCQUF5QyxTQUFRLGFBQUs7SUFDaEUsSUFBSSxPQUFPO1FBQ1IsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFBO0lBQ3ZCLENBQUM7SUFFRCxJQUFJLE9BQU8sQ0FBQyxLQUFvQjtRQUM3QixJQUFHLEtBQUssSUFBSSxJQUFJLEVBQUUsQ0FBQztZQUNoQixPQUFNO1FBQ1QsQ0FBQztRQUVELElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFBO1FBQ3JCLElBQUksQ0FBQyxPQUFPLEdBQUcsa0JBQVUsQ0FBQyxNQUFNLENBQUE7SUFDbkMsQ0FBQztJQUVELElBQUksTUFBTTtRQUNQLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQTtJQUN0QixDQUFDO0lBRUQsSUFBSSxNQUFNLENBQUMsS0FBaUI7UUFDekIsSUFBRyxLQUFLLElBQUksa0JBQVUsQ0FBQyxZQUFZLElBQUksSUFBSSxDQUFDLE9BQU8sSUFBSSxrQkFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ3hFLE9BQU07UUFDVCxDQUFDO1FBRUQsSUFBRyxLQUFLLElBQUksa0JBQVUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUM1QixNQUFNLElBQUksS0FBSyxDQUFDLHNIQUFzSCxDQUFDLENBQUE7UUFDMUksQ0FBQztRQUVELElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFBO0lBQ3ZCLENBQUM7SUFLRCxZQUFxQixLQUFhLEVBQVcsTUFBUyxFQUFXLFNBQXVCO1FBQ3JGLEtBQUssQ0FBQyxnQkFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFBO1FBRFgsVUFBSyxHQUFMLEtBQUssQ0FBUTtRQUFXLFdBQU0sR0FBTixNQUFNLENBQUc7UUFBVyxjQUFTLEdBQVQsU0FBUyxDQUFjO1FBSGhGLFlBQU8sR0FBZSxrQkFBVSxDQUFDLEtBQUssQ0FBQTtJQUs5QyxDQUFDO0NBQ0g7QUFwQ0QsOENBb0NDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU3RhY2tPYmplY3QgfSBmcm9tIFwiLi4vU3RhY2tPYmplY3RcIjtcbmltcG9ydCB7IElNb2RlbCB9IGZyb20gXCIuLi9Nb2RlbFwiO1xuaW1wb3J0IHsgRXZlbnQsIEV2ZW50U2V0LCBFeGlzdFN0YXRlIH0gZnJvbSBcIi4vRXZlbnRcIjtcbmltcG9ydCB7IElQcm94eU9iamVjdCB9IGZyb20gXCIuLi9Qcm94eU9iamVjdFwiO1xuXG5cbmV4cG9ydCBjbGFzcyBPYmplY3RVcGRhdGVFdmVudDxUIGV4dGVuZHMgU3RhY2tPYmplY3Q+IGV4dGVuZHMgRXZlbnQge1xuICAgZ2V0IHVwZGF0ZWQoKTogVCB8IHVuZGVmaW5lZCB7XG4gICAgICByZXR1cm4gdGhpcy5fdXBkYXRlZFxuICAgfVxuXG4gICBzZXQgdXBkYXRlZCh2YWx1ZTogVCB8IHVuZGVmaW5lZCkge1xuICAgICAgaWYodmFsdWUgPT0gbnVsbCkge1xuICAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIHRoaXMuX3VwZGF0ZWQgPSB2YWx1ZVxuICAgICAgdGhpcy5fZXhpc3RzID0gRXhpc3RTdGF0ZS5FeGlzdHNcbiAgIH1cblxuICAgZ2V0IGV4aXN0cygpOiBFeGlzdFN0YXRlIHtcbiAgICAgIHJldHVybiB0aGlzLl9leGlzdHNcbiAgIH1cblxuICAgc2V0IGV4aXN0cyh2YWx1ZTogRXhpc3RTdGF0ZSkge1xuICAgICAgaWYodmFsdWUgPT0gRXhpc3RTdGF0ZS5Eb2VzTm90RXhpc3QgJiYgdGhpcy5fZXhpc3RzID09IEV4aXN0U3RhdGUuRXhpc3RzKSB7XG4gICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgaWYodmFsdWUgPT0gRXhpc3RTdGF0ZS5VbnNldCkge1xuICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDYW5ub3Qgc2V0IHRoZSAnVW5zZXQnIEV4aXN0U3RhdGUgb24gYSB2YWx1ZSBmcm9tIG91dHNpZGUgb2YgdGhlIEV2ZW50LiBUaGlzIGlzIGEgcmVzZXJ2ZWQgc3RhdGUgZm9yIGEgdmlyZ2luIEV2ZW50LmApXG4gICAgICB9XG5cbiAgICAgIHRoaXMuX2V4aXN0cyA9IHZhbHVlXG4gICB9XG5cbiAgIHByaXZhdGUgX2V4aXN0czogRXhpc3RTdGF0ZSA9IEV4aXN0U3RhdGUuVW5zZXRcbiAgIHByaXZhdGUgX3VwZGF0ZWQ6IFQgfCB1bmRlZmluZWRcblxuICAgY29uc3RydWN0b3IocmVhZG9ubHkgbW9kZWw6IElNb2RlbCwgcmVhZG9ubHkgb2JqZWN0OiBULCByZWFkb25seSBzZXJpYWxpemU6IElQcm94eU9iamVjdCkge1xuICAgICAgc3VwZXIoRXZlbnRTZXQuT2JqZWN0VXBkYXRlZClcbiAgIH1cbn0iXX0=