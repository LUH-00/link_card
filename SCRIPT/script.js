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
    card.className = 'col-sm-12 col-md-6 col-lg-4 d-flex align-items-stretch mb-4'; // Adiciona a classe mb-4 para margem inferior
    card.innerHTML = `
        <div class="card position-relative w-100">
            <button class="delete-btn" onclick="deleteCard(${index})">&times;</button>
            <img src="${imageLink}" class="card-img-top" alt="Image">
            <div class="card-body d-flex flex-column justify-content-center align-items-center">
                <h5 class="card-title text-center">${name}</h5>
                <a href="${siteLink}" target="_blank" class="btn btn-primary btn-block mt-3">Visitar Site</a>
            </div>
        </div>
    `;
    cardContainer.appendChild(card);
}

// Função para excluir um card
function deleteCard(index) {
    let cards = JSON.parse(localStorage.getItem('cards')) || [];
    cards.splice(index, 1);
    localStorage.setItem('cards', JSON.stringify(cards));
    loadCards();
}

// Carregar os cards quando a página for carregada
window.onload = loadCards;

document.getElementById('cardForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('cardName').value;
    const siteLink = document.getElementById('siteLink').value;
    const imageLink = document.getElementById('imageLink').value;

    const cards = JSON.parse(localStorage.getItem('cards')) || [];
    cards.push({ name, siteLink, imageLink });
    localStorage.setItem('cards', JSON.stringify(cards));

    createCard(name, siteLink, imageLink, cards.length - 1);

    // Limpar o formulário
    document.getElementById('cardForm').reset();
    document.getElementById('formRow').style.display = 'none';
    document.getElementById('showFormButton').style.display = 'block';
});

// Mostrar o formulário quando o botão "Adicionar Card" for clicado
document.getElementById('showFormButton').addEventListener('click', function() {
    document.getElementById('formRow').style.display = 'block';
    document.getElementById('showFormButton').style.display = 'none';
});
