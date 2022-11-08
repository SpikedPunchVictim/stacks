export class StacksPostgresError extends Error {
   constructor(msg: string) {
      super(`[stacks-postgres] ${msg}`)
   }
}