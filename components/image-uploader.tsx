"use client";

import React, { useState } from "react";
import { Plus, Trash2, Star, ArrowLeft, ArrowRight, ImageIcon, Upload, Sparkles } from "lucide-react";

export interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  coverImageUrl?: string;
  onCoverChange?: (url: string) => void;
}

const SAMPLE_IMAGES = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=1200&auto=format&fit=crop",
];

export function ImageUploader({ images, onChange, coverImageUrl, onCoverChange }: ImageUploaderProps) {
  const [inputUrl, setInputUrl] = useState("");

  const addImageUrl = (urlToAdd?: string) => {
    const targetUrl = (urlToAdd || inputUrl).trim();
    if (!targetUrl) return;
    if (images.includes(targetUrl)) {
      setInputUrl("");
      return;
    }
    const nextImages = [...images, targetUrl];
    onChange(nextImages);
    if (!coverImageUrl && onCoverChange && nextImages.length === 1) {
      onCoverChange(targetUrl);
    }
    if (!urlToAdd) setInputUrl("");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const newUrls: string[] = [];
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const dataUrl = event.target.result as string;
          newUrls.push(dataUrl);
          if (newUrls.length === files.length) {
            const nextImages = [...images, ...newUrls];
            onChange(nextImages);
            if (!coverImageUrl && onCoverChange && nextImages.length > 0) {
              onCoverChange(nextImages[0]);
            }
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    const removedUrl = images[index];
    const nextImages = images.filter((_, i) => i !== index);
    onChange(nextImages);
    if (coverImageUrl === removedUrl && onCoverChange) {
      onCoverChange(nextImages[0] || "");
    }
  };

  const setAsCover = (url: string) => {
    if (onCoverChange) {
      onCoverChange(url);
    }
  };

  const moveImage = (index: number, direction: "left" | "right") => {
    const targetIndex = direction === "left" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;
    const nextImages = [...images];
    const temp = nextImages[index];
    nextImages[index] = nextImages[targetIndex];
    nextImages[targetIndex] = temp;
    onChange(nextImages);
  };

  const addSampleImages = () => {
    const nextImages = [...images];
    SAMPLE_IMAGES.forEach((sample) => {
      if (!nextImages.includes(sample)) {
        nextImages.push(sample);
      }
    });
    onChange(nextImages);
    if (!coverImageUrl && onCoverChange && nextImages.length > 0) {
      onCoverChange(nextImages[0]);
    }
  };

  const currentCover = coverImageUrl || images[0] || "";

  return (
    <div className="image-uploader-wrapper" dir="rtl">
      <div className="image-uploader-header">
        <div>
          <h3>معرض صور العقار ({images.length} صور مضافة)</h3>
          <p>أضف عدة صور عالية الجودة للعقار، واختر الصورة الرئيسية ليتم عرضها كغلاف.</p>
        </div>
        <button type="button" className="sample-images-btn" onClick={addSampleImages}>
          <Sparkles style={{ width: 14, height: 14 }} /> إضافة صور تجريبية مجهزة
        </button>
      </div>

      <div className="image-uploader-inputs">
        <div className="url-input-group">
          <input
            type="url"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="أدخل رابط صورة (https://...)"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addImageUrl();
              }
            }}
          />
          <button type="button" onClick={() => addImageUrl()}>
            <Plus style={{ width: 14, height: 14 }} /> إضافة رابط صورة
          </button>
        </div>

        <div className="file-upload-button">
          <label>
            <Upload style={{ width: 14, height: 14 }} /> رفع صور من الجهاز
            <input type="file" accept="image/*" multiple onChange={handleFileUpload} style={{ display: "none" }} />
          </label>
        </div>
      </div>

      {images.length === 0 ? (
        <div className="image-uploader-empty">
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 6 }}>
            <ImageIcon style={{ width: 32, height: 32, color: "#94a3b8" }} />
          </div>
          <p>لم يتم إضافة أي صور بعد. أضف روابط الصور أو ارفع من جهازك مباشرة.</p>
        </div>
      ) : (
        <div className="image-grid-preview">
          {images.map((img, index) => {
            const isCover = img === currentCover || (index === 0 && !coverImageUrl);
            return (
              <div key={`${img.slice(0, 30)}-${index}`} className={`image-card ${isCover ? "is-cover" : ""}`}>
                <div className="image-card-thumb">
                  <img src={img} alt={`Property image ${index + 1}`} />
                  {isCover && <span className="cover-badge">★ صورة الغلاف</span>}
                </div>
                <div className="image-card-actions">
                  {!isCover && (
                    <button
                      type="button"
                      className="make-cover-btn"
                      onClick={() => setAsCover(img)}
                      title="تعيين كصورة غلاف أساسية"
                    >
                      <Star style={{ width: 12, height: 12 }} /> غلاف
                    </button>
                  )}
                  <div className="move-btns">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => moveImage(index, "left")}
                      title="تحريك للخلف"
                    >
                      <ArrowRight style={{ width: 12, height: 12 }} />
                    </button>
                    <button
                      type="button"
                      disabled={index === images.length - 1}
                      onClick={() => moveImage(index, "right")}
                      title="تحريك للأمام"
                    >
                      <ArrowLeft style={{ width: 12, height: 12 }} />
                    </button>
                  </div>
                  <button
                    type="button"
                    className="delete-img-btn"
                    onClick={() => removeImage(index)}
                    title="حذف الصورة"
                  >
                    <Trash2 style={{ width: 12, height: 12 }} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <input type="hidden" name="coverImageUrl" value={currentCover} />
      {images.map((url, i) => (
        <input key={i} type="hidden" name="imageUrls" value={url} />
      ))}
    </div>
  );
}
