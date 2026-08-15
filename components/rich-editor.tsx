"use client";

import React, { useRef, useState, useEffect } from "react";
import { 
  Bold, Italic, Underline, Heading1, Heading2, List, ListOrdered, 
  Smile, Image as ImageIcon, Link as LinkIcon, Eye, Code, AlignLeft, 
  AlignCenter, AlignRight, Check, Sparkles, HelpCircle
} from "lucide-react";

export interface RichEditorProps {
  value: string;
  onChange: (html: string) => void;
  label?: string;
  required?: boolean;
}

const PRESET_LOGOS = [
  { id: "pool", emoji: "🏊", label: "حمام سباحة", labelEn: "Private Pool", color: "#0284c7" },
  { id: "parking", emoji: "🚗", label: "جراج خاص", labelEn: "Covered Parking", color: "#475569" },
  { id: "security", emoji: "🛡️", label: "أمن وحراسة 24/7", labelEn: "24/7 Security", color: "#166534" },
  { id: "garden", emoji: "🌳", label: "حديقة خاصة", labelEn: "Private Garden", color: "#15803d" },
  { id: "gym", emoji: "🏋️", label: "جيم وسبا", labelEn: "Gym & Spa", color: "#b45309" },
  { id: "smart", emoji: "⚡", label: "سمارت هوم", labelEn: "Smart Home System", color: "#d97706" },
  { id: "view_sea", emoji: "🌊", label: "إطلالة مباشرة على البحر", labelEn: "Direct Sea View", color: "#0369a1" },
  { id: "view_city", emoji: "🏙️", label: "إطلالة بانورامية", labelEn: "Panoramic View", color: "#334155" },
  { id: "ac", emoji: "❄️", label: "تكييف مركزي", labelEn: "Central AC", color: "#0891b2" },
  { id: "ready", emoji: "🔑", label: "تسليم فوري", labelEn: "Ready to Move", color: "#9333ea" },
  { id: "installments", emoji: "💳", label: "تسهيلات وسداد بالتقسيط", labelEn: "Flexible Payment Plan", color: "#059669" },
  { id: "title_deed", emoji: "📜", label: "عقد أخضر حصة في الأرض", labelEn: "Registered Green Title", color: "#15803d" },
  { id: "whatsapp", emoji: "💬", label: "تواصل واتساب مباشر", labelEn: "Direct WhatsApp", color: "#16a34a" },
  { id: "phone", emoji: "📞", label: "اتصل بنا فوراً", labelEn: "Direct Owner Contact", color: "#2563eb" },
  { id: "villa", emoji: "🌟", label: "فيلا مستقلة فاخرة", labelEn: "Luxury Standalone Villa", color: "#c9a44a" },
  { id: "building", emoji: "🏢", label: "موقع استراتيجي مميز", labelEn: "Prime Location Tower", color: "#475569" },
];

