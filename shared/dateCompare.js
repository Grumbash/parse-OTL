import moment from "moment";

export default (incDate) => {
  const days = incDate.split(" - ");

  const formatDate = moment(new Date(days[0])).format();

  const now = moment(new Date()).format();

  console.log("now: ", now);
  return formatDate;
}