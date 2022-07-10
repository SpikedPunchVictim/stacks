"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StacksRest = void 0;
const Response_1 = require("./Response");
const koa_1 = __importDefault(require("koa"));
const router_1 = __importDefault(require("@koa/router"));
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
class StacksRest {
    constructor(stack) {
        this.stack = stack;
        this.app = new koa_1.default();
        this.router = new router_1.default();
    }
    get restContext() {
        return {
            app: this.app,
            router: this.router,
            stack: this.stack
        };
    }
    async use(middleware) {
        await middleware.setup(this.restContext);
    }
    /**
     * Defines a GET REST endpoint.
     *
     * many { function | string[] }
     *    If many is a function, it defines the many handler (ctx) => Promise<void>
     *    If many is a string[], it defines the properties that will be returned from
     *    the reterieved object.
     *
     * single { function | string[] }
     *    If single is a function, it handles the REST call that includes the 'id'.
     *    If single is a string[], it will be default behavior, but will only return
     *    the properties in the string[].
     *
     * model { IModel }
     *    The Model
     *
     *
     *
     * @param urlPath The URL path
     * @param options The options for GET
     */
    get(urlPath, options) {
        var _a;
        options = options || {};
        options.model = options.model || undefined;
        options.many = options.many || undefined;
        options.single = options.single || undefined;
        if (options.many === undefined &&
            options.single === undefined &&
            options.model === undefined) {
            throw new Error(`When defining the ${urlPath} GET endpoint, the 'model' or at least one of the 'detailed' or 'minimal' handlers must be defined.`);
        }
        if (typeof options.many === 'function') {
            this.router.get(urlPath, async (ctx, next) => {
                if (typeof options.many !== 'function') {
                    throw new Error(`When defining the GET endpoint for ${urlPath}, the 'minimal' property is expected to be a RequestHandler.`);
                }
                await options.many(ctx, this.restContext, next);
            });
        }
        else {
            let props = new Array();
            if (options.model == null || options.model === undefined) {
                throw new Error(`When defining the ${urlPath} GET endpoint, the Model must be provided`);
            }
            if (Array.isArray(options.many)) {
                props.push(...options.many);
            }
            this.router.get(urlPath, async (ctx, next) => {
                let model = options.model;
                let query = ctx.request.query;
                let cursor = query.page || '';
                let limit = query.limit || 100;
                //@ts-ignore
                let results = await model.getMany({ cursor, limit });
                ctx.body = (0, Response_1.buildMinimalResponse)(results.items, props);
                ctx.status = 200;
            });
        }
        if (typeof options.single === 'function') {
            this.router.get(`${urlPath}/:id`, async (ctx, next) => {
                if (typeof options.single !== 'function') {
                    throw new Error(`When defining the GET endpoint for ${urlPath}, the 'detailed' property is expected to be a RequestHandler.`);
                }
                await options.single(ctx, this.restContext, next);
            });
        }
        else {
            let props = new Array();
            if (Array.isArray(options.single)) {
                if (options.model == null) {
                    throw new Error(`When defining the ${urlPath} GET endpoint, when supplying a string Array for the 'detailed' property, the Model must be also be provided`);
                }
                props.push(...options.single);
            }
            else if (options.single == null) {
                // Default is to use the Model's properties
                //@ts-ignore
                for (let member of (_a = options.model) === null || _a === void 0 ? void 0 : _a.members) {
                    props.push(member.name);
                }
            }
            this.router.get(`${urlPath}/:id`, async (ctx, next) => {
                let model = options.model;
                let id = ctx.params.id;
                let result = await model.get(id);
                if (result === undefined) {
                    ctx.status = 400;
                    ctx.body = { message: `No Object with id ${id} exists ` };
                    return;
                }
                if (typeof options.single === 'function') {
                    // Should never get here
                    throw new Error(`When defining the ${urlPath} GET endoint, the 'detailed' property is expected to be a string Array, received a 'function' instead.`);
                }
                ctx.body = (0, Response_1.buildDetailedResponse)(result, props);
                ctx.status = 200;
            });
        }
    }
    /**
     * Defines a PUT endpoint
     *
     * @param urlPath The URL path
     * @param options The options that define the endpoint
     */
    put(urlPath, options) {
        options = options || {};
        options.model = options.model || undefined;
        options.handler = options.handler || undefined;
        if (options.handler !== undefined) {
            this.router.put(urlPath, async (ctx, next) => {
                if (options.handler === undefined) {
                    throw new Error(`When defining the ${urlPath} PUT endoint, the 'handler' property is expected to be a function, received a 'undefined' instead.`);
                }
                await options.handler(ctx, this.restContext, next);
            });
        }
        else {
            if (options.model == null) {
                throw new Error(`When defining the ${urlPath} PUT request, the 'model' property is expected when a 'handler' function is not provided.`);
            }
            this.router.put(`${urlPath}/:id`, async (ctx) => {
                let body = ctx.request.body;
                if (!body) {
                    ctx.throw(400, `A body must be provided`);
                }
                let id = ctx.params.id;
                let model = options.model;
                let obj = await model.get(id);
                if (obj === undefined) {
                    ctx.throw(400, { message: `No Object with id ${id} exists ` });
                    return;
                }
                for (let prop of Object.keys(body)) {
                    obj[prop] = body[prop];
                }
                let valid = await model.validate(obj);
                if (!valid.success) {
                    let errors = new Array();
                    for (let result of valid.results) {
                        if (result.success == false && result.error != null) {
                            errors.push(result.error);
                        }
                    }
                    ctx.throw(400, (0, Response_1.buildErrorResponse)(errors));
                    return;
                }
                await model.save(obj);
                let props = new Array();
                for (let member of model.members) {
                    props.push(member.name);
                }
                ctx.body = (0, Response_1.buildDetailedResponse)(obj, props);
                ctx.status = 200;
            });
        }
    }
    post(urlPath, options) {
        options = options || {};
        options.model = options.model || undefined;
        options.handler = options.handler || undefined;
        if (options.handler !== undefined) {
            this.router.post(urlPath, async (ctx, next) => {
                if (options.handler != null) {
                    await options.handler(ctx, this.restContext, next);
                }
            });
            return;
        }
        if (options.model === undefined) {
            throw new Error(`When defining the POST ${urlPath} endpoint, 'model' must be defined if a handler isn't provided`);
        }
        this.router.post(urlPath, async (ctx, next) => {
            let model = options.model;
            let body = ctx.request.body;
            let obj = await model.create(body);
            await model.save(obj);
            ctx.body = (0, Response_1.buildDetailedResponse)(obj);
            ctx.status = 200;
        });
    }
    del(urlPath, options) {
        options = options || {};
        options.model = options.model || undefined;
        options.handler = options.handler || undefined;
        if (options.handler !== undefined) {
            this.router.delete(urlPath, async (ctx, next) => {
                if (options.handler != null) {
                    await options.handler(ctx, this.restContext, next);
                }
            });
            return;
        }
        if (options.model === undefined) {
            throw new Error(`When defining the DELETE ${urlPath} endpoint, 'model' must be defined if a handler isn't provided`);
        }
        this.router.delete(`${urlPath}/:id`, async (ctx, next) => {
            let model = options.model;
            let id = ctx.params.id;
            let obj = await model.get(id);
            if (obj === undefined) {
                ctx.status = 200;
                ctx.body = undefined;
                return;
            }
            await model.delete(obj);
            ctx.status = 200;
            ctx.body = (0, Response_1.buildDetailedResponse)(obj);
        });
    }
    listen(port = 3401, handler = () => { }) {
        this.app
            .use((0, koa_bodyparser_1.default)())
            .use(this.router.routes())
            .use(this.router.allowedMethods());
        this.app.use(async (ctx) => {
            // the parsed body will store in ctx.request.body
            // if nothing was parsed, body will be an empty object {}
            ctx.body = ctx.request.body;
        });
        return this.app.listen(port, () => {
            handler();
        });
    }
}
exports.StacksRest = StacksRest;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9SZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQU1BLHlDQUltQjtBQUduQiw4Q0FBcUI7QUFDckIseURBQWdDO0FBQ2hDLG9FQUF1QztBQW9DdkMsTUFBYSxVQUFVO0lBYXBCLFlBQVksS0FBYTtRQUN0QixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQTtRQUNsQixJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksYUFBRyxFQUFFLENBQUE7UUFDcEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLGdCQUFNLEVBQUUsQ0FBQTtJQUM3QixDQUFDO0lBWkQsSUFBSSxXQUFXO1FBQ1osT0FBTztZQUNKLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRztZQUNiLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTTtZQUNuQixLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUs7U0FDbkIsQ0FBQTtJQUNKLENBQUM7SUFRRCxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQTJCO1FBQ2xDLE1BQU0sVUFBVSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUE7SUFDM0MsQ0FBQztJQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztPQW9CRztJQUNILEdBQUcsQ0FBQyxPQUFlLEVBQUUsT0FBMEI7O1FBQzVDLE9BQU8sR0FBRyxPQUFPLElBQUksRUFBRSxDQUFBO1FBQ3ZCLE9BQU8sQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDLEtBQUssSUFBSSxTQUFTLENBQUE7UUFDMUMsT0FBTyxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxJQUFJLFNBQVMsQ0FBQTtRQUN4QyxPQUFPLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxNQUFNLElBQUksU0FBUyxDQUFBO1FBRTVDLElBQUksT0FBTyxDQUFDLElBQUksS0FBSyxTQUFTO1lBQzNCLE9BQU8sQ0FBQyxNQUFNLEtBQUssU0FBUztZQUM1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SSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRTtZQUMvQixPQUFPLEVBQUUsQ0FBQTtRQUNaLENBQUMsQ0FBQyxDQUFBO0lBQ0wsQ0FBQztDQUNIO0FBelNELGdDQXlTQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gICBJTW9kZWwsXG4gICBJU3RhY2ssXG4gICBTdGFja09iamVjdFxufSBmcm9tICdAc3Bpa2VkcHVuY2gvc3RhY2tzJ1xuXG5pbXBvcnQgeyBcbiAgIGJ1aWxkRGV0YWlsZWRSZXNwb25zZSxcbiAgIGJ1aWxkRXJyb3JSZXNwb25zZSxcbiAgIGJ1aWxkTWluaW1hbFJlc3BvbnNlIFxufSBmcm9tICcuL1Jlc3BvbnNlJ1xuXG5pbXBvcnQgeyBTZXJ2ZXIgfSBmcm9tICdodHRwJ1xuaW1wb3J0IEtvYSBmcm9tICdrb2EnXG5pbXBvcnQgUm91dGVyIGZyb20gJ0Brb2Evcm91dGVyJ1xuaW1wb3J0IGJvZHlwYXJzZXIgZnJvbSAna29hLWJvZHlwYXJzZXInXG5cbmV4cG9ydCB0eXBlIFJlc3RDb250ZXh0ID0ge1xuICAgYXBwOiBLb2FcbiAgIHJvdXRlcjogUm91dGVyXG4gICBzdGFjazogSVN0YWNrXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVJlc3RNaWRkbGV3YXJlIHtcbiAgIHNldHVwKGNvbnRleHQ6IFJlc3RDb250ZXh0KTogUHJvbWlzZTx2b2lkPlxufVxuXG5leHBvcnQgdHlwZSBSZXF1ZXN0SGFuZGxlciA9IChjdHg6IEtvYS5Db250ZXh0LCByZXN0OiBSZXN0Q29udGV4dCwgbmV4dDogS29hLk5leHQpID0+IFByb21pc2U8dm9pZD5cbmV4cG9ydCB0eXBlIExpc3RlbkhhbmRsZXIgPSAoKSA9PiB2b2lkXG5cbmV4cG9ydCB0eXBlIEdldFJlcXVlc3RPcHRpb25zID0ge1xuICAgbW9kZWw/OiBJTW9kZWxcbiAgIG1hbnk/OiBSZXF1ZXN0SGFuZGxlciB8IHN0cmluZ1tdXG4gICBzaW5nbGU/OiBSZXF1ZXN0SGFuZGxlciB8IHN0cmluZ1tdXG59XG5cbmV4cG9ydCB0eXBlIFB1dFJlcXVlc3RPcHRpb25zID0ge1xuICAgbW9kZWw/OiBJTW9kZWxcbiAgIGhhbmRsZXI/OiBSZXF1ZXN0SGFuZGxlclxufVxuXG5leHBvcnQgdHlwZSBQb3N0UmVxdWVzdE9wdGlvbnMgPSB7XG4gICBtb2RlbD86IElNb2RlbFxuICAgaGFuZGxlcj86IFJlcXVlc3RIYW5kbGVyXG59XG5cbmV4cG9ydCB0eXBlIERlbGV0ZVJlcXVlc3RPcHRpb25zID0ge1xuICAgbW9kZWw/OiBJTW9kZWxcbiAgIGhhbmRsZXI/OiBSZXF1ZXN0SGFuZGxlclxufVxuXG5leHBvcnQgY2xhc3MgU3RhY2tzUmVzdCB7XG4gICByZWFkb25seSBhcHA6IEtvYVxuICAgcmVhZG9ubHkgcm91dGVyOiBSb3V0ZXJcbiAgIHJlYWRvbmx5IHN0YWNrOiBJU3RhY2tcblxuICAgZ2V0IHJlc3RDb250ZXh0KCk6IFJlc3RDb250ZXh0IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgICBhcHA6IHRoaXMuYXBwLFxuICAgICAgICAgcm91dGVyOiB0aGlzLnJvdXRlcixcbiAgICAgICAgIHN0YWNrOiB0aGlzLnN0YWNrXG4gICAgICB9XG4gICB9XG5cbiAgIGNvbnN0cnVjdG9yKHN0YWNrOiBJU3RhY2spIHtcbiAgICAgIHRoaXMuc3RhY2sgPSBzdGFja1xuICAgICAgdGhpcy5hcHAgPSBuZXcgS29hKClcbiAgICAgIHRoaXMucm91dGVyID0gbmV3IFJvdXRlcigpXG4gICB9XG5cbiAgIGFzeW5jIHVzZShtaWRkbGV3YXJlOiBJUmVzdE1pZGRsZXdhcmUpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgIGF3YWl0IG1pZGRsZXdhcmUuc2V0dXAodGhpcy5yZXN0Q29udGV4dClcbiAgIH1cblxuICAgLyoqXG4gICAgKiBEZWZpbmVzIGEgR0VUIFJFU1QgZW5kcG9pbnQuXG4gICAgKiBcbiAgICAqIG1hbnkgeyBmdW5jdGlvbiB8IHN0cmluZ1tdIH1cbiAgICAqICAgIElmIG1hbnkgaXMgYSBmdW5jdGlvbiwgaXQgZGVmaW5lcyB0aGUgbWFueSBoYW5kbGVyIChjdHgpID0+IFByb21pc2U8dm9pZD5cbiAgICAqICAgIElmIG1hbnkgaXMgYSBzdHJpbmdbXSwgaXQgZGVmaW5lcyB0aGUgcHJvcGVydGllcyB0aGF0IHdpbGwgYmUgcmV0dXJuZWQgZnJvbVxuICAgICogICAgdGhlIHJldGVyaWV2ZWQgb2JqZWN0LlxuICAgICogXG4gICAgKiBzaW5nbGUgeyBmdW5jdGlvbiB8IHN0cmluZ1tdIH1cbiAgICAqICAgIElmIHNpbmdsZSBpcyBhIGZ1bmN0aW9uLCBpdCBoYW5kbGVzIHRoZSBSRVNUIGNhbGwgdGhhdCBpbmNsdWRlcyB0aGUgJ2lkJy5cbiAgICAqICAgIElmIHNpbmdsZSBpcyBhIHN0cmluZ1tdLCBpdCB3aWxsIGJlIGRlZmF1bHQgYmVoYXZpb3IsIGJ1dCB3aWxsIG9ubHkgcmV0dXJuIFxuICAgICogICAgdGhlIHByb3BlcnRpZXMgaW4gdGhlIHN0cmluZ1tdLlxuICAgICogXG4gICAgKiBtb2RlbCB7IElNb2RlbCB9XG4gICAgKiAgICBUaGUgTW9kZWxcbiAgICAqIFxuICAgICogXG4gICAgKiBcbiAgICAqIEBwYXJhbSB1cmxQYXRoIFRoZSBVUkwgcGF0aFxuICAgICogQHBhcmFtIG9wdGlvbnMgVGhlIG9wdGlvbnMgZm9yIEdFVFxuICAgICovXG4gICBnZXQodXJsUGF0aDogc3RyaW5nLCBvcHRpb25zOiBHZXRSZXF1ZXN0T3B0aW9ucyk6IHZvaWQge1xuICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge31cbiAgICAgIG9wdGlvbnMubW9kZWwgPSBvcHRpb25zLm1vZGVsIHx8IHVuZGVmaW5lZFxuICAgICAgb3B0aW9ucy5tYW55ID0gb3B0aW9ucy5tYW55IHx8IHVuZGVmaW5lZFxuICAgICAgb3B0aW9ucy5zaW5nbGUgPSBvcHRpb25zLnNpbmdsZSB8fCB1bmRlZmluZWRcblxuICAgICAgaWYgKG9wdGlvbnMubWFueSA9PT0gdW5kZWZpbmVkICYmXG4gICAgICAgICBvcHRpb25zLnNpbmdsZSA9PT0gdW5kZWZpbmVkICYmXG4gICAgICAgICBvcHRpb25zLm1vZGVsID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgIHRocm93IG5ldyBFcnJvcihgV2hlbiBkZWZpbmluZyB0aGUgJHt1cmxQYXRofSBHRVQgZW5kcG9pbnQsIHRoZSAnbW9kZWwnIG9yIGF0IGxlYXN0IG9uZSBvZiB0aGUgJ2RldGFpbGVkJyBvciAnbWluaW1hbCcgaGFuZGxlcnMgbXVzdCBiZSBkZWZpbmVkLmApXG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5tYW55ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICB0aGlzLnJvdXRlci5nZXQodXJsUGF0aCwgYXN5bmMgKGN0eDogS29hLkNvbnRleHQsIG5leHQ6IEtvYS5OZXh0KSA9PiB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIG9wdGlvbnMubWFueSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBXaGVuIGRlZmluaW5nIHRoZSBHRVQgZW5kcG9pbnQgZm9yICR7dXJsUGF0aH0sIHRoZSAnbWluaW1hbCcgcHJvcGVydHkgaXMgZXhwZWN0ZWQgdG8gYmUgYSBSZXF1ZXN0SGFuZGxlci5gKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBhd2FpdCBvcHRpb25zLm1hbnkoY3R4LCB0aGlzLnJlc3RDb250ZXh0LCBuZXh0KVxuICAgICAgICAgfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICBsZXQgcHJvcHMgPSBuZXcgQXJyYXk8c3RyaW5nPigpXG5cbiAgICAgICAgIGlmIChvcHRpb25zLm1vZGVsID09IG51bGwgfHwgb3B0aW9ucy5tb2RlbCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFdoZW4gZGVmaW5pbmcgdGhlICR7dXJsUGF0aH0gR0VUIGVuZHBvaW50LCB0aGUgTW9kZWwgbXVzdCBiZSBwcm92aWRlZGApXG4gICAgICAgICB9XG5cbiAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KG9wdGlvbnMubWFueSkpIHtcbiAgICAgICAgICAgIHByb3BzLnB1c2goLi4ub3B0aW9ucy5tYW55KVxuICAgICAgICAgfVxuXG4gICAgICAgICB0aGlzLnJvdXRlci5nZXQodXJsUGF0aCwgYXN5bmMgKGN0eDogS29hLkNvbnRleHQsIG5leHQ6IEtvYS5OZXh0KSA9PiB7XG4gICAgICAgICAgICBsZXQgbW9kZWwgPSBvcHRpb25zLm1vZGVsXG5cbiAgICAgICAgICAgIGxldCBxdWVyeSA9IGN0eC5yZXF1ZXN0LnF1ZXJ5XG4gICAgICAgICAgICBsZXQgY3Vyc29yID0gcXVlcnkucGFnZSB8fCAnJ1xuICAgICAgICAgICAgbGV0IGxpbWl0ID0gcXVlcnkubGltaXQgfHwgMTAwXG5cbiAgICAgICAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgICAgICAgbGV0IHJlc3VsdHMgPSBhd2FpdCBtb2RlbC5nZXRNYW55PFN0YWNrT2JqZWN0Pih7IGN1cnNvciwgbGltaXQgfSlcblxuICAgICAgICAgICAgY3R4LmJvZHkgPSBidWlsZE1pbmltYWxSZXNwb25zZShyZXN1bHRzLml0ZW1zLCBwcm9wcylcbiAgICAgICAgICAgIGN0eC5zdGF0dXMgPSAyMDBcbiAgICAgICAgIH0pXG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5zaW5nbGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgIHRoaXMucm91dGVyLmdldChgJHt1cmxQYXRofS86aWRgLCBhc3luYyAoY3R4OiBLb2EuQ29udGV4dCwgbmV4dDogS29hLk5leHQpID0+IHtcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5zaW5nbGUgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgV2hlbiBkZWZpbmluZyB0aGUgR0VUIGVuZHBvaW50IGZvciAke3VybFBhdGh9LCB0aGUgJ2RldGFpbGVkJyBwcm9wZXJ0eSBpcyBleHBlY3RlZCB0byBiZSBhIFJlcXVlc3RIYW5kbGVyLmApXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGF3YWl0IG9wdGlvbnMuc2luZ2xlKGN0eCwgdGhpcy5yZXN0Q29udGV4dCwgbmV4dClcbiAgICAgICAgIH0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICAgbGV0IHByb3BzID0gbmV3IEFycmF5PHN0cmluZz4oKVxuXG4gICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShvcHRpb25zLnNpbmdsZSkpIHtcbiAgICAgICAgICAgIGlmIChvcHRpb25zLm1vZGVsID09IG51bGwpIHtcbiAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgV2hlbiBkZWZpbmluZyB0aGUgJHt1cmxQYXRofSBHRVQgZW5kcG9pbnQsIHdoZW4gc3VwcGx5aW5nIGEgc3RyaW5nIEFycmF5IGZvciB0aGUgJ2RldGFpbGVkJyBwcm9wZXJ0eSwgdGhlIE1vZGVsIG11c3QgYmUgYWxzbyBiZSBwcm92aWRlZGApXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHByb3BzLnB1c2goLi4ub3B0aW9ucy5zaW5nbGUpXG4gICAgICAgICB9IGVsc2UgaWYob3B0aW9ucy5zaW5nbGUgPT0gbnVsbCkge1xuICAgICAgICAgICAgLy8gRGVmYXVsdCBpcyB0byB1c2UgdGhlIE1vZGVsJ3MgcHJvcGVydGllc1xuICAgICAgICAgICAgLy9AdHMtaWdub3JlXG4gICAgICAgICAgICBmb3IobGV0IG1lbWJlciBvZiBvcHRpb25zLm1vZGVsPy5tZW1iZXJzKSB7XG4gICAgICAgICAgICAgICBwcm9wcy5wdXNoKG1lbWJlci5uYW1lKVxuICAgICAgICAgICAgfVxuICAgICAgICAgfVxuXG4gICAgICAgICB0aGlzLnJvdXRlci5nZXQoYCR7dXJsUGF0aH0vOmlkYCwgYXN5bmMgKGN0eDogS29hLkNvbnRleHQsIG5leHQ6IEtvYS5OZXh0KSA9PiB7XG4gICAgICAgICAgICBsZXQgbW9kZWwgPSBvcHRpb25zLm1vZGVsIGFzIElNb2RlbFxuXG4gICAgICAgICAgICBsZXQgaWQgPSBjdHgucGFyYW1zLmlkXG5cbiAgICAgICAgICAgIGxldCByZXN1bHQgPSBhd2FpdCBtb2RlbC5nZXQ8U3RhY2tPYmplY3Q+KGlkKVxuXG4gICAgICAgICAgICBpZihyZXN1bHQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgY3R4LnN0YXR1cyA9IDQwMFxuICAgICAgICAgICAgICAgY3R4LmJvZHkgPSB7IG1lc3NhZ2U6IGBObyBPYmplY3Qgd2l0aCBpZCAke2lkfSBleGlzdHMgYH1cbiAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodHlwZW9mIG9wdGlvbnMuc2luZ2xlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAvLyBTaG91bGQgbmV2ZXIgZ2V0IGhlcmVcbiAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgV2hlbiBkZWZpbmluZyB0aGUgJHt1cmxQYXRofSBHRVQgZW5kb2ludCwgdGhlICdkZXRhaWxlZCcgcHJvcGVydHkgaXMgZXhwZWN0ZWQgdG8gYmUgYSBzdHJpbmcgQXJyYXksIHJlY2VpdmVkIGEgJ2Z1bmN0aW9uJyBpbnN0ZWFkLmApXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGN0eC5ib2R5ID0gYnVpbGREZXRhaWxlZFJlc3BvbnNlKHJlc3VsdCwgcHJvcHMpXG4gICAgICAgICAgICBjdHguc3RhdHVzID0gMjAwXG4gICAgICAgICB9KVxuICAgICAgfVxuICAgfVxuXG4gICAvKipcbiAgICAqIERlZmluZXMgYSBQVVQgZW5kcG9pbnRcbiAgICAqIFxuICAgICogQHBhcmFtIHVybFBhdGggVGhlIFVSTCBwYXRoXG4gICAgKiBAcGFyYW0gb3B0aW9ucyBUaGUgb3B0aW9ucyB0aGF0IGRlZmluZSB0aGUgZW5kcG9pbnRcbiAgICAqL1xuICAgcHV0KHVybFBhdGg6IHN0cmluZywgb3B0aW9uczogUHV0UmVxdWVzdE9wdGlvbnMpOiB2b2lkIHtcbiAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9XG4gICAgICBvcHRpb25zLm1vZGVsID0gb3B0aW9ucy5tb2RlbCB8fCB1bmRlZmluZWRcbiAgICAgIG9wdGlvbnMuaGFuZGxlciA9IG9wdGlvbnMuaGFuZGxlciB8fCB1bmRlZmluZWRcblxuICAgICAgaWYob3B0aW9ucy5oYW5kbGVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgIHRoaXMucm91dGVyLnB1dCh1cmxQYXRoLCBhc3luYyAoY3R4OiBLb2EuQ29udGV4dCwgbmV4dDogS29hLk5leHQpID0+IHtcbiAgICAgICAgICAgIGlmKG9wdGlvbnMuaGFuZGxlciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFdoZW4gZGVmaW5pbmcgdGhlICR7dXJsUGF0aH0gUFVUIGVuZG9pbnQsIHRoZSAnaGFuZGxlcicgcHJvcGVydHkgaXMgZXhwZWN0ZWQgdG8gYmUgYSBmdW5jdGlvbiwgcmVjZWl2ZWQgYSAndW5kZWZpbmVkJyBpbnN0ZWFkLmApXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGF3YWl0IG9wdGlvbnMuaGFuZGxlcihjdHgsIHRoaXMucmVzdENvbnRleHQsIG5leHQpXG4gICAgICAgICB9KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgIGlmKG9wdGlvbnMubW9kZWwgPT0gbnVsbCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBXaGVuIGRlZmluaW5nIHRoZSAke3VybFBhdGh9IFBVVCByZXF1ZXN0LCB0aGUgJ21vZGVsJyBwcm9wZXJ0eSBpcyBleHBlY3RlZCB3aGVuIGEgJ2hhbmRsZXInIGZ1bmN0aW9uIGlzIG5vdCBwcm92aWRlZC5gKVxuICAgICAgICAgfVxuXG4gICAgICAgICB0aGlzLnJvdXRlci5wdXQoYCR7dXJsUGF0aH0vOmlkYCwgYXN5bmMgKGN0eDogS29hLkNvbnRleHQpID0+IHtcbiAgICAgICAgICAgIGxldCBib2R5ID0gY3R4LnJlcXVlc3QuYm9keVxuXG4gICAgICAgICAgICBpZiAoIWJvZHkpIHtcbiAgICAgICAgICAgICAgIGN0eC50aHJvdyg0MDAsIGBBIGJvZHkgbXVzdCBiZSBwcm92aWRlZGApXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBpZCA9IGN0eC5wYXJhbXMuaWRcbiAgICAgICAgICAgIGxldCBtb2RlbCA9IG9wdGlvbnMubW9kZWwgYXMgSU1vZGVsXG5cbiAgICAgICAgICAgIGxldCBvYmogPSBhd2FpdCBtb2RlbC5nZXQoaWQpXG5cbiAgICAgICAgICAgIGlmKG9iaiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICBjdHgudGhyb3coNDAwLCB7IG1lc3NhZ2U6IGBObyBPYmplY3Qgd2l0aCBpZCAke2lkfSBleGlzdHMgYH0pXG4gICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZm9yKGxldCBwcm9wIG9mIE9iamVjdC5rZXlzKGJvZHkpKSB7XG4gICAgICAgICAgICAgICBvYmpbcHJvcF0gPSBib2R5W3Byb3BdXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCB2YWxpZCA9IGF3YWl0IG1vZGVsLnZhbGlkYXRlKG9iailcblxuICAgICAgICAgICAgaWYoIXZhbGlkLnN1Y2Nlc3MpIHtcbiAgICAgICAgICAgICAgIGxldCBlcnJvcnMgPSBuZXcgQXJyYXk8RXJyb3I+KClcbiAgICAgICAgICAgICAgIGZvcihsZXQgcmVzdWx0IG9mIHZhbGlkLnJlc3VsdHMpIHtcbiAgICAgICAgICAgICAgICAgIGlmKHJlc3VsdC5zdWNjZXNzID09IGZhbHNlICYmIHJlc3VsdC5lcnJvciAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICBlcnJvcnMucHVzaChyZXN1bHQuZXJyb3IpXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgIGN0eC50aHJvdyg0MDAsIGJ1aWxkRXJyb3JSZXNwb25zZShlcnJvcnMpKVxuICAgICAgICAgICAgICAgcmV0dXJuICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYXdhaXQgbW9kZWwuc2F2ZShvYmopXG5cbiAgICAgICAgICAgIGxldCBwcm9wcyA9IG5ldyBBcnJheTxzdHJpbmc+KClcblxuICAgICAgICAgICAgZm9yKGxldCBtZW1iZXIgb2YgbW9kZWwubWVtYmVycykge1xuICAgICAgICAgICAgICAgcHJvcHMucHVzaChtZW1iZXIubmFtZSlcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY3R4LmJvZHkgPSBidWlsZERldGFpbGVkUmVzcG9uc2Uob2JqLCBwcm9wcylcbiAgICAgICAgICAgIGN0eC5zdGF0dXMgPSAyMDBcbiAgICAgICAgIH0pXG4gICAgICB9XG4gICB9XG5cbiAgIHBvc3QodXJsUGF0aDogc3RyaW5nLCBvcHRpb25zOiBQb3N0UmVxdWVzdE9wdGlvbnMpOiB2b2lkIHtcbiAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9XG4gICAgICBvcHRpb25zLm1vZGVsID0gb3B0aW9ucy5tb2RlbCB8fCB1bmRlZmluZWRcbiAgICAgIG9wdGlvbnMuaGFuZGxlciA9IG9wdGlvbnMuaGFuZGxlciB8fCB1bmRlZmluZWRcblxuICAgICAgaWYob3B0aW9ucy5oYW5kbGVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgIHRoaXMucm91dGVyLnBvc3QodXJsUGF0aCwgYXN5bmMgKGN0eDogS29hLkNvbnRleHQsIG5leHQ6IEtvYS5OZXh0KSA9PiB7XG4gICAgICAgICAgICBpZihvcHRpb25zLmhhbmRsZXIgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgYXdhaXQgb3B0aW9ucy5oYW5kbGVyKGN0eCwgdGhpcy5yZXN0Q29udGV4dCwgbmV4dClcbiAgICAgICAgICAgIH1cbiAgICAgICAgIH0pXG5cbiAgICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBpZihvcHRpb25zLm1vZGVsID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgIHRocm93IG5ldyBFcnJvcihgV2hlbiBkZWZpbmluZyB0aGUgUE9TVCAke3VybFBhdGh9IGVuZHBvaW50LCAnbW9kZWwnIG11c3QgYmUgZGVmaW5lZCBpZiBhIGhhbmRsZXIgaXNuJ3QgcHJvdmlkZWRgKVxuICAgICAgfVxuXG4gICAgICB0aGlzLnJvdXRlci5wb3N0KHVybFBhdGgsIGFzeW5jIChjdHg6IEtvYS5Db250ZXh0LCBuZXh0OiBLb2EuTmV4dCkgPT4ge1xuICAgICAgICAgbGV0IG1vZGVsID0gb3B0aW9ucy5tb2RlbCBhcyBJTW9kZWxcbiAgICAgICAgIGxldCBib2R5ID0gY3R4LnJlcXVlc3QuYm9keVxuXG4gICAgICAgICBsZXQgb2JqID0gYXdhaXQgbW9kZWwuY3JlYXRlKGJvZHkpXG4gICAgICAgICBhd2FpdCBtb2RlbC5zYXZlKG9iailcblxuICAgICAgICAgY3R4LmJvZHkgPSBidWlsZERldGFpbGVkUmVzcG9uc2Uob2JqKVxuICAgICAgICAgY3R4LnN0YXR1cyA9IDIwMFxuICAgICAgfSlcbiAgIH1cblxuICAgZGVsKHVybFBhdGg6IHN0cmluZywgb3B0aW9uczogRGVsZXRlUmVxdWVzdE9wdGlvbnMpOiB2b2lkIHtcbiAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9XG4gICAgICBvcHRpb25zLm1vZGVsID0gb3B0aW9ucy5tb2RlbCB8fCB1bmRlZmluZWRcbiAgICAgIG9wdGlvbnMuaGFuZGxlciA9IG9wdGlvbnMuaGFuZGxlciB8fCB1bmRlZmluZWRcblxuICAgICAgaWYob3B0aW9ucy5oYW5kbGVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgIHRoaXMucm91dGVyLmRlbGV0ZSh1cmxQYXRoLCBhc3luYyAoY3R4OiBLb2EuQ29udGV4dCwgbmV4dDogS29hLk5leHQpID0+IHtcbiAgICAgICAgICAgIGlmKG9wdGlvbnMuaGFuZGxlciAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICBhd2FpdCBvcHRpb25zLmhhbmRsZXIoY3R4LCB0aGlzLnJlc3RDb250ZXh0LCBuZXh0KVxuICAgICAgICAgICAgfVxuICAgICAgICAgfSlcblxuICAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGlmKG9wdGlvbnMubW9kZWwgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBXaGVuIGRlZmluaW5nIHRoZSBERUxFVEUgJHt1cmxQYXRofSBlbmRwb2ludCwgJ21vZGVsJyBtdXN0IGJlIGRlZmluZWQgaWYgYSBoYW5kbGVyIGlzbid0IHByb3ZpZGVkYClcbiAgICAgIH1cblxuICAgICAgdGhpcy5yb3V0ZXIuZGVsZXRlKGAke3VybFBhdGh9LzppZGAsIGFzeW5jIChjdHg6IEtvYS5Db250ZXh0LCBuZXh0OiBLb2EuTmV4dCkgPT4ge1xuICAgICAgICAgbGV0IG1vZGVsID0gb3B0aW9ucy5tb2RlbCBhcyBJTW9kZWxcbiAgICAgICAgIGxldCBpZCA9IGN0eC5wYXJhbXMuaWRcblxuICAgICAgICAgbGV0IG9iaiA9IGF3YWl0IG1vZGVsLmdldChpZClcblxuICAgICAgICAgaWYob2JqID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGN0eC5zdGF0dXMgPSAyMDBcbiAgICAgICAgICAgIGN0eC5ib2R5ID0gdW5kZWZpbmVkXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgIH1cblxuICAgICAgICAgYXdhaXQgbW9kZWwuZGVsZXRlKG9iailcblxuICAgICAgICAgY3R4LnN0YXR1cyA9IDIwMFxuICAgICAgICAgY3R4LmJvZHkgPSBidWlsZERldGFpbGVkUmVzcG9uc2Uob2JqKVxuICAgICAgfSlcbiAgIH1cblxuICAgbGlzdGVuKHBvcnQ6IG51bWJlciA9IDM0MDEsIGhhbmRsZXI6IExpc3RlbkhhbmRsZXIgPSAoKSA9PiB7fSk6IFNlcnZlciB7XG4gICAgICB0aGlzLmFwcFxuICAgICAgICAgLnVzZShib2R5cGFyc2VyKCkpXG4gICAgICAgICAudXNlKHRoaXMucm91dGVyLnJvdXRlcygpKVxuICAgICAgICAgLnVzZSh0aGlzLnJvdXRlci5hbGxvd2VkTWV0aG9kcygpKVxuXG4gICAgICB0aGlzLmFwcC51c2UoYXN5bmMgKGN0eDogS29hLkNvbnRleHQpID0+IHtcbiAgICAgICAgIC8vIHRoZSBwYXJzZWQgYm9keSB3aWxsIHN0b3JlIGluIGN0eC5yZXF1ZXN0LmJvZHlcbiAgICAgICAgIC8vIGlmIG5vdGhpbmcgd2FzIHBhcnNlZCwgYm9keSB3aWxsIGJlIGFuIGVtcHR5IG9iamVjdCB7fVxuICAgICAgICAgY3R4LmJvZHkgPSBjdHgucmVxdWVzdC5ib2R5XG4gICAgICB9KVxuXG4gICAgICByZXR1cm4gdGhpcy5hcHAubGlzdGVuKHBvcnQsICgpID0+IHtcbiAgICAgICAgIGhhbmRsZXIoKVxuICAgICAgfSlcbiAgIH1cbn0iXX0=