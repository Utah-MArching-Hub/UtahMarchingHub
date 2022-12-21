
    function onLoad() {
        const params = new Proxy(new URLSearchParams(window.location.search), {
            get: (searchParams, prop) => searchParams.get(prop),
        });
        // Get the value of "key" in eg "https://example.com/?key=value"
        // let key = params.key; is value
        let school = params.school;
        console.log(school);
        if (!(school == null)) {
            console.log(school);
            fillSchool(school);
        }
        getSchools()
    }

    function updateurl(key, value) {
        var queryParams = new URLSearchParams(window.location.search);
        queryParams.set(key, value);
        history.replaceState(null, null, "?" + queryParams.toString());
    }

    function showDrop() {
        document.getElementById("myDropdown").classList.toggle("show");
    }
      
    function filterFunction() {
        var input, filter, items, i;
        input = document.getElementById("myInput");
        filter = input.value.toUpperCase();
        div = document.getElementById("myDropdown");
        items = div.getElementsByTagName("a");
        for (i = 0; i < items.length; i++) {
          txtValue = items[i].textContent || items[i].innerText;
          if (filter == "") {
            items[i].style.display = "none";

          } else if (txtValue.toUpperCase().indexOf(filter) > -1) {
            items[i].style.display = "";
          } else {
            items[i].style.display = "none";
          }
        }
    }

    function getSchools() {
        document = Document;

        console.log("RUNNING")
        div = document.getElementsByClassName('dropdown-content')[0]
        $.getJSON('../scores/data/scores.json', function (json) {
            // console.log(json)
            //console.log(json["Scores"])
            scores = json["Scores"]
            schools = []
            for (score in scores) {
                row = scores[score]
                if (!schools.includes(row["school"])) {
                    schools.push(row["school"])
                }
            }
            console.log(schools)
            schools.sort()
            console.log(schools)
            for (num in schools) {
                school = schools[num]
                var item = document.createElement('a')
                item.innerHTML = school
                item.setAttribute('onclick', 'fillSchool("'+ school + '")')
                item.style.display = "none"
                $(div).append(item)
            }
        })
    }


    function fillSchool(school) {
        updateurl("school",school)
        console.log("FILLING: " + school)
        document = Document;

        schoolHead = document.getElementById('SchoolName')
        schoolHead.innerHTML = school
        


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
        $.getJSON('../scores/data/scores.json', function (json) {
            console.log(json)
            //console.log(json["Scores"])
            scores = json["Scores"]
            RScores = []
            // SCORE TABLE
            $('.tble-row').remove()
            for (score in scores) {
                row = scores[score]
                //console.log(row)
                if (school === row["school"]) {
                    // console.log("pass")
                    var scoreR = document.createElement('tr')
                    scoreR.classList.add('tble-row')
                    scoreR.setAttribute('ontouchstart', '')
                    RScores.push(row)

                    for (const key in order) {
                        if (Object.hasOwnProperty.call(order, key)) {
                            const score = order[key];

                            if (score == 'event' || score == "year") {
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
            // TTL SCORE CHART
            Events = []
            TtlScores = []
            for (num in RScores) {
                row = RScores[num]
                if (row["year"] == "2022") {
                    Events.push(row["event"])
                    console.log(row["scores"])
                    TtlScores.push(row["scores"]["score"])
                }
            }
            console.log(Events)
            console.log(TtlScores)

            const plugin = {
                id: 'customCanvasBackgroundColor',
                beforeDraw: (chart, args, options) => {
                  const {ctx} = chart;
                  ctx.save();
                  ctx.globalCompositeOperation = 'destination-over';
                  ctx.fillStyle = options.color || '#11111188';
                  ctx.fillRect(0, 0, chart.width, chart.height);
                  ctx.restore();
                }
              };

            new Chart("TTLscore", {
                type: "line",
                data: {
                    labels: Events,
                    datasets: [{
                        fill: false,
                        lineTension: 0.1,
                        backgroundColor: "rgba(255,195,36,1)",
                        borderColor: "rgba(255,195,36,0.1)",
                        data: TtlScores
                    }]
                },
                plugins: [plugin],
                options:{
                    legend: {display: false},
                    scales: {
                    yAxes: [{ticks: {min: 50, max:100}}],
                    }
                }
            });
        })
    }