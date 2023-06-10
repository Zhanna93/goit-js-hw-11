import { refs } from './refs';

export default function createPhotoCard(hits) {
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
 refs.galleryEl.insertAdjacentHTML('beforeend', murkup);
}