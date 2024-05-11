sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"com/hcltech/sapeu/fresh-water-mgmt/model/models",
	"sap/ui/model/odata/ODataModel",
	"sap/ui/model/json/JSONModel",
	"com/hcltech/sapeu/fresh-water-mgmt/js/Formatter"
], function(UIComponent, Device, models, ODataModel,JSONModel,Formatter) {
	"use strict";
	return UIComponent.extend("com.hcltech.sapeu.fresh-water-mgmt.Component", {
		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function() {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);
			
			// set the device model
			this.setModel(models.createDeviceModel(), "device");
			this.getRouter().initialize();
			setTimeout(function(){
				this.getModel("json").setProperty("/syncedTimeStamp",new Date("2023-05-15"));
			}.bind(this),1000);
			
		}
	});
});