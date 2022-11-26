
    function onLoad() {
        getSchools()
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
    
        const params = new Proxy(new URLSearchParams(window.location.search), {
            get: (searchParams, prop) => searchParams.get(prop),
        });
    
        let year = params.year;
        let school = params.school;
    
        // let order = []
        // let header = document.querySelector('.tbl-header').children[0].children
        // for (const key in header) {
        //     if (Object.hasOwnProperty.call(header, key)) {
        //         const el = header[key];
        //         order.push(el.getAttribute('value'))
        //     }
        // }
        
        // order.splice(order.indexOf('school'), 1)
        // console.log(order)
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
                item.setAttribute('href', 'FName('+ school + ')')
                item.style.display = "none"
                $(div).append(item)
            }
        })
    }