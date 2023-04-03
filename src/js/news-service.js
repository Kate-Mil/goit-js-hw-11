import axios from "axios";

const API_KEY = '34900883-94108098f0e7f8bd03a1699df';
const BASE_URL = 'https://pixabay.com/api/';
const ADD_API_REQUEST = 'image_type=photo&orientation=horizontal&safesearch=true';



export default class NewsApiService{
constructor (){
    this.searchQuery  = '';
    this.page = 1;
    this.per_page = 40;
}

async fetchPictures(){
    try {
        return await axios.get(`${BASE_URL}?key=${API_KEY}&q=${this.searchQuery}&${ADD_API_REQUEST}&per_page=${this.per_page}&page=${this.page}`)
        .then(({data:{hits, totalHits}}) => {
        this.incrementPage();
        return {hits, totalHits};
    })
        } catch (respons) {
        console.log('an error occurred, please try again later');
     }
    
}


// fetchPictures(){
// return fetch(`${BASE_URL}?key=${API_KEY}&q=${this.searchQuery}&${ADD_API_REQUEST}&per_page=${this.per_page}&page=${this.page}`)
// .then(res => {
//     if (!res.ok) {
//         throw new Error(res.status);
//     }
//     return res.json();
//     })
//     .then(data => {
//         this.incrementPage();
//         return data;
       
//     })
// }

incrementPage() {
this.page +=1;
}

resetPage() {
    this.page = 1;
}

get query () {
    return this.searchQuery;
}

set query(newQuery) {
    this.searchQuery = newQuery;
}



}