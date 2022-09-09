
function inject() {
    document = Document;

    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });
    let schoolN = params.school;
    $.getJSON('data/schools.json', function (json) {
        schools=json["schools"]
        school=schools[schoolN]
        for (id in school) {
            document.getElementById(id).innerHTML = school[id]
        }
    })
}