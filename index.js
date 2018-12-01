import React from 'react'
import { AppRegistry } from 'react-native';
import App from './src/App';

// resolve cannot find variable: Symbol
import 'es6-symbol/implement'

// redux
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import rootReducer from './src/reducers';
import thunk from 'redux-thunk';

// Amplify: connect the app to your configured AWS services
import aws_exports from './src/aws-exports';
import Amplify from 'aws-amplify';

Amplify.configure(aws_exports);

const store = createStore(rootReducer, applyMiddleware(thunk))


// App
const ReduxApp = () => (
    <Provider store={store}>
        <App />
    </Provider>
)

AppRegistry.registerComponent('fitpower', () => ReduxApp)