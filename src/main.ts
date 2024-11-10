import Handlebars from 'handlebars';
import * as Components from './components';
import * as Pages from './pages';

const pages = {
    'login': [ Pages.LoginPage ],
    'sign-up': [Pages.SignUpPage],
    'account': [Pages.AccountPage, {
      email: 'leocherep@mail.ru',
      login: 'turtle',
      name: 'Леонардо',
      surname: 'Черепахов',
      nickname: 'Лео',
      phone: '8-800-555-35-35',
      isEditing: true,
    }],
    'error404page': [ Pages.Error404Page ],
    'error500page': [ Pages.Error500Page ],
    'nav': [ Pages.NavigatePage ],
};

Object.entries(Components).forEach(([ name, template ]) => {
    Handlebars.registerPartial(name, template);
});

function navigate(page: string) {
    //@ts-ignore
    const [ source, context ] = pages[page];
    const container = document.getElementById('app')!;

    const temlpatingFunction = Handlebars.compile(source);
    container.innerHTML = temlpatingFunction(context);
}

document.addEventListener('DOMContentLoaded', () => navigate('nav'));

document.addEventListener('click', e => {
    //@ts-ignore
    console.log(e.target.getAttribute('page'), 'e.target.getAttribute(\'page\')')
    //@ts-ignore
    const page = e.target.getAttribute('page');
    if (page) {
        navigate(page);

        e.preventDefault();
        e.stopImmediatePropagation();
    }
});
