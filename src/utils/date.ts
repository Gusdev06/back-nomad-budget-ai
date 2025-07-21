import * as moment from 'moment';


export const getCurrentDate = (dateString?: string | Date): string => {
  const date = dateString ? moment(dateString).utc() : moment().utc();
  return date.startOf('day').toISOString();
};