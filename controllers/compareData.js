import moment from "moment";

export default (DB_data, OTL_data) => {
  const coparedData = JSON.stringify(DB_data) === JSON.stringify(OTL_data)

  return coparedData;
}