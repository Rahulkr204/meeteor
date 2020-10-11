/*global chrome*/

// chrome.browserAction.onClicked.addListener(function(activeTab){
//     console.log(activeTab, "activeTab")
//     var newURL = "http://www.youtube.com/watch?v=oHg5SJYRHA0";
//     chrome.tabs.create({ url: newURL });
// });

// Listen for clicks to the extension icon
chrome.browserAction.onClicked.addListener(function () {
    console.log("~~~~~~~~~~~~~~~~~~~~Here~~~~~~~~~~~~~~~~")
});