"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HasIdEvent = void 0;
const Event_1 = require("./Event");
class HasIdEvent extends Event_1.Event {
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
    constructor(id, model) {
        super(Event_1.EventSet.HasId);
        this.id = id;
        this.model = model;
        this._hasId = false;
        this._attemptedSet = false;
    }
}
exports.HasIdEvent = HasIdEvent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSGFzSWRFdmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ldmVudHMvSGFzSWRFdmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxtQ0FBMEM7QUFFMUMsTUFBYSxVQUFXLFNBQVEsYUFBSztJQUNsQyxJQUFJLFlBQVk7UUFDYixPQUFPLElBQUksQ0FBQyxhQUFhLENBQUE7SUFDNUIsQ0FBQztJQUVELElBQUksS0FBSztRQUNOLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQTtJQUNyQixDQUFDO0lBRUQsSUFBSSxLQUFLLENBQUMsS0FBYztRQUNyQixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQTtRQUV6QiwwREFBMEQ7UUFDMUQsSUFBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDZCxPQUFNO1FBQ1QsQ0FBQztJQUNKLENBQUM7SUFLRCxZQUFxQixFQUFVLEVBQVcsS0FBYTtRQUNwRCxLQUFLLENBQUMsZ0JBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQURILE9BQUUsR0FBRixFQUFFLENBQVE7UUFBVyxVQUFLLEdBQUwsS0FBSyxDQUFRO1FBSC9DLFdBQU0sR0FBWSxLQUFLLENBQUE7UUFDdkIsa0JBQWEsR0FBWSxLQUFLLENBQUE7SUFJdEMsQ0FBQztDQUNIO0FBeEJELGdDQXdCQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElNb2RlbCB9IGZyb20gXCIuLi9Nb2RlbFwiO1xuaW1wb3J0IHsgRXZlbnRTZXQsIEV2ZW50IH0gZnJvbSBcIi4vRXZlbnRcIjtcblxuZXhwb3J0IGNsYXNzIEhhc0lkRXZlbnQgZXh0ZW5kcyBFdmVudCB7XG4gICBnZXQgYXR0ZW1wdGVkU2V0KCk6IGJvb2xlYW4ge1xuICAgICAgcmV0dXJuIHRoaXMuX2F0dGVtcHRlZFNldFxuICAgfVxuXG4gICBnZXQgaGFzSWQoKTogYm9vbGVhbiB7XG4gICAgICByZXR1cm4gdGhpcy5faGFzSWRcbiAgIH1cblxuICAgc2V0IGhhc0lkKHZhbHVlOiBib29sZWFuKSB7XG4gICAgICB0aGlzLl9hdHRlbXB0ZWRTZXQgPSB0cnVlXG5cbiAgICAgIC8vIElmIGl0IGhhcyBhbHJlYWR5IGJlZW4gc2V0IGJ5IGEgcGx1Z2luLCB3ZSBsZWF2ZSBpdCBzZXRcbiAgICAgIGlmKHRoaXMuX2hhc0lkKSB7XG4gICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgIH1cblxuICAgcHJpdmF0ZSBfaGFzSWQ6IGJvb2xlYW4gPSBmYWxzZVxuICAgcHJpdmF0ZSBfYXR0ZW1wdGVkU2V0OiBib29sZWFuID0gZmFsc2VcblxuICAgY29uc3RydWN0b3IocmVhZG9ubHkgaWQ6IHN0cmluZywgcmVhZG9ubHkgbW9kZWw6IElNb2RlbCkge1xuICAgICAgc3VwZXIoRXZlbnRTZXQuSGFzSWQpXG4gICB9XG59Il19