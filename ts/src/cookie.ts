/////////////////////////////////////// Variables ///////////////////////////////////////
const allLang = ["hu", "en"];
siteData["language"] = allLang.includes(siteData["language"]) ? siteData["language"] : "en";
let jsonData: CookieJSON<any> = {};
let cookieDatabase = {};
let cookie: Cookie = {};
let cookieConsentOut: string;
let cookieSettings: HTMLDivElement;
let cookieSettContentBtn: HTMLDivElement;
let cookieSettAboutBtn: HTMLDivElement;
let cookieSettContent: HTMLDivElement;
let cookieSettAbout: HTMLDivElement;

/////////////////////////////////////// Types ///////////////////////////////////////
type Cookie = {
    cookie_consent_accepted?: boolean,
    cookie_consent_level?: any,
    [key: string]: any,
}

type CookieJSON<T = any> = {
  [key: string]: T;
};

//
/////////////////////////////////////// JSON ///////////////////////////////////////
fetch(`${siteData["redcatPath"]}cookie/data/lang/${siteData["language"]}.json`)
  .then(response => response.json())
  .then((data: CookieJSON<any>) => {
    jsonData = data;
    console.log(jsonData);
    jsonLoadReady();
  })
  .catch(error => {
    console.error('Error:', error);
  });

fetch(`${siteData["redcatPath"]}cookie/data/cookieDatabase.json`)
.then(response => response.json())
.then((data: CookieJSON<any>) => {
  cookieDatabase = data;
  console.log(cookieDatabase);
  //jsonLoadReady();
})
.catch(error => {
  console.error('Error:', error);
});

/////////////////////////////////////// COOKIE SCAN & START ///////////////////////////////////////
let cookie_string = document.cookie.split(';');
cookie_string.forEach((pair) => {
    const [key, value] = pair.split("=");
    if (key !== undefined && value !== undefined) {
        cookie[key.trim()] = value.trim();
    }
});
const cookie_keys = Object.keys(cookie);

if (!cookie.cookie_consent_accepted || cookie.cookie_consent_level == undefined) {
  cookie.cookie_consent_accepted = false;
  cookie.cookie_consent_level = JSON.parse('{"necessary": false, "functionality": false, "tracking": false, "targeting": false}');
}
if (cookie.cookie_consent_accepted) {
  cookie.cookie_consent_level = JSON.parse(cookie.cookie_consent_level);
}


/////////////////////////////////////// Functions ///////////////////////////////////////
// Waiting function
function waitingDelay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Set cookies
function cookieSet(cname: string, cvalue: string, exdays: number) {
    const d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    const expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/; SameSite=Lax; Secure";
}

// Export cookies (all or custom settings)
function cookieExport(applyAll: boolean) {
  if(applyAll) {cookieConsentOut = '{"necessary":true, "functionality": true, "tracking": true, "targeting": true}';}

  cookieSet("cookie_consent_accepted", "true", 180)	
  cookieSet("cookie_consent_level", cookieConsentOut, 180)

  //onsole.log(cookieConsentOut);
  window.location.reload();
}

// Delete all cookies
function cookiePurge() {
    for (let i = 0; i < cookie_keys.length; i++) {
        cookieSet(cookie_keys[i], "", 0);
    }
    window.location.reload();
}

// Build CSS Style
function buildCss() {
    const cookieCSS = document.createElement("link");
    cookieCSS.setAttribute("rel", "stylesheet");
    cookieCSS.setAttribute("href", "/red-cat-center/cookie/css/cookie.css?v="+Date.now());
    document.head.appendChild(cookieCSS);
}

// Cookie Settings Apply
function cookieSave() {
  let checkboxes = document.getElementsByName("cookie_checkbox");
  let selectedCookies: { [key: string]: boolean } = {
    necessary: true
  };

  for (let i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i] instanceof HTMLInputElement) {
      const checkbox = checkboxes[i] as HTMLInputElement;
      selectedCookies[checkbox.value] = checkbox.checked;
    }
  }

  cookieConsentOut = JSON.stringify(selectedCookies);
  cookieExport(false);
}

// Cookie List - Check datas from cookies
function cookieList() {
  console.log(cookie_keys);

  // Kategóriánként szétdobálni
  /*
    1. Nélkülözhetetlen - cookie_consent_accepted 
                          cookie_consent_level

  */

}
cookieList();


function cookieSettingsSwitch() {
  console.log("yupp");

  if (cookieSettContentBtn.classList.contains("active")) {
    cookieSettContentBtn.classList.remove("active")
    cookieSettAboutBtn.classList.add("active")

    cookieSettContent.style.display = "none";
    cookieSettAbout.style.display = "flex";
  } else {
    cookieSettAboutBtn.classList.remove("active")
    cookieSettContentBtn.classList.add("active")

    cookieSettContent.style.display = "flex";
    cookieSettAbout.style.display = "none";
  }
}


