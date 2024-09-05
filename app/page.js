"use client";
import React, { useState, useRef } from 'react'
import styles from "./page.module.css";

import data from "./api/saveData/data.json";
import history from "./api/saveHistory/history.json"

export default function Home() {
  const [itemState, setItemState] = useState(data);
  const [historyState, setHistoryState] = useState(history);
  const [barcode, setBarcode] = useState('');
  const timeoutRef = useRef(null);
  const inputRef = useRef(null);
  

  const handleQuantityChange = (index, event) => {
    const newValue = event.target.value;

    // Update the state immediately with the new value
    setItemState((prevState) => {
        const newState = [...prevState];
        newState[index] = { ...newState[index], quantity: newValue };
        return newState;
    });

    // Clear the previous timeout to avoid multiple calls
    clearTimeout(handleQuantityChange.timeout);

    // Set a new timeout to call the updateSourceFile function after 1 second
    handleQuantityChange.timeout = setTimeout(() => {
        setItemState((prevState) => {
            updateSourceFile(prevState, '/api/saveData' );
            return prevState; // No need to update the state again, just call the function
        });
    }, 1000); // 1-second delay
};


   
  const updateSourceFile = async (payload, path) => {
    try {
        const response = await fetch(path, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        

        if (!response.ok) {
            throw new Error('Failed to save data');
        }

        const result = await response.json();
        console.log(result.message);
    } catch (error) {
        console.error(error);
    }
    
};

const clearInput = () => {
  if (inputRef.current) {
    inputRef.current.value = '';
  }
};

const minusOnScan = (name) => {
  
  setItemState((prevState) => {
    // Create a new array with updated quantity
    const newState = prevState.map((item) => {
      if (item.name === name) {
        // Parse quantity to number, decrement, and convert back to string
        const updatedQuantity = Math.max(parseInt(item.quantity, 10) - 1, 0).toString();
        return { ...item, quantity: updatedQuantity };
      }
      return item;
    });

    updateSourceFile(newState,'/api/saveData');
    updateSourceFile(historyState,'/api/saveHistory')
    return newState;
  });
  
};



const handleBarcode = (barcode) => {
  let matched = false;  // Track if a match is found

  for (let i = 0; i < itemState.length; i++) {
    const obj = itemState[i]
    console.log(obj['barcodes'])
  }

  
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


  const handleChange = (e) => {
    setBarcode(e.target.value);

    // Clear the previous timeout if it exists
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    // Set a new timeout to handle the barcode
    timeoutRef.current = setTimeout(() => {
      handleBarcode(e.target.value);
      setBarcode(''); // Clear the input after handling
    }, 300); // Adjust delay as needed
  };
  

 const createHistory = (item) => {
  const now = new Date()
  const formattedDate =  now.toTimeString().split(' ')[0];
  const obj = {time: formattedDate, message: item}
  setHistoryState(prevState => [...prevState, obj]);
  updateSourceFile(historyState,'/api/saveHistory')
  
 }
  
  return (
    <main className={styles.main}>
      <div className={styles.wrapper}>
     
      
        <div>
        <div>scan: <input type='text' className={styles.barcode} ref={inputRef} onChange={handleChange} autoFocus/></div>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Quantity</th>
              <th>Minimum</th>
            </tr>
          </thead>
          <tbody>
            {itemState.map((item, index) => (
              <tr key={index} style={{ backgroundColor: parseInt(item.quantity) < parseInt(item.min) ? '#cc0000' : 'transparent' }}> 
                <td>{item.name}</td>
                <td>
                  <input
                    type="number"
                    className={styles.quantity}
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(index, e)}
                  />
                </td>
               <td>
                {item.min}
               </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
       
        <div className={styles.infoBox}>
          <h4>History</h4>
          {historyState.map((line, index) => (
          <div key={index}>{line.time}: {line.message}</div>
        ))}
          
        </div>
        </div>
    </main>
  );
}
