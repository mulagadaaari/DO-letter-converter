import { useEffect, useRef, useState } from 'react';
import { Clipboard, FileText, FileUp, LoaderCircle, Moon, Printer, RotateCcw, Send, Sparkles, Sun, Trash2 } from 'lucide-react';
import DocumentEditor from './components/DocumentEditor';
import StatBar from './components/StatBar';
import Toast from './components/Toast';
import { downloadDocx } from './utils/docx';
import { extractOfficialLetter } from './utils/fileText';

const departments = ['CAG', 'Accountant General', 'Central Government', 'State Government', 'CPWD', 'Railway', 'General'];
const tones = ['Professional', 'Polite', 'Strong Reminder', 'Urgent', 'Friendly'];
const languages = ['English', 'Hindi (coming soon)', 'Odia (coming soon)'];

export default function App() {
  const [official, setOfficial] = useState(''); const [letter, setLetter] = useState('');
  const [department, setDepartment] = useState('General'); const [tone, setTone] = useState('Professional'); const [language, setLanguage] = useState('English');
  const [loading, setLoading] = useState(false); const [uploading, setUploading] = useState(false); const [error, setError] = useState(''); const [toast, setToast] = useState(''); const [dark, setDark] = useState(false);
  const fileInput = useRef(null);
  useEffect(() => { document.documentElement.classList.toggle('dark', dark); }, [dark]);
  useEffect(() => { if (!toast) return; const timer = setTimeout(() => setToast(''), 2600); return () => clearTimeout(timer); }, [toast]);
  const notify = message => setToast(message);
  async function convert() {
    if (!official.trim()) { setError('Please paste or type an official letter before converting.'); return; }
    if (language !== 'English') { setError(`${language.replace(' (coming soon)', '')} conversion is planned for a future release. Please select English.`); return; }
    setError(''); setLoading(true);
    try {
      const res = await fetch('/api/convert', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ letter: official, department, tone, language }) });
      const data = await res.json(); if (!res.ok) throw new Error(data.error || 'Could not convert this letter.');
      setLetter(data.letter); notify('D.O. letter generated successfully.');
    } catch (err) { setError(err.message || 'Something went wrong. Please try again.'); } finally { setLoading(false); }
  }
  function clearAll() { setOfficial(''); setLetter(''); setError(''); notify('Both letters have been cleared.'); }
  async function handleUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setError(''); setUploading(true);
    try { const text = await extractOfficialLetter(file); setOfficial(text); notify(`${file.name} loaded into the editor.`); }
    catch (err) { setError(err.message || 'Could not read this file.'); }
    finally { setUploading(false); event.target.value = ''; }
  }
  async function copy(text) { if (!text) return; try { await navigator.clipboard.writeText(text); notify('Copied to clipboard.'); } catch { setError('Could not access the clipboard. Please copy manually.'); } }
  function printLetter() { if (!letter) return; const win = window.open('', '_blank', 'noopener,noreferrer'); if (!win) { setError('Please allow pop-ups to print the letter.'); return; } win.document.write(`<html><head><title>Demi-Official Letter</title><style>body{font-family:Georgia,serif;white-space:pre-wrap;line-height:1.7;max-width:7in;margin:1in auto;color:#172033}</style></head><body>${letter.replace(/&/g,'&amp;').replace(/</g,'&lt;')}</body></html>`); win.document.close(); win.focus(); win.print(); }
  const download = () => { if (letter) { downloadDocx(letter); notify('DOCX download started.'); } };
  return <div className="min-h-screen bg-slate-100 text-slate-800 transition-colors dark:bg-slate-950 dark:text-slate-100">
    <header className="sticky top-0 z-40 border-b border-blue-100/70 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90"><nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6"><a className="flex items-center gap-3 font-semibold text-government-900 dark:text-white" href="#top"><span className="grid h-9 w-9 place-items-center rounded-lg bg-government-700 text-white"><FileText size={19}/></span><span><span className="block text-xs font-medium text-government-600 dark:text-government-100">M.Aari</span><span className="hidden text-sm sm:block">DO-letter-converter</span></span></a><div className="flex items-center gap-1"><button className="toolbar-button" onClick={convert} disabled={loading}><Sparkles size={16}/><span className="hidden sm:inline">Convert to D.O. Letter</span></button><button className="toolbar-button" onClick={clearAll} disabled={loading}><Trash2 size={16}/><span className="hidden sm:inline">Clear</span></button><button className="toolbar-button" onClick={() => copy(letter)} disabled={!letter}><Clipboard size={16}/><span className="hidden md:inline">Copy</span></button><button className="toolbar-button" onClick={download} disabled={!letter}><FileText size={16}/><span className="hidden lg:inline">Download DOCX</span></button><button className="toolbar-button" onClick={printLetter} disabled={!letter} aria-label="Print letter"><Printer size={16}/></button><button className="ml-1 rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800" onClick={() => setDark(!dark)} aria-label="Toggle dark mode">{dark ? <Sun size={18}/> : <Moon size={18}/>}</button></div></nav></header>
    <main id="top" className="mx-auto max-w-7xl px-4 py-9 sm:px-6 sm:py-14"><section className="mb-9 text-center"><div className="mb-3 inline-flex items-center gap-2 rounded-full border border-government-100 bg-government-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-government-700 dark:border-government-800 dark:bg-government-900/40 dark:text-government-100"><Sparkles size={13}/> AI-powered drafting</div><h1 className="text-3xl font-bold tracking-tight text-government-900 sm:text-5xl dark:text-white">DO-letter-converter</h1><p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg dark:text-slate-300">Convert Official Government Letters into Professional D.O. Letters in seconds.</p></section>
      {error && <div role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-200">{error}</div>}
      <div className="grid gap-6 lg:grid-cols-2"><section className="card flex min-h-[560px] flex-col overflow-hidden"><div className="flex items-start justify-between gap-3 border-b border-slate-200 bg-slate-50 px-5 py-4 dark:border-slate-700 dark:bg-slate-800/60"><div><h2 className="font-semibold text-government-900 dark:text-white">Official Letter</h2><p className="text-xs text-slate-500 dark:text-slate-400">Paste correspondence or upload a document</p></div><input ref={fileInput} className="sr-only" type="file" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={handleUpload}/><button type="button" className="secondary-button whitespace-nowrap" onClick={() => fileInput.current?.click()} disabled={uploading || loading}>{uploading ? <LoaderCircle className="animate-spin" size={15}/> : <FileUp size={15}/>}<span>{uploading ? 'Reading…' : 'Upload PDF / Word'}</span></button></div><div className="flex-1 p-5"><textarea value={official} onChange={e => setOfficial(e.target.value)} placeholder={'Paste an official letter here, or upload a PDF / Word (.docx) file.\n\nParagraphs, line breaks and bullet points are supported.'} aria-label="Official Letter" className="editor-textarea h-full min-h-[250px]" /></div><div className="border-t border-slate-100 p-5 dark:border-slate-700"><p className="mb-4 text-xs text-slate-500 dark:text-slate-400">PDF and DOCX text is extracted in your browser and is not uploaded or stored. Scanned PDFs require OCR.</p><div className="grid gap-3 sm:grid-cols-3"> <Select label="Department" value={department} setValue={setDepartment} values={departments}/><Select label="Tone" value={tone} setValue={setTone} values={tones}/><Select label="Language" value={language} setValue={setLanguage} values={languages}/></div><div className="mt-5 flex items-center justify-between gap-3"><StatBar text={official}/><div className="flex gap-2"><button className="secondary-button" onClick={() => { setOfficial(''); setError(''); }}><RotateCcw size={15}/>Reset</button><button className="primary-button" onClick={convert} disabled={loading || uploading}>{loading ? <LoaderCircle className="animate-spin" size={16}/> : <Send size={16}/>}Convert</button></div></div></div></section>
        <DocumentEditor value={letter} onChange={setLetter} onCopy={() => copy(letter)} onDownload={download} onPrint={printLetter} loading={loading}/></div>
      <p className="mt-5 text-center text-xs text-slate-500 dark:text-slate-400">Your letters are never stored. They are sent only to generate the requested D.O. letter.</p>
    </main><footer className="border-t border-slate-200 bg-white px-4 py-6 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">Made with React + OpenAI</footer><Toast message={toast}/>
  </div>;
}
function Select({ label, value, setValue, values }) { return <label className="block text-xs font-medium text-slate-600 dark:text-slate-300">{label}<select value={value} onChange={e => setValue(e.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-government-600 focus:ring-2 focus:ring-government-100 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:focus:ring-government-900">{values.map(item => <option key={item}>{item}</option>)}</select></label>; }

