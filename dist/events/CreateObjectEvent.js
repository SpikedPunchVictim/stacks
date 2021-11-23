"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateObjectEvent = void 0;
const Event_1 = require("./Event");
class CreateObjectEvent extends Event_1.Event {
    constructor(model, object) {
        super(Event_1.EventSet.ObjectCreated);
        this.model = model;
        this.object = object;
    }
}
exports.CreateObjectEvent = CreateObjectEvent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ3JlYXRlT2JqZWN0RXZlbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZXZlbnRzL0NyZWF0ZU9iamVjdEV2ZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLG1DQUEwQztBQUcxQyxNQUFhLGlCQUF5QyxTQUFRLGFBQUs7SUFDaEUsWUFBcUIsS0FBYSxFQUFXLE1BQVM7UUFDbkQsS0FBSyxDQUFDLGdCQUFRLENBQUMsYUFBYSxDQUFDLENBQUE7UUFEWCxVQUFLLEdBQUwsS0FBSyxDQUFRO1FBQVcsV0FBTSxHQUFOLE1BQU0sQ0FBRztJQUV0RCxDQUFDO0NBQ0g7QUFKRCw4Q0FJQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFN0YWNrT2JqZWN0IH0gZnJvbSBcIi4uL0JvbmRlZE9iamVjdFwiO1xuaW1wb3J0IHsgSU1vZGVsIH0gZnJvbSBcIi4uL01vZGVsXCI7XG5pbXBvcnQgeyBFdmVudCwgRXZlbnRTZXQgfSBmcm9tIFwiLi9FdmVudFwiO1xuXG5cbmV4cG9ydCBjbGFzcyBDcmVhdGVPYmplY3RFdmVudDxUIGV4dGVuZHMgU3RhY2tPYmplY3Q+IGV4dGVuZHMgRXZlbnQge1xuICAgY29uc3RydWN0b3IocmVhZG9ubHkgbW9kZWw6IElNb2RlbCwgcmVhZG9ubHkgb2JqZWN0OiBUKSB7XG4gICAgICBzdXBlcihFdmVudFNldC5PYmplY3RDcmVhdGVkKVxuICAgfVxufSJdfQ==