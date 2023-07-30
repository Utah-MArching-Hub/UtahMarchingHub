
function isUpper(str) {
    if(str == str.toUpperCase()) {
        return true
    } else {
        return false
    }
    
} 

async function parseMarkdownContent(content) {
    console.log(content)
    return new Promise((resolve, reject) => {
      marked.setOptions({
        gfm: true, // Enable GitHub Flavored Markdown
        breaks: true, // Enable automatic line breaks
      });
  
      marked(content, (err, parsedContent) => {
        if (err) {
            reject(err);
        } else {
            console.log(parsedContent)
            resolve(parsedContent);
        }
      });
    });
  }
  


  async function upfeed(loadN) {
    document = Document

    var scores = []

    Promise.all([
        await $.getJSON("../home/data/feed.json"),
        await $.getJSON("../scores/data/scores.json")
      ]).then(async([feedJSON, scoresJSON]) => {
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
        var FeedPosts = document.querySelectorAll(".post")
        var FeedLen = FeedPosts.length
        console.log(FeedPosts)
        if(FeedLen===len){
            console.log("FULL")
            var Button = document.querySelector("#load-more-button")
            Button.disabled = true
            Button.innerHTML = "All loaded"
            return 0
        }
        console.log("-----a-----")
        console.log(len)
        console.log(len-loadN)
        console.log(FeedLen)
        console.log(len-1+FeedLen)
        console.log(len-loadN-1+FeedLen)
        for(let i = len-1-FeedLen; i > len-loadN-1-FeedLen; i--) {
            console.log("=====")
            console.log(i)
            post = feed[i]
            if(post == undefined){
                console.log("skip")
            } else {
                var postDiv = document.createElement("div")
                postDiv.classList.add("post")
                // var hr = document.createElement("hr")
                // $(postDiv).append(hr)
                for (const [iType, iContent] of Object.entries(post)) {
                    iContent = post[item]
                    iType = item.split("-")[0]
                    console.log("("+iContent+","+iType+")")
                    if (iType == 'md'){
                        const parsedContent = await parseMarkdownContent(iContent);
                        postDiv.innerHTML = parsedContent
                     }else if(iType == "img") {
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
                        var tabl = ele
                        var ele = document.createElement('div')
                        $(ele).append(tabl)
                        ele.classList.add('table-container')
                    } else if (iType === "HTML") {
                        ele.innerHTML = iContent
                    } else {
                        console.log("txt")
                        var ele = document.createElement(iType)
                        ele.innerHTML = iContent
                    }
                    if (iType != 'md') {$(postDiv).append(ele)}
                }

            }
            $(fDiv).append(postDiv)
    
        }
    
    var FeedLen = fDiv.getElementsByTagName('div').length
    if(FeedLen===len){
        console.log("FULL")
        var Button = document.querySelector("#load-more-button")
        Button.disabled = true
        Button.innerHTML = "All loaded"
    }
    console.log("Wraping up!")
    })
    console.log("Wraped up!")
}

async function feed(loadN) {
    document = Document

    var scores = []

    Promise.all([
        await $.getJSON("../home/data/feed.json"),
        await $.getJSON("../scores/data/scores.json")
      ]).then(async([feedJSON, scoresJSON]) => {
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
        // var FeedLen = fDiv.querySelector('*').length
        // console.log(FeedLen)
        
        for(let i = len-1; i > len-loadN-1; i--) {
            post = feed[i]
            if(post == undefined){
                console.log("skip")
            } else {
                var postDiv = document.createElement("div")
                postDiv.classList.add("post")
                // var hr = document.createElement("hr")
                // $(postDiv).append(hr)


                Object.entries(post).forEach(async([iType, iContent]) => {
                    // iContent = post[item]
                    iType = iType.split("-")[0]
                    console.log("("+iContent+","+iType+")")
                    if (iType == 'md'){


                        Promise.all([
                            await parseMarkdownContent(iContent)
                        ]).then(async([iContent]) => {
                            console.log('finish!')
                            console.log(iContent)
                            postDiv.innerHTML = iContent
                        })

                        iContent = await parseMarkdownContent(iContent);

                        console.log('finish!')
                        console.log(iContent)
                        // postDiv.innerHTML = iContent
                        var ele = document.createElement('div')
                        ele.innerHTML = iContent

                        // parseMarkdownContent(iContent).then((parsedContent) => {
                        //     var ele = document.createElement('div');
                        //     ele.innerHTML = parsedContent;
                        // })
                     }else if(iType == "img") {
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
                        var tabl = ele
                        var ele = document.createElement('div')
                        $(ele).append(tabl)
                        ele.classList.add('table-container')
                    } else {
                        console.log("txt")
                        var ele = document.createElement(iType)
                        ele.innerHTML = iContent
                    }
                    if (iType != 'md') {$(postDiv).append(ele)}
                    // console.log(ele)
                    // $(postDiv).append(ele)
                })

            }
            $(fDiv).append(postDiv)
    
        }

    console.log("Wraping up!")
    })
    console.log("Wraped up!")
}
