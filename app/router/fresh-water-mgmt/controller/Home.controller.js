sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/m/Dialog",
    "sap/ui/core/Fragment",
    "com/hcltech/sapeu/fresh-water-mgmt/js/axios",
  ],
  function (Controller, MessageBox, MessageToast, JSONModel, Filter, Dialog,Fragment,axios) {
    "use strict";
    var url,finalJsonData=[];
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

    var pickHex = function (color1, color2, weight) {
      var w1 = weight;
      var w2 = 1 - w1;
      var rgb = [
        Math.round(color1[0] * w1 + color2[0] * w2),
        Math.round(color1[1] * w1 + color2[1] * w2),
        Math.round(color1[2] * w1 + color2[2] * w2),
      ];
      return rgb;
    };

    return Controller.extend(
      "com.hcltech.sapeu.fresh-water-mgmt.controller.Home",
      {
        onPost: async function(oEvent){
          // var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
          // oRouter
          //   .navTo("CompanyComparision");
          // $.ajax({
          //   		url: "www.youtube.com",
          //   		method: "GET",
          //   		// async: false,
          //   		// dataType: "Application/json",
          //   		success: function (data) {
          //         debugger;
          //   			MessageBox.show(data);
          //   		},
          //   		error: function (xhr, err) {
          //   			debugger;
                  
          //   			MessageBox.error(err);
          //   		}
          //   	});
      //     fetch("https://ec2-3-109-153-122.ap-south-1.compute.amazonaws.com:8080/policy/",{
      //         "user_input": "How does Confidential and Proprietary Information is handled in HCL?",
      //         "source_check_box_cm": false,
      //         "format_check_box_cm": false
      //   },{
      //   headers:{
      //     "Accept":"application/json"
      //   }
      // })
      //   .then(function (response) {
      //     debugger;
      //     console.log(response);
      //   })
            var queryInputId = this.getView().getId()+"--"+"myPopover";
            var popOverListItems = this.getView().getId()+"--"+"idListOfQandA";
            var userQuery = oEvent.getSource().getValue();
            if(userQuery.length == 0){
              MessageToast.show("Please enter query");
              return;
            }
            if(userQuery =="can you please generate a new report"){
              var localData = this.getView().getModel("json").getProperty("/qAndAItems");
              this.getView().byId(queryInputId).setBusy(true);
              var chatboxId = this.getView().byId(queryInputId);
              await this.setBusychatInputBox(chatboxId);
              
                // this.getView().getModel("json").refresh();
              //}else{
              //   var url = window.location.href.substring(0,window.location.href.lastIndexOf("/"))+"/img/example.pdf";
              //   var obj = {};
              //   obj.query = "hcltech annual report";
              //   obj.answer = " click on the <a href='"+url+"'> link </a> to open pdf ";
              //   localData.push(obj);
              //   this.getView().getModel("json").setData(localData);
              //   this.getView().getModel("json").refresh();
              // //}
              //this.getView().byId(this.getView().getId()+"--"+"idDocLink").setVisible(true);
              return;
            }
            //jsonData.push(this.getView().getModel("json").getProperty("/qAndAItems"));
            this.getView().byId(queryInputId).setBusy(true);
            this.getView().getModel().read("/ChatBotQueries", {
              headers :{msg:userQuery} ,
              method: "GET",
              success: function (oData) {
                debugger;
                  var jsonModelArray = [],questionIndex = [];
                    oData.results.sort(function(a, b){
                      return a.createdAt - b.createdAt;
                    });
                  finalJsonData.push(oData.results[oData.results.length-1]);
                  this.getView().getModel("json").setProperty("/qAndAItems",finalJsonData);
                  // oData.results.forEach((element)=>{
                  //   if(new Date(element.createdAt).toISOString().substring(0,10) == new Date().toISOString().substring(0,10) ){
                  //     jsonModelArray.push(element);
                  //   }
                  // })
                  // jsonModelArray.sort(function(a, b){
                  //   return a.createdAt - b.createdAt;
                  // })
                  // if(jsonData.length>0){
                  //   for(let i = 0;i<jsonData.length; i++){
                  //     if(jsonData[i].query =="hcltech annual report"){
                  //       questionIndex.push(i);
                  //     }
                  //   }
                  // }


                  //TODO:- instead of index funda, append the newly created data to jsonData variable and remove the duplicates within the same.
                  // if(questionIndex.length>0){
                  //   for (let i = 0; i < questionIndex.length; i++) {
                      
                  //     jsonModelArray[questionIndex[i]].query = "can you please generate a new report";
                  //     jsonModelArray[questionIndex[i]].query = " click on the <a href='"+url+"'> link </a> to open pdf ";
                  //   }
                  // }//TODO close
                 
                  // jsonData.push(oData.results[oData.results.length-1]);
                  // this.getView().getModel("json").setProperty("/qAndAItems",jsonModelArray);

                  
                  this.getView().byId(queryInputId).setBusy(false);
                  this.getView().byId(popOverListItems).setVisible(true);
                  // MessageBox.success("Success");
              }.bind(this),
              error:function(err){
                debugger;
                this.getView().byId(queryInputId).setBusy(false);
                MessageBox.error(err);
              }.bind(this)
            });
        },
        setBusychatInputBox:function(chatboxId){
          new Promise (function(resolve,reject){
            setTimeout(function (){
              var localData = this.getView().getModel("json").getProperty("/qAndAItems");
              var popOverListItems = this.getView().getId()+"--"+"idListOfQandA";
              if(localData == undefined){
                localData =[];
              }
                url = window.location.href.substring(0,window.location.href.lastIndexOf("#"))+"img/report.pdf";
                var obj = {};
                obj.query = "can you please generate a new report";
                obj.answer = "Sure, I can. Please find the <a href='"+url+"'> link </a> to the report";
                localData.push(obj);
                finalJsonData = localData;
                this.getView().getModel("json").setProperty("/qAndAItems",finalJsonData);
                this.getView().byId(popOverListItems).setVisible(true);
                chatboxId.setBusy(false);
              resolve();
            }.bind(this), 5000);
          }.bind(this))
        },
        handleClosePopUpButton:function(oEvent){
          oEvent.getSource().getParent().getParent().close();
          var dataToBeRemoved = this.getView().getModel("json").getProperty("/qAndAItems");
          if(dataToBeRemoved.length > 0){
            for (let i = 0; i < dataToBeRemoved.length; i++) {
              if(dataToBeRemoved[i].query != "can you please generate a new report"){
                var sPath = "/ChatBotQueries(querynumber="+dataToBeRemoved[i].querynumber+")";
                this.getView().getModel().remove(sPath, {
                  success: function (oData) {
                    MessageToast.show("Successfully closed the session");
                    if(this.getView().byId(this.getView().getId()+"--"+"idDocLink").getVisible()){
                      this.getView().byId(this.getView().getId()+"--"+"idDocLink").setVisible(false);
                    }
                  }.bind(this),
                  error:function(err){
                    if(this.getView().byId(this.getView().getId()+"--"+"idDocLink").getVisible()){
                      this.getView().byId(this.getView().getId()+"--"+"idDocLink").setVisible(false);
                    }
                    MessageBox.error(err);
                    
                  }.bind(this)
                });
              }
            }
            this.getView().getModel("json").setProperty("/qAndAItems",null);
            finalJsonData=[];
          }
        },
        onInit: function () {
          var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
          oRouter
            .getRoute("Home")
            .attachPatternMatched(function (oEvent) {
              debugger;
              // this.getView().getModel().read("/ChatBotQueries", {
              //   headers :{msg:"initalValue"} ,
              //   method: "GET",
              //   success: function (oData) {
              //     debugger;
              //     jsonData.push(oData.results);
              //     console.log("initialValue called");
              //   }.bind(this),
              //   error:function(err){
              //     debugger;
              //     MessageBox.error(err);
              //   }.bind(this)
              // });
              this.getView().getModel().read("/SensorData",{
                success:function(oData){
                  debugger;
                  this.getView().getModel("json").setProperty("/realTimeData",oData.results);
                }.bind(this),
                error:function(err){
                  debugger;
                  console.log(err)
                }
              })
            }, this);
        },
        chatBotPress:function(oEvent){
            var oButton = oEvent.getSource(),
            oView = this.getView();
            if (!this._pPopover) {
              this._pPopover = Fragment.load({
                id: oView.getId(),
                name: "com.hcltech.sapeu.fresh-water-mgmt.fragments.ChatBotPopover",
                controller: this
              }).then(function(oPopover) {
                oView.addDependent(oPopover);
                oPopover.bindElement("/ProductCollection/0");
                return oPopover;
              });
            }
            this._pPopover.then(function(oPopover) {
              oPopover.openBy(oButton);
            });
        },
        onAfterRendering: function (oEvent) {
          this.getView().getModel().read("/WaterConsumptionPurposes", {
              urlParameters: {
                $apply:
                  "groupby((Purpose),aggregate(Quantity with sum as TotalConsumption))",
              },
              success: ((data) => {
                debugger;
                this.getView()
                  .getModel("json")
                  .setProperty("/WaterConsumptionAggregation", data.results);
                this.getView()
                  .getModel("json")
                  .setProperty("/TotalWaterConsumption",parseInt(data.results.map(d=>d.TotalConsumption).reduce((i,m)=>i+m,0)));
                  debugger;
              }).bind(this),
              error:function(err){
                debugger;
              }
            });
        },
        chartColorIndexFormatter:function(purpose){
          var list = this.getView().getModel("json").getProperty("/WaterConsumptionAggregation");
          return colorBand[list.findIndex(item=>item.Purpose === purpose)];
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
            var oVizFrame3 = sap.ui.getCore().byId("idVizFrame3");
            var vizPopover3 = new sap.viz.ui5.controls.Popover({});
            vizPopover3.connect(oVizFrame3.getVizUid());
            oPopover.setBusy(true);
            this.getView().getModel().read("/SensorData",{
              success:function(odata){
                odata.results.sort(function(a,b){
                  return new Date(b.timeOfLastDataPulledFromApi) - new Date(a.timeOfLastDataPulledFromApi);
                });
                this.getView().getModel("json").setProperty("/SensorData",odata.results);
                let groupingViaSensorNames = Object.values(
                  odata.results.reduce((acc, current) => {
                      acc[current.name] = acc[current.name] ?? [];
                      acc[current.name].push(current);
                      return acc;
                  }, {})
              );
              let sensorNames ="";
              for (let index = 0; index < groupingViaSensorNames.length; index++) {
                sensorNames = sensorNames+(odata.results[0].unit+"_"+groupingViaSensorNames[index][index].name+',');
              }
              this.getView().getModel("json").setProperty("/SensorData/0/sensorNames",sensorNames);
              oPopover.setBusy(false);
              }.bind(this),
              error:function(){
                oPopover.setBusy(false);
                MessageBox.error("Unable to read Sensor Data");
              }.bind(this)
            });
            this.getView().getModel().read("/FlowEvent",{
              success:function(odata){
                debugger;
                this.getView().getModel("json").setProperty("/SensorTrend2",odata.results);
                
              }.bind(this),
              error:function(){
                debugger;
                
                MessageBox.error("Unable to read Sensor Data");
              }.bind(this)
            });
          }.bind(this));
        },
        formatterForSpecificQuestion:function(ans){
          debugger;
          if(ans == "can you please generate a new report"){
            return new sap.m.Link("idLink",{
              text:"please click this link to open the pdf",
              target:"_blank",
              href:"img/example.pdf"
            });
          }else{
            return ans;
          }
        },
        chartNameFormatter:function(name){
          if(name && name =="COM1"){
            return "Air O Water outlet";
          }
          if(name && name =="COM2"){
            return "Dishwasher";
          }
        },
        
        chartFormatterForTimeStamp:function(dt){
          if(dt){
            debugger;
            return new Date(dt);
          }
        },
        chartFormatterForsensorId:function(untId,inltName){
          debugger;
          if(untId && inltName){
            var val = untId+"_"+inltName
            return val;
          }
        },
        handleClose:function(){
          this.oPopover.close();
        },
        selectRegion: function (oEvent) {
          var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
          oRouter.navTo("ObjectDetail", {
            region: "CHENNAI",
          });
        },
      //   callApi:function(){
      //     var fromDate = new Date();
      //     fromDate.setDate(fromDate.getDate()-1);
      //     fromDate = fromDate.toISOString().substring(0,10)
      //     var toDate = new Date();
      //     toDate = toDate.toISOString().substring(0,10)
    
      //     fetch("https://7jy8ydv8v3.execute-api.us-east-2.amazonaws.com/prod/readings",{
      //     "from_date":fromDate,
      //     "to_date":toDate
      // },{
      //   headers:{
      //     "Accept":"application/json",
      //     "Content-Type":"application/json;charset=utf-8",
      //     "x-api-key":"5vCyULmULQamG6LNSjobc9KmFswXQD259c9b1ScA"
      //   }
      // })
      //   .then(function (response) {
      //     debugger;
      //     let block = response?.data?.data?.blocks?.find(d=>d.block_name === "block001");
      //     return block?.units?.[0]?.inlets?.map(d=>{
      //       d.FromDate = new Date(fromDate);
      //       d.ToDate = new Date(toDate);
      //       d.block = block.block_name;
      //       d.unit = block.units[0].unit_no;
      //       d.last_updated_time = new Date(d.last_updated_time)
      //       return d;
      //     });
      //   })
      //   }
      }
    );
  }
);

