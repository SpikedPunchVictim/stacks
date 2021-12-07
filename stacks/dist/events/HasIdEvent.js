"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HasIdEvent = void 0;
const Event_1 = require("./Event");
class HasIdEvent extends Event_1.Event {
    constructor(id) {
        super(Event_1.EventSet.HasId);
        this.id = id;
        this._hasId = false;
        this._attemptedSet = false;
    }
    get attemptedSet() {
        return this._attemptedSet;
    }
    get hasId() {
        return this._hasId;
    }
    set hasId(value) {
        this._attemptedSet = true;
        // If it has already been set by a plugin, we leave it set
        if (this._hasId) {
            return;
        }
    }
}
exports.HasIdEvent = HasIdEvent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSGFzSWRFdmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ldmVudHMvSGFzSWRFdmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxtQ0FBMEM7QUFHMUMsTUFBYSxVQUFXLFNBQVEsYUFBSztJQXFCbEMsWUFBcUIsRUFBVTtRQUM1QixLQUFLLENBQUMsZ0JBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQURILE9BQUUsR0FBRixFQUFFLENBQVE7UUFIdkIsV0FBTSxHQUFZLEtBQUssQ0FBQTtRQUN2QixrQkFBYSxHQUFZLEtBQUssQ0FBQTtJQUl0QyxDQUFDO0lBdEJELElBQUksWUFBWTtRQUNiLE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQTtJQUM1QixDQUFDO0lBRUQsSUFBSSxLQUFLO1FBQ04sT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFBO0lBQ3JCLENBQUM7SUFFRCxJQUFJLEtBQUssQ0FBQyxLQUFjO1FBQ3JCLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFBO1FBRXpCLDBEQUEwRDtRQUMxRCxJQUFHLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDYixPQUFNO1NBQ1I7SUFDSixDQUFDO0NBUUg7QUF4QkQsZ0NBd0JDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRXZlbnRTZXQsIEV2ZW50IH0gZnJvbSBcIi4vRXZlbnRcIjtcblxuXG5leHBvcnQgY2xhc3MgSGFzSWRFdmVudCBleHRlbmRzIEV2ZW50IHtcbiAgIGdldCBhdHRlbXB0ZWRTZXQoKTogYm9vbGVhbiB7XG4gICAgICByZXR1cm4gdGhpcy5fYXR0ZW1wdGVkU2V0XG4gICB9XG5cbiAgIGdldCBoYXNJZCgpOiBib29sZWFuIHtcbiAgICAgIHJldHVybiB0aGlzLl9oYXNJZFxuICAgfVxuXG4gICBzZXQgaGFzSWQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICAgIHRoaXMuX2F0dGVtcHRlZFNldCA9IHRydWVcblxuICAgICAgLy8gSWYgaXQgaGFzIGFscmVhZHkgYmVlbiBzZXQgYnkgYSBwbHVnaW4sIHdlIGxlYXZlIGl0IHNldFxuICAgICAgaWYodGhpcy5faGFzSWQpIHtcbiAgICAgICAgIHJldHVyblxuICAgICAgfVxuICAgfVxuXG4gICBwcml2YXRlIF9oYXNJZDogYm9vbGVhbiA9IGZhbHNlXG4gICBwcml2YXRlIF9hdHRlbXB0ZWRTZXQ6IGJvb2xlYW4gPSBmYWxzZVxuXG4gICBjb25zdHJ1Y3RvcihyZWFkb25seSBpZDogc3RyaW5nKSB7XG4gICAgICBzdXBlcihFdmVudFNldC5IYXNJZClcbiAgIH1cbn0iXX0=