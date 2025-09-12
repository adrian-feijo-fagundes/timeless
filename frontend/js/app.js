/*
// Configuração do SSE
const eventSource = new EventSource('http://localhost:3000/events');

// Elementos do DOM
const connectionStatus = document.getElementById('connection-status');
const notificationsList = document.getElementById('notifications-list');
const jobsList = document.getElementById('jobs-list');
const clearButton = document.getElementById('clear-notifications');
const testButton = document.getElementById('test-notification');

// Estado da aplicação
let notificationCount = 0;

// Event Listeners
eventSource.onopen = () => {
    console.log('Conectado ao servidor (SSE)');
    updateConnectionStatus(true);
};

eventSource.onerror = () => {
    console.log('Erro ou desconexão do servidor (SSE)');
    updateConnectionStatus(false);
};

// Recebendo eventos personalizados
eventSource.addEventListener('notification', (event) => {
    const data = JSON.parse(event.data);
    console.log('Nova notificação recebida:', data);
    addNotification(data);
});

eventSource.addEventListener('jobs-list', (event) => {
    const jobs = JSON.parse(event.data);
    console.log('Lista de jobs recebida:', jobs);
    updateJobsList(jobs);
});

// Funções
function updateConnectionStatus(connected) {
    if (connected) {
        connectionStatus.textContent = 'Conectado';
        connectionStatus.className = 'status-indicator connected';
    } else {
        connectionStatus.textContent = 'Desconectado';
    connectionStatus.className = 'status-indicator disconnected';
}
}

function addNotification(data) {
    notificationCount++;
    
    const notificationItem = document.createElement('div');
    notificationItem.className = `notification-item ${data.type}`;
    
    const time = new Date(data.timestamp).toLocaleString('pt-BR');
    
    notificationItem.innerHTML = `
    <div><strong>#${notificationCount}</strong> - ${data.message}</div>
    <div class="notification-time">${time}</div>
    ${data.data ? `<div><small>Dados: ${JSON.stringify(data.data)}</small></div>` : ''}
    `;
    
    notificationsList.insertBefore(notificationItem, notificationsList.firstChild);
    
    // Limita a 50 notificações
    while (notificationsList.children.length > 50) {
        notificationsList.removeChild(notificationsList.lastChild);
    }
}

function updateJobsList(jobs) {
    jobsList.innerHTML = '';
    
    if (jobs.length === 0) {
        jobsList.innerHTML = '<p>Nenhum job ativo</p>';
        return;
    }
    
    jobs.forEach(job => {
        const jobItem = document.createElement('div');
        jobItem.className = 'job-item';
        
        jobItem.innerHTML = `
        <div class="job-name">${job.name}</div>
        <div class="job-schedule">${job.schedule}</div>
        <div class="job-status ${job.isRunning ? 'running' : 'stopped'}">
        ${job.isRunning ? 'Executando' : 'Parado'}
        </div>
        `;
        
        jobsList.appendChild(jobItem);
    });
}

function clearNotifications() {
    notificationsList.innerHTML = '';
    notificationCount = 0;
}

function testNotification() {
    const testData = {
        type: 'info',
        message: 'Notificação de teste do frontend',
        data: { source: 'frontend', timestamp: new Date().toISOString() },
        timestamp: new Date().toISOString()
    };
    
    addNotification(testData);
}

// Event listeners para os botões
clearButton.addEventListener('click', clearNotifications);
testButton.addEventListener('click', testNotification);

// Inicialização
console.log('Aplicação inicializada. Aguardando eventos SSE...');

*/