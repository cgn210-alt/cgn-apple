// 주문 내역 (관리자 전용) — 앱(index.html)의 '주문 내역' 탭과 관리자 페이지(admin.html)가 함께 씁니다.
// 주문은 Firebase apple/orders 에 있고, 마스터와 부관리자만 읽을 수 있습니다(database.rules.json).
// 사용법: OrderBoard.mount({ db: firebase.database(), el: 상자요소, content: function(){ return 앱내용; }, email: function(){ return 로그인메일; } })
var OrderBoard = (function () {
  var o_ = { db: null, el: null, content: null, email: null };
  var orders = [], filter = "all", ref = null;

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function arr(v) { return Array.isArray(v) ? v : (v && typeof v === "object" ? Object.keys(v).map(function (k) { return v[k]; }) : []); }
  function won(n) { return (+n || 0).toLocaleString("ko-KR") + "원"; }
  function dt(t) { return t ? new Date(t).toLocaleString("ko-KR", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" }) : ""; }
  function digits(s) { return String(s || "").replace(/[^0-9]/g, ""); }
  function q(sel) { return o_.el.querySelector(sel); }
  function itemText(o) { return arr(o.items).map(function (x) { return x.name + " " + (x.kg || "") + " × " + x.qty; }).join(", "); }

  function noticeText(o) {
    var C = (o_.content && o_.content()) || {}, c = C.contact || {}, h = C.hero || {};
    var title = [h.titleA, h.titleB, h.titleC].filter(Boolean).join(" ") || "철하네 사과";
    return "[" + title + "]\n" + o.name + "님, 주문하신 사과 대금 " + won(o.total) + " 입금이 확인되었습니다.\n" +
      "주문하신 사과(" + itemText(o) + ") 배송을 시작했습니다.\n주문해 주셔서 감사합니다.\n- " + (c.name || "") + (c.team ? " (" + c.team + ")" : "");
  }
  function smsHref(o) {
    var ios = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    return "sms:" + digits(o.phone) + (ios ? "&" : "?") + "body=" + encodeURIComponent(noticeText(o));
  }

  function mount(opts) {
    stop();
    o_ = opts;
    o_.el.innerHTML =
      '<div class="ob-head"><span class="ob-live">실시간</span><button type="button" class="ob-btn" data-act="csv">엑셀(CSV) 내려받기</button></div>' +
      '<div class="ob-stats"></div><table class="ob-items"></table>' +
      '<div class="ob-tabs"><button type="button" class="ob-btn on" data-f="all">전체</button><button type="button" class="ob-btn" data-f="new">입금 대기</button><button type="button" class="ob-btn" data-f="paid">입금 확인</button></div>' +
      '<div class="ob-msg">주문을 불러오는 중...</div><div class="ob-list"></div>';
    o_.el.onclick = onClick;
    ref = o_.db.ref("apple/orders").orderByChild("createdAt");
    ref.on("value", function (snap) {
      orders = [];
      snap.forEach(function (c) { var o = c.val(); o.id = c.key; orders.push(o); });
      orders.forEach(function (o, i) { o.no = i + 1; });
      render();
    }, function (e) { q(".ob-msg").textContent = "주문을 불러오지 못했습니다: " + e.message; q(".ob-msg").className = "ob-msg err"; });
  }
  function stop() { if (ref) { ref.off(); ref = null; } orders = []; }

  function render() {
    if (!o_.el || !q(".ob-list")) return;
    var wait = orders.filter(function (o) { return o.status !== "paid"; }), paid = orders.filter(function (o) { return o.status === "paid"; });
    var sum = function (l) { return l.reduce(function (a, o) { return a + (+o.total || 0); }, 0); };
    q(".ob-stats").innerHTML =
      '<div class="ob-stat"><div class="n">' + orders.length + '건</div><div class="w">전체 ' + won(sum(orders)) + '</div></div>' +
      '<div class="ob-stat wait"><div class="n">' + wait.length + '건</div><div class="w">입금 대기 ' + won(sum(wait)) + '</div></div>' +
      '<div class="ob-stat paid"><div class="n">' + paid.length + '건</div><div class="w">입금 확인 ' + won(sum(paid)) + '</div></div>';
    var m = {}, keys = [];
    orders.forEach(function (o) {
      arr(o.items).forEach(function (x) {
        var k = x.name + " " + (x.kg || "");
        if (!m[k]) { m[k] = { all: 0, paid: 0 }; keys.push(k); }
        m[k].all += +x.qty || 0; if (o.status === "paid") m[k].paid += +x.qty || 0;
      });
    });
    q(".ob-items").innerHTML = keys.length ? "<tr><th>상품별 상자 수</th><th>전체</th><th>입금 확인</th></tr>" + keys.map(function (k) {
      return "<tr><td>" + esc(k) + "</td><td>" + m[k].all + "상자</td><td>" + m[k].paid + "상자</td></tr>";
    }).join("") : "";
    var list = orders.filter(function (o) { return filter === "all" || (filter === "paid") === (o.status === "paid"); }).reverse();
    q(".ob-msg").textContent = orders.length ? "" : "아직 들어온 주문이 없습니다."; q(".ob-msg").className = "ob-msg";
    q(".ob-list").innerHTML = list.map(function (o) {
      var p = o.status === "paid", id = esc(o.id);
      var recv = o.recvName || o.recvPhone ? esc(o.recvName || o.name) + (o.recvPhone ? " · " + esc(o.recvPhone) : "") : "주문하신 분과 같음";
      return '<div class="ob-order' + (p ? " paid" : "") + '">' +
        '<div class="oh"><b>' + o.no + '. ' + esc(o.name) + '</b><span class="ob-badge">' + (p ? "입금 확인·배송 시작" : "입금 대기") + '</span><span class="t">' + dt(o.createdAt) + '</span></div>' +
        '<div class="od">' +
          '<div><span class="k">주문</span>' + esc(itemText(o)) + ' · <b>' + won(o.total) + '</b></div>' +
          '<div><span class="k">연락처</span><a href="tel:' + digits(o.phone) + '">' + esc(o.phone) + '</a> · 입금자명 ' + esc(o.payer || o.name) + '</div>' +
          '<div><span class="k">받는 분</span>' + recv + '</div>' +
          '<div><span class="k">주소</span>' + esc(o.address) + '</div>' +
          (o.memo ? '<div><span class="k">요청</span>' + esc(o.memo) + '</div>' : '') +
          (p ? '<div class="t">' + dt(o.paidAt) + ' 입금 확인' + (o.paidBy ? ' (' + esc(o.paidBy) + ')' : '') + '</div>' : '') +
        '</div>' +
        '<div class="ob-tools">' +
          (p ? '<a class="ob-btn" href="' + esc(smsHref(o)) + '" data-act="resend" data-id="' + id + '">안내 문자 다시 보내기</a>' +
               '<button type="button" class="ob-btn" data-act="copy" data-id="' + id + '">카톡용 문구 복사</button>' +
               '<button type="button" class="ob-btn" data-act="unpay" data-id="' + id + '">입금 대기로 되돌리기</button>'
             : '<a class="ob-btn pri" href="' + esc(smsHref(o)) + '" data-act="pay" data-id="' + id + '">입금 확인·문자 보내기</a>' +
               '<button type="button" class="ob-btn" data-act="copy" data-id="' + id + '">카톡용 문구 복사</button>') +
          '<button type="button" class="ob-btn del" data-act="del" data-id="' + id + '">삭제</button>' +
        '</div></div>';
    }).join("");
  }

  function find(id) { return orders.filter(function (o) { return o.id === id; })[0]; }
  function fail(e) { alert("반영하지 못했습니다: " + e.message); }
  function now() { return firebase.database.ServerValue.TIMESTAMP; }

  function onClick(e) {
    var b = e.target.closest("[data-f],[data-act]"); if (!b) return;
    if (b.dataset.f) {
      filter = b.dataset.f;
      [].forEach.call(q(".ob-tabs").children, function (x) { x.classList.toggle("on", x === b); });
      render(); return;
    }
    var act = b.dataset.act, o = find(b.dataset.id), r = o && o_.db.ref("apple/orders/" + o.id);
    if (act === "csv") return csv();
    if (!o) return;
    if (act === "pay") {
      // 링크(sms:)는 그대로 열리게 두고, 확인을 취소하면 막음
      if (!confirm(o.name + "님 " + won(o.total) + " 입금을 확인했나요?\n확인을 누르면 배송 시작으로 표시하고 문자 앱을 엽니다.")) { e.preventDefault(); return; }
      r.update({ status: "paid", paidAt: now(), paidBy: (o_.email && o_.email()) || "", notifiedAt: now() }).catch(fail);
    } else if (act === "resend") {
      r.update({ notifiedAt: now() }).catch(fail);
    } else if (act === "unpay") {
      if (confirm(o.name + "님 주문을 입금 대기로 되돌릴까요?")) r.update({ status: "new", paidAt: null, paidBy: null, notifiedAt: null }).catch(fail);
    } else if (act === "del") {
      if (confirm(o.no + ". " + o.name + "님 주문을 삭제할까요? 되돌릴 수 없습니다.")) r.remove().catch(fail);
    } else if (act === "copy") {
      var t = noticeText(o);
      if (navigator.clipboard) navigator.clipboard.writeText(t).then(function () { alert("안내 문구를 복사했습니다. 카카오톡 대화창에 붙여 넣으세요."); }, function () { prompt("아래 문구를 복사하세요", t); });
      else prompt("아래 문구를 복사하세요", t);
    }
  }

  function csv() {
    var qq = function (v) { return '"' + String(v == null ? "" : v).replace(/"/g, '""') + '"'; };
    var rows = [["번호", "주문일시", "상태", "주문자", "연락처", "입금자명", "받는 분", "받는 분 연락처", "주소", "주문 내용", "합계", "요청 사항", "입금 확인일시"]];
    orders.forEach(function (o) {
      rows.push([o.no, dt(o.createdAt), o.status === "paid" ? "입금 확인" : "입금 대기", o.name, o.phone, o.payer || o.name,
        o.recvName || o.name, o.recvPhone || o.phone, o.address, itemText(o), o.total, o.memo, dt(o.paidAt)]);
    });
    var blob = new Blob(["﻿" + rows.map(function (r) { return r.map(qq).join(","); }).join("\r\n")], { type: "text/csv;charset=utf-8" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = "사과주문_" + new Date().toISOString().slice(0, 10) + ".csv";
    document.body.appendChild(a); a.click(); a.remove();
  }

  return { mount: mount, stop: stop, render: render };
})();
