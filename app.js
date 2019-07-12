import { Base64 } from "js-base64";
import { MDCRipple } from "@material/ripple/index";
import { MDCTextField } from "@material/textfield";
import { MDCMenu, Corner } from "@material/menu";

const DISCOVERY_DOCS = [
  "https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"
];
const SCOPES =
  "https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.send";
let userEmail;

// Load Google API script
const gapiScript = document.createElement("script");
gapiScript.onload = handleClientLoad;
gapiScript.src = "https://apis.google.com/js/api.js";
document.body.appendChild(gapiScript); // or something of the likes
function handleClientLoad() {
  gapi.load("client:auth2", initClient);
}

// Authorization
const authorizeButton = document.getElementById("authorize-button");
function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

// Setup New Task Form
let newTaskForm = document.querySelector("#new-task-form");
let addTaskButton = document.querySelector("#add-task-button");
let task = document.querySelector("#task");
let details = document.querySelector("#details");
new MDCRipple(addTaskButton);
document.querySelectorAll(".mdc-text-field").forEach(function(element) {
  new MDCTextField(element);
});
newTaskForm.addEventListener(
  "submit",
  function(e) {
    e.preventDefault();
  },
  false
);
addTaskButton.addEventListener("click", addTask, false);
newTaskForm.addEventListener("keydown", detectCtrlEnter, false);
function detectCtrlEnter(e) {
  let ctrl = e.ctrlKey || e.metaKey;
  let enter = e.keyCode === 13 || e.which === 13;
  if (ctrl && enter) {
    addTask();
  }
}
function addTask() {
  if (task.value === "") return;
  console.log(details.value);
  let request = gapi.client.gmail.users.messages.send({
    userId: "me",
    resource: {
      raw: createBase64EncodedEmail(task.value, details.value)
    }
  });
  addTaskButton.setAttribute("disabled", true);
  addTaskButton.innerText = "Sending...";
  request.execute(function(response) {
    addTaskButton.removeAttribute("disabled");
    addTaskButton.innerText = "Add Task";
    if (response.err) {
      alert("Something went wrong");
    } else {
      task.value = "";
      details.value = "";
    }
  });
}

// Create and Encode the Email
function createBase64EncodedEmail(task, details) {
  const utf8Subject = `=?utf-8?B?${Base64.encode(task)}?=`;
  const messageParts = [
    "Content-Type: text/html; charset=utf-8",
    "MIME-Version: 1.0",
    "From: " + userEmail,
    "To: " + userEmail,
    "Subject: " + utf8Subject,
    "",
    "<div style='white-space: pre;'>" + details + "</div>"
  ];
  const message = messageParts.join("\n");
  return Base64.encodeURI(message);
}

// Ctrl + Enter Submit

// Setup Signout Menu
const menuButton = document.querySelector(".mdc-icon-button");
const menu = new MDCMenu(document.querySelector(".mdc-menu"));
const menuButtonRipple = new MDCRipple(menuButton);
menuButtonRipple.unbounded = true;
menu.setAnchorCorner(Corner.BOTTOM_RIGHT);
menu.setAnchorElement(menuButton);
menu.open = false;
menu.listen("MDCList:action", function(e) {
  console.log(e.detail);
  if (e.detail.index === 0) handleSignoutClick();
});
document
  .querySelector(".mdc-icon-button")
  .addEventListener("click", function() {
    menu.open = !menu.open;
  });
function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}

// Initialise Google API Client
function initClient() {
  gapi.client
    .init({
      apiKey: API_KEY,
      clientId: OAUTH_CLIENT_ID,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES
    })
    .then(
      function() {
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        authorizeButton.onclick = handleAuthClick;
      },
      function(error) {
        console.error(error);
      }
    );
}

// Update the UI when Signin Status Changes
function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    authorizeButton.style.display = "none";
    newTaskForm.style.display = "flex";
    menuButton.removeAttribute("disabled");
    setUserEmail();
  } else {
    authorizeButton.style.display = "block";
    newTaskForm.style.display = "none";
    menuButton.setAttribute("disabled", true);
  }
}

// Retrive User Email Address
function setUserEmail() {
  gapi.client.gmail.users.getProfile({ userId: "me" }).then(
    function(response) {
      userEmail = response.result.emailAddress;
      document.querySelector("#user-email").innerHTML = userEmail;
      console.log("Response", response.result);
    },
    function(err) {
      console.error("Execute error", err);
    }
  );
}
