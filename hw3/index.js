'use strict'

const randomImage = document.querySelector('.photo__img');
const author = document.querySelector('.photo__author');
const imageName = document.querySelector('.photo__name');
const inputId = document.querySelector('.photo').querySelector('input');
const like = document.querySelector('.photo__like');
const photoList = document.querySelector('.photo-list');
const counter = document.querySelector('.photo-list__counter')
const yes = `<i class="fa fa__yes fa-regular fa-thumbs-up"></i>`
const no = `<i class="fa fa__no fa-regular fa-thumbs-down"></i>`
const whoKnows = `<i class="fa fa__xz fa-regular fa-face-meh-blank"></i>`;


let storedImageDict = JSON.parse(localStorage.getItem('storedImages'));
if(!storedImageDict) storedImageDict = {};
let likeCount = initializeCounter();
counter.textContent = 'Лайков ' + likeCount;
const storedImageDictKeys = Object.keys(storedImageDict);
storedImageDictKeys.forEach(key => {
    const row = createPhotoListItem(key, storedImageDict[key]);
    photoList.appendChild(row);
})

let currentImage = await renewContent('random');
initializeImage();


like.addEventListener('click', e => likeToggle(e.target));

async function renewContent(param) {
    const url = `https://api.unsplash.com/photos/${param}?client_id=dwsw4S6V6UFCg9xPb0PhW44q5Zv8SL_u9GBQSD3LmJ0`;
    const response = await fetch(url);
    const photoData = await response.json();
    let currentData = {};
    currentData.img = photoData.urls.small;
    currentData.author = 'author: ' + photoData.user.first_name + ' ' + photoData.user.last_name;
    currentData.name = photoData.alt_description;
    currentData.id = photoData.id;
    return currentData;
}

function initializeCounter() {
    let likeCount;
    likeCount = localStorage.getItem('likeCount');
    if (!likeCount) {
        likeCount = 0;
        localStorage.setItem('likeCount', likeCount);
    }
    return likeCount;
}

function initializeImage() {
    randomImage.src = currentImage.img;
    author.textContent = currentImage.author;
    imageName.textContent = currentImage.name;
    inputId.value = currentImage.id;
    const storedImage = storedImageDict[currentImage.id];
    if (storedImage) {
        currentImage['like'] = storedImage.like;
    } else {
        currentImage['like'] = 'whoKnows';
        saveToStorage();
        const newRow = createPhotoListItem(currentImage.id, storedImageDict[currentImage.id]);
        photoList.appendChild(newRow);
    }
    checkLike(currentImage.like, like);
}

function checkLike(likeItem, element) {
    element.dataset.like = likeItem;
    switch (likeItem) {
        case 'whoKnows':
            element.innerHTML = whoKnows;
            break;
        case 'yes':
            element.innerHTML = yes;
            break;
        case 'no':
            element.innerHTML = no;
            break;
    }
}

function likeToggle(element) {
    switch (element.closest('div').dataset.like) {
        case 'whoKnows':
            like.innerHTML = yes;
            like.dataset.like = 'yes'
            likeCount++;
            break;
        case 'yes':
            like.innerHTML = no;
            like.dataset.like = 'no'
            likeCount--;
            break;
        case 'no':
            like.innerHTML = yes;
            like.dataset.like = 'yes';
            likeCount++;
            break;
    }
    localStorage.setItem('likeCount', likeCount);
    currentImage.like = like.dataset.like;
    counter.textContent = 'Лайков ' + likeCount;
    saveToStorage();
}

function saveToStorage() {
    storedImageDict[currentImage.id] =
        {
            'src': currentImage.img,
            'author': currentImage.author,
            'name': currentImage.name,
            'like': currentImage.like
        };
    localStorage.setItem('storedImages', JSON.stringify(storedImageDict));
}

function createPhotoListItem(key, photo){

    const row = document.createElement('div');
    row.classList.add('photo-list__item');
    row.dataset.id = key;
    const likeElement = document.createElement('div');
    checkLike(photo.like, likeElement);
    row.appendChild(likeElement);
    const contents = document.createElement('div');
    row.appendChild(contents);
    const author = document.createElement('div');
    author.classList.add('photo__author');
    author.textContent = photo.author;
    const name = document.createElement('div')
    name.classList.add('photo__name');
    name.textContent = photo.name;
    contents.appendChild(author);
    contents.appendChild(name);
    row.addEventListener('click', async () => {
        currentImage = await renewContent(key);
        initializeImage();
    });
    return row;
}