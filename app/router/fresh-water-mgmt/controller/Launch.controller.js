sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
  ],
  function (Controller, MessageBox, JSONModel) {
    "use strict";
    return Controller.extend(
      "com.hcltech.sapeu.fresh-water-mgmt.controller.Launch",
      {
        onAfterRendering: function () {
          this.getView().setModel(
            new JSONModel({
              object: {
                "sap.app": {
                  id: "sample.CardsLayout.model.object",
                  type: "card",
                },
                "sap.card": {
                  type: "Object",
                  data: {
                    json: {
                      firstName: "Donna",
                      lastName: "Mendez",
                      position: "Corporate Sustainability Officer",
                      mobile: "+1 202 34869-0",
                      phone: "+1 202 555 5555",
                      email: "donna@peachvalley.com",
                    },
                  },
                  header: {
                    icon: {
                      text: "DM",
                    },
                    title: "{firstName} {lastName}",
                    subTitle: "{position}",
                    actions: [
                      {
                        type: "Navigation",
                        parameters: {
                          url: "users/donnaMendez",
                        },
                      },
                    ],
                  },
                  content: {
                    groups: [
                      {
                        title: "Peach Valley Inc.",
                        items: [
                          {
                            label: "Mobile",
                            value: "{mobile}",
                            actions: [
                              {
                                type: "Navigation",
                                parameters: {
                                  url: "tel:{mobile}",
                                },
                              },
                            ],
                          },
                          {
                            label: "Phone",
                            value: "{phone}",
                            actions: [
                              {
                                type: "Navigation",
                                parameters: {
                                  url: "tel:{phone}",
                                },
                              },
                            ],
                          },
                          {
                            label: "Email",
                            value: "{email}",
                            actions: [
                              {
                                type: "Navigation",
                                parameters: {
                                  url: "mailto:{email}",
                                },
                              },
                            ],
                          },
                        ],
                      },
                    ],
                    actions: [
                      {
                        type: "Navigation",
                        parameters: {
                          url: "users/donnaMendez",
                        },
                      },
                    ],
                  },
                },
              },
            }),
            "cards"
          );
        },
        openURL:(oEvent)=>{
          location.href = oEvent.getSource().getUrl();
        }
      }
    );
  }
);
