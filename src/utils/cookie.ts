export interface CookieConfig {
    name: string;
    zIndex?: number;
    urlWhitelist?: string[];
    consentAcceptStatusMsg: string;
    consentDeclineStatusMsg: string;
    noCookieStatusMsg: string;
    dateFormat: string;
    timeFormat: string;
    lifetime: number;
    localeKey?: string;
    domain?: string;
}

export type CookieConfigInitialProps = Partial<CookieConfig>;

export const CookieConfigDefaults: CookieConfig = {
    name: "cookie-consent",
    consentAcceptStatusMsg: "Akzeptiert am %DATE% um %TIME% Uhr",
    consentDeclineStatusMsg: "Abgelehnt am %DATE% um %TIME% Uhr",
    noCookieStatusMsg: "-",
    dateFormat: "dd.mm.yy",
    timeFormat: "hh:mm",
    lifetime: 365,
    localeKey: "de"
};

export interface CookieContent {
    icon?: string;
    title?: string;
    text: string;
    labelAccept: string;
    labelDecline: string;
    options: {
        label: string;
        value: string;
        checked?: boolean;
        disabled?: boolean;
    }[];
    toggleText?: string;
    toggleLabelMore?: string;
    toggleLabelLess?: string;
}
export type CookieContentInitalProps = Partial<CookieContent>;

export const CookieContentDefaults: CookieContent = {
    text:
        'Wir verwenden Cookies, um Zugriffe auf unsere Website zu analysieren. Dadurch können wir unsere Webseite für Sie verbessern. Unsere Partner führen diese Informationen möglicherweise mit weiteren Daten zusammen, die Sie ihnen bereitgestellt haben oder die im Rahmen der Nutzung der Dienste gesammelt wurden. Wenn Sie der Verwendung nicht zustimmen, benutzen wir ausschließlich Cookies, die für die Funktionalität der Webseite essentiell sind. Weitere Informationen finden Sie unter <a href="impressum">Impressum</a> und <a href="datenschutz">Datenschutz</a>.',
    labelAccept: "Alle auswählen und bestätigen",
    labelDecline: "Auswahl bestätigen",
    options: [
        {
            label: "Notwendig",
            value: "mandatory",
            checked: true,
            disabled: true
        },
        { label: "Statistik", value: "stats" },
        { label: "Marketing", value: "marketing" }
    ],
    toggleLabelLess: "Details ausblenden",
    toggleLabelMore: "Details anzeigen"
};

export interface CookieConsentData {
    consent: boolean;
    updatedAt: number;
    selectedOptions: string[];
}

// ************
// Control Functions
// ************

export interface Cookie<T> {
    name: string;
    data: T;
}

export const setCookie = <T>(
    name: string,
    data: T,
    days: number = -1,
    path: string = "/",
    domain?: string
) => {
    let cookieString = `${name}=`;

    // set cookie value
    let valueString = "";
    let dataKeys = Object.keys(data);
    for (let i = 0; i < dataKeys.length; i++) {
        valueString += `${dataKeys[i]}=${data[dataKeys[i]]}|`;
    }

    cookieString += encodeURIComponent(
        valueString.substr(0, valueString.length - 1)
    );

    if (domain) {
        cookieString += `; domain=${domain}`;
    }

    // specify path
    cookieString += `; path=${path};`;

    // check if cookie should have lifetime
    if (days >= 0) {
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        cookieString += ` expires=${date.toUTCString()};`;
    }
    document.cookie = cookieString;
};

export const getCookie = <T>(name: string): Cookie<T> | undefined => {
    let cookie = undefined;

    // get cookie value
    const b = document.cookie.match("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)");
    let cookieValue = b ? b.pop() : "";
    cookieValue = cookieValue ? decodeURIComponent(cookieValue) : "";

    if (cookieValue) {
        const valueArray = cookieValue.split("|").map(el => {
            const keyValueArray = el.split("=");
            return {
                key: keyValueArray[0],
                value: keyValueArray[1]
            };
        });

        let cookieData: { [k: string]: any } = {};
        for (let i: number = 0; i < valueArray.length; i++) {
            const value: any = valueArray[i].value;

            // checking for right types
            if (!isNaN(Number(value)))
                cookieData[valueArray[i].key] = Number(value) as number;
            else if (isBoolean(value))
                cookieData[valueArray[i].key] = stringToBoolean(
                    value
                ) as boolean;
            else cookieData[valueArray[i].key] = value as string;
        }

        cookie = {
            name: name,
            data: cookieData as T
        } as Cookie<T>;
    }
    return cookie;
};

export const deleteCookie = (name: string) => {
    setCookie<any>(name, {}, 0);
};

const stringToBoolean = (value: string | number | boolean) => {
    return [true, "true", "True", "TRUE", "1", 1].indexOf(value) > -1;
};

const isBoolean = (value: string | number | boolean) => {
    return value === "true" || value === "false";
};

const isNaN = (value: number) => {
    if (Number.isNaN !== undefined) return Number.isNaN(value);
    else return value !== value;
};
