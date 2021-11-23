"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// export interface IField {
//    readonly id: string
//    readonly name: string
//    readonly type: IType
// }
// export interface IBondedObject {
//    readonly model: IModel
//    readonly id: string
//    /**
//     * Deletes this Object
//     */
//    delete(): Promise<void>
//    // Do we return a Proxy here that the user updates, and under the hood
//    // it's changing values in a reference here?
//    toJs<T>(): Promise<T>
//    /**
//     * Updates the values for this Object
//     */
//    update(): Promise<void>
// }
// export class BondedObject implements IBondedObject {
//    private get orchestrator(): IOrchestrator {
//       return this.context.orchestrator
//    }
//    constructor(
//       readonly model: IModel,
//       readonly id: string,
//       readonly context: IStackContext
//    ) {
//    }
//    async delete(): Promise<void> {
//       await this.orchestrator.deleteObject(this)
//    }
//    toJs<T>(): Promise<T> {
//       throw new Error("Method not implemented.");
//    }
//    async update(): Promise<void> {
//       await this.orchestrator.updateObject(this)
//    }
// }
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQm9uZGVkT2JqZWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL0JvbmRlZE9iamVjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUlBLDRCQUE0QjtBQUM1Qix5QkFBeUI7QUFDekIsMkJBQTJCO0FBQzNCLDBCQUEwQjtBQUMxQixJQUFJO0FBRUosbUNBQW1DO0FBQ25DLDRCQUE0QjtBQUM1Qix5QkFBeUI7QUFFekIsU0FBUztBQUNULDRCQUE0QjtBQUM1QixTQUFTO0FBQ1QsNkJBQTZCO0FBRTdCLDRFQUE0RTtBQUM1RSxrREFBa0Q7QUFDbEQsMkJBQTJCO0FBRTNCLFNBQVM7QUFDVCwyQ0FBMkM7QUFDM0MsU0FBUztBQUNULDZCQUE2QjtBQUM3QixJQUFJO0FBRUosdURBQXVEO0FBRXZELGlEQUFpRDtBQUNqRCx5Q0FBeUM7QUFDekMsT0FBTztBQUVQLGtCQUFrQjtBQUNsQixnQ0FBZ0M7QUFDaEMsNkJBQTZCO0FBQzdCLHdDQUF3QztBQUN4QyxTQUFTO0FBRVQsT0FBTztBQUVQLHFDQUFxQztBQUNyQyxtREFBbUQ7QUFDbkQsT0FBTztBQUVQLDZCQUE2QjtBQUM3QixvREFBb0Q7QUFDcEQsT0FBTztBQUVQLHFDQUFxQztBQUNyQyxtREFBbUQ7QUFDbkQsT0FBTztBQUNQLElBQUkiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgdHlwZSBTdGFja09iamVjdCA9IHtcbiAgIGlkOiBzdHJpbmdcbn1cblxuLy8gZXhwb3J0IGludGVyZmFjZSBJRmllbGQge1xuLy8gICAgcmVhZG9ubHkgaWQ6IHN0cmluZ1xuLy8gICAgcmVhZG9ubHkgbmFtZTogc3RyaW5nXG4vLyAgICByZWFkb25seSB0eXBlOiBJVHlwZVxuLy8gfVxuXG4vLyBleHBvcnQgaW50ZXJmYWNlIElCb25kZWRPYmplY3Qge1xuLy8gICAgcmVhZG9ubHkgbW9kZWw6IElNb2RlbFxuLy8gICAgcmVhZG9ubHkgaWQ6IHN0cmluZ1xuXG4vLyAgICAvKipcbi8vICAgICAqIERlbGV0ZXMgdGhpcyBPYmplY3Rcbi8vICAgICAqL1xuLy8gICAgZGVsZXRlKCk6IFByb21pc2U8dm9pZD5cblxuLy8gICAgLy8gRG8gd2UgcmV0dXJuIGEgUHJveHkgaGVyZSB0aGF0IHRoZSB1c2VyIHVwZGF0ZXMsIGFuZCB1bmRlciB0aGUgaG9vZFxuLy8gICAgLy8gaXQncyBjaGFuZ2luZyB2YWx1ZXMgaW4gYSByZWZlcmVuY2UgaGVyZT9cbi8vICAgIHRvSnM8VD4oKTogUHJvbWlzZTxUPlxuXG4vLyAgICAvKipcbi8vICAgICAqIFVwZGF0ZXMgdGhlIHZhbHVlcyBmb3IgdGhpcyBPYmplY3Rcbi8vICAgICAqL1xuLy8gICAgdXBkYXRlKCk6IFByb21pc2U8dm9pZD5cbi8vIH1cblxuLy8gZXhwb3J0IGNsYXNzIEJvbmRlZE9iamVjdCBpbXBsZW1lbnRzIElCb25kZWRPYmplY3Qge1xuICAgXG4vLyAgICBwcml2YXRlIGdldCBvcmNoZXN0cmF0b3IoKTogSU9yY2hlc3RyYXRvciB7XG4vLyAgICAgICByZXR1cm4gdGhpcy5jb250ZXh0Lm9yY2hlc3RyYXRvclxuLy8gICAgfVxuXG4vLyAgICBjb25zdHJ1Y3Rvcihcbi8vICAgICAgIHJlYWRvbmx5IG1vZGVsOiBJTW9kZWwsXG4vLyAgICAgICByZWFkb25seSBpZDogc3RyaW5nLFxuLy8gICAgICAgcmVhZG9ubHkgY29udGV4dDogSVN0YWNrQ29udGV4dFxuLy8gICAgKSB7XG5cbi8vICAgIH1cbiAgIFxuLy8gICAgYXN5bmMgZGVsZXRlKCk6IFByb21pc2U8dm9pZD4ge1xuLy8gICAgICAgYXdhaXQgdGhpcy5vcmNoZXN0cmF0b3IuZGVsZXRlT2JqZWN0KHRoaXMpXG4vLyAgICB9XG5cbi8vICAgIHRvSnM8VD4oKTogUHJvbWlzZTxUPiB7XG4vLyAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJNZXRob2Qgbm90IGltcGxlbWVudGVkLlwiKTtcbi8vICAgIH1cbiAgIFxuLy8gICAgYXN5bmMgdXBkYXRlKCk6IFByb21pc2U8dm9pZD4ge1xuLy8gICAgICAgYXdhaXQgdGhpcy5vcmNoZXN0cmF0b3IudXBkYXRlT2JqZWN0KHRoaXMpXG4vLyAgICB9XG4vLyB9Il19