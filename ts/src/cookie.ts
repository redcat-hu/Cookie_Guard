// Variables
const allLanguages = ["hu", "en"];
siteLanguage = allLanguages.includes(siteLanguage) ? siteLanguage : "en";
let jsonLangData: string;

// Types
type Cookie = {
    cookie_consent_accepted?: boolean,
    cookie_consent_level?: string,
    [key: string]: any,
}
type CookieJSON = {
    [key: string]: {
        title: string;
        desc: string;
        btn: string[];
        policy: string;
        active: string;
        info_title: string;
        info_desc: string;
        sett_save: string;
        type_ti: string[];
        type_de: string[];
        disable: string[];
        other: string[];
    };
};

// Loading JSON Language
fetch(`data/lang_${siteLanguage}.json`)
  .then(response => response.json())
  .then(data => {
    jsonLangData = data;
    buildHTML();
  })
  .catch(error => {
    console.error('Error:', error);
  });


// COOKIE SCAN & START
const cookie_by = ["https://id.red-cat.hu/nn", "v2.1"];
let cookie: Cookie = {};
let cookie_lvl_out: string;

let cookie_string = document.cookie.split(';');
cookie_string.forEach((pair) => {
    const [key, value] = pair.split("=");
    if (key !== undefined && value !== undefined) {
        cookie[key.trim()] = value.trim();
    }
});
const cookie_keys = Object.keys(cookie);

if (cookie.cookie_consent_accepted && cookie.cookie_consent_level !== undefined) {
    cookie.cookie_consent_level = JSON.stringify(cookie.cookie_consent_level);
} else {
    cookie.cookie_consent_accepted = false;
    cookie.cookie_consent_level = JSON.stringify({
        necessary: false,
        functionality: false,
        tracking: false,
        targeting: false
    });
}



/////////////////////////////////////// Functions ///////////////////////////////////////
// Cookie Set
function CookieSet(cname: string, cvalue: string, exdays: number) {
    const d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    const expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/; SameSite=Lax; Secure";
}

function CookieDeleteAll() {
    for (let i = 0; i < cookie_keys.length; i++) {
        CookieSet(cookie_keys[i], "", 0);
    }
    window.location.reload();
}

function buildCSS() {
    const Cookie_CSS = document.createElement("link");
    Cookie_CSS.setAttribute("rel", "stylesheet");
    Cookie_CSS.setAttribute("href", "/red-cat-center/cookie/css/cookie.css?v="+Date.now());
    document.head.appendChild(Cookie_CSS);
}

function toggleWindow(elementSelect: string) {
    const element = document.getElementById(elementSelect);
    if (element) {
        element.style.display = (element.style.display === "none") ? "flex" : "none";
    }
}
function CookieToggle() {
    toggleWindow("cookie_base");
}
function CookieSettings() {
    toggleWindow("cookie_settings");
}

