
// Função para carregar os cards do localStorage
function loadCards() {
    const cardContainer = document.getElementById('cardContainer');
    cardContainer.innerHTML = '';
    const cards = JSON.parse(localStorage.getItem('cards')) || [];
    cards.forEach((card, index) => {
        createCard(card.name, card.siteLink, card.imageLink, index);
    });
}

// Função para criar um card
function createCard(name, siteLink, imageLink, index) {
    const cardContainer = document.getElementById('cardContainer');
    const card = document.createElement('div');
    card.className = 'col-sm-12 col-md-6 col-lg-4 d-flex align-items-stretch mb-4';
    card.innerHTML = `
        <div class="card position-relative w-100" onclick="window.open('${siteLink}', '_blank')">
            <img src="${imageLink}" class="card-img-top" alt="Image">
            <button class="delete-btn" onclick="event.stopPropagation(); deleteCard(${index})">&times;</button>
            <button class="edit-btn" onclick="event.stopPropagation(); editCard(${index})"><i class="fas fa-edit"></i></button>
            <button class="move-btn" onclick="event.stopPropagation(); moveCard(${index})"><i class="fas fa-arrows-alt"></i></button>
            <button class="share-btn" onclick="event.stopPropagation(); shareCard('${siteLink}')"><i class="fas fa-share"></i></button>
            <div class="card-body d-flex flex-column justify-content-center align-items-center">
                <h5 class="card-title text-center">${name}</h5>
            </div>
        </div>
    `;
    card.draggable = true;
    card.ondragstart = (e) => dragStart(e, index);
    card.ondragover = (e) => dragOver(e);
    card.ondrop = (e) => drop(e, index);
    cardContainer.appendChild(card);
}

// Função para excluir um card
function deleteCard(index) {
    let cards = JSON.parse(localStorage.getItem('cards')) || [];
    cards.splice(index, 1);
    localStorage.setItem('cards', JSON.stringify(cards));
    loadCards();
}

// Função para editar um card
function editCard(index) {
    const cards = JSON.parse(localStorage.getItem('cards')) || [];
    const card = cards[index];

    // Preencher o formulário com os dados do card
    document.getElementById('cardName').value = card.name;
    document.getElementById('siteLink').value = card.siteLink;
    document.getElementById('imageLink').value = card.imageLink;

    // Exibir o formulário e os botões de cancelar e salvar edição
    document.getElementById('formRow').style.display = 'block';
    document.getElementById('showFormButton').style.display = 'none';
    document.getElementById('cancelEditButton').style.display = 'block';
    document.getElementById('saveChangesButton').style.display = 'block';
    document.getElementById('addButton').style.display = 'none';

    // Armazenar o índice do card a ser editado
    document.getElementById('saveChangesButton').setAttribute('data-index', index);
}

// Função para salvar as mudanças na edição
function saveChanges() {
    const index = document.getElementById('saveChangesButton').getAttribute('data-index');
    const cards = JSON.parse(localStorage.getItem('cards')) || [];
    cards[index] = {
        name: document.getElementById('cardName').value,
        siteLink: document.getElementById('siteLink').value,
        imageLink: document.getElementById('imageLink').value,
    };

    localStorage.setItem('cards', JSON.stringify(cards));

    closeForm();
    loadCards();
}

// Função para cancelar a edição
function cancelEdit() {
    closeForm();
}

// Função para fechar o formulário
function closeForm() {
    document.getElementById('cardForm').reset();
    document.getElementById('formRow').style.display = 'none';
    document.getElementById('showFormButton').style.display = 'block';
    document.getElementById('cancelEditButton').style.display = 'none';
    document.getElementById('saveChangesButton').style.display = 'none';
    document.getElementById('addButton').style.display = 'block';
}

// Função para iniciar o drag
function dragStart(e, index) {
    e.dataTransfer.setData('text/plain', index);
}

// Função para permitir o drop
function dragOver(e) {
    e.preventDefault();
}

