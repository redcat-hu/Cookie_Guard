/////////////////////////////////////// Variables ///////////////////////////////////////
const allLang = ["hu", "en"];
siteData["language"] = allLang.includes(siteData["language"]) ? siteData["language"] : "en";
let jsonData: CookieJSON<any> = {};
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


/////////////////////////////////////// JSON ///////////////////////////////////////
fetch(`data/lang_${siteData["language"]}.json`)
  .then(response => response.json())
  .then((data: CookieJSON<any>) => {
    jsonData = data;
    console.log(jsonData);
    jsonLoadReady();
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




function cookieSettingsSwitch() {
  console.log("yupp");

  if (cookieSettContentBtn.classList.contains("active")) {
    cookieSettContentBtn.classList.remove("active")
    cookieSettAboutBtn.classList.add("active")

    cookieSettContent.style.display = "flex";
    cookieSettAbout.style.display = "none";
  } else {
    cookieSettAboutBtn.classList.remove("active")
    cookieSettContentBtn.classList.add("active")

    cookieSettContent.style.display = "none";
    cookieSettAbout.style.display = "flex";
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
  const cookieSvg = `<img src="img/cookie.svg" alt="SVG kép">`;
  
  // Build a #cookie Div in HTML
  const cookieDiv = document.createElement("div");
  cookieDiv.id = "cookie";
  document.body.appendChild(cookieDiv);

  // Deny All or Delete All
  let btnDeny = cookie.cookie_consent_accepted ? ["cookieDeleteAll", jsonData['buttons']['deleteAll']] : ["cookieDenyAll", jsonData['buttons']['denyAll']];

  // Create HTML text
  let htmlCookie = `
      <div id="cookieMain">

        <div id="cookieTop"></div>

        <div id="cookieCenter">

            <b class="cookieTitle">${jsonData['title']}</b>
            <p>${jsonData['description']}</p>
            
            <div class="cookieChoose">
              <div class="cookieBtn" id="cookieSettBtn">${jsonData['buttons']['settings']}</div>
              <div class="cookieBtn" id="${btnDeny[0]}">${btnDeny[1]}</div>
              <div class="cookieBtn btnStar" id="cookieAgreeAll">${jsonData['buttons']['agreeAll']}</div>
            </div>
        </div>

        <div id="cookieBlur"></div>

      </div>

      <div id="cookieSettings">

        <div class="cookieContent">

          <div class="settingsTitle">
            <b class="title">${jsonData['settings_title']}</b>
            <p>${jsonData['description']} <a href="#">${jsonData['policy']}</a></p>
          </div>

          <div class="TabTitle">
            <div id="cookieSettContentBtn">Nyilatkozat</div>
            <div id="cookieSettAboutBtn">${jsonData['settings']['about']}</div>
          </div>

          <div id="cookieSettContent" class="TabContent">
            <div>
              <b>${jsonData['info']['title']}</b>
              <p>${jsonData['info']['description']}</p>
            </div>
            <div>
              <div>
                <b>${jsonData['types']['title']['necessary']}</b>
                <i>Mindig aktív</i>
              </div>
              <p>${jsonData['types']['description']['necessary']}</p>
              <details>
                <summary>Részletek</summary>
                <p>Epcot is a theme park at Walt Disney World Resort featuring exciting attractions, international pavilions, award-winning fireworks and seasonal special events.</p>
              </details>
            </div>
            <div>
              <div>
                <b>${jsonData['types']['title']['functionality']}</b>
                <input type="checkbox" id="cookie_d_1" name="cookie_checkbox" value="functionality" checked="">
              </div>
              <p>${jsonData['types']['description']['functionality']}</p>
            </div>
            <div>
              <div>
                <b>${jsonData['types']['title']['tracking']}</b>
                <input type="checkbox" id="cookie_d_1" name="cookie_checkbox" value="functionality" checked="">
              </div>
              <p>${jsonData['types']['description']['tracking']}</p>
            </div>
            <div>
              <div>
                <b>${jsonData['types']['title']['targeting']}</b>
                <input type="checkbox" id="cookie_d_1" name="cookie_checkbox" value="functionality" checked="">
              </div>
              <p>${jsonData['types']['description']['targeting']}</p>
            </div>

            <details>
              <summary><b>${jsonData['settings']['moreInfo']}</b></summary>
              <p>Epcot is a theme park at Walt Disney World Resort featuring exciting attractions, international pavilions, award-winning fireworks and seasonal special events.</p>
            </details>
          </div>

          <div id="cookieSettAbout" class="TabContent">
            <p>${jsonData['info']['description']}</p>
          </div>
          <div class="cookieSettBottom">
            <div class="cookieBtn btnStar" id="cookieSettBtn">${jsonData['buttons']['save']}</div>
          </div>
        </div>

        <div id="cookieSettBg"></div>
      </div>


      <div id="cookieSwitch"></div>
  `

  // Building final HTML
  cookieDiv.innerHTML = htmlCookie;

  // Create BTN Variables
  const cookieTopSvg = document.querySelector("#cookieTop") as HTMLDivElement;
  const cookieAgreeAll = document.querySelector("#cookieAgreeAll") as HTMLDivElement;
  const cookieDeleteAll = document.querySelector("#cookieDeleteAll") as HTMLDivElement;
  const cookieDenyAll = document.querySelector("#cookieDenyAll") as HTMLDivElement;
  const cookieSettBtn = document.querySelector("#cookieSettBtn") as HTMLDivElement;
  const cookieSwitchBtn = document.querySelector("#cookieSwitch") as HTMLDivElement;
  const cookieSettBg = document.querySelector("#cookieSettBg") as HTMLDivElement;
  cookieSettContent = document.querySelector("#cookieSettContent") as HTMLDivElement;
  cookieSettAbout = document.querySelector("#cookieSettAbout") as HTMLDivElement;
  cookieSettings = document.querySelector("#cookieSettings") as HTMLDivElement;
  cookieSettContentBtn = document.querySelector("#cookieSettContentBtn") as HTMLDivElement;
  cookieSettAboutBtn = document.querySelector("#cookieSettAboutBtn") as HTMLDivElement;

  cookieSettings.style.display = "none";

  // AddEventListeners
  cookieAgreeAll.addEventListener("click", function() {cookieExport(true);});
  if (cookieDenyAll) {cookieDenyAll.addEventListener("click", CookieToggle);}
  if (cookieDeleteAll) {cookieDeleteAll.addEventListener("click", cookiePurge);}
  if (cookieSettContentBtn) {cookieSettContentBtn.addEventListener("click", cookieSettingsSwitch);}
  if (cookieSettAboutBtn) {cookieSettAboutBtn.addEventListener("click", cookieSettingsSwitch);}
  cookieSwitchBtn.addEventListener("click", CookieToggle);
  if (cookieSettBtn) {cookieSettBtn.addEventListener("click", function() {toggleDisplay("cookieSettings");});}
  if (cookieSettBg) {cookieSettBg.addEventListener("click", function() {toggleDisplay("cookieSettings");});}

  // Other functions
  function CookieToggle() {
    toggleDisplay("cookieMain");
    
    /*
    if (cookieDiv.classList.contains('active')) {
      cookieDiv.classList.remove('active');
    } else {
      cookieDiv.classList.add('active');
    }
    */
  }

  // Turn on the Cookie Panel
  async function cookieLetsGo() {
    if (cookie.cookie_consent_accepted) {
      cookieDiv.classList.remove('active');
      await waitingDelay(1000);
      cookieDiv.style.display = "none";
    } else {
      cookieDiv.style.display = "flex";
      await waitingDelay(1000);
      cookieDiv.classList.add('active');
    }

    cookieSwitchBtn.innerHTML = cookieSvg;
    cookieTopSvg.innerHTML = cookieSvg;
  }

  await waitingDelay(1000);
  cookieLetsGo();
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