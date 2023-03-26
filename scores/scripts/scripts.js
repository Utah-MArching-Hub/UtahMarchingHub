function updateMenus() {
    $.getJSON('data/events.json', function (json) {
        let year_menu = document.getElementById('year')
        console.log(year_menu)
        let year = year_menu.getval()
        console.log(year)

        let event_menu = document.getElementById('event')
        console.log(event_menu)
        let event_value = event_menu.getval()
        console.log(event_value)

        let class_menu = document.getElementById('clas')
        console.log(class_menu)
        let Class = class_menu.getval()
        console.log(Class)

        let menu = {"year": [], "event": [{'value': 'NA', 'text': 'select event', 'classes': ['hidden', 'default']}], "class": [{'value': 'NA', 'text': 'select class', 'classes': ['hidden', 'default']}]}
        console.log(json)

        for (const key in json) {
            if (Object.hasOwnProperty.call(json, key)) {
                const event = json[key];
                console.log(event)

                if (!menu['year'].some(o => o['value'] == event['year'])) {
                    menu['year'].push({'value': event['year'], 'text': event['year'], 'classes': []})
                }
                if (event['year'] != year) {
                    continue
                }

                if (!menu['event'].some(o => o['value'] == event['id'])) {
                    menu['event'].push({'value': event['id'], 'text': event['name'], 'classes': []})
                }
                if (event['id'] != event_value) {
                    continue
                }

                console.log(event['classes'])

                let classes = [
                    ["3a" , "3A"],
                    ["4a" , "4A"],
                    ["5ao", "5A Open"],
                    ["5as", "5A Scholastic"],
                    ["6ao", "6A Open"],
                    ["6as", "6A Scholastic"]
                ]
                console.log((event['classes'][0] != 'all'))
                if (event['classes'][0] != 'all') {
                    classes = event['classes']
                }
                console.log(classes)

                for (const c in classes) {
                    if (Object.hasOwnProperty.call(classes, c)) {
                        const cl = classes[c];
                        console.log(cl)
                        if (!menu['class'].some(o => o['value'] == cl[0])) {
                            menu['class'].push({'value': cl[0], 'text': cl[1], 'classes': []})
                        }
                    }
                }
            }
        }
        if (menu['class'].length <= 1) {
            let classes = [
                ["3a" , "3A"],
                ["4a" , "4A"],
                ["5ao", "5A Open"],
                ["5as", "5A Schoolastic"],
                ["6ao", "6A Open"],
                ["6as", "6A Schoolastic"]
            ]
            console.log(classes)

            for (const c in classes) {
                if (Object.hasOwnProperty.call(classes, c)) {
                    const cl = classes[c];
                    console.log(cl)
                    if (!menu['class'].some(o => o['value'] == cl[0])) {
                        menu['class'].push({'value': cl[0], 'text': cl[1], 'classes': []})
                    }
                }
            }
        }

        console.log(menu)
        document.getElementById('year').setMenu(menu['year'])
        document.getElementById('event').setMenu(menu['event'])
        document.getElementById('clas').setMenu(menu['class'])

        document.getElementById('year').setval(year)
        document.getElementById('event').setval(event_value)
        if (!menu['class'].some(o => o['value'] == Class)) {
            Class = Class.replace('s', 'o')
        }
        document.getElementById('clas').setval(Class)

        return menu
    });
}
