import { Notify } from 'notiflix/build/notiflix-notify-aio';
import axios from "axios";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import NewsApiService from "./news-service";
import galleryCardTpl from "../templates/galleryCard.hbs";


const refs = {
    form : document.querySelector('.search-form'),
    galleryContainer : document.querySelector('.gallery'),
    loadMoreBtn : document.querySelector('.load-more')
}


const gallery =  new SimpleLightbox('.gallery-item');
const newsApiService = new NewsApiService();
const per_page = newsApiService.per_page;
loadMorButtonDisable();

refs.form.addEventListener('submit', onFormSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

function onFormSubmit(e){
    e.preventDefault();
   
    newsApiService.query = e.currentTarget.elements.searchQuery.value;
    loadMorButtonDisable();
    if(newsApiService.query === ''){
        Notify.info('Please enter, what exactly you want to find?');
        return;
    } 
    newsApiService.resetPage();
    clearGalleryContainer();
    newsApiService.fetchPictures().then(({hits,totalHits}) => {
        if (hits.length === 0) {
            Notify.failure("Sorry, there are no images matching your search query. Please try again.");
            return;
        }
        renderPicturesCard(hits);
        Notify.success(`Hooray! We found ${totalHits} images.`)
        loadMorButtonEnable();
        if (hits.length < per_page) {
            loadMorButtonDisable()
            Notify.warning("We're sorry, but you've reached the end of search results.");
            return;
        }

    gallery.refresh();

    }).catch('an error occurred, please try again later');

    
}

function onLoadMore (e){

    newsApiService.fetchPictures().then(({hits}) => {
    renderPicturesCard(hits);
    scrollPage();
    if (hits.length < per_page) {
        loadMorButtonDisable()
        Notify.warning("We're sorry, but you've reached the end of search results.");
    }
    gallery.refresh();
    
    }).catch('an error occurred, please try again later');
}

function renderPicturesCard(hits){
 const markup = galleryCardTpl(hits);
 refs.galleryContainer.insertAdjacentHTML('beforeend', markup);

}

function clearGalleryContainer(){
    refs.galleryContainer.innerHTML='';
}

function loadMorButtonDisable() {
    refs.loadMoreBtn.classList.add('hidden')
}

function loadMorButtonEnable() {
    refs.loadMoreBtn.classList.remove('hidden')
}

function scrollPage(){
const { height: cardHeight } = refs.galleryContainer
  .firstElementChild.getBoundingClientRect();

window.scrollBy({
  top: cardHeight * 2,
  behavior: "smooth",
});
}