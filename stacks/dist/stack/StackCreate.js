"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StackCreate = void 0;
const Model_1 = require("../Model");
class StackCreate {
    constructor(get, context) {
        this.get = get;
        this.context = context;
    }
    get cache() {
        return this.context.cache;
    }
    get uid() {
        return this.context.uid;
    }
    async model(name, obj = {}) {
        let model = await this.get.model(name);
        if (model !== undefined) {
            throw new Error(`A Model with the name ${name} already exists`);
        }
        let id = await this.uid.generate();
        model = new Model_1.Model(name, id, this.context);
        await model.append(obj);
        this.cache.saveModel(model);
        return model;
    }
    async object(modelName, obj) {
        let model = await this.get.model(modelName);
        if (model === undefined) {
            throw new Error(`No Model has been found with the name ${modelName}`);
        }
        return await model.create(obj);
    }
}
exports.StackCreate = StackCreate;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3RhY2tDcmVhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc3RhY2svU3RhY2tDcmVhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEsb0NBQWdGO0FBc0JoRixNQUFhLFdBQVc7SUFTckIsWUFBcUIsR0FBYyxFQUFXLE9BQXNCO1FBQS9DLFFBQUcsR0FBSCxHQUFHLENBQVc7UUFBVyxZQUFPLEdBQVAsT0FBTyxDQUFlO0lBRXBFLENBQUM7SUFWRCxJQUFZLEtBQUs7UUFDZCxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFBO0lBQzVCLENBQUM7SUFFRCxJQUFZLEdBQUc7UUFDWixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFBO0lBQzFCLENBQUM7SUFNRCxLQUFLLENBQUMsS0FBSyxDQUFDLElBQVksRUFBRSxNQUF5QixFQUFFO1FBQ2xELElBQUksS0FBSyxHQUFHLE1BQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUE7UUFFdEMsSUFBRyxLQUFLLEtBQUssU0FBUyxFQUFFO1lBQ3JCLE1BQU0sSUFBSSxLQUFLLENBQUMseUJBQXlCLElBQUksaUJBQWlCLENBQUMsQ0FBQTtTQUNqRTtRQUVELElBQUksRUFBRSxHQUFHLE1BQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQTtRQUVsQyxLQUFLLEdBQUcsSUFBSSxhQUFLLENBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7UUFDekMsTUFBTSxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFBO1FBRXZCLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBRTNCLE9BQU8sS0FBSyxDQUFBO0lBQ2YsQ0FBQztJQUVELEtBQUssQ0FBQyxNQUFNLENBQXdCLFNBQWlCLEVBQUUsR0FBdUI7UUFDM0UsSUFBSSxLQUFLLEdBQUcsTUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQTtRQUUzQyxJQUFHLEtBQUssS0FBSyxTQUFTLEVBQUU7WUFDckIsTUFBTSxJQUFJLEtBQUssQ0FBQyx5Q0FBeUMsU0FBUyxFQUFFLENBQUMsQ0FBQTtTQUN2RTtRQUVELE9BQU8sTUFBTSxLQUFLLENBQUMsTUFBTSxDQUFJLEdBQUcsQ0FBQyxDQUFBO0lBQ3BDLENBQUM7Q0FDSDtBQXZDRCxrQ0F1Q0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTdGFja09iamVjdCB9IGZyb20gXCIuLlwiO1xuaW1wb3J0IHsgSUNhY2hlIH0gZnJvbSBcIi4uL0NhY2hlXCI7XG5pbXBvcnQgeyBJTW9kZWwsIE1vZGVsLCBNb2RlbENyZWF0ZVBhcmFtcywgT2JqZWN0Q3JlYXRlUGFyYW1zIH0gZnJvbSBcIi4uL01vZGVsXCI7XG5pbXBvcnQgeyBJVWlkS2VlcGVyIH0gZnJvbSBcIi4uL1VpZEtlZXBlclwiO1xuaW1wb3J0IHsgSVN0YWNrQ29udGV4dCB9IGZyb20gXCIuL1N0YWNrQ29udGV4dFwiO1xuaW1wb3J0IHsgSVN0YWNrR2V0IH0gZnJvbSBcIi4vU3RhY2tHZXRcIjtcblxuZXhwb3J0IGludGVyZmFjZSBJU3RhY2tDcmVhdGUge1xuICAgLyoqXG4gICAgKiBDcmVhdGVzIGEgTW9kZWxcbiAgICAqIFxuICAgICogQHBhcmFtIG5hbWUgVGhlIG5hbWUgb2YgdGhlIE1vZGVsXG4gICAgKiBAcGFyYW0gb2JqIFRoZSBpbml0aWFsaXplZCB2YWx1ZXNcbiAgICAqL1xuICAgbW9kZWwobmFtZTogc3RyaW5nLCBvYmo/OiBNb2RlbENyZWF0ZVBhcmFtcyk6IFByb21pc2U8SU1vZGVsPlxuXG4gICAvKipcbiAgICAqIENyZWF0ZXMgYW4gT2JqZWN0IGJhc2VkIG9uIGEgTW9kZWxcbiAgICAqIFxuICAgICogQHBhcmFtIG1vZGVsTmFtZSBUaGUgbmFtZSBvZiB0aGUgTW9kZWwgdXNlZCB0byBjcmVhdGUgdGhlIE9iamVjdFxuICAgICovXG4gICBvYmplY3Q8VCBleHRlbmRzIFN0YWNrT2JqZWN0Pihtb2RlbE5hbWU6IHN0cmluZywgb2JqOiBPYmplY3RDcmVhdGVQYXJhbXMpOiBQcm9taXNlPFQ+XG59XG5cbmV4cG9ydCBjbGFzcyBTdGFja0NyZWF0ZSBpbXBsZW1lbnRzIElTdGFja0NyZWF0ZSB7XG4gICBwcml2YXRlIGdldCBjYWNoZSgpOiBJQ2FjaGUge1xuICAgICAgcmV0dXJuIHRoaXMuY29udGV4dC5jYWNoZVxuICAgfVxuXG4gICBwcml2YXRlIGdldCB1aWQoKTogSVVpZEtlZXBlciB7XG4gICAgICByZXR1cm4gdGhpcy5jb250ZXh0LnVpZFxuICAgfVxuXG4gICBjb25zdHJ1Y3RvcihyZWFkb25seSBnZXQ6IElTdGFja0dldCwgcmVhZG9ubHkgY29udGV4dDogSVN0YWNrQ29udGV4dCkge1xuXG4gICB9XG5cbiAgIGFzeW5jIG1vZGVsKG5hbWU6IHN0cmluZywgb2JqOiBNb2RlbENyZWF0ZVBhcmFtcyA9IHt9KTogUHJvbWlzZTxJTW9kZWw+IHtcbiAgICAgIGxldCBtb2RlbCA9IGF3YWl0IHRoaXMuZ2V0Lm1vZGVsKG5hbWUpXG5cbiAgICAgIGlmKG1vZGVsICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgIHRocm93IG5ldyBFcnJvcihgQSBNb2RlbCB3aXRoIHRoZSBuYW1lICR7bmFtZX0gYWxyZWFkeSBleGlzdHNgKVxuICAgICAgfVxuXG4gICAgICBsZXQgaWQgPSBhd2FpdCB0aGlzLnVpZC5nZW5lcmF0ZSgpXG5cbiAgICAgIG1vZGVsID0gbmV3IE1vZGVsKG5hbWUsIGlkLCB0aGlzLmNvbnRleHQpXG4gICAgICBhd2FpdCBtb2RlbC5hcHBlbmQob2JqKVxuXG4gICAgICB0aGlzLmNhY2hlLnNhdmVNb2RlbChtb2RlbClcblxuICAgICAgcmV0dXJuIG1vZGVsXG4gICB9XG5cbiAgIGFzeW5jIG9iamVjdDxUIGV4dGVuZHMgU3RhY2tPYmplY3Q+KG1vZGVsTmFtZTogc3RyaW5nLCBvYmo6IE9iamVjdENyZWF0ZVBhcmFtcyk6IFByb21pc2U8VD4ge1xuICAgICAgbGV0IG1vZGVsID0gYXdhaXQgdGhpcy5nZXQubW9kZWwobW9kZWxOYW1lKVxuXG4gICAgICBpZihtb2RlbCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYE5vIE1vZGVsIGhhcyBiZWVuIGZvdW5kIHdpdGggdGhlIG5hbWUgJHttb2RlbE5hbWV9YClcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGF3YWl0IG1vZGVsLmNyZWF0ZTxUPihvYmopXG4gICB9ICAgXG59Il19