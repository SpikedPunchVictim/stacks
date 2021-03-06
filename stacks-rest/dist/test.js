"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stacks_1 = require("@spikedpunch/stacks");
const Rest_1 = require("./Rest");
//import got from 'got'
//import got from 'got'
async function main() {
    await new Promise(async (resolve, reject) => {
        let stack = stacks_1.Stack.create();
        let rest = new Rest_1.StacksRest(stack);
        // type UserType = {
        //    name: string
        //    age: number
        //    money: number
        // } & StackObject
        // type TeamType = {
        //    name: string
        //    manager: string
        // } & StackObject
        let Team = await stack.create.model('team', {
            name: '',
            manager: 'dave'
        });
        let ReferenceType = await stack.create.model('reference', {
            string: 'use me',
            items: [0, 1, 2, 3, 4],
            ref: ({ ref }) => ref(Team.name)
        });
        let GG = await stack.create.model('gg', {
            id: '',
            name: {
                type: ({ string }) => string,
                value: '',
                symbols: [
                    { name: 'no-re', value: { some: 'thing', is: -1, not: { anything: true } } }
                ]
            },
            int: -42,
            uint: ({ uint }) => uint(42),
            bool: false,
            list: [''],
            ref: ({ ref }) => ref(ReferenceType.name),
            string: 'Oh man!'
        });
        for (let i = 0; i < 100; ++i) {
            let temp = await GG.create();
            await GG.save(temp);
        }
        //-- Default
        rest.get('/user', { model: GG, many: ['name', 'int'] });
        rest.put('/user', { model: GG });
        rest.post('/user', { model: GG });
        rest.del('/user', { model: GG });
        let server = rest.listen(4200, () => console.log(`Server up on port 4200`));
        server.on('close', resolve);
    });
    // let res = await got("http://localhost:4200/user")
    // console.dir(res)
}
main()
    .then(() => {
    console.log(`Succeeded`);
    //process.exit(0)
})
    .catch(err => {
    console.error(`Failed`);
    console.error(`Reason:\n${err}\nStack:\n${err.stack}`);
    process.exit(1);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy90ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsZ0RBQTJDO0FBQzNDLGlDQUFtQztBQUNuQyx1QkFBdUI7QUFDdkIsdUJBQXVCO0FBRXZCLEtBQUssVUFBVSxJQUFJO0lBRWhCLE1BQU0sSUFBSSxPQUFPLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtRQUN6QyxJQUFJLEtBQUssR0FBRyxjQUFLLENBQUMsTUFBTSxFQUFFLENBQUE7UUFDMUIsSUFBSSxJQUFJLEdBQUcsSUFBSSxpQkFBVSxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBRWhDLG9CQUFvQjtRQUNwQixrQkFBa0I7UUFDbEIsaUJBQWlCO1FBQ2pCLG1CQUFtQjtRQUNuQixrQkFBa0I7UUFFbEIsb0JBQW9CO1FBQ3BCLGtCQUFrQjtRQUNsQixxQkFBcUI7UUFDckIsa0JBQWtCO1FBRWxCLElBQUksSUFBSSxHQUFHLE1BQU0sS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFO1lBQ3pDLElBQUksRUFBRSxFQUFFO1lBQ1IsT0FBTyxFQUFFLE1BQU07U0FDakIsQ0FBQyxDQUFBO1FBRUYsSUFBSSxhQUFhLEdBQUcsTUFBTSxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxXQUFXLEVBQUU7WUFDdkQsTUFBTSxFQUFFLFFBQVE7WUFDaEIsS0FBSyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUN0QixHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztTQUNsQyxDQUFDLENBQUE7UUFFRixJQUFJLEVBQUUsR0FBRyxNQUFNLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRTtZQUNyQyxFQUFFLEVBQUUsRUFBRTtZQUNOLElBQUksRUFBRTtnQkFDSCxJQUFJLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxFQUFFLEVBQUUsQ0FBQyxNQUFNO2dCQUM1QixLQUFLLEVBQUUsRUFBRTtnQkFDVCxPQUFPLEVBQUU7b0JBQ04sRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFO2lCQUM5RTthQUNIO1lBQ0QsR0FBRyxFQUFFLENBQUMsRUFBRTtZQUNSLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7WUFDNUIsSUFBSSxFQUFFLEtBQUs7WUFDWCxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUM7WUFDVixHQUFHLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQztZQUN6QyxNQUFNLEVBQUUsU0FBUztTQUNuQixDQUFDLENBQUE7UUFFRixLQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxFQUFFLEVBQUUsQ0FBQyxFQUFFO1lBQzFCLElBQUksSUFBSSxHQUFHLE1BQU0sRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFBO1lBQzVCLE1BQU0sRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtTQUNyQjtRQUVELFlBQVk7UUFDWixJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQTtRQUN2RCxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFBO1FBQ2hDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUE7UUFDakMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQTtRQUVoQyxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLHdCQUF3QixDQUFDLENBQUMsQ0FBQTtRQUUzRSxNQUFNLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQTtJQUM5QixDQUFDLENBQUMsQ0FBQTtJQUdGLG9EQUFvRDtJQUNwRCxtQkFBbUI7QUFDdEIsQ0FBQztBQUVELElBQUksRUFBRTtLQUNGLElBQUksQ0FBQyxHQUFHLEVBQUU7SUFDUixPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFBO0lBQ3hCLGlCQUFpQjtBQUNwQixDQUFDLENBQUM7S0FDRCxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUU7SUFDVixPQUFPLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFBO0lBQ3ZCLE9BQU8sQ0FBQyxLQUFLLENBQUMsWUFBWSxHQUFHLGFBQWEsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUE7SUFDdEQsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUNsQixDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFN0YWNrIH0gZnJvbSAnQHNwaWtlZHB1bmNoL3N0YWNrcydcbmltcG9ydCB7IFN0YWNrc1Jlc3QgfSBmcm9tICcuL1Jlc3QnXG4vL2ltcG9ydCBnb3QgZnJvbSAnZ290J1xuLy9pbXBvcnQgZ290IGZyb20gJ2dvdCdcblxuYXN5bmMgZnVuY3Rpb24gbWFpbigpOiBQcm9taXNlPHZvaWQ+IHtcblxuICAgYXdhaXQgbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgbGV0IHN0YWNrID0gU3RhY2suY3JlYXRlKClcbiAgICAgIGxldCByZXN0ID0gbmV3IFN0YWNrc1Jlc3Qoc3RhY2spXG4gICBcbiAgICAgIC8vIHR5cGUgVXNlclR5cGUgPSB7XG4gICAgICAvLyAgICBuYW1lOiBzdHJpbmdcbiAgICAgIC8vICAgIGFnZTogbnVtYmVyXG4gICAgICAvLyAgICBtb25leTogbnVtYmVyXG4gICAgICAvLyB9ICYgU3RhY2tPYmplY3RcbiAgIFxuICAgICAgLy8gdHlwZSBUZWFtVHlwZSA9IHtcbiAgICAgIC8vICAgIG5hbWU6IHN0cmluZ1xuICAgICAgLy8gICAgbWFuYWdlcjogc3RyaW5nXG4gICAgICAvLyB9ICYgU3RhY2tPYmplY3RcbiAgIFxuICAgICAgbGV0IFRlYW0gPSBhd2FpdCBzdGFjay5jcmVhdGUubW9kZWwoJ3RlYW0nLCB7XG4gICAgICAgICBuYW1lOiAnJyxcbiAgICAgICAgIG1hbmFnZXI6ICdkYXZlJ1xuICAgICAgfSlcbiAgIFxuICAgICAgbGV0IFJlZmVyZW5jZVR5cGUgPSBhd2FpdCBzdGFjay5jcmVhdGUubW9kZWwoJ3JlZmVyZW5jZScsIHtcbiAgICAgICAgIHN0cmluZzogJ3VzZSBtZScsXG4gICAgICAgICBpdGVtczogWzAsIDEsIDIsIDMsIDRdLFxuICAgICAgICAgcmVmOiAoeyByZWYgfSkgPT4gcmVmKFRlYW0ubmFtZSlcbiAgICAgIH0pXG4gICBcbiAgICAgIGxldCBHRyA9IGF3YWl0IHN0YWNrLmNyZWF0ZS5tb2RlbCgnZ2cnLCB7XG4gICAgICAgICBpZDogJycsXG4gICAgICAgICBuYW1lOiB7XG4gICAgICAgICAgICB0eXBlOiAoeyBzdHJpbmcgfSkgPT4gc3RyaW5nLFxuICAgICAgICAgICAgdmFsdWU6ICcnLFxuICAgICAgICAgICAgc3ltYm9sczogW1xuICAgICAgICAgICAgICAgeyBuYW1lOiAnbm8tcmUnLCB2YWx1ZTogeyBzb21lOiAndGhpbmcnLCBpczogLTEsIG5vdDogeyBhbnl0aGluZzogdHJ1ZSB9IH0gfVxuICAgICAgICAgICAgXVxuICAgICAgICAgfSxcbiAgICAgICAgIGludDogLTQyLFxuICAgICAgICAgdWludDogKHsgdWludCB9KSA9PiB1aW50KDQyKSxcbiAgICAgICAgIGJvb2w6IGZhbHNlLFxuICAgICAgICAgbGlzdDogWycnXSxcbiAgICAgICAgIHJlZjogKHsgcmVmIH0pID0+IHJlZihSZWZlcmVuY2VUeXBlLm5hbWUpLFxuICAgICAgICAgc3RyaW5nOiAnT2ggbWFuISdcbiAgICAgIH0pXG5cbiAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCAxMDA7ICsraSkge1xuICAgICAgICAgbGV0IHRlbXAgPSBhd2FpdCBHRy5jcmVhdGUoKVxuICAgICAgICAgYXdhaXQgR0cuc2F2ZSh0ZW1wKVxuICAgICAgfVxuICAgXG4gICAgICAvLy0tIERlZmF1bHRcbiAgICAgIHJlc3QuZ2V0KCcvdXNlcicsIHsgbW9kZWw6IEdHLCBtYW55OiBbJ25hbWUnLCAnaW50J10gfSlcbiAgICAgIHJlc3QucHV0KCcvdXNlcicsIHsgbW9kZWw6IEdHIH0pXG4gICAgICByZXN0LnBvc3QoJy91c2VyJywgeyBtb2RlbDogR0cgfSlcbiAgICAgIHJlc3QuZGVsKCcvdXNlcicsIHsgbW9kZWw6IEdHIH0pXG4gICBcbiAgICAgIGxldCBzZXJ2ZXIgPSByZXN0Lmxpc3Rlbig0MjAwLCAoKSA9PiBjb25zb2xlLmxvZyhgU2VydmVyIHVwIG9uIHBvcnQgNDIwMGApKVxuICAgXG4gICAgICBzZXJ2ZXIub24oJ2Nsb3NlJywgcmVzb2x2ZSkgIFxuICAgfSlcblxuXG4gICAvLyBsZXQgcmVzID0gYXdhaXQgZ290KFwiaHR0cDovL2xvY2FsaG9zdDo0MjAwL3VzZXJcIilcbiAgIC8vIGNvbnNvbGUuZGlyKHJlcylcbn1cblxubWFpbigpXG4gICAudGhlbigoKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhgU3VjY2VlZGVkYClcbiAgICAgIC8vcHJvY2Vzcy5leGl0KDApXG4gICB9KVxuICAgLmNhdGNoKGVyciA9PiB7XG4gICAgICBjb25zb2xlLmVycm9yKGBGYWlsZWRgKVxuICAgICAgY29uc29sZS5lcnJvcihgUmVhc29uOlxcbiR7ZXJyfVxcblN0YWNrOlxcbiR7ZXJyLnN0YWNrfWApXG4gICAgICBwcm9jZXNzLmV4aXQoMSlcbiAgIH0pIl19