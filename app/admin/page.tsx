"use client";
import Link from "next/link";
import { FormEvent,useCallback,useEffect,useMemo,useState } from "react";
import { Building2,ChevronDown,Globe2,Home,Languages,LayoutDashboard,LockKeyhole,MapPin,Menu,Plus,Search,Settings,Users,Loader2 } from "lucide-react";
import type { CompanyData,CompanySummaryData,PropertyCardData } from "@/lib/api";

import { RichEditor } from "@/components/rich-editor";
import { ImageUploader } from "@/components/image-uploader";

type Option={id:string;name:string;parentId?:string|null};
type Lookups={countries:Option[];cities:Option[];companies:CompanySummaryData[]};
const nav=[[LayoutDashboard,"Dashboard"],[Home,"Properties"],[Building2,"Companies"],[MapPin,"Locations"],[Languages,"Languages"],[Users,"Users"],[Settings,"Site settings"]] as const;
async function adminFetch<T>(path:string,init?:RequestInit):Promise<T>{
  const response=await fetch(`/api/backend/admin/${path}`,{credentials:"include",...init,headers:{"Content-Type":"application/json",...(init?.headers||{})}});
  if(!response.ok){
    const body=await response.json().catch(()=>({}));
    let msg = body.message || body.detail || body.title;
    if (body.errors && typeof body.errors === "object") {
      const errList = Object.entries(body.errors).map(([field, errs]) => `${field}: ${(errs as string[]).join(", ")}`);
      msg = `خطأ في البيانات المُدخلة (${response.status}): ${errList.join(" | ")}`;
    }
    throw new Error(msg || `فشلت العملية برمز الخطأ (${response.status})`);
  }
  return response.status===204?undefined as T:response.json();
}

