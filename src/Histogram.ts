


interface HistogramConfig extends XYChartConfig<d3.Bin<number, number>, number, number> {
    color?: string;
    bins?: number;
}

class HistogramChart<T> extends AbstractChart<T, d3.Bin<number, number>, HistogramConfig>
{
    protected xScale!: d3.ScaleLinear<number, number, never>;
    protected yScale!: d3.ScaleLinear<number, number, never>;
    protected xAxis!: d3.Axis<number>;
    protected yAxis!: d3.Axis<number>;



    public setData(sourceData: T[]) {
        super.setData(sourceData);

        const xDomain = [
            d3.min(this.data, (d) => d.x0),
            d3.max(this.data, (d) => d.x1),
        ] as [number, number];

        this.xScale = d3.scaleLinear()
            .domain(xDomain)
            .range([0, this.drawConfig.width]);
        this.yScale = d3.scaleLinear()
            .domain([0, d3.max(this.data, (b) => b.length)!])
            .range([this.drawConfig.height, 0]);

        this.xAxis = d3.axisBottom<number>(this.xScale);
        this.yAxis = d3.axisLeft<number>(this.yScale);

        this.renderAxes();
    }

    public constructor(
        rawData: T[],
        dataMapper: DataMapperFn<T, d3.Bin<number, number>>,
        histogramConfig: HistogramConfig,
        drawConfig: DrawConfig,
    ) {
        super(rawData, dataMapper, histogramConfig, drawConfig);

        this.render();
    }

    protected renderAxes(xWrapWidth?: number) {
        this.svg.selectAll(".x-axis,.x-label,.y-axis,.y-label").remove();

        const xAxisSel = this.ctx.append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0, ${this.drawConfig.height})`)
            .call(this.xAxis);
        if(xWrapWidth !== undefined) {
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

    public render() {
        const barSel = this.ctx.selectAll(".bar").data(this.data).join("rect")
            .attr("class", "bar data-element")
            .attr("x", (d) => this.xScale(d.x0!)!)
            .attr("y", (d) => this.yScale(d.length))
            .attr("width", (d) => this.xScale(d.x1!) - this.xScale(d.x0!)!)
            .attr("height", (d) => this.drawConfig.height - this.yScale(d.length))
            .attr("fill", (d) => this.chartConfig.color || "#000")
            .on("click", (ev: MouseEvent, d) => {
                ev.stopPropagation();
                this.chartConfig.onDataSelect?.(d);
            });
        enableTooltip(barSel, (d) => `${d.length}`);
        this.renderUnknown();
    }
}
