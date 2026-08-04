export default function StatBar({ text }) {
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  return <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400"><span>{text.length.toLocaleString()} characters</span><span>{words.toLocaleString()} words</span></div>;
}

