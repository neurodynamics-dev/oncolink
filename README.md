# OncoLink · protótipo de interface

Telas do OncoLink, plataforma SaaS para redes de saúde privadas acompanharem a jornada do paciente oncológico, da prevenção primária ao tratamento. Site estático, pronto para o GitHub Pages.

| Página | O que mostra |
| --- | --- |
| `index.html` | Apresentação e links para as telas |
| `medico.html` | Painel do médico (desktop) |
| `app.html` | App do paciente, interativo, em moldura de celular. `?tela=<nome>` abre uma tela direto |
| `telas.html` | Todas as telas do app lado a lado |
| `manifest.webmanifest`, `sw.js` | App instalável na tela inicial, com notificações push |

## Painel do médico

Cabeçalho da paciente com fase do tratamento, jornada clínica em trilhas (no estilo GitLens: “Paclitaxel · 7/12 · faltam 5”), mapa do corpo, marcadores com tendência (AMH, FSH, estradiol, CA 15-3, neutrófilos), Apple Watch e Clue em dados agregados, rotina em mapa de calor, checklist semanal de bem-estar, agenda de exames, histórico relevante, medicações com adesão autorrelatada, agendamentos, o que a paciente contou à Lia e insights prontos para enviar.

## App do paciente

Barra inferior com Início, Jornada, **Lia** (centro), Agenda e Perfil. Telas: início, jornada (trilhas de tratamentos, intercorrências, interrupções, internações e altas), chat com a Lia por texto e voz, agenda, exames com locais próximos, perfil com foto, prontuário, caderno (o que o paciente contou à Lia, com controle de compartilhamento), conexões (Apple Saúde, Clue, Fitbit, Health Connect, Garmin), notificações, privacidade (LGPD) com pedido de exclusão, pop-up de checkup e agendamento de exame.

## Notificações push

O app pode ser salvo na tela inicial (manifest + service worker). Salvo, ele abre em tela cheia e, em **Perfil › Notificações**, pede permissão para notificações. No iPhone, o push para web só funciona com o app salvo na tela inicial e iOS 16.4 ou mais recente.

- Sem servidor, o botão **Enviar teste** faz o service worker mostrar uma notificação local da Lia; tocar nela abre o chat.
- Para push vindo do servidor, preencha `vapidPublicKey` e `endpoint` em `assets/js/push-config.js`. O app inscreve o aparelho e envia a inscrição para `endpoint`; o servidor manda Web Push com o corpo `{"title": "Lia", "body": "…", "tela": "lia"}` (`tela` é a tela que abre ao tocar).
- Fora da tela inicial (como na moldura do protótipo), **Ver exemplo** mostra como a notificação chega.

## Privacidade (LGPD)

Em **Perfil › Privacidade e LGPD**: consentimentos (equipe, apps e dispositivos, pesquisa anonimizada), **Baixar meus dados** (gera um JSON real com os dados fictícios), quem acessou e **Solicitar exclusão**, que explica que o prontuário da rede é guardado por 20 anos (Lei 13.787/2018) e gera um protocolo.

A **Lia** é a assistente de IA do app. É a única superfície em gradiente azul-violeta, com um orbe próprio e o nome em serifa itálica, para se distinguir do resto da interface.

## Rodar localmente

```sh
python3 -m http.server 8000
```

Abra `http://localhost:8000`. Não há build nem dependências; as fontes vêm do Google Fonts.

## Estrutura

```
assets/css/base.css     tokens (azuis e roxos das famílias Retina, Nexo e Dendrito), botões, chips, orbe da Lia
assets/css/medico.css   painel do médico
assets/css/app.css      app do paciente e moldura do celular
assets/js/icons.js      sprite de ícones e a marca OncoLink
assets/js/data.js       paciente, jornada, marcadores e checklist (fictícios)
assets/js/medico.js     grafo da jornada, mapa do corpo, gráficos, insights
assets/js/app.js        navegação, jornada vertical, chat, checkup, agendamento, push, LGPD
assets/js/push-config.js chave VAPID e endereço do servidor de push (vazios = demonstração)
assets/img/marcas/      ícones das integrações (Apple Saúde, Clue, Fitbit, Health Connect, Garmin…)
sw.js                   service worker: cache offline e notificações
manifest.webmanifest    nome, ícones e atalhos do app na tela inicial
favicon.ico             favicon (16/32/48) e assets/img/icone-*.png para a tela inicial
```

Paciente, equipe, instituição (“Meridiano Saúde”) e dados clínicos são fictícios.

Protótipo da [NeuroDynamics](https://neurodynamics.dev) para o MIT Hacking Medicine 2026 Brasil. Contato: [marcondes@neurodynamics.dev](mailto:marcondes@neurodynamics.dev).
