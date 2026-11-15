/* DOM/UI logic only. Academic content belongs in data.js. */
(() => {
  'use strict';
  const data = window.SITE_DATA, profile = data.profile;
  const $ = selector => document.querySelector(selector);
  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  // No content is interpolated as HTML. Only safe HTTP(S), email and relative URLs.
  function safeURL(value) {
    if (!value || typeof value !== 'string') return null;
    try { const url = new URL(value, location.href); return ['http:', 'https:', 'mailto:', 'file:'].includes(url.protocol) ? url : null; }
    catch { return null; }
  }
  function link(label, url, className = 'text-link') {
    const parsed = safeURL(url);
    if (!parsed) { const s = el('span', 'disabled-link', label + ' ↗'); s.setAttribute('aria-disabled', 'true'); s.title = 'Placeholder — configure this link in data.js'; return s; }
    const a = el('a', className, label + ' ↗'); a.href = parsed.href;
    if (/^https?:/.test(parsed.protocol) && parsed.origin !== location.origin) { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
    return a;
  }
  // iOS renders the ↗ character as an emoji: swap it for an inline SVG everywhere.
  function swapArrows(root){
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT),nodes=[];
    while(walker.nextNode())if(walker.currentNode.nodeValue.includes('\u2197'))nodes.push(walker.currentNode);
    nodes.forEach(node=>{
      const frag=document.createDocumentFragment();
      node.nodeValue.split('\u2197').forEach((part,i)=>{
        if(i){const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('class','arrow');svg.setAttribute('viewBox','0 0 12 12');svg.setAttribute('aria-hidden','true');svg.innerHTML='<path d="M3 9 9 3M4.5 3H9v4.5"/>';frag.append(svg);}
        if(part)frag.append(part);
      });
      node.replaceWith(frag);
    });
  }
  const texts = {'#brand':profile.brand,'#role-short':profile.shortRole,'#name':profile.name,'#bio':profile.bio,'#affiliation':profile.affiliation,'#about-title':profile.aboutTitle,'#about-copy':profile.about,'#portrait-label':profile.name,'#publication-intro':profile.publicationIntro,'#contact-title':profile.contactTitle,'#address':profile.address,'#footer-note':profile.footerNote};
  Object.entries(texts).forEach(([id,text]) => { $(id).textContent = text; });
  profile.headline.forEach(line => $('#headline').append(el('span', '', line)));
  if (profile.cv) $('#cv').append(link('CV / PDF', profile.cv)); else $('#cv').hidden = true;
  const emailURL = profile.email ? 'mailto:' + profile.email : null;
  $('#email').append(link(profile.email || profile.emailLabel,emailURL));
  profile.socials.forEach(s => $('#contact-socials').append(link(s.label,s.url)));
  $('#maps-link').href = safeURL(profile.mapsURL)?.href || '#';
  $('#copyright').textContent = `© ${new Date().getFullYear()} ${profile.name}`;
  $('#portrait').src = safeURL(profile.photo)?.href || 'assets/profile.svg';
  $('#portrait').alt = profile.photoAlt;
  $('#portrait').addEventListener('error', () => { $('#portrait').src = 'assets/profile.svg'; }, {once:true});
  if (!data.news.length) $('.news-heading').hidden = true;
  data.news.forEach(item => {
    const li = el('li'); const time = el('time','',item.date); time.dateTime = item.date.replace('.', '-');
    li.append(time,el('span','',item.text)); $('#news').append(li);
  });
  let topic = 'All', year = 'all';
  const topics = ['All', ...new Set(data.publications.map(p => p.topic))];
  function setTopic(value) { topic = value; renderPapers(); }
  topics.forEach(t => { const b = el('button','filter',t); b.type = 'button'; b.addEventListener('click',()=>setTopic(t)); $('#filters').append(b); });
  [...new Set(data.publications.map(p=>p.year))].sort((a,b)=>b-a).forEach(y=>{ const option=el('option','',y); option.value=String(y); $('#year').append(option); });
  $('#year').addEventListener('change', e=>{year=e.target.value;renderPapers();});
  profile.interests.forEach(t => $('#interests').append(el('span','tag',t)));
  const dialog=$('#bib-dialog'); let trigger=null;
  function openBib(p,button){ trigger=button; $('#bib-title').textContent=p.title; $('#bib-code').textContent=p.bibtex; $('#copy-status').textContent='';dialog.showModal(); }
  $('#close-dialog').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',e=>{ const r=dialog.getBoundingClientRect(); if(e.target===dialog && (e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom))dialog.close(); });
  dialog.addEventListener('close',()=>trigger?.focus());
  $('#copy-bib').addEventListener('click',async()=>{
    const value=$('#bib-code').textContent;
    try { await navigator.clipboard.writeText(value); $('#copy-status').textContent='Citation copied.'; }
    catch { const range=document.createRange(); range.selectNodeContents($('#bib-code')); const selection=getSelection(); selection.removeAllRanges();selection.addRange(range);
      $('#copy-status').textContent='Clipboard unavailable. Citation selected: press Ctrl+C / ⌘C.';
    }
  });
  function renderPapers(){
    $('#papers').replaceChildren();
    [...$('#filters').children].forEach(b=>b.setAttribute('aria-pressed',String(b.textContent===topic)));
    const filtered=data.publications.filter(p=>(topic==='All'||p.topic===topic)&&(year==='all'||String(p.year)===year));
    $('#results').textContent=`${String(filtered.length).padStart(2,'0')} PUBLICATIONS / ${topic.toUpperCase()}`;
    if(!filtered.length)$('#papers').append(el('p','empty','No publications match these filters. Try another year or topic.'));
    filtered.forEach(p=>{
      const article=el('article','paper'), visual=el('div','paper-visual'), img=el('img');
      img.src=safeURL(p.thumbnail)?.href||'assets/surface.svg';img.alt=p.imageAlt;img.loading='lazy';img.width=700;img.height=450;img.style.objectFit=p.imageFit||'cover';if(p.imageFit==='contain')visual.style.background='#fff';
      img.addEventListener('error',()=>{img.src='assets/surface.svg';},{once:true});
      visual.append(img,el('span','paper-number',String(data.publications.indexOf(p)+1).padStart(2,'0')),el('span','visual-caption',p.topic.toUpperCase()));
      const pdf=safeURL(p.pdf);
      if(pdf){const a=el('a','paper-visual-link');a.href=pdf.href;a.target='_blank';a.rel='noopener noreferrer';a.setAttribute('aria-label',`Open the PDF of ${p.title}`);visual.append(a);}
      const content=el('div'),meta=el('div','paper-meta',`${p.venue} / ${p.year}`);
      if(p.example)meta.append(el('span','example','FICTIONAL EXAMPLE'));
      const authors=el('p','authors');p.authors.forEach((a,i)=>{if(i)authors.append(document.createTextNode(', '));authors.append(el(a===profile.name?'strong':'span','',a));});
      content.append(meta,el('h3','',p.title),authors,el('p','paper-summary',p.summary));
      if(p.badge)content.append(el('span','badge',p.badge));
      const links=el('div','paper-links');Object.entries(p.links).forEach(([label,url])=>links.append(link(label,url)));
      if(p.bibtex){const b=el('button','bib-button','{ } BibTeX');b.addEventListener('click',()=>openBib(p,b));links.append(b);}
      content.append(links);article.append(visual,content);$('#papers').append(article);
    });
    swapArrows($('#papers'));
  }
  renderPapers();
  const VISIBLE_PROJECTS=4;
  data.projects.forEach((p,i)=>{
    const card=el('article','project');card.append(el('span','project-number',String(i+1).padStart(2,'0')),el('span','small-label',p.label),el('h3','',p.title));
    if(p.authors?.length){const authors=el('p','authors');p.authors.forEach((a,j)=>{if(j)authors.append(document.createTextNode(', '));authors.append(el(a===profile.name?'strong':'span','',a));});card.append(authors);}
    card.append(el('p','',p.description));
    if(p.url)card.append(link(p.linkLabel,p.url));
    const cardURL=safeURL(p.cardUrl||p.url);
    if(cardURL){const cover=el('a','card-link');cover.href=cardURL.href;cover.target='_blank';cover.rel='noopener noreferrer';cover.tabIndex=-1;cover.setAttribute('aria-hidden','true');card.append(cover);card.classList.add('is-linked');}
    if(i>=VISIBLE_PROJECTS)card.hidden=true;
    $('#project-list').append(card);
  });
  const extra=data.projects.length-VISIBLE_PROJECTS;
  if(extra>0){
    const more=el('button','secondary show-more');more.type='button';more.setAttribute('aria-controls','project-list');more.setAttribute('aria-expanded','false');
    const label=open=>{more.replaceChildren(document.createTextNode(open?'Show fewer projects':`Show more projects (${extra})`),el('span','',open?'↑':'↓'));};
    label(false);
    more.addEventListener('click',()=>{
      const open=more.getAttribute('aria-expanded')!=='true';more.setAttribute('aria-expanded',String(open));
      [...$('#project-list').children].forEach((c,i)=>{if(i>=VISIBLE_PROJECTS)c.hidden=!open;});
      label(open);
      if(open)$('#project-list').children[VISIBLE_PROJECTS].querySelector('h3').scrollIntoView({block:'nearest'});
      else $('#projects').scrollIntoView();
    });
    $('#project-list').after(more);
  }
  const menu=$('.menu-toggle'),nav=$('#navigation');
  function closeMenu(){menu.setAttribute('aria-expanded','false');nav.classList.remove('open');}
  menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open);});
  nav.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open')){closeMenu();menu.focus();}});
  const sections=[...document.querySelectorAll('main section[id],footer[id]')];
  let scheduled=false;
  function scrollUI(){
    scheduled=false;const max=document.documentElement.scrollHeight-innerHeight;
    $('.scroll-progress').style.transform=`scaleX(${max>0?scrollY/max:0})`;
    const active=sections.filter(s=>s.getBoundingClientRect().top<innerHeight*.45).at(-1)?.id||'home';
    nav.querySelectorAll('a').forEach(a=>{const on=a.hash==='#'+active;a.classList.toggle('active',on);if(on)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});
  }
  addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(scrollUI);}},{passive:true});addEventListener('resize',scrollUI);scrollUI();
  swapArrows(document.body);
})();
