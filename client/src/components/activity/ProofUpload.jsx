import { useState, useRef } from 'react';
import { UploadCloud, FileCheck, X, Paperclip } from 'lucide-react';
import Button from '../common/Button';
import { useLanguage } from '../../hooks/useLanguage';

/**
 * Reusable ProofUpload component
 *
 * @param {Object} props
 * @param {string|null} props.fileName
 * @param {Function} props.onFileChange
 * @param {string} [props.className='']
 */
export function ProofUpload({
  fileName = null,
  onFileChange,
  className = '',
}) {
  const { t } = useLanguage();
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileChange(file.name);
    }
  };

  const handleMockAttach = () => {
    onFileChange('payment_receipt_audit_scan.pdf');
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    onFileChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
        {t('activity.attachProofTitle')}
      </label>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.png,.jpg,.jpeg,.csv"
        className="hidden"
        onChange={handleFileSelect}
      />

      {fileName ? (
        /* File Attached State */
        <div className="p-4 rounded-xl border border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/40 dark:bg-emerald-950/20 flex items-center justify-between gap-3 animate-in fade-in duration-150">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <FileCheck className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-emerald-900 dark:text-emerald-200 truncate">
                {fileName}
              </p>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                {t('activity.proofAttachedSuccess')}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRemove}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer shrink-0"
            title="Remove file"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        /* Empty Upload Zone */
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            const file = e.dataTransfer?.files?.[0];
            if (file) onFileChange(file.name);
          }}
          className={`p-4 rounded-xl border border-dashed transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
            dragActive
              ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40'
              : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 hover:border-slate-300 dark:hover:border-slate-700'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                {t('activity.attachProofTitle')}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                {t('activity.attachProofSubtitle')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Button
              variant="outline"
              size="sm"
              icon={<Paperclip className="w-3.5 h-3.5" />}
              onClick={() => fileInputRef.current?.click()}
              className="text-xs"
            >
              {t('activity.browseFilesBtn')}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMockAttach}
              className="text-xs text-indigo-600 dark:text-indigo-400"
            >
              {t('activity.attachSampleBtn')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProofUpload;
