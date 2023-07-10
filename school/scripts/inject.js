function load() {
    inject()
    scores()
}

function inject() {
    document = Document;

    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });
    let schoolN = params.school;
    $.getJSON('data/schools.json', function (json) {
        schools=json
        console.log(schoolN)
        console.log(schools[0])
        school=schools[schoolN]
        document.getElementById('name').innerHTML = schoolN
        for (id in school) {
            console.log(id)
            valids = ['icon','location','mascot','class']
            if (!valids.includes(id)) {
                continue
            }
            console.log(id)
            if(id == "icon") {
                document.getElementById(id).src = school[id]
            } else {
                document.getElementById(id).innerHTML = school[id]
            }
        }

        table = document.getElementsByClassName('scores')[0]
    })
}

function scores() {
    document = Document;

    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });
    let schoolN = params.school;

    $.getJSON('/scores/data/scores.json', function (json) {
        console.log(json)
        //console.log(json["Scores"])
        scores = json["Scores"]
        for (score in scores) {
            row = scores[score]
            //console.log(row)
            schoolP = false
            // console.log(`${event}=${row["event"]}`)
            if (schoolN === row["school"]) {
                schoolP = true
            }
            if (schoolP) {
                console.log(row)
                var scoreR = document.createElement('tr')
                scoreR.classList.add('tble-row')
                var item = document.createElement('td')
                item.innerHTML = row["event"]
                $(scoreR).append(item)
                var item = document.createElement('td')
                item.innerHTML = row["date"]
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
                $(table).append(scoreR)
            }
        }
    })
}