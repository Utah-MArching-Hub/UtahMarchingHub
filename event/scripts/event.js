
function load() {
    get();
    getScores("score21",2021);
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
        events = json["events"]
        event = events[eName]
        for(item in event) {
            // console.log(item)
            // console.log(Object.keys(event[item]).length)
            if(Object.keys(event[item]).length == 2) {
                var row = document.createElement("tr")
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
                scoreR.classList.add('tble-score')
                scoreR.setAttribute('ontouchstart', '')
                var item = document.createElement('td')
                item.innerHTML = row["school"]
                $(scoreR).append(item)
                for (key in row['scores']) {
                    num = row['scores'][key]
                    var item = document.createElement('td')
                    item.innerHTML = num
                    $(scoreR).append(item)
                }
                var item = document.createElement('td')
                item.innerHTML = row["class"]
                $(scoreR).append(item)
                $(tableScore).append(scoreR)
            }
        }
    })
}


function sortTable(n, ele) {
    $('.sort-asc').removeClass('sort-asc');
    $('.sort-desc').removeClass('sort-desc');

    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.querySelectorAll("table")[1];
    switching = true;
    //Set the sorting direction to ascending:
    dir = "asc";
    /*Make a loop that will continue until
    no switching has been done:*/
    while (switching) {
        //start by saying: no switching is done:
        switching = false;
        rows = table.rows;
        /*Loop through all table rows (except the
        first, which contains table headers):*/
        for (i = 1; i < (rows.length - 1); i++) {
            //start by saying there should be no switching:
            shouldSwitch = false;
            /*Get the two elements you want to compare,
            one from current row and one from the next:*/
            x = rows[i].getElementsByTagName("TD")[n];
            y = rows[i + 1].getElementsByTagName("TD")[n];
            /*check if the two rows should switch place,
            based on the direction, asc or desc:*/
            if (dir == "asc") {
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    //if so, mark as a switch and break the loop:
                    shouldSwitch = true;
                    break;
                }
            } else if (dir == "desc") {
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                    //if so, mark as a switch and break the loop:
                    shouldSwitch = true;
                    break;
                }
            }
        }
        if (shouldSwitch) {
            /*If a switch has been marked, make the switch
            and mark that a switch has been done:*/
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            //Each time a switch is done, increase this count by 1:
            switchcount++;
        } else {
            /*If no switching has been done AND the direction is "asc",
            set the direction to "desc" and run the while loop again.*/
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
    ele.classList.add('sort-' + dir);
}
