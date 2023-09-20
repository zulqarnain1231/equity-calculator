import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import "./App.css";
import { CurrencyInput } from "./components/CurrencyInput";
import { Round } from "./utils/round";
import { SeriesJoinedDropdown } from "./components/SeriesDropdown";
import { TemplateDropdown } from "./components/TemplateDropdown";
import { TEMPLATES } from "./utils/templates";
import ValuationTable from "./components/ValuationTable";
import Container from "@mui/material/Container";

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
    <Container maxWidth="lg" sx={{ mt: 10 }}>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2} direction="column">
          <Grid item>
            <Typography variant="h5" component="h1" gutterBottom>
              Your Initial Equity
            </Typography>
            <TextField
              id="outlined-number"
              label="Percentage (%)"
              type="number"
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              value={initialOwnershipPercentage}
              onChange={(e) =>
                setInitialOwnershipPercentage(parseFloat(e.target.value))
              }
            />
          </Grid>

          <Grid item>
            <Typography variant="h5" component="h1" gutterBottom>
              Company Details When Joined
            </Typography>
            <CurrencyInput
              label={"Valuation ($):"}
              value={initialCompanyValuation}
              onChange={setInitialCompanyValuation}
              className="mt-2 p-2 border rounded"
            />
            <SeriesJoinedDropdown
              joinedSeries={joinedSeries}
              setJoinedSeries={setJoinedSeries}
            />
          </Grid>
        </Grid>
      </Box>

      <Typography variant="h4" component="h1" gutterBottom>
        Initial Equity Value: {initialOwnershipValue}
      </Typography>

      <Grid>
        <TemplateDropdown
          handleTemplateChange={handleTemplateChange}
          templates={TEMPLATES}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={addRound}
          className="mr-4">
          Add Funding Round
        </Button>
      </Grid>

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
        <>
          <Typography variant="h3" component="h1" gutterBottom>
            Your total equity value = $
            {formatNumber(rounds[rounds.length - 1].equityValue)}
          </Typography>
          <Typography variant="h3" component="h1" gutterBottom>
            Your total dilution =
            {`${formatNumber(rounds[rounds.length - 1].totalDilution)}%`}
          </Typography>
        </>
      )}
    </Container>
  );
}

export default App;
