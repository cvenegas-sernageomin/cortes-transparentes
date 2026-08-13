const { useState, useRef } = React;

const APP_VERSION="__APP_VERSION__";

const W = {
  pageBg:"#F5F0E8",sidebarBg:"#EAE3D6",sidebarAct:"#DDD4C2",
  cardBg:"#FBF8F2",inputBg:"#F8F4EC",inputBd:"#C5B49A",
  inputFocus:"#9B7D4A",border:"#D4C8B0",borderSub:"#E2D9CB",
  accentDk:"#7A5C2E",accentMid:"#A07840",accentLt:"#EDE0C8",accentBt:"#C49A52",
  textPri:"#2D2218",textSec:"#6B5A45",textTer:"#9C8A74",
  tabAct:"#7A5C2E",danger:"#B84040",rowAlt:"#F2EBE0",
  altHd:"#7A3A1A",altBg:"#FDF0E8",altBd:"#DDB898",
  infoBtn:"#4A6B8A",infoBtnBg:"#E8F0F8",infoBtnBd:"#B0C8E0",
};

const css=`
.wi{background:${W.inputBg};border:1px solid ${W.inputBd};border-radius:6px;padding:5px 8px;font-size:11px;color:${W.textPri};font-family:inherit;width:100%;box-sizing:border-box;outline:none;transition:border-color .15s}
.wi:focus{border-color:${W.inputFocus};box-shadow:0 0 0 2px ${W.accentLt}}
.wi::placeholder{color:${W.textTer}}
.wi-lg{background:${W.inputBg};border:1px solid ${W.inputBd};border-radius:6px;padding:7px 10px;font-size:12px;color:${W.textPri};font-family:inherit;width:100%;box-sizing:border-box;outline:none;transition:border-color .15s}
.wi-lg:focus{border-color:${W.inputFocus};box-shadow:0 0 0 2px ${W.accentLt}}
.wi-lg::placeholder{color:${W.textTer}}
.wsel{background:${W.inputBg};border:1px solid ${W.inputBd};border-radius:6px;padding:5px 8px;font-size:11px;color:${W.textPri};font-family:inherit;width:100%;box-sizing:border-box;outline:none;cursor:pointer}
.wta{background:${W.inputBg};border:1px solid ${W.inputBd};border-radius:6px;padding:8px 10px;font-size:12px;color:${W.textPri};font-family:inherit;width:100%;box-sizing:border-box;resize:vertical;outline:none;line-height:1.7;transition:border-color .15s}
.wta:focus{border-color:${W.inputFocus};box-shadow:0 0 0 2px ${W.accentLt}}
.wbtn{background:${W.cardBg};border:1px solid ${W.inputBd};border-radius:6px;padding:5px 12px;font-size:12px;color:${W.textSec};font-family:inherit;cursor:pointer;display:inline-flex;align-items:center;gap:5px;transition:background .12s}
.wbtn:hover{background:${W.accentLt};border-color:${W.accentBt};color:${W.accentDk}}
.wbtn:disabled{opacity:.55;cursor:not-allowed}
.wbtn-ai{background:${W.infoBtnBg};border:1px solid ${W.infoBtnBd};border-radius:6px;padding:6px 14px;font-size:12px;color:${W.infoBtn};font-family:inherit;cursor:pointer;display:inline-flex;align-items:center;gap:6px;white-space:nowrap;flex-shrink:0;font-weight:500;transition:background .12s}
.wbtn-ai:hover{background:#D8E8F4}
.wbtn-ai:disabled{opacity:.6;cursor:wait}
.wtab{padding:5px 9px;font-size:11px;border:none;border-bottom:2px solid transparent;background:transparent;cursor:pointer;display:flex;align-items:center;gap:4px;white-space:nowrap;font-family:inherit;transition:color .12s}
`;

const OPT_CHARS=["—","Isótropo","Uniaxial (+)","Uniaxial (−)","Biaxial (+)","Biaxial (−)"];
const RELIEFS=["—","muy bajo","bajo","moderado","alto","muy alto"];
const ALT_DEGS=["—","incipiente (<10%)","leve (10–25%)","moderada (25–50%)","intensa (50–75%)","total (>75%)"];
const TECHNIQUES=["PPL / XPL","Conoscopia","Platina universal","Catodoluminiscencia","SEM-EDX","DRX","Análisis de imagen","Microsonda electrónica"];
const RAMSAY=["—","Isótropo","I","II","III","IV+"];
const OBJ_MAGS=["—","2.5×","4×","5×","10×","20×","40×","50×","100× (inmersión)"];
const SCALE_UNITS=["μm","mm"];
const UTM_ZONES=["17S","18S","19S","20S","21S","17H","18H","19H","20H"];
const ROCK_TYPES=["volcánica","intrusiva","sedimentaria","metamórfica"];
const RTSLUG={"volcánica":"volcanica","intrusiva":"intrusiva","sedimentaria":"sedimentaria","metamórfica":"metamorfica"};
const ROCK_NAMES={
  "volcánica":["Basalto","Andesita basáltica","Andesita","Dacita","Riolita","Traquita","Traquiandesita","Latita","Fonolita","Basanita","Tefrita","Foidita","Pórfido andesítico","Pórfido dacítico","Toba","Ignimbrita","Brecha volcánica","Obsidiana","Pumita"],
  "intrusiva":["Granito","Granodiorita","Tonalita","Diorita","Cuarzodiorita","Gabro","Monzonita","Monzodiorita","Cuarzomonzonita","Sienita","Sienita nefelínica","Peridotita","Piroxenita","Pegmatita","Aplita"],
  "metamórfica":["Pizarra","Filita","Esquisto","Esquisto pelítico","Esquisto verde","Gneiss","Migmatita","Cuarcita","Mármol","Anfibolita","Granulita","Eclogita","Milonita","Corneana (hornfels)","Serpentinita","Skarn"],
  "sedimentaria":["Conglomerado","Brecha sedimentaria","Arenisca","Arcosa","Grauvaca","Limolita","Lutita","Argilita","Caliza","Dolomía","Marga","Chert","Evaporita","Carbón","Diatomita"],
};
const TEXTURES={
  "volcánica":["Afanítica","Porfírica","Glomeroporfírica","Vítrea","Piroclástica","Vesicular","Amigdaloidal","Pilotaxítica","Hialopilítica","Traquítica","Intersertal","Esferulítica","Perlítica","Fluidal"],
  "intrusiva":["Fanerítica equigranular","Fanerítica inequigranular","Porfídica","Poikilítica","Ofítica","Subofítica","Pegmatítica","Aplítica","Cumulática","Gráfica (granófira)","Rapakivi"],
  "metamórfica":["Granoblástica","Lepidoblástica","Nematoblástica","Granolepidoblástica","Porfidoblástica","Poikiloblástica","Pizarrosa","Esquistosa","Gnéisica","Milonítica","Decusada (corneana)","Bandeada"],
  "sedimentaria":["Clástica","Detrítica","Bioclástica","Oolítica","Cristalina","Pelítica","Psamítica","Psefítica","Laminada","Gradada","Masiva"],
};
const STRUCTURES={
  "volcánica":["Masiva","Vesicular","Amigdaloidal","Bandeada (fluidal)","Columnar","Almohadillada (pillow)","Brechosa","Fragmental (piroclástica)"],
  "intrusiva":["Masiva","Bandeada (layering ígneo)","Foliación magmática","Con enclaves máficos","Con xenolitos","Miarolítica"],
  "sedimentaria":["Masiva","Laminación paralela","Laminación cruzada","Laminación gradada","Bioturbada","Nodular","Estratificada","Con grietas de desecación","Con estilolitos"],
  "metamórfica":["Masiva (sin foliación)","Pizarrosidad","Esquistosidad","Bandeamiento gnéisico","Foliación milonítica","Lineación mineral","Lineación de estiramiento","Crenulación"],
};
const MINERALS_TYPICAL={
  "volcánica":{essential:["Plagioclasa","Sanidina","Cuarzo","Olivino","Augita","Hiperstena","Hornblenda","Biotita","Vidrio volcánico","Leucita","Nefelina"],accessory:["Magnetita","Ilmenita","Apatito","Circón","Titanita"]},
  "intrusiva":{essential:["Cuarzo","Ortoclasa","Microclina","Plagioclasa","Nefelina","Olivino","Augita","Hiperstena","Hornblenda","Biotita","Moscovita"],accessory:["Apatito","Circón","Magnetita","Ilmenita","Titanita","Allanita","Granate"]},
  "sedimentaria":{essential:["Cuarzo monocristalino","Cuarzo policristalino","Feldespato potásico","Plagioclasa","Fragmentos líticos volcánicos","Fragmentos líticos metamórficos","Fragmentos líticos sedimentarios","Micrita","Esparita","Bioclastos","Ooides","Peloides","Intraclastos"],accessory:["Circón","Turmalina","Granate","Glauconita","Minerales pesados"]},
  "metamórfica":{essential:["Cuarzo","Feldespato potásico","Plagioclasa","Moscovita/Sericita","Biotita","Clorita","Granate","Estaurolita","Cianita","Sillimanita","Andalucita","Cordierita","Hornblenda","Glaucofano","Actinolita","Diópsido","Onfacita","Epidota","Talco","Serpentina","Calcita/Dolomita","Wollastonita","Grafito"],accessory:["Circón","Apatito","Rutilo","Titanita","Turmalina","Ilmenita"]},
};
const ALTERATION_TYPES={
  "volcánica":["Propilitización","Argílica","Argílica avanzada","Silicificación","Cloritización","Zeolitización","Devitrificación","Palagonitización"],
  "intrusiva":["Sericitización","Cloritización","Epidotización","Saussuritización","Uralitización","Caolinización","Serpentinización","Carbonatización"],
  "sedimentaria":["Cementación","Disolución","Dolomitización","Silicificación","Piritización","Compactación/estilolitización","Recristalización","Neomorfismo"],
  "metamórfica":["Cloritización retrógrada","Sericitización","Saussuritización","Uralitización","Serpentinización","Silicificación","Carbonatización"],
};
const HABIT_TERMS=["Euhedral","Subhedral","Anhedral","Tabular","Prismático","Acicular","Hojoso","Fibroso","Granular"];
const SED_LITHOLOGIES=["Siliciclástica","Carbonática"];
const GRAIN_SIZES=["—","Bloque (>256mm)","Guijarro (4–256mm)","Gránulo (2–4mm)","Arena muy gruesa","Arena gruesa","Arena media","Arena fina","Arena muy fina","Limo","Arcilla"];
const SORTING_DEGS=["—","Muy buena","Buena","Moderada","Pobre","Muy pobre"];
const ROUNDNESS_DEGS=["—","Angular","Subangular","Subredondeado","Redondeado","Muy redondeado"];
const DUNHAM_CATEGORIES=["Mudstone","Wackestone","Packstone","Grainstone","Floatstone","Rudstone","Bafflestone","Bindstone","Framestone","Cristalina (recristalizada)"];
const FACIES_METAMORFICAS=["Zeolita","Prehnita-Pumpellyita","Esquistos verdes","Esquistos azules","Anfibolita","Granulita","Eclogita","Corneana (hornfels)","Sanidinita"];
const METAMORPHIC_GRADES=["—","Bajo","Medio","Alto"];
const VOLCANIC_CLASSIFICATION_NAMES=["Basalto","Andesita basáltica","Andesita","Dacita","Riolita","Traquibasalto","Traquiandesita basáltica","Traquiandesita","Traquita/Traquidacita","Fonotefrita","Tefrifonolita","Fonolita","Basanita/Tefrita","Foidita"];

