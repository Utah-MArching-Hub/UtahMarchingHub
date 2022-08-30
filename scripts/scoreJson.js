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
}

function getScores() {
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });
    let year = params.year;
    let event = params.event;
    let clas = params.clas;
    document = Document;
    $.getJSON('../data/scores.json', function(json) {
        console.log(json)
        console.log(json["Scores"])
        scores = json["Scores"]
        for (score in scores) {
            console.log(scores[score])
            console.log(`${year}=${scores[score]["year"]}`)
            console.log(`${event}=${scores[score]["event"]}`)
            console.log(`${clas}=${scores[score]["class"]}`)
            yearP = false
            eventP = false
            clasP = false

            if (year = scores[score]["year"]) {
                yearP = true
            }
            if (event = scores[score]["event"]) {
                eventP = true
            }
            if (clas = scores[score]["class"]) {
                clasP = true
            }
            if (yearP && eventP && clasP) {
                // var scoreR = document.createElement('tr')
                for (item in scores[score]) {
                    console.log(item)
                }
            }
        }
    })
}