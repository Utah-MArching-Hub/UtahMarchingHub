
function isUpper(str) {
    if(str == str.toUpperCase()) {
        return true
    } else {
        return false
    }
} 

function feed(loadN) {
    document = Document

    fDiv = document.querySelector("#feed")
    $.getJSON("../home/data/feed.json", function(json) {
        feed=json["feed"]
        console.log(feed)
        len = feed.length
        console.log(len)
        console.log(len-loadN)
        
        
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
                        cols = iContent["colums"]
                        for(head in cols){ 
                            var thead = document.createElement("th")
                            thead.innerHTML = cols[head]
                            $(trow).append(thead)
                        }
                        $(ele).append(trow)
                        $.getJSON('../scores/data/scores.json', function (json) {
                            scores = json["Scores"]
                            console.log(iContent)
                            for(score in scores) {
                                test=true
                                for(item in iContent) {
                                    // console.log(item)
                                }
                            }
                        })
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

    })
}