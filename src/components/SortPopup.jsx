import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

function SortPopup({
  sorts,
  activeSortBy,
  activeOrder,
  onClickSortBy,
  onClickOrder,
}) {
  const [isPopupVisible, togglePopupVisibility] = useState(false);
  const sortByRef = useRef(null);
  const sortOrderRef = useRef(null);

  const handleOutsideClick = (e) => {
    if (e.target !== sortByRef.current) {
      togglePopupVisibility(false);
    }
    if (e.target === sortOrderRef.current) {
      onClickOrder();
    }
  };

  useEffect(() => {
    document.body.addEventListener('click', handleOutsideClick);

    return () => document.body.removeEventListener('click', handleOutsideClick);
  }, []);

  return (
    <div className="sort">
      <div className="sort__label">
        <svg
          className={cn({ rotated: isPopupVisible })}
          width="10"
          height="6"
          viewBox="0 0 10 6"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10 5C10 5.16927 9.93815 5.31576 9.81445 5.43945C9.69075 5.56315 9.54427 5.625 9.375 5.625H0.625C0.455729 5.625 0.309245 5.56315 0.185547 5.43945C0.061849 5.31576 0 5.16927 0 5C0 4.83073 0.061849 4.68424 0.185547 4.56055L4.56055 0.185547C4.68424 0.061849 4.83073 0 5 0C5.16927 0 5.31576 0.061849 5.43945 0.185547L9.81445 4.56055C9.93815 4.68424 10 4.83073 10 5Z"
            fill="#2C2C2C"
          />
        </svg>
        <b>Сортировка по:</b>
        <div>
          <span
            ref={sortByRef}
            onClick={() => togglePopupVisibility((prevState) => !prevState)}
          >
            {sorts.find((s) => s.type === activeSortBy).name}
          </span>
          {isPopupVisible && (
            <div className="sort__popup">
              <ul>
                {sorts.map((sort) => (
                  <li
                    key={sort.type}
                    className={cn({ active: activeSortBy === sort.type })}
                    onClick={() => onClickSortBy(sort.type)}
                  >
                    {sort.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <span
          className="sort__order"
          ref={sortOrderRef}
          onClick={() =>
            togglePopupVisibility((prevVisibility) => !prevVisibility)
          }
        >
          {activeOrder ? 'по убыванию' : 'по возрастанию'}
        </span>
      </div>
    </div>
  );
}

SortPopup.propTypes = {
  sorts: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  activeSortBy: PropTypes.string.isRequired,
  activeOrder: PropTypes.bool.isRequired,
  onClickSortBy: PropTypes.func.isRequired,
  onClickOrder: PropTypes.func.isRequired,
};

export default SortPopup;