// ── SHP helpers ──────────────────────────────────────────────────────
const i32BE=(b,o,v)=>{b[o]=(v>>>24)&255;b[o+1]=(v>>>16)&255;b[o+2]=(v>>>8)&255;b[o+3]=v&255;};
const i32LE=(b,o,v)=>{b[o]=v&255;b[o+1]=(v>>>8)&255;b[o+2]=(v>>>16)&255;b[o+3]=(v>>>24)&255;};
const f64LE=(b,o,v)=>{const d=new DataView(new ArrayBuffer(8));d.setFloat64(0,v,true);for(let i=0;i<8;i++)b[o+i]=d.getUint8(i);};
function bldSHP(pts){const n=pts.length,sl=100+n*28,xl=100+n*8;const shp=new Uint8Array(sl),shx=new Uint8Array(xl);const xs=pts.map(p=>p.lon),ys=pts.map(p=>p.lat);const xn=Math.min(...xs),xx=Math.max(...xs),yn=Math.min(...ys),yx=Math.max(...ys);[shp,shx].forEach(b=>{i32BE(b,0,9994);i32LE(b,28,1000);i32LE(b,32,1);f64LE(b,36,xn);f64LE(b,44,yn);f64LE(b,52,xx);f64LE(b,60,yx);});i32BE(shp,24,sl/2);i32BE(shx,24,xl/2);let wo=50;pts.forEach((pt,i)=>{const bo=100+i*28;i32BE(shp,bo,i+1);i32BE(shp,bo+4,10);i32LE(shp,bo+8,1);f64LE(shp,bo+12,pt.lon);f64LE(shp,bo+20,pt.lat);const so=100+i*8;i32BE(shx,so,wo);i32BE(shx,so+4,10);wo+=14;});return{shp,shx};}
function bldDBF(recs,fd){const enc=new TextEncoder();const hdr=32+fd.length*32+1,rsz=1+fd.reduce((a,f)=>a+f.len,0);const buf=new Uint8Array(hdr+recs.length*rsz);buf[0]=3;const now=new Date();buf[1]=now.getFullYear()-1900;buf[2]=now.getMonth()+1;buf[3]=now.getDate();i32LE(buf,4,recs.length);buf[8]=hdr&255;buf[9]=(hdr>>8)&255;buf[10]=rsz&255;buf[11]=(rsz>>8)&255;let fo=32,dO=1;fd.forEach(f=>{const nm=enc.encode(f.name.substring(0,10).padEnd(11,'\0'));buf.set(nm,fo);buf[fo+11]=f.type.charCodeAt(0);buf[fo+16]=f.len;buf[fo+17]=f.dec||0;f.dO=dO;dO+=f.len;fo+=32;});buf[fo]=0x0D;recs.forEach((rec,ri)=>{const base=hdr+ri*rsz;buf[base]=0x20;fd.forEach(f=>{let v=String(rec[f.name]||"");v=f.type==='C'?v.substring(0,f.len).padEnd(f.len,' '):v.substring(0,f.len).padStart(f.len,' ');buf.set(enc.encode(v).slice(0,f.len),base+f.dO);});});return buf;}

// ── UTM WGS84 → geographic ──────────────────────────────────────────
function utmToLL(E,N,zNum,isSouth){
  const k0=0.9996,a=6378137,f=1/298.257223563,b=a*(1-f),e2=1-(b/a)**2;
  const e1=(1-Math.sqrt(1-e2))/(1+Math.sqrt(1-e2));
  const x=E-500000,y=isSouth?N-10000000:N;
  const M=y/k0,mu=M/(a*(1-e2/4-3*e2**2/64-5*e2**3/256));
  const p1=mu+(3*e1/2-27*e1**3/32)*Math.sin(2*mu)+(21*e1**2/16-55*e1**4/32)*Math.sin(4*mu)+(151*e1**3/96)*Math.sin(6*mu);
  const sp=Math.sin(p1),cp=Math.cos(p1),tp=sp/cp;
  const N1=a/Math.sqrt(1-e2*sp**2),T1=tp**2,C1=e2/(1-e2)*cp**2,R1=a*(1-e2)/(1-e2*sp**2)**1.5,D=x/(N1*k0);
  const lat=p1-(N1*tp/R1)*(D**2/2-(5+3*T1+10*C1-4*C1**2-9*e2/(1-e2))*D**4/24+(61+90*T1+298*C1+45*T1**2-252*e2/(1-e2)-3*C1**2)*D**6/720);
  const lon0=((zNum-1)*6-180+3)*Math.PI/180;
  const lon=lon0+(D-(1+2*T1+C1)*D**3/6+(5-2*C1+28*T1-3*C1**2+8*e2/(1-e2)+24*T1**2)*D**5/120)/cp;
  return{lat:lat*180/Math.PI,lon:lon*180/Math.PI};
}
const parseUTM=m=>{const E=parseFloat(m.este),N=parseFloat(m.norte),z=(m.zona||"19S").match(/(\d+)([SNsn]?)/);if(!E||!N||!z)return null;return utmToLL(E,N,parseInt(z[1]),(z[2]||"S").toUpperCase()==="S");};

// ── Clasificaciones formales (Streckeisen QAPF / Folk) ───────────────
function classifyQAPF(q,a,p,f){
  q=parseFloat(q)||0;a=parseFloat(a)||0;p=parseFloat(p)||0;f=parseFloat(f)||0;
  if(!q&&!a&&!p&&!f)return "";
  if(f>0&&q>0)return "Q y F no pueden coexistir (roca sobresaturada vs. subsaturada en sílice)";
  if(f>0){
    // Serie feldespatoidea: usa F en vez de Q en el mismo esquema de cortes
    const tot=a+p+f,Pp=p/(a+p||1)*100,Fp=f/tot*100;
    if(Fp<10)return Pp<10?"Sienita cuarzo-alcalifeldespática feldespatoidea":Pp<65?"Sienita feldespatoidea":Pp<90?"Monzonita feldespatoidea":"Monzodiorita/monzogabro feldespatoideo";
    if(Fp<60)return Pp<50?"Sienita nefelínica/leucítica":"Monzosienita feldespatoidea";
    if(Fp<90)return Pp<50?"Foidosienita":"Foidomonzosienita";
    return "Foidolita";
  }
  const tot=q+a+p,Qp=tot?q/tot*100:0,Pp=(a+p)?p/(a+p)*100:0;
  if(Qp>=90)return "Cuarzolita / roca rica en cuarzo";
  if(Qp>=60)return Pp<10?"Granito rico en cuarzo (alcalifeldespático)":Pp<65?"Granito rico en cuarzo":Pp<90?"Granodiorita/tonalita rica en cuarzo":"Cuarzo-tonalita";
  if(Qp>=20)return Pp<10?"Granito alcalifeldespático":Pp<35?"Sienogranito":Pp<65?"Monzogranito":Pp<90?"Granodiorita":"Tonalita";
  if(Qp>=5)return Pp<10?"Cuarzo-sienita alcalifeldespática":Pp<65?"Cuarzo-sienita/monzonita":Pp<90?"Cuarzo-monzodiorita/monzogabro":"Cuarzo-diorita/gabro/anortosita";
  return Pp<10?"Sienita alcalifeldespática":Pp<65?"Sienita/monzonita":Pp<90?"Monzodiorita/monzogabro":"Diorita/gabro/anortosita";
}
function classifyFolkQFL(q,f,l,matrixPct){
  q=parseFloat(q)||0;f=parseFloat(f)||0;l=parseFloat(l)||0;const mx=parseFloat(matrixPct)||0;
  if(!q&&!f&&!l)return "";
  if(mx>=15){
    if(q>=f&&q>=l)return "Grauvaca cuarzosa";
    if(f>=q&&f>=l)return "Grauvaca feldespática";
    return "Grauvaca lítica";
  }
  const tot=q+f+l||1,Qp=q/tot*100;
  if(Qp>=95)return "Cuarzoarenita";
  if(Qp>=75)return f>=l?"Subarcosa":"Sublitarenita";
  const ratio=l?f/l:Infinity;
  if(ratio>3)return "Arcosa";
  if(ratio>1)return "Arcosa lítica";
  if(ratio>1/3)return "Litarenita feldespática";
  return "Litarenita";
}

