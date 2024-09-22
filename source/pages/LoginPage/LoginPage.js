function createInput(type, text, name) {
    const input = document.createElement('input')
    input.type = type;
    input.name = name;
    input.placeholder = text;

    return input;
}

function renderLogin() {
    const form = document.createElement('form');
    form.className = 'LoginForm';

    const text = document.createElement('p');
    text.textContent = 'Войдите в Patefon';

    const emailInput = createInput('email', 'Емайл', 'email');
    const passwordInput = createInput('password', 'Пароль', 'password');

    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.textContent = 'Войти';
    submitBtn.className = 'Enter';

    const submitBtnCreate = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtnCreate.textContent = 'Создать аккаунт';
    submitBtnCreate.className = 'Create';

    form.appendChild(text);
    form.appendChild(emailInput);
    form.appendChild(passwordInput);
    form.appendChild(submitBtn);
    form.appendChild(submitBtnCreate);

    return form;
}

const element = document.getElementById('root');

const elementLeft = document.createElement('div');
elementLeft.className = 'left';


const elementRight = document.createElement('div');
elementRight.className = 'right';

const login = renderLogin();

element.appendChild(elementLeft);
element.appendChild(elementRight);

elementRight.appendChild(login);