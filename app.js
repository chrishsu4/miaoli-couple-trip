const days=[
 {label:'DAY 1',date:'10/9 週五',theme:'草帽文化與古厝之旅',note:'海線慢遊 · 日落散步',stops:[
  ['05:30','集合接人與北上','林邊搭火車，善化會合後開車；經草屯、員林接齊旅伴直奔苗栗。','善化火車站',['交通']],
  ['10:30','苑裡草帽街 & 藺草文化館','逛天下路百年草帽店、藺草文化館與彩繪稻田觀景台。','苑裡藺草文化館',['散步','文化']],
  ['12:30','原豆粹食｜午餐','日式質感豆漿蔬食小館，推薦煎餃、咖哩與豆花。','原豆粹食',['素食友善','餐飲']],
  ['14:30','東里家風 或 心雕居','百年閩南紅磚古厝，或到海邊秘境體驗木雕與下午茶。','東里家風',['二選一','人文']],
  ['17:00','苑港漁港 / 出水沙灘','沿著海線散步，等待西岸的金色夕陽。','苑港漁港',['日落','海景']],
  ['18:30','晚餐與垂坤採買','採買休閒零嘴並在苑裡或後龍享用在地晚餐。','垂坤食品旗艦店',['伴手禮']],
  ['20:30','入住簡單窩窩民宿','辦理入住，結束長途移動，好好休息。','簡單窩窩民宿 苗栗',['住宿']]
 ]},
 {label:'DAY 2',date:'10/10 週六',theme:'信仰參拜與海景風車',note:'媽祖信仰 · 海天一線',stops:[
  ['08:30','白沙屯拱天宮 & 山邊媽祖宮','參拜雙媽祖、漫步拱天宮老街；連假建議提早停車。','白沙屯拱天宮',['信仰','素食小吃']],
  ['11:00','後龍過港隧道','走進日治時期舊鐵道隧道，七彩燈光下涼爽好拍。','後龍過港隧道',['歷史','拍照']],
  ['12:30','廟口午餐','慈雲宮廟口黑輪伯有素食高湯區，也可選通霄一心素食。','慈雲宮廟口黑輪伯',['素食友善']],
  ['14:30','崎頂子母隧道 & 觀景台','神隱少女感的雙隧道綠廊，遠眺海岸、風車與火車交會。','崎頂子母隧道',['海景','步道']],
  ['16:30','通霄神社 & 日落大道','走訪日式鳥居建築，到西濱觀景台欣賞海天一線。','通霄神社',['日落','拍照']],
  ['18:30','棗莊古藝庭園膳坊','紅棗雞湯與客家菜；素食需提前告知並安排專屬餐點。','棗莊古藝庭園膳坊',['需預訂','客家菜','素食友善']]
 ]},
 {label:'DAY 3',date:'10/11 週日',theme:'山城人文與美味蔬食',note:'茶香山城 · 慢慢回家',stops:[
  ['09:00','銅鑼茶廠 或 客家文化館','品茶看火車過山谷，或走入現代建築裡認識客家文化。','銅鑼茶廠',['二選一','文化']],
  ['11:30','禪廚蔬食餐廳','高人氣全蔬食創意客家與川味合菜，合菜需事先預訂。','禪廚蔬食餐廳',['需預訂','全蔬食']],
  ['13:30','勝興車站 / 鯉魚潭水庫','漫步三義客家山城，或前往水庫欣賞鋸齒堰。','勝興車站',['二選一','散步']],
  ['15:30','賦歸與送友','依序送朋友回員林、草屯、善化，再轉乘返家。','員林火車站',['返程']]
 ]}
];

