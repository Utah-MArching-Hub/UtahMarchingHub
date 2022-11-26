
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
        document = Document;

        schoolHead = document.getElementById("SchoolName")
        schoolHead.innerHTML = school
    }