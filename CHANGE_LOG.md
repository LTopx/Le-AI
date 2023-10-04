# Le-AI Change Log

## v0.9.3

> 2023-09-27

### Fixed

- Fix the issue where the pop-up window under the avatar dropdown menu cannot be displayed properly.
- Fix the issue where metadata image cannot be displayed properly.

## v0.9.2

> 2023-09-27

### Add

- Support Docker deployment, [#15](https://github.com/LTopx/Le-AI/pull/15)
- Added support for configuring a member threshold for session summarization to achieve the effect of "unlimited sessions"
- "Session Settings" added support for configuring the threshold of message compression for historical messages.

### Fixed

- Fix avatar UI display error issue
- Fix configuration error in .env.local.demo file
- Fix multiple language configuration errors
- Fix the issue of parsing error in react-markdown caused by upgrading remark-gfm version
- Fix the display effect of the loading icon during session loading
- Fix the error of missing default time zone for next-intl
- Fix the issue where the system settings menu cannot be opened properly in some cases
- Fixed [#10](https://github.com/LTopx/Le-AI/issues/10)

### Changed

- Reconstruct some page module UI and migrate to shadcn/ui
- Adjust the proxy configuration logic for OpenAI API Key, fix [#11](https://github.com/LTopx/Le-AI/issues/11)
- Disable voice playback during conversation loading.
- Adjust the timeout time of Serverless Functions to 5 minutes.
- Adjust account center UI interface.

## v0.9.1

> 2023-09-11

### Fixed

- Fixed the issue of incorrect authentication logic after configuring a custom API Key when deploying a project
- Fixed the issue of garbled characters in some cases when replying
- Fixed [#8](https://github.com/LTopx/Le-AI/issues/8)
- Fixed the issue of incorrect background image display on the email login page
- Fix the issue of character creation prompt and welcome message word limit

### Add

- Support for account/password login
- Added a return to home button on the API Key configuration page
- Added privacy agreement and login guide to the login interface.
- Compatible with configuring other third-party OpenAI API Keys. For example: nextweb, API2D, and so on.

### Changed

- Update Azure OpenAI API Version to 2023-08-01-preview
- Adjust the UI of the left bottom menu in the system
- Refactor the UI of the pop-up box for creating a new character
- Adjust the implementation logic of prompt, messages parameters, all parsed and assembled by the front end

## v0.9.0

> 2023-09-02

### Fixed

- Fixed the issue of being unable to use when not logged in but configured with an API KEY
- Fixing invalid links.
- Fixing the cross-domain issue with the chatgpt interface.
- Fixing the issue of missing metadataBase.
- Fixed the redirect link issue for OpenRouter Key.
- Fixing the issue of not carrying cross-domain headers when requesting an error.
- Fixed the style issue with the Table on the token page.
- Fixed: issue of missing metadataBase and env variable [#6](https://github.com/LTopx/Le-AI/issues/6)

### Add

- Added support for Windows and Mac Beta clients.
- Added support for one-click session clearing
- Added logic and database table construction for token management page
- Added important announcement prompt in the left-side menu
- Self-built token integration logic for OpenAI, Azure OpenAI, and OpenRouter interfaces
- Added support for configuring Le-AI API Key
- Introduced shadcn/ui to optimize the style of some components
- Added support for Traditional Chinese

### Changed

- Adjust the project name: L-GPT => Le-AI
- Adjust all the copy and related links within the project regarding L-GPT.
- Adjusted some code structure
- Add the Le-AI API Key to the logic for determining whether the key is configured.
- Adjusted the user credential expiration time to 14 days.
- Refactor and streamline global multilingual configuration.
- Refactor the login interface UI.
- Adjusted the permissions of some models in OpenRouter.

## v0.8.4

> 2023-08-19

### Add

- Support for configuring welcome messages has been added to the character template, serving as the default first sentence of a conversation.
- Add privacy policy and contact information.
- Added cloud synchronization function, which can synchronize conversation content to the cloud for easy synchronization between different devices.

### Changed

- Support for importing and exporting configurations of OpenRouter.
- Adjust the layout of the bottom left menu.
- Adjust the model permissions provided by OpenRouter to free.
- Adjust the cloud backup quota, free users can back up 50KB of data.

## v0.8.3

> 2023-08-13

### Fixed

- Fixed mobile session content obscuring the bottom input box
- Refactored function calling invocation logic and fixed bugs
- Fixed the "drift" of the drop-down selection box when selecting a new session model
- Fix the issue of squeezed avatars in the conversation list.

### Add

- Added function calling support
- Added plugin system
- Added support for Google search, which can call the Google API to search and return results when encountering problems that exceed the AI model training date
- Introduced OpenRouter to support Claude, PaLM2, Llama 2 and other models

### Changed

- Adjusted the text input box for editing chat content to Textarea
- Replaced Google search with [Serper API](https://serper.dev/), which is easier to configure
- All models use openai gpt-3.5-turbo to get conversation titles, saving token consumption
- When using the models provided by OpenRouter, the plugins are hidden because they do not support plugins at this time

## v0.8.2

> 2023-08-07

### Fixed

- Fixed the problem that AUTH_SECRET may be missing in the production environment

### Add

- Added support for Azure GPT-4/GPT-4-32K
- Added error message prompt when NEXT_PUBLIC_AZURE_OPENAI_RESOURCE_NAME is not configured

### Changed

- Adjust the environment variable configuration and related code logic, now you can deploy with one click without any environment variables
- Adjust readme documentation
- Adjust the environment variable sample document .env.local.demo

## v0.8.1

> 2023-08-03

### Fixed

- Fixed the issue of not being able to pop up error messages when re-generating conversations fails

### Add

- Added AI Characters template function, built-in some common templates
- AI character template has added a new customization feature, allowing users to customize and use templates according to their preferences.
- Support for importing prompts in the form of url parameters
- Added the ability to collect AI character templates
- Added more AI character templates
- Added import and export functions for AI character templates
- Added support for editing chat content
- Added text prompt information to the conversation content operation button area
- Added project logo
- Added opengraph-image and twitter-image

### Changed

- Adjust the gpt-tokens calculation module, now able to correctly calculate all token consumption
- Adjust the registration policy, now users will receive 10000 points upon registration
- Optimize the display effect of the AI character template pop-up window
- Adjust zustand api in accordance with official documentation
- Replace some Input to Textarea

## v0.8.0

> 2023-07-23

### Add

- Added the introduction of @ltopx/lx-ui component library to further unify the global style.

### Fixed

- Fixed the problem of incorrect deduction of fees under different models (previously, a lot of fees were deducted).

### Changed

- Remove @vercel/analytics
- Remove sentry
- Temporarily remove prompt market, refactor and go online before next weekend
- Refactor most of the logic related to zustand status, greatly reduce the number of renders, and improve the overall performance.
- Replace plausible with umami for monitoring

## v0.7.4

> 2023-07-04

### Add

- Add a toggle menu button for the account center interface on mobile devices.

## v0.7.3

> 2023-07-04

### Fixed

- Fix Select component display bug

### Add

- Added support for Azure for the 0613 and 0613-16K models
- Add support for viewing token consumption details
- Add an input box to display the language model currently used in the session at the top
- Add the function of setting the maximum length of context carried in a session
- Add a "New Conversation" shortcut button at the top of the input box
- Add Plausible Analytics tracking and replace Vercel Analytics

### Changed

- Adjust layout of top buttons in input field
- Non-Premium members can only create a maximum of 10 sessions (Premium).
- Upgrade Azure API version to 2023-06-01-preview
- Optimize the avatar icons in the conversation list to display according to the currently used language model.

## v0.7.2

> 2023-06-30

### Fixed

- Fixed bug of missing bufferutil and utf-8-validate after importing azure tts locally
- Fixed issue of mistakenly referencing client code in the service side
- Fix bug for Azure TTS play and pause controls

### Add

- Use the language model previously selected by the user when creating a new conversation.
- Add global initialization loading
- Azure TTS adds an automatic playback option (Premium)

### Changed

- Refactor scrolling list module, optimize performance
- Remove unnecessary features to improve performance.
- Optimize UI details and unify global icon styles. Replace react-icons with MingCute Icon.
- Optimize OpenAI/Azure API to return error messages in a more user-friendly format
- Upgrade gpt-tokens dependency

## v0.7.1

> 2023-06-28

### Add

- Added the global variable CRON_SECRET for secure verification of scheduled tasks.
- Added Azure TTS feature, supporting conversion of conversation replies into voice (Premium).

### Changed

- Optimize the logic of initial user information retrieval: do not retrieve user information for unauthenticated users.
- Improve the display of error messages returned by OpenAI
- Optimize some internationalization content
- Optimized some UI details
- Optimized the code logic for sending conversation messages and refactored the logic for "regenerating" conversations

## v0.7.0

> 2023-06-21

### Fixed

- Fixed the problem of polyfill not working, ensuring that it is loaded on the client
- Fixed the issue where the permissions of advanced users changed incorrectly when they were on a free trial.

### Add

- Added Premium feature to support author's future development
- Added support for Token recharge to unlock more session quotas
- Added activation guide
- Guidance when there is insufficient Token for adding: Start Free Trial or Recharge Token
- Added token allocation details for Free trial and Premium
- Added daily scheduled task to calculate token consumption
- Add promotion codes for Product Hunt/Twitter platforms

### Changed

- Move the activation of the license key to the left menu for better visibility
- Optimize clipboard usage

## v0.6.2

> 2023-06-15

### Fixed

- Fix the issue where the page displays incorrectly when clicking Cancel during Github login [#2](https://github.com/LTopx/Le-AI/issues/2)

### Add

- Complete all the models that were added previously

## v0.6.1

> 2023-06-14

### Fixed

- Change the backend token calculation to asynchronous, otherwise it will cause inaccurate calculations.
- Fixed the issue of incorrect calculation of sorting method for menu items on top.

### Add

- Added backend capability to calculate token consumption
- Display the total amount of tokens currently consumed at the menu.
- Added support for multiple simultaneous conversations, switching sessions will not break the connection of the current session.
- Added support for the newly updated model from OpenAI: gpt-3.5-turbo-0613/gpt-3.5-turbo-16k
- Added support for importing and exporting local prompts in the settings pop-up.

### Changed

- Optimized the front-end logic for calculating tokens, now able to correctly calculate all token consumption.
- Significant code and interaction detail optimizations

## v0.6.0

> 2023-06-10

### Add

- Add Prompt Market
- Restore "prompt" to default function button on the homepage

### Fixed

- Fixed the issue on mobile where the default prompt was not being included when creating a new session in the menu.
- Fix the display issue of the homepage prompt when it is too long

### Changed

- Optimized the display effect when the username is missing.
- Numerous other minor optimizations.
- Optimize UI details for prompt and Prompt Market

## v0.5.3

> 2023-06-06

### Add

- Added interfaces written specifically for the client, currently supporting only passing one's own key to implement dialogue.
- Add cross-origin support to the API to facilitate cross-domain calls from the client.

### Changed

- Optimize the implementation of UI components

## v0.5.2

> 2023-06-03

### Fixed

- Fixed the issue of packaging errors when upgrading to next 13.4.4
- Attempted to fix the issue of not-found pages not working

### Add

- Added various guide links to navigate to document projects

### Changed

- Continue to optimize the interface error message for API requests. Now, it is possible to correctly see error messages for session text that is too long.
- Optimize the email style sent during login verification

## v0.5.1

> 2023-06-02

### Add

- Add a scheduled service to clear useless conversation shares older than 7 days.
- Adding a link to the [Le-AI documentation](https://docs.le-ai.app) for navigation.

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
