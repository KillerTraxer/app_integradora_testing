import app from "./app.js";
import {Connetion} from "./db.js";

Connetion();
app.listen(3000);
console.log("Server on port", 3000);