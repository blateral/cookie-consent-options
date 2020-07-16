import * as React from "react";
import styles from "./styles.css";

// MODULES
import Icon from "./modules/Icon";
import Title from "./modules/Title";
import Text from "./modules/Text";
import { ActionContainer, Action } from "./modules/Action";

// TYPES | DEFAULTS | FUNCTIONS
import {
    CookieConfig,
    CookieConfigDefaults,
    Cookie,
    CookieConsentData,
    getCookie,
    setCookie,
    CookieConfigInitialProps
} from "./utils/cookie";
import {
    bindConsentButtons,
    isUrlInWhitelist,
    activateTrackingScripts,
    updateConsentStatusElements
} from "./utils/mutations";

type RenderProps = {
    handleAccept: () => void;
    handleDecline: () => void;
    additionalDeclineProps: {
        ["data-gtm"]: string;
    };
    additionalAcceptProps: {
        ["data-gtm"]: string;
    };
};

const CookieConsent: React.FC<CookieConfigInitialProps & {
    className?: string;
    children: (props: RenderProps) => React.ReactElement;
}> = ({ className = "", children, ...props }) => {
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
        localeKey
    } = {
        ...CookieConfigDefaults,
        ...props
    } as CookieConfig;
    const [isVisible, setIsVisible] = React.useState(false);

    React.useEffect(() => {
        bindConsentButtons(() => setIsVisible(true));

        const cookie = getCookie(name) as Cookie<CookieConsentData>;
        const containsWhitelist = isUrlInWhitelist(
            window.location.pathname,
            urlWhitelist
        );
        if (!containsWhitelist) setIsVisible(!cookie);
        if (cookie && cookie.data.consent) {
            activateTrackingScripts();
        }
    }, []);

    React.useEffect(() => {
        const cookie = getCookie(name) as Cookie<CookieConsentData>;

        const str = !cookie
            ? noCookieStatusMsg
            : cookie.data.consent
            ? consentAcceptStatusMsg
            : consentDeclineStatusMsg;

        updateConsentStatusElements(
            cookie,
            str,
            dateFormat,
            timeFormat,
            localeKey
        );
    }, [isVisible]);

    if (!isVisible) return null;
    return (
        <div
            className={`${styles.CookieConsent} ${className}`}
            style={zIndex ? { zIndex } : {}}
        >
            <div className={styles.CookieConsent__content}>
                {children({
                    handleDecline: () => {
                        setCookie<CookieConsentData>(
                            name,
                            {
                                consent: false,
                                updatedAt: new Date().getTime(),
                                selectedOptions: []
                            },
                            lifetime
                        );
                        setIsVisible(false);
                    },
                    handleAccept: () => {
                        setCookie<CookieConsentData>(
                            name,
                            {
                                consent: true,
                                updatedAt: new Date().getTime(),
                                selectedOptions: []
                            },
                            lifetime
                        );
                        setIsVisible(false);
                        activateTrackingScripts();
                    },
                    additionalAcceptProps: {
                        ["data-gtm"]: "button-cookie-consent-accept"
                    },
                    additionalDeclineProps: {
                        ["data-gtm"]: "button-cookie-consent-decline"
                    }
                })}
            </div>
        </div>
    );
};

export default {
    View: CookieConsent,
    Icon,
    Title,
    Text,
    ActionContainer,
    Action
};
