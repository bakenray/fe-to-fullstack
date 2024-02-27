const a = 10;
const b = "hello";
const c = () => {
  return "Node.js ESModules";
};
const d = "alias";
const e = "export default";
export { a, b, c, d as alias };
export default e;
