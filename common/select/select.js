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
document.querySelector('.select-wrapper').addEventListener('focus', function() {
    this.querySelector('.select').classList.toggle('open');
})

let menus = document.getElementsByClassName('select');

for (const key in menus) {
    if (Object.hasOwnProperty.call(menus, key)) {
        const element = menus[key]
        element.getval = function() {
            return element.querySelector('.select__trigger').querySelector('span').value || element.querySelector('.select__trigger').querySelector('span').getAttribute('value')
        }

        element.querySelector('.select__trigger').addEventListener('keydown', function(e) {
            if (e.key == 'Enter') {
                    e.preventDefault()
                    element.classList.toggle('open')
            } else if (e.key == 'ArrowDown') {
                e.preventDefault()
                element.querySelector('.custom-option:not(.hidden)').focus()
            } else if (e.key == 'ArrowUp') {
                e.preventDefault()
                let child = element.querySelector('.custom-options').lastElementChild
                while (child && child.classList.contains('hidden')) {
                    child = child.previousElementSibling
                }
                if (child) {
                    child.focus()
                }
            }
            console.log(e.key)
        })

        // DO NOT UNCOMMENT
        // if (element.tabIndex < 0) {
        //     let index = -1
        //     let prev = element.previousElementSibling || element.parentNode
        //     while (index < 0 && !prev != document.body) {
        //         if (prev) {
        //             if (prev.tabIndex) {
        //                 index = prev.tabIndex;
        //             } else {
        //                 prev = prev.previousElementSibling;
        //                 if (!prev) {
        //                     prev = prev.parentNode;
        //                 }
        //             }
        //         } else {
        //             if (!prev) {
        //                 console.log(prev)
        //                 prev = prev.parentNode;
        //             }
        //         }
        //         console.log(prev)
        //     }
        // }

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
                let option = element.querySelector('.custom-options').querySelector('.default')
                if (option) {
                    option.classList.add('selected');
                    value = option.value || option.getAttribute('value');
                    content = option.textContent;
                } else {
                    console.error('could not find default option');
                }
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
            console.log(Object.hasOwnProperty.call(el), el)
            let parent = options_element.parentNode
            if (parent.querySelector('[tabindex]')) {
                let parentIndex = parent.querySelector('[tabindex]').tabIndex
                console.log(parentIndex)
                console.log(el)
                el.tabIndex = parentIndex
                console.log('tabIndex',el.tabIndex)
            }

            el.select = function() {
                if (!this.classList.contains('selected')) {
                    if (this.parentNode.querySelector('.custom-option.selected')) {
                        this.parentNode.querySelector('.custom-option.selected').classList.remove('selected');
                    }
                    this.classList.add('selected');
                    const select = this.closest('.select').querySelector('.select__trigger span')
                    select.setAttribute('value',this.getAttribute('value'))
                    select.value = this.getAttribute('value')
                    select.textContent = this.textContent;
                    console.log(this.getAttribute('value'))
                    triggerOnchange(select);
                } else {
                    const select = this.closest('.select')
                    select.classList.remove('open')
                }
            }

            el.addEventListener('click', el.select)
            el.addEventListener('keydown', function(e) {
                if (e.key == 'Enter') {
                    e.preventDefault()
                    el.select()
                    let index = el.tabIndex+1
                    let focusElement = document.querySelector('[tabindex="' + index + '"]')
                    console.log('focus', focusElement)
                    focusElement.focus()
                } else if (e.key == 'ArrowDown') {
                    e.preventDefault()
                    console.log(e.key)
                    let sibling = el.nextElementSibling
                    while (sibling && sibling.classList.contains('hidden')) {
                        sibling = el.nextElementSibling
                    }
                    if (!sibling) {
                        sibling = el.parentNode.firstElementChild
                        console.log(sibling)
                        while (sibling && sibling.classList.contains('hidden')) {
                            sibling = sibling.nextElementSibling
                            console.log(sibling)
                        }
                    }
                    if (sibling) {
                        sibling.focus()
                    }
                } else if (e.key == 'ArrowUp') {
                    e.preventDefault()
                    console.log(e.key)
                    let prev = el.previousElementSibling
                    console.log(prev)
                    while (prev && prev.classList.contains('hidden')) {
                        prev = prev.previousElementSibling
                        if (!prev) {
                            break
                        }
                    }
                    if (prev) {
                        prev.focus()
                    } else {
                        let sibling = element.querySelector('.custom-options').lastElementChild
                        while (sibling && sibling.classList.contains('hidden')) {
                            sibling = sibling.previousElementSibling
                        }
                        if (sibling) {
                            sibling.focus()
                        }
                    }
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

$('.select').click(function(e) {
    e.preventDefault()
    e.stopPropagation()
    if (this.focused) {
        console.log('clicked')
        this.focused = false
    } else {
        console.log('no-focus')
        $(this).toggleClass('open')
    }
})

$('.select').focusin(function() {
    $(this).addClass('open')
    console.log('focus-in')
    this.focused = true
})

$('.select').focusout(function() {
    if (!$(this).is(':focus-within')) {
        console.log('focus-out')
        $(this).removeClass('open')
    }
})

//  window.addEventListener('click', function (e) {
//      const select = document.querySelector('.select')
//      if (!select.contains(e.target)) {
//          select.classList.remove('open');
//      }
//  });

document.addEventListener('click', function(e) {
    for (const select of document.querySelectorAll('.select')) {
        if (!select.contains(e.target)) {
            select.classList.remove('open');
        }
    }
}, {passive: true});
