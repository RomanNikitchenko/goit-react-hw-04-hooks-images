import { useState, useEffect } from 'react';
import Searchbar from './Searchbar/Searchbar';
import Button from './Button/Button';
import imagesAPI from '../services/images-api';
import s from './app.module.css';
import ImageGallery from './ImageGallery/ImageGallery';
import ImageGalleryItem from './ImageGalleryItem/ImageGalleryItem';
import ImagesItem from './ImagesItem/ImagesItem';
import ImagePendingView from './Loader/Loader';
import Modal from './Modal/Modal';

const App = () => {
  const [images, setImages] = useState([]);
  const [imagesName, setImagesName] = useState('');
  const [page, setPage] = useState(1);
  const [openButton, setOpenButton] = useState(false);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);
  const [totalHits, setTotalHits] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [largeImageURL, setLargeImageURL] = useState('');
  const [alt, setAlt] = useState('');



  useEffect(() => {
    if (!imagesName) {
      return;
    }

    if (page === 1) {
      setStatus('pending');
      setOpenButton(false);
    }

    imagesAPI
      .fetchImages(imagesName, 12, page)
      .then(images => {
        if (!images.hits.length) {
          setOpenButton(false);
          setStatus('repeat');
          return;
        }

        if (page === 1) {
          setImages([...images.hits]);
          setOpenButton(true);
          setStatus('resolved');
          setTotalHits(images.totalHits);
          return;
        }

        if (page > 1) {
          setImages(prevImages => [...prevImages, ...images.hits]);
          setStatus('resolved');
          setOpenButton(true);
          setLoading(false);
          return;
        }
      })
      .catch(error => {
        setError(error);
        setStatus('rejected');
      });
    
  }, [imagesName, page]);

  const handleFormSubmit = imagesName => {
    setImagesName(imagesName);
    setPage(1);
  };

  const handlPageButton = () => {
    setPage(prevPage => prevPage + 1);
    setLoading(true);
  };

  const handlChangeModalImage = (largeImageURL = '', tags = '') => {
    setShowModal(!showModal);
    setLargeImageURL(largeImageURL);
    setAlt(tags);
  };

  return (
    <div className={s.App}>
      <Searchbar onSubmit={handleFormSubmit} />
      {status === 'pending' && <ImagePendingView />}
      {status === 'idle' && <div>Введите имя картинки</div>}
      {status === 'repeat' && <div>Такой картинки нет</div>}
      {status === 'rejected' && <h1>{error.massage}</h1>}
      {status === 'resolved' && (
        <ImageGallery>
          {images.map(({ webformatURL, tags, largeImageURL }, index) => (
            <ImageGalleryItem key={index}>
              <ImagesItem
                webformatURL={webformatURL}
                tags={tags}
                largeImageURL={largeImageURL}
                handlChangeModalImage={handlChangeModalImage}
              />
            </ImageGalleryItem>
          ))}
        </ImageGallery>
      )}
      {showModal && (
        <Modal onClose={handlChangeModalImage}>
          <img src={largeImageURL} alt={alt} />
        </Modal>
      )}
      {loading && <ImagePendingView />}
      {openButton && !loading && images.length !== totalHits && (
        <Button onLoadMore={handlPageButton} />
      )}
    </div>
  );
};

export default App;