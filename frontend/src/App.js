import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Login } from "./components/Login";
import CreateAccount from "./components/CreateAccount";
import { Home } from "./components/Home";
import { RegistrationDetailShow } from "./components/RegistrationDetailShow";
import { AccountDetails } from "./components/userFunctionComponents/AccountDetails";
import { AccountPIN } from "./components/userFunctionComponents/AccountPIN";
import { Dashboard } from "./components/userFunctionComponents/Dashboard";
import { Deposit } from "./components/userFunctionComponents/Deposit";
import { Fundtransfar } from "./components/userFunctionComponents/Fundtransfar";
import { TransectionHistory } from "./components/userFunctionComponents/TransectionHistory";
import { Withdraw } from "./components/userFunctionComponents/Withdraw";
import BankAdmin from "./components/adminThings/BankAdmin";
import GetAllUser from "./components/adminThings/GetAllUser";
import DeleteAccount from "./components/adminThings/DeleteAccount";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/login" element={<Login />} />

        <Route path="/create-account" element={<CreateAccount />} />

        <Route
          path="/registration-detail"
          element={<RegistrationDetailShow />}
        />

        <Route path="/home" element={<Home />} />

        <Route path="/home/dashboard" element={<Dashboard />} />

        <Route path="/home/deposit" element={<Deposit />} />

        <Route path="/home/withdraw" element={<Withdraw />} />

        <Route path="/home/fund-transfar" element={<Fundtransfar />} />

        <Route path="/home/account-pin" element={<AccountPIN />} />

        <Route path="/home/account-details" element={<AccountDetails />} />

        <Route path="/home/transection-history" element={<TransectionHistory />} />

        <Route path="/admin/jtBankAdmin" element={<BankAdmin />} />

        <Route path="/admin/delete-account" element={<DeleteAccount />} />

        <Route path="/admin/get-all-user" element={<GetAllUser />} />

      </Routes>
    </Router>
  );
}

export default App;
