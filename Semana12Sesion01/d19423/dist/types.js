var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var numero = 0;
var nombre = "Roberto";
function saludar(nombre) {
    return "Hola ".concat(nombre);
}
function despedir() {
}
function sumar(a, b) {
    return a + b;
}
var resultado = sumar(1, 3);
function recordar(dato) {
}
var nose = 0;
function throwError(message) {
    throw new Error(message);
}
var obj = null;
var arrData = ["ww", "wq"];
// define our tuple
var ourTuple;
var ourTuple2;
// initialize correctly
ourTuple = [5, false, 'Coding God was here'];
var car = {
    type: "Toyota",
    model: "Corolla",
    year: 2009
};
var car2 = {
    type: "Toyota"
};
car2.mileage = 2000;
var CardinalDirections;
(function (CardinalDirections) {
    CardinalDirections[CardinalDirections["North"] = 0] = "North";
    CardinalDirections[CardinalDirections["East"] = 1] = "East";
    CardinalDirections[CardinalDirections["South"] = 2] = "South";
    CardinalDirections[CardinalDirections["West"] = 3] = "West";
})(CardinalDirections || (CardinalDirections = {}));
var currentDirection = CardinalDirections.North;
// logs 0
console.log(currentDirection);
var carYear = 2001;
var carType = "Toyota";
var carModel = "Corolla";
var car3 = {
    year: carYear,
    type: carType,
    model: carModel
};
// interface Rectangle {
//   height: number,
//   width: number
// }
// const rectangle: Rectangle = {
//   height: 20,
//   width: 10
// };
function divide(_a) {
    var dividend = _a.dividend, divisor = _a.divisor;
    return dividend / divisor;
}
var dato = divide({ dividend: 22, divisor: 22 });
var x = 'hello';
console.log(x.length);
var x2 = 'hello';
console.log(x2.length);
var Persona = /** @class */ (function () {
    function Persona(nombre) {
        this.nombre = nombre;
    }
    Persona.prototype.getnombre = function () {
        return this.nombre;
    };
    return Persona;
}());
var Rectangle = /** @class */ (function () {
    function Rectangle(width, height) {
        this.width = width;
        this.height = height;
    }
    Rectangle.prototype.getArea = function () {
        return this.width * this.height;
    };
    Rectangle.prototype.toString = function () {
        return "Rectangle[width=".concat(this.width, ", height=").concat(this.height, "]");
    };
    return Rectangle;
}());
var Square = /** @class */ (function (_super) {
    __extends(Square, _super);
    function Square(width) {
        return _super.call(this, width, width) || this;
    }
    // this toString replaces the toString from Rectangle
    Square.prototype.toString = function () {
        return "Square[width=".concat(this.width, "]");
    };
    return Square;
}(Rectangle));
var Polygon = /** @class */ (function () {
    function Polygon() {
    }
    Polygon.prototype.toString = function () {
        return "Polygon[area=".concat(this.getArea(), "]");
    };
    return Polygon;
}());
