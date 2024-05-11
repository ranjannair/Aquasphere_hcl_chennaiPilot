sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/ui/model/json/JSONModel",
	"sap/viz/ui5/format/ChartFormatter",
	'sap/ui/core/Fragment',
	"sap/ui/model/Filter",
    "com/hcltech/sapeu/fresh-water-mgmt/js/Formatter"
], function(Controller,MessageBox,JSONModel,ChartFormatter, Fragment, Filter,Formatter) {
	"use strict";
	var campusCode;
	return Controller.extend("com.hcltech.sapeu.fresh-water-mgmt.controller.Infrastructure", {
		Formatter:Formatter,
        chartRendered: function(oEvent) {
            (new sap.viz.ui5.controls.Popover()).connect(oEvent.getSource().getVizUid());
        },
		periodChange:function(oEvent){
			var periodMonths = parseInt(this.getView().getModel("json").getProperty("/aggregatePeriod"));
			
			this.getView().getModel("json").setProperty("/fromMonth",-periodMonths);
			this.getView().getModel("json").setProperty("/toMonth",0);
			
			this.applyAnalyticFilters();
		  },
		  
		onInit:function(){
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("Infrastructure").attachPatternMatched(function(oEvent){
				campusCode = oEvent.getParameter("arguments").id;

				var filters = [new Filter("Infrastructure_ID","EQ",campusCode)]
                this.byId("WaterRequirementForecase")
                  .getBinding("data")
                  .filter(filters);
				this.byId("WaterQualityDataset")
                  .getBinding("data")
                  .filter(filters);
				  this.byId("WaterSources")
                  .getBinding("data")
                  .filter(filters);
				
				let sensorTrend=[];
				for(let i = 0;i<30;i++){
					let sensorValue = {
						Date : new Date(),
						Consumption : Math.round(Math.random()*400+800)
					};
					sensorValue.Date.setDate(sensorValue.Date.getDate()-i);
					sensorTrend.push(sensorValue);
				}
				sensorTrend.reverse();
				this.getView().getModel("json").setProperty("/SensorTrend",sensorTrend);

				this.getView().bindElement("/Infrastructure(guid'"+campusCode+"')");
				var deviceId = oEvent.getParameter("arguments").deviceId;
				if(deviceId){
					this.openDevice()
				}
				this.getView().getModel("json").setProperty("/fromMonth",-12);
          		this.getView().getModel("json").setProperty("/toMonth",0);
				this.getView().getModel("json").setProperty("/aggregatePeriod","12");
				
				this.applyAnalyticFilters();
				
			}, this);
		},
		applyAnalyticFilters:function(){
			 
			var fromDate = new Date();
          	var toDate = new Date();

			fromDate.setMonth(fromDate.getMonth()+this.getView().getModel("json").getProperty("/fromMonth"),1)
			toDate.setMonth(toDate.getMonth()+this.getView().getModel("json").getProperty("/toMonth")-1,1)
			var filters = [new Filter("Infrastructure_ID","EQ",campusCode), new Filter("Month", "BT",fromDate,toDate)];
			this.byId("WaterQualityDataset")
            .getBinding("data")
            .filter(filters);
          this.byId("WaterRequirementForecase")
            .getBinding("data")
            .filter(filters);
		  this.byId("WaterConsumptionByPurposes")
            .getBinding("data")
            .filter(filters);
          this.byId("WaterSources")
            .getBinding("data")
            .filter(filters);
			
		},
		openDevice:function(){
			var oView = this.getView();
			// create popover
			if (!this._pPopover) {
				this._pPopover = Fragment.load({
					name: "com.hcltech.sapeu.fresh-water-mgmt.fragments.DevicePopup",
					controller: this
				}).then(function(oPopover) {
					oView.addDependent(oPopover);
					//oPopover.bindElement("/ProductCollection/0");
					this.oPopover = oPopover;
					return oPopover;
				}.bind(this));
			}
			
			this._pPopover.then(function(oPopover) {
				oPopover.open();
				oPopover.setBusy(true);
				this.getView().getModel().read("/SensorData",{
					success:function(odata){
						this.getView().getModel("json").setProperty("/SensorData",odata.results);
						oPopover.setBusy(false);
					}.bind(this),
					error:function(){
						oPopover.setBusy(false);
						MessageBox.error("Unable to read Sensor Data");
					}.bind(this)
				});
			}.bind(this));
		},
		handleClose:function(){
			this.oPopover.close()
		},
		onAfterRendering:function(){
			this.getView().getModel("json").setProperty("/fromMonth",-12);
			this.getView().getModel("json").setProperty("/toMonth",0);
			this.getView().getModel("json").setProperty("/aggregatePeriod","12")
  
			this.byId("rangeSlider").bindProperty("value",{path:"json>/fromMonth"});
			this.byId("rangeSlider").bindProperty("value2",{path:"json>/toMonth"});
			
  
		  },
	});
});