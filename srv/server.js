
const cds = require("@sap/cds");
const proxy = require("@sap/cds-odata-v2-adapter-proxy");

const implementation = async (app) => {
    app.use(proxy()); // for converting odata V4 to V2
    app.use("/readings", require("./rest-service"));
}  


cds.on("bootstrap", async (app) => await implementation(app));

module.exports = cds.server; 