const STORAGE_KEY = 'meeteor_testing';
const MEET_ELEMENTS = {
  JOIN: 'Join now',
};
const MEET_QUERY = {
  JOIN_BTN: '[role=button]',
  MIC_BTN: `div[data-tooltip~=microphone]`,
  VIDEO_BTN: `div[data-tooltip~=camera]`,
};

var meetingUrl = null;

// Get meet link from DOM
function getMeetingURL() {
  const documentText = window.document.body.innerText.split('\n');
  const meetURL = documentText.find((i) => {
    if (i.indexOf(`meet.google.com`) !== -1) {
      return i;
    }
  });
  chrome.storage.sync.get(STORAGE_KEY, function (items) {
    const data = items ? items[STORAGE_KEY] : {};
    // Copy Meet URL
    console.log(data)
    debugger
    if (data.shouldCopy && meetURL) {
      meetingUrl = meetURL;
      copyToClipboard(meetURL);
    }
    Object.keys(data).forEach(i => {
      debugger
      switch (i) {
        case 'mute':
          data[i] && mute();
        case 'disableVideo':
          data[i] && disableVideo();
        case 'shouldCopy':
          (data[i] && meetURL) && copyToClipboard(meetURL);
        default:
          break;
      }
    })
    joinMeeting();
  });
}

window.onload = function () {
  if (!meetingUrl) {
    setTimeout(getMeetingURL, 3000);
  }
};

function copyToClipboard(text) {
  var input_temp = document.createElement('input');
  input_temp.value = text;
  document.body.appendChild(input_temp);
  input_temp.select();
  document.execCommand('copy');
  document.body.removeChild(input_temp);
}

function getElement(query, searchText) {
  return new Promise((resolve) => {
    const aTags = document.querySelectorAll(query);
    let found;
    if (searchText) {
      for (var i = 0; i < aTags.length; i++) {
        if (aTags[i].textContent == searchText) {
          found = aTags[i];
          break;
        }
      }
    } else {
      found = aTags[0];
    }
    resolve(found);
  });
}

function joinMeeting() {
  getElement(MEET_QUERY.JOIN_BTN, MEET_ELEMENTS.JOIN).then(
    (res) => {
      if (res) {
        res.focus();
        res.click();
      }
    }
  );
}

function mute() {
  getElement(MEET_QUERY.MIC_BTN).then((res) => {
    if (res) {
      res.focus();
      res.click();
    }
  });
}

function disableVideo() {
  getElement(MEET_QUERY.VIDEO_BTN).then((res) => {
    if (res) {
      res.focus();
      res.click();
    }
  });
}