// ── Glosario de términos petrográficos ────────────────────────────────
const TERM_DEFS={
  "tex-volcanica":{title:"Texturas volcánicas",text:"Afanítica: cristales no distinguibles a simple vista, grano muy fino. Porfírica: fenocristales grandes en una pasta (matriz) más fina. Glomeroporfírica: fenocristales agrupados en cúmulos. Vítrea: dominada por vidrio volcánico sin cristalizar. Piroclástica: formada por fragmentos expulsados en una erupción explosiva. Vesicular: con cavidades dejadas por gases al enfriar. Amigdaloidal: vesículas rellenas por minerales secundarios (calcita, zeolitas, cuarzo). Pilotaxítica: microlitos de plagioclasa con orientación fluidal subparalela en pasta afanítica. Hialopilítica: como la pilotaxítica pero con vidrio intersticial entre microlitos. Traquítica: microlitos de feldespato alineados por flujo. Intersertal: espacios entre microlitos de plagioclasa rellenos por vidrio o minerales máficos sin orientación fluidal. Esferulítica: agregados radiales de cristalitos creciendo desde un núcleo, en vidrios devitrificados. Perlítica: fracturas curvas concéntricas en vidrio por contracción al enfriar. Fluidal: bandas o líneas de flujo por alineación de cristales o vidrio."},
  "tex-intrusiva":{title:"Texturas intrusivas (plutónicas)",text:"Fanerítica equigranular: cristales visibles a simple vista, de tamaño similar. Fanerítica inequigranular: cristales visibles pero de tamaños desiguales. Porfídica: fenocristales en una masa de grano más fino pero aún visible. Poikilítica: cristales pequeños de un mineral incluidos al azar dentro de un cristal grande (oikocristal) de otro mineral. Ofítica: laths de plagioclasa totalmente incluidos dentro de cristales de piroxeno más grandes. Subofítica: como la ofítica pero con inclusión solo parcial. Pegmatítica: cristales muy grandes (varios cm). Aplítica: grano muy fino y equigranular, textura sacaroidal. Cumulática: cristales acumulados por asentamiento gravitacional, con espacios intercumulus. Gráfica (granófira): intercrecimiento de cuarzo y feldespato alcalino en patrón similar a escritura cuneiforme. Rapakivi: fenocristales de feldespato alcalino redondeados rodeados por una corona de plagioclasa."},
  "tex-sedimentaria":{title:"Texturas sedimentarias",text:"Clástica: compuesta por fragmentos (clastos) de roca/mineral preexistentes. Detrítica: sinónimo de clástica, formada por detritos transportados. Bioclástica: compuesta principalmente por fragmentos de organismos (bioclastos). Oolítica: compuesta por ooides (esferas concéntricas precipitadas químicamente). Cristalina: formada por cristales precipitados químicamente (no por granos transportados), típica de carbonatos recristalizados o evaporitas. Pelítica: grano muy fino (limo/arcilla). Psamítica: tamaño arena. Psefítica: tamaño grava o mayor (conglomerados/brechas). Laminada: con capas milimétricas visibles. Gradada: cambio progresivo de tamaño de grano dentro de una capa. Masiva: sin estructura interna visible."},
  "tex-metamorfica":{title:"Texturas metamórficas",text:"Granoblástica: cristales equidimensionales sin orientación preferente (cuarcita, mármol). Lepidoblástica: dominada por minerales laminares orientados (micas, clorita) — da la foliación. Nematoblástica: dominada por minerales prismáticos/aciculares orientados (anfíboles). Granolepidoblástica: mezcla de granos equidimensionales y minerales laminares orientados. Porfidoblástica: cristales grandes (porfidoblastos, ej. granate) en una matriz de grano más fino. Poikiloblástica: porfidoblasto con numerosas inclusiones de otros minerales más pequeños. Pizarrosa: foliación muy fina (pizarras). Esquistosa: foliación gruesa bien desarrollada (esquistos). Gnéisica: bandeamiento composicional milimétrico a centimétrico (gneises). Milonítica: grano reducido por deformación dúctil intensa en zonas de cizalla. Decusada (corneana): cristales entrecruzados al azar sin orientación, típica de corneanas. Bandeada: alternancia de bandas composicionales o texturales."},
  "struct-volcanica":{title:"Estructuras volcánicas",text:"Masiva: sin estructura interna visible. Vesicular: cavidades por escape de gases. Amigdaloidal: vesículas rellenas por minerales secundarios. Bandeada (fluidal): bandas de color/textura por flujo del magma. Columnar: fracturas poligonales de contracción térmica al enfriar. Almohadillada (pillow): lóbulos redondeados por enfriamiento subácueo rápido. Brechosa: fragmentos angulosos de la propia roca en una matriz. Fragmental (piroclástica): compuesta por fragmentos volcánicos expulsados y depositados (tobas, ignimbritas)."},
  "struct-intrusiva":{title:"Estructuras intrusivas",text:"Masiva: homogénea, sin orientación interna. Bandeada (layering ígneo): capas de composición o tamaño de grano distinto por procesos magmáticos (cumulados). Foliación magmática: orientación planar de cristales tabulares formada durante el flujo del magma aún parcialmente fundido. Con enclaves máficos: fragmentos de roca más máfica englobados en el cuerpo intrusivo. Con xenolitos: fragmentos de roca de caja englobados en la intrusión. Miarolítica: cavidades irregulares tapizadas por cristales bien formados, por exsolución de fluidos tardíos."},
  "struct-sedimentaria":{title:"Estructuras sedimentarias",text:"Masiva: sin estructura interna visible. Laminación paralela: capas delgadas planas y paralelas. Laminación cruzada: capas inclinadas que truncan a las inferiores, por migración de formas de fondo. Laminación gradada: cambio progresivo del tamaño de grano dentro de una capa. Bioturbada: estructura original modificada por actividad de organismos. Nodular: concreciones diagenéticas dispersas. Estratificada: organizada en capas diferenciables. Con grietas de desecación: polígonos de contracción por pérdida de agua en ambientes subaéreos. Con estilolitos: suturas irregulares por disolución por presión durante la diagénesis."},
  "struct-metamorfica":{title:"Estructuras metamórficas (tipo de foliación)",text:"Masiva (sin foliación): sin orientación planar visible (corneanas, mármoles puros). Pizarrosidad: foliación muy fina por orientación paralela de filosilicatos microscópicos. Esquistosidad: foliación gruesa y bien desarrollada, minerales visibles a simple vista. Bandeamiento gnéisico: alternancia de bandas félsicas y máficas por segregación de alto grado. Foliación milonítica: producida por deformación dúctil intensa en zonas de cizalla, con reducción de grano. Lineación mineral: alineación paralela de minerales prismáticos/aciculares. Lineación de estiramiento: por elongación de granos durante la deformación. Crenulación: micropliegues en una foliación preexistente."},
  "habito":{title:"Hábito cristalino",text:"Euhedral: cristal con caras cristalinas bien desarrolladas, forma geométrica completa. Subhedral: caras parcialmente desarrolladas, forma reconocible pero incompleta. Anhedral: sin caras propias, forma irregular impuesta por los cristales vecinos. Tabular: forma de tabla o placa aplanada. Prismático: forma alargada con caras paralelas al eje principal. Acicular: forma de aguja, muy alargado y delgado. Hojoso (laminar): se separa en hojas delgadas (micas). Fibroso: agregado de cristales muy delgados tipo fibra. Granular: agregado de granos equidimensionales sin forma cristalina definida."},
  "cristalinidad":{title:"Grado de cristalinidad",text:"Holocristalina: compuesta enteramente por cristales, sin vidrio. Hipocristalina (hipohialina): mezcla de cristales y vidrio volcánico. Holohialina (vítrea): compuesta enteramente por vidrio volcánico, sin cristales."},
  "alt-volcanica":{title:"Tipos de alteración (rocas volcánicas)",text:"Propilitización: alteración de baja temperatura a clorita+epidota+albita+calcita+pirita, halos externos en sistemas hidrotermales. Argílica: alteración a arcillas (caolinita, esmectita) por lixiviación de álcalis. Argílica avanzada: alteración intensa a caolinita/dickita/alunita/pirofilita en ambientes ácidos. Silicificación: reemplazo o relleno por sílice. Cloritización: reemplazo de minerales máficos por clorita. Zeolitización: formación de zeolitas por alteración de vidrio o plagioclasa a baja temperatura. Devitrificación: cristalización del vidrio inestable en agregados microcristalinos con el tiempo. Palagonitización: alteración de vidrio basáltico en contacto con agua a palagonita."},
  "alt-intrusiva":{title:"Tipos de alteración (rocas intrusivas)",text:"Sericitización: reemplazo de feldespatos por sericita. Cloritización: reemplazo de biotita/anfíbol/piroxeno por clorita. Epidotización: formación de epidota a partir de plagioclasa cálcica y minerales máficos. Saussuritización: alteración de plagioclasa a un agregado fino de epidota+albita+sericita+calcita. Uralitización: reemplazo de piroxeno por anfíbol secundario de grano fino. Caolinización: alteración de feldespatos a caolinita. Serpentinización: alteración de olivino/piroxeno a serpentina (rocas ultramáficas). Carbonatización: introducción/reemplazo por carbonatos."},
  "alt-sedimentaria":{title:"Procesos diagenéticos / alteración (rocas sedimentarias)",text:"Cementación: precipitación de minerales en los poros que unen los granos. Disolución: eliminación de granos o cemento, genera porosidad secundaria. Dolomitización: reemplazo de calcita por dolomita. Silicificación: reemplazo por sílice. Piritización: formación/reemplazo por pirita en ambientes reductores. Compactación/estilolitización: reducción de porosidad por presión de sobrecarga (estilolitos). Recristalización: cambio de tamaño/forma de cristales sin cambio de composición. Neomorfismo: transformación mineral con cambio de fábrica, típico en carbonatos."},
  "alt-metamorfica":{title:"Alteración retrógrada (rocas metamórficas)",text:"Cloritización retrógrada: reemplazo de biotita/granate/anfíbol por clorita al enfriar tras el metamorfismo. Sericitización: reemplazo de feldespatos o cianita/andalucita por sericita. Saussuritización: alteración de plagioclasa cálcica a epidota+albita+sericita. Uralitización: reemplazo de piroxeno por anfíbol fibroso secundario. Serpentinización: alteración de olivino/piroxeno en rocas ultramáficas metamorfizadas. Silicificación: introducción de sílice secundaria. Carbonatización: introducción/reemplazo por carbonatos."},
  "grano-sed":{title:"Tamaño de grano, selección y redondez",text:"Tamaño de grano (escala de Wentworth): bloque >256mm, guijarro 4–256mm, gránulo 2–4mm, arena (muy gruesa a muy fina) 0.0625–2mm, limo 0.0039–0.0625mm, arcilla <0.0039mm. Selección (sorting): qué tan uniforme es el tamaño de los granos, de muy buena (casi todos iguales) a muy pobre (mezcla amplia). Redondez: qué tan gastadas están las esquinas de los granos por transporte, de angular (esquinas agudas) a muy redondeado (esquinas totalmente pulidas)."},
  "class-qapf":{title:"Clasificación QAPF (Streckeisen)",text:"Diagrama de la IUGS para nombrar rocas ígneas según los porcentajes modales normalizados de Q (cuarzo), A (feldespato alcalino), P (plagioclasa) y F (feldespatoide) — Q y F son mutuamente excluyentes. El nombre depende de en qué campo del diagrama caiga el punto: más cuarzo (60–90%+) da granitos/rocas ricas en cuarzo; hacia P domina la serie granodiorita→tonalita; hacia A domina sienita/monzonita; con feldespatoide (F>0) se pasa a sienitas feldespatoideas y foidolitas."},
  "class-folk":{title:"Clasificación de Folk (areniscas siliciclásticas)",text:"Clasifica areniscas según proporciones de Q (cuarzo), F (feldespato) y L (fragmentos líticos), y el % de matriz. Con matriz ≥15% es grauvaca (cuarzosa/feldespática/lítica según componente dominante). Con matriz <15%: ≥95% cuarzo = cuarzoarenita; 75–95% con F o L dominante = subarcosa o sublitarenita; <75% se divide por razón feldespato:lítico en arcosa, arcosa lítica, litarenita feldespática o litarenita."},
  "class-dunham":{title:"Clasificación de Dunham (rocas carbonáticas)",text:"Clasifica calizas según la fábrica de depósito (soporte grano vs. matriz) y el % de lodo carbonático (micrita). Mudstone: soportada por lodo, <10% granos. Wackestone: soportada por lodo, ≥10% granos. Packstone: soportada por granos con lodo entre ellos. Grainstone: soportada por granos, sin lodo. Boundstone (Floatstone/Rudstone/Bafflestone/Bindstone/Framestone): componentes ligados durante la depositación (ej. arrecifes)."},
  "class-facies":{title:"Facies metamórficas",text:"Cada facies representa un rango de presión y temperatura, reconocido por una asociación mineral característica. De menor a mayor grado: Zeolita y Prehnita-Pumpellyita (muy bajo grado), Esquistos verdes (bajo grado), Esquistos azules (alta presión/baja temperatura), Anfibolita (grado medio), Granulita (alto grado), Eclogita (alta presión). Corneana (hornfels) y Sanidinita corresponden a metamorfismo de contacto de baja presión."},
  "ramsay":{title:"Orden de birrefringencia (Ramsay / Michel-Lévy)",text:"El color de interferencia bajo nícoles cruzados depende del retardo óptico, que aumenta con el espesor y la birrefringencia del mineral. La carta de Michel-Lévy agrupa estos colores en órdenes: Isótropo (sin color), Orden I (grises a amarillos/rojos pálidos), Orden II (azules y verdes intensos), Orden III (colores pastel, rosados/verdes), Orden IV+ (colores nacarados por superposición de órdenes). Un orden más alto indica mayor birrefringencia del mineral."},
  "v2":{title:"Ángulo 2V",text:"Ángulo entre los dos ejes ópticos de un mineral biaxial, medido por conoscopia. Cercano a 0° indica un mineral casi uniaxial; cercano a 90° indica biaxial con ejes muy separados. El valor y el signo óptico (+/−) ayudan a distinguir minerales con propiedades similares."},
  "pleocroismo":{title:"Pleocroísmo",text:"Cambio de color (o intensidad) de un mineral al rotar la platina bajo luz polarizada plana (PPL), por absorción diferencial según la orientación cristalográfica. Se describe indicando los colores extremos observados (ej. 'pleocroico de amarillo pálido X a verde oliva Z'). Su ausencia también es un dato diagnóstico."},
};

// ── Prompt de IA: hints específicos por tipo de roca ──────────────────
const CLAUDE_MODEL="claude-haiku-4-5-20251001";
const GEMINI_MODEL="gemini-2.5-flash";
const AI_FIELD_HINTS={
  "volcánica":"textura y estructura volcánica, índice de color, % de fenocristales, y clasificación mineralógica/textural (usa nombres como Basalto/Andesita/Dacita/Riolita/Traquita/Fonolita/Basanita según el ensamble mineral observado; NO pidas SiO2 ni una clasificación TAS, no hay datos de geoquímica de roca total en un corte delgado).",
  "intrusiva":"textura y estructura intrusiva, índice de color, % de fenocristales si es porfídica, y una estimación modal normalizada a 100 de Q (cuarzo), A (feldespato alcalino), P (plagioclasa) y F (feldespatoide) para clasificación QAPF (Streckeisen).",
  "sedimentaria":"tamaño de grano dominante, selección (sorting), redondez, % de matriz, tipo de cemento y % de porosidad; si es siliciclástica, estima proporción modal de Q (cuarzo), F (feldespato) y L (fragmentos líticos) para clasificación de Folk; si es carbonática, identifica el tipo de fábrica (Mudstone/Wackestone/Packstone/Grainstone/Boundstone) para clasificación de Dunham. NO uses orden de birrefringencia Ramsay ni ángulo 2V salvo que sean diagnósticos en granos detríticos específicos.",
  "metamórfica":"protolito probable, grado metamórfico (bajo/medio/alto), facies metamórfica (Zeolita/Prehnita-Pumpellyita/Esquistos verdes/Esquistos azules/Anfibolita/Granulita/Eclogita/Corneana/Sanidinita) según los minerales índice observados, y tipo de foliación/estructura (pizarrosidad, esquistosidad, bandeamiento gnéisico, milonítica, etc.).",
};
const AI_MINERALS_SCHEMA=`{
 "minerals":[{"name":"","pct":0,"habit":"","sz":"","cleavage":"","cPPL":"","relief":"","nRefr":"","pleo":"","cXPL":"","ramsay":"","ext":"","twins":"","optChar":"","v2":"","altDeg":"","altType":"","altMins":"","obs":""}]
}`;
const AI_ROCK_SCHEMA=`{
 "rockName":"", "classification":"", "texture":"", "structure":"",
 "colorIndex":"", "phenocrystPct":"",
 "qapf":{"q":0,"a":0,"p":0,"f":0},
 "grainSize":"","sorting":"","roundness":"","matrixPct":0,"cementType":"","porosityPct":0,
 "qfl":{"q":0,"f":0,"l":0},
 "protolith":"","metamorphicGrade":"","facies":"",
 "description":""
}`;

// ── Data ────────────────────────────────────────────────────────────
let uid=2;
const mkS=n=>({
  id:n,name:`Muestra ${n}`,
  meta:{sid:"",fm:"",loc:"",este:"",norte:"",zona:"19S",col:"",date:"",rtype:"volcánica",sedLithology:"Siliciclástica",
        objMag:"—",scaleBar:"",scaleUnit:"μm"},
  ppl:null,xpl:null,
  techniques:["PPL / XPL"],
  texture:"",structure:"",rockName:"",classification:"",desc:"",minerals:[],ai:"",aiParsed:null,
  colorIndex:"",phenocrystPct:"",qapf:{q:"",a:"",p:"",f:""},
  grainSize:"—",sorting:"—",roundness:"—",matrixPct:"",cementType:"",porosityPct:"",qfl:{q:"",f:"",l:""},
  protolith:"",metamorphicGrade:"—",facies:"—",
});
const mkMin=()=>{const m={id:Date.now()};["name","pct","habit","sz","cleavage","cPPL","relief","nRefr","pleo","cXPL","ramsay","ext","twins","v2","altMins","altType","obs"].forEach(k=>m[k]="");m.optChar="—";m.altDeg="—";return m;};

