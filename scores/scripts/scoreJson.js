// const json = $.getJSON('data/scores.json')
// console.log(scores)
// console.log("---")
// console.log(scores["Scores"])
// console.log("---")
// console.log(scores["Scores"][3])
function urlkey() {
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });
    // Get the value of "key" in eg "https://example.com/?key=value"
    // let key = params.key; is value
    let year = params.year;
    let event = params.event;
    alert('year:' + year + ',event:' + event)
}

function updateurl(key, value) {
    
    var queryParams = new URLSearchParams(window.location.search);
    queryParams.set(key, value);
    history.replaceState(null, null, "?" + queryParams.toString());
    updateScores()
}

function updateScores() {
    resetScores()
    getScores()
}

function resetScores() {
    $('.sort-asc').removeClass('sort-asc');
    $('.sort-desc').removeClass('sort-desc');
    // let table = document.getElementById('scores')
    $('.tble-row').remove()
}

function updateDrops() {
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });

    let year = params.year;
    if(year == null){
        year = "2021" //default value
        updateurl('year', year) 
    }
    yearDrop = document.getElementById("year")
    console.log(year)
    yearDrop.setval(year)
    

    let event = params.event;
    if(event == null){
        event = "NA" //default value 
        updateurl('event', event)
    }
    eventDrop = document.getElementById("event")
    console.log(event)
    eventDrop.setval(event)

    let clas = params.clas;
    if(clas == null){
        clas = "NA" //default value 
        updateurl('clas', clas)
    }
    clasDrop = document.getElementById("clas")
    console.log(clas)
    clasDrop.setval(clas)

    getScores();
}

function getScores() {
    document = Document;

    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });

    let year = params.year;
    let event = params.event;
    let clas = params.clas;

    let order = []
    let header = document.querySelector('.tbl-header').children[0].children
    for (const key in header) {
        if (Object.hasOwnProperty.call(header, key)) {
            const el = header[key];
            order.push(el.getAttribute('value'))
        }
    }
    
    // order.splice(order.indexOf('school'), 1)
    console.log(order)

    table = document.getElementsByClassName('scores')[0]
    $.getJSON('data/scores.json', function (json) {
        // console.log(json)
        //console.log(json["Scores"])
        scores = json["Scores"]
        for (score in scores) {
            row = scores[score]
            //console.log(row)
            yearP = false
            eventP = false
            clasP = false

            // console.log(`${year}=${row["year"]}`)
            if (year === row["year"]) {
                yearP = true
            }
            // console.log(`${event}=${row["event"]}`)
            if (event === row["event"]) {
                eventP = true
            }
            // console.log(`${clas}=${row["class"]}`)
            if (clas === row["class"]) {
                clasP = true
            }

            if (yearP && eventP && clasP) {
                // console.log("pass")
                var scoreR = document.createElement('tr')
                scoreR.classList.add('tble-row')
                scoreR.setAttribute('ontouchstart', '')

                for (const key in order) {
                    if (Object.hasOwnProperty.call(order, key)) {
                        const score = order[key];

                        if (score == 'school') {
                            var item = document.createElement('td')
                            // var link = document.createElement('a')
                            // link.innerHTML = row[score]
                            // link.href = "/school/?school=" + row[score]
                            // $(item).append(link)
                            item.innerHTML = row[score]
                            $(scoreR).append(item)
                        } else {
                            console.log(score)
                            num = row['scores'][score]
                            var item = document.createElement('td')
                            item.innerHTML = num
                            $(scoreR).append(item)
                        }
                    }
                }
                $(table).append(scoreR)
            }
        }
    })
}