async function toggleIt(elementiD: string) {
  const element = document.getElementById(elementiD);

  if (element) {
    if (element.classList.contains("active")) {
        element.classList.remove("active");
        await waitingDelay(1000);
        element.style.display = "none";
    } else {
        element.style.display = "flex";
        await waitingDelay(1);
        element.classList.add("active");
    }
    
    //element.style.display = (element.style.display === "none") ? "flex" : "none";
  }
}


// Toggle window
function toggleDisplay(elementiD: string) {
    const element = document.getElementById(elementiD);
    if (element) {
      element.style.display = (element.style.display === "none") ? "flex" : "none";
    }
    if (elementiD === "cookieSettings") {
        cookieSettContentBtn.classList.add("active");
        cookieSettAboutBtn.classList.remove("active");
        cookieSettContent.style.display = "flex";
        cookieSettAbout.style.display = "none";
    }
    console.log("toggleDisplay");
}

function cookieSettingsApply() {
  const cookieConsentOut: { [key: string]: boolean } = {
    necessary: true,
  };

  Object.keys(cookie.cookie_consent_level).forEach((key, i) => {
    if (i > 0) {
      const checkbox = document.getElementById("cookie_d_" + i) as HTMLInputElement;
      cookieConsentOut[key] = checkbox.checked;
    }
  });

  cookieExport(false);
}

