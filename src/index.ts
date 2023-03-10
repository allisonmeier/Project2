
function parseRecord(row: d3.DSVRowString<string>): CallData {
    return {
        SERVICE_REQUEST_ID: row.SERVICE_REQUEST_ID,
        STATUS: row.STATUS as CallStatus,
        SERVICE_NAME: row.SERVICE_NAME,
        SERVICE_CODE: row.SERVICE_CODE,
        DESCRIPTION: row.DESCRIPTION,
        AGENCY_RESPONSIBLE: row.AGENCY_RESPONSIBLE,
        REQUESTED_DATETIME: row.REQUESTED_DATETIME ? new Date(row.REQUESTED_DATETIME) : undefined,
        UPDATED_DATETIME: row.UPDATED_DATETIME ? new Date(row.UPDATED_DATETIME) : undefined,
        EXPECTED_DATETIME: row.EXPECTED_DATETIME ? new Date(row.EXPECTED_DATETIME) : undefined,
        ADDRESS: row.ADDRESS,
        ZIPCODE: row.ZIPCODE,
        LATITUDE: row.LATITUDE ? parseFloat(row.LATITUDE) : undefined,
        LONGITUDE: row.LONGITUDE ? parseFloat(row.LONGITUDE) : undefined,
        REQUESTED_DATE: row.REQUESTED_DATE ? new Date(row.REQUESTED_DATE) : undefined,
        UPDATED_DATE: row.UPDATED_DATE ? new Date(row.UPDATED_DATE) : undefined,
        LAST_TABLE_UPDATE: row.LAST_TABLE_UPDATE ? new Date(row.LAST_TABLE_UPDATE) : undefined,
    }
}



d3.tsv('data/sampleData.tsv')
    .then(rawData => {
        console.log(`Data loading complete: ${rawData.length} records.`);
        const data = rawData.map(parseRecord);
        console.log("Example:", data[0]);
        visualizeData(data);
    })
    .catch(err => {
        console.error("Error loading the data");
        console.error(err);
    });

function visualizeData(data: CallData[]) {

    const mappableData = data
        .filter((d) => d.LONGITUDE !== undefined && d.LATITUDE !== undefined)
        .map((d) => ({
            ...d,
            tooltip: `Description: ${d.DESCRIPTION}`
        })) as (CallData & MapData)[]

    const meanLat = d3.mean(mappableData, (d) => d.LATITUDE)!;
    const meanLng = d3.mean(mappableData, (d) => d.LONGITUDE)!;

    // Initialize chart and then show it
    const leafletMap = new LeafletMap({
        parentElement: "my-map",
        markerRadius: 5,
        focusRadius: 8,

        initialZoom: 11,
        initialCenter: [ meanLat, meanLng ]
    }, mappableData);
}
