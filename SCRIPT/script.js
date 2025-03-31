
        // Função para criar partículas
        function createParticles() {
            const particlesContainer = document.getElementById('particles');
            const particleCount = 30;
            
            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.classList.add('particle');
                
                // Tamanho aleatório entre 1px e 3px
                const size = Math.random() * 2 + 1;
                particle.style.width = `${size}px`;
                particle.style.height = `${size}px`;
                
                // Posição aleatória
                particle.style.left = `${Math.random() * 100}%`;
                particle.style.top = `${Math.random() * 100}%`;
                
                // Opacidade aleatória
                particle.style.opacity = Math.random() * 0.5 + 0.1;
                
                // Animação
                const duration = Math.random() * 20 + 10;
                const delay = Math.random() * 5;
                particle.style.animation = `float ${duration}s ease-in-out ${delay}s infinite alternate`;
                
                particlesContainer.appendChild(particle);
            }
        }
        
        // Chamar a função quando a página carregar
        window.addEventListener('load', createParticles);
        
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
                <div class="nexus-card position-relative w-100" onclick="window.open('${siteLink}', '_blank')">
                    <img src="${imageLink}" class="nexus-card-img" alt="Image" onerror="this.src='https://via.placeholder.com/300x200?text=Imagem+Não+Disponível'">
                    <button class="card-action-btn delete-btn" onclick="event.stopPropagation(); deleteCard(${index})"><i class="fas fa-trash"></i></button>
                    <button class="card-action-btn edit-btn" onclick="event.stopPropagation(); editCard(${index})"><i class="fas fa-edit"></i></button>
                    <button class="card-action-btn move-btn" onclick="event.stopPropagation(); moveCard(${index})"><i class="fas fa-arrows-alt"></i></button>
                    <button class="card-action-btn share-btn" onclick="event.stopPropagation(); shareCard('${siteLink}')"><i class="fas fa-share"></i></button>
                    <div class="nexus-card-body">
                        <h5 class="nexus-card-title">${name}</h5>
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
            if (confirm('Tem certeza que deseja excluir este link?')) {
                let cards = JSON.parse(localStorage.getItem('cards')) || [];
                cards.splice(index, 1);
                localStorage.setItem('cards', JSON.stringify(cards));
                loadCards();
                
                // Efeito de notificação
                showNotification('Link removido com sucesso!', 'error');
            }
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
            
            // Scroll para o formulário
            document.getElementById('formRow').scrollIntoView({ behavior: 'smooth' });
        }

        // Função para salvar as mudanças na edição
        function saveChanges() {
            const index = document.getElementById('saveChangesButton').getAttribute('data-index');
            const cardName = document.getElementById('cardName').value;
            const siteLink = document.getElementById('siteLink').value;
            const imageLink = document.getElementById('imageLink').value;

            // Validar campos
            if (!cardName || !siteLink || !imageLink) {
                showNotification('Por favor, preencha todos os campos!', 'error');
                return;
            }

            const cards = JSON.parse(localStorage.getItem('cards')) || [];
            cards[index] = {
                name: cardName,
                siteLink: siteLink,
                imageLink: imageLink,
            };

            localStorage.setItem('cards', JSON.stringify(cards));

            closeForm();
            loadCards();
            
            // Efeito de notificação
            showNotification('Alterações salvas com sucesso!', 'success');
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
            e.currentTarget.style.opacity = '0.5';
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
            
            // Resetar opacidade
            document.querySelectorAll('.nexus-card').forEach(card => {
                card.style.opacity = '1';
            });
        }

        // Função para mover o card (simula um drag-and-drop)
        function moveCard(index) {
            const cards = JSON.parse(localStorage.getItem('cards')) || [];
            const targetIndex = prompt(`Insira a nova posição (1-${cards.length}):`, index + 1);
            if (targetIndex === null || targetIndex === '' || isNaN(targetIndex)) return;

            const newIndex = parseInt(targetIndex) - 1;
            if (newIndex < 0 || newIndex >= cards.length || newIndex === index) return;

            const movedCard = cards.splice(index, 1)[0];
            cards.splice(newIndex, 0, movedCard);

            localStorage.setItem('cards', JSON.stringify(cards));
            loadCards();
            
            showNotification(`Link movido para a posição ${newIndex + 1}`, 'info');
        }

        // Função para compartilhar um card individual
        function shareCard(link) {
            if (navigator.share) {
                navigator.share({
                    title: 'Confira este link',
                    text: 'Eu encontrei este link interessante no NexusTab:',
                    url: link
                }).catch(err => {
                    console.log('Erro ao compartilhar:', err);
                    copyToClipboard(link);
                });
            } else {
                copyToClipboard(link);
            }
        }

        // Função para compartilhar todos os cards
        function shareAllCards() {
            const cards = JSON.parse(localStorage.getItem('cards')) || [];
            if (cards.length === 0) {
                showNotification('Nenhum link para compartilhar!', 'error');
                return;
            }
            
            const encodedCards = encodeURIComponent(JSON.stringify(cards));
            const shareLink = `${window.location.href.split('?')[0]}?cards=${encodedCards}`;

            if (navigator.share) {
                navigator.share({
                    title: 'Meus Links no NexusTab',
                    text: 'Confira minha coleção de links organizados:',
                    url: shareLink
                }).catch(err => {
                    console.log('Erro ao compartilhar:', err);
                    copyToClipboard(shareLink);
                });
            } else {
                copyToClipboard(shareLink);
            }
        }

        // Função auxiliar para copiar para a área de transferência
        function copyToClipboard(text) {
            const dummy = document.createElement('textarea');
            document.body.appendChild(dummy);
            dummy.value = text;
            dummy.select();
            document.execCommand('copy');
            document.body.removeChild(dummy);
            
            showNotification('Link copiado para a área de transferência!', 'success');
        }

        // Função para mostrar notificações
        function showNotification(message, type) {
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            notification.textContent = message;
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.classList.add('show');
            }, 10);
            
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 300);
            }, 3000);
        }

        // Função para abrir o campo de link
        function openLinkField() {
            document.getElementById('linkFieldContainer').style.display = 'block';
            document.getElementById('openLinkFieldButton').style.display = 'none';
        }

        // Função para carregar cards a partir de um link
        function loadCardsFromLink() {
            const link = document.getElementById('linkField').value.trim();
            if (!link) {
                showNotification('Por favor, insira um link válido', 'error');
                return;
            }

            try {
                const url = new URL(link);
                const urlParams = new URLSearchParams(url.search);
                const encodedCards = urlParams.get('cards');

                if (encodedCards) {
                    const newCards = JSON.parse(decodeURIComponent(encodedCards));
                    const existingCards = JSON.parse(localStorage.getItem('cards')) || [];
                    const allCards = existingCards.concat(newCards);

                    localStorage.setItem('cards', JSON.stringify(allCards));
                    loadCards();
                    showNotification(`${newCards.length} links adicionados com sucesso!`, 'success');
                    
                    // Resetar o campo
                    document.getElementById('linkField').value = '';
                    document.getElementById('linkFieldContainer').style.display = 'none';
                    document.getElementById('openLinkFieldButton').style.display = 'inline-block';
                } else {
                    showNotification('O link não contém dados de cards válidos', 'error');
                }
            } catch (e) {
                showNotification('Link inválido ou não contém cards válidos', 'error');
                console.error('Erro ao processar o link:', e);
            }
        }

        // Adicionar evento ao botão de mostrar formulário
        document.getElementById('showFormButton').addEventListener('click', () => {
            document.getElementById('formRow').style.display = 'block';
            document.getElementById('showFormButton').style.display = 'none';
            document.getElementById('formRow').scrollIntoView({ behavior: 'smooth' });
        });

        // Adicionar evento ao formulário
        document.getElementById('cardForm').addEventListener('submit', (e) => {
            e.preventDefault();

            const cardName = document.getElementById('cardName').value;
            const siteLink = document.getElementById('siteLink').value;
            const imageLink = document.getElementById('imageLink').value;

            // Validar campos
            if (!cardName || !siteLink || !imageLink) {
                showNotification('Por favor, preencha todos os campos!', 'error');
                return;
            }

            // Validar URL do site
            try {
                new URL(siteLink);
            } catch (e) {
                showNotification('Por favor, insira uma URL válida para o site', 'error');
                return;
            }

            // Validar URL da imagem
            try {
                new URL(imageLink);
            } catch (e) {
                showNotification('Por favor, insira uma URL válida para a imagem', 'error');
                return;
            }

            const cards = JSON.parse(localStorage.getItem('cards')) || [];
            cards.push({ name: cardName, siteLink, imageLink });
            localStorage.setItem('cards', JSON.stringify(cards));

            closeForm();
            loadCards();
            
            showNotification('Link adicionado com sucesso!', 'success');
        });

        // Adicionar eventos aos botões
        document.getElementById('copyLinkButton').addEventListener('click', shareAllCards);
        document.getElementById('openLinkFieldButton').addEventListener('click', openLinkField);
        document.getElementById('loadCardsButton').addEventListener('click', loadCardsFromLink);

        // Carregar os cards quando a página for carregada
        document.addEventListener('DOMContentLoaded', function() {
            loadCards();

            // Verificar se há cards na URL e carregar
            const urlParams = new URLSearchParams(window.location.search);
            const encodedCards = urlParams.get('cards');

            if (encodedCards) {
                try {
                    const cards = JSON.parse(decodeURIComponent(encodedCards));
                    localStorage.setItem('cards', JSON.stringify(cards));
                    loadCards();
                    showNotification(`${cards.length} links carregados com sucesso!`, 'success');
                } catch (e) {
                    console.error('Erro ao carregar cards da URL:', e);
                }
            }
        });
