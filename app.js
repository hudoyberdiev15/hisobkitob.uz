(function(){
var P=["Tovuq","Tandir","Akarachka","Golen","File","Qanot","Butaka","Jigar"],K="gusht_v2",db={days:{},debts:[]},st={date:iso(new Date()),sheet:null};
try{var s=localStorage.getItem(K);if(s)db=JSON.parse(s)}catch(e){}
if(!db.days)db.days={};if(!db.debts)db.debts=[];if(!db.products)db.products=P.slice();P=db.products;if(!db.titles)db.titles={};
if(!db.manual)db.manual=[];
db.debts.forEach(function(x){if(x.a4==null)x.a4=x.amt});
db.debts.forEach(function(x){if(!x.log){x.log=[];x.g=x.amt;x.pb=x.paid?0:x.amt;if(x.paid){x.log.push({t:Date.now(),d:x.date,k:"p",a:-x.g});x.amt=0}}});
db.mTg2=1;db.mTg=1;
if(!db.rmTg){db.rmTg=1;var ri=db.products.indexOf("Tovuq go‘shti");if(ri>-1)db.products.splice(ri,1);db.manual=db.manual.filter(function(z){return z!=="Tovuq go‘shti"})}
function save(){try{localStorage.setItem(K,JSON.stringify(db))}catch(e){}}
var $=function(i){return document.getElementById(i)};
function iso(d){var m=d.getMonth()+1,k=d.getDate();return d.getFullYear()+"-"+(m<10?"0":"")+m+"-"+(k<10?"0":"")+k}
function addDays(s,n){var d=new Date(s+"T00:00:00");d.setDate(d.getDate()+n);return iso(d)}
function num(v){var x=parseFloat(String(v).replace(",",".").replace(/\s/g,""));return isFinite(x)?x:0}
function numM(v){var s=String(v).trim();if(/^\d{1,3}([.,\s\u00a0]\d{3})+$/.test(s))return parseFloat(s.replace(/\D/g,""));return num(v)}
function q(n){return Number(n.toFixed(2)).toLocaleString("ru-RU")}
function sh(n){return Math.round(n).toLocaleString("ru-RU")}
function money(n){return sh(n)+" so‘m"}
function sg(n){return(n<0?"−":"+")+sh(Math.abs(n))}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[c]})}
function vv(x){return x?String(+Number(x).toFixed(2)):""}
function wD(d){return db.days[d]||(db.days[d]={items:{},exp:[]})}
function r2(n){return Math.round(n*100)/100}
function calc(p,d){
  var it=(db.days[d]&&db.days[d].items[p])||{},open=it.open||0,has=it.left!=null;
  var sold=has?r2(open+(it.in||0)-(it.home||0)-(it.left||0)):0,sell=it.sell||0,pf=it.pf||0;
  var auto=sold,autoHas=has;if(db.manual.indexOf(p)>-1||it.msold!=null){has=it.msold!=null;sold=has?(it.msold||0):0}
  return{auto:auto,autoHas:autoHas,it:it,open:open,has:has,sold:sold,sell:sell,rev:r2(sold*sell),pf:pf,p5:r2(sold*pf)};
}
function dayTot(d){
  var r=0,e=0,q2=0,p5=0,kg=0;P.forEach(function(p){var c=calc(p,d);r+=c.rev;p5+=c.p5;kg+=c.sold});kg=r2(kg);
  ((db.days[d]&&db.days[d].exp)||[]).forEach(function(x){e+=x.amt});
  db.debts.forEach(function(x){if(x.date===d)q2+=x.pb});
  return{p5:p5,kg:kg,rev:r,exp:e,debt:q2,profit:e-r};
}
function period(pre){
  var set={},t={rev:0,out:0,net:0,f:0,z:0,exp:0,debt:0,p5:0};Object.keys(db.days).forEach(function(k){set[k]=1});db.debts.forEach(function(x){set[x.date]=1});
  Object.keys(set).forEach(function(k){if(k.indexOf(pre)===0){var x=dayTot(k);t.rev+=x.rev;t.out+=x.exp;t.exp+=x.exp;t.debt+=x.debt;t.p5+=x.p5}});
  t.net=t.out-t.rev;t.f=Math.max(0,t.net);t.z=Math.max(0,-t.net);return t;
}
function periodL(l){var t={rev:0,exp:0,debt:0};l.forEach(function(k){var x=dayTot(k);t.rev+=x.rev;t.exp+=x.exp;t.debt+=x.debt});t.net=t.exp-t.rev;t.f=Math.max(0,t.net);t.z=Math.max(0,-t.net);return t}
function r4(x){return !x.paid&&!x.l7}
function keyOf(x){return String(x.name).trim().toLowerCase()}
function recalc(x){var a=x.g;x.log.forEach(function(l){a+=l.a});x.amt=Math.max(0,a);x.paid=x.amt<=0.0001}
function unpaidOf(k){return db.debts.filter(function(x){return !x.paid&&keyOf(x)===k}).sort(function(a,b){return a.date<b.date?-1:a.date>b.date?1:0})}
function totOf(k){return unpaidOf(k).reduce(function(a,x){return a+x.amt},0)}
function personObj(k){var u=unpaidOf(k);return u.length?{name:u[0].name,phone:u[0].phone,amt:totOf(k)}:null}
function setAmt(x,v){var dl=v-x.amt;if(!dl)return;x.log.push({t:Date.now(),d:st.date,k:"e",a:dl});recalc(x)}
function payPerson(k,p){var left=Math.min(p,totOf(k));unpaidOf(k).forEach(function(x){if(left<=0)return;var u=Math.min(x.amt,left);x.log.push({t:Date.now(),d:st.date,k:"p",a:-u});left-=u;recalc(x)})}
function lendPerson(k,a){var u=unpaidOf(k);if(!u.length)return;var l=u[u.length-1];db.debts.push({id:"q"+Date.now(),name:l.name,phone:l.phone,amt:a,a4:0,l7:true,g:a,pb:a,log:[],ts:Date.now(),date:st.date,paid:false})}
function setTotal(k,T){var u=unpaidOf(k),dl=T-totOf(k);if(!u.length||!dl)return;if(dl>0){var l=u[u.length-1];l.log.push({t:Date.now(),d:st.date,k:"e",a:dl});recalc(l)}else{var r=-dl;for(var i=u.length-1;i>=0&&r>0;i--){var c=Math.min(u[i].amt,r);u[i].log.push({t:Date.now(),d:st.date,k:"e",a:-c});r-=c;recalc(u[i])}}}
function debtTotal(){return db.debts.reduce(function(a,x){return a+(x.paid?0:x.amt)},0)}

