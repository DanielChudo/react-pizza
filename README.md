# React pizza

Сайт вымышленной пиццерии был создан на базе курса "Archakov Blog" (10 частей с хронометражом ~25 часов) и изображений с сайта "Додо Пицца". Опыт разработки сайтов на реакте у меня уже имелся, поэтому просмотр велся на скорости x3 с написанием собственного кода и последующего сравнения с авторским.

В итоге я оптимизировал некоторые фрагменты кода и переписал логику работы корзины и местной структуры данных. Примеры изначального оверинженеринга лежат в конце текста.

## Технологии, библиотеки, расширения

- React
- Redux
- Redux Thunk
- ImmerJS
- React Router
- Classnames
- PropTypes
- JSON-server
- SCSS
- ESLint + airbnb-config
- Prettier

## Самостоятельный запуск

Запуск клиентской части по адресу [http://localhost:3000](http://localhost:3000)

```yarn
yarn start
```

Запуск фейкового сервера по адресу [http://localhost:3001](http://localhost:3001)

```yarn
yarn server
```

## Исправление оверинженеринга

Из-за сложной структуры хранения позиций в оригинальном проекте, автор запутался и не смог вывести в корзине раздельно одинаковые пиццы, но с различными диаметрами/типами теста. Еще автором не предусматривалось, что пицца может находиться одновременно в нескольких категориях (цыпленок барбекю - мясная и острая). Обе проблемы были исправлены:

![Корзина](https://i.ibb.co/tJMkHF7/cart-Screen.png)

---

Нельзя было удалить полностью позицию из списка через уменьшение количества пицц (решилось элегантно через switch-case fall-through).

Было:

```js
case 'MINUS_CART_ITEM': {
  const oldItems = state.items[action.payload].items;
  const newObjItems =
    oldItems.length > 1 ? state.items[action.payload].items.slice(1) : oldItems;
  const newItems = {
    ...state.items,
    [action.payload]: {
      items: newObjItems,
      totalPrice: getTotalPrice(newObjItems),
    },
  };

  const totalCount = getTotalSum(newItems, 'items.length');
  const totalPrice = getTotalSum(newItems, 'totalPrice');

  return {
    ...state,
    items: newItems,
    totalCount,
    totalPrice,
  };
}
```

Стало:

```js
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
  const count = draft.cartPizzas[pizzaId].count;

  delete draft.cartPizzas[pizzaId];
  draft.totalPrice -= price * count;
  draft.totalCount -= count;
  break;
```

---

Подсчёт текущей суммы и количества пицц был реализован слабочитаемым методом постоянного перебора абсолютно всех элементов в корзине, вместо банального прибавления цены новой пиццы к общей стоимости товаров и инкрементирования счётчика продуктов.

Было:

```js
const getTotalPrice = (arr) => arr.reduce((sum, obj) => obj.price + sum, 0);

const _get = (obj, path) => {
  const [firstKey, ...keys] = path.split('.');
  return keys.reduce((val, key) => {
    return val[key];
  }, obj[firstKey]);
};

const getTotalSum = (obj, path) => {
  return Object.values(obj).reduce((sum, obj) => {
    const value = _get(obj, path);
    return sum + value;
  }, 0);
};

const cart = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_PIZZA_CART': {
      const currentPizzaItems = !state.items[action.payload.id]
        ? [action.payload]
        : [...state.items[action.payload.id].items, action.payload];

      const newItems = {
        ...state.items,
        [action.payload.id]: {
          items: currentPizzaItems,
          totalPrice: getTotalPrice(currentPizzaItems),
        },
      };

      const totalCount = getTotalSum(newItems, 'items.length');
      const totalPrice = getTotalSum(newItems, 'totalPrice');

      return {
        ...state,
        items: newItems,
        totalCount,
        totalPrice,
      };
    }
    default:
      return state;
  }
};
```

Стало:

```js
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
    default:
      break;
  }
}, initialState);
```

---

В исходном коде отсутствует сброс поставленных слушателей, что приводит к их множественному повторному подсоединению при каждом переходе на главную страницу.

Было:

```js
useEffect(() => {
  document.body.addEventListener('click', handleOutsideClick);
}, []);
```

Стало:

```js
useEffect(() => {
  document.body.addEventListener('click', handleOutsideClick);

  return () => document.body.removeEventListener('click', handleOutsideClick);
}, []);
```

---

Использовался анти-паттерн, связанный с изменением локального стейта напрямую, а не через предыдущее значение + некорректный нейминг.

Было:

```js
const [visiblePopup, setVisiblePopup] = React.useState(false);
() => setVisiblePopup(!visiblePopup);
```

Стало:

```js
const [isPopupVisible, togglePopupVisibility] = useState(false);
() => togglePopupVisibility((prevVisibility) => !prevVisibility);
```
