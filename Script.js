const url = 'Data.json';

fetch(url)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

    
        return response.json();
    })
    .then(data => {
        const initialYear = parseInt(document.getElementById('xRangeSlider').value);
        let filteredData = data.filter(item => parseInt(item.Date) < initialYear);

        // Prepare data for the chart
        const years = filteredData.map(item => item.Date);
        const countries = filteredData.map(item => item.CountryCode);
        const anaemiaPrevalence = filteredData.map(item => item.Anaemia_prevalence);

        // Chart 1: Population Distribution
        const populationCounts = {};

        filteredData.forEach(item => {
            if (populationCounts[item.Population]) {
                populationCounts[item.Population]++;
            } else {
                populationCounts[item.Population] = 1;
            }
        });

        const population_labels = Object.keys(populationCounts);
        const population_values = Object.values(populationCounts);

        const chart1_layout = {
            title: 'Population Distribution',
        };

        const chart1_data = [{
            values: population_values,
            labels: population_labels,
            type: 'pie'
        }];

        Plotly.newPlot('chart1', chart1_data, chart1_layout);

        //Chart 2: 
        const areaCounts = {};
        filteredData.forEach(item => {
            if (areaCounts[item.Area]) {
                areaCounts[item.Area]++;
            } else {
                areaCounts[item.Area] = 1;
            }
        });

        const area_labels = Object.keys(areaCounts);
        const area_values = Object.values(areaCounts);

        const chart2_layout = {
            title: 'Area Distribution',
        };

        const chart2_data = [{
            values: area_values,
            labels: area_labels,
            type: 'pie'
        }];

        Plotly.newPlot('chart2', chart2_data, chart2_layout);

        // Chart 4: Anaemia Prevalence by Year
        const chart4_layout = {
            title: 'Anaemia Prevalence by Year',
            xaxis: {
                title: 'Year'
            },
            yaxis: {
                title: 'Anaemia Prevalence (%)'
            }
        };

        const chart4_data = [{
            x: years,
            y: anaemiaPrevalence,
            type: 'bar'
        }];

        Plotly.newPlot('chart4', chart4_data, chart4_layout);

        // Chart 5
        const chart5_data = [{
            type: 'choropleth',
            locations: countries,
            z: anaemiaPrevalence,
            text: countries,
            colorscale: 'Reds',
            autocolorscale: false,
            reversescale: true,
            marker: {
                line: {
                    color: 'rgb(180,180,180)',
                    width: 0.5
                }
            },
            colorbar: {
                autotick: true,
                title: 'Anaemia Prevalence (%)'
            }
        }];

        const chart5_layout = {
            title: 'Anaemia Prevalence by Country',
            geo: {
                showframe: false,
                showcoastlines: true,
                projection: {
                    type: 'equirectangular'
                }
            }
        };

        Plotly.newPlot('chart5', chart5_data, chart5_layout);

        // Event listener for the slider
        const slider = document.getElementById('xRangeSlider');
        slider.addEventListener('input', function () {
            const newYear = parseInt(slider.value);
            filteredData = data.filter(item => parseInt(item.Date) < newYear);
            const newYears = filteredData.map(item => item.Date);

            const newPopulationCounts = {};

            filteredData.forEach(item => {
                if (newPopulationCounts[item.Population]) {
                    newPopulationCounts[item.Population]++;
                } else {
                    newPopulationCounts[item.Population] = 1;
                }
            });

            const newpopulation_labels = Object.keys(newPopulationCounts);
            const newpopulation_values = Object.values(newPopulationCounts);

            const newAreaCounts = {};

            filteredData.forEach(item => {
                if (newAreaCounts[item.Area]) {
                    newAreaCounts[item.Area]++;
                } else {
                    newAreaCounts[item.Area] = 1;
                }
            });

            const newarea_labels = Object.keys(newAreaCounts);
            const newarea_values = Object.values(newAreaCounts);

            const newAnaemiaPrevalence = filteredData.map(item => item.Anaemia_prevalence);
            const newcountries = filteredData.map(item => item.CountryCode);


            // Update chart 1
            Plotly.react('chart1', [{
                values: newpopulation_values,
                labels: newpopulation_labels,
                type: 'pie'
            }]);

            // Update chart 2
            Plotly.react('chart2', [{
                values: newarea_values,
                labels: newarea_labels,
                type: 'pie'
            }]);

            // Update chart 4
            Plotly.react('chart4', [{
                x: newYears,
                y: newAnaemiaPrevalence,
                type: 'bar'
            }], chart4_layout);

            Plotly.react('chart5',[{
                type: 'choropleth',
                    locations: newcountries,
                    z: newAnaemiaPrevalence,
                    text: countries,
                    colorscale: 'Reds',
                    autocolorscale: false,
                    reversescale: true,
                    marker: {
                        line: {
                            color: 'rgb(180,180,180)',
                            width: 0.5
                        }
                    },
                    colorbar: {
                        autotick: true,
                        title: 'Anaemia Prevalence (%)'
                    }
            }], chart5_layout)
            
            const yearEndElement = document.getElementById('yearEnd');
            yearEndElement.textContent = newYear.toString();
        });
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
