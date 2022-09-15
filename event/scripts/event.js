

function updateurl(key, value) {
    
    var queryParams = new URLSearchParams(window.location.search);
    queryParams.set(key, value);
    history.replaceState(null, null, "?" + queryParams.toString());
}

function get() {
    document = Document;

    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });

    let eName = params.event;

    document.querySelectorAll("h1")[1].innerHTML = eName

    table = document.getElementsByClassName('schedule')[0]
    $.getJSON('data/schedules.json', function (json) {
        events = json["events"]
        event = events[eName]
        for(item in event) {
            console.log(item)
            console.log(Object.keys(event[item]).length)
            if(Object.keys(event[item]).length == 2) {
                var row = document.createElement("tr")
                var TItem = document.createElement("td")
                TItem.innerHTML = event[item]["txt"]
                TItem.setAttribute("colspan",2)
                $(row).append(TItem)
                var TItem2 = document.createElement("td")
                TItem2.innerHTML = event[item]["2time"]
                TItem2.setAttribute("colspan",2)
                $(row).append(TItem2)
                $(table).append(row)
            } else {
                var row = document.createElement("tr")
                var TItem = document.createElement("td")
                TItem.innerHTML = item
                $(row).append(TItem)
                var TItem2 = document.createElement("td")
                TItem2.innerHTML = event[item]['location']
                $(row).append(TItem2)
                var TItem3 = document.createElement("td")
                TItem3.innerHTML = event[item]["class"]
                $(row).append(TItem3)
                var TItem4 = document.createElement("td")
                TItem4.innerHTML = event[item]["time"]
                $(row).append(TItem4)
                $(table).append(row)
            }
        }


        
    })
}