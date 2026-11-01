/* OncoLink · app do paciente: navegação, jornada, Lia, checkup e agendamento */
(function(){
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
  const q = new URLSearchParams(location.search);
  if (q.get('solo')) document.body.classList.add('solo');

  const TELAS = [
    { k:'inicio',     n:'Início',      ic:'home',     d:'O resumo do dia: checkup com a Lia, a próxima etapa do tratamento, lembretes e os dados da semana.' },
    { k:'jornada',    n:'Jornada',     ic:'journey',  d:'Tratamentos em andamento e encerrados, intercorrências, interrupções, internações e altas, em trilhas como um histórico de versões.' },
    { k:'lia',        n:'Lia',         ic:'sparkle',  d:'O chat por texto e voz. A Lia pergunta como você está, registra o que você conta e propõe consultas quando algo merece atenção.' },
    { k:'agenda',     n:'Agenda',      ic:'calendar', d:'Consultas e sessões, incluindo as sugeridas pela Lia, com local e preparo.' },
    { k:'exames',     n:'Exames',      ic:'drop',     d:'Resultados recentes e onde fazer os próximos exames, perto de você.' },
    { k:'perfil',     n:'Perfil',      ic:'user',     d:'Foto, vínculo com a rede, equipe de cuidado e atalhos para prontuário, caderno e conexões.' },
    { k:'prontuario', n:'Prontuário',  ic:'file',     d:'O registro da rede em linguagem simples: diagnóstico, medicações com adesão e histórico.' },
    { k:'caderno',    n:'Caderno',     ic:'book',     d:'Tudo o que você contou à Lia, como hábitos, planos e família. Você escolhe o que a equipe vê.' },
    { k:'conexoes',   n:'Conexões',    ic:'link',     d:'Apple Saúde, Apple Watch, Clue, Fitbit e outros. A equipe recebe resumos, nunca dados brutos.' },
    { k:'checkup',    n:'Checkup',     ic:'heart',    d:'O pop-up “como você está se sentindo”. Se você marcar febre, a Lia orienta a ligar para a central na hora.', ov:'inicio' },
    { k:'agendar',    n:'Agendar',     ic:'pin',      d:'Agendar um exame atrasado escolhendo um local próximo e um horário.', ov:'exames' }
  ];
  const TAB_OF = { exames:'agenda', prontuario:'perfil', caderno:'perfil', conexoes:'perfil' };
  let cur = 'inicio';

  /* ---------- navegação ---------- */
  function go(k, push=true){
    const t = TELAS.find(x => x.k === k); if (!t) return;
    if (t.ov){ go(t.ov, false); open(k); setSide(t); if (push) url(k); return; }
    closeAll();
    cur = k;
    $$('.scr').forEach(s => s.classList.toggle('on', s.dataset.s === k));
    const tab = TAB_OF[k] || k;
    $$('#tabbar button').forEach(b => b.classList.toggle('on', b.dataset.tab === tab));
    $('.status').classList.toggle('dark', k === 'perfil');
    const s = $(`.scr[data-s="${k}"]`); if (s && k !== 'lia') s.scrollTop = 0;
    if (k === 'lia') requestAnimationFrame(() => { const c = $('#chat'); c.scrollTop = c.scrollHeight; });
    setSide(t); if (push) url(k);
  }
  function setSide(t){
    $('#sideTitle').textContent = t.n;
    $('#sideDesc').textContent = t.d;
    $$('#sideNav button').forEach(b => b.classList.toggle('on', b.dataset.k === t.k));
  }
  function url(k){ const p = new URLSearchParams(location.search); p.set('tela', k); history.replaceState(null, '', '?' + p.toString()); }
  function open(k){
    closeAll();
    const bg = $(`.sheet-bg[data-sheet="${k}"]`); if (!bg) return;
    bg.hidden = false;
    $$('[data-step]', bg).forEach(s => s.hidden = s.dataset.step !== '1');
  }
  function closeAll(){ $$('.sheet-bg').forEach(b => b.hidden = true); }

  $('#sideNav').innerHTML = TELAS.map(t => `<button data-k="${t.k}" class="${t.ov ? 'ov' : ''}">${ic(t.ic)}${t.n}</button>`).join('');
  $$('#sideNav button').forEach(b => b.addEventListener('click', () => go(b.dataset.k)));

  document.addEventListener('click', e => {
    const g = e.target.closest('[data-go]'); if (g){ go(g.dataset.go); return; }
    const o = e.target.closest('[data-open]'); if (o){ open(o.dataset.open); const t = TELAS.find(x => x.k === o.dataset.open); if (t) setSide(t); return; }
    if (e.target.closest('[data-close]') || e.target.classList.contains('sheet-bg')){ closeAll(); setSide(TELAS.find(x => x.k === cur)); }
  });

  let tt;
  function toast(msg){
    const t = $('#ptoast'); t.innerHTML = ic('checkc', 'sm') + msg; t.classList.add('on');
    clearTimeout(tt); tt = setTimeout(() => t.classList.remove('on'), 2400);
  }

  /* ---------- jornada (grafo vertical) ---------- */
  const T = OL.trilhas;
  const COL = { geral:0, mama:1, fert:2, tireo:3, septo:2 };
  const LX = c => 12 + c * 13, G = 70, RH = 64, SH = 34;
  let laneFocus = null;

  function drawJourney(){
    const host = $('#jv');
    const evs = OL.jornada.slice().sort((a, b) => b.d.localeCompare(a.d));
    const rows = [];
    let addedToday = false, lastYear = null;
    rows.push({ sep:'Próximos' });
    evs.forEach(e => {
      if (!addedToday && e.d <= OL.hoje){ rows.push({ sep:'Hoje · 31 out', today:true }); addedToday = true; lastYear = '2026'; }
      const y = e.d.slice(0, 4);
      if (addedToday && y !== lastYear){ rows.push({ sep:y }); lastYear = y; }
      rows.push({ e });
    });
    let y = 0; rows.forEach(r => { r.h = r.sep ? SH : RH; r.y = y + r.h / 2; y += r.h; });
    const H = y;
    const yToday = rows.find(r => r.today).y;
    const idx = {}; rows.forEach((r, i) => { if (r.e){ (idx[r.e.t] = idx[r.e.t] || []).push(i); } });

    let svg = `<svg class="jl" width="${G}" height="${H}" viewBox="0 0 ${G} ${H}">`;
    const vline = (k, ya, yb) => {
      const x = LX(COL[k]), c = T[k].cor;
      const solidTop = Math.max(ya, yToday);
      if (ya < yToday) svg += `<line x1="${x}" y1="${ya}" x2="${x}" y2="${Math.min(yb, yToday)}" stroke="${c}" stroke-width="2.2" stroke-dasharray="3 4" opacity=".6" stroke-linecap="round"/>`;
      if (yb > solidTop) svg += `<line x1="${x}" y1="${solidTop}" x2="${x}" y2="${yb}" stroke="${c}" stroke-width="2.2" stroke-linecap="round"/>`;
    };
    const curve = (k, from, yA, dir) => { // dir 1: nasce de baixo (ramo), -1: termina acima (merge)
      const xa = LX(COL[k]), xb = LX(COL[from]), yb = yA + dir * 30;
      svg += `<path d="M${xa},${yA} C${xa},${yA + dir * 18} ${xb},${yb - dir * 12} ${xb},${yb}" fill="none" stroke="${T[k].cor}" stroke-width="2.2" stroke-linecap="round"/>`;
    };
    // tronco
    vline('geral', rows[0].y - 10, H - 6);
    // ramos
    const span = k => { const ii = idx[k]; return [rows[ii[0]].y, rows[ii[ii.length - 1]].y]; };
    let [a, b] = span('mama'); vline('mama', a, b); curve('mama', 'geral', b, 1);
    [a, b] = span('fert'); vline('fert', a, b); curve('fert', 'mama', b, 1);
    [a, b] = span('tireo'); vline('tireo', rows[0].y - 10, b); curve('tireo', 'geral', b, 1);
    [a, b] = span('septo'); vline('septo', a, b); curve('septo', 'geral', b, 1); curve('septo', 'geral', a, -1);

    // nós
    rows.forEach(r => {
      if (!r.e) return;
      const e = r.e, x = LX(COL[e.t]), cy = r.y, c = T[e.t].cor;
      if (['intercorrencia','interrupcao','atraso','internacao'].includes(e.k)){
        const f = e.k === 'internacao' ? '#DD3F57' : '#D58A00';
        svg += `<rect x="${x-5.5}" y="${cy-5.5}" width="11" height="11" rx="2" transform="rotate(45 ${x} ${cy})" fill="${f}" stroke="#F6F7FC" stroke-width="2.5"/>`;
      } else if (e.k === 'alta'){
        svg += `<circle cx="${x}" cy="${cy}" r="7" fill="#0F9F7A" stroke="#F6F7FC" stroke-width="2.5"/><path d="M${x-2.8},${cy+.2} l2,2 l3.6,-4" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>`;
      } else if (e.k === 'registro'){
        svg += `<circle cx="${x}" cy="${cy}" r="7" fill="#8B6CF6" stroke="#F6F7FC" stroke-width="2.5"/><path d="M${x},${cy-3.6} q.5,3 3.4,3.6 q-2.9.6-3.4,3.6 q-.5-3-3.4-3.6 q2.9-.6 3.4-3.6z" fill="#fff"/>`;
      } else if (e.k === 'planejado'){
        svg += `<circle cx="${x}" cy="${cy}" r="6" fill="#F6F7FC" stroke="${e.prox ? c : '#9AA0BE'}" stroke-width="2" stroke-dasharray="${e.prox ? 'none' : '3 2'}"/>`;
      } else if (e.k === 'tratamento'){
        svg += `<circle cx="${x}" cy="${cy}" r="7" fill="${c}" stroke="#F6F7FC" stroke-width="2.5"/>`;
      } else {
        svg += `<circle cx="${x}" cy="${cy}" r="6" fill="#fff" stroke="${c}" stroke-width="2.4"/>`;
      }
    });
    svg += '</svg>';

    host.innerHTML = svg + rows.map(r => {
      if (r.sep) return `<div class="jrow sep ${r.today ? 'today' : ''}" style="height:${r.h}px;--g:${G}px"><span>${r.today ? ic('clock','xs') : ''}${r.sep}</span></div>`;
      const e = r.e, tp = OL.tipos[e.k];
      const cls = e.k === 'planejado' ? (e.prox ? 'nx' : 'fut') : 'ev';
      return `<div class="jrow ${cls}" data-t="${e.t}" style="height:${r.h}px;--g:${G}px">
        <div class="jc"><div class="jt"><b>${e.tit}</b><span class="tag ${tp.cor}">${e.prox ? 'Próxima' : tp.nome}</span></div>
        <small>${OL.fmt(e.d, true)} · ${e.det}</small></div></div>`;
    }).join('');
    applyFocus();
  }
  function lanesChips(){
    const st = { mama:'em tratamento', fert:'preservada', tireo:'exame atrasado', geral:'rastreio', septo:'encerrado' };
    $('#lanes').innerHTML = ['mama','fert','tireo','geral','septo'].map(k =>
      `<button data-k="${k}" style="--c:${T[k].cor}"><i></i>${T[k].nome}<small>${st[k]}</small></button>`).join('');
    $$('#lanes button').forEach(b => b.addEventListener('click', () => {
      laneFocus = laneFocus === b.dataset.k ? null : b.dataset.k; applyFocus();
    }));
  }
  function applyFocus(){
    $$('#lanes button').forEach(b => b.classList.toggle('on', b.dataset.k === laneFocus));
    $$('.jrow[data-t]').forEach(r => r.classList.toggle('dim', !!laneFocus && r.dataset.t !== laneFocus));
  }
  $$('#jseg button').forEach(b => b.addEventListener('click', () => {
    $$('#jseg button').forEach(x => x.classList.toggle('on', x === b));
    $('#jv-linha').hidden = b.dataset.v !== 'linha'; $('#jv-trat').hidden = b.dataset.v !== 'trat';
  }));

  /* ---------- chat com a Lia ---------- */
  function waves(){
    $$('.wave[data-n]').forEach(w => {
      const n = +w.dataset.n; let h = '';
      for (let i = 0; i < n; i++) h += `<i style="height:${6 + Math.round(Math.abs(Math.sin(i * 1.7) * 14 + Math.sin(i * .5) * 5))}px"></i>`;
      w.innerHTML = h; w.removeAttribute('data-n');
    });
  }
  const chat = $('#chat');
  const now = () => '09:' + String(15 + Math.floor(Math.random() * 30)).padStart(2, '0');
  function add(html){ chat.insertAdjacentHTML('beforeend', html); chat.scrollTo({ top:chat.scrollHeight, behavior:'smooth' }); }
  function liaSays(html, delay=900){
    add(`<div class="typing" id="typing"><i></i><i></i><i></i></div>`);
    setTimeout(() => { $('#typing')?.remove(); add(`<div class="m lia">${html}<time>${now()}</time></div>`); }, delay);
  }
  const esc = s => s.replace(/[&<>"]/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[c]));
  const recCard = (t, s) => `<div class="rec"><span class="rec-ic">${ic('book','xs')}</span><div><b>${t}</b><small>${s}</small></div><span class="rec-sh">${ic('users','xs')}Equipe</span></div>`;

  const input = $('#msgIn'), mic = $('#micBtn');
  input.addEventListener('input', () => {
    const has = input.value.trim().length > 0;
    mic.classList.toggle('send', has);
    mic.innerHTML = ic(has ? 'send' : 'mic');
    mic.setAttribute('aria-label', has ? 'Enviar' : 'Falar com a Lia');
  });
  function sendText(){
    const v = input.value.trim(); if (!v) return;
    add(`<div class="m me"><p>${esc(v)}</p><time>${now()} ${ic('check','xs')}</time></div>`);
    input.value = ''; input.dispatchEvent(new Event('input'));
    liaSays(`<p>Anotei, Marina. Guardei no seu caderno para a sua equipe ver no próximo resumo.</p>${recCard('Novo registro no caderno', esc(v.length > 48 ? v.slice(0, 48) + '…' : v))}<p>Daqui a alguns dias eu te pergunto como isso está.</p>`);
  }
  input.addEventListener('keydown', e => { if (e.key === 'Enter') sendText(); });

  let recI, recS = 0;
  mic.addEventListener('click', () => {
    if (mic.classList.contains('send')) return sendText();
    $('#composer').hidden = true; $('#quick').hidden = true; $('#plusBtn').classList.remove('on');
    $('#recBar').hidden = false; recS = 0; $('#recT').textContent = '0:00';
    $('#liveWave').innerHTML = Array.from({ length:34 }, (_, i) => `<i style="height:${8 + (i * 7) % 20}px;animation-delay:${(i % 7) * .09}s"></i>`).join('');
    recI = setInterval(() => { recS++; $('#recT').textContent = `0:${String(recS).padStart(2, '0')}`; if (recS >= 9) stopRec(true); }, 1000);
  });
  function stopRec(send){
    clearInterval(recI); $('#recBar').hidden = true; $('#composer').hidden = false;
    if (!send) return;
    add(`<div class="m me voice"><div class="vb"><span class="play">${ic('play','xs fill')}</span><span class="wave" data-n="22"></span><span class="num dur">0:${String(Math.max(recS, 4)).padStart(2, '0')}</span></div>
      <p class="tr">“Acordei com um pouco de dor de garganta hoje.”</p><time>${now()}</time></div>`);
    waves();
    liaSays(`<p>Obrigada por avisar. Registrei no seu caderno e vou te perguntar amanhã como você está.</p>${recCard('Dor de garganta', 'Hoje · lembrete amanhã às 09:00')}<p>Durante a quimioterapia, fique de olho na temperatura. Se passar de 37,8 °C, ligue para a Central Oncológica 24h.</p>`, 1300);
  }
  $('#recStop').addEventListener('click', () => stopRec(true));
  $('#recCancel').addEventListener('click', () => stopRec(false));

  $('#plusBtn').addEventListener('click', () => { const on = $('#quick').hidden; $('#quick').hidden = !on; $('#plusBtn').classList.toggle('on', on); });
  $$('#quick button').forEach(b => b.addEventListener('click', () => {
    $('#quick').hidden = true; $('#plusBtn').classList.remove('on');
    const r = {
      sintoma:`<p>Claro. O que você está sentindo? Pode escrever ou falar.</p><div class="qr"><button>Febre</button><button>Náusea</button><button>Dor</button><button>Cansaço</button><button>Outro</button></div>`,
      exame:`<p>Pode enviar a foto ou o PDF do laudo. Eu leio, guardo no seu histórico e aviso a equipe se algo precisar de atenção.</p>`,
      contar:`<p>Pode falar! Coisas como hábitos, planos de vida ou histórico da família ajudam sua equipe a sugerir os exames certos para você.</p>`
    }[b.dataset.q];
    add(`<div class="m me"><p>${b.textContent.trim()}</p><time>${now()} ${ic('check','xs')}</time></div>`);
    liaSays(r, 700);
  }));
  chat.addEventListener('click', e => {
    const qb = e.target.closest('.qr button'); if (!qb || qb.classList.contains('picked')) return;
    $$('button', qb.parentNode).forEach(x => x.classList.toggle('picked', x === qb));
    add(`<div class="m me"><p>${qb.textContent}</p><time>${now()} ${ic('check','xs')}</time></div>`);
    if (qb.textContent === 'Febre') liaSays(`<p><b>Febre durante a quimioterapia é urgente.</b> Meça a temperatura agora. Se for 37,8 °C ou mais, ligue para a Central Oncológica 24h: (11) 4002-8922.</p>`, 600);
    else liaSays(`<p>Entendi. Desde quando? De 0 a 10, quanto isso está te incomodando?</p>`, 700);
  });
  $('#slotOk').addEventListener('click', () => {
    $('#slot').classList.add('booked'); $('#slotOk').parentNode.remove();
    liaSays(`<p>Pronto! Consulta marcada para <b>terça, 03/11, às 10:20</b> com a Dra. Beatriz. Te lembro na véspera. ✔︎</p>`, 700);
    toast('Consulta agendada para ter, 03/11');
  });

  /* ---------- agenda e mapa ---------- */
  function week(){
    const d = [['sáb','31','td'],['dom','01',''],['seg','02',''],['ter','03','sg'],['qua','04','ev'],['qui','05',''],['sex','06','ev']];
    $('#week').innerHTML = d.map(([w, n, c]) => `<button class="${c}"><span>${w}</span><b class="num">${n}</b><i></i></button>`).join('');
  }
  function map(){
    $('#map').innerHTML = `<svg viewBox="0 0 350 190" preserveAspectRatio="xMidYMid slice" aria-label="Mapa com locais próximos">
      <rect width="350" height="190" fill="#EDF0F8"/>
      <path d="M-10 150 Q80 120 150 135 T360 110 V200 H-10Z" fill="#E4EAFB"/>
      <rect x="196" y="18" width="70" height="44" rx="10" fill="#E3F0EA"/>
      <g stroke="#fff" stroke-linecap="round" fill="none">
        <path d="M-10 70 L360 40" stroke-width="10"/>
        <path d="M60 -10 L110 200" stroke-width="8"/>
        <path d="M-10 120 L360 96" stroke-width="6"/>
        <path d="M180 -10 L230 200" stroke-width="6"/>
        <path d="M290 -10 L300 200" stroke-width="5"/>
        <path d="M-10 30 L170 14" stroke-width="4"/>
        <path d="M120 60 L150 200" stroke-width="3.5"/>
        <path d="M240 70 L360 160" stroke-width="3.5"/>
      </g>
      <path d="M118 104 C150 98 168 82 196 74" fill="none" stroke="#3456E3" stroke-width="2.5" stroke-dasharray="1 6" stroke-linecap="round"/>
      <circle cx="118" cy="104" r="16" fill="#3456E3" opacity=".14"/><circle cx="118" cy="104" r="7" fill="#3456E3" stroke="#fff" stroke-width="3"/>
      <text x="96" y="132" font-size="10" font-weight="600" fill="#2340B8" font-family="Instrument Sans">Você</text>
      ${[[200,70,'#3456E3',1],[256,112,'#5A4ED4',2],[306,64,'#D58A00',3]].map(([x, y, c, n]) =>
        `<g transform="translate(${x} ${y})"><path d="M0 0 C-10 -12 -12 -16 -12 -22 a12 12 0 0 1 24 0 c0 6 -2 10 -12 22z" fill="${c}" stroke="#fff" stroke-width="2"/><text x="0" y="-18" text-anchor="middle" font-size="11" font-weight="700" fill="#fff" font-family="Instrument Sans">${n}</text></g>`).join('')}
    </svg>`;
  }

  /* ---------- prontuário ---------- */
  const MEDS = [
    { n:'Paclitaxel', d:'Semanal · aplicado no hospital', days:'hhhhhhh', p:'100%', hosp:1 },
    { n:'Omeprazol 20 mg', d:'1 por dia, em jejum', days:'ooxoxoo', p:'71%', take:1 },
    { n:'Ondansetrona 8 mg', d:'Se sentir náusea', days:'nnonnon', p:'SOS', take:1 },
    { n:'Vitamina D 7.000 UI', d:'1 por semana, no domingo', days:'nnnnnnx', p:'50%', take:1 },
    { n:'Gosserrelina', d:'A cada 28 dias · no hospital', days:'nnnnnnh', p:'100%', hosp:1 }
  ];
  function meds(){
    const W = ['dom','seg','ter','qua','qui','sex','sáb'];
    $('#medl').innerHTML = MEDS.map((m, i) => `<li>
      <div class="md-h"><div><b>${m.n}</b><small>${m.d}</small></div>
      ${m.hosp ? `<span class="take hosp">${ic('building','xs')}Hospital</span>` : `<button class="take" data-i="${i}">${ic('check','xs')}Tomei hoje</button>`}</div>
      <div class="md-days">${[...m.days].map((c, j) => `<i class="${c === 'x' ? 'x' : c === 'n' ? 'n' : ''}" title="${W[j]}">${c === 'x' ? '✕' : c === 'n' ? '–' : '✓'}</i>`).join('')}<span class="num">${m.p}</span></div>
    </li>`).join('');
    $$('#medl .take[data-i]').forEach(b => b.addEventListener('click', () => {
      b.classList.toggle('done'); b.innerHTML = b.classList.contains('done') ? ic('checkc','xs') + 'Tomado' : ic('check','xs') + 'Tomei hoje';
      if (b.classList.contains('done')) toast('Registrado · sua equipe vê a adesão');
    }));
  }
  $$('#prSeg button').forEach(b => b.addEventListener('click', () => {
    $$('#prSeg button').forEach(x => x.classList.toggle('on', x === b));
    $$('[data-pr]').forEach(p => p.hidden = p.dataset.pr !== b.dataset.v);
  }));

  /* ---------- caderno ---------- */
  const NB = [
    { g:'Planos de vida', ic:'heart', it:[
      ['Quero engravidar depois do tratamento.', '02/06 · por voz', 1],
      ['Congelei 14 óvulos em junho.', '19/06 · do prontuário', 1] ]},
    { g:'Hábitos', ic:'steps', it:[
      ['Parei de fumar em 2021. Fumei por 12 anos, uns 8 maços-ano.', '29/05 · por voz', 1],
      ['Voltei a caminhar 3 vezes por semana, 30 minutos.', '12/10 · texto', 1],
      ['Tomo uns 3 cafés por dia.', '03/07 · texto', 1] ]},
    { g:'Família', ic:'users', it:[
      ['Minha mãe teve câncer de endométrio aos 52.', '29/05 · por voz', 1],
      ['Minha avó materna teve câncer de ovário.', '14/08 · texto', 1] ]},
    { g:'Sintomas e registros', ic:'thermo', it:[
      ['Formigamento nas pontas dos dedos, pior de manhã.', '24/10 · por voz · a Lia está acompanhando', 1],
      ['Infecção urinária, tratada no pronto atendimento.', '06/10 · registro', 1] ]},
    { g:'Preferências', ic:'star', it:[
      ['Prefiro consultas pela manhã.', '11/06 · texto', 1],
      ['Tenho medo de agulha. Gosto que me avisem antes.', '01/07 · por voz', 0] ]}
  ];
  function notebook(){
    $('#nb').innerHTML = NB.map((g, gi) => `<h3 class="grp">${ic(g.ic,'xs')}${g.g}</h3><ul>${g.it.map(([t, m, s], i) =>
      `<li><div><p>${t}</p><small>${m.includes('voz') ? ic('mic','xs') : ic('edit','xs')}${m}</small></div>
       <button class="shr ${s ? '' : 'me'}" data-g="${gi}" data-i="${i}">${s ? ic('users','xs') + 'Equipe' : ic('lock','xs') + 'Só eu'}</button></li>`).join('')}</ul>`).join('');
    $$('#nb .shr').forEach(b => b.addEventListener('click', () => {
      const it = NB[b.dataset.g].it[b.dataset.i]; it[2] = it[2] ? 0 : 1; notebook();
      toast(it[2] ? 'Compartilhado com a equipe' : 'Agora só você vê');
    }));
  }

  /* ---------- conexões ---------- */
  $$('[data-connect]').forEach(b => b.addEventListener('click', () => {
    if (b.classList.contains('connected')) return;
    const lbl = b.textContent; b.textContent = 'Conectando…'; b.disabled = true;
    setTimeout(() => { b.textContent = lbl === 'Parear' ? 'Pareado' : 'Conectado'; b.classList.add('connected'); b.disabled = false; toast(`${b.closest('li').querySelector('b').textContent} ${lbl === 'Parear' ? 'pareado' : 'conectado'}`); }, 1100);
  }));
  $$('.svc-card .svc-h').forEach(h => h.addEventListener('click', () => {
    const c = h.parentNode; if (!c.querySelector('.perm')) return toast('Clue: ciclo e sintomas sincronizados');
  }));

  /* ---------- checkup ---------- */
  const FACES = [['Muito mal', 'M12 25 q8 -6 16 0'], ['Mal', 'M13 24.5 q7 -3.5 14 0'], ['Mais ou menos', 'M13 24 h14'], ['Bem', 'M13 23 q7 4 14 0'], ['Muito bem', 'M12 22.5 q8 7 16 0']];
  $('#faces').innerHTML = FACES.map(([n, d], i) => `<button aria-label="${n}" data-i="${i}"><svg viewBox="0 0 40 40" fill="none" stroke="#5F6488" stroke-width="2.2" stroke-linecap="round"><circle cx="20" cy="20" r="16"/><path d="M14.5 15.5v1.5M25.5 15.5v1.5"/><path d="${d}"/></svg></button>`).join('');
  let mood = null;
  $$('#faces button').forEach(b => b.addEventListener('click', () => {
    mood = +b.dataset.i; $$('#faces button').forEach(x => x.classList.toggle('on', x === b)); $('#facesL').textContent = FACES[mood][0];
  }));
  $$('#sym button').forEach(b => b.addEventListener('click', () => {
    if (b.hasAttribute('data-none')) $$('#sym button').forEach(x => x !== b && x.classList.remove('on'));
    else $('#sym [data-none]').classList.remove('on');
    b.classList.toggle('on');
  }));
  $('#energy').addEventListener('input', e => $('#enV').textContent = e.target.value);
  $('#ckSend').addEventListener('click', () => {
    const sel = $$('#sym button.on').map(b => b.textContent);
    const febre = sel.includes('Febre');
    let msg = 'Anotei no seu caderno. Sua equipe recebe o resumo da semana na segunda.';
    if (sel.includes('Formigamento')) msg = 'Você marcou formigamento de novo. Já avisei a Dra. Beatriz antes da sessão de quarta.';
    else if (mood !== null && mood <= 1) msg = 'Sinto muito que hoje não esteja fácil. Avisei sua enfermeira navegadora, Joana, que pode te ligar ainda hoje.';
    $('#ckMsg').textContent = msg; $('#ckAlert').hidden = !febre;
    $$('[data-sheet="checkup"] [data-step]').forEach(s => s.hidden = s.dataset.step !== '2');
  });

  /* ---------- agendar ---------- */
  const DIA = ['seg 09/11', 'qua 04/11', 'ter 10/11'], LOC = ['Meridiano Diagnósticos · Moema', 'Unidade Paulista', 'Unidade Vila Mariana'];
  $$('#times button').forEach(b => b.addEventListener('click', () => $$('#times button').forEach(x => x.classList.toggle('on', x === b))));
  $('#agOk').addEventListener('click', () => {
    const i = $$('#locs input').findIndex(x => x.checked), h = $('#times .on')?.textContent || '08:20';
    $('#agMsg').innerHTML = `Ultrassom de tireoide · ${DIA[i]} · ${h}<br>${LOC[i]}`;
    $$('[data-sheet="agendar"] [data-step]').forEach(s => s.hidden = s.dataset.step !== '2');
  });

  /* ---------- botões sem fluxo próprio ---------- */
  $$('.nc-btns .btn, .ap-btns .btn.primary:not([data-open]), .ap-btns .btn.ghost:not([data-open]), .rem .btn.soft:not([data-go]), .res .lnk, .speak').forEach(b => b.addEventListener('click', () => {
    if (b.classList.contains('speak')) { closeAll(); go('lia'); return; }
    toast(b.textContent.trim() + ' · em breve no app');
  }));

  /* ---------- montar ---------- */
  waves(); lanesChips(); drawJourney(); week(); map(); meds(); notebook();
  go(q.get('tela') || 'inicio', false);
})();
