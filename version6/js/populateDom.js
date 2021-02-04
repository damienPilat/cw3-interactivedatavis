// *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-
// COLLECT all data used in project
// Created by Damien Pilat and Mohammed Tahmid.
// Project started in December 2020
// *-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-

// Add all elements to dom
function addAllDomElements(formattedData) {
    let default_id = '299534';                          // Default is currently #1 movie Avengers:Endgame
    let default_index = 0;

    removeAnimation();

    addTrending(formattedData);                         // Add trending posters to top of Dom
    expandMovieDetails(formattedData, default_id, default_index);   // Expand 1st Movie Details
    addMoviePopup(formattedData, default_id);
    addMovieDetails(formattedData, default_id, default_index);         // Add movie details
    addAwardsDetails(formattedData, default_id);
    addBudgetRevenue(formattedData, default_id);
    addFilmLocation(formattedData, default_id);
    addGenderDivide(formattedData, default_id);
    addRankingPopularity(formattedData, default_id);
    addProductionCompanies(formattedData, default_id);
} // END: addAllDomElements


// Update page contents on poster click
function updateContents(movieId, index) {
    // Update BgImage
    document.getElementById('bgImage').style.backgroundImage = "url('" + finalData[movieId].backdrop_path + "')";

    expandMovieDetails(finalData, movieId, index);

    addMoviePopup(finalData, movieId);              // Update Popup Video
    addMovieDetails(finalData, movieId, index);     // Update Movie Details
    addAwardsDetails(finalData, movieId);           // Update Awards
    addBudgetRevenue(finalData, movieId);           // Update Budget Revenue
    addFilmLocation(finalData, movieId);            // Update Film Locations
    addGenderDivide(finalData, movieId);            // Update Gender Divide Chart
} // END: updateBgImg


// Add trending posters to Dom
function addTrending(formattedData) {
    let moviesSorted = sortMoviesByRevenue(formattedData);
    // Loop through all movies

    let movie_poster_container = document.getElementById('trending-movies-container');
    movie_poster_container.innerHTML = '';

    moviesSorted.forEach((movieData, index) => {
        // Create wrapper div container
        let movieWrapper = document.createElement('div');
        movieWrapper.className = 'movieWrapper';

        // Create movie title [currently not used. Add as child to movieWrapper if needed]
        let title = document.createElement('p');
        title.className = 'movieTitle';
        title.innerHTML = formattedData[movieData[0]].name;

        // Create poster img element
        let moviePoster = document.createElement('img');
        moviePoster.className = 'movieImage';
        moviePoster.id = movieData[0];
        moviePoster.setAttribute('onclick', 'updateContents(' + movieData[0] + ',' + index + ')');
        moviePoster.src = formattedData[movieData[0]].poster_path;

        let detailElement = document.createElement('div');
        detailElement.className = 'inline-movie-details';
        detailElement.id = 'movieDetail_' + index;

        // Append elements to Dom
        movie_poster_container.appendChild(movieWrapper);
        movieWrapper.appendChild(moviePoster);
        movieWrapper.appendChild(detailElement);
    });

    // Initialise custom scrollbar
    new SimpleBar(document.getElementById('trending-movies-container'));

} // END: addTrending


// Add Link to video popup
function addMoviePopup(formattedData, movie_id) {
    $(function() {
        let play_btn = $("button#play-btn");
        play_btn.attr("href", "https://www.youtube.com/watch?v=" + formattedData[movie_id]['video_id']);
        play_btn.YouTubePopUp();
    });
}


