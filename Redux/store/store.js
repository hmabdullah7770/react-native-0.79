import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '../reducer/index'; // or reducer if you have only one
import authrootSaga from '../saga/Auth';
import staterootSaga from '../saga/states';
import createSagaMiddleware from 'redux-saga';

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: rootReducer, // or just reducer: yourReducer if you only have one
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(sagaMiddleware), // Correct middleware setup
});

sagaMiddleware.run(authrootSaga);
sagaMiddleware.run(staterootSaga);

export default store;





// import { createStore, applyMiddleware } from 'redux';
// import rootReducer from '../reducers/index';
// import authrootSaga from '../saga/Auth';
// import staterootSaga from '../saga/states'
// import createSagaMiddleware from 'redux-saga';

// const sagaMiddleware = createSagaMiddleware();
// const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));

// sagaMiddleware.run(authrootSaga);
// sagaMiddleware.run(staterootSaga);
// export default store;
