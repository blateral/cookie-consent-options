import * as React from "react";
import styles from "./../styles.css";

const Icon: React.FC<{
    src: string;
    alt?: string;
    className?: string;
}> = ({ src, alt, className = "" }) => (
    <img
        className={`${styles.CookieConsent__icon} ${className}`}
        src={src}
        alt={alt || ""}
    />
);

export default Icon;
