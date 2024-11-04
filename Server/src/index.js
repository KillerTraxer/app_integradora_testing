import config from "./config/index.js";

const port = config.PORT

import app from "./app.js";
import {Connetion} from "./db.js";

Connetion();
app.listen(port);
console.log("Server on port", port);