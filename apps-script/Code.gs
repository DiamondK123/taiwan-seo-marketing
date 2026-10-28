/** 台灣網路行銷推薦：以擁有者身分執行、開放所有人的網頁應用程式。 */
const RECIPIENT = 'veraclooney0203@gmail.com';
const CONTACT_URL = 'https://diamondk123.github.io/taiwan-seo-marketing/contact.html';
const DAILY_LIMIT = 30;

function doGet() {
  return resultPage_('聯絡服務已就緒', '請從網站聯絡頁填寫並送出需求。');
}

function doPost(e) {
  const p = (e && e.parameter) || {};
  const value = key => String(p[key] || '').trim();
  const name = value('name'), email = value('email'), phone = value('phone');
  const service = value('service'), message = value('message');
  if (value('_honey')) return resultPage_('無法送出', '請返回聯絡頁重新填寫。');
  if (!name || name.length > 80 || !message || message.length > 5000 ||
      email.length > 254 || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email) ||
      phone.length > 40 || service.length > 80 ||
      value('consent') !== '同意就本次詢問聯繫') {
    return resultPage_('資料尚未完整', '請確認稱呼、電子郵件、需求說明及同意欄位，再重新送出。');
  }
  // 僅可寄至固定信箱；不提供任意收件人或自動回信功能。
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) return resultPage_('目前較忙碌', '請稍後再試，或直接來電 0988-665-685。');
  try {
    const props = PropertiesService.getScriptProperties();
    const day = Utilities.formatDate(new Date(), 'Asia/Taipei', 'yyyy-MM-dd');
    const count = props.getProperty('mailDay') === day ? Number(props.getProperty('mailCount') || 0) : 0;
    if (count >= DAILY_LIMIT || MailApp.getRemainingDailyQuota() < 1) {
      return resultPage_('暫時無法寄送', '今日寄信服務額度已用完，請改用電話或 LINE 聯絡。');
    }
    const fingerprint = Utilities.base64EncodeWebSafe(Utilities.computeDigest(
      Utilities.DigestAlgorithm.SHA_256, JSON.stringify([name, email, phone, service, message])));
    const cache = CacheService.getScriptCache();
    if (cache.get(fingerprint)) return resultPage_('此內容已送出', '十分鐘內的相同內容已交由 Google 寄送，無需重複提交。');
    // 先計數，失敗亦保留次數，避免重複失敗耗用服務額度。
    props.setProperties({mailDay: day, mailCount: String(count + 1)});
    MailApp.sendEmail({
      to: RECIPIENT,
      replyTo: email,
      name: '台灣網路行銷推薦',
      subject: '台灣網路行銷推薦｜網站諮詢',
      body: ['網站諮詢', '時間：' + Utilities.formatDate(new Date(), 'Asia/Taipei', 'yyyy-MM-dd HH:mm:ss'),
        '稱呼：' + name, '電子郵件：' + email, '電話：' + (phone || '未提供'),
        '服務：' + service, '', '需求說明：', message, '', '來源：' + CONTACT_URL].join('\n')
    });
    cache.put(fingerprint, 'sent', 600);
    return resultPage_('已交由 Google 寄送', '您的諮詢已交由寄信服務處理。此畫面不代表收件人已閱讀；如有急需，歡迎直接來電或透過 LINE 聯絡。');
  } catch (error) {
    console.error('Contact mail failed');
    return resultPage_('寄送未完成', '請稍後再試，或直接寄信至 ' + RECIPIENT + '。');
  } finally {
    lock.releaseLock();
  }
}

function resultPage_(title, message) {
  const escape = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  return HtmlService.createHtmlOutput('<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width,initial-scale=1"><title>' + escape(title) + '</title>' +
    '<style>body{font-family:system-ui,sans-serif;background:#111f30;color:#fff;margin:0;padding:60px 24px;line-height:1.9}' +
    'main{max-width:620px;margin:auto}h1{color:#c5f36b}a{display:inline-block;color:#c5f36b;margin:12px 20px 0 0}</style></head>' +
    '<body><main><p>台灣網路行銷推薦</p><h1>' + escape(title) + '</h1><p>' + escape(message) + '</p>' +
    '<a target="_top" href="' + CONTACT_URL + '">返回聯絡頁</a><a href="tel:+886988665685">立即撥號</a>' +
    '<a target="_top" href="https://line.me/ti/p/~va1018">LINE 聯絡</a></main></body></html>');
}
