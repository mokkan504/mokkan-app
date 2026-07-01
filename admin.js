(async function(){
  const profile=await MokkanBackend.profile().catch(()=>null);if(profile?.role!=="admin"){location.replace("./admin-login.html");return;}
  const db=MokkanBackend.client, esc=v=>{const d=document.createElement("div");d.textContent=v??"";return d.innerHTML;}, money=v=>Number(v||0).toLocaleString("ko-KR")+"원";
  let inquiryCache=[];
  document.getElementById("dashboardDate").textContent=new Date().toLocaleDateString("ko-KR");
  async function load(){
    const now=new Date(),since30=new Date(now.getTime()-30*86400000).toISOString(),today=new Date(now.getFullYear(),now.getMonth(),now.getDate());
    const [{data:inq=[]},{data:members=[]},{data:production=[]},{data:finance=[]},{data:analytics=[]}]=await Promise.all([
      db.from("inquiries").select("*").order("created_at",{ascending:false}),db.from("profiles").select("id,email,name,phone,address,interest,marketing_consent,created_at").order("created_at",{ascending:false}),db.from("production_items").select("*").order("due_date"),db.from("finance_records").select("*").order("date",{ascending:false}),db.from("analytics_events").select("path,visitor_id,device,created_at").gte("created_at",since30).order("created_at",{ascending:false})]);
    inquiryCache=inq;
    set("metricMembers",members.length);set("metricMonthly",inq.filter(x=>new Date(x.created_at).getMonth()===new Date().getMonth()).length);set("metricActive",inq.filter(x=>x.status!=="답변 완료").length);
    const uniqueVisitors=new Set(analytics.map(x=>x.visitor_id)).size,todayViews=analytics.filter(x=>new Date(x.created_at)>=today).length,pathCounts=analytics.reduce((a,x)=>(a[x.path]=(a[x.path]||0)+1,a),{}),popular=Object.entries(pathCounts).sort((a,b)=>b[1]-a[1])[0];
    set("metricTodayViews",todayViews);set("metricUniqueVisitors",uniqueVisitors);set("metricPageViews",analytics.length);set("metricPopularPage",popular?popular[0]:"-");
    const recentInquiries=inq.filter(x=>new Date(x.created_at)>=new Date(since30)).length;set("metricConversion",uniqueVisitors?Math.round(recentInquiries/uniqueVisitors*100)+"%":"0%");
    const budgets=inq.map(x=>x.budget).filter(Boolean).reduce((a,x)=>(a[x]=(a[x]||0)+1,a),{}),topBudget=Object.entries(budgets).sort((a,b)=>b[1]-a[1])[0];set("metricBudget",topBudget?topBudget[0]:"-");
    const monthFinance=finance.filter(x=>{const d=new Date(x.date);return d.getFullYear()===now.getFullYear()&&d.getMonth()===now.getMonth();}),revenue=monthFinance.filter(x=>x.type==="revenue").reduce((s,x)=>s+Number(x.amount),0),expense=monthFinance.filter(x=>x.type==="expense").reduce((s,x)=>s+Number(x.amount),0);set("metricRevenue",money(revenue));set("metricExpense",money(expense));set("metricProfit",money(revenue-expense));
    table("memberRows",members.map(x=>`<tr><td>${date(x.created_at)}</td><td><strong>${esc(x.name)}</strong><br>${esc(x.email)}</td><td>${esc(x.phone)}</td><td>${esc(x.address)}</td><td>${esc(x.interest||"-")}</td><td>${x.marketing_consent?"동의":"미동의"}</td></tr>`),"emptyMembers");
    table("inquiryRows",inq.map(x=>`<tr><td>${date(x.created_at)}</td><td><strong>${esc(x.name)}</strong><br>${esc(x.email)}</td><td>${esc(x.product||x.kind)}</td><td>${esc(x.message||"-")}</td><td>${esc(x.budget||"-")}</td><td><select class="status-select" data-id="${x.id}">${["신규 문의","견적 검토","상담 진행","답변 완료"].map(s=>`<option ${s===x.status?"selected":""}>${s}</option>`).join("")}</select></td></tr>`),"emptyInquiries");
    table("productionRows",production.map(x=>`<tr><td>${esc(x.title)}</td><td>${esc(x.client)}</td><td>${esc(x.start_date)}</td><td>${esc(x.due_date)}</td><td>${esc(x.status)}</td><td>${esc(x.memo)}</td></tr>`),"emptyProduction");
    table("financeRows",finance.map(x=>`<tr><td>${esc(x.date)}</td><td>${x.type==="revenue"?"수익":"지출"}</td><td>${esc(x.title)}</td><td>${money(x.amount)}</td><td>${esc(x.memo)}</td></tr>`),"emptyFinance");
  }
  document.addEventListener("change",async e=>{if(!e.target.matches(".status-select"))return;await db.from("inquiries").update({status:e.target.value,updated_at:new Date().toISOString()}).eq("id",e.target.dataset.id);});
  bind("productionForm","production_items",d=>({title:d.get("title"),client:d.get("client"),start_date:d.get("startDate"),due_date:d.get("dueDate"),status:d.get("status"),memo:d.get("memo")}));
  bind("financeForm","finance_records",d=>({date:d.get("date"),type:d.get("type"),title:d.get("title"),amount:Number(d.get("amount")),memo:d.get("memo")}));
  document.getElementById("exportCsv").addEventListener("click",exportInquiries);
  document.getElementById("adminLogout").addEventListener("click",async()=>{await db.auth.signOut();location.href="./admin-login.html";});
  function exportInquiries(){
    if(!inquiryCache.length){alert("내보낼 문의가 없습니다.");return;}
    const headers=["접수일","상태","문의 유형","제품","이름","이메일","연락처","예산","희망 일정","문의 내용"];
    const rows=inquiryCache.map(x=>[x.created_at,x.status,x.kind,x.product,x.name,x.email,x.phone,x.budget,x.timeline,x.message]);
    const safe=value=>{let text=String(value??"");if(/^[=+\-@]/.test(text))text="'"+text;return '"'+text.replace(/"/g,'""')+'"';};
    const csv="\uFEFF"+[headers,...rows].map(row=>row.map(safe).join(",")).join("\r\n");
    const url=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8"}));
    const link=document.createElement("a");link.href=url;link.download=`mokkan-inquiries-${new Date().toISOString().slice(0,10)}.csv`;document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  function bind(id,name,map){const f=document.getElementById(id);f?.addEventListener("submit",async e=>{e.preventDefault();const{error}=await db.from(name).insert(map(new FormData(f)));document.getElementById(id.replace("Form","Result")).textContent=error?error.message:"저장되었습니다.";if(!error){f.reset();load();}});}
  function set(id,v){const e=document.getElementById(id);if(e)e.textContent=v;}function date(v){return new Date(v).toLocaleDateString("ko-KR");}function table(id,rows,emptyId){document.getElementById(id).innerHTML=rows.join("");document.getElementById(emptyId).hidden=rows.length>0;}
  await load();
})();