// Add Movie Details to DOM
function addMovieDetails(formattedData, movie_id, index) {
    // Get movie details container
    let details_container = document.getElementById('movieDetail_' + index);
    details_container.textContent = '';         // Remove content before adding new elements

    // Header for movie main details
    let movieHeader = document.createElement('div');
    movieHeader.className = "movieHeader";

    //Wrapper for title, release data and genre types
    let movieTitleWrapper = document.createElement('div');
    movieTitleWrapper.className = "movieTitleWrapper";

    // Movie Title & Year Elements
    let movieTitle = customElement('p', 'movieTitle-Expanded', formattedData[movie_id].name);
    let movieYear = customElement('span', 'movieYear', formattedData[movie_id]['release_date'].split('-')[0]);
    // Add Movie Year span within Movie Title
    movieTitle.appendChild(movieYear);

    // Movie Genres
    let movieGenres = customElement('p', 'movieGenres', formattedData[movie_id].genres.map((key) => key.name).join(', '));

    // Rating container & Text element
    let movieRating = document.createElement('div');
    movieRating.className = "movieRating-container";
    let movieTextWrapper = document.createElement('div');
    movieTextWrapper.className = "movieTextWrapper";
    let rating = customElement('p', "movieRating-text", formattedData[movie_id]['vote_average']);
    movieTextWrapper.appendChild(rating);
    movieRating.appendChild(movieTextWrapper);        // Append rating text to rating div

    // Movie length
    let movieLength = customElement('p', 'movieLength', formatRunTime(formattedData[movie_id].runtime));

    // Append elements to Movie Header
    movieTitleWrapper.appendChild(movieTitle);
    movieTitleWrapper.appendChild(movieGenres);
    movieHeader.appendChild(movieTitleWrapper);
    movieHeader.appendChild(movieRating);
    movieRating.appendChild(movieLength);

    // Details Container
    let movieDetails = document.createElement('div');
    movieDetails.className = "movieDetails-container";

    // Info Container
    let movieInfoWrapper = document.createElement('div');
    movieInfoWrapper.className = "movieInfo-wrapper";

    // Dict of all elements and values for Details section
    let detailsElements = {
        "Directors": getMembers('Directing', formattedData, movie_id),
        "Writers": getMembers('Writing', formattedData, movie_id),
        "Release Date": formatDate(formattedData[movie_id].release_date),
        "Country": formattedData[movie_id]['production_companies'][0].origin_country,
        "Language": formattedData[movie_id]['spoken_languages'][0].english_name
    };

    let movie_details_heading = customElement('p', 'movie_details_heading', 'Details');
    movieDetails.appendChild(movie_details_heading);

    // Add all Elements to Div as paragraphs
    for (const elements in detailsElements) {
        movieDetails.appendChild(customElement('p', "movieDetails details-" + elements, "<span>" + elements + "</span><span>: " + detailsElements[elements] + "</span>"));
    }

    // Create div and content for Details Overview
    let overview_container = customElement('div', 'overview-container', '');
    let overview_heading = customElement('p', 'overview-heading', 'Overview');
    let overview_text = customElement('p', 'details-Overview', formattedData[movie_id].overview);
    overview_container.appendChild(overview_heading);
    overview_container.appendChild(overview_text);

    // Append contents to container
    details_container.appendChild(movieHeader);
    details_container.appendChild(movieInfoWrapper);
    movieInfoWrapper.appendChild(movieDetails);
    movieInfoWrapper.appendChild(overview_container);

    readMoreText(); //run read more function

    stickyHeader();

} // END: addMovieDetails


// Awards Section of Dom
function addAwardsDetails(formattedData, movieId) {
    let award_content_container = customElement('div', 'center', '', 'award-content');

    for (const element in formattedData[movieId].awards) {
        let el_container = document.createElement('div');
        el_container.className = 'award-container';

        let value_icon_container = document.createElement('div');
        value_icon_container.className = 'icon-value-container';

        let value = customElement('p', 'award-value', formattedData[movieId]['awards'][element].value);
        let icon = customElement('img', 'award-img', '');
        icon.src = formattedData[movieId]['awards'][element].src;

        value_icon_container.appendChild(value);
        value_icon_container.appendChild(icon);

        let name = customElement('p', 'award-name', element);

        el_container.appendChild(value_icon_container);
        el_container.appendChild(name);

        award_content_container.appendChild(el_container);
    }
    // Append container to DOM
    appendToDomCheck(award_content_container, 'movieAwards', 'award-content');
}



// Add Budget vs Box Office Section
function addBudgetRevenue(formattedData, movieId) {
    let percentage_filled = formattedData[movieId].budget / formattedData[movieId].revenue * 100;

    // Percentage container
    let percentage_container = customElement('div', '', '', 'percentage-container');

    // Percentage One
    let percentage_one = customElement('div', 'percentage-section', '', 'percentage-one');
    percentage_one.innerText = '$' + addThousandsComma(formattedData[movieId].budget);
    percentage_one.style.minWidth = percentage_filled + '%';			// Min width as we want content to be always within div if section is smaller

    // Percentage Two
    let percentage_two = customElement('div', 'percentage-section', '', 'percentage-two');
    percentage_two.innerText = '$' + addThousandsComma(formattedData[movieId].revenue);
    percentage_two.style.width = (100 - percentage_filled) + '%';

    // Append to percentage container
    percentage_container.appendChild(percentage_one);
    percentage_container.appendChild(percentage_two);

    // Append to awards container
    appendToDomCheck(percentage_container, 'budgetRevenue', 'percentage-container');
}


