"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListSerializer = exports.ListValue = exports.ListType = void 0;
const ValueSerializer_1 = require("../serialize/ValueSerializer");
const Type_1 = require("./Type");
const Value_1 = require("./Value");
class ListType extends Type_1.Type {
    constructor(itemType) {
        super(Type_1.TypeSet.List);
        this.itemType = itemType;
    }
    get info() {
        return {
            type: this.type,
            itemType: this.itemType.info
        };
    }
    equals(other) {
        if (other.type !== Type_1.TypeSet.List) {
            return false;
        }
        let cast = other;
        if (!this.itemType.equals(cast.itemType)) {
            return false;
        }
        return true;
    }
    async validate(obj) {
        if (!Array.isArray(obj)) {
            return { success: false, error: new Error(`Type does not match. Expected 'Array' but receieved '${typeof obj}' instead.`) };
        }
        let array = obj;
        for (let i = 0; i < array.length; ++i) {
            let valid = await this.itemType.validate(array[i]);
            if (valid.success == false) {
                return { success: false, error: new Error(`Encountered an error when validating the items in a List. Reason: ${valid.error}`) };
            }
        }
        return { success: true };
    }
}
exports.ListType = ListType;
class ListValue extends Value_1.Value {
    constructor(itemType, serializer) {
        super(new ListType(itemType));
        this.itemType = itemType;
        this.serializer = serializer;
        this.items = new Array();
    }
    [Symbol.iterator]() {
        let index = 0;
        let self = this;
        return {
            next() {
                return index == self.items.length ?
                    { value: undefined, done: true } :
                    { value: self.items[index++], done: false };
            }
        };
    }
    at(index) {
        return this.items.at(index);
    }
    clear() {
        this.items.splice(0, this.items.length);
    }
    clone() {
        let list = new ListValue(this.itemType, this.serializer);
        list.push(...this.items);
        return list;
    }
    equals(other) {
        if (!this.type.equals(other.type)) {
            return false;
        }
        let list = other;
        if (list.items.length != this.items.length) {
            return false;
        }
        for (let i = 0; i < this.items.length; ++i) {
            let thisItem = this.items[i];
            let otherItem = list.items[i];
            if (!thisItem.equals(otherItem)) {
                return false;
            }
        }
        return true;
    }
    push(...items) {
        return this.items.push(...items);
    }
    set(value) {
        if (!this.type.equals(value.type)) {
            throw new Error(`Cannot set a List Value with a different type. Encountered ${value.type.type} when setting the value of a List.`);
        }
        let list = value;
        this.items.splice(0, this.items.length);
        this.items.push(...list.items);
        return this;
    }
    async toJs() {
        let results = new Array();
        for (let i = 0; i < this.items.length; ++i) {
            results.push(await this.serializer.toJs(this.items[i]));
        }
        return results;
    }
}
exports.ListValue = ListValue;
class ListSerializer extends ValueSerializer_1.ValueSerializer {
    constructor(serializer) {
        super(Type_1.TypeSet.List);
        this.serializer = serializer;
    }
    async toJs(value) {
        this.validate(value.type);
        let results = new Array();
        let list = value;
        for (let value of list) {
            results.push(await this.serializer.toJs(value));
        }
        return results;
    }
    async fromJs(type, obj) {
        this.validate(type);
        if (!Array.isArray(obj)) {
            throw new Error(`The JS object type does not match what's expected when serializing. Expected a List and received a ${typeof obj}`);
        }
        let listType = type;
        let list = new ListValue(listType.itemType, this.serializer);
        for (let val of obj) {
            list.push(await this.serializer.fromJs(listType.itemType, val));
        }
        return list;
    }
}
exports.ListSerializer = ListSerializer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGlzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy92YWx1ZXMvTGlzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxrRUFBZ0Y7QUFDaEYsaUNBQXVFO0FBQ3ZFLG1DQUF1QztBQUd2QyxNQUFhLFFBQVMsU0FBUSxXQUFJO0lBUS9CLFlBQXFCLFFBQWU7UUFDakMsS0FBSyxDQUFDLGNBQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQURELGFBQVEsR0FBUixRQUFRLENBQU87SUFFcEMsQ0FBQztJQVRELElBQUksSUFBSTtRQUNMLE9BQU87WUFDSixJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7WUFDZixRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJO1NBQzlCLENBQUE7SUFDSixDQUFDO0lBTUQsTUFBTSxDQUFDLEtBQVk7UUFDaEIsSUFBRyxLQUFLLENBQUMsSUFBSSxLQUFLLGNBQU8sQ0FBQyxJQUFJLEVBQUU7WUFDN0IsT0FBTyxLQUFLLENBQUE7U0FDZDtRQUVELElBQUksSUFBSSxHQUFHLEtBQWlCLENBQUE7UUFFNUIsSUFBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRTtZQUN0QyxPQUFPLEtBQUssQ0FBQTtTQUNkO1FBRUQsT0FBTyxJQUFJLENBQUE7SUFDZCxDQUFDO0lBRUQsS0FBSyxDQUFDLFFBQVEsQ0FBSSxHQUFNO1FBQ3JCLElBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ3JCLE9BQU8sRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxJQUFJLEtBQUssQ0FBQyx3REFBd0QsT0FBTyxHQUFHLFlBQVksQ0FBQyxFQUFDLENBQUE7U0FDNUg7UUFFRCxJQUFJLEtBQUssR0FBRyxHQUFlLENBQUE7UUFFM0IsS0FBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFH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IH0gZnJvbSBcIi4uL3NlcmlhbGl6ZS9WYWx1ZVNlcmlhbGl6ZXJcIlxuaW1wb3J0IHsgSVR5cGUsIFR5cGUsIFR5cGVJbmZvLCBUeXBlU2V0LCBWYWxpZGF0ZVJlc3VsdCB9IGZyb20gXCIuL1R5cGVcIlxuaW1wb3J0IHsgSVZhbHVlLCBWYWx1ZSB9IGZyb20gXCIuL1ZhbHVlXCJcblxuXG5leHBvcnQgY2xhc3MgTGlzdFR5cGUgZXh0ZW5kcyBUeXBlIHtcbiAgIGdldCBpbmZvKCk6IFR5cGVJbmZvIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgICB0eXBlOiB0aGlzLnR5cGUsXG4gICAgICAgICBpdGVtVHlwZTogdGhpcy5pdGVtVHlwZS5pbmZvXG4gICAgICB9XG4gICB9XG5cbiAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IGl0ZW1UeXBlOiBJVHlwZSkge1xuICAgICAgc3VwZXIoVHlwZVNldC5MaXN0KVxuICAgfVxuXG4gICBlcXVhbHMob3RoZXI6IElUeXBlKTogYm9vbGVhbiB7XG4gICAgICBpZihvdGhlci50eXBlICE9PSBUeXBlU2V0Lkxpc3QpIHtcbiAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuXG4gICAgICBsZXQgY2FzdCA9IG90aGVyIGFzIExpc3RUeXBlXG5cbiAgICAgIGlmKCF0aGlzLml0ZW1UeXBlLmVxdWFscyhjYXN0Lml0ZW1UeXBlKSkge1xuICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0cnVlXG4gICB9XG5cbiAgIGFzeW5jIHZhbGlkYXRlPFQ+KG9iajogVCk6IFByb21pc2U8VmFsaWRhdGVSZXN1bHQ+IHtcbiAgICAgIGlmKCFBcnJheS5pc0FycmF5KG9iaikpIHtcbiAgICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogbmV3IEVycm9yKGBUeXBlIGRvZXMgbm90IG1hdGNoLiBFeHBlY3RlZCAnQXJyYXknIGJ1dCByZWNlaWV2ZWQgJyR7dHlwZW9mIG9ian0nIGluc3RlYWQuYCl9XG4gICAgICB9XG5cbiAgICAgIGxldCBhcnJheSA9IG9iaiBhcyBBcnJheTxUPlxuXG4gICAgICBmb3IobGV0IGkgPSAwOyBpIDwgYXJyYXkubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgIGxldCB2YWxpZCA9IGF3YWl0IHRoaXMuaXRlbVR5cGUudmFsaWRhdGUoYXJyYXlbaV0pXG5cbiAgICAgICAgIGlmKHZhbGlkLnN1Y2Nlc3MgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogbmV3IEVycm9yKGBFbmNvdW50ZXJlZCBhbiBlcnJvciB3aGVuIHZhbGlkYXRpbmcgdGhlIGl0ZW1zIGluIGEgTGlzdC4gUmVhc29uOiAke3ZhbGlkLmVycm9yfWApfVxuICAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4geyBzdWNjZXNzOiB0cnVlIH1cbiAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIExpc3RWYWx1ZSBleHRlbmRzIFZhbHVlIHtcbiAgIHByaXZhdGUgaXRlbXM6IEFycmF5PElWYWx1ZT4gPSBuZXcgQXJyYXk8SVZhbHVlPigpXG4gICBcbiAgIGNvbnN0cnVjdG9yKHJlYWRvbmx5IGl0ZW1UeXBlOiBJVHlwZSwgcmVhZG9ubHkgc2VyaWFsaXplcjogSVZhbHVlU2VyaWFsaXplcikge1xuICAgICAgc3VwZXIobmV3IExpc3RUeXBlKGl0ZW1UeXBlKSlcbiAgIH1cblxuICAgW1N5bWJvbC5pdGVyYXRvcl0oKTogSXRlcmF0b3I8SVZhbHVlPiB7XG4gICAgICBsZXQgaW5kZXggPSAwXG4gICAgICBsZXQgc2VsZiA9IHRoaXNcbiAgICAgIHJldHVybiB7XG4gICAgICAgICBuZXh0KCk6IEl0ZXJhdG9yUmVzdWx0PElWYWx1ZT4ge1xuICAgICAgICAgICAgcmV0dXJuIGluZGV4ID09IHNlbGYuaXRlbXMubGVuZ3RoID9cbiAgICAgICAgICAgICAgIHsgdmFsdWU6IHVuZGVmaW5lZCwgZG9uZTogdHJ1ZSB9IDpcbiAgICAgICAgICAgICAgIHsgdmFsdWU6IHNlbGYuaXRlbXNbaW5kZXgrK10sIGRvbmU6IGZhbHNlIH1cbiAgICAgICAgIH1cbiAgICAgIH1cbiAgIH1cblxuICAgYXQoaW5kZXg6IG51bWJlcik6IElWYWx1ZSB8IHVuZGVmaW5lZCB7XG4gICAgICByZXR1cm4gdGhpcy5pdGVtcy5hdChpbmRleClcbiAgIH1cblxuICAgY2xlYXIoKTogdm9pZCB7XG4gICAgICB0aGlzLml0ZW1zLnNwbGljZSgwLCB0aGlzLml0ZW1zLmxlbmd0aClcbiAgIH1cblxuICAgY2xvbmUoKTogSVZhbHVlIHtcbiAgICAgIGxldCBsaXN0ID0gbmV3IExpc3RWYWx1ZSh0aGlzLml0ZW1UeXBlLCB0aGlzLnNlcmlhbGl6ZXIpXG4gICAgICBsaXN0LnB1c2goLi4udGhpcy5pdGVtcylcbiAgICAgIHJldHVybiBsaXN0XG4gICB9XG5cbiAgIGVxdWFscyhvdGhlcjogSVZhbHVlKTogYm9vbGVhbiB7XG4gICAgICBpZighdGhpcy50eXBlLmVxdWFscyhvdGhlci50eXBlKSkge1xuICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG5cbiAgICAgIGxldCBsaXN0ID0gb3RoZXIgYXMgTGlzdFZhbHVlXG5cbiAgICAgIGlmKGxpc3QuaXRlbXMubGVuZ3RoICE9IHRoaXMuaXRlbXMubGVuZ3RoKSB7XG4gICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cblxuICAgICAgZm9yKGxldCBpID0gMDsgaSA8IHRoaXMuaXRlbXMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgIGxldCB0aGlzSXRlbSA9IHRoaXMuaXRlbXNbaV1cbiAgICAgICAgIGxldCBvdGhlckl0ZW0gPSBsaXN0Lml0ZW1zW2ldXG5cbiAgICAgICAgIGlmKCF0aGlzSXRlbS5lcXVhbHMob3RoZXJJdGVtKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0cnVlICAgICAgXG4gICB9XG5cbiAgIHB1c2goLi4uaXRlbXM6IElWYWx1ZVtdKTogbnVtYmVyIHtcbiAgICAgIHJldHVybiB0aGlzLml0ZW1zLnB1c2goLi4uaXRlbXMpXG4gICB9XG5cbiAgIHNldCh2YWx1ZTogSVZhbHVlKTogSVZhbHVlIHtcbiAgICAgIGlmKCF0aGlzLnR5cGUuZXF1YWxzKHZhbHVlLnR5cGUpKSB7XG4gICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCBzZXQgYSBMaXN0IFZhbHVlIHdpdGggYSBkaWZmZXJlbnQgdHlwZS4gRW5jb3VudGVyZWQgJHt2YWx1ZS50eXBlLnR5cGV9IHdoZW4gc2V0dGluZyB0aGUgdmFsdWUgb2YgYSBMaXN0LmApXG4gICAgICB9XG5cbiAgICAgIGxldCBsaXN0ID0gdmFsdWUgYXMgTGlzdFZhbHVlXG5cbiAgICAgIHRoaXMuaXRlbXMuc3BsaWNlKDAsIHRoaXMuaXRlbXMubGVuZ3RoKVxuICAgICAgdGhpcy5pdGVtcy5wdXNoKC4uLmxpc3QuaXRlbXMpXG5cbiAgICAgIHJldHVybiB0aGlzXG4gICB9XG5cbiAgIGFzeW5jIHRvSnMoKTogUHJvbWlzZTxhbnk+IHtcbiAgICAgIGxldCByZXN1bHRzID0gbmV3IEFycmF5PGFueT4oKVxuXG4gICAgICBmb3IobGV0IGkgPSAwOyBpIDwgdGhpcy5pdGVtcy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgcmVzdWx0cy5wdXNoKGF3YWl0IHRoaXMuc2VyaWFsaXplci50b0pzKHRoaXMuaXRlbXNbaV0pKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzdWx0c1xuICAgfVxufVxuXG5leHBvcnQgY2xhc3MgTGlzdFNlcmlhbGl6ZXIgZXh0ZW5kcyBWYWx1ZVNlcmlhbGl6ZXIge1xuICAgY29uc3RydWN0b3IocmVhZG9ubHkgc2VyaWFsaXplcjogSVZhbHVlU2VyaWFsaXplcikge1xuICAgICAgc3VwZXIoVHlwZVNldC5MaXN0KVxuICAgfVxuXG4gICBhc3luYyB0b0pzKHZhbHVlOiBJVmFsdWUpOiBQcm9taXNlPGFueT4ge1xuICAgICAgdGhpcy52YWxpZGF0ZSh2YWx1ZS50eXBlKVxuXG4gICAgICBsZXQgcmVzdWx0cyA9IG5ldyBBcnJheTxhbnk+KClcblxuICAgICAgbGV0IGxpc3QgPSB2YWx1ZSBhcyBMaXN0VmFsdWVcblxuICAgICAgZm9yKGxldCB2YWx1ZSBvZiBsaXN0KSB7XG4gICAgICAgICByZXN1bHRzLnB1c2goYXdhaXQgdGhpcy5zZXJpYWxpemVyLnRvSnModmFsdWUpKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzdWx0c1xuICAgfVxuXG4gICBhc3luYyBmcm9tSnModHlwZTogSVR5cGUsIG9iajogYW55KTogUHJvbWlzZTxJVmFsdWU+IHtcbiAgICAgIHRoaXMudmFsaWRhdGUodHlwZSlcblxuICAgICAgaWYoIUFycmF5LmlzQXJyYXkob2JqKSkge1xuICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBUaGUgSlMgb2JqZWN0IHR5cGUgZG9lcyBub3QgbWF0Y2ggd2hhdCdzIGV4cGVjdGVkIHdoZW4gc2VyaWFsaXppbmcuIEV4cGVjdGVkIGEgTGlzdCBhbmQgcmVjZWl2ZWQgYSAke3R5cGVvZiBvYmp9YClcbiAgICAgIH1cblxuICAgICAgbGV0IGxpc3RUeXBlID0gdHlwZSBhcyBMaXN0VHlwZVxuXG4gICAgICBsZXQgbGlzdCA9IG5ldyBMaXN0VmFsdWUobGlzdFR5cGUuaXRlbVR5cGUsIHRoaXMuc2VyaWFsaXplcilcblxuICAgICAgZm9yKGxldCB2YWwgb2Ygb2JqKSB7XG4gICAgICAgICBsaXN0LnB1c2goYXdhaXQgdGhpcy5zZXJpYWxpemVyLmZyb21KcyhsaXN0VHlwZS5pdGVtVHlwZSwgdmFsKSlcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGxpc3RcbiAgIH1cbn0iXX0=