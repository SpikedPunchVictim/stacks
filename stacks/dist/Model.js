"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Model = void 0;
const MemberCollection_1 = require("./collections/MemberCollection");
const Type_1 = require("./values/Type");
class Model {
    constructor(name, id, context) {
        this.name = name;
        this.id = id;
        this.context = context;
        this.members = new MemberCollection_1.MemberCollection(this, this.context);
    }
    get orchestrator() {
        return this.context.orchestrator;
    }
    get serializer() {
        return this.context.serializer;
    }
    async append(obj) {
        return this.members.append(obj);
    }
    async save(obj) {
        await this.orchestrator.saveObject(this, obj);
    }
    async create(params = {}) {
        return await this.orchestrator.createObject(this, params);
    }
    async delete(object) {
        await this.orchestrator.deleteObject(this, object);
    }
    async get(id) {
        return await this.orchestrator.getObject(this, id);
    }
    async getAll() {
        let cursor = '';
        let results = new Array();
        do {
            let paged = await this.orchestrator.getManyObjects(this, { cursor });
            results.push(...paged.items);
            cursor = paged.cursor;
        } while (cursor !== '');
        return results;
    }
    async getMany(req = {}) {
        return this.orchestrator.getManyObjects(this, req);
    }
    async toJs() {
        let result = {
            id: this.id
        };
        for (let member of this.members) {
            result[member.name] = await this.serializer.toJs(member.value);
        }
        //@ts-ignore
        return result;
    }
    async validate(obj) {
        let report = new Type_1.ValidationReport();
        for (let key of Object.keys(obj)) {
            let member = this.members.get(key);
            if (member === undefined) {
                report.addError(new Error(`Object contains a key that does not exist in the Model: ${key}`));
                continue;
            }
            let result = await member.type.validate(obj[key]);
            if (result.success === false && result.error) {
                report.addError(result.error);
            }
        }
        return report;
    }
}
exports.Model = Model;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTW9kZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvTW9kZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEscUVBQXFGO0FBR3JGLHdDQUFpRDtBQWtHakQsTUFBYSxLQUFLO0lBZWYsWUFBWSxJQUFZLEVBQUUsRUFBVSxFQUFFLE9BQXNCO1FBQ3pELElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFBO1FBQ2hCLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFBO1FBQ1osSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUE7UUFFdEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLG1DQUFnQixDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7SUFDMUQsQ0FBQztJQWhCRCxJQUFZLFlBQVk7UUFDckIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQTtJQUNuQyxDQUFDO0lBRUQsSUFBWSxVQUFVO1FBQ25CLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUE7SUFDakMsQ0FBQztJQVlELEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBc0I7UUFDaEMsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQTtJQUNsQyxDQUFDO0lBRUQsS0FBSyxDQUFDLElBQUksQ0FBd0IsR0FBTTtRQUNyQyxNQUFNLElBQUksQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFJLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQTtJQUNuRCxDQUFDO0lBRUQsS0FBSyxDQUFDLE1BQU0sQ0FBd0IsU0FBNkIsRUFBRTtRQUNoRSxPQUFPLE1BQU0sSUFBSSxDQUFDLFlBQVksQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFBO0lBQzVELENBQUM7SUFFRCxLQUFLLENBQUMsTUFBTSxDQUF3QixNQUFTO1FBQzFDLE1BQU0sSUFBSSxDQUFDLFlBQVksQ0FBQyxZQUFZLENBQUksSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFBO0lBQ3hELENBQUM7SUFFRCxLQUFLLENBQUMsR0FBRyxDQUF3QixFQUFVO1FBQ3hDLE9BQU8sTUFBTSxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBSSxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUE7SUFDeEQsQ0FBQztJQUVELEtBQUssQ0FBQyxNQUFNO1FBQ1QsSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFBO1FBQ2YsSUFBSSxPQUFPLEdBQUcsSUFBSSxLQUFLLEVBQUssQ0FBQTtRQUU1QixHQUFHO1lBQ0EsSUFBSSxLQUFLLEdBQUcsTUFBTSxJQUFJLENBQUMsWUFBWSxDQUFDLGNBQWMsQ0FBSSxJQUFJLEVBQUUsRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFBO1lBQ3ZFLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUE7WUFDNUIsTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUE7U0FDdkIsUUFBTyxNQUFNLEtBQUssRUFBRSxFQUFDO1FBRXRCLE9BQU8sT0FBTyxDQUFBO0lBQ2pCLENBQUM7SUFFRCxLQUFLLENBQUMsT0FBTyxDQUF3QixNQUFtQixFQUFFO1FBQ3ZELE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxjQUFjLENBQUksSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFBO0lBQ3hELENBQUM7SUFFRCxLQUFLLENBQUMsSUFBSTtRQUNQLElBQUksTUFBTSxHQUFHO1lBQ1YsRUFBRSxFQUFFLElBQUksQ0FBQyxFQUFFO1NBQ2IsQ0FBQTtRQUVELEtBQUssSUFBSSxNQUFNLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUM5QixNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLE1BQU0sSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFBO1NBQ2hFO1FBRUQsWUFBWTtRQUNaLE9BQU8sTUFBVyxDQUFBO0lBQ3JCLENBQUM7SUFFRCxLQUFLLENBQUMsUUFBUSxDQUFJLEdBQU07UUFDckIsSUFBSSxNQUFNLEdBQUcsSUFBSSx1QkFBZ0IsRUFBRSxDQUFBO1FBRW5DLEtBQUssSUFBSSxHQUFHLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUMvQixJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQTtZQUVsQyxJQUFJLE1BQU0sS0FBSyxTQUFTLEVBQUU7Z0JBQ3ZCLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxLQUFLLENBQUMsMkRBQTJELEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQTtnQkFDNUYsU0FBUTthQUNWO1lBRUQsSUFBSSxNQUFNLEdBQUcsTUFBTSxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQTtZQUVqRCxJQUFJLE1BQU0sQ0FBQyxPQUFPLEtBQUssS0FBSyxJQUFJLE1BQU0sQ0FBQyxLQUFLLEVBQUU7Z0JBQzNDLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFBO2FBQy9CO1NBQ0g7UUFFRCxPQUFPLE1BQU0sQ0FBQTtJQUNoQixDQUFDO0NBQ0g7QUE3RkQsc0JBNkZDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSU1lbWJlckNvbGxlY3Rpb24sIE1lbWJlckNvbGxlY3Rpb24gfSBmcm9tIFwiLi9jb2xsZWN0aW9ucy9NZW1iZXJDb2xsZWN0aW9uXCI7XG5pbXBvcnQgeyBJT3JjaGVzdHJhdG9yIH0gZnJvbSBcIi4vb3JjaGVzdHJhdG9yL09yY2hlc3RyYXRvclwiO1xuaW1wb3J0IHsgSVN0YWNrQ29udGV4dCB9IGZyb20gXCIuL3N0YWNrL1N0YWNrQ29udGV4dFwiO1xuaW1wb3J0IHsgVmFsaWRhdGlvblJlcG9ydCB9IGZyb20gXCIuL3ZhbHVlcy9UeXBlXCI7XG5pbXBvcnQgeyBDcmVhdGVWYWx1ZUhhbmRsZXIsIFZhbHVlQ3JlYXRlUGFyYW1zIH0gZnJvbSBcIi4vdmFsdWVzL1ZhbHVlU291cmNlXCI7XG5pbXBvcnQgeyBTdGFja09iamVjdCB9IGZyb20gXCIuL1N0YWNrT2JqZWN0XCI7XG5pbXBvcnQgeyBJVmFsdWVTZXJpYWxpemVyIH0gZnJvbSBcIi4vc2VyaWFsaXplL1ZhbHVlU2VyaWFsaXplclwiO1xuaW1wb3J0IHsgTWVtYmVySW5mbyB9IGZyb20gXCIuL01lbWJlclwiO1xuXG4vKipcbiAqIFRoZSBwYXJhbWV0ZXJzIHVzZWQgdG8gY3JlYXRlIGFuIE9iamVjdCBiYXNlZCBvbiBhIE1vZGVsLlxuICogVGhlIGFkZGl0aW9uYWwgT2JqZWN0Q3JlYXRlUGFyYW1zIG9uIHRoZSB0eXBlIHN1cHBvcnRzIG5lc3RlZFxuICogdmFsdWVzLlxuICovXG5leHBvcnQgdHlwZSBPYmplY3RDcmVhdGVQYXJhbXMgPSB7XG4gICBba2V5OiBzdHJpbmddOiBWYWx1ZUNyZWF0ZVBhcmFtcyB8IE9iamVjdENyZWF0ZVBhcmFtc1xufVxuXG5leHBvcnQgdHlwZSBNb2RlbENyZWF0ZVBhcmFtcyA9IHtcbiAgIFtrZXk6IHN0cmluZ106IHN0cmluZyB8IG51bWJlciB8IGJvb2xlYW4gfCBhbnlbXSB8IENyZWF0ZVZhbHVlSGFuZGxlciB8IE1lbWJlckluZm9cbn1cblxuZXhwb3J0IHR5cGUgU3ltYm9sRW50cnkgPSB7XG4gICBuYW1lOiBzdHJpbmcsXG4gICB2YWx1ZTogYW55XG59XG5cbmV4cG9ydCB0eXBlIFBhZ2VSZXNwb25zZTxUPiA9IHtcbiAgIGN1cnNvcjogc3RyaW5nXG4gICBpdGVtczogVFtdXG59XG5cbmV4cG9ydCB0eXBlIFBhZ2VSZXF1ZXN0ID0ge1xuICAgY3Vyc29yPzogc3RyaW5nXG4gICBsaW1pdD86IG51bWJlclxufVxuXG5leHBvcnQgaW50ZXJmYWNlIElNb2RlbCB7XG4gICByZWFkb25seSBpZDogc3RyaW5nXG4gICByZWFkb25seSBuYW1lOiBzdHJpbmdcblxuICAgcmVhZG9ubHkgbWVtYmVyczogSU1lbWJlckNvbGxlY3Rpb25cblxuICAgLyoqXG4gICAgKiBBcHBlbmRzIGFkZGl0aW9uYWwgTWVtYmVycyB0byB0aGUgTW9kZWxcbiAgICAqIFxuICAgICogQHBhcmFtIG9iaiBUaGUgYWRkaXRpb25hbCBtZW1iZXJzIHRvIGFkZFxuICAgICovXG4gICBhcHBlbmQob2JqOiBNb2RlbENyZWF0ZVBhcmFtcyk6IFByb21pc2U8dm9pZD5cblxuICAgLyoqXG4gICAgKiBTc3ZlcyB0aGUgb2JqZWN0IHRvIHN0b3JhZ2VcbiAgICAqIFxuICAgICogQHBhcmFtIG9iamVjdCBUaGUgb2JqZWN0IHRvIGNvbW1pdFxuICAgICovXG4gICBzYXZlPFQgZXh0ZW5kcyBTdGFja09iamVjdD4ob2JqZWN0OiBUKTogUHJvbWlzZTx2b2lkPlxuXG4gICAvKipcbiAgICAqIENyZWF0ZXMgYSBuZXcgT2JqZWN0IGJhc2VkIG9uIHRoaXMgTW9kZWxcbiAgICAqL1xuICAgY3JlYXRlPFQgZXh0ZW5kcyBTdGFja09iamVjdD4ob2JqPzogT2JqZWN0Q3JlYXRlUGFyYW1zKTogUHJvbWlzZTxUPlxuXG4gICAvKipcbiAgICAqIERlbGV0ZXMgYW4gb2JqZWN0IGRlcml2ZWQgZnJvbSB0aGlzIE1vZGVsXG4gICAgKiBcbiAgICAqIEBwYXJhbSBvYmplY3QgVGhlIG9iamVjdCB0byBkZWxldGVcbiAgICAqL1xuICAgZGVsZXRlPFQgZXh0ZW5kcyBTdGFja09iamVjdD4ob2JqZWN0OiBUKTogUHJvbWlzZTx2b2lkPlxuXG4gICAvKipcbiAgICAqIFJldHJpZXZlcyBhbiBpbnN0YW5jZSBieSBJRFxuICAgICogXG4gICAgKiBAcGFyYW0gaWQgVGhlIElEIG9mIHRoZSBpbnN0YW5jZVxuICAgICovXG4gICBnZXQ8VCBleHRlbmRzIFN0YWNrT2JqZWN0PihpZDogc3RyaW5nKTogUHJvbWlzZTxUIHwgdW5kZWZpbmVkPlxuXG4gICAvKipcbiAgICAqIEdldHMgYWxsIE9iamVjdHMgYmFzZWQgb24gYSBNb2RlbFxuICAgICovXG4gICBnZXRBbGw8VCBleHRlbmRzIFN0YWNrT2JqZWN0PigpOiBQcm9taXNlPFRbXT5cblxuICAgLyoqXG4gICAgKiBHZXRzIG1hbnkgT2JqZWN0c1xuICAgICogXG4gICAgKiBAcGFyYW0gcmVxIFRoZSBQYWdlZFJlcXVlc3QgXG4gICAgKi9cbiAgIGdldE1hbnk8VCBleHRlbmRzIFN0YWNrT2JqZWN0PihyZXE/OiBQYWdlUmVxdWVzdCk6IFByb21pc2U8UGFnZVJlc3BvbnNlPFQ+PlxuXG4gICAvKipcbiAgICAqIENvbnZlcnRzIHRoZSBNb2RlbCBpbnRvIGEgSlMgb2JqZWN0XG4gICAgKi9cbiAgIHRvSnM8VD4oKTogUHJvbWlzZTxUPlxuXG4gICAvKipcbiAgICAqIFZhbGlkYXRlcyBhbiBPYmplY3QgYWdhaW5zdCB0aGUgTW9kZWwncyBzY2hlbWFcbiAgICAqIFxuICAgICogQHBhcmFtIG9iaiBUaGUgT2JqZWN0IHRvIHZhbGlkYXRlXG4gICAgKi9cbiAgIHZhbGlkYXRlPFQ+KG9iajogVCk6IFByb21pc2U8VmFsaWRhdGlvblJlcG9ydD5cbn1cblxuZXhwb3J0IGNsYXNzIE1vZGVsIGltcGxlbWVudHMgSU1vZGVsIHtcbiAgIHJlYWRvbmx5IGlkOiBzdHJpbmdcbiAgIHJlYWRvbmx5IG5hbWU6IHN0cmluZ1xuICAgcmVhZG9ubHkgY29udGV4dDogSVN0YWNrQ29udGV4dFxuXG4gICBwcml2YXRlIGdldCBvcmNoZXN0cmF0b3IoKTogSU9yY2hlc3RyYXRvciB7XG4gICAgICByZXR1cm4gdGhpcy5jb250ZXh0Lm9yY2hlc3RyYXRvclxuICAgfVxuXG4gICBwcml2YXRlIGdldCBzZXJpYWxpemVyKCk6IElWYWx1ZVNlcmlhbGl6ZXIge1xuICAgICAgcmV0dXJuIHRoaXMuY29udGV4dC5zZXJpYWxpemVyXG4gICB9ICAgXG5cbiAgIHJlYWRvbmx5IG1lbWJlcnM6IElNZW1iZXJDb2xsZWN0aW9uXG5cbiAgIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZywgaWQ6IHN0cmluZywgY29udGV4dDogSVN0YWNrQ29udGV4dCkge1xuICAgICAgdGhpcy5uYW1lID0gbmFtZVxuICAgICAgdGhpcy5pZCA9IGlkXG4gICAgICB0aGlzLmNvbnRleHQgPSBjb250ZXh0XG5cbiAgICAgIHRoaXMubWVtYmVycyA9IG5ldyBNZW1iZXJDb2xsZWN0aW9uKHRoaXMsIHRoaXMuY29udGV4dClcbiAgIH1cblxuICAgYXN5bmMgYXBwZW5kKG9iajogTW9kZWxDcmVhdGVQYXJhbXMpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgIHJldHVybiB0aGlzLm1lbWJlcnMuYXBwZW5kKG9iailcbiAgIH1cblxuICAgYXN5bmMgc2F2ZTxUIGV4dGVuZHMgU3RhY2tPYmplY3Q+KG9iajogVCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgYXdhaXQgdGhpcy5vcmNoZXN0cmF0b3Iuc2F2ZU9iamVjdDxUPih0aGlzLCBvYmopXG4gICB9XG5cbiAgIGFzeW5jIGNyZWF0ZTxUIGV4dGVuZHMgU3RhY2tPYmplY3Q+KHBhcmFtczogT2JqZWN0Q3JlYXRlUGFyYW1zID0ge30pOiBQcm9taXNlPFQ+IHtcbiAgICAgIHJldHVybiBhd2FpdCB0aGlzLm9yY2hlc3RyYXRvci5jcmVhdGVPYmplY3QodGhpcywgcGFyYW1zKVxuICAgfVxuXG4gICBhc3luYyBkZWxldGU8VCBleHRlbmRzIFN0YWNrT2JqZWN0PihvYmplY3Q6IFQpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgIGF3YWl0IHRoaXMub3JjaGVzdHJhdG9yLmRlbGV0ZU9iamVjdDxUPih0aGlzLCBvYmplY3QpXG4gICB9XG5cbiAgIGFzeW5jIGdldDxUIGV4dGVuZHMgU3RhY2tPYmplY3Q+KGlkOiBzdHJpbmcpOiBQcm9taXNlPFQgfCB1bmRlZmluZWQ+IHtcbiAgICAgIHJldHVybiBhd2FpdCB0aGlzLm9yY2hlc3RyYXRvci5nZXRPYmplY3Q8VD4odGhpcywgaWQpXG4gICB9XG5cbiAgIGFzeW5jIGdldEFsbDxUIGV4dGVuZHMgU3RhY2tPYmplY3Q+KCk6IFByb21pc2U8VFtdPiB7XG4gICAgICBsZXQgY3Vyc29yID0gJydcbiAgICAgIGxldCByZXN1bHRzID0gbmV3IEFycmF5PFQ+KClcbiAgICAgIFxuICAgICAgZG8ge1xuICAgICAgICAgbGV0IHBhZ2VkID0gYXdhaXQgdGhpcy5vcmNoZXN0cmF0b3IuZ2V0TWFueU9iamVjdHM8VD4odGhpcywgeyBjdXJzb3IgfSlcbiAgICAgICAgIHJlc3VsdHMucHVzaCguLi5wYWdlZC5pdGVtcylcbiAgICAgICAgIGN1cnNvciA9IHBhZ2VkLmN1cnNvclxuICAgICAgfSB3aGlsZShjdXJzb3IgIT09ICcnKVxuXG4gICAgICByZXR1cm4gcmVzdWx0c1xuICAgfVxuXG4gICBhc3luYyBnZXRNYW55PFQgZXh0ZW5kcyBTdGFja09iamVjdD4ocmVxOiBQYWdlUmVxdWVzdCA9IHt9KTogUHJvbWlzZTxQYWdlUmVzcG9uc2U8VD4+IHtcbiAgICAgIHJldHVybiB0aGlzLm9yY2hlc3RyYXRvci5nZXRNYW55T2JqZWN0czxUPih0aGlzLCByZXEpXG4gICB9XG5cbiAgIGFzeW5jIHRvSnM8VD4oKTogUHJvbWlzZTxUPiB7XG4gICAgICBsZXQgcmVzdWx0ID0ge1xuICAgICAgICAgaWQ6IHRoaXMuaWRcbiAgICAgIH1cblxuICAgICAgZm9yIChsZXQgbWVtYmVyIG9mIHRoaXMubWVtYmVycykge1xuICAgICAgICAgcmVzdWx0W21lbWJlci5uYW1lXSA9IGF3YWl0IHRoaXMuc2VyaWFsaXplci50b0pzKG1lbWJlci52YWx1ZSlcbiAgICAgIH1cblxuICAgICAgLy9AdHMtaWdub3JlXG4gICAgICByZXR1cm4gcmVzdWx0IGFzIFRcbiAgIH1cblxuICAgYXN5bmMgdmFsaWRhdGU8VD4ob2JqOiBUKTogUHJvbWlzZTxWYWxpZGF0aW9uUmVwb3J0PiB7XG4gICAgICBsZXQgcmVwb3J0ID0gbmV3IFZhbGlkYXRpb25SZXBvcnQoKVxuXG4gICAgICBmb3IgKGxldCBrZXkgb2YgT2JqZWN0LmtleXMob2JqKSkge1xuICAgICAgICAgbGV0IG1lbWJlciA9IHRoaXMubWVtYmVycy5nZXQoa2V5KVxuXG4gICAgICAgICBpZiAobWVtYmVyID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJlcG9ydC5hZGRFcnJvcihuZXcgRXJyb3IoYE9iamVjdCBjb250YWlucyBhIGtleSB0aGF0IGRvZXMgbm90IGV4aXN0IGluIHRoZSBNb2RlbDogJHtrZXl9YCkpXG4gICAgICAgICAgICBjb250aW51ZVxuICAgICAgICAgfVxuXG4gICAgICAgICBsZXQgcmVzdWx0ID0gYXdhaXQgbWVtYmVyLnR5cGUudmFsaWRhdGUob2JqW2tleV0pXG5cbiAgICAgICAgIGlmIChyZXN1bHQuc3VjY2VzcyA9PT0gZmFsc2UgJiYgcmVzdWx0LmVycm9yKSB7XG4gICAgICAgICAgICByZXBvcnQuYWRkRXJyb3IocmVzdWx0LmVycm9yKVxuICAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVwb3J0XG4gICB9XG59Il19