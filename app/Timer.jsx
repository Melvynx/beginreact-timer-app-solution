import { clsx } from "clsx";
import { Bell, Pause, Play, RotateCcw, X } from "lucide-react";
import { CircularProgress } from "./CircularProgress";
import { useTimerStore } from "./timer.store";

export const Timer = ({ id }) => {
  const timer = useTimerStore((store) => store.timers.find((t) => t.id === id));
  const endAt = new Date(timer.endAt);

  return (
    <div
      className={clsx(
        "relative flex size-[224px] flex-col gap-2 rounded-2xl bg-base-200 p-4",
        {
          "brightness-75": timer.timeLeft === 0,
        }
      )}
    >
      <div className="relative flex size-full flex-col items-center justify-center gap-1">
        <CircularProgress
          className="absolute"
          timeLeft={timer.timeLeft}
          duration={timer.duration}
          width={180}
          radiusRatio={0.9}
        />
        <div className="flex items-center justify-between gap-2">
          <Bell size={16} className="text-neutral-content" />
          <p>{`${endAt.getHours()}:${endAt
            .getMinutes()
            .toString()
            .padStart(2, "0")}`}</p>
        </div>
        <TimeDisplay timeLeft={timer.timeLeft} />
        <DurationDisplay duration={timer.duration} />
      </div>
      <TimerControls {...timer} />
    </div>
  );
};

const TimerControls = ({ id, isRunning, timeLeft }) => {
  const removeTimer = useTimerStore((s) => s.removeTimer);
  const toggleRunning = useTimerStore((s) => s.toggleRunning);

  return (
    <>
      <button
        className="absolute bottom-3 left-3 flex size-7 items-center justify-center rounded-full bg-base-300 p-0 text-base-content"
        onClick={() => removeTimer(id)}
      >
        <X size={14} />
      </button>
      <button
        className={clsx(
          "absolute bottom-3 right-3 flex size-7 items-center justify-center rounded-full p-0",
          {
            "bg-warning text-warning-content": isRunning,
            "bg-success text-success-content": !isRunning,
          }
        )}
        onClick={() => toggleRunning(id)}
      >
        {isRunning ? (
          <Pause fill="currentColor" size={14} />
        ) : timeLeft > 0 ? (
          <Play fill="currentColor" size={14} />
        ) : (
          <RotateCcw size={14} />
        )}
      </button>
    </>
  );
};

const TimeDisplay = ({ timeLeft }) => {
  const timeText = getTimeText(timeLeft);
  const timeHMS = millisecondsToHMS(timeLeft);
  return (
    <div className="relative flex items-center justify-center">
      <p
        className={clsx("font-light text-base-content", {
          "text-4xl": !timeHMS.hrs,
          "text-2xl": timeHMS.hrs,
        })}
      >
        {timeText}
      </p>
    </div>
  );
};

const DurationDisplay = ({ duration }) => {
  const text = getDurationText(duration);
  return (
    <div>
      <p className="text-sm text-neutral-content">{text}</p>
    </div>
  );
};

const millisecondsToHMS = (ms) => {
  const hrs = Math.floor(ms / 3600000);
  const mins = Math.floor((ms % 3600000) / 60000);
  const secs = Math.floor((ms % 60000) / 1000);

  return {
    hrs,
    mins: mins,
    secs,
  };
};

const padHMS = (timeHMS) => ({
  hrs: String(timeHMS.hrs).padStart(2, "0"),
  mins: String(timeHMS.mins).padStart(2, "0"),
  secs: String(timeHMS.secs).padStart(2, "0"),
});

const getTimeText = (timeLeft) => {
  const timeLeftHMS = millisecondsToHMS(timeLeft);
  const timeLeftPadHMS = padHMS(timeLeftHMS);

  let durationText = `${timeLeftPadHMS.mins}:${timeLeftPadHMS.secs}`;

  if (timeLeftHMS.hrs) {
    durationText = `${timeLeftPadHMS.hrs}:${durationText}`;
  }

  return durationText;
};

const getDurationText = (duration) => {
  const durationHMS = millisecondsToHMS(duration);

  if (durationHMS.hrs) {
    return `${durationHMS.hrs}hrs`;
  }

  if (durationHMS.mins) {
    return `${durationHMS.mins}mins`;
  }

  return `${durationHMS.secs}secs`;
};
