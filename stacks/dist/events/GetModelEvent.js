"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetModelEvent = void 0;
const UidKeeper_1 = require("../UidKeeper");
const Event_1 = require("./Event");
class GetModelEvent extends Event_1.Event {
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
    constructor(name) {
        super(Event_1.EventSet.GetModel);
        this.name = name;
        this.params = new Array();
        this.exists = Event_1.ExistState.Unset;
        this._model = undefined;
        this._id = UidKeeper_1.UidKeeper.IdNotSet;
    }
    setId(id) {
        this._id = id;
        return this;
    }
}
exports.GetModelEvent = GetModelEvent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR2V0TW9kZWxFdmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ldmVudHMvR2V0TW9kZWxFdmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSw0Q0FBeUM7QUFDekMsbUNBQXNEO0FBRXRELE1BQWEsYUFBYyxTQUFRLGFBQUs7SUFHckM7O09BRUc7SUFDSCxJQUFJLEtBQUs7UUFDTixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUE7SUFDckIsQ0FBQztJQUVELElBQUksS0FBSyxDQUFDLEtBQXlCO1FBQ2hDLElBQUcsS0FBSyxLQUFLLFNBQVMsRUFBRSxDQUFDO1lBQ3RCLE9BQU07UUFDVCxDQUFDO1FBRUQsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUE7UUFDbkIsSUFBSSxDQUFDLE1BQU0sR0FBRyxrQkFBVSxDQUFDLE1BQU0sQ0FBQTtJQUNsQyxDQUFDO0lBRUQsSUFBSSxFQUFFO1FBQ0gsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFBO0lBQ2xCLENBQUM7SUFPRCxZQUFxQixJQUFZO1FBQzlCLEtBQUssQ0FBQyxnQkFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFBO1FBRE4sU0FBSSxHQUFKLElBQUksQ0FBUTtRQTNCeEIsV0FBTSxHQUF3QixJQUFJLEtBQUssRUFBcUIsQ0FBQTtRQXNCckUsV0FBTSxHQUFlLGtCQUFVLENBQUMsS0FBSyxDQUFBO1FBRTdCLFdBQU0sR0FBdUIsU0FBUyxDQUFBO1FBQ3RDLFFBQUcsR0FBVyxxQkFBUyxDQUFDLFFBQVEsQ0FBQTtJQUl4QyxDQUFDO0lBRUQsS0FBSyxDQUFDLEVBQVU7UUFDYixJQUFJLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQTtRQUNiLE9BQU8sSUFBSSxDQUFBO0lBQ2QsQ0FBQztDQUNIO0FBcENELHNDQW9DQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElNb2RlbCwgTW9kZWxDcmVhdGVQYXJhbXMgfSBmcm9tIFwiLi4vTW9kZWxcIjtcbmltcG9ydCB7IFVpZEtlZXBlciB9IGZyb20gXCIuLi9VaWRLZWVwZXJcIjtcbmltcG9ydCB7IEV2ZW50LCBFdmVudFNldCwgRXhpc3RTdGF0ZSB9IGZyb20gXCIuL0V2ZW50XCI7XG5cbmV4cG9ydCBjbGFzcyBHZXRNb2RlbEV2ZW50IGV4dGVuZHMgRXZlbnQge1xuICAgcmVhZG9ubHkgcGFyYW1zOiBNb2RlbENyZWF0ZVBhcmFtc1tdID0gbmV3IEFycmF5PE1vZGVsQ3JlYXRlUGFyYW1zPigpXG5cbiAgIC8qKlxuICAgICogVGhlIHNlcmlhbGl6ZWQgdmVyc2lvbiBvZiB0aGUgT2JqZWN0XG4gICAgKi9cbiAgIGdldCBtb2RlbCgpOiBJTW9kZWwgfCB1bmRlZmluZWQge1xuICAgICAgcmV0dXJuIHRoaXMuX21vZGVsXG4gICB9XG5cbiAgIHNldCBtb2RlbCh2YWx1ZTogSU1vZGVsIHwgdW5kZWZpbmVkKSB7XG4gICAgICBpZih2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgdGhpcy5fbW9kZWwgPSB2YWx1ZVxuICAgICAgdGhpcy5leGlzdHMgPSBFeGlzdFN0YXRlLkV4aXN0c1xuICAgfVxuXG4gICBnZXQgaWQoKTogc3RyaW5nIHtcbiAgICAgIHJldHVybiB0aGlzLl9pZFxuICAgfVxuXG4gICBleGlzdHM6IEV4aXN0U3RhdGUgPSBFeGlzdFN0YXRlLlVuc2V0XG5cbiAgIHByaXZhdGUgX21vZGVsOiBJTW9kZWwgfCB1bmRlZmluZWQgPSB1bmRlZmluZWRcbiAgIHByaXZhdGUgX2lkOiBzdHJpbmcgPSBVaWRLZWVwZXIuSWROb3RTZXRcblxuICAgY29uc3RydWN0b3IocmVhZG9ubHkgbmFtZTogc3RyaW5nKSB7XG4gICAgICBzdXBlcihFdmVudFNldC5HZXRNb2RlbClcbiAgIH1cblxuICAgc2V0SWQoaWQ6IHN0cmluZyk6IEdldE1vZGVsRXZlbnQge1xuICAgICAgdGhpcy5faWQgPSBpZFxuICAgICAgcmV0dXJuIHRoaXNcbiAgIH1cbn0iXX0=