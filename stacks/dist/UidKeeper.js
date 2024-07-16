"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UidKeeper = void 0;
const secure_1 = require("uid/secure");
class UidKeeper {
    get stack() {
        return this._stack;
    }
    constructor() {
        this.ids = new Array();
        this._stack = undefined;
    }
    attach(stack) {
        this._stack = stack;
    }
    async generate(model) {
        let id = (0, secure_1.uid)(32);
        while (await this.has(id, model)) {
            id = (0, secure_1.uid)(32);
        }
        return id;
    }
    generateLocal() {
        return (0, secure_1.uid)(32);
    }
    async has(id, model) {
        if (this.ids.indexOf(id) >= 0) {
            return true;
        }
        return this.stack === undefined ? false : await this.stack.hasId(id, model);
    }
}
exports.UidKeeper = UidKeeper;
UidKeeper.IdNotSet = '---ID-Not-Set---';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVWlkS2VlcGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL1VpZEtlZXBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx1Q0FBZ0M7QUFtQ2hDLE1BQWEsU0FBUztJQUNuQixJQUFJLEtBQUs7UUFDTixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUE7SUFDckIsQ0FBQztJQU9EO1FBSFEsUUFBRyxHQUFrQixJQUFJLEtBQUssRUFBVSxDQUFBO1FBQ3hDLFdBQU0sR0FBdUIsU0FBUyxDQUFBO0lBSTlDLENBQUM7SUFFRCxNQUFNLENBQUMsS0FBYTtRQUNqQixJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQTtJQUN0QixDQUFDO0lBRUQsS0FBSyxDQUFDLFFBQVEsQ0FBQyxLQUFhO1FBQ3pCLElBQUksRUFBRSxHQUFHLElBQUEsWUFBRyxFQUFDLEVBQUUsQ0FBQyxDQUFBO1FBRWhCLE9BQU0sTUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUMsRUFBRSxDQUFDO1lBQy9CLEVBQUUsR0FBRyxJQUFBLFlBQUcsRUFBQyxFQUFFLENBQUMsQ0FBQTtRQUNmLENBQUM7UUFFRCxPQUFPLEVBQUUsQ0FBQTtJQUNaLENBQUM7SUFFRCxhQUFhO1FBQ1YsT0FBTyxJQUFBLFlBQUcsRUFBQyxFQUFFLENBQUMsQ0FBQTtJQUNqQixDQUFDO0lBRUQsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFVLEVBQUUsS0FBYTtRQUNoQyxJQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO1lBQzVCLE9BQU8sSUFBSSxDQUFBO1FBQ2QsQ0FBQztRQUVELE9BQU8sSUFBSSxDQUFDLEtBQUssS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUE7SUFDOUUsQ0FBQzs7QUF0Q0osOEJBdUNDO0FBbENTLGtCQUFRLEdBQUcsa0JBQWtCLEFBQXJCLENBQXFCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgdWlkIH0gZnJvbSAndWlkL3NlY3VyZSdcbmltcG9ydCB7IElNb2RlbCB9IGZyb20gJy4vTW9kZWwnXG5pbXBvcnQgeyBJU3RhY2sgfSBmcm9tICcuL3N0YWNrL1N0YWNrJ1xuXG4vKipcbiAqIFRoaXMgY2xhc3MgaXMgcmVzcG9uc2libGUgZm9yIGdlbmVyYXRpbmcgSURzIGZvciB0aGUgb2JqZWN0c1xuICovXG5leHBvcnQgaW50ZXJmYWNlIElVaWRLZWVwZXIge1xuICAgLyoqXG4gICAgKiBBdHRhaGNlcyB0aGUgU3RhY2sgdG8gdGhpcyBVaWRLZWVwZXJcbiAgICAqIFxuICAgICogQHBhcmFtIHN0YWNrIFRoZSBTdGFja1xuICAgICovXG4gICBhdHRhY2goc3RhY2s6IElTdGFjayk6IHZvaWRcblxuICAgLyoqXG4gICAgKiBHZW5lcmF0ZXMgYSB1bmlxdWUgSURcbiAgICAqL1xuICAgZ2VuZXJhdGUobW9kZWw6IElNb2RlbCk6IFByb21pc2U8c3RyaW5nPlxuXG4gICAvKipcbiAgICAqIEdlbmVyYXRlcyBhbiBJRCB1c2VkIGxvY2FsbHkuIFRoZXNlIGFyZSB1c2VkIGZvciBNb2RlbCBNZW1iZXJzXG4gICAgKiB3aGVyZSB0aGV5IGFyZSBub3QgZXhwZWN0ZWQgdG8gYmUgY29uc2lzdGVudCBiZXR3ZWVuIHJ1bnMuXG4gICAgKi9cbiAgIGdlbmVyYXRlTG9jYWwoKTogc3RyaW5nXG4gICBcbiAgIC8qKlxuICAgICogRGV0ZXJtaW5lcyBpZiBhbiBJRCBoYXMgYWxyZWFkeSBiZWVuIHJlc2VydmVkLlxuICAgICogXG4gICAgKiBAcGFyYW0gaWQgVGhlIElEIHRvIGNoZWNrXG4gICAgKiBAcGFyYW0gbW9kZWxJZCBUaGUgYXNzb2NpYXRlZCBNb2RlbCBJRFxuICAgICovXG4gICBoYXMoaWQ6IHN0cmluZywgbW9kZWw6IElNb2RlbCk6IFByb21pc2U8Ym9vbGVhbj5cbn1cblxuZXhwb3J0IGNsYXNzIFVpZEtlZXBlciBpbXBsZW1lbnRzIElVaWRLZWVwZXIge1xuICAgZ2V0IHN0YWNrKCk6IElTdGFjayB8IHVuZGVmaW5lZCB7XG4gICAgICByZXR1cm4gdGhpcy5fc3RhY2tcbiAgIH1cblxuICAgc3RhdGljIElkTm90U2V0ID0gJy0tLUlELU5vdC1TZXQtLS0nXG4gICBcbiAgIHByaXZhdGUgaWRzOiBBcnJheTxzdHJpbmc+ID0gbmV3IEFycmF5PHN0cmluZz4oKVxuICAgcHJpdmF0ZSBfc3RhY2s6IElTdGFjayB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZFxuXG4gICBjb25zdHJ1Y3RvcigpIHtcblxuICAgfVxuXG4gICBhdHRhY2goc3RhY2s6IElTdGFjayk6IHZvaWQge1xuICAgICAgdGhpcy5fc3RhY2sgPSBzdGFja1xuICAgfVxuXG4gICBhc3luYyBnZW5lcmF0ZShtb2RlbDogSU1vZGVsKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICAgIGxldCBpZCA9IHVpZCgzMilcblxuICAgICAgd2hpbGUoYXdhaXQgdGhpcy5oYXMoaWQsIG1vZGVsKSkge1xuICAgICAgICAgaWQgPSB1aWQoMzIpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBpZFxuICAgfVxuXG4gICBnZW5lcmF0ZUxvY2FsKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gdWlkKDMyKVxuICAgfVxuXG4gICBhc3luYyBoYXMoaWQ6IHN0cmluZywgbW9kZWw6IElNb2RlbCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgICAgaWYodGhpcy5pZHMuaW5kZXhPZihpZCkgPj0gMCkge1xuICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuc3RhY2sgPT09IHVuZGVmaW5lZCA/IGZhbHNlIDogYXdhaXQgdGhpcy5zdGFjay5oYXNJZChpZCwgbW9kZWwpXG4gICB9XG59Il19