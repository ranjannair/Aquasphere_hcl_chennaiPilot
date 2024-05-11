using my.bookshop as my from '../db/data-model';

service CatalogService {
    entity Books as projection on my.Books;
    entity FlowEvent as projection on my.FlowEvent;
    entity SensorData as projection on my.SensorData;
    entity WaterConsumptionPurposes as projection on my.WaterConsumptionPurposes;
    entity ChatBotQueries as projection on my.ChatBotQueries;
    // function myfoobar(msg:String) returns String;
}
