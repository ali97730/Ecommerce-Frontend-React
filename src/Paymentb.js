import DropIn from 'braintree-web-drop-in-react';
import React,{useState,useEffect} from 'react';
import { Link } from 'react-router-dom';
import { getmeToken, processPayment } from './admin/helper/paymentbHelper';
import { isAuthenticated } from './auth/helper';
import { cartEmpty, loadCart } from './core/helper/cartHelper';

import {createOrder} from "./core/helper/orderHelper";


const Paymentb=({products,setReload = f => f ,reload = undefined})=> {

     const [info, setInfo] = useState({
    loading: false,
    success: false,
    clientToken: null,
    error: "",
    instance: {}
  });

    const userId = isAuthenticated() && isAuthenticated().user._id
    const token = isAuthenticated() && isAuthenticated.token

    const getToken = (userId,token)=>{

            getmeToken(userId,token).then(data => {
                console.log(data)
                if(data && data.error){
                    setInfo({...info,error:data.error})
                }else{
                    const clientToken = data.clientToken
                    setInfo({clientToken})
                }
            })
    }

    useEffect(() => {
        getToken(userId,token)
    }, [])

        const onPurchase=()=>{
            setInfo({loading:true})
            let nonce;
            let getNonce = info.instance
            .requestPaymentMethod()
            .then(data=>{
                nonce=data.nonce
               const paymentData ={
                paymentMethodNonce:nonce,
                amount:getAmount()
               };

               processPayment(userId,token,paymentData)
               .then(response=>{
                   setInfo({...info,success:response.success,loading:false})
                   //todo empty the cart
                   //force reload
                    const orderData ={
                        products:products,
                        transaction_id:response.transaction_id,
                        amount:response.transaction.amount
                    }

                    createOrder(userId,token,orderData);

                   cartEmpty(()=>{
                       
                   })

                   setReload(!reload);

               })
               .catch(
                   error=>{
                       setInfo({
                           loading:false,success:false
                       })
                   }
               )
                
            })


        }

        const getAmount =()=>{
            let amount =0
            products.map(p=>{
                amount=amount+p.price
            })
            return amount;
        }
    const showbtdropIn =()=>{
        return (
            <div>
                {info.clientToken !== null && products.length >0 ? (
                    <div>
                          <DropIn
            options={{ authorization: info.clientToken }}
            onInstance={(instance) => (info.instance = instance)}
          />
          <button className="btn btn-block btn-outline-success" onClick={onPurchase}>Buy</button>
                    </div>
                ) : (<h3>Please Login or add some thing to cart</h3>) }
            </div>
        )
    }


    return (
        <div>
            <h3>Yout bill is {getAmount()}</h3>  
            {showbtdropIn()}  
        </div>
    )
}

export default Paymentb;