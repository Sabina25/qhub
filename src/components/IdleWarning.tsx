import React from 'react';

export const IdleWarning: React.FC<{
  visible: boolean;
  timeLeftMs: number;
  onStay: () => void;
}> = ({ visible, timeLeftMs, onStay }) => {
  if (!visible) return null;

  const totalSec = Math.ceil(timeLeftMs / 1000);
  const mm = String(Math.floor(totalSec / 60)).padStart(2, '0');
  const ss = String(totalSec % 60).padStart(2, '0');

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h3 className="text-xl font-semibold mb-2">Вы бездействуете</h3>
        <p className="text-gray-600">
          Автоматический выход через <span className="font-semibold">{mm}:{ss}</span>.
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <button
            className="rounded-lg border px-4 py-2 hover:bg-gray-50"
            onClick={onStay}
          >
            Остаться в системе
          </button>
        </div>
      </div>
    </div>
  );
};
