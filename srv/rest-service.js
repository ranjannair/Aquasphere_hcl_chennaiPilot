
const app = require("express")();
var bodyParser = require('body-parser');
const cds = require("@sap/cds");
const { SELECT, INSERT, UPDATE, DELETE } = cds.ql;

app.use(bodyParser.json());
app.post("",(req, res) => {
    console.log(req.body);
    console.log(req.body.timestamp.toString());
    // res.send("OK");
    // here you need to write to db tables using cql queries
    // create data
    let q = INSERT([
    {
        msg_type: req.body.msg_type,
        sensor_id: req.body.sensor_id,
        site_id: req.body.site_id,
        site_name: req.body.site_name,
        block_name: req.body.block_name,
        unit_id: req.body.unit_id,
        unit_name: req.body.unit_name,
        inlet_name: req.body.inlet_name,
        cumulative: req.body.cumulative,
        timestamp: new Date(req.body.timestamp*1000)
    },
    ]).into("my.bookshop.FlowEvent");

    q.then((data) => {
        res.status(200).send("Success");
    });
})

module.exports = app;