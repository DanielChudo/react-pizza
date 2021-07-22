const SET_PIZZAS = 'SET_PIZZAS';
const SET_IS_LOADED = 'SET_IS_LOADED';

const initialState = {
  pizzas: [],
  isLoaded: false,
};

function pizzasReducer(state = initialState, action) {
  switch (action.type) {
    case SET_PIZZAS:
      return { ...state, pizzas: action.payload };
    case SET_IS_LOADED:
      return { ...state, isLoaded: action.payload };
    default:
      return state;
  }
}

export function setPizzas(pizzas) {
  return {
    type: SET_PIZZAS,
    payload: pizzas,
  };
}

export function setIsLoaded(isLoaded) {
  return {
    type: SET_IS_LOADED,
    payload: isLoaded,
  };
}

export const requestPizzas = (category, sortBy, order) => async (dispatch) => {
  dispatch(setIsLoaded(false));
  // иначе в базе будет поиск пицц с категорией -1
  category = category === -1 ? '' : category;
  order = order ? 'desc' : 'asc';
  const response = await fetch(
    `/pizzas?${new URLSearchParams({
      category_like: category,
      _sort: sortBy,
      _order: order,
    })}`
  );
  const pizzasJson = await response.json();
  dispatch(setPizzas(pizzasJson));
  dispatch(setIsLoaded(true));
};

export default pizzasReducer;
