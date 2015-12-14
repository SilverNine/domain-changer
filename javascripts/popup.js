var currentUrl = "";
var currentDomain = "";

$(document).ready(function() {
    resetDomainList();

    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
        currentUrl = replaceProtocol(tabs[0].url);
        currentDomain = currentUrl.substring(0,currentUrl.indexOf("/"));
    });

    $("#addBtn").click(function(){
        saveDomain();
        event.stopPropagation();
    });
});

function attachEvent(){
    $("#domain-list .list-group-item .badge").click(function(){
        removeDomain($(this).parent().attr("id"));
        event.stopPropagation();
    });

    $("#domain-list .list-group-item").click(function(tab){
        var nextDomain = replaceProtocol($(this).attr("id"));

        currentUrl = currentUrl.replace(currentDomain, nextDomain);

        chrome.tabs.update(tab.id, {url: "http://" + currentUrl}, function(){
            window.close();
        });
    });
}

function replaceProtocol(url){
    return url.replace('http://','').replace('https://','');
}

function saveDomain() {
    if ($("#name").val().length < 1 || $("#domain").val().length < 1) {
        showAlert("Error: No value specified");
        return;
    }

    var setDomain = $("#name").val()+"|"+$("#domain").val();

    chrome.storage.sync.get("domain-changer-list", function(domains) {
        if (!chrome.runtime.error) {

            var getDomains = domains["domain-changer-list"];
            var delimiter =  getDomains.length > 0 ? "$" : "";
            getDomains = getDomains + delimiter + setDomain;

            chrome.storage.sync.set({"domain-changer-list":getDomains}, function() {
                showAlert("Domain saved");
                resetDomainList();
            });
        }
    });
}

function resetDomainList() {
    $("#domain-list").empty();

    chrome.storage.sync.get("domain-changer-list", function(domains) {
        if (!chrome.runtime.error) {
            var getDomainArray = domains["domain-changer-list"].split("$");

            getDomainArray.forEach(function(obj){
                var name = obj.split("|")[0];
                var domain = obj.split("|")[1];
                name = name + "  ( "+domain+" )";

                $("#domain-list").append("<a href=\"#\" id=\""+domain+"\" class=\"list-group-item\">"+name+"<span class=\"badge\"><span class=\"glyphicon glyphicon-remove\" aria-hidden=true></span></span></a>");
            });

            attachEvent();
        }
    });
}

function removeDomain(targetDomain) {
    chrome.storage.sync.get("domain-changer-list", function(domains) {
        if (!chrome.runtime.error) {
            var getDomainArray = domains["domain-changer-list"].split("$");

            if(getDomainArray.length < 2) {
                showAlert("Faild : at least 1 domain");
                return;
            }

            var index = 0;
            var Break = new Error('Break');

            try{
                getDomainArray.forEach(function(obj){
                    if(targetDomain === obj.split("|")[1]) {
                        throw Break;
                    }

                    index = index + 1;
                });
            } catch(e) {
                console.log(e);
                console.log(index);
                if (e != Break) {
                    throw e;
                }
            }

            getDomainArray.splice(index, 1);

            var getDomains = getDomainArray.join("$");

            chrome.storage.sync.set({"domain-changer-list":getDomains}, function() {
                resetDomainList();
            });
        }
    });
}

function showAlert(message){
    $("#alert").show("slow");
    $("#alert .alert-info").text(message);

    setTimeout(function(){
        $("#alert").hide("slow");
        $("#alert .alert-info").text("");
    }, 2000);
}