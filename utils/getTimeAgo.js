import moment from "moment";

const getTimeAgo = (timestamp) => {
  return moment(timestamp).fromNow();
};

export default getTimeAgo;
