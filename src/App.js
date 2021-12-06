import React from "react";
import "./App.css";
import { user, users } from "./users";
import { useEffect, useState } from "react";

function App() {
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const [currentUser, setCurrentUser] = useState({});
  const [amount, setAmount] = useState("");
  const [newValues, setNewValues] = useState([]);


  let userList = JSON.parse(localStorage.getItem("users"));
  let userParent = JSON.parse(localStorage.getItem("user"));

  //Number conversion
  function intToString(value) {
    var suffixes = ["", "k", "m", "b", "t"];
    var suffixNum = Math.floor(("" + value).length / 3);
    var shortValue = parseFloat(
      (suffixNum !== 0 ? value / Math.pow(1000, suffixNum) : value).toPrecision(
        2
      )
    );
    if (shortValue % 1 !== 0) {
      shortValue = shortValue.toFixed(1);
    }
    return shortValue + suffixes[suffixNum];
  }

  const openUp = (item) => {
    setOpenModal(true);
    setSelectedItem(item);
  };

  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, []);

  useEffect(() => {
    if (!userParent) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, []);


  useEffect(() => {
    if (userList) {
      setNewValues(userList);
    }

  }, []);


  useEffect(() => {
    if (userParent) {
      setCurrentUser(userParent)
    }
  }, [])


  const creditAccount = () => {
    // Debit current user
    const debitAccount = currentUser.balance - Number(amount);
    setCurrentUser({ ...currentUser, balance: debitAccount });
    localStorage.setItem('user', JSON.stringify(currentUser))

    // Credit another user
    const newBal = selectedItem.walletBalance + Number(amount);
    const select = selectedItem
    select.walletBalance = newBal
    setSelectedItem( select );

    const usersCopy = [...newValues];

    //find index of item to be replaced
    const targetIndex = newValues.findIndex((f) => f.id === selectedItem.id);

    //replace the object with a new one.
    usersCopy[targetIndex] = selectedItem;

    setNewValues(usersCopy);
    localStorage.setItem("users", JSON.stringify(usersCopy));

  };


  return (
    <div className="App">
      <header className="App-header">
        <div className="container">
          <div className="wallet">
            <aside className="left-wallet">
              <div className="wallet-head">
                <h1> Select a user to transfer Funds </h1>
                <button className="modal-open">Transfer</button>
              </div>
              {userList &&
                userList.map((item, i) => {
                  return (
                    <div className="cc-select">
                      <div
                        className="cc visa cc-active"
                        onClick={() => openUp(item)}
                        key={i}
                      >
                        <p className="cc-num">
                          {item.fname} {item.lname}
                        </p>{" "}
                        <p className="cc-date">{item.walletBalance}</p>
                      </div>
                    </div>
                  );
                })}
            </aside>
            <content className="right-trans">
              <h1> Current Balance: </h1>

              <h4

                id="balance"
                onMouseOver={() => setOpen(true)}
                onMouseOut={() => setOpen(false)}
              >
                {currentUser.currency}  {intToString(currentUser.balance)}
              </h4>
              {open && <div className="tool">{"$"}{(currentUser.balance).toLocaleString()}</div>}

              <div className="trans-list"><p className="trans-hist">Transfer History</p></div>
            </content>
          </div>
        </div>

        <div className={openModal ? "modal" : "close-modal"}>
          <div className="modal-body">
            <h3>Input Transfer details</h3>

            <input
              type="number"
              placeholder="Enter an amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              defaultValue={100}
              decimalsLimit={2}
              onValueChange={(value, name) => console.log(value, name)}
            />
            <div className="modal-close" onClick={() => setOpenModal(false)}>
              x
            </div>


            <button class="modal-add-cc" onClick={() => { creditAccount(); setOpenModal(false);}}>
              {" "}
              Deposit{" "}
            </button>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
