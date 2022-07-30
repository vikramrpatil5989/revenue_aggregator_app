import React from 'react';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import NumberFormat from 'react-number-format';

import { useState, useEffect } from 'react'


const Home = () => {

    const [products, setProducts] = useState([]);
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [totalRevenue, setTotalRevenue]  = useState(0);
    const [sortField, setSortField] = useState("");
    const [order, setOrder] = useState("asc");

    //Initially load data from prodcts.json

    useEffect(() =>{
        const getProducts = async () => {
            setLoading(true)
            try{
                const response = await fetch('./products.json',
               
                { headers: {'content-type': 'application/json', 'Accept':'application/json'}})
                
                const { products } = await response.json();
                if(products){
                    setProducts(products)
                    setSearchResult(products)
                    setTotalRevenue(products.reduce((sum, current) => sum + Number(current.Revenue), 0))
                    setLoading(false)
                }
            }catch(error){
                setError(error)
            }
        }
        getProducts()
    }, [])

 //handle submit form
 const handleSubmit = (e) => {
    e.preventDefault()
  }


//Handle Serach Value Change
const handleChange = (e) => {
    console.log(searchTerm);
    if(e.target.value === '') {
        setSearchResult(products)
    }
   
    const resulArray = products.filter((item) => item.name.toLowerCase().includes(e.target.value.toLowerCase()))
    setSearchResult(resulArray)
    setTotalRevenue(resulArray.reduce((sum, current) => sum + Number(current.Revenue), 0))
    setSearchTerm(e.target.value)
}

// Sorting Handling
   const handleSortingChange = (accessor) => {
        const sortOrder = accessor ===  sortField && order === "asc" ? "desc" : "asc";
        setSortField(accessor);
        setOrder(sortOrder)
        handleSorting(accessor, sortOrder)
   }

   const handleSorting = (sortField, sortOrder) => {
        if(sortField){
            const sorted = [...searchResult].sort((a,b) => {
                return (
                    a[sortField].toString().localeCompare(b[sortField].toString(), "en", {numeric: true}) * (sortOrder === "asc" ? 1: -1)
                )
            })
            setSearchResult(sorted)
        }
   }
   if(loading){
    <div>Loading...</div>
   }
   else{
    <div>{error}</div>
   }

    return searchResult && (
        <div>
            <div className="mb-3 mt-3 mx-auto w-50">
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Control type="text" name='name' value={searchTerm ?? ''} onChange={handleChange} placeholder="Search Product Here" />
                    </Form.Group>
                </Form>

                <Table striped bordered hover className='mt-3'>
                    <thead>
                        <tr>
                            <th onClick={() => handleSortingChange('id')}>Sr</th>
                            <th onClick={() => handleSortingChange('name')}>Brand Name</th>
                            <th onClick={() => handleSortingChange('Branch')}>Branch</th>
                            <th onClick={() => handleSortingChange('Revenue')}>Revenue</th>
                        </tr>
                    </thead>
                    <tbody>
                        {                            
                            searchResult.map((item) => {
                            return  <tr key={item.id}>
                                    <td>{item.id}</td>
                                    <td>{item.name}</td>
                                    <td>{item.Branch}</td>
                                    <td><NumberFormat value={item.Revenue} displayType={'text'} thousandSeparator={true} prefix={'$'} ></NumberFormat></td>
                                </tr>
                            })
                        }   
                        <tr>
                            <td>Total Revenue</td>    
                            <td><NumberFormat value={totalRevenue} displayType={'text'} thousandSeparator={true} prefix={'$'} ></NumberFormat></td>
                        </tr>                     
                    </tbody>
                </Table>


            </div>
        </div>
    );
};




export default Home;