const reminders=[
 {title:'預訂棗莊晚餐',detail:'10/10 18:30 · 告知素食人數',href:'tel:037239108',action:'撥打 037-239108'},
 {title:'預訂禪廚午餐',detail:'10/11 11:30 · 合菜需事先預訂',href:'https://www.opentable.com.tw/restaurant/profile/262994',action:'線上訂位 ↗'},
 {title:'確認民宿入住',detail:'確認房型、入住時間與停車位置',href:'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent('簡單窩窩民宿 苗栗'),action:'查看地圖 ↗'},
 {title:'準備共同公積金',detail:'5 人共 NT$ 15,000，每人 NT$ 3,000',href:'#ledger',action:'前往記帳 ↓'}
];
const mapUrl=q=>'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(q);
const travelers=['純瑄','豐勳','旅伴 A','旅伴 B','旅伴 C'];
let activeDay=0;
let expenses=JSON.parse(localStorage.getItem('miaoli-expenses')||'null')||[
 {id:1,title:'共同公積金',amount:15000,payer:'公積金',category:'入金',date:'2026-10-09'}
];
// 將舊版兩人公積金自動升級為五人版本，保留其他記帳資料。
if(localStorage.getItem('miaoli-budget-version')!=='5-person'){
 const fund=expenses.find(e=>e.category==='入金'&&e.title==='共同公積金');
 if(fund&&fund.amount===6000) fund.amount=15000;
 localStorage.setItem('miaoli-budget-version','5-person');
}
if(localStorage.getItem('miaoli-payer-version')!=='named'){
 expenses.forEach(e=>{if(e.payer==='我')e.payer='純瑄';if(e.payer==='另一半')e.payer='豐勳'});
 localStorage.setItem('miaoli-payer-version','named');
}
let checks=JSON.parse(localStorage.getItem('miaoli-reminders')||'[]');
const $=s=>document.querySelector(s); const money=n=>'NT$ '+Number(n).toLocaleString('zh-TW');

function renderTabs(){ $('.day-tabs').innerHTML=days.map((d,i)=>`<button role="tab" aria-selected="${i===activeDay}" class="${i===activeDay?'active':''}" data-day="${i}">${d.label}</button>`).join(''); }
function renderDay(){const d=days[activeDay];$('#daySummary').innerHTML=`<div><h3>${d.label} · ${d.date}</h3><p>${d.theme}</p></div><span class="weather-note">♡ ${d.note}</span>`;$('#timeline').innerHTML=d.stops.map(s=>`<article class="stop"><time>${s[0]}</time><span class="dot"></span><div class="stop-card"><div><h3>${s[1]}</h3><p>${s[2]}</p><div class="tags">${s[4].map(t=>`<span class="tag">${t}</span>`).join('')}</div></div><div class="stop-actions"><a class="icon-btn" href="${mapUrl(s[3])}" target="_blank" rel="noopener" aria-label="在 Google 地圖開啟 ${s[1]}">⌖ 地圖</a></div></div></article>`).join('');}
function renderReminders(){$('#reminderList').innerHTML=reminders.map((r,i)=>`<article class="reminder ${checks.includes(i)?'done':''}"><button class="check" data-check="${i}" aria-label="${checks.includes(i)?'標示未完成':'標示完成'}">${checks.includes(i)?'✓':''}</button><div><h3>${r.title}</h3><p>${r.detail}</p></div><a href="${r.href}" ${r.href.startsWith('http')?'target="_blank" rel="noopener"':''}>${r.action}</a></article>`).join('')}
function renderLedger(){const funds=expenses.filter(e=>e.category==='入金').reduce((a,e)=>a+e.amount,0), fundSpent=expenses.filter(e=>e.category!=='入金'&&e.payer==='公積金').reduce((a,e)=>a+e.amount,0),balance=funds-fundSpent;$('#balance').textContent=money(balance);$('#fundTotal').textContent=money(funds);$('#spentTotal').textContent=money(fundSpent);$('#budgetProgress').style.width=Math.min(100,funds?fundSpent/funds*100:0)+'%';$('#budgetHint').textContent=balance<0?`已超支 ${money(Math.abs(balance))}`:'5 人 × NT$ 3,000，建議預收 NT$ 15,000';const list=expenses.filter(e=>e.category!=='入金').sort((a,b)=>b.id-a.id);$('#transactions').innerHTML=list.length?list.map(e=>`<article class="transaction"><span class="transaction-icon">${{餐飲:'♨',交通:'↗',住宿:'⌂',門票:'◇',其他:'·'}[e.category]||'$'}</span><div><h4>${e.title}</h4><p>${e.date.replaceAll('-','.')} · ${e.payer}付款 · ${e.category}</p></div><strong>${money(e.amount)}</strong><button class="delete-expense" data-delete="${e.id}" aria-label="刪除 ${e.title}">×</button></article>`).join(''):'<div class="empty">還沒有支出，第一筆旅費等你記下。</div>';localStorage.setItem('miaoli-expenses',JSON.stringify(expenses));}
function toast(msg){const el=$('#toast');el.textContent=msg;el.classList.add('show');clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>el.classList.remove('show'),2200)}

$('.day-tabs').addEventListener('click',e=>{if(e.target.dataset.day){activeDay=+e.target.dataset.day;renderTabs();renderDay()}});
$('#reminderList').addEventListener('click',e=>{const i=e.target.dataset.check;if(i!==undefined){const n=+i;checks=checks.includes(n)?checks.filter(x=>x!==n):[...checks,n];localStorage.setItem('miaoli-reminders',JSON.stringify(checks));renderReminders()}});
$('#expenseForm').date.value='2026-10-09';
$('#expenseForm').addEventListener('submit',e=>{e.preventDefault();const f=new FormData(e.currentTarget);expenses.push({id:Date.now(),title:f.get('title'),amount:+f.get('amount'),payer:f.get('payer'),category:f.get('category'),date:f.get('date')});e.currentTarget.reset();e.currentTarget.date.value='2026-10-09';renderLedger();toast('已記下這筆支出')});
$('#transactions').addEventListener('click',e=>{if(e.target.dataset.delete){expenses=expenses.filter(x=>x.id!==+e.target.dataset.delete);renderLedger();toast('已刪除')}});
$('#clearBtn').addEventListener('click',()=>{if(confirm('確定清空所有支出？公積金入金會保留。')){expenses=expenses.filter(e=>e.category==='入金');renderLedger();toast('支出已清空')}});
$('#settleBtn').addEventListener('click',()=>{const paid=n=>expenses.filter(e=>e.payer===n&&e.category!=='入金').reduce((a,e)=>a+e.amount,0),paidBy=travelers.map(name=>({name,amount:paid(name)})),personal=paidBy.reduce((sum,p)=>sum+p.amount,0),share=personal/travelers.length;$('#settleContent').innerHTML=paidBy.map(p=>`<div class="settle-line"><span>${p.name}代墊</span><b>${money(p.amount)}</b></div>`).join('')+`<div class="settle-line"><span>五人每人應付</span><b>${money(share)}</b></div><p>${personal===0?'目前沒有需要分攤的個人代墊。':paidBy.map(p=>{const diff=p.amount-share;return diff>0?`${p.name}應收 <b>${money(diff)}</b>`:`${p.name}應付 <b>${money(Math.abs(diff))}</b>`}).join('<br>')}</p>`;$('#settleDialog').showModal()});
$('.dialog-close').addEventListener('click',()=>$('#settleDialog').close());
$('#shareTrip').addEventListener('click',async()=>{try{if(navigator.share)await navigator.share({title:document.title,text:'我們的苗栗三天兩夜小旅行',url:location.href});else{await navigator.clipboard.writeText(location.href);toast('旅程連結已複製')}}catch(e){if(e.name!=='AbortError')toast('分享功能暫時無法使用')}});
renderTabs();renderDay();renderReminders();renderLedger();
