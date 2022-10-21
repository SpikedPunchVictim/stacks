import { IMember, TypeSet } from ".";
import { FieldCollection, IFieldCollection } from "./collections/FieldCollection";
import { Field, IField } from "./Field";
import { IModel, ObjectCreateParams } from "./Model";
import { IValueSerializer } from "./serialize/ValueSerializer";
import { IStackContext } from "./stack/StackContext";
import { StackObject } from "./StackObject";
import { UidKeeper } from "./UidKeeper";
import { ObjectRefType } from "./values/ObjectRef";
import { ValueCreateParams, ValueSource } from "./values/ValueSource";

/**
 * The SerializedObject stores the data between the backend and the frontend.
 * It stores the meta data necessary to tie the objects used outside the API
 * to their backend counterparts.
 * 
 * Serialized: 
 * The object representing what is stored in the backend
 * 
 * Deserialized:
 * The object used in the front end. The focus is to stay as close
 * to raw JS objects as possible.   
 */

export interface IProxyObject {
   readonly id: string
   readonly fields: IFieldCollection

   /**
    * Converts the Proxy Object into a Javascript Object
    */
   toJs<T extends StackObject>(): T
}

let handler = {
   get(target: IProxyObject, property: string): any {
      if(property === '_unwrap') {
         // Unwrap the SerializedObject from the Proxy
         return function() {
            return target
         }
      }

      if(property === 'id') {
         return target.id
      }

      let field = target.fields.get(property)

      if(field === undefined) {
         // Returning undefined here to not only get around
         // not having the property, but also in the cases
         // when the Proxy is await'd, the underlying system
         // calls then() until an undefined is returned.
         return undefined
      }

      return field.edit
   },
   set(target: IProxyObject, property: string, value: any): boolean {
      if(property === 'id') {
         let cast = target as ProxyObject
         cast.internaleSetId(value)
         return true
      }

      let field = target.fields.get(property)

      if(field === undefined) {
         return false
      }

      field.edit = value
      return true
   },
   ownKeys(target: IProxyObject): void[] {
      return target.fields.map(f => f.name as string)
   },
   getOwnPropertyDescriptor(target: IProxyObject, key: string) {
      let field = target.fields.get(key)

      if(field === undefined) {
         return {
            configurable: false,
            enumerable: false,
            value: undefined
         }
      }

      return {
         configurable: true,
         enumerable: true,
         value: field.edit
      }
   }
}

export class ProxyObject implements IProxyObject {
   readonly fields: IFieldCollection

   get id(): string {
      return this._id
   }

   private _id: string

   private constructor(readonly model: IModel, id: string, fields: IField[]) {
      this.fields = new FieldCollection(fields)
      this._id = id
   }

   static async fromModel<T extends StackObject>(model: IModel, context: IStackContext): Promise<T> {
      let fields = new Array<IField>()

      for (let member of model.members) {
         let editObj = await context.serializer.toJs(member.value)
         fields.push(new Field(member.name, member.value.clone(), editObj))
      }

      let proxy = new ProxyObject(model, UidKeeper.IdNotSet, fields)

      //@ts-ignore
      return new Proxy<IProxyObject>(proxy, handler)
   }

   /**
    * This converts a Serialized Object (typically from the data store), and converts
    * it into a ProxyObject that the caller can interact with.
    * 
    * @param model The Model
    * @param serialized Raw serialized data that has been stored
    * @param serializer The Serializer used to deserialized the serialized raw data
    * @returns ProxyObject
    */
   static async fromStored(model: IModel, serialized: any, serializer: IValueSerializer): Promise<IProxyObject> {
      /*
         Bool -> true
         Int -> 0
         List ->

      */

      let fields = new Array<IField>()

      for(let key of Object.keys(serialized)) {
         let member = model.members.get(key)

         if(member === undefined) {
            // TODO: Potentially add a version compatibility mode where it doesn't throw an error?
            // May need to support not throwing an Error for migrations
            // Consider turning the IValue objects into little Proxies that can update
            // their own fields.
            throw new Error(`A property exists on ther serialized object, that doesn't exist in the Model. Model ${model.name}, Property ${key}`)
         }

         let value = await serializer.fromJs(member.type, serialized[key])

         fields.push(new Field(key, value, await serializer.toJs(value)))
      }

      let proxy = new ProxyObject(model, serialized.id, fields)

      //@ts-ignore
      return new Proxy<IProxyObject>(proxy, handler)
   }

