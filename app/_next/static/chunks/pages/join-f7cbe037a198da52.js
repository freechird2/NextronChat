(global.webpackChunk_N_E=global.webpackChunk_N_E||[]).push([[233],{4677:(e,r,n)=>{(window.__NEXT_P=window.__NEXT_P||[]).push(["/join",function(){return n(1845)}])},1845:(e,r,n)=>{"use strict";n.r(r),n.d(r,{default:()=>P});var t=n(7599),a=n(5034),o=n(169),i=n(2050),s=n(4246),c=n(7378),u=n(8038),l=n.n(u),m=n(1623),d=n(1058),f=n(9e3),Z=n(6591),p=n(5016),j=n.n(p),h=n(6677),k=n(8662),_=n(2604),g=n(2375),w=n(1320),x=n.n(w),v=n(9853),b=n(3171),y={labelCol:{xs:{span:24},sm:{span:8}},wrapperCol:{xs:{span:24},sm:{span:16}}};const P=function(){var e=(0,h.useRouter)(),r=(0,i.Z)(m.Z.useForm(),1)[0],n=(0,i.Z)(d.ZP.useMessage(),2),u=n[0],p=n[1],w=(0,c.useState)({email:"",password:"",confirm:"",nickname:""}),P=w[0],E=w[1],I=(0,c.useState)({email:!1,password:!1,confirm:!1,nickname:!1}),C=I[0],F=I[1],N=(0,c.useState)(!1),q=N[0],Y=N[1],H=(0,i.Z)((0,v.FV)(b.Tc),2),S=(H[0],H[1]),T=!1,V=function(e){var r=e.currentTarget,n=r.name,i=r.value;E((function(e){return(0,o.Z)((0,a.Z)({},e),(0,t.Z)({},n,i))}))},A=(0,c.useCallback)((function(e,r){return r?r.match(/^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/)?(F((function(e){return(0,o.Z)((0,a.Z)({},e),{email:!0})})),Promise.resolve()):(F((function(e){return(0,o.Z)((0,a.Z)({},e),{email:!1})})),Promise.reject(new Error("\uc62c\ubc14\ub978 \uc774\uba54\uc77c \ud615\uc2dd\uc774 \uc544\ub2d9\ub2c8\ub2e4."))):(F((function(e){return(0,o.Z)((0,a.Z)({},e),{email:!1})})),Promise.reject(new Error("\uc774\uba54\uc77c\uc740 \ud544\uc218 \ud56d\ubaa9\uc785\ub2c8\ub2e4.")))}),[]),B=(0,c.useCallback)((function(e,r){return r?r.length<6||r.length>12?(F((function(e){return(0,o.Z)((0,a.Z)({},e),{password:!1})})),Promise.reject(new Error("\ube44\ubc00\ubc88\ud638\ub294 6~12\uc790\ub85c \uc785\ub825\ud574\uc8fc\uc138\uc694."))):(F((function(e){return(0,o.Z)((0,a.Z)({},e),{password:!0})})),Promise.resolve()):(F((function(e){return(0,o.Z)((0,a.Z)({},e),{password:!1})})),Promise.reject(new Error("\ube44\ubc00\ubc88\ud638\ub294 \ud544\uc218 \ud56d\ubaa9\uc785\ub2c8\ub2e4.")))}),[]),M=(0,c.useCallback)((function(e,n){return r.getFieldValue("password")&&r.getFieldValue("password")!==n?(F((function(e){return(0,o.Z)((0,a.Z)({},e),{confirm:!1})})),Promise.reject(new Error("\ube44\ubc00\ubc88\ud638\uac00 \uc77c\uce58\ud558\uc9c0 \uc54a\uc2b5\ub2c8\ub2e4."))):n.length<6||n.length>12?(F((function(e){return(0,o.Z)((0,a.Z)({},e),{confirm:!1})})),Promise.reject(new Error("\ube44\ubc00\ubc88\ud638\ub294 6~12\uc790\ub85c \uc785\ub825\ud574\uc8fc\uc138\uc694."))):(F((function(e){return(0,o.Z)((0,a.Z)({},e),{confirm:!0})})),Promise.resolve())}),[]),D=(0,c.useCallback)((function(e,r){return r?(F((function(e){return(0,o.Z)((0,a.Z)({},e),{nickname:!0})})),Promise.resolve()):(F((function(e){return(0,o.Z)((0,a.Z)({},e),{nickname:!1})})),Promise.reject(new Error("\ub2c9\ub124\uc784\uc744 \uc785\ub825\ud574\uc8fc\uc138\uc694.")))}),[]),z=(0,c.useCallback)((function(){if(0===r.getFieldError("email").length&&r.getFieldValue("email")){var e=(0,g.IO)((0,g.iH)(_.db,"users"),(0,g.g2)("email"),(0,g.EW)(r.getFieldValue("email")));(0,g.jM)(e,(function(e){e.val()?(F((function(e){return(0,o.Z)((0,a.Z)({},e),{email:!1})})),r.setFields([{name:"email",errors:["\uc0ac\uc6a9\uc911\uc778 \uc774\uba54\uc77c \uc785\ub2c8\ub2e4."]}])):F((function(e){return(0,o.Z)((0,a.Z)({},e),{email:!0})}))}),{onlyOnce:!0})}else F((function(e){return(0,o.Z)((0,a.Z)({},e),{email:!1})}))}),[]),O=function(){u.open({type:"loading",content:"\uc7a0\uc2dc\ub9cc \uae30\ub2e4\ub824\uc8fc\uc138\uc694..",duration:0}),(0,k.Xb)(_.I,P.email,P.password).then((function(){(0,k.e5)(_.I,P.email,P.password).then((function(){Q(_.I.currentUser.uid,P)?(S({uid:_.I.currentUser.uid,email:P.email,nickname:P.nickname}),u.destroy(),e.replace("/home")):u.open({type:"error",content:"\ud68c\uc6d0\uac00\uc785 \uc911 \uc624\ub958\uac00 \ubc1c\uc0dd\ud588\uc2b5\ub2c8\ub2e4."})}))})).catch((function(e){T=!1,u.open({type:"error",content:"\ud68c\uc6d0\uac00\uc785 \uc911 \uc624\ub958\uac00 \ubc1c\uc0dd\ud588\uc2b5\ub2c8\ub2e4."})}))},Q=function(e,r){var n=r.email,t=r.nickname;return!!(e&&n&&t)&&((0,g.t8)((0,g.iH)(_.db,"users/"+e),{email:n,nickname:t,regist_date:x()().format("YYYY-MM-DD HH:mm:ss"),loginYn:"Y"}),!0)};return(0,c.useEffect)((function(){var e=C.email,r=C.password,n=C.confirm,t=C.nickname;Y(!!(e&&r&&n&&t))}),[C]),(0,s.jsxs)(c.Fragment,{children:[(0,s.jsx)(l(),{children:(0,s.jsx)("title",{children:"\ud68c\uc6d0\uac00\uc785"})}),p,(0,s.jsxs)("div",{className:"".concat(j().join_layout),children:[(0,s.jsx)("div",{className:"".concat(j().title," ").concat(j().center),children:"\ud68c\uc6d0\uac00\uc785"}),(0,s.jsxs)(m.Z,(0,o.Z)((0,a.Z)({},y),{className:"".concat(j().join_form),form:r,name:"register",style:{maxWidth:600,paddingRight:100},scrollToFirstError:!0,children:[(0,s.jsx)(m.Z.Item,{name:"email",label:"\uc774\uba54\uc77c",rules:[{validator:A}],children:(0,s.jsx)(f.Z,{name:"email",value:P.email,onChange:V,onBlur:z})}),(0,s.jsx)(m.Z.Item,{name:"password",label:"\ube44\ubc00\ubc88\ud638",rules:[{validator:B}],hasFeedback:!0,children:(0,s.jsx)(f.Z.Password,{name:"password",value:P.password,onChange:V})}),(0,s.jsx)(m.Z.Item,{name:"confirm",label:"\ube44\ubc00\ubc88\ud638 \ud655\uc778",dependencies:["password"],hasFeedback:!0,rules:[{validator:M}],children:(0,s.jsx)(f.Z.Password,{name:"confirm",value:P.confirm,onChange:V})}),(0,s.jsx)(m.Z.Item,{name:"nickname",label:"\ub2c9\ub124\uc784",rules:[{validator:D}],children:(0,s.jsx)(f.Z,{name:"nickname",value:P.nickname,onChange:V})})]})),(0,s.jsxs)("div",{className:"".concat(j().center," ").concat(j().footer),children:[(0,s.jsx)(Z.ZP,{className:"".concat(j().backBtn),onClick:function(){e.push("/login")},children:"\ub4a4\ub85c\uac00\uae30"}),(0,s.jsx)(Z.ZP,{type:"primary",disabled:!q,onClick:function(){q&&(T||(T=!0,O()))},children:"\uac00\uc785\ud558\uae30"})]})]})]})}},3171:(e,r,n)=>{"use strict";n.d(r,{Bt:()=>c,ER:()=>u,Tc:()=>s,ri:()=>o,sJ:()=>i});var t=n(9853),a=n(9224),o=(0,t.cn)({key:"roomId/".concat((0,a.Z)()),default:""}),i=(0,t.cn)({key:"roomTarget/".concat((0,a.Z)()),default:""}),s=(0,t.cn)({key:"user/".concat((0,a.Z)()),default:{uid:"",email:"",nickname:""}}),c=(0,t.cn)({key:"roomDate/".concat((0,a.Z)()),default:""}),u=(0,t.cn)({key:"groupId/".concat((0,a.Z)()),default:""})},5016:e=>{e.exports={join_layout:"join_join_layout__NfyCF",title:"join_title__H4qfa",center:"join_center__8WLgN",join_form:"join_join_form__qrgYY",backBtn:"join_backBtn__QL19W",footer:"join_footer__xptjD"}},2604:(e,r,n)=>{"use strict";n.d(r,{I:()=>u,db:()=>c});var t=n(880),a=n(8662),o=n(2375);const i={apiKey:"AIzaSyAftjPZ4MSu7EAVeQvbSHPHuaaQhJ3JQL4",authDomain:"tokyo-ring-376315.firebaseapp.com",projectId:"tokyo-ring-376315",storageBucket:"tokyo-ring-376315.appspot.com",messagingSenderId:"400820874062",appId:"1:400820874062:web:b196995c4e3ed323a2cc1f",measurementId:"G-6HVY02PMG1"},s=t.ZF(i),c=(0,o.N8)(s),u=(0,a.v0)()},9491:e=>{"use strict";e.exports=require("assert")},4300:e=>{"use strict";e.exports=require("buffer")},6113:e=>{"use strict";e.exports=require("crypto")},2361:e=>{"use strict";e.exports=require("events")},1808:e=>{"use strict";e.exports=require("net")},2781:e=>{"use strict";e.exports=require("stream")},4404:e=>{"use strict";e.exports=require("tls")},7310:e=>{"use strict";e.exports=require("url")},3837:e=>{"use strict";e.exports=require("util")}},e=>{e.O(0,[195,678,259,598,303,774,888,179],(()=>{return r=4677,e(e.s=r);var r}));var r=e.O();_N_E=r}]);