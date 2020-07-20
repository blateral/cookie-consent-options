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

interface Store {
    getState: () => {
        [key: string]: any;
    };
    setState: (newState: any) => void;
    subscribe: (l: any) => void;
}

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

const generateCookieMarkup = ({
    $container,
    store,
    icon,
    title,
    text,
    labelAccept,
    labelDecline,
    zIndex,
    handleAccept,
    handleDecline,
    options,
    handleOptionChange,
    toggleText,
    toggleLabelMore,
    toggleLabelLess
}: CookieContent & {
    $container: Element;
    store: Store;
    zIndex?: number;
    handleDecline: () => void;
    handleAccept: () => void;
    handleOptionChange: (value: string) => void;
}) => {
    const state = store.getState();
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

    const $CookieOptionContainer = document.createElement("div");
    $CookieOptionContainer.className = "CookieConsent__option-container";

    const $CookieOptions = document.createElement("div");
    $CookieOptions.className = "CookieConsent__options";

    for (let i = 0; i < options.length; i++) {
        const { label, value, checked, disabled } = options[i];
        const $Option = document.createElement("label");
        $Option.className = "CookieConsent__option";

        const $Cb = document.createElement("input");
        $Cb.type = "checkbox";
        $Cb.className = "CookieConsent__checkbox";
        $Cb.name = "cookie_consent_option";
        $Cb.value = value;
        $Cb.checked =
            state.selectedOptions.indexOf(value) > -1 ? true : checked || false;
        $Cb.disabled = disabled || false;
        $Cb.addEventListener("change", () => handleOptionChange(value));

        const $Label = document.createElement("span");
        $Label.className = "CookieConsent__checkbox-label";
        $Label.innerHTML = label;

        $Option.appendChild($Cb);
        $Option.appendChild($Label);
        $CookieOptions.appendChild($Option);
    }

    $CookieOptionContainer.appendChild($CookieOptions);

    let $CookieToggleText: Element | undefined = undefined;
    let $CookieToggleBtn: HTMLElement | undefined = undefined;

    if (toggleText) {
        $CookieToggleText = document.createElement("div");
        $CookieToggleText.className = "CookieConsent__toggle-text  isHidden";
        $CookieToggleText.innerHTML = toggleText;

        $CookieToggleBtn = document.createElement("div");
        $CookieToggleBtn.className =
            "CookieConsent__toggle-btn  CookieConsent__toggle-btn--more";
        $CookieToggleBtn.innerText = toggleLabelMore as string;
        $CookieToggleBtn.addEventListener("click", () =>
            store.setState({
                isToggleVisible: !store.getState().isToggleVisible
            })
        );

        $CookieOptionContainer.appendChild($CookieToggleBtn);
        $CookieViewContent.appendChild($CookieOptionContainer);
        $CookieViewContent.appendChild($CookieToggleText);
    } else {
        $CookieViewContent.appendChild($CookieOptionContainer);
    }

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

    $container.innerHTML = "";
    $container.appendChild($CookieView);

    return () => {
        const state = store.getState();

        $CookieView.className = state.isVisible
            ? "CookieConsent"
            : "CookieConsent isHidden";

        const elements = $CookieOptions.querySelectorAll(
            '[name="cookie_consent_option"]'
        );

        for (let i = 0; i < elements.length; i++) {
            (elements[i] as HTMLInputElement).checked =
                state.selectedOptions.indexOf(
                    (elements[i] as HTMLInputElement).getAttribute("value")
                ) > -1;
        }

        if ($CookieToggleText && $CookieToggleBtn) {
            $CookieToggleText.className = state.isToggleVisible
                ? "CookieConsent__toggle-text"
                : "CookieConsent__toggle-text  isHidden";

            $CookieToggleBtn.className = state.isToggleVisible
                ? "CookieConsent__toggle-btn  CookieConsent__toggle-btn--less"
                : "CookieConsent__toggle-btn  CookieConsent__toggle-btn--more";
            $CookieToggleBtn.innerText = (state.isToggleVisible
                ? toggleLabelLess
                : toggleLabelMore) as string;
        }
    };
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
        labelDecline,
        toggleText,
        toggleLabelMore,
        toggleLabelLess,
        domain
    } = {
        ...CookieConfigDefaults,
        ...CookieContentDefaults,
        ...initialState
    } as CookieConfig & CookieContent;

    const store = createStore({
        isVisible: false,
        isToggleVisible: false,
        selectedOptions: options
            .filter(({ checked }) => checked)
            .map(({ value }) => value)
    });

    const render = generateCookieMarkup({
        $container: $mountPointCookie,
        store,
        icon,
        title,
        text,
        labelAccept,
        labelDecline,
        options,
        zIndex,
        toggleLabelLess,
        toggleLabelMore,
        toggleText,
        handleDecline: () => {
            const selectedOptions = store.getState().selectedOptions;
            setCookie<CookieConsentData>(
                name,
                {
                    consent: false,
                    updatedAt: new Date().getTime(),
                    selectedOptions
                },
                lifetime,
                undefined,
                domain
            );

            store.setState({ isVisible: false });
            for (let i = 0; i < selectedOptions.length; i++) {
                activateTrackingScripts(selectedOptions[i]);
            }
        },
        handleAccept: () => {
            const selectedOptions = store.getState().selectedOptions;
            setCookie<CookieConsentData>(
                name,
                {
                    consent: true,
                    updatedAt: new Date().getTime(),
                    selectedOptions
                },
                lifetime,
                undefined,
                domain
            );
            store.setState({
                isVisible: false,
                selectedOptions
            });

            for (let i = 0; i < selectedOptions.length; i++) {
                activateTrackingScripts(selectedOptions[i]);
            }
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

    render();
    store.subscribe(render);

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
        for (let i = 0; i < selectedOptions.length; i++) {
            activateTrackingScripts(selectedOptions[i]);
        }

        store.setState({ selectedOptions });
    }
}
