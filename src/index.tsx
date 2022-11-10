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
    CookieConfigInitialProps,
    CookieOption
} from "./utils/cookie";
import {
    bindConsentButtons,
    isUrlInWhitelist,
    activateTrackingScripts,
    updateConsentStatusElements
} from "./utils/mutations";
import Options from "./modules/Options";

type RenderProps = {
    handleAccept: () => void;
    handleDecline: () => void;
    optionChangeHandler: (value: string) => void;
    additionalDeclineProps: {
        ["data-gtm"]: string;
    };
    additionalAcceptProps: {
        ["data-gtm"]: string;
    };
    options: CookieOption[];
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
        localeKey,
        options
    } = {
        ...CookieConfigDefaults,
        ...props
    } as CookieConfig;
    const [isVisible, setIsVisible] = React.useState(false);
    const [selectedOptions, setSelectedOptions] = React.useState<string[]>(
        options.filter(({ checked }) => checked).map(({ value }) => value)
    );

    React.useEffect(() => {
        bindConsentButtons(() => setIsVisible(true));

        const cookie = getCookie(name) as Cookie<
            CookieConsentData & { selectedOptions: string }
        >;
        const containsWhitelist = isUrlInWhitelist(
            window.location.pathname,
            urlWhitelist
        );
        if (!containsWhitelist) setIsVisible(!cookie);
        if (cookie && cookie.data.selectedOptions) {
            const selectedOptions = cookie.data.selectedOptions.split(",");
            for (let i = 0; i < selectedOptions.length; i++) {
                activateTrackingScripts(selectedOptions[i]);
            }

            setSelectedOptions(selectedOptions);
        }
    }, []);

    React.useEffect(() => {
        const cookie = getCookie(name) as Cookie<CookieConsentData>;

        const str = !cookie
            ? noCookieStatusMsg
            : cookie.data.consent
            ? consentAcceptStatusMsg
            : consentDeclineStatusMsg;

        let oStr = "";

        if (cookie && cookie.data.selectedOptions) {
            oStr = cookie
                ? ` (${options
                      .filter(
                          ({ value }) =>
                              cookie.data.selectedOptions.indexOf(value) > -1
                      )
                      .map(({ label }) => label)
                      .join(", ")})`
                : "";
        }

        updateConsentStatusElements(
            cookie,
            str + oStr,
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
                                selectedOptions
                            },
                            lifetime
                        );
                        setIsVisible(false);

                        for (let i = 0; i < selectedOptions.length; i++) {
                            activateTrackingScripts(selectedOptions[i]);
                        }
                    },
                    handleAccept: () => {
                        const allOptions = options.map(option => option.value);
                        setCookie<CookieConsentData>(
                            name,
                            {
                                consent: true,
                                updatedAt: new Date().getTime(),
                                selectedOptions: allOptions
                            },
                            lifetime
                        );
                        setIsVisible(false);
                        setSelectedOptions(allOptions);

                        for (let i = 0; i < allOptions.length; i++) {
                            activateTrackingScripts(allOptions[i]);
                        }
                    },
                    optionChangeHandler: value => {
                        setSelectedOptions(prev => {
                            if (prev.indexOf(value) > -1) {
                                return [
                                    ...prev.filter((i: string) => i !== value)
                                ];
                            } else {
                                return [...prev, value];
                            }
                        });
                    },
                    options: options.map(option => {
                        return {
                            ...option,
                            checked:
                                selectedOptions.indexOf(option.value) !== -1
                        };
                    }),
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
    Action,
    Options
};
