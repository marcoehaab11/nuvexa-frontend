"use client";
import Link from "next/link";
import { FormEvent,useCallback,useEffect,useMemo,useState } from "react";
import { Building2,ChevronDown,Globe2,Home,Languages,LayoutDashboard,LockKeyhole,MapPin,Menu,Plus,Search,Settings,Users,Loader2,Pencil,Trash2,MessageSquare,Phone } from "lucide-react";
import type { CompanyData,CompanySummaryData,PropertyCardData,PropertyDetailData } from "@/lib/api";
import { CopyButton } from "@/components/copy-button";

import { RichEditor } from "@/components/rich-editor";
import { ImageUploader } from "@/components/image-uploader";

type Option={id:string;name:string;parentId?:string|null};
type Lookups={countries:Option[];cities:Option[];companies:CompanySummaryData[]};
type InquiryData = {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  message: string;
  propertyId?: string | null;
  propertyTitle?: string | null;
  referenceNumber?: string | null;
  createdAt: string;
};

const nav=[[LayoutDashboard,"Dashboard"],[MessageSquare,"Inquiries"],[Home,"Properties"],[Building2,"Companies"],[MapPin,"Locations"],[Languages,"Languages"],[Users,"Users"],[Settings,"Site settings"]] as const;

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
  const[properties,setProperties]=useState<PropertyCardData[]>([]);const[companies,setCompanies]=useState<CompanyData[]>([]);const[lookups,setLookups]=useState<Lookups>({countries:[],cities:[],companies:[]});const[inquiries,setInquiries]=useState<InquiryData[]>([]);
  const[showForm,setShowForm]=useState(false);const[search,setSearch]=useState("");const[notice,setNotice]=useState("");
  const[submitting,setSubmitting]=useState(false);
  const[editingProperty,setEditingProperty]=useState<PropertyDetailData|null>(null);

  const load=useCallback(async()=>{const[p,c,l,inq]=await Promise.all([adminFetch<PropertyCardData[]>("properties?locale=en"),adminFetch<CompanyData[]>("companies"),adminFetch<Lookups>("lookups?locale=en"),adminFetch<InquiryData[]>("inquiries").catch(()=>[])]);setProperties(p);setCompanies(c);setLookups(l);setInquiries(inq||[]);},[]);
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

  async function saveProperty(e:FormEvent<HTMLFormElement>){
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
    const statusVal=d.get("status")?.toString()||"Available";

    const payload = {
      referenceNumber:d.get("referenceNumber")||null,
      companyId:companyIdVal && companyIdVal !== "" ? companyIdVal : null,
      propertyType:d.get("propertyType")||"Apartment",
      listingPurpose:d.get("listingPurpose")||"Sale",
      status:statusVal,
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
      titleEn:d.get("titleEn")?.toString().trim()||null,
      slug:d.get("slug")||null,
      description:d.get("description")||null,
      descriptionEn:d.get("descriptionEn")?.toString().trim()||null,
      isInstallmentAvailable:isInstallmentAvailable,
      downPayment:downPayment,
      installmentYears:installmentYears,
      monthlyInstallment:monthlyInstallment
    };

    try{
      if (editingProperty) {
        await adminFetch(`properties/${editingProperty.id}`, { method: "PUT", body: JSON.stringify(payload) });
        setNotice("تم تحديث بيانات العقار بنجاح!");
      } else {
        await adminFetch("properties", { method: "POST", body: JSON.stringify(payload) });
        setNotice("تمت إضافة العقار ونشره بنجاح!");
      }
      setShowForm(false);
      setEditingProperty(null);
      await load();
    }catch(e){setError(e instanceof Error?e.message:"تعذر حفظ العقار، يرجى التثبت من البيانات.");}
    finally{setSubmitting(false);}
  }

  async function deleteProperty(id: string) {
    if (!window.confirm("هل أنت تأكد من حذف هذا العقار نهائياً؟")) return;
    setError("");
    try {
      await adminFetch(`properties/${id}`, { method: "DELETE" });
      setNotice("تم حذف العقار بنجاح.");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "تعذر حذف العقار.");
    }
  }

  async function changeStatus(id: string, newStatus: string) {
    setError("");
    try {
      await adminFetch(`properties/${id}/status`, { method: "PATCH", body: JSON.stringify({ status: newStatus }) });
      setNotice(`تم تغيير حالة العقار إلى ${newStatus}`);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "تعذر تغيير حالة العقار.");
    }
  }

  async function startEditProperty(propertyCard: PropertyCardData) {
    setError("");
    try {
      const detail = await adminFetch<PropertyDetailData>(`properties/${propertyCard.id}?locale=en`);
      setEditingProperty(detail);
    } catch {
      setEditingProperty({
        ...propertyCard,
        description: "",
        propertyType: "Apartment",
        latitude: null,
        longitude: null,
        images: propertyCard.coverImage ? [propertyCard.coverImage] : []
      });
    }
    setShowForm(true);
  }

  const filteredCompanies=useMemo(()=>companies.filter(c=>`${c.name} ${c.legalName||""} ${c.slug}`.toLowerCase().includes(search.toLowerCase())),[companies,search]);
  if(auth!=="in")return <main className="admin-login"><form onSubmit={login}><Link className="admin-brand" href="/en"><strong>NUVEXA</strong><small>ADMINISTRATION</small></Link><div className="login-mark"><LockKeyhole/></div><h1>{auth==="loading"?"Checking your session":"Welcome back"}</h1><p>{auth==="loading"?"Please wait…":"Sign in with your administrator account."}</p>{auth==="out"&&<><label>Email<input name="email" type="email" required/></label><label>Password<input name="password" type="password" required/></label>{error&&<span className="login-error">{error}</span>}<button type="submit">Sign in securely</button></>}</form></main>;
  const available=properties.filter(p=>p.status==="Available").length;

  return <main className="admin-shell" dir="ltr"><aside className="admin-sidebar"><Link className="admin-brand" href="/en"><strong>NUVEXA</strong><small>ADMINISTRATION</small></Link><nav>{nav.map(([Icon,label])=><button key={label} className={active===label?"active":""} onClick={()=>{setActive(label);setShowForm(false);setEditingProperty(null);setError("");}}><Icon/>{label}</button>)}</nav><div className="admin-user"><span>ME</span><div><strong>Administrator</strong><small>Authorized user</small></div><ChevronDown/></div></aside><section className="admin-main"><header><button className="admin-menu"><Menu/></button><div><Search/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder={`Search ${active.toLowerCase()}...`}/></div><Link href="/en" target="_blank"><Globe2/> View website</Link></header><div className="admin-content"><div className="admin-title"><div><p>NUVEXA CRM</p><h1>{active}</h1></div>{["Properties","Companies"].includes(active)&&<button onClick={()=>{ setEditingProperty(null); setShowForm(!showForm); }}><Plus/> Add {active==="Properties"?"property":"company"}</button>}</div>{notice&&<p className="admin-notice">{notice}</p>}{error&&<p className="admin-error">{error}</p>}
  {active==="Dashboard"&&<><div className="stat-grid">{[["Total properties",properties.length,"Database inventory"],["Available",available,"Ready for sale"],["Inquiries / Leads",inquiries.length,"Customer requests"],["Companies",companies.length,"Active partners"]].map(x=><article key={x[0]}><span>{x[0]}</span><strong>{x[1]}</strong><small>{x[2]}</small></article>)}</div><PropertyTable properties={properties} onEdit={startEditProperty} onDelete={deleteProperty} onStatusChange={changeStatus}/></>}
  {active==="Inquiries"&&<InquiriesTable inquiries={inquiries}/>}
  {active==="Properties"&&<>{showForm&&<PropertyForm lookups={lookups} onSubmit={saveProperty} submitting={submitting} initialData={editingProperty}/>}<PropertyTable properties={properties} onEdit={startEditProperty} onDelete={deleteProperty} onStatusChange={changeStatus}/></>}
  {active==="Companies"&&<>{showForm&&<CompanyForm onSubmit={createCompany} submitting={submitting}/>}<section className="company-grid">{filteredCompanies.map(c=><article key={c.id}>{c.logoUrl?<img src={c.logoUrl} alt={`${c.name} logo`}/>:<div className="company-logo">{c.name.slice(0,2).toUpperCase()}</div>}<h2>{c.name}</h2><p>{c.description||c.legalName||"No description"}</p><dl><div><dt>Properties</dt><dd>{c.propertyCount}</dd></div><div><dt>Phone</dt><dd>{c.phone||"—"}</dd></div><div><dt>Email</dt><dd>{c.email||"—"}</dd></div></dl>{c.website&&<a href={c.website} target="_blank" rel="noreferrer">Open website</a>}</article>)}</section></>}
  {!['Dashboard','Inquiries','Properties','Companies'].includes(active)&&<div className="module-placeholder"><div><Home/><h2>{active} workspace</h2><p>This module uses protected ASP.NET Core admin endpoints.</p></div></div>}</div></section></main>;
}

