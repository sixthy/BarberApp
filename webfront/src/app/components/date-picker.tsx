"use client";

import { DayPicker } from "react-day-picker";

type DatePickerProps = {
  selectedDate: Date | undefined;
  onSelectDate: (date: Date | undefined) => void;
};

export default function DatePicker({
  selectedDate,
  onSelectDate,
}: DatePickerProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-900 p-4">
      <DayPicker
        mode="single"
        selected={selectedDate}
        onSelect={onSelectDate}
        disabled={{
          before: new Date(),
        }}
        className="text-white"
      />
    </div>
  );
}