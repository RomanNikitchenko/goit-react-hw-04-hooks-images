import { useState } from 'react';
import s from './searchar.module.css';
import { ReactComponent as AddIcon } from '../../Icons/search-2.svg';
import PropTypes from 'prop-types';

const Searchbar = ({ onSubmit }) => {
  const [imagesName, setImagesName] = useState('');

  const handleNameChange = e => {
    setImagesName(e.currentTarget.value.toLowerCase());
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (imagesName.trim() === '') {
      alert('введите имя изображения');
      return;
    }

    onSubmit(imagesName);
  };

  return (
    <header className={s.Searchbar}>
      <form className={s.SearchForm} onSubmit={handleSubmit}>
        <button className={s.SearchFormButton} type="submit">
          <AddIcon />
          <span className={s.SearchFormButtonLabel}>Search</span>
        </button>

        <input
          className={s.SearchFormInput}
          type="text"
          placeholder="Search images and photos"
          onChange={handleNameChange}
          value={imagesName}
        />
      </form>
    </header>
  );
};

Searchbar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default Searchbar;