// ── Glosario: contexto + botón "?" ────────────────────────────────────
const HelpCtx=React.createContext(()=>{});
const HelpBtn=({k})=>{
  const open=React.useContext(HelpCtx);
  if(!k)return null;
  return (
    <button type="button" onClick={()=>open(k)} title="¿Qué significa?"
      style={{background:W.infoBtnBg,border:`1px solid ${W.infoBtnBd}`,borderRadius:"50%",color:W.infoBtn,cursor:"pointer",fontSize:9,fontWeight:700,height:15,width:15,minWidth:15,lineHeight:"13px",padding:0,marginLeft:5,fontFamily:"inherit",flexShrink:0}}>?</button>
  );
};
function HelpModal({helpKey,onClose}){
  if(!helpKey)return null;
  const entry=TERM_DEFS[helpKey];
  if(!entry)return null;
  return (
    <div onClick={e=>{if(e.target===e.currentTarget)onClose();}} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:9999,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
      <div style={{background:W.cardBg,borderRadius:"14px 14px 0 0",padding:"20px 20px 18px",maxHeight:"60vh",overflowY:"auto",width:"100%",maxWidth:640,boxSizing:"border-box"}}>
        <h3 style={{margin:"0 0 8px",fontSize:14,fontWeight:600,color:W.accentDk}}>{entry.title}</h3>
        <p style={{margin:"0 0 16px",fontSize:12.5,lineHeight:1.7,color:W.textPri,whiteSpace:"pre-wrap"}}>{entry.text}</p>
        <button className="wbtn" onClick={onClose} style={{width:"100%",justifyContent:"center"}}>Cerrar</button>
      </div>
    </div>
  );
}

// ── Mini components ─────────────────────────────────────────────────
const SH=({label,color=W.accentDk})=><p style={{margin:"0 0 8px",fontSize:10,fontWeight:600,color,textTransform:"uppercase",letterSpacing:"0.06em",borderBottom:`1px solid ${W.borderSub}`,paddingBottom:4}}>{label}</p>;
const Fld=({label,val,onChange,ph="",tp="text",help,list})=>(
  <label style={{display:"flex",flexDirection:"column",gap:3}}>
    <span style={{fontSize:10,fontWeight:500,color:W.textTer,textTransform:"uppercase",letterSpacing:"0.04em",display:"flex",alignItems:"center"}}>{label}<HelpBtn k={help}/></span>
    <input type={tp} className="wi" value={val} onChange={e=>onChange(e.target.value)} placeholder={ph} list={list}/>
  </label>
);
const Sel=({label,val,onChange,opts,help})=>(
  <label style={{display:"flex",flexDirection:"column",gap:3}}>
    <span style={{fontSize:10,fontWeight:500,color:W.textTer,textTransform:"uppercase",letterSpacing:"0.04em",display:"flex",alignItems:"center"}}>{label}<HelpBtn k={help}/></span>
    <select className="wsel" value={val} onChange={e=>onChange(e.target.value)}>{opts.map(o=><option key={o} value={o}>{o}</option>)}</select>
  </label>
);

// ── MineralCard ──────────────────────────────────────────────────────
function MineralCard({min,rtype,onUpd,onDel}){
  const u=(k,v)=>onUpd(min.id,k,v);
  const biax=min.optChar==="Biaxial (+)"||min.optChar==="Biaxial (−)";
  const slug=RTSLUG[rtype]||"volcanica";
  return(
    <div style={{background:W.cardBg,border:`1px solid ${W.border}`,borderRadius:10,marginBottom:12,overflow:"hidden"}}>
      <div style={{background:W.accentLt,padding:"8px 14px",display:"flex",alignItems:"center",gap:10,borderBottom:`1px solid ${W.border}`}}>
        <input className="wi-lg" list={`ts-min-${slug}`} value={min.name} onChange={e=>u("name",e.target.value)} placeholder="Nombre del mineral" style={{flex:1,fontWeight:500,fontSize:13,padding:"5px 9px"}}/>
        <input type="number" className="wi-lg" value={min.pct} onChange={e=>u("pct",e.target.value)} placeholder="%" style={{width:60,textAlign:"right",padding:"5px 8px"}}/>
        <span style={{fontSize:11,color:W.textSec,whiteSpace:"nowrap"}}>% modal</span>
        <button onClick={()=>onDel(min.id)} style={{background:"none",border:"none",cursor:"pointer",color:W.textTer,padding:4,fontSize:15,fontFamily:"inherit"}}><i className="ti ti-trash"/></button>
      </div>
      <div style={{padding:"12px 14px",display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14}}>
        <div><SH label="Morfología"/><div style={{display:"flex",flexDirection:"column",gap:7}}><Fld label="Hábito" val={min.habit} onChange={v=>u("habit",v)} ph="tabular, prismático…" help="habito" list="ts-habit"/><Fld label="Tamaño (mm)" val={min.sz} onChange={v=>u("sz",v)} ph="0.5–2"/><Fld label="Clivaje / fractura" val={min.cleavage} onChange={v=>u("cleavage",v)} ph="{001}, concoidal…"/></div></div>
        <div><SH label="Luz natural (PPL)"/><div style={{display:"flex",flexDirection:"column",gap:7}}><Fld label="Color" val={min.cPPL} onChange={v=>u("cPPL",v)} ph="incoloro, pardo…"/><Sel label="Relief" val={min.relief} onChange={v=>u("relief",v)} opts={RELIEFS}/><Fld label="Índice de refracción" val={min.nRefr} onChange={v=>u("nRefr",v)} ph="nα 1.54, nβ 1.56…"/><Fld label="Pleocroísmo" val={min.pleo} onChange={v=>u("pleo",v)} ph="ausente, débil X→Y…" help="pleocroismo"/></div></div>
        <div><SH label="Nícoles cruzados (XPL)"/><div style={{display:"flex",flexDirection:"column",gap:7}}><Fld label="Color interferencia" val={min.cXPL} onChange={v=>u("cXPL",v)} ph="gris I, azul II…"/><Sel label="Orden Ramsay" val={min.ramsay} onChange={v=>u("ramsay",v)} opts={RAMSAY} help="ramsay"/><Fld label="Extinción (tipo / °)" val={min.ext} onChange={v=>u("ext",v)} ph="simétrica 12°, paralela…"/><Fld label="Maclado" val={min.twins} onChange={v=>u("twins",v)} ph="polisintético, Carlsbad…"/></div></div>
      </div>
      <div style={{padding:"10px 14px",borderTop:`1px solid ${W.borderSub}`,background:"rgba(0,0,0,0.018)"}}>
        <SH label="Carácter óptico (conoscopia)"/>
        <div style={{display:"flex",flexWrap:"wrap",gap:10,alignItems:"center"}}>
          {OPT_CHARS.map(oc=><label key={oc} style={{display:"flex",alignItems:"center",gap:5,cursor:"pointer",fontSize:12,color:min.optChar===oc?W.accentDk:W.textSec,fontWeight:min.optChar===oc?500:400}}><input type="radio" name={`oc-${min.id}`} value={oc} checked={min.optChar===oc} onChange={()=>u("optChar",oc)} style={{accentColor:W.accentMid}}/>{oc}</label>)}
          {biax&&<label style={{display:"flex",alignItems:"center",gap:6,marginLeft:4}}><span style={{fontSize:11,color:W.textSec,whiteSpace:"nowrap",display:"flex",alignItems:"center"}}>Ángulo 2V:<HelpBtn k="v2"/></span><input className="wi" value={min.v2} onChange={e=>u("v2",e.target.value)} placeholder="60–80°" style={{width:90}}/></label>}
        </div>
      </div>
      <div style={{padding:"10px 14px",borderTop:`1px solid ${W.altBd}`,background:W.altBg}}>
        <SH label="Alteración" color={W.altHd}/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
          <Sel label="Grado" val={min.altDeg} onChange={v=>u("altDeg",v)} opts={ALT_DEGS}/>
          <Fld label="Tipo de alteración" val={min.altType} onChange={v=>u("altType",v)} ph="hidrotermal, deutérica…" help={`alt-${slug}`} list={`ts-alt-${slug}`}/>
          <Fld label="Minerales de alteración" val={min.altMins} onChange={v=>u("altMins",v)} ph="sericita, calcita, clorita…"/>
        </div>
      </div>
      <div style={{padding:"8px 14px",borderTop:`1px solid ${W.borderSub}`}}>
        <Fld label="Observaciones" val={min.obs} onChange={v=>u("obs",v)} ph="zonación, inclusiones, pseudomorfos, texturas especiales…"/>
      </div>
    </div>
  );
}

