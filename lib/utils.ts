// Utility functions

export const generateBarcode = (): string => {
  const time = Date.now().toString().slice(-6)
  return `SD-${time}`
}