export default function Admin(){
  const[active,setActive]=useState("Dashboard");const[auth,setAuth]=useState<"loading"|"in"|"out">("loading");const[error,setError]=useState("");
  const[properties,setProperties]=useState<PropertyCardData[]>([]);const[companies,setCompanies]=useState<CompanyData[]>([]);const[lookups,setLookups]=useState<Lookups>({countries:[],cities:[],companies:[]});
  const[showForm,setShowForm]=useState(false);const[search,setSearch]=useState("");const[notice,setNotice]=useState("");
  const[submitting,setSubmitting]=useState(false);

  const load=useCallback(async()=>{const[p,c,l]=await Promise.all([adminFetch<PropertyCardData[]>("properties?locale=en"),adminFetch<CompanyData[]>("companies"),adminFetch<Lookups>("lookups?locale=en")]);setProperties(p);setCompanies(c);setLookups(l);},[]);
  useEffect(()=>{fetch("/api/admin/auth/me",{credentials:"include"}).then(async r=>{if(!r.ok){setAuth("out");return;}setAuth("in");await load().catch(e=>setError(e.message));}).catch(()=>setAuth("out"));},[load]);
  async function login(e:FormEvent<HTMLFormElement>){e.preventDefault();setError("");const data=new FormData(e.currentTarget);const response=await fetch("/api/admin/auth/login",{method:"POST",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify({email:data.get("email"),password:data.get("password")})});if(response.ok){setAuth("in");await load();}else setError("Unable to sign in. Check your credentials and API configuration.");}
  async function createCompany(e:FormEvent<HTMLFormElement>){
    e.preventDefault();setError("");setSubmitting(true);
    const d=new FormData(e.currentTarget);
    try{
      await adminFetch("companies",{method:"POST",body:JSON.stringify({name:d.get("name"),slug:d.get("slug"),legalName:d.get("legalName")||null,logoUrl:d.get("logoUrl")||null,website:d.get("website")||null,email:d.get("email")||null,phone:d.get("phone")||null,address:d.get("address")||null,description:d.get("description")||null,isActive:true})});
      setNotice("Company added successfully.");setShowForm(false);await load();
    }catch(e){setError(e instanceof Error?e.message:"Unable to add company.");}
    finally{setSubmitting(false);}
  }
  async function createProperty(e:FormEvent<HTMLFormElement>){
    e.preventDefault();setError("");
    const d=new FormData(e.currentTarget);
    const title=d.get("title")?.toString().trim();
    if (!title) {
      setError("يرجى إدخال اسم العقار أولاً.");
      return;
    }
    setSubmitting(true);
    const imageUrls=d.getAll("imageUrls").map(x=>x.toString()).filter(Boolean);
    const coverImageUrl=d.get("coverImageUrl")?.toString()||imageUrls[0]||"";
    const isInstallmentAvailable=d.get("isInstallmentAvailable")==="on";
    const downPayment=d.get("downPayment")?Number(d.get("downPayment")):null;
    const installmentYears=d.get("installmentYears")?Number(d.get("installmentYears")):null;
    const monthlyInstallment=d.get("monthlyInstallment")?Number(d.get("monthlyInstallment")):null;
    const countryIdVal=d.get("countryId")?.toString();
    const cityIdVal=d.get("cityId")?.toString();
    const companyIdVal=d.get("companyId")?.toString();

    try{
      await adminFetch("properties",{method:"POST",body:JSON.stringify({
        referenceNumber:d.get("referenceNumber")||null,
        companyId:companyIdVal && companyIdVal !== "" ? companyIdVal : null,
        propertyType:d.get("propertyType")||"Apartment",
        listingPurpose:d.get("listingPurpose")||"Sale",
        price:Number(d.get("price"))||0,
        currency:d.get("currency")||"EGP",
        areaM2:Number(d.get("areaM2"))||0,
        bedrooms:d.get("bedrooms")?Number(d.get("bedrooms")):null,
        bathrooms:d.get("bathrooms")?Number(d.get("bathrooms")):null,
        countryId:countryIdVal && countryIdVal !== "" ? countryIdVal : null,
        cityId:cityIdVal && cityIdVal !== "" ? cityIdVal : null,
        address:d.get("address")||null,
        coverImageUrl:coverImageUrl,
        imageUrls:imageUrls,
        sourceLanguage:"en",
        title:title,
        slug:d.get("slug")||null,
        description:d.get("description")||null,
        isInstallmentAvailable:isInstallmentAvailable,
        downPayment:downPayment,
        installmentYears:installmentYears,
        monthlyInstallment:monthlyInstallment
      })});
      setNotice("تمت إضافة العقار ونشره بنجاح!");
      setShowForm(false);
      await load();
    }catch(e){setError(e instanceof Error?e.message:"تعذر إضافة العقار، يرجى التثبت من البيانات.");}
    finally{setSubmitting(false);}
  }
  const filteredCompanies=useMemo(()=>companies.filter(c=>`${c.name} ${c.legalName||""} ${c.slug}`.toLowerCase().includes(search.toLowerCase())),[companies,search]);
  if(auth!=="in")return <main className="admin-login"><form onSubmit={login}><Link className="admin-brand" href="/en"><strong>NUVEXA</strong><small>ADMINISTRATION</small></Link><div className="login-mark"><LockKeyhole/></div><h1>{auth==="loading"?"Checking your session":"Welcome back"}</h1><p>{auth==="loading"?"Please wait…":"Sign in with your administrator account."}</p>{auth==="out"&&<><label>Email<input name="email" type="email" required/></label><label>Password<input name="password" type="password" required/></label>{error&&<span className="login-error">{error}</span>}<button type="submit">Sign in securely</button></>}</form></main>;
  const available=properties.filter(p=>p.status==="Available").length;
  return <main className="admin-shell" dir="ltr"><aside className="admin-sidebar"><Link className="admin-brand" href="/en"><strong>NUVEXA</strong><small>ADMINISTRATION</small></Link><nav>{nav.map(([Icon,label])=><button key={label} className={active===label?"active":""} onClick={()=>{setActive(label);setShowForm(false);setError("");}}><Icon/>{label}</button>)}</nav><div className="admin-user"><span>ME</span><div><strong>Administrator</strong><small>Authorized user</small></div><ChevronDown/></div></aside><section className="admin-main"><header><button className="admin-menu"><Menu/></button><div><Search/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder={`Search ${active.toLowerCase()}...`}/></div><Link href="/en" target="_blank"><Globe2/> View website</Link></header><div className="admin-content"><div className="admin-title"><div><p>NUVEXA CRM</p><h1>{active}</h1></div>{["Properties","Companies"].includes(active)&&<button onClick={()=>setShowForm(!showForm)}><Plus/> Add {active==="Properties"?"property":"company"}</button>}</div>{notice&&<p className="admin-notice">{notice}</p>}{error&&<p className="admin-error">{error}</p>}
  {active==="Dashboard"&&<><div className="stat-grid">{[["Total properties",properties.length,"Database inventory"],["Available",available,"Ready for sale"],["Companies",companies.length,"Active partners"]].map(x=><article key={x[0]}><span>{x[0]}</span><strong>{x[1]}</strong><small>{x[2]}</small></article>)}</div><PropertyTable properties={properties}/></>}
  {active==="Properties"&&<>{showForm&&<PropertyForm lookups={lookups} onSubmit={createProperty} submitting={submitting}/>}<PropertyTable properties={properties}/></>}
  {active==="Companies"&&<>{showForm&&<CompanyForm onSubmit={createCompany} submitting={submitting}/>}<section className="company-grid">{filteredCompanies.map(c=><article key={c.id}>{c.logoUrl?<img src={c.logoUrl} alt={`${c.name} logo`}/>:<div className="company-logo">{c.name.slice(0,2).toUpperCase()}</div>}<h2>{c.name}</h2><p>{c.description||c.legalName||"No description"}</p><dl><div><dt>Properties</dt><dd>{c.propertyCount}</dd></div><div><dt>Phone</dt><dd>{c.phone||"—"}</dd></div><div><dt>Email</dt><dd>{c.email||"—"}</dd></div></dl>{c.website&&<a href={c.website} target="_blank" rel="noreferrer">Open website</a>}</article>)}</section></>}
  {!['Dashboard','Properties','Companies'].includes(active)&&<div className="module-placeholder"><div><Home/><h2>{active} workspace</h2><p>This module uses protected ASP.NET Core admin endpoints.</p></div></div>}</div></section></main>;
}

