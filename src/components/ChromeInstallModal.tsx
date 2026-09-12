import React from 'react';
import { X, Chrome, Download, Folder, CheckCircle, ExternalLink, ArrowRight } from 'lucide-react';

interface ChromeInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownloadZip: () => void;
}

export default function ChromeInstallModal({
  isOpen,
  onClose,
  onDownloadZip
}: ChromeInstallModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-xl w-full p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-150">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 p-1 rounded-lg transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title & Badge */}
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
            <Chrome className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              How to Install SEO Lens in Google Chrome
            </h3>
            <p className="text-xs text-slate-500">
              Takes less than 30 seconds using Chrome's "Load Unpacked" feature
            </p>
          </div>
        </div>

        {/* Steps List */}
        <div className="space-y-3.5 mb-6">
          <div className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              1
            </span>
            <div className="text-xs">
              <span className="font-bold text-slate-900 block mb-0.5">Download and Unzip the Extension</span>
              <span className="text-slate-600">
                Click the button below to download <code className="font-mono bg-white px-1.5 py-0.5 rounded border text-slate-800">seo-lens-extension.zip</code>, then right-click and extract it to a folder.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              2
            </span>
            <div className="text-xs">
              <span className="font-bold text-slate-900 block mb-0.5">Open Extensions Manager in Chrome</span>
              <span className="text-slate-600">
                In Google Chrome, open a new tab and paste <code className="font-mono bg-white px-1.5 py-0.5 rounded border text-slate-800">chrome://extensions</code> in the address bar.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              3
            </span>
            <div className="text-xs">
              <span className="font-bold text-slate-900 block mb-0.5">Enable "Developer mode"</span>
              <span className="text-slate-600">
                Turn on the <b>"Developer mode"</b> toggle switch located at the top-right corner of the Chrome extensions page.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              4
            </span>
            <div className="text-xs">
              <span className="font-bold text-slate-900 block mb-0.5">Click "Load unpacked" & Select Folder</span>
              <span className="text-slate-600">
                Click the <b>"Load unpacked"</b> button in the top-left, and select the folder you extracted in Step 1. The extension icon will appear in your Chrome toolbar!
              </span>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 transition"
          >
            Close Guide
          </button>
          <button
            onClick={() => {
              onDownloadZip();
              onClose();
            }}
            className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm inline-flex items-center gap-2 transition"
          >
            <Download className="w-4 h-4" />
            <span>Download Extension ZIP Now</span>
          </button>
        </div>
      </div>
    </div>
  );
}