function build(){
  var d=st.date;$("dt").value=d;
  var h="<div class=t1><div class=th><span>Mahsulot</span><span>Kecha astatka</span><span>Bugun kelgan</span><span>Uyga ketdi</span><span>Bugun qolgan</span></div>",it;
  var n1=0;P.forEach(function(p,i){
    if(db.manual.indexOf(p)>-1)return;n1++;var c=calc(p,d);it=c.it;
    h+="<div class=tr data-p="+i+"><span class='nm nmx'><em>"+n1+"</em><span class=nt>"+p+"</span><button class=pad data-act=padd data-i="+i+" aria-label=Qo‘shish>+</button>"+(/\s\d+$/.test(p)&&P.indexOf(p.replace(/\s+\d+$/,""))>-1?"<button class='pad pmn' data-act=pdel data-i="+i+" aria-label=Olib-tashlash>−</button>":"")+"</span>"+
    "<input inputmode=decimal data-f=open placeholder=0 value=\""+vv(c.open)+"\">"+
    "<input inputmode=decimal data-f=in placeholder=0 value=\""+(it.in!=null?it.in:"")+"\">"+
    "<input inputmode=decimal data-f=home placeholder=0 value=\""+(it.home!=null?it.home:"")+"\">"+
    "<input inputmode=decimal data-f=left placeholder=0 value=\""+(it.left!=null?it.left:"")+"\"></div>";
  });
  $("t1").innerHTML=h+"</div>";
  h="<div class=t2><div class=th><span>Mahsulot</span><span>Sotildi (kg)</span><span>Narxi (1 kg)</span><span style='text-align:right'>Summa</span></div>";
  P.forEach(function(p,i){
    var c=calc(p,d);
    h+="<div class=tr data-p="+i+"><span class=nm><em>"+(i+1)+"</em>"+p+"</span>"+"<input inputmode=decimal data-f=msold placeholder=0 value=\""+(c.it.msold!=null?c.it.msold:"")+"\">"+
    "<input inputmode=decimal data-f=sell placeholder=0 value=\""+vv(c.sell)+"\"><span class=sm></span></div>";
  });
  $("t2").innerHTML=h+"</div>";
  h="<div class=t2><div class=th><span>Mahsulot</span><span>Jami kg</span><span>Foyda narxi (1 kg)</span><span style='text-align:right'>Foyda summa</span></div>";
  P.forEach(function(p,i){var c=calc(p,d);h+="<div class=tr data-p="+i+"><span class=nm><em>"+(i+1)+"</em>"+p+"</span><span class=sd></span><input inputmode=decimal data-f=pf placeholder=0 value=\""+vv(c.pf)+"\"><span class=sm></span></div>"});
  h+="<div class=tr><span class=nm>Jami</span><span class=sd id=k5></span><span></span><span class=sm id=s5></span></div>";
  $("t5").innerHTML=h+"</div>";
  refresh();
}
function refresh(){
  var d=st.date,rev=0,d4s=0;
  db.debts.forEach(function(x){if(r4(x)&&x.date===d)d4s+=x.a4});
  P.forEach(function(p,i){
    var c=calc(p,d),r=document.querySelector("#t2 [data-p=\""+i+"\"]");if(!r)return;
    var s=r.querySelector(".sd");if(s){s.textContent=c.has?q(c.sold):"—";s.classList.toggle("neg",c.has&&c.sold<0)}
    var mq=r.querySelector("[data-f=msold]");if(mq){mq.placeholder=db.manual.indexOf(p)>-1?"0":(c.autoHas?q(c.auto):"0");mq.classList.toggle("neg",c.has&&c.sold<0)}
    r.querySelector(".sm").textContent=sh(c.rev);rev+=c.rev;
  });
  P.forEach(function(p,i){var c=calc(p,d),r=document.querySelector("#t5 [data-p=\""+i+"\"]");if(!r)return;var s=r.querySelector(".sd");s.textContent=c.has?q(c.sold):"—";s.classList.toggle("neg",c.has&&c.sold<0);r.querySelector(".sm").textContent=sh(c.p5)});
  var t=dayTot(d),mo=period(d.slice(0,7)),yr=period(d.slice(0,4));
  $("k5").textContent=q(t.kg)+" kg";$("s5").textContent=sh(t.p5);$("fP5").textContent=money(t.p5);$("tRev").textContent=money(rev);$("tExp").textContent=money(t.exp);$("tDebt").textContent=money(d4s);
  $("fRev").textContent=sh(t.rev);$("fExp").textContent=sh(t.exp);
  var sfx=d===iso(new Date())?" · BUGUN":" · "+d.slice(5);$("fOut").textContent=$("fOut2").textContent=sh(t.exp);$("fF").textContent=(t.profit<0?"−":"")+sh(Math.abs(t.profit));$("fFl").textContent="FOYDA"+sfx;
  var wd=new Date(d+"T00:00:00"),ws=addDays(d,-((wd.getDay()+6)%7)),wl=[];for(var wi=0;wi<7;wi++)wl.push(addDays(ws,wi));
  var wk=periodL(wl);function rw(l,v){return"<span>"+l+"</span><b class=fy>"+sh(v.f)+"</b><b class=zr>"+sh(v.z)+"</b><b class=rx>"+sh(v.exp)+"</b>"}
  $("fExt").innerHTML="<span></span><em>Foyda</em><em>Zarar</em><em>Rasxod</em>"+rw("Hafta",wk)+rw("Oy",mo)+rw("Yil",yr);
  var ne=((db.days[d]&&db.days[d].exp)||[]).length,nd=db.debts.filter(function(x){return r4(x)&&x.date===d}).length;
  $("lExp").textContent="Ro‘yxat ("+ne+")";$("lDebt").textContent="Ro‘yxat ("+nd+")";$("hDebt").textContent=money(d4s);
  renderD7();
  if(st.sheet)sheet();
}
function sheet(){
  var d=st.date,h;
  if(st.sheet==="exp"){
    $("shT").textContent="Xarajatlar · "+d;
    var ex=(db.days[d]&&db.days[d].exp)||[];
    h=ex.length?ex.map(function(x){return"<div class=li><div>"+esc(x.name)+"</div><div class=b><b>"+money(x.amt)+"</b><button class=del data-act=delExp data-id="+x.id+">×</button></div></div>"}).join(""):"<div class=empty>Xarajat yo‘q</div>";
  }else if(st.sheet==="inst"){
    $("shT").textContent="Ilovani o‘rnatish";
    var ios=/iphone|ipad|ipod/i.test(navigator.userAgent)||(navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1);
    h="<div class=ist><b>"+(ios?"iPhone / iPad (Safari)":"Android / Chrome")+"</b>"+(ios?
      "<p>1. Safari pastidagi <b>Ulashish</b> tugmasini bosing.</p><p>2. <b>Bosh ekranga qo‘shish</b> ni tanlang.</p><p>3. <b>Qo‘shish</b> ni bosing.</p>":
      "<p>1. Brauzer menyusini (<b>⋮</b>) oching.</p><p>2. <b>Ilovani o‘rnatish</b> yoki <b>Bosh ekranga qo‘shish</b> ni tanlang.</p><p>3. <b>O‘rnatish</b> ni bosing.</p>")+
      "<p class=ish>Shundan keyin ilova bosh ekranda icon bo‘lib turadi.</p></div>";
  }else if(st.sheet==="person"){
    var k=st.pk,u=unpaidOf(k),p=personObj(k);
    $("shT").textContent=u.length?u[0].name:"Qarzdor";
    if(!p){h="<div class=empty>Qarz to‘liq yopildi</div>"}
    else{
      var ev=[];
      u.forEach(function(x){ev.push({d:x.date,t:x.ts||0,l:"Qarz berildi",a:x.g});x.log.forEach(function(l){ev.push({d:l.d,t:l.t||0,l:l.k==="p"?"Qarz olindi":"Tahrir",a:l.a})})});
      ev.sort(function(m,n){return m.d<n.d?-1:m.d>n.d?1:m.t-n.t});
      var ph=phoneN(p.phone),mt=encodeURIComponent(msgFor(p));
      h="<div class=ptot><small>Jami qarz</small><b>"+money(p.amt)+"</b></div>"+(p.phone?"<div class=pph>"+esc(p.phone)+"</div>":"")+
      (st.pm?"<div class=pf><label>"+(st.pm==="give"?"Qarz berilayotgan summa":"Olinayotgan qarz summasi")+"</label><input class=ei id=pam inputmode=decimal placeholder=Summa autocomplete=off><div class=er id=perr></div><div class=pbt><button class=pbk data-act=pm>Orqaga</button><button class=pbm data-act=psave>Saqlash</button></div></div>"
      :"<div class=pbt><button class='pbm give' data-act=pm data-m=give>Qarz berish</button><button class='pbm take' data-act=pm data-m=take>Qarz olish</button></div>")+
      (ph&&!st.pm?"<div class=la style='margin-bottom:6px'><a class='lb sms' href=\"sms:+"+ph+"?&body="+mt+"\" target=_blank rel=noopener>SMS</a><a class='lb tg' data-act=tg data-k=\""+esc(k)+"\" href=\"https://t.me/+"+ph+"\" target=_blank rel=noopener>Telegram</a><button class=lb data-act=cp data-k=\""+esc(k)+"\">Matnni nusxalash</button></div>":"")+
      "<div class=phs>"+ev.map(function(x){return"<div class='hr "+(x.a<0?"mn":"pp")+"'><span>"+wdt(x.d,x.t)+" · "+x.l+"</span><b>"+(x.a<0?"−":"+")+sh(Math.abs(x.a))+"</b></div>"}).join("")+"</div>";
    }
  }else{
    $("shT").textContent=st.allD?"Barcha qarzdorlar":"Qarzlar · "+d;
    var ds=db.debts.filter(function(x){return r4(x)&&(st.allD||x.date===d)});
    h="<div class=la style='margin:0 0 6px'><button class=abtn data-act=allD>"+(st.allD?"Faqat shu kun":"Barcha qarzdorlar")+"</button></div>"+(ds.length?ds.map(function(x){
      var ph=phoneN(x.phone),m=encodeURIComponent(msgFor(x));
      return"<div class=li style='flex-wrap:wrap'><div style='flex:1;min-width:90px'><input class=ei data-ed=name data-id="+x.id+" value=\""+esc(x.name)+"\" placeholder=Ism><input class=ei data-ed=phone data-id="+x.id+" value=\""+esc(x.phone||"")+"\" placeholder=Telefon inputmode=tel><small>"+x.date+""+"</small></div><div class=b>"+
      "<input class='ei am' inputmode=decimal data-ed=amt data-id="+x.id+" value=\""+vv(x.a4)+"\">"+"<button class=del data-act=delDebt data-id="+x.id+">×</button></div>"+
      (ph&&!x.paid?"<div class=la style='width:100%'><a class='lb sms' href=\"sms:+"+ph+"?&body="+m+"\" target=_blank rel=noopener>SMS</a><a class='lb tg' data-act=tg data-id="+x.id+" href=\"https://t.me/+"+ph+"\" target=_blank rel=noopener>Telegram</a><button class=lb data-act=cp data-id="+x.id+">Matnni nusxalash</button></div>":"")+"</div>"}).join(""):"<div class=empty>Qarz yo‘q</div>");
  }
  $("shB").innerHTML=h;$("ov").hidden=false;
}
function onField(e){
  var el=e.target,f=el.dataset.f;if(!f)return;
  var p=P[+el.closest(".tr").dataset.p],its=wD(st.date).items,it=its[p]=its[p]||{};
  if(el.value.trim()==="")delete it[f];else it[f]=(f==="sell"||f==="pf"?numM:num)(el.value);
  if(!Object.keys(it).length)delete its[p];
  if(!Object.keys(its).length&&!wD(st.date).exp.length)delete db.days[st.date];
  save();refresh();
}
$("t1").addEventListener("input",onField);$("t2").addEventListener("input",onField);$("t5").addEventListener("input",onField);
$("dt").addEventListener("change",function(e){if(e.target.value){st.date=e.target.value;build()}});
$("ov").addEventListener("click",function(e){if(e.target.id==="ov"){st.sheet=null;$("ov").hidden=true}});
document.addEventListener("click",function(e){
  var t=e.target.closest?e.target.closest("[data-act]"):null;if(!t)return;var a=t.dataset.act;
  if(a==="nav"){st.date=addDays(st.date,+t.dataset.n);build();return}
  if(a==="close"){st.sheet=null;$("ov").hidden=true;return}
  if(a==="clr"){
    if(!t.classList.contains("sure")){t.classList.add("sure");t.textContent="Aniq tozalansinmi?";clearTimeout(window._ct);window._ct=setTimeout(function(){t.classList.remove("sure");t.textContent="Tozalash"},3500);return}
    clearTimeout(window._ct);t.classList.remove("sure");t.textContent="Tozalash";
    delete db.days[st.date];db.debts.forEach(function(x){if(x.date===st.date){x.l7=true;x.a4=0;x.pb=0}});
    ["en","ea","qn","qp","qa"].forEach(function(i){$(i).value=""});st.sheet=null;$("ov").hidden=true;save();build();return;
  }
  if(a==="allD"){st.allD=!st.allD;sheet();return}
  if(a==="tg"||a==="cp"){var xd=t.dataset.k?personObj(t.dataset.k):db.debts.filter(function(z){return z.id===t.dataset.id})[0];if(xd)copyTxt(msgFor(xd));if(a==="cp"){var o0=t.textContent;t.textContent="Nusxalandi";setTimeout(function(){t.textContent=o0},1500)}return}
  if(a==="padd"){var pi=+t.dataset.i,bs=P[pi].replace(/\s+\d+$/,""),pn2=2;while(P.indexOf(bs+" "+pn2)>-1)pn2++;P.splice(pi+1,0,bs+" "+pn2);save();build();return}
  if(a==="pdel"){if(!t.classList.contains("sure")){t.classList.add("sure");t.textContent="?";clearTimeout(t._t);t._t=setTimeout(function(){t.classList.remove("sure");t.textContent="−"},3000);return}var dn=P[+t.dataset.i];P.splice(+t.dataset.i,1);db.manual=db.manual.filter(function(z){return z!==dn});Object.keys(db.days).forEach(function(k){delete db.days[k].items[dn]});save();build();return}
  if(a==="st"){setTab(+t.dataset.i);var rw=document.querySelector(".row.on");if(rw)rw.scrollTop=0;return}
  if(a==="pg"){openPg(t.dataset.k);return}
  if(a==="pgx"){st.pg=null;$("pg").hidden=true;return}
  if(a==="man"){var pn=P[+t.dataset.i],mj=db.manual.indexOf(pn);if(mj>-1)db.manual.splice(mj,1);else db.manual.push(pn);afterAdmin();return}
  if(a==="aadd"){var nm=$("np").value.trim();if(nm&&P.indexOf(nm)<0){P.push(nm);afterAdmin()}return}
  if(a==="adel"){two(t,function(){var nm=P[+t.dataset.i];P.splice(+t.dataset.i,1);db.manual=db.manual.filter(function(z){return z!==nm});Object.keys(db.days).forEach(function(k){delete db.days[k].items[nm]});afterAdmin()});return}
  if(a==="theme"){db.theme=t.dataset.v;applyTheme();save();openPg("admin");return}
  if(a==="wipe"){two(t,function(){db.days={};db.debts=[];save();build();openPg("admin")});return}
  if(a==="gal"){saveDay();return}
  if(a==="install"){if(dip){dip.prompt();dip.userChoice.then(function(){dip=null})}else{st.sheet="inst";sheet()}return}
  if(a==="instX"){db.instX=1;save();$("inst").hidden=true;return}
  if(a==="themeT"){db.theme=effTheme()==="dark"?"light":"dark";applyTheme();save();return}
  if(a==="person"){st.sheet="person";st.pk=t.dataset.k;st.pm=null;sheet();return}
  if(a==="pm"){st.pm=t.dataset.m||null;sheet();var pi=$("pam");if(pi)pi.focus();return}
  if(a==="psave"){var pv=numM($("pam").value),pt=totOf(st.pk);
    if(!pv){$("pam").focus();return}
    if(st.pm==="take"&&pv>pt){$("perr").textContent="Qarz "+money(pt)+" dan oshmasin";return}
    if(st.pm==="give")lendPerson(st.pk,pv);else payPerson(st.pk,pv);
    st.pm=null;save();refresh();return}
  if(a==="listExp"){st.sheet="exp";sheet();return}
  if(a==="listDebt"){st.sheet="debt";sheet();return}
  if(a==="addExp"){var am=numM($("ea").value);if(!am){$("ea").focus();return}wD(st.date).exp.push({id:"e"+Date.now(),name:$("en").value.trim()||"Xarajat",amt:am});$("en").value="";$("ea").value="";$("en").focus()}
  else if(a==="delExp"){var D=wD(st.date);D.exp=D.exp.filter(function(x){return x.id!==t.dataset.id})}
  else if(a==="addDebt"){var n=$("qn").value.trim(),m=numM($("qa").value);if(!n||!m){(n?$("qa"):$("qn")).focus();return}db.debts.push({id:"q"+Date.now(),name:n,phone:$("qp").value.trim(),amt:m,a4:m,g:m,pb:m,log:[],ts:Date.now(),date:st.date,paid:false});$("qn").value="";$("qp").value="";$("qa").value="";$("qn").focus()}
  else if(a==="payDebt"){db.debts.forEach(function(x){if(x.id!==t.dataset.id)return;if(!x.paid){x.log.push({t:Date.now(),d:st.date,k:"p",a:-x.amt});recalc(x)}else{for(var i=x.log.length-1;i>=0;i--){if(x.log[i].k==="p"){x.log.splice(i,1);break}}recalc(x)}})}
  else if(a==="pay"||a==="lend"){var pc=t.closest(".pc"),xx=db.debts.filter(function(z){return z.id===pc.dataset.id})[0],iv=numM(pc.querySelector("[data-amt]").value);if(!xx)return;if(a==="pay"){var u=Math.min(iv||xx.amt,xx.amt);xx.log.push({t:Date.now(),d:st.date,k:"p",a:-u});recalc(xx)}else{if(!iv){pc.querySelector("[data-amt]").focus();return}db.debts.push({id:"q"+Date.now(),name:xx.name,phone:xx.phone,amt:iv,a4:0,l7:true,g:iv,pb:iv,log:[],ts:Date.now(),date:st.date,paid:false})}}
  else if(a==="delDebt"){two(t,function(){db.debts=db.debts.filter(function(x){return x.id!==t.dataset.id});save();refresh()});return}
  save();refresh();
});

