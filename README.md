# b.lateral Cookie Consent Banner

[![NPM](https://img.shields.io/npm/v/cookie-consent.svg)](https://www.npmjs.com/package/cookie-consent) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

This repository consist of a generic implementation of a cookie consent banner for use in various website projects. The project is split into two versions:

-   Implementation as React component
-   Native Javascript implementation

## Install

```bash
npm install --save cookie-consent
```

## Commands

In root directory:

| Command                |                          Description                          |
| ---------------------- | :-----------------------------------------------------------: |
| `npm install`          |                       Install packages                        |
| `npm run start`        |     Compile react component to dist and start dev server      |
| `npm run build`        |                Compile react component to dist                |
| `npm run start:static` | Compile static version to example-static and start dev server |
| `npm run build:static` |           Compile static version to example-static            |

In example directory:

| Command         |                  Description                   |
| --------------- | :--------------------------------------------: |
| `npm install`   |     Install packages of example react app      |
| `npm run start` | Compile example react app and start dev server |
| `npm run build` |           Compile example react app            |

## Usage

### Use as React Component

To provide a better workflow with React projects you can import the cookie-consent as a React Component.

```tsx
import React, { Component } from "react";

import MyComponent from "cookie-consent";
import "cookie-consent/dist/index.css";

class Example extends Component {
    render() {
        <Cookie.View>
            {({
                handleAccept,
                handleDecline,
                additionalDeclineProps,
                additionalAcceptProps
            }) => (
                <>
                    <Cookie.Icon src="..." />
                    <Cookie.Title>
                        Verwendung von Cookies für Analyse- und Marketingzwecke
                    </Cookie.Title>
                    <Cookie.Text>
                        Wir verwenden Cookies, ...
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
        </Cookie.View>;
    }
}
```

The `Cookie.View` element holds the entire cookie consent banner. It provides multiple additional properties to customnize the banner behaviour. e.g. `<Cookie.View name="cookie-consent">`

| Name                        |   Type   |               Default                |                                           Description                                            |
| --------------------------- | :------: | :----------------------------------: | :----------------------------------------------------------------------------------------------: |
| **className**               |  string  |                  ""                  |                      Name of additional CSS class to style the banner view                       |
| **zIndex**                  |  number  |              undefined               | Value for CSS z-index property. It overrides existing z-index values in external CSS definitions |
| **name**                    |  string  |           "cookie-consent"           |                                        Name of the cookie                                        |
| **lifetime**                |  number  |                 365                  |                                  Lifetime of the cookie in days                                  |
| **urlWhitelist**            | string[] |             Empty Array              |                       List of URLs on which no banner should be displayed                        |
| **consentAcceptStatusMsg**  |  string  | "Akzeptiert am %DATE% um %TIME% Uhr" |            Message that should be displayed to inform about the cookie consent status            |
| **consentDeclineStatusMsg** |  string  | "Abgelehnt am %DATE% um %TIME% Uhr"  |            Message that should be displayed to inform about the cookie consent status            |
| **noCookieStatusMsg**       |  string  |                 "-"                  |            Message that should be displayed to inform about the cookie consent status            |
| **dateFormat**              |  string  |              "dd.mm.yy"              |              Defines how to display date informations inside cookie consent status               |
| **timeFormat**              |  string  |               "hh:mm"                |              Defines how to display time informations inside cookie consent status               |
| **localeKey**               |  string  |                 "de"                 |                                     Language ISO-639-1 Code                                      |

Inside the `Cookie.View` element it is necessary to define a function with the following props (called RenderProps):

| Name                       |          Type           |                                Description                                |
| -------------------------- | :---------------------: | :-----------------------------------------------------------------------: |
| **handleAccept**           |       () => void        |                 Function to call on consent accept events                 |
| **handleDecline**          |       () => void        |                Function to call on consent decline events                 |
| **additionalAcceptProps**  | {["data-gtm"]: string;} | Object that contains package predefined props for consent accept element  |
| **additionalDeclineProps** | {["data-gtm"]: string;} | Object that contains package predefined props for consent decline element |

Subcomponents like `<Cookie.Icon src="..." />` or `<Cookie.Title>` can be used to build a basic cookie consent banner. For better fine tuning they can be modified or replaced by own components.

### Use as static native JavaScript library

For non-react projects it is possible to import the cookie consent banner as a single JavaScript file called `cookie-consent.min.js`. It can be found inside the repository folder `example-static`. To render the banner into the DOM you must provide a mount point element with the id `cookie-consent`. Additional properties can be defined as a JSON-Object inside a script tag.

```html
<div id="cookie-consent">
    <script type="text/json">
        {
            "zIndex": 1,
            "icon": "...",
            "title": "Verwendung von Cookies für Analyse- und Marketingzwecke"
        }
    </script>
</div>
```

In addition to the already in the React section mentioned properties the static version takes parameters to define content values:

| Name             |  Type  |           Default            |              Description               |
| ---------------- | :----: | :--------------------------: | :------------------------------------: |
| **icon**         | string |        "" (no image)         |           URL to icon image            |
| **title**        | string |        "" (no title)         |        Title text of the banner        |
| **text**         | string | "Wir verwenden Cookies, ..." |      Main body text of the banner      |
| **labelAccept**  | string |    "Cookies akzeptieren"     | Text of consent accept action element  |
| **labelDecline** | string |      "Cookies ablehnen"      | Text of consent decline action element |

## Date and Time formats

To show the date and time of the last cookie consent interaction inside the status message you can pass specific placeholders to the string. They are replaced with the values on runtime.

| Placeholder | Output                       |
| :---------- | :--------------------------- |
| **%NAME%**  | Name of the Cookie           |
| **%DATE%**  | Date of last cookie altering |
| **%TIME%**  | Time of last cookie altering |

The parameters `dateFormat` and `timeFormat` controlling the output of date and time:

| Format         | Output                            |    Example |
| -------------- | :-------------------------------- | ---------: |
| **dd.mm.yy**   | Day.Month.Year                    |   06.11.94 |
| **dd.mm.yy**   | Day.Month.Year                    |   06.11.94 |
| **dd.mm.yyyy** | Day.Month.FullYear                | 06.11.1994 |
| **DD.MM.YY**   | Day.Month.Year                    |   06.11.94 |
| **DD.MM.YYYY** | Day.Month.FullYear                | 06.11.1994 |
| **ddd**        | Week Day Short                    |        Mo. |
| **DDD**        | Week Day Short                    |        Mo. |
| **dddd**       | Week Day Long                     |     Montag |
| **DDDD**       | Week Day Long                     |     Montag |
| **mmm**        | Month Name Short                  |       Dez. |
| **MMM**        | Month Name Short                  |       Dez. |
| **mmmm**       | Month Name Long                   |   Dezember |
| **MMMM**       | Month Name Long                   |   Dezember |
| **hh:mm**      | Hours:Minutes                     |      18:35 |
| **hh:mm:ss**   | Hours:Minutes:Seconds             |   18:35:27 |
| **HH:MM:SS**   | Hours:Minutes:Seconds             |   18:35:27 |
| **hs:mm**      | Hours (12 hour time used with ap) |      07:44 |
| **HS:MM**      | Hours (12 hour time used with ap) |      07:44 |
| **ap**         | Ante or Post meridiem             |   am OR pm |
| **AP**         | Ante or Post meridiem             |   AM OR PM |

## Output Status message

To output the consent status message add the attribute `data-consent-status` to one or multiple DOM Elements. If you use the static banner version you must define the status element before the `cookie-consent.min.js` import.

```html
<div data-consent-status></div>
```

## Implement consent button

To reopen the cookie consent banner you can add the attribute `data-consent-button` to one or multiple DOM Elements. If you use the static banner version you must define this element before the `cookie-consent.min.js` import.

```html
<button data-consent-button>Open consent banner</button>
```

## Trigger cookie scripts

If the cookie consent has been accepted all script tags with the type `text/consent-banner-script` are loaded and afterwards attached to the end of the body. While the content inside the script tags due to the type was ignored the new attached scripts now changes to the correct javascript type `text/javascript`. The old placeholder script tags are removed afterwards from the DOM. If you use the static banner version you must define the script element before the `cookie-consent.min.js` import.

```html
<script type="text/consent-banner-script">
    console.log('b.ig brother is watching you! 👀');
</script>
```

## Styling

Both the react component and the static version use predefined style classes. They are defined in the `styles.css` file.

-   Styles for the react component are placed in `dist/index.css`
-   Styles for the static version are placed in `example-static/styles.css`

## License

MIT © [ic3m3n](https://github.com/ic3m3n)
