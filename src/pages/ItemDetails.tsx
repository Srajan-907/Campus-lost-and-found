import { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin, Calendar, Clock, Palette, Tag, Fingerprint, Mail, Phone,
  ArrowLeft, Edit, Trash2, CheckCircle2, Sparkles, Package, ShieldCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/StatusBadge';
import { ConfirmModal } from '../components/ConfirmModal';
import { ClaimModal } from '../components/ClaimModal';
import { EmptyState } from '../components/EmptyState';
import { formatDate, formatTime, timeAgo } from '../utils/dateUtils';
import { findMatches, type MatchResult } from '../utils/matching';
import { SearchX } from 'lucide-react';

export function ItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { items, updateStatus, deleteItem, addNotification, showToast } = useApp();

  const item = useMemo(() => items.find((i) => i.id === id), [items, id]);

  const [showDelete, setShowDelete] = useState(false);
  const [showClaim, setShowClaim] = useState(false);
  const [showMarkClaimed, setShowMarkClaimed] = useState(false);

  const matches = useMemo<MatchResult[]>(() => {
    if (!item || item.status === 'Claimed') return [];
    return findMatches(item, items);
  }, [item, items]);

  if (!item) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <EmptyState
          icon={SearchX}
          title="Item not found"
          message="The item you're looking for doesn't exist or may have been removed."
          actionLabel="Browse Items"
          actionTo="/browse"
        />
      </div>
    );
  }

  const isFound = item.type === 'Found';
  const isClaimed = item.status === 'Claimed';

  const handleClaim = (data: { name: string; contact: string; proof: string }) => {
    updateStatus(item.id, 'Claimed', {
      claimedBy: data.name,
      claimContact: data.contact,
      claimProof: data.proof,
      claimedAt: new Date().toISOString(),
    });
    addNotification({
      type: 'claimed',
      title: 'Item claimed',
      message: `"${item.name}" has been marked as claimed by ${data.name}.`,
      itemId: item.id,
    });
    showToast('success', 'Claim request submitted successfully.');
  };

  const handleMarkClaimed = () => {
    updateStatus(item.id, 'Claimed', {
      claimedBy: item.contact.name,
      claimContact: item.contact.email,
      claimProof: 'Marked as returned by reporter.',
      claimedAt: new Date().toISOString(),
    });
    addNotification({
      type: 'claimed',
      title: 'Item marked as claimed',
      message: `"${item.name}" has been marked as claimed.`,
      itemId: item.id,
    });
    showToast('success', 'Item marked as claimed.');
  };

  const handleDelete = () => {
    deleteItem(item.id);
    showToast('success', 'Report deleted successfully.');
    navigate('/my-reports');
  };

  const matchLabelColor = (label: MatchResult['label']) => {
    if (label === 'High match') return 'bg-found-100 text-found-700 dark:bg-found-900/40 dark:text-found-300';
    if (label === 'Possible match') return 'bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300';
    return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300';
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <Link to="/browse" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 mb-4">
        <ArrowLeft className="h-4 w-4" /> Back to Browse
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left: Image + details */}
        <div className="lg:col-span-3 space-y-4">
          <div className="card overflow-hidden">
            <div className="relative aspect-[16/10] bg-slate-100 dark:bg-slate-800">
              <img
                src={item.image}
                alt={item.name}
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://placehold.co/800x500/e2e8f0/64748b?text=${encodeURIComponent(item.name)}`;
                }}
              />
              <div className="absolute left-4 top-4">
                <StatusBadge status={item.status} />
              </div>
            </div>
            <div className="p-5 sm:p-6">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">{item.name}</h1>
              <div className="mt-2 flex flex-wrap gap-2 text-sm">
                <span className="badge bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  <Tag className="h-3 w-3" /> {item.category}
                </span>
                {item.brand && (
                  <span className="badge bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {item.brand}
                  </span>
                )}
                {item.color && (
                  <span className="badge bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    <Palette className="h-3 w-3" /> {item.color}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="card p-5 sm:p-6">
            <h2 className="font-semibold text-slate-900 dark:text-white mb-3">Description</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{item.description}</p>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <DetailRow icon={MapPin} label="Location" value={item.location} />
              <DetailRow icon={Calendar} label="Date" value={formatDate(item.date)} />
              {item.time && <DetailRow icon={Clock} label="Approx. Time" value={formatTime(item.time)} />}
              {item.features && <DetailRow icon={Fingerprint} label="Identifying Features" value={item.features} />}
            </div>
          </div>

          {/* Location View */}
          <div className="card p-5 sm:p-6">
            <h2 className="font-semibold text-slate-900 dark:text-white mb-3">Location</h2>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-slate-900 dark:text-white">{item.location}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">CSI AITR Campus</p>
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-slate-50 to-brand-50/30 dark:from-slate-800 dark:to-brand-950/20 h-40 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-10 w-10 text-brand-400 mx-auto mb-1" />
                <p className="text-sm text-slate-500 dark:text-slate-400">{item.location}</p>
                <p className="text-xs text-slate-400 mt-0.5">Campus location map placeholder</p>
              </div>
            </div>
          </div>

          {/* Claimed info */}
          {isClaimed && item.claim && (
            <div className="card p-5 border-found-200 dark:border-found-800 bg-found-50/50 dark:bg-found-900/10">
              <div className="flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-found-600 dark:text-found-400 shrink-0 mt-0.5" />
                <div>
                  <h2 className="font-semibold text-found-800 dark:text-found-200">Claimed by {item.claim.claimedBy}</h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Contact: {item.claim.claimContact}
                  </p>
                  {item.claim.claimProof && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      Proof: {item.claim.claimProof}
                    </p>
                  )}
                  <p className="text-xs text-slate-400 mt-1">Claimed {timeAgo(item.claim.claimedAt)}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Contact + Actions + Matches */}
        <div className="lg:col-span-2 space-y-4">
          {/* Contact */}
          <div className="card p-5">
            <h2 className="font-semibold text-slate-900 dark:text-white mb-3">Reported by</h2>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-600 text-white font-semibold text-lg">
                {item.contact.name.charAt(0)}
              </div>
              <div>
                <p className="font-medium text-slate-900 dark:text-white">{item.contact.name}</p>
                {item.contact.department && (
                  <p className="text-xs text-slate-500 dark:text-slate-400">{item.contact.department} — {item.contact.year}</p>
                )}
                <p className="text-xs text-slate-400 mt-0.5">Reported {timeAgo(item.createdAt)}</p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <a
                href={`mailto:${item.contact.email}`}
                className="btn-secondary justify-start"
              >
                <Mail className="h-4 w-4" /> Contact via Email
              </a>
              {item.contact.phone && (
                <a href={`tel:${item.contact.phone}`} className="btn-secondary justify-start">
                  <Phone className="h-4 w-4" /> Contact via Phone
                </a>
              )}
            </div>
          </div>

          {/* Actions */}
          {!isClaimed && (
            <div className="card p-5">
              <h2 className="font-semibold text-slate-900 dark:text-white mb-3">Actions</h2>
              <div className="flex flex-col gap-2">
                {isFound && (
                  <button onClick={() => setShowClaim(true)} className="btn bg-found-600 text-white hover:bg-found-700 shadow-sm">
                    <CheckCircle2 className="h-4 w-4" /> Claim This Item
                  </button>
                )}
                <button onClick={() => setShowMarkClaimed(true)} className="btn-primary">
                  <Package className="h-4 w-4" /> Mark as Claimed
                </button>
                <Link to={`/my-reports?edit=${item.id}`} className="btn-secondary justify-center">
                  <Edit className="h-4 w-4" /> Edit Report
                </Link>
                <button onClick={() => setShowDelete(true)} className="btn-danger">
                  <Trash2 className="h-4 w-4" /> Delete Report
                </button>
              </div>
            </div>
          )}

          {/* Possible Matches */}
          {!isClaimed && matches.length > 0 && (
            <div className="card p-5">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                <h2 className="font-semibold text-slate-900 dark:text-white">Possible Matches</h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                Based on category, location, brand, color, and date similarity. Not guaranteed.
              </p>
              <div className="space-y-3">
                {matches.map((match) => (
                  <Link
                    key={match.item.id}
                    to={`/items/${match.item.id}`}
                    className="block rounded-lg border border-slate-200 dark:border-slate-700 p-3 hover:border-brand-300 dark:hover:border-brand-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{match.item.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {match.item.type} near {match.item.location}
                        </p>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {match.reasons.slice(0, 2).map((r) => (
                            <span key={r} className="text-[10px] badge bg-slate-100 dark:bg-slate-800 text-slate-500">{r}</span>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className={`badge text-[10px] ${matchLabelColor(match.label)}`}>{match.label}</span>
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{match.percentage}%</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {!isClaimed && matches.length === 0 && (
            <div className="card p-5">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-slate-400" />
                <h2 className="font-semibold text-slate-900 dark:text-white">Possible Matches</h2>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No possible matches found. Check back later as new items are reported.
              </p>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        title="Delete Report"
        message="Are you sure you want to delete this report? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
      />
      <ClaimModal
        open={showClaim}
        onClose={() => setShowClaim(false)}
        onConfirm={handleClaim}
        itemName={item.name}
        isFound={true}
      />
      <ClaimModal
        open={showMarkClaimed}
        onClose={() => setShowMarkClaimed(false)}
        onConfirm={handleMarkClaimed}
        itemName={item.name}
        isFound={false}
      />
    </div>
  );
}

function DetailRow({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" aria-hidden />
      <div className="min-w-0">
        <p className="text-xs text-slate-400">{label}</p>
        <p className="text-sm text-slate-700 dark:text-slate-200">{value}</p>
      </div>
    </div>
  );
}
