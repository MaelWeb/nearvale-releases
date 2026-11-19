// 付款完成后 Dodo 会跳回本页，并在网址上附带 status、license_key（可能多把，逗号分隔）、email、payment_id 等参数。
// 这里只在本机读取并展示，随即把整个查询串从地址栏与浏览历史里抹掉，避免密钥与邮箱留在历史记录或被分享出去；不向任何地方发送。
// 本页只是展示，不代表付款成功：真正的凭据是邮件里的密钥，应用激活时由 Dodo 校验。
(function () {
  "use strict";
  var params = new URLSearchParams(window.location.search);
  if (window.location.search && window.history && window.history.replaceState) {
    window.history.replaceState(null, "", window.location.pathname);
  }

  function show(id, visible) {
    var el = document.getElementById(id);
    if (el) el.hidden = !visible;
  }

  // 失败与过期：不显示「感谢购买」，以免让人以为已经买到了。
  var status = (params.get("status") || "").toLowerCase();
  if (status === "failed" || status === "expired" || status === "cancelled") {
    show("thanks-success", false);
    show("payment-failed", true);
    return;
  }
  if (status === "processing" || status.indexOf("requires_") === 0) {
    show("payment-pending", true);
  }

  var keys = (params.get("license_key") || "")
    .split(",")
    .map(function (k) { return k.trim(); })
    .filter(function (k) { return k.length > 0; });
  if (keys.length === 0) return;

  var box = document.getElementById("license");
  var code = document.getElementById("license-key");
  var button = document.getElementById("license-copy");
  if (!box || !code || !button) return;

  // textContent 而不是 innerHTML：地址参数是外部输入，不能当 HTML 解析。
  var text = keys.join("\n");
  code.textContent = text;
  box.hidden = false;

  var copiedLabel = button.getAttribute("data-copied") || "Copied";
  var defaultLabel = button.textContent;
  button.addEventListener("click", function () {
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(text).then(function () {
      button.textContent = copiedLabel;
      window.setTimeout(function () { button.textContent = defaultLabel; }, 2000);
    });
  });
})();
