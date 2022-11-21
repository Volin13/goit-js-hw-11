import SimpleLightbox from 'simplelightbox';
import axios from 'axios';
import Notiflix from 'notiflix';
import "simplelightbox/dist/simple-lightbox.min.css";

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '31497107-74ff97909f7263a3d9824c2c9';

const formElem = document.querySelector('.search-form');
const loadMoreBtn = document.querySelector('.load-more');
const gallery = document.querySelector('.gallery');
const per_page = 40
let page = 0;
let query = '';

loadMoreBtn.hidden = true

const fetchImages = async query => {
  const params = new URLSearchParams({
    key: API_KEY,
    q: query,
    page,
    per_page,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
  });
  try {
    const response = await axios.get(`${BASE_URL}?${params}`);
    return response.data;
  } catch (error) {
    () =>
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
  }
};

function renderMarkup(hits) {
  if (!hits.length) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  } else {
    let markup = hits
      .map(
        ({
          webformatURL,
          largeImageURL,
          tags,
          likes,
          views,
          comments,
          downloads,
        }) => {
          return `<div class="photo-card">
          <a href="${largeImageURL}" class="gallery__item">
          <img src="${webformatURL}" alt="${tags}" loading="lazy" class="gallery__image" /></a>
                <div class="info">
                  <p class="info-item">
                    <b>Likes: ${likes}</b>
                  </p>
                  <p class="info-item">
                    <b>Views: ${views}</b>
                  </p>
                  <p class="info-item">
                    <b>Comments: ${comments}</b>
                  </p>
                  <p class="info-item">
                    <b>Downloads: ${downloads}</b>
                  </p>
                </div>
              </div>`;
        }
      )
      .join('');
        console.log(hits);
    gallery.insertAdjacentHTML('beforeend', markup);
    page += 1;
    loadMoreBtn.getElementsByClassName.display = 'block';
  }
}

function handleFormSubmit(e) {
  e.preventDefault();

  query = e.target.elements['searchQuery'].value.trim();
  if (query === '') return;
  gallery.innerHTML = '';
  page = 1;

  fetchImages(query)
    .then(({ hits, totalHits }) => {
      renderMarkup(hits);
      new SimpleLightbox('.gallery__item', {
        captionsData: 'alt',
        captionsDelay: 250,
      });
      if(totalHits > 0 ){
        Notiflix.Notify.info(`Hooray! We found ${totalHits} images.`)
        loadMoreBtn.hidden = false;
      }

    })
    .catch(() =>
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      )
    );
}

function handleLoadMoreBtn() {
  fetchImages(query)
    .then(({ hits }) => {
      renderMarkup(hits);
    })
    .catch(() => {
        
        loadMoreBtn.hidden = true
        return Notiflix.Notify.info(
            "We're sorry, but you've reached the end of search results."
          )
    }
    );
}

formElem.addEventListener('submit', handleFormSubmit);
loadMoreBtn.addEventListener('click', handleLoadMoreBtn);



