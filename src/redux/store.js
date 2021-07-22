import { combineReducers, compose, createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import filtersReducer from './filtersReducer';
import pizzasReducer from './pizzasReducer';
import cartReducer from './cartReducer';

const reducers = combineReducers({
  filters: filtersReducer,
  pizzas: pizzasReducer,
  cart: cartReducer,
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  reducers,
  composeEnhancers(applyMiddleware(thunkMiddleware))
);

export default store;
