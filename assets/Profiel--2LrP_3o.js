import{r,j as e}from"./vendor-CK6RSgI1.js";import{A as _,b as j}from"./index-EtRTrefm.js";import{b as g,q as N}from"./queries-Cu2MxR5Y.js";import{R as n}from"./Rollen-CKONlSLe.js";const b=s=>{for(let l=0;l<n.rollen.length;l++)if(n.rollen[l].rol===s)return n.rollen[l].kleur;return"#000000"},w=s=>{for(let l=0;l<n.rollen.length;l++)if(n.rollen[l].rol===s)return n.rollen[l].light?"#000000":"#ffffff";return"#ffffff"},E={firstname:"",lastname:"",email:"",user_id:"",joined:"",birthdate:""},y=()=>{const{authState:s,setAuthState:l}=r.useContext(_),[o,d]=r.useState(""),m=t=>{},[c,f]=r.useState(""),p=c==="Verzonden!"?"profiel_edit_sent":"profiel_edit_sent_bad",u=g({authState:s,setAuthState:l}),a=N(u,E,"User Info Query Error"),h=async t=>{t.preventDefault();const i={user_id:s.username,new_email:o};try{await j("update/email/send/",i,{authState:s,setAuthState:l}),f("Verzonden!")}catch{}},x=()=>{var t=[];return s.scope.split(" ").forEach(i=>{i!=="member"&&i!=="admin"&&(i==="~2eComCom"?t.push(".ComCom"):i==="NSKMeerkamp"?t.push("NSK Meerkamp"):t.push(i))}),t};return e.jsxs(e.Fragment,{children:[!s.isAuthenticated&&e.jsx("p",{className:"profiel_status",children:"Deze pagina is helaas niet toegankelijk als je niet ingelogd bent. Log in om deze pagina te kunnen bekijken."}),s.isAuthenticated&&e.jsxs("div",{className:"profiel",children:[e.jsx("p",{className:"profiel_naam",children:a.firstname+" "+a.lastname}),e.jsx("div",{className:"profiel_role_list",children:x().map(t=>e.jsx("p",{className:"profiel_role_icon",style:{backgroundColor:b(t),color:w(t)},children:t},t))}),e.jsxs("p",{className:"profiel_info",children:["Geboortedatum: ",new Date(a.birthdate).getDate()+"/"+(new Date(a.birthdate).getMonth()+1)+"/"+new Date(a.birthdate).getFullYear()]}),e.jsxs("p",{className:"profiel_info",children:["Lid sinds: ",new Date(a.joined).getDate()+"/"+(new Date(a.joined).getMonth()+1)+"/"+new Date(a.joined).getFullYear()]}),e.jsx("div",{className:"",children:e.jsxs("p",{className:"profiel_info",children:["E-mailadres: ",a.email]})}),e.jsx("div",{className:"profiel_hidden",children:e.jsxs("form",{className:"profiel_edit_info",onSubmit:h,children:[e.jsx("label",{className:"profiel_info",htmlFor:"newEmail",children:"E-mailadres:"}),e.jsx("input",{className:"profiel_input",id:"newEmail",placeholder:"Nieuwe email",type:"text",value:o,onChange:t=>d(t.target.value)}),e.jsxs("div",{className:"profiel_edit",onClick:()=>m(),children:[e.jsx("p",{className:"profiel_edit_text",children:"Sluit"}),e.jsx("svg",{className:"profiel_edit_icon",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 460.775 460.775",children:e.jsx("path",{d:"M285.08,230.397L456.218,59.27c6.076-6.077,6.076-15.911,0-21.986L423.511,4.565c-2.913-2.911-6.866-4.55-10.992-4.55  c-4.127,0-8.08,1.639-10.993,4.55l-171.138,171.14L59.25,4.565c-2.913-2.911-6.866-4.55-10.993-4.55  c-4.126,0-8.08,1.639-10.992,4.55L4.558,37.284c-6.077,6.075-6.077,15.909,0,21.986l171.138,171.128L4.575,401.505  c-6.074,6.077-6.074,15.911,0,21.986l32.709,32.719c2.911,2.911,6.865,4.55,10.992,4.55c4.127,0,8.08-1.639,10.994-4.55  l171.117-171.12l171.118,171.12c2.913,2.911,6.866,4.55,10.993,4.55c4.128,0,8.081-1.639,10.992-4.55l32.709-32.719 c6.074-6.075,6.074-15.909,0-21.986L285.08,230.397z"})})]}),e.jsx("button",{id:"newEmailSubmit",className:"profiel_button",type:"submit",children:"Verzenden"}),e.jsx("p",{className:p,children:c})]})})]})]})};export{y as default};