// 购买完成后 Dodo 会把许可证密钥以 ?license_key=… 拼到跳转地址上。
// 这里只在本机读出并显示，随即从地址栏与浏览历史里抹掉，避免密钥留在历史记录或被分享出去；不向任何地方发送。
(function () {
  "use strict";
  var params = new URLSearchParams(window.location.search);
  var key = params.get("license_key");
  if (!key) return;

  if (window.history && window.history.replaceState) {
    window.history.replaceState(null, "", window.location.pathname);
  }

  var box = document.getElementById("license");
  var code = document.getElementById("license-key");
  var button = document.getElementById("license-copy");
  if (!box || !code || !button) return;

  // textContent 而不是 innerHTML：地址参数是外部输入，不能当 HTML 解析。
  code.textContent = key;
  box.hidden = false;

  var copiedLabel = button.getAttribute("data-copied") || "Copied";
  var defaultLabel = button.textContent;
  button.addEventListener("click", function () {
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(key).then(function () {
      button.textContent = copiedLabel;
      window.setTimeout(function () { button.textContent = defaultLabel; }, 2000);
    });
  });
})();
