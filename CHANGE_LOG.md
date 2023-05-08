# L-GPT Change Log

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
