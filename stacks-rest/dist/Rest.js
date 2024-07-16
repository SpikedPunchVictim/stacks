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
    get restContext() {
        return {
            app: this.app,
            router: this.router,
            stack: this.stack
        };
    }
    constructor(stack) {
        this.stack = stack;
        this.app = new koa_1.default();
        this.router = new router_1.default();
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
                if (body == null || typeof body !== 'object') {
                    ctx.throw(400, `A body must be provided`);
                    return;
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
            if (!body) {
                ctx.throw(400, `A body must be provided`);
                return;
            }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9SZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQU9BLHlDQUltQjtBQUduQiw4Q0FBcUI7QUFDckIseURBQWdDO0FBQ2hDLG9FQUF1QztBQW9DdkMsTUFBYSxVQUFVO0lBS3BCLElBQUksV0FBVztRQUNaLE9BQU87WUFDSixHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUc7WUFDYixNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU07WUFDbkIsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO1NBQ25CLENBQUE7SUFDSixDQUFDO0lBRUQsWUFBWSxLQUFhO1FBQ3RCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFBO1FBQ2xCLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxhQUFHLEVBQUUsQ0FBQTtRQUNwQixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksZ0JBQU0sRUFBRSxDQUFBO0lBQzdCLENBQUM7SUFFRCxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQTJCO1FBQ2xDLE1BQU0sVUFBVSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUE7SUFDM0MsQ0FBQztJQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztPQW9CRztJQUNILEdBQUcsQ0FBQyxPQUFlLEVBQUUsT0FBMEI7O1FBQzVDLE9BQU8sR0FBRyxPQUFPLElBQUksRUFBRSxDQUFBO1FBQ3ZCLE9BQU8sQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDLEtBQUssSUFBSSxTQUFTLENBQUE7UUFDMUMsT0FBTyxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxJQUFJLFNBQVMsQ0FBQTtRQUN4QyxPQUFPLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxNQUFNLElBQUksU0FBUyxDQUFBO1FBRTVDLElBQUksT0FBTyxDQUFDLElBQUksS0FBSyxTQUFTO1lBQzNCLE9BQU8sQ0FBQyxNQUFNLEtBQUssU0FBUztZQUM1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RyxDQUFDLElBQUksR0FBRyxJQUFBLGdDQUFxQixFQUFDLEdBQUcsQ0FBQyxDQUFBO1FBQ3hDLENBQUMsQ0FBQyxDQUFBO0lBQ0wsQ0FBQztJQUVELE1BQU0sQ0FBQyxPQUFlLElBQUksRUFBRSxVQUF5QixHQUFHLEVBQUUsR0FBRSxDQUFDO1FBQzFELElBQUksQ0FBQyxHQUFHO2FBQ0osR0FBRyxDQUFDLElBQUEsd0JBQVUsR0FBRSxDQUFDO2FBQ2pCLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO2FBQ3pCLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUE7UUFFckMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLEdBQWdCLEVBQUUsRUFBRTtZQUNyQyxpREFBaUQ7WUFDakQseURBQXlEO1lBQ3pELEdBQUcsQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUE7UUFDOUIsQ0FBQyxDQUFDLENBQUE7UUFFRixPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUU7WUFDL0IsT0FBTyxFQUFFLENBQUE7UUFDWixDQUFDLENBQUMsQ0FBQTtJQUNMLENBQUM7Q0FDSDtBQS9TRCxnQ0ErU0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICAgSU1vZGVsLFxuICAgSVN0YWNrLFxuICAgT2JqZWN0Q3JlYXRlUGFyYW1zLFxuICAgU3RhY2tPYmplY3Rcbn0gZnJvbSAnQHNwaWtlZHB1bmNoL3N0YWNrcydcblxuaW1wb3J0IHsgXG4gICBidWlsZERldGFpbGVkUmVzcG9uc2UsXG4gICBidWlsZEVycm9yUmVzcG9uc2UsXG4gICBidWlsZE1pbmltYWxSZXNwb25zZSBcbn0gZnJvbSAnLi9SZXNwb25zZSdcblxuaW1wb3J0IHsgU2VydmVyIH0gZnJvbSAnaHR0cCdcbmltcG9ydCBLb2EgZnJvbSAna29hJ1xuaW1wb3J0IFJvdXRlciBmcm9tICdAa29hL3JvdXRlcidcbmltcG9ydCBib2R5cGFyc2VyIGZyb20gJ2tvYS1ib2R5cGFyc2VyJ1xuXG5leHBvcnQgdHlwZSBSZXN0Q29udGV4dCA9IHtcbiAgIGFwcDogS29hXG4gICByb3V0ZXI6IFJvdXRlclxuICAgc3RhY2s6IElTdGFja1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIElSZXN0TWlkZGxld2FyZSB7XG4gICBzZXR1cChjb250ZXh0OiBSZXN0Q29udGV4dCk6IFByb21pc2U8dm9pZD5cbn1cblxuZXhwb3J0IHR5cGUgUmVxdWVzdEhhbmRsZXIgPSAoY3R4OiBLb2EuQ29udGV4dCwgcmVzdDogUmVzdENvbnRleHQsIG5leHQ6IEtvYS5OZXh0KSA9PiBQcm9taXNlPHZvaWQ+XG5leHBvcnQgdHlwZSBMaXN0ZW5IYW5kbGVyID0gKCkgPT4gdm9pZFxuXG5leHBvcnQgdHlwZSBHZXRSZXF1ZXN0T3B0aW9ucyA9IHtcbiAgIG1vZGVsPzogSU1vZGVsXG4gICBtYW55PzogUmVxdWVzdEhhbmRsZXIgfCBzdHJpbmdbXVxuICAgc2luZ2xlPzogUmVxdWVzdEhhbmRsZXIgfCBzdHJpbmdbXVxufVxuXG5leHBvcnQgdHlwZSBQdXRSZXF1ZXN0T3B0aW9ucyA9IHtcbiAgIG1vZGVsPzogSU1vZGVsXG4gICBoYW5kbGVyPzogUmVxdWVzdEhhbmRsZXJcbn1cblxuZXhwb3J0IHR5cGUgUG9zdFJlcXVlc3RPcHRpb25zID0ge1xuICAgbW9kZWw/OiBJTW9kZWxcbiAgIGhhbmRsZXI/OiBSZXF1ZXN0SGFuZGxlclxufVxuXG5leHBvcnQgdHlwZSBEZWxldGVSZXF1ZXN0T3B0aW9ucyA9IHtcbiAgIG1vZGVsPzogSU1vZGVsXG4gICBoYW5kbGVyPzogUmVxdWVzdEhhbmRsZXJcbn1cblxuZXhwb3J0IGNsYXNzIFN0YWNrc1Jlc3Qge1xuICAgcmVhZG9ubHkgYXBwOiBLb2FcbiAgIHJlYWRvbmx5IHJvdXRlcjogUm91dGVyXG4gICByZWFkb25seSBzdGFjazogSVN0YWNrXG5cbiAgIGdldCByZXN0Q29udGV4dCgpOiBSZXN0Q29udGV4dCB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAgYXBwOiB0aGlzLmFwcCxcbiAgICAgICAgIHJvdXRlcjogdGhpcy5yb3V0ZXIsXG4gICAgICAgICBzdGFjazogdGhpcy5zdGFja1xuICAgICAgfVxuICAgfVxuXG4gICBjb25zdHJ1Y3RvcihzdGFjazogSVN0YWNrKSB7XG4gICAgICB0aGlzLnN0YWNrID0gc3RhY2tcbiAgICAgIHRoaXMuYXBwID0gbmV3IEtvYSgpXG4gICAgICB0aGlzLnJvdXRlciA9IG5ldyBSb3V0ZXIoKVxuICAgfVxuXG4gICBhc3luYyB1c2UobWlkZGxld2FyZTogSVJlc3RNaWRkbGV3YXJlKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICBhd2FpdCBtaWRkbGV3YXJlLnNldHVwKHRoaXMucmVzdENvbnRleHQpXG4gICB9XG5cbiAgIC8qKlxuICAgICogRGVmaW5lcyBhIEdFVCBSRVNUIGVuZHBvaW50LlxuICAgICogXG4gICAgKiBtYW55IHsgZnVuY3Rpb24gfCBzdHJpbmdbXSB9XG4gICAgKiAgICBJZiBtYW55IGlzIGEgZnVuY3Rpb24sIGl0IGRlZmluZXMgdGhlIG1hbnkgaGFuZGxlciAoY3R4KSA9PiBQcm9taXNlPHZvaWQ+XG4gICAgKiAgICBJZiBtYW55IGlzIGEgc3RyaW5nW10sIGl0IGRlZmluZXMgdGhlIHByb3BlcnRpZXMgdGhhdCB3aWxsIGJlIHJldHVybmVkIGZyb21cbiAgICAqICAgIHRoZSByZXRlcmlldmVkIG9iamVjdC5cbiAgICAqIFxuICAgICogc2luZ2xlIHsgZnVuY3Rpb24gfCBzdHJpbmdbXSB9XG4gICAgKiAgICBJZiBzaW5nbGUgaXMgYSBmdW5jdGlvbiwgaXQgaGFuZGxlcyB0aGUgUkVTVCBjYWxsIHRoYXQgaW5jbHVkZXMgdGhlICdpZCcuXG4gICAgKiAgICBJZiBzaW5nbGUgaXMgYSBzdHJpbmdbXSwgaXQgd2lsbCBiZSBkZWZhdWx0IGJlaGF2aW9yLCBidXQgd2lsbCBvbmx5IHJldHVybiBcbiAgICAqICAgIHRoZSBwcm9wZXJ0aWVzIGluIHRoZSBzdHJpbmdbXS5cbiAgICAqIFxuICAgICogbW9kZWwgeyBJTW9kZWwgfVxuICAgICogICAgVGhlIE1vZGVsXG4gICAgKiBcbiAgICAqIFxuICAgICogXG4gICAgKiBAcGFyYW0gdXJsUGF0aCBUaGUgVVJMIHBhdGhcbiAgICAqIEBwYXJhbSBvcHRpb25zIFRoZSBvcHRpb25zIGZvciBHRVRcbiAgICAqL1xuICAgZ2V0KHVybFBhdGg6IHN0cmluZywgb3B0aW9uczogR2V0UmVxdWVzdE9wdGlvbnMpOiB2b2lkIHtcbiAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9XG4gICAgICBvcHRpb25zLm1vZGVsID0gb3B0aW9ucy5tb2RlbCB8fCB1bmRlZmluZWRcbiAgICAgIG9wdGlvbnMubWFueSA9IG9wdGlvbnMubWFueSB8fCB1bmRlZmluZWRcbiAgICAgIG9wdGlvbnMuc2luZ2xlID0gb3B0aW9ucy5zaW5nbGUgfHwgdW5kZWZpbmVkXG5cbiAgICAgIGlmIChvcHRpb25zLm1hbnkgPT09IHVuZGVmaW5lZCAmJlxuICAgICAgICAgb3B0aW9ucy5zaW5nbGUgPT09IHVuZGVmaW5lZCAmJlxuICAgICAgICAgb3B0aW9ucy5tb2RlbCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFdoZW4gZGVmaW5pbmcgdGhlICR7dXJsUGF0aH0gR0VUIGVuZHBvaW50LCB0aGUgJ21vZGVsJyBvciBhdCBsZWFzdCBvbmUgb2YgdGhlICdkZXRhaWxlZCcgb3IgJ21pbmltYWwnIGhhbmRsZXJzIG11c3QgYmUgZGVmaW5lZC5gKVxuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIG9wdGlvbnMubWFueSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgdGhpcy5yb3V0ZXIuZ2V0KHVybFBhdGgsIGFzeW5jIChjdHg6IEtvYS5Db250ZXh0LCBuZXh0OiBLb2EuTmV4dCkgPT4ge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zLm1hbnkgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgV2hlbiBkZWZpbmluZyB0aGUgR0VUIGVuZHBvaW50IGZvciAke3VybFBhdGh9LCB0aGUgJ21pbmltYWwnIHByb3BlcnR5IGlzIGV4cGVjdGVkIHRvIGJlIGEgUmVxdWVzdEhhbmRsZXIuYClcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYXdhaXQgb3B0aW9ucy5tYW55KGN0eCwgdGhpcy5yZXN0Q29udGV4dCwgbmV4dClcbiAgICAgICAgIH0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICAgbGV0IHByb3BzID0gbmV3IEFycmF5PHN0cmluZz4oKVxuXG4gICAgICAgICBpZiAob3B0aW9ucy5tb2RlbCA9PSBudWxsIHx8IG9wdGlvbnMubW9kZWwgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBXaGVuIGRlZmluaW5nIHRoZSAke3VybFBhdGh9IEdFVCBlbmRwb2ludCwgdGhlIE1vZGVsIG11c3QgYmUgcHJvdmlkZWRgKVxuICAgICAgICAgfVxuXG4gICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShvcHRpb25zLm1hbnkpKSB7XG4gICAgICAgICAgICBwcm9wcy5wdXNoKC4uLm9wdGlvbnMubWFueSlcbiAgICAgICAgIH1cblxuICAgICAgICAgdGhpcy5yb3V0ZXIuZ2V0KHVybFBhdGgsIGFzeW5jIChjdHg6IEtvYS5Db250ZXh0LCBuZXh0OiBLb2EuTmV4dCkgPT4ge1xuICAgICAgICAgICAgbGV0IG1vZGVsID0gb3B0aW9ucy5tb2RlbFxuXG4gICAgICAgICAgICBsZXQgcXVlcnkgPSBjdHgucmVxdWVzdC5xdWVyeVxuICAgICAgICAgICAgbGV0IGN1cnNvciA9IHF1ZXJ5LnBhZ2UgfHwgJydcbiAgICAgICAgICAgIGxldCBsaW1pdCA9IHF1ZXJ5LmxpbWl0IHx8IDEwMFxuXG4gICAgICAgICAgICAvL0B0cy1pZ25vcmVcbiAgICAgICAgICAgIGxldCByZXN1bHRzID0gYXdhaXQgbW9kZWwuZ2V0TWFueTxTdGFja09iamVjdD4oeyBjdXJzb3IsIGxpbWl0IH0pXG5cbiAgICAgICAgICAgIGN0eC5ib2R5ID0gYnVpbGRNaW5pbWFsUmVzcG9uc2UocmVzdWx0cy5pdGVtcywgcHJvcHMpXG4gICAgICAgICAgICBjdHguc3RhdHVzID0gMjAwXG4gICAgICAgICB9KVxuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIG9wdGlvbnMuc2luZ2xlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICB0aGlzLnJvdXRlci5nZXQoYCR7dXJsUGF0aH0vOmlkYCwgYXN5bmMgKGN0eDogS29hLkNvbnRleHQsIG5leHQ6IEtvYS5OZXh0KSA9PiB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIG9wdGlvbnMuc2luZ2xlICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFdoZW4gZGVmaW5pbmcgdGhlIEdFVCBlbmRwb2ludCBmb3IgJHt1cmxQYXRofSwgdGhlICdkZXRhaWxlZCcgcHJvcGVydHkgaXMgZXhwZWN0ZWQgdG8gYmUgYSBSZXF1ZXN0SGFuZGxlci5gKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBhd2FpdCBvcHRpb25zLnNpbmdsZShjdHgsIHRoaXMucmVzdENvbnRleHQsIG5leHQpXG4gICAgICAgICB9KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgIGxldCBwcm9wcyA9IG5ldyBBcnJheTxzdHJpbmc+KClcblxuICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkob3B0aW9ucy5zaW5nbGUpKSB7XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5tb2RlbCA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFdoZW4gZGVmaW5pbmcgdGhlICR7dXJsUGF0aH0gR0VUIGVuZHBvaW50LCB3aGVuIHN1cHBseWluZyBhIHN0cmluZyBBcnJheSBmb3IgdGhlICdkZXRhaWxlZCcgcHJvcGVydHksIHRoZSBNb2RlbCBtdXN0IGJlIGFsc28gYmUgcHJvdmlkZWRgKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBwcm9wcy5wdXNoKC4uLm9wdGlvbnMuc2luZ2xlKVxuICAgICAgICAgfSBlbHNlIGlmKG9wdGlvbnMuc2luZ2xlID09IG51bGwpIHtcbiAgICAgICAgICAgIC8vIERlZmF1bHQgaXMgdG8gdXNlIHRoZSBNb2RlbCdzIHByb3BlcnRpZXNcbiAgICAgICAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgICAgICAgZm9yKGxldCBtZW1iZXIgb2Ygb3B0aW9ucy5tb2RlbD8ubWVtYmVycykge1xuICAgICAgICAgICAgICAgcHJvcHMucHVzaChtZW1iZXIubmFtZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgIH1cblxuICAgICAgICAgdGhpcy5yb3V0ZXIuZ2V0KGAke3VybFBhdGh9LzppZGAsIGFzeW5jIChjdHg6IEtvYS5Db250ZXh0LCBuZXh0OiBLb2EuTmV4dCkgPT4ge1xuICAgICAgICAgICAgbGV0IG1vZGVsID0gb3B0aW9ucy5tb2RlbCBhcyBJTW9kZWxcblxuICAgICAgICAgICAgbGV0IGlkID0gY3R4LnBhcmFtcy5pZFxuXG4gICAgICAgICAgICBsZXQgcmVzdWx0ID0gYXdhaXQgbW9kZWwuZ2V0PFN0YWNrT2JqZWN0PihpZClcblxuICAgICAgICAgICAgaWYocmVzdWx0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgIGN0eC5zdGF0dXMgPSA0MDBcbiAgICAgICAgICAgICAgIGN0eC5ib2R5ID0geyBtZXNzYWdlOiBgTm8gT2JqZWN0IHdpdGggaWQgJHtpZH0gZXhpc3RzIGB9XG4gICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zLnNpbmdsZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgLy8gU2hvdWxkIG5ldmVyIGdldCBoZXJlXG4gICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFdoZW4gZGVmaW5pbmcgdGhlICR7dXJsUGF0aH0gR0VUIGVuZG9pbnQsIHRoZSAnZGV0YWlsZWQnIHByb3BlcnR5IGlzIGV4cGVjdGVkIHRvIGJlIGEgc3RyaW5nIEFycmF5LCByZWNlaXZlZCBhICdmdW5jdGlvbicgaW5zdGVhZC5gKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjdHguYm9keSA9IGJ1aWxkRGV0YWlsZWRSZXNwb25zZShyZXN1bHQsIHByb3BzKVxuICAgICAgICAgICAgY3R4LnN0YXR1cyA9IDIwMFxuICAgICAgICAgfSlcbiAgICAgIH1cbiAgIH1cblxuICAgLyoqXG4gICAgKiBEZWZpbmVzIGEgUFVUIGVuZHBvaW50XG4gICAgKiBcbiAgICAqIEBwYXJhbSB1cmxQYXRoIFRoZSBVUkwgcGF0aFxuICAgICogQHBhcmFtIG9wdGlvbnMgVGhlIG9wdGlvbnMgdGhhdCBkZWZpbmUgdGhlIGVuZHBvaW50XG4gICAgKi9cbiAgIHB1dCh1cmxQYXRoOiBzdHJpbmcsIG9wdGlvbnM6IFB1dFJlcXVlc3RPcHRpb25zKTogdm9pZCB7XG4gICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fVxuICAgICAgb3B0aW9ucy5tb2RlbCA9IG9wdGlvbnMubW9kZWwgfHwgdW5kZWZpbmVkXG4gICAgICBvcHRpb25zLmhhbmRsZXIgPSBvcHRpb25zLmhhbmRsZXIgfHwgdW5kZWZpbmVkXG5cbiAgICAgIGlmKG9wdGlvbnMuaGFuZGxlciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICB0aGlzLnJvdXRlci5wdXQodXJsUGF0aCwgYXN5bmMgKGN0eDogS29hLkNvbnRleHQsIG5leHQ6IEtvYS5OZXh0KSA9PiB7XG4gICAgICAgICAgICBpZihvcHRpb25zLmhhbmRsZXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBXaGVuIGRlZmluaW5nIHRoZSAke3VybFBhdGh9IFBVVCBlbmRvaW50LCB0aGUgJ2hhbmRsZXInIHByb3BlcnR5IGlzIGV4cGVjdGVkIHRvIGJlIGEgZnVuY3Rpb24sIHJlY2VpdmVkIGEgJ3VuZGVmaW5lZCcgaW5zdGVhZC5gKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBhd2FpdCBvcHRpb25zLmhhbmRsZXIoY3R4LCB0aGlzLnJlc3RDb250ZXh0LCBuZXh0KVxuICAgICAgICAgfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICBpZihvcHRpb25zLm1vZGVsID09IG51bGwpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgV2hlbiBkZWZpbmluZyB0aGUgJHt1cmxQYXRofSBQVVQgcmVxdWVzdCwgdGhlICdtb2RlbCcgcHJvcGVydHkgaXMgZXhwZWN0ZWQgd2hlbiBhICdoYW5kbGVyJyBmdW5jdGlvbiBpcyBub3QgcHJvdmlkZWQuYClcbiAgICAgICAgIH1cblxuICAgICAgICAgdGhpcy5yb3V0ZXIucHV0KGAke3VybFBhdGh9LzppZGAsIGFzeW5jIChjdHg6IEtvYS5Db250ZXh0KSA9PiB7XG4gICAgICAgICAgICBsZXQgYm9keSA9IGN0eC5yZXF1ZXN0LmJvZHlcblxuICAgICAgICAgICAgaWYgKGJvZHkgPT0gbnVsbCB8fCB0eXBlb2YgYm9keSAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgIGN0eC50aHJvdyg0MDAsIGBBIGJvZHkgbXVzdCBiZSBwcm92aWRlZGApXG4gICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IGlkID0gY3R4LnBhcmFtcy5pZFxuICAgICAgICAgICAgbGV0IG1vZGVsID0gb3B0aW9ucy5tb2RlbCBhcyBJTW9kZWxcblxuICAgICAgICAgICAgbGV0IG9iaiA9IGF3YWl0IG1vZGVsLmdldChpZClcblxuICAgICAgICAgICAgaWYob2JqID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgIGN0eC50aHJvdyg0MDAsIHsgbWVzc2FnZTogYE5vIE9iamVjdCB3aXRoIGlkICR7aWR9IGV4aXN0cyBgfSlcbiAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IobGV0IHByb3Agb2YgT2JqZWN0LmtleXMoYm9keSkpIHtcbiAgICAgICAgICAgICAgIG9ialtwcm9wXSA9IGJvZHlbcHJvcF1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IHZhbGlkID0gYXdhaXQgbW9kZWwudmFsaWRhdGUob2JqKVxuXG4gICAgICAgICAgICBpZighdmFsaWQuc3VjY2Vzcykge1xuICAgICAgICAgICAgICAgbGV0IGVycm9ycyA9IG5ldyBBcnJheTxFcnJvcj4oKVxuICAgICAgICAgICAgICAgZm9yKGxldCByZXN1bHQgb2YgdmFsaWQucmVzdWx0cykge1xuICAgICAgICAgICAgICAgICAgaWYocmVzdWx0LnN1Y2Nlc3MgPT0gZmFsc2UgJiYgcmVzdWx0LmVycm9yICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgIGVycm9ycy5wdXNoKHJlc3VsdC5lcnJvcilcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgY3R4LnRocm93KDQwMCwgYnVpbGRFcnJvclJlc3BvbnNlKGVycm9ycykpXG4gICAgICAgICAgICAgICByZXR1cm4gICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBhd2FpdCBtb2RlbC5zYXZlKG9iailcblxuICAgICAgICAgICAgbGV0IHByb3BzID0gbmV3IEFycmF5PHN0cmluZz4oKVxuXG4gICAgICAgICAgICBmb3IobGV0IG1lbWJlciBvZiBtb2RlbC5tZW1iZXJzKSB7XG4gICAgICAgICAgICAgICBwcm9wcy5wdXNoKG1lbWJlci5uYW1lKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjdHguYm9keSA9IGJ1aWxkRGV0YWlsZWRSZXNwb25zZShvYmosIHByb3BzKVxuICAgICAgICAgICAgY3R4LnN0YXR1cyA9IDIwMFxuICAgICAgICAgfSlcbiAgICAgIH1cbiAgIH1cblxuICAgcG9zdCh1cmxQYXRoOiBzdHJpbmcsIG9wdGlvbnM6IFBvc3RSZXF1ZXN0T3B0aW9ucyk6IHZvaWQge1xuICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge31cbiAgICAgIG9wdGlvbnMubW9kZWwgPSBvcHRpb25zLm1vZGVsIHx8IHVuZGVmaW5lZFxuICAgICAgb3B0aW9ucy5oYW5kbGVyID0gb3B0aW9ucy5oYW5kbGVyIHx8IHVuZGVmaW5lZFxuXG4gICAgICBpZihvcHRpb25zLmhhbmRsZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgdGhpcy5yb3V0ZXIucG9zdCh1cmxQYXRoLCBhc3luYyAoY3R4OiBLb2EuQ29udGV4dCwgbmV4dDogS29hLk5leHQpID0+IHtcbiAgICAgICAgICAgIGlmKG9wdGlvbnMuaGFuZGxlciAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICBhd2FpdCBvcHRpb25zLmhhbmRsZXIoY3R4LCB0aGlzLnJlc3RDb250ZXh0LCBuZXh0KVxuICAgICAgICAgICAgfVxuICAgICAgICAgfSlcblxuICAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGlmKG9wdGlvbnMubW9kZWwgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBXaGVuIGRlZmluaW5nIHRoZSBQT1NUICR7dXJsUGF0aH0gZW5kcG9pbnQsICdtb2RlbCcgbXVzdCBiZSBkZWZpbmVkIGlmIGEgaGFuZGxlciBpc24ndCBwcm92aWRlZGApXG4gICAgICB9XG5cbiAgICAgIHRoaXMucm91dGVyLnBvc3QodXJsUGF0aCwgYXN5bmMgKGN0eDogS29hLkNvbnRleHQsIG5leHQ6IEtvYS5OZXh0KSA9PiB7XG4gICAgICAgICBsZXQgbW9kZWwgPSBvcHRpb25zLm1vZGVsIGFzIElNb2RlbFxuICAgICAgICAgbGV0IGJvZHkgPSBjdHgucmVxdWVzdC5ib2R5XG5cbiAgICAgICAgIGlmICghYm9keSkge1xuICAgICAgICAgICAgY3R4LnRocm93KDQwMCwgYEEgYm9keSBtdXN0IGJlIHByb3ZpZGVkYClcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgfVxuXG4gICAgICAgICBsZXQgb2JqID0gYXdhaXQgbW9kZWwuY3JlYXRlKGJvZHkgYXMgT2JqZWN0Q3JlYXRlUGFyYW1zKVxuICAgICAgICAgYXdhaXQgbW9kZWwuc2F2ZShvYmopXG5cbiAgICAgICAgIGN0eC5ib2R5ID0gYnVpbGREZXRhaWxlZFJlc3BvbnNlKG9iailcbiAgICAgICAgIGN0eC5zdGF0dXMgPSAyMDBcbiAgICAgIH0pXG4gICB9XG5cbiAgIGRlbCh1cmxQYXRoOiBzdHJpbmcsIG9wdGlvbnM6IERlbGV0ZVJlcXVlc3RPcHRpb25zKTogdm9pZCB7XG4gICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fVxuICAgICAgb3B0aW9ucy5tb2RlbCA9IG9wdGlvbnMubW9kZWwgfHwgdW5kZWZpbmVkXG4gICAgICBvcHRpb25zLmhhbmRsZXIgPSBvcHRpb25zLmhhbmRsZXIgfHwgdW5kZWZpbmVkXG5cbiAgICAgIGlmKG9wdGlvbnMuaGFuZGxlciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICB0aGlzLnJvdXRlci5kZWxldGUodXJsUGF0aCwgYXN5bmMgKGN0eDogS29hLkNvbnRleHQsIG5leHQ6IEtvYS5OZXh0KSA9PiB7XG4gICAgICAgICAgICBpZihvcHRpb25zLmhhbmRsZXIgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgYXdhaXQgb3B0aW9ucy5oYW5kbGVyKGN0eCwgdGhpcy5yZXN0Q29udGV4dCwgbmV4dClcbiAgICAgICAgICAgIH1cbiAgICAgICAgIH0pXG5cbiAgICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBpZihvcHRpb25zLm1vZGVsID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgIHRocm93IG5ldyBFcnJvcihgV2hlbiBkZWZpbmluZyB0aGUgREVMRVRFICR7dXJsUGF0aH0gZW5kcG9pbnQsICdtb2RlbCcgbXVzdCBiZSBkZWZpbmVkIGlmIGEgaGFuZGxlciBpc24ndCBwcm92aWRlZGApXG4gICAgICB9XG5cbiAgICAgIHRoaXMucm91dGVyLmRlbGV0ZShgJHt1cmxQYXRofS86aWRgLCBhc3luYyAoY3R4OiBLb2EuQ29udGV4dCwgbmV4dDogS29hLk5leHQpID0+IHtcbiAgICAgICAgIGxldCBtb2RlbCA9IG9wdGlvbnMubW9kZWwgYXMgSU1vZGVsXG4gICAgICAgICBsZXQgaWQgPSBjdHgucGFyYW1zLmlkXG5cbiAgICAgICAgIGxldCBvYmogPSBhd2FpdCBtb2RlbC5nZXQoaWQpXG5cbiAgICAgICAgIGlmKG9iaiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBjdHguc3RhdHVzID0gMjAwXG4gICAgICAgICAgICBjdHguYm9keSA9IHVuZGVmaW5lZFxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICB9XG5cbiAgICAgICAgIGF3YWl0IG1vZGVsLmRlbGV0ZShvYmopXG5cbiAgICAgICAgIGN0eC5zdGF0dXMgPSAyMDBcbiAgICAgICAgIGN0eC5ib2R5ID0gYnVpbGREZXRhaWxlZFJlc3BvbnNlKG9iailcbiAgICAgIH0pXG4gICB9XG5cbiAgIGxpc3Rlbihwb3J0OiBudW1iZXIgPSAzNDAxLCBoYW5kbGVyOiBMaXN0ZW5IYW5kbGVyID0gKCkgPT4ge30pOiBTZXJ2ZXIge1xuICAgICAgdGhpcy5hcHBcbiAgICAgICAgIC51c2UoYm9keXBhcnNlcigpKVxuICAgICAgICAgLnVzZSh0aGlzLnJvdXRlci5yb3V0ZXMoKSlcbiAgICAgICAgIC51c2UodGhpcy5yb3V0ZXIuYWxsb3dlZE1ldGhvZHMoKSlcblxuICAgICAgdGhpcy5hcHAudXNlKGFzeW5jIChjdHg6IEtvYS5Db250ZXh0KSA9PiB7XG4gICAgICAgICAvLyB0aGUgcGFyc2VkIGJvZHkgd2lsbCBzdG9yZSBpbiBjdHgucmVxdWVzdC5ib2R5XG4gICAgICAgICAvLyBpZiBub3RoaW5nIHdhcyBwYXJzZWQsIGJvZHkgd2lsbCBiZSBhbiBlbXB0eSBvYmplY3Qge31cbiAgICAgICAgIGN0eC5ib2R5ID0gY3R4LnJlcXVlc3QuYm9keVxuICAgICAgfSlcblxuICAgICAgcmV0dXJuIHRoaXMuYXBwLmxpc3Rlbihwb3J0LCAoKSA9PiB7XG4gICAgICAgICBoYW5kbGVyKClcbiAgICAgIH0pXG4gICB9XG59Il19