// Função para realizar o drop
function drop(e, newIndex) {
    e.preventDefault();
    const oldIndex = e.dataTransfer.getData('text/plain');
    if (oldIndex === newIndex.toString()) return;

    const cards = JSON.parse(localStorage.getItem('cards')) || [];
    const movedCard = cards.splice(oldIndex, 1)[0];
    cards.splice(newIndex, 0, movedCard);

    localStorage.setItem('cards', JSON.stringify(cards));
    loadCards();
}

// Função para mover o card (simula um drag-and-drop)
function moveCard(index) {
    const targetIndex = prompt('Insira o novo índice (começando de 0) para onde deseja mover o card:', index);
    if (targetIndex === null || targetIndex === '' || isNaN(targetIndex)) return;

    const newIndex = parseInt(targetIndex);
    const cards = JSON.parse(localStorage.getItem('cards')) || [];
    if (newIndex < 0 || newIndex >= cards.length || newIndex === index) return;

    const movedCard = cards.splice(index, 1)[0];
    cards.splice(newIndex, 0, movedCard);

    localStorage.setItem('cards', JSON.stringify(cards));
    loadCards();
}

// Função para compartilhar todos os cards
function shareAllCards() {
    const cards = JSON.parse(localStorage.getItem('cards')) || [];
    const encodedCards = encodeURIComponent(JSON.stringify(cards));
    const shareLink = `${window.location.href}?cards=${encodedCards}`;

    const dummy = document.createElement('textarea');
    document.body.appendChild(dummy);
    dummy.value = shareLink;
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy);

    alert('Link copiado para a área de transferência!');
}

// Função para abrir o campo de link
function openLinkField() {
    document.getElementById('linkFieldContainer').style.display = 'block';
    document.getElementById('openLinkFieldButton').style.display = 'none';
}

// Função para carregar cards a partir de um link
function loadCardsFromLink() {
    const link = document.getElementById('linkField').value;
    const urlParams = new URLSearchParams(new URL(link).search);
    const encodedCards = urlParams.get('cards');

    if (encodedCards) {
        try {
            const newCards = JSON.parse(decodeURIComponent(encodedCards));
            const existingCards = JSON.parse(localStorage.getItem('cards')) || [];
            const allCards = existingCards.concat(newCards);

            localStorage.setItem('cards', JSON.stringify(allCards));
            loadCards();
        } catch (e) {
            alert('Link inválido ou não contém cards válidos.');
        }
    } else {
        alert('Link inválido.');
    }
}

// Adicionar evento ao botão de mostrar formulário
document.getElementById('showFormButton').addEventListener('click', () => {
    document.getElementById('formRow').style.display = 'block';
    document.getElementById('showFormButton').style.display = 'none';
});

// Adicionar evento ao formulário
document.getElementById('cardForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const cardName = document.getElementById('cardName').value;
    const siteLink = document.getElementById('siteLink').value;
    const imageLink = document.getElementById('imageLink').value;

    const cards = JSON.parse(localStorage.getItem('cards')) || [];
    cards.push({ name: cardName, siteLink, imageLink });
    localStorage.setItem('cards', JSON.stringify(cards));

    closeForm();
    loadCards();
});

// Adicionar eventos aos botões
document.getElementById('copyLinkButton').addEventListener('click', shareAllCards);
document.getElementById('openLinkFieldButton').addEventListener('click', openLinkField);
document.getElementById('loadCardsButton').addEventListener('click', loadCardsFromLink);

// Carregar os cards quando a página for carregada
window.onload = function() {
    loadCards();

    // Verificar se há cards na URL e carregar
    const urlParams = new URLSearchParams(window.location.search);
    const encodedCards = urlParams.get('cards');

    if (encodedCards) {
        try {
            const cards = JSON.parse(decodeURIComponent(encodedCards));
            localStorage.setItem('cards', JSON.stringify(cards));
            loadCards();
        } catch (e) {
            console.error('Erro ao carregar cards da URL:', e);
        }
    }
};
