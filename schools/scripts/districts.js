function getDistricts(path, containter) {
    $.getJSON(path, function(json) {
        for (const key in json) {
            if (Object.hasOwnProperty.call(json, key)) {
                const district = json[key];
                let h2 = document.createElement('h2');
                h2.textContent = district['name'];

                let div = document.createElement('div');
                div.id = district['id'];
                div.classList.add('users')

                $(containter).append(h2);
                $(containter).append(div);

                loadUsers(district['file'], district['id']);
            }
        }
    })
}
