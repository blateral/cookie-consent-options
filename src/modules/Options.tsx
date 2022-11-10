import * as React from "react";
import { CookieOption } from "../utils/cookie";
import styles from "./../styles.css";

const Options: React.FC<{
    options: CookieOption[];
    handleChange?: (value: string) => void;
    className?: string;
}> = ({ options, handleChange, className = "" }) => (
    <div
        className={`${styles["CookieConsent__option-container"]} ${className}`}
    >
        <div className={styles.CookieConsent__options}>
            {options?.map((option, i) => {
                const { label, value, checked, disabled } = option;

                return (
                    <label key={i} className={styles.CookieConsent__option}>
                        <input
                            type="checkbox"
                            name="cookie_consent_option"
                            value={value}
                            checked={checked}
                            disabled={disabled}
                            onChange={() => {
                                handleChange && handleChange(value);
                            }}
                            className={styles.CookieConsent__checkbox}
                        />
                        <span className={styles.CookieConsent__checkbox}>
                            {label}
                        </span>
                    </label>
                );
            })}
        </div>
    </div>
);

export default Options;
