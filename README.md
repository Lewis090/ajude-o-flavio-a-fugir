# ✈️ Ajude o Flávio a fugir

Jogo de navegador feito em JavaScript puro, HTML e Canvas. O projeto agora está dividido em módulos para facilitar a evolução do jogo.

Ajude o Flávio a decolar da **Argentina**, alcançar o **Equador** e depois cruzar o Caribe até os **Estados Unidos**, desviando dos aviões, pássaros e outros perigos do caminho. Qualquer semelhança com pessoas reais é mera coincidência: o personagem é fictício.

## 🗺️ Fases

1. **Argentina → Equador:** atravesse a Cordilheira e chegue ao Equador.
2. **Equador → Estados Unidos:** cruze o Caribe e pouse na Flórida.

Ao terminar a primeira fase, uma tela de transição apresenta a próxima etapa sem reiniciar a partida.

## 🎚️ Dificuldades

- **Fácil:** 3 vidas, obstáculos mais frequentes e velocidade moderada.
- **Normal:** 2 vidas, mais obstáculos e aviões que disparam contra o jogador.
- **Difícil:** 1 vida, tráfego intenso, velocidade maior e tiros mais frequentes.

As fases agora têm progressão longa, com 15.000 unidades cada. O cenário muda gradualmente do dia para a noite durante cada fase, com estrelas no trecho noturno.

## 🎮 Como jogar

- **Computador:** setas do teclado ou WASD para pilotar. Espaço ou Enter para começar.
- **Celular:** arraste o dedo na tela.
- **Pausar:** toque no botão `Pausar` ou pressione `P` no computador. O jogo pausa automaticamente quando você troca de aba ou deixa a janela.
- Pegue a estrela ★ para ganhar 5 segundos de escudo.
- Enquanto o escudo estiver ativo, uma barra amarela no HUD mostra o tempo restante.
- Pegue ⚡ para avançar um pouco mais na fase.
- Colete 🛂 para ganhar 500 pontos.
- No Normal e no Difícil, os aviões atiram somente enquanto estão à frente do jogador.
- Chegue ao fim das duas barras de progresso para vencer.

## 🏆 Score e ranking

O score combina distância percorrida, passaportes coletados e bônus de conclusão de fase. Ao vencer ou sofrer game over, o jogador informa três letras e salva sua pontuação entre as dez melhores do navegador. O botão 🏆 no menu inicial abre o ranking a qualquer momento. O ranking usa `localStorage`, portanto é individual para cada navegador e dispositivo.

## 📁 Estrutura

```text
index.html          Estrutura da página e painel de dificuldade
src/
  config.js         Fases, dificuldades e dimensões do jogo
  entities.js       Criação e colisão de entidades
  game.js           Estado, regras e loop de atualização
  input.js          Teclado e controle por toque
  main.js           Inicialização e integração da interface
  renderer.js       Desenho do Canvas e HUD
  styles.css        Layout e estilos da interface
```

## 🚀 Jogar online

Depois de publicar no GitHub Pages, o jogo ficará em:

`https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/`

## 🛠️ Rodar localmente

Basta abrir o arquivo `index.html` no navegador. Em alguns navegadores, módulos JavaScript funcionam melhor quando o projeto é servido por um servidor local. Não precisa instalar dependências; por exemplo, com Node.js:

```bash
npx serve .
```

O jogo também está publicado em:

https://lewis090.github.io/ajude-o-flavio-a-fugir/

## 🔎 Referências

A organização do loop, renderização e colisões foi inspirada na documentação de desenvolvimento de jogos da MDN:

- [Jogo Breakout com JavaScript puro](https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_breakout_game_pure_JavaScript)
- [Detecção de colisão 2D](https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection)
- [Exemplos de jogos 2D do Phaser](https://phaser.io/oss/examples)
