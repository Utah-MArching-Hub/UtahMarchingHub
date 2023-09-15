var API = {
    DOMAIN: 'api.utahmarchinghub.com',
    LOCALHOST_PORT: '5000',
    is_localhost: Boolean(
        window.location.hostname === 'localhost' ||
        // [::1] is the IPv6 localhost address.
        window.location.hostname === '[::1]' ||
        // 127.0.0.1/8 is considered localhost for IPv4.
        window.location.hostname.match(
            /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
        )
    ),
}

Object.defineProperty(API, 'DOMAIN', {
    enumerable: true,
    configurable: false,
    writable: false,
})

Object.defineProperty(API, 'LOCALHOST_PORT', {
    enumerable: true,
    configurable: false,
    writable: false,
})

Object.defineProperty(API, 'url', {
    get () {
        let protocol = window.location.protocol
        let domain = this.is_localhost ? window.location.hostname : this.DOMAIN
        let port = this.is_localhost ? this.LOCALHOST_PORT : ''

        url = new URL(`${protocol}//${domain}`)
        url.port = port

        return url
    }
})

API.request = async function (path, params = {}) {
    url = this.url
    url.pathname = path

    Object.entries(params).forEach(([key, value]) => {
        if (value != null) {
            url.searchParams.set(key, value)
        }
    })

    console.log(url.toString())

    const request = await fetch(url.toString(), {
        method: "GET", // *GET, POST, PUT, DELETE, etc.
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    });

    return request.json()
}

API.raw_scores = async function () {
    return await this.request('scores')
}

API.season_scores = async function (year = null, seasonGuid = null, raw = false) {
    console.log('raw:', raw)
    let path = '/scores/season/' + (raw ? 'raw' : '')
    console.log(path)
    return await this.request(path, params = {
        'year': year,
        'seasonGuid': seasonGuid,
    })
}

API.seasons_list = async function () {
    let path = '/scores/seasons/'
    console.log(path)
    return await this.request(path)
}

API.competitions_list = async function () {
    return await this.request('/scores/competitions/')
}

API.competition = async function (year = null, seasonGuid = null, competitionGuid = null, raw = false) {
    console.log('raw:', raw)
    let path = '/scores/competition/' + (raw ? 'raw' : '')
    console.log(path)
    return await this.request(path, params = {
        'year': year,
        'seasonGuid': seasonGuid,
        'competitionGuid': competitionGuid,
    })
}
