"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
async function main() {
    let stack = _1.Stack.create();
    let ReferenceType = await stack.create.model('reference', {
        string: 'use me',
        items: [0, 1, 2, 3, 4]
    });
    let GG = await stack.create.model('gg', {
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
    let ggs = new Array();
    for (let i = 0; i < 99; ++i) {
        let created = await GG.create();
        await GG.save(created);
        ggs.push(created);
    }
    let paged = await GG.getAll();
    console.dir(paged);
    let Team = await stack.create.model('team', {
        name: '',
        manager: 'mother'
    });
    let defaultTeam = await Team.create({
        name: 'default',
        manager: 'jefe'
    });
    let User = await stack.create.model('user', {
        name: '',
        age: 0,
        money: -100,
        team: ({ ref }) => ref('team', defaultTeam.id)
    });
    let chris = await User.create({
        name: 'chris'
    });
    console.dir(chris, { depth: null });
}
main()
    .then(() => {
    console.log(`Succeeded`);
    process.exit(0);
})
    .catch(err => {
    console.error(`Failed`);
    console.error(`Reason:\n${err}\nStack:\n${err.stack}`);
    process.exit(1);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy90ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsd0JBQXNDO0FBRXRDLEtBQUssVUFBVSxJQUFJO0lBQ2hCLElBQUksS0FBSyxHQUFHLFFBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQTtJQWMxQixJQUFJLGFBQWEsR0FBRyxNQUFNLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRTtRQUN2RCxNQUFNLEVBQUUsUUFBUTtRQUNoQixLQUFLLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0tBQ3hCLENBQUMsQ0FBQTtJQUVGLElBQUksRUFBRSxHQUFHLE1BQU0sS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFO1FBQ3JDLElBQUksRUFBRTtZQUNILElBQUksRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRSxDQUFDLE1BQU07WUFDNUIsS0FBSyxFQUFFLEVBQUU7WUFDVCxPQUFPLEVBQUU7Z0JBQ04sRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFO2FBQzlFO1NBQ0g7UUFDRCxHQUFHLEVBQUUsQ0FBQyxFQUFFO1FBQ1IsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztRQUM1QixJQUFJLEVBQUUsS0FBSztRQUNYLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQztRQUNWLEdBQUcsRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDO1FBQ3pDLE1BQU0sRUFBRSxTQUFTO0tBQ25CLENBQUMsQ0FBQTtJQUVGLElBQUksR0FBRyxHQUFHLElBQUksS0FBSyxFQUFlLENBQUE7SUFFbEMsS0FBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRTtRQUN6QixJQUFJLE9BQU8sR0FBRyxNQUFNLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQTtRQUMvQixNQUFNLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7UUFDdEIsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtLQUNuQjtJQUVELElBQUksS0FBSyxHQUFHLE1BQU0sRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFBO0lBRTdCLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUE7SUFFbEIsSUFBSSxJQUFJLEdBQUcsTUFBTSxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUU7UUFDekMsSUFBSSxFQUFFLEVBQUU7UUFDUixPQUFPLEVBQUUsUUFBUTtLQUNuQixDQUFDLENBQUE7SUFFRixJQUFJLFdBQVcsR0FBRyxNQUFNLElBQUksQ0FBQyxNQUFNLENBQVc7UUFDM0MsSUFBSSxFQUFFLFNBQVM7UUFDZixPQUFPLEVBQUUsTUFBTTtLQUNqQixDQUFDLENBQUE7SUFFRixJQUFJLElBQUksR0FBRyxNQUFNLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRTtRQUN6QyxJQUFJLEVBQUUsRUFBRTtRQUNSLEdBQUcsRUFBRSxDQUFDO1FBQ04sS0FBSyxFQUFFLENBQUMsR0FBRztRQUNYLElBQUksRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsV0FBVyxDQUFDLEVBQUUsQ0FBQztLQUNoRCxDQUFDLENBQUE7SUFFRixJQUFJLEtBQUssR0FBRyxNQUFNLElBQUksQ0FBQyxNQUFNLENBQVc7UUFDckMsSUFBSSxFQUFFLE9BQU87S0FDZixDQUFDLENBQUE7SUFFRixPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFBO0FBQ3RDLENBQUM7QUFFRCxJQUFJLEVBQUU7S0FDRixJQUFJLENBQUMsR0FBRyxFQUFFO0lBQ1IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQTtJQUN4QixPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQ2xCLENBQUMsQ0FBQztLQUNELEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRTtJQUNWLE9BQU8sQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUE7SUFDdkIsT0FBTyxDQUFDLEtBQUssQ0FBQyxZQUFZLEdBQUcsYUFBYSxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQTtJQUN0RCxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQ2xCLENBQUMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU3RhY2ssIFN0YWNrT2JqZWN0IH0gZnJvbSAnLidcblxuYXN5bmMgZnVuY3Rpb24gbWFpbigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgIGxldCBzdGFjayA9IFN0YWNrLmNyZWF0ZSgpXG5cbiAgIHR5cGUgVXNlclR5cGUgPSB7XG4gICAgICBubWU6IHN0cmluZ1xuICAgICAgYWdlOiBudW1iZXJcbiAgICAgIG1vbmV5OiBudW1iZXJcbiAgICAgIHRlYW06IFRlYW1UeXBlXG4gICB9ICYgU3RhY2tPYmplY3RcblxuICAgdHlwZSBUZWFtVHlwZSA9IHtcbiAgICAgIG5hbWU6IHN0cmluZ1xuICAgICAgbWFuYWdlcjogc3RyaW5nXG4gICB9ICYgU3RhY2tPYmplY3RcblxuICAgbGV0IFJlZmVyZW5jZVR5cGUgPSBhd2FpdCBzdGFjay5jcmVhdGUubW9kZWwoJ3JlZmVyZW5jZScsIHtcbiAgICAgIHN0cmluZzogJ3VzZSBtZScsXG4gICAgICBpdGVtczogWzAsIDEsIDIsIDMsIDRdXG4gICB9KVxuXG4gICBsZXQgR0cgPSBhd2FpdCBzdGFjay5jcmVhdGUubW9kZWwoJ2dnJywge1xuICAgICAgbmFtZToge1xuICAgICAgICAgdHlwZTogKHsgc3RyaW5nIH0pID0+IHN0cmluZyxcbiAgICAgICAgIHZhbHVlOiAnJyxcbiAgICAgICAgIHN5bWJvbHM6IFtcbiAgICAgICAgICAgIHsgbmFtZTogJ25vLXJlJywgdmFsdWU6IHsgc29tZTogJ3RoaW5nJywgaXM6IC0xLCBub3Q6IHsgYW55dGhpbmc6IHRydWUgfSB9IH1cbiAgICAgICAgIF1cbiAgICAgIH0sXG4gICAgICBpbnQ6IC00MixcbiAgICAgIHVpbnQ6ICh7IHVpbnQgfSkgPT4gdWludCg0MiksXG4gICAgICBib29sOiBmYWxzZSxcbiAgICAgIGxpc3Q6IFsnJ10sXG4gICAgICByZWY6ICh7IHJlZiB9KSA9PiByZWYoUmVmZXJlbmNlVHlwZS5uYW1lKSxcbiAgICAgIHN0cmluZzogJ09oIG1hbiEnXG4gICB9KVxuXG4gICBsZXQgZ2dzID0gbmV3IEFycmF5PFN0YWNrT2JqZWN0PigpXG5cbiAgIGZvcihsZXQgaSA9IDA7IGkgPCA5OTsgKytpKSB7XG4gICAgICBsZXQgY3JlYXRlZCA9IGF3YWl0IEdHLmNyZWF0ZSgpXG4gICAgICBhd2FpdCBHRy5zYXZlKGNyZWF0ZWQpXG4gICAgICBnZ3MucHVzaChjcmVhdGVkKVxuICAgfVxuXG4gICBsZXQgcGFnZWQgPSBhd2FpdCBHRy5nZXRBbGwoKVxuXG4gICBjb25zb2xlLmRpcihwYWdlZClcblxuICAgbGV0IFRlYW0gPSBhd2FpdCBzdGFjay5jcmVhdGUubW9kZWwoJ3RlYW0nLCB7XG4gICAgICBuYW1lOiAnJyxcbiAgICAgIG1hbmFnZXI6ICdtb3RoZXInXG4gICB9KVxuXG4gICBsZXQgZGVmYXVsdFRlYW0gPSBhd2FpdCBUZWFtLmNyZWF0ZTxUZWFtVHlwZT4oe1xuICAgICAgbmFtZTogJ2RlZmF1bHQnLFxuICAgICAgbWFuYWdlcjogJ2plZmUnXG4gICB9KVxuXG4gICBsZXQgVXNlciA9IGF3YWl0IHN0YWNrLmNyZWF0ZS5tb2RlbCgndXNlcicsIHtcbiAgICAgIG5hbWU6ICcnLFxuICAgICAgYWdlOiAwLFxuICAgICAgbW9uZXk6IC0xMDAsXG4gICAgICB0ZWFtOiAoeyByZWYgfSkgPT4gcmVmKCd0ZWFtJywgZGVmYXVsdFRlYW0uaWQpXG4gICB9KVxuXG4gICBsZXQgY2hyaXMgPSBhd2FpdCBVc2VyLmNyZWF0ZTxVc2VyVHlwZT4oe1xuICAgICAgbmFtZTogJ2NocmlzJ1xuICAgfSlcblxuICAgY29uc29sZS5kaXIoY2hyaXMsIHsgZGVwdGg6IG51bGwgfSlcbn1cblxubWFpbigpXG4gICAudGhlbigoKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhgU3VjY2VlZGVkYClcbiAgICAgIHByb2Nlc3MuZXhpdCgwKVxuICAgfSlcbiAgIC5jYXRjaChlcnIgPT4ge1xuICAgICAgY29uc29sZS5lcnJvcihgRmFpbGVkYClcbiAgICAgIGNvbnNvbGUuZXJyb3IoYFJlYXNvbjpcXG4ke2Vycn1cXG5TdGFjazpcXG4ke2Vyci5zdGFja31gKVxuICAgICAgcHJvY2Vzcy5leGl0KDEpXG4gICB9KSJdfQ==