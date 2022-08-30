function loadUsers(path) {
    function getsocial(social, username) {
        var url = ''
        if (social == 'github') {
            url = 'https://github.com/' + username
        } else if (social == 'twitch') {
            url = 'https://twitch.tv/' + username
        } else if (social == 'twitter') {
            url = 'https://twitter.com/' + username
        } else if (social == 'instagram') {
            url = 'https://instagram.com/' + username
        } else if (social == 'reddit') {
            url = 'https://www.reddit.com/user/' + username
        } else {
            url = username
        }

        return url
    }

    socialclasses = ['github', 'youtube', 'twitch', 'twitter', 'instagram', 'reddit']

    document = Document;
    userslist = document.getElementsByClassName('users')[0];
    $.getJSON(path, function(json) {
        console.log(json);
        for (user in json) {
            url = json[user]['url']
            icon = json[user]['icon']
            socials = json[user]['socials']

            var userdiv = document.createElement('div');
            userdiv.classList.add('user');

            var usericon = document.createElement('a')
            usericon.setAttribute('target', '_blank')
            usericon.setAttribute('href', url)
            usericon.classList.add('user-icon')

            var userimage = document.createElement('img')
            userimage.setAttribute('src', icon)
            $(usericon).append(userimage)

            var userlink = document.createElement('a')
            userlink.setAttribute('target', '_blank')
            userlink.setAttribute('href', url)
            userlink.classList.add('user-link')
            userlink.innerHTML = user

            var socialdiv = document.createElement('div')
            socialdiv.classList.add('socials')
            
            for (social in socials) {
                if (!socials[social] == '') {
                    var socialLink = document.createElement('a')
                    socialLink.setAttribute('target', '_blank')
                    socialLink.setAttribute('href', getsocial(social,socials[social]))

                    if (!socialclasses.includes(social)) {
                        social = 'site'
                    }

                    socialLink.classList.add(social)

                    $(socialdiv).append(socialLink)
                }
            }
            $(userdiv).append(usericon,userlink,socialdiv)
            $(userslist).append(userdiv)
        };
    });
}