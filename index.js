import React from 'react'
import { AppRegistry } from 'react-native';
import App from './src/App';

// for WatermelonDB, resolve cannot find variable: Symbol
import 'es6-symbol/implement'

// // Watermelon imports
// import { Database } from '@nozbe/watermelondb';
// import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
// import { mySchema } from './src/models/schema';
// import User from './src/models/User';
// import Workouts from './src/models/Workouts';

// redux
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import rootReducer from './src/reducers';
import thunk from 'redux-thunk';

// Amplify: connect the app to your configured AWS services
import aws_exports from './src/aws-exports';
import Amplify from 'aws-amplify';

Amplify.configure(aws_exports);

// // Create adapter to underlying database
// const adapter = new SQLiteAdapter({
//     schema: mySchema,
// })
//
// const database = new Database({
//     adapter,
//     modelClasses: [
//         User,
//         Workouts,
//     ],
// })

// const reducer = combineReducers({ rootReducer, database })
// const store = createStore(reducer, applyMiddleware(thunk))
const store = createStore(rootReducer, applyMiddleware(thunk))


// App
const ReduxApp = () => (
    <Provider store={store}>
        <App />
    </Provider>
)

AppRegistry.registerComponent('fitpower', () => ReduxApp)