/* OncoLink · dados fictícios do protótipo.
   Paciente, instituição e equipe são inventados. Datas relativas a 31/10/2026. */
window.OL = {
  hoje: '2026-10-31',
  rede: 'Meridiano Saúde',
  unidade: 'Unidade Paulista',

  paciente: {
    nome: 'Marina Albuquerque Teles',
    curto: 'Marina',
    idade: 38, sexo: 'F', nasc: '14/03/1988',
    prontuario: '0048-2213',
    plano: 'Meridiano Prime',
    vinculo: 'mai/2026',
    diagnostico: 'Carcinoma ductal invasivo · mama esquerda',
    perfil: 'RH+ · HER2− · cT2N0 (IIA)',
    fase: 'QT neoadjuvante · Paclitaxel semanal',
    sessoes: { feitas: 7, total: 12, proxima: 'qua, 04/11 · 08:00' }
  },

  medico: { nome: 'Dra. Beatriz Kanno', esp: 'Oncologia clínica', ini: 'BK' },

  /* trilhas da jornada (git graph) */
  trilhas: {
    geral: { nome: 'Saúde geral',     cor: '#9AA0BE' },
    mama:  { nome: 'Câncer de mama',  cor: '#3456E3' },
    fert:  { nome: 'Fertilidade',     cor: '#8B6CF6' },
    tireo: { nome: 'Tireoide',        cor: '#1F9BB8' },
    septo: { nome: 'Septo nasal',     cor: '#C77DDB' }
  },

  /* tipos: tratamento, exame, diagnostico, consulta, procedimento, cirurgia,
     intercorrencia, interrupcao, internacao, alta, registro, atraso, planejado */
  jornada: [
    { d:'2019-05-14', t:'septo', k:'cirurgia',      tit:'Septoplastia', det:'Desvio de septo · Hospital Meridiano Paulista' },
    { d:'2019-06-04', t:'septo', k:'alta',          tit:'Alta da otorrino', det:'Sem queixas respiratórias', fim:true },
    { d:'2021-02-01', t:'geral', k:'registro',      tit:'Parou de fumar', det:'8 maços-ano · contado à Lia' },
    { d:'2023-08-22', t:'tireo', k:'exame',         tit:'Nódulo de tireoide', det:'PAAF benigna · Bethesda II', ini:true },
    { d:'2025-08-12', t:'geral', k:'exame',         tit:'Papanicolau normal', det:'Ginecologia · rastreio anual' },
    { d:'2025-09-29', t:'tireo', k:'alta',          tit:'Alta da endocrinologia', det:'Manter ultrassom anual' },
    { d:'2026-05-12', t:'mama',  k:'exame',         tit:'Mamografia · BI-RADS 4', det:'Nódulo de 2,4 cm em QSE esquerdo', ini:true },
    { d:'2026-05-20', t:'mama',  k:'exame',         tit:'Biópsia por agulha grossa', det:'Guiada por ultrassom' },
    { d:'2026-05-27', t:'mama',  k:'diagnostico',   tit:'Diagnóstico', det:'CDI · RH+ HER2− · Ki-67 22% · cT2N0' },
    { d:'2026-05-29', t:'geral', k:'registro',      tit:'Vinculada ao OncoLink', det:'Perfil criado no app' },
    { d:'2026-06-02', t:'fert',  k:'consulta',      tit:'Oncofertilidade', det:'Desejo reprodutivo registrado', ini:true },
    { d:'2026-06-19', t:'fert',  k:'procedimento',  tit:'14 oócitos criopreservados', det:'Reprodução humana · Dr. Rafael Couto' },
    { d:'2026-06-24', t:'mama',  k:'procedimento',  tit:'Implante de cateter', det:'Port-a-cath subclávia direita' },
    { d:'2026-07-01', t:'mama',  k:'tratamento',    tit:'Início da QT · AC dose densa', det:'Ciclo 1 de 4' },
    { d:'2026-07-02', t:'fert',  k:'tratamento',    tit:'Gosserrelina mensal', det:'Proteção ovariana durante a QT' },
    { d:'2026-07-24', t:'mama',  k:'internacao',    tit:'Internação · neutropenia febril', det:'Febre 38,6 °C · neutrófilos 900' },
    { d:'2026-07-27', t:'mama',  k:'alta',          tit:'Alta hospitalar', det:'3 dias de internação' },
    { d:'2026-07-29', t:'mama',  k:'interrupcao',   tit:'Ciclo 3 adiado 1 semana', det:'Retomado com filgrastim' },
    { d:'2026-08-19', t:'mama',  k:'tratamento',    tit:'AC concluído', det:'4 de 4 ciclos' },
    { d:'2026-08-26', t:'mama',  k:'exame',         tit:'Ecocardiograma', det:'FEVE 60% (basal 64%)' },
    { d:'2026-08-12', t:'geral', k:'atraso',        tit:'Papanicolau anual venceu', det:'Padrão da rede · adiar para depois da QT' },
    { d:'2026-09-09', t:'mama',  k:'tratamento',    tit:'Paclitaxel semanal', det:'Sessão 1 de 12' },
    { d:'2026-09-29', t:'tireo', k:'atraso',        tit:'Ultrassom anual venceu', det:'Sem médico responsável ativo' },
    { d:'2026-10-06', t:'mama',  k:'intercorrencia',tit:'Infecção urinária', det:'Tratada no pronto atendimento' },
    { d:'2026-10-07', t:'mama',  k:'interrupcao',   tit:'Sessão 5 adiada', det:'Retomada em 14/10' },
    { d:'2026-10-24', t:'mama',  k:'registro',      tit:'Formigamento nas mãos', det:'Contado à Lia por voz' },
    { d:'2026-10-28', t:'mama',  k:'tratamento',    tit:'Paclitaxel · sessão 7', det:'Faltam 5 sessões' },
    { d:'2026-11-04', t:'mama',  k:'planejado',     tit:'Sessão 8 de 12', det:'Qua · 08:00 · Unidade Paulista', prox:true },
    { d:'2026-11-12', t:'fert',  k:'planejado',     tit:'Reprodução humana', det:'Retorno · Dr. Rafael Couto' },
    { d:'2026-12-02', t:'mama',  k:'planejado',     tit:'Fim da quimioterapia', det:'Sessão 12 de 12' },
    { d:'2026-12-16', t:'mama',  k:'planejado',     tit:'RM de mamas', det:'Resposta à neoadjuvância' },
    { d:'2027-01-20', t:'mama',  k:'planejado',     tit:'Cirurgia', det:'Data a definir com a mastologia' }
  ],

  tipos: {
    tratamento:     { nome:'Tratamento',     cor:'blue',   ic:'syringe' },
    exame:          { nome:'Exame',          cor:'gray',   ic:'file' },
    diagnostico:    { nome:'Diagnóstico',    cor:'blue',   ic:'flag' },
    consulta:       { nome:'Consulta',       cor:'gray',   ic:'stetho' },
    procedimento:   { nome:'Procedimento',   cor:'violet', ic:'plus' },
    cirurgia:       { nome:'Cirurgia',       cor:'violet', ic:'plus' },
    intercorrencia: { nome:'Intercorrência', cor:'warn',   ic:'alert' },
    interrupcao:    { nome:'Interrupção',    cor:'warn',   ic:'pause' },
    internacao:     { nome:'Internação',     cor:'bad',    ic:'bed' },
    alta:           { nome:'Alta',           cor:'ok',     ic:'checkc' },
    registro:       { nome:'Registro',       cor:'violet', ic:'sparkle' },
    atraso:         { nome:'Atrasado',       cor:'warn',   ic:'clock' },
    planejado:      { nome:'Planejado',      cor:'gray',   ic:'calendar' }
  },

  /* marcadores laboratoriais */
  marcadores: {
    amh:  { nome:'AMH', un:'ng/mL', ref:[1.0,3.5], dec:1, cor:'#8B6CF6',
            nota:'Reserva ovariana caiu 79% desde o início da QT · 14 oócitos criopreservados',
            pts:[['2026-05-29',2.8],['2026-06-30',2.6],['2026-08-18',1.4],['2026-09-22',0.9],['2026-10-21',0.6]] },
    fsh:  { nome:'FSH', un:'mUI/mL', ref:[3,10], dec:1, cor:'#5A4ED4',
            nota:'Elevação compatível com supressão ovariana (gosserrelina + QT)',
            pts:[['2026-05-29',6.2],['2026-06-30',7.0],['2026-08-18',14.8],['2026-09-22',22.5],['2026-10-21',31.0]] },
    e2:   { nome:'Estradiol', un:'pg/mL', ref:[30,200], dec:0, cor:'#B47CFF',
            nota:'Abaixo da faixa folicular desde agosto',
            pts:[['2026-05-29',92],['2026-06-30',85],['2026-08-18',41],['2026-09-22',28],['2026-10-21',22]] },
    ca153:{ nome:'CA 15-3', un:'U/mL', ref:[0,30], dec:0, cor:'#3456E3',
            nota:'Queda de 55% · resposta bioquímica à neoadjuvância',
            pts:[['2026-05-29',38],['2026-06-30',34],['2026-08-18',24],['2026-09-22',19],['2026-10-21',17]] },
    neu:  { nome:'Neutrófilos', un:'/mm³', ref:[1500,7500], dec:0, cor:'#1F9BB8',
            nota:'1.620 em 27/10 · liberada para a sessão 7',
            pts:[['2026-06-30',4100],['2026-07-24',900],['2026-08-05',3200],['2026-09-08',2800],['2026-09-29',2100],['2026-10-06',1450],['2026-10-13',1900],['2026-10-20',1700],['2026-10-27',1620]] }
  },

  /* frequência cardíaca de repouso, 30 dias (Apple Watch) */
  fcRepouso: [62,61,63,62,64,63,62,65,64,66,65,67,66,68,67,69,68,70,69,71,72,70,72,73,72,74,73,75,74,74],
  sono:      [6.9,7.1,6.4,6.8,6.2,5.9,6.6,6.3,6.0,6.5,6.1,5.8,6.4,6.2],
  passos:    [8120,7340,6980,5210,4120,6890,7650,7100,6420,4980,3870,6120,6980,6240],

  /* checklist semanal de bem-estar (1 = ruim, 5 = ótimo) */
  checklist: {
    semanas: ['22/09','29/09','06/10','13/10','20/10','27/10'],
    itens: [
      { k:'Energia',      v:[4,3,3,3,2,2] },
      { k:'Sono',         v:[4,4,3,3,3,2] },
      { k:'Humor',        v:[4,3,3,2,2,2] },
      { k:'Apetite',      v:[3,3,2,3,3,3] },
      { k:'Náusea',       v:[4,4,3,4,4,4], inv:true },
      { k:'Dor',          v:[5,5,4,4,4,4], inv:true },
      { k:'Formigamento', v:[5,5,5,4,3,2], inv:true }
    ]
  }
};

/* utilidades de data */
OL.meses = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
OL.dt = s => { const [y,m,d] = s.split('-').map(Number); return new Date(y, m-1, d); };
OL.fmt = (s, ano) => { const x = OL.dt(s); return `${String(x.getDate()).padStart(2,'0')} ${OL.meses[x.getMonth()]}${ano ? ' ' + x.getFullYear() : ''}`; };
OL.nf = (v, dec=0) => v.toLocaleString('pt-BR', { minimumFractionDigits:dec, maximumFractionDigits:dec });
