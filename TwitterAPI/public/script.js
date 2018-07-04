(function() {
    $.ajax({
        url: "/links.json",
        method: "GET",
        success: function(linksList) {
            var html = "";
            var headlines = $("#headlines");
            var spaceToTheLeft = headlines.offset().left;
            var animId;
            for (var i = 0; i < linksList.length; i++) {
                html +=
                    '<a class="sites" href=' +
                    linksList[i].href +
                    ">" +
                    linksList[i].text +
                    "</a>";
            }
            headlines.html(html);

            function moving() {
                spaceToTheLeft -= 2;
                animId = requestAnimationFrame(moving);
                if (
                    spaceToTheLeft <
                    -$("a")
                        .eq(0)
                        .outerWidth()
                ) {
                    spaceToTheLeft += $("a")
                        .eq(0)
                        .outerWidth();
                    headlines.append($("a").eq(0));
                    $("a");
                }
                headlines.css("left", spaceToTheLeft + "px");
            }

            moving();

            headlines.on("mouseenter", function() {
                cancelAnimationFrame(animId);
            });

            headlines.on("mouseleave", function() {
                moving();
            });
        }
    });
})();
