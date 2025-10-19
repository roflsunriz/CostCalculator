import Icon_component from "@mdi/react";
import {
  mdiClockOutline,
  mdiOilTemperature,
  mdiFlare,
  mdiFire,
} from "@mdi/js";
import { formatNumber, formatYen } from "@/utils/format";
import { heaters } from "@/data";
import type { Heater } from "@/data";

interface HeatingTabProps {
  selectedHeaterIds: string[];
  onToggleHeater: (heaterId: string) => void;
  heatingHoursPerDay: number;
  onHeatingHoursChange: (hours: number) => void;
  coolingHoursPerDay: number;
  onCoolingHoursChange: (hours: number) => void;
  heatingResults: Array<{
    heater: Heater;
    cost: number;
  }>;
}

const DAYS_PER_MONTH = 30;

function getHeaterIcon(type: string) {
  switch (type) {
    case "kerosene":
      return mdiOilTemperature;
    case "gas":
      return mdiFlare;
    default:
      return mdiFire;
  }
}

export function HeatingTab({
  selectedHeaterIds,
  onToggleHeater,
  heatingHoursPerDay,
  onHeatingHoursChange,
  coolingHoursPerDay,
  onCoolingHoursChange,
  heatingResults,
}: HeatingTabProps) {
  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {/* Premium Settings Panel */}
      <div className="space-y-6 lg:col-span-1">
        {/* Operating Hours */}
        <div className="glass-card rounded-3xl p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-400/30 to-gray-600/30 blur-xl" />
              <div className="relative rounded-2xl bg-gradient-to-br from-gray-400/20 to-gray-600/20 p-3">
                <Icon_component path={mdiClockOutline} size={1.1} className="text-gray-300 drop-shadow-lg" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                運用条件
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                使用時間を設定
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-gray-400">
                冷房時間 / 日
              </span>
              <div className="relative mt-2">
                <input
                  type="number"
                  min={0}
                  max={24}
                  step={0.5}
                  value={coolingHoursPerDay}
                  onChange={(event) =>
                    onCoolingHoursChange(Number(event.target.value) || 0)
                  }
                  className="
                    w-full rounded-xl
                    bg-gradient-to-r from-white/5 to-white/3
                    border border-white/10 px-4 py-3
                    text-sm font-medium text-white outline-none
                    transition-all duration-200
                    focus:border-cyan-400/50 focus:shadow-[0_0_20px_rgba(6,182,212,0.2)]
                    hover:bg-white/[0.07]
                  "
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                  時間
                </span>
              </div>
            </label>
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-gray-400">
                暖房時間 / 日
              </span>
              <div className="relative mt-2">
                <input
                  type="number"
                  min={0}
                  max={24}
                  step={0.5}
                  value={heatingHoursPerDay}
                  onChange={(event) =>
                    onHeatingHoursChange(Number(event.target.value) || 0)
                  }
                  className="
                    w-full rounded-xl
                    bg-gradient-to-r from-white/5 to-white/3
                    border border-white/10 px-4 py-3
                    text-sm font-medium text-white outline-none
                    transition-all duration-200
                    focus:border-emerald-400/50 focus:shadow-[0_0_20px_rgba(16,185,129,0.2)]
                    hover:bg-white/[0.07]
                  "
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                  時間
                </span>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Premium Selection and Results Panel */}
      <div className="glass-card rounded-3xl p-8 lg:col-span-2">
        <h2 className="text-2xl font-bold text-white mb-8">
          暖房機器の比較
        </h2>

        {/* Device Selection Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-gray-400">
              比較する機器を選択
            </p>
            <div className="h-px flex-1 ml-4 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>
          
          <div className="grid gap-3 md:grid-cols-2">
            {heaters.map((heater: Heater) => {
              const isChecked = selectedHeaterIds.includes(heater.id);
              const iconPath = getHeaterIcon(heater.type);

              return (
                <label
                  key={heater.id}
                  className={`
                    group relative cursor-pointer overflow-hidden rounded-xl
                    border transition-all duration-200
                    ${
                      isChecked
                        ? "neu-button bg-gradient-to-r from-emerald-500/10 to-green-600/10 border-emerald-400/30"
                        : "bg-gradient-to-r from-white/5 to-white/3 border-white/10 hover:bg-white/[0.07]"
                    }
                  `}
                >
                  <div className="flex items-start gap-3 p-4">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => onToggleHeater(heater.id)}
                      className="mt-1 h-4 w-4 shrink-0 rounded border-white/20 bg-black/60 text-emerald-400 focus:ring-emerald-400/30"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className={`
                          relative rounded-xl p-2.5
                          ${isChecked 
                            ? "bg-gradient-to-br from-emerald-500/20 to-green-600/20" 
                            : "bg-white/10"}
                        `}>
                          <Icon_component 
                            path={iconPath} 
                            size={0.9} 
                            className={isChecked ? "text-emerald-300 drop-shadow" : "text-gray-400"}
                          />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">
                            {heater.name}
                          </p>
                          <div className="mt-1 text-xs text-gray-400">
                            {"power" in heater ? (
                              <span>電気 / {formatNumber(heater.power)}kW / 効率{" "}{formatNumber(heater.efficiency * 100)}%</span>
                            ) : heater.type === "kerosene" ? (
                              <span>灯油 / {formatNumber(heater.consumption)}L/時 / 効率{" "}{formatNumber(heater.efficiency * 100)}%</span>
                            ) : (
                              <span>ガス / {formatNumber(heater.consumption)}m³/時 / 効率{" "}{formatNumber(heater.efficiency * 100)}%</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="premium-hover" />
                </label>
              );
            })}
          </div>

          {selectedHeaterIds.length === 1 && (
            <p className="mt-4 text-xs text-gray-500 text-center">
              ※ 最低1つは選択された状態を保ちます。
            </p>
          )}
        </div>

        {/* Cost Comparison Results */}
        <div className="relative rounded-2xl bg-gradient-to-br from-emerald-500/10 via-green-600/5 to-transparent p-8">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/5 to-green-600/5 blur-xl" />
          <div className="relative">
            <div className="flex items-center justify-between mb-6">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-300">
                月間推定費用（比較結果）
              </p>
              <div className="h-px flex-1 ml-4 bg-gradient-to-r from-transparent via-emerald-400/20 to-transparent" />
            </div>

            {heatingResults.length ? (
              <div className="space-y-3">
                {heatingResults.map(({ heater, cost }, idx) => {
                  const isLowest = idx === 0;

                  return (
                    <div
                      key={heater.id}
                      className={`
                        group relative overflow-hidden rounded-xl px-5 py-4
                        border transition-all duration-200
                        ${
                          isLowest
                            ? "neu-button bg-gradient-to-r from-emerald-500/15 to-green-600/15 border-emerald-400/40"
                            : "bg-gradient-to-r from-white/5 to-white/3 border-white/10 hover:bg-white/[0.07]"
                        }
                      `}
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                          {isLowest && (
                            <div className="text-xl">🏆</div>
                          )}
                          <div>
                            <p className={`text-sm font-bold ${isLowest ? "text-emerald-300" : "text-white"}`}>
                              {heater.name}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {heatingHoursPerDay}時間 / 日 × {DAYS_PER_MONTH}日
                            </p>
                          </div>
                        </div>
                        <p className={`text-2xl font-black ${isLowest ? "text-emerald-300" : "text-white"}`}>
                          {formatYen(cost)}
                        </p>
                      </div>
                      <div className="premium-hover" />
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-8">
                暖房機器を選択すると結果が表示されます。
              </p>
            )}

            <p className="mt-6 text-xs text-gray-500 text-center">
              ※ ガス・灯油は効率補正後の消費量に単価を掛け合わせています。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}