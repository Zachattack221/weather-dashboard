$('.container').on('click','.submitBtn', function() {
    var cityEl = $(this).prev().val();
    localStorage.setItem('cityname', cityEl);
    var lastSearch = document.createElement('li');
    lastSearch.textContent = cityEl;
    console.log(cityEl);
    $('#previousSearchSection').append(JSON.stringify(cityEl).toUpperCase());
    $('.allSearches').addClass('btn-primary btn-lg btn-block');



    // if (p !== null) {

    // }
    // console.log(typeof(lastSearch));
    // console.log(JSON.stringify(lastSearch));
});

// $('#previousSearchSection').on('click','')

// TODO: button element with previous search needs to be functionally connected to search bar with function

// TODO: create functions that accociate with API key for open weather map

// TODO: remember to convert units to imperial 