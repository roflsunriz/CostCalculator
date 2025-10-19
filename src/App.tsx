import { useEffect, useMemo, useState } from "react";
import Icon from "@mdi/react";
import {
  mdiChartMultiline,
  mdiSnowflake,
  mdiFire,
} from "@mdi/js";
import {
  acModels,
  calculateAcMonthlyCost,
  calculateHeaterMonthlyCost,
  calculateElectricityCostBreakdown,
  findElectricityCompany,
  findGasCompany,
  findKeroseneRegion,
  heaters,
  recommendedModelsForRoom,
  regions,
  roomSizes,
} from "./data";
import type { ElectricityCostBreakdown } from "./types/cost";
import { TabNavigation } from "./components/TabNavigation";
import { SummaryCards } from "./components/SummaryCards";
import { RegionTab } from "./components/RegionTab";
import { CoolingTab } from "./components/CoolingTab";
import { HeatingTab } from "./components/HeatingTab";

const DAYS_PER_MONTH = 30;

type TabType = "region" | "cooling" | "heating";

const defaultRegionId = regions[0]?.id ?? "";
const defaultRoomSize = roomSizes.includes(10) ? 10 : roomSizes[0];
const defaultModelId =
  recommendedModelsForRoom(defaultRoomSize)[0]?.id ?? acModels[0]?.id ?? "";
const defaultHeaters = (() => {
  const preferred = ["ac", "kerosene"].filter((id) =>
    heaters.some((heater) => heater.id === id),
  );
  return preferred.length
    ? preferred
    : heaters.slice(0, 1).map((heater) => heater.id);
})();

