function loadUsers(path, id) {
    function getsocial(social, username) {
        var url = ''
        if (social == 'github') {
            url = 'https://github.com/' + username + '/'
        } else if (social == 'twitch') {
            url = 'https://twitch.tv/' + username + '/'
        } else if (social == 'twitter') {
            url = 'https://twitter.com/' + username + '/'
        } else if (social == 'instagram') {
            url = 'https://instagram.com/' + username + '/'
        } else if (social == 'reddit') {
            url = 'https://www.reddit.com/user/' + username + '/'
        } else if (social == 'facebook') {
            if (typeof username == 'string') {
                page = username
            } else if (['u','user'].includes(username[0])) {
                page = username[1]
            } else if (['g', 'group'].includes(username[0])) {
                page = 'groups/' + username[1]
            } else {
                return ''
            }
            url = 'https://facebook.com/' + page + '/'
        } else if (social == 'youtube') {
            if (typeof username == 'string') {
                channel = 'channel/' + username
            } else if (['c','custom'].includes(username[0])) {
                channel = username[1]
            } else if (['id', 'channel'].includes(username[0])) {
                channel = 'channel/' + username[1]
            } else {
                return ''
            }
            url = 'https://youtube.com/' + channel + '/'
        } else {
            url = username
        }

        return url
    }

    socialclasses = ['github', 'youtube', 'twitch', 'twitter', 'instagram', 'reddit', 'facebook']

    document = Document;

    $.getJSON(path, function(json) {
        classlist = document.getElementsByClassName('users')
        // console.log(classlist)
        if (id) {
            found = false
            for (element in classlist) {
                // console.log(classlist[element].id)
                if (classlist[element].id == id) {
                    userslist = classlist[element]
                    found = true
                    break
                }
            }
            if (!found) {
                throw new Error('Could not find element with id: ' + id);
            }
        } else {
            userslist = classlist[0];
        }
        console.log(userslist)
        
        // console.log(json);
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
                if (!socials[social][1] == '' && !(typeof socials[social][1] != 'string' && socials[social][1].includes(''))) {
                    link = getsocial(socials[social][0], socials[social][1])
                    if (link == '') {
                        continue
                    }
                    var socialLink = document.createElement('a')
                    socialLink.setAttribute('target', '_blank')
                    socialLink.setAttribute('href', getsocial(socials[social][0],socials[social][1]))

                    if (!socialclasses.includes(socials[social][0])) {
                        socials[social][0] = 'site'
                    }

                    socialLink.classList.add(socials[social][0])

                    $(socialdiv).append(socialLink)
                }
            }
            $(userdiv).append(usericon,userlink,socialdiv)
            console.log(userslist)
            $(userslist).append(userdiv)
        };
    });
}