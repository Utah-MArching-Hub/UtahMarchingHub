# Credits

Here's where the credits page is. I'll explain how to use `credits.json`.

## credits.json
Here's the format for each user
```json
"" : { // the user
    "icon" : "", // the picture that is shown by the text
    "url" : "", // the url that you go to when you click on the username/profile pic
    "socials" : [ // social links under name.
        ["github" , ""],
        ["youtube" , ["", ""]],
        ["twitch" , ""],
        ["twitter" , ""],
        ["instagram" , ""],
        ["reddit" , ""],
        ["facebook", ""],
        ["site" , ""]
    ]
}
```

## socials format:

Each social uses the username as the value. Here's a list of them all (currently)

* github
* youtube
* twitch
* twitter
* instagram
* reddit
* facebook
* site

As said before, the values for each social are the username. Here's an example,

```
"github" : "username"
```
becomes
```
https://github.com/username/
```

This is the same for every other social, but for the specific site.

---

`youtube` has a specific format.

`youtube` has a special format. The value is a list. The first item (the key) is the type of url. The second is the channel id.

`id` and `channel` are used for a channel id. For example,

```
"youtube" : ["id", "id"]
```
becomes 
```
https://youtube.com/channel/id/
```

`c` and `custom` are used for a custom channel url. For example,
```
"youtube : ["c", "custom"]
```
becomes
```
https://youtube.com/custom/
```

If the value is not a list, just a string, it is treated as a channel id. So
```
"youtube" : "id"
```
becomes
```
https://channel/id/"
```
---
`site` just uses whatever value it has as the url. For example,

```
"site" : "https://example.com
```
becomes
```
https://example.com
```
---
If you want to add more than one link to the same site, you can. All you have to do is add it again. For example,

```
"socials" : [
    ["twitter", "hello"],
    ["twitter", "world"]
]
```
becomes
```
https://twitter.com/hello/
https://twitter.com/world/
```
---
Any social link that has an empty value is also skipped, so you can leave a value blank, and it won't show up on the page.
