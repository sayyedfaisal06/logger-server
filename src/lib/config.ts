import { format, parse } from "date-fns";

export const formatHoursMins = (date: string) => {
  const time24HourFormat = "HH:mm";
  const time12HourFormat = "hh:mm aaa";
  return format(parse(date, time24HourFormat, new Date()), time12HourFormat);
};
