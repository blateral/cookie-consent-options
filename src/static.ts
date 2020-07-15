require("./styles.css");
import {
    CookieConfigDefaults,
    CookieConfig,
    CookieContent,
    CookieContentDefaults,
    CookieContentInitalProps,
    CookieConfigInitialProps,
    Cookie,
    CookieConsentData,
    getCookie,
    setCookie
} from "./utils/cookie";
import {
    bindConsentButtons,
    isUrlInWhitelist,
    activateTrackingScripts,
    updateConsentStatusElements
} from "./utils/mutations";

const createStore = (initialState = {}) => {
    let state: { [key: string]: any } = initialState;
    let listeners: Array<() => void> = [];

    return {
        getState: () => state,
        setState: (newState: any) => {
            state = {
                ...state,
                ...newState
            };

            listeners.forEach(l => l());
        },
        subscribe: (l: any) => {
            listeners = [...listeners, l];
        }
    };
};

const buildCookieMarkup = ({
    icon,
    title,
    text,
    labelAccept,
    labelDecline,
    zIndex,
    handleAccept,
    handleDecline,
    options,
    selectedOptions,
    handleOptionChange
}: CookieContent & {
    zIndex?: number;
    handleDecline: () => void;
    handleAccept: () => void;
    handleOptionChange: (value: string) => void;
    selectedOptions: string[];
}) => {
    const $CookieView = document.createElement("div");
    $CookieView.className = "CookieConsent isHidden";

    if (zIndex) {
        $CookieView.style.zIndex = zIndex.toString();
    }

    const $CookieViewContent = document.createElement("div");
    $CookieViewContent.className = "CookieConsent__content";

    if (icon) {
        const $CookieIcon = document.createElement("img");
        $CookieIcon.className = "CookieConsent__icon";
        $CookieIcon.setAttribute("src", icon);

        $CookieViewContent.appendChild($CookieIcon);
    }

    if (title) {
        const $CookieTitle = document.createElement("h2");
        $CookieTitle.className = "CookieConsent__title";
        $CookieTitle.innerHTML = title;

        $CookieViewContent.appendChild($CookieTitle);
    }

    const $CookieText = document.createElement("div");
    $CookieText.className = "CookieConsent__text";
    $CookieText.innerHTML = text;

    $CookieViewContent.appendChild($CookieText);

    const $CookieOptions = document.createElement("div");
    $CookieOptions.className = "CookieConsent__options";

    options.forEach(({ label, value, checked, disabled }) => {
        const $Option = document.createElement("label");
        $Option.className = "CookieConsent__option";

        const $Cb = document.createElement("input");
        $Cb.type = "checkbox";
        $Cb.className = "CookieConsent__checkbox";
        $Cb.name = "cookie_consent_option";
        $Cb.value = value;
        $Cb.checked =
            selectedOptions.indexOf(value) > -1 ? true : checked || false;
        $Cb.disabled = disabled || false;
        $Cb.addEventListener("change", () => handleOptionChange(value));

        const $Label = document.createElement("span");
        $Label.className = "CookieConsent__checkboxl-label";
        $Label.innerHTML = label;

        $Option.appendChild($Cb);
        $Option.appendChild($Label);
        $CookieOptions.appendChild($Option);
    });

    $CookieViewContent.appendChild($CookieOptions);

    const $CookieActions = document.createElement("div");
    $CookieActions.className = "CookieConsent__actions";

    const $CookieActionAccept = document.createElement("button");
    $CookieActionAccept.className =
        "CookieConsent__action  CookieConsent__action--accept";
    $CookieActionAccept.setAttribute(
        "data-gtm",
        "button-cookie-consent-accept"
    );
    $CookieActionAccept.innerHTML = labelAccept;
    $CookieActionAccept.addEventListener("click", handleAccept);

    const $CookieActionDecline = document.createElement("button");
    $CookieActionDecline.className =
        "CookieConsent__action  CookieConsent__action--decline";
    $CookieActionDecline.setAttribute(
        "data-gtm",
        "button-cookie-consent-decline"
    );
    $CookieActionDecline.innerHTML = labelDecline;
    $CookieActionDecline.addEventListener("click", handleDecline);

    $CookieActions.appendChild($CookieActionDecline);
    $CookieActions.appendChild($CookieActionAccept);
    $CookieViewContent.appendChild($CookieActions);

    $CookieView.appendChild($CookieViewContent);

    return $CookieView;
};

