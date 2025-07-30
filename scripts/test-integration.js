// scripts/test-integration.js - Script de teste da integração

const { checkApiHealth, getApiInfo } = require('../config/api');

console.log('🧪 Testando integração com API backend...');
console.log('='.repeat(60));

async function testIntegration() {
    let allTestsPassed = true;
    const testResults = {
        apiHealth: false,
        proxyEndpoints: [],
        monitoringEndpoints: []
    };

    try {
        // 1. Verificar configuração
        console.log('1. Verificando configuração da API...');
        const apiInfo = getApiInfo();
        console.log(`   ✅ API Target: ${apiInfo.target}`);
        console.log(`   ✅ Timeouts: ${apiInfo.timeouts.api}ms (API), ${apiInfo.timeouts.health}ms (Health)`);
        
        // 2. Verificar saúde da API
        console.log('\n2. Verificando saúde da API...');
        const healthResult = await checkApiHealth();
        
        if (healthResult.status === 'ok') {
            console.log('   ✅ API está funcionando!');
            testResults.apiHealth = true;
        } else {
            console.log('   ❌ API não está disponível');
            console.log(`   💡 Erro: ${healthResult.error}`);
            console.log('\n📋 Para resolver:');
            console.log('   1. Inicie a API do Desafio 3:');
            console.log('      cd ../mentoria_testes_desafio_03');
            console.log('      npm start');
            console.log('   2. Execute este teste novamente');
            allTestsPassed = false;
        }
        
        // 3. Testar endpoints do proxy
        console.log('\n3. Testando endpoints do proxy...');
        
        const endpoints = [
            { path: '/login', method: 'POST', data: { username: 'user@email.com', password: 'User12345678!' } },
            { path: '/remember-password', method: 'POST', data: { username: 'user@email.com' } }
        ];
        
        for (const endpoint of endpoints) {
            try {
                const response = await fetch(`http://localhost:8080${endpoint.path}`, {
                    method: endpoint.method,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(endpoint.data)
                });
                
                const success = response.ok || response.status === 401; // 401 é esperado para credenciais inválidas
                console.log(`   ${success ? '✅' : '❌'} ${endpoint.method} ${endpoint.path} - ${response.status}`);
                testResults.proxyEndpoints.push({ endpoint: endpoint.path, success });
                
                if (!success) {
                    allTestsPassed = false;
                }
            } catch (error) {
                console.log(`   ❌ ${endpoint.method} ${endpoint.path} - Erro: ${error.message}`);
                testResults.proxyEndpoints.push({ endpoint: endpoint.path, success: false });
                allTestsPassed = false;
            }
        }
        
        // 4. Testar endpoints de monitoramento
        console.log('\n4. Testando endpoints de monitoramento...');
        
        const monitoringEndpoints = [
            '/health',
            '/api-config',
            '/api-status',
            '/system-info'
        ];
        
        for (const endpoint of monitoringEndpoints) {
            try {
                const response = await fetch(`http://localhost:8080${endpoint}`);
                
                if (response.ok) {
                    const data = await response.json();
                    console.log(`   ✅ GET ${endpoint} - ${response.status}`);
                    if (endpoint === '/api-config') {
                        console.log(`      📍 API Host: ${data.host}:${data.port}`);
                    }
                    testResults.monitoringEndpoints.push({ endpoint, success: true });
                } else {
                    console.log(`   ❌ GET ${endpoint} - ${response.status}`);
                    testResults.monitoringEndpoints.push({ endpoint, success: false });
                    allTestsPassed = false;
                }
            } catch (error) {
                console.log(`   ❌ GET ${endpoint} - Erro: ${error.message}`);
                testResults.monitoringEndpoints.push({ endpoint, success: false });
                allTestsPassed = false;
            }
        }
        
        // 5. Verificar se o servidor frontend está rodando
        console.log('\n5. Verificando se o servidor frontend está rodando...');
        try {
            const response = await fetch('http://localhost:8080/health');
            if (response.ok) {
                console.log('   ✅ Servidor frontend está rodando!');
            } else {
                console.log('   ❌ Servidor frontend não está respondendo corretamente');
                allTestsPassed = false;
            }
        } catch (error) {
            console.log('   ❌ Servidor frontend não está disponível');
            console.log('   💡 Inicie o servidor: npm start');
            allTestsPassed = false;
        }
        
        // 6. Resumo dos resultados
        console.log('\n' + '='.repeat(60));
        console.log('📊 RESUMO DOS TESTES');
        console.log('='.repeat(60));
        
        console.log(`API Health: ${testResults.apiHealth ? '✅' : '❌'}`);
        console.log(`Proxy Endpoints: ${testResults.proxyEndpoints.filter(t => t.success).length}/${testResults.proxyEndpoints.length} ✅`);
        console.log(`Monitoring Endpoints: ${testResults.monitoringEndpoints.filter(t => t.success).length}/${testResults.monitoringEndpoints.length} ✅`);
        
        if (allTestsPassed) {
            console.log('\n🎉 Todos os testes passaram!');
            console.log('='.repeat(60));
            console.log('📋 Próximos passos:');
            console.log('   1. Acesse: http://localhost:8080');
            console.log('   2. Teste o login com as credenciais:');
            console.log('      admin@email.com / Admin123456!');
            console.log('   3. Execute os testes E2E: npm test');
            console.log('='.repeat(60));
        } else {
            console.log('\n❌ Alguns testes falharam!');
            console.log('='.repeat(60));
            console.log('📋 Para resolver:');
            console.log('   1. Verifique se a API está rodando: cd ../mentoria_testes_desafio_03 && npm start');
            console.log('   2. Verifique se o frontend está rodando: npm start');
            console.log('   3. Execute este teste novamente');
            console.log('='.repeat(60));
        }
        
        return allTestsPassed;
        
    } catch (error) {
        console.error('❌ Erro fatal durante os testes:', error.message);
        console.log('='.repeat(60));
        console.log('📋 Para resolver:');
        console.log('   1. Verifique se ambos os serviços estão rodando');
        console.log('   2. Verifique as portas 3000 e 8080');
        console.log('   3. Execute este teste novamente');
        console.log('='.repeat(60));
        return false;
    }
}

// Executa os testes
testIntegration().then(success => {
    process.exit(success ? 0 : 1);
}); 