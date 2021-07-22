import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import {
  Categories,
  SortPopup,
  PizzaBlock,
  PizzaLoadingBlock,
} from '../components';
import { addPizzaToCart } from '../redux/cartReducer';
import { setCategory, setSortBy, toggleOrder } from '../redux/filtersReducer';

const categories = ['Все', 'Мясные', 'Вегетарианские', 'Острые', 'Закрытые'];
const sorts = [
  { type: 'rating', name: 'популярности' },
  { type: 'price', name: 'цене' },
  { type: 'name', name: 'алфавиту' },
];

function Home({ category, sortBy, order }) {
  const pizzas = useSelector((state) => state.pizzas.pizzas);
  const isLoaded = useSelector((state) => state.pizzas.isLoaded);
  const cartPizzas = useSelector((state) => state.cart.cartPizzas);
  const dispatch = useDispatch();

  const getInCartCount = (id) => {
    const keys = Object.keys(cartPizzas).filter((key) =>
      // без _ будут коллизии 1_ и 10_
      key.startsWith(`${id}_`)
    );

    return keys.reduce(
      (inCartCount, key) => inCartCount + cartPizzas[key].count,
      0
    );
  };

  return (
    <div className="container">
      <div className="content__top">
        <Categories
          categories={categories}
          activeCategory={category}
          onClickCategory={(i) => dispatch(setCategory(i))}
        />
        <SortPopup
          sorts={sorts}
          activeSortBy={sortBy}
          activeOrder={order}
          onClickSortBy={(i) => dispatch(setSortBy(i))}
          onClickOrder={() => dispatch(toggleOrder())}
        />
      </div>
      <h2 className="content__title">{categories[category + 1]} пиццы</h2>
      <div className="content__items">
        {isLoaded
          ? pizzas.map((pizza) => (
              <PizzaBlock
                key={pizza.id}
                pizza={pizza}
                inCartCount={getInCartCount(pizza.id)}
                onClickAddPizza={(pizzaObj) =>
                  dispatch(addPizzaToCart(pizzaObj))
                }
              />
            ))
          : Array(4).fill(<PizzaLoadingBlock />)}
      </div>
    </div>
  );
}

Home.propTypes = {
  category: PropTypes.number.isRequired,
  sortBy: PropTypes.string.isRequired,
  order: PropTypes.bool.isRequired,
};

export default Home;
