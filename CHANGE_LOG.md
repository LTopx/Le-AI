# L-GPT Change Log

## v0.5.1

> 2023-06-02

### Add

- Add a scheduled service to clear useless conversation shares older than 7 days.
- Adding a link to the [L-GPT documentation](https://docs.ltopx.com) for navigation.

### Fixed

- Fix the display issues of the API Key configuration page in Chinese and dark mode.
- Adding lang attribute resolves the problem of garbled preview images.

### Changed

- Adjust default display content when sharing a conversation without a title
- Combine share API routes

## v0.5.0

> 2023-05-30

### Add

- Added conversation sharing function

### Changed

- Move all Prisma variable definitions to .env.local
- Standardize the global logo style
- Multiple detailed optimizations
- Optimize the token consumption calculation logic for more extreme cases.

## v0.4.3

> 2023-05-28

### Fixed

- Fixed the issue where unauthenticated users could not have a normal conversation even after configuring the API key.
- Fix the text color issue for Select placeholder and the logic issue for disabled.
- Fixed the issue of losing the locale path when routing. Replaced next/navigation/useRouter with next-intl/client/useRouter.

### Changed

- Optimize login page UI
- Optimize the display effect of the user avatar when loading user information.
- Upgrade the default Azure OpenAI Service API version from 2023-03-15-preview to 2023-05-15.
- Refactor the calculation logic for session consumption, now supporting display of current session content consumption and total session consumption.
- Optimize UI effects of Select/Input/Modal/Slider/Button and other components
- Refactor the API Key configuration interface and move it to a separate page for configuration. It is now possible to configure Azure OpenAI Service-related information in a more user-friendly way.

## v0.4.2

> 2023-05-25

### Fixed

- Fix the bug of frequent database queries in session callback

### Add

- Add a feature to count conversation fees and allow users to view the current amount of USD or tokens consumed during the conversation.
- Improve Token and session introduction
- Access the Help and Feedback Platform at support.qq.com
- Added the ability to switch between using Enter and Command+Enter (Mac)/Ctrl+Enter (Windows) for inputting information.
- Display the current application version in the menu
- Click on the session title to modify the current session configuration

### Changed

- Optimize the copy and delete UI of the conversation list to simplify the operation steps.
- Adjust the login credential validity period to 3 days

## v0.4.1

> 2023-05-22

### Add

- Record the time of user information update and last activity time
- Keep the conversation avatar synchronized with the user avatar
- Support custom avatars

### Fixed

- Attempt to fix the bug "globalThis is not defined"
- Adjust the import position of the polyfill file to solve the problem of its ineffectiveness.

### Changed

- update readme.md
- Adjust and optimize the prompt for generating conversation titles. It can now better generate titles related to the conversation.

## v0.4.0

> 2023-05-21

### Fixed

- Fix the issue of being unable to log in when binding the same email to both GitHub and Google.

### Add

- Add account system
- Adding login guidance for users who are not logged in
- Multi-language configuration for login email sending page
- Display the language model currently in use on the conversation interface

### Changed

- UI optimization
- Cancel response immediately when switching channels if data is being requested or generated.
- Trying to solve: Issue of error log being reported when canceling fetch requests

## v0.3.0

> 2023-05-11

### Fixed

- Fix dark mode style issue with Dropdown component

### Add

- Support language switching
- Adding Custom 404 Page

### Changed

- Migration of Pages Router to App Router
- Change polyfill reference location
- Optimize markdown table style

## v0.2.1

> 2023-05-08

### Fixed

- Add findLastIndex Polyfill

### Add

- Allow reset all data (available in case of unexpected data errors or data format incompatibility caused by version updates)
- Support for data import and export

## v0.2.0

> 2023-05-07

### Fixed

- Fixed the issue of incorrect input box position caused by the vertical scroll bar appearing on some mobile browsers

### Add

- Introduce prompt words and prompt word templates

### Changed

- Refactor some pages and interaction logic
- Improve the error message content for front-end fetch requests

## v0.1.3

> 2023-04-28

### Fixed

- Fix the issue where clicking the clear button in Input does not clear the value

### Add

- Support Azure OpenAI Service

## v0.1.2

> 2023-04-27

### Fixed

- Fixed a bug where certain states would appear abnormal when modifying content on the settings page.

### Add

- Add the ability to configure max_tokens
- Add the ability to select a model

### Changed

- Prohibited zooming on mobile Safari browser.

## v0.1.1

> 2023-04-24

### Add

- Chat conversations support right-click menu for copying and deleting.
- Conversation channels support right-click menu for pinning and deleting.
- Added custom polyfill to resolve excessive error collection in Sentry.
- Added configurable temperature feature.

### Changed

- Proxy address now compatible with both trailing slash and non-trailing slash.

## v0.1.0

> 2023-04-23

### Changed

- Adjust global CSS and use as many tailwind built-in CSS values as possible to optimize some color matching effects.
- Refactor all common components with radix-ui.

## v0.0.5

> 2023-04-20

### Fixed

- Replace structureClone with JSON.parse(JSON.stringify()) to solve compatibility issues on some old devices

### Add

- Add @vercel/analytics

### Changed

- Adjust the autofocus logic of the Modal component
- Adjust the styles of select and Modal to better support dark mode
- Adjust multiple global styles to enhance the details of dark mode
- Add error prompts for some error cases

## v0.0.4

> 2023-04-19

### Fixed

- Fixing the placeholder error in the settings page input box and addressing the issue with missing language configurations.
- When change the channel and the list do not scroll to bottom

### Add

- Introducing Sentry to perform error log detection
- Support dark mode(90%)
- Introducing @radix-ui/react-select to build Select Component

### Changed

- Introducing @radix-ui/react-dialog to enhance the interactive effect of the Modal Component
- Change the rule of NEXT_PUBLIC_OPENAI_API_KEY and NEXT_PUBLIC_OPENAI_API_PROXY

## v0.0.3

> 2023-04-18

### Fixed

- Prevents changing the session title when OpenAI Key is not configured

### Add

- Support for modifying conversation titles.
- Added the function to clear all conversations.
- Support for deleting and undoing conversation content.
- Introducing @radix-ui/react-alert-dialog to enhance the interactive effect of the confirm event

## v0.0.2

> 2023-04-17

### Fixed

- pnpm-locl.yaml bug
- @types/math-random bug

### Add

- Add en/cn language support
- Add clear current conversation
- Support setting your own proxy url
