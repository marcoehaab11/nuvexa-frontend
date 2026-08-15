"use client";
import { useState } from "react";
import { Copy, Check, Share2 } from "lucide-react";

export function CopyButton({ slug, url, label = "نسخ رابط العقار", variant = "default" }: { slug?: string; url?: string; label?: string; variant?: "default" | "badge" | "icon" | "admin" }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    let linkToCopy = url;
    if (!linkToCopy && slug) {
      const origin = typeof window !== "undefined" ? window.location.origin : "https://nuvexa-realestate.com";
      linkToCopy = `${origin}/ar/properties/${slug}`;
    }
    if (!linkToCopy && typeof window !== "undefined") {
      linkToCopy = window.location.href;
    }

    if (linkToCopy && navigator.clipboard) {
      navigator.clipboard.writeText(linkToCopy).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      });
    }
  };

  if (variant === "admin") {
    return (
      <button 
        type="button" 
        onClick={handleCopy}
        style={{
          background: copied ? "#dcfce7" : "#f1f5f9",
          color: copied ? "#15803d" : "#334155",
          border: `1px solid ${copied ? "#86efac" : "#cbd5e1"}`,
          padding: "6px 12px",
          borderRadius: "6px",
          fontSize: "12px",
          fontWeight: 600,
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          transition: "all 0.2s"
        }}
        title="نسخ رابط العقار لمشاركته على فيسبوك أو السوشيال ميديا"
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
        <span>{copied ? "تم النسخ! 📋" : "نسخ الرابط"}</span>
      </button>
    );
  }

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={handleCopy}
        style={{
          background: copied ? "#dcfce7" : "#ffffff",
          color: copied ? "#15803d" : "#0f172a",
          border: "1px solid #cbd5e1",
          borderRadius: "50%",
          width: "36px",
          height: "36px",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
          transition: "all 0.2s"
        }}
        title="نسخ رابط العقار لمشاركته"
      >
        {copied ? <Check size={16} /> : <Share2 size={16} />}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      style={{
        background: copied ? "#dcfce7" : "#c9a44a",
        color: copied ? "#15803d" : "#ffffff",
        border: 0,
        padding: "10px 18px",
        borderRadius: "6px",
        fontSize: "13px",
        fontWeight: 700,
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        transition: "all 0.2s",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
      }}
    >
      {copied ? <Check size={16} /> : <Copy size={16} />}
      <span>{copied ? "تم نسخ الرابط! 📋 (يمكنك لصقه في فيسبوك)" : label}</span>
    </button>
  );
}
