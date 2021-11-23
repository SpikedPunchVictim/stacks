"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommitObjectEvent = void 0;
const Event_1 = require("./Event");
class CommitObjectEvent extends Event_1.Event {
    constructor(model, obj) {
        super(Event_1.EventSet.CommitObject);
        this.model = model;
        this.obj = obj;
    }
}
exports.CommitObjectEvent = CommitObjectEvent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29tbWl0T2JqZWN0RXZlbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZXZlbnRzL0NvbW1pdE9iamVjdEV2ZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLG1DQUEwQztBQUcxQyxNQUFhLGlCQUF5QyxTQUFRLGFBQUs7SUFDaEUsWUFBcUIsS0FBYSxFQUFXLEdBQU07UUFDaEQsS0FBSyxDQUFDLGdCQUFRLENBQUMsWUFBWSxDQUFDLENBQUE7UUFEVixVQUFLLEdBQUwsS0FBSyxDQUFRO1FBQVcsUUFBRyxHQUFILEdBQUcsQ0FBRztJQUVuRCxDQUFDO0NBQ0g7QUFKRCw4Q0FJQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFN0YWNrT2JqZWN0IH0gZnJvbSBcIi4uXCI7XG5pbXBvcnQgeyBJTW9kZWwgfSBmcm9tIFwiLi4vTW9kZWxcIjtcbmltcG9ydCB7IEV2ZW50LCBFdmVudFNldCB9IGZyb20gXCIuL0V2ZW50XCI7XG5cblxuZXhwb3J0IGNsYXNzIENvbW1pdE9iamVjdEV2ZW50PFQgZXh0ZW5kcyBTdGFja09iamVjdD4gZXh0ZW5kcyBFdmVudCB7XG4gICBjb25zdHJ1Y3RvcihyZWFkb25seSBtb2RlbDogSU1vZGVsLCByZWFkb25seSBvYmo6IFQpIHtcbiAgICAgIHN1cGVyKEV2ZW50U2V0LkNvbW1pdE9iamVjdClcbiAgIH1cbn0iXX0=