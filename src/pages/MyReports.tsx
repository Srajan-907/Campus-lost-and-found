import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  FileText, MapPin, Calendar, Eye, Edit, Trash2, CheckCircle2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/StatusBadge';
import { ConfirmModal } from '../components/ConfirmModal';
import { ClaimModal } from '../components/ClaimModal';
import { EmptyState } from '../components/EmptyState';
import { formatDate, timeAgo } from '../utils/dateUtils';
import type { LostFoundItem } from '../types';

type Tab = 'All' | 'Lost' | 'Found' | 'Claimed';

const TABS: Tab[] = ['All', 'Lost', 'Found', 'Claimed'];

export function MyReports() {
  const { items, deleteItem, updateStatus, updateItem, addNotification, showToast } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const [tab, setTab] = useState<Tab>('All');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [claimId, setClaimId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    const edit = searchParams.get('edit');
    if (edit) setEditId(edit);
  }, [searchParams]);

  // Filter to demo user's reports (all items reported by "Campus Admin" or by demo user's typical reporters)
  // For prototype, show all items as "my reports" since there's no real auth
  const myItems = useMemo(() => items, [items]);

  const filtered = useMemo(() => {
    if (tab === 'All') return myItems;
    if (tab === 'Claimed') return myItems.filter((i) => i.status === 'Claimed');
    return myItems.filter((i) => i.status === tab);
  }, [myItems, tab]);

  const sorted = useMemo(
    () => [...filtered].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),
    [filtered],
  );

  const editItem = useMemo(() => items.find((i) => i.id === editId), [items, editId]);

  const handleDelete = () => {
    if (!deleteId) return;
    deleteItem(deleteId);
    showToast('success', 'Report deleted successfully.');
    setDeleteId(null);
  };

  const handleClaim = (data: { name: string; contact: string; proof: string }) => {
    if (!claimId) return;
    const item = items.find((i) => i.id === claimId);
    if (!item) return;
    updateStatus(claimId, 'Claimed', {
      claimedBy: data.name,
      claimContact: data.contact,
      claimProof: data.proof,
      claimedAt: new Date().toISOString(),
    });
    addNotification({
      type: 'claimed',
      title: 'Item marked as claimed',
      message: `"${item.name}" has been marked as claimed.`,
      itemId: claimId,
    });
    showToast('success', 'Item marked as claimed.');
    setClaimId(null);
  };

  const handleSaveEdit = (updated: LostFoundItem) => {
    updateItem(updated);
    showToast('success', 'Report updated successfully.');
    setEditId(null);
    setSearchParams({});
  };

  const claimItem = useMemo(() => items.find((i) => i.id === claimId), [items, claimId]);

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">My Reports</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Manage your reported lost and found items.</p>
      </div>

      {/* Tabs */}
      <div className="mb-4 flex gap-1 overflow-x-auto border-b border-slate-200 dark:border-slate-800">
        {TABS.map((t) => {
          const count = t === 'All'
            ? myItems.length
            : t === 'Claimed'
              ? myItems.filter((i) => i.status === 'Claimed').length
              : myItems.filter((i) => i.status === t).length;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`relative px-4 py-2.5 text-sm font-medium transition-colors whitespace-nowrap ${
                tab === t
                  ? 'text-brand-600 dark:text-brand-400'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {t} <span className="text-xs opacity-70">({count})</span>
              {tab === t && <span className="absolute inset-x-0 -bottom-px h-0.5 bg-brand-600 dark:bg-brand-400" />}
            </button>
          );
        })}
      </div>

      {sorted.length === 0 ? (
        <EmptyState
          icon={FileText}
          title={tab === 'All' ? "No reports yet" : `No ${tab.toLowerCase()} reports`}
          message={tab === 'All'
            ? "You haven't reported any items yet. Start by reporting a lost or found item."
            : `You don't have any ${tab.toLowerCase()} items.`}
          actionLabel="Report Lost Item"
          actionTo="/report-lost"
        />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block card overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                <tr className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <th className="px-4 py-3">Item</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Updated</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {sorted.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={item.image} alt="" className="h-10 w-10 rounded-lg object-cover shrink-0"
                          onError={(e) => { (e.target as HTMLImageElement).src = `https://placehold.co/80x80/e2e8f0/64748b?text=${encodeURIComponent(item.name.slice(0, 2))}`; }} />
                        <div className="min-w-0">
                          <p className="font-medium text-slate-900 dark:text-white text-sm truncate">{item.name}</p>
                          <p className="text-xs text-slate-400">{item.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={item.status} size="sm" /></td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">{item.location}</td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">{formatDate(item.date)}</td>
                    <td className="px-4 py-3 text-xs text-slate-400">{timeAgo(item.updatedAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link to={`/items/${item.id}`} className="rounded-lg p-2 text-slate-500 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-900/20" aria-label="View">
                          <Eye className="h-4 w-4" />
                        </Link>
                        {item.status !== 'Claimed' && (
                          <>
                            <button onClick={() => setEditId(item.id)} className="rounded-lg p-2 text-slate-500 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-900/20" aria-label="Edit">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button onClick={() => setClaimId(item.id)} className="rounded-lg p-2 text-slate-500 hover:bg-found-50 hover:text-found-600 dark:hover:bg-found-900/20" aria-label="Mark claimed">
                              <CheckCircle2 className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        <button onClick={() => setDeleteId(item.id)} className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20" aria-label="Delete">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {sorted.map((item) => (
              <div key={item.id} className="card p-4">
                <div className="flex items-start gap-3">
                  <img src={item.image} alt="" className="h-14 w-14 rounded-lg object-cover shrink-0"
                    onError={(e) => { (e.target as HTMLImageElement).src = `https://placehold.co/80x80/e2e8f0/64748b?text=${encodeURIComponent(item.name.slice(0, 2))}`; }} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-slate-900 dark:text-white text-sm truncate">{item.name}</p>
                      <StatusBadge status={item.status} size="sm" />
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{item.category}</p>
                    <div className="mt-1.5 flex flex-wrap gap-2 text-xs text-slate-500">
                      <span className="flex items-center gap-0.5"><MapPin className="h-3 w-3" />{item.location}</span>
                      <span className="flex items-center gap-0.5"><Calendar className="h-3 w-3" />{formatDate(item.date)}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Updated {timeAgo(item.updatedAt)}</p>
                  </div>
                </div>
                <div className="mt-3 flex gap-2 border-t border-slate-100 dark:border-slate-800 pt-3">
                  <Link to={`/items/${item.id}`} className="btn-ghost btn-sm flex-1 justify-center"><Eye className="h-4 w-4" /> View</Link>
                  {item.status !== 'Claimed' && (
                    <>
                      <button onClick={() => setEditId(item.id)} className="btn-ghost btn-sm flex-1 justify-center"><Edit className="h-4 w-4" /> Edit</button>
                      <button onClick={() => setClaimId(item.id)} className="btn-ghost btn-sm flex-1 justify-center text-found-600"><CheckCircle2 className="h-4 w-4" /> Claim</button>
                    </>
                  )}
                  <button onClick={() => setDeleteId(item.id)} className="btn-ghost btn-sm text-red-600"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <ConfirmModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Report"
        message="Are you sure you want to delete this report? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
      />
      <ClaimModal
        open={!!claimId}
        onClose={() => setClaimId(null)}
        onConfirm={handleClaim}
        itemName={claimItem?.name || ''}
        isFound={false}
      />
      {editItem && (
        <EditModal
          item={editItem}
          onClose={() => { setEditId(null); setSearchParams({}); }}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
}

function EditModal({ item, onClose, onSave }: { item: LostFoundItem; onClose: () => void; onSave: (item: LostFoundItem) => void }) {
  const [form, setForm] = useState({
    name: item.name,
    category: item.category,
    description: item.description,
    location: item.location,
    date: item.date,
    brand: item.brand || '',
    color: item.color || '',
    contactName: item.contact.name,
    contactEmail: item.contact.email,
    contactPhone: item.contact.phone,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.description.trim() || !form.date) return;
    onSave({
      ...item,
      name: form.name.trim(),
      category: form.category,
      description: form.description.trim(),
      location: form.location,
      date: form.date,
      brand: form.brand.trim() || undefined,
      color: form.color.trim() || undefined,
      contact: {
        ...item.contact,
        name: form.contactName.trim(),
        email: form.contactEmail.trim(),
        phone: form.contactPhone.trim(),
      },
      reportedBy: form.contactName.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm animate-fade-in" onClick={onClose} aria-hidden />
      <div role="dialog" aria-modal="true" aria-labelledby="edit-title" className="relative w-full max-w-2xl card max-h-[90vh] overflow-y-auto rounded-b-none sm:rounded-xl animate-slide-up">
        <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 p-4 bg-white dark:bg-slate-900 rounded-t-xl">
          <h2 id="edit-title" className="text-lg font-semibold text-slate-900 dark:text-white">Edit Report</h2>
          <button onClick={onClose} className="btn-ghost btn-sm" aria-label="Close">Cancel</button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="label">Item Name</label>
              <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="label">Category</label>
              <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {['Electronics', 'ID Cards', 'Books', 'Accessories', 'Other'].map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Location</label>
              <select className="input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}>
                {['Library', 'Cafeteria', 'Computer Lab', 'Auditorium', 'Parking Area', 'Hostel', 'Sports Ground', 'Main Gate', 'Other'].map((l) => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="label">Description</label>
              <textarea className="input min-h-[80px] resize-y" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div>
              <label className="label">Date</label>
              <input type="date" className="input" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>
            <div>
              <label className="label">Brand</label>
              <input className="input" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
            </div>
            <div>
              <label className="label">Color</label>
              <input className="input" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} />
            </div>
            <div>
              <label className="label">Contact Name</label>
              <input className="input" value={form.contactName} onChange={(e) => setForm({ ...form, contactName: e.target.value })} />
            </div>
            <div>
              <label className="label">Contact Email</label>
              <input className="input" value={form.contactEmail} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} />
            </div>
            <div>
              <label className="label">Contact Phone</label>
              <input className="input" value={form.contactPhone} onChange={(e) => setForm({ ...form, contactPhone: e.target.value })} />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary"><Edit className="h-4 w-4" /> Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
}
