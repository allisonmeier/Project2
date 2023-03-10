"use strict";
class HistogramChart extends AbstractChart {
    setData(sourceData) {
        super.setData(sourceData);
        const xDomain = [
            d3.min(this.data, (d) => d.x0),
            d3.max(this.data, (d) => d.x1),
        ];
        this.xScale = d3.scaleLinear()
            .domain(xDomain)
            .range([0, this.drawConfig.width]);
        this.yScale = d3.scaleLinear()
            .domain([0, d3.max(this.data, (b) => b.length)])
            .range([this.drawConfig.height, 0]);
        this.xAxis = d3.axisBottom(this.xScale);
        this.yAxis = d3.axisLeft(this.yScale);
        this.renderAxes();
    }
    constructor(rawData, dataMapper, histogramConfig, drawConfig) {
        super(rawData, dataMapper, histogramConfig, drawConfig);
        this.render();
    }
    renderAxes(xWrapWidth) {
        this.svg.selectAll(".x-axis,.x-label,.y-axis,.y-label").remove();
        const xAxisSel = this.ctx.append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0, ${this.drawConfig.height})`)
            .call(this.xAxis);
        if (xWrapWidth !== undefined) {
            xAxisSel.selectAll(".tick text")
                .call(wrapAxisText, xWrapWidth);
        }
        this.svg.append("text")
            .attr("class", "x-label")
            .attr("text-anchor", "middle")
            .attr("x", this.margin.left + this.drawConfig.width / 2)
            .attr("y", this.margin.top + this.drawConfig.height + this.margin.bottom - 6)
            .text(this.chartConfig.xAxisLabel);
        this.ctx.append("g")
            .attr("class", "y-axis")
            .call(this.yAxis);
        this.svg.append("text")
            .attr("class", "y-label")
            .attr("text-anchor", "middle")
            .attr("x", 0 - this.margin.top - this.drawConfig.height / 2)
            .attr("y", 50)
            .attr("transform", "rotate(-90)")
            .text(this.chartConfig.yAxisLabel);
    }
    render() {
        const barSel = this.ctx.selectAll(".bar").data(this.data).join("rect")
            .attr("class", "bar data-element")
            .attr("x", (d) => this.xScale(d.x0))
            .attr("y", (d) => this.yScale(d.length))
            .attr("width", (d) => this.xScale(d.x1) - this.xScale(d.x0))
            .attr("height", (d) => this.drawConfig.height - this.yScale(d.length))
            .attr("fill", (d) => this.chartConfig.color || "#000")
            .on("click", (ev, d) => {
            var _a, _b;
            ev.stopPropagation();
            (_b = (_a = this.chartConfig).onDataSelect) === null || _b === void 0 ? void 0 : _b.call(_a, d);
        });
        enableTooltip(barSel, (d) => `${d.length}`);
        this.renderUnknown();
    }
}
//# sourceMappingURL=Histogram.js.map