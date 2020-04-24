import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import { uiStateReducer, veggieCheckerReducer } from '../features/veggiemeter/veggieSlice';

export default configureStore({
  reducer: {
    counter: counterReducer,
    uiState: uiStateReducer,
    checks: veggieCheckerReducer,
  },
});
