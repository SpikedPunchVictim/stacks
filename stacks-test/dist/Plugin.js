"use strict";
// import { IPlugin } from "@spikedpunch/stacks";
// export type CreatePluginHandler = () => Promise<IPlugin>
// export type ResetPluginHandler = (plugin: IPlugin) => Promise<void>
// export type TestConfig = {
//    create: CreatePluginHandler
//    reset: ResetPluginHandler
// }
// export class TestResult {
// }
// export class PluginTest {
//    private constructor(readonly plugin: IPlugin) {
//    }
//    static async run(config: TestConfig): Promise<TestResult> {
//       // await TestSuite.run(context, plugins)
//       //    .getTest()
//       //    .getMany()
//       //    .
//       // await getTest(context, plugins)
//    }
// }
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGx1Z2luLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL1BsdWdpbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsaURBQWlEO0FBRWpELDJEQUEyRDtBQUMzRCxzRUFBc0U7QUFFdEUsNkJBQTZCO0FBQzdCLGlDQUFpQztBQUNqQywrQkFBK0I7QUFDL0IsSUFBSTtBQUVKLDRCQUE0QjtBQUU1QixJQUFJO0FBR0osNEJBQTRCO0FBQzVCLHFEQUFxRDtBQUVyRCxPQUFPO0FBRVAsaUVBQWlFO0FBQ2pFLGlEQUFpRDtBQUNqRCx5QkFBeUI7QUFDekIseUJBQXlCO0FBQ3pCLGdCQUFnQjtBQUNoQiwyQ0FBMkM7QUFDM0MsT0FBTztBQUNQLElBQUkiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBpbXBvcnQgeyBJUGx1Z2luIH0gZnJvbSBcIkBzcGlrZWRwdW5jaC9zdGFja3NcIjtcblxuLy8gZXhwb3J0IHR5cGUgQ3JlYXRlUGx1Z2luSGFuZGxlciA9ICgpID0+IFByb21pc2U8SVBsdWdpbj5cbi8vIGV4cG9ydCB0eXBlIFJlc2V0UGx1Z2luSGFuZGxlciA9IChwbHVnaW46IElQbHVnaW4pID0+IFByb21pc2U8dm9pZD5cblxuLy8gZXhwb3J0IHR5cGUgVGVzdENvbmZpZyA9IHtcbi8vICAgIGNyZWF0ZTogQ3JlYXRlUGx1Z2luSGFuZGxlclxuLy8gICAgcmVzZXQ6IFJlc2V0UGx1Z2luSGFuZGxlclxuLy8gfVxuXG4vLyBleHBvcnQgY2xhc3MgVGVzdFJlc3VsdCB7XG5cbi8vIH1cblxuXG4vLyBleHBvcnQgY2xhc3MgUGx1Z2luVGVzdCB7XG4vLyAgICBwcml2YXRlIGNvbnN0cnVjdG9yKHJlYWRvbmx5IHBsdWdpbjogSVBsdWdpbikge1xuXG4vLyAgICB9XG5cbi8vICAgIHN0YXRpYyBhc3luYyBydW4oY29uZmlnOiBUZXN0Q29uZmlnKTogUHJvbWlzZTxUZXN0UmVzdWx0PiB7XG4vLyAgICAgICAvLyBhd2FpdCBUZXN0U3VpdGUucnVuKGNvbnRleHQsIHBsdWdpbnMpXG4vLyAgICAgICAvLyAgICAuZ2V0VGVzdCgpXG4vLyAgICAgICAvLyAgICAuZ2V0TWFueSgpXG4vLyAgICAgICAvLyAgICAuXG4vLyAgICAgICAvLyBhd2FpdCBnZXRUZXN0KGNvbnRleHQsIHBsdWdpbnMpXG4vLyAgICB9XG4vLyB9Il19