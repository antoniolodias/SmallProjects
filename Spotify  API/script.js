(function() {
    var searchButton = $(".searchButton");
    var moreButton = $(".moreButton");
    var resultsMessage = $(".resultsMessage");
    var resultsList = $("#resultsList");

    var moreUrl;

    function getResults() {
        var resultHtml = "";
        $.ajax({
            url: "https://elegant-croissant.glitch.me/spotify",
            method: "GET",
            data: {
                query: $("input").val(),
                type: $("select").val()
            },
            success: function(data) {
                data = data.artists || data.albums;
                for (var i = 0; i < data.items.length; i++) {
                    resultHtml +=
                        '<div class="singleResult"><div class="resultImage"><a href="' +
                        data.items[i].external_urls.spotify +
                        '"><img  border="0" src="' +
                        (data.items[i].images.length
                            ? data.items[i].images[0].url
                            : "noImg.jpg") +
                        '">' +
                        "</a></div>" +
                        '<div class="resultName"> <a href="' +
                        data.items[i].external_urls.spotify +
                        '">' +
                        data.items[i].name +
                        "</div></div>";
                }
                resultsList.html(resultHtml);
                infiniteScroll();

                resultsMessage.css("left", "auto");
                $(".line").css("width", "100%");
                data.items.length == 0
                    ? resultsMessage.html("No Results")
                    : resultsMessage.html(
                          'Results for "' + $("input").val() + '"'
                      );

                if (data.next != null) {
                    moreUrl = data.next.replace(
                        "api.spotify.com/v1/search",
                        "elegant-croissant.glitch.me/spotify"
                    );
                    if (location.search.indexOf("scroll=infinite") > -1) {
                        return;
                    } else {
                        moreButton.css("visibility", "visible");
                    }
                } else {
                    moreUrl = null;
                    moreButton.css("visibility", "hidden");
                }
                resultsList.html(resultHtml);
            }
        });
    }
    searchButton.on("click", getResults);
    $("input").on("keydown", function(e) {
        if (e.keyCode == 13) {
            getResults();
        }
    });

    function getMore() {
        $.ajax({
            url: moreUrl,
            method: "GET",

            success: function(data) {
                var moreResults = "";
                data = data.artists || data.albums;

                if (data.next != null) {
                    moreUrl = data.next.replace(
                        "api.spotify.com/v1/search",
                        "elegant-croissant.glitch.me/spotify"
                    );
                } else {
                    moreButton.css("visibility", "hidden");
                    moreUrl = null;
                }

                for (var i = 0; i < data.items.length; i++) {
                    moreResults +=
                        '<div class="singleResult"><div class="resultImage"><a href="' +
                        data.items[i].external_urls.spotify +
                        '"><img  border="0" src="' +
                        (data.items[i].images.length
                            ? data.items[i].images[0].url
                            : "noImg.jpg") +
                        '">' +
                        "</a></div>" +
                        '<div class="resultName"> <a href="' +
                        data.items[i].external_urls.spotify +
                        '">' +
                        data.items[i].name +
                        "</div></div>";
                }

                resultsList.append(moreResults);
                infiniteScroll();
            }
        });
    }
    moreButton.on("click", getMore);

    //INFINITE SCROLL------------------------------------------------------

    function infiniteScroll() {
        if (location.search.indexOf("scroll=infinite") > -1) {
            if (
                $(document).scrollTop() + $(window).height() >=
                $(document).height() - 100
            ) {
                getMore();
            } else {
                setTimeout(infiniteScroll, 500);
            }
        }
    }
})();
