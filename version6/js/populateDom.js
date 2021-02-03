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
    addMovieDetails(formattedData, default_id, default_index);         // Add movie details
    addAwardsDetails(formattedData, default_id);
    addBudgetRevenue(formattedData, default_id);
    addFilmLocation(formattedData, default_id);
    addGenderDivide(formattedData, default_id);

    //addCharts(formattedData);                     // Add charts to corresponding sections
} // END: addAllDomElements


// Update page contents on poster click
function updateContents(movieId, index) {
    // Update BgImage
    document.getElementById('bgImage').style.backgroundImage = "url('" + finalData[movieId].backdrop_path + "')";

    expandMovieDetails(finalData, movieId, index);

    addMovieDetails(finalData, movieId, index);     // Update Movie Details
    addAwardsDetails(finalData, movieId);           // Update Awards
    addBudgetRevenue(finalData, movieId);           // Update Budget Revenue
    addFilmLocation(finalData, movieId);            // Update Film Locations
    addGenderDivide(finalData, movieId);
} // END: updateBgImg


// Add trending posters to Dom
function addTrending(formattedData) {
    let moviesSorted = sortMoviesByRevenue(formattedData);
    // Loop through all movies
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
        document.getElementById('trending-movies-container').appendChild(movieWrapper);
        movieWrapper.appendChild(moviePoster);
        movieWrapper.appendChild(detailElement);
    });

    // Initialise custom scrollbar
    new SimpleBar(document.getElementById('trending-movies-container'));

} // END: addTrending


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

function stickyHeader() {
    var stickyHeader = document.getElementById("stickyHeader");
    stickyHeader.innerHTML = '';
    let movieImgSticky = customElement('img', 'movie-img-sticky', '');

    stickyHeader.appendChild(movieImgSticky);


    var srctest = document.querySelector(".wrapperExpanded img").src;
    var titletest = document.querySelector(".wrapperExpanded .movieTitle-Expanded").innerHTML;
    var releaseDatetest = document.querySelectorAll(".wrapperExpanded .details-Release span")[1].innerHTML;
    var genretest = document.querySelector(".wrapperExpanded .movieGenres").innerHTML;
    var movieRatingtest = document.querySelector(".wrapperExpanded .movieRating-text").innerHTML;
    movieImgSticky.src = srctest;

    var desired = titletest.split('<')[0];
    var desired2 = releaseDatetest.split(':')[1];
    let movieTitleSticky = customElement('p', 'movie-title-sticky', desired);
    let movieGenresSticky = customElement('p', 'movie-genres-sticky', genretest);
    let releaseDataSticky = customElement('p', 'movie-release-sticky', desired2);

    let movieRatingSticky = customElement('p', 'movie-rating-sticky', movieRatingtest + "/10");
    let movieRatingWrapperSticky = customElement('div', 'movie-rating-wrapper-sticky', '');

    movieRatingWrapperSticky.appendChild(movieRatingSticky);

    stickyHeader.appendChild(movieTitleSticky);
    stickyHeader.appendChild(movieGenresSticky);
    stickyHeader.appendChild(releaseDataSticky);
    stickyHeader.appendChild(movieRatingWrapperSticky);
}


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
    document.getElementById('movieAwards').appendChild(award_content_container);
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
    document.getElementById('budgetRevenue').appendChild(percentage_container);
}


// Add Film Location Map
function addFilmLocation(formattedData, movieId) {
    let film_map = customElement('div', '', '', 'film-map');
    document.getElementById('filmLocations').appendChild(film_map);

    getMapData(formattedData, movieId)
        .then(mapData => buildMap(mapData));
}

