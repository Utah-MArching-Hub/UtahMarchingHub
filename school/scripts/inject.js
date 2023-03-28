function load() {
    inject()
    scores()
    trophies()
}

function inject() {
    document = Document;

    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });
    let schoolN = params.school;
    let disctrict = params.disctrict;
    console.log(disctrict)
    $.getJSON('/schools/district/'+disctrict+'.json', function (json) {
        school=json[schoolN]
        console.log(school)

        document.getElementById("logo").src = school['icon']
        document.getElementById("location").innerHTML = school['location']
        document.getElementById("mascot").innerHTML = school['mascot']
        document.getElementById("name").innerHTML = schoolN
        table = document.getElementsByClassName('scores')[0]
    })
}

function scores() {
    document = Document;

    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });
    let schoolN = params.school;

    // Send a GET request to /scores/data/scores.json and execute a callback function when the request is complete.
    $.getJSON('/scores/data/scores.json', function (json) {
        
        scores = json["Scores"] // Get the "Scores" array from the JSON data.
        
        // Loop through each item in the "Scores" array.
        for (score in scores) {
            row = scores[score] // Get the current item.
            
            schoolP = false // Initialize a boolean variable.
            
            // Check if the current row's school matches the previous row's school.
            if (schoolN === row["school"]) {
                schoolP = true // If they match, set the boolean variable to true.
            }
            
            if (schoolP) {
                
                // Create a new table row element and add a class to it.
                var scoreR = document.createElement('tr')
                scoreR.classList.add('tble-row')
                
                // Create a new table cell element and set its inner HTML to the "event" property of the current row.
                var item = document.createElement('td')
                item.innerHTML = row["event"]
                $(scoreR).append(item) // Append the table cell to the table row.
                
                // Create a new table cell element and set its inner HTML to the "date" property of the current row.
                var item = document.createElement('td')
                item.innerHTML = row["date"]
                $(scoreR).append(item) // Append the table cell to the table row.
                
                // Loop through each key in the "scores" object of the current row.
                for (key in row['scores']) {
                    num = row['scores'][key] // Get the value of the current key.
                    
                    // Create a new table cell element and set its inner HTML to the value of the current key.
                    var item = document.createElement('td')
                    item.innerHTML = num
                    $(scoreR).append(item) // Append the table cell to the table row.
                }
                
                // Create a new table cell element and set its inner HTML to the "class" property of the current row.
                var item = document.createElement('td')
                item.innerHTML = row["class"]
                $(scoreR).append(item) // Append the table cell to the table row.
                table = document.getElementsByClassName('scores')[0]
                
                $(table).append(scoreR) // Append the table row to the table.
            }
        }
    })
}

function trophies() {
    document = Document;

    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });
    let schoolN = params.school;
    $.getJSON('/scores/data/scores.json', function (json) {
        
        scores = json["Scores"] // Get the "Scores" array from the JSON data.
        
        var events = {}
        var check = []

        // Loop through each item in the "Scores" array.
        for (score in scores) {
            var row = scores[score] // get the current item
            var year = row["year"]
            var event  = row["event"]
            var clas  = row["class"]
            var date  = row["date"]

            if(!(year in events)){
                events[year] = {}
            }
            if(!(event in events[year])){
                events[year][event] = {}
            }
            if(!(clas in events[year][event])){
                events[year][event][clas] = []
            }

            events[year][event][clas].push(row)
            if(row["school"]===schoolN){
                check.push([year,event,clas,date])
            }
        }
        console.log(events)
        console.log(check)
        check.sort(function(a,b){
            return - new Date(b[3]) - new Date(a[3]);
        })
        console.log(check)
        casse = document.querySelector("#case")

        for (keys in check) {
            keys = check[keys]
            event = events[keys[0]][keys[1]][keys[2]]
            for (school in event) {
                school=event[school]
                if(school["school"] === schoolN ){
                    checkschool = school["scores"]
                }
            }
            music = true
            visual = true
            guard = true
            drum = true
            place = 1 
            for (school in event) {
                school = event[school]
                if(!(school["school"] === schoolN)) {
                    if(school["scores"]["MScore"] > checkschool["MScore"]){
                        music = false
                    }
                    if(school["scores"]["VScore"] > checkschool["VScore"]){
                        visual = false
                    }
                    if(school["scores"]["Guard"] > checkschool["Guard"]){
                        guard = false
                    }
                    if(school["scores"]["Percussion"] > checkschool["Percussion"]){
                        drum = false
                    }
                    if(school["scores"]["score"] > checkschool["score"]){
                        place ++

                    } 
                }
            }
            if(music){
                var trophy = document.createElement('img')
                trophy.src = "/common/images/icons/medals/Music.png"
                trophy.title = keys[0] + " " + keys[1] + " " + keys[2] + " Music Caption"
                trophy.classList.add("medal")
                trophy.setAttribute("data-toggle","tooltip")
                $(trophy).tooltip()
                $(casse).append(trophy)
            }
            if(visual){
                var trophy = document.createElement('img')
                trophy.src = "/common/images/icons/medals/Visual.png"
                trophy.title = keys[0] + " " + keys[1] + " " + keys[2] + " Visual Caption"
                trophy.classList.add("medal")
                trophy.setAttribute("data-toggle","tooltip")
                $(trophy).tooltip()
                $(casse).append(trophy)
            }
            if(drum){
                var trophy = document.createElement('img')
                trophy.src = "/common/images/icons/medals/Drumline.png"
                trophy.title = keys[0] + " " + keys[1] + " " + keys[2] + " Drumline Caption"
                trophy.classList.add("medal")
                trophy.setAttribute("data-toggle","tooltip")
                $(trophy).tooltip()
                $(casse).append(trophy)
            }
            if(guard){
                var trophy = document.createElement('img')
                trophy.src = "/common/images/icons/medals/Guard.png"
                trophy.title = keys[0] + " " + keys[1] + " " + keys[2] + " Color Guard Caption"
                trophy.classList.add("medal")
                trophy.setAttribute("data-toggle","tooltip")
                $(trophy).tooltip()
                $(casse).append(trophy)
            }
            if(place === 1){
                var trophy = document.createElement('img')
                trophy.src = "/common/images/icons/medals/gold.png"
                trophy.title = keys[0] + " " + keys[1] + " " + keys[2] + " 1st Place"
                trophy.classList.add("medal")
                trophy.setAttribute("data-toggle","tooltip")
                $(trophy).tooltip()
                $(casse).append(trophy)
            }
            if(place === 2){
                var trophy = document.createElement('img')
                trophy.src = "/common/images/icons/medals/silver.png"
                trophy.title = keys[0] + " " + keys[1] + " " + keys[2] + " 2nd Place"
                trophy.classList.add("medal")
                trophy.setAttribute("data-toggle","tooltip")
                $(trophy).tooltip()
                $(casse).append(trophy)
            }
            if(place === 3){
                var trophy = document.createElement('img')
                trophy.src = "/common/images/icons/medals/bronze.png"
                trophy.title = keys[0] + " " + keys[1] + " " + keys[2] + " 3rd Place"
                trophy.classList.add("medal")
                trophy.setAttribute("data-toggle","tooltip")
                $(trophy).tooltip()
                $(casse).append(trophy)
            }
        }
    })

}