const json = $.getJSON('../data/scores.json')
// console.log(scores)
// console.log("---")
// console.log(scores["Scores"])
// console.log("---")
// console.log(scores["Scores"][3])

function sortTable(n, ele) {
    var table,
      rows,
      switching,
      i,
      x,
      y,
      shouldSwitch,
      dir,
      switchcount = 0;
    table = document.getElementById("scores");
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
      for (i = 1; i < rows.length - 1; i++) {
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
  }

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
    $.getJSON('../data/scores.json', function(json) {
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