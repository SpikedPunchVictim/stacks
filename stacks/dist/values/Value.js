"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasicValue = exports.Value = void 0;
class Value {
    constructor(type) {
        this.type = type;
    }
    clone() {
        throw new Error(`clone() not implemented`);
    }
    equals(other) {
        if (!this.type.equals(other.type)) {
            return false;
        }
        return true;
    }
    set(value) {
        throw new Error("set() not implemented.");
    }
}
exports.Value = Value;
class BasicValue extends Value {
    constructor(type, value) {
        super(type);
        this._value = value;
    }
    get value() {
        return this._value;
    }
    clone() {
        throw new Error(`clone() not implemented`);
    }
    set(value) {
        if (!this.type.equals(value.type)) {
            throw new Error(`Incompatible type encountered when trying to set a Value`);
        }
        this._value = value.value;
        return this;
    }
}
exports.BasicValue = BasicValue;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVmFsdWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdmFsdWVzL1ZhbHVlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQTRCQSxNQUFzQixLQUFLO0lBR3hCLFlBQVksSUFBVztRQUNwQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQTtJQUNuQixDQUFDO0lBRUQsS0FBSztRQUNGLE1BQU0sSUFBSSxLQUFLLENBQUMseUJBQXlCLENBQUMsQ0FBQTtJQUM3QyxDQUFDO0lBRUQsTUFBTSxDQUFDLEtBQWE7UUFDakIsSUFBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUMvQixPQUFPLEtBQUssQ0FBQTtTQUNkO1FBRUQsT0FBTyxJQUFJLENBQUE7SUFDZCxDQUFDO0lBRUQsR0FBRyxDQUFDLEtBQWE7UUFDZCxNQUFNLElBQUksS0FBSyxDQUFDLHdCQUF3QixDQUFDLENBQUM7SUFDN0MsQ0FBQztDQUNIO0FBdEJELHNCQXNCQztBQUVELE1BQXNCLFVBQWMsU0FBUSxLQUFLO0lBTzlDLFlBQVksSUFBVyxFQUFFLEtBQVE7UUFDOUIsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQ1gsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUE7SUFDdEIsQ0FBQztJQVRELElBQUksS0FBSztRQUNOLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQTtJQUNyQixDQUFDO0lBU0QsS0FBSztRQUNGLE1BQU0sSUFBSSxLQUFLLENBQUMseUJBQXlCLENBQUMsQ0FBQTtJQUM3QyxDQUFDO0lBRUQsR0FBRyxDQUFDLEtBQWE7UUFDZCxJQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQy9CLE1BQU0sSUFBSSxLQUFLLENBQUMsMERBQTBELENBQUMsQ0FBQTtTQUM3RTtRQUVELElBQUksQ0FBQyxNQUFNLEdBQUksS0FBdUIsQ0FBQyxLQUFLLENBQUE7UUFDNUMsT0FBTyxJQUFJLENBQUE7SUFDZCxDQUFDO0NBQ0g7QUF4QkQsZ0NBd0JDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSVR5cGUgfSBmcm9tIFwiLi9UeXBlXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVZhbHVlIHtcbiAgIHJlYWRvbmx5IHR5cGU6IElUeXBlXG5cbiAgIC8qKlxuICAgICogTWFrZXMgYSBjbG9uZSBvZiB0aGlzIFZhbHVlXG4gICAgKi9cbiAgIGNsb25lKCk6IElWYWx1ZVxuXG4gICAvKipcbiAgICAqIERldGVybWluZXMgaWYgdGhpcyB2YWx1ZSBhbmQgYW5vdGhlciB2YWx1ZSBhcmUgZXF1YWxcbiAgICAqIFxuICAgICogQHBhcmFtIG90aGVyIFRoZSBvdGhlciB2YWx1ZSB0byBjb21wYXJlXG4gICAgKi9cbiAgIGVxdWFscyhvdGhlcjogSVZhbHVlKTogYm9vbGVhblxuICAgXG4gICAvKipcbiAgICAqIFNldHMgdGhlIHZhbHVlIHRvIHRoZSBuZXcgdmFsdWUuXG4gICAgKiBcbiAgICAqIE5vdGU6IFRoaXMgaXMgbm90IGFuIGFzeW5jIGZ1bmN0aW9uLiBTZXR0aW5nIHZhbHVlc1xuICAgICogc2hvdWxkIGJlIHN5bmNocm9ub3VzLiBBbnkgdmFsaWRhdGlvbiBzaG91bGQgYmUgZG9uZVxuICAgICogd2hlbiB2YWxpZGF0ZSgpIGlzIGNhbGxlZC5cbiAgICAqIEBwYXJhbSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2V0XG4gICAgKi9cbiAgIHNldCh2YWx1ZTogSVZhbHVlKTogSVZhbHVlXG59XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBWYWx1ZSBpbXBsZW1lbnRzIElWYWx1ZSB7XG4gICByZWFkb25seSB0eXBlOiBJVHlwZTtcblxuICAgY29uc3RydWN0b3IodHlwZTogSVR5cGUpIHtcbiAgICAgIHRoaXMudHlwZSA9IHR5cGVcbiAgIH1cblxuICAgY2xvbmUoKTogSVZhbHVlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgY2xvbmUoKSBub3QgaW1wbGVtZW50ZWRgKVxuICAgfVxuXG4gICBlcXVhbHMob3RoZXI6IElWYWx1ZSk6IGJvb2xlYW4ge1xuICAgICAgaWYoIXRoaXMudHlwZS5lcXVhbHMob3RoZXIudHlwZSkpIHtcbiAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgfVxuXG4gICBzZXQodmFsdWU6IElWYWx1ZSk6IElWYWx1ZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJzZXQoKSBub3QgaW1wbGVtZW50ZWQuXCIpO1xuICAgfVxufVxuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQmFzaWNWYWx1ZTxUPiBleHRlbmRzIFZhbHVlIHtcbiAgIGdldCB2YWx1ZSgpOiBUIHtcbiAgICAgIHJldHVybiB0aGlzLl92YWx1ZVxuICAgfVxuXG4gICBwcml2YXRlIF92YWx1ZTogVFxuXG4gICBjb25zdHJ1Y3Rvcih0eXBlOiBJVHlwZSwgdmFsdWU6IFQpIHtcbiAgICAgIHN1cGVyKHR5cGUpXG4gICAgICB0aGlzLl92YWx1ZSA9IHZhbHVlXG4gICB9XG5cbiAgIGNsb25lKCk6IElWYWx1ZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYGNsb25lKCkgbm90IGltcGxlbWVudGVkYClcbiAgIH1cblxuICAgc2V0KHZhbHVlOiBJVmFsdWUpOiBJVmFsdWUge1xuICAgICAgaWYoIXRoaXMudHlwZS5lcXVhbHModmFsdWUudHlwZSkpIHtcbiAgICAgICAgIHRocm93IG5ldyBFcnJvcihgSW5jb21wYXRpYmxlIHR5cGUgZW5jb3VudGVyZWQgd2hlbiB0cnlpbmcgdG8gc2V0IGEgVmFsdWVgKVxuICAgICAgfVxuXG4gICAgICB0aGlzLl92YWx1ZSA9ICh2YWx1ZSBhcyBCYXNpY1ZhbHVlPFQ+KS52YWx1ZVxuICAgICAgcmV0dXJuIHRoaXNcbiAgIH1cbn0iXX0=