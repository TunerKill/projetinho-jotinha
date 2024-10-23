document.addEventListener('DOMContentLoaded', () => {
    // Seleciona os elementos dos modais
    const modal = document.getElementById('modal');
    const openModalBtn = document.getElementById('openModalBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');

    const newTableModal = document.getElementById('newTableModal');
    const openNewTableModalBtn = document.getElementById('openNewTableModalBtn');
    const closeNewTableModalBtn = document.getElementById('closeNewTableModalBtn');

    // Funções para abrir e fechar os modais
    openModalBtn.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    closeModalBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    openNewTableModalBtn.addEventListener('click', () => {
        newTableModal.style.display = 'block';
    });

    closeNewTableModalBtn.addEventListener('click', () => {
        newTableModal.style.display = 'none';
    });

    // Fecha os modais ao clicar fora do conteúdo
    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
        if (event.target == newTableModal) {
            newTableModal.style.display = 'none';
        }
    });

    // Manipula o envio do formulário para adicionar registros
    document.getElementById('dataForm').addEventListener('submit', function (event) {
        event.preventDefault();
        addRow();
        modal.style.display = 'none'; // Fecha o modal após adicionar
    });

    function addRow() {
        const empresa = document.getElementById('empresa').value.trim();
        localStorage.setItem('empresaSelecionada', document.getElementById('empresa').value);

        const cidade = document.getElementById('cidade').value.trim();
        const contribuicaoInput = document.getElementById('contribuicao').value.trim();
        const contribuicao = parseFloat(contribuicaoInput.replace(',', '.'));

        const contrato = document.getElementById('contrato').value;

        if (!contrato) {
            alert('Por favor, selecione um contrato.');
            return;
        }

        if (!empresa || !cidade || isNaN(contribuicao)) {
            alert('Por favor, preencha todos os campos obrigatórios com valores válidos.');
            return;
        }

        // Encontrar a tabela correta com base no contrato selecionado
        const tableBody = document.querySelector(`#tabela-${contrato} tbody`);
        if (!tableBody) {
            alert('Tabela do contrato selecionado não encontrada.');
            return;
        }
        const table = tableBody.parentElement; // Obtém a tabela

        const newRow = tableBody.insertRow();

        // Adicionar as células com conteúdo e botões
        newRow.innerHTML = `
            <td class="editable">${empresa}</td>
            <td class="editable">${cidade}</td>
            <td class="editable">${contribuicao.toFixed(2).replace('.', ',')}</td>
            <td class="action-buttons">
                <button class="edit-btn material-symbols-outlined">edit</button>
                <button style="display:none" class="save-btn material-symbols-outlined">save</button>
                <button class="delete-btn material-symbols-outlined">delete</button>
            </td>
        `;

        // Atualizar o total
        updateTotal(table);

        // Limpar o formulário
        document.getElementById('dataForm').reset();
    }

    // Manipula o envio do formulário para adicionar nova tabela
    document.getElementById('newTableForm').addEventListener('submit', function (event) {
        event.preventDefault();
        const novoContratoNome = document.getElementById('novoContratoNome').value.trim();
        const selectedColor = document.getElementById('tableColor').value; // Obter a cor selecionada

        if (!novoContratoNome) {
            alert('Por favor, insira o nome do contrato.');
            return;
        }

        // Cria um ID único para a nova tabela, baseado no nome do contrato
        const contratoIdSuffix = novoContratoNome.toLowerCase().replace(/\s+/g, '-');
        const contratoId = `tabela-${contratoIdSuffix}`;

         // Verifica se uma tabela com o mesmo nome já existe
         if (document.getElementById(contratoId)) {
            alert('Uma tabela com este nome já existe.');
            return;
        }


        // Cria os elementos HTML para a nova tabela
        const tabelaContratoDiv = document.createElement('div');
        tabelaContratoDiv.classList.add('tabela-contrato');
        tabelaContratoDiv.id = contratoId; // Adicione o ID aqui

        const header = document.createElement('h3');
        header.classList.add('collapsible-header');
        header.style.backgroundColor = selectedColor; // Aplica a cor selecionada no cabeçalho
        header.innerHTML = `<div style="display: flex; justify-content: space-between; align-items: center;">
                <span class="expandir material-symbols-outlined">expand_more</span>${novoContratoNome} 
                    <span class="delete material-symbols-outlined delete-icon">delete</span></div>
                    `;

        // Adiciona um evento de clique ao ícone de lixeira
        header.querySelector('.delete-icon').addEventListener('click', function () {
            if (confirm('Tem certeza de que deseja excluir esta tabela?')) {
                // Obtém o sufixo do ID da tabela
                const contratoIdSuffix = contratoId.split('-')[1];
                const contratoSelect = document.getElementById('contrato');

                // Remove a opção correspondente do select
                const optionToRemove = Array.from(contratoSelect.options).find(option => option.value === contratoIdSuffix);
                if (optionToRemove) {
                    contratoSelect.remove(optionToRemove.index);
                }

                tabelaContratoDiv.remove(); // Remove a tabela
            }
        });
        const collapsibleContent = document.createElement('div');
        collapsibleContent.classList.add('collapsible-content');
        collapsibleContent.id = contratoId;
        collapsibleContent.style.display = 'none';

        const table = document.createElement('table');

        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th>Empresa</th>
                <th>Cidade</th>
                <th>Contribuição</th>
                <th>Ações</th>
            </tr>
        `;
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        table.appendChild(tbody);

        // Adicione o tfoot
        const tfoot = document.createElement('tfoot');
        tfoot.innerHTML = `
            <tr>
                <td class="total-contribuicao2" colspan="2">Somatório</td>
                <td class="total-contribuicao">0,00</td>
                <td></td>
            </tr>
        `;
        table.appendChild(tfoot);

        collapsibleContent.appendChild(table);
        tabelaContratoDiv.appendChild(header);
        tabelaContratoDiv.appendChild(collapsibleContent);

        // Adiciona a nova tabela ao conteúdo principal
        const mainContent = document.getElementById('mainContent');
        mainContent.appendChild(tabelaContratoDiv);

        // Fecha o modal de adicionar nova tabela
        newTableModal.style.display = 'none';

        // Adiciona o event listener para o novo cabeçalho colapsável
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;

            // Alterna entre exibir e ocultar o conteúdo
            if (content.style.display === "none" || content.style.display === "") {
                content.style.display = "block";
            } else {
                content.style.display = "none";
            }

            // Alterna a classe 'active' para o cabeçalho
            header.classList.toggle('active');
        });

        // Adiciona uma nova opção ao select de contratos no modal de adicionar empresa
        const contratoSelect = document.getElementById('contrato');
        const newOption = document.createElement('option');
        newOption.value = contratoIdSuffix; // Valor deve corresponder ao sufixo usado no ID da tabela
        newOption.textContent = novoContratoNome;
        contratoSelect.appendChild(newOption);

        alert(`Tabela "${novoContratoNome}" adicionada com sucesso!`);

    });

    // Manipula eventos de clique para edição, salvamento e exclusão de linhas
    document.addEventListener('click', function (event) {
        if (event.target.classList.contains('edit-btn')) {
            const row = event.target.closest('tr');
            const cells = row.querySelectorAll('.editable');
            cells.forEach(function (cell) {
                const text = cell.innerText;
                cell.innerHTML = `<input type="text" value="${text}">`;
            });
            row.querySelector('.edit-btn').style.display = 'none';
            row.querySelector('.save-btn').style.display = 'inline-block';
        }

        if (event.target.classList.contains('save-btn')) {
            const row = event.target.closest('tr');
            const table = row.closest('table');
            const cells = row.querySelectorAll('.editable');
            let valid = true;

            cells.forEach(function (cell, index) {
                const input = cell.querySelector('input');
                let value = input.value.trim();

                if (index === 2) { // 3ª coluna: Contribuição
                    const num = parseFloat(value.replace(',', '.'));
                    if (isNaN(num)) {
                        alert('A contribuição deve ser um número válido.');
                        valid = false;
                        return;
                    }
                    value = num.toFixed(2).replace('.', ','); // Formata com vírgula
                }

                cell.innerText = value;
            });

            if (!valid) return;

            row.querySelector('.edit-btn').style.display = 'inline-block';
            row.querySelector('.save-btn').style.display = 'none';

            // Atualizar o total após edição
            updateTotal(table);
        }

        if (event.target.classList.contains('delete-btn')) {
            if (confirm('Tem certeza de que deseja excluir este registro?')) {
                const row = event.target.closest('tr');
                const table = row.closest('table');
                row.remove();
                updateTotal(table);
            }
        }
    });

    // Seleciona o ícone de hambúrguer e o menu lateral
    const hamburguerBtn = document.getElementById('hamburguerBtn');
    const sideMenu = document.getElementById('sideMenu');

    // Adiciona um evento de clique ao ícone de hambúrguer
    hamburguerBtn.addEventListener('click', function () {
        // Alterna a classe 'active' para o menu lateral
        sideMenu.classList.toggle('active');

        // Também alterna a classe 'active' para o ícone de hambúrguer para animação
        hamburguerBtn.classList.toggle('active');

        // Alterna a margem do conteúdo principal para acomodar o menu
        const mainContent = document.getElementById('mainContent');
        if (sideMenu.classList.contains('active')) {
            mainContent.style.transform = 'translateX(250px)';
        } else {
            mainContent.style.transform = 'translateX(0)';
        }
    });

    // Função para colapsar/expandir as seções existentes
    document.querySelectorAll('.collapsible-header').forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;

            // Alterna entre exibir e ocultar o conteúdo
            if (content.style.display === "none" || content.style.display === "") {
                content.style.display = "block";
            } else {
                content.style.display = "none";
            }

            // Alterna a classe 'active' para o cabeçalho
            header.classList.toggle('active');
        });
    });

    // Função para atualizar o total das contribuições em uma tabela
    function updateTotal(table) {
        let total = 0;
        const tbody = table.querySelector('tbody');
        const contribCells = tbody.querySelectorAll('td:nth-child(3)'); // 3ª coluna: Contribuição

        contribCells.forEach(cell => {
            // Substitui a vírgula por ponto para parseFloat
            const value = parseFloat(cell.textContent.replace(',', '.')) || 0;
            total += value;
        });

        const tfoot = table.querySelector('tfoot');
        if (tfoot) {
            const totalCell = tfoot.querySelector('.total-contribuicao');
            // Formata o total com vírgula e duas casas decimais
            totalCell.textContent = total.toFixed(2).replace('.', ',');
        }
    }
});
