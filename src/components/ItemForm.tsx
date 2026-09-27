import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Image as ImageIcon, Send, AlertCircle } from 'lucide-react';
import { CATEGORIES, LOCATIONS } from '../data/constants';
import { validateItemForm, type FormErrors } from '../utils/validation';
import { todayISO } from '../utils/dateUtils';
import { useApp } from '../context/AppContext';
import type { LostFoundItem } from '../types';

interface ItemFormProps {
  type: 'Lost' | 'Found';
}

export function ItemForm({ type }: ItemFormProps) {
  const navigate = useNavigate();
  const { addItem, addNotification, showToast } = useApp();
  const isLost = type === 'Lost';

  const [form, setForm] = useState({
    name: '',
    category: '',
    description: '',
    location: '',
    date: '',
    time: '',
    color: '',
    brand: '',
    features: '',
    image: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    preferredContact: 'Email',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);

  const update = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (touched[field]) {
      setErrors(validateItemForm({ ...form, [field]: value }));
    }
  };

  const blur = (field: string) => {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors(validateItemForm(form));
  };

  const previewImage = useMemo(() => form.image.trim(), [form.image]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const allErrors = validateItemForm(form);
    setErrors(allErrors);
    setTouched(Object.keys(form).reduce((acc, k) => ({ ...acc, [k]: true }), {}));
    if (Object.keys(allErrors).length > 0) {
      showToast('warning', 'Please complete all required fields.');
      return;
    }

    setSubmitting(true);
    const fallbackImage = `https://placehold.co/600x450/e2e8f0/64748b?text=${encodeURIComponent(form.name)}`;
    const newItem: Omit<LostFoundItem, 'id' | 'createdAt' | 'updatedAt'> = {
      type,
      status: type,
      name: form.name.trim(),
      category: form.category,
      description: form.description.trim(),
      location: form.location,
      date: form.date,
      time: form.time || undefined,
      color: form.color.trim() || undefined,
      brand: form.brand.trim() || undefined,
      features: form.features.trim() || undefined,
      image: form.image.trim() || fallbackImage,
      contact: {
        name: form.contactName.trim(),
        email: form.contactEmail.trim(),
        phone: form.contactPhone.trim(),
        preferredContact: form.preferredContact as 'Email' | 'Phone',
        department: 'Computer Science',
        year: '2nd Year',
      },
      reportedBy: form.contactName.trim(),
      claim: null,
    };

    const created = addItem(newItem);
    addNotification({
      type: 'report',
      title: `${isLost ? 'Lost' : 'Found'} item reported`,
      message: `Your ${isLost ? 'lost' : 'found'} item "${created.name}" has been reported successfully.`,
      itemId: created.id,
    });
    showToast('success', `${isLost ? 'Lost' : 'Found'} item reported successfully.`);
    setSubmitting(false);
    navigate(`/items/${created.id}`);
  };

  const title = isLost ? 'Report a Lost Item' : 'Report a Found Item';
  const submitLabel = isLost ? 'Report Lost Item' : 'Report Found Item';
  const dateLabel = isLost ? 'Date Lost' : 'Found Date';
  const locLabel = isLost ? 'Location Last Seen' : 'Found Location';

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">{title}</h1>
        <p className={`mt-1 text-sm ${isLost ? 'text-lost-600 dark:text-lost-400' : 'text-found-600 dark:text-found-400'}`}>
          {isLost
            ? 'Fill in the details below so others can help you find your lost item.'
            : 'Fill in the details below so the owner can identify and claim their item.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card p-5 sm:p-6 space-y-6" noValidate>
        {Object.keys(errors).length > 0 && touched.name && (
          <div className="flex items-start gap-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 text-sm text-red-700 dark:text-red-300">
            <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
            <span>Please fix the highlighted fields below before submitting.</span>
          </div>
        )}

        <section>
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">Item Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="label" htmlFor="name">Item Name <span className="text-red-500">*</span></label>
              <input
                id="name" type="text" className={`input ${errors.name ? 'input-error' : ''}`}
                value={form.name} onChange={(e) => update('name', e.target.value)} onBlur={() => blur('name')}
                placeholder="e.g., Black HP Laptop"
                aria-invalid={!!errors.name}
              />
              {errors.name && <p className="error-text">{errors.name}</p>}
            </div>

            <div>
              <label className="label" htmlFor="category">Category <span className="text-red-500">*</span></label>
              <select id="category" className={`input ${errors.category ? 'input-error' : ''}`}
                value={form.category} onChange={(e) => update('category', e.target.value)} onBlur={() => blur('category')}>
                <option value="">Select a category</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.category && <p className="error-text">{errors.category}</p>}
            </div>

            <div>
              <label className="label" htmlFor="location">{locLabel} <span className="text-red-500">*</span></label>
              <select id="location" className={`input ${errors.location ? 'input-error' : ''}`}
                value={form.location} onChange={(e) => update('location', e.target.value)} onBlur={() => blur('location')}>
                <option value="">Select a location</option>
                {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
              {errors.location && <p className="error-text">{errors.location}</p>}
            </div>

            <div className="sm:col-span-2">
              <label className="label" htmlFor="description">Description <span className="text-red-500">*</span></label>
              <textarea id="description" className={`input min-h-[100px] resize-y ${errors.description ? 'input-error' : ''}`}
                value={form.description} onChange={(e) => update('description', e.target.value)} onBlur={() => blur('description')}
                placeholder="Provide a detailed description of the item..."
                aria-invalid={!!errors.description}
              />
              {errors.description && <p className="error-text">{errors.description}</p>}
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">Date & Time</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label" htmlFor="date">{dateLabel} <span className="text-red-500">*</span></label>
              <input id="date" type="date" max={todayISO()} className={`input ${errors.date ? 'input-error' : ''}`}
                value={form.date} onChange={(e) => update('date', e.target.value)} onBlur={() => blur('date')} />
              {errors.date && <p className="error-text">{errors.date}</p>}
            </div>
            <div>
              <label className="label" htmlFor="time">Approximate Time (optional)</label>
              <input id="time" type="time" className="input"
                value={form.time} onChange={(e) => update('time', e.target.value)} />
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">Identifying Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label" htmlFor="color">Color (optional)</label>
              <input id="color" type="text" className="input"
                value={form.color} onChange={(e) => update('color', e.target.value)}
                placeholder="e.g., Black, Blue, Silver" />
            </div>
            <div>
              <label className="label" htmlFor="brand">Brand (optional)</label>
              <input id="brand" type="text" className="input"
                value={form.brand} onChange={(e) => update('brand', e.target.value)}
                placeholder="e.g., Lenovo, Nike, Casio" />
            </div>
            <div className="sm:col-span-2">
              <label className="label" htmlFor="features">Identifying Features (optional)</label>
              <textarea id="features" className="input min-h-[70px] resize-y"
                value={form.features} onChange={(e) => update('features', e.target.value)}
                placeholder="e.g., Small scratch near the logo, sticker on the back..." />
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">Image</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="label" htmlFor="image">Image URL (optional)</label>
              <input id="image" type="url" className={`input ${errors.image ? 'input-error' : ''}`}
                value={form.image} onChange={(e) => update('image', e.target.value)} onBlur={() => blur('image')}
                placeholder="https://example.com/image.jpg" />
              {errors.image && <p className="error-text">{errors.image}</p>}
            </div>
            {previewImage && (
              <div className="sm:col-span-2">
                <p className="text-xs text-slate-500 mb-1.5">Preview:</p>
                <div className="inline-block rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                  <img src={previewImage} alt="Preview" className="h-32 w-auto object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                </div>
              </div>
            )}
            {!previewImage && (
              <div className="sm:col-span-2 flex items-center gap-3 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 p-4 text-slate-400">
                <ImageIcon className="h-8 w-8" />
                <p className="text-sm">No image provided. A placeholder will be used automatically.</p>
              </div>
            )}
          </div>
        </section>

        <section>
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">Contact Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label" htmlFor="contactName">Contact Name <span className="text-red-500">*</span></label>
              <input id="contactName" type="text" className={`input ${errors.contactName ? 'input-error' : ''}`}
                value={form.contactName} onChange={(e) => update('contactName', e.target.value)} onBlur={() => blur('contactName')}
                placeholder="Your name" />
              {errors.contactName && <p className="error-text">{errors.contactName}</p>}
            </div>
            <div>
              <label className="label" htmlFor="preferredContact">Preferred Contact Method</label>
              <select id="preferredContact" className="input"
                value={form.preferredContact} onChange={(e) => update('preferredContact', e.target.value)}>
                <option value="Email">Email</option>
                <option value="Phone">Phone</option>
              </select>
            </div>
            <div>
              <label className="label" htmlFor="contactEmail">Contact Email <span className="text-red-500">*</span></label>
              <input id="contactEmail" type="email" className={`input ${errors.contactEmail ? 'input-error' : ''}`}
                value={form.contactEmail} onChange={(e) => update('contactEmail', e.target.value)} onBlur={() => blur('contactEmail')}
                placeholder="you@campus.edu" />
              {errors.contactEmail && <p className="error-text">{errors.contactEmail}</p>}
            </div>
            <div>
              <label className="label" htmlFor="contactPhone">Contact Phone (optional)</label>
              <input id="contactPhone" type="tel" className={`input ${errors.contactPhone ? 'input-error' : ''}`}
                value={form.contactPhone} onChange={(e) => update('contactPhone', e.target.value)} onBlur={() => blur('contactPhone')}
                placeholder="+91 98765 43210" />
              {errors.contactPhone && <p className="error-text">{errors.contactPhone}</p>}
            </div>
          </div>
        </section>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary">Cancel</button>
          <button type="submit" disabled={submitting} className={`btn ${isLost ? 'bg-lost-600 hover:bg-lost-700' : 'bg-found-600 hover:bg-found-700'} text-white shadow-sm`}>
            <Send className="h-4 w-4" />
            {submitting ? 'Submitting...' : submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
}
