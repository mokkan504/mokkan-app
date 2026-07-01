(async function(){
  const gate=document.getElementById("mypageGate"),content=document.getElementById("mypageContent"),history=document.getElementById("mypageHistory"),form=document.getElementById("mypageForm"),result=document.getElementById("mypageResult");
  const user=await MokkanBackend.user().catch(()=>null);if(!user){gate.hidden=false;return;}
  const profile=await MokkanBackend.profile();content.hidden=false;history.hidden=false;
  for(const [field,key] of [["name","name"],["email","email"],["phone","phone"],["address","address"],["interest","interest"],["contactMethod","contact_method"]])if(form.elements[field])form.elements[field].value=profile[key]||"";
  form.elements.phone.value=String(profile.phone||"").replace(/\D/g,"");
  MokkanBirthdate.set(form,profile.birth_date);
  form.elements.marketingConsent.checked=profile.marketing_consent;
  document.getElementById("memberSummary").innerHTML=`<p><strong>${escapeHtml(profile.name)}</strong></p><p>${escapeHtml(profile.email)}</p><p>${escapeHtml(profile.phone||"-")}</p>`;
  const{data:items,error}=await MokkanBackend.client.from("inquiries").select("id,created_at,product,status,message").order("created_at",{ascending:false});
  const rows=document.getElementById("mypageInquiryRows"),empty=document.getElementById("emptyMypageInquiries");if(error||!items?.length)empty.hidden=false;else rows.innerHTML=items.map(x=>`<tr><td>${new Date(x.created_at).toLocaleDateString("ko-KR")}</td><td>${escapeHtml(x.product||"문의")}</td><td>${escapeHtml(x.message||"-")}</td><td>${escapeHtml(x.status)}</td></tr>`).join("");
  form.addEventListener("submit",async e=>{e.preventDefault();const d=new FormData(form);const update={name:d.get("name"),birth_date:d.get("birthDate")||null,phone:String(d.get("phone")).replace(/\D/g,""),address:d.get("address"),interest:d.get("interest"),contact_method:d.get("contactMethod"),marketing_consent:d.get("marketingConsent")==="on",updated_at:new Date().toISOString()};const{error}=await MokkanBackend.client.from("profiles").update(update).eq("id",user.id);result.textContent=error?"저장할 수 없습니다: "+error.message:"회원 정보가 저장되었습니다.";});
  document.getElementById("memberLogout").addEventListener("click",async()=>{await MokkanBackend.client.auth.signOut();location.href="./index.html";});
  function escapeHtml(v){const d=document.createElement("div");d.textContent=v??"";return d.innerHTML;}
})();
