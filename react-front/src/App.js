import './App.css';
import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {fetchBooksByStatus} from './status';

export default function App() {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);
  
  const ontextchange = (event) => {
    setSearchTerm(event.target.value);
  }
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/boopi/books?limit=140');
        setBooks(response.data);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };
    fetchBooks();
  }, []);

const updateBookStatus = async (bookId, status) => {
const user_id = sessionStorage.getItem("user_id");
  try {
    await axios.post(`http://localhost:5000/boopi/${user_id}/books`, {
      book_id: bookId,
      status: status
    });
  } catch (error) {
    console.error("Error updating book status:", error);
    alert("Failed to update status");
  }
}; 
  
  return (
    <>
    <button
        className={`hamburger ${open ? "active" : ""}`}
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
      >
        <span />
        <span />
        <span />
      </button>

      <div className={`menu ${open ? "show" : ""}`}>
        <h2><Link to="/status/want to" onClick={() => fetchBooksByStatus("want to")} style={{ textDecoration: "none", color: "inherit", fontWeight: "inherit", }} >Want to</Link></h2><br/>
        <h2><Link to="/status/ongoing" onClick={() => fetchBooksByStatus("ongoing")} style={{ textDecoration: "none", color: "inherit", fontWeight: "inherit", }} >Ongoing</Link></h2><br/>
        <h2><Link to="/status/complete" onClick={() => fetchBooksByStatus("complete")} style={{ textDecoration: "none", color: "inherit", fontWeight: "inherit", }} >Complete</Link ></h2>
      </div>
      <div className="App">
      <h1>Book List</h1>
      <input type="text" placeholder="Search books..." onChange={ontextchange} />
      {searchTerm && <p>Searching for: {searchTerm}</p>}
      </div>

      <div className='container'>
        {books.map(book => {
          if (book[1]
            .toLowerCase().includes(searchTerm.trim().toLowerCase())) return (<div className='list' key={book[0]}>
            <div>
            <img src={`/image/${book[0]}.jpg`} alt={book[1]}/>
            <li>Book: {book[1]}</li>
            <li>Author: {book[2]}</li>
            <li>Genre: {book[3]}</li>
            <li>Year: {book[4]}</li>
            <li>Description: {book[5]}</li>
            </div>
            <button onClick={() => updateBookStatus(book[0], "complete")}>complete</button>
            <button onClick={() => updateBookStatus(book[0], "want to")}>want to</button>
            <button onClick={() => updateBookStatus(book[0], "ongoing")}>ongoing</button>
            </div>)
        })}
        </div>
    </>  
  );
};