// ── ImgZone ──────────────────────────────────────────────────────────
function ImgZone({img,label,onFile,onClear}){
  const inp=useRef();
  return(
    <div style={{flex:1,display:"flex",flexDirection:"column",gap:8,minWidth:0}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span style={{fontSize:11,fontWeight:500,color:W.textSec,textTransform:"uppercase",letterSpacing:"0.06em"}}>{label}</span>
        {img&&<button onClick={onClear} style={{fontSize:11,color:W.danger,background:"none",border:"none",cursor:"pointer",padding:"2px 6px",fontFamily:"inherit",display:"flex",alignItems:"center",gap:3}}><i className="ti ti-x"/> quitar</button>}
      </div>
      <div onClick={()=>!img&&inp.current?.click()} onDrop={e=>{e.preventDefault();const f=e.dataTransfer.files[0];if(f)onFile(f);}} onDragOver={e=>e.preventDefault()}
        style={{flex:1,minHeight:210,border:img?`1px solid ${W.border}`:`1.5px dashed ${W.accentBt}`,borderRadius:10,background:img?W.cardBg:W.inputBg,cursor:img?"default":"pointer",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
        {img?<img src={img.url} alt={label} style={{width:"100%",height:"100%",objectFit:"contain",maxHeight:340}}/>
          :<div style={{textAlign:"center",color:W.textTer,padding:16}}><i className="ti ti-camera" style={{fontSize:32,display:"block",marginBottom:8,color:W.accentBt}} aria-hidden="true"/><span style={{fontSize:12}}>Arrastra o haz clic para subir</span></div>}
      </div>
      <input ref={inp} type="file" accept="image/*" style={{display:"none"}} onChange={e=>{if(e.target.files[0])onFile(e.target.files[0]);e.target.value="";}}/>
      {img&&<button className="wbtn" onClick={()=>inp.current?.click()} style={{fontSize:11,justifyContent:"center"}}><i className="ti ti-replace"/> Cambiar imagen</button>}
    </div>
  );
}

// ── Pautas por tipo de roca (pestaña Descripción) ─────────────────────
function VolcanicFields({s,upd}){
  return(
    <div style={{background:W.cardBg,border:`1px solid ${W.border}`,borderRadius:10,padding:16,display:"flex",flexDirection:"column",gap:14}}>
      <SH label="Pauta ígnea volcánica"/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <Fld label="Índice de color" val={s.colorIndex} onChange={v=>upd({colorIndex:v})} ph="leucocrático, mesocrático, melanocrático…"/>
        <Fld label="% Fenocristales" tp="number" val={s.phenocrystPct} onChange={v=>upd({phenocrystPct:v})} ph="ej. 15"/>
      </div>
      <label style={{display:"flex",flexDirection:"column",gap:5}}>
        <span style={{fontSize:11,fontWeight:500,color:W.textSec}}>Clasificación (mineralógica/textural)</span>
        <input className="wi-lg" list="ts-volcclass" value={s.classification} onChange={e=>upd({classification:e.target.value})} placeholder="Selecciona del listado o escribe…"/>
        <datalist id="ts-volcclass">{VOLCANIC_CLASSIFICATION_NAMES.map(o=><option key={o} value={o}/>)}</datalist>
      </label>
    </div>
  );
}
function IntrusiveFields({s,upd}){
  const q=s.qapf||{};
  const calc=()=>upd({classification:classifyQAPF(q.q,q.a,q.p,q.f)});
  return(
    <div style={{background:W.cardBg,border:`1px solid ${W.border}`,borderRadius:10,padding:16,display:"flex",flexDirection:"column",gap:14}}>
      <SH label="Pauta ígnea intrusiva"/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <Fld label="Índice de color" val={s.colorIndex} onChange={v=>upd({colorIndex:v})} ph="leucocrático, mesocrático, melanocrático…"/>
        <Fld label="% Fenocristales" tp="number" val={s.phenocrystPct} onChange={v=>upd({phenocrystPct:v})} ph="si porfídica"/>
      </div>
      <div>
        <span style={{fontSize:11,fontWeight:500,color:W.textSec,display:"flex",alignItems:"center"}}>Estimación modal Q-A-P-F (%)<HelpBtn k="class-qapf"/></span>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr auto",gap:8,marginTop:5,alignItems:"end"}}>
          <Fld label="Q" tp="number" val={q.q} onChange={v=>upd({qapf:{...q,q:v}})}/>
          <Fld label="A" tp="number" val={q.a} onChange={v=>upd({qapf:{...q,a:v}})}/>
          <Fld label="P" tp="number" val={q.p} onChange={v=>upd({qapf:{...q,p:v}})}/>
          <Fld label="F" tp="number" val={q.f} onChange={v=>upd({qapf:{...q,f:v}})}/>
          <button className="wbtn" onClick={calc} style={{fontSize:11}}>Calcular</button>
        </div>
      </div>
      <label style={{display:"flex",flexDirection:"column",gap:5}}>
        <span style={{fontSize:11,fontWeight:500,color:W.textSec}}>Clasificación (QAPF)</span>
        <input className="wi-lg" value={s.classification} onChange={e=>upd({classification:e.target.value})} placeholder="Resultado de 'Calcular' o escribe manualmente…"/>
      </label>
    </div>
  );
}
function SedimentaryFields({s,upd,updM}){
  const isSilici=s.meta.sedLithology!=="Carbonática";
  const q=s.qfl||{};
  const calc=()=>upd({classification:classifyFolkQFL(q.q,q.f,q.l,s.matrixPct)});
  return(
    <div style={{background:W.cardBg,border:`1px solid ${W.border}`,borderRadius:10,padding:16,display:"flex",flexDirection:"column",gap:14}}>
      <SH label="Pauta sedimentaria"/>
      <Sel label="Litología" val={s.meta.sedLithology} onChange={v=>updM("sedLithology",v)} opts={SED_LITHOLOGIES}/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
        <Sel label="Tamaño de grano" val={s.grainSize} onChange={v=>upd({grainSize:v})} opts={GRAIN_SIZES} help="grano-sed"/>
        <Sel label="Selección" val={s.sorting} onChange={v=>upd({sorting:v})} opts={SORTING_DEGS}/>
        <Sel label="Redondez" val={s.roundness} onChange={v=>upd({roundness:v})} opts={ROUNDNESS_DEGS}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
        <Fld label="% Matriz" tp="number" val={s.matrixPct} onChange={v=>upd({matrixPct:v})}/>
        <Fld label="% Porosidad" tp="number" val={s.porosityPct} onChange={v=>upd({porosityPct:v})}/>
        <Fld label="Tipo de cemento" val={s.cementType} onChange={v=>upd({cementType:v})} ph="silíceo, calcáreo, ferruginoso…" list="ts-cement"/>
      </div>
      <datalist id="ts-cement"><option value="Silíceo"/><option value="Calcáreo"/><option value="Ferruginoso"/><option value="Arcilloso"/><option value="Yesífero"/></datalist>
      {isSilici?(
        <div>
          <span style={{fontSize:11,fontWeight:500,color:W.textSec,display:"flex",alignItems:"center"}}>Estimación modal Q-F-L (%)<HelpBtn k="class-folk"/></span>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr auto",gap:8,marginTop:5,alignItems:"end"}}>
            <Fld label="Q" tp="number" val={q.q} onChange={v=>upd({qfl:{...q,q:v}})}/>
            <Fld label="F" tp="number" val={q.f} onChange={v=>upd({qfl:{...q,f:v}})}/>
            <Fld label="L" tp="number" val={q.l} onChange={v=>upd({qfl:{...q,l:v}})}/>
            <button className="wbtn" onClick={calc} style={{fontSize:11}}>Calcular</button>
          </div>
          <label style={{display:"flex",flexDirection:"column",gap:5,marginTop:10}}>
            <span style={{fontSize:11,fontWeight:500,color:W.textSec}}>Clasificación (Folk)</span>
            <input className="wi-lg" value={s.classification} onChange={e=>upd({classification:e.target.value})} placeholder="Resultado de 'Calcular' o escribe manualmente…"/>
          </label>
        </div>
      ):(
        <Sel label="Clasificación (Dunham)" val={DUNHAM_CATEGORIES.includes(s.classification)?s.classification:DUNHAM_CATEGORIES[0]} onChange={v=>upd({classification:v})} opts={DUNHAM_CATEGORIES} help="class-dunham"/>
      )}
    </div>
  );
}
function MetamorphicFields({s,upd}){
  return(
    <div style={{background:W.cardBg,border:`1px solid ${W.border}`,borderRadius:10,padding:16,display:"flex",flexDirection:"column",gap:14}}>
      <SH label="Pauta metamórfica"/>
      <label style={{display:"flex",flexDirection:"column",gap:5}}>
        <span style={{fontSize:11,fontWeight:500,color:W.textSec}}>Protolito probable</span>
        <input className="wi-lg" list="ts-protolith" value={s.protolith} onChange={e=>upd({protolith:e.target.value})} placeholder="pelita, basalto, caliza…"/>
        <datalist id="ts-protolith"><option value="Pelita/lutita"/><option value="Arenisca"/><option value="Caliza/dolomía"/><option value="Basalto/gabro"/><option value="Andesita/diorita"/><option value="Granito/riolita"/><option value="Peridotita"/><option value="Grauvaca"/></datalist>
      </label>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <Sel label="Grado metamórfico" val={s.metamorphicGrade} onChange={v=>upd({metamorphicGrade:v})} opts={METAMORPHIC_GRADES}/>
        <Sel label="Facies metamórfica" val={s.facies} onChange={v=>upd({facies:v,classification:v!=="—"?v:s.classification})} opts={FACIES_METAMORFICAS} help="class-facies"/>
      </div>
    </div>
  );
}

const TABS=[["imgs","Imágenes","ti-camera"],["meta","Metadatos","ti-info-circle"],["min","Minerales","ti-diamond"],["desc","Descripción","ti-file-text"],["ai","IA","ti-brain"],["rep","Reporte","ti-file-report"],["exp","Exportar","ti-download"]];

// ── App ──────────────────────────────────────────────────────────────
function App(){
  const [samples,setSamples]=useState([mkS(1)]);
  const [aid,setAid]=useState(1);
  const [tab,setTab]=useState("imgs");
  const [busy,setBusy]=useState(false);
  const [expBusy,setExpBusy]=useState(false);
  const [expMsg,setExpMsg]=useState("");
  const [apiKey,setApiKey]=useState(()=>{try{return localStorage.getItem("anthropic_key")||"";}catch(e){return "";}});
  const saveKey=v=>{setApiKey(v);try{localStorage.setItem("anthropic_key",v);}catch(e){}};
  const [geminiKey,setGeminiKey]=useState(()=>{try{return localStorage.getItem("gemini_key")||"";}catch(e){return "";}});
  const saveGeminiKey=v=>{setGeminiKey(v);try{localStorage.setItem("gemini_key",v);}catch(e){}};
  const [aiProvider,setAiProviderState]=useState(()=>{try{return localStorage.getItem("ai_provider")||"anthropic";}catch(e){return "anthropic";}});
  const setAiProvider=v=>{setAiProviderState(v);try{localStorage.setItem("ai_provider",v);}catch(e){}};
  const [helpKey,setHelpKey]=useState(null);

  const s=samples.find(x=>x.id===aid)||samples[0];
  const upd=p=>setSamples(prev=>prev.map(x=>x.id===aid?{...x,...p}:x));
  const updM=(k,v)=>upd({meta:{...s.meta,[k]:v}});

  const loadImg=(type,file)=>{const r=new FileReader();r.onload=e=>{const url=e.target.result;upd({[type]:{url,b64:url.split(",")[1],mime:file.type}});};r.readAsDataURL(file);};
  const addMin=()=>upd({minerals:[...s.minerals,mkMin()]});
  const updMin=(id,k,v)=>upd({minerals:s.minerals.map(m=>m.id===id?{...m,[k]:v}:m)});
  const delMin=id=>upd({minerals:s.minerals.filter(m=>m.id!==id)});
  const toggleTech=t=>upd({techniques:s.techniques.includes(t)?s.techniques.filter(x=>x!==t):[...s.techniques,t]});

  const withCoords=samples.filter(x=>parseUTM(x.meta));

  const callClaude=async(promptMsgs,maxTokens)=>{
    const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json","x-api-key":apiKey,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},body:JSON.stringify({model:CLAUDE_MODEL,max_tokens:maxTokens,messages:[{role:"user",content:promptMsgs}]})});
    const data=await res.json();
    if(data.error){throw new Error(data.error.message||JSON.stringify(data.error));}
    const txt=data.content?.find(b=>b.type==="text")?.text||"";
    let parsed=null;
    try{const jm=txt.match(/\{[\s\S]*\}/);parsed=JSON.parse(jm?jm[0]:txt);}catch(e){parsed=null;}
    return {txt,parsed};
  };

  const callGemini=async(promptMsgs,maxTokens)=>{
    const parts=promptMsgs.map(b=>b.type==="text"?{text:b.text}:{inline_data:{mime_type:b.source.media_type,data:b.source.data}});
    const res=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,{method:"POST",headers:{"Content-Type":"application/json","x-goog-api-key":geminiKey},body:JSON.stringify({contents:[{parts}],generationConfig:{responseMimeType:"application/json",maxOutputTokens:maxTokens}})});
    const data=await res.json();
    if(data.error){throw new Error(data.error.message||JSON.stringify(data.error));}
    const txt=data.candidates?.[0]?.content?.parts?.find(p=>p.text)?.text||"";
    let parsed=null;
    try{const jm=txt.match(/\{[\s\S]*\}/);parsed=JSON.parse(jm?jm[0]:txt);}catch(e){parsed=null;}
    return {txt,parsed};
  };

  const callModel=(promptMsgs,maxTokens)=>aiProvider==="gemini"?callGemini(promptMsgs,maxTokens):callClaude(promptMsgs,maxTokens);

  const callAI=async()=>{
    if(!s.ppl&&!s.xpl){alert("Sube al menos una imagen.");return;}
    const activeKey=aiProvider==="gemini"?geminiKey:apiKey;
    if(!activeKey){alert(aiProvider==="gemini"?"Para usar la descripción con IA, pega tu API key de Gemini en la pestaña IA.":"Para usar la descripción con IA, pega tu API key de Anthropic en la pestaña IA.");setTab("ai");return;}
    setBusy(true);
    try{
      const rtype=s.meta.rtype||"volcánica";
      const imgMsgs=[];
      if(s.ppl){imgMsgs.push({type:"text",text:"Nícoles paralelos (PPL):"});imgMsgs.push({type:"image",source:{type:"base64",media_type:s.ppl.mime,data:s.ppl.b64}});}
      if(s.xpl){imgMsgs.push({type:"text",text:"Nícoles cruzados (XPL):"});imgMsgs.push({type:"image",source:{type:"base64",media_type:s.xpl.mime,data:s.xpl.b64}});}
      const techList=s.techniques.join(", ")||"PPL/XPL";
      const scaleInfo=s.meta.objMag&&s.meta.objMag!=="—"?`Objetivo: ${s.meta.objMag}${s.meta.scaleBar?`, escala visible: ${s.meta.scaleBar} ${s.meta.scaleUnit}`:""}`:s.meta.scaleBar?`Escala visible: ${s.meta.scaleBar} ${s.meta.scaleUnit}`:"";
      const typical=MINERALS_TYPICAL[rtype]||{essential:[],accessory:[]};
      const refCtx=`Referencia para roca ${rtype} (guía de lo plausible, no te limites estrictamente a esto si observas algo distinto): minerales esenciales típicos: ${typical.essential.join(", ")||"—"}; accesorios típicos: ${typical.accessory.join(", ")||"—"}; texturas típicas: ${(TEXTURES[rtype]||[]).join(", ")}; estructuras típicas: ${(STRUCTURES[rtype]||[]).join(", ")}; alteraciones típicas: ${(ALTERATION_TYPES[rtype]||[]).join(", ")}.`;

      // PASO 1: identificar fases minerales (aislado, sin pedirle a la IA que además clasifique la roca)
      const step1Msgs=[...imgMsgs,{type:"text",text:`Eres un petrógrafo experto. Analiza el corte transparente de roca ${rtype} con técnicas: ${techList}.${scaleInfo?` Escala microscópica: ${scaleInfo}.`:""}
${refCtx}

Identifica CADA fase mineral visible en las imágenes (esenciales y accesorias). Para cada una estima: % modal (área aproximada; deben sumar ~100% entre todas), hábito, tamaño (mm), clivaje, color PPL, relief, índice de refracción, pleocroísmo, color interferencia XPL, orden de birrefringencia Ramsay, extinción, maclado, carácter óptico, 2V si aplica, y su alteración (grado, tipo, minerales de alteración, pseudomorfos si hay).

Responde ÚNICAMENTE con un objeto JSON válido (sin texto adicional antes ni después, sin bloques \`\`\`), con exactamente esta forma:
${AI_MINERALS_SCHEMA}`}];
      const {txt:txt1,parsed:parsed1}=await callModel(step1Msgs,1800);
      const minerals=Array.isArray(parsed1?.minerals)?parsed1.minerals:[];

      // PASO 2: evaluación de la roca completa, usando los minerales del paso 1 como contexto ya fijado
      const mineralsSummary=minerals.length?minerals.map(m=>`${m.name||"?"} (${m.pct||"?"}%)`).join(", "):"(no se pudo determinar automáticamente en el paso anterior; estímalo tú directamente de las imágenes)";
      const hint=AI_FIELD_HINTS[rtype]||AI_FIELD_HINTS["volcánica"];
      const step2Msgs=[...imgMsgs,{type:"text",text:`Eres un petrógrafo experto evaluando el mismo corte transparente de roca ${rtype}. Ya identificaste esta mineralogía: ${mineralsSummary}.
${refCtx}

Con base en esa mineralogía y en las imágenes, evalúa la roca en conjunto:
1. Textura y estructura.
2. Específico de esta roca ${rtype}: ${hint}
3. DESCRIPCIÓN integrada (4–6 oraciones, registro académico), coherente con los minerales ya identificados.

Responde ÚNICAMENTE con un objeto JSON válido (sin texto adicional antes ni después, sin bloques \`\`\`), con exactamente esta forma (deja vacíos "" o 0 los campos que no apliquen a este tipo de roca, no cambies la forma del JSON):
${AI_ROCK_SCHEMA}`}];
      const {txt:txt2,parsed:parsed2}=await callModel(step2Msgs,1500);

      if(!parsed2&&!minerals.length){
        upd({ai:[txt1,txt2].filter(Boolean).join("\n\n")||"(sin respuesta)",aiParsed:null});
      }else{
        const rock=parsed2||{};
        // Delega el cálculo de la clasificación formal a las funciones deterministas ya existentes,
        // en vez de confiar en el nombre que la IA proponga por su cuenta.
        if(rtype==="intrusiva"&&rock.qapf){
          const calc=classifyQAPF(rock.qapf.q,rock.qapf.a,rock.qapf.p,rock.qapf.f);
          if(calc)rock.classification=calc;
        }
        if(rtype==="sedimentaria"&&s.meta.sedLithology!=="Carbonática"&&rock.qfl){
          const calc=classifyFolkQFL(rock.qfl.q,rock.qfl.f,rock.qfl.l,rock.matrixPct);
          if(calc)rock.classification=calc;
        }
        upd({ai:rock.description||txt2||txt1||"(sin respuesta)",aiParsed:{...rock,minerals}});
      }
      setTab("ai");
    }catch(e){alert("Error: "+e.message);}
    finally{setBusy(false);}
  };

  const applyAI=(overwrite)=>{
    const p=s.aiParsed; if(!p)return;
    if(overwrite&&!confirm("Esto reemplazará los campos y la lista de minerales actuales. ¿Continuar?"))return;
    const isEmpty=v=>v===undefined||v===null||v===""||v==="—";
    const keep=(cur,val)=>overwrite?(isEmpty(val)?cur:val):(isEmpty(cur)&&!isEmpty(val)?val:cur);
    const patch={
      rockName:keep(s.rockName,p.rockName),classification:keep(s.classification,p.classification),
      texture:keep(s.texture,p.texture),structure:keep(s.structure,p.structure),
      colorIndex:keep(s.colorIndex,p.colorIndex),phenocrystPct:keep(s.phenocrystPct,p.phenocrystPct),
      qapf:overwrite&&p.qapf?p.qapf:s.qapf,
      grainSize:keep(s.grainSize,p.grainSize),sorting:keep(s.sorting,p.sorting),roundness:keep(s.roundness,p.roundness),
      matrixPct:keep(s.matrixPct,p.matrixPct),cementType:keep(s.cementType,p.cementType),porosityPct:keep(s.porosityPct,p.porosityPct),
      qfl:overwrite&&p.qfl?p.qfl:s.qfl,
      protolith:keep(s.protolith,p.protolith),metamorphicGrade:keep(s.metamorphicGrade,p.metamorphicGrade),facies:keep(s.facies,p.facies),
    };
    if(Array.isArray(p.minerals)&&p.minerals.length&&(overwrite||s.minerals.length===0)){
      patch.minerals=p.minerals.map(pm=>({...mkMin(),...pm,id:Date.now()+Math.random()}));
    }
    upd(patch);
  };

  const doExport=async(type)=>{
    if(!withCoords.length){alert("Ninguna muestra tiene coordenadas UTM completas. Ingrésalas en Metadatos (Este, Norte, Zona).");return;}
    setExpBusy(true);setExpMsg(type==="kmz"?"Generando KMZ…":"Generando Shapefile…");
    try{
      const JSZip=window.JSZip;
      if(!JSZip){throw new Error("No se pudo cargar JSZip (revisa tu conexión a internet).");}
      const zip=new JSZip();
      const pts=withCoords.map(x=>({...x,...parseUTM(x.meta)}));
      if(type==="kmz"){
        const marks=pts.map(sx=>{
          const ph=[[sx.ppl,"PPL"],[sx.xpl,"XPL"]].filter(([p])=>p).map(([,l],i)=>`<img src="files/${sx.id}_${i}.jpg" width="280" style="margin:3px"/>`).join("");
          const body=`${ph}<h3>${sx.name}</h3>${sx.meta.fm?`<p><b>Formación:</b> ${sx.meta.fm}</p>`:""}${sx.meta.loc?`<p><b>Localidad:</b> ${sx.meta.loc}</p>`:""}${sx.meta.este?`<p><b>UTM WGS84:</b> ${sx.meta.este}E / ${sx.meta.norte}N / Zona ${sx.meta.zona}</p>`:""}${sx.rockName?`<p><b>Nombre petrográfico:</b> ${sx.rockName}</p>`:""}${sx.texture?`<p><b>Textura:</b> ${sx.texture}</p>`:""}${sx.ai?`<p><b>Descripción IA:</b> ${sx.ai}</p>`:""}${sx.desc?`<p><b>Descripción:</b> ${sx.desc}</p>`:""}`;
          return `<Placemark><name>${sx.name}</name><description><![CDATA[${body}]]></description><Point><coordinates>${sx.lon},${sx.lat},0</coordinates></Point></Placemark>`;
        }).join("\n");
        zip.file("doc.kml",`<?xml version="1.0" encoding="UTF-8"?>\n<kml xmlns="http://www.opengis.net/kml/2.2"><Document><name>Cortes transparentes</name>\n${marks}\n</Document></kml>`);
        const ff=zip.folder("files");
        for(const sx of pts){if(sx.ppl?.b64)ff.file(`${sx.id}_0.jpg`,sx.ppl.b64,{base64:true});if(sx.xpl?.b64)ff.file(`${sx.id}_1.jpg`,sx.xpl.b64,{base64:true});}
        const blob=await zip.generateAsync({type:"blob",mimeType:"application/vnd.google-earth.kmz"});
        const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="cortes_transparentes.kmz";a.click();
        setExpMsg("KMZ descargado correctamente.");
      }else{
        const{shp,shx}=bldSHP(pts);
        const fd=[{name:"ID",type:"C",len:20},{name:"Muestra",type:"C",len:50},{name:"Formacion",type:"C",len:50},{name:"Localidad",type:"C",len:80},{name:"Este_m",type:"C",len:16},{name:"Norte_m",type:"C",len:16},{name:"ZonaUTM",type:"C",len:6},{name:"Fecha",type:"C",len:20},{name:"Colector",type:"C",len:50},{name:"TipoRoca",type:"C",len:30},{name:"NombrePet",type:"C",len:80},{name:"Textura",type:"C",len:80},{name:"Minerales",type:"C",len:200},{name:"Descripcion",type:"C",len:254}];
        const recs=pts.map(sx=>({ID:sx.meta.sid,Muestra:sx.name,Formacion:sx.meta.fm,Localidad:sx.meta.loc,Este_m:sx.meta.este,Norte_m:sx.meta.norte,ZonaUTM:sx.meta.zona,Fecha:sx.meta.date,Colector:sx.meta.col,TipoRoca:sx.meta.rtype,NombrePet:sx.rockName,Textura:sx.texture,Minerales:sx.minerals.map(m=>m.name).filter(Boolean).join(", "),Descripcion:sx.desc||sx.ai||""}));
        const dbf=bldDBF(recs,fd);
        const prj=`GEOGCS["GCS_WGS_1984",DATUM["D_WGS_1984",SPHEROID["WGS_1984",6378137.0,298.257223563]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]]`;
        zip.file("cortes.shp",shp);zip.file("cortes.shx",shx);zip.file("cortes.dbf",dbf);zip.file("cortes.prj",prj);
        const blob=await zip.generateAsync({type:"blob",mimeType:"application/zip"});
        const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="cortes_shp.zip";a.click();
        setExpMsg("Shapefile descargado (.shp/.shx/.dbf/.prj — geográficas WGS84).");
      }
    }catch(e){setExpMsg("Error: "+e.message);}
    finally{setExpBusy(false);}
  };

  const makeReport=()=>{
    const m=s.meta;
    const L=["DESCRIPCIÓN PETROGRÁFICA","=".repeat(46),"",`Muestra: ${s.name}`,m.sid&&`ID: ${m.sid}`,m.fm&&`Formación: ${m.fm}`,m.loc&&`Localidad: ${m.loc}`,(m.este&&m.norte)&&`UTM WGS84: ${m.este}E / ${m.norte}N / Zona ${m.zona}`,m.col&&`Colector/a: ${m.col}`,m.date&&`Fecha: ${m.date}`,`Tipo: ${m.rtype}`,m.rtype==="sedimentaria"&&`Litología: ${m.sedLithology}`,s.techniques.length&&`Técnicas: ${s.techniques.join(", ")}`,m.objMag!=="—"&&`Objetivo: ${m.objMag}`,m.scaleBar&&`Escala en foto: ${m.scaleBar} ${m.scaleUnit}`,""].filter(v=>v!==false&&v!==""&&v!==undefined);
    if(s.rockName)L.push(`Nombre petrográfico: ${s.rockName}`);
    if(s.texture)L.push(`Textura: ${s.texture}`);
    if(s.structure)L.push(`Estructura: ${s.structure}`);
    if(s.classification)L.push(`Clasificación: ${s.classification}`);
    if(s.rockName||s.texture||s.structure||s.classification)L.push("");
    if(m.rtype==="volcánica"||m.rtype==="intrusiva"){
      const q=s.qapf||{};
      const pf=[s.colorIndex&&`índice de color: ${s.colorIndex}`,s.phenocrystPct&&`% fenocristales: ${s.phenocrystPct}`,(q.q||q.a||q.p||q.f)&&`QAPF: Q${q.q||0} A${q.a||0} P${q.p||0} F${q.f||0}`].filter(Boolean);
      if(pf.length)L.push(`Pauta ígnea: ${pf.join("; ")}`,"");
    }
    if(m.rtype==="sedimentaria"){
      const pf=[s.grainSize&&s.grainSize!=="—"&&`grano: ${s.grainSize}`,s.sorting&&s.sorting!=="—"&&`selección: ${s.sorting}`,s.roundness&&s.roundness!=="—"&&`redondez: ${s.roundness}`,s.matrixPct&&`% matriz: ${s.matrixPct}`,s.cementType&&`cemento: ${s.cementType}`,s.porosityPct&&`% porosidad: ${s.porosityPct}`].filter(Boolean);
      if(pf.length)L.push(`Pauta sedimentaria: ${pf.join("; ")}`,"");
    }
    if(m.rtype==="metamórfica"){
      const pf=[s.protolith&&`protolito: ${s.protolith}`,s.metamorphicGrade&&s.metamorphicGrade!=="—"&&`grado: ${s.metamorphicGrade}`,s.facies&&s.facies!=="—"&&`facies: ${s.facies}`].filter(Boolean);
      if(pf.length)L.push(`Pauta metamórfica: ${pf.join("; ")}`,"");
    }
    if(s.minerals.length){L.push("MINERALES:","-".repeat(38));s.minerals.forEach(mn=>{L.push(`\n• ${mn.name||"–"} (${mn.pct||"?"}% modal)`);const mo=[mn.habit&&`hábito: ${mn.habit}`,mn.sz&&`tamaño: ${mn.sz} mm`,mn.cleavage&&`clivaje: ${mn.cleavage}`].filter(Boolean).join(", ");if(mo)L.push(`  Morfología: ${mo}`);const pp=[mn.cPPL&&`color: ${mn.cPPL}`,mn.relief&&mn.relief!=="—"&&`relief: ${mn.relief}`,mn.nRefr&&`n: ${mn.nRefr}`,mn.pleo&&`pleocr.: ${mn.pleo}`].filter(Boolean).join(", ");if(pp)L.push(`  PPL: ${pp}`);const xp=[mn.cXPL&&`color interf.: ${mn.cXPL}`,mn.ramsay&&mn.ramsay!=="—"&&`Ramsay orden ${mn.ramsay}`,mn.ext&&`extinción: ${mn.ext}`,mn.twins&&`maclado: ${mn.twins}`].filter(Boolean).join(", ");if(xp)L.push(`  XPL: ${xp}`);if(mn.optChar&&mn.optChar!=="—")L.push(`  Carácter óptico: ${mn.optChar}${mn.v2?" · 2V: "+mn.v2:""}`);const al=[mn.altDeg&&mn.altDeg!=="—"&&`grado: ${mn.altDeg}`,mn.altType&&`tipo: ${mn.altType}`,mn.altMins&&`minerales: ${mn.altMins}`].filter(Boolean).join("; ");if(al)L.push(`  Alteración: ${al}`);if(mn.obs)L.push(`  Obs.: ${mn.obs}`);});L.push("");}
    if(s.desc)L.push("\nDESCRIPCIÓN:",s.desc);
    return L.join("\n");
  };

  const metaF=[["sid","ID de muestra"],["fm","Formación"],["loc","Localidad"],["col","Colector/a"],["date","Fecha"]];
  const pctSum=Math.round(s.minerals.reduce((a,m)=>a+(parseFloat(m.pct)||0),0));

  return(
    <HelpCtx.Provider value={setHelpKey}>
      <style>{css}</style>
      <HelpModal helpKey={helpKey} onClose={()=>setHelpKey(null)}/>
      <div style={{display:"flex",height:"100vh",fontFamily:"'Helvetica Neue',Arial,sans-serif",fontSize:14,color:W.textPri,overflow:"hidden",background:W.pageBg}}>

        {/* Sidebar */}
        <div style={{width:162,borderRight:`1px solid ${W.border}`,background:W.sidebarBg,display:"flex",flexDirection:"column",flexShrink:0}}>
          <div style={{padding:"12px 10px",borderBottom:`1px solid ${W.border}`}}>
            <p style={{margin:"0 0 8px",fontSize:10,fontWeight:600,color:W.textTer,textTransform:"uppercase",letterSpacing:"0.07em"}}>Muestras</p>
            <button className="wbtn" onClick={()=>{const ns=mkS(uid++);setSamples(p=>[...p,ns]);setAid(ns.id);setTab("imgs");}} style={{width:"100%",justifyContent:"center",padding:"5px 8px"}}><i className="ti ti-plus"/> Nueva muestra</button>
          </div>
          <div style={{flex:1,overflowY:"auto",padding:"5px 0"}}>
            {samples.map(sx=>(
              <div key={sx.id} onClick={()=>setAid(sx.id)} style={{padding:"7px 10px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",gap:4,borderLeft:sx.id===aid?`3px solid ${W.accentMid}`:"3px solid transparent",background:sx.id===aid?W.sidebarAct:"transparent"}}>
                <span style={{fontSize:12,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",color:sx.id===aid?W.accentDk:W.textSec,fontWeight:sx.id===aid?500:400}}>{sx.name}</span>
                {samples.length>1&&<button onClick={e=>{e.stopPropagation();const rem=samples.filter(x=>x.id!==sx.id);setSamples(rem);if(aid===sx.id)setAid(rem[0].id);}} style={{background:"none",border:"none",cursor:"pointer",color:W.textTer,padding:0,fontSize:12,fontFamily:"inherit"}}><i className="ti ti-x"/></button>}
              </div>
            ))}
          </div>
          <div style={{padding:"7px 10px",borderTop:`1px solid ${W.border}`,textAlign:"center"}}>
            <span style={{fontSize:9,color:W.textTer}}>{APP_VERSION}</span>
          </div>
        </div>

        {/* Main */}
        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",minWidth:0}}>
          <div style={{padding:"9px 14px",borderBottom:`1px solid ${W.border}`,display:"flex",alignItems:"center",gap:10,background:W.cardBg}}>
            <input value={s.name} onChange={e=>upd({name:e.target.value})} style={{flex:1,fontSize:14,fontWeight:500,border:"none",background:"transparent",outline:"none",color:W.textPri,minWidth:0,fontFamily:"inherit"}} placeholder="Nombre de la muestra"/>
            <button className="wbtn-ai" onClick={callAI} disabled={busy}><i className="ti ti-brain"/>{busy?"Analizando…":"Descripción con IA"}</button>
          </div>

          <div style={{display:"flex",borderBottom:`1px solid ${W.border}`,background:W.cardBg,overflowX:"auto",flexShrink:0}}>
            {TABS.map(([id,lbl,ic])=>(
              <button key={id} className="wtab" onClick={()=>setTab(id)} style={{borderBottomColor:tab===id?W.tabAct:"transparent",color:tab===id?W.tabAct:W.textTer,fontWeight:tab===id?500:400}}>
                <i className={`ti ${ic}`}/>{lbl}
              </button>
            ))}
          </div>

          <div style={{flex:1,overflow:"auto",padding:14,background:W.pageBg}}>

            {tab==="imgs"&&(
              <div style={{display:"flex",gap:14,height:"calc(100% - 4px)"}}>
                <ImgZone img={s.ppl} label="Nícoles paralelos (PPL)" onFile={f=>loadImg("ppl",f)} onClear={()=>upd({ppl:null})}/>
                <ImgZone img={s.xpl} label="Nícoles cruzados (XPL)" onFile={f=>loadImg("xpl",f)} onClear={()=>upd({xpl:null})}/>
              </div>
            )}

            {tab==="meta"&&(
              <div style={{display:"flex",flexDirection:"column",gap:14,maxWidth:480}}>
                <div style={{background:W.cardBg,border:`1px solid ${W.border}`,borderRadius:10,padding:16}}>
                  <p style={{margin:"0 0 12px",fontSize:11,fontWeight:600,color:W.accentDk,textTransform:"uppercase",letterSpacing:"0.06em"}}>Datos generales</p>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                    {metaF.map(([k,lbl])=>(
                      <label key={k} style={{display:"flex",flexDirection:"column",gap:4}}>
                        <span style={{fontSize:11,fontWeight:500,color:W.textSec}}>{lbl}</span>
                        <input className="wi-lg" value={s.meta[k]} onChange={e=>updM(k,e.target.value)} placeholder={lbl}/>
                      </label>
                    ))}
                    <label style={{display:"flex",flexDirection:"column",gap:4,gridColumn:"1/-1"}}>
                      <span style={{fontSize:11,fontWeight:500,color:W.textSec}}>Tipo de roca</span>
                      <select className="wsel" style={{fontSize:12,padding:"7px 10px"}} value={s.meta.rtype} onChange={e=>updM("rtype",e.target.value)}>
                        {ROCK_TYPES.map(t=><option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>)}
                      </select>
                    </label>
                  </div>
                </div>

                <div style={{background:W.altBg,border:`1px solid ${W.altBd}`,borderRadius:10,padding:16}}>
                  <p style={{margin:"0 0 12px",fontSize:11,fontWeight:600,color:W.altHd,textTransform:"uppercase",letterSpacing:"0.06em"}}><i className="ti ti-map-pin" style={{marginRight:5}}/>Coordenadas UTM WGS84</p>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                    <label style={{display:"flex",flexDirection:"column",gap:4}}>
                      <span style={{fontSize:11,fontWeight:500,color:W.altHd}}>Este (m)</span>
                      <input className="wi-lg" value={s.meta.este} onChange={e=>updM("este",e.target.value)} placeholder="ej. 348500"/>
                    </label>
                    <label style={{display:"flex",flexDirection:"column",gap:4}}>
                      <span style={{fontSize:11,fontWeight:500,color:W.altHd}}>Norte (m)</span>
                      <input className="wi-lg" value={s.meta.norte} onChange={e=>updM("norte",e.target.value)} placeholder="ej. 6052000"/>
                    </label>
                    <label style={{display:"flex",flexDirection:"column",gap:4,gridColumn:"1/-1"}}>
                      <span style={{fontSize:11,fontWeight:500,color:W.altHd}}>Zona UTM</span>
                      <select className="wsel" style={{fontSize:12,padding:"7px 10px"}} value={s.meta.zona} onChange={e=>updM("zona",e.target.value)}>
                        {UTM_ZONES.map(z=><option key={z} value={z}>{z}</option>)}
                      </select>
                    </label>
                  </div>
                </div>

                <div style={{background:W.cardBg,border:`1px solid ${W.border}`,borderRadius:10,padding:16}}>
                  <p style={{margin:"0 0 12px",fontSize:11,fontWeight:600,color:W.accentDk,textTransform:"uppercase",letterSpacing:"0.06em"}}><i className="ti ti-microscope" style={{marginRight:5}}/>Escala microscópica</p>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
                    <label style={{display:"flex",flexDirection:"column",gap:4}}>
                      <span style={{fontSize:11,fontWeight:500,color:W.textSec}}>Objetivo</span>
                      <select className="wsel" style={{fontSize:11,padding:"5px 8px"}} value={s.meta.objMag} onChange={e=>updM("objMag",e.target.value)}>
                        {OBJ_MAGS.map(o=><option key={o} value={o}>{o}</option>)}
                      </select>
                    </label>
                    <label style={{display:"flex",flexDirection:"column",gap:4}}>
                      <span style={{fontSize:11,fontWeight:500,color:W.textSec}}>Escala en foto</span>
                      <input className="wi-lg" style={{fontSize:11,padding:"5px 8px"}} value={s.meta.scaleBar} onChange={e=>updM("scaleBar",e.target.value)} placeholder="ej. 200"/>
                    </label>
                    <label style={{display:"flex",flexDirection:"column",gap:4}}>
                      <span style={{fontSize:11,fontWeight:500,color:W.textSec}}>Unidad</span>
                      <select className="wsel" style={{fontSize:11,padding:"5px 8px"}} value={s.meta.scaleUnit} onChange={e=>updM("scaleUnit",e.target.value)}>
                        {SCALE_UNITS.map(u=><option key={u} value={u}>{u}</option>)}
                      </select>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {tab==="min"&&(
              <div>
                <div style={{marginBottom:12,display:"flex",alignItems:"center",gap:14}}>
                  <button className="wbtn" onClick={addMin}><i className="ti ti-plus"/> Agregar mineral</button>
                  {s.minerals.length>0&&<span style={{fontSize:12,color:pctSum>100?W.danger:W.textSec,fontWeight:500}}>Σ modal = {pctSum}%{pctSum>100?" ⚠":""}</span>}
                </div>
                <datalist id={`ts-min-${RTSLUG[s.meta.rtype]}`}>{[...(MINERALS_TYPICAL[s.meta.rtype]?.essential||[]),...(MINERALS_TYPICAL[s.meta.rtype]?.accessory||[])].map(o=><option key={o} value={o}/>)}</datalist>
                <datalist id={`ts-alt-${RTSLUG[s.meta.rtype]}`}>{(ALTERATION_TYPES[s.meta.rtype]||[]).map(o=><option key={o} value={o}/>)}</datalist>
                <datalist id="ts-habit">{HABIT_TERMS.map(o=><option key={o} value={o}/>)}</datalist>
                {s.minerals.length===0
                  ?<div style={{textAlign:"center",padding:48,color:W.textTer,background:W.cardBg,border:`1px solid ${W.border}`,borderRadius:10}}><i className="ti ti-diamond" style={{fontSize:32,display:"block",marginBottom:10,color:W.accentBt}}/><p style={{margin:"0 0 14px",fontSize:13,color:W.textSec}}>Sin minerales. Agrégalos manualmente o usa la descripción IA.</p></div>
                  :s.minerals.map(mn=><MineralCard key={mn.id} min={mn} rtype={s.meta.rtype} onUpd={updMin} onDel={delMin}/>)
                }
              </div>
            )}

            {tab==="desc"&&(
              <div style={{display:"flex",flexDirection:"column",gap:16,maxWidth:580}}>
                <div style={{background:W.cardBg,border:`1px solid ${W.border}`,borderRadius:10,padding:16}}>
                  <SH label="Técnicas diagnósticas aplicadas"/>
                  <div style={{display:"flex",flexWrap:"wrap",gap:10}}>
                    {TECHNIQUES.map(t=>(
                      <label key={t} style={{display:"flex",alignItems:"center",gap:6,cursor:"pointer",fontSize:12,color:s.techniques.includes(t)?W.accentDk:W.textSec,background:s.techniques.includes(t)?W.accentLt:"transparent",border:`1px solid ${s.techniques.includes(t)?W.accentBt:W.borderSub}`,borderRadius:6,padding:"4px 10px"}}>
                        <input type="checkbox" checked={s.techniques.includes(t)} onChange={()=>toggleTech(t)} style={{accentColor:W.accentMid}}/>{t}
                      </label>
                    ))}
                  </div>
                </div>
                <div style={{background:W.cardBg,border:`1px solid ${W.border}`,borderRadius:10,padding:16,display:"flex",flexDirection:"column",gap:14}}>
                  <label style={{display:"flex",flexDirection:"column",gap:5}}>
                    <span style={{fontSize:11,fontWeight:500,color:W.textSec,display:"flex",alignItems:"center"}}>Nombre petrográfico <span style={{fontWeight:400,color:W.textTer,textTransform:"capitalize",marginLeft:4}}>· {s.meta.rtype}</span></span>
                    <input className="wi-lg" list="ts-rocknames" value={s.rockName} onChange={e=>upd({rockName:e.target.value})} placeholder="Selecciona del listado o escribe…"/>
                    <datalist id="ts-rocknames">{(ROCK_NAMES[s.meta.rtype]||[]).map(o=><option key={o} value={o}/>)}</datalist>
                  </label>
                  <label style={{display:"flex",flexDirection:"column",gap:5}}>
                    <span style={{fontSize:11,fontWeight:500,color:W.textSec,display:"flex",alignItems:"center"}}>Textura <span style={{fontWeight:400,color:W.textTer,textTransform:"capitalize",marginLeft:4}}>· {s.meta.rtype}</span><HelpBtn k={`tex-${RTSLUG[s.meta.rtype]}`}/>{(s.meta.rtype==="volcánica"||s.meta.rtype==="intrusiva")&&<HelpBtn k="cristalinidad"/>}</span>
                    <input className="wi-lg" list="ts-textures" value={s.texture} onChange={e=>upd({texture:e.target.value})} placeholder="Selecciona del listado o escribe…"/>
                    <datalist id="ts-textures">{(TEXTURES[s.meta.rtype]||[]).map(o=><option key={o} value={o}/>)}</datalist>
                  </label>
                  <label style={{display:"flex",flexDirection:"column",gap:5}}>
                    <span style={{fontSize:11,fontWeight:500,color:W.textSec,display:"flex",alignItems:"center"}}>Estructura <span style={{fontWeight:400,color:W.textTer,textTransform:"capitalize",marginLeft:4}}>· {s.meta.rtype}</span><HelpBtn k={`struct-${RTSLUG[s.meta.rtype]}`}/></span>
                    <input className="wi-lg" list="ts-structures" value={s.structure} onChange={e=>upd({structure:e.target.value})} placeholder="Selecciona del listado o escribe…"/>
                    <datalist id="ts-structures">{(STRUCTURES[s.meta.rtype]||[]).map(o=><option key={o} value={o}/>)}</datalist>
                  </label>
                  <label style={{display:"flex",flexDirection:"column",gap:5}}>
                    <span style={{fontSize:11,fontWeight:500,color:W.textSec}}>Descripción petrográfica integrada</span>
                    <textarea className="wta" value={s.desc} onChange={e=>upd({desc:e.target.value})} placeholder="Descripción completa del corte…" rows={9}/>
                  </label>
                </div>
                {s.meta.rtype==="volcánica"&&<VolcanicFields s={s} upd={upd}/>}
                {s.meta.rtype==="intrusiva"&&<IntrusiveFields s={s} upd={upd}/>}
                {s.meta.rtype==="sedimentaria"&&<SedimentaryFields s={s} upd={upd} updM={updM}/>}
                {s.meta.rtype==="metamórfica"&&<MetamorphicFields s={s} upd={upd}/>}
              </div>
            )}

            {tab==="ai"&&(
              <div style={{maxWidth:560}}>
                <div style={{marginBottom:12}}>
                  <span style={{fontSize:11,fontWeight:500,color:W.textSec,display:"block",marginBottom:6}}>Proveedor de IA</span>
                  <div style={{display:"flex",gap:8}}>
                    {[["anthropic","Claude (Anthropic)"],["gemini","Gemini (Google, gratis)"]].map(([id,lbl])=>(
                      <button key={id} onClick={()=>setAiProvider(id)} className="wbtn" style={{fontSize:12,background:aiProvider===id?W.accentLt:undefined,borderColor:aiProvider===id?W.accentBt:undefined,color:aiProvider===id?W.accentDk:undefined,fontWeight:aiProvider===id?500:400}}>{lbl}</button>
                    ))}
                  </div>
                </div>
                {aiProvider==="anthropic"?(
                  <div style={{background:W.infoBtnBg,border:`1px solid ${W.infoBtnBd}`,borderRadius:10,padding:"12px 14px",marginBottom:14}}>
                    <label style={{display:"flex",flexDirection:"column",gap:5}}>
                      <span style={{fontSize:11,fontWeight:600,color:W.infoBtn}}><i className="ti ti-key" style={{marginRight:5}}/>API key de Anthropic (se guarda solo en este navegador)</span>
                      <input className="wi-lg" type="password" value={apiKey} onChange={e=>saveKey(e.target.value)} placeholder="sk-ant-…" style={{fontFamily:"monospace"}}/>
                      <span style={{fontSize:11,color:W.textSec,lineHeight:1.5}}>Obtén tu clave en <b>console.anthropic.com</b> → API Keys. De pago por uso (unos centavos por análisis). No se envía a ningún servidor salvo a la API de Anthropic.</span>
                    </label>
                  </div>
                ):(
                  <div style={{background:W.infoBtnBg,border:`1px solid ${W.infoBtnBd}`,borderRadius:10,padding:"12px 14px",marginBottom:14}}>
                    <label style={{display:"flex",flexDirection:"column",gap:5}}>
                      <span style={{fontSize:11,fontWeight:600,color:W.infoBtn}}><i className="ti ti-key" style={{marginRight:5}}/>API key de Google Gemini (se guarda solo en este navegador)</span>
                      <input className="wi-lg" type="password" value={geminiKey} onChange={e=>saveGeminiKey(e.target.value)} placeholder="AIza…" style={{fontFamily:"monospace"}}/>
                      <span style={{fontSize:11,color:W.textSec,lineHeight:1.5}}>Obtén tu clave gratis en <b>aistudio.google.com/apikey</b> (nivel gratuito sin tarjeta, con límite de solicitudes por minuto/día). No se envía a ningún servidor salvo a la API de Google.</span>
                    </label>
                  </div>
                )}
                {s.ai?(
                  <>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,flexWrap:"wrap",gap:8}}>
                      <span style={{fontSize:12,fontWeight:500,color:W.textSec}}>Sugerencia generada por IA</span>
                      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                        <button className="wbtn" onClick={()=>{upd({desc:s.ai});setTab("desc");}} style={{fontSize:11}}><i className="ti ti-copy"/> Usar como descripción</button>
                        <button className="wbtn" onClick={callAI} disabled={busy} style={{fontSize:11}}><i className="ti ti-refresh"/> Regenerar</button>
                      </div>
                    </div>
                    {s.aiParsed&&(
                      <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}>
                        <button className="wbtn" onClick={()=>applyAI(false)} style={{fontSize:11}}><i className="ti ti-forms"/> Aplicar sugerencias (campos vacíos)</button>
                        <button className="wbtn" onClick={()=>applyAI(true)} style={{fontSize:11,color:W.danger}}><i className="ti ti-replace"/> Reemplazar todo con IA</button>
                      </div>
                    )}
                    <div style={{background:W.cardBg,border:`1px solid ${W.border}`,borderRadius:10,padding:"14px 16px",fontSize:12,lineHeight:1.85,whiteSpace:"pre-wrap",color:W.textPri}}>{s.ai}</div>
                  </>
                ):(
                  <div style={{textAlign:"center",padding:52,color:W.textTer,background:W.cardBg,border:`1px solid ${W.border}`,borderRadius:10}}>
                    <i className="ti ti-brain" style={{fontSize:38,display:"block",marginBottom:14,color:W.accentBt}}/>
                    <p style={{margin:"0 0 18px",fontSize:13,color:W.textSec}}>Sube imágenes PPL y/o XPL y presiona "Descripción con IA".</p>
                    <button className="wbtn-ai" onClick={callAI} disabled={busy||(!s.ppl&&!s.xpl)} style={{margin:"0 auto"}}>{busy?"Analizando…":"Generar descripción"}</button>
                  </div>
                )}
              </div>
            )}

            {tab==="rep"&&(
              <div style={{maxWidth:560}}>
                <div style={{marginBottom:10}}>
                  <button className="wbtn" onClick={()=>navigator.clipboard.writeText(makeReport()).then(()=>alert("Copiado al portapapeles."))}><i className="ti ti-copy"/> Copiar reporte</button>
                </div>
                <pre style={{background:W.cardBg,border:`1px solid ${W.border}`,borderRadius:10,padding:"14px 16px",fontSize:11,fontFamily:"'Courier New',monospace",lineHeight:1.75,whiteSpace:"pre-wrap",wordBreak:"break-word",margin:0,color:W.textPri}}>{makeReport()}</pre>
              </div>
            )}

            {tab==="exp"&&(
              <div style={{maxWidth:500,display:"flex",flexDirection:"column",gap:14}}>
                {[
                  {type:"kmz",icon:"ti-map-pin",title:"Google Earth (KMZ)",desc:"Marcador por muestra con imágenes PPL/XPL, nombre petrográfico y descripción. Coordenadas UTM convertidas a geográficas WGS84 para el archivo."},
                  {type:"shp",icon:"ti-polygon",title:"Shapefile (SHP)",desc:"Capa de puntos WGS84 con tabla de atributos completa (formación, nombre petrográfico, minerales, descripción). Compatible con QGIS y ArcGIS. ZIP con .shp / .shx / .dbf / .prj."},
                ].map(({type,icon,title,desc})=>(
                  <div key={type} style={{background:W.cardBg,border:`1px solid ${W.border}`,borderRadius:10,padding:16}}>
                    <p style={{margin:"0 0 5px",fontSize:13,fontWeight:500,color:W.textPri}}><i className={`ti ${icon}`} style={{marginRight:6}}/>{title}</p>
                    <p style={{margin:"0 0 12px",fontSize:12,color:W.textSec,lineHeight:1.6}}>{desc}</p>
                    <button className="wbtn" onClick={()=>doExport(type)} disabled={expBusy} style={{fontSize:12}}><i className="ti ti-download"/> Exportar {type.toUpperCase()}</button>
                  </div>
                ))}
                {expMsg&&<p style={{fontSize:12,color:W.textSec,padding:"8px 12px",background:W.cardBg,border:`1px solid ${W.border}`,borderRadius:8,margin:0}}>{expMsg}</p>}
                <div style={{background:"#EDF3F8",border:"1px solid #C0D4E8",borderRadius:10,padding:12,fontSize:12,color:"#3A5A7A",lineHeight:1.7}}>
                  <b>Muestras con coordenadas UTM: {withCoords.length} / {samples.length}</b>
                  <div style={{marginTop:4}}>Ingresa <b>Este</b>, <b>Norte</b> y <b>Zona</b> en la pestaña Metadatos. Las coordenadas UTM WGS84 se convierten automáticamente a geográficas para los archivos de exportación.</div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </HelpCtx.Provider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
