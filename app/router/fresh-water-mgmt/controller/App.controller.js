sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/Fragment"
], function(Controller,MessageBox,JSONModel,Fragment) {
	"use strict";
	return Controller.extend("com.hcltech.sapeu.fresh-water-mgmt.controller.App", {
		onInit:function(){
			
		},
		onAfterRendering:function(){
			
			this.getView().getModel("json").setProperty("/CurrentDate",new Date());
		},
		navToHome:function(){
			location.href="#/"
		},
		onPressAvatar:function(oEvent){
			var oButton = oEvent.getSource(),
				oView = this.getView();

			if (!this._pQuickView) {
				this._pQuickView = Fragment.load({
					id: oView.getId(),
					name: "com.hcltech.sapeu.fresh-water-mgmt.fragments.QuickViewAvatarConfiguration",
					controller: this
				}).then(function (oQuickView) {
					oQuickView.setModel(this.oModel);
					oView.addDependent(oQuickView);
					return oQuickView;
				}.bind(this));
			}
			this._pQuickView.then(function(oQuickView) {
				oQuickView.openBy(oButton);
			});
		}
	});
});