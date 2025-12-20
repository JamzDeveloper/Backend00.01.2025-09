let numero: Number= 0;

let nombre = "Roberto";

function saludar(nombre:string): string {
    
    return `Hola ${nombre}`;
}

function despedir():void{

}

function sumar(a: number, b:number){
    return a+b;
}

let resultado: number = sumar(1,3);

function recordar(dato:any){

}

let nose: unknown= 0;

function throwError(message: string): never {
  throw new Error(message);
}

let obj = null;

let arrData: readonly string[] = ["ww","wq"];

// define our tuple
let ourTuple: [number, boolean, string];
let ourTuple2: readonly [number, boolean, string];
// initialize correctly
ourTuple = [5, false, 'Coding God was here'];

const car: { type: string, model: string, year: number } = {
  type: "Toyota",
  model: "Corolla",
  year: 2009
};

const car2: { type: string, mileage?: number } = { // no error
  type: "Toyota"
};
car2.mileage = 2000;
enum CardinalDirections {
  North,
  East,
  South,
  West
}
let currentDirection = CardinalDirections.North;
// logs 0
console.log(currentDirection);


type CarYear = number
type CarType = string
type CarModel = string
type Car = {
  year: CarYear,
  type: CarType,
  model: CarModel
}

const carYear: CarYear = 2001
const carType: CarType = "Toyota"
const carModel: CarModel = "Corolla"
const car3: Car = {
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

function divide({ dividend, divisor }: { dividend: number, divisor: number }) {
  return dividend / divisor;
}

let dato =divide({dividend:22,divisor:22});

let x: unknown = 'hello';
console.log((x as string).length);

let x2: unknown = 'hello';
console.log((<string>x2).length);

class Persona{
    private readonly nombre: string;
    public constructor(nombre:string){
        this.nombre = nombre;
    }
    public getnombre(): string{
        return this.nombre;
    }
}


interface Shape {
  getArea: () => number;
}

class Rectangle implements Shape {
    
  public constructor(protected readonly width: number, protected readonly height: number) {}
 public getArea(): number {
    return this.width * this.height;
  }
 public toString(): string {
    return `Rectangle[width=${this.width}, height=${this.height}]`;
  }
}

class Square extends Rectangle {
  public constructor(width: number) {
    super(width, width);
  }

  // this toString replaces the toString from Rectangle
  public override toString(): string {
    return `Square[width=${this.width}]`;
  }
}

abstract class Polygon {
  public abstract getArea(): number;

  public toString(): string {
    return `Polygon[area=${this.getArea()}]`;
  }
}