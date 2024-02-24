//FUNCTIONS

// Function for Loading...
export const isDataThereLoading = (data) => {
  if (!data) {
    // Data is still loading, you can return a loading indicator or null
    return (
      <div className="d-flex justify-content-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  } else {
    return null;
  }
};

// Function to validate email
export const isValidEmail = (email) => {
  // Regular expression for a simple email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Function to validate phone number
export const validatePhoneNumber = (phoneNumber) => {
  // Regular expression for a simple Phone validation
  const isNumeric = /^\d+$/;
  return (
    phoneNumber?.length === 10 &&
    isNumeric.test(phoneNumber) &&
    phoneNumber[0] !== "0"
  );
};

// Function for set Transfar state color
export const StateOfTransfarSet = (transaction, accountNumber) => {
  if (
    transaction.transaction_type !== "Withdrawal" &&
    (transaction.targetAccountNumber === accountNumber ||
      transaction.targetAccountNumber === "N/A")
  ) {
    return <div style={{ color: "#00AC47", fontWeight: "bold" }}>Received</div>;
  } else {
    return <div style={{ color: "#FF0000", fontWeight: "bold" }}>Deducted</div>;
  }
};

// Function to set tbody content based on transactionData
export const transectionSetter = (transectionData, accountNumber) => {
  function targetAccountNumberSetter(targetAccountNumber) {
    if (targetAccountNumber === accountNumber) {
      targetAccountNumber = "N/A";
      return targetAccountNumber;
    } else {
      return targetAccountNumber;
    }
  }

  // Get the last 10 transactions
  const last10Transactions = transectionData.slice(0, 10);

  return last10Transactions.map((transaction) => (
    <tr key={transaction.id} style={{ textAlign: "center" }}>
      <td>{transaction.id}</td>
      <td>
        <svg
          // xmlns="http://www.w3.org/2000/svg"
          width="15"
          height="15"
          fill="currentColor"
          className="bi bi-currency-rupee"
          viewBox="0 0 16 16"
          style={{ paddingBottom: "2px" }}
        >
          <path d="M4 3.06h2.726c1.22 0 2.12.575 2.325 1.724H4v1.051h5.051C8.855 7.001 8 7.558 6.788 7.558H4v1.317L8.437 14h2.11L6.095 8.884h.855c2.316-.018 3.465-1.476 3.688-3.049H12V4.784h-1.345c-.08-.778-.357-1.335-.793-1.732H12V2H4z" />
        </svg>
        {/* {" "} */}
        {transaction.amount}
      </td>
      <td>{transaction.transaction_type}</td>
      <td>{StateOfTransfarSet(transaction, accountNumber)}</td>
      <td>{targetAccountNumberSetter(transaction.targetAccountNumber)}</td>
      <td>{formatDate(transaction.transaction_date)}</td>
      <td>{formatTime(transaction.transaction_date)}</td>
    </tr>
  ));
};

// Function to format date as DD/MM/YYYY
function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

// Function to format time as HH:MM:SS AM/PM
function formatTime(dateString) {
  const date = new Date(dateString);
  const hours = date.getHours() % 12 || 12; // Convert to 12-hour format
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  const ampm = date.getHours() >= 12 ? "PM" : "AM";
  return `${hours}:${minutes}:${seconds} ${ampm}`;
}

// Function to format balance with 2 digits precision after the decimal point
export const formatBalance = (balance) => {
  return parseFloat(balance).toFixed(2);
};
