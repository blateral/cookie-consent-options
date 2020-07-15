import React from "react";

import Cookie from "cookie-consent";
import "cookie-consent/dist/index.css";

const App = () => {
    return (
        <Cookie.View dateFormat="DD. MMMM YYYY">
            {({
                handleAccept,
                handleDecline,
                additionalDeclineProps,
                additionalAcceptProps
            }) => (
                <>
                    <Cookie.Icon src="http://unsplash.it/100" />
                    <Cookie.Title>
                        Verwendung von Cookies für Analyse- und Marketingzwecke
                    </Cookie.Title>
                    <Cookie.Text>
                        Wir verwenden Cookies, um Zugriffe auf unsere Website zu
                        analysieren. Dadurch können wir unsere Webseite für Sie
                        verbessern. Unsere Partner führen diese Informationen
                        möglicherweise mit weiteren Daten zusammen, die Sie
                        ihnen bereitgestellt haben oder die im Rahmen der
                        Nutzung der Dienste gesammelt wurden. Wenn Sie der
                        Verwendung nicht zustimmen, benutzen wir ausschließlich
                        Cookies, die für die Funktionalität der Webseite
                        essentiell sind. Weitere Informationen finden Sie unter{" "}
                        <a href="impressum">Impressum</a> und{" "}
                        <a href="datenschutz">Datenschutz</a>.
                    </Cookie.Text>
                    <Cookie.ActionContainer>
                        <Cookie.Action
                            onClick={handleDecline}
                            {...additionalDeclineProps}
                        >
                            Cookies ablehnen
                        </Cookie.Action>
                        <Cookie.Action
                            onClick={handleAccept}
                            {...additionalAcceptProps}
                            type="accept"
                        >
                            Cookies akzeptieren
                        </Cookie.Action>
                    </Cookie.ActionContainer>
                </>
            )}
        </Cookie.View>
    );
};

export default App;
