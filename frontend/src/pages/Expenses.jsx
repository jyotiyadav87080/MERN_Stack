import { useEffect, useState } from "react";
import "../App.css";

function Expenses() {
  const [expenses, setExpenses] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
const [search, setSearch] = useState("");
const [filterCategory, setFilterCategory] = useState("");



  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/expenses",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch expenses");
      }

      setExpenses(data.expenses);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setTitle("");
    setAmount("");
    setCategory("");
    setDate("");
    setPaymentMethod("");
    setDescription("");
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!title || !amount || !category || !date || !paymentMethod) {
      setError("Please fill all required fields");
      return;
    }

    if (Number(amount) <= 0) {
      setError("Amount must be greater than 0");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const expenseData = {
        title,
        amount: Number(amount),
        category,
        date,
        paymentMethod,
        description,
      };

      let response;

      if (editingId) {
        response = await fetch(
          `http://localhost:5000/api/expenses/${editingId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(expenseData),
          }
        );
      } else {
        response = await fetch(
          "http://localhost:5000/api/expenses",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(expenseData),
          }
        );
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      if (editingId) {
        setExpenses(
          expenses.map((expense) =>
            expense._id === editingId ? data.expense : expense
          )
        );

        setMessage("Expense updated successfully!");
      } else {
        setExpenses([data.expense, ...expenses]);
        setMessage("Expense added successfully!");
      }

      clearForm();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleEdit = (expense) => {
    setEditingId(expense._id);

    setTitle(expense.title);
    setAmount(expense.amount);
    setCategory(expense.category);
    setDate(expense.date.split("T")[0]);
    setPaymentMethod(expense.paymentMethod);
    setDescription(expense.description || "");

    setShowForm(true);

    setMessage("");
    setError("");
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this expense?"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/expenses/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete expense");
      }

      setExpenses(
        expenses.filter((expense) => expense._id !== id)
      );

      setMessage("Expense deleted successfully!");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="page">
      <div className="expense-header">
        <div>
          <h1 className="page-title">My Expenses</h1>

          <p style={{ color: "#777", marginTop: "5px" }}>
            Track and manage your daily expenses
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => {
            if (showForm) {
              clearForm();
            } else {
              setShowForm(true);
            }
          }}
        >
          {showForm ? "Cancel" : "+ Add Expense"}
        </button>
      </div>

      {message && (
        <div className="success-message">
          {message}
        </div>
      )}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {showForm && (
        <div className="expense-card">
          <h2>
            {editingId ? "Edit Expense" : "Add New Expense"}
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Title *</label>

              <input
                type="text"
                placeholder="e.g. Grocery Shopping"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label>Amount *</label>

              <input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label>Category *</label>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select category</option>
                <option value="Food">Food</option>
                <option value="Travel">Travel</option>
                <option value="Shopping">Shopping</option>
                <option value="Bills">Bills</option>
                <option value="Education">Education</option>
                <option value="Health">Health</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="input-group">
              <label>Date *</label>

              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label>Payment Method *</label>

              <select
                value={paymentMethod}
                onChange={(e) =>
                  setPaymentMethod(e.target.value)
                }
              >
                <option value="">
                  Select payment method
                </option>

                <option value="Cash">Cash</option>
                <option value="UPI">UPI</option>
                <option value="Card">Card</option>
                <option value="Bank Transfer">
                  Bank Transfer
                </option>
              </select>
            </div>

            <div className="input-group">
              <label>Description</label>

              <textarea
                placeholder="Optional description"
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                rows="3"
              />
            </div>

            <button
              className="btn btn-primary"
              type="submit"
            >
              {editingId
                ? "Update Expense"
                : "Add Expense"}
            </button>
          </form>
        </div>
      )}

      <div className="expense-card">
        <h2>All Expenses</h2>

<div classname="filter">
  <input
    placeholder="Search expenses..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />

  <select
    value={filterCategory}
    onChange={(e) => setFilterCategory(e.target.value)}
  >
    <option value="">All Categories</option>
    <option value="Food">Food</option>
    <option value="Travel">Travel</option>
    <option value="Shopping">Shopping</option>
    <option value="Bills">Bills</option>
    <option value="Education">Education</option>
    <option value="Health">Health</option>
    <option value="Other">Other</option>
  </select>
</div>

        {loading ? (
          <p style={{ marginTop: "20px", color: "#777" }}>
            Loading expenses...
          </p>
        ) : expenses.length === 0 ? (
          <p style={{ marginTop: "20px", color: "#777" }}>
            No expenses added yet.
          </p>
        ) : (
          <div style={{ marginTop: "20px" }}>
            {expenses.map((expense) => (
              <div
                key={expense._id}
                className="expense-item"
              >
                <div>
                  <h3>{expense.title}</h3>

                  <p
                    style={{
                      color: "#777",
                      marginTop: "5px",
                    }}
                  >
                    {expense.category} •{" "}
                    {expense.paymentMethod}
                  </p>

                  <p
                    style={{
                      color: "#999",
                      marginTop: "5px",
                    }}
                  >
                    {new Date(
                      expense.date
                    ).toLocaleDateString("en-IN")}
                  </p>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div className="expense-amount">
                    ₹
                    {Number(
                      expense.amount
                    ).toLocaleString("en-IN")}
                  </div>

                  <div className="expense-actions">
                    <button
                      className="btn btn-edit"
                      onClick={() =>
                        handleEdit(expense)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-danger"
                      onClick={() =>
                        handleDelete(expense._id)
                      }
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Expenses;