function drawReport(ctx,W,H){
  var d=st.date,t=dayTot(d),y=0,F="Onest,system-ui,sans-serif";
  function T(s,x,yy,sz,w,c,al){ctx.font=w+" "+sz+"px "+F;ctx.fillStyle=c;ctx.textAlign=al||"left";ctx.fillText(s,x,yy)}
  function B(yy,h,c){ctx.fillStyle=c;ctx.fillRect(40,yy,W-80,h)}
  function sec(n,title,col){y+=34;ctx.fillStyle=col;ctx.beginPath();ctx.arc(62,y+2,18,0,7);ctx.fill();T(n,62,y+10,22,"700","#fff","center");T(title,96,y+11,30,"700","#16213a");y+=50}
  function line(a,b,bold,col){T(a,40,y,27,bold?"700":"500","#16213a");T(b,W-40,y,27,"700",col||"#16213a","right");y+=46}
  if(H){ctx.fillStyle="#ffffff";ctx.fillRect(0,0,W,H)}
  y=76;T("Go‘sht hisobi",40,y,48,"700","#16213a");T(d,W-40,y,32,"500","#6a7690","right");y+=26;B(y,3,"#dfe5ef");
  sec("1",ttl("r1")+" va "+ttl("r2"),"#10a37f");
  var ex=[390,480,565,660,770,890,1040],hd=["Kecha","Kelgan","Uyga","Qolgan","Sotildi","Narx","Summa"];
  T("Mahsulot",40,y,21,"500","#6a7690");hd.forEach(function(h,i){T(h,ex[i],y,21,"500","#6a7690","right")});y+=14;B(y,2,"#dfe5ef");y+=40;
  var rows=P.map(function(p){return{p:p,c:calc(p,d)}}).filter(function(r){var i=r.c.it;return r.c.open||i.in||i.home||i.left!=null||r.c.sell||r.c.has});
  if(!rows.length)rows=P.map(function(p){return{p:p,c:calc(p,d)}});
  rows.forEach(function(r,k){var c=r.c,i=c.it;if(k%2===0)B(y-31,44,"#f3f6fb");T(r.p,48,y,26,"700","#16213a");
    [vv(c.open)||"0",vv(i.in)||"0",vv(i.home)||"0",i.left!=null?vv(i.left)||"0":"—",c.has?q(c.sold):"—",sh(c.sell),sh(c.rev)].forEach(function(v,j){T(v,ex[j]-(j===6?8:0),y,26,j>=5?"700":"500",j===4&&c.has&&c.sold<0?"#dc4b43":"#16213a","right")});y+=44});
  y+=6;B(y-31,48,"#e3f6ef");T("Jami tushum (2)",48,y+3,28,"700","#0b7a5e");T(sh(t.rev)+" so‘m",W-48,y+3,28,"700","#0b7a5e","right");y+=60;
  sec("3",ttl("r3"),"#f59e0b");
  var xs=(db.days[d]&&db.days[d].exp)||[];
  if(!xs.length){line("Xarajat yo‘q","0")}else xs.forEach(function(x){line(x.name,sh(x.amt)+" so‘m")});
  line("Jami xarajat",sh(t.exp)+" so‘m",true,"#b45309");
  sec("4",ttl("r4"),"#8b5cf6");
  var ds=db.debts.filter(function(x){return x.date===d});
  if(!ds.length){line("Qarz yo‘q","0")}else ds.forEach(function(x){line(x.name+(x.paid?" (to‘landi)":""),sh(x.pb)+" so‘m")});
  line("Jami qarz (foydaga kirmaydi)",sh(t.debt)+" so‘m",true,"#6d28d9");
  sec("5",ttl("r5"),"#06b6d4");
  var r5=P.map(function(p){return{p:p,c:calc(p,d)}}).filter(function(r){return r.c.has&&r.c.pf});
  if(!r5.length)line("Ma’lumot yo‘q","0");else r5.forEach(function(r){line(r.p+"  "+q(r.c.sold)+" kg × "+sh(r.c.pf),sh(r.c.p5)+" so‘m")});
  line("Jami "+q(t.kg)+" kg · Jami foyda",sh(t.p5)+" so‘m",true,"#0e7490");
  sec("6",ttl("r6"),"#ec4899");
  line("Xarajat = Jami chiqim",sh(t.exp)+" so‘m");
  line("Tushum (2)",sh(t.rev)+" so‘m");
  y+=4;B(y-34,96,"#16213a");T("FOYDA (Chiqim − Tushum)",64,y+12,27,"500","#c9d3ea");T((t.profit<0?"−":"")+sh(Math.abs(t.profit))+" so‘m",W-64,y+16,44,"700","#5eead4","right");y+=100;
  return y+24;
}
async function savePng(blob,name){
  try{if(window.claude&&window.claude.use){var dl=await window.claude.use("downloads");if(dl){await dl.save({filename:name,data:blob});return true}}}catch(e){if(e&&e.code==="declined")return false}
  var f=new File([blob],name,{type:"image/png"});
  if(navigator.canShare&&navigator.canShare({files:[f]})){try{await navigator.share({files:[f],title:name});return true}catch(e){if(e&&e.name==="AbortError")return false}}
  var a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();a.remove();return true;
}
async function saveDay(){
  var b=$("gal"),msg="Saqlandi";b.disabled=true;
  try{
    if(document.fonts&&document.fonts.ready)await document.fonts.ready;
    var W=1080,c=document.createElement("canvas");c.width=W;c.height=100;
    var H=drawReport(c.getContext("2d"),W,0);c.height=H;drawReport(c.getContext("2d"),W,H);
    var blob=await new Promise(function(r){c.toBlob(r,"image/png")});
    if(!(await savePng(blob,"hisob-"+st.date+".png")))msg="Bekor qilindi";
  }catch(e){msg="Saqlanmadi"}
  b.textContent=msg;setTimeout(function(){b.textContent="Galereyaga saqlash";b.disabled=false},2200);
}

