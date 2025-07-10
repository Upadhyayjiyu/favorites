const addForm = document.getElementById('addForm');
const favoritesList = document.getElementById('favoritesList');
const filterCategory = document.getElementById('filterCategory');
const searchInput = document.getElementById('search');

let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

function renderFavorites(list) {
  favoritesList.innerHTML = '';
  list.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = 'card';

    card.innerHTML = `
      <img src="${item.imageUrl}" alt="${item.title}" />
      <div class="content">
        <h3>${item.title}</h3>
        <p>${item.description}</p>
        <p class="badge">${item.category}</p>
        <p style="font-size:0.75em;color:#777;">Added: ${item.date}</p>
      </div>
      <div class="actions">
        <span class="like ${item.liked ? 'liked' : ''}" data-index="${index}">❤️</span>
        <span class="delete" data-index="${index}">🗑️</span>
      </div>
    `;
    favoritesList.appendChild(card);
  });

  document.querySelectorAll('.like').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const i = e.target.getAttribute('data-index');
      favorites[i].liked = !favorites[i].liked;
      saveAndRender();
    });
  });

  document.querySelectorAll('.delete').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const i = e.target.getAttribute('data-index');
      favorites.splice(i, 1);
      saveAndRender();
    });
  });
}

function saveAndRender() {
  localStorage.setItem('favorites', JSON.stringify(favorites));
  filterAndSearch();
}

addForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = document.getElementById('title').value.trim();
  const imageUrl = document.getElementById('imageUrl').value.trim();
  const description = document.getElementById('description').value.trim();
  const category = document.getElementById('category').value;

  favorites.push({
    title,
    imageUrl,
    description,
    category,
    liked: false,
    date: new Date().toLocaleString()
  });

  addForm.reset();
  saveAndRender();
});

function filterAndSearch() {
  const cat = filterCategory.value;
  const search = searchInput.value.toLowerCase();

  const filtered = favorites.filter(item => {
    const matchesCategory = cat === 'All' || item.category === cat;
    const matchesSearch = item.title.toLowerCase().includes(search);
    return matchesCategory && matchesSearch;
  });

  renderFavorites(filtered);
}

searchInput.addEventListener('input', filterAndSearch);
filterCategory.addEventListener('change', filterAndSearch);

saveAndRender(); // initial load
