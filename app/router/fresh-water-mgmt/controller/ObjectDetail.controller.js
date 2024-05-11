sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/base/Log",
    "sap/m/MessageBox",
    "sap/m/Dialog",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "com/hcltech/sapeu/fresh-water-mgmt/js/Formatter",
    "sap/ui/core/Fragment"
  ],
  function (Controller, Log, MessageBox, Dialog, Filter,FilterOperator,Formatter,Fragment) {
    "use strict";
    let colorBand = [
      "#5899DA",
      "#E8743B",
      "#19A979",
      "#ED4A7B",



      "rgba(218, 119, 242,1)",
      "rgba(59, 201, 219,1)",
      "rgba(255, 212, 59,1)",
      "rgba(255, 222, 235,1)",
      "rgba(34, 139, 230,1)",
      "rgba(34, 139, 230,1)",
    ];

    return Controller.extend(
      "com.hcltech.sapeu.fresh-water-mgmt.controller.CustomerDetail",
      {
        Formatter:Formatter,
        onAfterRendering:function(){
          
        },
        chartDataFill:function(){
          debugger;
          var date = new Date();
          var firstDay = new Date(date.getFullYear(), date.getMonth(), 1).toISOString().substring(0,10);
          var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().substring(0,10);
          let date_today = new Date();
          let first_day_of_the_week = new Date(date_today.setDate(date_today.getDate()- date_today.getDay())).toISOString().substring(0,10);
          let last_day_of_the_week = new Date(date_today.setDate(date_today.getDate()- date_today.getDay() + 6)).toISOString().substring(0,10);

          var filters = [];
          filters.push(new Filter("FromDate","EQ",firstDay));
          filters.push(new Filter("ToDate","EQ",lastDay));
          debugger;
          var bfilter = new Filter({
            path: "timeOfLastDataPulledFromApi",
            operator: FilterOperator.BT,
            value1: first_day_of_the_week,
            value2: last_day_of_the_week
          });
          this.getView().getModel().read("/SensorData", {
             filters:[bfilter],
            success: ((data) => {
              debugger;
              this.getView()
                .getModel("json")
                .setProperty("/chartData", data.results);
             
            }).bind(this),
            error:function(err){
              debugger;
            }
          });
        },
        onInit: function () {
          var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
          oRouter
            .getRoute("ObjectDetail")
            .attachPatternMatched(function (oEvent) {
              debugger;
              var oVizFrame1 = this.getView().byId("idVizFrame1");
              var vizPopover1 = new sap.viz.ui5.controls.Popover({});
              vizPopover1.connect(oVizFrame1.getVizUid());
              var oVizFrame2 = this.getView().byId("idVizFrame2");
              var vizPopover2 = new sap.viz.ui5.controls.Popover({});
              vizPopover2.connect(oVizFrame2.getVizUid());
              var args = oEvent.getParameter("arguments");
              this.getView().setBusy(true);
              this.getView().getModel().read("/SensorData",{
                success:function(odata){
                  this.getView().setBusy(false);
                  this.getView().getModel("json").setProperty("/chartData", odata.results);
                  var chartData = [],newArr=[],newArrForCurrentDayChart=[],newArrForTotalWaterUsed=[];
                  odata.results.map(fillVal=>{
                      if(fillVal.ToDate.toISOString().substring(0,10) == new Date().toISOString().substring(0,10)){
                          newArrForTotalWaterUsed.push(fillVal.totalWaterUsed) ;
                          newArrForCurrentDayChart.push(fillVal);
                      }
                  })
                  console.log(newArr);
                  //this.getView().getModel("json").setProperty("/chartData", odata.results);
                  for (let index = 0; index < odata.results.length; index++) {
                    if(odata.results[index].timeOfLastDataPulledFromApi.toISOString().substring(0,10) == new Date().toISOString().substring(0,10) ){
                      chartData.push(odata.results[index]);
                    }
                  }
                  
                  odata.results.sort(function(a,b){
                    return new Date(b.timeOfLastDataPulledFromApi) - new Date(a.timeOfLastDataPulledFromApi);
                  });
                  //this.getView().getModel("json").setProperty("/chartData", newArrForCurrentDayChart);
                  this.getView().getModel("json").setProperty("/SensorData",odata.results);
                  this.getView().getModel("json").setProperty("/SensorData/0/conservedWater",0);
                  let conservedWater = this.getView().getModel("json").getProperty("/SensorData/0/conservedWater");
                  this.getView().byId("waterConservationIndexChart").getColumns()[0].setValue(parseInt(odata.results[0].totalWaterUsed));
                  this.getView().byId("waterConservationIndexChart").getColumns()[1].setValue(parseInt(conservedWater));
                  let waterUsedPerEmpInChennaiLoc = parseInt(odata.results[0].totalWaterUsed)/40000;
                  let totalWaterUsedTodayInChennaiLoc = 0.25*parseInt(odata.results[0].totalWaterUsed); // considering water is only from municipality so its 25 rs/KL
                  this.getView().getModel("json").setProperty("/SensorData/0/totalWaterUsedTodayInChennaiLoc",totalWaterUsedTodayInChennaiLoc);
                  this.getView().getModel("json").setProperty("/SensorData/0/waterUsedPerEmpInChennaiLoc",waterUsedPerEmpInChennaiLoc);
                  this.getView().byId("waterUsedPerEmpInChennaiLoc").setValue(waterUsedPerEmpInChennaiLoc);
                  //this.chartDataFill();
                }.bind(this),
                error:function(err){
                  debugger;
                  console.log(err)
                }
              })
              this.getView().getModel().read("/FlowEvent",{
                success:function(odata){
                  debugger;
                  this.getView().setBusy(false);
                  //this.getView().getModel("json").setProperty("/chartData", odata.results);
                  
                }.bind(this),
                error:function(err){
                  debugger;
                  console.log(err)
                }
              })
            }, this);
        },
        chartNameFormatter:function(name){
          if(name && name =="COM1"){
            return "Air O Water outlet";
          }
          if(name && name =="COM2"){
            return "Dishwasher";
          }
        },
        chartColorIndexFormatter:function(purpose){
          debugger;
          var list = this.getView().getModel("json").getProperty("/WaterConsumptionAggregation");
          return colorBand[list.findIndex(item=>item.Purpose === purpose)];
        },
        recenterMap: function (oEvent) {
          var avgLatLng = [0, 0, 0];
          if (this.byId("locationsMap").getVos().length === 0) {
            return;
          }
          this.byId("locationsMap")
            .getVos()
            .map((vos) => {
              var latLng = vos.getItems()[0].getPosition().split(";");
              avgLatLng[0] += parseFloat(latLng[0]);
              avgLatLng[1] += parseFloat(latLng[1]);
              //console.log(vos.getItems()[0].getPosition())
            });
          avgLatLng[0] /= this.byId("locationsMap").getVos().length;
          avgLatLng[1] /= this.byId("locationsMap").getVos().length;
          //console.log(avgLatLng);
          this.byId("locationsMap").setCenterPosition(avgLatLng.join(";"));
        },
        periodChange:function(oEvent){
          var periodMonths = parseInt(this.getView().getModel("json").getProperty("/aggregatePeriod"));
          
          this.getView().getModel("json").setProperty("/fromMonth",-periodMonths);
          this.getView().getModel("json").setProperty("/toMonth",0);
          
          this.applyAnalyticFilters();
        },
        applyAnalyticFilters: function (/*No Arguments */) {

          var campusesData = this.byId("campusSelection")
            .getSelectedItems()
            .map((item) => {
              return item.getBindingContext().getObject();
            });

          this.byId("locationsMap")
            .getBinding("vos")
            .filter(campusesData.map((d) => new Filter("ID", "EQ", d.ID)));

          var filters = campusesData.map(
            (d) => new Filter("Infrastructure_ID", "EQ", d.ID)
          );

          var fromDate = new Date();
          var toDate = new Date();

          fromDate.setMonth(fromDate.getMonth()+this.getView().getModel("json").getProperty("/fromMonth"),1)
          toDate.setMonth(toDate.getMonth()+this.getView().getModel("json").getProperty("/toMonth")-1,1)
          
          filters.push(new Filter("Month", "BT",fromDate,toDate)); 
          
          
          
          this.byId("WaterConsumptionTrendDataset")
            .getBinding("data")
            .filter(filters);
          this.byId("WaterIntensityTrendDataset")
            .getBinding("data")
            .filter(filters);
          this.byId("WaterIntensityPerEmployeeTrendDataset")
            .getBinding("data")
            .filter(filters);
          this.byId("WaterRechargeTrendDataset")
            .getBinding("data")
            .filter(filters);
          this.byId("WaterQualityDataset")
            .getBinding("data")
            .filter(filters);
          this.byId("WaterConsumptionDataset")
            .getBinding("data")
            .filter(filters);
            
        },
        selectCampus: function (oEvent) {
          var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
          oRouter.navTo("Infrastructure", {
            id: oEvent.getSource().getBindingContext().getProperty("ID"),
          });
        },
        onPressActionButton:function(oEvent){


          
          //this.getView().getModel().callFunction("/PublishToPeerNetwork")






          this.getView().byId("idBusyIndicator").open();
          setTimeout(function () {
            this.getView().getModel("json").setProperty("/syncedTimeStamp",new Date());
            this.getView().byId("idBusyIndicator").close();
            MessageBox.success("Water Usage and Conservation information has been published to Peer Network Database");
          }.bind(this), 5000);
        },
        onDialogClosed:function(oEvent){
          this.getView().byId("idBusyIndicator").close();
        }
      }
    );
  }
);
