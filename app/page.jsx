"use client";

import { useShallow } from "zustand/react/shallow";
import { AddTimerForm } from "./AddTimerForm";
import { Timer } from "./Timer";
import { useTimerInterval, useTimerStore } from "./timer.store";

export default function Home() {
  useTimerInterval();
  return (
    <main className="mx-auto flex min-h-full max-w-4xl flex-col gap-8 p-4">
      <h1>Timer</h1>
      <AddTimerForm />
      <Timers />
    </main>
  );
}

const Timers = () => {
  const timers = useTimerStore(useShallow((s) => s.timers.map((t) => t.id)));

  return (
    <div className="flex flex-wrap gap-4">
      {timers.map((timer) => (
        <Timer key={timer.id} id={timer} />
      ))}
    </div>
  );
};
