var CompSuite = (function (window, undefined) {
    var domain = "https://bridge.competitionsuite.com/";
    var version = "1.1.5";

    var cdn = "https://cdn.competitionsuite.io/bridge/" + version;
    var cssFile = cdn + "/css/orgscores.min.css";
    var jqueryFile = cdn + "/js/jquery.min.js";
    var momentFile = cdn + "/js/moment.min.js";

    var currentOrgGuid = null;
    var currentSeasonGuid = null;
    var currentOrgInitials = "";

    var settingMax = 0;
    var settingTest = false;
    var settingLoad = null;
    var settingFullRecap = true;
    var settingCategoryRecap = true;

    function loadSupportingFiles(callback) {
        loadScript(jqueryFile, function () {
            loadScript(momentFile, function () {
                callback();
            });
        });

        loadStyleSheet(cssFile, function () { });
    }

    function getSeasons() {
        CompSuite.$.getJSON(domain + "api/orgscores/GetSeasons/jsonp?organization=" + currentOrgGuid + "&version=" + version + "&callback=?", function (result) {
            drawSeasonList(result);
        });
    }

    function drawSeasonList(data) {
        var htmlOutput = "";

        currentOrgInitials = data.organizationInitials;

        CompSuite.$('#cs-org-scores-header').show();
        CompSuite.$('#cs-org-scores-header').text("Past Seasons");

        CompSuite.$('#cs-org-scores-menu').hide();
        CompSuite.$('#cs-org-scores-menu-viewEvents').hide();
        CompSuite.$('#cs-org-scores-subheader').hide();
        CompSuite.$('#cs-org-scores-menu-viewSeasons').hide();

        if (!data || !data.length) {
            CompSuite.$('#cs-org-scores-header').hide();
            htmlOutput += "<div style='padding-top: 10px; padding-bottom: 10px; border: 1px solid #d9d9d9; border-left: 0; border-right: 0;'>No Seasons Available</div>";
        } else {
            CompSuite.$('#cs-org-scores-header').show();
            CompSuite.$('#cs-org-scores-header').text(data.name);
            htmlOutput += "<div class='eventList'>";

            for (var a = 0; a < data.length; a++) {
                var item = data[a];

                htmlOutput += "<div class='event' onclick=\"CompSuite.LoadSeason('" + item.seasonGuid + "');\">";
                htmlOutput += "<div>" + item.name + "</div>";
                htmlOutput += "</div>";
            }

            htmlOutput += "</div>";
        }

        CompSuite.$("#cs-org-scores-area").html(htmlOutput);
    }

    function loadSeason(season) {
        currentSeasonGuid = season;
        getEvents();
    }



    function getEvents() {
        if (currentSeasonGuid) {
            CompSuite.$.getJSON(domain + "api/orgscores/GetCompetitionsBySeason/jsonp?season=" + currentSeasonGuid + "&showTrainingEvents=" + settingTest + "&version=" + version + "&callback=?", function (result) {
                drawCompetitionList(result);
            });
        } else {
            CompSuite.$.getJSON(domain + "api/orgscores/GetCompetitionsByOrganization/jsonp?organization=" + currentOrgGuid + "&showTrainingEvents=" + settingTest + "&version=" + version + "&callback=?", function (result) {
                drawCompetitionList(result);
            });
        }
    }

    function drawCompetitionList(data) {
        var htmlOutput = "";

        currentOrgInitials = data.organizationInitials;

        CompSuite.$('#cs-org-scores-menu').show();
        CompSuite.$('#cs-org-scores-menu-viewEvents').hide();
        CompSuite.$('#cs-org-scores-subheader').hide();
        CompSuite.$('#cs-org-scores-menu-viewSeasons').show();

        if (!data || !data.competitions.length) {
            CompSuite.$('#cs-org-scores-header').hide();
            htmlOutput += "<div style='padding-top: 10px; padding-bottom: 10px; border: 1px solid #d9d9d9; border-left: 0; border-right: 0;'>No Scores Available</div>";
        } else {
            CompSuite.$('#cs-org-scores-header').show();
            CompSuite.$('#cs-org-scores-header').text(data.name);
            htmlOutput += "<div class='eventList'>";

            var max = data.competitions.length;

            if (max > settingMax && settingMax > 0) {
                max = settingMax;
            }

            for (var a = 0; a < max; a++) {
                var item = data.competitions[a];

                htmlOutput += "<div class='event' onclick=\"CompSuite.LoadEvent('" + item.competitionGuid + "');\">";
                htmlOutput += "<div>" + item.name + "</div>";

                var subtitle = moment(item.competitionDate).format("l");
                if (item.location) {
                    subtitle += " - " + item.location;
                }
                htmlOutput += "<div class='location'>" + subtitle + "</div>";
                htmlOutput += "</div>";
            }

            if (max < data.competitions.length) {
                htmlOutput += "<select class='cs-past-events' onchange=\"CompSuite.LoadDropdownEvent(this);\"><option val=''>More Past Events</option>";
                for (var b = max; b < data.competitions.length; b++) {
                    var item2 = data.competitions[b];

                    var name = moment(item2.competitionDate).format("l") + " - " + item2.name;

                    if (item2.location) {
                        name += ' - ' + item2.location;
                    }

                    htmlOutput += "<option value='" + item2.competitionGuid + "'>" + name + "</option>";
                }
                htmlOutput += "</select>";
            }

            htmlOutput += "</div>";
        }

        CompSuite.$("#cs-org-scores-area").html(htmlOutput);
    }

    function loadDropdownEvent(dropdown) {
        var val = CompSuite.$(dropdown).val();

        if (!val) {
            return;
        }

        getPerformances(val);
    }

    function getPerformances(competition) {
        if (competition) {
            CompSuite.$.getJSON(domain + "api/orgscores/GetCompetition/jsonp?competition=" + competition + "&version=" + version + "&callback=?", function (result) {
                drawPerformanceList(result);
            });
        } else {
            CompSuite.$.getJSON(domain + "api/orgscores/GetLatestCompetition/jsonp?organization=" + currentOrgGuid + "&version=" + version + "&callback=?", function (result) {
                if (result) {
                    drawPerformanceList(result);
                } else {
                    getEvents();
                }
            });
        }
    }

    function drawPerformanceList(data) {
        var htmlOutput = "";

        CompSuite.$('#cs-org-scores-header').show();
        CompSuite.$('#cs-org-scores-subheader').show();
        CompSuite.$('#cs-org-scores-menu').show();
        CompSuite.$('#cs-org-scores-menu-viewSeasons').hide();
        CompSuite.$('#cs-org-scores-menu-viewEvents').show();

        if (!data || !data.rounds.length) {
            htmlOutput += "<div style='padding-top: 10px; padding-bottom: 10px; border: 1px solid #d9d9d9; border-left: 0; border-right: 0;'>No Performances Available</div>";
        } else {
            CompSuite.$('#cs-org-scores-header').text(data.name);

            var subhead = moment(data.competitionDate).format("l");

            if (data.location) {
                subhead += ' - ' + data.location;
            }

            CompSuite.$('#cs-org-scores-subheader').text(subhead);

            htmlOutput += '<div>';

            for (var a = 0; a < data.rounds.length; a++) {
                var round = data.rounds[a];
                htmlOutput += "<div class='roundArea'>";
                htmlOutput += "<div class='roundName'>" + round.name;

                if (settingFullRecap && round.fullRecapUrl) {
                    htmlOutput += "<div style='float: right; font-size: 12px; font-weight: normal;'><a href='" + round.fullRecapUrl + "' target='_blank'>View Recap</a></div>";
                } else if (settingCategoryRecap && round.categoryRecapUrl) {
                    htmlOutput += "<div style='float: right; font-size: 12px; font-weight: normal;'><a href='" + round.categoryRecapUrl + "' target='_blank'>View Recap</a></div>";
                }

                htmlOutput += "</div>";

                for (var b = 0; b < round.performances.length; b++) {
                    var perf = round.performances[b];

                    htmlOutput += "<div class='clearfix scoreRow'>";
                    htmlOutput += "<div class='rank'>" + perf.rank + "</div>";
                    htmlOutput += "<div class='group'>" + perf.name + "</div>";
                    htmlOutput += "<div class='score'>" + perf.score.toFixed(3) + "</div>";
                    htmlOutput += "</div>";
                }

                htmlOutput += "</div>";
            }
            htmlOutput += "</div>";
        }

        CompSuite.$("#cs-org-scores-area").html(htmlOutput);
    }

    function loadScript(url, callback) {
        var script = document.createElement('script');
        script.async = true;
        script.src = url;

        var entry = document.getElementsByTagName('script')[0];
        entry.parentNode.insertBefore(script, entry);

        if (script.addEventListener) {
            script.addEventListener("load", callback, false);
        } else {
            script.attachEvent("onreadystatechange", function () {
                if (/complete|loaded/.test(script.readyState)) {
                    callback();
                }
            });
        }
    }

    function loadStyleSheet(url, callback) {

        var link = document.createElement('link');



        link.rel = "stylesheet";

        link.type = "text/css";

        link.href = url;



        var entry = document.getElementsByTagName("script")[0];

        entry.parentNode.insertBefore(link, entry);



        var testElement = document.createElement("span");

        testElement.id = "css-ready";



        entry.parentNode.insertBefore(testElement, entry);



        (function () {

            var node = document.getElementById("css-ready");



            var value = null;



            if (window.getComputedStyle) {

                value = document.defaultView.getComputedStyle(node, null).getPropertyValue("color");

            }

            else if (testElement.currentStyle) {

                value = node.currentStyle["color"];

            }



            if (value && value === "rgb(121, 121, 121)" || value === "#797979") {

                callback();

            } else {

                setTimeout(arguments.callee, 100);

            }

        })();

    }



    loadSupportingFiles(function () {
        var element = CompSuite.$('[data-compsuite-org]').first();
        currentOrgGuid = element.attr("data-compsuite-org");

        if (element.attr("data-compsuite-max")) {
            settingMax = parseInt(element.attr("data-compsuite-max"));
        }

        if (element.attr("data-compsuite-test") === "true") {
            settingTest = true;
        }

        if (!currentOrgGuid) {
            return;
        }

        var attrRecap = element.attr("data-compsuite-recap");

        if (attrRecap && attrRecap.toLowerCase() === "false") {
            settingFullRecap = false;
        }

        var attrCategoryRecap = element.attr("data-compsuite-recap-category");

        if (attrCategoryRecap && attrCategoryRecap.toLowerCase() === "false") {
            settingCategoryRecap = false;
        }

        var attrLoad = element.attr("data-compsuite-load");

        var html = "<div id='cs-org-scores'>";
        html += "<div id='cs-org-scores-menu' style='display: none;'>";
        html += "<div id='cs-org-scores-menu-viewSeasons' style='display: none;'><a href='#' onclick=\"CompSuite.LoadSeasons(); return false;\">View Past Seasons</div>";
        html += "<div id='cs-org-scores-menu-viewEvents' style='display: none;'><a href='#' onclick=\"CompSuite.LoadEvents(); return false;\">View Event List</a></div>";
        html += "</div>";
        html += "<div id='cs-org-scores-header' style='display: none;'></div>";
        html += "<div id='cs-org-scores-subheader' style='display: none;'></div>";
        html += "<div id='cs-org-scores-area'></div>";
        html += "<div style='text-align: center;padding: 5px;'><a href='http://competitionsuite.com?source=bridge' target='_blank'><img src='" + cdn + "/img/logo.png' alt='CompetitionSuite' style='width: 200px;' /></a></div>";
        html += "</div>";

        CompSuite.$('[data-compsuite-org]').first().removeAttr('data-compsuite-org').before(html);

        if (attrLoad === "event") {
            getPerformances();
        } else {
            getEvents();
        }
    });

    return {
        LoadSeasons: getSeasons,
        LoadSeason: loadSeason,
        LoadEvents: getEvents,
        LoadEvent: getPerformances,
        LoadDropdownEvent: loadDropdownEvent
    };
})(window);

