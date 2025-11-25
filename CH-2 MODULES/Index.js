const { add, sub, mul } = require('./Modules/Math');

console.log("\nADDITION", add(100, 20));
console.log("SUBTRACTION", sub(50, 10));
console.log("MULTIPLICATION", mul(20, 10));

const students = {
    name: "Rushi",
    age: 17,
    course: "Full Stack"
}


const array = [1, 2, 3, "Hello", 9.09];

let { name, age, course } = students;

let [a, b, c, d, e] = array;

console.log("\nNAME :", name);
console.log("AGE :", age);
console.log("COURSE :", course);

console.log("\nARRAY VALUES:");
console.log(a);
console.log(b);
console.log(c);
console.log(d);
console.log(e); 