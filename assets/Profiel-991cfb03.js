import{r,j as e}from"./vendor-44375bc4.js";import{A as _,b as g}from"./index-0c1807ce.js";import{b as N,q as w}from"./queries-d6ace183.js";import{R as a}from"./Rollen-83d067d1.js";const b=t=>{for(let i=0;i<a.rollen.length;i++)if(a.rollen[i].rol===t)return a.rollen[i].kleur;return"#000000"},v=t=>{for(let i=0;i<a.rollen.length;i++)if(a.rollen[i].rol===t)return a.rollen[i].light?"#000000":"#ffffff";return"#ffffff"},L={firstname:"",lastname:"",phone:"",email:"",user_id:"",callname:"",av40id:0,joined:"",eduinstitution:"",birthdate:"",registered:!1},y=()=>{const{authState:t,setAuthState:i}=r.useContext(_),[o,p]=r.useState(""),[c,d]=r.useState(!1),[f,m]=r.useState(""),u=f==="Verzonden!"?"profiel_edit_sent":"profiel_edit_sent_bad",h=N({authState:t,setAuthState:i}),s=w(h,L,"User Info Query Error"),x=async l=>{l.preventDefault();const n={user_id:t.username,new_email:o};try{await g("update/email/send/",n,{authState:t,setAuthState:i}),m("Verzonden!")}catch{}},j=()=>{var l=[];return t.scope.split(" ").forEach(n=>{n!=="member"&&n!=="admin"&&(n==="~2eComCom"?l.push(".ComCom"):n==="NSKMeerkamp"?l.push("NSK Meerkamp"):l.push(n))}),l};return e.jsxs(e.Fragment,{children:[!t.isAuthenticated&&e.jsx("p",{className:"profiel_status",children:"Deze pagina is helaas niet toegankelijk als je niet ingelogd bent. Log in om deze pagina te kunnen bekijken."}),t.isAuthenticated&&e.jsxs("div",{className:"profiel",children:[e.jsx("p",{className:"profiel_naam",children:s.firstname+" "+s.lastname}),e.jsx("div",{className:"profiel_role_list",children:j().map(l=>e.jsx("p",{className:"profiel_role_icon",style:{backgroundColor:b(l),color:v(l)},children:l},l))}),e.jsxs("p",{className:"profiel_info",children:["Geboortedatum: ",new Date(s.birthdate).getDate()+"/"+(new Date(s.birthdate).getMonth()+1)+"/"+new Date(s.birthdate).getFullYear()]}),e.jsxs("p",{className:"profiel_info",children:["Lid sinds: ",new Date(s.joined).getDate()+"/"+(new Date(s.joined).getMonth()+1)+"/"+new Date(s.joined).getFullYear()]}),e.jsxs("div",{className:c?"profiel_hidden":"",children:[e.jsxs("p",{className:"profiel_info",children:["E-mailadres: ",s.email]}),e.jsxs("p",{className:"profiel_info",children:["Telefoonnummer: ",s.phone]}),e.jsxs("p",{className:"profiel_info",children:["Student: ",s.eduinstitution===""?"Nee":"Ja"]}),e.jsxs("p",{className:"profiel_info",children:["Onderwijsinstelling: ",s.eduinstitution]}),e.jsxs("div",{className:"profiel_edit",onClick:()=>d(!0),children:[e.jsx("p",{className:"profiel_edit_text",children:"Wijzig gegevens"}),e.jsx("svg",{className:"profiel_edit_icon",xmlns:"http://www.w3.org/2000/svg",version:"1.1",id:"Layer_1",x:"0px",y:"0px",viewBox:"0 0 117.74 122.88",children:e.jsx("g",{children:e.jsx("path",{d:"M94.62,2c-1.46-1.36-3.14-2.09-5.02-1.99c-1.88,0-3.56,0.73-4.92,2.2L73.59,13.72l31.07,30.03l11.19-11.72 c1.36-1.36,1.88-3.14,1.88-5.02s-0.73-3.66-2.09-4.92L94.62,2L94.62,2L94.62,2z M41.44,109.58c-4.08,1.36-8.26,2.62-12.35,3.98 c-4.08,1.36-8.16,2.72-12.35,4.08c-9.73,3.14-15.07,4.92-16.22,5.23c-1.15,0.31-0.42-4.18,1.99-13.6l7.74-29.61l0.64-0.66 l30.56,30.56L41.44,109.58L41.44,109.58L41.44,109.58z M22.2,67.25l42.99-44.82l31.07,29.92L52.75,97.8L22.2,67.25L22.2,67.25z"})})})]})]}),e.jsx("div",{className:c?"":"profiel_hidden",children:e.jsxs("form",{className:"profiel_edit_info",onSubmit:x,children:[e.jsx("label",{className:"profiel_info",htmlFor:"newEmail",children:"E-mailadres:"}),e.jsx("input",{className:"profiel_input",id:"newEmail",placeholder:"Nieuwe email",type:"text",value:o,onChange:l=>p(l.target.value)}),e.jsxs("p",{className:"profiel_info",children:["Telefoonnummer: ",s.phone]}),e.jsxs("p",{className:"profiel_info",children:["Student: ",s.eduinstitution===""?"Nee":"Ja"]}),e.jsxs("p",{className:"profiel_info",children:["Onderwijsinstelling: ",s.eduinstitution]}),e.jsxs("div",{className:"profiel_edit",onClick:()=>d(!1),children:[e.jsx("p",{className:"profiel_edit_text",children:"Sluit"}),e.jsx("svg",{className:"profiel_edit_icon",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 460.775 460.775",children:e.jsx("path",{d:"M285.08,230.397L456.218,59.27c6.076-6.077,6.076-15.911,0-21.986L423.511,4.565c-2.913-2.911-6.866-4.55-10.992-4.55  c-4.127,0-8.08,1.639-10.993,4.55l-171.138,171.14L59.25,4.565c-2.913-2.911-6.866-4.55-10.993-4.55  c-4.126,0-8.08,1.639-10.992,4.55L4.558,37.284c-6.077,6.075-6.077,15.909,0,21.986l171.138,171.128L4.575,401.505  c-6.074,6.077-6.074,15.911,0,21.986l32.709,32.719c2.911,2.911,6.865,4.55,10.992,4.55c4.127,0,8.08-1.639,10.994-4.55  l171.117-171.12l171.118,171.12c2.913,2.911,6.866,4.55,10.993,4.55c4.128,0,8.081-1.639,10.992-4.55l32.709-32.719 c6.074-6.075,6.074-15.909,0-21.986L285.08,230.397z"})})]}),e.jsx("button",{id:"newEmailSubmit",className:"profiel_button",type:"submit",children:"Verzenden"}),e.jsx("p",{className:u,children:f})]})})]})]})};export{y as default};