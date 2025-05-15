import React from 'react';

interface Settings {
  workers: number;
  delivery: number;
  margin: number;
}

interface Props {
  show: boolean;
  toggle: () => void;
  settings: Settings;
  update: (key: string, value: number) => void;
}

export default function SettingsPanel({ show, toggle, settings, update }: Props) {
  if (!show) return null;

  return (
    <div className="relative mb-4">
      <button
        onClick={toggle}
        className="flex items-center gap-2 px-3 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
      >
        ⚙️ {show ? 'Close Settings' : 'Open Settings'}
      </button>

      <div className="absolute mt-2 right-0 z-10 bg-white shadow-lg border rounded p-4 w-72">
        <h2 className="text-lg font-semibold mb-2">System Settings</h2>
        <label className="block mb-2">🧑‍🔧 Workers:
          <input
            type="number"
            value={settings.workers}
            onChange={(e) => update('workers', parseInt(e.target.value))}
            className="w-full mt-1 px-2 py-1 border rounded"
          />
        </label>
        <label className="block mb-2">🚗 Delivery Time (min):
          <input
            type="number"
            value={settings.delivery}
            onChange={(e) => update('delivery', parseInt(e.target.value))}
            className="w-full mt-1 px-2 py-1 border rounded"
          />
        </label>
        <label className="block">⏱ Safety Margin (min):
          <input
            type="number"
            value={settings.margin}
            onChange={(e) => update('margin', parseInt(e.target.value))}
            className="w-full mt-1 px-2 py-1 border rounded"
          />
        </label>
      </div>
    </div>
  );
}
