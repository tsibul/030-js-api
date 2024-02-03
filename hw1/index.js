'use strict'
const content = document.querySelector('.content');
const rowHTML = `
            <div class="schedule__item name"></div>
            <div class="schedule__item time"></div>
            <div class="schedule__item participants"></div>
            <div class="schedule__item registered"></div>
            <button type="button" class="btn btn__save">записаться</button>
            <button type="button" class="btn btn__cancel">отменить запись</div>
        `
let initialData;
let mySchedule = {};
if (localStorage.getItem('totalSchedule')) {
    initialData = JSON.parse(localStorage.getItem('totalSchedule'));
} else {
    let scheduleData = await fetch('./scheduledata.json');
    initialData = await scheduleData.json();
    localStorage.setItem('totalSchedule', JSON.stringify(initialData));
}
if (localStorage.getItem('mySchedule')) {
    mySchedule = JSON.parse(localStorage.getItem('mySchedule'))
} else {
    for (let i = 1; i <= 5; i++) {
        mySchedule[i] = false;
    }
    localStorage.setItem('mySchedule', JSON.stringify(mySchedule));
}


initialData.forEach(item => createRow(item));


function createRow(item) {
    const div = document.createElement('div');
    div.classList.add('schedule');
    div.insertAdjacentHTML('afterbegin', rowHTML);
    content.appendChild(div);
    div.id = item.id;
    div.querySelector('.name').textContent = item.name;
    div.querySelector('.time').textContent = item.time;
    div.querySelector('.participants').textContent = item.maxParticipants;
    div.querySelector('.registered').textContent = item.currentParticipants;
    const btnSave = div.querySelector('.btn__save');
    const btnCancel = div.querySelector('.btn__cancel');
    if (!mySchedule[item.id]) {
        btnCancel.disabled = true;
        btnCancel.classList.add('disabled');
    }
    if (mySchedule[item.id] || item.maxParticipants === item.currentParticipants) {
        btnSave.disabled = true;
        btnSave.classList.add('disabled');
    }
    btnSave.addEventListener('click', e => sign(e.target));
    btnCancel.addEventListener('click', e => sign(e.target));
}


function btnToggle(btn) {
    if (btn.disabled) {
        btn.classList.remove('disabled');
    } else {
        btn.classList.add('disabled');
    }
    btn.disabled = !btn.disabled;
}

function sign(btn) {
    btnToggle(btn);
    const div = btn.closest('.schedule')
    const id = div.id;
    let adder = 1;
    if(btn.classList.contains('btn__save')){
        mySchedule[id] = true;
        btnToggle(btn.nextElementSibling);
    }
 else if (btn.classList.contains('btn__cancel')) {
        mySchedule[id] = false;
        btnToggle(btn.previousElementSibling);
        adder = -1;
    }
    initialData.forEach(item => {
        if (item.id === Number(id)) {
            item.currentParticipants = item.currentParticipants + adder;
            div.querySelector('.registered').textContent = item.currentParticipants;
            localStorage.setItem('totalSchedule', JSON.stringify(initialData));
        }
    });
    localStorage.setItem('mySchedule', JSON.stringify(mySchedule));
}

function signOut(btn) {
    btnToggle(btn);
    const div = btn.closest('.schedule')
    const id = div.id;
    initialData.forEach(item => {
        if (item.id === Number(id)) {
            item.currentParticipants--;
            const newCount = item.currentParticipants;
            div.querySelector('.registered').textContent = item.currentParticipants;
            localStorage.setItem('totalSchedule', JSON.stringify(initialData));
        }
    });
    mySchedule[id] = false;
    btnToggle(btn.previousElementSibling);
    localStorage.setItem('mySchedule', JSON.stringify(mySchedule));

}