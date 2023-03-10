interface HistogramConfig extends XYChartConfig<d3.Bin<number, number>, number, number> {
    color?: string;
    bins?: number;
}
declare class HistogramChart<T> extends AbstractChart<T, d3.Bin<number, number>, HistogramConfig> {
    protected xScale: d3.ScaleLinear<number, number, never>;
    protected yScale: d3.ScaleLinear<number, number, never>;
    protected xAxis: d3.Axis<number>;
    protected yAxis: d3.Axis<number>;
    setData(sourceData: T[]): void;
    constructor(rawData: T[], dataMapper: DataMapperFn<T, d3.Bin<number, number>>, histogramConfig: HistogramConfig, drawConfig: DrawConfig);
    protected renderAxes(xWrapWidth?: number): void;
    render(): void;
}
//# sourceMappingURL=Histogram.d.ts.map