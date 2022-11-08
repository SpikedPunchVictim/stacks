"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HasIdEvent = void 0;
const Event_1 = require("./Event");
class HasIdEvent extends Event_1.Event {
    constructor(id, model) {
        super(Event_1.EventSet.HasId);
        this.id = id;
        this.model = model;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSGFzSWRFdmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ldmVudHMvSGFzSWRFdmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxtQ0FBMEM7QUFFMUMsTUFBYSxVQUFXLFNBQVEsYUFBSztJQXFCbEMsWUFBcUIsRUFBVSxFQUFXLEtBQWE7UUFDcEQsS0FBSyxDQUFDLGdCQUFRLENBQUMsS0FBSyxDQUFDLENBQUE7UUFESCxPQUFFLEdBQUYsRUFBRSxDQUFRO1FBQVcsVUFBSyxHQUFMLEtBQUssQ0FBUTtRQUgvQyxXQUFNLEdBQVksS0FBSyxDQUFBO1FBQ3ZCLGtCQUFhLEdBQVksS0FBSyxDQUFBO0lBSXRDLENBQUM7SUF0QkQsSUFBSSxZQUFZO1FBQ2IsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFBO0lBQzVCLENBQUM7SUFFRCxJQUFJLEtBQUs7UUFDTixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUE7SUFDckIsQ0FBQztJQUVELElBQUksS0FBSyxDQUFDLEtBQWM7UUFDckIsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUE7UUFFekIsMERBQTBEO1FBQzFELElBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNiLE9BQU07U0FDUjtJQUNKLENBQUM7Q0FRSDtBQXhCRCxnQ0F3QkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJTW9kZWwgfSBmcm9tIFwiLi4vTW9kZWxcIjtcbmltcG9ydCB7IEV2ZW50U2V0LCBFdmVudCB9IGZyb20gXCIuL0V2ZW50XCI7XG5cbmV4cG9ydCBjbGFzcyBIYXNJZEV2ZW50IGV4dGVuZHMgRXZlbnQge1xuICAgZ2V0IGF0dGVtcHRlZFNldCgpOiBib29sZWFuIHtcbiAgICAgIHJldHVybiB0aGlzLl9hdHRlbXB0ZWRTZXRcbiAgIH1cblxuICAgZ2V0IGhhc0lkKCk6IGJvb2xlYW4ge1xuICAgICAgcmV0dXJuIHRoaXMuX2hhc0lkXG4gICB9XG5cbiAgIHNldCBoYXNJZCh2YWx1ZTogYm9vbGVhbikge1xuICAgICAgdGhpcy5fYXR0ZW1wdGVkU2V0ID0gdHJ1ZVxuXG4gICAgICAvLyBJZiBpdCBoYXMgYWxyZWFkeSBiZWVuIHNldCBieSBhIHBsdWdpbiwgd2UgbGVhdmUgaXQgc2V0XG4gICAgICBpZih0aGlzLl9oYXNJZCkge1xuICAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICB9XG5cbiAgIHByaXZhdGUgX2hhc0lkOiBib29sZWFuID0gZmFsc2VcbiAgIHByaXZhdGUgX2F0dGVtcHRlZFNldDogYm9vbGVhbiA9IGZhbHNlXG5cbiAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IGlkOiBzdHJpbmcsIHJlYWRvbmx5IG1vZGVsOiBJTW9kZWwpIHtcbiAgICAgIHN1cGVyKEV2ZW50U2V0Lkhhc0lkKVxuICAgfVxufSJdfQ==