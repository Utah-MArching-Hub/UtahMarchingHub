function update_url(key, value) {
    var queryParams = new URLSearchParams(window.location.search);
    queryParams.set(key, value);
    history.replaceState(null, null, "?" + queryParams.toString());
    updateScores()
}

function updateScores() {
    update_menus()
    update_scores()
}

function update_scores() {
    let result = {score: 0}

    function get_category(categories, category) {
        for ([category_name, category_info] of Object.entries(categories)) {
            if (category_name == category) {
                console.log(category_name, category, category_name == category)
                console.log(category_info)
                result = category_info
                break
            } else {
                for ([caption_name, caption_info] of Object.entries(category_info.captions)) {
                    if (caption_name == category) {
                        result = caption_info
                        break
                    }
                }
            }
        }

        return result
    }

    reset_scores()

    let year = document.querySelector('#year').value
    let event = document.querySelector('#event').value
    let class_ = document.querySelector('#class').value

    let order = []
    let header = document.querySelector('.tbl-header').children[0].children
    for (const key in header) {
        if (Object.hasOwnProperty.call(header, key)) {
            const el = header[key];
            order.push(el.getAttribute('value'))
        }
    }

    console.log('order', order)

    table = document.querySelector('.scores')

    if (year && event && class_) {
        console.log('update scores')

        API.division(year, null, event, class_).then((division) => {
            console.log('division:', division)
            console.log(division.performances)
            Object.entries(division.performances).forEach(([performance_guid, performance]) => {
                let row = document.createElement('tr')
                row.classList.add('tble-row')
                row.setAttribute('ontouchstart', '')

                for (column of order) {
                    let cell = document.createElement('td')
                    if (column == 'school') {
                        cell.innerHTML = performance.school
                    } else if (column == 'total_score') {
                        cell.innerHTML = performance.total_score
                    } else {
                        console.log('performance:', performance)
                        let category_info = get_category(performance.categories, column)
                        if (category_info) {
                            console.log('score:', category_info)
                            cell.innerHTML = category_info.score
                        }
                    }
                    $(row).append(cell)
                }

                $(table).append(row)
            })
        })
    }
}

function reset_scores() {
    $('.sort-asc').removeClass('sort-asc');
    $('.sort-desc').removeClass('sort-desc');
    // let table = document.getElementById('scores')
    $('.tble-row').remove()
}

function update_menus(from_url = false) {
    if (from_url) {
        var params = new URLSearchParams(window.location.search)
    }

    let year_menu = document.getElementById('year')
    let event_menu = document.getElementById('event')
    let class_menu = document.getElementById('class')
    return new Promise((resolve, reject) => {
        API.seasons_list().then((seasons) => {
            let current_year = params ? params.get('year') : year_menu.value

            let menus = {
                year: [],
                events: [],
                classes: [],
            }
            for (let season of seasons) {
                let option = {
                    value: season.year,
                    text: season.year,
                    classes: season.year == current_year ? ['selected'] : [],
                }

                menus.year.push(option)
            }

            menus.year.sort((a, b) => -(a.value - b.value))
            console.log('year', menus.year)

            year_menu.setMenu(menus.year)
            year_menu.value = current_year

            let current_event = params ? params.get('event') : event_menu.value


            API.competitions_list(year = current_year).then((competitions) => {
                // let menus = {
                //     year: [],
                //     events: [],
                //     classes: [],
                // }
                for (let competition of competitions) {
                    menus.events.push({
                        value: null,
                        text: 'Select Event',
                        classes: ['hidden', 'default']
                    })

                    let option = {
                        value: competition.competition_guid,
                        text: competition.name,
                        classes: competition.competition_guid == current_event ? ['selected'] : [],
                    }
                    menus.events.push(option)

                    let current_class = params ? params.get('class') : class_menu.value
                    menus.classes.push({
                        value: null,
                        text: 'Select Class',
                        classes: ['hidden', 'default']
                    })

                    if (competition.competition_guid == current_event) {

                        Object.entries(competition.classes).forEach(([class_name, class_data]) => {
                            class_option = {
                                value: class_data.name,
                                text: class_data.name,
                                classes: [],
                            }
                            menus.classes.push(class_option)
                        })
                        menus.classes.sort((a, b) => {
                            if (a.value == null) {
                                return -1
                            } else if (b.value == null) {
                                return 1
                            }
                            return a.value[0] - b.value[0]
                        })
                    }
                    class_menu.setMenu(menus.classes)
                    class_menu.value = current_class
                }
                event_menu.setMenu(menus.events)
                event_menu.value = current_event
                resolve()
            })
        })
    })
}

update_menus(true).then(() => update_scores())
