"use strict";
function createSVG(drawConfig) {
    const margin = drawConfig.margin || { top: 0, bottom: 0, left: 0, right: 0 };
    const width = drawConfig.width + margin.left + margin.right;
    const height = drawConfig.height + margin.top + margin.bottom;
    return d3.select(drawConfig.parent).append("svg")
        .attr("class", drawConfig.className || "col-6")
        // .attr("width", width)
        // .attr("height", height)
        .attr("viewBox", `0 0 ${width} ${height}`);
}
function wrapAxisText(text, width) {
    text.each(function () {
        var _a;
        const text = d3.select(this);
        const words = text.text().split(/\s+/).reverse();
        let word;
        let line = [];
        let lineNumber = 0;
        const lineHeight = 1.1;
        const y = text.attr("y");
        const dy = parseFloat(text.attr("dy"));
        let tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if ((((_a = tspan.node()) === null || _a === void 0 ? void 0 : _a.getComputedTextLength()) || 0) > width && line.length > 1) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", `${++lineNumber * lineHeight + dy}em`).text(word);
            }
        }
    });
}
const tooltipElement = d3.select("#tooltip");
function enableTooltip(sel, ttFn) {
    sel
        .on("mouseover", (ev, d) => {
        const tooltip = ttFn(d);
        if (!tooltip) {
            return;
        }
        tooltipElement
            .style("top", (ev.layerY + 5) + "px")
            .style("left", (ev.layerX + 5) + "px")
            .style("visibility", "visible")
            .html(tooltip);
    })
        .on("mouseout", () => {
        tooltipElement.style("visibility", "hidden");
    });
}
function elementMapper(mapFn) {
    return (sourceData) => {
        const data = [];
        let unknownCount = 0;
        for (const t of sourceData) {
            const d = mapFn(t);
            if (d !== undefined) {
                data.push(d);
            }
            else {
                unknownCount++;
            }
        }
        return { data, unknownCount };
    };
}
function aggregateMapper(bucketFn, mapFn) {
    return (sourceData) => {
        const dict = {};
        let unknownCount = 0;
        for (const t of sourceData) {
            const key = bucketFn(t);
            if (!key) {
                unknownCount++;
                continue;
            }
            if (key in dict) {
                dict[key]++;
            }
            else {
                dict[key] = 1;
            }
        }
        const data = Object.entries(dict).map(([bucket, count]) => mapFn(bucket, count));
        return { data, unknownCount };
    };
}
function binMapper(mapFn, binConfig) {
    let bin = d3.bin();
    if (binConfig === null || binConfig === void 0 ? void 0 : binConfig.bins) {
        bin = bin.thresholds(binConfig.bins);
    }
    return (sourceData) => {
        const mapData = [];
        let unknownCount = 0;
        for (const t of sourceData) {
            const d = mapFn(t);
            if (d !== undefined) {
                mapData.push(d);
            }
            else {
                unknownCount++;
            }
        }
        const data = bin(mapData);
        return { data, unknownCount };
    };
}
//# sourceMappingURL=utils.js.map