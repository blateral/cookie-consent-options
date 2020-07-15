import * as React from "react";
import styles from "./../styles.css";

const Text: React.FC<{
    className?: string;
}> = ({ className = "", children }) => (
    <div className={`${styles.CookieConsent__text} ${className}`}>
        {children}
    </div>
);

export default Text;
