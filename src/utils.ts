


function createSVG(drawConfig: DrawConfig) {
    const margin = drawConfig.margin || { top: 0, bottom: 0, left: 0, right: 0 };
    const width = drawConfig.width + margin.left + margin.right;
    const height = drawConfig.height + margin.top + margin.bottom;

    return d3.select(drawConfig.parent).append("svg")
        .attr("class", drawConfig.className || "col-6")
        // .attr("width", width)
        // .attr("height", height)
        .attr("viewBox", `0 0 ${width} ${height}`);
}

function wrapAxisText(text: d3.Selection<d3.BaseType, unknown, SVGGElement, any>, width: number) {
    text.each(function () {
        const text = d3.select(this);
        const words = text.text().split(/\s+/).reverse();
        let word: string | undefined;
        let line: string[] = [];
        let lineNumber = 0;
        const lineHeight = 1.1;
        const y = text.attr("y");
        const dy = parseFloat(text.attr("dy"));
        let tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");

        while (word = words.pop()) {
            line.push(word)
            tspan.text(line.join(" "))
            if ((tspan.node()?.getComputedTextLength() || 0) > width && line.length > 1) {
                line.pop()
                tspan.text(line.join(" "))
                line = [word]
                tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", `${++lineNumber * lineHeight + dy}em`).text(word)
            }
        }
    })
}



const tooltipElement = d3.select("#tooltip");
function enableTooltip<Datum, PDatum>(
    sel: d3.Selection<d3.BaseType, Datum, d3.BaseType, PDatum>,
    ttFn: (d: Datum) => string | undefined
) {
    sel
        .on("mouseover", (ev, d) => {
            const tooltip = ttFn(d);
            if(!tooltip) { return; }
            tooltipElement
                .style("top", (ev.layerY + 5) + "px")
                .style("left", (ev.layerX + 5) + "px")
                .style("visibility", "visible")
                .html(tooltip)
        })
        .on("mouseout", () => {
            tooltipElement.style("visibility", "hidden")
        });
}



type DataMapperFn<T, D> = (data: T[]) => ChartData<D>;
interface ChartData<D> {
    data: D[];
    unknownCount: number;
}

function elementMapper<T, D>(mapFn: (d: T) => D | undefined): DataMapperFn<T, D> {
    return (sourceData) => {
        const data: D[] = [];
        let unknownCount = 0;
        for(const t of sourceData) {
            const d = mapFn(t);
            if(d !== undefined) { data.push(d); }
            else { unknownCount++; }
        }
        return { data, unknownCount };
    }
}
function aggregateMapper<T, D>(bucketFn: (d: T) => string | undefined, mapFn: (bucket: string, count: number) => D): DataMapperFn<T, D> {
    return (sourceData) => {
        const dict: Record<string, number> = {};
        let unknownCount = 0;
        for(const t of sourceData) {
            const key = bucketFn(t);
            if(!key) {
                unknownCount++;
                continue;
            }
            if(key in dict) { dict[key]++; }
            else { dict[key] = 1 }

        }
        const data = Object.entries(dict).map(([bucket, count]) => mapFn(bucket, count));
        return { data, unknownCount };
    }
}
function binMapper<T>(
    mapFn: (d: T) => number | undefined,
    binConfig?: {
        bins?: number
    }
): DataMapperFn<T, d3.Bin<number, number>> {
    let bin = d3.bin();
    if(binConfig?.bins) {
        bin = bin.thresholds(binConfig.bins);
    }

    return (sourceData) => {
        const mapData: number[] = [];
        let unknownCount = 0;
        for(const t of sourceData) {
            const d = mapFn(t);
            if(d !== undefined) { mapData.push(d); }
            else { unknownCount++; }
        }

        const data = bin(mapData);
        return { data, unknownCount };
    }
}
