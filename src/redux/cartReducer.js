import produce from 'immer';

const ADD_PIZZA_TO_CART = 'ADD_PIZZA_TO_CART';
const CLEAR_CART = 'CLEAR_CART';
const REMOVE_CART_PIZZA = 'REMOVE_CART_PIZZA';
const MINUS_CART_PIZZA = 'MINUS_CART_PIZZA';

const initialState = {
  cartPizzas: {},
  totalPrice: 0,
  totalCount: 0,
};

const cartReducer = produce((draft, action) => {
  let pizzaId, price;

  switch (action.type) {
    case ADD_PIZZA_TO_CART:
      const { id, type, size } = action.payload;
      pizzaId = `${id}_${size}_${type}`;

      if (draft.cartPizzas[pizzaId]) {
        draft.cartPizzas[pizzaId].count++;
      } else {
        draft.cartPizzas[pizzaId] = { data: action.payload, count: 1 };
      }

      draft.totalPrice += action.payload.price;
      draft.totalCount++;
      break;
    case MINUS_CART_PIZZA:
      pizzaId = action.payload;
      price = draft.cartPizzas[pizzaId].data.price;

      if (draft.cartPizzas[pizzaId].count > 1) {
        draft.cartPizzas[pizzaId].count--;
        draft.totalPrice -= price;
        draft.totalCount--;
        break;
      }
    // falls through
    case REMOVE_CART_PIZZA:
      pizzaId = action.payload;
      price = draft.cartPizzas[pizzaId].data.price;
      const { count } = draft.cartPizzas[pizzaId];

      delete draft.cartPizzas[pizzaId];
      draft.totalPrice -= price * count;
      draft.totalCount -= count;
      break;
    case CLEAR_CART:
      return initialState;
    default:
      break;
  }
}, initialState);

export function addPizzaToCart(pizza) {
  return {
    type: ADD_PIZZA_TO_CART,
    payload: pizza,
  };
}

export function clearCart() {
  return {
    type: CLEAR_CART,
  };
}

export function minusCartPizza(pizzaId) {
  return {
    type: MINUS_CART_PIZZA,
    payload: pizzaId,
  };
}

export function removeCartPizza(pizzaId) {
  return {
    type: REMOVE_CART_PIZZA,
    payload: pizzaId,
  };
}

export default cartReducer;
