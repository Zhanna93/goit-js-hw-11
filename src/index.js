import { PixabayAPI }  from './pixabay-api';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const formSearchEl = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');
const loadMoreBtnEl = document.querySelector('.load-more');
// const guard = document.querySelector(".guard");

const pixabayApi = new PixabayAPI();

let gallery = new SimpleLightbox('.gallery a');
// let pageToFetch = 1;
// let queryToFetch = "";

// const observer = new IntersectionObserver(
//   (entries) => {
//     entries.forEach((entry) => {
//       if (entry.isIntersecting) {
//         searchGallery(queryToFetch, pageToFetch);
//       }
//     });
//   },
//   { rootMargin: "200px" }
// );


const handleSearchFoto = async ev => {
  ev.preventDefault();
  galleryEl.innerHTML = '';
  loadMoreBtnEl.classList.add('is-hidden');
  pixabayApi.page = 1;

  const serchItemEl = ev.target.elements['searchQuery'].value.trim();

  pixabayApi.q = serchItemEl;

  if (!serchItemEl) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }

  searchGallery();
};

async function searchGallery() {
 try {
  const { data } = await pixabayApi.fetchPhoto();;

  console.log(data)

  if (data.totalHits === 0) {
   Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
   );
   return;
  }
  const hits = data.hits;
  createPhotoCard(hits);
  Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
  gallery.refresh();
  if (data.totalHits > pixabayApi.per_page) {
      loadMoreBtnEl.classList.remove('is-hidden');
    }
  // pixabayApi.page += 1;
  // observer.observe(guard);
 } catch (error) {
  console.log(error);
 }
}

function createPhotoCard(hits) {
 const murkup = hits.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
  return `<a class='gallery_item' href='${largeImageURL}'>
    <div class='photo-card'>
      <img
        class='gallery_img'
        src='${webformatURL}'
        alt='${tags}'
        loading='lazy'
      />
      <div class='info'>
        <p class='info-item'>
          <b>Likes</b>
          <span>'${likes}'</span>
        </p>
        <p class='info-item'>
          <b>Views</b>
          <span>'${views}'</span>
        </p>
        <p class='info-item'>
          <b>Comments</b>
          <span>'${comments}'</span>
        </p>
        <p class='info-item'>
          <b>Downloads</b>
          <span>'${downloads}'</span>
        </p>
      </div>
    </div>
  </a>`
 }).join('');
 galleryEl.insertAdjacentHTML('afterbegin', murkup);
}

function handleLoadMoreBtnClick() {
  pixabayApi.page += 1;
  searchMorePhoto();
}


async function searchMorePhoto() {
 try {
  const { data } = await pixabayApi.fetchPhoto();
  console.log(data)

  galleryEl.insertAdjacentHTML('beforeend', createPhotoCard(data.hits));
  gallery.refresh();

   if (data.hits.length < pixabayApi.per_page) {
      loadMoreBtnEl.classList.add('is-hidden');
      return Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }
  } catch (error) {
    console.log(error);
  }
}

formSearchEl.addEventListener('submit', handleSearchFoto);
loadMoreBtnEl.addEventListener('click', handleLoadMoreBtnClick);




