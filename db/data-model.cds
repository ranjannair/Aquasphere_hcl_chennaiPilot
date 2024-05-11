using {
    User,
    managed,
    cuid
} from '@sap/cds/common';

namespace my.bookshop;

entity Books {
  key ID : Integer;
  title  : String;
  stock  : Integer;
}




entity FlowEvent{
  msg_type: String;
  key sensor_id: String;
  key site_id: String(6);
  site_name: String;
  block_name:String; 
  key unit_id: String;
  unit_name: String;
  inlet_name: String;
  cumulative: Integer; 
  key timestamp: DateTime;
}

entity SensorData {
    key FromDate          : Date;
    key ToDate            : Date;
    key name              : String;
        totalWaterUsed    : Integer64;
        block             : String;
        unit              : Integer64;
        consumption       : Integer64;
        cumulative        : Integer64;
        last_updated_time_of_Sensor : DateTime;
    key timeOfLastDataPulledFromApi : DateTime;
}

entity ChatBotQueries : managed {
  key querynumber : Integer64;
  query : LargeString;
  answer  : LargeString;
  remarks : LargeString;
}


entity WaterConsumptionPurposes {
    key Infrastructure_ID : UUID;
    key Month          : Date       @sap.label : 'Month';
    key Purpose        : String(64) @sap.label : 'Purpose';
        Quantity       : Integer    @sap.label : 'Quantity';
}




// entity Sensors{
//   ID: String;
//   consumption: Integer;
//   cumulative : Integer;
//   last_updated_time: String;
// }

// entity SiteDetails{
//   key totalWaterUsed : Integer; //water used graph in annualwater conservation index


// }
// entity WaterFlowPurposes {
//     key block_name : String;
//     key purpose    : String;       // water flown via sensor 4 which purpose(flush,drink or consrvation from terrace)
//         Quantity   : Integer;    //usage in ltrs
//         last_updated_time  : DateTime; 

// };
// entity Site{
//   key name: String;
//   blocks: Association to blocks;
//   units: Association to units;

// }

// chang the time stamp field to stirng and then do deployment
// in server.js you need to write the sql queries absed on the json object that you get
// need to adjust csrf token inside in your requests
// in Ui you need to handle the time stamp and convert it into date
// add app folder, db tables,of aquasphere and to this project