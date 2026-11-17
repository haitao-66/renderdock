import { createKey } from "../src/db.js";

const [name = "default", plan = "free", quota = "200"] = process.argv.slice(2);
const key = createKey(name, plan, Number(quota));

console.log("API key created (it is shown only once):");
console.log(key);
console.log(`plan: ${plan}, monthly quota: ${quota}, name: ${name}`);
