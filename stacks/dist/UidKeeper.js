"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UidKeeper = void 0;
const secure_1 = require("uid/secure");
class UidKeeper {
    constructor() {
        this.ids = new Array();
        this._stack = undefined;
    }
    get stack() {
        return this._stack;
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
    async register(id) {
        if (this.ids.indexOf(id) >= 0) {
            return;
        }
        this.ids.push(id);
    }
    async unregister(id) {
        let index = this.ids.indexOf(id);
        if (index < 0) {
            return;
        }
        this.ids.splice(index, 1);
    }
}
exports.UidKeeper = UidKeeper;
UidKeeper.IdNotSet = '---ID-Not-Set---';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVWlkS2VlcGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL1VpZEtlZXBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx1Q0FBZ0M7QUFpRGhDLE1BQWEsU0FBUztJQVVuQjtRQUhRLFFBQUcsR0FBa0IsSUFBSSxLQUFLLEVBQVUsQ0FBQTtRQUN4QyxXQUFNLEdBQXVCLFNBQVMsQ0FBQTtJQUk5QyxDQUFDO0lBWEQsSUFBSSxLQUFLO1FBQ04sT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFBO0lBQ3JCLENBQUM7SUFXRCxNQUFNLENBQUMsS0FBYTtRQUNqQixJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQTtJQUN0QixDQUFDO0lBRUQsS0FBSyxDQUFDLFFBQVEsQ0FBQyxLQUFhO1FBQ3pCLElBQUksRUFBRSxHQUFHLElBQUEsWUFBRyxFQUFDLEVBQUUsQ0FBQyxDQUFBO1FBRWhCLE9BQU0sTUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUMsRUFBRTtZQUM5QixFQUFFLEdBQUcsSUFBQSxZQUFHLEVBQUMsRUFBRSxDQUFDLENBQUE7U0FDZDtRQUVELE9BQU8sRUFBRSxDQUFBO0lBQ1osQ0FBQztJQUVELGFBQWE7UUFDVixPQUFPLElBQUEsWUFBRyxFQUFDLEVBQUUsQ0FBQyxDQUFBO0lBQ2pCLENBQUM7SUFFRCxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQVUsRUFBRSxLQUFhO1FBQ2hDLElBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQzNCLE9BQU8sSUFBSSxDQUFBO1NBQ2I7UUFFRCxPQUFPLElBQUksQ0FBQyxLQUFLLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE1BQU0sSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFBO0lBQzlFLENBQUM7SUFHRCxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQVU7UUFDdEIsSUFBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDM0IsT0FBTTtTQUNSO1FBRUQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUE7SUFDcEIsQ0FBQztJQUVELEtBQUssQ0FBQyxVQUFVLENBQUMsRUFBVTtRQUN4QixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQTtRQUVoQyxJQUFHLEtBQUssR0FBRyxDQUFDLEVBQUU7WUFDWCxPQUFNO1NBQ1I7UUFFRCxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUE7SUFDNUIsQ0FBQzs7QUF6REosOEJBMERDO0FBckRTLGtCQUFRLEdBQUcsa0JBQWtCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB1aWQgfSBmcm9tICd1aWQvc2VjdXJlJ1xuaW1wb3J0IHsgSU1vZGVsIH0gZnJvbSAnLi9Nb2RlbCdcbmltcG9ydCB7IElTdGFjayB9IGZyb20gJy4vc3RhY2svU3RhY2snXG5cbi8qKlxuICogVGhpcyBjbGFzcyBpcyByZXNwb25zaWJsZSBmb3IgZ2VuZXJhdGluZyBJRHMgZm9yIHRoZSBvYmplY3RzXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSVVpZEtlZXBlciB7XG4gICAvKipcbiAgICAqIEF0dGFoY2VzIHRoZSBTdGFjayB0byB0aGlzIFVpZEtlZXBlclxuICAgICogXG4gICAgKiBAcGFyYW0gc3RhY2sgVGhlIFN0YWNrXG4gICAgKi9cbiAgIGF0dGFjaChzdGFjazogSVN0YWNrKTogdm9pZFxuXG4gICAvKipcbiAgICAqIEdlbmVyYXRlcyBhIHVuaXF1ZSBJRFxuICAgICovXG4gICBnZW5lcmF0ZShtb2RlbDogSU1vZGVsKTogUHJvbWlzZTxzdHJpbmc+XG5cbiAgIC8qKlxuICAgICogR2VuZXJhdGVzIGFuIElEIHVzZWQgbG9jYWxseS4gVGhlc2UgYXJlIHVzZWQgZm9yIE1vZGVsIE1lbWJlcnNcbiAgICAqIHdoZXJlIHRoZXkgYXJlIG5vdCBleHBlY3RlZCB0byBiZSBjb25zaXN0ZW50IGJldHdlZW4gcnVucy5cbiAgICAqL1xuICAgZ2VuZXJhdGVMb2NhbCgpOiBzdHJpbmdcbiAgIFxuICAgLyoqXG4gICAgKiBEZXRlcm1pbmVzIGlmIGFuIElEIGhhcyBhbHJlYWR5IGJlZW4gcmVzZXJ2ZWQuXG4gICAgKiBcbiAgICAqIEBwYXJhbSBpZCBUaGUgSUQgdG8gY2hlY2tcbiAgICAqIEBwYXJhbSBtb2RlbElkIFRoZSBhc3NvY2lhdGVkIE1vZGVsIElEXG4gICAgKi9cbiAgIGhhcyhpZDogc3RyaW5nLCBtb2RlbDogSU1vZGVsKTogUHJvbWlzZTxib29sZWFuPlxuXG4gICAvKipcbiAgICAqIFJlZ2lzdGVycyBhbiBJRCB3aXRoIHRoZSBVaWRLZWVwZXIuIFJlZ2lzdGVyZWQgSURzIHdvbid0IGJlIHVzZWQgYWdhaW5cbiAgICAqIFxuICAgICogQHBhcmFtIGlkIFRoZSBpZCB0byByZWdpc3RlclxuICAgICovXG4gICByZWdpc3RlcihpZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPlxuXG4gICAvKipcbiAgICAqIFVucmVnaXN0ZXJzIGFuIElEIHdpdGggdGhlIFVpZEtlZXBlci5cbiAgICAqIFxuICAgICogQHBhcmFtIGlkIFRoZSBpZCB0byB1bnJlZ2lzdGVyXG4gICAgKi9cbiAgIHVucmVnaXN0ZXIoaWQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD5cbn1cblxuZXhwb3J0IGNsYXNzIFVpZEtlZXBlciBpbXBsZW1lbnRzIElVaWRLZWVwZXIge1xuICAgZ2V0IHN0YWNrKCk6IElTdGFjayB8IHVuZGVmaW5lZCB7XG4gICAgICByZXR1cm4gdGhpcy5fc3RhY2tcbiAgIH1cblxuICAgc3RhdGljIElkTm90U2V0ID0gJy0tLUlELU5vdC1TZXQtLS0nXG4gICBcbiAgIHByaXZhdGUgaWRzOiBBcnJheTxzdHJpbmc+ID0gbmV3IEFycmF5PHN0cmluZz4oKVxuICAgcHJpdmF0ZSBfc3RhY2s6IElTdGFjayB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZFxuXG4gICBjb25zdHJ1Y3RvcigpIHtcblxuICAgfVxuXG4gICBhdHRhY2goc3RhY2s6IElTdGFjayk6IHZvaWQge1xuICAgICAgdGhpcy5fc3RhY2sgPSBzdGFja1xuICAgfVxuXG4gICBhc3luYyBnZW5lcmF0ZShtb2RlbDogSU1vZGVsKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICAgIGxldCBpZCA9IHVpZCgzMilcblxuICAgICAgd2hpbGUoYXdhaXQgdGhpcy5oYXMoaWQsIG1vZGVsKSkge1xuICAgICAgICAgaWQgPSB1aWQoMzIpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBpZFxuICAgfVxuXG4gICBnZW5lcmF0ZUxvY2FsKCk6IHN0cmluZyB7XG4gICAgICByZXR1cm4gdWlkKDMyKVxuICAgfVxuXG4gICBhc3luYyBoYXMoaWQ6IHN0cmluZywgbW9kZWw6IElNb2RlbCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgICAgaWYodGhpcy5pZHMuaW5kZXhPZihpZCkgPj0gMCkge1xuICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuc3RhY2sgPT09IHVuZGVmaW5lZCA/IGZhbHNlIDogYXdhaXQgdGhpcy5zdGFjay5oYXNJZChpZCwgbW9kZWwpXG4gICB9XG5cblxuICAgYXN5bmMgcmVnaXN0ZXIoaWQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgaWYodGhpcy5pZHMuaW5kZXhPZihpZCkgPj0gMCkge1xuICAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIHRoaXMuaWRzLnB1c2goaWQpXG4gICB9XG5cbiAgIGFzeW5jIHVucmVnaXN0ZXIoaWQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgbGV0IGluZGV4ID0gdGhpcy5pZHMuaW5kZXhPZihpZClcbiAgICAgIFxuICAgICAgaWYoaW5kZXggPCAwKSB7XG4gICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgdGhpcy5pZHMuc3BsaWNlKGluZGV4LCAxKVxuICAgfVxufSJdfQ==