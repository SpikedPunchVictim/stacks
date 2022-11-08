"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SymbolTable = void 0;
/**
 * This class assists in gathering Symbols from Models and Members, and
 * makes them easier to query and use.
 */
class SymbolTable {
    constructor() {
        /*
           Key: Model ID
           Value: Symbol Map
        */
        this.cache = new Map();
    }
    getModelSymbols(modelId) {
        let found = this.cache.get(modelId);
        if (found === undefined) {
            return undefined;
        }
        return found.model.values;
    }
    getMemberSymbols(modelId, memberId) {
        let found = this.cache.get(modelId);
        if (found === undefined) {
            return undefined;
        }
        let entry = found.members.find(it => it.id === memberId);
        if (entry === undefined) {
            return undefined;
        }
        return entry.values;
    }
    async collect(stack, map) {
        this.cache.clear();
        for (let model of stack.get.models()) {
            let cacheEntry = {
                model: {
                    id: model.id,
                    values: {}
                },
                members: new Array()
            };
            cacheEntry.model.values = await this.collectSymbols(model.symbols, map.model.prefix, map.model.defaults, model);
            for (let member of model.members) {
                cacheEntry.members.push({
                    id: member.id,
                    values: await this.collectSymbols(member.symbols, map.members.prefix, map.members.defaults, member)
                });
            }
            this.cache.set(model.id, cacheEntry);
        }
    }
    /**
     * Collects the Symbol data in a Symbol Collection
     *
     * @param symbols Symbol collection
     * @param prefix The prefix of the symbols to collect
     * @param map Map of default values, where the keys match the name field keys, minus the prefix
     * @param context Context that is used when creating dynamic values
     */
    async collectSymbols(symbols, prefix, map, context) {
        let result = {};
        for (let key of Object.keys(map)) {
            let id = `${prefix}${key}`.toLowerCase();
            let found = symbols.filter(it => it.name.toLowerCase() === id);
            if (found.length == 0) {
                if (typeof map[key] === 'function') {
                    result[key] = await map[key](context);
                }
                else {
                    result[key] = map[key];
                }
            }
            else {
                if (found.length == 1) {
                    if (typeof map[key] === 'function') {
                        result[key] = await map[key](context);
                    }
                    else {
                        result[key] = map[key];
                    }
                }
                else {
                    // More than 1 result found
                    if (!Array.isArray(map[key])) {
                        throw new Error(`Received too many Symbols "${id}". Ensure only one is provided.`);
                    }
                    // If the default is an Array, then it's accepted
                    let array = new Array();
                    for (let symbol of found) {
                        if (typeof symbol.value === 'function') {
                            array.push(await symbol.value(context));
                        }
                        else {
                            array.push(symbol.value);
                        }
                    }
                    result[key] = array;
                }
            }
        }
        return result;
    }
}
exports.SymbolTable = SymbolTable;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3ltYm9sVGFibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvU3ltYm9sVGFibGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBNEJBOzs7R0FHRztBQUNILE1BQWEsV0FBVztJQU9yQjtRQU5BOzs7VUFHRTtRQUNNLFVBQUssR0FBK0IsSUFBSSxHQUFHLEVBQXlCLENBQUE7SUFJNUUsQ0FBQztJQUVELGVBQWUsQ0FBSSxPQUFlO1FBQy9CLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFBO1FBRW5DLElBQUcsS0FBSyxLQUFLLFNBQVMsRUFBRTtZQUNyQixPQUFPLFNBQVMsQ0FBQTtTQUNsQjtRQUVELE9BQU8sS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFXLENBQUE7SUFDakMsQ0FBQztJQUVELGdCQUFnQixDQUFJLE9BQWUsRUFBRSxRQUFnQjtRQUNsRCxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUVuQyxJQUFHLEtBQUssS0FBSyxTQUFTLEVBQUU7WUFDckIsT0FBTyxTQUFTLENBQUE7U0FDbEI7UUFFRCxJQUFJLEtBQUssR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssUUFBUSxDQUFDLENBQUE7UUFFeEQsSUFBRyxLQUFLLEtBQUssU0FBUyxFQUFFO1lBQ3JCLE9BQU8sU0FBUyxDQUFBO1NBQ2xCO1FBRUQsT0FBTyxLQUFLLENBQUMsTUFBVyxDQUFBO0lBQzNCLENBQUM7SUFFRCxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQWEsRUFBRSxHQUFtQjtRQUM3QyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFBO1FBRWxCLEtBQUksSUFBSSxLQUFLLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVB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QkFDcEMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQTt5QkFDekM7NkJBQU07NEJBQ0osS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUE7eUJBQzFCO3FCQUNIO29CQUVELE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUE7aUJBQ3JCO2FBQ0g7U0FDSDtRQUVELE9BQU8sTUFBTSxDQUFBO0lBQ2hCLENBQUM7Q0FDSDtBQW5IRCxrQ0FtSEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJTWVtYmVyLCBJTW9kZWwsIElTdGFjaywgU3ltYm9sRW50cnkgfSBmcm9tIFwiQHNwaWtlZHB1bmNoL3N0YWNrc1wiO1xuXG5leHBvcnQgdHlwZSBTeW1ib2xWYWx1ZU1hcCA9IHtcbiAgIG1vZGVsOiB7XG4gICAgICBwcmVmaXg6IHN0cmluZyxcbiAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgICBba2V5OiBzdHJpbmddOiBhbnlcbiAgICAgIH1cbiAgIH0sXG4gICBtZW1iZXJzOiB7XG4gICAgICBwcmVmaXg6IHN0cmluZyxcbiAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgICBba2V5OiBzdHJpbmddOiBhbnlcbiAgICAgIH1cbiAgIH1cbn1cblxudHlwZSBDYWNoZWRFbnRyeSA9IHtcbiAgIGlkOiBzdHJpbmdcbiAgIHZhbHVlczogYW55XG59XG5cblxudHlwZSBDYWNoZWRTeW1ib2xzID0ge1xuICAgbW9kZWw6IENhY2hlZEVudHJ5XG4gICBtZW1iZXJzOiBDYWNoZWRFbnRyeVtdXG59XG5cbi8qKlxuICogVGhpcyBjbGFzcyBhc3Npc3RzIGluIGdhdGhlcmluZyBTeW1ib2xzIGZyb20gTW9kZWxzIGFuZCBNZW1iZXJzLCBhbmRcbiAqIG1ha2VzIHRoZW0gZWFzaWVyIHRvIHF1ZXJ5IGFuZCB1c2UuXG4gKi9cbmV4cG9ydCBjbGFzcyBTeW1ib2xUYWJsZSB7XG4gICAvKlxuICAgICAgS2V5OiBNb2RlbCBJRFxuICAgICAgVmFsdWU6IFN5bWJvbCBNYXBcbiAgICovXG4gICBwcml2YXRlIGNhY2hlOiBNYXA8c3RyaW5nLCBDYWNoZWRTeW1ib2xzPiA9IG5ldyBNYXA8c3RyaW5nLCBDYWNoZWRTeW1ib2xzPigpXG5cbiAgIGNvbnN0cnVjdG9yKCkge1xuXG4gICB9XG5cbiAgIGdldE1vZGVsU3ltYm9sczxUPihtb2RlbElkOiBzdHJpbmcpOiBUIHwgdW5kZWZpbmVkIHtcbiAgICAgIGxldCBmb3VuZCA9IHRoaXMuY2FjaGUuZ2V0KG1vZGVsSWQpXG5cbiAgICAgIGlmKGZvdW5kID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGZvdW5kLm1vZGVsLnZhbHVlcyBhcyBUXG4gICB9XG5cbiAgIGdldE1lbWJlclN5bWJvbHM8VD4obW9kZWxJZDogc3RyaW5nLCBtZW1iZXJJZDogc3RyaW5nKTogVCB8IHVuZGVmaW5lZCB7XG4gICAgICBsZXQgZm91bmQgPSB0aGlzLmNhY2hlLmdldChtb2RlbElkKVxuXG4gICAgICBpZihmb3VuZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICByZXR1cm4gdW5kZWZpbmVkXG4gICAgICB9XG5cbiAgICAgIGxldCBlbnRyeSA9IGZvdW5kLm1lbWJlcnMuZmluZChpdCA9PiBpdC5pZCA9PT0gbWVtYmVySWQpXG5cbiAgICAgIGlmKGVudHJ5ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGVudHJ5LnZhbHVlcyBhcyBUXG4gICB9XG5cbiAgIGFzeW5jIGNvbGxlY3Qoc3RhY2s6IElTdGFjaywgbWFwOiBTeW1ib2xWYWx1ZU1hcCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgdGhpcy5jYWNoZS5jbGVhcigpXG5cbiAgICAgIGZvcihsZXQgbW9kZWwgb2Ygc3RhY2suZ2V0Lm1vZGVscygpKSB7XG4gICAgICAgICBsZXQgY2FjaGVFbnRyeTogQ2FjaGVkU3ltYm9scyA9IHtcbiAgICAgICAgICAgIG1vZGVsOiB7XG4gICAgICAgICAgICAgICBpZDogbW9kZWwuaWQsXG4gICAgICAgICAgICAgICB2YWx1ZXM6IHt9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbWVtYmVyczogbmV3IEFycmF5PENhY2hlZEVudHJ5PigpXG4gICAgICAgICB9XG5cbiAgICAgICAgIGNhY2hlRW50cnkubW9kZWwudmFsdWVzID0gYXdhaXQgdGhpcy5jb2xsZWN0U3ltYm9scyhtb2RlbC5zeW1ib2xzLCBtYXAubW9kZWwucHJlZml4LCBtYXAubW9kZWwuZGVmYXVsdHMsIG1vZGVsKVxuICAgXG4gICAgICAgICBmb3IobGV0IG1lbWJlciBvZiBtb2RlbC5tZW1iZXJzKSB7XG4gICAgICAgICAgICBjYWNoZUVudHJ5Lm1lbWJlcnMucHVzaCh7XG4gICAgICAgICAgICAgICBpZDogbWVtYmVyLmlkLFxuICAgICAgICAgICAgICAgdmFsdWVzOiBhd2FpdCB0aGlzLmNvbGxlY3RTeW1ib2xzKG1lbWJlci5zeW1ib2xzLCBtYXAubWVtYmVycy5wcmVmaXgsIG1hcC5tZW1iZXJzLmRlZmF1bHRzLCBtZW1iZXIpXG4gICAgICAgICAgICB9KVxuICAgICAgICAgfVxuICAgICAgICAgXG4gICAgICAgICB0aGlzLmNhY2hlLnNldChtb2RlbC5pZCwgY2FjaGVFbnRyeSlcbiAgICAgIH1cbiAgIH1cblxuICAgLyoqXG4gICAgKiBDb2xsZWN0cyB0aGUgU3ltYm9sIGRhdGEgaW4gYSBTeW1ib2wgQ29sbGVjdGlvblxuICAgICogXG4gICAgKiBAcGFyYW0gc3ltYm9scyBTeW1ib2wgY29sbGVjdGlvblxuICAgICogQHBhcmFtIHByZWZpeCBUaGUgcHJlZml4IG9mIHRoZSBzeW1ib2xzIHRvIGNvbGxlY3RcbiAgICAqIEBwYXJhbSBtYXAgTWFwIG9mIGRlZmF1bHQgdmFsdWVzLCB3aGVyZSB0aGUga2V5cyBtYXRjaCB0aGUgbmFtZSBmaWVsZCBrZXlzLCBtaW51cyB0aGUgcHJlZml4XG4gICAgKiBAcGFyYW0gY29udGV4dCBDb250ZXh0IHRoYXQgaXMgdXNlZCB3aGVuIGNyZWF0aW5nIGR5bmFtaWMgdmFsdWVzXG4gICAgKi9cbiAgIHByaXZhdGUgYXN5bmMgY29sbGVjdFN5bWJvbHMoc3ltYm9sczogU3ltYm9sRW50cnlbXSwgcHJlZml4OiBzdHJpbmcsIG1hcDogYW55LCBjb250ZXh0PzogSU1vZGVsIHwgSU1lbWJlcik6IFByb21pc2U8YW55PiB7XG4gICAgICBsZXQgcmVzdWx0ID0ge31cblxuICAgICAgZm9yIChsZXQga2V5IG9mIE9iamVjdC5rZXlzKG1hcCkpIHtcbiAgICAgICAgIGxldCBpZCA9IGAke3ByZWZpeH0ke2tleX1gLnRvTG93ZXJDYXNlKClcblxuICAgICAgICAgbGV0IGZvdW5kID0gc3ltYm9scy5maWx0ZXIoaXQgPT4gaXQubmFtZS50b0xvd2VyQ2FzZSgpID09PSBpZClcblxuICAgICAgICAgaWYgKGZvdW5kLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICBpZih0eXBlb2YgbWFwW2tleV0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgIHJlc3VsdFtrZXldID0gYXdhaXQgbWFwW2tleV0oY29udGV4dClcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICByZXN1bHRba2V5XSA9IG1hcFtrZXldXG4gICAgICAgICAgICB9XG4gICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKGZvdW5kLmxlbmd0aCA9PSAxKSB7XG4gICAgICAgICAgICAgICBpZih0eXBlb2YgbWFwW2tleV0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgIHJlc3VsdFtrZXldID0gYXdhaXQgbWFwW2tleV0oY29udGV4dClcbiAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICByZXN1bHRba2V5XSA9IG1hcFtrZXldXG4gICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgLy8gTW9yZSB0aGFuIDEgcmVzdWx0IGZvdW5kXG4gICAgICAgICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkobWFwW2tleV0pKSB7XG4gICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFJlY2VpdmVkIHRvbyBtYW55IFN5bWJvbHMgXCIke2lkfVwiLiBFbnN1cmUgb25seSBvbmUgaXMgcHJvdmlkZWQuYClcbiAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgLy8gSWYgdGhlIGRlZmF1bHQgaXMgYW4gQXJyYXksIHRoZW4gaXQncyBhY2NlcHRlZFxuICAgICAgICAgICAgICAgbGV0IGFycmF5ID0gbmV3IEFycmF5PGFueT4oKVxuXG4gICAgICAgICAgICAgICBmb3IobGV0IHN5bWJvbCBvZiBmb3VuZCkge1xuICAgICAgICAgICAgICAgICAgaWYodHlwZW9mIHN5bWJvbC52YWx1ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICAgYXJyYXkucHVzaChhd2FpdCBzeW1ib2wudmFsdWUoY29udGV4dCkpXG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgYXJyYXkucHVzaChzeW1ib2wudmFsdWUpXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgIHJlc3VsdFtrZXldID0gYXJyYXlcbiAgICAgICAgICAgIH1cbiAgICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlc3VsdFxuICAgfVxufSJdfQ==