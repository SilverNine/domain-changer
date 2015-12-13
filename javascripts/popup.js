$(document).ready(function() {
    var currentUrl = "";
    var currentDomain = "";

    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
        currentUrl = replaceProtocol(tabs[0].url);
        currentDomain = currentUrl.substring(0,currentUrl.indexOf("/"));
    });

    $("#domain-list .list-group-item .badge").click(function(tab){
        event.stopPropagation()
    });

    $("#domain-list .list-group-item").click(function(tab){
        var nextDomain = replaceProtocol($(this).attr("id"));

        currentUrl = currentUrl.replace(currentDomain, nextDomain);

        chrome.tabs.update(tab.id, {
            url: "http://" + currentUrl
        });

        window.close();
    });
});

function replaceProtocol(url){
    return url.replace('http://','').replace('https://','');
}