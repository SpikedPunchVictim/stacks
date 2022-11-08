"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StacksPostgresError = void 0;
class StacksPostgresError extends Error {
    constructor(msg) {
        super(`[stacks-postgres] ${msg}`);
    }
}
exports.StacksPostgresError = StacksPostgresError;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3RhY2tzUG9zdGdyZXNFcnJvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9TdGFja3NQb3N0Z3Jlc0Vycm9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLE1BQWEsbUJBQW9CLFNBQVEsS0FBSztJQUMzQyxZQUFZLEdBQVc7UUFDcEIsS0FBSyxDQUFDLHFCQUFxQixHQUFHLEVBQUUsQ0FBQyxDQUFBO0lBQ3BDLENBQUM7Q0FDSDtBQUpELGtEQUlDIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNsYXNzIFN0YWNrc1Bvc3RncmVzRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gICBjb25zdHJ1Y3Rvcihtc2c6IHN0cmluZykge1xuICAgICAgc3VwZXIoYFtzdGFja3MtcG9zdGdyZXNdICR7bXNnfWApXG4gICB9XG59Il19