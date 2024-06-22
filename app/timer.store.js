import { useEffect } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * @typedef {Object} Timer
 * @property {string} id - The unique identifier for the timer. Generated using Date.now()
 * @property {number} duration - The duration of the timer in milliseconds.
 * @property {number} timeLeft - The remaining time of the timer in milliseconds.
 * @property {number} endAt - The end time of the timer in milliseconds.
 * @property {boolean} isRunning - Indicates if the timer is currently running.
 */

export const useTimerStore = create(
  persist(
    (set) => ({
      timers: [],
      addTimer: (duration) => {
        set((curr) => ({
          timers: [
            ...curr.timers,
            {
              id: Date.now(),
              duration,
              timeLeft: duration,
              endAt: Date.now() + duration,
              isRunning: true,
            },
          ],
        }));
      },
      removeTimer: (id) => {
        set((curr) => ({
          timers: curr.timers.filter((t) => t.id !== id),
        }));
      },
      toggleRunning: (id) => {
        set((curr) => ({
          timers: curr.timers.map((timer) => {
            if (timer.id !== id) return timer;

            if (timer.timeLeft === 0 && !timer.isRunning) {
              return {
                ...timer,
                isRunning: true,
                endAt: Date.now() + timer.duration,
                timeLeft: timer.duration,
              };
            }

            return {
              ...timer,
              isRunning: !timer.isRunning,
              endAt: timer.isRunning
                ? timer.endAt
                : Date.now() + timer.timeLeft,
            };
          }),
        }));
      },
    }),
    {
      name: "timer-storage",
    }
  )
);

export const useTimerInterval = () => {
  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log("Interval call");
      useTimerStore.setState((state) => ({
        timers: state.timers.map((timer) => {
          if (!timer.isRunning) {
            return timer;
          }

          const onTimerFinish = () => {
            const audio = new Audio("/ring.mp3");
            // audio.play();
            return {
              ...timer,
              timeLeft: 0,
              isRunning: false,
            };
          };

          const timeLeft = Math.round(timer.endAt - Date.now());

          if (timeLeft <= 0) {
            return onTimerFinish();
          }

          return {
            ...timer,
            timeLeft,
          };
        }),
      }));
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);
};
