import WeightForm from "@/app/component/weightForm";
import ScoreForm from "@/app/component/scoreForm";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-row items-start justify-between p-24">
      <SettingMenu />
      <ScoreForm />
    </main>
  );
}

function SettingMenu() {
  return (
    <div className="flex flex-col w-fit gap-4">
      <label className="relative block overflow-hidden border-b border-gray-200 bg-transparent pt-3 focus-within:border-blue-500">
        <input
          type="text"
          name="pid"
          placeholder="Participant ID"
          className="peer h-8 w-full border-none bg-transparent p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
        />
        <span className="absolute start-0 top-2 -translate-y-1/2 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs">
          Participant ID
        </span>
      </label>
      <label className="flex flex-row gap-2 whitespace-pre text-gray-700 text-sm">
        <input
          type="checkbox"
          name="weight-toggle"
          className="accent-blue-500"
        />
        Enable weighted score
      </label>
    </div>
  );
}
