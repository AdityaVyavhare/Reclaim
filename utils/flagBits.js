function isReadSuccessful() {
  return Date.now() % 2 == 0 ? true : false;
}
function isWriteSuccessful() {
  return Date.now() % 2 != 0 ? true : false;
}
export default {
  isReadSuccessful,
  isWriteSuccessful,
};
