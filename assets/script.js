$('.container').on('click','.submitBtn', function() {
    var cityEl = $(this).prev().val();
    localStorage.setItem('button', cityEl);
    var lastSearch = document.createElement('button');
    lastSearch.textContent = cityEl;
    document.body.appendChild(lastSearch);
});