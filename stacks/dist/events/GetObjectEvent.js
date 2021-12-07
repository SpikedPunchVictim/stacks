"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetObjectEvent = void 0;
const Event_1 = require("./Event");
class GetObjectEvent extends Event_1.Event {
    constructor(model, id) {
        super(Event_1.EventSet.GetObject);
        this.model = model;
        this.id = id;
        this.exists = Event_1.ExistState.Unset;
        this._object = undefined;
    }
    /**
     * The serialized version of the Object
     */
    get object() {
        return this._object;
    }
    set object(value) {
        if (value === undefined) {
            return;
        }
        this._object = value;
        this.exists = Event_1.ExistState.Exists;
    }
}
exports.GetObjectEvent = GetObjectEvent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR2V0T2JqZWN0RXZlbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZXZlbnRzL0dldE9iamVjdEV2ZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLG1DQUFzRDtBQUV0RCxNQUFhLGNBQWtCLFNBQVEsYUFBSztJQXFCekMsWUFBcUIsS0FBYSxFQUFXLEVBQVU7UUFDcEQsS0FBSyxDQUFDLGdCQUFRLENBQUMsU0FBUyxDQUFDLENBQUE7UUFEUCxVQUFLLEdBQUwsS0FBSyxDQUFRO1FBQVcsT0FBRSxHQUFGLEVBQUUsQ0FBUTtRQUp2RCxXQUFNLEdBQWUsa0JBQVUsQ0FBQyxLQUFLLENBQUE7UUFFN0IsWUFBTyxHQUFrQixTQUFTLENBQUE7SUFJMUMsQ0FBQztJQXRCRDs7T0FFRztJQUNILElBQUksTUFBTTtRQUNQLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQTtJQUN0QixDQUFDO0lBRUQsSUFBSSxNQUFNLENBQUMsS0FBb0I7UUFDNUIsSUFBRyxLQUFLLEtBQUssU0FBUyxFQUFFO1lBQ3JCLE9BQU07U0FDUjtRQUVELElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFBO1FBQ3BCLElBQUksQ0FBQyxNQUFNLEdBQUcsa0JBQVUsQ0FBQyxNQUFNLENBQUE7SUFDbEMsQ0FBQztDQVNIO0FBeEJELHdDQXdCQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElNb2RlbCB9IGZyb20gXCIuLi9Nb2RlbFwiO1xuaW1wb3J0IHsgRXZlbnQsIEV2ZW50U2V0LCBFeGlzdFN0YXRlIH0gZnJvbSBcIi4vRXZlbnRcIjtcblxuZXhwb3J0IGNsYXNzIEdldE9iamVjdEV2ZW50PFQ+IGV4dGVuZHMgRXZlbnQge1xuICAgLyoqXG4gICAgKiBUaGUgc2VyaWFsaXplZCB2ZXJzaW9uIG9mIHRoZSBPYmplY3RcbiAgICAqL1xuICAgZ2V0IG9iamVjdCgpOiBUIHwgdW5kZWZpbmVkIHtcbiAgICAgIHJldHVybiB0aGlzLl9vYmplY3RcbiAgIH1cblxuICAgc2V0IG9iamVjdCh2YWx1ZTogVCB8IHVuZGVmaW5lZCkge1xuICAgICAgaWYodmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIHRoaXMuX29iamVjdCA9IHZhbHVlXG4gICAgICB0aGlzLmV4aXN0cyA9IEV4aXN0U3RhdGUuRXhpc3RzXG4gICB9XG5cbiAgIGV4aXN0czogRXhpc3RTdGF0ZSA9IEV4aXN0U3RhdGUuVW5zZXRcblxuICAgcHJpdmF0ZSBfb2JqZWN0OiBUIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkXG5cbiAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IG1vZGVsOiBJTW9kZWwsIHJlYWRvbmx5IGlkOiBzdHJpbmcpIHtcbiAgICAgIHN1cGVyKEV2ZW50U2V0LkdldE9iamVjdClcbiAgIH1cbn0iXX0=