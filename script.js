document.addEventListener('DOMContentLoaded', () => {
    const btnNarrador = document.getElementById('btn-narrador');
    let narrando = false;
    let sintese = window.speechSynthesis;
    let utterance = null;
    let vozPersonalizada = null;

    // Função para carregar uma voz feminina em português
    function carregarVozFeminina() {
        const vozes = sintese.getVoices();
        // Procura por vozes pt-BR com nomes que sugerem gênero feminino nas APIs comuns
        vozPersonalizada = vozes.find(voz => 
            voz.lang.includes('pt-BR') && 
            (voz.name.includes('Maria') || voz.name.includes('Luciana') || voz.name.includes('Heloisa') || voz.name.includes('Victoria') || voz.name.includes('Google português do Brasil'))
        );

        // Se não encontrar uma específica, pega qualquer voz pt-BR
        if (!vozPersonalizada) {
            vozPersonalizada = vozes.find(voz => voz.lang.includes('pt-BR'));
        }
    }

    // Algumas browsers carregam vozes de forma assíncrona
    if (sintese.onvoiceschanged !== undefined) {
        sintese.onvoiceschanged = carregarVozFeminina;
    }
    carregarVozFeminina();

    function narrarPagina() {
        if (narrando) {
            sintese.cancel();
            pararNarracao();
            return;
        }

        const elementos = document.querySelectorAll('h1, h2, h3, p, .footer-links p');
        let textoCompleto = "Iniciante narração da página de Doutora Maria Eduarda. ";
        
        elementos.forEach(el => {
            if (el.innerText.trim().length > 0) {
                textoCompleto += el.innerText + ". ";
            }
        });

        utterance = new SpeechSynthesisUtterance(textoCompleto);
        utterance.lang = 'pt-BR';
        utterance.rate = 1.0;
        
        // Aplica a voz feminina selecionada
        if (vozPersonalizada) {
            utterance.voice = vozPersonalizada;
        }

        utterance.onstart = () => {
            narrando = true;
            btnNarrador.classList.add('active');
            btnNarrador.innerHTML = '<i class="ph ph-stop-circle"></i>';
        };

        utterance.onend = () => {
            pararNarracao();
        };

        utterance.onerror = (event) => {
            console.error("Erro na narração:", event);
            pararNarracao();
        };

        sintese.speak(utterance);
    }

    function pararNarracao() {
        sintese.cancel();
        narrando = false;
        btnNarrador.classList.remove('active');
        btnNarrador.innerHTML = '<i class="ph ph-speaker-high"></i>';
    }

    document.addEventListener('keydown', (e) => {
        if (e.altKey && e.key.toLowerCase() === 'n') {
            narrarPagina();
        }
    });

    btnNarrador.addEventListener('click', narrarPagina);
});
