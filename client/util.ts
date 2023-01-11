export const truncateAddress = (address: string): string => {
  const shownLengthStart = 4 + 2
  const shownLengthEnd = 4
  const addressLength = address.length
  return `${address.substring(0, shownLengthStart)}....${address.substring(addressLength - shownLengthEnd, addressLength)}`
}