import { CopyButton } from "@/components/copy-button";

function PropertyTable({properties}:{properties:PropertyCardData[]}){return <div className="admin-panels single"><section><div className="panel-title"><h2>Properties</h2><span>{properties.length} records</span></div><table><thead><tr><th>PROPERTY</th><th>COMPANY</th><th>LOCATION</th><th>PRICE</th><th>STATUS</th><th>SHARE LINK</th></tr></thead><tbody>{properties.map(p=><tr key={p.id}><td><img src={p.coverImage||"/placeholder-property.svg"} alt=""/><div><strong>{p.title}</strong><small>{p.referenceNumber}</small></div></td><td>{p.company?.name||"Independent"}</td><td>{p.location}</td><td>{new Intl.NumberFormat("en-EG",{style:"currency",currency:p.currency,maximumFractionDigits:0}).format(p.price)}</td><td><span className="status">{p.status}</span></td><td><CopyButton slug={p.slug} variant="admin"/></td></tr>)}</tbody></table></section></div>}
function CompanyForm({onSubmit,submitting}:{onSubmit:(e:FormEvent<HTMLFormElement>)=>void;submitting?:boolean}){return <form className="admin-form" onSubmit={onSubmit}><h2>Add real-estate company</h2><div className="form-grid"><label>Display name<input name="name" required/></label><label>Slug<input name="slug" required pattern="[a-z0-9-]+" placeholder="company-name"/></label><label>Legal name<input name="legalName"/></label><label>Logo URL<input name="logoUrl" type="url"/></label><label>Website<input name="website" type="url"/></label><label>Email<input name="email" type="email"/></label><label>Phone<input name="phone"/></label><label>Address<input name="address"/></label><label className="wide">Description<textarea name="description" rows={3}/></label></div><button type="submit" disabled={submitting}>{submitting?"Saving...":"Save company"}</button></form>}
function PropertyForm({lookups,onSubmit,submitting}:{lookups:Lookups;onSubmit:(e:FormEvent<HTMLFormElement>)=>void;submitting?:boolean}){
  const [images, setImages] = useState<string[]>([]);
  const [coverImage, setCoverImage] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [titleVal, setTitleVal] = useState<string>("");
  const [slugVal, setSlugVal] = useState<string>("");
  const [enableInstallments, setEnableInstallments] = useState<boolean>(false);

  const countriesList = lookups.countries.length > 0 ? lookups.countries : [{ id: "11111111-1111-1111-1111-111111111111", name: "Egypt / مصر" }];
  const citiesList = lookups.cities.length > 0 ? lookups.cities : [{ id: "22222222-2222-2222-2222-222222222222", name: "Cairo / القاهرة" }];

  const handleTitleChange = (val: string) => {
    setTitleVal(val);
    const autoSlug = val.trim().toLowerCase().replace(/[^a-z0-9\u0600-\u06FF]+/g, "-").replace(/^-+|-+$/g, "");
    setSlugVal(autoSlug);
  };

  return <form className="admin-form" onSubmit={onSubmit}>
    <h2>Add new property (إضافة عقار جديد)</h2>
    <div className="form-grid">
      <label className="wide">Title (اسم العقار)<span style={{ color: "#ef4444", marginInlineStart: 4 }}>* (إجباري)</span>
        <input 
          name="title" 
          value={titleVal} 
          onChange={(e) => handleTitleChange(e.target.value)} 
          required 
          placeholder="مثال: شقة للبيع في التجمع الخامس بكومبوند مميز"
        />
      </label>

      <label>Reference Code (الكود المرجعي)<input name="referenceNumber" defaultValue={`REF-${Math.floor(1000 + Math.random() * 9000)}`}/></label>
      <label>Slug (الرابط)<input name="slug" value={slugVal} onChange={(e) => setSlugVal(e.target.value)} placeholder="شقة-للبيع-التجمع"/></label>
      
      <label>Company (الشركة)<select name="companyId"><option value="">Independent / لا ينتمي لشركة</option>{lookups.companies.map(x=><option key={x.id} value={x.id}>{x.name}</option>)}</select></label>
      <label>Type (نوع العقار)<select name="propertyType">{["Apartment","Villa","Duplex","Penthouse","Townhouse","Chalet","Office","Retail","Commercial","Land"].map(x=><option key={x}>{x}</option>)}</select></label>
      <label>Purpose (الغرض)<select name="listingPurpose"><option value="Sale">Sale (بيع)</option><option value="Rent">Rent (إيجار)</option></select></label>
      
      <label>Price (السعر الإجمالي)<input name="price" type="number" min="0" defaultValue="0" placeholder="0"/></label>
      <label>Currency (العملة)<input name="currency" defaultValue="EGP" minLength={3} maxLength={3}/></label>
      <label>Area m² (المساحة م²)<input name="areaM2" type="number" min="0" defaultValue="0" placeholder="0"/></label>

      <label>Bedrooms (الغرف)<input name="bedrooms" type="number" min="0" placeholder="اختياري"/></label>
      <label>Bathrooms (الحمامات)<input name="bathrooms" type="number" min="0" placeholder="اختياري"/></label>

      <label>Country (البلد)<select name="countryId">{countriesList.map(x=><option key={x.id} value={x.id}>{x.name}</option>)}</select></label>
      <label>City (المدينة)<select name="cityId">{citiesList.map(x=><option key={x.id} value={x.id}>{x.name}</option>)}</select></label>
      
      <label className="wide">Address / Detailed Location (العنوان المباشر)<input name="address" placeholder="مثال: الحي الخامس - ش الستين - بالقرب من المحور"/></label>

      <div className="wide" style={{ background: "#f8fafc", padding: "16px", borderRadius: "6px", border: "1px solid #e2e8f0" }}>
        <label style={{ display: "inline-flex", alignItems: "center", gap: "10px", fontSize: "14px", fontWeight: "700", color: "#0f172a", cursor: "pointer", width: "auto", margin: 0 }}>
          <input 
            type="checkbox" 
            name="isInstallmentAvailable" 
            checked={enableInstallments} 
            onChange={(e) => setEnableInstallments(e.target.checked)} 
            style={{ width: "18px", height: "18px", accentColor: "#c9a44a", cursor: "pointer", margin: 0 }}
          />
          <span>💳 متاح التقسيط وتسهيلات السداد (Enable Installment Option)</span>
        </label>
        {enableInstallments && (
          <div className="form-grid" style={{ marginTop: "14px" }}>
            <label>المقدم (Down Payment ج.م)
              <input name="downPayment" type="number" min="0" placeholder="مثال: 100000" />
            </label>
            <label>سنوات التقسيط (Installment Years)
              <input name="installmentYears" type="number" min="1" max="30" placeholder="مثال: 5 سنوات" />
            </label>
            <label className="wide">القسط الشهري (Monthly Installment ج.م)
              <input name="monthlyInstallment" type="number" min="0" placeholder="مثال: 15000" />
            </label>
          </div>
        )}
      </div>

      <div className="wide">
        <ImageUploader images={images} onChange={setImages} coverImageUrl={coverImage} onCoverChange={setCoverImage}/>
      </div>

      <div className="wide">
        <RichEditor value={description} onChange={setDescription} required={false}/>
      </div>
    </div>
    <button 
      type="submit" 
      disabled={submitting}
      style={{ 
        cursor: submitting ? "not-allowed" : "pointer", 
        background: submitting ? "#94a3b8" : "#c9a44a", 
        color: "#fff", 
        fontWeight: 600, 
        padding: "14px 28px", 
        borderRadius: 4, 
        border: 0, 
        marginTop: 18,
        display: "inline-flex",
        alignItems: "center",
        gap: "8px"
      }}
    >
      {submitting ? (
        <>
          <Loader2 className="animate-spin" style={{ width: 18, height: 18 }} />
          <span>جاري الحفظ والنشر... يرجى الانتظار</span>
        </>
      ) : (
        <span>حفظ ونشر العقار فوراً</span>
      )}
    </button>
  </form>;
}
