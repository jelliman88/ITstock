
export const handleBarcode = (barcode, items) => {
    let matched = false;  // Track if a match is found
    if (barcode[0] === 'S') {
      minusOnScan('iPhone 13');
      matched = true;
    } else if (barcode === "7330053016189840056148833") {
      minusOnScan('iPhone 13 cover');
      matched = true;
    } else if (barcode.startsWith('840')) {
      minusOnScan('iPhone 13 glass');
      matched = true;
    } else if (barcode[0] === '0') {
      minusOnScan('Jabra Evolve2 55');
      matched = true;
    } else if (barcode[0] === 'R') {
      minusOnScan('Samsung s22');
      matched = true;
    } else if (barcode === "7330053016660") {
      minusOnScan('Samsung s22 cover');
      matched = true;
    } else if (barcode === "7330053014666") {
      minusOnScan('Samsung s22 glass');
      matched = true;
    } else if (barcode === "KM7321WGY+NOR") {
      minusOnScan('Dell Wireless keyboard mouse combo Scandi');
      matched = true;
    }
  
    // Call createHistory only if no match was found
    if (!matched) {
      createHistory('No matching barcode');
    }
  
    clearInput();  // Always clear input at the end
  }