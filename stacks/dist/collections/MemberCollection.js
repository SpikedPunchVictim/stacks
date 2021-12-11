"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemberCollection = void 0;
const Member_1 = require("../Member");
class MemberCollection {
    constructor(model, context) {
        this.model = model;
        this.context = context;
        this.members = new Array();
    }
    get uid() {
        return this.context.uid;
    }
    [Symbol.iterator]() {
        let index = 0;
        let self = this;
        return {
            next() {
                return index == self.members.length ?
                    { value: undefined, done: true } :
                    { value: self.members[index++], done: false };
            }
        };
    }
    async add(name, value) {
        let found = this.members.find(m => m.name === name);
        let member = Member_1.Member.create({ [name]: value }, { model: this.model }, this.context);
        if (found !== undefined) {
            found.value = member[0].value;
            return;
        }
        this.members.push(...member);
    }
    async append(obj) {
        let members = Member_1.Member.create(obj, { model: this.model }, this.context);
        for (let member of members) {
            let found = this.members.find(m => m.name === member.name);
            // Replace an existing Member if the Types match
            if (found !== undefined) {
                found.value = member.value;
                continue;
            }
            this.members.push(member);
        }
    }
    async delete(name) {
        let found = this.members.findIndex(m => m.name === name);
        if (found) {
            this.members.splice(found, 1);
        }
    }
    find(predicate) {
        return this.members.find(predicate);
    }
    map(visit) {
        return this.members.map(visit);
    }
    get(name) {
        return this.members.find(m => m.name === name);
    }
}
exports.MemberCollection = MemberCollection;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWVtYmVyQ29sbGVjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb2xsZWN0aW9ucy9NZW1iZXJDb2xsZWN0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHNDQUF5RDtBQTBCekQsTUFBYSxnQkFBZ0I7SUFVMUIsWUFBWSxLQUFhLEVBQUUsT0FBc0I7UUFDOUMsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUE7UUFDbEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUE7UUFDdEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLEtBQUssRUFBVyxDQUFBO0lBQ3RDLENBQUM7SUFWRCxJQUFJLEdBQUc7UUFDSixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFBO0lBQzFCLENBQUM7SUFVRCxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUM7UUFDZCxJQUFJLEtBQUssR0FBRyxDQUFDLENBQUE7UUFDYixJQUFJLElBQUksR0FBRyxJQUFJLENBQUE7UUFDZixPQUFPO1lBQ0osSUFBSTtnQkFDRCxPQUFPLEtBQUssSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO29CQUNsQyxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7b0JBQ2xDLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLENBQUE7WUFDbkQsQ0FBQztTQUNILENBQUE7SUFDSixDQUFDO0lBRUQsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFZLEVBQUUsS0FBa0I7UUFDdkMsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQyxDQUFBO1FBRW5ELElBQUksTUFBTSxHQUFHLGVBQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7UUFFbEYsSUFBRyxLQUFLLEtBQUssU0FBUyxFQUFFO1lBQ3JCLEtBQUssQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQTtZQUM3QixPQUFNO1NBQ1I7UUFFRCxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFBO0lBQy9CLENBQUM7SUFFRCxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQXNCO1FBQ2hDLElBQUksT0FBTyxHQUFHLGVBQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7UUFFckUsS0FBSSxJQUFJLE1BQU0sSUFBSSxPQUFPLEVBQUU7WUFDeEIsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQTtZQUUxRCxnREFBZ0Q7WUFDaEQsSUFBRyxLQUFLLEtBQUssU0FBUyxFQUFFO2dCQUNyQixLQUFLLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUE7Z0JBQzFCLFNBQVE7YUFDVjtZQUVELElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFBO1NBQzNCO0lBQ0osQ0FBQztJQUVELEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBWTtRQUN0QixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssSUFBSSxDQUFDLENBQUE7UUFFeEQsSUFBRyxLQUFLLEVBQUU7WUFDUCxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUE7U0FDL0I7SUFDSixDQUFDO0lBRUQsSUFBSSxDQUFDLFNBQWdDO1FBQ2xDLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUE7SUFDdEMsQ0FBQztJQUVELEdBQUcsQ0FBSSxLQUE0QjtRQUNoQyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFBO0lBQ2pDLENBQUM7SUFFRCxHQUFHLENBQUMsSUFBWTtRQUNiLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQyxDQUFBO0lBQ2pELENBQUM7Q0FDSDtBQTVFRCw0Q0E0RUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJTWVtYmVyLCBNZW1iZXIsIE1lbWJlclZhbHVlIH0gZnJvbSBcIi4uL01lbWJlclwiO1xuaW1wb3J0IHsgSU1vZGVsLCBNb2RlbENyZWF0ZVBhcmFtcyB9IGZyb20gJy4uL01vZGVsJ1xuaW1wb3J0IHsgSVN0YWNrQ29udGV4dCB9IGZyb20gXCIuLi9zdGFjay9TdGFja0NvbnRleHRcIjtcbmltcG9ydCB7IElVaWRLZWVwZXIgfSBmcm9tIFwiLi4vVWlkS2VlcGVyXCI7XG5pbXBvcnQgeyBWaXNpdEhhbmRsZXIgfSBmcm9tIFwiLi9IYW5kbGVyc1wiO1xuXG5leHBvcnQgaW50ZXJmYWNlIElNZW1iZXJDb2xsZWN0aW9uIHtcbiAgIHJlYWRvbmx5IG1vZGVsOiBJTW9kZWxcblxuICAgW1N5bWJvbC5pdGVyYXRvcl0oKTogSXRlcmF0b3I8SU1lbWJlcj5cblxuICAgYWRkKG5hbWU6IHN0cmluZywgdmFsdWU6IE1lbWJlclZhbHVlKTogUHJvbWlzZTx2b2lkPlxuICAgYXBwZW5kKG9iajogTW9kZWxDcmVhdGVQYXJhbXMpOiBQcm9taXNlPHZvaWQ+XG4gICBkZWxldGUobmFtZTogc3RyaW5nKTogUHJvbWlzZTx2b2lkPlxuICAgZmluZChwcmVkaWNhdGU6IFZpc2l0SGFuZGxlcjxJTWVtYmVyPik6IElNZW1iZXIgfCB1bmRlZmluZWRcblxuICAgLyoqXG4gICAgKiBNYXBzIHRoZSBNZW1iZXJzIGludG8gYW5vdGhlciBzdHJ1Y3R1cmVcbiAgICAqIFxuICAgICogQHBhcmFtIHZpc2l0IEhhbmRsZXIgdXNlZCB0byB0cmFuc2Zvcm0gZWFjaCBGaWVsZFxuICAgICovXG4gICAgbWFwPFQ+KHZpc2l0OiBWaXNpdEhhbmRsZXI8SU1lbWJlcj4pOiB2b2lkW11cblxuICAgZ2V0KG5hbWU6IHN0cmluZyk6IElNZW1iZXIgfCB1bmRlZmluZWRcbn1cblxuZXhwb3J0IGNsYXNzIE1lbWJlckNvbGxlY3Rpb24gaW1wbGVtZW50cyBJTWVtYmVyQ29sbGVjdGlvbiB7XG4gICByZWFkb25seSBtb2RlbDogSU1vZGVsXG4gICByZWFkb25seSBjb250ZXh0IDogSVN0YWNrQ29udGV4dFxuXG4gICBnZXQgdWlkKCk6IElVaWRLZWVwZXIge1xuICAgICAgcmV0dXJuIHRoaXMuY29udGV4dC51aWRcbiAgIH1cblxuICAgcHJpdmF0ZSBtZW1iZXJzOiBBcnJheTxJTWVtYmVyPlxuICAgXG4gICBjb25zdHJ1Y3Rvcihtb2RlbDogSU1vZGVsLCBjb250ZXh0OiBJU3RhY2tDb250ZXh0KSB7XG4gICAgICB0aGlzLm1vZGVsID0gbW9kZWxcbiAgICAgIHRoaXMuY29udGV4dCA9IGNvbnRleHRcbiAgICAgIHRoaXMubWVtYmVycyA9IG5ldyBBcnJheTxJTWVtYmVyPigpXG4gICB9XG5cbiAgIFtTeW1ib2wuaXRlcmF0b3JdKCk6IEl0ZXJhdG9yPElNZW1iZXI+IHtcbiAgICAgIGxldCBpbmRleCA9IDBcbiAgICAgIGxldCBzZWxmID0gdGhpc1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgIG5leHQoKTogSXRlcmF0b3JSZXN1bHQ8SU1lbWJlcj4ge1xuICAgICAgICAgICAgcmV0dXJuIGluZGV4ID09IHNlbGYubWVtYmVycy5sZW5ndGggP1xuICAgICAgICAgICAgICAgeyB2YWx1ZTogdW5kZWZpbmVkLCBkb25lOiB0cnVlIH0gOlxuICAgICAgICAgICAgICAgeyB2YWx1ZTogc2VsZi5tZW1iZXJzW2luZGV4KytdLCBkb25lOiBmYWxzZSB9XG4gICAgICAgICB9XG4gICAgICB9XG4gICB9XG5cbiAgIGFzeW5jIGFkZChuYW1lOiBzdHJpbmcsIHZhbHVlOiBNZW1iZXJWYWx1ZSk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgbGV0IGZvdW5kID0gdGhpcy5tZW1iZXJzLmZpbmQobSA9PiBtLm5hbWUgPT09IG5hbWUpXG5cbiAgICAgIGxldCBtZW1iZXIgPSBNZW1iZXIuY3JlYXRlKHsgW25hbWVdOiB2YWx1ZSB9LCB7IG1vZGVsOiB0aGlzLm1vZGVsIH0sIHRoaXMuY29udGV4dClcblxuICAgICAgaWYoZm91bmQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgZm91bmQudmFsdWUgPSBtZW1iZXJbMF0udmFsdWVcbiAgICAgICAgIHJldHVyblxuICAgICAgfVxuICAgICAgXG4gICAgICB0aGlzLm1lbWJlcnMucHVzaCguLi5tZW1iZXIpXG4gICB9XG5cbiAgIGFzeW5jIGFwcGVuZChvYmo6IE1vZGVsQ3JlYXRlUGFyYW1zKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICBsZXQgbWVtYmVycyA9IE1lbWJlci5jcmVhdGUob2JqLCB7IG1vZGVsOiB0aGlzLm1vZGVsIH0sIHRoaXMuY29udGV4dClcbiAgICAgIFxuICAgICAgZm9yKGxldCBtZW1iZXIgb2YgbWVtYmVycykge1xuICAgICAgICAgbGV0IGZvdW5kID0gdGhpcy5tZW1iZXJzLmZpbmQobSA9PiBtLm5hbWUgPT09IG1lbWJlci5uYW1lKVxuXG4gICAgICAgICAvLyBSZXBsYWNlIGFuIGV4aXN0aW5nIE1lbWJlciBpZiB0aGUgVHlwZXMgbWF0Y2hcbiAgICAgICAgIGlmKGZvdW5kICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGZvdW5kLnZhbHVlID0gbWVtYmVyLnZhbHVlXG4gICAgICAgICAgICBjb250aW51ZVxuICAgICAgICAgfVxuXG4gICAgICAgICB0aGlzLm1lbWJlcnMucHVzaChtZW1iZXIpXG4gICAgICB9XG4gICB9XG5cbiAgIGFzeW5jIGRlbGV0ZShuYW1lOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgIGxldCBmb3VuZCA9IHRoaXMubWVtYmVycy5maW5kSW5kZXgobSA9PiBtLm5hbWUgPT09IG5hbWUpXG5cbiAgICAgIGlmKGZvdW5kKSB7XG4gICAgICAgICB0aGlzLm1lbWJlcnMuc3BsaWNlKGZvdW5kLCAxKVxuICAgICAgfVxuICAgfVxuXG4gICBmaW5kKHByZWRpY2F0ZTogVmlzaXRIYW5kbGVyPElNZW1iZXI+KTogSU1lbWJlciB8IHVuZGVmaW5lZCB7XG4gICAgICByZXR1cm4gdGhpcy5tZW1iZXJzLmZpbmQocHJlZGljYXRlKVxuICAgfVxuXG4gICBtYXA8VD4odmlzaXQ6IFZpc2l0SGFuZGxlcjxJTWVtYmVyPik6IHZvaWRbXSB7XG4gICAgICByZXR1cm4gdGhpcy5tZW1iZXJzLm1hcCh2aXNpdClcbiAgIH1cblxuICAgZ2V0KG5hbWU6IHN0cmluZyk6IElNZW1iZXIgfCB1bmRlZmluZWQge1xuICAgICAgcmV0dXJuIHRoaXMubWVtYmVycy5maW5kKG0gPT4gbS5uYW1lID09PSBuYW1lKVxuICAgfVxufSJdfQ==