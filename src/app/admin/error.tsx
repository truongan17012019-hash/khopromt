"use client";

export default function AdminError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8">
      <h2 className="text-xl font-bold text-gray-700 mb-2">Có lỗi xảy ra</h2>
      <p className="text-gray-500 text-sm mb-4">{error.message}</p>
      <button onClick={reset} className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm">
        Thử lại
      </button>
    </div>
  );
}
