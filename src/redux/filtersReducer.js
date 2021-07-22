const SET_SORT_BY = 'SET_SORT_BY';
const SET_CATEGORY = 'SET_CATEGORY';
const SET_ORDER = 'SET_ORDER';

const initialState = {
  // -1 = все категории
  category: -1,
  sortBy: 'rating',
  // true = desc, false - asc
  order: true,
};

function filtersReducer(state = initialState, action) {
  switch (action.type) {
    case SET_SORT_BY:
      return { ...state, sortBy: action.payload };
    case SET_CATEGORY:
      return { ...state, category: action.payload };
    case SET_ORDER:
      return { ...state, order: !state.order };
    default:
      return state;
  }
}

export function setCategory(category) {
  return {
    type: SET_CATEGORY,
    payload: category,
  };
}

export function setSortBy(sortBy) {
  return {
    type: SET_SORT_BY,
    payload: sortBy,
  };
}

export function toggleOrder() {
  return {
    type: SET_ORDER,
  };
}

export default filtersReducer;
