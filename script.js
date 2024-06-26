const BASE_URL = 'https://my-json-server.typicode.com/<seu_usuario_github>/<seu_repositorio>';

let motores = [];
let contagemMotores = 0;

// Função para carregar os motores do servidor
async function carregarMotores() {
    try {
        const response = await fetch(`${BASE_URL}/motores`);
        if (!response.ok) {
            throw new Error('Não foi possível carregar os motores');
        }
        motores = await response.json();
        exibirMotores();
        atualizarTotalMotores();
    } catch (error) {
        console.error('Erro ao carregar os motores:', error.message);
    }
}

// Função para adicionar um motor
async function adicionarMotor() {
    const cv = document.getElementById('cv').value;
    const rpm = document.getElementById('rpm').value;
    const posicao = document.getElementById('posicao').value;
    const modelo = document.getElementById('modelo').value;
    const isolamento = document.getElementById('isolamento').value;
    const defletora = document.getElementById('defletora').value;
    const ventoinha = document.getElementById('ventoinha').value;
    const rotor = document.getElementById('rotor').value;
    
    if (cv && rpm && posicao && modelo && isolamento && defletora && ventoinha && rotor) {
        const motor = { 
            cv: cv, 
            rpm: rpm, 
            posicao: posicao, 
            modelo: modelo,
            condicoes: { 
                isolamento: isolamento, 
                defletora: defletora, 
                ventoinha: ventoinha, 
                rotor: rotor 
            } 
        };
        
        try {
            const response = await fetch(`${BASE_URL}/motores`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(motor),
            });

            if (!response.ok) {
                throw new Error('Não foi possível adicionar o motor');
            }

            motores.push(motor);
            exibirMotores();
            atualizarTotalMotores();
        } catch (error) {
            console.error('Erro ao adicionar o motor:', error.message);
        }
    }
}

// Função para determinar a condição geral do motor
function determinarCondicao(motor) {
    const condicoes = motor.condicoes;
    return condicoes.isolamento === 'bom' &&
           condicoes.defletora === 'bom' &&
           condicoes.ventoinha === 'bom' &&
           condicoes.rotor === 'bom' ? 'good' : 'bad';
}

// Função para exibir os motores na lista
function exibirMotores() {
    const listaMotores = document.getElementById('motores');
    listaMotores.innerHTML = '';
    
    motores.forEach((motor, index) => {
        const condicaoGeral = determinarCondicao(motor);
        const itemLista = document.createElement('li');
        itemLista.innerHTML = `
            <div>
                <p><strong>Motor:</strong> Modelo: ${motor.modelo}, CV: ${motor.cv}, RPM: ${motor.rpm}, Posição: ${motor.posicao}</p>
                <div class="engine-info">
                    <p><strong>Isolamento:</strong> ${motor.condicoes.isolamento}</p>
                    <p><strong>Defletora:</strong> ${motor.condicoes.defletora}</p>
                    <p><strong>Ventoinha:</strong> ${motor.condicoes.ventoinha}</p>
                    <p><strong>Rotor:</strong> ${motor.condicoes.rotor}</p>
                </div>
            </div>
            <button onclick="removerMotor(${index})">Remover</button>
        `;
        itemLista.classList.add(condicaoGeral);
        listaMotores.appendChild(itemLista);
    });
}

// Função para remover um motor da lista
async function removerMotor(index) {
    try {
        const response = await fetch(`${BASE_URL}/motores/${index}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Não foi possível remover o motor');
        }

        motores.splice(index, 1);
        exibirMotores();
        atualizarTotalMotores();
    } catch (error) {
        console.error('Erro ao remover o motor:', error.message);
    }
}

// Função para atualizar o contador de motores
function atualizarTotalMotores() {
    contagemMotores = motores.length;
    document.getElementById('contagem-motores').textContent = contagemMotores;
}

// Carregar os motores ao carregar a página
carregarMotores();
