"use client";

import { useState, FormEvent } from "react";
import { Phone, MessageSquare, Send, CheckCircle2, Loader2 } from "lucide-react";
import { contactPhones } from "@/lib/contact";

export function PropertyInquirySection({
  propertyId,
  propertyTitle,
  locale
}: {
  propertyId: string;
  propertyTitle: string;
  locale: string;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const isRtl = locale === "ar";

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const form = e.currentTarget;
    const d = new FormData(form);

    const name = d.get("name")?.toString().trim();
    const phone = d.get("phone")?.toString().trim();
    const message = d.get("message")?.toString().trim();

    if (!name || !phone) {
      setError(isRtl ? "يرجى كتابة الاسم ورقم الهاتف." : "Please enter your name and phone number.");
      setSubmitting(false);
      return;
    }

    const phoneDigitsOnly = phone.replace(/[^0-9]/g, "");
    if (phoneDigitsOnly.length < 7 || !/^\+?[0-9\s\-()]{7,20}$/.test(phone)) {
      setError(isRtl ? "يرجى كتابة رقم هاتف صحيح يحتوي على أرقام فقط (مثال: 01005030131 أو +201221042717)." : "Please enter a valid phone number with digits only.");
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/public/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          message: message || `استفسار عن عقار: ${propertyTitle}`,
          propertyId
        })
      });

      if (!response.ok) {
        throw new Error("Failed to send inquiry.");
      }

      setSuccess(true);
      form.reset();
    } catch {
      setError(isRtl ? "حدث خطأ أثناء إرسال الطلب، يرجى المحاولة لاحقاً." : "Error sending request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="property-inquiry-section">
      <div className="inquiry-grid">
        {/* Contact Numbers & Direct Call Box */}
        <div className="contact-numbers-card">
          <div className="card-badge">📞 {isRtl ? "تواصل مباشر" : "Direct Contact"}</div>
          <h3>{isRtl ? "تحدث مع مستشارنا العقاري الآن" : "Speak to Our Property Advisor Now"}</h3>
          <p>
            {isRtl
              ? "فريقنا متواجد لخدمتكم والإجابة على جميع الاستفسارات وتحديد المواعيد لمعاينة العقار."
              : "Our team is available to assist you, answer all questions, and schedule property viewings."}
          </p>

          <div className="phone-buttons-list">
            {contactPhones.map((ph, idx) => (
              <div key={idx} className="phone-item-row">
                <a
                  href={`tel:${ph.display.replace(/\s+/g, "")}`}
                  className="phone-btn call-btn"
                >
                  <Phone size={16} />
                  <span dir="ltr" className="bidi-safe-phone">
                    {ph.display}
                  </span>
                </a>
                <a
                  href={ph.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="phone-btn whatsapp-btn"
                  title="WhatsApp"
                >
                  <MessageSquare size={16} />
                  <span>WhatsApp</span>
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Inquiry Form */}
        <div className="inquiry-form-card">
          <h3>{isRtl ? "مهتم بهذا العقار؟ اترك بياناتك وسنتواصل معك" : "Interested in this property? Request Details"}</h3>
          <p>{isRtl ? "احصل على كراسة الشروط والمعاينة المباشرة" : "Get the brochure and schedule a direct private tour"}</p>

          {success ? (
            <div className="inquiry-success-msg">
              <CheckCircle2 size={32} style={{ color: "#16a34a", marginBottom: "8px" }} />
              <h4>{isRtl ? "تم إرسال طلبك بنجاح!" : "Inquiry Sent Successfully!"}</h4>
              <p>
                {isRtl
                  ? "شكراً لاهتمامك، سيتواصل معك أحد مستشارينا العقاريين خلال وقت قصير."
                  : "Thank you for your interest. One of our property advisors will contact you shortly."}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="inquiry-form">
              {error && <p className="inquiry-error-msg">{error}</p>}
              
              <label>
                {isRtl ? "الاسم بالكامل" : "Full Name"} *
                <input
                  name="name"
                  type="text"
                  required
                  placeholder={isRtl ? "أدخل اسمك بالكامل" : "Enter your full name"}
                />
              </label>

              <label>
                {isRtl ? "رقم الهاتف / الواتساب" : "Phone / WhatsApp Number"} *
                <input
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  required
                  dir="ltr"
                  placeholder="+20 100 000 0000"
                  style={{ direction: "ltr", unicodeBidi: "isolate" }}
                  onKeyDown={(e) => {
                    const allowedKeys = ["Backspace", "Delete", "Tab", "Escape", "Enter", "ArrowLeft", "ArrowRight", "Home", "End", "+", "-", " "];
                    if (allowedKeys.includes(e.key) || e.ctrlKey || e.metaKey) return;
                    if (!/^[0-9]$/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
              </label>

              <label>
                {isRtl ? "ملاحظات أو استفسارات إضافية" : "Additional Notes or Questions"}
                <textarea
                  name="message"
                  rows={3}
                  placeholder={isRtl ? "ارغب في تحديد موعد للمعاينة أو معرفة تفاصيل أكثر..." : "I would like to schedule a viewing or request more details..."}
                />
              </label>

              <button type="submit" disabled={submitting} className="inquiry-submit-btn">
                {submitting ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    <span>{isRtl ? "جاري الإرسال..." : "Sending..."}</span>
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    <span>{isRtl ? "إرسال طلب المعاينة والتفاصيل" : "Send Inquiry Request"}</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
