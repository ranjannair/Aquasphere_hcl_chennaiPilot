sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/m/Dialog",
  ],
  function (Controller, MessageBox, MessageToast, JSONModel, Filter, Dialog) {
    "use strict";

    return Controller.extend(
      "com.hcltech.sapeu.fresh-water-mgmt.controller.CompanyComparision",
      {
        onAfterRendering: function(){
          var date = new Date("2020-03-01");
          let peerComparision = new Array();
          
          for(;date < new Date();date.setMonth(date.getMonth()+1,1)){
            peerComparision.push({
              WaterConservationIndex:Math.random()*15+40,
              WaterIntensityRevenue : Math.random()*30+120,
              WaterIntensityEmployee : Math.random()*10+110,
              Month : new Date(date),
              CompanyName : "Boxtron"
            });
            peerComparision.push({
              WaterConservationIndex:Math.random()*20+80,
              WaterIntensityRevenue : Math.random()*20+40,
              WaterIntensityEmployee : Math.random()*9+50,
              Month : new Date(date),
              CompanyName : "Caterex"
            });
            peerComparision.push({
              WaterConservationIndex:Math.random()*20+130,
              WaterIntensityRevenue : Math.random()*20+10,
              WaterIntensityEmployee : Math.random()*5+35,
              Month : new Date(date),
              CompanyName : "Sinolex"
            });
            peerComparision.push({
              WaterConservationIndex:Math.random()*20+105,
              WaterIntensityRevenue : Math.random()*20+70,
              WaterIntensityEmployee : Math.random()*8+20,
              Month : new Date(date),
              CompanyName : "Tamtex"
            });
          }
          this.getView().getModel("json").setProperty("/PeerComparision",peerComparision);
          this.getView().getModel("json").setProperty("/aggregatePeriod",36);
          this.byId("companySelection").setSelectedItems(this.byId("companySelection").getItems())
        },
        periodChange:function(oEvent){
          var periodMonths = parseInt(this.getView().getModel("json").getProperty("/aggregatePeriod"));
          
          this.getView().getModel("json").setProperty("/fromMonth",-periodMonths);
          this.getView().getModel("json").setProperty("/toMonth",0);
          
          this.applyAnalyticFilters();
          },
        applyAnalyticFilters:function(oEvent){
          var filters = [];
         var selectedCompanies =  this.byId("companySelection").getSelectedItems().map((item)=>{
            return item.mProperties.key;
        });
        for(var i=0;i<selectedCompanies.length;i++){
          filters.push(new Filter("CompanyName","EQ",selectedCompanies[i]));
        }

          var fromDate = new Date();
          var toDate = new Date();
    
          fromDate.setMonth(fromDate.getMonth()+this.getView().getModel("json").getProperty("/fromMonth"),1)
          toDate.setMonth(toDate.getMonth()+this.getView().getModel("json").getProperty("/toMonth")-1,1)
          //var filters = [new Filter("CompanyName","EQ",campusCode), new Filter("Month", "BT",fromDate,toDate)];
          filters.push(new Filter("Month", "BT",fromDate,toDate));
          this.byId("WaterConsumptionTrendDataset")
                .getBinding("data")
                .filter(filters);
              this.byId("WaterIntensityRevenueDataset")
                .getBinding("data")
                .filter(filters);
          this.byId("WaterIntensityEmployeeDataset")
                .getBinding("data")
                .filter(filters);
          
        }
      }
    );
  }
);

