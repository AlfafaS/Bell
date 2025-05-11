const qrcode = require('qrcode-terminal');
const { Client, MessageMedia } = require('whatsapp-web.js');

const client = new Client();
const path = require('path');
const fs = require('fs');
client.initialize();

client.on('qr', qr => qrcode.generate(qr, { small: true }));
client.on('ready', () => console.log('✅ WhatsApp conectado.'));

const delay = ms => new Promise(res => setTimeout(res, ms));
const userStates = {};
const userTimeouts = {};
const userLastStates = {};
const autoFormTimeouts = {};
const secondInactivityTimeouts = {};
const finalInactivityTimeouts = {};


// °°°°° PERGUNTAS FREQUENTES - P:_R: °°°°° PERGUNTAS FREQUENTES - P:_R: °°°°° PERGUNTAS FREQUENTES - P:_R: °°°°° PERGUNTAS FREQUENTES - P:_R: °°°°°
const perguntasFrequentes = {
    '1': { // °°°°° Automóvel °°°°° Automóvel °°°°° Automóvel °°°°° Automóvel °°°°° Automóvel 
        nome: '🚗 Automóvel',
        audioPerguntas: 'E:\\RM-CPM\\ChatBot Whatsapp\\Áudios\\FAQ\\auto_perguntas.mp3', // Áudio que lista todas as perguntas
        perguntas: {
            '1': {
                pergunta: "Quais fatores interferem no valor do meu Seguro Auto?",
                resposta: "Marca, modelo, ano, local de circulação, idade do condutor, coberturas contratadas e valor da franquia influenciam no valor. 📊",
                audioResposta: 'E:\\RM-CPM\\ChatBot Whatsapp\\Áudios\\FAQ\\auto_resposta1.mp3'
            },
            '2': {
                pergunta: "O que é franquia de seguro?",
                resposta: "É o valor que você paga em caso de sinistro com perda parcial, conforme previsto na apólice. 💸",
                audioResposta: 'E:\\RM-CPM\\ChatBot Whatsapp\\Áudios\\FAQ\\auto_resposta2.mp3'
            },
            '3': {
                pergunta: "Quais os locais de abrangência do Seguro Auto?",
                resposta: "Cobertura em todo o Brasil 🇧🇷 e, com a Carta Verde, também em países do Mercosul. 🌎",
                audioResposta: 'E:\\RM-CPM\\ChatBot Whatsapp\\Áudios\\FAQ\\auto_resposta3.mp3'
            },
            '4': {
                pergunta: "É possível fazer o seguro de um carro que não está no meu nome?",
                resposta: "Sim, desde que informado no momento da contratação. ✅",
                audioResposta: 'E:\\RM-CPM\\ChatBot Whatsapp\\Áudios\\FAQ\\auto_resposta4.mp3'
            },
            '5': {
                pergunta: "Quantas vezes posso acionar o meu seguro?",
                resposta: "Perda parcial: sem limite. Perda total: uma vez por ano. Serviços assistenciais variam por seguradora. 🔁",
                audioResposta: 'E:\\RM-CPM\\ChatBot Whatsapp\\Áudios\\FAQ\\auto_resposta5.mp3'
            }
        }
    },
    
        '2': { // °°°°° Residencial °°°°° Residencial °°°°° Residencial °°°°° Residencial °°°°° Residencial 
        nome: '🏡 Residencial',
        audioPerguntas: 'E:\\RM-CPM\\ChatBot Whatsapp\\Áudios\\FAQ\\residencial_perguntas.mp3', // Áudio que lista todas as perguntas
        perguntas: {
            '1': {
                pergunta: "Como funciona o seguro residencial?",
                resposta: "Protege o imóvel e os bens com coberturas e assistências personalizadas. 🔧",
                audioResposta: 'E:\\RM-CPM\\ChatBot Whatsapp\\Áudios\\FAQ\\residencial_resposta1.mp3'
            },
            '2': {
                pergunta: "Por que contratar um seguro residencial?",
                resposta: "Garante proteção patrimonial e segurança financeira contra imprevistos. 🛡️",
                audioResposta: 'E:\\RM-CPM\\ChatBot Whatsapp\\Áudios\\FAQ\\residencial_resposta2.mp3'
            },
            '3': {
                pergunta: "Qual é o melhor plano do seguro residencial?",
                resposta: "Aquele que atende suas necessidades e características do imóvel. 👌",
                audioResposta: 'E:\\RM-CPM\\ChatBot Whatsapp\\Áudios\\FAQ\\residencial_resposta3.mp3'
            },
            '4': {
                pergunta: "O que é franquia no seguro residencial?",
                resposta: "Participação do segurado em sinistros específicos, conforme apólice. 🧾",
                audioResposta: 'E:\\RM-CPM\\ChatBot Whatsapp\\Áudios\\FAQ\\residencial_resposta4.mp3'
            },
            '5': {
                pergunta: "O que são bens não compreendidos?",
                resposta: "Itens como joias, obras de arte e objetos de alto valor que não têm cobertura. 💍",
                audioResposta: 'E:\\RM-CPM\\ChatBot Whatsapp\\Áudios\\FAQ\\residencial_resposta5.mp3'
            }
        }
    },


        '3': { // °°°°° Empresarial °°°°° Empresarial °°°°° Empresarial °°°°° Empresarial °°°°° Empresarial 
        nome: '🏢 Empresarial',
        audioPerguntas: 'E:\\RM-CPM\\ChatBot Whatsapp\\Áudios\\FAQ\\empresarial_perguntas.mp3', // Áudio que lista todas as perguntas
        perguntas: {
            '1': {
                pergunta: "Qual cobertura do Seguro Empresa é ideal para meu negócio?",
                resposta: "Depende da atividade e estrutura da empresa. Consulte um corretor. 🧑‍💼",
                audioResposta: 'E:\\RM-CPM\\ChatBot Whatsapp\\Áudios\\FAQ\\empresarial_resposta1.mp3'
            },
            '2': {
                pergunta: "Quais a importância de assegurar minha empresa?",
                resposta: "Proteção contra prejuízos que podem comprometer suas operações. ⚠️",
                audioResposta: 'E:\\RM-CPM\\ChatBot Whatsapp\\Áudios\\FAQ\\empresarial_resposta2.mp3'
            },
            '3': {
                pergunta: "Qualquer empresa pode ter um seguro?",
                resposta: "Sim, de qualquer porte ou segmento. 📈",
                audioResposta: 'E:\\RM-CPM\\ChatBot Whatsapp\\Áudios\\FAQ\\empresarial_resposta3.mp3'
            },
            '4': {
                pergunta: "Em que casos é obrigatório contratar um seguro empresarial?",
                resposta: "Para imóveis de pessoas jurídicas, com cobertura contra incêndio. 🔥",
                audioResposta: 'E:\\RM-CPM\\ChatBot Whatsapp\\Áudios\\FAQ\\empresarial_resposta4.mp3'
            }
        }
    },



            '4': { // °°°°° Vida °°°°° Vida °°°°° Vida °°°°° Vida °°°°° Vida  °°°°° Vida  °°°°° Vida  °°°°° Vida  °°°°° Vida 
        nome: '❤ Vida',
        audioPerguntas: 'E:\\RM-CPM\\ChatBot Whatsapp\\Áudios\\FAQ\\vida_perguntas.mp3', // Áudio que lista todas as perguntas
        perguntas: {
            '1': {
                pergunta: "Seguro de vida cobre apenas morte?",
                resposta: "Não. Muitas coberturas são voltadas para uso em vida. 🌟",
                audioResposta: 'E:\\RM-CPM\\ChatBot Whatsapp\\Áudios\\FAQ\\vida_resposta1.mp3'
            },
            '2': {
                pergunta: "Quanto custa e qual é a vigência de um seguro de vida?",
                resposta: "A partir de R$ 10,20/mês. Vigência anual com renovação. 💰",
                audioResposta: 'E:\\RM-CPM\\ChatBot Whatsapp\\Áudios\\FAQ\\vida_resposta2.mp3'
            },
            '3': {
                pergunta: "O que são coberturas de proteção familiar?",
                resposta: "Garantias adicionais para proteger você e sua família. 👨‍👩‍👧‍👦",
                audioResposta: 'E:\\RM-CPM\\ChatBot Whatsapp\\Áudios\\FAQ\\vida_resposta3.mp3'
            },
            '4': {
                pergunta: "Existe limite de idade para contratar um seguro de vida?",
                resposta: "Sim, geralmente até 64 anos. Consulte para confirmar. 🗓️",
                audioResposta: 'E:\\RM-CPM\\ChatBot Whatsapp\\Áudios\\FAQ\\vida_resposta4.mp3'
            }
        }
    },


                '5': { // °°°°° Celular °°°°° Celular °°°°° Celular °°°°° Celular °°°°° Celular °°°°° Celular °°°°° Celular °°°°° Celular °°°°° Celular 
        nome: '📱 Celular',
        audioPerguntas: 'E:\\RM-CPM\\ChatBot Whatsapp\\Áudios\\FAQ\\celular_perguntas.mp3', // Áudio que lista todas as perguntas
        perguntas: {
            '1': {
                pergunta: "O que está coberto no Seguro Celular da Porto Seguro?",
                resposta: "Roubo, quebra acidental e furto simples, conforme o plano contratado. 🔒",
                audioResposta: 'E:\\RM-CPM\\ChatBot Whatsapp\\Áudios\\FAQ\\celular_resposta1.mp3'
            },
            '2': {
                pergunta: "O seguro celular aceita aparelho usado?",
                resposta: "Sim, com até 24 meses de uso e nota fiscal. 🧾",
                audioResposta: 'E:\\RM-CPM\\ChatBot Whatsapp\\Áudios\\FAQ\\celular_resposta2.mp3'
            },
            '3': {
                pergunta: "Posso cancelar o meu seguro celular a qualquer momento?",
                resposta: "Sim, sem multas ou carencia. ❌",
                audioResposta: 'E:\\RM-CPM\\ChatBot Whatsapp\\Áudios\\FAQ\\celular_resposta3.mp3'
            },
            '4': {
                pergunta: "Qual é a vigência do Seguro Celular da Porto Seguro?",
                resposta: "Vigência de 365 dias a partir da emissão da apólice. 📆",
                audioResposta: 'E:\\RM-CPM\\ChatBot Whatsapp\\Áudios\\FAQ\\celular_resposta4.mp3'
            },
            '5': {
                pergunta: "Preciso ter a nota fiscal do aparelho para contratar o seguro celular?",
                resposta: "Para contratar não é obrigatório, mas é exigida comprovação para acionar o seguro. 📑",
                audioResposta: 'E:\\RM-CPM\\ChatBot Whatsapp\\Áudios\\FAQ\\celular_resposta5.mp3'
            }
        }
    },



                '6': { // °°°°° Notebook °°°°° Notebook °°°°° Notebook °°°°° Notebook °°°°° Notebook  °°°°° Notebook 
        nome: '💻 Notebook',
        audioPerguntas: 'E:\\RM-CPM\\ChatBot Whatsapp\\Áudios\\FAQ\\notebook_perguntas.mp3', // Áudio que lista todas as perguntas
        perguntas: {
            '1': {
                pergunta: "Preciso da nota fiscal para contratar o seguro?",
                resposta: "Sim, obrigatória. Em caso de terceiros, é exigido documento de comprovação. 🧾",
                audioResposta: 'E:\\RM-CPM\\ChatBot Whatsapp\\Áudios\\FAQ\\notebook_resposta1.mp3'
            },
            '2': {
                pergunta: "Quais as situações que não tenho cobertura no Seguro para Notebook?",
                resposta: "Furto simples, negligência, mau uso e fraudes internas. 🚫",
                audioResposta: 'E:\\RM-CPM\\ChatBot Whatsapp\\Áudios\\FAQ\\notebook_resposta2.mp3'
            },
            '3': {
                pergunta: "Posso cancelar o meu seguro Notebook a qualquer momento?",
                resposta: "Sim, sem custo de cancelamento. ✅",
                audioResposta: 'E:\\RM-CPM\\ChatBot Whatsapp\\Áudios\\FAQ\\notebook_resposta3.mp3'
            },
            '4': {
                pergunta: "O seguro notebooks aceita aparelho usado?",
                resposta: "Sim, com até 4 anos e nota fiscal do primeiro dono. 📅",
                audioResposta: 'E:\\RM-CPM\\ChatBot Whatsapp\\Áudios\\FAQ\\notebook_resposta4.mp3'
            },
            '5': {
                pergunta: "Como é o processo de vistoria do notebook segurado?",
                resposta: "100% online, feito via aplicativo. 📲",
                audioResposta: 'E:\\RM-CPM\\ChatBot Whatsapp\\Áudios\\FAQ\\notebook_resposta5.mp3'
            }
        }
    },



                '7': { // °°°°° Bicicleta °°°°° Bicicleta °°°°° Bicicleta °°°°° Bicicleta °°°°° Bicicleta  °°°°° Bicicleta 
        nome: '🚲 Bicicleta',
        audioPerguntas: 'E:\\RM-CPM\\ChatBot Whatsapp\\Áudios\\FAQ\\bicicleta_perguntas.mp3', // Áudio que lista todas as perguntas
        perguntas: {
            '1': {
                pergunta: "Quanto custa o seguro de uma bike?",
                resposta: "Depende do modelo, uso e idade da bike. 💵",
                audioResposta: 'E:\\RM-CPM\\ChatBot Whatsapp\\Áudios\\FAQ\\bicicleta_resposta1.mp3'
            },
            '2': {
                pergunta: "O seguro bike tem cobertura para terceiros?",
                resposta: "Sim, com a cobertura de Responsabilidade Civil. 👥",
                audioResposta: 'E:\\RM-CPM\\ChatBot Whatsapp\\Áudios\\FAQ\\bicicleta_resposta2.mp3'
            },
            '3': {
                pergunta: "O Seguro Bike da Porto Seguro oferece cobertura para acessórios?",
                resposta: "Sim, para itens como GPS e velocímetro. ❗",
                audioResposta: 'E:\\RM-CPM\\ChatBot Whatsapp\\Áudios\\FAQ\\bicicleta_resposta3.mp3'
            },
            '4': {
                pergunta: "Posso contratar o seguro de bike para bicicleta usada?",
                resposta: "Sim, com até 8 anos (tradicional) ou 3 anos (elétrica). 🚲",
                audioResposta: 'E:\\RM-CPM\\ChatBot Whatsapp\\Áudios\\FAQ\\bicicleta_resposta4.mp3'
            },
            '5': {
                pergunta: "O seguro bike oferece cobertura para furto?",
                resposta: "Somente para furto qualificado ou roubo com vestígio. 🔐",
                audioResposta: 'E:\\RM-CPM\\ChatBot Whatsapp\\Áudios\\FAQ\\bicicleta_resposta5.mp3'
            }
        }
    },

    
    
};
// °°°°° PERGUNTAS FREQUENTES - P:_R: °°°°° PERGUNTAS FREQUENTES - P:_R: °°°°° PERGUNTAS FREQUENTES - P:_R: °°°°° PERGUNTAS FREQUENTES - P:_R: °°°°°



