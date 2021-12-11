export type StackObject = {
   id: string
}

export function isStackObject(obj: any): boolean {
   return (obj.id != null) && (typeof obj.id === 'string')
}