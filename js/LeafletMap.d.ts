interface LeafletConfig {
    parentElement: string | HTMLElement;
    markerRadius: number;
    focusRadius: number;
    initialZoom?: number;
    initialCenter?: [number, number];
}
interface TileLayerConfig {
    url: string;
    attribution: string;
}
declare const FreeTileLayers: {
    ESRI: {
        url: string;
        attribution: string;
    };
    TOPO: {
        url: string;
        attribution: string;
    };
    StamenTerrain: {
        url: string;
        attribution: string;
    };
};
declare function createTileLayer(config: TileLayerConfig): L.TileLayer;
interface MapData {
    LATITUDE: number;
    LONGITUDE: number;
    tooltip: string;
}
declare class LeafletMap<T extends MapData> {
    protected config: LeafletConfig;
    protected data: T[];
    /** this is the base map layer, where we are showing the map background. */
    private baseLayer;
    private map;
    private svg;
    private dots;
    constructor(config: LeafletConfig, data: T[]);
    updateVis(): void;
    renderVis(): void;
}
//# sourceMappingURL=LeafletMap.d.ts.map