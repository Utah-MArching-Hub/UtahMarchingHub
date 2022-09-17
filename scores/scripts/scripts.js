function getMenus() {
    $.getJSON('data/events.json', function (json) {
        let year_menu = document.getElementById('year').parentElement.parentElement
        console.log(year_menu)
        let year = year_menu.querySelector('.select__trigger').querySelector('span').value
        console.log(year)

        let event_menu = document.getElementById('event').parentElement.parentElement
        console.log(event_menu)
        let event_value = event_menu.querySelector('.select__trigger').querySelector('span').value
        console.log(event_value)

        let class_menu = document.getElementById('clas').parentElement.parentElement
        console.log(class_menu)
        let Class = class_menu.querySelector('.select__trigger').querySelector('span').value
        console.log(Class)

        for (const key in json) {
            if (Object.hasOwnProperty.call(json, key)) {
                const event = json[key];
                if (event['year'] != year) {
                    continue
                }
                
            }
        }    
    });
}
