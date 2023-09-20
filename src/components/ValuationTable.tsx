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

export const ValuationTable = ({
  rounds,
  handleRemoveRound,
  formatNumber,
  onAmountChange,
  onValuationChange,
}: ValuationTableProps) => {
  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Action</TableCell>
              <TableCell>Series</TableCell>
              <TableCell>Amount Raised ($)</TableCell>
              <TableCell
                style={{ borderRight: "1px solid rgba(0, 0, 0, 0.1)" }}>
                Post-Money Valuation ($)
              </TableCell>
              <TableCell>Dilution (%)</TableCell>
              <TableCell>Total Equity Value ($)</TableCell>
              <TableCell>Total Dilution (%)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rounds.map((round, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Tooltip title="Delete">
                    <span
                      className="cursor-pointer text-red-500 hover:text-red-700"
                      onClick={() => handleRemoveRound(index)}>
                      <DeleteIcon />
                    </span>
                  </Tooltip>
                </TableCell>
                <TableCell>Series {round.series}</TableCell>
                <TableCell>
                  <CurrencyInput
                    value={round.amount}
                    onChange={(newValue) => {
                      onAmountChange(index, newValue);
                    }}
                  />
                </TableCell>
                <TableCell
                  style={{ borderRight: "1px solid rgba(0, 0, 0, 0.1)" }}>
                  <CurrencyInput
                    value={round.valuation}
                    onChange={(newValue) => {
                      onValuationChange(index, newValue);
                    }}
                  />
                </TableCell>
                <TableCell>{formatNumber(round.dilution, "%")}</TableCell>
                <TableCell>$ {formatNumber(round.equityValue, "")}</TableCell>
                <TableCell>{formatNumber(round.totalDilution, "%")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default ValuationTable;
