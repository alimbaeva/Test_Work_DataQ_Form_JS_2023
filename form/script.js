const TOKEN = "18edd5798f10bcfa6b309df5e6eff79108c20a51";
const PATH = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/party";

const searchParty = document.querySelector('#party');
const popupList = document.querySelector('.popup');
const nameShort = document.querySelector('#name_short');
const nameFull = document.querySelector('#name_full');
const innKpp = document.querySelector('#inn_kpp');
const address = document.querySelector('#address');
const type = document.querySelector('#type');

const api = {
    async data(query, destination = false) {
         try {
            await fetch(`${PATH}`, {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Token ${TOKEN}`
                },
                body: JSON.stringify({
                    "query": query,
                    "branch_type": ["BRANCH"],
                    count: 5
                })
            }).then(response => response.text())
            .then(result => {
                const data = JSON.parse(result).suggestions;
                if (!destination) getData(data);
                if (destination) giveResult(data);
            })
            .catch(error => {
                throw new Error(error);
            });
        } catch {
            throw new Error('Request not sent');
        }
    }
}

function inputSearch() {
    api.data(this.value);
}

function getData(data) {
    const blockUl = document.querySelector('.popup ul');
    if (blockUl) blockUl.remove();
    const ul = document.createElement('ul');

    if (data.length > 0) {
        data.map(el => {    
            const list = document.createElement('li');
            const title = document.createElement('h6');
            const text = document.createElement('p');
            list.setAttribute('id', `${el.data.inn}`);
            title.textContent = el.value;
            text.textContent = `${el.data.inn} ${el.data.address.value}`;
            list.append(title);
            list.append(text);
            ul.append(list);
        });
        popupList.append(ul);
    }

    ul.addEventListener('click', (e) => {
        const elInn = e.target.parentNode.getAttribute('id');
        api.data(elInn, true);
        ul.remove();
    });
}

function giveResult(data) {
    type.textContent = `Тип организации: ${data[0].data.type}`;
    searchParty.value = data[0].value;
    nameShort.value = data[0].value;
    nameFull.value = data[0].data.name.full_with_opf;
    innKpp.value = `${data[0].data.inn} / ${data[0].data.kpp}`;
    address.value = data[0].data.address.data.source;
}


searchParty.addEventListener('input', inputSearch);