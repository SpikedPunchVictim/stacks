"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stack = void 0;
const Cache_1 = require("../Cache");
const EventRouter_1 = require("../events/EventRouter");
const RequestForChange_1 = require("../events/RequestForChange");
const ValueSerializer_1 = require("../serialize/ValueSerializer");
const UidKeeper_1 = require("../UidKeeper");
const Eventing_1 = require("../utils/Eventing");
const Bool_1 = require("../values/Bool");
const Int_1 = require("../values/Int");
const List_1 = require("../values/List");
const ObjectRef_1 = require("../values/ObjectRef");
const String_1 = require("../values/String");
const Type_1 = require("../values/Type");
const UInt_1 = require("../values/UInt");
const StackContext_1 = require("./StackContext");
const StackCreate_1 = require("./StackCreate");
const StackDelete_1 = require("./StackDelete");
const StackGet_1 = require("./StackGet");
const StackUpdate_1 = require("./StackUpdate");
class Stack extends Eventing_1.CombinedEventEmitter {
    constructor(options) {
        super();
        this.uid = (options === null || options === void 0 ? void 0 : options.uidKeeper) || new UidKeeper_1.UidKeeper();
        this.cache = new Cache_1.Cache();
        this.delete = new StackDelete_1.StackDelete(this.cache);
        this.router = new EventRouter_1.EventRouter();
        this.rfc = new RequestForChange_1.RequestForChangeSource(this.router);
        let serializer = new ValueSerializer_1.CompositeSerializer();
        this.serializer = serializer;
        this.context = new StackContext_1.StackContext(this, this.rfc, this.cache, this.uid, serializer);
        serializer.register(Type_1.TypeSet.Bool, new Bool_1.BoolSerializer());
        serializer.register(Type_1.TypeSet.Int, new Int_1.IntSerializer());
        serializer.register(Type_1.TypeSet.List, new List_1.ListSerializer(serializer));
        serializer.register(Type_1.TypeSet.ObjectRef, new ObjectRef_1.ObjectRefSerializer(this.context));
        serializer.register(Type_1.TypeSet.String, new String_1.StringSerializer());
        serializer.register(Type_1.TypeSet.UInt, new UInt_1.UIntSerializer());
        this.get = new StackGet_1.StackGet(this.context);
        this.create = new StackCreate_1.StackCreate(this.get, this.context);
        this.update = new StackUpdate_1.StackUpdate(this.context);
    }
    static create(options) {
        return new Stack(options);
    }
    async hasId(id) {
        return this.context.orchestrator.hasId(id);
    }
}
exports.Stack = Stack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc3RhY2svU3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsb0NBQXdDO0FBQ3hDLHVEQUFpRTtBQUNqRSxpRUFBNEY7QUFDNUYsa0VBQW9GO0FBQ3BGLDRDQUFvRDtBQUNwRCxnREFBK0U7QUFDL0UseUNBQStDO0FBQy9DLHVDQUE2QztBQUM3Qyx5Q0FBK0M7QUFDL0MsbURBQXlEO0FBQ3pELDZDQUFtRDtBQUNuRCx5Q0FBd0M7QUFDeEMseUNBQStDO0FBQy9DLGlEQUE2QztBQUM3QywrQ0FBeUQ7QUFDekQsK0NBQXlEO0FBQ3pELHlDQUFnRDtBQUNoRCwrQ0FBeUQ7QUFxQnpELE1BQWEsS0FDVixTQUFRLCtCQUFvQjtJQWU1QixZQUFZLE9BQXNCO1FBQy9CLEtBQUssRUFBRSxDQUFBO1FBRVAsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFBLE9BQU8sYUFBUCxPQUFPLHVCQUFQLE9BQU8sQ0FBRSxTQUFTLEtBQUksSUFBSSxxQkFBUyxFQUFFLENBQUE7UUFDaEQsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLGFBQUssRUFBRSxDQUFBO1FBRXhCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSx5QkFBVyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtRQUV6QyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUkseUJBQVcsRUFBRSxDQUFBO1FBQy9CLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSx5Q0FBc0IsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUE7UUFFbEQsSUFBSSxVQUFVLEdBQUcsSUFBSSxxQ0FBbUIsRUFBRSxDQUFBO1FBQzFDLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFBO1FBRTVCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSwyQkFBWSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQTtRQUVqRixVQUFVLENBQUMsUUFBUSxDQUFDLGNBQU8sQ0FBQyxJQUFJLEVBQUUsSUFBSSxxQkFBYyxFQUFFLENBQUMsQ0FBQTtRQUN2RCxVQUFVLENBQUMsUUFBUSxDQUFDLGNBQU8sQ0FBQyxHQUFHLEVBQUUsSUFBSSxtQkFBYSxFQUFFLENBQUMsQ0FBQTtRQUNyRCxVQUFVLENBQUMsUUFBUSxDQUFDLGNBQU8sQ0FBQyxJQUFJLEVBQUUsSUFBSSxxQkFBYyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUE7UUFDakUsVUFBVSxDQUFDLFFBQVEsQ0FBQyxjQUFPLENBQUMsU0FBUyxFQUFFLElBQUksK0JBQW1CLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUE7UUFDN0UsVUFBVSxDQUFDLFFBQVEsQ0FBQyxjQUFPLENBQUMsTUFBTSxFQUFFLElBQUkseUJBQWdCLEVBQUUsQ0FBQyxDQUFBO1FBQzNELFVBQVUsQ0FBQyxRQUFRLENBQUMsY0FBTyxDQUFDLElBQUksRUFBRSxJQUFJLHFCQUFjLEVBQUUsQ0FBQyxDQUFBO1FBRXZELElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxtQkFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUNyQyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUkseUJBQVcsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUNyRCxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUkseUJBQVcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7SUFDOUMsQ0FBQztJQUVELE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBc0I7UUFDakMsT0FBTyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQTtJQUM1QixDQUFDO0lBRUQsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFVO1FBQ25CLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFBO0lBQzdDLENBQUM7Q0FDSDtBQW5ERCxzQkFtREMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDYWNoZSwgSUNhY2hlIH0gZnJvbSBcIi4uL0NhY2hlXCJcbmltcG9ydCB7IEV2ZW50Um91dGVyLCBJRXZlbnRSb3V0ZXIgfSBmcm9tIFwiLi4vZXZlbnRzL0V2ZW50Um91dGVyXCJcbmltcG9ydCB7IElSZXF1ZXN0Rm9yQ2hhbmdlU291cmNlLCBSZXF1ZXN0Rm9yQ2hhbmdlU291cmNlIH0gZnJvbSBcIi4uL2V2ZW50cy9SZXF1ZXN0Rm9yQ2hhbmdlXCJcbmltcG9ydCB7IENvbXBvc2l0ZVNlcmlhbGl6ZXIsIElWYWx1ZVNlcmlhbGl6ZXIgfSBmcm9tIFwiLi4vc2VyaWFsaXplL1ZhbHVlU2VyaWFsaXplclwiXG5pbXBvcnQgeyBJVWlkS2VlcGVyLCBVaWRLZWVwZXIgfSBmcm9tIFwiLi4vVWlkS2VlcGVyXCJcbmltcG9ydCB7IENvbWJpbmVkRXZlbnRFbWl0dGVyLCBJQ29tYmluZWRFdmVudEVtaXR0ZXIgfSBmcm9tIFwiLi4vdXRpbHMvRXZlbnRpbmdcIlxuaW1wb3J0IHsgQm9vbFNlcmlhbGl6ZXIgfSBmcm9tIFwiLi4vdmFsdWVzL0Jvb2xcIlxuaW1wb3J0IHsgSW50U2VyaWFsaXplciB9IGZyb20gXCIuLi92YWx1ZXMvSW50XCJcbmltcG9ydCB7IExpc3RTZXJpYWxpemVyIH0gZnJvbSBcIi4uL3ZhbHVlcy9MaXN0XCJcbmltcG9ydCB7IE9iamVjdFJlZlNlcmlhbGl6ZXIgfSBmcm9tIFwiLi4vdmFsdWVzL09iamVjdFJlZlwiXG5pbXBvcnQgeyBTdHJpbmdTZXJpYWxpemVyIH0gZnJvbSBcIi4uL3ZhbHVlcy9TdHJpbmdcIlxuaW1wb3J0IHsgVHlwZVNldCB9IGZyb20gXCIuLi92YWx1ZXMvVHlwZVwiXG5pbXBvcnQgeyBVSW50U2VyaWFsaXplciB9IGZyb20gXCIuLi92YWx1ZXMvVUludFwiXG5pbXBvcnQgeyBTdGFja0NvbnRleHQgfSBmcm9tIFwiLi9TdGFja0NvbnRleHRcIlxuaW1wb3J0IHsgSVN0YWNrQ3JlYXRlLCBTdGFja0NyZWF0ZSB9IGZyb20gXCIuL1N0YWNrQ3JlYXRlXCJcbmltcG9ydCB7IElTdGFja0RlbGV0ZSwgU3RhY2tEZWxldGUgfSBmcm9tIFwiLi9TdGFja0RlbGV0ZVwiXG5pbXBvcnQgeyBJU3RhY2tHZXQsIFN0YWNrR2V0IH0gZnJvbSBcIi4vU3RhY2tHZXRcIlxuaW1wb3J0IHsgSVN0YWNrVXBkYXRlLCBTdGFja1VwZGF0ZSB9IGZyb20gXCIuL1N0YWNrVXBkYXRlXCJcblxuZXhwb3J0IHR5cGUgU3RhY2tPcHRpb25zID0ge1xuICAgdWlkS2VlcGVyPzogSVVpZEtlZXBlclxufVxuXG5leHBvcnQgaW50ZXJmYWNlIElTdGFjayBleHRlbmRzIElDb21iaW5lZEV2ZW50RW1pdHRlciB7XG4gICByZWFkb25seSBjcmVhdGU6IElTdGFja0NyZWF0ZVxuICAgcmVhZG9ubHkgZGVsZXRlOiBJU3RhY2tEZWxldGVcbiAgIHJlYWRvbmx5IGdldDogSVN0YWNrR2V0XG4gICByZWFkb25seSB1cGRhdGU6IElTdGFja1VwZGF0ZVxuICAgcmVhZG9ubHkgc2VyaWFsaXplcjogSVZhbHVlU2VyaWFsaXplclxuXG4gICAvKipcbiAgICAqIERldGVybWluZXMgaWYgYW4gaWQgaXMgYWxyZWFkeSBpbiB1c2UuXG4gICAgKiBcbiAgICAqIEBwYXJhbSBpZCBUaGUgaWRcbiAgICAqL1xuICAgaGFzSWQoaWQ6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj5cbn1cblxuZXhwb3J0IGNsYXNzIFN0YWNrXG4gICBleHRlbmRzIENvbWJpbmVkRXZlbnRFbWl0dGVyIFxuICAgaW1wbGVtZW50cyBJU3RhY2tcbiAgIHtcbiAgIHJlYWRvbmx5IGdldDogSVN0YWNrR2V0XG4gICByZWFkb25seSBjcmVhdGU6IElTdGFja0NyZWF0ZVxuICAgcmVhZG9ubHkgdXBkYXRlOiBJU3RhY2tVcGRhdGVcbiAgIHJlYWRvbmx5IGRlbGV0ZTogSVN0YWNrRGVsZXRlXG4gICByZWFkb25seSB1aWQ6IElVaWRLZWVwZXJcbiAgIHJlYWRvbmx5IHNlcmlhbGl6ZXI6IElWYWx1ZVNlcmlhbGl6ZXJcblxuICAgcHJpdmF0ZSByZmM6IElSZXF1ZXN0Rm9yQ2hhbmdlU291cmNlXG4gICBwcml2YXRlIHJvdXRlcjogSUV2ZW50Um91dGVyXG4gICBwcml2YXRlIGNvbnRleHQ6IFN0YWNrQ29udGV4dFxuICAgcHJpdmF0ZSBjYWNoZTogSUNhY2hlXG5cbiAgIGNvbnN0cnVjdG9yKG9wdGlvbnM/OiBTdGFja09wdGlvbnMpIHtcbiAgICAgIHN1cGVyKClcbiAgICAgIFxuICAgICAgdGhpcy51aWQgPSBvcHRpb25zPy51aWRLZWVwZXIgfHwgbmV3IFVpZEtlZXBlcigpXG4gICAgICB0aGlzLmNhY2hlID0gbmV3IENhY2hlKClcbiAgICAgIFxuICAgICAgdGhpcy5kZWxldGUgPSBuZXcgU3RhY2tEZWxldGUodGhpcy5jYWNoZSlcblxuICAgICAgdGhpcy5yb3V0ZXIgPSBuZXcgRXZlbnRSb3V0ZXIoKVxuICAgICAgdGhpcy5yZmMgPSBuZXcgUmVxdWVzdEZvckNoYW5nZVNvdXJjZSh0aGlzLnJvdXRlcilcblxuICAgICAgbGV0IHNlcmlhbGl6ZXIgPSBuZXcgQ29tcG9zaXRlU2VyaWFsaXplcigpXG4gICAgICB0aGlzLnNlcmlhbGl6ZXIgPSBzZXJpYWxpemVyXG5cbiAgICAgIHRoaXMuY29udGV4dCA9IG5ldyBTdGFja0NvbnRleHQodGhpcywgdGhpcy5yZmMsIHRoaXMuY2FjaGUsIHRoaXMudWlkLCBzZXJpYWxpemVyKVxuXG4gICAgICBzZXJpYWxpemVyLnJlZ2lzdGVyKFR5cGVTZXQuQm9vbCwgbmV3IEJvb2xTZXJpYWxpemVyKCkpXG4gICAgICBzZXJpYWxpemVyLnJlZ2lzdGVyKFR5cGVTZXQuSW50LCBuZXcgSW50U2VyaWFsaXplcigpKVxuICAgICAgc2VyaWFsaXplci5yZWdpc3RlcihUeXBlU2V0Lkxpc3QsIG5ldyBMaXN0U2VyaWFsaXplcihzZXJpYWxpemVyKSlcbiAgICAgIHNlcmlhbGl6ZXIucmVnaXN0ZXIoVHlwZVNldC5PYmplY3RSZWYsIG5ldyBPYmplY3RSZWZTZXJpYWxpemVyKHRoaXMuY29udGV4dCkpXG4gICAgICBzZXJpYWxpemVyLnJlZ2lzdGVyKFR5cGVTZXQuU3RyaW5nLCBuZXcgU3RyaW5nU2VyaWFsaXplcigpKVxuICAgICAgc2VyaWFsaXplci5yZWdpc3RlcihUeXBlU2V0LlVJbnQsIG5ldyBVSW50U2VyaWFsaXplcigpKVxuXG4gICAgICB0aGlzLmdldCA9IG5ldyBTdGFja0dldCh0aGlzLmNvbnRleHQpXG4gICAgICB0aGlzLmNyZWF0ZSA9IG5ldyBTdGFja0NyZWF0ZSh0aGlzLmdldCwgdGhpcy5jb250ZXh0KVxuICAgICAgdGhpcy51cGRhdGUgPSBuZXcgU3RhY2tVcGRhdGUodGhpcy5jb250ZXh0KVxuICAgfVxuXG4gICBzdGF0aWMgY3JlYXRlKG9wdGlvbnM/OiBTdGFja09wdGlvbnMpOiBJU3RhY2sge1xuICAgICAgcmV0dXJuIG5ldyBTdGFjayhvcHRpb25zKVxuICAgfVxuXG4gICBhc3luYyBoYXNJZChpZDogc3RyaW5nKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgICByZXR1cm4gdGhpcy5jb250ZXh0Lm9yY2hlc3RyYXRvci5oYXNJZChpZClcbiAgIH1cbn0iXX0=