export const capitalizeFirst = (value: string) => {
  return value.charAt(0).toUpperCase() + value.slice(1);
};

export const calculateMinutesSeconds = (value: number) => {
  const updated = (value / 60).toString().split('.');
  return {
    minutes: parseInt(updated[0]),
    seconds: value - parseInt(updated[0]) * 60
  }
}