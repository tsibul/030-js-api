function sliderMove(obj, direction) {
    const slider = obj.parentElement.querySelector('.slider');
    slider.style.transform = 'translateX(' + direction + '100%)';
    const previousCard = slider.querySelector('.slider-previous');
    const currentCard = slider.querySelector('.slider-current');
    const nextCard = slider.querySelector('.slider-next');

    setTimeout(function() {
        if (direction != '-') {
            const previousId = parseInt(previousCard.id.split('-').pop());
            let newPreviousId;
            if (previousId == 1) {
                newPreviousId = 'slider-10'
            } else {
                newPreviousId = 'slider-' + (previousId - 1).toString();
            }
            document.getElementById(newPreviousId).classList.add('slider-previous');
            nextCard.classList.remove('slider-next');
            currentCard.classList.remove('slider-current');
            currentCard.classList.add('slider-next');
            previousCard.classList.remove('slider-previous');
            previousCard.classList.add('slider-current');
        } else {
            const nextId = parseInt(nextCard.id.split('-').pop());
            let newNextId;
            if (nextId == 10) {
                newNextId = 'slider-1'
            } else {
                newNextId = 'slider-' + (nextId + 1).toString();
            }
            document.getElementById(newNextId).classList.add('slider-next');
            nextCard.classList.remove('slider-next');
            nextCard.classList.add('slider-current')
            currentCard.classList.remove('slider-current');
            currentCard.classList.add('slider-previous');
            previousCard.classList.remove('slider-previous');
        }
        slider.style.transition = 'all 0.0s';
        slider.style.transform = ''

    }, 1000);
    slider.style.transition = 'all 1s';

    // setTimeout(function() { slider.style.transform = ''; }, 950);

}