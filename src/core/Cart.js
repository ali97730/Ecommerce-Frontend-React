import React,{useState,useEffect} from 'react'
import "../styles.css";
import {API} from '../backend.js';
 import Base from './Base';
import Card from './Card';
import { loadCart } from './helper/cartHelper';
import Paymentb from '../Paymentb';

const  Cart=() => {
   const [products,setProducts] = useState([]);
   const [reload,setReload] =useState(false);

    useEffect(() => {
        setProducts(loadCart())
    }, [reload])

   const loadAllProduct = products =>{
       return(
        <div>
         <h2>This section is to load Products</h2>
         {products.map((product,index) =>{
               return(
                <Card 
                key={index}
                product={product}
                removeFromCart={true}
                addtoCart={false}
                setReload={setReload}
                reload={reload}
                />
               )
         })}
        </div>
       )
   }
   const loadCheckout =()=>{
       return (
           <div>
               <h2>This section is for Products</h2>
           </div>
       )
   }
    

    
    return (
        <Base title ="Cart Page"
        description ="Ready to CheckOut">
        
            <div className="row text-center">
                  <div className="col-6">{products.length >0 ? loadAllProduct(products) : (<h3>No Products</h3>)}</div>
                  <div className="col-6"><Paymentb products={products} setReload={setReload}/></div>
            </div>
      
        </Base>
    )
}
export default Cart;