// Add Film Location Map
let filmMap;
function addFilmLocation(formattedData, movieId) {
    let film_map = customElement('div', '', '', 'film-map');
    let component_exists = appendToDomCheck(film_map, 'filmLocations', 'film-map', true);

    getMapData(formattedData, movieId)
        .then(mapData => buildMap(mapData));

}

// Build a map (used for Film location
function buildMap(mapData) {
    filmMap = new Datamap({
        element: document.getElementById("film-map"),
        scope: 'world',
        projection: 'equirectangular',
        responsive: false,
        fills: {
            // active: '#B687E4',
            active: '#2d98da',
            defaultFill: 'rgba(0,0,0,0)'
        },
        height: null,
        width: null,
        geographyConfig: {
            highlightOnHover: false,
            popupOnHover: false,
            borderWidth: .4,
            borderColor: '#45aaf2'
        },
        data: mapData
    });
}

// Build Gender Divide Section
let genderChart;
function addGenderDivide(formattedData, movieId) {
    let gender_divide_container = document.getElementById('genderDivide');
    // Chart Legend
    let chart_legend = createChartLegend();

    // Append Elements if they dont exist
    let elementExists = appendToDomCheck(chart_legend, 'genderDivide', 'legend-container', true);
    if (!elementExists) {
        let gender_chart_container = customElement('div', 'chart-container', '', 'gender-chart-container');
        let gender_chart = customElement('canvas', '', '', 'gender-split');
        gender_chart_container.appendChild(gender_chart);
        gender_divide_container.appendChild(gender_chart_container);
    }

    // Get Data
    let genderData = formattedData[movieId]['cast_crew_stats'];
    let genderDatasets = [{
        label: 'Cast',
        data: Object.values(genderData['cast']).slice(0, 2),
        backgroundColor: ['rgb(122, 95, 208)', 'rgb(170, 147, 245)'],
        hoverBackgroundColor: ['rgb(161, 146, 209)', 'rgb(220, 214, 247)'],
        borderColor: 'rgba(0,0,0,0)'
    }, {
        label: 'Crew',
        data: Object.values(genderData['crew']).slice(0, 2),
        backgroundColor: ['rgb(255, 92, 108)', 'rgb(250, 179, 183)'],
        hoverBackgroundColor: ['rgb(251, 162, 171)', 'rgb(247, 205, 208)'],
        borderColor: 'rgba(0,0,0,0)'
    }];
    // Define Chart Options
    let genderChartOptions = {
        responsive: true,
        legend: {display: false},
        tooltips: {
            callbacks: {
                title: function (tooltipItem, data) {
                    let data_Category = data['datasets'][tooltipItem[0]['datasetIndex']]['label'];  // Get Category Label
                    let data_type = data['labels'][tooltipItem[0]['index']];    // Get Data Type
                    return data_type + ' ' + data_Category
                },
                label: function (tooltipItem, data) {
                    let data_value = data['datasets'][0]['data'][tooltipItem['index']] + ' members';    // Get Data Value
                    let dataset = data['datasets'][0];                                                  // Calculate data percentage
                    let total = getTotal(dataset);
                    let data_percent = ' (' + Math.round((dataset['data'][tooltipItem['index']] / total) * 100) + '%)';
                    return data_value + data_percent
                }
            }
        }
    };

    createChart(label=Object.keys(genderData['overall']).slice(0, 2), datasets=genderDatasets, chartOptions=genderChartOptions, canvasId='#gender-split', type='doughnut', chartCanvas=genderChart);
}

