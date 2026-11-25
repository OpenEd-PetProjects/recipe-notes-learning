const form = document.querySelector('#recipe-form');
const title = document.querySelector('#title');
const description = document.querySelector('#description');
const list = document.querySelector('#recipes');
const message = document.querySelector('#message');
let recipes = [];
let storageAvailable = true;

try {
  const saved = JSON.parse(localStorage.getItem('recipes') || '[]');
  if (!Array.isArray(saved) || !saved.every(item => item && typeof item.title === 'string' && typeof item.description === 'string')) throw new Error('Invalid data');
  recipes = saved;
} catch {
  storageAvailable = false;
  message.textContent = 'Не удалось прочитать сохранённые рецепты. Новые записи недоступны, чтобы не перезаписать данные.';
}

function render() {
  list.replaceChildren(...recipes.map(recipe => {
    const item = document.createElement('li');
    const heading = document.createElement('strong');
    heading.textContent = recipe.title;
    const text = document.createElement('p');
    text.textContent = recipe.description;
    item.append(heading, text);
    return item;
  }));
}

form.addEventListener('submit', event => {
  event.preventDefault();
  const name = title.value.trim();
  const details = description.value.trim();
  if (!name || !details || !storageAvailable) return;
  const updated = [...recipes, { title: name, description: details }];
  try {
    localStorage.setItem('recipes', JSON.stringify(updated));
  } catch {
    message.textContent = 'Не удалось сохранить рецепт. Проверьте доступность хранилища браузера.';
    return;
  }
  recipes = updated;
  message.textContent = '';
  render();
  form.reset();
  title.focus();
});

render();
