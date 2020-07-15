import * as React from "react";
import styles from "./../styles.css";

const Title: React.FC<{
    tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "div";
    className?: string;
}> = ({ tag: TitleTag = "h2", className = "", children }) => (
    <TitleTag className={`${styles.CookieConsent__title} ${className}`}>
        {children}
    </TitleTag>
);

export default Title;
