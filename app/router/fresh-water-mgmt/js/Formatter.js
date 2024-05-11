sap.ui.define([
], function(JSONModel, Device) {
	"use strict";
	return {
		example: function(name) {
			return "Hello " + name;
		},
		monthCalculation: function(subMonth) {
			let month = new Date();
			month.setMonth(month.getMonth()+subMonth,1);
			return ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][month.getMonth()]+ " " + month.getFullYear()
		}
	};
});