var DEFMSG="Assalomu alaykum, {ism}! Sizning {summa} so‘m qarzingiz bor. Iltimos, to‘lovni amalga oshiring. Rahmat!";
function msgFor(x){return(db.msg||DEFMSG).replace(/\{ism\}/g,x.name).replace(/\{summa\}/g,sh(x.amt))}
function phoneN(p){var d=String(p||"").replace(/\D/g,"");if(d.length===9)d="998"+d;return d}
function legacy(s){var a=document.createElement("textarea");a.value=s;a.style.position="fixed";a.style.opacity="0";document.body.appendChild(a);a.select();try{document.execCommand("copy")}catch(e){}a.remove()}
function copyTxt(s){try{if(navigator.clipboard){navigator.clipboard.writeText(s).catch(function(){legacy(s)});return}}catch(e){}legacy(s)}
function makeBg(){
  var E=["🧮","🧾","💰","💵","📊","📈","🪙","💳","📒","🔢","➕","➖","✖️","➗","🥩","🍗","🧮","💰"],box=$("bgfx");if(!box)return;
  function r(a,b){return a+Math.random()*(b-a)}
  E.forEach(function(e){
    var s=document.createElement("span");s.textContent=e;
    s.style.left=r(0,92)+"%";s.style.top=r(0,90)+"%";s.style.fontSize=r(26,58)+"px";
    s.style.setProperty("--dx",r(-45,45)+"vw");s.style.setProperty("--dy",r(-45,45)+"vh");
    s.style.setProperty("--r0",r(-25,25)+"deg");s.style.setProperty("--r1",r(-40,40)+"deg");
    s.style.setProperty("--d",r(22,48)+"s");s.style.animationDelay="-"+r(0,30)+"s";
    box.appendChild(s);
  });
}
function dLabel(dt){var t=iso(new Date());return dt===t?"Bugun":dt===addDays(t,-1)?"Kecha":dt===addDays(t,1)?"Ertaga":dt}
var WDN=["Yakshanba","Dushanba","Seshanba","Chorshanba","Payshanba","Juma","Shanba"];
function hm(t){var d=new Date(t);return(d.getHours()<10?"0":"")+d.getHours()+":"+(d.getMinutes()<10?"0":"")+d.getMinutes()}
function wdt(d,t){return WDN[new Date(+d.slice(0,4),+d.slice(5,7)-1,+d.slice(8)).getDay()]+", "+dmy(d)+(t?" · "+hm(t):"")}
function dmy(d){return +d.slice(8)+" "+MN[+d.slice(5,7)-1]+" "+d.slice(0,4)}
function renderD7(){
  var el=$("d7");if(!el)return;
  $("tD7").textContent="Jami: "+money(debtTotal());
  var ps={};
  db.debts.forEach(function(x){if(x.paid)return;var k=keyOf(x),p=ps[k];
    if(!p)p=ps[k]={k:k,name:x.name,d:x.date,t:x.ts||0,amt:0};
    p.amt+=x.amt;if(x.date<p.d||(x.date===p.d&&(x.ts||0)<p.t)){p.d=x.date;p.t=x.ts||0}});
  var L=Object.keys(ps).map(function(k){return ps[k]}).sort(function(p,q){return p.d<q.d?-1:p.d>q.d?1:p.t-q.t});
  if(!L.length){el.innerHTML="<div class=empty>Qarzdor yo‘q</div>";return}
  el.innerHTML=L.map(function(p){return"<button class=prs data-act=person data-k=\""+esc(p.k)+"\"><span class=prn>"+esc(p.name)+"</span><b>"+money(p.amt)+"</b></button>"}).join("");
}
$("d7").addEventListener("change",function(e){var t=e.target;if(t.dataset.tot==null)return;var x=db.debts.filter(function(z){return z.id===t.closest(".pc").dataset.id})[0];if(!x)return;setAmt(x,Math.max(0,numM(t.value)));save();refresh()});
$("shB").addEventListener("change",function(e){
  var t=e.target,f=t.dataset.ed;if(!f)return;var x=db.debts.filter(function(z){return z.id===t.dataset.id})[0];if(!x)return;
  if(f==="name"){if(t.value.trim())x.name=t.value.trim()}else if(f==="phone")x.phone=t.value.trim();else if(f==="amt"){var nv=Math.max(0,numM(t.value)),dl=nv-x.a4;x.a4=nv;if(dl){if(!x.l7)x.pb=Math.max(0,x.pb+dl);x.log.push({t:Date.now(),d:st.date,k:"e",a:dl});recalc(x)}}
  save();refresh();
});
var WD=["Du","Se","Ch","Pa","Ju","Sh","Ya"],MN=["Yanvar","Fevral","Mart","Aprel","May","Iyun","Iyul","Avgust","Sentabr","Oktabr","Noyabr","Dekabr"],MS=["Yan","Fev","Mar","Apr","May","Iyn","Iyl","Avg","Sen","Okt","Noy","Dek"];
var DEF={r1:"Mahsulotlar",r2:"Sotuv hisobi",r3:"Xarajatlar",r4:"Qarzlar",r5:"Foyda hisobi",r6:"Jami hisob",r7:"Barcha qarzdorlar"};
function ttl(k){return db.titles[k]||DEF[k]}
function applyTitles(){document.querySelectorAll("[data-tk]").forEach(function(h){h.textContent=ttl(h.dataset.tk)})}
function scl(){var r=db.scale||100;return r+"%"+(st.eff&&st.eff*100<r-1?" → ekranga sig‘gani: "+Math.round(st.eff*100)+"%":"")}
function setTab(i){st.tab=i;document.querySelectorAll(".row").forEach(function(r){r.classList.toggle("on",+r.dataset.s===i)});document.querySelectorAll("#stabs button").forEach(function(b){b.classList.toggle("on",+b.dataset.i===i)})}
function fit(){
  var s=(db.scale||100)/100;
  document.documentElement.style.setProperty("--s",s);
  document.querySelector(".app").classList.add("tabs");
  st.eff=s;var sv=$("scv");if(sv)sv.textContent=scl();
}
function applyScale(){fit()}
var _ft;window.addEventListener("resize",function(){clearTimeout(_ft);_ft=setTimeout(fit,150)});
window.addEventListener("load",fit);
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(fit);
function effTheme(){return db.theme==="light"||db.theme==="dark"?db.theme:(window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light")}
function applyTheme(){var r=document.documentElement;if(db.theme==="light"||db.theme==="dark")r.setAttribute("data-theme",db.theme);else r.removeAttribute("data-theme");var tb=$("thm");if(tb)tb.textContent=effTheme()==="dark"?"☀":"☾"}
function pad(n){return(n<10?"0":"")+n}
function fin(v){v.out=v.exp;v.net=v.out-v.rev;return v}
function norm(x){return fin({rev:x.rev,exp:x.exp,debt:x.debt,p5:x.p5})}
function sumL(a){var t={rev:0,exp:0,debt:0,p5:0};a.forEach(function(r){var v=r.v;t.rev+=v.rev;t.exp+=v.exp;t.debt+=v.debt;t.p5+=v.p5});return fin(t)}
function sn(n){return(n<0?"−":"")+sh(Math.abs(n))}
function report(kind){
  var d=st.date,y=d.slice(0,4),ym=d.slice(0,7),items=[],title,rng,i,x;
  if(kind==="week"){var s=addDays(d,-((new Date(d+"T00:00:00").getDay()+6)%7));title="1 haftalik hisob";rng=s+" — "+addDays(s,6);
    for(i=0;i<7;i++){var dd=addDays(s,i);items.push({l:WD[i]+" "+dd.slice(8),v:norm(dayTot(dd))})}}
  else if(kind==="month"){title="1 oylik hisob";rng=MN[+ym.slice(5)-1]+" "+y;var n=new Date(+y,+ym.slice(5),0).getDate();
    for(i=1;i<=n;i++){x=dayTot(ym+"-"+pad(i));if(x.rev||x.exp||x.debt||x.p5)items.push({l:pad(i)+"."+ym.slice(5),v:norm(x)})}}
  else{title="1 yillik hisob";rng=y+"-yil";for(i=1;i<=12;i++)items.push({l:MS[i-1],v:period(y+"-"+pad(i))})}
  var t=sumL(items);
  function row(l,v,c){return"<div class='rr "+(c||"")+"'><span>"+l+"</span><span>"+sh(v.rev)+"</span><span>"+sh(v.out)+"</span><span>"+sh(v.p5)+"</span><b>"+sn(v.net)+"</b></div>"}
  var h="<div class=rg>"+rng+"</div><div class=cards><div class='cd big'><small>NATIJA (Chiqim − Tushum)</small><b>"+sn(t.net)+" so‘m</b></div>"+
  "<div class=cd><small>Jami tushum</small><b>"+money(t.rev)+"</b></div><div class=cd><small>Jami chiqim</small><b>"+money(t.out)+"</b></div>"+
  "<div class=cd><small>Xarajatlar</small><b>"+money(t.exp)+"</b></div><div class=cd><small>Qarzlar (foydaga kirmaydi)</small><b>"+money(t.debt)+"</b></div>"+
  "<div class='cd' style='grid-column:1/-1'><small>Foyda hisobi (5-qator)</small><b>"+money(t.p5)+"</b></div></div>"+
  "<div class=rpt><div class='rr h'><span>Sana</span><span>Tushum</span><span>Chiqim</span><span>Foyda (5)</span><span>Natija</span></div>"+
  (items.length?items.map(function(r){return row(r.l,r.v)}).join("")+row("Jami",t,"tl"):"<div class=empty>Ma’lumot yo‘q</div>")+"</div>";
  return{title:title,html:h};
}
function adminHTML(){
  var h="<div class=ad><h3>Harf o‘lchami: <span id=scv>"+scl()+"</span></h3><input type=range min=70 max=150 step=5 data-sc value="+(db.scale||100)+"><div style='display:flex;justify-content:space-between;color:var(--mute);font-size:12px;margin-top:4px'><span>Kichik</span><span>Katta</span></div></div><div class=ad><h3>Mahsulotlar</h3>"+P.map(function(p,i){return"<div class=ar style='grid-template-columns:1fr auto auto'><input data-pn="+i+" value=\""+esc(p)+"\"><button class=abtn data-act=man data-i="+i+">1-qator: "+(db.manual.indexOf(p)>-1?"Yo‘q":"Ha")+"</button><button class='abtn red' data-act=adel data-i="+i+">O‘chirish</button></div>"}).join("")+
  "<div class=ar><input id=np placeholder='Yangi mahsulot nomi'><button class=abtn data-act=aadd>Qo‘shish</button></div></div>";
  h+="<div class=ad><h3>Qator nomlari</h3>"+Object.keys(DEF).map(function(k){return"<div style='margin-bottom:8px'><label>"+k.slice(1)+"-qator</label><input data-tk2="+k+" value=\""+esc(ttl(k))+"\"></div>"}).join("")+"</div>";
  h+="<div class=ad><h3>Ko‘rinish</h3><div class=themes>"+[["auto","Avto"],["light","Yorug‘"],["dark","Qorong‘i"]].map(function(a){return"<button class='abtn"+((db.theme||"auto")===a[0]?" on":"")+"' data-act=theme data-v="+a[0]+">"+a[1]+"</button>"}).join("")+"</div></div>";
  h+="<div class=ad><h3>SMS va Telegram matni</h3><input data-msg value=\""+esc(db.msg||DEFMSG)+"\"><div style='color:var(--mute);font-size:12px;margin-top:6px'>{ism} va {summa} o‘rniga qarzdor ismi va summasi qo‘yiladi.</div></div>";
  h+="<div class=ad><h3>Ma’lumotlar</h3><button class='abtn red' style='width:100%' data-act=wipe>Barcha kunlarni o‘chirish</button></div>";
  return h;
}
function openPg(k){
  var r=k==="admin"?{title:"Admin panel",html:adminHTML()}:report(k);
  st.pg=k;$("pg").classList.toggle("rep",k!=="admin");$("pgT").textContent=r.title;$("pgB").innerHTML=r.html;$("pg").hidden=false;
}
function two(t,fn){
  if(!t.classList.contains("sure")){var o=t.textContent;t.classList.add("sure");t.textContent="Aniq?";clearTimeout(t._t);t._t=setTimeout(function(){t.classList.remove("sure");t.textContent=o},3500);return}
  clearTimeout(t._t);fn();
}
function afterAdmin(){save();build();applyTitles();openPg("admin")}
$("pgB").addEventListener("change",function(e){
  var el=e.target;if(el.dataset.pn==null)return;
  var i=+el.dataset.pn,old=P[i],nn=el.value.trim();
  if(!nn||nn===old||P.indexOf(nn)>-1){el.value=old;return}
  Object.keys(db.days).forEach(function(k){var it=db.days[k].items;if(it[old]){it[nn]=it[old];delete it[old]}});
  P[i]=nn;var mi=db.manual.indexOf(old);if(mi>-1)db.manual[mi]=nn;afterAdmin();
});
$("pgB").addEventListener("input",function(e){
  if(e.target.dataset.msg!=null){db.msg=e.target.value;save();return}
  if(e.target.dataset.sc!=null){db.scale=+e.target.value;applyScale();save();return}
  var k=e.target.dataset.tk2;if(!k)return;
  if(e.target.value.trim())db.titles[k]=e.target.value;else delete db.titles[k];
  save();applyTitles();
});
st.today=iso(new Date());
function syncToday(){
  var n=iso(new Date());if(n===st.today)return;
  if(st.date===st.today){st.date=n;st.allD=false}
  st.today=n;build();
}
setInterval(syncToday,30000);
function tick(){var n=new Date(),p=function(v){return(v<10?"0":"")+v};
  $("clkD").textContent=WDN[n.getDay()]+", "+n.getDate()+" "+MN[n.getMonth()]+" "+n.getFullYear();
  $("clkT").textContent=p(n.getHours())+":"+p(n.getMinutes())+":"+p(n.getSeconds())}
tick();setInterval(tick,1000);
document.addEventListener("visibilitychange",function(){if(!document.hidden)syncToday()});
window.addEventListener("focus",syncToday);
var dip=null;
function showInst(){var b=$("inst"),sa=(window.matchMedia&&window.matchMedia("(display-mode: standalone)").matches)||navigator.standalone===true;b.hidden=sa||db.instX===1}
window.addEventListener("beforeinstallprompt",function(e){e.preventDefault();dip=e;showInst()});
window.addEventListener("appinstalled",function(){dip=null;$("inst").hidden=true});
if("serviceWorker"in navigator&&/^https?:/.test(location.protocol)){window.addEventListener("load",function(){navigator.serviceWorker.register("sw.js").catch(function(){})})}
makeBg();build();applyTitles();applyTheme();applyScale();showInst();setTab(st.tab||1);
})();
