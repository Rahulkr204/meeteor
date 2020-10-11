const STORAGE_KEY = "meeteor_testing"
const MEET_ELEMENTS = {
    JOIN: 'Join now',
    MUTE: ''
}
const MEET_QUERY = {
    JOIN_BTN: '[role=button]',
    MUTE_BTN: `div[data-tooltip~=microphone]`
}

var meetingUrl = null;

// Get meet link from DOM
function getMeetingURL() {
    const documentText = window.document.body.innerText.split("\n")
    const meetURL = documentText.find(i => {
        if (i.indexOf(`meet.google.com`) !== -1) {
            return i
        }
    })
    chrome.storage.sync.get(STORAGE_KEY, function(items) {
        const data = items ? items[STORAGE_KEY] : {}
        // Copy Meet URL
        if (data.shouldCopy && meetURL) {
            meetingUrl = meetURL
            copy_function(meetURL);
        }
        // Join Meeting
        joinMeeting()
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

function getElement(query, searchText) {
    return new Promise(resolve => {
        const aTags = document.querySelectorAll(query);
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
    const joinElement = getElement(MEET_QUERY.JOIN_BTN, MEET_ELEMENTS.JOIN).then(res => {
        if (res) {
            res.focus()
            res.click()
        }
    })
}

function mute() {
    getElement(MEET_QUERY.MUTE_BTN, MEET_ELEMENTS.MUTE).then(res => {
        console.log("mute", res)
        if (res) {
            debugger
        }
    })
}