const resetUserTimeouts = (userId) => {
    clearTimeout(userTimeouts[userId]);
    clearTimeout(autoFormTimeouts[userId]);
    clearTimeout(secondInactivityTimeouts[userId]);
    clearTimeout(finalInactivityTimeouts[userId]);
};
//°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°


//°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°
const resetToStart = async (userId, chat, name = "amigo(a)") => {
    resetUserTimeouts(userId);
    
    // 1. Apresentação
    await delay(1500);
    await chat.sendStateTyping();
    await delay(3500);
    await client.sendMessage(userId, `Olá, ${name} 👋\nSeja bem-vindo(a) à *Cota para mim*.\nSou a *Bell*, atendente virtual da Cota para mim e estou aqui para te ajudar 😄`);
    
    // 2. Menu escrito
    await delay(1500);
    await chat.sendStateTyping();
    await delay(2500);
    await client.sendMessage(userId,
        `Escolha uma das opções a seguir:\n\n` +
        `Digite 1️⃣ - Preciso de um seguro\n` +
        `Digite 2️⃣ - Assistência 24 horas\n` +
        `Digite 3️⃣ - Conhecer a empresa\n` +
        `Digite 4️⃣ - Como funciona\n` +
        `Digite 5️⃣ - Perguntas Frequentes\n` +
        `Digite 6️⃣ - Indique e ganhe\n` +
        `Digite 7️⃣ - Falar com atendente\n\n`);
    
    // 3. Envio de áudio com tratamento avançado
    try {
        const audioPath = 'E:\\RM-CPM\\ChatBot Whatsapp\\Áudios\\menu principal.mp3'; // Alterado para .mp3
        
        // Verificação robusta do arquivo
        if (!fs.existsSync(audioPath)) {
            throw new Error(`Arquivo não encontrado: ${audioPath}`);
        }

        const fileStats = fs.statSync(audioPath);
        console.log(`Enviando áudio (${(fileStats.size/1024).toFixed(2)}KB)`);

        // Método alternativo de carregamento
        const fileData = fs.readFileSync(audioPath);
        const audioMessage = new MessageMedia(
            'audio/mp3', // Alterado o mimetype para mp3
            fileData.toString('base64'),
            'menu.mp3' // Alterado a extensão do arquivo
        );

        // Pré-processamento para evitar timeout
        await delay(1000);
        await chat.sendStateRecording();
        await delay(2000);

        // Envio com múltiplas tentativas
        let attempts = 0;
        while (attempts < 2) {
            try {
                await client.sendMessage(userId, audioMessage, {
                    sendAudioAsVoice: true,
                    caption: "Opções do menu"
                });
                console.log("✅ Áudio enviado com sucesso");
                break;
            } catch (retryError) {
                attempts++;
                console.warn(`Tentativa ${attempts} falhou:`, retryError.message);
                if (attempts >= 2) throw retryError;
                await delay(3000); // Espera antes de tentar novamente
            }
        }

    } catch (error) {
        console.error("❌ Falha no áudio:", {
            error: error.message,
            stack: error.stack?.split('\n')[0] || 'N/A'
        });
        // Não envia fallback - o menu em texto já basta
    }
    
    userStates[userId] = 'mainMenu';
    monitorInactivity(userId, chat, name);
};
//°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°



const monitorInactivity = (userId, chat, name) => {
    resetUserTimeouts(userId);

    userTimeouts[userId] = setTimeout(async () => {
        // ARMAZENA O ESTADO ATUAL ANTES DE MUDAR PARA 'INATIVO'
        if (!userLastStates[userId] || typeof userLastStates[userId] !== 'object') {
            userLastStates[userId] = {
                state: userStates[userId],
                // (Podemos adicionar mais dados específicos depois)
            };
        }
        
        await chat.sendStateTyping();
        await delay(1000);
        await client.sendMessage(userId,
            `⏰ Você ainda está por aí?\nGostaria de retomar seu atendimento?\n\nDigite 1️⃣ para retomar de onde parou.\nDigite 2️⃣ para encerrar o atendimento.`);
        userStates[userId] = 'inativo';

        secondInactivityTimeouts[userId] = setTimeout(async () => {
            if (userStates[userId] === 'inativo') {
                await client.sendMessage(userId, `Seu atendimento será encerrado por inatividade. Estarei aqui sempre que precisar.\nPoderia me avaliar com uma nota de 1️⃣ a 5️⃣?`);
                userStates[userId] = 'avaliacao';
            }
        }, 15 * 60000);

        finalInactivityTimeouts[userId] = setTimeout(async () => {
            if (userStates[userId] === 'avaliacao') {
                await client.sendMessage(userId, `Até mais ${name}, conta sempre comigo.`);
                userStates[userId] = null;
                userLastStates[userId] = null;
                resetUserTimeouts(userId);
            }
        }, 25 * 60000);
    }, 15 * 60000);
};

const iniciarAvaliacao = async (userId, name) => {
    await client.sendMessage(userId, `Por favor, avalie meu atendimento com uma nota de 1️⃣ a 5️⃣.`);
    userStates[userId] = 'avaliacao';
    userLastStates[userId] = null; // LIMPA O HISTÓRICO DE RETOMADA
};

