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

function update_url(key, value) {
    var queryParams = new URLSearchParams(window.location.search);
    queryParams.set(key, value);
    history.replaceState(null, null, "?" + queryParams.toString());
    updateScores()
}

function updateScores() {
    update_menus()
    reset_scores()
    getScores()
}

function reset_scores() {
    $('.sort-asc').removeClass('sort-asc');
    $('.sort-desc').removeClass('sort-desc');
    // let table = document.getElementById('scores')
    $('.tble-row').remove()
}

function updateDrops() {
    update_menus()
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });

    let year = params.year;
    if(year == null){
        year = "2023" //default value
        update_url('year', year)
    }
    yearDrop = document.getElementById("year")
    console.log(year)
    yearDrop.value = year


    let event = params.event;
    if(event == null){
        event = "NA" //default value
        update_url('event', event)
    }
    eventDrop = document.getElementById("event")
    console.log('event', event)
    eventDrop.value = event

    let class_ = params.class;
    if(class_ == null){
        class_ = "NA" //default value
        update_url('class', class_)
    }
    let classDrop = document.getElementById("class")
    console.log(class_)
    classDrop.value = class_

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
        let scores = json["Scores"]
        for (score in scores) {
            row = scores[score]
            //console.log(row)
            let yearP = false
            let eventP = false
            let clasP = false

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
                // console.log(table.tabIndex)
                // if (table.tabIndex > 0) {
                //     for (const v in scoreR.children) {
                //         if (Object.hasOwnProperty.call(scoreR.children, v)) {
                //             const value = scoreR.children[v];
                //             // console.log(row)
                //             console.log(value)
                //             value.tabIndex = table.tabIndex
                //         }
                //     }
                // }
            }
        }
    })
}