function InquiriesTable({ inquiries }: { inquiries: InquiryData[] }) {
  return (
    <div className="admin-panels single">
      <section>
        <div className="panel-title">
          <h2>Inquiries & Customer Leads ({inquiries.length})</h2>
          <span>استفسارات وطلبات المعاينة من عملاء الموقع</span>
        </div>
        {inquiries.length === 0 ? (
          <p style={{ padding: "24px", color: "#64748b", fontWeight: 600 }}>لم يتم استلام أي استفسارات أو طلبات تواصل من العملاء بعد.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>CUSTOMER NAME</th>
                <th>PHONE / CONTACT</th>
                <th>PROPERTY INQUIRED</th>
                <th>MESSAGE</th>
                <th>DATE</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map((inq) => {
                const cleanPhone = inq.phone.replace(/[^0-9+]/g, "");
                const waUrl = `https://wa.me/${cleanPhone.replace("+", "")}`;
                return (
                  <tr key={inq.id}>
                    <td>
                      <strong>{inq.name}</strong>
                    </td>
                    <td>
                      <span dir="ltr" style={{ fontWeight: 700, unicodeBidi: "isolate", direction: "ltr", color: "#0f172a" }}>
                        {inq.phone}
                      </span>
                    </td>
                    <td>
                      {inq.propertyTitle ? (
                        <div>
                          <strong style={{ color: "#0f172a", fontSize: "13px" }}>{inq.propertyTitle}</strong>
                          {inq.referenceNumber && <small style={{ display: "block", color: "#64748b" }}>{inq.referenceNumber}</small>}
                        </div>
                      ) : (
                        <span style={{ color: "#94a3b8" }}>General Inquiry</span>
                      )}
                    </td>
                    <td style={{ maxWidth: "280px", fontSize: "13px", color: "#334155" }}>
                      {inq.message}
                    </td>
                    <td>
                      <small style={{ color: "#64748b", fontSize: "12px" }}>
                        {new Date(inq.createdAt).toLocaleString("ar-EG", { dateStyle: "short", timeStyle: "short" })}
                      </small>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <a
                          href={`tel:${cleanPhone}`}
                          style={{
                            background: "#0f172a",
                            color: "#fff",
                            padding: "6px 10px",
                            borderRadius: "4px",
                            fontSize: "12px",
                            fontWeight: 600,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            textDecoration: "none"
                          }}
                        >
                          <Phone size={12} /> Call
                        </a>
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            background: "#25d366",
                            color: "#fff",
                            padding: "6px 10px",
                            borderRadius: "4px",
                            fontSize: "12px",
                            fontWeight: 600,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            textDecoration: "none"
                          }}
                        >
                          <MessageSquare size={12} /> WhatsApp
                        </a>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

function PropertyTable({properties, onEdit, onDelete, onStatusChange}:{properties:PropertyCardData[]; onEdit:(p:PropertyCardData)=>void; onDelete:(id:string)=>void; onStatusChange:(id:string, status:string)=>void}){
  return <div className="admin-panels single"><section><div className="panel-title"><h2>Properties ({properties.length})</h2><span>Manage & Edit listings</span></div><table><thead><tr><th>PROPERTY</th><th>COMPANY</th><th>LOCATION</th><th>PRICE</th><th>STATUS (الحالة)</th><th>SHARE LINK</th><th>ACTIONS</th></tr></thead><tbody>{properties.map(p=><tr key={p.id}><td><img src={p.coverImage||"/placeholder-property.svg"} alt=""/><div><strong>{p.title}</strong><small>{p.referenceNumber}</small></div></td><td>{p.company?.name||"Independent"}</td><td>{p.location}</td><td>{p.price > 0 ? new Intl.NumberFormat("en-EG",{style:"currency",currency:p.currency,maximumFractionDigits:0}).format(p.price) : "Price on Request"}</td><td>
    <select 
      value={p.status} 
      onChange={(e) => onStatusChange(p.id, e.target.value)}
      style={{
        padding: "4px 8px",
        borderRadius: "4px",
        fontSize: "12px",
        fontWeight: 600,
        border: "1px solid #cbd5e1",
        background: p.status === "Available" ? "#dcfce7" : p.status === "Sold" ? "#fee2e2" : p.status === "Reserved" ? "#fef3c7" : "#f1f5f9",
        color: p.status === "Available" ? "#15803d" : p.status === "Sold" ? "#b91c1c" : p.status === "Reserved" ? "#b45309" : "#475569",
        cursor: "pointer"
      }}
    >
      <option value="Available">Available (متاح)</option>
      <option value="Sold">Sold (تم البيع)</option>
      <option value="Reserved">Reserved (محجوز)</option>
      <option value="OffMarket">Off Market (غير متاح)</option>
    </select>
  </td><td><CopyButton slug={p.slug} variant="admin"/></td><td>
    <div style={{ display: "flex", gap: "6px" }}>
      <button 
        type="button"
        onClick={() => onEdit(p)}
        style={{ background: "#f8fafc", border: "1px solid #cbd5e1", padding: "6px 10px", borderRadius: "4px", cursor: "pointer", fontSize: "12px", display: "inline-flex", alignItems: "center", gap: "4px", color: "#0f172a", fontWeight: 600 }}
      >
        <Pencil size={13}/> Edit
      </button>
      <button 
        type="button"
        onClick={() => onDelete(p.id)}
        style={{ background: "#fef2f2", border: "1px solid #fecaca", padding: "6px 10px", borderRadius: "4px", cursor: "pointer", fontSize: "12px", display: "inline-flex", alignItems: "center", gap: "4px", color: "#ef4444", fontWeight: 600 }}
      >
        <Trash2 size={13}/> Delete
      </button>
    </div>
  </td></tr>)}</tbody></table></section></div>;
}

function CompanyForm({onSubmit,submitting}:{onSubmit:(e:FormEvent<HTMLFormElement>)=>void;submitting?:boolean}){return <form className="admin-form" onSubmit={onSubmit}><h2>Add real-estate company</h2><div className="form-grid"><label>Display name<input name="name" required/></label><label>Slug<input name="slug" required pattern="[a-z0-9-]+" placeholder="company-name"/></label><label>Legal name<input name="legalName"/></label><label>Logo URL<input name="logoUrl" type="url"/></label><label>Website<input name="website" type="url"/></label><label>Email<input name="email" type="email"/></label><label>Phone<input name="phone"/></label><label>Address<input name="address"/></label><label className="wide">Description<textarea name="description" rows={3}/></label></div><button type="submit" disabled={submitting}>{submitting?"Saving...":"Save company"}</button></form>}

function PropertyForm({lookups,onSubmit,submitting,initialData}:{lookups:Lookups;onSubmit:(e:FormEvent<HTMLFormElement>)=>void;submitting?:boolean;initialData?:PropertyDetailData|null}){
  const [images, setImages] = useState<string[]>(initialData?.images || (initialData?.coverImage ? [initialData.coverImage] : []));
  const [coverImage, setCoverImage] = useState<string>(initialData?.coverImage || "");
  const [description, setDescription] = useState<string>(initialData?.description || "");
  const [descriptionEn, setDescriptionEn] = useState<string>("");
  const [titleVal, setTitleVal] = useState<string>(initialData?.title || "");
  const [titleEnVal, setTitleEnVal] = useState<string>("");
  const [slugVal, setSlugVal] = useState<string>(initialData?.slug || "");
  const [enableInstallments, setEnableInstallments] = useState<boolean>(initialData?.isInstallmentAvailable || Boolean(initialData?.downPayment || initialData?.installmentYears || initialData?.monthlyInstallment));
  const [activeLangTab, setActiveLangTab] = useState<"ar" | "en">("ar");

  useEffect(() => {
    if (initialData) {
      setTitleVal(initialData.title || "");
      setSlugVal(initialData.slug || "");
      setDescription(initialData.description || "");
      setCoverImage(initialData.coverImage || "");
      setImages(initialData.images || (initialData.coverImage ? [initialData.coverImage] : []));
      setEnableInstallments(Boolean(initialData.isInstallmentAvailable || initialData.downPayment || initialData.installmentYears || initialData.monthlyInstallment));
    }
  }, [initialData]);

  const countriesList = lookups.countries.length > 0 ? lookups.countries : [{ id: "11111111-1111-1111-1111-111111111111", name: "Egypt / مصر" }];
  const citiesList = lookups.cities.length > 0 ? lookups.cities : [
    { id: "22222222-2222-2222-2222-222222222222", name: "Hurghada / الغردقة" },
    { id: "33333333-3333-3333-3333-333333333333", name: "Sahl Hasheesh / سهل حشيش" },
    { id: "44444444-4444-4444-4444-444444444444", name: "El Gouna / الجونة" },
    { id: "55555555-5555-5555-5555-555555555555", name: "Soma Bay / سوما باي" },
    { id: "66666666-6666-6666-6666-666666666666", name: "Makadi Bay / مكادي باي" },
    { id: "77777777-7777-7777-7777-777777777777", name: "Ain Sokhna / العين السخنة" },
    { id: "88888888-8888-8888-8888-888888888888", name: "North Coast / الساحل الشمالي" },
    { id: "99999999-9999-9999-9999-999999999999", name: "Cairo / القاهرة" },
    { id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa", name: "New Cairo / التجمع الخامس" },
    { id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb", name: "Sheikh Zayed / الشيخ زايد" },
    { id: "cccccccc-cccc-cccc-cccc-cccccccccccc", name: "Sharm El Sheikh / شرم الشيخ" },
    { id: "dddddddd-dddd-dddd-dddd-dddddddddddd", name: "Alexandria / الإسكندرية" }
  ];

  const handleTitleChange = (val: string) => {
    setTitleVal(val);
    if (!initialData) {
      const autoSlug = val.trim().toLowerCase().replace(/[^a-z0-9\u0600-\u06FF]+/g, "-").replace(/^-+|-+$/g, "");
      setSlugVal(autoSlug);
    }
  };

  return <form className="admin-form" onSubmit={onSubmit}>
    <h2>{initialData ? "Edit Property (تعديل بيانات العقار)" : "Add new property (إضافة عقار جديد)"}</h2>
    
    <div style={{ display: "flex", gap: "8px", marginBottom: "20px", borderBottom: "2px solid #e2e8f0", paddingBottom: "8px" }}>
      <button 
        type="button" 
        onClick={() => setActiveLangTab("ar")}
        style={{ 
          padding: "8px 16px", 
          borderRadius: "4px", 
          fontWeight: 700, 
          fontSize: "13px",
          cursor: "pointer",
          border: activeLangTab === "ar" ? "1px solid #c9a44a" : "1px solid #cbd5e1",
          background: activeLangTab === "ar" ? "#c9a44a" : "#f8fafc",
          color: activeLangTab === "ar" ? "#ffffff" : "#475569"
        }}
      >
        🇸🇦 العربية (Arabic Details)
      </button>
      <button 
        type="button" 
        onClick={() => setActiveLangTab("en")}
        style={{ 
          padding: "8px 16px", 
          borderRadius: "4px", 
          fontWeight: 700, 
          fontSize: "13px",
          cursor: "pointer",
          border: activeLangTab === "en" ? "1px solid #c9a44a" : "1px solid #cbd5e1",
          background: activeLangTab === "en" ? "#c9a44a" : "#f8fafc",
          color: activeLangTab === "en" ? "#ffffff" : "#475569"
        }}
      >
        🇬🇧 English (English Details)
      </button>
    </div>

    <div className="form-grid">
      {activeLangTab === "ar" ? (
        <label className="wide">Title in Arabic (اسم العقار بالعربي)<span style={{ color: "#ef4444", marginInlineStart: 4 }}>* (إجباري)</span>
          <input 
            name="title" 
            value={titleVal} 
            onChange={(e) => handleTitleChange(e.target.value)} 
            required 
            placeholder="مثال: شقة فاخرة للبيع في السهل الحشيش"
          />
        </label>
      ) : (
        <label className="wide">Title in English (اسم العقار بالإنجليزي)
          <input 
            name="titleEn" 
            value={titleEnVal} 
            onChange={(e) => setTitleEnVal(e.target.value)} 
            placeholder="Example: Luxury Apartment for sale in Sahl Hasheesh"
          />
        </label>
      )}

      <label>Reference Code (الكود المرجعي)<input name="referenceNumber" defaultValue={initialData?.referenceNumber || `REF-${Math.floor(1000 + Math.random() * 9000)}`}/></label>
      <label>Slug (الرابط)<input name="slug" value={slugVal} onChange={(e) => setSlugVal(e.target.value)} placeholder="شقة-للبيع-التجمع"/></label>
      
      <label>Status (حالة العقار العامة)
        <select name="status" defaultValue={initialData?.status || "Available"}>
          <option value="Available">Available (متاح للبيع/الإيجار)</option>
          <option value="Sold">Sold (تم البيع)</option>
          <option value="Reserved">Reserved (محجوز)</option>
          <option value="OffMarket">Off Market (غير متاح)</option>
        </select>
      </label>

      <label>Company (الشركة)<select name="companyId" defaultValue={initialData?.company?.id || ""}><option value="">Independent / لا ينتمي لشركة</option>{lookups.companies.map(x=><option key={x.id} value={x.id}>{x.name}</option>)}</select></label>
      <label>Type (نوع العقار)<select name="propertyType" defaultValue={initialData?.propertyType || "Apartment"}>{["Apartment","Villa","Duplex","Penthouse","Townhouse","Chalet","Office","Retail","Commercial","Land"].map(x=><option key={x}>{x}</option>)}</select></label>
      <label>Purpose (الغرض)<select name="listingPurpose"><option value="Sale">Sale (بيع)</option><option value="Rent">Rent (إيجار)</option></select></label>
      
      <label>Price (السعر الإجمالي)<input name="price" type="number" min="0" defaultValue={initialData?.price ?? 0} placeholder="0"/></label>
      <label>Currency (العملة)
        <select name="currency" defaultValue={initialData?.currency || "EGP"}>
          <option value="EGP">EGP (جنيه مصري - ج.م)</option>
          <option value="EUR">EUR (يورو - €)</option>
          <option value="USD">USD (دولار أمريكي - $)</option>
        </select>
      </label>
      <label>Area m² (المساحة م²)<input name="areaM2" type="number" min="0" defaultValue={initialData?.areaM2 ?? 0} placeholder="0"/></label>

      <label>Bedrooms (الغرف)<input name="bedrooms" type="number" min="0" defaultValue={initialData?.bedrooms ?? ""} placeholder="اختياري"/></label>
      <label>Bathrooms (الحمامات)<input name="bathrooms" type="number" min="0" defaultValue={initialData?.bathrooms ?? ""} placeholder="اختياري"/></label>

      <label>Country (البلد)<select name="countryId">{countriesList.map(x=><option key={x.id} value={x.id}>{x.name}</option>)}</select></label>
      <label>City (المدينة)<select name="cityId">{citiesList.map(x=><option key={x.id} value={x.id}>{x.name}</option>)}</select></label>
      
      <label className="wide">Address / Detailed Location (العنوان المباشر)<input name="address" defaultValue={initialData?.location || ""} placeholder="مثال: الحي الخامس - ش الستين - بالقرب من المحور"/></label>

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
              <input name="downPayment" type="number" min="0" defaultValue={initialData?.downPayment ?? ""} placeholder="مثال: 100000" />
            </label>
            <label>سنوات التقسيط (Installment Years)
              <input name="installmentYears" type="number" min="1" max="30" defaultValue={initialData?.installmentYears ?? ""} placeholder="مثال: 5 سنوات" />
            </label>
            <label className="wide">القسط الشهري (Monthly Installment ج.م)
              <input name="monthlyInstallment" type="number" min="0" defaultValue={initialData?.monthlyInstallment ?? ""} placeholder="مثال: 15000" />
            </label>
          </div>
        )}
      </div>

      <div className="wide">
        <ImageUploader images={images} onChange={setImages} coverImageUrl={coverImage} onCoverChange={setCoverImage}/>
      </div>

      <div className="wide">
        <p style={{ fontSize: "13px", fontWeight: 700, marginBottom: "8px", color: "#0f172a" }}>
          🇸🇦 الوصف والتفاصيل بالعربية (Arabic Description)
        </p>
        <RichEditor value={description} onChange={setDescription} required={false}/>
      </div>

      <div className="wide" style={{ marginTop: "16px" }}>
        <p style={{ fontSize: "13px", fontWeight: 700, marginBottom: "8px", color: "#0f172a" }}>
          🇬🇧 الوصف والتفاصيل بالإنجليزي (English Description - Optional)
        </p>
        <RichEditor value={descriptionEn} onChange={setDescriptionEn} required={false}/>
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
          <span>{initialData ? "جاري التحديث... يرجى الانتظار" : "جاري الحفظ والنشر... يرجى الانتظار"}</span>
        </>
      ) : (
        <span>{initialData ? "تحديث ونشر تعديلات العقار" : "حفظ ونشر العقار فوراً"}</span>
      )}
    </button>
  </form>;
}
