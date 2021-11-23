export type StackObject = {
   id: string
}

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