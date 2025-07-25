import localforage from 'localforage';

// Example: Save completed habits offline and sync when online
export const saveCompletedHabitOffline = async (habit) => {
  const habits = (await localforage.getItem('completedHabits')) || [];
  habits.push(habit);
  await localforage.setItem('completedHabits', habits);
};

export const syncCompletedHabits = async (syncFn) => {
  const habits = (await localforage.getItem('completedHabits')) || [];
  if (habits.length > 0) {
    await syncFn(habits);
    await localforage.setItem('completedHabits', []);
  }
};

window.addEventListener('online', () => {
  // You can call syncCompletedHabits here with your API sync function
});
