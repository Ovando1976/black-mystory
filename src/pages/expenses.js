import React, { useState, useEffect } from 'react';
import styles from './Expenses.module.css';
import { useSocket } from '../components/SocketContext';
import { signOut } from "firebase/auth";
import { useAddTransaction } from "../hooks/useAddTransaction";
import { useGetTransactions } from "../hooks/useGetTransactions";
import { useGetUserInfo } from "../hooks/useGetUserInfo";
import { useNavigate } from "react-router-dom";
import { app } from "../Firebase/firebaseConfig";
import {ReceiptsList} from '../components/ReceiptsList';
import { getFirestore, collection, addDoc, query, onSnapshot } from 'firebase/firestore';


export const Expenses = () => {
  const { transactionTotals } = useGetTransactions();
  const expenses = transactionTotals.expenses || [];
  const [ setExpense] = useState([]);
    const [balance, setBalance] = useState(0);
    const [income, setIncome] = useState(0);
    const [expenseName, setExpenseName] = useState('');
    const [expenseAmount, setExpenseAmount] = useState(0);
    const [transactions, setTransactions] = useState([]);
  const { addTransaction } = useAddTransaction();

  const { name, profilePhoto } = useGetUserInfo();
  const navigate = useNavigate();

  const [description, setDescription] = useState("");
  const [transactionAmount, setTransactionAmount] = useState(0);
  const [transactionType, setTransactionType] = useState("expense");
 

  const [receipts, setReceipts] = useState([]);

  const db = getFirestore(app);

  // Fetch Expenses from Firestore
  useEffect(() => {
    const q = query(collection(db, 'expenses'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const expensesArray = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setExpense(expensesArray);
    });

    return () => unsubscribe();
  }, [db]);

  // Add new expense to Firestore
  const addExpense = async () => {
    // ... form validation logic

    try {
      await addDoc(collection(db, 'expenses'), {
        description,
        transactionAmount,
        transactionType
      });
      // Clear input fields after adding an expense
    } catch (error) {
      console.error('Error adding new expense:', error);
    }
  };

  const calculateTotalExpenses = () => {
    // Implement calculation logic
    return 0;
  };

  const onSubmit = (event) => {
    event.preventDefault();
    // Implement submission logic
  };

  const signUserOut = () => {
    // Implement sign-out logic
  };

  return (
    <>
      <div className="expense-tracker">
        <div className="container">
      <h1> {name}&apos;s Expense Tracker</h1>
          <div className="balance">
            <h3> Your Balance</h3>
            {balance >= 0 ? <h2> ${balance}</h2> : <h2> -${balance * -1}</h2>}
          </div>
          <div className="summary">
            <div className="income">
              <h4> Income</h4>
              <p>${income}</p>
            </div>
            <div className="expenses">
              <h4> Expenses</h4>
              <p>${expenses}</p>
            </div>
      <div>
        <input
          type="text"
          placeholder="Expense Name"
          value={expenseName}
          onChange={(e) => setExpenseName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Expense Amount"
          value={expenseAmount}
          onChange={(e) => setExpenseAmount(e.target.value)}
        />
        <button onClick={addExpense}>Add Expense</button>
      </div>
      <div>
    <h2>Expenses List</h2>
    <ul>
      {expenses.map((expense, index) => (
        <li key={index}>
          {expense.name}: ${expense.amount.toFixed(2)}
        </li>
      ))}
    </ul>
    <p>Total Expenses: ${calculateTotalExpenses(expenses).toFixed(2)}</p>
  </div>
      <ReceiptsList />
          </div>
          <form className="add-transaction" onSubmit={onSubmit}>
            <input
              type="text"
              placeholder="Description"
              value={description}
              required
              onChange={(e) => setDescription(e.target.value)}
            />
            <input
              type="number"
              placeholder="Amount"
              value={transactionAmount}
              required
              onChange={(e) => setTransactionAmount(e.target.value)}
            />
            <input
              type="radio"
              id="expense"
              value="expense"
              checked={transactionType === "expense"}
              onChange={(e) => setTransactionType(e.target.value)}
            />
            <label htmlFor="expense"> Expense</label>
            <input
              type="radio"
              id="income"
              value="income"
              checked={transactionType === "income"}
              onChange={(e) => setTransactionType(e.target.value)}
            />
            <label htmlFor="income"> Income</label>

            <button type="submit"> Add Transaction</button>
          </form>
        </div>
        {profilePhoto && (
          <div className="profile">
            {" "}
            <img className="profile-photo" src={profilePhoto} alt="" />
            <button className="sign-out-button" onClick={signUserOut}>
              Sign Out
            </button>
          </div>
        )}
      </div>
      <div className="transactions">
          <h3>Transactions</h3>
          <ul>
            {transactions.map((transaction, index) => (
              <li key={index}>
                <h4>{transaction.description}</h4>
                <p>${transaction.amount} • {transaction.type}</p>
                {/* Add more transaction details here */}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2>Receipts</h2>
          <ul>
            {receipts.map((receipt, index) => (
              <li key={index}>
                {/* Receipt details */}
              </li>
            ))}
          </ul>
        </div>
    </>
  );
};

export default Expenses;