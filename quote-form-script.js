(function(){
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));

  function init(){
    const root = document.querySelector('[data-quote]');
    if(!root || root.dataset.init==='1') return;
    root.dataset.init='1';

    const form = $('#q-form', root);
    const formArea = form.closest('.md\\:col-span-7');
    const success = $('#q-success', root);
    const summary = $('#q-summary', root);
    const mobilebar = $('#q-mobilebar', root);
    const errorBanner = $('#q-error', root);
    const errorMsg = $('#q-error-msg', root);
    const progress = $('#q-progress', root);
    const submitBtn = $('#q-submit', root);
    const includedBtn = $('#q-included-btn', root);
    const includedDetails = $('#q-included', root);
    const additionalBtn = $('#q-additional-btn', root);
    const additionalDetails = $('#q-additional', root);

    const state = {
      step: 1, propertyType: '', bedrooms:'3', bathrooms:'2',
      addons:[], fullName:'', phone:'', email:'', address:'', date:'', notes:'',
      exitDate:'', pmContact:'',
      toggles: { pets:false, carpet:false, balcony:false, reachable:false, twoStorey:false }
    };

    function setStep(n){
      state.step = Math.max(1, Math.min(4, n));
      const steps = $$('.q-step', form);
      steps.forEach((el,i)=>{ const active = (i+1)===state.step; el.classList.toggle('hidden', !active); el.classList.toggle('active', active); });
      progress.style.width = (state.step/steps.length*100)+'%';
      
      // Mobile bar visibility: hide on step 4, show on others
      if(mobilebar) {
        mobilebar.style.display = state.step === 4 ? 'none' : 'flex';
        // Hide Back button on step 1
        const mobileBack = mobilebar.querySelector('.q-prev');
        const mobileNext = mobilebar.querySelector('.q-next');
        if(mobileBack) mobileBack.style.display = state.step === 1 ? 'none' : 'inline-flex';
        if(mobileNext) mobileNext.textContent = state.step === 3 ? 'Review' : 'Next';
      }
      
      render();
      focusFirst();
      
      // Visually accent current step label
      const stepperItems = $$('#q-steps [data-step-label]');
      stepperItems.forEach((li)=>{
        if(li.getAttribute('data-step-label')===String(state.step)) li.setAttribute('aria-current','step');
        else li.removeAttribute('aria-current');
      });
    }

    function render(){
      // Summary strings
      const prop = `${state.bedrooms} Bed, ${state.bathrooms} Bath ${state.propertyType || 'Property'}`;
      $('#sm-prop').textContent = prop;
      $('#sm-addr').textContent = state.address || '—';
      $('#sm-date').textContent = state.date ? state.date.split('-').reverse().join('/') : '—';
      const sm = $('#sm-svcs'); sm.innerHTML = '';
      addSvcChip(sm, 'Standard Bond Clean', true, true);
      state.addons.forEach(a=> addSvcChip(sm, a, false, true));

      if(state.step===4){
        $('#rv-prop').textContent = prop;
        $('#rv-addr').textContent = state.address || '—';
        $('#rv-date').textContent = state.date ? state.date.split('-').reverse().join('/') : '—';
        const key = $('#rv-key'); const keyRow = $('#rv-key-row');
        if(key && keyRow){ const v = (state.exitDate||'').trim(); key.textContent = v || '—'; keyRow.classList.toggle('hidden', !v); }
        const pm = $('#rv-pm'); const pmRow = $('#rv-pm-row');
        if(pm && pmRow){ const v = (state.pmContact||'').trim(); pm.textContent = v || '—'; pmRow.classList.toggle('hidden', !v); }
        $('#rv-notes').textContent = state.notes || '—';
        const rv = $('#rv-svcs'); rv.innerHTML='';
        addSvcChip(rv, 'Standard Bond Clean', true, true);
        state.addons.forEach(a=> addSvcChip(rv, a, false, true));
      }

      // Recommended badges (based on toggles)
      const map = [
        { key:'carpet', label:'Carpet Steam Clean' },
        { key:'pets',   label:'Flea Treatment (Licensed Partner)' },
        { key:'balcony',label:'Balcony/Patio Wash' },
        { key:'reachable', label:'External Windows (Reachable)' }
      ];
      $$('#addons .q-addon').forEach(card=>{
        const title = card.querySelector('.q-title').textContent.trim();
        const pill = card.querySelector('.q-pill');
        const should = map.some(m => state.toggles[m.key] && m.label===title);
        pill && pill.classList.toggle('hidden', !should);
      });
    }

    function addSvcChip(container, text, base=false, compact=false){
      const el = document.createElement('li');
      el.className = 'q-tag' + (compact ? ' q-tag-sm' : '') + (base ? ' q-tag-base' : '');
      el.innerHTML = `<i class="${base?'fas fa-check text-emerald-600':'fas fa-plus text-sky-600'}"></i><span>${text}</span>`;
      container.appendChild(el);
    }

    function focusFirst(){
      const stepEl = $(`#q-step-${state.step}`, form);
      const first = stepEl.querySelector('input,select,textarea,button.q-next,button.q-prev');
      first && first.focus({ preventScroll:true });
    }

    function toggleInvalid(input, ok){
      const msg = input.getAttribute('aria-describedby');
      if(msg){ const el = document.getElementById(msg); if(el) el.hidden = ok; }
      input.classList.toggle('q-invalid', !ok);
      input.setAttribute('aria-invalid', String(!ok));
    }

    function validate(step){
      if(step===1){
        const sel = $('#property-type', form);
        const ok = sel.value.trim() !== '';
        toggleInvalid(sel, ok);
        return ok;
      }
      if(step===3){
        const nm = $('#full-name', form);
        const ph = $('#phone', form);
        const em = $('#email', form);
        const ad = $('#property-address', form);
        const dt = $('#service-date', form);
        const phoneRE = /^(?:\+?61[-\s]?)?(?:0?[2-578]\d{8}|4\d{2}[-\s]?\d{3}[-\s]?\d{3})$/;
        const emailRE = /^\S+@\S+\.\S+$/;
        const todayIso = new Date().toISOString().split('T')[0];
        const ok = nm.value.trim() && phoneRE.test(ph.value) && emailRE.test(em.value) && ad.value.trim() &&
                   dt.value && new Date(dt.value) >= new Date(todayIso);
        toggleInvalid(nm, !!nm.value.trim());
        toggleInvalid(ph, phoneRE.test(ph.value));
        toggleInvalid(em, emailRE.test(em.value));
        toggleInvalid(ad, !!ad.value.trim());
        toggleInvalid($('#service-date-display'), !!(dt.value && new Date(dt.value) >= new Date(todayIso)));
        return ok;
      }
      return true;
    }

    // Events
    form.addEventListener('input', (e)=>{
      const t = e.target;
      switch(t.name){
        case 'property-type': state.propertyType=t.value; break;
        case 'bedrooms': state.bedrooms=t.value; break;
        case 'bathrooms': state.bathrooms=t.value; break;
        case 'full-name': state.fullName=t.value; break;
        case 'phone': state.phone=t.value; break;
        case 'email': state.email=t.value; break;
        case 'property-address': state.address=t.value; break;
        case 'special-requests': state.notes=t.value; break;
        case 'exit-date': state.exitDate=t.value; break;
        case 'pm-contact': state.pmContact=t.value; break;
        case 'service-date': state.date=t.value; break;
        case 'addons':
          state.addons = $$('#addons input[name="addons"]:checked').map(c=>c.value);
          break;
      }
      render();
    });

    form.addEventListener('change', (e)=>{
      const id = e.target.id;
      if(id==='has-pets') state.toggles.pets = e.target.checked;
      if(id==='has-carpet') state.toggles.carpet = e.target.checked;
      if(id==='has-balcony') state.toggles.balcony = e.target.checked;
      if(id==='ext-reachable') state.toggles.reachable = e.target.checked;
      if(id==='two-storey') state.toggles.twoStorey = e.target.checked;
      render();
    });

    form.addEventListener('click', (e)=>{
      const b = e.target.closest('button');
      if(!b) return;
      if(b.classList.contains('q-next')){
        const ok = validate(state.step);
        if(!ok){
          // Scroll to first error with smooth animation
          const err = form.querySelector('.q-invalid');
          err && err.scrollIntoView({ behavior: 'smooth', block: 'center' });
          return;
        }
        setStep(state.step+1);
      }
      if(b.classList.contains('q-prev')){ setStep(state.step-1); }
    });

    form.addEventListener('submit', async (e)=>{
      e.preventDefault();
      if(!(validate(1) && validate(3))) return;
      
      // UI lock
      submitBtn.disabled = true;
      $('.q-submit-text', submitBtn).classList.add('hidden');
      $('.q-spinner', submitBtn).classList.remove('hidden');
      errorBanner.classList.add('hidden');

      // Simulate submission (in real app, this would POST to server)
      setTimeout(() => {
        // Show success
        formArea.classList.add('hidden');
        summary.classList.add('hidden');
        mobilebar.classList.add('hidden');
        success.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 1500);
    });

    $('#q-new', root)?.addEventListener('click', ()=>{
      form.reset();
      Object.assign(state, { step:1, propertyType:'', bedrooms:'3', bathrooms:'2', addons:[], fullName:'', phone:'', email:'', address:'', date:'', notes:'', exitDate:'', pmContact:'', toggles:{pets:false,carpet:false,balcony:false,reachable:false,twoStorey:false} });
      success.classList.add('hidden');
      formArea.classList.remove('hidden');
      summary.classList.remove('hidden');
      mobilebar.classList.remove('hidden');
      render(); setStep(1); window.scrollTo({top:0, behavior:'smooth'});
    });

    // Calendar
    initCalendar();

    // Included toggle
    if(includedBtn && includedDetails){
      includedBtn.addEventListener('click', ()=>{
        const open = includedDetails.hasAttribute('open');
        if(open) includedDetails.removeAttribute('open');
        else includedDetails.setAttribute('open','');
        includedBtn.setAttribute('aria-expanded', String(!open));
      });
    }

    // Additional details toggle
    if(additionalBtn && additionalDetails){
      additionalBtn.addEventListener('click', ()=>{
        const open = additionalDetails.hasAttribute('open');
        if(open) additionalDetails.removeAttribute('open');
        else additionalDetails.setAttribute('open','');
        additionalBtn.setAttribute('aria-expanded', String(!open));
      });
    }

    // Initial
    render(); setStep(1);
  }

  function initCalendar(){
    const root = document.getElementById('cal-root');
    if(!root) return;
    const isoInput = document.getElementById('service-date');
    const disp = document.getElementById('service-date-display');
    const trig = document.getElementById('cal-trigger');

    const today = new Date();
    const SOD = d => new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const same = (a,b)=> SOD(a).getTime()===SOD(b).getTime();
    const addM = (d,n)=> new Date(d.getFullYear(), d.getMonth()+n, 1);

    class Cal{
      constructor(){ this.min=SOD(today); this.view=new Date(); this.sel=null; this.build(); }
      build(){
        this.pop=document.createElement('div');
        this.pop.className='q-cal hidden';
        root.appendChild(this.pop);
        const head=document.createElement('div'); head.className='q-cal-head'; this.pop.appendChild(head);
        this.prev=this.btn('<i class="fas fa-chevron-left"></i>', ()=>{this.view=addM(this.view,-1); this.render();});
        this.next=this.btn('<i class="fas fa-chevron-right"></i>', ()=>{this.view=addM(this.view,1); this.render();});
        this.lab=document.createElement('span'); this.lab.className='font-semibold text-slate-900';
        head.append(this.prev,this.lab,this.next);

        this.grid=document.createElement('div'); this.grid.className='grid grid-cols-7 gap-1 p-1'; this.pop.appendChild(this.grid);
        this.days=[];
        for(let i=0;i<42;i++){ const b=document.createElement('button'); b.type='button'; b.className='q-cal-day'; b.addEventListener('click',e=>{e.stopPropagation(); this.select(b._d);}); this.days.push(b); this.grid.appendChild(b); }
      }
      btn(html,cb){ const b=document.createElement('button'); b.type='button'; b.innerHTML=html; b.className='px-2 py-1 text-sky-600 hover:text-sky-800 focus:outline-none'; b.addEventListener('click',cb); return b; }
      open(){ this.pop.classList.remove('hidden'); this.render(); document.addEventListener('mousedown', this._out=(e)=>{ if(!this.pop.contains(e.target) && e.target.id!=='cal-trigger' && !e.target.closest('#cal-trigger')) this.close(); }); this.days.find(d=>!d.disabled)?.focus(); }
      close(){ this.pop.classList.add('hidden'); document.removeEventListener('mousedown', this._out); }
      render(){
        this.lab.textContent=this.view.toLocaleString('default',{month:'long',year:'numeric'});
        const first=new Date(this.view.getFullYear(),this.view.getMonth(),1);
        const off=(first.getDay()+6)%7; const start=new Date(first); start.setDate(first.getDate()-off);
        for(let i=0;i<42;i++){ const b=this.days[i]; const d=new Date(start); d.setDate(start.getDate()+i); b._d=d; b.textContent=d.getDate();
          const inM=d.getMonth()===this.view.getMonth(); const dis=d<this.min; const sel=this.sel && same(d,this.sel); const todayMark=same(d,new Date());
          b.disabled=dis; b.className='q-cal-day'; if(!inM) b.classList.add('text-slate-400'); if(dis) b.classList.add('text-slate-300','cursor-not-allowed'); if(todayMark) b.classList.add('ring-2'); if(sel) b.classList.add('bg-sky'); }
      }
      select(d){ if(d<this.min) return; this.sel=d; this.render(); const iso=d.toISOString().split('T')[0]; isoInput.value=iso; disp.value=iso.split('-').reverse().join('/'); isoInput.dispatchEvent(new Event('input',{bubbles:true})); disp.focus(); this.close(); }
    }
    const cal=new Cal();
    trig.addEventListener('mousedown', e=>{ e.preventDefault(); cal.open(); });
    trig.addEventListener('click', e=>e.preventDefault());
    disp.addEventListener('focus', ()=> cal.open());
  }

  // Initialize on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
