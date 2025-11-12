let page = 1;
const perPage = 30;
let loadedTotal = 0;
let isLoading = false;
const MAX_IMAGES = 500;

const container = document.querySelector('.lazy-container');
const sentinel = document.querySelector('.sentinel');

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if(!entry.isIntersecting) return;
        const img = entry.target;
        img.src=img.dataset.src;
        img.addEventListener('load', () => {
            img.classList.add('loaded');
        });
        observer.unobserve(img);
    });
}, {
    root : null,
    rootMargin : '300px 0px',
    threshold : 0.01
});

//initial fetch
fetch(`https://picsum.photos/v2/list?page=${page}&limit=${perPage}`)
    .then(response=> response.json())
    .then(data => {
        data.forEach(imageData=>{
            const img = document.createElement('img');
            img.setAttribute('data-src', imageData.download_url);
            img.classList.add("lazy-img");
            img.style.height = "200px";
            img.style.width = "300px";
            img.style.margin = "10px";
            container.appendChild(img);
            observer.observe(img);

            
        });
        loadedTotal += data.length;

        sentinelObserver.observe(sentinel);
    });

    //sentinel observer for infinite scroll

const sentinelObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if(!entry.isIntersecting) return;
        if(isLoading) return;
        if(loadedTotal >= MAX_IMAGES) {
            sentinelObserver.unobserve(sentinel);
            return;
        }
        isLoading = true;
        page++;


    //fetch next batch of images
    fetch(`https://picsum.photos/v2/list?page=${page}&limit=${perPage}`)
        .then(response => response.json())
    .then(data => {
        data.forEach(imageData => {
            const img = document.createElement('img');
            img.setAttribute('data-src', imageData.download_url);
            img.classList.add("lazy-img");
            img.style.height = "200px";
            img.style.width = "300px";
            img.style.margin = "10px";
            container.appendChild(img);
            observer.observe(img);
        });
        
    loadedTotal += data.length;
    isLoading = false;
    });
    });
}, {
    root : null,
    rootMargin : '100px 0px',
    threshold : 0.01
});
  
