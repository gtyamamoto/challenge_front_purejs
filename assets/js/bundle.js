(() => {
    const selector = selector => document.querySelector(selector)/* trecho omitido */
    const create = element => document.createElement(element) /* trecho omitido */

    const app = selector('#app');

    const Login = create('div');
    Login.classList.add('login');

    const Logo = create('img');
    Logo.src = './assets/images/logo.svg';
    Logo.classList.add('logo');

    const Form = create('form');

    Form.onsubmit = async e => {
        const [email, password] = /* trecho omitido */ e.target.children;

        const {url} = await fakeAuthenticate(email.value, password.value);
        location.href='#users';
        
        const users = await getDevelopersList(url);
        renderPageUsers(users);
    };

    Form.oninput = e => {
        console.log('dd');
        const [email, password, button] = e.target.parentElement.children;
        console.log(password.value.length);
        (!email.validity.valid || !email.value || password.value.length <= 5) 
            ? button.setAttribute('disabled','disabled')
            : button.removeAttribute('disabled');
    };

    Form.innerHTML = /**
    * bloco de código omitido
    * monte o seu formulário
    */`
    <input type="email" name="email" placeholder="Entre com o seu e-mail"/>
    <input placeholder="digite sua senha supersecreta" minlength="5" type="password" name="password"/>
    <button type="submit">Entrar</button>
    `

    app.appendChild(Logo);
    Login.appendChild(Form);

    async function fakeAuthenticate(email, password) {

        const fetchToken = await fetch('http://www.mocky.io/v2/5dba690e3000008c00028eb6');
        const data = await fetchToken.json();

        /**
         * bloco de código omitido
         * aqui esperamos que você faça a requisição ao URL informado
         */

        const fakeJwtToken = `${btoa(email+password)}.${btoa(data.url)}.${(new Date()).getTime()+300000}`;
        localStorage.setItem('token',fakeJwtToken)
        /* trecho omitido */

        return data;
    }

    async function getDevelopersList(url) {
        /**
         * bloco de código omitido
         * aqui esperamos que você faça a segunda requisição 
         * para carregar a lista de desenvolvedores
         */
        const fetchDevelopers = await fetch(url);
        const data = await fetchDevelopers.json();
        return data;
        
    }

    function renderPageUsers(users) {
        app.classList.add('logged');
        Login.style.display = 'none'/* trecho omitido */

        const Ul = create('ul');
        Ul.classList.add('container')
        /**
         * bloco de código omitido
         * exiba a lista de desenvolvedores
         */
        Ul.innerHTML = `${users.map((user)=>`<li class="list-item"><img class="list-item-img" src="${user.avatar_url}" />${user.login}</\li>`).join('')}`

        app.appendChild(Ul)
    }

    // init
    (async function(){
        const rawToken = /* trecho omitido */localStorage.getItem('token')
        const token = rawToken ? rawToken.split('.') : null
        if (!token || token[2] < (new Date()).getTime()) {
            localStorage.removeItem('token');
            location.href='#login';
            app.appendChild(Login);
        } else {
            location.href='#users';
            const users = await getDevelopersList(atob(token[1]));
            renderPageUsers(users);
        }
    })()
})()