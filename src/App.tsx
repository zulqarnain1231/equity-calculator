import React, { useEffect, useState } from "react";
import "./App.css";
import { Round } from "./utils/round";
import { SeriesJoinedDropdown } from "./components/SeriesDropdown";
import TemplateDropdown from "./components/TemplateDropdown";
import { TEMPLATES } from "./utils/templates";
import ValuationTable from "./components/ValuationTable";
import ComponentWrapper from "./components/Shared/ComponentWrapper";
import { AiOutlinePlus } from "react-icons/ai";
import SimpleInput from "./components/SimpleInput";

const SERIES_LIST = ["preseed", "seed", "A", "B", "C", "D", "E", "F"];

function roundsEqual<T>(a: T[], b: T[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (JSON.stringify(a[i]) !== JSON.stringify(b[i])) return false;
  }
  return true;
}

function App() {
  const [initialOwnershipPercentage, setInitialOwnershipPercentage] =
    useState<number>(0);
  const [initialCompanyValuation, setInitialCompanyValuation] =
    useState<number>(0);
  const [rounds, setRounds] = useState<Round[]>([]);
  const [joinedSeries, setJoinedSeries] = useState<string>("preseed");

  const addRound = () => {
    const nextSeriesIndex =
      SERIES_LIST.indexOf(joinedSeries) + 1 + rounds.length;
    if (nextSeriesIndex < SERIES_LIST.length) {
      setRounds([
        ...rounds,
        { amount: 0, valuation: 0, series: SERIES_LIST[nextSeriesIndex] },
      ]);
    }
  };

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const chosenTemplate = TEMPLATES.find((t) => t.name === e.target.value);
    if (chosenTemplate) {
      setRounds(chosenTemplate.rounds);
    }
  };

  const formatNumber = (value?: number, symbol: string = ""): string => {
    if (value === undefined || isNaN(value)) return `0${symbol}`;
    return `${value.toFixed(2)}${symbol}`;
  };

  const initialOwnershipValue =
    initialCompanyValuation * (initialOwnershipPercentage / 100);

  const [previousJoinedSeries, setPreviousJoinedSeries] = useState<
    string | null
  >(null);

  // Update the rounds if someone changes the series they joined
  useEffect(() => {
    if (previousJoinedSeries) {
      const oldIndex = SERIES_LIST.indexOf(previousJoinedSeries);
      const newIndex = SERIES_LIST.indexOf(joinedSeries);

      const seriesDifference = newIndex - oldIndex;

      const updatedRounds = rounds.map((round, index) => {
        const newSeriesIndex =
          SERIES_LIST.indexOf(round.series) + seriesDifference;
        return newSeriesIndex >= 0 && newSeriesIndex < SERIES_LIST.length
          ? { ...round, series: SERIES_LIST[newSeriesIndex] }
          : round;
      });

      setRounds(updatedRounds);
    }

    // Update the previousJoinedSeries state for the next change
    setPreviousJoinedSeries(joinedSeries);
  }, [joinedSeries, previousJoinedSeries, rounds]);

  const calculate = () => {
    let currentOwnershipFraction = initialOwnershipPercentage / 100;
    let runningDilutionFactor = 1; // Represents cumulative non-dilution through all rounds

    const updatedRounds: Round[] = rounds.map((round) => {
      const dilution = round.amount / round.valuation;
      runningDilutionFactor *= 1 - dilution;

      const ownershipAfterThisRound =
        currentOwnershipFraction * runningDilutionFactor;

      const totalDilutionPercentage =
        100 * (1 - ownershipAfterThisRound / currentOwnershipFraction);

      const currentEquityValue = ownershipAfterThisRound * round.valuation; // Use the initial valuation

      return {
        ...round,
        dilution: dilution * 100,
        equityValue: currentEquityValue,
        totalDilution: totalDilutionPercentage,
      };
    });

    if (!roundsEqual(rounds, updatedRounds)) {
      setRounds(updatedRounds);
    }
  };

  // If the initial value changes or any of the rounds, recalculate
  useEffect(() => {
    calculate();
  }, [initialOwnershipPercentage, initialCompanyValuation, rounds]);

  const handleRemoveRound = (roundIndex: number) => {
    const updatedRounds = [...rounds];
    updatedRounds.splice(roundIndex, 1);

    // Update series values for rounds after the removed round
    for (let i = roundIndex; i < updatedRounds.length; i++) {
      const prevSeriesIndex = SERIES_LIST.indexOf(updatedRounds[i].series);
      if (prevSeriesIndex > 0) {
        updatedRounds[i].series = SERIES_LIST[prevSeriesIndex - 1];
      }
    }

    setRounds(updatedRounds);
  };

  return (
    <ComponentWrapper style="lg:py-16 py-10 font-inter">
      <div className="w-full h-full flex flex-col items-center justify-start gap-10 ">
        {/* equity and dilution */}
        {rounds.length > 0 && (
          <div className="w-full flex items-center justify-end gap-10">
            <div className="flex flex-col items-center justify-start gap-2">
              <p className="text-black text-sm font-medium">
                Your Total Equity Value
              </p>
              <span className="w-[214px] h-[56px] flex items-center justify-center rounded-[9px] bg-white-secondary text-black text-sm text-center font-medium">
                $ {formatNumber(rounds[rounds.length - 1].equityValue)}
              </span>
            </div>
            <div className="flex flex-col items-center justify-start gap-2">
              <p className="text-black text-sm font-medium">
                Your Total Dilution
              </p>
              <span className="w-[214px] h-[56px] flex items-center justify-center rounded-[9px] bg-white-secondary text-black text-sm text-center font-medium">
                {`${formatNumber(rounds[rounds.length - 1].totalDilution)}%`}
              </span>
            </div>
          </div>
        )}
        {/* offer section */}
        <div className="w-full flex flex-col items-start justify-start gap-6">
          <h2 className="text-black text-2xl font-medium">Your Offer</h2>
          <div className="w-full flex items-center justify-start gap-6">
            <SimpleInput
              label="Percent Ownership (%)"
              value={initialOwnershipPercentage}
              setValue={(e: any) =>
                setInitialOwnershipPercentage(parseFloat(e.target.value))
              }
            />
            <SimpleInput
              label="Company Valuation ($)"
              value={initialCompanyValuation}
              setValue={setInitialCompanyValuation}
            />
            <SeriesJoinedDropdown
              joinedSeries={joinedSeries}
              setJoinedSeries={setJoinedSeries}
            />
          </div>
        </div>
        {/* funding rounds */}
        <div className="w-full flex flex-col justify-start gap-6 items-start">
          <h2 className="text-black text-2xl font-medium">Funding Rounds</h2>
          <div className="w-full flex items-center justify-start gap-6">
            <p className="text-black text-sm font-normal">Templates:</p>
            <button className="h-[36px] px-7 flex items-center justify-center rounded-[20px] bg-white-secondary text-sm text-black font-semibold">
              Biotech Firm
            </button>
            <button className="h-[36px] px-7 flex items-center justify-center rounded-[20px] bg-white-secondary text-sm text-black font-semibold">
              Tech Startup
            </button>
            <TemplateDropdown
              handleTemplateChange={handleTemplateChange}
              templates={TEMPLATES}
            />
          </div>
        </div>
        <ValuationTable
          rounds={rounds}
          formatNumber={formatNumber}
          handleRemoveRound={handleRemoveRound}
          onAmountChange={(index, newValue) => {
            setRounds((prevRounds) => {
              const newRounds = [...prevRounds];
              newRounds[index].amount = newValue;
              return newRounds;
            });
          }}
          onValuationChange={(index, newValue) => {
            setRounds((prevRounds) => {
              const newRounds = [...prevRounds];
              newRounds[index].valuation = newValue;
              return newRounds;
            });
          }}
        />

        <button
          onClick={addRound}
          className="h-[67px] w-full flex items-center justify-center gap-2 text-black text-sm font-medium bg-white-off rounded-[9px]"
        >
          Add Funding Round <AiOutlinePlus className="text-lg text-black" />
        </button>
      </div>
    </ComponentWrapper>
  );
}

export default App;
