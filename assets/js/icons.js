/* OncoLink · sprite de ícones (traço 1.8, grade 24). Use: <svg class="i"><use href="#i-nome"/></svg> */
(function(){
  const P = {
    home:'<path d="M3.5 10.5 12 3.5l8.5 7"/><path d="M5.5 9v11h13V9"/><path d="M10 20v-5.5h4V20"/>',
    journey:'<path d="M6 3v12"/><circle cx="18" cy="6" r="2.6"/><circle cx="6" cy="18" r="2.6"/><path d="M18 8.6a9 9 0 0 1-9 9"/>',
    calendar:'<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
    user:'<circle cx="12" cy="8" r="4"/><path d="M4.5 20.5c1.4-3.8 4.2-5.6 7.5-5.6s6.1 1.8 7.5 5.6"/>',
    users:'<circle cx="9" cy="8" r="3.4"/><path d="M2.8 19.5c1-3.3 3.3-5.1 6.2-5.1s5.2 1.8 6.2 5.1"/><path d="M15.5 4.8a3.4 3.4 0 0 1 0 6.4M17.6 14.6c1.8.7 3 2.3 3.6 4.9"/>',
    bell:'<path d="M6 9a6 6 0 1 1 12 0c0 6 2.5 7.5 2.5 7.5h-17S6 15 6 9"/><path d="M10.2 19.8a2 2 0 0 0 3.6 0"/>',
    search:'<circle cx="11" cy="11" r="6.8"/><path d="m20 20-4.2-4.2"/>',
    mic:'<rect x="9" y="3" width="6" height="11.5" rx="3"/><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3"/>',
    send:'<path d="M21 3 10.5 13.5"/><path d="m21 3-6.5 18-4-7.5L3 9.5z"/>',
    plus:'<path d="M12 5v14M5 12h14"/>',
    minus:'<path d="M5 12h14"/>',
    right:'<path d="m9.5 6 6 6-6 6"/>',
    left:'<path d="m14.5 6-6 6 6 6"/>',
    down:'<path d="m6 9.5 6 6 6-6"/>',
    up:'<path d="m6 14.5 6-6 6 6"/>',
    pin:'<path d="M12 21s-6.8-6-6.8-11.6a6.8 6.8 0 0 1 13.6 0C18.8 15 12 21 12 21z"/><circle cx="12" cy="9.4" r="2.4"/>',
    clock:'<circle cx="12" cy="12" r="8.6"/><path d="M12 7.5V12l3 1.8"/>',
    heart:'<path d="M12 19.5s-7.3-4.4-8.9-9C2 7.2 4 4.2 7.3 4.2c1.9 0 3.5 1 4.7 2.6 1.2-1.6 2.8-2.6 4.7-2.6 3.3 0 5.3 3 4.2 6.3-1.6 4.6-8.9 9-8.9 9z"/>',
    pulse:'<path d="M3 12h4l2.5-6.5 5 13 2.5-6.5h4"/>',
    moon:'<path d="M19.5 14.6A7.8 7.8 0 1 1 9.4 4.5a6.3 6.3 0 0 0 10.1 10.1z"/>',
    steps:'<path d="M8 3.2c1.6 0 2.4 1.9 2.4 4.2S9.4 11.6 8 11.6 5.6 9.7 5.6 7.4 6.4 3.2 8 3.2z"/><path d="M6 14.4h4v1.4a2 2 0 0 1-4 0z"/><path d="M16 7.2c1.6 0 2.4 1.9 2.4 4.2s-1 4.2-2.4 4.2-2.4-1.9-2.4-4.2.8-4.2 2.4-4.2z"/><path d="M14 18.4h4v.4a2 2 0 0 1-4 0z"/>',
    flame:'<path d="M12 21c-3.8 0-6.5-2.6-6.5-6.2 0-3.8 3.2-5.6 3.7-9.8 2.8 1.5 4.4 3.9 4.6 6.3.9-.7 1.5-1.8 1.6-3 1.9 1.6 3.1 4 3.1 6.5 0 3.6-2.7 6.2-6.5 6.2z"/>',
    drop:'<path d="M12 3.2s6 6.4 6 10.9a6 6 0 0 1-12 0c0-4.5 6-10.9 6-10.9z"/>',
    pill:'<path d="M10.2 20.2a5 5 0 0 1-7-7l6.6-6.6a5 5 0 0 1 7 7z"/><path d="m8.5 8.5 7 7"/>',
    stetho:'<path d="M5 3.5v5.5a4.5 4.5 0 0 0 9 0V3.5"/><path d="M9.5 13.5v1.5a5 5 0 0 0 10 0v-2.5"/><circle cx="19.5" cy="10.5" r="2"/>',
    file:'<path d="M14 3.5H7A1.5 1.5 0 0 0 5.5 5v14A1.5 1.5 0 0 0 7 20.5h10a1.5 1.5 0 0 0 1.5-1.5V8z"/><path d="M14 3.5V8h4.5M9 12.5h6M9 16h6"/>',
    book:'<path d="M5 18.5V5a1.5 1.5 0 0 1 1.5-1.5H19v13.5H6.5A1.5 1.5 0 0 0 5 18.5zm0 0A1.5 1.5 0 0 0 6.5 20.5H19"/><path d="M9 7.5h6M9 11h4"/>',
    link:'<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 1 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 1 0 5.7 5.7l1-1"/>',
    check:'<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    checkc:'<circle cx="12" cy="12" r="8.6"/><path d="m8.3 12.3 2.6 2.6 4.9-5.4"/>',
    x:'<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>',
    alert:'<path d="M10.3 4.4 2.9 17.4a2 2 0 0 0 1.7 3h14.8a2 2 0 0 0 1.7-3L13.7 4.4a2 2 0 0 0-3.4 0z"/><path d="M12 9.5v4M12 16.8v.1"/>',
    info:'<circle cx="12" cy="12" r="8.6"/><path d="M12 11v5M12 7.8v.1"/>',
    sparkle:'<path d="M12 3.5c.5 4.3 2.4 6.2 6.8 6.8-4.4.6-6.3 2.5-6.8 6.8-.5-4.3-2.4-6.2-6.8-6.8 4.4-.6 6.3-2.5 6.8-6.8z"/><path d="M18.5 15.5c.2 1.6.9 2.3 2.5 2.5-1.6.2-2.3.9-2.5 2.5-.2-1.6-.9-2.3-2.5-2.5 1.6-.2 2.3-.9 2.5-2.5z"/>',
    lock:'<rect x="5" y="10.5" width="14" height="10" rx="2.2"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>',
    shield:'<path d="M12 3.2 4.8 6v5.5c0 4.5 3 8 7.2 9.4 4.2-1.4 7.2-4.9 7.2-9.4V6z"/><path d="m9 12 2.2 2.2 4-4.4"/>',
    sliders:'<path d="M4 6.5h9M17.5 6.5H20M4 12h3.5M11.5 12H20M4 17.5h11M19 17.5h1"/><circle cx="15.3" cy="6.5" r="2"/><circle cx="9.5" cy="12" r="2"/><circle cx="17" cy="17.5" r="2"/>',
    grid:'<rect x="3.5" y="3.5" width="7" height="8.5" rx="1.6"/><rect x="13.5" y="3.5" width="7" height="5" rx="1.6"/><rect x="13.5" y="11.5" width="7" height="9" rx="1.6"/><rect x="3.5" y="15" width="7" height="5.5" rx="1.6"/>',
    msg:'<path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9.5L5 20.5V17H6a2 2 0 0 1-2-2z" transform="translate(0 -.2)"/>',
    chart:'<path d="M3.5 3.5v17h17"/><path d="m7.5 15 3.7-4.2 3 2.8 5-6.1"/>',
    bulb:'<path d="M9.5 18h5M10.5 21h3"/><path d="M12 3a6 6 0 0 0-3.6 10.8c.7.6 1.1 1.4 1.1 2.2v.5h5V16c0-.8.4-1.6 1.1-2.2A6 6 0 0 0 12 3z"/>',
    thermo:'<path d="M14 14.6V5a2 2 0 0 0-4 0v9.6a4 4 0 1 0 4 0z"/><path d="M12 11v5"/>',
    nav:'<path d="m3.5 10.8 17-7.3-7.3 17-2-7.7z"/>',
    phone:'<path d="M5.2 3.8h3.3l1.8 4.6-2.2 1.4a11 11 0 0 0 6.1 6.1l1.4-2.2 4.6 1.8v3.3a2 2 0 0 1-2.1 2A16.5 16.5 0 0 1 3.2 5.9a2 2 0 0 1 2-2.1z"/>',
    edit:'<path d="M4.5 19.5h4L19 9l-4-4L4.5 15.5z"/><path d="m13 7 4 4"/>',
    ext:'<path d="M7.5 16.5 16.5 7.5M9 7.5h7.5V15"/>',
    watch:'<rect x="6" y="6" width="12" height="12" rx="3.2"/><path d="m9 6 .7-2.7h4.6L15 6M9 18l.7 2.7h4.6L15 18"/><path d="M12 9.6V12l1.6 1.1"/>',
    cycle:'<circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 1 8 8"/><circle cx="12" cy="12" r="2.6"/>',
    refresh:'<path d="M19.5 11A7.6 7.6 0 0 0 5.6 7.2L4.5 8.5"/><path d="M4.5 4.5v4h4"/><path d="M4.5 13a7.6 7.6 0 0 0 13.9 3.8l1.1-1.3"/><path d="M19.5 19.5v-4h-4"/>',
    filter:'<path d="M4 5h16l-6.2 7.3V19l-3.6 1.8v-8.5z"/>',
    more:'<circle cx="5.5" cy="12" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="18.5" cy="12" r="1.3"/>',
    building:'<rect x="4.5" y="3.5" width="15" height="17" rx="1.6"/><path d="M12 7v4.2M9.9 9.1h4.2M9.5 20.5v-4h5v4"/>',
    eye:'<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="2.8"/>',
    clip:'<path d="m19.5 11.5-8 8a5 5 0 0 1-7-7l8.5-8.5a3.4 3.4 0 0 1 4.8 4.8l-8.4 8.4a1.8 1.8 0 0 1-2.6-2.6l7.7-7.7"/>',
    syringe:'<path d="m17.5 3 3.5 3.5M19.2 4.8 15.8 8.2"/><path d="M14.5 6.5 17.5 9.5 8.8 18.2l-3-3z"/><path d="m11 10 1.5 1.5M8.5 12.5 10 14M5.8 15.2 3 18"/>',
    bed:'<path d="M3 6v14M3 15.5h18V20M21 15.5V12a3 3 0 0 0-3-3h-7.5v6.5"/><circle cx="6.8" cy="11.6" r="2"/>',
    flag:'<path d="M5.5 21V4M5.5 4.5h11l-2.2 4 2.2 4h-11"/>',
    pause:'<path d="M9 5.5v13M15 5.5v13"/>',
    play:'<path d="M7 5v14l11.5-7z"/>',
    star:'<path d="m12 3.6 2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8L3.6 9.7l5.8-.8z"/>',
    keyboard:'<rect x="2.5" y="6" width="19" height="12" rx="2"/><path d="M6 10h.1M9.5 10h.1M13 10h.1M16.5 10h.1M7.5 14h9"/>',
    globe:'<circle cx="12" cy="12" r="8.6"/><path d="M3.5 12h17M12 3.4c2.4 2.4 3.6 5.3 3.6 8.6s-1.2 6.2-3.6 8.6c-2.4-2.4-3.6-5.3-3.6-8.6S9.6 5.8 12 3.4z"/>',
    scale:'<rect x="3.5" y="3.5" width="17" height="17" rx="4"/><path d="M8.5 9.5a5 5 0 0 1 7 0l-2.3 2.3a1.8 1.8 0 0 0-2.4 0z"/>',
    gauge:'<path d="M4.4 17.5a8.6 8.6 0 1 1 15.2 0"/><path d="m12 13 3.6-4"/><circle cx="12" cy="13.4" r="1.2"/>',
    logout:'<path d="M14 4.5h3.5A1.5 1.5 0 0 1 19 6v12a1.5 1.5 0 0 1-1.5 1.5H14"/><path d="M10 8l-4 4 4 4M6 12h9"/>',
    printer:'<path d="M7 9V3.5h10V9"/><rect x="3.5" y="9" width="17" height="7.5" rx="2"/><path d="M7 14h10v6.5H7z"/>',
    share:'<circle cx="17.5" cy="5.5" r="2.4"/><circle cx="6.5" cy="12" r="2.4"/><circle cx="17.5" cy="18.5" r="2.4"/><path d="m8.6 10.8 6.8-4M8.6 13.2l6.8 4"/>',
    trend:'<path d="m3.5 16.5 5.5-5.5 4 4 7.5-7.5"/><path d="M15 7.5h5.5V13"/>',
    wave:'<path d="M3 12h1.5M6.5 8v8M10 5v14M13.5 9v6M17 7v10M20.5 11v2"/>',
    mail:'<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m3.5 7 8.5 6 8.5-6"/>',
    trash:'<path d="M4 6.5h16M9.5 6.5V4.5h5v2M6 6.5l1 13a1.5 1.5 0 0 0 1.5 1.4h7a1.5 1.5 0 0 0 1.5-1.4l1-13"/><path d="M10 11v6M14 11v6"/>',
    download:'<path d="M12 4v11M7.5 10.5 12 15l4.5-4.5"/><path d="M4.5 16.5v2a1.5 1.5 0 0 0 1.5 1.5h12a1.5 1.5 0 0 0 1.5-1.5v-2"/>',
    mobile:'<rect x="6.5" y="2.5" width="11" height="19" rx="2.6"/><path d="M10.5 18.5h3"/>',
    iosshare:'<path d="M12 3.5v11M8 7.5l4-4 4 4"/><path d="M8.5 10.5H7A1.5 1.5 0 0 0 5.5 12v7A1.5 1.5 0 0 0 7 20.5h10a1.5 1.5 0 0 0 1.5-1.5v-7a1.5 1.5 0 0 0-1.5-1.5h-1.5"/>',
    plussq:'<rect x="4" y="4" width="16" height="16" rx="3.5"/><path d="M12 8.5v7M8.5 12h7"/>',
    scroll:'<path d="M8 4.5h10.5a1.5 1.5 0 0 1 1.5 1.5v12.5a2 2 0 0 1-2 2H8"/><path d="M8 4.5a2 2 0 0 0-2 2v12a2 2 0 0 1-2-2v-1.5h4"/><path d="M10.5 9h6M10.5 12.5h6M10.5 16h3.5"/>',
    key:'<circle cx="8" cy="15" r="4.5"/><path d="m11.2 11.8 8.3-8.3M16.5 6.5l2.5 2.5M14 9l2 2"/>'
  };
  const sym = Object.entries(P).map(([k,v])=>`<symbol id="i-${k}" viewBox="0 0 24 24">${v}</symbol>`).join('');
  const brand = `
    <symbol id="oncolink-mark" viewBox="0 0 32 32">
      <defs>
        <linearGradient id="olg1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3B5BFF"/><stop offset="1" stop-color="#5A4ED4"/></linearGradient>
        <linearGradient id="olg2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7A5CF5"/><stop offset="1" stop-color="#B47CFF"/></linearGradient>
      </defs>
      <circle cx="11.8" cy="16" r="7.4" fill="none" stroke="url(#olg1)" stroke-width="3.2"/>
      <circle cx="20.2" cy="16" r="7.4" fill="none" stroke="url(#olg2)" stroke-width="3.2" stroke-dasharray="41.66 4.83" stroke-dashoffset="13.67"/>
    </symbol>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" style="position:absolute;width:0;height:0;overflow:hidden" aria-hidden="true">${sym}${brand}</svg>`;
  document.body.insertAdjacentHTML('afterbegin', svg);
  window.ic = (n, cls='') => `<svg class="i ${cls}" aria-hidden="true"><use href="#i-${n}"/></svg>`;
})();
