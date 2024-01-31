const modal = document.getElementById('modal');
const modalShow = document.getElementById('show-modal');
const modalClose = document.getElementById('close-modal');
const bookmarkForm = document.getElementById('bookmark-form');
const websiteNameEl = document.getElementById('website-name');
const websiteUrlEl = document.getElementById('website-url');
const bookmarksContainer = document.getElementById('bookmarks-container');

let bookmarks = []; 

//Show modal 
function showModal() {
    console.log('Showing modal...');
    modal.classList.add('show-modal');
    websiteNameEl.focus()
}

//Modal event listener
modalShow.addEventListener('click', showModal); 
modalClose.addEventListener('click', () => modal.classList.remove('show-modal'));
window.addEventListener('click', (e) => (e.target === modal ? modal.classList.remove('show-modal') : false));

//Build bookmarks
function buildBookmarks() {
    console.log('Building bookmarks...');
    bookmarksContainer.textContent = '';
    bookmarks.forEach((bookmark) => {
        const { name, url} = bookmark;
        // Item
        const item = document.createElement('div');
        item.classList.add('item');
        // Close icon
        const closeIcon = document.createElement('i');
        closeIcon.classList.add('far', 'fa-window-close');
        closeIcon.setAttribute('title', 'Delete Bookmark'); 
        closeIcon.setAttribute('onclick', `deleteBookmark('${url}')`);
        //Favicon
        const linkInfo = document.createElement('div');
        linkInfo.classList.add('name');
        const favicon = document.createElement('img');
        favicon.setAttribute('src', `https://s2.googleusercontent.com/s2/favicons?domain=${url}`);
        favicon.setAttribute('alt', 'Favicon');
        //Link
        const link = document.createElement('a');
        link.setAttribute('href', `${url}`);
        link.setAttribute('target', '_blank');
        link.textContent = name;
        // Append to bookmarks container
        linkInfo.append(favicon, link);
        item.append(closeIcon, linkInfo);
        bookmarksContainer.appendChild(item);
    });
}

function deleteBookmark(url) {
    console.log('Deleting bookmark...');
    bookmarks.forEach((bookmark, index) => {
        if (bookmark.url === url) {
            bookmarks.splice(index, 1);
        }
    })

    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarks();
}

//Fetch from localStorage
function fetchBookmarks() {
    console.log('Fetching bookmarks...');
    if (localStorage.getItem('bookmarks')) {
        bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    } else {
        bookmarks = [
            {
                name: 'belikemiketips',
                url: 'www.belikemiketips.com'
            }
        ]
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }
    buildBookmarks();
}

//Handle Data from Form
function storeBookmark(e) {
    console.log('Storing bookmarks...');
    e.preventDefault();
    modal.classList.remove('show-modal');
    const nameValue = websiteNameEl.value;
    let urlValue = websiteUrlEl.value;
    if (!urlValue.includes('http://') && (!urlValue.includes('https://'))) {
        urlValue = `https://${urlValue}`;
    }
    if (!validateForm(nameValue, urlValue)) {
        return false;
    };

    const bookmark = {
        name: nameValue,
        url: urlValue
    };

    bookmarks.push(bookmark);
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarks();
    bookmarkForm.reset();
    websiteNameEl.focus();
}

//Validate form
function validateForm(nameValue, urlValue) {
    const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
    const regex = new RegExp(expression);
    if (!nameValue || !urlValue) {
        alert('Please submit values for both fields');
        return false;
    }
    // if (urlValue.match(regex)) {
    //     alert('Boo');
    // }
    if (!urlValue.match(regex)) {
        alert('Please provide a valid url');
        return false;
    }

    return true;
}

//Event listener
bookmarkForm.addEventListener('submit', storeBookmark);

//On load
fetchBookmarks();