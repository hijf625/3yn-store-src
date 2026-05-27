(function () {
  const STYLE = `
    #omodal-overlay {
      display: none;
      position: fixed;
      inset: 0;
      z-index: 99999;
      background: rgba(0,0,0,0.8);
      backdrop-filter: blur(6px);
      align-items: center;
      justify-content: center;
      font-family: 'Tajawal', sans-serif;
      direction: rtl;
      padding: 16px;
    }
    #omodal-overlay.active { display: flex; }

    #omodal-box {
      background: linear-gradient(145deg, #1a0e00, #2a1500);
      border: 1px solid rgba(224,90,20,0.4);
      border-radius: 18px;
      width: min(500px, 100%);
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 0 60px rgba(224,90,20,0.2), 0 24px 80px rgba(0,0,0,0.7);
      position: relative;
      animation: omodal-in 0.25s ease;
      scrollbar-width: thin;
      scrollbar-color: rgba(224,90,20,0.3) transparent;
    }
    @keyframes omodal-in {
      from { opacity:0; transform: translateY(24px) scale(0.97); }
      to   { opacity:1; transform: translateY(0)   scale(1); }
    }

    .omodal-inner { padding: 32px 28px 28px; }

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
      z-index: 2;
    }
    #omodal-close:hover { background: rgba(255,255,255,0.15); color: #fff; }

    /* STEP INDICATOR */
    .omodal-steps {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-bottom: 22px;
    }
    .omodal-step-dot {
      width: 8px; height: 8px;
      border-radius: 50%;
      background: rgba(255,255,255,0.15);
      transition: all 0.3s;
    }
    .omodal-step-dot.active { background: #e05a14; width: 24px; border-radius: 4px; }
    .omodal-step-dot.done { background: rgba(224,90,20,0.5); }

    #omodal-box h2 {
      margin: 0 0 5px;
      font-size: 20px;
      font-weight: 900;
      color: #fff;
      text-align: center;
    }
    #omodal-box .omodal-sub {
      text-align: center;
      font-size: 13px;
      color: rgba(255,255,255,0.45);
      margin-bottom: 22px;
    }
    .omodal-divider {
      border: none;
      border-top: 1px solid rgba(255,255,255,0.07);
      margin: 0 0 20px;
    }

    /* FORM FIELDS */
    .omodal-field { margin-bottom: 16px; }
    .omodal-field label {
      display: block;
      font-size: 13px;
      font-weight: 700;
      color: rgba(255,255,255,0.8);
      margin-bottom: 7px;
    }
    .omodal-field label span.required { color: #e05a14; margin-right: 2px; }
    .omodal-field label span.optional {
      font-weight: 400;
      color: rgba(255,255,255,0.3);
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
    .omodal-field input::placeholder { color: rgba(255,255,255,0.22); direction: rtl; text-align: right; }
    .omodal-field input:focus {
      border-color: rgba(224,90,20,0.7);
      box-shadow: 0 0 0 3px rgba(224,90,20,0.13);
      background: rgba(255,255,255,0.09);
    }
    .omodal-field input.error {
      border-color: #e05a5a !important;
      box-shadow: 0 0 0 3px rgba(224,90,90,0.13) !important;
    }
    .omodal-hint {
      font-size: 11.5px;
      color: rgba(255,255,255,0.32);
      margin-top: 5px;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .omodal-error {
      font-size: 12px;
      color: #ff7a7a;
      margin-top: 5px;
      display: none;
    }
    .omodal-error.visible { display: block; }
    .omodal-google-badge {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      background: rgba(66,133,244,0.1);
      border: 1px solid rgba(66,133,244,0.22);
      border-radius: 20px;
      padding: 3px 10px;
      font-size: 11.5px;
      color: #7ab4ff;
      margin-bottom: 8px;
    }

    /* BUTTONS */
    .omodal-btn-primary {
      width: 100%;
      margin-top: 10px;
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
    }
    .omodal-btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }
    .omodal-btn-primary:active { transform: translateY(0); }

    /* PAYMENT PAGE */
    .pay-section {
      margin-bottom: 14px;
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid rgba(255,255,255,0.08);
    }
    .pay-section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 13px 16px;
      background: rgba(255,255,255,0.04);
      font-size: 14px;
      font-weight: 700;
    }
    .pay-section-header .pay-icon { font-size: 20px; margin-left: 8px; }
    .pay-unavailable {
      font-size: 11px;
      background: rgba(255,255,255,0.07);
      padding: 3px 10px;
      border-radius: 20px;
      color: rgba(255,255,255,0.35);
    }
    .pay-disabled-body {
      padding: 16px;
      text-align: center;
      color: rgba(255,255,255,0.2);
      font-size: 12.5px;
      background: rgba(0,0,0,0.15);
    }

    /* BANK TRANSFER */
    .bank-section {
      border: 1px solid rgba(224,90,20,0.35);
      border-radius: 14px;
      margin-bottom: 16px;
      overflow: hidden;
    }
    .bank-header {
      background: rgba(224,90,20,0.12);
      padding: 13px 16px;
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 15px;
      font-weight: 800;
      color: #ffb07a;
    }
    .bank-body { padding: 18px 16px; }
    .bank-qr {
      text-align: center;
      margin-bottom: 18px;
    }
    .bank-qr img {
      width: 150px;
      height: 150px;
      border-radius: 12px;
      border: 2px solid rgba(224,90,20,0.3);
    }
    .bank-qr p {
      font-size: 11px;
      color: rgba(255,255,255,0.3);
      margin-top: 6px;
    }
    .bank-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 0;
      border-bottom: 1px solid rgba(255,255,255,0.05);
      gap: 10px;
    }
    .bank-row:last-child { border-bottom: none; }
    .bank-row .bank-label {
      font-size: 12px;
      color: rgba(255,255,255,0.4);
      white-space: nowrap;
    }
    .bank-row .bank-value {
      font-size: 13px;
      font-weight: 700;
      color: #fff;
      direction: ltr;
      text-align: left;
      word-break: break-all;
    }
    .copy-btn {
      background: rgba(224,90,20,0.15);
      border: 1px solid rgba(224,90,20,0.25);
      color: #e07a44;
      font-size: 11px;
      padding: 4px 10px;
      border-radius: 6px;
      cursor: pointer;
      font-family: 'Tajawal', sans-serif;
      white-space: nowrap;
      transition: all 0.15s;
      flex-shrink: 0;
    }
    .copy-btn:hover { background: rgba(224,90,20,0.25); }
    .copy-btn.copied { color: #7affb0; border-color: rgba(120,255,170,0.3); background: rgba(120,255,170,0.08); }

    .pay-notice {
      background: rgba(255,200,80,0.07);
      border: 1px solid rgba(255,200,80,0.15);
      border-radius: 10px;
      padding: 12px 14px;
      font-size: 12.5px;
      color: rgba(255,220,120,0.85);
      line-height: 1.6;
      margin-bottom: 16px;
      text-align: center;
    }

    .omodal-back {
      background: transparent;
      border: 1px solid rgba(255,255,255,0.1);
      color: rgba(255,255,255,0.5);
      font-family: 'Tajawal', sans-serif;
      font-size: 13px;
      padding: 9px;
      border-radius: 8px;
      cursor: pointer;
      width: 100%;
      margin-top: 10px;
      transition: all 0.2s;
    }
    .omodal-back:hover { border-color: rgba(255,255,255,0.2); color: rgba(255,255,255,0.75); }
  `;

  function injectStyles() {
    const s = document.createElement('style');
    s.textContent = STYLE;
    document.head.appendChild(s);
  }

  function buildModal() {
    const overlay = document.createElement('div');
    overlay.id = 'omodal-overlay';
    overlay.innerHTML = `
      <div id="omodal-box">
        <button id="omodal-close" aria-label="إغلاق">✕</button>

        <!-- STEP 1: CONTACT FORM -->
        <div id="omodal-step1" class="omodal-inner">
          <div class="omodal-steps">
            <div class="omodal-step-dot active" id="dot1"></div>
            <div class="omodal-step-dot" id="dot2"></div>
          </div>
          <h2>أكمل طلبك</h2>
          <p class="omodal-sub">الخطوة 1 من 2 — أدخل بياناتك</p>
          <hr class="omodal-divider"/>

          <div class="omodal-field">
            <label><span class="required">*</span> البريد الإلكتروني الرئيسي</label>
            <div class="omodal-google-badge">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              يجب أن يكون Gmail أو مرتبط بـ Google
            </div>
            <input type="email" id="omodal-email" placeholder="example@gmail.com" autocomplete="email"/>
            <div class="omodal-error" id="omodal-email-err">يرجى إدخال بريد إلكتروني من Google (مثل @gmail.com)</div>
          </div>

          <div class="omodal-field">
            <label>
              بريد إلكتروني احتياطي
              <span class="optional">(اختياري)</span>
            </label>
            <input type="email" id="omodal-alt-email" placeholder="example@gmail.com" autocomplete="off"/>
            <div class="omodal-hint">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="rgba(255,255,255,0.3)"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
              في حال الأول ما اشتغل
            </div>
            <div class="omodal-error" id="omodal-alt-email-err">يرجى إدخال بريد إلكتروني صحيح</div>
          </div>

          <div class="omodal-field">
            <label><span class="required">*</span> رقم الجوال</label>
            <input type="tel" id="omodal-phone" placeholder="05xxxxxxxx" autocomplete="tel"/>
            <div class="omodal-error" id="omodal-phone-err">يرجى إدخال رقم جوال صحيح</div>
          </div>

          <button class="omodal-btn-primary" id="omodal-next">
            التالي — اختر طريقة الدفع
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6z" transform="rotate(180 12 12)"/></svg>
          </button>
        </div>

        <!-- STEP 2: PAYMENT -->
        <div id="omodal-step2" class="omodal-inner" style="display:none;">
          <div class="omodal-steps">
            <div class="omodal-step-dot done" id="dot1b"></div>
            <div class="omodal-step-dot active" id="dot2b"></div>
          </div>
          <h2>اختر طريقة الدفع</h2>
          <p class="omodal-sub">الخطوة 2 من 2 — ادفع وأكمل الطلب</p>
          <hr class="omodal-divider"/>

          <!-- Apple Pay (disabled) -->
          <div class="pay-section">
            <div class="pay-section-header">
              <span><span class="pay-icon">🍎</span> Apple Pay</span>
              <span class="pay-unavailable">غير متاح حالياً</span>
            </div>
            <div class="pay-disabled-body">سيتم تفعيله قريباً</div>
          </div>

          <!-- Credit Card (disabled) -->
          <div class="pay-section">
            <div class="pay-section-header">
              <span><span class="pay-icon">💳</span> بطاقة ائتمانية</span>
              <span class="pay-unavailable">غير متاح حالياً</span>
            </div>
            <div class="pay-disabled-body">سيتم تفعيله قريباً</div>
          </div>

          <!-- Bank Transfer (active) -->
          <div class="bank-section">
            <div class="bank-header">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#ffb07a"><path d="M4 10v7h3v-7H4zm6 0v7h3v-7h-3zM2 22h19v-3H2v3zm14-12v7h3v-7h-3zM11.5 1L2 6v2h19V6l-9.5-5z"/></svg>
              تحويل بنكي
            </div>
            <div class="bank-body">
              <div class="bank-qr">
                <img src="/bank-qr.png" alt="QR للتحويل" onerror="this.style.display='none'"/>
                <p>امسح QR للتحويل السريع</p>
              </div>

              <div class="bank-row">
                <span class="bank-label">اسم المستفيد</span>
                <span class="bank-value">عائشه عبدالرحمن احمد حامظي</span>
              </div>
              <div class="bank-row">
                <span class="bank-label">رقم الحساب</span>
                <div style="display:flex;align-items:center;gap:8px;">
                  <span class="bank-value" id="bv-acc">20200001006086127306</span>
                  <button class="copy-btn" onclick="copyVal('bv-acc',this)">نسخ</button>
                </div>
              </div>
              <div class="bank-row">
                <span class="bank-label">رقم الآيبان</span>
                <div style="display:flex;align-items:center;gap:8px;">
                  <span class="bank-value" id="bv-iban">SA88 8000 0202 6080 1612 7306</span>
                  <button class="copy-btn" onclick="copyVal('bv-iban',this)">نسخ</button>
                </div>
              </div>
              <div class="bank-row">
                <span class="bank-label">كود سويفت</span>
                <div style="display:flex;align-items:center;gap:8px;">
                  <span class="bank-value" id="bv-swift">RJHISARI</span>
                  <button class="copy-btn" onclick="copyVal('bv-swift',this)">نسخ</button>
                </div>
              </div>
            </div>
          </div>

          <div class="pay-notice">
            ⚠️ بعد إتمام التحويل، اضغط على الزر أدناه وأرسل لنا صورة الإيصال عبر واتساب لتفعيل اشتراكك خلال 30 دقيقة
          </div>

          <button class="omodal-btn-primary" id="omodal-confirm">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.528 5.855L0 24l6.293-1.508A11.933 11.933 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.792 9.792 0 01-5.007-1.374l-.36-.214-3.733.894.944-3.634-.236-.374A9.768 9.768 0 012.182 12C2.182 6.575 6.575 2.182 12 2.182S21.818 6.575 21.818 12 17.425 21.818 12 21.818z"/></svg>
            تمّ التحويل — أرسل الإيصال عبر واتساب
          </button>

          <button class="omodal-back" id="omodal-back">→ رجوع لتعديل البيانات</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    return overlay;
  }

  window.copyVal = function(id, btn) {
    const val = document.getElementById(id).textContent;
    navigator.clipboard.writeText(val).then(() => {
      btn.textContent = '✓ تم';
      btn.classList.add('copied');
      setTimeout(() => { btn.textContent = 'نسخ'; btn.classList.remove('copied'); }, 2000);
    });
  };

  function isGoogleEmail(e) {
    return e && (e.toLowerCase().endsWith('@gmail.com') || e.toLowerCase().endsWith('@googlemail.com'));
  }
  function isValidEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim()); }
  function isValidPhone(p) {
    const c = p.replace(/[\s\-()]/g,'');
    return /^(\+?966|0)?5[0-9]{8}$/.test(c) || /^[0-9]{8,15}$/.test(c);
  }

  function setErr(inputId, errId, on) {
    const inp = document.getElementById(inputId);
    const err = document.getElementById(errId);
    if (!inp || !err) return;
    inp.classList.toggle('error', on);
    err.classList.toggle('visible', on);
  }

  let pendingWhatsappUrl = null;
  let collectedData = {};

  function showStep(n) {
    document.getElementById('omodal-step1').style.display = n === 1 ? 'block' : 'none';
    document.getElementById('omodal-step2').style.display = n === 2 ? 'block' : 'none';
  }

  function openModal(url) {
    pendingWhatsappUrl = url;
    const overlay = document.getElementById('omodal-overlay');
    overlay.classList.add('active');
    ['omodal-email','omodal-alt-email','omodal-phone'].forEach(id => {
      const el = document.getElementById(id);
      if (el) { el.value = ''; el.classList.remove('error'); }
    });
    ['omodal-email-err','omodal-alt-email-err','omodal-phone-err'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.remove('visible');
    });
    showStep(1);
    setTimeout(() => document.getElementById('omodal-email').focus(), 100);
  }

  function closeModal() {
    document.getElementById('omodal-overlay').classList.remove('active');
    pendingWhatsappUrl = null;
    collectedData = {};
  }

  function handleNext() {
    const email    = document.getElementById('omodal-email').value.trim();
    const altEmail = document.getElementById('omodal-alt-email').value.trim();
    const phone    = document.getElementById('omodal-phone').value.trim();
    let valid = true;

    if (!isGoogleEmail(email))  { setErr('omodal-email','omodal-email-err',true); valid=false; }
    else                         { setErr('omodal-email','omodal-email-err',false); }

    if (altEmail && !isValidEmail(altEmail)) { setErr('omodal-alt-email','omodal-alt-email-err',true); valid=false; }
    else                                      { setErr('omodal-alt-email','omodal-alt-email-err',false); }

    if (!isValidPhone(phone))   { setErr('omodal-phone','omodal-phone-err',true); valid=false; }
    else                         { setErr('omodal-phone','omodal-phone-err',false); }

    if (!valid) return;
    collectedData = { email, altEmail, phone };
    showStep(2);
  }

  function handleConfirm() {
    const { email, altEmail, phone } = collectedData;

    fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, alt_email: altEmail || null, phone, product: 'يوتيوب بريميوم' })
    }).catch(() => {});

    let url = pendingWhatsappUrl || `https://wa.me/966500708427?text=${encodeURIComponent('طلب اشتراك يوتيوب بريميوم')}`;
    const existingText = decodeURIComponent(url.split('?text=')[1] || '');
    let extra = `\n\n📧 البريد الإلكتروني: ${email}`;
    if (altEmail) extra += `\n📧 البريد الاحتياطي: ${altEmail}`;
    extra += `\n📱 رقم الجوال: ${phone}`;
    extra += `\n\n💳 تم إرسال الإيصال`;

    const base = url.split('?text=')[0];
    const finalUrl = `${base}?text=${encodeURIComponent(existingText + extra)}`;
    closeModal();
    window.open(finalUrl, '_blank');
  }

  function interceptButtons() {
    document.addEventListener('click', function (e) {
      const target = e.target.closest('a, button');
      if (!target) return;
      const href = target.getAttribute('href') || '';
      if (href.includes('wa.me') || href.includes('whatsapp')) {
        e.preventDefault(); e.stopPropagation();
        openModal(href); return;
      }
      const text = (target.innerText || target.textContent || '').trim();
      const isOrder = text.includes('اشتر') || text.includes('ادفع') || text.includes('اطلب') ||
                      text.includes('اشترك') || target.classList.contains('whatsapp-cta') ||
                      target.closest('.whatsapp-cta');
      if (isOrder) { e.preventDefault(); e.stopPropagation(); openModal(null); }
    }, true);
  }

  function init() {
    injectStyles();
    buildModal();
    interceptButtons();

    document.addEventListener('click', e => { if (e.target.id === 'omodal-overlay') closeModal(); });
    document.getElementById('omodal-close').addEventListener('click', closeModal);
    document.getElementById('omodal-next').addEventListener('click', handleNext);
    document.getElementById('omodal-confirm').addEventListener('click', handleConfirm);
    document.getElementById('omodal-back').addEventListener('click', () => showStep(1));

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeModal();
    });

    ['omodal-email','omodal-alt-email','omodal-phone'].forEach(id => {
      document.getElementById(id).addEventListener('input', function() {
        this.classList.remove('error');
        document.getElementById(id + '-err')?.classList.remove('visible');
      });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
