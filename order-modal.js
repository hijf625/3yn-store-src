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
              <span style="display:flex;align-items:center;gap:8px;">
                <svg height="22" viewBox="0 0 165.521 105.965" xmlns="http://www.w3.org/2000/svg"><path d="M150.698 0H14.823C6.634 0 0 6.634 0 14.823v76.319c0 8.189 6.634 14.823 14.823 14.823h135.875c8.189 0 14.823-6.634 14.823-14.823V14.823C165.521 6.634 158.887 0 150.698 0z" fill="#000"/><path d="M43.439 32.454c1.389-1.747 2.326-4.12 2.073-6.534-2.006.085-4.45 1.348-5.882 3.094-1.285 1.474-2.43 3.887-2.135 6.176 2.262.17 4.534-1.136 5.944-2.736zM45.49 35.863c-3.282-.2-6.073 1.864-7.634 1.864-1.582 0-3.993-1.765-6.612-1.718-3.407.047-6.559 1.98-8.303 5.043-3.566 6.146-935 17.709-.512 24.978 2.373 3.461 5.224 7.318 8.944 7.178 3.527-.139 4.912-2.303 9.196-2.303 4.283 0 5.522 2.303 9.243 2.233 3.861-.07 6.294-3.461 8.667-6.921 2.697-3.929 3.805-7.734 3.874-7.933-.07-.023-7.43-2.874-7.501-11.384-.07-7.104 5.8-10.518 6.063-10.704-3.329-4.905-8.503-5.45-10.325-5.333zM75.889 28.765c9.383 0 15.912 6.459 15.912 15.867 0 9.443-6.669 15.937-16.157 15.937h-10.39v16.508H58.2V28.765zm-10.635 26.18h8.621c6.529 0 10.25-3.513 10.25-9.278 0-5.765-3.721-9.243-10.215-9.243h-8.656zM94.936 67.625c0-5.834 4.468-9.418 12.388-9.872l9.13-.561v-2.573c0-3.686-2.502-5.799-6.669-5.799-3.94 0-6.389 1.876-6.983 4.762h-6.634c.385-6.144 5.659-10.681 13.861-10.681 8.132 0 13.336 4.327 13.336 11.139v23.037h-6.319v-5.519h-.14c-1.876 3.304-5.974 5.449-10.215 5.449-6.354 0-10.755-3.932-10.755-9.382zm21.518-2.818v-2.643l-8.202.526c-4.097.28-6.389 2.083-6.389 4.937 0 2.923 2.362 4.796 5.974 4.796 4.713 0 8.617-3.234 8.617-7.616zM126.778 88.418v-5.239c.49.14 1.596.14 2.152.14 3.059 0 4.713-1.296 5.729-4.607 0-.07.596-2.013.596-2.048l-12.073-33.467h7.108l8.482 27.354h.14l8.482-27.354h6.914l-12.493 35.165c-2.852 8.062-6.144 10.669-13.056 10.669-.561 0-1.526-.07-1.981-.613z" fill="#fff"/></svg>
                Apple Pay
              </span>
              <span class="pay-unavailable">غير متاح حالياً</span>
            </div>
            <div class="pay-disabled-body">سيتم تفعيله قريباً</div>
          </div>

          <!-- Visa / Credit Card (disabled) -->
          <div class="pay-section">
            <div class="pay-section-header">
              <span style="display:flex;align-items:center;gap:8px;">
                <svg xmlns="http://www.w3.org/2000/svg" width="50" height="16" viewBox="0 0 750 471"><path d="M278.197 314.72l33.929-195.5h54.286L332.4 314.72h-54.203zM524.307 124.001c-10.751-3.999-27.633-8.28-48.727-8.28-53.727 0-91.586 26.641-91.866 64.8-.281 28.2 27.063 43.921 47.727 53.302 21.212 9.6 28.322 15.721 28.213 24.28-.14 13.12-16.933 19.121-32.587 19.121-21.787 0-33.347-2.96-51.24-10.24l-7.013-3.121-7.626 43.88c12.693 5.44 36.147 10.16 60.547 10.4 57.146 0 94.206-26.32 94.626-67.12.2-22.36-14.28-39.36-45.6-53.36-18.987-9.08-30.627-15.12-30.507-24.28 0-8.12 9.853-16.8 31.147-16.8 17.747-.28 30.627 3.52 40.614 7.48l4.866 2.24 7.427-42.301zM661.494 119.22h-42.001c-13.013 0-22.734 3.48-28.427 16.24l-80.668 179.3h57.04s9.333-24.08 11.44-29.36c6.24 0 61.627.08 69.534.08 1.626 7 6.56 29.28 6.56 29.28h50.427l-43.905-195.54zm-66.88 126.04c4.48-11.24 21.6-54.48 21.6-54.48-.32.52 4.453-11.32 7.187-18.64l3.666 16.84s10.373 46.48 12.546 56.28h-45.0zM232.627 119.22l-53.24 133.28-5.68-27.12c-9.906-31.36-40.8-65.36-75.36-82.36l48.72 171.6.054.058h57.373L281 119.22h-48.373z" fill="#fff"/><path d="M131.107 119.22H45.974l-.64 3.84c66.293 15.76 110.174 53.84 128.427 99.6l-18.533-87.36c-3.2-12.52-12.507-15.76-24.121-16.08z" fill="#F9A533"/></svg>
                Visa / Credit Card
              </span>
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
