import * as React from "react";
import styles from "./../styles.css";

export const ActionContainer: React.FC<{
    className?: string;
}> = ({ className = "", children }) => (
    <div className={`${styles.CookieConsent__actions} ${className}`}>
        {children}
    </div>
);

export const Action: React.FC<{
    buttonTag?: "a" | "button";
    onClick?: () => void;
    type?: "accept" | "decline";
    className?: string;
    [key: string]: any;
}> = ({
    buttonTag: ButtonTag = "button",
    type,
    className = "",
    children,
    onClick,
    ...rest
}) => (
    <ButtonTag
        onClick={onClick}
        className={`${styles.CookieConsent__action} ${
            type === "accept"
                ? styles["CookieConsent__action--accept"]
                : styles["CookieConsent__action--decline"]
        } ${className}`}
        {...rest}
    >
        {children}
    </ButtonTag>
);
