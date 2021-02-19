export const nameSort = (name1, name2) => {
  if(name1 < name2) {
    return -1
  }
  if(name1 > name2) {
    return 1
  }
  return 0
}
