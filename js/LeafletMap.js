"use strict";
const FreeTileLayers = {
    ESRI: {
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        attribution: "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
    },
    TOPO: {
        url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
        attribution: "Map data: &copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors, <a href=\"http://viewfinderpanoramas.org\">SRTM</a> | Map style: &copy; <a href=\"https://opentopomap.org\">OpenTopoMap</a> (<a href=\"https://creativecommons.org/licenses/by-sa/3.0/\">CC-BY-SA</a>)",
    },
    StamenTerrain: {
        url: "https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.png",
        attribution: "Map tiles by <a href=\"http://stamen.com\">Stamen Design</a>, <a href=\"http://creativecommons.org/licenses/by/3.0\">CC BY 3.0</a> &mdash; Map data &copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors"
    }
};
function createTileLayer(config) {
    return L.tileLayer(config.url, {
        id: "tile-image",
        attribution: config.attribution,
    });
}
class LeafletMap {
    constructor(config, data) {
        this.config = config;
        this.data = data;
        /** this is the base map layer, where we are showing the map background. */
        this.baseLayer = createTileLayer(FreeTileLayers.StamenTerrain);
        /**
         * We initialize scales/axes and append static elements, such as axis titles.
         */
        this.map = L.map(this.config.parentElement, {
            center: this.config.initialCenter || [30, 0],
            zoom: this.config.initialZoom || 2,
            layers: [this.baseLayer]
        });
        // if you stopped here, you would just have a map
        // initialize svg for d3 to add to map
        L.svg().addTo(this.map);
        const overlay = d3.select(this.map.getPanes().overlayPane);
        this.svg = overlay.select("svg").attr("pointer-events", "auto");
        // these are the city locations, displayed as a set of dots
        this.dots = this.svg.selectAll('.call-marker').data(this.data).join('circle')
            .attr("class", "call-marker")
            .attr("fill", "steelblue")
            .attr("stroke", "black")
            // Leaflet has to take control of projecting points. Here we are feeding the latitude and longitude coordinates to
            // leaflet so that it can project them on the coordinates of the view. Notice, we have to reverse lat and lon.
            // Finally, the returned conversion produces an x and y point. We have to select the the desired one using .x or .y
            .attr("cx", d => this.map.latLngToLayerPoint([d.LATITUDE, d.LONGITUDE]).x)
            .attr("cy", d => this.map.latLngToLayerPoint([d.LATITUDE, d.LONGITUDE]).y)
            .attr("r", 3)
            .on('mouseover', function (_event, d) {
            d3.select(this).transition() //D3 selects the object we have moused over in order to perform operations on it
                .duration(150) //how long we are transitioning between the two states (works like keyframes)
                .attr("fill", "red") //change the fill
                .attr('r', 4); //change radius
            //create a tool tip
            d3.select('#tooltip')
                .style('opacity', 1)
                .style('z-index', 1000000)
                // Format number with million and thousand separator
                .html(`<div class="tooltip-label">${d.tooltip}</div>`);
        })
            .on('mousemove', (event) => {
            //position the tooltip
            d3.select('#tooltip')
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY + 10) + 'px');
        })
            .on('mouseleave', function () {
            d3.select(this).transition() //D3 selects the object we have moused over in order to perform operations on it
                .duration(150) //how long we are transitioning between the two states (works like keyframes)
                .attr("fill", "steelblue") //change the fill
                .attr('r', 3); //change radius
            d3.select('#tooltip').style('opacity', 0); //turn off the tooltip
        })
            .on('click', (_event, d) => {
            this.map.flyTo([d.LATITUDE, d.LONGITUDE], this.map.getZoom());
        });
        //handler here for updating the map, as you zoom in and out
        this.map.on("zoomend", () => {
            this.updateVis();
        });
    }
    updateVis() {
        // want to see how zoomed in you are?
        console.log(this.map.getZoom()); // how zoomed am I
        // want to control the size of the radius to be a certain number of meters?
        // if( this.map.getZoom > 15 ){
        //   metresPerPixel = 40075016.686 * Math.abs(Math.cos(map.getCenter().lat * Math.PI/180)) / Math.pow(2, map.getZoom()+8);
        //   desiredMetersForPoint = 100; //or the uncertainty measure... =)
        //   radiusSize = desiredMetersForPoint / metresPerPixel;
        // }
        // redraw based on new zoom- need to recalculate on-screen position
        this.dots
            .attr("cx", d => this.map.latLngToLayerPoint([d.LATITUDE, d.LONGITUDE]).x)
            .attr("cy", d => this.map.latLngToLayerPoint([d.LATITUDE, d.LONGITUDE]).y)
            .attr("r", this.config.markerRadius);
    }
    renderVis() {
        //not using right now...
    }
}
//# sourceMappingURL=LeafletMap.js.map