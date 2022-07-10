"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Event = exports.ExistState = exports.EventState = exports.EventSet = void 0;
var EventSet;
(function (EventSet) {
    EventSet["Bootstrap"] = "bootstrap";
    EventSet["GetManyObjects"] = "get-many-objects";
    EventSet["GetModel"] = "get-model";
    EventSet["GetObject"] = "get-object";
    EventSet["HasId"] = "has-id";
    EventSet["ModelCreated"] = "model-created";
    EventSet["ModelDeleted"] = "model-deleted";
    EventSet["ModelUpdated"] = "model-updated";
    EventSet["ObjectCreated"] = "object-created";
    EventSet["ObjectDeleted"] = "object-deleted";
    EventSet["ObjectUpdated"] = "object-updated";
    EventSet["ObjectSaved"] = "object-saved";
})(EventSet = exports.EventSet || (exports.EventSet = {}));
var EventState;
(function (EventState) {
    EventState["Raised"] = "raised";
    EventState["Rollback"] = "rollback";
})(EventState = exports.EventState || (exports.EventState = {}));
var ExistState;
(function (ExistState) {
    ExistState[ExistState["DoesNotExist"] = 0] = "DoesNotExist";
    ExistState[ExistState["Exists"] = 1] = "Exists";
    ExistState[ExistState["Unset"] = 2] = "Unset";
})(ExistState = exports.ExistState || (exports.ExistState = {}));
class Event {
    constructor(type) {
        this.type = type;
        this._state = EventState.Raised;
    }
    get state() {
        return this._state;
    }
    rollback() {
        this._state = EventState.Rollback;
    }
}
exports.Event = Event;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRXZlbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZXZlbnRzL0V2ZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLElBQVksUUFhWDtBQWJELFdBQVksUUFBUTtJQUNqQixtQ0FBdUIsQ0FBQTtJQUN2QiwrQ0FBbUMsQ0FBQTtJQUNuQyxrQ0FBc0IsQ0FBQTtJQUN0QixvQ0FBd0IsQ0FBQTtJQUN4Qiw0QkFBZ0IsQ0FBQTtJQUNoQiwwQ0FBOEIsQ0FBQTtJQUM5QiwwQ0FBOEIsQ0FBQTtJQUM5QiwwQ0FBOEIsQ0FBQTtJQUM5Qiw0Q0FBZ0MsQ0FBQTtJQUNoQyw0Q0FBZ0MsQ0FBQTtJQUNoQyw0Q0FBZ0MsQ0FBQTtJQUNoQyx3Q0FBNEIsQ0FBQTtBQUMvQixDQUFDLEVBYlcsUUFBUSxHQUFSLGdCQUFRLEtBQVIsZ0JBQVEsUUFhbkI7QUFFRCxJQUFZLFVBR1g7QUFIRCxXQUFZLFVBQVU7SUFDbkIsK0JBQWlCLENBQUE7SUFDakIsbUNBQXFCLENBQUE7QUFDeEIsQ0FBQyxFQUhXLFVBQVUsR0FBVixrQkFBVSxLQUFWLGtCQUFVLFFBR3JCO0FBRUQsSUFBWSxVQUlYO0FBSkQsV0FBWSxVQUFVO0lBQ25CLDJEQUFnQixDQUFBO0lBQ2hCLCtDQUFVLENBQUE7SUFDViw2Q0FBUyxDQUFBO0FBQ1osQ0FBQyxFQUpXLFVBQVUsR0FBVixrQkFBVSxLQUFWLGtCQUFVLFFBSXJCO0FBT0QsTUFBc0IsS0FBSztJQU94QixZQUFxQixJQUFjO1FBQWQsU0FBSSxHQUFKLElBQUksQ0FBVTtRQUYzQixXQUFNLEdBQWUsVUFBVSxDQUFDLE1BQU0sQ0FBQTtJQUk5QyxDQUFDO0lBUkQsSUFBSSxLQUFLO1FBQ04sT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFBO0lBQ3JCLENBQUM7SUFRRCxRQUFRO1FBQ0wsSUFBSSxDQUFDLE1BQU0sR0FBRyxVQUFVLENBQUMsUUFBUSxDQUFBO0lBQ3BDLENBQUM7Q0FDSDtBQWRELHNCQWNDIiwic291cmNlc0NvbnRlbnQiOlsiXG5leHBvcnQgZW51bSBFdmVudFNldCB7XG4gICBCb290c3RyYXAgPSAnYm9vdHN0cmFwJyxcbiAgIEdldE1hbnlPYmplY3RzID0gJ2dldC1tYW55LW9iamVjdHMnLFxuICAgR2V0TW9kZWwgPSAnZ2V0LW1vZGVsJyxcbiAgIEdldE9iamVjdCA9ICdnZXQtb2JqZWN0JyxcbiAgIEhhc0lkID0gJ2hhcy1pZCcsXG4gICBNb2RlbENyZWF0ZWQgPSAnbW9kZWwtY3JlYXRlZCcsXG4gICBNb2RlbERlbGV0ZWQgPSAnbW9kZWwtZGVsZXRlZCcsXG4gICBNb2RlbFVwZGF0ZWQgPSAnbW9kZWwtdXBkYXRlZCcsXG4gICBPYmplY3RDcmVhdGVkID0gJ29iamVjdC1jcmVhdGVkJyxcbiAgIE9iamVjdERlbGV0ZWQgPSAnb2JqZWN0LWRlbGV0ZWQnLFxuICAgT2JqZWN0VXBkYXRlZCA9ICdvYmplY3QtdXBkYXRlZCcsXG4gICBPYmplY3RTYXZlZCA9ICdvYmplY3Qtc2F2ZWQnXG59XG5cbmV4cG9ydCBlbnVtIEV2ZW50U3RhdGUge1xuICAgUmFpc2VkID0gJ3JhaXNlZCcsXG4gICBSb2xsYmFjayA9ICdyb2xsYmFjaydcbn1cblxuZXhwb3J0IGVudW0gRXhpc3RTdGF0ZSB7XG4gICBEb2VzTm90RXhpc3QgPSAwLFxuICAgRXhpc3RzID0gMSxcbiAgIFVuc2V0ID0gMlxufVxuXG5leHBvcnQgaW50ZXJmYWNlIElFdmVudCB7XG4gICByZWFkb25seSB0eXBlOiBFdmVudFNldFxuICAgcmVhZG9ubHkgc3RhdGU6IEV2ZW50U3RhdGVcbn1cblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEV2ZW50IGltcGxlbWVudHMgSUV2ZW50IHtcbiAgIGdldCBzdGF0ZSgpOiBFdmVudFN0YXRlIHtcbiAgICAgIHJldHVybiB0aGlzLl9zdGF0ZVxuICAgfVxuXG4gICBwcml2YXRlIF9zdGF0ZTogRXZlbnRTdGF0ZSA9IEV2ZW50U3RhdGUuUmFpc2VkXG5cbiAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IHR5cGU6IEV2ZW50U2V0KSB7XG5cbiAgIH1cblxuICAgcm9sbGJhY2soKTogdm9pZCB7XG4gICAgICB0aGlzLl9zdGF0ZSA9IEV2ZW50U3RhdGUuUm9sbGJhY2tcbiAgIH1cbn0iXX0=