import { useState } from 'react';
import { Modal } from './Modal';
import { CheckCircle2 } from 'lucide-react';

interface ClaimModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: { name: string; contact: string; proof: string }) => void;
  itemName: string;
  isFound: boolean;
}

export function ClaimModal({ open, onClose, onConfirm, itemName, isFound }: ClaimModalProps) {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [proof, setProof] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Please enter your name.';
    if (!contact.trim()) errs.contact = 'Please enter your contact information.';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    onConfirm({ name: name.trim(), contact: contact.trim(), proof: proof.trim() });
    setName(''); setContact(''); setProof(''); setErrors({});
  };

  const handleClose = () => {
    setName(''); setContact(''); setProof(''); setErrors({});
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} title={isFound ? 'Claim This Item' : 'Mark as Claimed'}>
      <div className="space-y-4">
        <div className="flex gap-3 items-start">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-found-100 dark:bg-found-900/30">
            <CheckCircle2 className="h-5 w-5 text-found-600 dark:text-found-400" aria-hidden />
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 pt-2">
            {isFound
              ? `Are you sure "${itemName}" belongs to you? Please provide your details so the reporter can verify.`
              : `Have you successfully returned "${itemName}" to its owner?`}
          </p>
        </div>

        {isFound && (
          <div className="space-y-3">
            <div>
              <label className="label" htmlFor="claim-name">Your Name <span className="text-red-500">*</span></label>
              <input
                id="claim-name"
                type="text"
                className={`input ${errors.name ? 'input-error' : ''}`}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
              />
              {errors.name && <p className="error-text">{errors.name}</p>}
            </div>
            <div>
              <label className="label" htmlFor="claim-contact">Contact (Email or Phone) <span className="text-red-500">*</span></label>
              <input
                id="claim-contact"
                type="text"
                className={`input ${errors.contact ? 'input-error' : ''}`}
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="Email or phone number"
              />
              {errors.contact && <p className="error-text">{errors.contact}</p>}
            </div>
            <div>
              <label className="label" htmlFor="claim-proof">Proof / Description (optional)</label>
              <textarea
                id="claim-proof"
                className="input min-h-[80px] resize-y"
                value={proof}
                onChange={(e) => setProof(e.target.value)}
                placeholder="Describe a distinguishing feature or provide proof of ownership"
              />
            </div>
          </div>
        )}

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
          <button onClick={handleClose} className="btn-secondary">Cancel</button>
          <button
            onClick={handleSubmit}
            className="btn bg-found-600 text-white hover:bg-found-700 active:bg-found-800 shadow-sm"
          >
            {isFound ? 'Submit Claim Request' : 'Mark Claimed'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
