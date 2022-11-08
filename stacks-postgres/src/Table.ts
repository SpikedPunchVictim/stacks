import { IMember, IModel } from "@spikedpunch/stacks"

export type ColumnInfo = {
   member: IMember
   columnName: string
   reference?: {     // This is set if a property references an object in another table
      table: string
      model: IModel
   }
}

export type TableInfo = {
   model: IModel
   tableName: string
   columns: ColumnInfo[]
}