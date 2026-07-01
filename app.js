(async function () {
  const form=document.getElementById("contactForm"), result=document.getElementById("contactResult"); if(!form)return;
  const current=await MokkanBackend.user().catch(()=>null), profile= current ? await MokkanBackend.profile().catch(()=>null) : null;
  if(profile){ form.elements.name.value=profile.name||""; form.elements.email.value=profile.email||""; form.elements.phone.value=String(profile.phone||"").replace(/\D/g,""); }
  form.addEventListener("submit",async(e)=>{e.preventDefault(); if(!current){result.textContent="문의 접수는 로그인 후 가능합니다.";return;}
    result.textContent="문의 접수 중입니다…"; const d=new FormData(form);
    const row={user_id:current.id,kind:"contact",name:d.get("name"),email:d.get("email"),phone:String(d.get("phone")||"").replace(/\D/g,""),product:d.get("product"),space:d.get("space"),budget:d.get("budget"),width:d.get("width")||null,depth:d.get("depth")||null,height:d.get("height")||null,wood:d.get("wood"),color:d.get("color"),finish:d.get("finish"),timeline:d.get("timeline"),message:d.get("message")};
    const {error}=await MokkanBackend.client.from("inquiries").insert(row); if(error){result.textContent="접수할 수 없습니다: "+error.message;return;} form.reset(); result.textContent="문의가 안전하게 접수되었습니다.";
  });
})();
