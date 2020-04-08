<template>
  <div class="chart-vue">
    <div class="title" :style="{ color: getAQITextColor }"><slot></slot></div>
    <div ref="chart" class="chart"></div>
  </div>
</template>

<script>
import _ from 'lodash/fp';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themesAnimated from '@amcharts/amcharts4/themes/animated';

am4core.useTheme(am4themesAnimated);

export default {
  props: ['title', 'measurement', 'reversed'],
  data() {
    return {
      chart: {
        model: null,
        axis: {
          category: null,
          value: null,
        },
        series: null,
      },
    };
  },
  mounted() {
    // Create an amChart4 chart of type XYChart using the Vue $reference
    const chart = am4core.create(this.$refs.chart, am4charts.XYChart);

    // Assign a new category set on the y-axis and apply some properties
    const categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = 'city';
    categoryAxis.renderer.grid.template.stroke = am4core.color('#357a24');
    categoryAxis.renderer.grid.template.disabled = true;
    categoryAxis.renderer.minGridDistance = 10;
    categoryAxis.renderer.labels.template.fill = am4core.color('#357a24');
    categoryAxis.renderer.labels.template.truncate = true;
    categoryAxis.renderer.labels.template.width = 150;
    categoryAxis.renderer.labels.template.textAlign = 'end';
    // Disables the tooltip interaction for the categories axis
    categoryAxis.cursorTooltipEnabled = false;
    this.chart.axis.category = categoryAxis;

    // Assign a new value set on the x-axis and apply some properties
    const valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
    valueAxis.dataFields.value = 'value';
    valueAxis.renderer.grid.template.stroke = am4core.color('#357a24');
    valueAxis.renderer.grid.template.disabled = true;
    valueAxis.renderer.labels.template.fill = am4core.color('#357a24');
    valueAxis.renderer.labels.template.fillOpacity = 0;
    // Disables the tooltip interaction for the values axis
    valueAxis.cursorTooltipEnabled = false;
    this.chart.axis.value = valueAxis;

    // Declare a new Column data series to represent our data and apply some properties
    const series = chart.series.push(new am4charts.ColumnSeries());
    series.name = 'AQI';
    series.columns.template.fill = am4core.color('#01452c');
    series.columns.template.stroke = am4core.color('#357a24');
    const cellSize = 15;
    series.columns.template.height = cellSize;
    series.dataFields.valueX = 'value';
    series.dataFields.categoryY = 'city';
    series.tooltipText = '{aqi}: [bold]{valueX}[/]';
    series.tooltip.label.fill = am4core.color('#357a24');
    series.tooltip.background.fill = am4core.color('#01120b');
    series.tooltip.background.stroke = am4core.color('#357a24');
    series.tooltip.background.strokeWidth = 1;
    series.tooltip.getFillFromObject = false;
    series.tooltip.autoTextColor = false;
    this.chart.series = series;

    chart.events.on('datavalidated', (ev) => {
      const chart = ev.target; // eslint-disable-line no-shadow
      const adjustHeight = chart.data.length * (cellSize + (cellSize / 2)) - categoryAxis.pixelHeight;
      const targetHeight = chart.pixelHeight + adjustHeight;
      chart.svgContainer.htmlElement.style.height = `${targetHeight}px`;
    });

    // Create a chart cursor for interactivity but disable the X and Y grid lines
    chart.cursor = new am4charts.XYCursor();
    chart.cursor.lineX.disabled = true;
    chart.cursor.lineY.disabled = true;
    chart.cursor.behavior = 'none';

    // Store the chart into a class variable to dispose on unmount
    this.chart.model = chart;
    this.updateAQIHeatMap();
  },
  beforeDestroy() {
    // If chart exists, dispose of it
    if (this.chart.model) { this.chart.model.dispose(); }
  },
  computed: {
    getAQITextColor() {
      return this.$store.getters.getAQITextColor(this.$store.getters.getCurrentAQI).rgba;
    },
  },
  methods: {
    updateAQIHeatMap() {
      const aqi = this.$store.getters.getCurrentAQI;
      const aqiColor = this.$store.getters.getAQIColor(aqi);
      this.chart.axis.category.renderer.labels.template.fill = am4core.color(aqiColor).lighten(0.5);
      this.chart.axis.value.renderer.labels.template.fill = am4core.color(aqiColor).lighten(0.5);
      const { min, max } = this.$store.getters.getAQIMinMax(aqi);
      this.chart.axis.value.min = min;
      this.chart.axis.value.max = max;
      this.chart.axis.value.strictMinMax = true;
      this.chart.axis.value.baseValue = min;
      this.chart.series.tooltip.label.fill = am4core.color(aqiColor).lighten(0.5);
      this.chart.series.tooltip.background.fill = am4core.color(aqiColor).lighten(-0.5);
      this.chart.series.tooltip.background.stroke = am4core.color(aqiColor).lighten(0.5);
      this.chart.series.columns.template.fill = am4core.color(aqiColor).lighten(-0.5);
      this.chart.series.columns.template.stroke = am4core.color(aqiColor).lighten(0.2);
      const v = this.getMeasurement(aqi);
      this.chart.model.data = _.reverse(v);
      this.chart.series.heatRules.push({
        target: this.chart.series.columns.template,
        property: 'fill',
        min: am4core.color(aqiColor).lighten(-0.8),
        max: am4core.color(aqiColor),
        dataField: 'valueX',
      });
    },
    getMeasurement(aqi) {
      let rows;
      switch (this.measurement) {
        case 'most-polluted': {
          rows = _.flow(
            _.filter((item) => item.aqi && item.aqi[this.$store.getters.getCurrentAQI]),
            _.map((item) => ({
              aqi,
              city: item.name,
              value: item.aqi[this.$store.getters.getCurrentAQI].v,
            })),
            _.sortBy((item) => -item.value),
            _.uniqBy('value'),
          )(this.$store.getters.getActiveData);
          break;
        } default: {
          break;
        }
      }
      rows = (this.reversed) ? _.reverse(rows) : rows;
      return rows.slice(0, 10);
    },
  },
  watch: {
    '$store.getters.getActiveData': function OnActiveDataChange() {
      this.updateAQIHeatMap();
    },
    '$store.getters.getCurrentAQI': function OnFilterChange(to, from) {
      if (to !== undefined && to !== from) {
        this.updateAQIHeatMap();
      }
    },
  },
};
</script>

<style lang="scss">
.chart-vue {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  .title {
    font-size: 16px;
    font-weight: 700;
  }
  .chart {
    align-self: stretch;
    justify-self: flex-start;
    flex: 1;
  }
}
</style>