   /**
    * Creates a Proxy Object when an Object is being created in-memory (before being saved)
    * 
    * @param model The Model
    * @param obj The object being created
    * @param context The StackContext
    * @returns 
    */
   static async fromCreated<T extends StackObject>(model: IModel, obj: ObjectCreateParams, context: IStackContext): Promise<T> {
      let fields = new Array<IField>()

      for (let key of Object.keys(obj)) {
         let member = model.members.find(m => m.name === key)

         if(member === undefined) {
            // Ignore keys that don't have matching members
            // Note: This could be a version mismatch between the data
            continue
         }

         if(member.type.type === TypeSet.ObjectRef) {
            let editObj = await this.buildNestedEditObject(member, obj[key], context)
            let objRefType = member.type as ObjectRefType
            let value = context.value.ref(objRefType.modelName)

            fields.push(new Field(key, value, editObj))

            continue
         }

         let value = ValueSource.resolve(obj[key] as ValueCreateParams, context)
         let jsObj = await context.serializer.toJs(value)
         fields.push(new Field(key, value, jsObj))
      }

      for (let member of model.members) {
         if (fields.find(f => f.name === member.name) !== undefined) {
            continue
         }

         let editObj = await context.serializer.toJs(member.value)

         fields.push(new Field(member.name, member.value.clone(), editObj))
      }

      // We create the ID when the Object is stored.
      // This saves round trip time, and covers the case where an 
      // ID may be generated, and not stored in the backend, and
      // another equal ID is generated for a different object.
      //@ts-ignore
      return new Proxy<IProxyObject>(new ProxyObject(model, UidKeeper.IdNotSet, fields), handler) as T
   }

   /**
    * Returns the IProxyObject that is wrapped in the provided Proxy
    * 
    * @param serialized A Proxy. Type 'any' is used here since there are no tests for Proxy
    * @returns 
    */
   static unwrap(serialized: any): IProxyObject {
      //@ts-ignore
      return serialized._unwrap()
   }

   toJs<T extends StackObject>(): T {
      let result = {}

      for(let field of this.fields) {
         if(field.edit instanceof ProxyObject) {
            let unwrapped = ProxyObject.unwrap(field.edit)
            result[field.name] = unwrapped.toJs()
         } else {
            result[field.name] = field.edit
         }         
      }

      return result as T
   }

   private static async buildNestedEditObject(member: IMember, createValues: ValueCreateParams | ObjectCreateParams, context: IStackContext): Promise<any> {
      let objRefType = member.type as ObjectRefType
      let refValue = context.value.ref(objRefType.modelName)
      let editObj = await context.serializer.toJs(refValue)
      let model = context.cache.getModel(objRefType.modelName)

      if(model === undefined) {
         throw new Error(`Encountered an error when building an Edit Object. The Model for the nested property ${member.name} does not exist `)
      }

      for(let childKey of Object.keys(createValues)) {
         let childValue = createValues[childKey]

         let childMember = model.members.find(m => m.name === childKey)

         // Ignore values that are provided and we don't have a Member for.
         // This could signal that the data versions are mismatched, and that's ok.
         if(childMember === undefined) {
            continue
         }

         if(childMember.type.type === TypeSet.ObjectRef) {
            editObj[childKey] = await this.buildNestedEditObject(childMember, childValue, context)
            continue
         }

         let value = ValueSource.resolve(childValue, context)
         editObj[childKey] = await context.serializer.toJs(value)
      }

      return editObj
   }

   internaleSetId(id: string): void {
      this._id = id
   }
}