function addRankingPopularity(formattedData, movieId) {
    // Get and Create Dom elements
    let popularity_rank_container = document.getElementById('popularityRank');

    let popularity_chart_container = customElement('div', '', '', 'popularity-chart-container');
    let popularity_chart = customElement('canvas', '', '', 'popularity-rank');

    popularity_chart_container.appendChild(popularity_chart);
    popularity_rank_container.appendChild(popularity_chart_container);

    // Get Movie names & popularity, ordered by rank
    let movie_names = new Array(19);
    let movie_popularity = new Array(19);

    Object.keys(formattedData).forEach(entry => {
        let rank = formattedData[entry].rank || 19;
        movie_names.splice(rank-1, 1, (formattedData[entry].name + ' : #' + rank));
        movie_popularity.splice(rank-1, 1, formattedData[entry].popularity);
    });
    movie_names = formatNames(movie_names);


    // Highlight given movie data
    let color = new Array(19);
    color.fill('#16a085');
    color.splice(formattedData[movieId].rank-1, 1, '#ffffff');

    // Define Chart data & Options
    let popularityDataset = [{
        data: movie_popularity,
        backgroundColor: color,
        hoverBackgroundColor: 'rgba(255,255,255,1)'
    }];
    // Chart Options
    let barChart_options = {
        tooltips: {
            callbacks: {
                title: function(tooltipItem) {
                    return 'Rank ' + (parseInt(tooltipItem[0]['index'])+1)
                },
                label: function(tooltipItem, data) {
                    return 'Popularity ' + data['datasets'][0]['data'][tooltipItem['index']];    // Get Data Value
                }
            }
        },
        scales: {
            xAxes: [{
                display: true,
                ticks: {
                    suggestedMin: 0,
                    beginAtZero: true,
                    fontColor: 'rgba(255,255,255,1)',
                },
                scaleLabel: {
                    display: true,
                    labelString: 'Popularity Metric',
                    fontColor: 'rgba(255,255,255,1)',
                }
            }],
            yAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Movie Rank',
                    fontColor: 'rgba(255,255,255,1)',
                },
                ticks: {
                    suggestedMin: 0,
                    fontColor: 'rgba(255,255,255,1)',
                }
            }]
        },
        legend: {
            display: false
        }
    };

    createChart(label=movie_names, datasets=popularityDataset, chartOptions=barChart_options, canvasId='#popularity-rank', type='horizontalBar');
}


// Add Movie Production Companies
function addProductionCompanies(formattedData, movieId) {
    // Get & Create DOM Elements
    let productionCompany_container = document.getElementById('productionCompanies');

    let productionCompany_chart_container = customElement('div', '', '', 'productionCompany-chart-container');
    let productionCompany_chart = customElement('canvas', '', '', 'production-companies');

    productionCompany_chart_container.appendChild(productionCompany_chart);
    productionCompany_container.appendChild(productionCompany_chart_container);

    // Get all production companies
    let production_companies = [];
    Object.keys(formattedData).forEach(entry => {
        let production_companies_data = formattedData[entry]['production_companies'];
        Object.keys(production_companies_data).forEach(value => {
            production_companies.push(production_companies_data[value].name);
        });
    });

    // Get frequency of each production company
    let frequency = {};
    production_companies.forEach(value => frequency[value] = (frequency[value] || 0) +1);

    console.log("frequency:", frequency);

    let sortedFrequency = Object.values(frequency).sort(function(a, b){return b-a});

    // Highlight given movie data
    let color = new Array(sortedFrequency.length);
    color.fill('#16a085');

    console.log("Sorted_0:", Object.keys(frequency));

    let movie_production_companies = formattedData[movieId].production_companies;
    for (let i=0; i < sortedFrequency.length; i++) {
        for (let j=0; j < Object.keys(movie_production_companies).length; j++) {
            if (sortedFrequency[i] === movie_production_companies[j].name) {
                console.log("Same");
                color.splice(i, 1, '#ffffff');
            }
        }
    }


    // Chart Data
    let productionDataset = [{
        data: sortedFrequency,
        backgroundColor: color,
        hoverBackgroundColor: 'rgba(255,255,255,1)'
    }];

    // Chart options
    let productionChart_options = {
        tooltips: {
            callbacks: {
                title: function(tooltipItem) {
                    // return 'Rank ' + (parseInt(tooltipItem[0]['index'])+1)
                },
                label: function(tooltipItem, data) {
                    return 'Number of movies: ' + data['datasets'][0]['data'][tooltipItem['index']];    // Get Data Value
                }
            }
        },
        scales: {
            xAxes: [{
                display: true,
                ticks: {
                    beginAtZero: true,
                    fontColor: 'rgba(255,255,255,1)',
                },
                scaleLabel: {
                    display: true,
                    labelString: 'Number of Movies',
                    fontColor: 'rgba(255,255,255,1)',
                }
            }],
            yAxes: [{
                display: true,
                ticks: {
                    fontColor: 'rgba(255,255,255,1)',
                },
                scaleLabel: {
                    display: true,
                    fontColor: 'rgba(255,255,255,1)',
                }
            }]
        },
        legend: {
            display: false
        }
    };

    createChart(Object.keys(frequency), productionDataset, productionChart_options, '#production-companies','horizontalBar');
}