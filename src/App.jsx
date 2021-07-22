import React, { useEffect } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Header } from './components';
import { Home, Cart } from './pages';
import { requestPizzas } from './redux/pizzasReducer';

function App() {
  const category = useSelector((state) => state.filters.category);
  const sortBy = useSelector((state) => state.filters.sortBy);
  const order = useSelector((state) => state.filters.order);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(requestPizzas(category, sortBy, order));
  }, [category, sortBy, order]);

  return (
    <div className="wrapper">
      <Header />
      <div className="content">
        <Switch>
          <Route exact path="/">
            <Home category={category} sortBy={sortBy} order={order} />
          </Route>
          <Route exact path="/cart">
            <Cart />
          </Route>
          <Redirect to="/" />
        </Switch>
      </div>
    </div>
  );
}

export default App;