const normalizarOpcao = input => {
    const mapa = {
        '1️⃣': '1', '2️⃣': '2', '3️⃣': '3',
        '4️⃣': '4', '5️⃣': '5', '6️⃣': '6',
        '7️⃣': '7', '8️⃣': '8', '0️⃣': '0',
        '🔟': '10', '1️⃣1️⃣': '11', '1️⃣2️⃣': '12',
        '1️⃣3️⃣': '13', '1️⃣4️⃣': '14'
    };
    return mapa[input] || input;
};
client.on('message', async msg => {
    console.log(`Nova mensagem de ${msg.from}. Estado atual: ${userStates[msg.from] || 'null'}`);
    const userId = msg.from;
    const userInputOriginal = msg.body.trim().toLowerCase();
    const userInput = normalizarOpcao(userInputOriginal);
    const chat = await msg.getChat();
    const contact = await msg.getContact();
    const name = contact.pushname?.split(" ")[0] || "amigo(a)";
    const state = userStates[userId];

    resetUserTimeouts(userId);
    monitorInactivity(userId, chat, name);

    if (!state || ['início', 'menu', 'oi', 'olá', 'ola', 'bom dia', 'boa tarde', 'boa noite'].includes(userInput)) {
        return resetToStart(userId, chat, name);
    }
// °°°°°PRODUTOS°°°°°PRODUTOS°°°°°PRODUTOS°°°°°PRODUTOS°°°°°PRODUTOS°°°°°PRODUTOS°°°°°PRODUTOS°°°°°PRODUTOS°°°°°PRODUTOS°°°°°
if (state === 'mainMenu') {
    userLastStates[userId] = 'mainMenu';
    if (userInput === '1') {
        userStates[userId] = 'tipoSeguro';
        
        // Texto formatado com emojis
        const menuSegurosTexto = 
            `Excelente, agora me conta: qual tipo de seguro você está buscando? Temos opções para:\n\n` +
            `Digite 1️⃣ - 🚗 Automóvel (carro ou moto)\n` +
            `Digite 2️⃣ - 🏡 Residencial\n` +
            `Digite 3️⃣ - 🏢 Empresarial\n` +
            `Digite 4️⃣ - ❤️ Vida\n` +
            `Digite 5️⃣ - 📱 Celular\n` +
            `Digite 6️⃣ - 💻 Notebook\n` +
            `Digite 7️⃣ - 🚲 Bicicleta\n\n` +
            `0️⃣ ↩︎ Voltar\n` +
            `Digite "Fim" para encerrar`;
        
        // 1. Envio do texto primeiro
        await client.sendMessage(userId, menuSegurosTexto);
        
        // 2. Envio do áudio "produtos.mp3"
        try {
            const audioPath = 'E:\\RM-CPM\\ChatBot Whatsapp\\Áudios\\produtos.mp3';
            
            if (!fs.existsSync(audioPath)) {
                console.warn(`⚠️ Arquivo de áudio não encontrado: ${audioPath}`);
            } else {
                const fileStats = fs.statSync(audioPath);
                console.log(`🔊 Enviando áudio produtos (${(fileStats.size/1024).toFixed(2)}KB)`);

                const fileData = fs.readFileSync(audioPath);
                const audioMessage = new MessageMedia(
                    'audio/mp3',
                    fileData.toString('base64'),
                    'produtos.mp3'
                );

                // Pré-processamento
                await delay(800);  // Tempo reduzido para menus secundários
                await chat.sendStateRecording();
                await delay(1200);

                // Envio com tratamento de erros
                let attempts = 0;
                while (attempts < 2) {
                    try {
                        await client.sendMessage(userId, audioMessage, {
                            sendAudioAsVoice: true,
                            caption: "Tipos de seguros disponíveis"
                        });
                        console.log("✅ Áudio 'produtos' enviado com sucesso");
                        break;
                    } catch (error) {
                        attempts++;
                        console.warn(`⚠️ Tentativa ${attempts} falhou: ${error.message}`);
                        if (attempts >= 2) {
                            console.error("❌ Falha ao enviar áudio após 2 tentativas");
                        }
                        await delay(2000);
                    }
                }
            }
        } catch (error) {
            console.error("❌ Erro no processamento do áudio:", {
                error: error.message,
                stack: error.stack?.split('\n')[0] || 'N/A'
            });
            
        }
// °°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°



        } else if (userInput === '2') {
            userStates[userId] = 'assistencia24h';
            await client.sendMessage(userId,
                `*Assistência 24 horas*\n\nQual sua seguradora?\n\n` +
                `Digite 1️⃣ - selecionar a seguradora\n` +
                `Digite 2️⃣ - Como acionar as assistências\n\n\n\n` +
                `0️⃣ ↩︎ Voltar\n` +
                `Digite "Fim" para encerrar`);




// °°°°° SOBRE NOS °°°°° SOBRE NOS °°°°° SOBRE NOS °°°°° SOBRE NOS °°°°° SOBRE NOS °°°°° SOBRE NOS °°°°° SOBRE NOS °°°°° SOBRE NOS              
} else if (userInput === '3') {
    userStates[userId] = 'sobre';
    
    // 1. Primeira mensagem textual
    await delay(1000);
    await chat.sendStateTyping();
    await delay(6000);
    await client.sendMessage(userId,
        `*Conheça a nossa história.*\n\n   Cota Para Mim é uma iniciativa pensado para aproximar você da seguradora que mais combina com seu estilo de vida.\n`);
    
    // 2. Envio do áudio "sobre nos"
    try {
        const audioPath = 'E:\\RM-CPM\\ChatBot Whatsapp\\Áudios\\sobre nos.mp3';
        
        if (fs.existsSync(audioPath)) {
            const fileData = fs.readFileSync(audioPath);
            const audioMessage = new MessageMedia(
                'audio/mp3',
                fileData.toString('base64'),
                'sobre_nos.mp3'
            );

            // Pré-processamento para parecer natural
            await delay(1000);
            await chat.sendStateRecording();
            await delay(2000);

            // Envio com tratamento de erros
            let attempts = 0;
            while (attempts < 2) {
                try {
                    await client.sendMessage(userId, audioMessage, {
                        sendAudioAsVoice: true,
                        caption: "Nossa história"
                    });
                    console.log("✅ Áudio 'sobre nos' enviado com sucesso");
                    break;
                } catch (error) {
                    attempts++;
                    console.warn(`⚠️ Tentativa ${attempts} falhou: ${error.message}`);
                    if (attempts >= 2) {
                        console.error("❌ Falha ao enviar áudio após 2 tentativas");
                    }
                    await delay(3000);
                }
            }
        } else {
            console.warn("⚠️ Áudio 'sobre nos.mp3' não encontrado");
            // Não envia fallback - o fluxo continua
        }
    } catch (error) {
        console.error("❌ Erro no processamento do áudio:", error.message);
    }

    // 3. Envio do link e mensagem final
    await delay(1000);
    await chat.sendStateTyping();
    await delay(3000);
    await client.sendMessage(userId,
        `${name}, te espero lá: https://cotaparamim.com.br\n\n` +
        `0️⃣ ↩︎ Voltar\n` +
        `Digite "Fim" para encerrar`);

// °°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°


// °°°°° como Funciona °°°°° como Funciona °°°°° como Funciona °°°°° como Funciona °°°°° como Funciona °°°°° como Funciona °°°°° como Funciona

} else if (userInput === '4') {
    userStates[userId] = 'comoFunciona';
    
    // 1. Envio do áudio "como funciona" no lugar do texto inicial
    try {
        const audioPath = 'E:\\RM-CPM\\ChatBot Whatsapp\\Áudios\\como funciona.mp3';
        
        if (fs.existsSync(audioPath)) {
            const fileData = fs.readFileSync(audioPath);
            const audioMessage = new MessageMedia(
                'audio/mp3',
                fileData.toString('base64'),
                'como_funciona.mp3'
            );

            // Pré-processamento para parecer natural
            await delay(1000);
            await chat.sendStateRecording();
            await delay(2000);

            // Envio com tratamento de erros
            let attempts = 0;
            while (attempts < 2) {
                try {
                    await client.sendMessage(userId, audioMessage, {
                        sendAudioAsVoice: true,
                        caption: "Como funciona nosso serviço"
                    });
                    console.log("✅ Áudio 'como funciona' enviado com sucesso");
                    break;
                } catch (error) {
                    attempts++;
                    console.warn(`⚠️ Tentativa ${attempts} falhou: ${error.message}`);
                    if (attempts >= 2) {
                        console.error("❌ Falha ao enviar áudio após 2 tentativas");
                    }
                    await delay(3000);
                }
            }
        } else {
            console.warn("⚠️ Áudio 'como funciona.mp3' não encontrado");
            // Fallback opcional (texto original) pode ser adicionado aqui se desejar
        }
    } catch (error) {
        console.error("❌ Erro no processamento do áudio:", error.message);
    }

    // 2. Envio do link (mantido do original)
    await delay(2000);
    await chat.sendStateTyping();
    await client.sendMessage(userId,
        `👉 Acesse agora: https://cotaparamim.com.br/comofunciona`);
    
    // 3. Mensagem final (mantida do original)
    await delay(2000);
    await chat.sendStateTyping();
    await client.sendMessage(userId,
        `Seguro descomplicado é aqui! 🚀\n\n\n` +
        `0️⃣ ↩︎ Voltar\n` +
        `Digite "Fim" para encerrar`);

// °°°°° como Funciona °°°°° como Funciona °°°°° como Funciona °°°°° como Funciona °°°°° como Funciona °°°°° como Funciona °°°°° como Funciona



// °°°°° perguntasFrequentes °°°°° perguntasFrequentes °°°°° perguntasFrequentes °°°°° perguntasFrequentes °°°°° perguntasFrequentes °°°°° perguntasFrequentes
       
} else if (userInput === '5') {
    userStates[userId] = 'faqMenu1';
    
    // 1. Primeiro envia o menu textual
    await client.sendMessage(userId,
        `🤔 *Sobre que tipo de seguro tem dúvidas?*\n\n` +
        `Digite 1️⃣ - 🚗 Automóvel\n` +
        `Digite 2️⃣ - 🏡 Residencial\n` +
        `Digite 3️⃣ - 🏢 Empresarial\n` +
        `Digite 4️⃣ - ❤️ Vida\n` +
        `Digite 5️⃣ - 📱 Celular\n` +
        `Digite 6️⃣ - 💻 Notebook\n` +
        `Digite 7️⃣ - 🚲 Bicicleta\n\n` +
        `0️⃣ ↩︎ Voltar\n` +
        `Digite "Fim" para encerrar`);

    // 2. Envia o áudio "perguntas frequentes menu.mp3"
    try {
        const audioPath = 'E:\\RM-CPM\\ChatBot Whatsapp\\Áudios\\perguntas frequentes menu.mp3';
        
        if (fs.existsSync(audioPath)) {
            const fileData = fs.readFileSync(audioPath);
            const audioMessage = new MessageMedia(
                'audio/mp3',
                fileData.toString('base64'),
                'faq_menu.mp3'
            );

            // Pré-processamento para envio do áudio
            await delay(1000); // Pequena pausa antes de "gravar"
            await chat.sendStateRecording(); // Simula que está gravando
            await delay(2000); // Tempo de "gravação"

            // Envio com tratamento de erros
            let attempts = 0;
            while (attempts < 2) {
                try {
                    await client.sendMessage(userId, audioMessage, {
                        sendAudioAsVoice: true,
                        caption: "Menu de Perguntas Frequentes"
                    });
                    console.log("✅ Áudio 'perguntas frequentes menu' enviado com sucesso");
                    break;
                } catch (retryError) {
                    attempts++;
                    console.warn(`Tentativa ${attempts} falhou:`, retryError.message);
                    if (attempts >= 2) {
                        console.error("❌ Falha ao enviar áudio após 2 tentativas");
                    }
                    await delay(3000); // Espera antes de tentar novamente
                }
            }
        } else {
            console.warn("⚠️ Arquivo de áudio não encontrado:", audioPath);
            // Continua sem áudio
        }
    } catch (error) {
        console.error("❌ Erro no processamento do áudio:", {
            error: error.message,
            stack: error.stack?.split('\n')[0] || 'N/A'
        });
        // Não envia fallback - o menu em texto já foi enviado
    }

// °°°°° perguntasFrequentes °°°°° perguntasFrequentes °°°°° perguntasFrequentes °°°°° perguntasFrequentes °°°°° perguntasFrequentes °°°°° perguntasFrequentes


 // °°°°° indique-Ganhe °°°°° indique-Ganhe °°°°° indique-Ganhe °°°°° indique-Ganhe °°°°° indique-Ganhe °°°°° indique-Ganhe °°°°° indique-Ganhe               
       
} else if (userInput === '6') {
    userStates[userId] = 'indiqueGanhe';
    
    // 1. Primeira mensagem textual
    await delay(1500);
    await chat.sendStateTyping();
    await delay(3500);
    await client.sendMessage(userId,
        `🚀 *Indique amigos e GANHE até R$150 em cashback!*\n` +
        `"Seu seguro de auto pode valer ainda mais!"\n`);
    
    // 2. Segunda mensagem textual
    await delay(1500);
    await chat.sendStateTyping();
    await delay(2500);
    await client.sendMessage(userId,
        `📢 *Como funciona?*\n` +
        `✔️ Você indica um amigo pra cotar seguro auto\n` +
        `✔️ Ele fecha o contrato com a Cota Para Mim\n` +
        `✔️ Você ganha até R$150 em crédito pra usar em seus próximos seguros!`);
    
    // 3. Envio do áudio "indique e ganhe.mp3"
    try {
        const audioPath = 'E:\\RM-CPM\\ChatBot Whatsapp\\Áudios\\indique e ganhe.mp3';
        
        if (fs.existsSync(audioPath)) {
            const fileStats = fs.statSync(audioPath);
            console.log(`🔊 Enviando áudio indique e ganhe (${(fileStats.size/1024).toFixed(2)}KB)`);

            const fileData = fs.readFileSync(audioPath);
            const audioMessage = new MessageMedia(
                'audio/mp3',
                fileData.toString('base64'),
                'indique_ganhe.mp3'
            );

            // Pré-processamento para envio do áudio
            await delay(1000);
            await chat.sendStateRecording();
            await delay(2000);

            // Envio com tratamento de erros
            let attempts = 0;
            while (attempts < 2) {
                try {
                    await client.sendMessage(userId, audioMessage, {
                        sendAudioAsVoice: true,
                        caption: "Indique e Ganhe"
                    });
                    console.log("✅ Áudio 'indique e ganhe' enviado com sucesso");
                    break;
                } catch (error) {
                    attempts++;
                    console.warn(`⚠️ Tentativa ${attempts} falhou: ${error.message}`);
                    if (attempts >= 2) {
                        console.error("❌ Falha ao enviar áudio após 2 tentativas");
                    }
                    await delay(3000);
                }
            }
        } else {
            console.warn(`⚠️ Arquivo de áudio não encontrado: ${audioPath}`);
            // Continua sem áudio
        }
    } catch (error) {
        console.error("❌ Erro no processamento do áudio:", {
            error: error.message,
            stack: error.stack?.split('\n')[0] || 'N/A'
        });
    }

    // 4. Mensagem final com link e opções
    await delay(1500);
    await chat.sendStateTyping();
    await delay(2500);
    await client.sendMessage(userId,
        `👉 Indique agora: https://cotaparamim.com.br/indica-rn\n\n` +
        `Todo mundo ganha: seu amigo tem o melhor seguro e você ainda fica com um crédito! 🎉\n\n` +
        `0️⃣ ↩︎ Voltar\n` +
        `Digite "Fim" para encerrar`);

 // °°°°° indique-Ganhe °°°°° indique-Ganhe °°°°° indique-Ganhe °°°°° indique-Ganhe °°°°° indique-Ganhe °°°°° indique-Ganhe °°°°° indique-Ganhe               


 // °°°°° atendente °°°°° atendente °°°°° atendente °°°°° atendente °°°°° atendente °°°°° atendente °°°°° atendente °°°°° atendente               
       
} else if (userInput === '7') {
    userStates[userId] = 'atendente';
    
    // Obter hora atual no fuso horário de Brasília
    const now = new Date();
    const hours = now.getHours();
    const isBusinessHours = (hours >= 9 && hours < 18); // 9h às 18h
    
    if (isBusinessHours) {
        // Período comercial (9:00 às 18:00)
        await client.sendMessage(userId, 
            `Rapidinho, tá? Já tô te transferindo. Só um instante!`);
        
        // Primeira mensagem após 60 segundos
        setTimeout(async () => {
            if (userStates[userId] === 'atendente') {
                await client.sendMessage(userId,
                    `Só mais um pouquinho... parece que o volume de atendimento está um pouco alto nesse momento, mas já já chega a sua vez!`);
            }
        }, 60000);
        
        // Áudio e mensagem final após 120 segundos
        setTimeout(async () => {
            if (userStates[userId] === 'atendente') {
                try {
                    const audioPath = 'E:\\RM-CPM\\ChatBot Whatsapp\\Áudios\\atendimento on m3.mp3';
                    
                    if (fs.existsSync(audioPath)) {
                        const fileData = fs.readFileSync(audioPath);
                        const audioMessage = new MessageMedia(
                            'audio/mp3',
                            fileData.toString('base64'),
                            'atendimento_on.mp3'
                        );
                        
                        await chat.sendStateRecording();
                        await delay(2000);
                        
                        await client.sendMessage(userId, audioMessage, {
                            sendAudioAsVoice: true,
                            caption: "Atendimento"
                        });
                    }
                } catch (error) {
                    console.error("Erro ao enviar áudio:", error.message);
                }
                
                // ENVIA AS OPÇÕES APÓS O ÁUDIO
                await client.sendMessage(userId,
                    `\n\n0️⃣ ↩︎ Voltar\n` +
                    `Digite "Fim" para encerrar`);
            }
        }, 120000);
        
    } else {
        // Fora do horário comercial (18:01 às 8:59)
        await client.sendMessage(userId,
            `Oi! Que bom receber sua mensagem 😊`);
        
        await delay(2000);
        await chat.sendStateTyping();
        
        await client.sendMessage(userId,
            `A gente ainda não tá por aqui... nosso horário de atendimento é das 9 da manhã às 6 da tarde, de segunda a sexta.`);
        
        // Envia áudio fora do horário
        try {
            const audioPath = 'E:\\RM-CPM\\ChatBot Whatsapp\\Áudios\\atendimento off m3.mp3';
            
            if (fs.existsSync(audioPath)) {
                const fileData = fs.readFileSync(audioPath);
                const audioMessage = new MessageMedia(
                    'audio/mp3',
                    fileData.toString('base64'),
                    'atendimento_off.mp3'
                );
                
                await chat.sendStateRecording();
                await delay(2000);
                
                await client.sendMessage(userId, audioMessage, {
                    sendAudioAsVoice: true,
                    caption: "Horário de atendimento"
                });
            }
        } catch (error) {
            console.error("Erro ao enviar áudio:", error.message);
        }
        
        // ENVIA AS OPÇÕES APÓS O ÁUDIO (fora do horário)
        await client.sendMessage(userId,
            `\n\n0️⃣ ↩︎ Voltar\n` +
            `Digite "Fim" para encerrar`);
    }

 // °°°°° atendente °°°°° atendente °°°°° atendente °°°°° atendente °°°°° atendente °°°°° atendente °°°°° atendente °°°°° atendente               
             
 
        } else if (userInput.toLowerCase() === 'fim') {
            return iniciarAvaliacao(userId, name);        
        } else {
            await client.sendMessage(userId, `⚠️ Opção inválida. Escolha de 1️⃣ a 7️⃣.`);
        }



// PERGUNTAS FREQUENTES - MANIPULADORES °°°°° PERGUNTAS FREQUENTES - MANIPULADORES °°°°° PERGUNTAS FREQUENTES - MANIPULADORES °°°°° PERGUNTAS FREQUENTES - MANIPULADORES °°°°°
} else if (state === 'faqMenu1') {
    // ARMAZENA O ESTADO E CONTEXTO PARA RETOMADA
    userLastStates[userId] = {
        state: 'faqMenu1'
    };
    if (userInput in perguntasFrequentes) {
        const tipo = perguntasFrequentes[userInput];
        userStates[userId] = 'faqMenu2';
        userLastStates[userId] = userInput; // Guarda o tipo selecionado
        
        let mensagem = `*${tipo.nome} - Perguntas Frequentes*\n\n`;
        Object.entries(tipo.perguntas).forEach(([key, value]) => {
            mensagem += `Digite ${key} - ${value.pergunta}\n`;
        });
        
        // Envia o texto primeiro
        await client.sendMessage(userId, 
            mensagem + `\n0️⃣ ↩︎ Voltar\nDigite "Fim" para encerrar`);
            
        // Envia o áudio com as perguntas
        try {
            if (tipo.audioPerguntas && fs.existsSync(tipo.audioPerguntas)) {
                const fileData = fs.readFileSync(tipo.audioPerguntas);
                const audioMessage = new MessageMedia(
                    'audio/mp3',
                    fileData.toString('base64'),
                    'perguntas_faq.mp3'
                );
                
                await delay(1000);
                await chat.sendStateRecording();
                await delay(2000);
                
                await client.sendMessage(userId, audioMessage, {
                    sendAudioAsVoice: true,
                    caption: "Perguntas frequentes"
                });
                console.log("✅ Áudio de perguntas enviado");
            }
        } catch (error) {
            console.error("❌ Erro ao enviar áudio de perguntas:", error.message);
        }
            
    } else if (userInput === '0') {
        await resetToStart(userId, chat, name);
    } else if (userInput.toLowerCase() === 'fim') {
        return iniciarAvaliacao(userId, name);
    } else {
        await client.sendMessage(userId, `⚠️ Opção inválida. Escolha de 1️⃣ a 7️⃣ ou 0️⃣ para voltar.`);
    }
    


} else if (state === 'faqMenu2') {
    const tipoSelecionado = userLastStates[userId];
    const faqAudioPrincipal = 'E:\\RM-CPM\\ChatBot Whatsapp\\Áudios\\FAQ\\perguntas frequentes menu2.mp3';
    

    if (!tipoSelecionado || !perguntasFrequentes[tipoSelecionado]) {
        userStates[userId] = 'faqMenu1';
    try {  
        await client.sendMessage(userId,
            `⚠ _Houve um problema. Vamos recomeçar._\n\n\n` +
            `🤔 *Sobre que tipo de seguro tem dúvidas?*\n\n` +
            `Digite 1️⃣ - 🚗 Automóvel\n` +
            `Digite 2️⃣ - 🏡 Residencial\n` +
            `Digite 3️⃣ - 🏢 Empresarial\n` +
            `Digite 4️⃣ - ❤️ Vida\n` +
            `Digite 5️⃣ - 📱 Celular\n` +
            `Digite 6️⃣ - 💻 Notebook\n` +
            `Digite 7️⃣ - 🚲 Bicicleta\n\n` +
            `0️⃣ ↩︎ Voltar\n` +
            `Digite "Fim" para encerrar`);

            if (fs.existsSync(faqAudioPrincipal)) {
                const fileData = fs.readFileSync(faqAudioPrincipal);
                const audioMessage = new MessageMedia(
                    'audio/mp3', // Tente 'audio/mpeg' se não funcionar
                    fileData.toString('base64'),
                    'perguntas_frequentes_menu2.mp3'
                );
                
                // Envia o áudio após um pequeno delay
                await new Promise(resolve => setTimeout(resolve, 1000));
                await client.sendMessage(userId, audioMessage, {
                    sendAudioAsVoice: true,
                    caption: "Menu Principal"
                });
                console.log("✅ Áudio do menu principal enviado");
            } else {
                console.error("❌ Arquivo de áudio não encontrado:", faqAudioPrincipal);
            }
        } catch (error) {
            console.error("❌ Erro ao enviar mensagem/áudio:", error);
        }
        return;
    }
    
    // Guarda o tipo atual e a opção selecionada para uso posterior
    userLastStates[userId] = {
        state: 'faqMenu2',
        tipoId: tipoSelecionado,
        tipoSelecionado: userInput // GUARDA A OPÇÃO ESCOLHIDA (1-7)
    };
    
    const tipo = perguntasFrequentes[tipoSelecionado];
    
    // Verifica se a entrada é uma pergunta válida
    if (userInput in tipo.perguntas) {
        const pergunta = tipo.perguntas[userInput];
        userStates[userId] = 'faqResposta';
        
        // Envia a resposta em texto
        await client.sendMessage(userId, 
            `*${tipo.nome} - ${pergunta.pergunta}*\n\n${pergunta.resposta}\n\n` +
            `0️⃣ ↩︎ Voltar às perguntas\nDigite "Fim" para encerrar`);
            
        // Envia o áudio com a resposta
        try {
            if (pergunta.audioResposta && fs.existsSync(pergunta.audioResposta)) {
                const fileData = fs.readFileSync(pergunta.audioResposta);
                const audioMessage = new MessageMedia(
                    'audio/mp3',
                    fileData.toString('base64'),
                    'resposta_faq.mp3'
                );
                
                await delay(1000);
                await chat.sendStateRecording();
                await delay(2000);
                
                await client.sendMessage(userId, audioMessage, {
                    sendAudioAsVoice: true,
                    caption: "Resposta"
                });
                console.log("✅ Áudio de resposta enviado");
            }
        } catch (error) {
            console.error("❌ Erro ao enviar áudio de resposta:", error.message);
        }
            
    } else if (userInput === '0') {
        userStates[userId] = 'faqMenu1';
        await client.sendMessage(userId,
            `🤔 *Sobre que tipo de seguro tem dúvidas?*\n\n` +
            `Digite 1️⃣ - 🚗 Automóvel\n` +
            `Digite 2️⃣ - 🏡 Residencial\n` +
            `Digite 3️⃣ - 🏢 Empresarial\n` +
            `Digite 4️⃣ - ❤️ Vida\n` +
            `Digite 5️⃣ - 📱 Celular\n` +
            `Digite 6️⃣ - 💻 Notebook\n` +
            `Digite 7️⃣ - 🚲 Bicicleta\n\n` +
            `0️⃣ ↩︎ Voltar\n` +
            `Digite "Fim" para encerrar`);
    } else if (userInput.toLowerCase() === 'fim') {
        return iniciarAvaliacao(userId, name);
    } else {
        await client.sendMessage(userId, `⚠️ Opção inválida. Escolha de 1️⃣ a 5️⃣ ou 0️⃣ para voltar.`);
    }
} else if (state === 'faqResposta') {
    // Recupera informações do estado anterior
    if (!userLastStates[userId] || typeof userLastStates[userId] !== 'object') {
        // Se não tivermos os dados necessários, voltamos para o menu principal
        userStates[userId] = 'faqMenu1';
        await client.sendMessage(userId,
            `⚠ _Houve um problema. Vamos recomeçar._\n\n\n` +
            `🤔 *Sobre que tipo de seguro tem dúvidas?*\n\n` +
            `Digite 1️⃣ - 🚗 Automóvel\n` +
            `Digite 2️⃣ - 🏡 Residencial\n` +
            `Digite 3️⃣ - 🏢 Empresarial\n` +
            `Digite 4️⃣ - ❤️ Vida\n` +
            `Digite 5️⃣ - 📱 Celular\n` +
            `Digite 6️⃣ - 💻 Notebook\n` +
            `Digite 7️⃣ - 🚲 Bicicleta\n\n` +
            `0️⃣ ↩︎ Voltar\n` +
            `Digite "Fim" para encerrar`);
        return;
    }
    
    const tipoId = userLastStates[userId].tipoId;
    
    if (userInput === '0') {
        // Voltar para a lista de perguntas do mesmo tipo
        userStates[userId] = 'faqMenu2';
        
        try {
            const tipo = perguntasFrequentes[tipoId];
            
            if (tipo && tipo.perguntas) {
                let mensagem = `*${tipo.nome} - Perguntas Frequentes*\n\n`;
                Object.entries(tipo.perguntas).forEach(([key, value]) => {
                    mensagem += `Digite ${key} - ${value.pergunta}\n`;
                });
                
                await client.sendMessage(userId, 
                    mensagem + `\n0️⃣ ↩︎ Voltar\nDigite "Fim" para encerrar`);
                    
                // Envia o áudio com as perguntas
                try {
                    if (tipo.audioPerguntas && fs.existsSync(tipo.audioPerguntas)) {
                        const fileData = fs.readFileSync(tipo.audioPerguntas);
                        const audioMessage = new MessageMedia(
                            'audio/mp3',
                            fileData.toString('base64'),
                            'perguntas_faq.mp3'
                        );
                        
                        await delay(1000);
                        await chat.sendStateRecording();
                        await delay(2000);
                        
                        await client.sendMessage(userId, audioMessage, {
                            sendAudioAsVoice: true,
                            caption: "Perguntas frequentes"
                        });
                        console.log("✅ Áudio de perguntas enviado");
                    }
                } catch (error) {
                    console.error("❌ Erro ao enviar áudio de perguntas:", error.message);
                }
            } else {
                throw new Error("Tipo não encontrado");
            }
        } catch (error) {
            console.error("❌ Erro ao processar retorno do FAQ:", error.message);
            // Em caso de erro, volta para o menu principal
            userStates[userId] = 'faqMenu1';
            await client.sendMessage(userId,
                `⚠ _Houve um problema. Vamos recomeçar._\n\n\n` +
                `🤔 *Sobre que tipo de seguro tem dúvidas?*\n\n` +
                `Digite 1️⃣ - 🚗 Automóvel\n` +
                `Digite 2️⃣ - 🏡 Residencial\n` +
                `Digite 3️⃣ - 🏢 Empresarial\n` +
                `Digite 4️⃣ - ❤️ Vida\n` +
                `Digite 5️⃣ - 📱 Celular\n` +
                `Digite 6️⃣ - 💻 Notebook\n` +
                `Digite 7️⃣ - 🚲 Bicicleta\n\n` +
                `0️⃣ ↩︎ Voltar\n` +
                `Digite "Fim" para encerrar`);
        }
    } else if (userInput.toLowerCase() === 'fim') {
        return iniciarAvaliacao(userId, name);
    } else {
        await client.sendMessage(userId, `⚠️ Opção inválida. Digite 0️⃣ para voltar ou "Fim" para encerrar.`);
    }

    } else if (state === 'faqResposta') {
    // Manipulador de estado para processar respostas APÓS mostrar uma resposta do FAQ
    const tipoSelecionado = userLastStates[userId].tipoSelecionado;
    
    if (userInput === '0') {
        // Voltar para a lista de perguntas do mesmo tipo
        userStates[userId] = 'faqMenu2';
        const tipo = perguntasFrequentes[tipoSelecionado];
        
        let mensagem = `*${tipo.nome} - Perguntas Frequentes*\n\n`;
        Object.entries(tipo.perguntas).forEach(([key, value]) => {
            mensagem += `Digite ${key} - ${value.pergunta}\n`;
        });
        
        await client.sendMessage(userId, 
            mensagem + `\n0️⃣ ↩︎ Voltar\nDigite "Fim" para encerrar`);
            
        // Envia o áudio com as perguntas
        try {
            if (tipo.audioPerguntas && fs.existsSync(tipo.audioPerguntas)) {
                const fileData = fs.readFileSync(tipo.audioPerguntas);
                const audioMessage = new MessageMedia(
                    'audio/mp3',
                    fileData.toString('base64'),
                    'perguntas_faq.mp3'
                );
                
                await delay(1000);
                await chat.sendStateRecording();
                await delay(2000);
                
                await client.sendMessage(userId, audioMessage, {
                    sendAudioAsVoice: true,
                    caption: "Perguntas frequentes"
                });
                console.log("✅ Áudio de perguntas enviado");
            }
        } catch (error) {
            console.error("❌ Erro ao enviar áudio de perguntas:", error.message);
        }
        
    } else if (userInput.toLowerCase() === 'fim') {
        return iniciarAvaliacao(userId, name);
    } else {
        await client.sendMessage(userId, `⚠️ Opção inválida. Digite 0️⃣ para voltar ou "Fim" para encerrar.`);
    }
// PERGUNTAS FREQUENTES - MANIPULADORES °°°°° PERGUNTAS FREQUENTES - MANIPULADORES °°°°° PERGUNTAS FREQUENTES - MANIPULADORES °°°°° PERGUNTAS FREQUENTES - MANIPULADORES °°°°°




} else if (state === 'tipoSeguro') {
    // ARMAZENA O ESTADO PARA RETOMADA
    userLastStates[userId] = {
        state: 'tipoSeguro'
    };
        const info = {
            '1': 'Agora que sabemos que você está buscando um seguro para o seu veículo, me ajuda com mais algumas coisinhas para te enviar a melhor cotação\n\n Vou precisar do seguinte:\n 🪪 *CPF:* \n 🪪 *CPF do condutor* (se for outra pessoa):\n 📍 *CEP:* \n 📑 *Placa ou Chassi:* \n ♟️ *Uso do veículo:*(Pessoal, Profissional ou Misturado):\n\n\n Com isso, eu já preparo sua cotação rapidinho, aguardo sua resposta!.\n\n',
            '2': 'Seu lar é o seu refúgio, e protegê-lo é uma forma de cuidar da sua tranquilidade.\nPara te enviar a melhor proposta, me envie:\n\n 🪪 *CPF:*\n 🗺️ *Endereço completo:*\n 💰 *Valor aproximado do imóvel:*\n\n\n Assim que me enviar essas informações início sua cotação!\n\n',
            '3': 'Proteger o seu negócio é cuidar de tudo o que você construiu com esforço e dedicação\nPara preparar sua cotação empresarial, vou precisar das seguintes informações:\n\n 🧾 *CNPJ:*\n 🗺️ *Endereço completo:*\n 💰 *Valor aproximado do imóvel ou capital segurado:*\n 🏭 *Atividade comercial da empresa:*\n\n\n Assim que me enviar essas informações início sua cotação!\n\n',
            '4': 'Cuidar de si e de quem amamos é um gesto de carinho.\nPara preparar sua cotação de seguro de vida, vou precisar de alguns dados básicos:\n\n 🪪 *CPF:*\n 💼 *Profissão:*\n 🗺️ *CEP:*\n *Valor desejado de indenização:*\n\n\n Assim que me enviar essas informações início sua cotação!\n\n',  
            '5': 'Seu celular faz parte do seu dia a dia, e protegê-lo é garantir mais tranquilidade pra você.\nPara preparar sua cotação, vou precisar de alguns dados básicos:\n\n 🪪 *CPF:*\n 🗺️ *CEP:*\n 📱 *Marca e modelo:*\n 📅 *Data da compra:*\n 💰 *Valor aproximado do aparelho:*\n\n\n Assim que me enviar essas informações início sua cotação!\n\n',
            '6': 'Seu notebook é uma ferramenta importante, seja para trabalho, estudos ou lazer.\nVamos protegê-lo? Para montar sua cotação, me envie:\n\n 🪪 *CPF:*\n 🗺️ *CEP:*\n 📱 *Marca e modelo:*\n 📅 *Data da compra:*\n 💰 *Valor aproximado do equipamento:*\n\n\n Assim que me enviar essas informações início sua cotação!\n\n',
            '7': 'Pedalar com segurança é ainda melhor! Vamos cuidar da sua bike com carinho.\nPara fazer sua cotação, vou precisar destas informações:\n\n 🪪 *CPF:*\n 🗺️ *CEP:*\n 📱 *Marca e modelo:*\n 📅 *Data da compra:*\n 💰 *Valor aproximado da bicicleta:*\n\n\n Assim que me enviar essas informações início sua cotação!\n\n',
        };
        if (userInput in info) {
            userStates[userId] = 'detalhesCotacao';
            await client.sendMessage(userId, `${info[userInput]}\n\n0️⃣ ↩︎ Voltar`);

 // °°°°°DICA°°°°°DICA°°°°°DICA°°°°°DICA°°°°°DICA°°°°°DICA°°°°°DICA°°°°°DICA°°°°°DICA°°°°°DICA°°°°°DICA°°°°°DICA°°°°°DICA°°°°°DICA°°°°°DICA°°°°°
           
 if (userInput === '1') {
    await delay(3500);
    await chat.sendStateTyping();
    await delay(7000);
    await chat.sendStateTyping();
    await delay(4000);
    
    // Substituição do texto 1 pelo áudio "auto dica.mp3"
    try {
        const audioPath1 = 'E:\\RM-CPM\\ChatBot Whatsapp\\Áudios\\auto dica.mp3';
        
        if (fs.existsSync(audioPath1)) {
            const fileData1 = fs.readFileSync(audioPath1);
            const audioMessage1 = new MessageMedia(
                'audio/mp3',
                fileData1.toString('base64'),
                'dica_documentos.mp3'
            );

            await chat.sendStateRecording();
            await delay(1500);
            
            await client.sendMessage(userId, audioMessage1, {
                sendAudioAsVoice: true,
                caption: "Dica de documentos"
            });
            console.log("✅ Áudio 'auto dica' enviado");
        } else {
            console.warn("⚠️ Áudio 'auto dica.mp3' não encontrado");
            // Fallback opcional para o texto original caso queira
        }
    } catch (error) {
        console.error("❌ Erro ao enviar áudio de dica:", error.message);
    }

    autoFormTimeouts[userId] = setTimeout(async () => {
        // Substituição do texto 2 pelo áudio "site chamada.mp3"
        try {
            const audioPath2 = 'E:\\RM-CPM\\ChatBot Whatsapp\\Áudios\\site chamada.mp3';
            
            if (fs.existsSync(audioPath2)) {
                const fileData2 = fs.readFileSync(audioPath2);
                const audioMessage2 = new MessageMedia(
                    'audio/mp3',
                    fileData2.toString('base64'),
                    'chamada_site.mp3'
                );

                await chat.sendStateRecording();
                await delay(1500);
                
                await client.sendMessage(userId, audioMessage2, {
                    sendAudioAsVoice: true
                });
                console.log("✅ Áudio 'site chamada' enviado");
            } else {
                console.warn("⚠️ Áudio 'site chamada.mp3' não encontrado");
                // Fallback opcional para o texto original caso queira
            }
        } catch (error) {
            console.error("❌ Erro ao enviar áudio de chamada:", error.message);
        }

        await delay(1000);
        await chat.sendStateTyping();
        await delay(3000);

        // Mantém o envio do link textual
        await client.sendMessage(userId, `Acesse: https://cotaparamim.com.br/c-auto`);
    }, 2 * 60000);
}

// °°°°°DICA°°°°°DICA°°°°°DICA°°°°°DICA°°°°°DICA°°°°°DICA°°°°°DICA°°°°°DICA°°°°°DICA°°°°°DICA°°°°°DICA°°°°°DICA°°°°°DICA°°°°°DICA°°°°°DICA°°°°°

if (userInput === '2') {
    await delay(3500);
    await chat.sendStateTyping();
    await delay(7000);
    await chat.sendStateTyping();
    await delay(4000);
    
    // Substituição do texto 1 pelo áudio "residencial dica.mp3" (alteração solicitada)
    try {
        const audioPath1 = 'E:\\RM-CPM\\ChatBot Whatsapp\\Áudios\\residencial dica.mp3';  // Áudio alterado aqui
        
        if (fs.existsSync(audioPath1)) {
            const fileData1 = fs.readFileSync(audioPath1);
            const audioMessage1 = new MessageMedia(
                'audio/mp3',
                fileData1.toString('base64'),
                'dica_residencial.mp3'  // Nome do arquivo alterado para corresponder
            );

            await chat.sendStateRecording();
            await delay(1500);
            
            await client.sendMessage(userId, audioMessage1, {
                sendAudioAsVoice: true,
                caption: "Dica para documentos residenciais"  // Legenda atualizada
            });
            console.log("✅ Áudio 'residencial dica' enviado");  // Log atualizado
        } else {
            console.warn("⚠️ Áudio 'residencial dica.mp3' não encontrado");  // Mensagem atualizada
            // Fallback opcional para o texto original caso queira
        }
    } catch (error) {
        console.error("❌ Erro ao enviar áudio de dica residencial:", error.message);  // Mensagem atualizada
    }

    // O restante permanece EXATAMENTE igual
    autoFormTimeouts[userId] = setTimeout(async () => {
        try {
            const audioPath2 = 'E:\\RM-CPM\\ChatBot Whatsapp\\Áudios\\site chamada.mp3';
            
            if (fs.existsSync(audioPath2)) {
                const fileData2 = fs.readFileSync(audioPath2);
                const audioMessage2 = new MessageMedia(
                    'audio/mp3',
                    fileData2.toString('base64'),
                    'chamada_site.mp3'
                );

                await chat.sendStateRecording();
                await delay(1500);
                
                await client.sendMessage(userId, audioMessage2, {
                    sendAudioAsVoice: true
                });
                console.log("✅ Áudio 'site chamada' enviado");
            } else {
                console.warn("⚠️ Áudio 'site chamada.mp3' não encontrado");
            }
        } catch (error) {
            console.error("❌ Erro ao enviar áudio de chamada:", error.message);
        }

        await delay(1000);
        await chat.sendStateTyping();
        await delay(3000);

        // Mantém o envio do link textual (original)
        await client.sendMessage(userId, `Acesse: https://cotaparamim.com.br/c-residencia`);
    }, 2 * 60000);
}


// °°°°°DICA°°°°°DICA°°°°°DICA°°°°°DICA°°°°°DICA°°°°°DICA°°°°°DICA°°°°°DICA°°°°°DICA°°°°°DICA°°°°°DICA°°°°°DICA°°°°°DICA°°°°°DICA°°°°°DICA°°°°°

if (userInput === '3') {
    await delay(3500);
    await chat.sendStateTyping();
    await delay(7000);
    await chat.sendStateTyping();
    await delay(4000);
    
    // Áudio alterado para "empresarial dica.mp3"
    try {
        const audioPath1 = 'E:\\RM-CPM\\ChatBot Whatsapp\\Áudios\\empresarial dica.mp3';  // Alteração aqui
        
        if (fs.existsSync(audioPath1)) {
            const fileData1 = fs.readFileSync(audioPath1);
            const audioMessage1 = new MessageMedia(
                'audio/mp3',
                fileData1.toString('base64'),
                'dica_empresarial.mp3'  // Nome do arquivo alterado
            );

            await chat.sendStateRecording();
            await delay(1500);
            
            await client.sendMessage(userId, audioMessage1, {
                sendAudioAsVoice: true,
                caption: "Dica para documentos empresariais"  // Legenda atualizada
            });
            console.log("✅ Áudio 'empresarial dica' enviado");  // Log atualizado
        } else {
            console.warn("⚠️ Áudio 'empresarial dica.mp3' não encontrado");  // Mensagem atualizada
            // Fallback opcional para o texto original caso queira
        }
    } catch (error) {
        console.error("❌ Erro ao enviar áudio de dica empresarial:", error.message);  // Mensagem atualizada
    }

    // O restante permanece EXATAMENTE IGUAL
    autoFormTimeouts[userId] = setTimeout(async () => {
        try {
            const audioPath2 = 'E:\\RM-CPM\\ChatBot Whatsapp\\Áudios\\site chamada.mp3';
            
            if (fs.existsSync(audioPath2)) {
                const fileData2 = fs.readFileSync(audioPath2);
                const audioMessage2 = new MessageMedia(
                    'audio/mp3',
                    fileData2.toString('base64'),
                    'chamada_site.mp3'
                );

                await chat.sendStateRecording();
                await delay(1500);
                
                await client.sendMessage(userId, audioMessage2, {
                    sendAudioAsVoice: true
                });
                console.log("✅ Áudio 'site chamada' enviado");
            } else {
                console.warn("⚠️ Áudio 'site chamada.mp3' não encontrado");
            }
        } catch (error) {
            console.error("❌ Erro ao enviar áudio de chamada:", error.message);
        }

        await delay(1000);
        await chat.sendStateTyping();
        await delay(3000);

        // Mantém o envio do link (ajustado para empresarial)
        await client.sendMessage(userId, `Acesse: https://cotaparamim.com.br/c-empresa`);  // Link atualizado
    }, 2 * 60000);
}

// °°°°°DICA°°°°°DICA°°°°°DICA°°°°°DICA°°°°°DICA°°°°°DICA°°°°°DICA°°°°°DICA°°°°°DICA°°°°°DICA°°°°°DICA°°°°°DICA°°°°°DICA°°°°°DICA°°°°°DICA°°°°°

if (userInput === '4') {
    await delay(3500);
    await chat.sendStateTyping();
    await delay(7000);
    await chat.sendStateTyping();
    await delay(4000);
    
    // Áudio alterado para "vida dica.mp3"
    try {
        const audioPath1 = 'E:\\RM-CPM\\ChatBot Whatsapp\\Áudios\\vida dica.mp3';  // Alteração aqui
        
        if (fs.existsSync(audioPath1)) {
            const fileData1 = fs.readFileSync(audioPath1);
            const audioMessage1 = new MessageMedia(
                'audio/mp3',
                fileData1.toString('base64'),
                'dica_vida.mp3'  // Nome do arquivo alterado
            );

            await chat.sendStateRecording();
            await delay(1500);
            
            await client.sendMessage(userId, audioMessage1, {
                sendAudioAsVoice: true,
                caption: "Dica para seguro de vida"  // Legenda atualizada
            });
            console.log("✅ Áudio 'vida dica' enviado");  // Log atualizado
        } else {
            console.warn("⚠️ Áudio 'vida dica.mp3' não encontrado");  // Mensagem atualizada
            // Fallback opcional para o texto original caso queira
        }
    } catch (error) {
        console.error("❌ Erro ao enviar áudio de dica vida:", error.message);  // Mensagem atualizada
    }

    // O restante permanece EXATAMENTE IGUAL
    autoFormTimeouts[userId] = setTimeout(async () => {
        try {
            const audioPath2 = 'E:\\RM-CPM\\ChatBot Whatsapp\\Áudios\\site chamada.mp3';
            
            if (fs.existsSync(audioPath2)) {
                const fileData2 = fs.readFileSync(audioPath2);
                const audioMessage2 = new MessageMedia(
                    'audio/mp3',
                    fileData2.toString('base64'),
                    'chamada_site.mp3'
                );

                await chat.sendStateRecording();
                await delay(1500);
                
                await client.sendMessage(userId, audioMessage2, {
                    sendAudioAsVoice: true
                });
                console.log("✅ Áudio 'site chamada' enviado");
            } else {
                console.warn("⚠️ Áudio 'site chamada.mp3' não encontrado");
            }
        } catch (error) {
            console.error("❌ Erro ao enviar áudio de chamada:", error.message);
        }

        await delay(1000);
        await chat.sendStateTyping();
        await delay(3000);

        // Mantém o envio do link (ajustado para vida)
        await client.sendMessage(userId, `Acesse: https://cotaparamim.com.br/c-vida`);  // Já estava correto
    }, 2 * 60000);
}


// °°°°°DICA°°°°°DICA°°°°°DICA°°°°°DICA°°°°°DICA°°°°°DICA°°°°°DICA°°°°°DICA°°°°°DICA°°°°°DICA°°°°°DICA°°°°°DICA°°°°°DICA°°°°°DICA°°°°°DICA°°°°°

if (userInput === '5') {
    await delay(3500);
    await chat.sendStateTyping();
    await delay(7000);
    await chat.sendStateTyping();
    await delay(4000);
    
    // Áudio alterado para "celular dica.mp3"
    try {
        const audioPath1 = 'E:\\RM-CPM\\ChatBot Whatsapp\\Áudios\\celular dica.mp3';  // Alteração aqui
        
        if (fs.existsSync(audioPath1)) {
            const fileData1 = fs.readFileSync(audioPath1);
            const audioMessage1 = new MessageMedia(
                'audio/mp3',
                fileData1.toString('base64'),
                'dica_celular.mp3'  // Nome do arquivo alterado
            );

            await chat.sendStateRecording();
            await delay(1500);
            
            await client.sendMessage(userId, audioMessage1, {
                sendAudioAsVoice: true,
                caption: "Dica para seguro de celular"  // Legenda atualizada
            });
            console.log("✅ Áudio 'celular dica' enviado");  // Log atualizado
        } else {
            console.warn("⚠️ Áudio 'celular dica.mp3' não encontrado");  // Mensagem atualizada
            // Fallback opcional para o texto original caso queira
        }
    } catch (error) {
        console.error("❌ Erro ao enviar áudio de dica celular:", error.message);  // Mensagem atualizada
    }

    // O restante permanece EXATAMENTE IGUAL
    autoFormTimeouts[userId] = setTimeout(async () => {
        try {
            const audioPath2 = 'E:\\RM-CPM\\ChatBot Whatsapp\\Áudios\\site chamada.mp3';
            
            if (fs.existsSync(audioPath2)) {
                const fileData2 = fs.readFileSync(audioPath2);
                const audioMessage2 = new MessageMedia(
                    'audio/mp3',
                    fileData2.toString('base64'),
                    'chamada_site.mp3'
                );

                await chat.sendStateRecording();
                await delay(1500);
                
                await client.sendMessage(userId, audioMessage2, {
                    sendAudioAsVoice: true
                });
                console.log("✅ Áudio 'site chamada' enviado");
            } else {
                console.warn("⚠️ Áudio 'site chamada.mp3' não encontrado");
            }
        } catch (error) {
            console.error("❌ Erro ao enviar áudio de chamada:", error.message);
        }

        await delay(1000);
        await chat.sendStateTyping();
        await delay(3000);

        // Mantém o envio do link (ajustado para celular)
        await client.sendMessage(userId, `Acesse: https://cotaparamim.com.br/celular#c-celular`);  // Já estava correto
    }, 2 * 60000);
}


// °°°°°DICA°°°°°DICA°°°°°DICA°°°°°DICA°°°°°DICA°°°°°DICA°°°°°DICA°°°°°DICA°°°°°DICA°°°°°DICA°°°°°DICA°°°°°DICA°°°°°DICA°°°°°DICA°°°°°DICA°°°°°

if (userInput === '6') {
    await delay(3500);
    await chat.sendStateTyping();
    await delay(7000);
    await chat.sendStateTyping();
    await delay(4000);
    
    // Áudio alterado para "notebook dica.mp3"
    try {
        const audioPath1 = 'E:\\RM-CPM\\ChatBot Whatsapp\\Áudios\\notebook dica.mp3';  // Alteração aqui
        
        if (fs.existsSync(audioPath1)) {
            const fileData1 = fs.readFileSync(audioPath1);
            const audioMessage1 = new MessageMedia(
                'audio/mp3',
                fileData1.toString('base64'),
                'dica_notebook.mp3'  // Nome do arquivo alterado
            );

            await chat.sendStateRecording();
            await delay(1500);
            
            await client.sendMessage(userId, audioMessage1, {
                sendAudioAsVoice: true,
                caption: "Dica para seguro de notebook"  // Legenda atualizada
            });
            console.log("✅ Áudio 'notebook dica' enviado");  // Log atualizado
        } else {
            console.warn("⚠️ Áudio 'notebook dica.mp3' não encontrado");  // Mensagem atualizada
            // Fallback opcional para o texto original caso queira
        }
    } catch (error) {
        console.error("❌ Erro ao enviar áudio de dica notebook:", error.message);  // Mensagem atualizada
    }

    // O restante permanece EXATAMENTE IGUAL
    autoFormTimeouts[userId] = setTimeout(async () => {
        try {
            const audioPath2 = 'E:\\RM-CPM\\ChatBot Whatsapp\\Áudios\\site chamada.mp3';
            
            if (fs.existsSync(audioPath2)) {
                const fileData2 = fs.readFileSync(audioPath2);
                const audioMessage2 = new MessageMedia(
                    'audio/mp3',
                    fileData2.toString('base64'),
                    'chamada_site.mp3'
                );

                await chat.sendStateRecording();
                await delay(1500);
                
                await client.sendMessage(userId, audioMessage2, {
                    sendAudioAsVoice: true
                });
                console.log("✅ Áudio 'site chamada' enviado");
            } else {
                console.warn("⚠️ Áudio 'site chamada.mp3' não encontrado");
            }
        } catch (error) {
            console.error("❌ Erro ao enviar áudio de chamada:", error.message);
        }

        await delay(1000);
        await chat.sendStateTyping();
        await delay(3000);

        // Mantém o envio do link (ajustado para notebook)
        await client.sendMessage(userId, `Acesse: https://cotaparamim.com.br/notebook#c-note`);  // Já estava correto
    }, 2 * 60000);
}



// °°°°°DICA°°°°°DICA°°°°°DICA°°°°°DICA°°°°°DICA°°°°°DICA°°°°°DICA°°°°°DICA°°°°°DICA°°°°°DICA°°°°°DICA°°°°°DICA°°°°°DICA°°°°°DICA°°°°°DICA°°°°°

if (userInput === '7') {
    await delay(3500);
    await chat.sendStateTyping();
    await delay(7000);
    await chat.sendStateTyping();
    await delay(4000);
    
    // Áudio alterado para "bicicleta dica.mp3"
    try {
        const audioPath1 = 'E:\\RM-CPM\\ChatBot Whatsapp\\Áudios\\bicicleta dica.mp3';  // Alteração aqui
        
        if (fs.existsSync(audioPath1)) {
            const fileData1 = fs.readFileSync(audioPath1);
            const audioMessage1 = new MessageMedia(
                'audio/mp3',
                fileData1.toString('base64'),
                'dica_bicicleta.mp3'  // Nome do arquivo alterado
            );

            await chat.sendStateRecording();
            await delay(1500);
            
            await client.sendMessage(userId, audioMessage1, {
                sendAudioAsVoice: true,
                caption: "Dica para seguro de bicicleta"  // Legenda atualizada
            });
            console.log("✅ Áudio 'bicicleta dica' enviado");  // Log atualizado
        } else {
            console.warn("⚠️ Áudio 'bicicleta dica.mp3' não encontrado");  // Mensagem atualizada
            // Fallback opcional para o texto original caso queira
        }
    } catch (error) {
        console.error("❌ Erro ao enviar áudio de dica bicicleta:", error.message);  // Mensagem atualizada
    }

    // O restante permanece EXATAMENTE IGUAL
    autoFormTimeouts[userId] = setTimeout(async () => {
        try {
            const audioPath2 = 'E:\\RM-CPM\\ChatBot Whatsapp\\Áudios\\site chamada.mp3';
            
            if (fs.existsSync(audioPath2)) {
                const fileData2 = fs.readFileSync(audioPath2);
                const audioMessage2 = new MessageMedia(
                    'audio/mp3',
                    fileData2.toString('base64'),
                    'chamada_site.mp3'
                );

                await chat.sendStateRecording();
                await delay(1500);
                
                await client.sendMessage(userId, audioMessage2, {
                    sendAudioAsVoice: true
                });
                console.log("✅ Áudio 'site chamada' enviado");
            } else {
                console.warn("⚠️ Áudio 'site chamada.mp3' não encontrado");
            }
        } catch (error) {
            console.error("❌ Erro ao enviar áudio de chamada:", error.message);
        }

        await delay(1000);
        await chat.sendStateTyping();
        await delay(3000);

        // Mantém o envio do link (ajustado para bicicleta)
        await client.sendMessage(userId, `Acesse: https://cotaparamim.com.br/bike#c-bike`);  // Já estava correto
    }, 2 * 60000);
}

// °°°°°DICA°°°°°DICA°°°°°DICA°°°°°DICA°°°°°DICA°°°°°DICA°°°°°DICA°°°°°DICA°°°°°DICA°°°°°DICA°°°°°DICA°°°°°DICA°°°°°DICA°°°°°DICA°°°°°DICA°°°°°

//°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°
} else if (userInput === '0') {
    userStates[userId] = 'mainMenu';
    
    // Envia o menu escrito
    await client.sendMessage(userId,
        `Escolha uma das opções a seguir:\n\n` +
        `Digite 1️⃣ - Preciso de um seguro\n` +
        `Digite 2️⃣ - Assistência 24 horas\n` +
        `Digite 3️⃣ - Conhecer a empresa\n` +
        `Digite 4️⃣ - Como funciona\n` +
        `Digite 5️⃣ - Perguntas Frequentes\n` +
        `Digite 6️⃣ - Indique e ganhe\n` +
        `Digite 7️⃣ - Falar com atendente\n\n`);
    
    // Envia o áudio do menu principal2
    try {
        const audioPath = 'E:\\RM-CPM\\ChatBot Whatsapp\\Áudios\\menu principal2.mp3';
        
        if (!fs.existsSync(audioPath)) {
            throw new Error(`Arquivo não encontrado: ${audioPath}`);
        }

        const fileStats = fs.statSync(audioPath);
        console.log(`Enviando áudio (${(fileStats.size/1024).toFixed(2)}KB)`);

        const fileData = fs.readFileSync(audioPath);
        const audioMessage = new MessageMedia(
            'audio/mp3',
            fileData.toString('base64'),
            'menu_principal2.mp3'
        );

        await delay(1000);
        await chat.sendStateRecording();
        await delay(2000);

        let attempts = 0;
        while (attempts < 2) {
            try {
                await client.sendMessage(userId, audioMessage, {
                    sendAudioAsVoice: true,
                    caption: "Opções do menu"
                });
                console.log("✅ Áudio menu principal2 enviado com sucesso");
                break;
            } catch (retryError) {
                attempts++;
                console.warn(`Tentativa ${attempts} falhou:`, retryError.message);
                if (attempts >= 2) throw retryError;
                await delay(3000);
            }
        }

    } catch (error) {
        console.error("❌ Falha no áudio menu principal2:", {
            error: error.message,
            stack: error.stack?.split('\n')[0] || 'N/A'
        });
        // Continua mesmo se o áudio falhar, pois o menu em texto já foi enviado
    }
} else if (userInput.toLowerCase() === 'fim') {
    return iniciarAvaliacao(userId, name);
} else {
    await client.sendMessage(userId, `⚠️ Opção inválida. Escolha de 1️⃣ a 7️⃣ ou 0️⃣ para voltar.`);
}
//°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°

// °°°°° Seguradoras °°°°° Seguradoras °°°°° Seguradoras °°°°° Seguradoras °°°°° Seguradoras °°°°° Seguradoras °°°°° Seguradoras °°°°° Seguradoras °°°°° Seguradoras 
  
} else if (state === 'assistencia24h') {
    userLastStates[userId] = 'assistencia24h';
    if (userInput === '1') {
        userStates[userId] = 'listaSeguradoras';
        
        // 1. Envia o menu textual primeiro
        await client.sendMessage(userId,
            `Para qual seguradora gostaria de pedir assistência?\n\n` +
            `Digite 1️⃣ - Porto Seguros\n` +
            `Digite 2️⃣ - Azul Seguros\n` +
            `Digite 3️⃣ - Itaú Seguros\n` +
            `Digite 4️⃣ - Mitsui Seguros\n` +
            `Digite 5️⃣ - Allianz Seguros\n` +
            `Digite 6️⃣ - Tokio Seguros\n` +
            `Digite 7️⃣ - Yelum (Liberty) Seguros\n` +
            `Digite 8️⃣ - Aliro Seguros\n` +
            `Digite 9️⃣ - HDI Seguros\n` +
            `Digite 🔟 - Alfa Seguros\n` +
            `Digite 1️⃣1️⃣ - Zurich Seguros\n` +
            `Digite 1️⃣2️⃣ - Bradesco Seguros\n` +
            `Digite 1️⃣3️⃣ - Mapfre Seguros\n` +
            `Digite 1️⃣4️⃣ - Suhai Seguros\n\n` +
            `Digite 0️⃣ ↩︎ Voltar\n` +
            `Digite "Fim" para encerrar`);
        
        // 2. Envia o áudio "seguradoras.mp3" após o menu
        try {
            const audioPath = 'E:\\RM-CPM\\ChatBot Whatsapp\\Áudios\\seguradoras.mp3';
            
            if (fs.existsSync(audioPath)) {
                const fileData = fs.readFileSync(audioPath);
                const audioMessage = new MessageMedia(
                    'audio/mp3',
                    fileData.toString('base64'),
                    'seguradoras.mp3'
                );

                // Pré-processamento para parecer natural
                await delay(1000); // Pequena pausa antes de "gravar"
                await chat.sendStateRecording(); // Simula que está gravando
                await delay(2000); // Tempo de "gravação"

                // Envio com tratamento de erros
                let attempts = 0;
                while (attempts < 2) {
                    try {
                        await client.sendMessage(userId, audioMessage, {
                            sendAudioAsVoice: true,
                            caption: "Opções de seguradoras disponíveis"
                        });
                        console.log("✅ Áudio 'seguradoras' enviado com sucesso");
                        break;
                    } catch (error) {
                        attempts++;
                        console.warn(`⚠️ Tentativa ${attempts} falhou: ${error.message}`);
                        if (attempts >= 2) {
                            console.error("❌ Falha ao enviar áudio após 2 tentativas");
                        }
                        await delay(3000); // Espera antes de tentar novamente
                    }
                }
            } else {
                console.warn("⚠️ Áudio 'seguradoras.mp3' não encontrado");
                // Não envia fallback - o menu em texto já foi enviado
            }
        } catch (error) {
            console.error("❌ Erro no processamento do áudio:", error.message);
        }



// °°°°° Como acionar a assistência 24 horas  °°°°° Como acionar a assistência 24 horas  °°°°° Como acionar a assistência 24 horas 

        } else if (userInput === '2') {
            userStates[userId] = 'acionarAssistencia';
            await client.sendMessage(userId,
                `*Como acionar sua assistência 24h:*\n\n` +
                `1. Verifique sua apólice para confirmar a seguradora\n` +
                `2. Entre em contato pelo telefone de emergência fornecido\n` +
                `3. Tenha em mãos:\n   - Número da apólice\n   - Dados pessoais\n   - Detalhes do ocorrido\n\n` +
                `Caso não encontre os contatos, posso te ajudar a localizar!\n\n` +
                `0️⃣ ↩︎ Voltar\n` +
                `Digite "Fim" para encerrar`);
        
        
        
        
 //°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°       
} else if (userInput === '0') {
    userStates[userId] = 'mainMenu';
    
    // Envia o menu escrito primeiro
    await client.sendMessage(userId,
        `Escolha uma das opções a seguir:\n\n` +
        `Digite 1️⃣ - Preciso de um seguro\n` +
        `Digite 2️⃣ - Assistência 24 horas\n` +
        `Digite 3️⃣ - Conhecer a empresa\n` +
        `Digite 4️⃣ - Como funciona\n` +
        `Digite 5️⃣ - Perguntas Frequentes\n` +
        `Digite 6️⃣ - Indique e ganhe\n` +
        `Digite 7️⃣ - Falar com atendente\n\n`);
    
    // Envia o áudio menu principal2.mp3
    try {
        const audioPath = 'E:\\RM-CPM\\ChatBot Whatsapp\\Áudios\\menu principal2.mp3';
        
        // Verifica se o arquivo existe
        if (!fs.existsSync(audioPath)) {
            throw new Error(`Arquivo de áudio não encontrado: ${audioPath}`);
        }

        const fileStats = fs.statSync(audioPath);
        console.log(`Enviando áudio menu principal2 (${(fileStats.size/1024).toFixed(2)}KB)`);

        // Prepara o áudio para envio
        const fileData = fs.readFileSync(audioPath);
        const audioMessage = new MessageMedia(
            'audio/mp3',
            fileData.toString('base64'),
            'menu_principal2.mp3'
        );

        // Simula o estado de gravação
        await delay(1000);
        await chat.sendStateRecording();
        await delay(2000);

        // Tentativa de envio com retry
        let attempts = 0;
        while (attempts < 2) {
            try {
                await client.sendMessage(userId, audioMessage, {
                    sendAudioAsVoice: true,
                    caption: "Menu de opções"
                });
                console.log("✅ Áudio menu principal2 enviado com sucesso");
                break;
            } catch (retryError) {
                attempts++;
                console.warn(`Tentativa ${attempts} falhou:`, retryError.message);
                if (attempts >= 2) throw retryError;
                await delay(3000); // Espera antes de tentar novamente
            }
        }

    } catch (error) {
        console.error("❌ Falha ao enviar áudio menu principal2:", {
            error: error.message,
            stack: error.stack?.split('\n')[0] || 'N/A'
        });
        // Não interrompe o fluxo mesmo se o áudio falhar
    }
} else if (userInput.toLowerCase() === 'fim') {
    return iniciarAvaliacao(userId, name);
}

//°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°
        
        else {
            await client.sendMessage(userId, `⚠️ Opção inválida. Escolha 1️⃣, 2️⃣ ou 0️⃣ para voltar.`);
        }
    
// RESPOSTA-DAS-SEGURADORAS-ASSISTÊNCIA °°°°°  RESPOSTA-DAS-SEGURADORAS-ASSISTÊNCIA °°°°° RESPOSTA-DAS-SEGURADORAS-ASSISTÊNCIA °°°°° RESPOSTA-DAS-SEGURADORAS-ASSISTÊNCIA °°°°° RESPOSTA-DAS-SEGURADORAS-ASSISTÊNCIA °°°°°   
    
    } else if (state === 'listaSeguradoras') {
        userLastStates[userId] = 'listaSeguradoras';
        
        const contatosSeguradoras = {
            '1': { 
                nome: 'Porto Seguros', 
                link: 'https://cotaparamim.com.br/porto#assistencia-porto',
                audio: 'assistencia porto'
            },
    
    
            '2': { 
                nome: 'Azul Seguros', 
                link: 'https://cotaparamim.com.br/azul#assistencia-24hrs-azul',
                audio: 'assistencia Azul'
            },
    
    
            '3': { 
                nome: 'Itaú Seguros', 
                link: 'https://cotaparamim.com.br/itau#assistencia-24hrs-itau',
                audio: 'assistencia Itau'
            },
    
    
            '4': { 
                nome: 'Mitsui Seguros', 
                link: 'https://cotaparamim.com.br/porto#assistencia-porto',
                audio: 'assistencia Mitsui'
            },
    
    
            '5': { 
                nome: 'Allianz Seguros', 
                link: 'https://cotaparamim.com.br/allianz#assistencia-24hrs-allianz',
                audio: 'assistencia Allianz'
            },
    
    
    
            '6': { 
                nome: 'Tokio Seguros', 
                link: 'https://cotaparamim.com.br/tokio#assistencia-24hrs-tokio',
                audio: 'assistencia Tokio'
            },
    
    
            '7': { 
                nome: 'Yelum (Liberty) Seguros', 
                link: 'https://cotaparamim.com.br/liberty#assistencia-24hrs-yelum',
                audio: 'assistencia Yelum'
            },
    
            '8': { 
                nome: 'Aliro Seguros', 
                link: 'https://cotaparamim.com.br/aliro#assistencia-24hrs-aliro',
                audio: 'assistencia HDI'
            },
    
    
            '9': { 
                nome: 'HDI Seguros', 
                link: 'https://cotaparamim.com.br/hdi#assistencia-24hrs-hdi',
                audio: 'assistencia Azul'
            },
    
    
            '10': { 
                nome: 'Alfa Seguros', 
                link: 'https://cotaparamim.com.br/alfa#assistencia-24hrs-alfa',
                audio: 'assistencia Alfa'
            },
    
    
            '11': { 
                nome: 'Zurich Seguros', 
                link: 'https://cotaparamim.com.br/zurich#assistencia-24hrs-zurich',
                audio: 'assistencia Zurich'
            },
    
    
            '12': { 
                nome: 'Bradesco Seguros', 
                link: 'https://cotaparamim.com.br/bradesco#assistencia-24hrs-bradesco',
                audio: 'assistencia Bradesco'
            },
    
    
            '13': { 
                nome: 'Mapfre Seguros', 
                link: 'https://cotaparamim.com.br/mapfre#assistencia-24hrs-mapfre',
                audio: 'assistencia Mapfre'
            },
    
    
            '14': { 
                nome: 'Suhai Seguros', 
                link: 'https://cotaparamim.com.br/suhai#assistencia-24hrs-suhai',
                audio: 'assistencia Suhai'
            }
        };
    
        if (userInput in contatosSeguradoras) {
            userStates[userId] = 'detalhesSeguradora';
            const seguradora = contatosSeguradoras[userInput];
            
            // 1. Envia o primeiro áudio específico da seguradora
            try {
                const audioPath1 = `E:\\RM-CPM\\ChatBot Whatsapp\\Áudios\\${seguradora.audio}.mp3`;
                
                if (fs.existsSync(audioPath1)) {
                    const fileData1 = fs.readFileSync(audioPath1);
                    const audioMessage1 = new MessageMedia(
                        'audio/mp3',
                        fileData1.toString('base64'),
                        `${seguradora.audio}.mp3`
                    );
    
                    await delay(1000);
                    await chat.sendStateRecording();
                    await delay(2000);
    
                    await client.sendMessage(userId, audioMessage1, {
                        sendAudioAsVoice: true
                    });
                    console.log(`✅ Áudio '${seguradora.audio}' enviado`);
                }
            } catch (error) {
                console.error(`❌ Erro no áudio ${seguradora.audio}:`, error.message);
            }
    
            // 2. Envia a imagem de contato
            await delay(1500); // Pequeno delay entre áudio e imagem
            try {
                const imagePath = 'E:\\RM-CPM\\ChatBot Whatsapp\\Imagem\\Contato.jpg';
                
                if (fs.existsSync(imagePath)) {
                    const fileData = fs.readFileSync(imagePath);
                    const imageMessage = new MessageMedia(
                        'image/jpeg',
                        fileData.toString('base64'),
                        'contato_seguradora.jpg'
                    );
    
                    await client.sendMessage(userId, imageMessage, {
                        caption: `Viu ${name}, como é pratico`
                    });
                    console.log("✅ Imagem de contato enviada");
                }
            } catch (error) {
                console.error("❌ Erro ao enviar imagem:", error.message);
            }
    
            // 3. Envia o link
            await delay(1500);
            await client.sendMessage(userId, `🔗 Acesse: ${seguradora.link}`);
    
            // 4. Envia o áudio final com dados para assistência
            await delay(1500);
            try {
                const audioPath2 = 'E:\\RM-CPM\\ChatBot Whatsapp\\Áudios\\dados para assistencia.mp3';
                
                if (fs.existsSync(audioPath2)) {
                    const fileData2 = fs.readFileSync(audioPath2);
                    const audioMessage2 = new MessageMedia(
                        'audio/mp3',
                        fileData2.toString('base64'),
                        'dados_assistencia.mp3'
                    );
    
                    await chat.sendStateRecording();
                    await delay(2000);
    
                    await client.sendMessage(userId, audioMessage2, {
                        sendAudioAsVoice: true,
                        caption: "Dados necessários para assistência"
                    });
                    console.log("✅ Áudio 'dados para assistencia' enviado");
                }
            } catch (error) {
                console.error("❌ Erro no áudio de dados:", error.message);
            }
    
             // 5. Mensagem final com opções
            await delay(1000);
            await client.sendMessage(userId,
                `0️⃣ ↩︎ Voltar para lista de seguradoras\n` +
                `Digite "Fim" para encerrar`);
    
        } else if (userInput === '0') {
            // Limpa todos os timeouts antes de voltar
            resetUserTimeouts(userId);
            
            userStates[userId] = 'assistencia24h';
            await client.sendMessage(userId,
                `*Assistência 24 horas*\n\nComo posso te ajudar com a assistência?\n\n` +
                `Digite 1️⃣ - selecionar a seguradora\n` +
                `Digite 2️⃣ - Como acionar as assistências\n\n\n\n` +
                `0️⃣ ↩︎ Voltar\n` +
                `Digite "Fim" para encerrar`);
            
        } else if (userInput.toLowerCase() === 'fim') {
            return iniciarAvaliacao(userId, name);
        } else {
            await client.sendMessage(userId, `⚠️ Opção inválida. Escolha de 1️⃣ a 1️⃣4️⃣ ou 0️⃣ para voltar.`);
        }

// °°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°

 //°°°°° SEGURADORAS °°°°° SEGURADORAS °°°°° SEGURADORAS °°°°° SEGURADORAS °°°°° SEGURADORAS °°°°° SEGURADORAS °°°°° SEGURADORAS °°°°° SEGURADORAS °°°°° SEGURADORAS °°°°° SEGURADORAS       
} else if (state === 'detalhesSeguradora') {
    if (userInput === '0') {
        userStates[userId] = 'listaSeguradoras';
        
        // Envia o menu textual primeiro
        await client.sendMessage(userId,
            `Para qual seguradora gostaria de pedir assistência?\n\n` +
            `Digite 1️⃣ - Porto Seguros\n` +
            `Digite 2️⃣ - Azul Seguros\n` +
            `Digite 3️⃣ - Itaú Seguros\n` +
            `Digite 4️⃣ - Mitsui Seguros\n` +
            `Digite 5️⃣ - Allianz Seguros\n` +
            `Digite 6️⃣ - Tokio Seguros\n` +
            `Digite 7️⃣ - Yelum (Liberty) Seguros\n` +
            `Digite 8️⃣ - Aliro Seguros\n` +
            `Digite 9️⃣ - HDI Seguros\n` +
            `Digite 🔟 - Alfa Seguros\n` +
            `Digite 1️⃣1️⃣ - Zurich Seguros\n` +
            `Digite 1️⃣2️⃣ - Bradesco Seguros\n` +
            `Digite 1️⃣3️⃣ - Mapfre Seguros\n` +
            `Digite 1️⃣4️⃣ - Suhai Seguros\n\n` +
            `Digite 0️⃣ ↩︎ Voltar\n` +
            `Digite "Fim" para encerrar`);
        
        // Envia o áudio "seguradoras.mp3" após o menu
        try {
            const audioPath = 'E:\\RM-CPM\\ChatBot Whatsapp\\Áudios\\seguradoras.mp3';
            
            if (fs.existsSync(audioPath)) {
                const fileData = fs.readFileSync(audioPath);
                const audioMessage = new MessageMedia(
                    'audio/mp3',
                    fileData.toString('base64'),
                    'seguradoras.mp3'
                );

                // Pré-processamento para parecer natural
                await delay(1000);
                await chat.sendStateRecording();
                await delay(2000);

                // Envio com tratamento de erros
                let attempts = 0;
                while (attempts < 2) {
                    try {
                        await client.sendMessage(userId, audioMessage, {
                            sendAudioAsVoice: true,
                            caption: "Opções de seguradoras disponíveis"
                        });
                        console.log("✅ Áudio 'seguradoras' enviado com sucesso");
                        break;
                    } catch (error) {
                        attempts++;
                        console.warn(`⚠️ Tentativa ${attempts} falhou: ${error.message}`);
                        if (attempts >= 2) {
                            console.error("❌ Falha ao enviar áudio após 2 tentativas");
                        }
                        await delay(3000);
                    }
                }
            } else {
                console.warn("⚠️ Áudio 'seguradoras.mp3' não encontrado");
                // Não envia fallback - o menu em texto já foi enviado
            }
        } catch (error) {
            console.error("❌ Erro no processamento do áudio:", error.message);
        }
    } else if (userInput.toLowerCase() === 'fim') {
        return iniciarAvaliacao(userId, name);
    } else {
        await client.sendMessage(userId, `⚠️ Digite 0️⃣ para voltar à lista de seguradoras ou "Fim" para encerrar.`);
    }

 //°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°

} else if (state === 'acionarAssistencia') {
        userLastStates[userId] = state;
        if (userInput === '0') {
            userStates[userId] = 'assistencia24h';
            await client.sendMessage(userId,
                `*Assistência 24 horas*\n\nComo posso te ajudar com a assistência?\n\n` +
                `Digite 1️⃣ - selecionar a seguradora\n` +
                `Digite 2️⃣ - Como acionar as assistências\n\n\n\n` +
                `0️⃣ ↩︎ Voltar\n` +
                `Digite "Fim" para encerrar`);
        } else if (userInput.toLowerCase() === 'fim') {
            return iniciarAvaliacao(userId, name);
        }

 //°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°
} else if (["sobre", "comoFunciona", "perguntasFrequentes", "indiqueGanhe", "atendente", "detalhesCotacao"].includes(state)) {
    userLastStates[userId] = state;
    if (userInput === '0') {
        userStates[userId] = 'mainMenu';
        
        // Envia o menu escrito
        await client.sendMessage(userId,
            `Escolha uma das opções a seguir:\n\n` +
            `Digite 1️⃣ - Preciso de um seguro\n` +
            `Digite 2️⃣ - Assistência 24 horas\n` +
            `Digite 3️⃣ - Conhecer a empresa\n` +
            `Digite 4️⃣ - Como funciona\n` +
            `Digite 5️⃣ - Perguntas Frequentes\n` +
            `Digite 6️⃣ - Indique e ganhe\n` +
            `Digite 7️⃣ - Falar com atendente\n\n`);
        
        // Envia o áudio menu principal2.mp3
        try {
            const audioPath = 'E:\\RM-CPM\\ChatBot Whatsapp\\Áudios\\menu principal2.mp3';
            
            if (!fs.existsSync(audioPath)) {
                console.warn(`Arquivo de áudio não encontrado: ${audioPath}`);
                return;  // Continua sem áudio
            }

            const fileStats = fs.statSync(audioPath);
            console.log(`Enviando áudio menu principal2 (${(fileStats.size/1024).toFixed(2)}KB)`);

            const fileData = fs.readFileSync(audioPath);
            const audioMessage = new MessageMedia(
                'audio/mp3',
                fileData.toString('base64'),
                'menu_principal2.mp3'
            );

            // Pré-processamento
            await delay(1000);
            await chat.sendStateRecording();
            await delay(2000);

            // Envio com retry
            let attempts = 0;
            while (attempts < 2) {
                try {
                    await client.sendMessage(userId, audioMessage, {
                        sendAudioAsVoice: true,
                        caption: "Menu de opções"
                    });
                    console.log("✅ Áudio menu principal2 enviado com sucesso");
                    break;
                } catch (retryError) {
                    attempts++;
                    console.warn(`Tentativa ${attempts} falhou:`, retryError.message);
                    if (attempts >= 2) {
                        console.error("❌ Falha ao enviar áudio após 2 tentativas");
                        break;
                    }
                    await delay(3000);
                }
            }

        } catch (error) {
            console.error("Erro no envio do áudio:", {
                error: error.message,
                stack: error.stack?.split('\n')[0] || 'N/A'
            });
            // Continua o fluxo normalmente
        }
        
    } else if (userInput.toLowerCase() === 'fim') {
        return iniciarAvaliacao(userId, name);
    }
 //°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°     
        

} else if (state === 'inativo') {
    if (userInput === '1') {
        // RECUPERA O ESTADO ANTERIOR
        const lastState = userLastStates[userId]?.state || 'mainMenu';
        userStates[userId] = lastState;
        
        await client.sendMessage(userId, `Que bom ${name}, vamos retomar de onde paramos! 😉`);
        
        // ADICIONA A LÓGICA PARA RECONSTRUIR O ESTADO ANTERIOR
        if (lastState === 'faqMenu2') {
            const tipoSelecionado = userLastStates[userId]?.tipoSelecionado;
            if (tipoSelecionado && perguntasFrequentes[tipoSelecionado]) {
                const tipo = perguntasFrequentes[tipoSelecionado];
                let mensagem = `*${tipo.nome} - Perguntas Frequentes*\n\n`;
                Object.entries(tipo.perguntas).forEach(([key, value]) => {
                    mensagem += `Digite ${key} - ${value.pergunta}\n`;
                });
                await client.sendMessage(userId, mensagem + `\n\n0️⃣ ↩︎ Voltar\nDigite "Fim" para encerrar`);
            }
        }
        // ADICIONE AQUI OUTRAS CONDIÇÕES PARA OUTROS ESTADOS SE NECESSÁRIO
        
    } else if (userInput === '2') {
        return iniciarAvaliacao(userId, name);
    } else {
        await client.sendMessage(userId, `⚠️ Opção inválida. Digite 1️⃣ para retomar ou 2️⃣ para encerrar.`);
    }

// °°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°°


    } else if (state === 'avaliacao') {
        const avaliacoes = {
            '1': '😢 Sentimos muito... Se puder, compartilhe o que não funcionou.',
            '2': '🙁 Lamentamos... Se quiser nos contar mais, estamos ouvindo.',
            '3': '🙂 Obrigado! Sabemos que podemos melhorar.',
            '4': '😃 Que bom saber que conseguimos ajudar! Obrigado.',
            '5': '🎉 Uau! Que alegria receber sua nota máxima. Muito obrigado!'
        };
        if (['1', '2', '3', '4', '5'].includes(userInput)) {
            await client.sendMessage(userId, avaliacoes[userInput]);
            userStates[userId] = null;
            userLastStates[userId] = null;
            resetUserTimeouts(userId);
        } else {
            await client.sendMessage(userId, '❗ Por favor, envie uma nota de 1️⃣ a 5️⃣.');
        }
    }
});