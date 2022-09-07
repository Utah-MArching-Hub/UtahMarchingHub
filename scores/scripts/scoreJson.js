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
      alert('year:'+ year+ ',event:' + event)
}

function updateurl(key,value) {
  var queryParams = new URLSearchParams(window.location.search);
  queryParams.set(key, value);
  history.replaceState(null, null, "?"+queryParams.toString());
//   window.location.reload()
//   getScores()
}

function getScores() {
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });
    let year = params.year;
    yearDrop = document.getElementById("year")
    $(yearDrop).val(year).change()
    console.log(year)
    let event = params.event;
    eventDrop = document.getElementById("event")
    $(eventDrop).val(event).change()
    let clas = params.clas;
    clasDrop = document.getElementById("clas")
    $(clasDrop).val(clas).change()
    document = Document;
    table = document.getElementsByClassName('scores')[0]
    $.getJSON('data/scores.json', function(json) {
        console.log(json)
        //console.log(json["Scores"])
        scores = json["Scores"]
        for (score in scores) {
            row = scores[score]
            //console.log(row)
            yearP = false
            eventP = false
            clasP = false

            console.log(`${year}=${row["year"]}`)
            if (year === row["year"]) {
                yearP = true
            }
            console.log(`${event}=${row["event"]}`)
            if (event === row["event"]) {
                eventP = true
            }
            console.log(`${clas}=${row["class"]}`)
            if (clas === row["class"]) {
                clasP = true
            }
            if (yearP && eventP && clasP) {
                console.log("pass")
                var scoreR = document.createElement('tr')
                var item = document.createElement('td')
                item.innerHTML = row["school"]
                $(scoreR).append(item)
                for (key in row['scores']) {
                    num = row['scores'][key]
                    var item = document.createElement('td')
                    item.innerHTML = num
                    $(scoreR).append(item)
                }
                $(table).append(scoreR)
            }
        }
    })
}
