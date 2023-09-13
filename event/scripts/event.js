
function load() {
    get();
    getScores("score22",2022);
}

function updateurl(key, value) {
    
    var queryParams = new URLSearchParams(window.location.search);
    queryParams.set(key, value);
    history.replaceState(null, null, "?" + queryParams.toString());
}

function get() {
    document = Document;

    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });

    let eName = params.event;

    document.querySelectorAll("h1")[1].innerHTML = eName

    tableSch = document.querySelectorAll('table')[0]
    console.log(tableSch)
    $.getJSON('data/schedules.json', function (json) {
        let events = json["events"]
        let event = events[eName]
        for(item in event) {
            // console.log(item)
            // console.log(Object.keys(event[item]).length)
            if(Object.keys(event[item]).length == 2) {
                var row = document.createElement("tr")
                row.classList.add('tble-row')
                row.setAttribute("style","--row-color-even: #D92626; --row-color-odd: #D92626;") 
                var TItem = document.createElement("td")
                TItem.innerHTML = event[item]["txt"]
                TItem.setAttribute("colspan",2)
                $(row).append(TItem)
                var TItem2 = document.createElement("td")
                TItem2.innerHTML = event[item]["2time"]
                TItem2.setAttribute("colspan",2)
                $(row).append(TItem2)
                $(tableSch).append(row)
            } else {
                var row = document.createElement("tr")
                row.classList.add('tble-row')
                var TItem = document.createElement("td")
                TItem.innerHTML = item
                $(row).append(TItem)
                var TItem2 = document.createElement("td")
                TItem2.innerHTML = event[item]['location']
                $(row).append(TItem2)
                var TItem3 = document.createElement("td")
                TItem3.innerHTML = event[item]["class"]
                $(row).append(TItem3)
                var TItem4 = document.createElement("td")
                TItem4.innerHTML = event[item]["time"]
                $(row).append(TItem4)
                $(tableSch).append(row)
            }
        }


        
    })
}


function getScores(cname,year) {
    document = Document;

    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });

    let event = params.event;

    skip = ["MEnsemble","MEffect","VEnsemble","VEffect"]

    tableScore = document.getElementsByClassName(cname)[0]
    $.getJSON('../scores/data/scores.json', function (json) {
        // console.log(json)
        // console.log(json["Scores"])
        scores = json["Scores"]
        for (score in scores) {
            row = scores[score]
            console.log(row)
            yearP = false
            eventP = false

            // console.log(`${year}=${row["year"]}`)
            if (year.toString() === row["year"]) {
                yearP = true
                // console.log("yTRUE")
            }
            // console.log(`${event}=${row["event"]}`)
            if (event === row["event"]) {
                eventP = true
                // console.log("eTRUE")
            }
            if (yearP && eventP ) {
                console.log("pass")
                var scoreR = document.createElement('tr')
                scoreR.classList.add('tble-row')
                scoreR.setAttribute('ontouchstart', '')
                var item = document.createElement('td')
                item.innerHTML = row["school"]
                $(scoreR).append(item)
                for (key in row['scores']) {
                    if(!skip.includes(key)){
                        num = row['scores'][key]
                        var item = document.createElement('td')
                        item.innerHTML = num
                        $(scoreR).append(item)
                    }
                }
                var item = document.createElement('td')
                item.innerHTML = row["class"]
                $(scoreR).append(item)
                $(tableScore).append(scoreR)
            }
        }
    })
}


