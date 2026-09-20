import 'bootstrap/dist/css/bootstrap.min.css';
import { Book } from './models/Book';
import { User } from './models/User';
import { Library } from './services/Library';
import { StorageService } from './services/Storage';
import { Validation } from './utils/validators';
import { generateId } from './utils/idGenerator';
import { Modal } from './ui/components/Modal';

const bookLibrary = new Library<Book>(StorageService.load<Book>('books'));
const userLibrary = new Library<User>(StorageService.load<User>('users'));

function saveData(): void {
  StorageService.save('books', bookLibrary.getAll());
  StorageService.save('users', userLibrary.getAll());
}

function renderUI(): void {
  const app = document.getElementById('app');
  if (!app) return;
  app.innerHTML = '';

  const container = document.createElement('div');
  container.className = 'container my-4 col-md-8';

  const title = document.createElement('h2');
  title.className = 'text-center mb-4 fw-bold';
  title.textContent = 'Система Управління Бібліотекою';
  container.appendChild(title);

  const bookCard = createCard('Додати Книгу', [
    { id: 'bookTitle', placeholder: 'Назва книги' },
    { id: 'bookAuthor', placeholder: 'Автор' },
    { id: 'bookYear', placeholder: 'Рік видання' }
  ], 'Додати Книгу', onAddBook);

  const userCard = createCard('Додати Користувача', [
    { id: 'userName', placeholder: 'Ім\'я' },
    { id: 'userEmail', placeholder: 'Email' }
  ], 'Додати Користувача', onAddUser);

  container.appendChild(bookCard);
  container.appendChild(userCard);

  container.appendChild(renderBookList());
  container.appendChild(renderUserList());

  app.appendChild(container);
}

function createCard(
  cardTitle: string, 
  inputs: { id: string; placeholder: string }[], 
  btnText: string, 
  onSubmit: (formData: Record<string, string>) => void
): HTMLElement {
  const card = document.createElement('div');
  card.className = 'card mb-4 p-3 shadow-sm';

  const h4 = document.createElement('h5');
  h4.className = 'card-title fw-bold mb-3';
  h4.textContent = cardTitle;
  card.appendChild(h4);

  inputs.forEach(inp => {
    const group = document.createElement('div');
    group.className = 'mb-2';
    const input = document.createElement('input');
    input.type = 'text';
    input.id = inp.id;
    input.placeholder = inp.placeholder;
    input.className = 'form-control';
    group.appendChild(input);
    card.appendChild(group);
  });

  const btn = document.createElement('button');
  btn.className = 'btn btn-success mt-2 col-auto';
  btn.textContent = btnText;
  btn.onclick = () => {
    const data: Record<string, string> = {};
    inputs.forEach(i => {
      data[i.id] = (document.getElementById(i.id) as HTMLInputElement).value;
    });
    onSubmit(data);
  };

  card.appendChild(btn);
  return card;
}

function onAddBook(data: Record<string, string>): void {
  if (!Validation.isRequired(data.bookTitle) || !Validation.isRequired(data.bookAuthor)) {
    Modal.showAlert('Помилка', 'Заповніть усі обов\'язкові поля!');
    return;
  }
  if (!Validation.isValidYear(data.bookYear)) {
    Modal.showAlert('Помилка', 'Некоректний рік видання (4 цифри)!');
    return;
  }

  const newBook = new Book(generateId(), data.bookTitle, data.bookAuthor, parseInt(data.bookYear));
  bookLibrary.add(newBook);
  saveData();
  renderUI();
}

function onAddUser(data: Record<string, string>): void {
  if (!Validation.isRequired(data.userName) || !Validation.isRequired(data.userEmail)) {
    Modal.showAlert('Помилка', 'Заповніть усі поля!');
    return;
  }

  const newUser = new User(generateId(), data.userName, data.userEmail);
  userLibrary.add(newUser);
  saveData();
  renderUI();
}

function renderBookList(): HTMLElement {
  const card = document.createElement('div');
  card.className = 'card mb-4 p-3 shadow-sm';
  const h5 = document.createElement('h5');
  h5.className = 'fw-bold mb-3';
  h5.textContent = 'Список Книг';
  card.appendChild(h5);

  const list = document.createElement('ul');
  list.className = 'list-group';

  bookLibrary.getAll().forEach(book => {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';
    li.textContent = `${book.title} by ${book.author} (${book.year})`;

    const actionBtn = document.createElement('button');
    if (book.isBorrowed) {
      actionBtn.className = 'btn btn-warning btn-sm';
      actionBtn.textContent = 'Повернути';
      actionBtn.onclick = () => {
        book.isBorrowed = false;
        book.borrowedByUserId = undefined;
        saveData();
        renderUI();
        Modal.showAlert('Успіх', `${book.title} was returned.`);
      };
    } else {
      actionBtn.className = 'btn btn-primary btn-sm';
      actionBtn.textContent = 'Позичити';
      actionBtn.onclick = () => {
        Modal.showPrompt('Введіть ID користувача для позичення книги:', 'ID', (userId) => {
          const user = userLibrary.findById(userId);
          if (!user) {
            Modal.showAlert('Помилка', 'Користувача з таким ID не знайдено!');
            return;
          }

          const userBorrowedCount = bookLibrary.getAll().filter(b => b.borrowedByUserId === userId).length;
          if (userBorrowedCount >= 3) {
            Modal.showAlert('Обмеження', 'Цей користувач вже позичив 3 книги!');
            return;
          }

          book.isBorrowed = true;
          book.borrowedByUserId = userId;
          saveData();
          renderUI();
          Modal.showAlert('Успіх', `${book.title} has been borrowed by ${user.name}`);
        });
      };
    }

    li.appendChild(actionBtn);
    list.appendChild(li);
  });

  card.appendChild(list);
  return card;
}

function renderUserList(): HTMLElement {
  const card = document.createElement('div');
  card.className = 'card mb-4 p-3 shadow-sm';
  const h5 = document.createElement('h5');
  h5.className = 'fw-bold mb-3';
  h5.textContent = 'Список Користувачів';
  card.appendChild(h5);

  const list = document.createElement('ul');
  list.className = 'list-group';

  userLibrary.getAll().forEach(user => {
    const li = document.createElement('li');
    li.className = 'list-group-item';
    li.textContent = `${user.id} ${user.name} (${user.email})`;
    list.appendChild(li);
  });

  card.appendChild(list);
  return card;
}

renderUI();