// Build a map (used for Film location
function buildMap(mapData) {
    let filmMap = new Datamap({
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

// Get data for a given set of countries into the correct iso6331 alpha3 format
async function getMapData(formattedData, movieId) {
    let film_countries = formattedData[movieId].production_countries;
    let country_codes = [];
    film_countries.forEach(element => country_codes.push(element.iso_3166_1));

    let country_conversion = {};
    let mapData = {};

    await $.ajax({
        type: 'GET',
        url: 'iso_3166_a2_a3.csv',
        dataType: 'text',
        success: function (response) {
            country_conversion = Papa.parse(response)['data'];
            for (let i = 0; i < country_conversion.length; i++) {
                for (let j = 0; j < country_codes.length; j++) {
                    if (country_codes[j] === country_conversion[i][1]) {
                        mapData[country_conversion[i][2]] = {fillKey: 'active'};
                    }
                }
            }
        }
    });
    return mapData
}

function addGenderDivide(formattedData, movieId) {
    let gender_divide_container = document.getElementById('genderDivide');
    // Chart Legend
    let chart_legend = createChartLegend();

    let gender_chart_container = customElement('div', 'chart-container', '', 'gender-chart-container');
    let gender_chart = customElement('canvas', '', '', 'gender-split');

    // Append Elements
    gender_divide_container.appendChild(chart_legend);
    gender_chart_container.appendChild(gender_chart);
    gender_divide_container.appendChild(gender_chart_container);

    // Get Data
    let genderData = formattedData[movieId]['cast_crew_stats'];

    // Populate Data
    let chartData = {
        labels: Object.keys(genderData['overall']).slice(0, 2),
        datasets: [{
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
        }]
    };


    // Chart Options
    let chartOptions = {
        responsive: true,
        legend: {display: false},
        tooltips: {
            callbacks: {
                title: function (tooltipItem, data) {
                    var data_Category = data['datasets'][tooltipItem[0]['datasetIndex']]['label'];  // Get Category Label
                    var data_type = data['labels'][tooltipItem[0]['index']];    // Get Data Type
                    return data_type + ' ' + data_Category
                },
                label: function (tooltipItem, data) {
                    var data_value = data['datasets'][0]['data'][tooltipItem['index']] + ' members';    // Get Data Value
                    var dataset = data['datasets'][0];                                                  // Calculate data percentage
                    var total = getTotal(dataset);
                    var data_percent = '(' + Math.round((dataset['data'][tooltipItem['index']] / total) * 100) + '%)';
                    return data_value + ' ' + data_percent
                }
            }
        }
    };

    // var gender_ctx = document.getElementById('gender-split').getContext('2d');

    // Build Chart
    var genderChart = new Chart($('#gender-split'), {
        type: 'doughnut',
        data: chartData,
        options: chartOptions
    });
}


// Add Posters once api call made
function addPosters(formattedData) {
    // Set BgImg to be first Trending Movie
    let bgImg = document.getElementById('bgImage');
    bgImg.style.backgroundImage = "url('" + formattedData[299534].backdrop_path + "')";
    bgImg.style.backgroundPosition = "center 8%";     // Forces poster to start from top of screen
    bgImg.style.backgroundSize = "100%";         // narrows over screen width but shows more content. Increase percentage and bgImg height

    addPlayButton(bgImg, formattedData);
    // addTrending(formattedData);
}

// Create Play btn within BgImg Poster
function addPlayButton(bgImg, formattedData) {
    if (bgImg.childElementCount < 1) {      // Check no element exist first
        // Create container & btn
        let play_container = customElement('div', '', '', 'play-container');
        let play_btn = customElement('div', '', '', 'play-btn');

        // Append btn to container, container to bg
        play_container.appendChild(play_btn);
        bgImg.appendChild(play_container);
    }
}

// Add Section Titles and loading animations
function addSectionTitles() {
    let sections = {
        awards: getContainerWithTitle('movieAwards', 'Awards & Nominations'),
        budget: getContainerWithTitle('budgetRevenue', 'Budget vs. Box Office'),
        filmLocation: getContainerWithTitle('filmLocations', 'Film Shoot Locations'),
        genderChart: getContainerWithTitle('genderDivide', 'Gender Divide : <div id="gender-chart-label"><span class="g-title">CAST</span> & <span class="g-title">CREW</span></div>', 'gender-title')
    };

    // Add Loader div to each element
    for (const key in sections) {
        sections[key].appendChild(customElement('div', 'loader', ''));
    }
}
