# ui-src

## Session Timeouts

To follow the CMS Acceptable Risk Safeguards(ARS) controls `AC-11 Idle Session Timeout` and `AC-12(03) Timeout Warning Message`, this service uses the (`react-idle-timer`)[https://idletimer.dev/] package to implement an idle timer. The idle timer is defined as a React component that is child of the `App` component and accepts the following props:

- `handleLogout` (function): the function that performs session logout of the current user
- `timeout` (number): the amount of idle time after which the 'Session Timeout' warning prompt will be displayed. Defaults to 15 minutes, as defined by AC-11.
- `promptTimeout` (number): after displaying the 'Session Timeout' prompt, the amount of time after which the user will be automatically logged out. The user can override this manually by closing the prompt. Defaults to 10 seconds.

The `timeout` prop is customizable, but should follow the security requirements for the system.

## Create React App documentation

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved [here](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved [here](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved [here](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved [here](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved [here](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved [here](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
