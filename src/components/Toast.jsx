export default function Toast({ message }) {
  if (!message) return null;
  return <div role="status" className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full bg-government-900 px-5 py-3 text-sm font-medium text-white shadow-xl animate-in">{message}</div>;
}

