import { PixabayAPI } from './pixabay-api';
import createPhotoCard from './murkup';
import { refs } from './refs';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const pixabayApi = new PixabayAPI();

let gallery = new SimpleLightbox('.gallery a');
let pageToFetch = 1;
let queryToFetch = "";

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        searchGallery(queryToFetch, pageToFetch);
      }
    });
  },
  { rootMargin: "200px" }
);


const handleSearchFoto = async ev => {
  ev.preventDefault();
  refs.galleryEl.innerHTML = '';
  // refs.loadMoreBtnEl.classList.add('is-hidden');
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
 refs.loader.classList.remove("is-hidden");
 try {
  const { data } = await pixabayApi.fetchPhoto();;

  // console.log(data)

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
  // if (data.totalHits > pixabayApi.per_page) {
  //     // refs.loadMoreBtnEl.classList.remove('is-hidden');
  //   }
  refs.loader.classList.add("is-hidden");
  pixabayApi.page += 1;
  observer.observe(refs.guard);
 } catch (error) {
  console.log(error);
 }
}

// function handleLoadMoreBtnClick() {
//   pixabayApi.page += 1;
//   searchMorePhoto();
// }


// async function searchMorePhoto() {
//  pixabayApi.page += 1;
//  try {
//   const { data } = await pixabayApi.fetchPhoto();
//   console.log(data)

//   createPhotoCard(data.hits);
//   gallery.refresh();

//    if (data.hits.length < pixabayApi.per_page) {
//       refs.loadMoreBtnEl.classList.add('is-hidden');
//       return Notiflix.Notify.info(
//         "We're sorry, but you've reached the end of search results."
//       );
//     }
//   } catch (error) {
//     console.log(error);
//   }
// }

refs.formSearchEl.addEventListener('submit', handleSearchFoto);
// refs.loadMoreBtnEl.addEventListener('click', handleLoadMoreBtnClick);





