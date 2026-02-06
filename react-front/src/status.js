import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import { useParams } from 'react-router-dom';


export const fetchBooksByStatus = async (status) => {
  try {
    const user_id = sessionStorage.getItem("user_id");
    const response = await axios.get(`http://localhost:5000/boopi/users/${user_id}/books`, { params: { status } });
    return response.data;
  } catch (error) {
    console.error('Error fetching books by status:', error);
  }
};  

export default function Status() {
  const [books, setBooks] = useState([]);
  const { status } = useParams();
  
  useEffect(() => {
    fetchBooksByStatus(status).then(data => {
      setBooks(data);
    });
  }, [status]);

  return (
    <>
    <div className='container'>
      {books.map(book => (
        <div className='list' key={book[0]}>
          <img src={`/image/${book[0]}.jpg`} alt={book[1]}/>
          <li>Book: {book[1]}</li>
          <li>Author: {book[2]}</li>
          <li>Genre: {book[3]}</li>
          <li>Year: {book[4]}</li>
          <li>Description: {book[5]}</li> 
        </div>
      ))}
      </div>
    </>
  );
}