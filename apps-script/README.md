# Google Apps Script 網站諮詢寄信

收件人固定為 veraclooney0203@gmail.com。Code.gs 使用 MailApp，不讀取信箱郵件。每天最多嘗試寄送 30 封，相同內容十分鐘內不重複寄送；此為基本防護，非 CAPTCHA。

## 部署
1. 在 Google Apps Script 建立專案，貼入 Code.gs。
2. 部署 → 新增部署作業 → 網頁應用程式。
3. 執行身分：我；誰可以存取：所有人。
4. 由帳號擁有者確認並授予寄信權限。
5. 複製以 /exec 結尾的網頁應用程式網址。
6. 以正式 /exec 網址替換 contact.template.html 中的 GOOGLE_APPS_SCRIPT_EXEC_URL，再用內容更新根目錄 contact.html。

## 驗證
原生 POST 表單直接進入 Google 結果頁，不採用無法確認結果的 no-cors fetch。寄信 API 執行成功後才顯示已交由 Google 寄送；該訊息不保證信箱實際收件。
發布後須實際送出及由擁有者確認 Gmail 收信。未完成 Google 授權前，不應將範本替換至正式聯絡頁。

## 更新
修改程式後須透過「管理部署作業」發布新版本，才能保留相同 /exec 網址並更新程式。
