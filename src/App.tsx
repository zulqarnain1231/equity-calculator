import React, { useEffect, useState } from "react";
import "./App.css";
import { CurrencyInput } from "./CurrencyInput";
import { Round } from "./round";
import { TEMPLATES, Template } from "./templates";
import ValuationTable from "./ValuationTable";

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
  }, [joinedSeries]);

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
    <div className="p-8">
      <label className="block mb-4">
        Your Initial Equity Percentage (%):
        <input
          type="number"
          value={initialOwnershipPercentage}
          onChange={(e) =>
            setInitialOwnershipPercentage(parseFloat(e.target.value))
          }
          className="mt-2 p-2 border rounded"
        />
      </label>

      <label className="block mb-4">
        Initial Company Valuation ($):
        <CurrencyInput
          value={initialCompanyValuation}
          onChange={setInitialCompanyValuation} // simplified without needing to parse it again
          className="mt-2 p-2 border rounded"
        />
      </label>
      <label className="block mb-4">
        Series Joined:
        <select
          value={joinedSeries}
          onChange={(e) => setJoinedSeries(e.target.value)}
          className="mt-2 p-2 border rounded">
          {SERIES_LIST.map((series) => (
            <option key={series} value={series}>
              {series.charAt(0).toUpperCase() + series.slice(1)}{" "}
              {/* This will capitalize the series name */}
            </option>
          ))}
        </select>
      </label>

      <div className="mb-4">Initial Equity Value: {initialOwnershipValue}</div>

      <label className="block mb-4">
        Choose a Template:
        <select
          onChange={handleTemplateChange}
          className="mt-2 p-2 border rounded">
          <option value="">Select a template</option>
          {TEMPLATES.map((template, idx) => (
            <option key={idx} value={template.name}>
              {template.name}
            </option>
          ))}
        </select>
      </label>

      <button
        onClick={addRound}
        className="mr-4 px-4 py-2 bg-blue-500 text-white rounded">
        Add Funding Round
      </button>

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
      {rounds.length > 0 && (
        <div className="mt-8 text-xl font-bold">
          Your total equity value = $
          {formatNumber(rounds[rounds.length - 1].equityValue)}
        </div>
      )}
    </div>
  );
}

export default App;
