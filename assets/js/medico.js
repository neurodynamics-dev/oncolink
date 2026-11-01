/* OncoLink · painel do médico: grafo da jornada, mapa do corpo, gráficos e interações */
(function(){
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
  const NS = 'http://www.w3.org/2000/svg';
  const T = OL.trilhas;
  const tip = $('#tip'), toast = $('#toast');
  let toastT;

  /* ---------- tooltip e toast ---------- */
  function showTip(e, html){
    tip.innerHTML = html; tip.classList.add('on');
    const r = tip.getBoundingClientRect();
    let x = e.clientX + 14, y = e.clientY + 14;
    if (x + r.width > innerWidth - 8) x = e.clientX - r.width - 14;
    if (y + r.height > innerHeight - 8) y = e.clientY - r.height - 14;
    tip.style.left = x + 'px'; tip.style.top = y + 'px';
  }
  const hideTip = () => tip.classList.remove('on');
  function say(msg){
    toast.innerHTML = ic('checkc') + `<span>${msg}</span>`;
    toast.classList.add('on'); clearTimeout(toastT);
    toastT = setTimeout(() => toast.classList.remove('on'), 2600);
  }
  function bindTip(el, html){
    el.addEventListener('mousemove', e => showTip(e, html));
    el.addEventListener('mouseleave', hideTip);
    el.addEventListener('focus', () => { const r = el.getBoundingClientRect(); showTip({clientX:r.right, clientY:r.bottom}, html); });
    el.addEventListener('blur', hideTip);
  }

  /* ---------- jornada clínica (grafo horizontal) ---------- */
  const t0 = OL.dt('2026-05-01'), t1 = OL.dt('2027-02-01'), hoje = OL.dt(OL.hoje);
  const lanes = [
    { k:'geral', st:'rastreio' },
    { k:'mama',  st:'em tratamento', h:104 },
    { k:'fert',  st:'preservada' },
    { k:'tireo', st:'sem responsável' }
  ];
  const sessoes = {
    feitas:['2026-07-01','2026-07-15','2026-08-05','2026-08-19','2026-09-09','2026-09-16','2026-09-23','2026-09-30','2026-10-14','2026-10-21','2026-10-28'],
    plan:['2026-11-04','2026-11-11','2026-11-18','2026-11-25','2026-12-02']
  };
  const rotulos = new Set(['2026-05-27','2026-06-19','2026-07-24','2026-08-12','2026-09-29','2026-10-06','2026-10-24','2026-11-12','2026-12-16','2027-01-20']);

  function el(tag, attrs={}, parent){
    const n = document.createElementNS(NS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }

  function drawJourney(){
    const host = $('#jgraph'); host.innerHTML = '';
    const W = Math.max(860, host.clientWidth || 860);
    const LW = 132, PR = 16, TOP = 26;
    const x = d => LW + (OL.dt(d) - t0) / (t1 - t0) * (W - LW - PR);
    const xh = LW + (hoje - t0) / (t1 - t0) * (W - LW - PR);
    let y = TOP; const ys = {};
    lanes.forEach(l => { const h = l.h || 62; ys[l.k] = y + (l.k === 'mama' ? 44 : 22); l._y0 = y; l._h = h; y += h; });
    const H = y + 6;
    const svg = el('svg', { viewBox:`0 0 ${W} ${H}`, width:W, height:H, role:'img', 'aria-label':'Jornada clínica de maio de 2026 a janeiro de 2027' }, host);

    const defs = el('defs', {}, svg);
    const pat = el('pattern', { id:'hatch', width:5, height:5, patternUnits:'userSpaceOnUse', patternTransform:'rotate(45)' }, defs);
    el('rect', { width:5, height:5, fill:'#FDE8EB' }, pat);
    el('line', { x1:0, y1:0, x2:0, y2:5, stroke:'#F3B5C0', 'stroke-width':2 }, pat);

    // faixas alternadas e rótulos das trilhas
    lanes.forEach((l, i) => {
      if (i % 2 === 0) el('rect', { x:0, y:l._y0, width:W, height:l._h, fill:'#F8F9FD', rx:10 }, svg);
      const g = el('g', {}, svg);
      el('circle', { cx:12, cy:ys[l.k], r:4, fill:T[l.k].cor }, g);
      const t = el('text', { x:24, y:ys[l.k] - 3, class:'jg-lane-label' }, g); t.textContent = T[l.k].nome;
      const s = el('text', { x:24, y:ys[l.k] + 11, 'font-size':10.5, fill: l.k === 'tireo' ? '#B07400' : '#8E92AE' }, g); s.textContent = l.st;
    });

    // meses
    for (let m = new Date(t0); m < t1; m.setMonth(m.getMonth() + 1)){
      const iso = `${m.getFullYear()}-${String(m.getMonth()+1).padStart(2,'0')}-01`;
      const xm = x(iso);
      if (Math.abs(xm - xh) < 34) { el('line', { x1:xm, y1:TOP - 6, x2:xm, y2:H, stroke:'#E6E8F1', 'stroke-dasharray':'2 4' }, svg); continue; }
      el('line', { x1:xm, y1:TOP - 6, x2:xm, y2:H, stroke:'#E6E8F1', 'stroke-dasharray':'2 4' }, svg);
      const t = el('text', { x:xm + 4, y:12, class:'jg-month' }, svg);
      t.textContent = OL.meses[m.getMonth()] + (m.getMonth() === 0 ? ` ’${String(m.getFullYear()).slice(2)}` : '');
    }

    // internação (faixa)
    const yi = ys.mama;
    el('rect', { x:x('2026-07-24'), y:yi - 11, width:Math.max(6, x('2026-07-27') - x('2026-07-24')), height:22, rx:4, fill:'url(#hatch)' }, svg);

    // hoje
    el('line', { x1:xh, y1:TOP - 8, x2:xh, y2:H, stroke:'#3456E3', 'stroke-width':1.2 }, svg);
    el('rect', { x:xh - 20, y:0, width:40, height:17, rx:8.5, fill:'#3456E3' }, svg);
    const th = el('text', { x:xh, y:12, 'text-anchor':'middle', 'font-size':10, 'font-weight':600, fill:'#fff' }, svg); th.textContent = 'hoje';

    const line = (k, xa, xb, dash) => el('line', { x1:xa, y1:ys[k], x2:xb, y2:ys[k], stroke:T[k].cor, 'stroke-width':2.4, 'stroke-linecap':'round', 'stroke-dasharray': dash ? '4 5' : 'none', opacity: dash ? .65 : 1 }, svg);
    const branch = (from, to, xa) => {
      const ya = ys[from], yb = ys[to], xs = xa - 26;
      el('path', { d:`M${xs},${ya} C${xs + 16},${ya} ${xa - 12},${yb} ${xa},${yb}`, fill:'none', stroke:T[to].cor, 'stroke-width':2.4, 'stroke-linecap':'round' }, svg);
    };

    // trilhas
    line('geral', LW, xh); line('geral', xh, W - PR, true);
    branch('geral', 'mama', x('2026-05-12'));
    line('mama', x('2026-05-12'), xh); line('mama', xh, x('2027-01-20'), true);
    branch('mama', 'fert', x('2026-06-02'));
    line('fert', x('2026-06-02'), xh); line('fert', xh, x('2026-11-12'), true);
    line('tireo', LW, xh, true);

    // lente: blocos de QT acima da trilha da mama
    const lensBlock = (xa, xb, txt, prog) => {
      const yb = ys.mama - 34;
      el('path', { d:`M${xa},${yb + 9} V${yb + 4} H${xb} V${yb + 9}`, fill:'none', stroke:'#BCA8FB', 'stroke-width':1.2 }, svg);
      if (prog != null){
        el('rect', { x:xa, y:yb + 13, width:xb - xa, height:3, rx:1.5, fill:'#E0E6FC' }, svg);
        el('rect', { x:xa, y:yb + 13, width:(xb - xa) * prog, height:3, rx:1.5, fill:'#3456E3' }, svg);
      }
      const t = el('text', { x:xa, y:yb - 2, class:'jg-ann', fill:'#5B47C9' }, svg); t.innerHTML = txt;
    };
    lensBlock(x('2026-07-01'), x('2026-08-19'), 'AC dose densa · 4/4');
    lensBlock(x('2026-09-09'), x('2026-12-02'), 'Paclitaxel · 7/12 · <tspan font-weight="600">faltam 5</tspan>', 7/12);

    // sessões
    sessoes.feitas.forEach(d => el('circle', { cx:x(d), cy:ys.mama, r:3, fill:'#fff', stroke:T.mama.cor, 'stroke-width':1.6 }, svg));
    sessoes.plan.forEach(d => el('circle', { cx:x(d), cy:ys.mama, r:3, fill:'#fff', stroke:'#9DB0F2', 'stroke-width':1.4, 'stroke-dasharray':'2 1.5' }, svg));

    // eventos
    const vis = OL.jornada.filter(e => OL.dt(e.d) >= t0 && OL.dt(e.d) < t1 && ys[e.t] != null);
    const levels = {}; // colisão de rótulos por trilha
    vis.forEach(e => {
      const cx = x(e.d), cy = ys[e.t], cor = T[e.t].cor;
      const g = el('g', { class:'jg-node', tabindex:0 }, svg);
      const fut = e.k === 'planejado';
      if (['intercorrencia','interrupcao','atraso','internacao'].includes(e.k)){
        const c = e.k === 'internacao' ? '#DD3F57' : '#D58A00';
        el('rect', { x:cx - 5.5, y:cy - 5.5, width:11, height:11, rx:2, transform:`rotate(45 ${cx} ${cy})`, fill:c, stroke:'#fff', 'stroke-width':2, class:'c' }, g);
      } else if (e.k === 'alta'){
        el('circle', { cx, cy, r:6.5, fill:'#0F9F7A', stroke:'#fff', 'stroke-width':2, class:'c' }, g);
        el('path', { d:`M${cx-2.8},${cy+.2} l2,2 l3.6,-4`, fill:'none', stroke:'#fff', 'stroke-width':1.6, 'stroke-linecap':'round', 'stroke-linejoin':'round' }, g);
      } else if (e.k === 'registro'){
        el('circle', { cx, cy, r:6.5, fill:'#8B6CF6', stroke:'#fff', 'stroke-width':2, class:'c' }, g);
        el('path', { d:`M${cx},${cy-3.6} q.5,3 3.4,3.6 q-2.9.6-3.4,3.6 q-.5-3-3.4-3.6 q2.9-.6 3.4-3.6z`, fill:'#fff' }, g);
      } else if (e.k === 'tratamento'){
        el('circle', { cx, cy, r:6.5, fill:cor, stroke:'#fff', 'stroke-width':2, class:'c' }, g);
      } else {
        el('circle', { cx, cy, r:6, fill:'#fff', stroke: fut ? '#9AA0BE' : cor, 'stroke-width':2.2, 'stroke-dasharray': fut ? '3 2' : 'none', class:'c' }, g);
      }
      if (rotulos.has(e.d)){
        const lv = levels[e.t] || (levels[e.t] = []);
        const w = e.tit.length * 6.4 + 10;
        let L = 0; while (lv.some(o => o.L === L && cx < o.x2 + 8 && cx + w > o.x1)) L++;
        lv.push({ L, x1:cx, x2:cx + w });
        const ty = cy + 19 + L * 13;
        if (L) el('line', { x1:cx, y1:cy + 8, x2:cx, y2:ty - 9, stroke:'#D6D9E7' }, svg);
        const t = el('text', { x:cx, y:ty, class:'jg-ann', fill: e.k === 'internacao' ? '#9A1F33' : (['atraso','intercorrencia'].includes(e.k) ? '#7A4D00' : '#5F6488') }, svg);
        t.textContent = e.tit;
      }
      const tp = OL.tipos[e.k];
      bindTip(g, `<b>${e.tit}</b><small>${OL.fmt(e.d, true)} · ${tp.nome} · ${T[e.t].nome}</small><small>${e.det}</small>`);
    });
  }

  function drawJourneyList(){
    const host = $('#jgraph'); host.innerHTML = '';
    const rows = OL.jornada.filter(e => OL.dt(e.d) >= OL.dt('2026-05-01')).slice().reverse();
    host.innerHTML = `<table class="jl"><thead><tr><th>Data</th><th>Trilha</th><th>Evento</th><th>Tipo</th></tr></thead><tbody>${
      rows.map(e => { const tp = OL.tipos[e.k]; return `<tr class="${e.k==='planejado'?'fut':''}"><td class="num">${OL.fmt(e.d, true)}</td><td><span class="ln" style="--c:${T[e.t].cor}"></span>${T[e.t].nome}</td><td><b>${e.tit}</b><small>${e.det}</small></td><td><span class="tag ${tp.cor}">${tp.nome}</span></td></tr>`; }).join('')
    }</tbody></table>`;
  }

  function legend(){
    $('#jlegend').innerHTML = `
      <span style="color:#3456E3"><i class="f"></i>Tratamento</span>
      <span style="color:#3456E3"><i></i>Exame ou consulta</span>
      <span style="color:#D58A00"><i class="sq f"></i>Intercorrência · interrupção · atraso</span>
      <span style="color:#DD3F57"><i class="sq f"></i>Internação</span>
      <span style="color:#0F9F7A"><i class="f"></i>Alta</span>
      <span style="color:#8B6CF6"><i class="f"></i>Registro da paciente</span>
      <span style="color:#9AA0BE"><i class="dash"></i>Planejado</span>`;
  }

  let jMode = 'g';
  $$('.w-journey .seg button').forEach((b, i) => b.addEventListener('click', () => {
    $$('.w-journey .seg button').forEach(x => x.classList.remove('on')); b.classList.add('on');
    jMode = i ? 'l' : 'g'; jMode === 'g' ? drawJourney() : drawJourneyList();
  }));

  /* ---------- mapa do corpo ---------- */
  function smooth(pts){
    let d = `M${pts[0][0]},${pts[0][1]}`;
    const n = pts.length;
    for (let i = 0; i < n; i++){
      const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
      const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
      const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0]},${p2[1]}`;
    }
    return d + 'Z';
  }
  const LADO = [[91,60],[90,76],[80,84],[64,89],[54,96],[48,110],[45,136],[42,164],[38,190],[34,214],[31,236],[29,248],
    [25,260],[24,272],[28,282],[35,281],[39,270],[40,256],[42,246],[46,222],[51,196],[55,174],[58,150],[62,126],[66,118],
    [67,142],[68,166],[69,190],[65,212],[62,236],[63,264],[66,300],[70,334],[71,352],[72,378],[75,404],[77,416],[73,426],
    [78,433],[92,433],[95,424],[92,412],[93,388],[92,360],[93,342],[96,300],[98,264],[100,250]];
  const BODY = smooth([...LADO, ...LADO.slice(0, -1).reverse().map(([a,b]) => [200 - a, b])]);
  const pontos = [
    { k:'mama',  x:119, y:123, c:'#DD3F57', act:1, t:'Mama esquerda', d:'CDI 2,4 cm · QT neoadjuvante 7/12' },
    { k:'maos',  x:30,  y:268, c:'#D58A00', act:1, t:'Mãos', d:'Formigamento desde 24/10 · neuropatia?', twin:[170,268] },
    { k:'cor',   x:107, y:150, c:'#D58A00', act:1, t:'Coração', d:'Pós-antraciclina · FC de repouso em alta' },
    { k:'utero', x:100, y:224, c:'#8B6CF6', t:'Útero e ovários', d:'Histórico familiar · AMH em queda' },
    { k:'tireo', x:100, y:72,  c:'#D58A00', t:'Tireoide', d:'TI-RADS 3 · ultrassom atrasado' },
    { k:'port',  x:80,  y:101, c:'#5A4ED4', t:'Cateter implantado', d:'Port-a-cath desde 24/06' },
    { k:'pulm',  x:84,  y:144, c:'#1F9BB8', t:'Pulmões', d:'Ex-tabagista · 8 maços-ano' },
    { k:'septo', x:100, y:36,  c:'#9AA0BE', t:'Septo nasal', d:'Septoplastia 2019 · resolvido' }
  ];
  function drawBody(){
    const host = $('#bodyfig');
    host.innerHTML = `<svg viewBox="0 0 200 444" role="img" aria-label="Mapa do corpo com pontos de atenção">
      <defs>
        <linearGradient id="bg1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#EEF1FE"/><stop offset="1" stop-color="#F1ECFD"/></linearGradient>
      </defs>
      <ellipse cx="100" cy="34" rx="20" ry="25" fill="url(#bg1)" stroke="#C9D0EE" stroke-width="1.3"/>
      <path d="${BODY}" fill="url(#bg1)" stroke="#C9D0EE" stroke-width="1.3" stroke-linejoin="round"/>
      <g fill="none" stroke="#D8DDF3" stroke-width="1.1">
        <path d="M84 120c-6 8-8 20-7 34 4 4 10 4 14 0 1-12 0-24-3-34z"/>
        <path d="M116 120c6 8 8 20 7 34-4 4-10 4-14 0-1-12 0-24 3-34z"/>
        <path d="M80 118c5 9 15 11 18 5M120 118c-5 9-15 11-18 5"/>
        <path d="M92 216c2 8 14 8 16 0M100 222v8M88 214c-4 0-6-3-5-6M112 214c4 0 6-3 5-6"/>
      </g>
      ${pontos.map(p => {
        const one = (x, y) => `<circle class="halo" cx="${x}" cy="${y}" r="7" fill="${p.c}" opacity=".35"/><circle cx="${x}" cy="${y}" r="5.2" fill="${p.c}" stroke="#fff" stroke-width="2"/>`;
        return `<g class="hs ${p.act ? 'act' : ''}" data-k="${p.k}" tabindex="0">${one(p.x, p.y)}${p.twin ? one(p.twin[0], p.twin[1]) : ''}</g>`;
      }).join('')}
    </svg>`;
    $('#bodylist').innerHTML = pontos.map(p => `<li data-k="${p.k}" style="--c:${p.c}"><i></i><div><b>${p.t}</b><small>${p.d}</small></div></li>`).join('');
    $$('.hs', host).forEach(g => {
      const p = pontos.find(o => o.k === g.dataset.k);
      const li = $(`#bodylist li[data-k="${p.k}"]`);
      bindTip(g, `<b>${p.t}</b><small>${p.d}</small>`);
      g.addEventListener('mouseenter', () => li.classList.add('hl'));
      g.addEventListener('mouseleave', () => li.classList.remove('hl'));
    });
  }

  /* ---------- marcadores ---------- */
  let mkSel = 'amh';
  function drawMarker(){
    const m = OL.marcadores[mkSel], pts = m.pts;
    const first = pts[0][1], last = pts[pts.length - 1][1];
    const pct = Math.round((last - first) / first * 100);
    $('#mkhead').innerHTML = `<b class="num">${OL.nf(last, m.dec)}</b><span class="u">${m.un} · ${OL.fmt(pts[pts.length-1][0])}</span>
      <span class="d ${last < m.ref[0] || last > m.ref[1] ? 'down' : 'up'} num">${pct > 0 ? '+' : ''}${pct}% desde ${OL.fmt(pts[0][0])}</span>
      <span class="ref num">referência ${OL.nf(m.ref[0], m.dec)}–${OL.nf(m.ref[1], m.dec)} ${m.un}</span>`;
    $('#mklens').innerHTML = `${ic('sparkle','xs')}<span class="src">lia · leitura</span><b>${m.nota}</b>`;

    $('#mktable').innerHTML = Object.entries(OL.marcadores).map(([k, mm]) => {
      const p = mm.pts, v = p[p.length-1][1], v0 = p[p.length-2][1];
      const out = v < mm.ref[0] || v > mm.ref[1];
      const arrow = v > v0 ? '↑' : v < v0 ? '↓' : '=';
      return `<button class="${k===mkSel?'on':''}" data-k="${k}" style="--c:${mm.cor}"><i></i><span>${mm.nome}</span><b class="num">${OL.nf(v, mm.dec)}</b><em class="${out?'out':''}">${arrow} ${out ? 'fora da ref.' : 'na ref.'}</em></button>`;
    }).join('');
    $$('#mktable button').forEach(b => b.addEventListener('click', () => { mkSel = b.dataset.k; drawMarker(); }));
    const host = $('#mkchart'); host.innerHTML = '';
    const W = Math.max(320, host.clientWidth), H = 236, L = 44, R = 14, TP = 12, B = 24;
    const a = OL.dt('2026-05-20'), b = OL.dt('2026-11-05');
    const vals = pts.map(p => p[1]).concat(m.ref);
    let lo = Math.min(...vals), hi = Math.max(...vals);
    const pad = (hi - lo) * .12; lo = Math.max(0, lo - pad); hi = hi + pad;
    const X = d => L + (OL.dt(d) - a) / (b - a) * (W - L - R);
    const Y = v => TP + (1 - (v - lo) / (hi - lo)) * (H - TP - B);
    const svg = el('svg', { viewBox:`0 0 ${W} ${H}`, preserveAspectRatio:'none', role:'img', 'aria-label':`Tendência de ${m.nome}` }, host);
    svg.style.height = H + 'px';
    const defs = el('defs', {}, svg);
    const lg = el('linearGradient', { id:'mkfill', x1:0, y1:0, x2:0, y2:1 }, defs);
    el('stop', { offset:0, 'stop-color':m.cor, 'stop-opacity':.22 }, lg);
    el('stop', { offset:1, 'stop-color':m.cor, 'stop-opacity':0 }, lg);

    // grade + eixo y
    const g = el('g', { class:'grid' }, svg), ax = el('g', { class:'axis' }, svg);
    for (let i = 0; i <= 3; i++){
      const v = lo + (hi - lo) * i / 3, yy = Y(v);
      el('line', { x1:L, x2:W - R, y1:yy, y2:yy }, g);
      const t = el('text', { x:L - 8, y:yy + 3.5, 'text-anchor':'end' }, ax); t.textContent = OL.nf(v, v < 10 ? 1 : 0);
    }
    ['2026-06-01','2026-07-01','2026-08-01','2026-09-01','2026-10-01','2026-11-01'].forEach(d => {
      const t = el('text', { x:X(d), y:H - 6, 'text-anchor':'middle' }, ax); t.textContent = OL.meses[OL.dt(d).getMonth()];
    });
    // faixa de referência
    const yr1 = Y(Math.min(m.ref[1], hi)), yr0 = Y(Math.max(m.ref[0], lo));
    el('rect', { x:L, width:W - L - R, y:yr1, height:Math.max(0, yr0 - yr1), class:'band' }, svg);
    el('line', { x1:L, x2:W - R, y1:yr0, y2:yr0, class:'band-l' }, svg);
    // QT (fundo)
    const qa = X('2026-07-01'), qb = X('2026-12-02');
    el('rect', { x:qa, y:TP, width:Math.min(qb, W - R) - qa, height:H - TP - B, fill:'#3456E3', opacity:.035 }, svg);
    const tq = el('text', { x:qa + 6, y:TP + 11, 'font-size':10, fill:'#7D8FD8', 'font-family':'IBM Plex Mono' }, svg); tq.textContent = 'quimioterapia';
    // linha
    const dLine = pts.map((p, i) => `${i ? 'L' : 'M'}${X(p[0]).toFixed(1)},${Y(p[1]).toFixed(1)}`).join(' ');
    el('path', { d:`${dLine} L${X(pts[pts.length-1][0])},${H - B} L${X(pts[0][0])},${H - B}Z`, fill:'url(#mkfill)' }, svg);
    el('path', { d:dLine, fill:'none', stroke:m.cor, 'stroke-width':2.2, 'stroke-linejoin':'round', 'stroke-linecap':'round' }, svg);
    pts.forEach((p, i) => {
      const out = p[1] < m.ref[0] || p[1] > m.ref[1];
      const c = el('circle', { cx:X(p[0]), cy:Y(p[1]), r: i === pts.length - 1 ? 5 : 3.8, fill: out ? '#fff' : m.cor, stroke: out ? '#DD3F57' : '#fff', 'stroke-width':2, tabindex:0 }, svg);
      c.style.cursor = 'pointer';
      bindTip(c, `<b>${OL.nf(p[1], m.dec)} ${m.un}</b><small>${OL.fmt(p[0], true)}${out ? ' · fora da referência' : ''}</small>`);
    });
  }

  /* ---------- wearables ---------- */
  function spark(id, data, { color='#3456E3', bars=false, area=true } = {}){
    const host = $(id); if (!host) return;
    const W = 160, H = 34, lo = Math.min(...data), hi = Math.max(...data);
    const X = i => i / (data.length - 1) * W, Y = v => 3 + (1 - (v - lo) / (hi - lo || 1)) * (H - 6);
    let s = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">`;
    if (bars){
      const bw = W / data.length;
      data.forEach((v, i) => { const h = 4 + (v - lo) / (hi - lo) * (H - 6); s += `<rect x="${i*bw + 1}" y="${H - h}" width="${bw - 2.5}" height="${h}" rx="1.5" fill="${color}" opacity="${i >= data.length - 7 ? 1 : .35}"/>`; });
    } else {
      const d = data.map((v, i) => `${i ? 'L' : 'M'}${X(i).toFixed(1)},${Y(v).toFixed(1)}`).join(' ');
      if (area) s += `<path d="${d} L${W},${H} L0,${H}Z" fill="${color}" opacity=".1"/>`;
      s += `<path d="${d}" fill="none" stroke="${color}" stroke-width="1.8" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>`;
      s += `<circle cx="${X(data.length-1)}" cy="${Y(data[data.length-1])}" r="2.6" fill="${color}"/>`;
    }
    host.innerHTML = s + '</svg>';
  }
  function weeks(){
    const ex = [[0,1,0,0,1,0,1],[1,1,0,0,0,1,0],[1,1,0,0,0,1,1],[1,1,0,0,0,1,0]];
    $('#wk-ex').innerHTML = ex.flat().map(v => `<i class="${v ? 'on' : ''}"></i>`).join('');
  }
  function clue(){
    const R = 46, C = 2 * Math.PI * R, frac = 74 / 120;
    $('#cluering').innerHTML = `<svg viewBox="0 0 112 112">
      <circle cx="56" cy="56" r="${R}" fill="none" stroke="#F6E3EA" stroke-width="9"/>
      <circle cx="56" cy="56" r="${R}" fill="none" stroke="#E7A1B8" stroke-width="9" stroke-linecap="round"
        stroke-dasharray="${C*frac} ${C}" transform="rotate(-90 56 56)" opacity=".9"/>
      <circle cx="56" cy="${56 - R}" r="5.5" fill="#D9577E" stroke="#fff" stroke-width="2"/>
      <text x="56" y="56" text-anchor="middle" font-size="22" font-weight="600" fill="#131733" font-family="Instrument Sans">74</text>
      <text x="56" y="71" text-anchor="middle" font-size="9.5" fill="#5F6488" font-family="Instrument Sans">dias sem ciclo</text>
    </svg>`;
    const cyc = [['mar',29],['abr',30],['mai',28],['jun',31],['jul',34],['ago+',0]];
    $('#cluecyc').innerHTML = cyc.map(([m, v]) => v
      ? `<span title="${v} dias"><i style="height:${(v - 20) * 2.4}px"></i>${m}</span>`
      : `<span class="miss" title="sem ciclo desde 18/08"><i></i>${m}</span>`).join('');
  }

  /* ---------- rotina (mapa de calor) ---------- */
  function heat(){
    const dias = ['seg','ter','qua','qui','sex','sáb','dom'];
    const val = (d, h) => {
      const fds = d >= 5;
      if (h < 6 || h === 23 || (fds && h < 8) || (h === 6 && d !== 0 && d !== 1 && !fds)) return { s:'sono' };
      if (d === 2 && h >= 8 && h <= 12) return { s:'qt' };
      if ((d === 0 || d === 1) && h === 7) return { v:.95 };
      if (d === 5 && h === 9) return { v:.9 };
      let v = .18 + (h === 12 ? .25 : 0) + (h >= 19 && h <= 21 ? .18 : 0) + (fds ? .12 : 0);
      if ((d === 2 && h > 12) || d === 3) v *= .45;
      if (d === 4) v *= .7;
      return { v:Math.min(1, v + ((d * 7 + h * 3) % 5) * .02) };
    };
    const cw = 15.5, chh = 15, gap = 2.5, L = 30, TP = 16;
    const W = L + 24 * (cw + gap), H = TP + 7 * (chh + gap) + 22;
    let s = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Mapa de calor da rotina semanal">
      <defs><pattern id="qt" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="4" height="4" fill="#7B6CE0"/><line x1="0" y1="0" x2="0" y2="4" stroke="#5A4ED4" stroke-width="2"/></pattern></defs>`;
    [0,6,12,18].forEach(h => s += `<text x="${L + h * (cw + gap)}" y="10">${String(h).padStart(2,'0')}h</text>`);
    dias.forEach((dn, d) => {
      s += `<text x="0" y="${TP + d * (chh + gap) + 11}">${dn}</text>`;
      for (let h = 0; h < 24; h++){
        const c = val(d, h), x = L + h * (cw + gap), y = TP + d * (chh + gap);
        let fill = c.s === 'sono' ? '#E7E2FB' : c.s === 'qt' ? 'url(#qt)' : `rgba(52,86,227,${(.08 + c.v * .9).toFixed(2)})`;
        s += `<rect x="${x}" y="${y}" width="${cw}" height="${chh}" rx="3.5" fill="${fill}"/>`;
      }
    });
    const ly = TP + 7 * (chh + gap) + 10;
    s += `<rect x="${L}" y="${ly}" width="10" height="10" rx="2.5" fill="#E7E2FB"/><text x="${L + 14}" y="${ly + 8.5}">sono</text>
      <rect x="${L + 52}" y="${ly}" width="10" height="10" rx="2.5" fill="rgba(52,86,227,.25)"/><rect x="${L + 64}" y="${ly}" width="10" height="10" rx="2.5" fill="rgba(52,86,227,.95)"/><text x="${L + 78}" y="${ly + 8.5}">atividade</text>
      <rect x="${L + 136}" y="${ly}" width="10" height="10" rx="2.5" fill="url(#qt)"/><text x="${L + 150}" y="${ly + 8.5}">sessão de QT</text></svg>`;
    $('#heat').innerHTML = s;
  }

  /* ---------- checklist ---------- */
  function checklist(){
    const c = OL.checklist, n = c.semanas.length;
    let h = `<span></span>${c.semanas.map((s, i) => `<span class="h num">${i === n - 1 ? 'atual' : s}</span>`).join('')}<span></span>`;
    c.itens.forEach(it => {
      const d = it.v[n - 1] - it.v[0];
      const tr = d <= -2 ? `<span class="t dn">↓ ${-d}</span>` : d < 0 ? `<span class="t dn">↓ ${-d}</span>` : d > 0 ? `<span class="t">↑ ${d}</span>` : `<span class="t eq">=</span>`;
      h += `<span class="k">${it.k}</span>` + it.v.map((v, i) => `<span class="c s${v} ${i === n - 1 ? 'now' : ''} num" title="${it.k}: ${v} de 5">${v}</span>`).join('') + tr;
    });
    $('#ck').innerHTML = h;
  }

  /* ---------- insights ---------- */
  function insights(){
    const list = $('#ins');
    const upd = () => {
      const n = $$('input:checked', list).filter(i => !i.closest('li').classList.contains('sent')).length;
      $('#inscount').textContent = n === 1 ? '1 selecionado' : `${n} selecionados`;
      $('#inssend').disabled = !n; $('#inssend').style.opacity = n ? 1 : .5;
    };
    list.addEventListener('change', upd);
    $$('.ins-act .btn', list).forEach(b => b.addEventListener('click', () => {
      const li = b.closest('li'); li.classList.add('sent'); $('input', li).checked = false; upd();
      say(`${b.textContent.trim()} · enviado para a paciente e para a equipe`);
    }));
    $('#inssend').addEventListener('click', () => {
      const sel = $$('input:checked', list).map(i => i.closest('li')).filter(li => !li.classList.contains('sent'));
      sel.forEach(li => { li.classList.add('sent'); $('input', li).checked = false; });
      upd(); if (sel.length) say(`${sel.length} ${sel.length === 1 ? 'pedido enviado' : 'pedidos enviados'} · a Lia avisa a paciente no app`);
    });
    upd();
  }

  /* ---------- montar ---------- */
  function drawAll(){
    jMode === 'g' ? drawJourney() : drawJourneyList();
    drawMarker();
  }
  legend(); drawBody(); drawAll();
  spark('#sp-passos', OL.passos, { bars:true });
  spark('#sp-sono', OL.sono, { color:'#8B6CF6' });
  spark('#sp-fc', OL.fcRepouso, { color:'#DD3F57' });
  weeks(); clue(); heat(); checklist(); insights();
  $$('.btn').forEach(b => { if (!b.closest('.ins') && b.id !== 'inssend' && !b.closest('.seg')) b.addEventListener('click', () => say(`${b.textContent.trim() || b.title} · disponível na versão completa`)); });
  let rz; addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(drawAll, 120); });
})();
