const STORAGE_KEY = "meeteor_testing"
const MEET_ELEMENTS = {
    JOIN: 'Join now',
    mute:
}
var meetingUrl = null;

function getMeetingURL() {
    const documentText = window.document.body.innerText.split("\n")
    const meetURL = documentText.find(i => {
        if (i.indexOf(`meet.google.com`) !== -1) {
            return i
        }
    })
    chrome.storage.sync.get(STORAGE_KEY, function(items) {
        const data = items ? items[STORAGE_KEY] : {}
        if (data.shouldCopy && meetURL) {
            meetingUrl = meetURL
            copy_function(meetURL);
            joinMeeting()
        }
    });
}

window.onload = function (){
    if (!meetingUrl) {
        setTimeout(getMeetingURL, 3000);
    }
}

function copy_function(text){
    var input_temp = document.createElement("input");
    input_temp.value = text;
    document.body.appendChild(input_temp);
    input_temp.select();
    document.execCommand("copy");
    document.body.removeChild(input_temp);
};

function getElement(searchText) {
    return new Promise(resolve => {
        const aTags = document.querySelectorAll('[role=button]');
        let found;
        for (var i = 0; i < aTags.length; i++) {
            if (aTags[i].textContent == searchText) {
                found = aTags[i];
                break;
            }
        }
        resolve(found)
    });
    
}

function joinMeeting() {
    const joinElement = getElement(MEET_ELEMENTS.JOIN).then(res => {
        if (res) {
            res.focus()
            res.click()
        }
    })
}

function mute() {
    const muteButton = getElement(MEET_ELEMENTS.).then(res => {
        if (res) {
            res.focus()
            res.click()
        }
    })
}