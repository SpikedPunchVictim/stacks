"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelDeleteEvent = void 0;
const Event_1 = require("./Event");
class ModelDeleteEvent extends Event_1.Event {
    constructor(model) {
        super(Event_1.EventSet.ModelDeleted);
        this.model = model;
    }
}
exports.ModelDeleteEvent = ModelDeleteEvent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTW9kZWxEZWxldGVFdmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ldmVudHMvTW9kZWxEZWxldGVFdmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxtQ0FBMEM7QUFFMUMsTUFBYSxnQkFBaUIsU0FBUSxhQUFLO0lBQ3hDLFlBQXFCLEtBQWE7UUFDL0IsS0FBSyxDQUFDLGdCQUFRLENBQUMsWUFBWSxDQUFDLENBQUE7UUFEVixVQUFLLEdBQUwsS0FBSyxDQUFRO0lBRWxDLENBQUM7Q0FDSDtBQUpELDRDQUlDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSU1vZGVsIH0gZnJvbSBcIi4uL01vZGVsXCI7XG5pbXBvcnQgeyBFdmVudCwgRXZlbnRTZXQgfSBmcm9tIFwiLi9FdmVudFwiO1xuXG5leHBvcnQgY2xhc3MgTW9kZWxEZWxldGVFdmVudCBleHRlbmRzIEV2ZW50IHtcbiAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IG1vZGVsOiBJTW9kZWwpIHtcbiAgICAgIHN1cGVyKEV2ZW50U2V0Lk1vZGVsRGVsZXRlZClcbiAgIH1cbn0iXX0=