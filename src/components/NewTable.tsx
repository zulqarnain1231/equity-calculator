import React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { CurrencyInput } from "./CurrencyInput";
import { Round } from "../utils/round";
import DeleteIcon from "@mui/icons-material/Delete";
import { Tooltip } from "@mui/material";

interface ValuationTableProps {
  rounds: Round[];
  formatNumber: (value?: number, suffix?: string) => string;
  handleRemoveRound: (index: number) => void;
  onAmountChange: (index: number, newValue: number) => void;
  onValuationChange: (index: number, newValue: number) => void;
}

export const NewTable = ({
  rounds,
  handleRemoveRound,
  formatNumber,
  onAmountChange,
  onValuationChange,
}: ValuationTableProps) => {
  return (
    <>
      <div className="w-full flex flex-col items-center justify-start gap-5">
        {/* table */}
        <div className="w-full flex flex-col items-start justify-start">
          {/* headers */}
          <div className="w-full grid grid-cols-[.5fr,.5fr,1.5fr,1.5fr,1.5fr,1fr,1fr,1fr] place-items-center gap-6">
            <p></p>
            <p className="text-xs text-black text-center font-normal">Series</p>
            <p className="text-xs text-black text-center font-normal">
              Amount Raised ($)
            </p>
            <p className="text-xs text-black text-center font-normal">
              Amount Raised ($)
            </p>
            <p className="text-xs text-black text-center font-normal">
              {" "}
              Post-Money Valuation ($)
            </p>
            <p className="text-xs text-black text-center font-normal">
              {" "}
              Dilution
            </p>
            <p className="text-xs text-black text-center font-normal">
              {" "}
              Current Equity Value
            </p>
            <p className="text-xs text-black text-center font-normal">
              {" "}
              Current Dilution
            </p>
          </div>
          {/* rows here */}

          {rounds.map((round, index) => (
            <div
              className="w-full grid grid-cols-[.5fr,.5fr,1.5fr,1.5fr,1.5fr,1fr,1fr,1fr] place-items-center gap-6 py-5 border-b-2 border-b-white-secondary"
              key={index}
            >
              <div className="w-full flex items-center justify-center">
                <Tooltip title="Delete">
                  <span
                    className="cursor-pointer text-red-500 hover:text-red-700"
                    onClick={() => handleRemoveRound(index)}
                  >
                    <DeleteIcon />
                  </span>
                </Tooltip>
              </div>
              <div className="w-full flex items-center justify-center text-xs text-black font-medium">
                Series {round.series}
              </div>
              <div>
                <CurrencyInput
                  value={round.amount}
                  onChange={(newValue) => {
                    onAmountChange(index, newValue);
                  }}
                />
              </div>
              <div style={{ borderRight: "1px solid rgba(0, 0, 0, 0.1)" }}>
                <CurrencyInput
                  value={round.valuation}
                  onChange={(newValue) => {
                    onValuationChange(index, newValue);
                  }}
                />
              </div>
              <div className="w-full flex items-center justify-center text-sm text-black font-medium">
                {formatNumber(round.dilution, "%")}
              </div>
              <div className="w-full flex items-center justify-center text-sm text-black font-medium">
                $ {formatNumber(round.equityValue, "")}
              </div>
              <div className="w-full flex items-center justify-center text-sm text-black font-medium">
                {formatNumber(round.totalDilution, "%")}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default NewTable;
