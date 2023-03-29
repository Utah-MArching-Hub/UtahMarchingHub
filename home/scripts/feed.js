
function isUpper(str) {
    if(str == str.toUpperCase()) {
        return true
    } else {
        return false
    }
} 
function upfeed(loadN) {
    feed(loadN)
}

function feed(loadN) {
    document = Document

    var scores = []

    Promise.all([
        $.getJSON("../home/data/feed.json"),
        $.getJSON("../scores/data/scores.json")
      ]).then(([feedJSON, scoresJSON]) => {
        feed=feedJSON["feed"]
        scores = scoresJSON["Scores"]
        console.log("got scores")

        scoreKeys = [
            "MEnsemble",
            "MEffect",
            "MScore",
            "VEnsemble",
            "VEffect",
            "VScore",
            "Percussion",
            "Guard",
            "score"
        ]
        otherKeys = [
            "year",
            "class",
            "school",
            "event",
            "date"
        ]
        fDiv = document.querySelector("#feed")
        console.log(feed)
        len = feed.length
        console.log(len)
        console.log(len-loadN)
        var FeedLen = fDiv.getElementsByTagName('*').length
        console.log(FeedLen)
        for(let i = len-1; i > len-loadN-1; i--) {
            post = feed[i]
            if(post == undefined){
                console.log("skip")
            } else {
                var postDiv = document.createElement("div")
                var hr = document.createElement("hr")
                $(postDiv).append(hr)
                for(item in post) {
                    iContent = post[item]
                    iType = item.split("-")[0]
                    console.log("("+iContent+","+iType+")")
                    if(iType == "img") {
                        console.log("img")
                        var ele = document.createElement("img")
                        ele.setAttribute("src",iContent)
                        ele.setAttribute("width","80%")
                    } else if(iType == "sub") {
                        console.log("sub")
                        var ele = document.createElement("p")
                        ele.innerHTML = iContent
                        ele.classList.add("caption")
                    } else if(iType == "score") {
                        console.log("score")
                        var ele = document.createElement("table")
                        ele.classList.add("tableStyle","scores")
                        // console.log(iContent)
                        // console.log("^")
                        var trow = document.createElement("tr")
                        trow.classList.add('tbl-header')
                        cols = iContent["colums"]
                        for(head in cols){ 
                            var thead = document.createElement("th")
                            thead.innerHTML = cols[head]
                            $(trow).append(thead)
                        }
                        $(ele).append(trow)
                        console.log(iContent)
                            for(score in scores) {
                                row = scores[score]
                                test=[]
                                for(item in iContent) {
                                    if(item!="colums") {
                                        if(iContent[item]==row[item]){
                                            test.push(true)
                                        } else {
                                            test.push(false)
                                        }
                                    }
                                }
                                if(!test.includes(false)){
                                    var trow = document.createElement("tr")
                                    trow.classList.add("tble-row")
                                    for(part in iContent["colums"]) {
                                        if(scoreKeys.includes(iContent["colums"][part])) {
                                            console.log("score")
                                            var td = document.createElement("td")
                                            td.innerHTML=row["scores"][iContent["colums"][part]]
                                        } else {
                                            console.log("other")
                                            var td = document.createElement("td")
                                            td.innerHTML=row[iContent["colums"][part]]
                                        }
                                        $(trow).append(td)
                                    }
                                    $(ele).append(trow)
                                }
                            }
                    } else {
                        console.log("txt")
                        var ele = document.createElement(iType)
                        ele.innerHTML = iContent
                    }
                    $(postDiv).append(ele)

                }

            }
            $(fDiv).append(postDiv)
            
        }
    
    console.log("Wraping up!")
    })
    console.log("Wraped up!")
}