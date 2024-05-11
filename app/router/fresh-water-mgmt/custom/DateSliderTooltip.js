sap.ui.define(
  ["sap/m/SliderTooltipBase", "sap/m/SliderTooltipBaseRenderer",
  "../js/Formatter"],
  function (SliderTooltipBase, SliderTooltipBaseRenderer,Formatter) {
    "use strict";

    return SliderTooltipBase.extend("com.hcltech.sapeu.fresh-water-mgmt.custom.DateSliderTooltip", {
      metadata: {
        properties: {
          dayValue: {
            type: "int",
            defaultValue: 0,
          },
        },
      },

      renderer: Object.assign(SliderTooltipBaseRenderer, {
        renderTooltipContent: (oRm, oControl) =>
          oRm
            .openStart("div", oControl.getId() + "-inner")
            .class("sapMSliderTooltipInput")
            .class(SliderTooltipBaseRenderer.CSS_CLASS)
            .openEnd()
            .text(Formatter.monthCalculation(oControl.getDayValue()))
            .close("div"),
      }),

      sliderValueChanged: function (iValue) {
        return this.setDayValue(iValue);
      },
    });
  }
);
