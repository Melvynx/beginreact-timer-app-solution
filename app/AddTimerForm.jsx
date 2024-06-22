import { useState } from "react";
import { useTimerStore } from "./timer.store";

export const AddTimerForm = () => {
  const [time, setTime] = useState({ hrs: 0, mins: 1, secs: 0 });
  const addTimer = useTimerStore((s) => s.addTimer);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setTime((curr) => ({
      ...curr,
      [name]: formatTimeValue(value, name === "hrs" ? 23 : 59),
    }));
  };

  const handleAddTimer = () => {
    const ms = time.hrs * 3600000 + time.mins * 60000 + time.secs * 1000;

    if (ms < 10000) {
      alert("Timer must be at least 10 seconds");
      return;
    }

    addTimer(ms);
  };

  return (
    <div className="mx-auto flex w-fit flex-col gap-4">
      <div className="flex items-center justify-between">
        {["hr", "min", "sec"].map((label) => (
          <p className="text-center font-bold w-full" key={label}>
            {label}
          </p>
        ))}
      </div>
      <div className="flex items-center rounded-md border border-neutral bg-base-200 p-2">
        <InputField
          value={String(time.hrs).padStart(2, "0")}
          onChange={handleInputChange}
          name="hrs"
        />
        <p className="text-lg">:</p>
        <InputField
          value={String(time.mins).padStart(2, "0")}
          onChange={handleInputChange}
          name="mins"
        />
        <p className="text-lg">:</p>
        <InputField
          value={String(time.secs).padStart(2, "0")}
          onChange={handleInputChange}
          name="secs"
        />
      </div>
      <div className="flex items-end">
        <button
          className="btn-success btn"
          onClick={() => {
            handleAddTimer();
          }}
        >
          Add Timer
        </button>
      </div>
    </div>
  );
};

const InputField = (props) => {
  return (
    <input
      {...props}
      className="h-24 w-20 rounded-md focus:outline-none bg-base-200 text-center text-5xl focus:bg-accent focus:text-accent-content"
    />
  );
};

const formatTimeValue = (value, maxValue) => {
  const intValue = parseInt(value, 10);

  if (isNaN(intValue)) return 0;
  const v = Number(intValue.toString().slice(-2));
  return Math.min(v, maxValue);
};
