window.onload = () => {
    const preLoader = document.querySelector('.preloader');

    setTimeout(() => {
        preLoader.classList.remove('is-active')
    }, 200);

    document.addEventListener('click', e => {
        if (e.target.tagName === 'A') {
            e.preventDefault();
            let target = e.target.href;

            preLoader.classList.add('is-active');

            setTimeout(() => {
                window.location.href = target;
            }, 200);
        }
    });
};