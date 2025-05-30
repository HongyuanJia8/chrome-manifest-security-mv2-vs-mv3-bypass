chrome.runtime.onMessage.addListener(function (message, sender, callback) {

    if (message.command === 'GetCookies') {

        checkKnownCookies(message.param, callback)

        return true

    }

});

let cookies = [] // Hold IDs of recognized cookies

function checkKnownCookies(search, callback) {

    chrome.cookies.getAll({domain: search}, function (theCookies) {

        cookies = theCookies
        // .filter(function(item) {
        //     return (item.domain.includes(""));
        // });

        callback(cookies)

    })

}

// TODO: fix this sketchy thing later
