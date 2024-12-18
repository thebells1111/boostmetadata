export default function normalizeSplits(destinations) {
  let feesDestinations = [];
  let splitsDestinations = [];
  let splitTotal = 0;
  destinations.forEach((v) => {
    if ((!v["@_fee"] || v["@_fee"] === false) && Number(v["@_split"])) {
      splitTotal += Number(v["@_split"]);
    }
  });
  destinations.forEach((v) => {
    if (!v["@_fee"] || v["@_fee"] === false) {
      if (Number(v["@_split"])) {
        v["@_split"] = (Number(v["@_split"]) / splitTotal) * 100;
      }
      splitsDestinations.push(clone(v));
    } else {
      feesDestinations.push(clone(v));
    }
  });

  return { feesDestinations, splitsDestinations };
}
