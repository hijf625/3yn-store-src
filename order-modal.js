(function () {
  const STYLE = `
    #omodal-overlay {
      display: none;
      position: fixed;
      inset: 0;
      z-index: 99999;
      background: rgba(0,0,0,0.75);
      backdrop-filter: blur(4px);
      align-items: center;
      justify-content: center;
      font-family: 'Tajawal', sans-serif;
      direction: rtl;
    }
    #omodal-overlay.active { display: flex; }

    #omodal-box {
      background: linear-gradient(145deg, #1a0e00, #2a1500);
      border: 1px solid rgba(224,90,20,0.4);
      border-radius: 16px;
      padding: 32px 28px 28px;
      width: min(480px, 94vw);
      box-shadow: 0 0 40px rgba(224,90,20,0.25), 0 20px 60px rgba(0,0,0,0.6);
      position: relative;
      animation: omodal-in 0.25s ease;
    }
    @keyframes omodal-in {
      from { opacity:0; transform: translateY(20px) scale(0.97); }
      to   { opacity:1; transform: translateY(0)   scale(1);    }
    }

    #omodal-close {
      position: absolute;
      top: 14px;
      left: 14px;
      background: rgba(255,255,255,0.07);
      border: none;
      color: #ccc;
      font-size: 18px;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s;
    }
    #omodal-close:hover { background: rgba(255,255,255,0.15); color: #fff; }

    #omodal-box h2 {
      margin: 0 0 6px;
      font-size: 20px;
      font-weight: 800;
      color: #fff;
      text-align: center;
    }
    #omodal-box .omodal-sub {
      text-align: center;
      font-size: 13px;
      color: rgba(255,255,255,0.5);
      margin-bottom: 24px;
    }

    .omodal-field {
      margin-bottom: 18px;
    }
    .omodal-field label {
      display: block;
      font-size: 13px;
      font-weight: 700;
      color: rgba(255,255,255,0.8);
      margin-bottom: 7px;
    }
    .omodal-field label span.required {
      color: #e05a14;
      margin-right: 2px;
    }
    .omodal-field label span.optional {
      font-weight: 400;
      color: rgba(255,255,255,0.35);
      font-size: 11px;
      margin-right: 5px;
    }
    .omodal-field input {
      width: 100%;
      box-sizing: border-box;
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 10px;
      padding: 11px 14px;
      color: #fff;
      font-family: 'Tajawal', sans-serif;
      font-size: 14px;
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
      direction: ltr;
      text-align: right;
    }
    .omodal-field input::placeholder { color: rgba(255,255,255,0.25); direction: rtl; text-align: right; }
    .omodal-field input:focus {
      border-color: rgba(224,90,20,0.7);
      box-shadow: 0 0 0 3px rgba(224,90,20,0.15);
      background: rgba(255,255,255,0.09);
    }
    .omodal-field input.error {
      border-color: #e05a5a !important;
      box-shadow: 0 0 0 3px rgba(224,90,90,0.15) !important;
    }
    .omodal-field .omodal-hint {
      font-size: 11.5px;
      color: rgba(255,255,255,0.35);
      margin-top: 5px;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .omodal-field .omodal-hint svg { flex-shrink: 0; }
    .omodal-field .omodal-error {
      font-size: 12px;
      color: #ff7a7a;
      margin-top: 5px;
      display: none;
    }
    .omodal-field .omodal-error.visible { display: block; }

    #omodal-submit {
      width: 100%;
      margin-top: 8px;
      padding: 13px;
      background: linear-gradient(135deg, #e05a14, #c44a0a);
      border: none;
      border-radius: 10px;
      color: #fff;
      font-family: 'Tajawal', sans-serif;
      font-size: 16px;
      font-weight: 800;
      cursor: pointer;
      transition: opacity 0.2s, transform 0.15s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      letter-spacing: 0.3px;
    }
    #omodal-submit:hover { opacity: 0.9; transform: translateY(-1px); }
    #omodal-submit:active { transform: translateY(0); }

    .omodal-divider {
      border: none;
      border-top: 1px solid rgba(255,255,255,0.07);
      margin: 0 0 20px;
    }

    .omodal-google-badge {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      background: rgba(66,133,244,0.12);
      border: 1px solid rgba(66,133,244,0.25);
      border-radius: 20px;
      padding: 3px 10px;
      font-size: 11.5px;
      color: #7ab4ff;
      margin-bottom: 8px;
    }
  `;

  function injectStyles() {
    const style = document.createElement('style');
    style.textContent = STYLE;
    document.head.appendChild(style);
  }

  function buildModal() {
    const overlay = document.createElement('div');
    overlay.id = 'omodal-overlay';
    overlay.innerHTML = `
      <div id="omodal-box">
        <button id="omodal-close" aria-label="إغلاق">✕</button>

        <h2>أكمل طلبك</h2>
        <p class="omodal-sub">أدخل بياناتك لإتمام الاشتراك</p>
        <hr class="omodal-divider"/>

        <div class="omodal-field">
          <label>
            <span class="required">*</span> البريد الإلكتروني الرئيسي
          </label>
          <div class="omodal-google-badge">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            يجب أن يكون بريد Gmail أو مرتبط بـ Google
          </div>
          <input type="email" id="omodal-email" placeholder="example@gmail.com" autocomplete="email" />
          <div class="omodal-error" id="omodal-email-err">يرجى إدخال بريد إلكتروني صحيح من Google (مثل @gmail.com)</div>
        </div>

        <div class="omodal-field">
          <label>
            بريد إلكتروني احتياطي
            <span class="optional">(اختياري)</span>
          </label>
          <input type="email" id="omodal-alt-email" placeholder="example@gmail.com" autocomplete="off" />
          <div class="omodal-hint">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="rgba(255,255,255,0.35)"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
            في حال الأول ما اشتغل
          </div>
          <div class="omodal-error" id="omodal-alt-email-err">يرجى إدخال بريد إلكتروني صحيح</div>
        </div>

        <div class="omodal-field">
          <label>
            <span class="required">*</span> رقم الجوال
          </label>
          <input type="tel" id="omodal-phone" placeholder="05xxxxxxxx" autocomplete="tel" />
          <div class="omodal-error" id="omodal-phone-err">يرجى إدخال رقم جوال صحيح</div>
        </div>

        <button id="omodal-submit">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.528 5.855L0 24l6.293-1.508A11.933 11.933 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.792 9.792 0 01-5.007-1.374l-.36-.214-3.733.894.944-3.634-.236-.374A9.768 9.768 0 012.182 12C2.182 6.575 6.575 2.182 12 2.182S21.818 6.575 21.818 12 17.425 21.818 12 21.818z"/></svg>
          أكمل الطلب عبر واتساب
        </button>
      </div>
    `;
    document.body.appendChild(overlay);
    return overlay;
  }

  function isGoogleEmail(email) {
    if (!email) return false;
    const lower = email.toLowerCase().trim();
    return lower.endsWith('@gmail.com') || lower.endsWith('@googlemail.com');
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }

  function isValidPhone(phone) {
    const cleaned = phone.replace(/[\s\-()]/g, '');
    return /^(\+?966|0)?5[0-9]{8}$/.test(cleaned) || /^[0-9]{8,15}$/.test(cleaned);
  }

  function showError(id, msg) {
    const el = document.getElementById(id);
    if (el) { el.textContent = msg || el.textContent; el.classList.add('visible'); }
  }
  function hideError(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove('visible');
  }
  function setFieldError(inputId, errId, on) {
    const inp = document.getElementById(inputId);
    if (!inp) return;
    if (on) inp.classList.add('error'); else inp.classList.remove('error');
    if (on) showError(errId); else hideError(errId);
  }

  let pendingWhatsappUrl = null;

  function openModal(whatsappUrl) {
    pendingWhatsappUrl = whatsappUrl;
    const overlay = document.getElementById('omodal-overlay');
    overlay.classList.add('active');
    document.getElementById('omodal-email').value = '';
    document.getElementById('omodal-alt-email').value = '';
    document.getElementById('omodal-phone').value = '';
    ['omodal-email-err','omodal-alt-email-err','omodal-phone-err'].forEach(hideError);
    ['omodal-email','omodal-alt-email','omodal-phone'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.remove('error');
    });
    setTimeout(() => document.getElementById('omodal-email').focus(), 100);
  }

  function closeModal() {
    document.getElementById('omodal-overlay').classList.remove('active');
    pendingWhatsappUrl = null;
  }

  function handleSubmit() {
    const email    = document.getElementById('omodal-email').value.trim();
    const altEmail = document.getElementById('omodal-alt-email').value.trim();
    const phone    = document.getElementById('omodal-phone').value.trim();
    let valid = true;

    if (!email || !isGoogleEmail(email)) {
      setFieldError('omodal-email', 'omodal-email-err', true);
      valid = false;
    } else {
      setFieldError('omodal-email', 'omodal-email-err', false);
    }

    if (altEmail && !isValidEmail(altEmail)) {
      setFieldError('omodal-alt-email', 'omodal-alt-email-err', true);
      valid = false;
    } else {
      setFieldError('omodal-alt-email', 'omodal-alt-email-err', false);
    }

    if (!phone || !isValidPhone(phone)) {
      setFieldError('omodal-phone', 'omodal-phone-err', true);
      valid = false;
    } else {
      setFieldError('omodal-phone', 'omodal-phone-err', false);
    }

    if (!valid) return;

    let url = pendingWhatsappUrl || `https://wa.me/966500708427?text=${encodeURIComponent('طلب اشتراك يوتيوب بريميوم')}`;

    const existingText = decodeURIComponent(url.split('?text=')[1] || '');
    let extra = `\n\n📧 البريد الإلكتروني: ${email}`;
    if (altEmail) extra += `\n📧 البريد البديل: ${altEmail}`;
    extra += `\n📱 رقم الجوال: ${phone}`;

    const base = url.split('?text=')[0];
    const finalUrl = `${base}?text=${encodeURIComponent(existingText + extra)}`;

    fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, alt_email: altEmail || null, phone, product: 'يوتيوب بريميوم' })
    }).catch(() => {});

    closeModal();
    window.open(finalUrl, '_blank');
  }

  function interceptButtons() {
    document.addEventListener('click', function (e) {
      const target = e.target.closest('a, button');
      if (!target) return;

      const href = target.getAttribute('href') || '';
      const isWa = href.includes('wa.me') || href.includes('whatsapp');

      if (isWa) {
        e.preventDefault();
        e.stopPropagation();
        openModal(href);
        return;
      }

      const text = (target.innerText || target.textContent || '').trim();
      const isOrderBtn = text.includes('اشتر') || text.includes('ادفع') || text.includes('اطلب') || text.includes('اشترك') || text.includes('Pay') || target.classList.contains('whatsapp-cta') || target.closest('.whatsapp-cta');

      if (isOrderBtn) {
        e.preventDefault();
        e.stopPropagation();
        openModal(null);
      }
    }, true);
  }

  function init() {
    injectStyles();
    buildModal();
    interceptButtons();

    document.addEventListener('click', function (e) {
      if (e.target.id === 'omodal-overlay') closeModal();
    });
    document.getElementById('omodal-close').addEventListener('click', closeModal);
    document.getElementById('omodal-submit').addEventListener('click', handleSubmit);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeModal();
      if (e.key === 'Enter' && document.getElementById('omodal-overlay').classList.contains('active')) handleSubmit();
    });

    ['omodal-email','omodal-alt-email','omodal-phone'].forEach(function(id) {
      const el = document.getElementById(id);
      if (el) el.addEventListener('input', function() {
        el.classList.remove('error');
        const errId = id + '-err';
        hideError(errId);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
