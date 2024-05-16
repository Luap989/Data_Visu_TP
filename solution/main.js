// Fonction pour récupérer les données
async function fetchData() {
    const response = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson');
    const data = await response.json();
    return data;
}

// Fonction pour traiter les données
function processData(data) {
    return data.features.map(earthquake => ({
        latitude: earthquake.geometry.coordinates[1],
        longitude: earthquake.geometry.coordinates[0],
        magnitude: earthquake.properties.mag,
        time: new Date(earthquake.properties.time),
        depth: earthquake.geometry.coordinates[2]
    }));
}

// Fonction pour créer une carte mondiale des séismes
async function plotWorldMap() {
    const data = await fetchData();
    if (data) {
        const processedData = processData(data);
        const mapData = {
            type: 'scattergeo',
            mode: 'markers',
            text: processedData.map(d => `Magnitude: ${d.magnitude}`),
            lon: processedData.map(d => d.longitude),
            lat: processedData.map(d => d.latitude),
            marker: {
                size: processedData.map(d => d.magnitude * 2),
                color: processedData.map(d => d.magnitude),
                colorscale: 'Viridis',
                colorbar: {
                    title: 'Magnitude'
                }
            }
        };

        const layout = {
            title: 'Emplacements des Séismes dans le Monde',
            geo: {
                scope: 'world',
                showland: true
            },

        };

        Plotly.newPlot('earthquakePlot', [mapData], layout);
    }
}

// Fonction pour créer un histogramme des magnitudes
async function plotMagnitudeHistogram() {
    const data = await fetchData();
    if (data) {
        const processedData = processData(data);
        const magnitudes = processedData.map(d => d.magnitude);

        const histogramData = {
            x: magnitudes,
            type: 'histogram',
        };

        const layout = {
            title: 'Histogramme des Magnitudes des Séismes',
            xaxis: {
                title: 'Magnitude'
            },
            yaxis: {
                title: 'Nombre de Séismes'
            },

        };

        Plotly.newPlot('magnitudeHistogram', [histogramData], layout);
    }
}

// Fonction pour créer une série temporelle des séismes
async function plotTimeSeries() {
    const data = await fetchData();
    if (data) {
        const processedData = processData(data);
        const times = processedData.map(d => d.time);
        
        // Grouper les séismes par jour
        const counts = times.reduce((acc, time) => {
            const day = time.toISOString().split('T')[0];
            acc[day] = (acc[day] || 0) + 1;
            return acc;
        }, {});
        
        const dates = Object.keys(counts);
        const values = Object.values(counts);
        
        const timeSeriesData = {
            x: dates,
            y: values,
            type: 'scatter',
            mode: 'lines+markers',
        };

        const layout = {
            title: 'Nombre de Séismes par Jour',
            xaxis: {
                title: 'Date'
            },
            yaxis: {
                title: 'Nombre de Séismes'
            },

        };

        Plotly.newPlot('timeSeriesPlot', [timeSeriesData], layout);
    }
}

// Fonction pour créer un graphique de dispersion magnitude vs profondeur
async function plotScatterPlot() {
    const data = await fetchData();
    if (data) {
        const processedData = processData(data);
        const magnitudes = processedData.map(d => d.magnitude);
        const depths = processedData.map(d => d.depth);

        const scatterData = {
            x: magnitudes,
            y: depths,
            mode: 'markers',
            type: 'scatter',
        };

        const layout = {
            title: 'Magnitude des Séismes en Fonction de la Profondeur',
            xaxis: {
                title: 'Profondeur (km)'
            },
            yaxis: {
                title: 'Magnitude'
            },

        };

        Plotly.newPlot('scatterPlot', [scatterData], layout);
    }
}

// Appeler les fonctions pour afficher les graphiques
plotWorldMap();
plotMagnitudeHistogram();
plotTimeSeries();
plotScatterPlot();
