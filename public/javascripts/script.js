console.log('JavaScript file successfully served and linked!');
$("input#search-field").on('input', function () {
    if($("input#search-field").val() === ''){
        $("#search-form").submit();
    }
});

