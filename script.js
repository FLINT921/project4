// Функция задержки
function debounce(func, wait, immediate) {
    let timeout;
    return function () {
        const context = this;
        const args = arguments;
        const later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Функция для получения репозиториев из GitHub API
async function fetchRepositories(keyword) {
    const response = await fetch(`https://api.github.com/search/repositories?q=${keyword}`);
    const data = await response.json();
    return data.items.slice(0, 5); // Получить только первые 5 репозиториев
}

// Функция для отображения элементов автозаполнения
function renderAutocompleteItems(repositories) {
    const autocompleteItems = document.getElementById("autocompleteItems");
    autocompleteItems.innerHTML = "";

    repositories.forEach((repo) => {
        const item = document.createElement("div");
        item.classList.add("autocomplete-item");
        item.textContent = repo.full_name;
        item.addEventListener("click", () => {
            addRepository(repo);
            document.getElementById("searchInput").value = ""; // Очистить поле ввода после выбора
        });
        autocompleteItems.appendChild(item);
    });
}

// Функция для отображения списка репозиториев
function renderRepositoryList(repositories) {
    const repoList = document.getElementById("repoList");
    repoList.innerHTML = "";

    repositories.forEach((repo) => {
        const item = document.createElement("div");
        item.classList.add("repo-item");
        const itemText = document.createElement("div");
        itemText.classList.add("repo-item-text");
        itemText.innerHTML = `
        <strong>Name: ${repo.name}</strong>
        <strong>Owner: ${repo.owner.login}</strong>
        <strong>Stars: ${repo.stargazers_count}</strong>`;
        item.appendChild(itemText);
        const deleteButton = document.createElement("div");
        deleteButton.classList.add("repo-item-btn");
        deleteButton.addEventListener("click", () => {
            removeRepository(repo);
        });
        item.appendChild(deleteButton);
        repoList.appendChild(item);
    });
}

// Функция для добавления репозитория в список
function addRepository(repo) {
    repositories.push(repo);
    renderRepositoryList(repositories);
}

// Функция для удаления репозитория из списка
function removeRepository(repo) {
    repositories = repositories.filter((r) => r !== repo);
    renderRepositoryList(repositories);
}

let repositories = []; // Массив для хранения добавленных репозиториев

// Отложенная функция для обработки ввода в поисковое поле
const debouncedSearch = debounce(async function () {
    const keyword = document.getElementById("searchInput").value.trim();
    if (keyword === "") {
        renderAutocompleteItems([]);
        return;
    }
    const repos = await fetchRepositories(keyword);
    renderAutocompleteItems(repos);
}, 300);

// Обработчик событий для ввода в поисковом поле
document.getElementById("searchInput").addEventListener("input", debouncedSearch);
