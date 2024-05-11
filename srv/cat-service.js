const cds = require('@sap/cds');
const axios = require("axios").default;
const { SELECT, INSERT, UPDATE, DELETE} = cds.ql;

module.exports = cds.service.impl(function () {

    this.before("READ","SensorData", async (odataRequest) => {
        const tx = cds.tx();	
        console.log(odataRequest.data)
        odataRequest.data.timestamp = new Date(parseInt(odataRequest.data.timestamp));
        let ask = odataRequest.data.ask;
        // let fromDate = new Date().getTime();
        // fromDate = new Date(fromDate).toISOString().substring(0,10);
        // let toDate = new Date().getTime();
        // toDate = new Date(toDate).toISOString().substring(0,10);
        let url ="https://xpun5f63f53jryjtenb76k7l3q0xfnxz.lambda-url.ap-south-1.on.aws/?user_input="+ask;

        return axios
        .post(url,{
        headers:{
          "Accept":"application/json",
          "Content-Type":"application/json;charset=utf-8"
        }
      })
        .then(async function (response) {
          
          console.log("response data :-"+response.data.data);
          let block = response?.data?.data?.blocks?.find(d=>d.block_name === "Tower 2");
          const inlts = block.units[0].inlets;
          for (let i = 0; i < inlts.length; i++) {
            const insertData =[{
              FromDate : new Date(fromDate).toISOString().substring(0,10),
              ToDate   : new Date(toDate).toISOString().substring(0,10),
              name     : inlts[i].name,
              totalWaterUsed : block.units[0].total_usage,
              block     : block.block_name,
              unit      : block.units[0].unit_id,
              consumption : inlts[i].consumption,
              cumulative: inlts[i].cumulative,
              last_updated_time_of_Sensor : new Date(inlts[i].last_updated_time),
              timeOfLastDataPulledFromApi : new Date().toISOString(),
            }];
            await INSERT(insertData).into('my.bookshop.SensorData');
          }
          //  block?.units?.[0]?.inlets?.map(async d=>{
          //   // d.FromDate = new Date(fromDate);
          //   // d.ToDate = new Date(toDate);
          //   // d.block = block.block_name;
          //   // d.unit = block.units[0].unit_no;
          //   // d.last_updated_time = new Date(d.last_updated_time)
          //   // d;
          //   const insertData =[{
          //     FromDate : new Date(fromDate).toISOString().substring(0,10),
          //     ToDate   : new Date(toDate).toISOString().substring(0,10),
          //     name     : d.name,
          //     totalWaterUsed : block.units[0].total_usage,
          //     block     : block.block_name,
          //     unit      : block.units[0].unit_id,
          //     consumption : d.consumption,
          //     cumulative: d.cumulative,
          //     last_updated_time : new Date(d.last_updated_time),
          //   }];
          //  // await tx.create('my.bookshop.SensorData').entries(insertData);
          //   await INSERT(insertData).into('my.bookshop.SensorData');
          //   //await tx.commit();
          //   // INSERT([
          //   //   {
          //   //     FromDate : new Date(fromDate),
          //   //     ToDate   : new Date(toDate),
          //   //     name     : d.name,
          //   //     totalWaterUsed : block.units[0].total_usage,
          //   //     block     : block.block_name,
          //   //     unit      : block.units[0].unit_id,
          //   //     consumption : d.consumption,
          //   //     cumulative: d.cumulative,
          //   //     last_updated_time : new Date(d.last_updated_time),
          //   //   },
          //   //   ]).into("my.bookshop.SensorData");
          // });
        })

    });

    

  this.before("READ","ChatBotQueries", async (odataRequest) => {
    const tx = cds.tx();	
    //console.log(odataRequest.data)
    //let query = "How does Confidential and Proprietary Information is handled in HCL?";
    var userQuery = odataRequest.headers.msg;
    return axios
    .get("https://8ewln41le0.execute-api.us-east-1.amazonaws.com/Dev/",{
        // headers:{
        // "Accept": "*/*",
        // "Accept":"Application/json",
        // "Connection":"keep-alive",
        // "InsecureSkipVerify": true
        // },
        data:{
            "query": userQuery
        }
    })
        .then(async function (response) {
            // let respo = response.data[0][1]; 
            const insertData =[{
            querynumber : parseInt(Math.random()*100),
            query :userQuery,
            answer : response.data.answer,
            remarks : "empty",
            }]
            
            // insertData.No = parseInt(Math.random()*100);
            // insertData.query = response.data[0][0];
            // insertData.answer = response.data[0][1];
            // console.log("response data :-"+insertData);
            
            
            console.log("response data :-"+insertData);
            await INSERT(insertData).into('my.bookshop.ChatBotQueries');
        })
    })
    
});