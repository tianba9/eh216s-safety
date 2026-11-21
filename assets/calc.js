/* 互动测算：纯函数 + 显式常量 + 中英文提示，无外部依赖 */
(function () {
  'use strict';

  function f1(x) { return (Math.round(x * 10) / 10).toFixed(1); }
  function f0(x) { return String(Math.round(x)); }
  function isEn() { return document.documentElement.lang === 'en'; }

  /* 1 补能时间 → 单座成本 */
  var CHG = { fly: 25, turn: 10, window: 480, days: 300, fixed: 972000, kwhCost: 32 };

  function chargeModel(t) {
    var cycle = CHG.fly + t + CHG.turn;
    var sorties = Math.max(1, Math.floor(CHG.window / cycle));
    var annual = sorties * CHG.days;
    var total = CHG.fixed + CHG.kwhCost * annual;
    return { cycle: cycle, sorties: sorties, annual: annual, perSeat: total / (annual * 2) };
  }

  function chargeNote(m) {
    if (isEn()) {
      if (m.perSeat <= 300) return 'Cost per seat is <em>below RMB 300</em>; even low-fare operations can be profitable.';
      if (m.perSeat <= 450) return 'Cost per seat is <em>close to the RMB 400 fare</em>, near break-even; profit depends on load factor.';
      if (m.perSeat <= 560) return 'Cost per seat is <em>slightly above the RMB 400 fare</em>; operations cannot self-fund and rely on aircraft sales margin.';
      return 'Cost per seat is <em>well above the fare range</em>; this recharge strategy is not operationally sustainable.';
    }
    if (m.perSeat <= 300) return '单座成本 <em>低于 300 元</em>，即使按低价票价运营仍具备盈利空间。';
    if (m.perSeat <= 450) return '单座成本与 400 元级票价<em>基本持平</em>，接近盈亏平衡，利润依赖上座率。';
    if (m.perSeat <= 560) return '单座成本<em>略高于 400 元票价</em>，运营端难以自负盈亏，需靠整机销售毛利支撑。';
    return '单座成本<em>显著高于票价区间</em>，该补能方案下运营本身不可持续。';
  }

  /* 2 失效旋翼数 → 推力余量 */
  var ROT = { mtow: 620, g: 9.81, num: 16, maxEach: 500 };

  function rotorModel(k) {
    var need = ROT.mtow * ROT.g;
    var rem = ROT.num - k;
    var total = rem * ROT.maxEach;
    return { rem: rem, need: need, total: total, margin: (total - need) / need * 100 };
  }

  function rotorNote(m) {
    if (isEn()) {
      if (m.margin <= 0) return 'Remaining thrust is <em>below hover demand</em>; altitude cannot be held and an immediate landing is required.';
      if (m.margin <= 15) return 'Hover is possible with <em>very little attitude margin</em>; divert and land rather than continue the mission.';
      return 'Thrust margin is sufficient for controlled flight and a <em>degraded return</em>.';
    }
    if (m.margin <= 0) return '剩余推力<em>低于悬停需求</em>，无法维持高度，只能立即着陆。';
    if (m.margin <= 15) return '可维持悬停但<em>姿态裕度极低</em>，应进入就近迫降程序，不得继续执行任务。';
    return '推力余量充足，可维持可控飞行并执行<em>降级返场</em>。';
  }

  /* 3 电池比能量 → 航时与航程 */
  var BAT = { pack: 200, baseKwh: 40.8, baseMin: 25, baseKm: 30 };

  function energyModel(e) {
    var kwh = BAT.pack * e / 1000;
    var ratio = kwh / BAT.baseKwh;
    return { kwh: kwh, min: BAT.baseMin * ratio, km: BAT.baseKm * ratio };
  }

  function energyNote(m) {
    if (isEn()) {
      if (m.min < 35) return 'Endurance is still insufficient for cross-area shuttle; the market remains <em>scenic loops and short tours</em>.';
      if (m.min < 50) return 'Endurance now covers <em>short island and mountain shuttles</em>; the scene shifts from experience toward transport.';
      return 'Endurance reaches the <em>intercity shuttle</em> range; the 30 km constraint is materially lifted.';
    }
    if (m.min < 35) return '航时仍不足以支撑跨区接驳，市场边界停留在<em>景区环线与短途游览</em>。';
    if (m.min < 50) return '航时已可覆盖<em>海岛与山区短途接驳</em>，场景从体验向交通迁移。';
    return '航时进入<em>城际接驳</em>量级，30 公里的场景约束被实质性解除。';
  }

  function suffixCharge(m) {
    return isEn()
      ? ' (Cycle ' + f0(m.cycle) + ' min; ' + f0(m.sorties) + ' sorties per day after rounding down)'
      : '（单循环 ' + f0(m.cycle) + ' min，日架次取整后为 ' + f0(m.sorties) + ' 班）';
  }
  function suffixRotor(m) {
    return isEn() ? ' (Hover demand ' + f0(m.need) + ' N)' : '（悬停需求 ' + f0(m.need) + ' N）';
  }

  /* 绑定 1 */
  (function () {
    var box = document.getElementById('calc-charge');
    if (!box) return;
    var input = document.getElementById('chg-in');
    var out = document.getElementById('chg-v');
    var noteEl = document.getElementById('chg-note');
    var sEl = document.getElementById('chg-sorties');
    var yEl = document.getElementById('chg-year');
    var pEl = document.getElementById('chg-seat');
    function update() {
      var t = parseFloat(input.value);
      var m = chargeModel(t);
      out.textContent = t + ' min';
      sEl.textContent = f0(m.sorties);
      yEl.textContent = f0(m.annual);
      pEl.textContent = f0(m.perSeat);
      noteEl.innerHTML = chargeNote(m) + suffixCharge(m);
    }
    input.addEventListener('input', update);
    update();
  })();

  /* 绑定 2 */
  (function () {
    var box = document.getElementById('calc-rotor');
    if (!box) return;
    var input = document.getElementById('rot-in');
    var out = document.getElementById('rot-v');
    var noteEl = document.getElementById('rot-note');
    var rEl = document.getElementById('rot-rem');
    var tEl = document.getElementById('rot-total');
    var mEl = document.getElementById('rot-margin');
    function update() {
      var k = parseFloat(input.value);
      var m = rotorModel(k);
      out.textContent = isEn() ? (k === 0 ? 'Healthy' : k + ' failed') : (k === 0 ? '完好' : '失效 ' + k + ' 副');
      rEl.textContent = f0(m.rem);
      tEl.textContent = f0(m.total);
      mEl.textContent = (m.margin > 0 ? '+' : '') + f1(m.margin) + '%';
      noteEl.innerHTML = rotorNote(m) + suffixRotor(m);
    }
    input.addEventListener('input', update);
    update();
  })();

  /* 绑定 3 */
  (function () {
    var box = document.getElementById('calc-energy');
    if (!box) return;
    var input = document.getElementById('e-in');
    var out = document.getElementById('e-v');
    var noteEl = document.getElementById('e-note');
    var kEl = document.getElementById('e-kwh');
    var mEl = document.getElementById('e-min');
    var dEl = document.getElementById('e-km');
    function update() {
      var e = parseFloat(input.value);
      var m = energyModel(e);
      out.textContent = e + ' Wh/kg';
      kEl.textContent = f1(m.kwh);
      mEl.textContent = f1(m.min);
      dEl.textContent = f1(m.km);
      noteEl.innerHTML = energyNote(m);
    }
    input.addEventListener('input', update);
    update();
  })();
})();
