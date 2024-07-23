import { StatusFormatter } from "./formatter";
import { CookieConsentData, Cookie } from "./cookie";

export const bindConsentButtons = (callback: () => void) => {
    const allConsentButtons = document.querySelectorAll(
        "[data-consent-button], .cookie-consent-button"
    );

    for (var i = 0, len = allConsentButtons.length; i < len; i++) {
        allConsentButtons[i].addEventListener("click", callback);
    }
};

export const activateTrackingScripts = (key?: string) => {
    const scriptElements = document.querySelectorAll(
        `script[type='text/consent_banner_script${
            key ? "_" + key : ""
        }'], script[type='text/cookie-consent-script${key ? "-" + key : ""}']`
    );

    let i = scriptElements.length;
    const newScriptElements: HTMLScriptElement[] = [];

    while (i--) {
        // create new script element to call it
        const newScriptElement = document.createElement("script");
        newScriptElement.type = "text/javascript";

        if (scriptElements[i].hasAttribute("src")) {
            newScriptElement.src = scriptElements[i].getAttribute("src")!;
            newScriptElement.async = true;
        } else {
            newScriptElement.innerHTML = scriptElements[i].innerHTML;
        }

        // add new script tags to list
        newScriptElements.push(newScriptElement);

        // delete old helper element
        if (scriptElements[i].parentNode) {
            // eslint-disable-next-line no-unused-expressions
            scriptElements[i].parentNode?.removeChild(scriptElements[i]);
        }
    }

    // append new script tags
    i = newScriptElements.length;
    while (i--) {
        // append / activate script
        document.body.appendChild(newScriptElements[i]);
    }
};

export const isUrlInWhitelist = (
    urlString: string,
    whitelist: string[] = []
) => {
    let isInWhiteList: boolean = false;
    for (let i: number = 0; i < whitelist.length; i++) {
        if (urlString.indexOf(whitelist[i]) > -1) {
            isInWhiteList = true;
            break;
        }
    }
    return isInWhiteList;
};

export const updateConsentStatusElements = (
    cookie: Cookie<CookieConsentData>,
    status: string,
    dateFormat: string,
    timeFormat: string,
    localeKey: string = "de"
) => {
    const allConsentStatusElements = document.querySelectorAll(
        "[data-consent-status], .cookie-consent-status"
    );

    // render status inside defined dom elements without react
    const formatter = new StatusFormatter(
        cookie?.data.updatedAt,
        status,
        dateFormat,
        timeFormat,
        localeKey
    );

    for (var i = 0, len = allConsentStatusElements.length; i < len; i++) {
        allConsentStatusElements[i].innerHTML = formatter.getFormattedStatus();
    }
};
