export function isEnum<T>(enm: any, obj: any): boolean {
   return Object.values(enm).includes(obj as T)
}