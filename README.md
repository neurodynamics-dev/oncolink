# OncoLink · protótipo de interface

Telas do OncoLink, plataforma SaaS para redes de saúde privadas acompanharem a jornada do paciente oncológico, da prevenção primária ao tratamento. Site estático, pronto para o GitHub Pages.

| Página | O que mostra |
| --- | --- |
| `index.html` | Apresentação e links para as telas |
| `medico.html` | Painel do médico (desktop) |
| `app.html` | App do paciente, interativo, em moldura de celular. `?tela=<nome>` abre uma tela direto |
| `telas.html` | Todas as telas do app lado a lado |

## Painel do médico

Cabeçalho da paciente com fase do tratamento e lentes do prontuário (no estilo GitLens: “faltam 5 sessões de paclitaxel”), jornada clínica em trilhas, mapa do corpo, marcadores com tendência (AMH, FSH, estradiol, CA 15-3, neutrófilos), Apple Watch e Clue em dados agregados, rotina em mapa de calor, checklist semanal de bem-estar, agenda de exames, histórico relevante, medicações com adesão autorrelatada, agendamentos, o que a paciente contou à Lia e insights prontos para enviar.

## App do paciente

Barra inferior com Início, Jornada, **Lia** (centro), Agenda e Perfil. Telas: início, jornada (trilhas de tratamentos, intercorrências, interrupções, internações e altas), chat com a Lia por texto e voz, agenda, exames com locais próximos, perfil com foto, prontuário, caderno (o que o paciente contou à Lia, com controle de compartilhamento), conexões (Apple Saúde, Clue, Fitbit…), pop-up de checkup e agendamento de exame.

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
assets/js/app.js        navegação, jornada vertical, chat, checkup, agendamento
```

Paciente, equipe, instituição (“Meridiano Saúde”) e dados clínicos são fictícios.