async function buildHTML() {
  // Cookie SVG
  const cookieSvg = `<img src="${siteData['redcatPath']}cookie/img/cookie.svg" alt="SVG kép">`;
  
  // Build a #cookie Div in HTML
  const cookieDiv = document.createElement("div");
  cookieDiv.id = "cookie";
  document.body.appendChild(cookieDiv);

  // Deny All or Delete All
  let btnDeny = cookie.cookie_consent_accepted ? ["cookieDeleteAll", jsonData['buttons']['deleteAll']] : ["cookieDenyAll", jsonData['buttons']['denyAll']];

  // Checkbox checker
  function checkEr(type: string) {
    let $out = cookie.cookie_consent_level[type] ? "checked" : "";
    return $out;
  }

  // Create HTML text
  let htmlCookie = `
      <div id="cookieMain" style="display: none;">

        <div id="cookieTop"></div>

        <div id="cookieCenter">

            <b class="cookieTitle">${jsonData['main']['title']}</b>
            <p>${jsonData['main']['description']}</p>
            
            <div class="cookieChoose">
              <div class="cookieBtn" id="cookieSettBtn">${jsonData['buttons']['settings']}</div>
              <div class="cookieBtn" id="${btnDeny[0]}">${btnDeny[1]}</div>
              <div class="cookieBtn btnStar" id="cookieAgreeAll">${jsonData['buttons']['agreeAll']}</div>
            </div>
        </div>

        <div id="cookieBlur"></div>

      </div>

      <div id="cookieSettings" style="display: none;">

        <div class="cookieSettingsBox">
          <div class="settingsTitle">
            <b class="title">${jsonData['settings']['title']}</b>
            <p>${jsonData['settings']['description']}</p>
          </div>

          <div class="TabTitle">
            <div id="cookieSettContentBtn" class="active">${jsonData['tabs']['details']}</div>
            <div id="cookieSettAboutBtn">${jsonData['tabs']['faq']}</div>
          </div>

          <div id="cookieSettContent" class="TabContent">
            <div class="detail">
              <b>${jsonData['info']['title']}</b>
              <p>${jsonData['info']['description']}</p>
              <a href="#">${jsonData['settings']['policy']}</a>
            </div>
            <div class="checkbox checked">
              <div class="check">
                <b>${jsonData['types']['necessary']['title']}</b>
                <i>Mindig aktív</i>
              </div>
              <p>${jsonData['types']['necessary']['description']}</p>
              <details>
                <summary>Részletek</summary>
                <p>Epcot is a theme park at Walt Disney World Resort featuring exciting attractions, international pavilions, award-winning fireworks and seasonal special events.</p>
              </details>
            </div>
            <div class="checkbox ${checkEr("functionality")}">
              <div class="check">
                <b>${jsonData['types']['functionality']['title']}</b>
                <input type="checkbox" id="functionality" name="cookie_checkbox" value="functionality" ${checkEr("functionality")}>
              </div>
              <p>${jsonData['types']['functionality']['description']}</p>
            </div>
            <div class="checkbox ${checkEr("tracking")}">
              <div class="check">
                <b>${jsonData['types']['tracking']['title']}</b>
                <input type="checkbox" id="tracking" name="cookie_checkbox" value="tracking" ${checkEr("tracking")}>
              </div>
              <p>${jsonData['types']['tracking']['description']}</p>
            </div>
            <div class="checkbox ${checkEr("targeting")}">
              <div class="check">
                <b>${jsonData['types']['targeting']['title']}</b>
                <input type="checkbox" id="targeting" name="cookie_checkbox" value="targeting" ${checkEr("targeting")}>
              </div>
              <p>${jsonData['types']['targeting']['description']}</p>
            </div>
          </div>


          <div id="cookieSettAbout" class="TabContent">
            <details>
              <summary><b>${jsonData['faq']['cookie']['title']}</b></summary>
              <p>${jsonData['faq']['cookie']['description']}</p>
            </details>
            <details>
              <summary><b>${jsonData['faq']['cookiecat']['title']}</b></summary>
              <p>${jsonData['faq']['cookiecat']['description']}</p>
            </details>
            <details>
              <summary><b>${jsonData['faq']['delete']['title']}</b></summary>
              <p>${jsonData['faq']['delete']['description']}</p>
            </details>
          </div>
          <div class="cookieSettBottom">
            <div class="cookieBtn btnStar" id="cookieSaveBtn">${jsonData['buttons']['save']}</div>
          </div>
        </div>

        <div id="cookieSettBg"></div>
      </div>


      <div id="cookieSwitch"></div>
  `

  // Building final HTML
  cookieDiv.innerHTML = htmlCookie;

  // TOGGLE
  function CookieToggle() {
    //toggleDisplay("cookieMain");
    cookieMain.style.display = "flex";

    cookieMain.classList.add('active');
  }

  // Create BTN Variables
  const cookieTopSvg = document.querySelector("#cookieTop") as HTMLDivElement;
  const cookieMain = document.querySelector("#cookieMain") as HTMLDivElement;
  const cookieAgreeAll = document.querySelector("#cookieAgreeAll") as HTMLDivElement;
  const cookieDeleteAll = document.querySelector("#cookieDeleteAll") as HTMLDivElement;
  const cookieDenyAll = document.querySelector("#cookieDenyAll") as HTMLDivElement;
  const cookieSettBtn = document.querySelector("#cookieSettBtn") as HTMLDivElement;
  const cookieSaveBtn = document.querySelector("#cookieSaveBtn") as HTMLDivElement;
  const cookieSwitchBtn = document.querySelector("#cookieSwitch") as HTMLDivElement;
  const cookieSettBg = document.querySelector("#cookieSettBg") as HTMLDivElement;
  cookieSettContent = document.querySelector("#cookieSettContent") as HTMLDivElement;
  cookieSettAbout = document.querySelector("#cookieSettAbout") as HTMLDivElement;
  cookieSettings = document.querySelector("#cookieSettings") as HTMLDivElement;
  cookieSettContentBtn = document.querySelector("#cookieSettContentBtn") as HTMLDivElement;
  cookieSettAboutBtn = document.querySelector("#cookieSettAboutBtn") as HTMLDivElement;

  // AddEventListeners
  cookieAgreeAll.addEventListener("click", function() {cookieExport(true);});
  if (cookieDenyAll) {cookieDenyAll.addEventListener("click", function() {toggleIt("cookieMain");});}
  if (cookieDeleteAll) {cookieDeleteAll.addEventListener("click", cookiePurge);}
  if (cookieSettContentBtn) {cookieSettContentBtn.addEventListener("click", cookieSettingsSwitch);}
  if (cookieSettAboutBtn) {cookieSettAboutBtn.addEventListener("click", cookieSettingsSwitch);}
  if (cookieSwitchBtn) {cookieSwitchBtn.addEventListener("click", function() {toggleIt("cookieMain");});}
  if (cookieSettBtn) {cookieSettBtn.addEventListener("click", function() {toggleDisplay("cookieSettings");});}
  if (cookieSettBg) {cookieSettBg.addEventListener("click", function() {toggleDisplay("cookieSettings");});}
  if (cookieSaveBtn) {cookieSaveBtn.addEventListener("click", function() {cookieSave();});}

  cookieSwitchBtn.innerHTML = cookieSvg;
  cookieTopSvg.innerHTML = cookieSvg;

// FIRST START THE COOKIE PANEL
  if (!cookie.cookie_consent_accepted) {
    cookieMain.style.display = "flex";
    await waitingDelay(1000); // Wait before starting
    cookieMain.classList.add('active');
  }
}

/////////////////////////////////////// Loading is ready ///////////////////////////////////////
async function jsonLoadReady() {
  try {
    buildHTML();
  } catch (error) {
    throw error;
  }
}

/////////////////////////////////////// Final Render ///////////////////////////////////////
buildCss();
console.log(cookie.cookie_consent_level);