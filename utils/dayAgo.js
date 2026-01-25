import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const dayAgo = (dateString) => {
  return dayjs(dateString).fromNow();
};

export default dayAgo;
