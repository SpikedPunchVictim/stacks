"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FieldCollection = void 0;
class FieldCollection {
    constructor(fields) {
        this.fields = fields;
    }
    [Symbol.iterator]() {
        let index = 0;
        let self = this;
        return {
            next() {
                return index == self.fields.length ?
                    { value: undefined, done: true } :
                    { value: self.fields[index++], done: false };
            }
        };
    }
    get(name) {
        return this.fields.find(f => f.name === name);
    }
    map(visit) {
        return this.fields.map(visit);
    }
    async set(name, value) {
        let field = this.fields.find(f => f.name === name);
        if (field === undefined) {
            throw new Error(`No Field with the name ${name} exists`);
        }
        field.value;
    }
    async switch(handler) {
        for (let field of this.fields) {
            let fn = handler[field.value.type.type];
            if (fn) {
                await fn(field);
            }
        }
    }
}
exports.FieldCollection = FieldCollection;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRmllbGRDb2xsZWN0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbGxlY3Rpb25zL0ZpZWxkQ29sbGVjdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUE2Q0EsTUFBYSxlQUFlO0lBQ3pCLFlBQTZCLE1BQWdCO1FBQWhCLFdBQU0sR0FBTixNQUFNLENBQVU7SUFFN0MsQ0FBQztJQUVELENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQztRQUNkLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQTtRQUNiLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQTtRQUNmLE9BQU87WUFDSixJQUFJO2dCQUNELE9BQU8sS0FBSyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7b0JBQ2pDLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztvQkFDbEMsRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsQ0FBQTtZQUNsRCxDQUFDO1NBQ0gsQ0FBQTtJQUNKLENBQUM7SUFFRCxHQUFHLENBQUMsSUFBWTtRQUNiLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQyxDQUFBO0lBQ2hELENBQUM7SUFFRCxHQUFHLENBQVUsS0FBb0M7UUFDOUMsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQTtJQUNoQyxDQUFDO0lBRUQsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFZLEVBQUUsS0FBd0I7UUFDN0MsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQyxDQUFBO1FBRWxELElBQUcsS0FBSyxLQUFLLFNBQVMsRUFBRSxDQUFDO1lBQ3RCLE1BQU0sSUFBSSxLQUFLLENBQUMsMEJBQTBCLElBQUksU0FBUyxDQUFDLENBQUE7UUFDM0QsQ0FBQztRQUVELEtBQUssQ0FBQyxLQUFLLENBQUE7SUFDZCxDQUFDO0lBRUQsS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUEyQjtRQUNyQyxLQUFJLElBQUksS0FBSyxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUM1QixJQUFJLEVBQUUsR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7WUFDdkMsSUFBRyxFQUFFLEVBQUUsQ0FBQztnQkFDTCxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQTtZQUNsQixDQUFDO1FBQ0osQ0FBQztJQUNKLENBQUM7Q0FDSDtBQTNDRCwwQ0EyQ0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBWaXNpdEhhbmRsZXIgfSBmcm9tIFwiLlwiO1xuaW1wb3J0IHsgSUZpZWxkIH0gZnJvbSBcIi4uL0ZpZWxkXCI7XG5pbXBvcnQgeyBWYWx1ZUNyZWF0ZVBhcmFtcyB9IGZyb20gXCIuLi92YWx1ZXMvVmFsdWVTb3VyY2VcIjtcblxuLyoqXG4gKiBFYWNoIFByb3BlcnR5IGlzIG9uZSBvZiB0aGUgVHllcFNldCBlbnVtc1xuICovXG5leHBvcnQgdHlwZSBGaWVsZFN3aXRjaEhhbmRsZXIgPSB7XG4gICBba2V5OiBzdHJpbmddOiAoZmllbGQ6IElGaWVsZCkgPT4gUHJvbWlzZTx2b2lkPlxufVxuXG5cbmV4cG9ydCBpbnRlcmZhY2UgSUZpZWxkQ29sbGVjdGlvbiB7XG4gICBbU3ltYm9sLml0ZXJhdG9yXSgpOiBJdGVyYXRvcjxJRmllbGQ+XG5cbiAgIC8qKlxuICAgICogVXRpbGl0eSBtZXRob2QgdG8gcHJvY2VzcyBlYWNoIEZpZWxkIGJhc2VkIG9uIHRoZWlyIFR5cGVcbiAgICAqIFxuICAgICogQHBhcmFtIGhhbmRsZXIgVGhlIEhhbmRsZXIgZm9yIHRoZSBWYWx1ZVNldCB0eXBlc1xuICAgICovXG4gICBzd2l0Y2goaGFuZGxlcjogRmllbGRTd2l0Y2hIYW5kbGVyKTogUHJvbWlzZTx2b2lkPlxuXG4gICAvKipcbiAgICAqIEdldHMgYSBGaWVsZFxuICAgICogXG4gICAgKiBAcGFyYW0gbmFtZSBUaGUgbmFtZSBvZiB0aGUgRmllbGRcbiAgICAqL1xuICAgZ2V0KG5hbWU6IHN0cmluZyk6IElGaWVsZCB8IHVuZGVmaW5lZFxuXG4gICAvKipcbiAgICAqIE1hcHMgdGhlIEZpZWxkcyBpbnRvIGFub3RoZXIgc3RydWN0dXJlXG4gICAgKiBcbiAgICAqIEBwYXJhbSB2aXNpdCBIYW5kbGVyIHVzZWQgdG8gdHJhbnNmb3JtIGVhY2ggRmllbGRcbiAgICAqL1xuICAgbWFwPFRSZXN1bHQ+KHZpc2l0OiBWaXNpdEhhbmRsZXI8SUZpZWxkLCBUUmVzdWx0Pik6IFRSZXN1bHRbXVxuXG4gICAvKipcbiAgICAqIFNldHMgYSBGaWVsZCdzIHZhbHVlXG4gICAgKiBcbiAgICAqIEBwYXJhbSBuYW1lIFRoZSBuYW1lIG9mIHRoZSBGaWVsZFxuICAgICogQHBhcmFtIHZhbHVlIFRoZSB2YWx1ZSB0byBzZXRcbiAgICAqL1xuICAgc2V0KG5hbWU6IHN0cmluZywgdmFsdWU6IFZhbHVlQ3JlYXRlUGFyYW1zKTogUHJvbWlzZTx2b2lkPlxufVxuXG5leHBvcnQgY2xhc3MgRmllbGRDb2xsZWN0aW9uIGltcGxlbWVudHMgSUZpZWxkQ29sbGVjdGlvbiB7XG4gICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IGZpZWxkczogSUZpZWxkW10pIHtcblxuICAgfVxuXG4gICBbU3ltYm9sLml0ZXJhdG9yXSgpOiBJdGVyYXRvcjxJRmllbGQ+IHtcbiAgICAgIGxldCBpbmRleCA9IDBcbiAgICAgIGxldCBzZWxmID0gdGhpc1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgIG5leHQoKTogSXRlcmF0b3JSZXN1bHQ8SUZpZWxkPiB7XG4gICAgICAgICAgICByZXR1cm4gaW5kZXggPT0gc2VsZi5maWVsZHMubGVuZ3RoID9cbiAgICAgICAgICAgICAgIHsgdmFsdWU6IHVuZGVmaW5lZCwgZG9uZTogdHJ1ZSB9IDpcbiAgICAgICAgICAgICAgIHsgdmFsdWU6IHNlbGYuZmllbGRzW2luZGV4KytdLCBkb25lOiBmYWxzZSB9XG4gICAgICAgICB9XG4gICAgICB9XG4gICB9XG5cbiAgIGdldChuYW1lOiBzdHJpbmcpOiBJRmllbGQgfCB1bmRlZmluZWQge1xuICAgICAgcmV0dXJuIHRoaXMuZmllbGRzLmZpbmQoZiA9PiBmLm5hbWUgPT09IG5hbWUpXG4gICB9XG5cbiAgIG1hcDxUUmVzdWx0Pih2aXNpdDogVmlzaXRIYW5kbGVyPElGaWVsZCwgVFJlc3VsdD4pOiBUUmVzdWx0W10ge1xuICAgICAgcmV0dXJuIHRoaXMuZmllbGRzLm1hcCh2aXNpdClcbiAgIH1cblxuICAgYXN5bmMgc2V0KG5hbWU6IHN0cmluZywgdmFsdWU6IFZhbHVlQ3JlYXRlUGFyYW1zKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICBsZXQgZmllbGQgPSB0aGlzLmZpZWxkcy5maW5kKGYgPT4gZi5uYW1lID09PSBuYW1lKVxuXG4gICAgICBpZihmaWVsZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYE5vIEZpZWxkIHdpdGggdGhlIG5hbWUgJHtuYW1lfSBleGlzdHNgKVxuICAgICAgfVxuXG4gICAgICBmaWVsZC52YWx1ZVxuICAgfVxuXG4gICBhc3luYyBzd2l0Y2goaGFuZGxlcjogRmllbGRTd2l0Y2hIYW5kbGVyKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICBmb3IobGV0IGZpZWxkIG9mIHRoaXMuZmllbGRzKSB7XG4gICAgICAgICBsZXQgZm4gPSBoYW5kbGVyW2ZpZWxkLnZhbHVlLnR5cGUudHlwZV1cbiAgICAgICAgIGlmKGZuKSB7XG4gICAgICAgICAgICBhd2FpdCBmbihmaWVsZClcbiAgICAgICAgIH1cbiAgICAgIH1cbiAgIH1cbn0iXX0=