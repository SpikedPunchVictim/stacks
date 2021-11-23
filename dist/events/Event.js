"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Event = exports.ExistState = exports.EventState = exports.EventSet = void 0;
var EventSet;
(function (EventSet) {
    EventSet["CommitObject"] = "commit-object";
    EventSet["GetManyObjects"] = "get-many-objects";
    EventSet["GetObject"] = "get-object";
    EventSet["HasId"] = "has-id";
    EventSet["ObjectCreated"] = "object-created";
    EventSet["ObjectDeleted"] = "object-deleted";
    EventSet["ObjectUpdated"] = "object-updated";
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRXZlbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZXZlbnRzL0V2ZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLElBQVksUUFRWDtBQVJELFdBQVksUUFBUTtJQUNqQiwwQ0FBOEIsQ0FBQTtJQUM5QiwrQ0FBbUMsQ0FBQTtJQUNuQyxvQ0FBd0IsQ0FBQTtJQUN4Qiw0QkFBZ0IsQ0FBQTtJQUNoQiw0Q0FBZ0MsQ0FBQTtJQUNoQyw0Q0FBZ0MsQ0FBQTtJQUNoQyw0Q0FBZ0MsQ0FBQTtBQUNuQyxDQUFDLEVBUlcsUUFBUSxHQUFSLGdCQUFRLEtBQVIsZ0JBQVEsUUFRbkI7QUFFRCxJQUFZLFVBR1g7QUFIRCxXQUFZLFVBQVU7SUFDbkIsK0JBQWlCLENBQUE7SUFDakIsbUNBQXFCLENBQUE7QUFDeEIsQ0FBQyxFQUhXLFVBQVUsR0FBVixrQkFBVSxLQUFWLGtCQUFVLFFBR3JCO0FBRUQsSUFBWSxVQUlYO0FBSkQsV0FBWSxVQUFVO0lBQ25CLDJEQUFnQixDQUFBO0lBQ2hCLCtDQUFVLENBQUE7SUFDViw2Q0FBUyxDQUFBO0FBQ1osQ0FBQyxFQUpXLFVBQVUsR0FBVixrQkFBVSxLQUFWLGtCQUFVLFFBSXJCO0FBT0QsTUFBc0IsS0FBSztJQU94QixZQUFxQixJQUFjO1FBQWQsU0FBSSxHQUFKLElBQUksQ0FBVTtRQUYzQixXQUFNLEdBQWUsVUFBVSxDQUFDLE1BQU0sQ0FBQTtJQUk5QyxDQUFDO0lBUkQsSUFBSSxLQUFLO1FBQ04sT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFBO0lBQ3JCLENBQUM7SUFRRCxRQUFRO1FBQ0wsSUFBSSxDQUFDLE1BQU0sR0FBRyxVQUFVLENBQUMsUUFBUSxDQUFBO0lBQ3BDLENBQUM7Q0FDSDtBQWRELHNCQWNDIiwic291cmNlc0NvbnRlbnQiOlsiXG5leHBvcnQgZW51bSBFdmVudFNldCB7XG4gICBDb21taXRPYmplY3QgPSAnY29tbWl0LW9iamVjdCcsXG4gICBHZXRNYW55T2JqZWN0cyA9ICdnZXQtbWFueS1vYmplY3RzJyxcbiAgIEdldE9iamVjdCA9ICdnZXQtb2JqZWN0JyxcbiAgIEhhc0lkID0gJ2hhcy1pZCcsXG4gICBPYmplY3RDcmVhdGVkID0gJ29iamVjdC1jcmVhdGVkJyxcbiAgIE9iamVjdERlbGV0ZWQgPSAnb2JqZWN0LWRlbGV0ZWQnLFxuICAgT2JqZWN0VXBkYXRlZCA9ICdvYmplY3QtdXBkYXRlZCdcbn1cblxuZXhwb3J0IGVudW0gRXZlbnRTdGF0ZSB7XG4gICBSYWlzZWQgPSAncmFpc2VkJyxcbiAgIFJvbGxiYWNrID0gJ3JvbGxiYWNrJ1xufVxuXG5leHBvcnQgZW51bSBFeGlzdFN0YXRlIHtcbiAgIERvZXNOb3RFeGlzdCA9IDAsXG4gICBFeGlzdHMgPSAxLFxuICAgVW5zZXQgPSAyXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSUV2ZW50IHtcbiAgIHJlYWRvbmx5IHR5cGU6IEV2ZW50U2V0XG4gICByZWFkb25seSBzdGF0ZTogRXZlbnRTdGF0ZVxufVxuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgRXZlbnQgaW1wbGVtZW50cyBJRXZlbnQge1xuICAgZ2V0IHN0YXRlKCk6IEV2ZW50U3RhdGUge1xuICAgICAgcmV0dXJuIHRoaXMuX3N0YXRlXG4gICB9XG5cbiAgIHByaXZhdGUgX3N0YXRlOiBFdmVudFN0YXRlID0gRXZlbnRTdGF0ZS5SYWlzZWRcblxuICAgY29uc3RydWN0b3IocmVhZG9ubHkgdHlwZTogRXZlbnRTZXQpIHtcblxuICAgfVxuXG4gICByb2xsYmFjaygpOiB2b2lkIHtcbiAgICAgIHRoaXMuX3N0YXRlID0gRXZlbnRTdGF0ZS5Sb2xsYmFja1xuICAgfVxufSJdfQ==