import React, { useState } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

function PizzaBlock({ pizza, inCartCount, onClickAddPizza }) {
  const { id, name, imageUrl, price, types, sizes } = pizza;
  const doughTypes = ['тонкое', 'традиционное'];
  const pizzaSizes = [26, 30, 40];
  const [activeType, setActiveType] = useState(types[0]);
  const [activeSize, setActiveSize] = useState(sizes[0]);

  return (
    <div className="pizza-block">
      <img className="pizza-block__image" src={imageUrl} alt={name} />
      <h4 className="pizza-block__title">{name}</h4>
      <div className="pizza-block__selector">
        <ul>
          {doughTypes.map((type, i) => (
            <li
              key={type}
              onClick={() => setActiveType(i)}
              className={cn({
                active: activeType === i,
                disabled: !types.includes(i),
              })}
            >
              {type}
            </li>
          ))}
        </ul>
        <ul>
          {pizzaSizes.map((size) => (
            <li
              key={size}
              onClick={() => setActiveSize(size)}
              className={cn({
                active: activeSize === size,
                disabled: !sizes.includes(size),
              })}
            >
              {size} см.
            </li>
          ))}
        </ul>
      </div>
      <div className="pizza-block__bottom">
        <div className="pizza-block__price">{price} ₽</div>
        <button
          type="button"
          onClick={() =>
            onClickAddPizza({
              id,
              name,
              imageUrl,
              price,
              type: doughTypes[activeType],
              size: activeSize,
            })
          }
          className="button button--outline button--add"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.8 4.8H7.2V1.2C7.2 0.5373 6.6627 0 6 0C5.3373 0 4.8 0.5373 4.8 1.2V4.8H1.2C0.5373 4.8 0 5.3373 0 6C0 6.6627 0.5373 7.2 1.2 7.2H4.8V10.8C4.8 11.4627 5.3373 12 6 12C6.6627 12 7.2 11.4627 7.2 10.8V7.2H10.8C11.4627 7.2 12 6.6627 12 6C12 5.3373 11.4627 4.8 10.8 4.8Z"
              fill="white"
            />
          </svg>
          <span>Добавить</span>
          {
            // inCartCount может быть равен нулю
            !!inCartCount && <i>{inCartCount}</i>
          }
        </button>
      </div>
    </div>
  );
}

PizzaBlock.propTypes = {
  pizza: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    types: PropTypes.arrayOf(PropTypes.number).isRequired,
    sizes: PropTypes.arrayOf(PropTypes.number).isRequired,
  }).isRequired,
  onClickAddPizza: PropTypes.func.isRequired,
  inCartCount: PropTypes.number.isRequired,
};

export default PizzaBlock;
