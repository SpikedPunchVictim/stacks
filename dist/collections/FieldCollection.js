"use strict";
// import { IBondedObject } from "../BondedObject";
// import { IField } from "../Field";
// import { CreateTypeHandler, TypeSource } from "../values/TypeSource";
// export interface IFieldCollection {
//    readonly object: IBondedObject
//    [Symbol.iterator](): Iterator<IField>
//    get(name: string): IField | undefined
//    set(name: string, value: string | number | boolean | CreateTypeHandler): Promise<void>
// }
// export class FieldCollection implements IFieldCollection {
//    private fields: Array<IField> = new Array<IField>()
//    constructor(readonly obj: IBondedObject) {
//    }
//    [Symbol.iterator](): Iterator<IField> {
//       let index = 0
//       let self = this
//       return {
//          next(): IteratorResult<IField> {
//             return index == self.fields.length ?
//                { value: undefined, done: true } :
//                { value: self.fields[index++], done: false }
//          }
//       }
//    }
//    get(name: string): IField | undefined {
//       return this.fields.find(f => f.name === name)
//    }
//    async set(name: string, value: string | number | boolean | CreateTypeHandler): Promise<void> {
//       let field = this.fields.find(f => f.name === name)
//       if(field === undefined) {
//          throw new Error(`No Field with the name ${name} exists`)
//       }
//       field.type
//    }
// }
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRmllbGRDb2xsZWN0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbGxlY3Rpb25zL0ZpZWxkQ29sbGVjdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsbURBQW1EO0FBQ25ELHFDQUFxQztBQUNyQyx3RUFBd0U7QUFHeEUsc0NBQXNDO0FBQ3RDLG9DQUFvQztBQUVwQywyQ0FBMkM7QUFFM0MsMkNBQTJDO0FBQzNDLDRGQUE0RjtBQUM1RixJQUFJO0FBRUosNkRBQTZEO0FBQzdELHlEQUF5RDtBQUV6RCxnREFBZ0Q7QUFFaEQsT0FBTztBQUVQLDZDQUE2QztBQUM3QyxzQkFBc0I7QUFDdEIsd0JBQXdCO0FBQ3hCLGlCQUFpQjtBQUNqQiw0Q0FBNEM7QUFDNUMsbURBQW1EO0FBQ25ELG9EQUFvRDtBQUNwRCw4REFBOEQ7QUFDOUQsYUFBYTtBQUNiLFVBQVU7QUFDVixPQUFPO0FBRVAsNkNBQTZDO0FBQzdDLHNEQUFzRDtBQUN0RCxPQUFPO0FBRVAsb0dBQW9HO0FBQ3BHLDJEQUEyRDtBQUUzRCxrQ0FBa0M7QUFDbEMsb0VBQW9FO0FBQ3BFLFVBQVU7QUFFVixtQkFBbUI7QUFDbkIsT0FBTztBQUNQLElBQUkiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBpbXBvcnQgeyBJQm9uZGVkT2JqZWN0IH0gZnJvbSBcIi4uL0JvbmRlZE9iamVjdFwiO1xuLy8gaW1wb3J0IHsgSUZpZWxkIH0gZnJvbSBcIi4uL0ZpZWxkXCI7XG4vLyBpbXBvcnQgeyBDcmVhdGVUeXBlSGFuZGxlciwgVHlwZVNvdXJjZSB9IGZyb20gXCIuLi92YWx1ZXMvVHlwZVNvdXJjZVwiO1xuXG5cbi8vIGV4cG9ydCBpbnRlcmZhY2UgSUZpZWxkQ29sbGVjdGlvbiB7XG4vLyAgICByZWFkb25seSBvYmplY3Q6IElCb25kZWRPYmplY3RcblxuLy8gICAgW1N5bWJvbC5pdGVyYXRvcl0oKTogSXRlcmF0b3I8SUZpZWxkPlxuXG4vLyAgICBnZXQobmFtZTogc3RyaW5nKTogSUZpZWxkIHwgdW5kZWZpbmVkXG4vLyAgICBzZXQobmFtZTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nIHwgbnVtYmVyIHwgYm9vbGVhbiB8IENyZWF0ZVR5cGVIYW5kbGVyKTogUHJvbWlzZTx2b2lkPlxuLy8gfVxuXG4vLyBleHBvcnQgY2xhc3MgRmllbGRDb2xsZWN0aW9uIGltcGxlbWVudHMgSUZpZWxkQ29sbGVjdGlvbiB7XG4vLyAgICBwcml2YXRlIGZpZWxkczogQXJyYXk8SUZpZWxkPiA9IG5ldyBBcnJheTxJRmllbGQ+KClcblxuLy8gICAgY29uc3RydWN0b3IocmVhZG9ubHkgb2JqOiBJQm9uZGVkT2JqZWN0KSB7XG5cbi8vICAgIH1cblxuLy8gICAgW1N5bWJvbC5pdGVyYXRvcl0oKTogSXRlcmF0b3I8SUZpZWxkPiB7XG4vLyAgICAgICBsZXQgaW5kZXggPSAwXG4vLyAgICAgICBsZXQgc2VsZiA9IHRoaXNcbi8vICAgICAgIHJldHVybiB7XG4vLyAgICAgICAgICBuZXh0KCk6IEl0ZXJhdG9yUmVzdWx0PElGaWVsZD4ge1xuLy8gICAgICAgICAgICAgcmV0dXJuIGluZGV4ID09IHNlbGYuZmllbGRzLmxlbmd0aCA/XG4vLyAgICAgICAgICAgICAgICB7IHZhbHVlOiB1bmRlZmluZWQsIGRvbmU6IHRydWUgfSA6XG4vLyAgICAgICAgICAgICAgICB7IHZhbHVlOiBzZWxmLmZpZWxkc1tpbmRleCsrXSwgZG9uZTogZmFsc2UgfVxuLy8gICAgICAgICAgfVxuLy8gICAgICAgfVxuLy8gICAgfVxuXG4vLyAgICBnZXQobmFtZTogc3RyaW5nKTogSUZpZWxkIHwgdW5kZWZpbmVkIHtcbi8vICAgICAgIHJldHVybiB0aGlzLmZpZWxkcy5maW5kKGYgPT4gZi5uYW1lID09PSBuYW1lKVxuLy8gICAgfVxuXG4vLyAgICBhc3luYyBzZXQobmFtZTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nIHwgbnVtYmVyIHwgYm9vbGVhbiB8IENyZWF0ZVR5cGVIYW5kbGVyKTogUHJvbWlzZTx2b2lkPiB7XG4vLyAgICAgICBsZXQgZmllbGQgPSB0aGlzLmZpZWxkcy5maW5kKGYgPT4gZi5uYW1lID09PSBuYW1lKVxuXG4vLyAgICAgICBpZihmaWVsZCA9PT0gdW5kZWZpbmVkKSB7XG4vLyAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYE5vIEZpZWxkIHdpdGggdGhlIG5hbWUgJHtuYW1lfSBleGlzdHNgKVxuLy8gICAgICAgfVxuXG4vLyAgICAgICBmaWVsZC50eXBlXG4vLyAgICB9XG4vLyB9Il19