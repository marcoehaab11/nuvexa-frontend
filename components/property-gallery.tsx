"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, X } from "lucide-react";

export function PropertyGallery({ images, title, locale }: { images: string[]; title: string; locale: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  const gallery = images && images.length > 0 ? images : ["/placeholder-property.svg"];
  const activeImage = gallery[activeIndex] || gallery[0];

  const isRtl = locale === "ar";

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? gallery.length - 1 : prev - 1));
    setZoomLevel(1);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === gallery.length - 1 ? 0 : prev + 1));
    setZoomLevel(1);
  };

  const zoomIn = () => setZoomLevel((z) => Math.min(z + 0.5, 3));
  const zoomOut = () => setZoomLevel((z) => Math.max(z - 0.5, 1));

  return (
    <div className="property-interactive-gallery">
      {/* Main Active Image Showcase */}
      <div className="gallery-main-showcase">
        <img
          src={activeImage}
          alt={`${title} - ${activeIndex + 1}`}
          onClick={() => { setLightboxOpen(true); setZoomLevel(1); }}
          style={{ cursor: "zoom-in" }}
        />

        <button
          type="button"
          className="gallery-zoom-trigger"
          onClick={() => { setLightboxOpen(true); setZoomLevel(1); }}
          title={isRtl ? "تكبير ومعاينة" : "Zoom & Preview"}
        >
          <ZoomIn style={{ width: 16, height: 16 }} />
          <span>{isRtl ? "تكبير ومعاينة" : "Zoom & Preview"}</span>
        </button>

        {gallery.length > 1 && (
          <>
            <button type="button" className="gallery-nav-btn prev" onClick={isRtl ? handleNext : handlePrev} aria-label="Previous image">
              {isRtl ? <ChevronRight size={26} /> : <ChevronLeft size={26} />}
            </button>
            <button type="button" className="gallery-nav-btn next" onClick={isRtl ? handlePrev : handleNext} aria-label="Next image">
              {isRtl ? <ChevronLeft size={26} /> : <ChevronRight size={26} />}
            </button>
            <span className="gallery-counter">
              {activeIndex + 1} / {gallery.length}
            </span>
          </>
        )}
      </div>

      {/* Thumbnails Navigation Strip */}
      {gallery.length > 1 && (
        <div className="gallery-thumbnails-strip">
          {gallery.map((img, idx) => (
            <button
              key={`${img.slice(0, 30)}-${idx}`}
              type="button"
              className={`thumbnail-item ${idx === activeIndex ? "active" : ""}`}
              onClick={() => { setActiveIndex(idx); setZoomLevel(1); }}
            >
              <img src={img} alt={`Thumbnail ${idx + 1}`} />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {lightboxOpen && (
        <div className="gallery-lightbox-overlay">
          <div className="lightbox-controls">
            <div className="lightbox-zoom-tools">
              <button type="button" onClick={zoomIn} title="Zoom In"><ZoomIn size={18} /></button>
              <span>{Math.round(zoomLevel * 100)}%</span>
              <button type="button" onClick={zoomOut} title="Zoom Out"><ZoomOut size={18} /></button>
            </div>
            <button type="button" className="lightbox-close-btn" onClick={() => setLightboxOpen(false)} aria-label="Close modal">
              <X size={26} />
            </button>
          </div>

          <div className="lightbox-image-viewport">
            {gallery.length > 1 && (
              <button type="button" className="lightbox-nav-btn prev" onClick={isRtl ? handleNext : handlePrev}>
                {isRtl ? <ChevronRight size={36} /> : <ChevronLeft size={36} />}
              </button>
            )}

            <div className="lightbox-img-wrapper" style={{ transform: `scale(${zoomLevel})` }}>
              <img src={activeImage} alt={title} />
            </div>

            {gallery.length > 1 && (
              <button type="button" className="lightbox-nav-btn next" onClick={isRtl ? handlePrev : handleNext}>
                {isRtl ? <ChevronLeft size={36} /> : <ChevronRight size={36} />}
              </button>
            )}
          </div>

          <div className="lightbox-caption">
            <p>{title}</p>
            <small>{activeIndex + 1} / {gallery.length}</small>
          </div>
        </div>
      )}
    </div>
  );
}
