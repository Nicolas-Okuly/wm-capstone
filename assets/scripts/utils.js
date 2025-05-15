// Set copyright year
const yearText = document.getElementById("copy-year");
const year = new Date().getFullYear();
yearText.innerText = year;

// Retrieve the darkmode toggle icon
let img = document.getElementById("toggle-img");

/**
 * Get a cookie by name
 * @param {String} name Cookie's name
 * @returns {String} The cookie's value 
 */
function getCookie(name) {
  name = name + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');

  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];

    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }

    if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
  }

  return "";
}

/**
 * Set a cookie
 * @param {String} cname Name of cookie
 * @param {*} cvalue Value of cookie
 * @param {Number} exdays How many days till death
 */
function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}


/**
 * Notification handler
 * @param {String} notification 
 * @param {String} title
 */
function sendAlert(notification, title) {
    let notif = document.getElementById("notification");
    let notifTitle = document.getElementById("notif-title");
    let notifDesc = document.getElementById("notif-description");

    notifTitle.innerHTML = title;
    notifDesc.innerHTML = notification;
    notif.style.display = "block";
    notif.addEventListener("click", () => {
        notif.style.display = "none";
    });
}

/**
 * Toggles darkmode when called
 */
function toggleDarkMode() {
    // Set lightmode if dark and change cookie
    if (dark == 1) {
        document.body.className = "light";
        img.src = "./assets/images/dark.svg";
        dark = 0;
        document.cookie = `darkmode=0;expires=Thu, 18 Dec 2032 12:00:00 MST`;
    } else {
        // Set dark mode if light and change cookie
        document.body.className = "";
        img.src = "./assets/images/light.svg"
        dark = 1;
        document.cookie = "darkmode=1;expires=Thu, 18 Dec 2032 12:00:00 MST";
    }
}

// Retrieve darkmode status
let dark = getCookie("darkmode");

// Set lightmode if dark and change cookie
if (dark == 0) {
    document.body.className = "light";
    img.src = "./assets/images/dark.svg";
} else {
    // Set dark mode if light and change cookie
    document.body.className = "";
    img.src = "./assets/images/light.svg"
}

// Darkmode toggle button event
document.getElementById("toggle-mode").addEventListener("click", toggleDarkMode);