/*
function CookieExport() {
  CookieSet("cookie_consent_accepted", "true", 180)	
  CookieSet("cookie_consent_level", cookie_lvl_out, 180)
  window.location.reload();
}

function CookieAllowAll() {
  cookie_lvl_out = '{"necessary":true, "functionality": true, "tracking": true, "targeting": true}';
  CookieExport();
}

function CookieSettingsApply() {
  let c_check = [];
  cookie_lvl_out = '{"necessary": true';
  for (let i = 1; i < Object.keys(cookie.cookie_consent_level).length; i++) {
    c_check[i] = document.getElementById("cookie_d_"+i).checked;
    cookie_lvl_out += ', "' + Object.keys(cookie.cookie_consent_level)[i] + '": ' + c_check[i];
  }
  cookie_lvl_out += '}';

  CookieExport();
}

function CookieHTML() {

    let cookie_html = document.getElementById('cookie');
    let type = Object.keys(cookie.cookie_consent_level);
    let details = `<div class="cookie_details cflex1">`
    
    for (let i = 0; i < cookie_json["type_ti"].length; i++) {
        details +=`<div><div><div class="cookie_tit cflex1"><b>${cookie_json["type_ti"][i]}</b>`
        
        if (cookie_json["type_ti"][0] == cookie_json["type_ti"][i]) {
            details += `<div class="cookie_btn cookie_aactive">${cookie_json["active"]}</div></div>`
        } else if(cookie_json["type_ti"][4] == cookie_json["type_ti"][i]) {
            details += `<div></div></div>`
        } else {
            details += `<input type="checkbox" id="cookie_d_${i}" name="cookie_checkbox" value="${type[i]}"`
            if (cookie.cookie_consent_level[type[i]]) {details += ' checked'}
            details += `></div>`
        }
        details += `<p>${cookie_json["type_de"][i]}</p></div><p></p></div>`
    };
    details+= `</div>`
    
    if (cookie_html) {
        cookie_html.innerHTML =
    `
    <div id="cookie_base">
    <div id="cookie_top">${cookieSvg}</div>
    <div id="cookie_center">
      <div id="cookie_window" class="coo01">
        <div id="cookie_exit">${cookieExitSvg}</div>
        <div class="cookie_title">
            <b>${cookie_json["title"]}</b><p>${cookie_json["desc"]}</p>
        </div>
        <div class="cookie_btn_window">
            <div id="cookie_btn_sett" class="cookie_btn">${cookie_json["btn"][0]}</div>
            <div id="cookie_btn_deny" class="cookie_btn"> </div>
            <div id="cookie_btn_allow" class="cookie_btn">${cookie_json["btn"][3]}</div>
        </div>
      </div>
      <div id="cookie_settings" class="coo01">
        <div>
            <b>${cookie_json["info_title"]}</b>
            <p>${cookie_json["info_desc"]}</p>
        </div>
        ${details}
        <div class="cookie_bottom cflex1">
          <div id="cookie_sett_btn" class="cookie_btn">${cookie_json["sett_save"]}</div>
        </div>

        <div class="cookie_details cflex1">
          <details>
            <summary><b>${cookie_json["disable"][0]}</b></summary>
            <p>${cookie_json["disable"][1]}</p>
          </details>
          <details>
            <summary><b>${cookie_json["other"][0]}</b></summary>
            <p>${cookie_json["other"][1]}</p>
          </details>
        </div>

        <div class="cookie_by cflex1">
          <p>${cookie_by[1]}</p>
          <a target="_blank" href="${cookie_by[0]}">Cookie Shield by<br><img src="https://id.red-cat.hu/img/redcat_logo.webp" alt="creator site"></a>
        </div>
      </div>
    </div>
    </div>
    <div id="cookie_fixed">
      <div id="cookie_go">${cookieSvg}</div>
    </div>`
    };
    
    let cookie_html_base = document.getElementById("cookie_base");
    let cookie_deny_btn = document.getElementById("cookie_btn_deny");

    if (cookie.cookie_consent_accepted) {
      cookie_deny_btn.innerHTML = cookie_json["btn"][2];
      cookie_deny_btn.addEventListener("click", CookieDeleteAll);
      cookie_deny_btn.classList.add("cookie_btn_delete");
    } else {
      cookie_html_base.style.display = "flex";
      cookie_deny_btn.innerHTML = cookie_json["btn"][1];
      cookie_deny_btn.addEventListener("click", CookieToggle);
    }
    
    document.getElementById("cookie_go").addEventListener("click", CookieToggle);
    document.getElementById("cookie_exit").addEventListener("click", CookieToggle);
    document.getElementById("cookie_btn_allow").addEventListener("click", CookieAllowAll);
    document.getElementById("cookie_btn_sett").addEventListener("click", CookieSettings);
    document.getElementById("cookie_sett_btn").addEventListener("click", CookieSettingsApply);
}
*/


// Cookie Ready
async function buildHTML() {
  try {
    console.log(jsonLangData);
  } catch (error) {
    throw error;
  }
}

buildCSS();