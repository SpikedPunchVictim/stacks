"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelUpdateEvent = void 0;
const Event_1 = require("./Event");
class ModelUpdateEvent extends Event_1.Event {
    constructor(model) {
        super(Event_1.EventSet.ModelUpdated);
        this.model = model;
    }
}
exports.ModelUpdateEvent = ModelUpdateEvent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTW9kZWxVcGRhdGVFdmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ldmVudHMvTW9kZWxVcGRhdGVFdmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxtQ0FBMEM7QUFHMUMsTUFBYSxnQkFBaUIsU0FBUSxhQUFLO0lBQ3hDLFlBQXFCLEtBQWE7UUFDL0IsS0FBSyxDQUFDLGdCQUFRLENBQUMsWUFBWSxDQUFDLENBQUE7UUFEVixVQUFLLEdBQUwsS0FBSyxDQUFRO0lBRWxDLENBQUM7Q0FDSDtBQUpELDRDQUlDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSU1vZGVsIH0gZnJvbSBcIi4uL01vZGVsXCI7XG5pbXBvcnQgeyBFdmVudCwgRXZlbnRTZXQgfSBmcm9tIFwiLi9FdmVudFwiO1xuXG5cbmV4cG9ydCBjbGFzcyBNb2RlbFVwZGF0ZUV2ZW50IGV4dGVuZHMgRXZlbnQge1xuICAgY29uc3RydWN0b3IocmVhZG9ubHkgbW9kZWw6IElNb2RlbCkge1xuICAgICAgc3VwZXIoRXZlbnRTZXQuTW9kZWxVcGRhdGVkKVxuICAgfVxufSJdfQ==