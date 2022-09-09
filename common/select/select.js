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
        const element = menus[key].querySelector('.select__trigger').querySelector('span');
        element.setval = function (val) {
            let value = val;
            let content = val;
            let found = false;
            if (element.parentNode.parentNode.querySelector('.custom-option.selected')) {
                element.parentNode.parentNode.querySelector('.custom-option.selected').classList.remove('selected');
            }
            // console.log(element)
            let options = element.parentNode.parentNode.querySelector('.custom-options').getElementsByClassName('custom-option')

            for (let key in options) {
                let child = options[key];
                // console.log(child)
                if (child.value == val || child.getAttribute('value') == val) {
                    value = child.value || child.getAttribute('value');
                    content = child.textContent;
                    child.classList.add('selected');
                    found = true;
                    break;
                }
            }
            if (!found) {
                console.error('could not find option: ' + val);
            };
            element.value = value;
            element.setAttribute('value', value);
            element.textContent = content;
            // triggerOnchange(element);
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