function App() {
  const [activeTab, setActiveTab] = useState<TabType>("region");
  const [selectedRegionId, setSelectedRegionId] = useState(defaultRegionId);
  const [selectedRoomSize, setSelectedRoomSize] = useState(defaultRoomSize);
  const [selectedModelId, setSelectedModelId] = useState(defaultModelId);
  const [coolingHoursPerDay, setCoolingHoursPerDay] = useState(8);
  const [heatingHoursPerDay, setHeatingHoursPerDay] = useState(16);
  const [selectedHeaterIds, setSelectedHeaterIds] =
    useState<string[]>(defaultHeaters);

  const selectedRegion = useMemo(
      () =>
        regions.find((region) => region.id === selectedRegionId) ?? regions[0],
      [selectedRegionId],
    ) ?? regions[0];

  const electricityCompany = useMemo(
    () => findElectricityCompany(selectedRegion.electricityCompanyId),
    [selectedRegion],
  );

  const gasCompany = useMemo(
    () => findGasCompany(selectedRegion.gasCompanyId),
    [selectedRegion],
  );

  const keroseneRegion = useMemo(
    () => findKeroseneRegion(selectedRegion.keroseneRegionId),
    [selectedRegion],
  );

  const selectedModel = useMemo(
      () =>
        acModels.find((model) => model.id === selectedModelId) ?? acModels[0],
      [selectedModelId],
    ) ?? acModels[0];

  const monthlyCoolingKwh = useMemo(
    () => selectedModel.power * coolingHoursPerDay * DAYS_PER_MONTH,
    [selectedModel, coolingHoursPerDay],
  );

  const coolingCost = useMemo(
    () =>
      calculateAcMonthlyCost(
        selectedModel,
        coolingHoursPerDay,
        electricityCompany,
        DAYS_PER_MONTH,
      ),
    [selectedModel, coolingHoursPerDay, electricityCompany],
  );

  const coolingBreakdown: ElectricityCostBreakdown = useMemo(() => {
    return calculateElectricityCostBreakdown(
      electricityCompany,
      monthlyCoolingKwh,
    );
  }, [electricityCompany, monthlyCoolingKwh]);

  const recommendedModels = useMemo(
    () => recommendedModelsForRoom(selectedRoomSize),
    [selectedRoomSize],
  );

  useEffect(() => {
    if (!recommendedModels.length) {
      return;
    }

    if (!recommendedModels.some((model) => model.id === selectedModelId)) {
      setSelectedModelId(recommendedModels[0].id);
    }
  }, [recommendedModels, selectedModelId]);

  const heatingResults = useMemo(() => {
    const entries = selectedHeaterIds
      .map((id) => {
        const heater = heaters.find((item) => item.id === id);
        if (!heater) {
          return null;
        }

        return {
          heater,
          cost: calculateHeaterMonthlyCost(
            heater,
            heatingHoursPerDay,
            electricityCompany,
            keroseneRegion,
            gasCompany,
            DAYS_PER_MONTH,
          ),
        };
      })
      .filter(
        (entry): entry is { heater: (typeof heaters)[number]; cost: number } =>
          entry !== null,
      );

    return entries.sort((a, b) => a.cost - b.cost);
  }, [
    selectedHeaterIds,
    heatingHoursPerDay,
    electricityCompany,
    keroseneRegion,
    gasCompany,
  ]);

  const toggleHeater = (id: string) => {
    setSelectedHeaterIds((current) => {
      if (current.includes(id)) {
        if (current.length === 1) {
          return current;
        }
        return current.filter((heaterId) => heaterId !== id);
      }

      return [...current, id];
    });
  };

  const isModelRecommended = recommendedModels.some(
    (model) => model.id === selectedModelId,
  );
  const leadingHeating = heatingResults[0];

  const tabs: Array<{ id: TabType; label: string; icon: string }> = [
    { id: "region", label: "地域設定", icon: mdiChartMultiline },
    { id: "cooling", label: "冷房シミュレーター", icon: mdiSnowflake },
    { id: "heating", label: "暖房コスト比較", icon: mdiFire },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Premium Animated Background */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-gray-900 to-black" />
        <div className="absolute left-1/4 top-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 animate-float">
          <div className="h-full w-full rounded-full bg-gradient-to-br from-violet-600/20 to-pink-600/20 blur-3xl" />
        </div>
        <div className="absolute right-1/4 bottom-0 h-[500px] w-[500px] translate-x-1/2 translate-y-1/2 animate-float" style={{ animationDelay: '2s' }}>
          <div className="h-full w-full rounded-full bg-gradient-to-tl from-cyan-600/20 to-blue-600/20 blur-3xl" />
        </div>
        <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 animate-glow">
          <div className="h-full w-full rounded-full bg-gradient-to-br from-purple-600/10 to-pink-600/10 blur-3xl" />
        </div>
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-20" />
      </div>

      {/* Premium Content Container */}
      <div className="relative mx-auto w-full max-w-7xl px-4 pb-24 pt-12 lg:px-8">
        {/* Premium Header */}
        <header className="mb-16 text-center">
          {/* Premium Badge */}
          <div className="mb-8 inline-flex">
            <div className="group relative inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-violet-600/20 to-pink-600/20 px-5 py-2.5 backdrop-blur-xl transition-all hover:scale-105">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-600/40 to-pink-600/40 opacity-0 blur transition-opacity group-hover:opacity-100" />
              <Icon
                path={mdiChartMultiline}
                size={1}
                className="text-violet-300 drop-shadow-[0_0_8px_rgba(196,181,253,0.5)]"
              />
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-violet-100">
                Premium Analytics
              </span>
              <div className="shimmer absolute inset-0 rounded-full" />
            </div>
          </div>
          
          {/* Main Title with Gradient */}
          <div className="space-y-4">
            <h1 className="text-5xl font-black tracking-tight md:text-7xl">
              <span className="gradient-text inline-block">ダイキン</span>
              <span className="text-white">Eシリーズ</span>
              <br className="hidden sm:block" />
              <span className="text-3xl text-gray-300 md:text-5xl">冷暖房コスト</span>
              <span className="text-3xl gradient-text md:text-5xl">ナビゲーター</span>
            </h1>
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-gray-400 md:text-lg">
              <span className="text-white font-medium">最新のエネルギー料金データ</span>に基づく
              <br className="sm:hidden" />
              精密なコストシミュレーション
            </p>
          </div>
        </header>

        {/* Summary Cards */}
        <SummaryCards
          coolingCost={coolingCost}
          monthlyCoolingKwh={monthlyCoolingKwh}
          coolingHoursPerDay={coolingHoursPerDay}
          leadingHeating={leadingHeating}
          heatingHoursPerDay={heatingHoursPerDay}
          electricityCompany={electricityCompany}
        />

        {/* Tab Navigation */}
        <div className="mt-12">
          <TabNavigation
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={(tabId) => setActiveTab(tabId as TabType)}
          />

          {/* Tab Content */}
          <div className="mt-8 animate-in fade-in duration-300">
            {activeTab === "region" && (
              <RegionTab
                selectedRegionId={selectedRegionId}
                onRegionChange={setSelectedRegionId}
                electricityCompany={electricityCompany}
                gasCompany={gasCompany}
                keroseneRegion={keroseneRegion}
              />
            )}

            {activeTab === "cooling" && (
              <CoolingTab
                selectedRoomSize={selectedRoomSize}
                onRoomSizeChange={setSelectedRoomSize}
                selectedModelId={selectedModelId}
                onModelChange={setSelectedModelId}
                coolingHoursPerDay={coolingHoursPerDay}
                onCoolingHoursChange={setCoolingHoursPerDay}
                heatingHoursPerDay={heatingHoursPerDay}
                onHeatingHoursChange={setHeatingHoursPerDay}
                coolingCost={coolingCost}
                monthlyCoolingKwh={monthlyCoolingKwh}
                coolingBreakdown={coolingBreakdown}
                isModelRecommended={isModelRecommended}
                recommendedModels={recommendedModels}
                electricityCompany={electricityCompany}
              />
            )}

            {activeTab === "heating" && (
              <HeatingTab
                selectedHeaterIds={selectedHeaterIds}
                onToggleHeater={toggleHeater}
                heatingHoursPerDay={heatingHoursPerDay}
                onHeatingHoursChange={setHeatingHoursPerDay}
                coolingHoursPerDay={coolingHoursPerDay}
                onCoolingHoursChange={setCoolingHoursPerDay}
                heatingResults={heatingResults}
              />
                            )}
                          </div>
                        </div>
      </div>
    </div>
  );
}

export default App;