export function RichEditor({ value, onChange, label = "الوصف التفصيلي للمقر / العقار", required = false }: RichEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<"edit" | "preview" | "html">("edit");
  const [htmlContent, setHtmlContent] = useState(value || "");
  const [showLogoPicker, setShowLogoPicker] = useState(false);
  const [customLogoUrl, setCustomLogoUrl] = useState("");
  const [customLogoLabel, setCustomLogoLabel] = useState("");
  const [showCustomLogoModal, setShowCustomLogoModal] = useState(false);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || "";
    }
    setHtmlContent(value || "");
  }, [value]);

  const updateContent = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      setHtmlContent(content);
      onChange(content);
    }
  };

  const execCmd = (command: string, value: string = "") => {
    document.execCommand(command, false, value);
    updateContent();
  };

  const insertHtmlAtCursor = (html: string) => {
    if (editorRef.current) {
      editorRef.current.focus();
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        const div = document.createElement("div");
        div.innerHTML = html;
        const frag = document.createDocumentFragment();
        let node;
        let lastNode;
        while ((node = div.firstChild)) {
          lastNode = frag.appendChild(node);
        }
        range.insertNode(frag);
        if (lastNode) {
          range.setStartAfter(lastNode);
          range.collapse(true);
          selection.removeAllRanges();
          selection.addRange(range);
        }
      } else {
        editorRef.current.innerHTML += html;
      }
      updateContent();
    }
  };

  const insertPresetLogo = (preset: typeof PRESET_LOGOS[0]) => {
    const badgeHtml = `<span class="logo-badge" style="display: inline-flex; align-items: center; gap: 6px; background-color: #f1f5f9; color: ${preset.color}; border: 1px solid ${preset.color}33; padding: 4px 10px; border-radius: 20px; font-size: 13px; font-weight: 600; margin: 3px 4px; vertical-align: middle; unicode-bidi: embed;">
      <span style="font-size: 15px;">${preset.emoji}</span>
      <span>${preset.label}</span>
    </span>&nbsp;`;
    insertHtmlAtCursor(badgeHtml);
    setShowLogoPicker(false);
  };

  const handleAddCustomLogo = () => {
    if (!customLogoUrl) return;
    const logoHtml = `<span class="custom-logo-badge" style="display: inline-flex; align-items: center; gap: 6px; background-color: #f8fafc; border: 1px solid #cbd5e1; padding: 4px 10px; border-radius: 20px; font-size: 13px; font-weight: 600; margin: 3px 4px; vertical-align: middle;">
      <img src="${customLogoUrl}" alt="${customLogoLabel}" style="width: 18px; height: 18px; object-fit: contain; display: inline-block;" />
      ${customLogoLabel ? `<span>${customLogoLabel}</span>` : ""}
    </span>&nbsp;`;
    insertHtmlAtCursor(logoHtml);
    setCustomLogoUrl("");
    setCustomLogoLabel("");
    setShowCustomLogoModal(false);
  };

  return (
    <div className="rich-editor-wrapper">
      <div className="rich-editor-header">
        <label className="rich-editor-label">
          {label} {required && <span style={{ color: "#ef4444" }}>*</span>}
        </label>
        <div className="rich-editor-tabs">
          <button
            type="button"
            className={activeTab === "edit" ? "active" : ""}
            onClick={() => setActiveTab("edit")}
          >
            محرر التنسيق واللوجوهات
          </button>
          <button
            type="button"
            className={activeTab === "preview" ? "active" : ""}
            onClick={() => setActiveTab("preview")}
          >
            <Eye size={14} /> معاينة شكل الوصف
          </button>
          <button
            type="button"
            className={activeTab === "html" ? "active" : ""}
            onClick={() => setActiveTab("html")}
          >
            <Code size={14} /> كود HTML
          </button>
        </div>
      </div>

      {activeTab === "edit" && (
        <div className="rich-editor-container">
          <div className="rich-editor-toolbar">
            <div className="toolbar-group">
              <button type="button" onClick={() => execCmd("bold")} title="خط عريض Bold">
                <Bold size={15} />
              </button>
              <button type="button" onClick={() => execCmd("italic")} title="خط مائل Italic">
                <Italic size={15} />
              </button>
              <button type="button" onClick={() => execCmd("underline")} title="تحته خط Underline">
                <Underline size={15} />
              </button>
            </div>

            <div className="toolbar-divider" />

            <div className="toolbar-group">
              <button type="button" onClick={() => execCmd("formatBlock", "<h2>")} title="عنوان رئيسي H2">
                <Heading1 size={15} />
              </button>
              <button type="button" onClick={() => execCmd("formatBlock", "<h3>")} title="عنوان فرعي H3">
                <Heading2 size={15} />
              </button>
              <button type="button" onClick={() => execCmd("formatBlock", "<p>")} title="فقرة عادية">
                <AlignLeft size={15} />
              </button>
            </div>

            <div className="toolbar-divider" />

            <div className="toolbar-group">
              <button type="button" onClick={() => execCmd("insertUnorderedList")} title="قائمة نقطية">
                <List size={15} />
              </button>
              <button type="button" onClick={() => execCmd("insertOrderedList")} title="قائمة رقمية">
                <ListOrdered size={15} />
              </button>
            </div>

            <div className="toolbar-divider" />

            <div className="toolbar-group">
              <button 
                type="button" 
                className="logo-picker-btn"
                onClick={() => setShowLogoPicker(!showLogoPicker)}
                title="إدراج أيقونات ولوجوهات العقار"
              >
                <Sparkles size={15} /> 🌟 إدراج أيقونة / لوجو
              </button>

              <button 
                type="button" 
                onClick={() => setShowCustomLogoModal(true)}
                title="إدراج صورة لوجو برابط مخصص"
              >
                <ImageIcon size={15} /> لوجو مخصص
              </button>
            </div>
          </div>

          {showLogoPicker && (
            <div className="logo-picker-grid">
              <div className="logo-picker-title">
                <strong>اختر الأيقونة أو الشارة لإدراجها في الوصف:</strong>
                <button type="button" onClick={() => setShowLogoPicker(false)}>×</button>
              </div>
              <div className="logo-badges-list">
                {PRESET_LOGOS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    className="preset-logo-chip"
                    style={{ borderColor: `${preset.color}44`, color: preset.color }}
                    onClick={() => insertPresetLogo(preset)}
                  >
                    <span>{preset.emoji}</span>
                    <span>{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div
            ref={editorRef}
            className="rich-editor-content"
            contentEditable
            onInput={updateContent}
            onBlur={updateContent}
            dir="auto"
            data-placeholder="اكتب وصف العقار هنا، يمكنك تنسيق النصوص وإضافة اللوجوهات والشارات الخاصة بالخدمات والمزايا..."
          />
        </div>
      )}

      {activeTab === "preview" && (
        <div className="rich-editor-preview prose dir-rtl">
          {htmlContent ? (
            <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
          ) : (
            <div className="preview-empty">لم يتم كتابة أي وصف بعد...</div>
          )}
        </div>
      )}

      {activeTab === "html" && (
        <textarea
          className="rich-editor-html-code"
          value={htmlContent}
          onChange={(e) => {
            setHtmlContent(e.target.value);
            onChange(e.target.value);
          }}
          rows={8}
          dir="ltr"
        />
      )}

      {showCustomLogoModal && (
        <div className="custom-logo-modal-overlay">
          <div className="custom-logo-modal">
            <h3>إدراج لوجو مخصص برابط صورة</h3>
            <p>أدخل رابط صورة اللوجو (Logo URL) والنص الذي يظهر بجانبه:</p>
            <label>
              رابط صورة اللوجو (URL)
              <input
                type="url"
                value={customLogoUrl}
                onChange={(e) => setCustomLogoUrl(e.target.value)}
                placeholder="https://example.com/logo.png"
              />
            </label>
            <label>
              اسم/عنوان اللوجو (اختياري)
              <input
                type="text"
                value={customLogoLabel}
                onChange={(e) => setCustomLogoLabel(e.target.value)}
                placeholder="مثال: مطور العقار أو شارة الجودة"
              />
            </label>
            <div className="modal-actions">
              <button type="button" onClick={() => setShowCustomLogoModal(false)}>إلغاء</button>
              <button type="button" className="btn-primary" onClick={handleAddCustomLogo}>إدراج اللوجو</button>
            </div>
          </div>
        </div>
      )}

      <input type="hidden" name="description" value={htmlContent} />
    </div>
  );
}
