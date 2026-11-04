(() => {
  async function init() {
    const root = document.querySelector('#hacking-browser');
    if (!root || root.dataset.ready) return;
    root.dataset.ready = 'true';
    const el = id => document.getElementById('hacking-' + id);
    const query=el('query'), category=el('category'), source=el('source'), language=el('language'), status=el('status'), results=el('results'), more=el('more');
    let entries, updated, limit=30;
    try {
      const response=await fetch(new URL('catalog.json', location.href));
      if (!response.ok) throw new Error('catalog unavailable');
      const data=await response.json(); entries=data.entries; updated=data.updated;
    } catch {
      status.textContent='目录暂时无法加载，请刷新重试，或使用下方静态目录。'; return;
    }
    for (const [select, key] of [[category,'category'],[source,'source']]) {
      [...new Set(entries.map(r=>r[key]))].sort().forEach(value=>select.add(new Option(value,value)));
    }
    function render() {
      const terms=query.value.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
      const matches=entries.filter(r=>(!category.value||r.category===category.value)&&(!source.value||r.source===source.value)&&(!language.value||r.language===language.value)&&terms.every(t=>(r.title+' '+r.source+' '+r.category+' '+r.keywords).toLocaleLowerCase().includes(t)));
      status.textContent=`找到 ${matches.length} 条 · 收录 ${entries.length} 条 · 目录更新 ${updated}`;
      results.replaceChildren();
      if (!matches.length) { const p=document.createElement('p');p.textContent='没有找到匹配条目。试试英文技术名，或减少筛选条件。';results.append(p); }
      for (const r of matches.slice(0,limit)) {
        const article=document.createElement('article'), a=document.createElement('a'), meta=document.createElement('p');
        a.href=r.url;a.target='_blank';a.rel='noopener noreferrer';a.textContent=r.title+' ↗';
        meta.textContent=`${r.source} / ${r.category} / ${r.language}原文`;
        article.append(a,meta);results.append(article);
      }
      more.hidden=matches.length<=limit;
    }
    [query,category,source,language].forEach(control=>control.addEventListener('input',()=>{limit=30;render();}));
    el('clear').addEventListener('click',()=>{query.value='';category.value='';source.value='';language.value='';limit=30;render();query.focus();});
    more.addEventListener('click',()=>{limit+=30;render();});
    render();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();
