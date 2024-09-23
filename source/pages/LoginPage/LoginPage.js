function createInput(type, text, name) {
    const input = document.createElement('input')
    input.type = type;
    input.name = name;
    input.placeholder = text;

    return input;
}

function createButton(type, text){
    const button = document.createElement('Button');
    button.type = type;
    button.textContent = text;

    return button;
}

function ajax(method, url, body = null, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.withCredentials = true;

    xhr.addEventListener('readystatechange', function() {
        if (xhr.readyState != XMLHttpRequest.DONE) {
            return;
        }

        callback(xhr.status, xhr.responseText);
    });

    if (body) {
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf8');
        xhr.send(JSON.stringify(body));
        return;
    }

    xhr.send();
}

function renderLogin() {
    const form = document.createElement('form');
    form.className = 'LoginForm';

    const text = document.createElement('p');
    text.textContent = 'Войдите в Patefon';

    const emailInput = createInput('email', 'Емайл', 'email');
    const passwordInput = createInput('password', 'Пароль', 'password');

    const submitBtn = createButton('submit', 'Войти');
    submitBtn.className = 'btn';
    submitBtn.id = 'Enter';

    const submitBtnCreate = createButton('submit', 'Создать аккаунт');
    submitBtnCreate.className = 'btn';
    submitBtnCreate.id = 'Create';

    form.appendChild(text);
    form.appendChild(emailInput);
    form.appendChild(passwordInput);
    form.appendChild(submitBtn);
    form.appendChild(submitBtnCreate);

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        
        ajax('POST', '/', {email, password}, (status) => {
            if (status == 200) {
                alert('Победа!!!');
                return
            }
            alert(status);
        });
    })

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
