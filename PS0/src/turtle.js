"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleTurtle = void 0;
// A very basic, in-memory Turtle implementation for Problem Set 0.
var SimpleTurtle = /** @class */ (function () {
    function SimpleTurtle(startX, startY) {
        if (startX === void 0) { startX = 0; }
        if (startY === void 0) { startY = 0; }
        this.penColor = "black";
        this.path = []; // Store drawn lines
        this.x = startX;
        this.y = startY;
        this.headingDegrees = 0; // Start facing up
    }
    SimpleTurtle.prototype.forward = function (units) {
        var startPoint = { x: this.x, y: this.y };
        var headingRadians = (this.headingDegrees * Math.PI) / 180;
        this.x += units * Math.sin(headingRadians); // Y-axis is typically inverted in graphics
        this.y -= units * Math.cos(headingRadians);
        var endPoint = { x: this.x, y: this.y };
        this.path.push({ start: startPoint, end: endPoint, color: this.penColor });
    };
    SimpleTurtle.prototype.turn = function (degrees) {
        this.headingDegrees += degrees;
        this.headingDegrees = this.headingDegrees % 360; // Keep heading within 0-360 range
        if (this.headingDegrees < 0) {
            this.headingDegrees += 360; // Ensure heading is never negative
        }
    };
    SimpleTurtle.prototype.color = function (color) {
        this.penColor = color;
    };
    SimpleTurtle.prototype.getPosition = function () {
        return { x: this.x, y: this.y };
    };
    SimpleTurtle.prototype.getHeading = function () {
        return this.headingDegrees;
    };
    SimpleTurtle.prototype.getPath = function () {
        return this.path;
    };
    return SimpleTurtle;
}());
exports.SimpleTurtle = SimpleTurtle;
