// scripts/start-dev.js - Script de inicialização para desenvolvimento

const { spawn } = require('child_process');
const { checkApiHealth, getApiInfo } = require('../config/api');

console.log('🚀 Iniciando ambiente de desenvolvimento...');
console.log('='.repeat(60));

// Função para verificar se a API está rodando
async function checkApiStatus() {
    try {
        console.log('🔍 Verificando status da API backend...');
        const apiInfo = getApiInfo();
        console.log(`📍 API Target: ${apiInfo.target}`);
        
        const healthResult = await checkApiHealth();
        
        if (healthResult.status === 'ok') {
            console.log('✅ API backend está funcionando!');
            return true;
        } else {
            console.log('❌ API backend não está disponível');
            console.log(`💡 Certifique-se de que a API está rodando em: ${apiInfo.target}`);
            return false;
        }
    } catch (error) {
        console.log('❌ Erro ao verificar API:', error.message);
        return false;
    }
}

// Função para mostrar instruções
function showInstructions() {
    console.log('\n📋 Instruções para iniciar o ambiente completo:');
    console.log('='.repeat(60));
    console.log('1. Inicie a API backend (Desafio 3):');
    console.log('   cd ../mentoria_testes_desafio_03');
    console.log('   npm install');
    console.log('   npm start');
    console.log('');
    console.log('2. Em outro terminal, inicie o frontend (Desafio 4):');
    console.log('   cd mentoria_testes_desafio_04');
    console.log('   npm start');
    console.log('');
    console.log('3. Acesse a aplicação:');
    console.log('   Frontend: http://localhost:8080');
    console.log('   API Docs: http://localhost:3000/api-docs');
    console.log('='.repeat(60));
}

// Função principal
async function main() {
    const apiRunning = await checkApiStatus();
    
    if (!apiRunning) {
        console.log('\n⚠️  API backend não está disponível!');
        showInstructions();
        process.exit(1);
    }
    
    console.log('\n✅ Ambiente pronto! Iniciando servidor frontend...');
    console.log('='.repeat(60));
    
    // Inicia o servidor
    const server = spawn('node', ['server.js'], {
        stdio: 'inherit',
        cwd: process.cwd()
    });
    
    server.on('error', (error) => {
        console.error('❌ Erro ao iniciar servidor:', error);
        process.exit(1);
    });
    
    server.on('exit', (code) => {
        console.log(`\n🛑 Servidor finalizado com código: ${code}`);
        process.exit(code);
    });
    
    // Tratamento de sinais para encerramento gracioso
    process.on('SIGINT', () => {
        console.log('\n🛑 Recebido SIGINT, encerrando servidor...');
        server.kill('SIGINT');
    });
    
    process.on('SIGTERM', () => {
        console.log('\n🛑 Recebido SIGTERM, encerrando servidor...');
        server.kill('SIGTERM');
    });
}

// Executa o script
main().catch(error => {
    console.error('❌ Erro fatal:', error);
    process.exit(1);
}); 