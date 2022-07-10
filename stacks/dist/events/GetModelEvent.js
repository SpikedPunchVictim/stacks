"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetModelEvent = void 0;
const UidKeeper_1 = require("../UidKeeper");
const Event_1 = require("./Event");
class GetModelEvent extends Event_1.Event {
    constructor(name) {
        super(Event_1.EventSet.GetModel);
        this.name = name;
        this.params = new Array();
        this.exists = Event_1.ExistState.Unset;
        this._model = undefined;
        this._id = UidKeeper_1.UidKeeper.IdNotSet;
    }
    /**
     * The serialized version of the Object
     */
    get model() {
        return this._model;
    }
    set model(value) {
        if (value === undefined) {
            return;
        }
        this._model = value;
        this.exists = Event_1.ExistState.Exists;
    }
    get id() {
        return this._id;
    }
    setId(id) {
        this._id = id;
        return this;
    }
}
exports.GetModelEvent = GetModelEvent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR2V0TW9kZWxFdmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ldmVudHMvR2V0TW9kZWxFdmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSw0Q0FBeUM7QUFDekMsbUNBQXNEO0FBRXRELE1BQWEsYUFBYyxTQUFRLGFBQUs7SUE0QnJDLFlBQXFCLElBQVk7UUFDOUIsS0FBSyxDQUFDLGdCQUFRLENBQUMsUUFBUSxDQUFDLENBQUE7UUFETixTQUFJLEdBQUosSUFBSSxDQUFRO1FBM0J4QixXQUFNLEdBQXdCLElBQUksS0FBSyxFQUFxQixDQUFBO1FBc0JyRSxXQUFNLEdBQWUsa0JBQVUsQ0FBQyxLQUFLLENBQUE7UUFFN0IsV0FBTSxHQUF1QixTQUFTLENBQUE7UUFDdEMsUUFBRyxHQUFXLHFCQUFTLENBQUMsUUFBUSxDQUFBO0lBSXhDLENBQUM7SUEzQkQ7O09BRUc7SUFDSCxJQUFJLEtBQUs7UUFDTixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUE7SUFDckIsQ0FBQztJQUVELElBQUksS0FBSyxDQUFDLEtBQXlCO1FBQ2hDLElBQUcsS0FBSyxLQUFLLFNBQVMsRUFBRTtZQUNyQixPQUFNO1NBQ1I7UUFFRCxJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQTtRQUNuQixJQUFJLENBQUMsTUFBTSxHQUFHLGtCQUFVLENBQUMsTUFBTSxDQUFBO0lBQ2xDLENBQUM7SUFFRCxJQUFJLEVBQUU7UUFDSCxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUE7SUFDbEIsQ0FBQztJQVdELEtBQUssQ0FBQyxFQUFVO1FBQ2IsSUFBSSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUE7UUFDYixPQUFPLElBQUksQ0FBQTtJQUNkLENBQUM7Q0FDSDtBQXBDRCxzQ0FvQ0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJTW9kZWwsIE1vZGVsQ3JlYXRlUGFyYW1zIH0gZnJvbSBcIi4uL01vZGVsXCI7XG5pbXBvcnQgeyBVaWRLZWVwZXIgfSBmcm9tIFwiLi4vVWlkS2VlcGVyXCI7XG5pbXBvcnQgeyBFdmVudCwgRXZlbnRTZXQsIEV4aXN0U3RhdGUgfSBmcm9tIFwiLi9FdmVudFwiO1xuXG5leHBvcnQgY2xhc3MgR2V0TW9kZWxFdmVudCBleHRlbmRzIEV2ZW50IHtcbiAgIHJlYWRvbmx5IHBhcmFtczogTW9kZWxDcmVhdGVQYXJhbXNbXSA9IG5ldyBBcnJheTxNb2RlbENyZWF0ZVBhcmFtcz4oKVxuXG4gICAvKipcbiAgICAqIFRoZSBzZXJpYWxpemVkIHZlcnNpb24gb2YgdGhlIE9iamVjdFxuICAgICovXG4gICBnZXQgbW9kZWwoKTogSU1vZGVsIHwgdW5kZWZpbmVkIHtcbiAgICAgIHJldHVybiB0aGlzLl9tb2RlbFxuICAgfVxuXG4gICBzZXQgbW9kZWwodmFsdWU6IElNb2RlbCB8IHVuZGVmaW5lZCkge1xuICAgICAgaWYodmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIHRoaXMuX21vZGVsID0gdmFsdWVcbiAgICAgIHRoaXMuZXhpc3RzID0gRXhpc3RTdGF0ZS5FeGlzdHNcbiAgIH1cblxuICAgZ2V0IGlkKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gdGhpcy5faWRcbiAgIH1cblxuICAgZXhpc3RzOiBFeGlzdFN0YXRlID0gRXhpc3RTdGF0ZS5VbnNldFxuXG4gICBwcml2YXRlIF9tb2RlbDogSU1vZGVsIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkXG4gICBwcml2YXRlIF9pZDogc3RyaW5nID0gVWlkS2VlcGVyLklkTm90U2V0XG5cbiAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IG5hbWU6IHN0cmluZykge1xuICAgICAgc3VwZXIoRXZlbnRTZXQuR2V0TW9kZWwpXG4gICB9XG5cbiAgIHNldElkKGlkOiBzdHJpbmcpOiBHZXRNb2RlbEV2ZW50IHtcbiAgICAgIHRoaXMuX2lkID0gaWRcbiAgICAgIHJldHVybiB0aGlzXG4gICB9XG59Il19