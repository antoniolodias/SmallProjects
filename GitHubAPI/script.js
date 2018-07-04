(function() {
    ////////////////////////////DONT TOUCH//////////////////////////////////
    Handlebars.templates = Handlebars.templates || {};

    var templates = document.querySelectorAll(
        'script[type="text/x-handlebars-template"]'
    );

    Array.prototype.slice.call(templates).forEach(function(script) {
        Handlebars.templates[script.id] = Handlebars.compile(script.innerHTML);
    });
    //////////////////////////////////DONT TOUCH/////////////////////////////

    var username = $('input[name="username"]').val();
    var password = $('input[name="password"]').val();
    var baseUrl = "https://api.github.com";
    $("button").on("click", function(e) {
        e.preventDefault();

        var usernameToSearch = $('input[name="username-to-search"]').val();

        var endpoint = "/users/" + usernameToSearch + "/repos";

        $.ajax({
            url: baseUrl + endpoint,
            headers: {
                Authorization: "Basic " + btoa(username + ":" + password) //btoa takes a string and converts it in a cripted message, atob changes it back
            },
            success: function(payload) {

                var reposContainer = $(".reposContainer");
                reposContainer.html(
                    Handlebars.templates.repos({
                        repos: payload
                    })
                );
            }
        });
    });

    $(document).on("click", ".result", function(e) {
        var repoName = $(e.currentTarget)
            .find("p")
            .text();
        var secondEndpoint = "/repos/" + repoName + "/commits";

        $.ajax({
            url: baseUrl + secondEndpoint,
            headers: {
                Authorization: "Basic " + btoa(username + ":" + password)
            },

            success: function(data) {
                var limit = data.slice(0, 10);
                $(e.target)
                    .append(
                        Handlebars.templates.commits({
                            commits: limit 
                        })
                    );
            }
        });
    });
})();
