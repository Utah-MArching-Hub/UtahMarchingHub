const scores = require('../data/scores.json')
console.log(scores)
console.log("---")
console.log(scores["Scores"])
console.log("---")
console.log(scores["Scores"][3])

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