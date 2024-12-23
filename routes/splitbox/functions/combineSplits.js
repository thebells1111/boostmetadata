export default function combineSplits(destinations) {
  const { mainSplits, remoteSplits } = destinations;

  // Combine fees and splits from mainSplits
  const main = [
    ...mainSplits.feesDestinations,
    ...mainSplits.splitsDestinations,
  ];

  // Combine fees and splits from remoteSplits
  const remote = [
    ...remoteSplits.feesDestinations,
    ...remoteSplits.splitsDestinations,
  ];

  // Return combined array
  return [...main, ...remote];
}
