"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaveObjectEvent = void 0;
const Event_1 = require("./Event");
class SaveObjectEvent extends Event_1.Event {
    constructor(model, object, serialize) {
        super(Event_1.EventSet.ObjectSaved);
        this.model = model;
        this.object = object;
        this.serialize = serialize;
    }
}
exports.SaveObjectEvent = SaveObjectEvent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2F2ZU9iamVjdEV2ZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2V2ZW50cy9TYXZlT2JqZWN0RXZlbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEsbUNBQTBDO0FBRzFDLE1BQWEsZUFBdUMsU0FBUSxhQUFLO0lBQzlELFlBQXFCLEtBQWEsRUFBVyxNQUFTLEVBQVcsU0FBdUI7UUFDckYsS0FBSyxDQUFDLGdCQUFRLENBQUMsV0FBVyxDQUFDLENBQUE7UUFEVCxVQUFLLEdBQUwsS0FBSyxDQUFRO1FBQVcsV0FBTSxHQUFOLE1BQU0sQ0FBRztRQUFXLGNBQVMsR0FBVCxTQUFTLENBQWM7SUFFeEYsQ0FBQztDQUNIO0FBSkQsMENBSUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTdGFja09iamVjdCB9IGZyb20gXCIuLi9TdGFja09iamVjdFwiO1xuaW1wb3J0IHsgSU1vZGVsIH0gZnJvbSBcIi4uL01vZGVsXCI7XG5pbXBvcnQgeyBFdmVudCwgRXZlbnRTZXQgfSBmcm9tIFwiLi9FdmVudFwiO1xuaW1wb3J0IHsgSVByb3h5T2JqZWN0IH0gZnJvbSBcIi4uL1Byb3h5T2JqZWN0XCI7XG5cbmV4cG9ydCBjbGFzcyBTYXZlT2JqZWN0RXZlbnQ8VCBleHRlbmRzIFN0YWNrT2JqZWN0PiBleHRlbmRzIEV2ZW50IHtcbiAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IG1vZGVsOiBJTW9kZWwsIHJlYWRvbmx5IG9iamVjdDogVCwgcmVhZG9ubHkgc2VyaWFsaXplOiBJUHJveHlPYmplY3QpIHtcbiAgICAgIHN1cGVyKEV2ZW50U2V0Lk9iamVjdFNhdmVkKVxuICAgfVxufSJdfQ==