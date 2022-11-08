"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Event = exports.ExistState = exports.EventState = exports.EventSet = void 0;
var EventSet;
(function (EventSet) {
    EventSet["Bootstrap"] = "bootstrap";
    EventSet["GetManyObjects"] = "get-many-objects";
    EventSet["GetModel"] = "get-model";
    EventSet["GetObject"] = "get-object";
    EventSet["GetStoreContext"] = "get-store-context";
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRXZlbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZXZlbnRzL0V2ZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLElBQVksUUFjWDtBQWRELFdBQVksUUFBUTtJQUNqQixtQ0FBdUIsQ0FBQTtJQUN2QiwrQ0FBbUMsQ0FBQTtJQUNuQyxrQ0FBc0IsQ0FBQTtJQUN0QixvQ0FBd0IsQ0FBQTtJQUN4QixpREFBcUMsQ0FBQTtJQUNyQyw0QkFBZ0IsQ0FBQTtJQUNoQiwwQ0FBOEIsQ0FBQTtJQUM5QiwwQ0FBOEIsQ0FBQTtJQUM5QiwwQ0FBOEIsQ0FBQTtJQUM5Qiw0Q0FBZ0MsQ0FBQTtJQUNoQyw0Q0FBZ0MsQ0FBQTtJQUNoQyw0Q0FBZ0MsQ0FBQTtJQUNoQyx3Q0FBNEIsQ0FBQTtBQUMvQixDQUFDLEVBZFcsUUFBUSxHQUFSLGdCQUFRLEtBQVIsZ0JBQVEsUUFjbkI7QUFFRCxJQUFZLFVBR1g7QUFIRCxXQUFZLFVBQVU7SUFDbkIsK0JBQWlCLENBQUE7SUFDakIsbUNBQXFCLENBQUE7QUFDeEIsQ0FBQyxFQUhXLFVBQVUsR0FBVixrQkFBVSxLQUFWLGtCQUFVLFFBR3JCO0FBRUQsSUFBWSxVQUlYO0FBSkQsV0FBWSxVQUFVO0lBQ25CLDJEQUFnQixDQUFBO0lBQ2hCLCtDQUFVLENBQUE7SUFDViw2Q0FBUyxDQUFBO0FBQ1osQ0FBQyxFQUpXLFVBQVUsR0FBVixrQkFBVSxLQUFWLGtCQUFVLFFBSXJCO0FBT0QsTUFBc0IsS0FBSztJQU94QixZQUFxQixJQUFjO1FBQWQsU0FBSSxHQUFKLElBQUksQ0FBVTtRQUYzQixXQUFNLEdBQWUsVUFBVSxDQUFDLE1BQU0sQ0FBQTtJQUk5QyxDQUFDO0lBUkQsSUFBSSxLQUFLO1FBQ04sT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFBO0lBQ3JCLENBQUM7SUFRRCxRQUFRO1FBQ0wsSUFBSSxDQUFDLE1BQU0sR0FBRyxVQUFVLENBQUMsUUFBUSxDQUFBO0lBQ3BDLENBQUM7Q0FDSDtBQWRELHNCQWNDIiwic291cmNlc0NvbnRlbnQiOlsiXG5leHBvcnQgZW51bSBFdmVudFNldCB7XG4gICBCb290c3RyYXAgPSAnYm9vdHN0cmFwJyxcbiAgIEdldE1hbnlPYmplY3RzID0gJ2dldC1tYW55LW9iamVjdHMnLFxuICAgR2V0TW9kZWwgPSAnZ2V0LW1vZGVsJyxcbiAgIEdldE9iamVjdCA9ICdnZXQtb2JqZWN0JyxcbiAgIEdldFN0b3JlQ29udGV4dCA9ICdnZXQtc3RvcmUtY29udGV4dCcsXG4gICBIYXNJZCA9ICdoYXMtaWQnLFxuICAgTW9kZWxDcmVhdGVkID0gJ21vZGVsLWNyZWF0ZWQnLFxuICAgTW9kZWxEZWxldGVkID0gJ21vZGVsLWRlbGV0ZWQnLFxuICAgTW9kZWxVcGRhdGVkID0gJ21vZGVsLXVwZGF0ZWQnLFxuICAgT2JqZWN0Q3JlYXRlZCA9ICdvYmplY3QtY3JlYXRlZCcsXG4gICBPYmplY3REZWxldGVkID0gJ29iamVjdC1kZWxldGVkJyxcbiAgIE9iamVjdFVwZGF0ZWQgPSAnb2JqZWN0LXVwZGF0ZWQnLFxuICAgT2JqZWN0U2F2ZWQgPSAnb2JqZWN0LXNhdmVkJ1xufVxuXG5leHBvcnQgZW51bSBFdmVudFN0YXRlIHtcbiAgIFJhaXNlZCA9ICdyYWlzZWQnLFxuICAgUm9sbGJhY2sgPSAncm9sbGJhY2snXG59XG5cbmV4cG9ydCBlbnVtIEV4aXN0U3RhdGUge1xuICAgRG9lc05vdEV4aXN0ID0gMCxcbiAgIEV4aXN0cyA9IDEsXG4gICBVbnNldCA9IDJcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJRXZlbnQge1xuICAgcmVhZG9ubHkgdHlwZTogRXZlbnRTZXRcbiAgIHJlYWRvbmx5IHN0YXRlOiBFdmVudFN0YXRlXG59XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBFdmVudCBpbXBsZW1lbnRzIElFdmVudCB7XG4gICBnZXQgc3RhdGUoKTogRXZlbnRTdGF0ZSB7XG4gICAgICByZXR1cm4gdGhpcy5fc3RhdGVcbiAgIH1cblxuICAgcHJpdmF0ZSBfc3RhdGU6IEV2ZW50U3RhdGUgPSBFdmVudFN0YXRlLlJhaXNlZFxuXG4gICBjb25zdHJ1Y3RvcihyZWFkb25seSB0eXBlOiBFdmVudFNldCkge1xuXG4gICB9XG5cbiAgIHJvbGxiYWNrKCk6IHZvaWQge1xuICAgICAgdGhpcy5fc3RhdGUgPSBFdmVudFN0YXRlLlJvbGxiYWNrXG4gICB9XG59Il19