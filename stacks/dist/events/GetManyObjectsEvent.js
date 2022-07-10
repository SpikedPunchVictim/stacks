"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetManyObjectsEvent = void 0;
const Event_1 = require("./Event");
class GetManyObjectsEvent extends Event_1.Event {
    constructor(model, options) {
        super(Event_1.EventSet.GetManyObjects);
        this.model = model;
        this.options = options;
        this.results = undefined;
        /**
         * Gets a flag that determines if the provided cursor was found.
         * The default beahvior when the cursor is not found is to return
         * data from the beginning of the set.
         */
        this.wasCursorFound = false;
    }
}
exports.GetManyObjectsEvent = GetManyObjectsEvent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR2V0TWFueU9iamVjdHNFdmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ldmVudHMvR2V0TWFueU9iamVjdHNFdmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxtQ0FBMEM7QUFFMUMsTUFBYSxtQkFBdUIsU0FBUSxhQUFLO0lBVTlDLFlBQXFCLEtBQWEsRUFBVyxPQUFvQjtRQUM5RCxLQUFLLENBQUMsZ0JBQVEsQ0FBQyxjQUFjLENBQUMsQ0FBQTtRQURaLFVBQUssR0FBTCxLQUFLLENBQVE7UUFBVyxZQUFPLEdBQVAsT0FBTyxDQUFhO1FBVGpFLFlBQU8sR0FBZ0MsU0FBUyxDQUFBO1FBRWhEOzs7O1dBSUc7UUFDSCxtQkFBYyxHQUFZLEtBQUssQ0FBQTtJQUkvQixDQUFDO0NBQ0g7QUFiRCxrREFhQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElNb2RlbCwgUGFnZVJlcXVlc3QsIFBhZ2VSZXNwb25zZSB9IGZyb20gXCIuLi9Nb2RlbFwiO1xuaW1wb3J0IHsgRXZlbnQsIEV2ZW50U2V0IH0gZnJvbSBcIi4vRXZlbnRcIjtcblxuZXhwb3J0IGNsYXNzIEdldE1hbnlPYmplY3RzRXZlbnQ8VD4gZXh0ZW5kcyBFdmVudCB7XG4gICByZXN1bHRzOiBQYWdlUmVzcG9uc2U8VD4gfCB1bmRlZmluZWQgPSB1bmRlZmluZWRcblxuICAgLyoqXG4gICAgKiBHZXRzIGEgZmxhZyB0aGF0IGRldGVybWluZXMgaWYgdGhlIHByb3ZpZGVkIGN1cnNvciB3YXMgZm91bmQuXG4gICAgKiBUaGUgZGVmYXVsdCBiZWFodmlvciB3aGVuIHRoZSBjdXJzb3IgaXMgbm90IGZvdW5kIGlzIHRvIHJldHVyblxuICAgICogZGF0YSBmcm9tIHRoZSBiZWdpbm5pbmcgb2YgdGhlIHNldC5cbiAgICAqL1xuICAgd2FzQ3Vyc29yRm91bmQ6IGJvb2xlYW4gPSBmYWxzZVxuXG4gICBjb25zdHJ1Y3RvcihyZWFkb25seSBtb2RlbDogSU1vZGVsLCByZWFkb25seSBvcHRpb25zOiBQYWdlUmVxdWVzdCkge1xuICAgICAgc3VwZXIoRXZlbnRTZXQuR2V0TWFueU9iamVjdHMpXG4gICB9XG59Il19