const $mountPointCookie = document.querySelector("#cookie-consent");

if ($mountPointCookie) {
    const script = $mountPointCookie.querySelector("script");
    let initialState: CookieConfigInitialProps & CookieContentInitalProps = {};

    if (script) {
        try {
            initialState = JSON.parse(script.innerText);
        } catch (e) {}
    }

    const {
        zIndex,
        name,
        lifetime,
        urlWhitelist,
        consentAcceptStatusMsg,
        consentDeclineStatusMsg,
        noCookieStatusMsg,
        dateFormat,
        timeFormat,
        localeKey,
        icon,
        title,
        text,
        options,
        labelAccept,
        labelDecline
    } = {
        ...CookieConfigDefaults,
        ...CookieContentDefaults,
        ...initialState
    } as CookieConfig & CookieContent;

    const store = createStore({
        isVisible: false,
        selectedOptions: options
            .filter(({ checked }) => checked)
            .map(({ value }) => value)
    });

    const $Cookie = buildCookieMarkup({
        icon,
        title,
        text,
        labelAccept,
        labelDecline,
        options,
        zIndex,
        selectedOptions: store.getState().selectedOptions,
        handleDecline: () => {
            setCookie<CookieConsentData>(
                name,
                {
                    consent: false,
                    updatedAt: new Date().getTime(),
                    selectedOptions: store.getState().selectedOptions
                },
                lifetime
            );

            store.setState({ isVisible: false });
        },
        handleAccept: () => {
            setCookie<CookieConsentData>(
                name,
                {
                    consent: true,
                    updatedAt: new Date().getTime(),
                    selectedOptions: options.map(option => option.value)
                },
                lifetime
            );
            store.setState({
                isVisible: false,
                selectedOptions: options.map(option => option.value)
            });
            activateTrackingScripts();
        },
        handleOptionChange: value => {
            const selectedOptions = store.getState().selectedOptions;
            selectedOptions.indexOf(value) > -1
                ? store.setState({
                      selectedOptions: selectedOptions.filter(
                          (i: string) => i !== value
                      )
                  })
                : store.setState({
                      selectedOptions: [...selectedOptions, value]
                  });
        }
    });

    $mountPointCookie.innerHTML = "";
    $mountPointCookie.appendChild($Cookie);

    store.subscribe(() => {
        $Cookie.className = store.getState().isVisible
            ? "CookieConsent"
            : "CookieConsent isHidden";

        $Cookie
            .querySelectorAll('[name="cookie_consent_option"]')
            .forEach((element: HTMLInputElement) => {
                element.checked =
                    store
                        .getState()
                        .selectedOptions.indexOf(
                            element.getAttribute("value")
                        ) > -1;
            });
    });

    const updateStatusElements = () => {
        const cookie = getCookie(name) as Cookie<CookieConsentData>;

        const str = !cookie
            ? noCookieStatusMsg
            : cookie.data.consent
            ? consentAcceptStatusMsg
            : consentDeclineStatusMsg;

        const oStr = cookie
            ? ` (${options
                  .filter(
                      ({ value }) =>
                          cookie.data.selectedOptions.indexOf(value) > -1
                  )
                  .map(({ label }) => label)
                  .join(", ")})`
            : "";

        updateConsentStatusElements(
            cookie,
            str + oStr,
            dateFormat,
            timeFormat,
            localeKey
        );
    };

    store.subscribe(updateStatusElements);
    updateStatusElements();

    bindConsentButtons(() => store.setState({ isVisible: true }));
    const cookie = getCookie(name) as Cookie<
        CookieConsentData & { selectedOptions: string }
    >;
    const isInWhitelist = isUrlInWhitelist(
        window.location.pathname,
        urlWhitelist
    );

    if (!isInWhitelist) store.setState({ isVisible: !cookie });
    if (cookie && cookie.data.selectedOptions) {
        const selectedOptions = cookie.data.selectedOptions.split(",");
        selectedOptions.forEach(option => {
            activateTrackingScripts(option);
        });

        store.setState({ selectedOptions });
    }
}
