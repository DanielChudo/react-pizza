import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

function Categories({ categories, activeCategory, onClickCategory }) {
  return (
    <div className="categories">
      <ul>
        {categories.map((name, i) => (
          <li
            key={name}
            className={cn({ active: activeCategory === i - 1 })}
            onClick={() => onClickCategory(i - 1)}
          >
            {name}
          </li>
        ))}
      </ul>
    </div>
  );
}

Categories.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  activeCategory: PropTypes.number.isRequired,
  onClickCategory: PropTypes.func.isRequired,
};

export default Categories;
