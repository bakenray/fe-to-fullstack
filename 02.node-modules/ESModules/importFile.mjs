import { a, b, c, alias as d } from "./exportFile.mjs";
import exportDefault from "./exportFile.mjs";
import * as obj from "./exportFile.mjs";
import commonJSFile from "../CommonJS/exportFile";

console.log("a", a);
console.log("b", b);
console.log("c", c());
console.log("d", d);
console.log("exportDefault", exportDefault);
console.log("obj", obj);
console.log("commonJSFile", commonJSFile);
