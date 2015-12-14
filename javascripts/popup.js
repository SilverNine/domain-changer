$(document).ready(function() {
    var currentUrl = "";
    var currentDomain = "";

    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
        currentUrl = replaceProtocol(tabs[0].url);
        currentDomain = currentUrl.substring(0,currentUrl.indexOf("/"));
    });

    $("#addBtn").click(function(){
        saveDomains();
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

function saveDomains() {
    if ($("#name").val().length < 1 || $("#domain").val().length < 1) {
        alert('Error: No value specified');
        return;
    }

    //{ "name":"localhost", "domain":"192.168.0.1:8080" }
    var addData = "{\"name\":\""+$("#name").val()+"\", \"domain\":\""+$("#domain").val()+"\"}";
    addData = JSON.parse(addData);
    chrome.storage.sync.set("domain-changer-list", addData, function() {
        console.log(addData);
        alert('Domain saved');


        chrome.storage.sync.get("domain-changer-list", function(domains) {
            if (!chrome.runtime.error) {
                console.log(domains);
            }
        });
    });
}