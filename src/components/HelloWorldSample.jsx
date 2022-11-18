/* eslint-disable no-dupe-keys */
/*eslint space-before-function-paren: ["error", {"anonymous": "always", "named": "never", "asyncArrow": "always"}]*/
/*eslint-env es6*/
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import { Component, createElement } from "react";
import am5themesAnimated from "@amcharts/amcharts5/themes/Animated";

export class HelloWorldSample extends Component {
    componentDidUpdate(prevProps, prevState) {
        if (this.props.StackList.status !== prevProps.StackList.status) {
            const stackData = this.props.StackList.items.map(item => ({
                xLabel: this.props.StackLabel(item).displayValue,
                yValue: Number(this.props.SliceValue(item).displayValue), // converting the string to decimal
                yLabel: this.props.SliceLabel(item).displayValue
            }));
            console.info("stack data", stackData);
            const root = am5.Root.new("chartdiv");

            root.setThemes([am5themesAnimated.new(root)]);

            const chart = root.container.children.push(
                am5xy.XYChart.new(root, {
                    panX: false,
                    panY: false,
                    wheelX: "panX",
                    wheelY: "zoomX",
                    layout: root.verticalLayout
                })
            );

            // Define data
            const data1 = [];
            const data = [
                {
                    xLabel: "1/1/2001",
                    yLabel: "cat1",
                    yValue: 100
                },
                {
                    xLabel: "1/1/2010",
                    yLabel: "cat2",
                    yValue: 120
                },
                {
                    xLabel: "1/1/2015",
                    yLabel: "cat3",
                    yValue: 85
                },
                {
                    xLabel: "1/1/2015",
                    yLabel: "cat2",
                    yValue: 50
                },
                {
                    xLabel: "1/1/2001",
                    yLabel: "cat3",
                    yValue: 111
                }
            ];
            const bars = []; // retrieve the unique bars
            const Bardata = []; // start creating array of ( objects) unique bar each
            const xLabelArr = []; // extract the categories .

            stackData.forEach(ele => {
                xLabelArr.push(ele.yLabel);
            });

            const set = Array.from(new Set(xLabelArr)); // set has all y-label without repeat.

            stackData.forEach(elem => {
                // loop over the stacks and accmulate the stack with the same bar tilte

                if (!bars.includes(elem.xLabel)) {
                    bars.push(elem.xLabel);
                    const obj = {};
                    obj[elem.xLabel] = elem.xLabel;
                    Bardata.push(obj);
                }
            });

            for (let j = 0; j < bars.length; j++) {
                const temp = {}; // aggregate all satck with same bar title in the same object
                for (let i = 0; i < stackData.length; i++) {
                    const stack = stackData[i].yLabel;
                    const val = stackData[i].yValue;
                    if (stackData[i].xLabel === bars[j]) {
                        temp[stack] = val;
                    }
                }
                temp.xLabel = bars[j]; // add the bar title to the relative object ; note : the key could be configurable
                temp.none = 0;
                data1.push(temp);
            }
            console.info("line 94", bars);
            console.info("line 95", Bardata);
            console.info("line 96", data1);
            // Create Y-axis
            const yAxis = chart.yAxes.push(
                am5xy.ValueAxis.new(root, {
                    min: 0,
                    renderer: am5xy.AxisRendererY.new(root, {}),
                    calculateTotals: true,
                    extraMax: 0.1
                })
            );
            // Create X-Axis
            const xAxis = chart.xAxes.push(
                am5xy.CategoryAxis.new(root, {
                    renderer: am5xy.AxisRendererX.new(root, {}),
                    categoryField: "xLabel"
                })
            );
            xAxis.data.setAll(data1);
            // // Add legend
            const legend = chart.children.push(am5.Legend.new(root, {}));
            legend.data.setAll(chart.series.values);

            // Add cursor
            chart.set("cursor", am5xy.XYCursor.new(root, {}));

            // Add scrollbar
            chart.set(
                "scrollbarX",
                am5.Scrollbar.new(root, {
                    orientation: "horizontal"
                })
            );
            for (let i = 0; i < set.length; i++) {
                makeSeries(set[i], set[i]);
            }
            makeSeries("", "none", true);
            // Create series
            // eslint-disable-next-line no-inner-declarations
            function makeSeries(name, fieldName, showTotal) {
                var series = chart.series.push(
                    am5xy.ColumnSeries.new(root, {
                        name: name,
                        xAxis: xAxis,
                        yAxis: yAxis,
                        valueYField: fieldName,
                        categoryXField: "xLabel",
                        stacked: true,
                        maskBullets: false
                    })
                );

                series.columns.template.setAll({
                    tooltipText: "{name}, {categoryX}: {valueY}",
                    tooltipY: am5.percent(90)
                });

                if (showTotal) {
                    series.bullets.push(function () {
                        return am5.Bullet.new(root, {
                            locationY: 1,
                            sprite: am5.Label.new(root, {
                                text: "{valueYTotal}",
                                fill: am5.color(0x000000),
                                centerY: am5.p100,
                                centerX: am5.p50,
                                populateText: true
                            })
                        });
                    });
                }
                series.data.setAll(data1);
                series.appear();

                if (!showTotal) {
                    legend.data.push(series);
                }
            }
            chart.appear(1000, 100);
            this.root = root;
        }
    }

    componentWillUnmount() {
        if (this.root) {
            this.root.dispose();
        }
    }

    render() {
        return <div id="chartdiv" style={{ width: "100%", height: "500px" }}></div>;
    }
}
