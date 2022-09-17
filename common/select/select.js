function triggerOnchange (element) {
    if ("createEvent" in document) {
        var evt = document.createEvent("HTMLEvents");
        evt.initEvent("change", false, true);
        element.dispatchEvent(evt);
    }
    else
        element.fireEvent("onchange");
}

document.querySelector('.select-wrapper').addEventListener('click', function() {
    this.querySelector('.select').classList.toggle('open');
})

for (const option of document.querySelectorAll(".custom-option")) {
    option.addEventListener('click', function() {
        if (!this.classList.contains('selected')) {
            if (this.parentNode.querySelector('.custom-option.selected')) {
                this.parentNode.querySelector('.custom-option.selected').classList.remove('selected');
            }
            this.classList.add('selected');
            const element = this.closest('.select').querySelector('.select__trigger span')
            element.setAttribute('value',this.getAttribute('value'))
            element.value = this.getAttribute('value')
            element.textContent = this.textContent;
            console.log(this.getAttribute('value'))
            triggerOnchange(element);
        }
    })
}

let menus = document.getElementsByClassName('select');

for (const key in menus) {
    if (Object.hasOwnProperty.call(menus, key)) {
        const element = menus[key]
        element.getval = function() {
            return element.querySelector('.select__trigger').querySelector('span').value || element.querySelector('.select__trigger').querySelector('span').getAttribute('value')
        }

        element.setval = function (val) {
            let value = val;
            let content = val;
            let found = false;
            if (element.querySelector('.custom-option.selected')) {
                element.querySelector('.custom-option.selected').classList.remove('selected');
            }
            console.log(element)
            let options = element.querySelector('.custom-options').getElementsByClassName('custom-option')
            console.log(options)
            for (const key in options) {
                if (Object.hasOwnProperty.call(options, key)) {
                    const child = options[key];
                    console.log(child)
                    if (child.value == val || child.getAttribute('value') == val) {
                        value = child.value || child.getAttribute('value');
                        content = child.textContent;
                        child.classList.add('selected');
                        found = true;
                        break;
                    }
                }
            }
            if (!found) {
                console.error('could not find option: ' + val);
            };
            element.querySelector('.select__trigger').querySelector('span').value = value;
            element.querySelector('.select__trigger').querySelector('span').setAttribute('value', value);
            element.querySelector('.select__trigger').querySelector('span').textContent = content;
            // triggerOnchange(element);
        }

        element.getMenu = function() {
            let options = []
            let options_elements = element.querySelector('.custom-options').querySelectorAll('.custom-option')
            for (const key in options_elements) {
                if (Object.hasOwnProperty.call(options_elements, key)) {
                    const option = options_elements[key];
                    let classes = Array.from(option.classList)
                    options.push({
                        "value" : option.getAttribute('value'),
                        "text" : option.innerHTML,
                        "classes" : classes
                    })
                }
            }
            return options
        }

        element.setMenu = function(menu) {
            let options_element = element.querySelector('.custom-options')

            element.clearMenu()
            for (const key in menu) {
                if (Object.hasOwnProperty.call(menu, key)) {
                    const option = menu[key];
                    element.addOption(option)
                }
            }
        }

        element.addOption = function(option) {
            let options_element = element.querySelector('.custom-options')
            let el = document.createElement('span')
            el.setAttribute('ontouchstart', '')
            el.setAttribute('value', option['value'])
            el.innerHTML = option['text']
            el.classList.add('custom-option')
            
            for (const key in option['classes']) {
                if (Object.hasOwnProperty.call(option['classes'], key)) {
                    const Class = option['classes'][key];
                    el.classList.add(Class)
                }
            }

            $(options_element).append(el)

            el.addEventListener('click', function() {
                if (!this.classList.contains('selected')) {
                    if (this.parentNode.querySelector('.custom-option.selected')) {
                        this.parentNode.querySelector('.custom-option.selected').classList.remove('selected');
                    }
                    this.classList.add('selected');
                    const element = this.closest('.select').querySelector('.select__trigger span')
                    element.setAttribute('value',this.getAttribute('value'))
                    element.value = this.getAttribute('value')
                    element.textContent = this.textContent;
                    console.log(this.getAttribute('value'))
                    triggerOnchange(element);
                }
            })
        }

        element.clearMenu = function() {
            let options_elements = element.querySelector('.custom-options').querySelectorAll('.custom-option')

            for (const el in options_elements) {
                if (Object.hasOwnProperty.call(options_elements, el)) {
                    const option = options_elements[el];
                    option.remove()
                }
            }
        }
    }
}

window.addEventListener('click', function(e) {
    const select = document.querySelector('.select')
    if (!select.contains(e.target)) {
        select.classList.remove('open');
    }
});

 document.querySelector('.select-wrapper').addEventListener('click', function () {
     this.querySelector('.select').classList.toggle('open');
})
for (const dropdown of document.querySelectorAll(".select-wrapper")) {
    dropdown.addEventListener('click', function() {
        this.querySelector('.select').classList.toggle('open');
    })
}

 window.addEventListener('click', function (e) {
     const select = document.querySelector('.select')
     if (!select.contains(e.target)) {
         select.classList.remove('open');
     }
 });

document.addEventListener('click', function(e) {
    for (const select of document.querySelectorAll('.select')) {
        if (!select.contains(e.target)) {
            select.classList.remove('open');
        }
    }
}, {passive: true});
