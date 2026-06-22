
const STATES=["Australian Capital Territory (ACT)","New South Wales (NSW)","Northern Territory (NT)","Queensland (QLD)","South Australia (SA)","Tasmania (TAS)","Victoria (VIC)","Western Australia (WA)"];
const PROPERTY_TYPES=["House","Apartment","Land","Commercial","Other"];
const BUDGETS=["Less than $300k","$300k–$500k","$500k–$800k","More than $800k"];
const EMPLOYMENT=["Employed","Self Employed","Contract / Temp","Unemployed"];
const MARITAL=["Single","Couple","Married with Children"];
const LOANS=["Less than AUD $100k","AUD $200k – AUD $500k","More than AUD $500k"];
const s={answers:{},history:[],screen:"start"};
const q=new URLSearchParams(location.search).get("start");
const el=document.getElementById("wizardContent"), back=document.getElementById("backBtn"), st=document.getElementById("stepText"), pct=document.getElementById("percentText"), fill=document.getElementById("progressFill");
back.addEventListener("click",()=>{const p=s.history.pop(); if(p) render(p)});
function opt(label,next,value,icon="⌂"){return{label,next,value:value||label,icon}}
function select(key,label,opts,ph){return{kind:"select",key,label,opts,ph,required:true}}
function input(key,label,ph,required=false,type="text"){return{kind:"input",key,label,ph,required,type}}
function textarea(key,label,ph,required=false){return{kind:"textarea",key,label,ph,required}}
function cta(){const a=s.answers;if(a.journey==="finance"||a.support==="finance-guidance")return"Get my Finance Assessment";if(a.journey==="conveyancing"||["contract","transfer","legal-support"].includes(a.support))return"Submit for a Quote";if(["market","planning"].includes(a.support))return"Request 3 Property Comparisons";return"Show Me My Next Step"}
function cfg(screen){
 const supportFound=[opt("Contract / Section 32","contact","contract","⌂"),opt("Market Update","contact","market","↗"),opt("Property Planning","contact","planning","▧"),opt("Finance Guidance","contact","finance-guidance","$"),opt("Other","contact","other","▦")];
 const supportGeneral=[opt("Contract / Section 32","contact","contract","⌂"),opt("Transfer of ownership only","contact","transfer","↗"),opt("Legal Support","contact","legal-support","▧"),opt("Finance Guidance","contact","finance-guidance","$"),opt("Other","contact","other","▦")];
 const screens={
  start:{type:"question",step:1,total:4,title:"What do you need help with today?",key:"journey",options:[opt("I'm buying a property","buying-found","buying","⌂"),opt("I'm selling a property","state-only","selling","↗"),opt("I need finance or refinancing","finance-need","finance","$"),opt("I need conveyancing / legal support","legal-support","conveyancing","⚖")]},
  "buying-found":{type:"question",step:2,total:4,title:"Have you found a property yet?",key:"foundProperty",options:[opt("Yes, I have found a property","state-only","yes","▣"),opt("Not yet, I'm still searching","buying-search","no","⌕")]},
  "state-only":{type:"form",step:2,total:4,title:"Which state is the property in?",fields:[select("propertyState","State",STATES,"Select state")],button:"Continue",next:"after-state"},
  "after-state":{type:"question",step:2,total:4,title:"What support do you need?",key:"support",options:s.answers.journey==="buying"&&s.answers.foundProperty==="yes"?supportFound:supportGeneral},
  "buying-search":{type:"form",step:3,total:4,title:"Tell us what you're looking for.",fields:[select("searchState","State",STATES,"Select state"),select("propertyType","Property Type",PROPERTY_TYPES,"Select type"),input("preferredArea","Preferred suburb or area (optional)","Richmond"),select("budget","Approximate budget range",BUDGETS,"Select budget")],button:"Continue",next:"matters-most"},
  "matters-most":{type:"question",step:2,total:4,title:"What matters most?",key:"priority",options:[opt("School Zone","after-state","school-zone","⌂"),opt("Investment Premium","after-state","investment","↗"),opt("Family Living","after-state","family","▧"),opt("Price","after-state","price","$"),opt("Other","after-state","other-priority","▦")]},
  "other-priority-detail":{type:"form",step:3,total:4,title:"Tell us what matters most.",fields:[textarea("otherPriorityDetails","Please type your other priority","Example: walkability, future growth, lifestyle, low maintenance, renovation potential, or something else.",true)],button:"Continue",next:"after-state"},
  "finance-need":{type:"question",step:2,total:4,title:"What finance help do you need?",key:"financeNeed",options:[opt("Buying a home","finance-situation","buying-home",""),opt("Investment loan","finance-situation","investment-loan",""),opt("Refinance","finance-situation","refinance",""),opt("Pre-approval","finance-situation","pre-approval",""),opt("Other","finance-situation","other-finance","▦")]},
  "finance-situation":{type:"form",step:3,total:4,title:"Tell us a little about your situation.",fields:[select("financeState","State",STATES,"Select state"),select("employment","Employment status",EMPLOYMENT,"Select status"),select("maritalStatus","Married Status",MARITAL,"Select range"),select("loanAmount","Loan Amount",LOANS,"Select")],button:"Continue",next:"contact"},
  "legal-support":{type:"question",step:3,total:5,title:"What support do you need?",key:"legalSupport",options:[opt("Review a Contract / Section 32","property-location","review-contract","▧"),opt("Prepare a Section 32 for my sale","property-location","prepare-section32","✎"),opt("Transfer of ownership only","property-location","transfer-only","⌂"),opt("Settlement support","property-location","settlement","⚖"),opt("I am not sure","property-location","not-sure","⌕")]},
  "property-location":{type:"form",step:3,total:4,title:"Where is the property located?",fields:[select("legalState","State",STATES,"Select state"),select("legalPropertyType","Property Type",PROPERTY_TYPES,"Select type")],button:"Continue",next:"contact"},
  "other-support-detail":{type:"form",step:3,total:4,title:"Tell us what support you need.",fields:[textarea("otherSupportDetails","Please type what you need help with","Example: I need help understanding my property options, timing, documents, or next steps.",true)],button:"Continue",next:"contact"},
  contact:{type:"form",step:4,total:4,title:"Almost there — how can we reach you?",fields:[input("name","Name","Your full name",true,"text"),input("mobile","Mobile","04xx xxx xxx",true,"tel"),input("email","Email","you@example.com",true,"email")],button:cta(),next:"submit"},
 };
 return screens[screen]||screens.start
}
function go(n,push=true){if(push)s.history.push(s.screen);render(n)}
function render(n){s.screen=n;const c=cfg(n);const percent=Math.round((c.step/c.total)*100);st.textContent=`STEP ${c.step} OF ${c.total}`;pct.textContent=`${percent}%`;fill.style.width=`${percent}%`;back.classList.toggle("show",s.history.length>0&&n!=="start");if(c.type==="question")question(c);else form(c);scrollTo(0,0)}
function question(c){
 el.innerHTML=`<h1 class="question-title">${c.title}</h1><div class="options">${c.options.map((o,i)=>`<button class="option-card" data-i="${i}"><span class="icon">${o.icon||"•"}</span><span>${o.label}</span><span class="chev">›</span></button>`).join("")}</div>`;
 el.querySelectorAll(".option-card").forEach(b=>b.onclick=()=>{
  const o=c.options[+b.dataset.i];
  const isOther=o.value==="other"||o.value==="other-priority"||o.value==="other-finance";
  if(!isOther){
   s.answers[c.key]=o.value;
   go(o.next);
   return;
  }
  s.answers[c.key]=o.value;
  const options=el.querySelector(".options");
  let key="otherSupportDetails";
  let label="Please type what you need help with";
  let ph="Example: I need help understanding my property options, timing, documents, or next steps.";
  if(o.value==="other-priority"){
   key="otherPriorityDetails";
   label="Please type your other priority";
   ph="Example: walkability, future growth, lifestyle, low maintenance, renovation potential, or something else.";
  }
  if(o.value==="other-finance"){
   key="otherFinanceDetails";
   label="Please type your finance request";
   ph="Example: bridging finance, equity release, construction loan, debt consolidation, unusual income, or something else.";
  }
  options.querySelectorAll(".inline-other-wrap").forEach(x=>x.remove());
  const wrap=document.createElement("div");
  wrap.className="inline-other-wrap";
  wrap.innerHTML=`<label>${label}</label><textarea id="inlineOtherText" placeholder="${ph}">${s.answers[key]||""}</textarea><div class="error inline-other-error">Please complete this field.</div><button class="inline-other-continue" type="button">Continue <b>→</b></button>`;
  b.insertAdjacentElement("afterend",wrap);
  const ta=wrap.querySelector("#inlineOtherText");
  const er=wrap.querySelector(".inline-other-error");
  wrap.querySelector(".inline-other-continue").onclick=()=>{
   const v=ta.value.trim();
   if(!v){er.style.display="block";return}
   er.style.display="none";
   s.answers[key]=v;
   go(o.next);
  };
  ta.focus();
 })
}
function field(f){
 let inner="";
 if(f.kind==="select"){
  inner=`<select name="${f.key}" ${f.required?"required":""}><option value="">${f.ph}</option>${f.opts.map(o=>`<option>${o}</option>`).join("")}</select>`;
 }else if(f.kind==="textarea"){
  inner=`<textarea name="${f.key}" placeholder="${f.ph}" ${f.required?"required":""}></textarea>`;
 }else{
  inner=`<input name="${f.key}" type="${f.type}" placeholder="${f.ph}" ${f.required?"required":""}>`;
 }
 return`<div class="field"><label>${f.label}</label><div class="input-shell ${f.kind==="textarea"?"textarea-shell":""}">${f.kind==="input"?'<span class="input-icon">◦</span>':""}${inner}</div><div class="error" data-e="${f.key}">Please complete this field.</div></div>`
}
function form(c){el.innerHTML=`<h1 class="question-title">${c.title}</h1><form class="form-grid" id="f">${c.fields.map(field).join("")}<button class="button dark form-button" type="submit">${c.button} <b>→</b></button></form>`;const f=document.getElementById("f");c.fields.forEach(x=>{if(s.answers[x.key])f.elements[x.key].value=s.answers[x.key]});f.onsubmit=e=>{e.preventDefault();let ok=true;c.fields.forEach(x=>{const v=f.elements[x.key].value.trim();s.answers[x.key]=v;const er=f.querySelector(`[data-e="${x.key}"]`);if(x.required&&!v){ok=false;er.style.display="block"}else er.style.display="none"});if(!ok)return;if(c.next==="submit")submitLead();else go(c.next)}}
function submitLead(){
 const lead={...s.answers,cta:cta()};
 const fd=new FormData();
 fd.append("form-name","origin-property-pathway");
 fd.append("_subject","New Origin Property Pathway enquiry");
 fd.append("bot-field","");
 fd.append("name",s.answers.name||"");
 fd.append("mobile",s.answers.mobile||"");
 fd.append("email",s.answers.email||"");
 fd.append("journey",s.answers.journey||"");
 fd.append("support",s.answers.support||s.answers.legalSupport||s.answers.financeNeed||"");
 fd.append("otherSupportDetails",s.answers.otherSupportDetails||"");
 fd.append("otherPriorityDetails",s.answers.otherPriorityDetails||"");
 fd.append("otherFinanceDetails",s.answers.otherFinanceDetails||"");
 fd.append("pathway",JSON.stringify(lead,null,2));

 fetch("https://formspree.io/f/mkolnoka",{
  method:"POST",
  headers:{"Accept":"application/json"},
  body:fd
 }).then((res)=>{
   if(!res.ok) throw new Error("Form submission failed");
   location.href="thank-you.html";
 }).catch((err)=>{
   console.error(err);
   alert("Sorry, your enquiry could not be submitted. Please try again, or email hello@originpropertyconcierge.com.au.");
 })
}
if(q==="buying"){s.answers.journey="buying";render("buying-found")}else if(q==="selling"){s.answers.journey="selling";render("state-only")}else if(q==="finance"){s.answers.journey="finance";render("finance-need")}else if(q==="conveyancing"){s.answers.journey="conveyancing";render("legal-support")}else render("start");
