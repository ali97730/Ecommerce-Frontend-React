import React,{useState,useEffect} from 'react';
import Base from '../core/Base';
import {isAuthenticated} from "../auth/helper";
import {Link} from "react-router-dom";
import {updateCategory, getaCategory} from "./helper/adminapicall";


const UpdateCategory= ({match}) => {

    const [name,setName] = useState("");
    const [error,setError] = useState(false);
    const [success,setSuccess] = useState(false);
    

    const {user,token} = isAuthenticated();

    const goBack = ()=>{
        return (
            <div className="mt-5">
                    <Link className="btn btn-sm btn-success mb-3" to="/admin/dashboard">Admin Home</Link>
            </div>
        )}

   

  

        const handleChange =(event) =>{
            setError("");
            setName(event.target.value)
        }
    
    const onSubmit =event=>{
        event.preventDefault();
        setError("");
        setSuccess(false);
        //backend request fire
       
        updateCategory(match.params.categoryId,user._id,token,{name})
        .then(data =>{
                console.log(data)
            if (data.error){
                setError(true)
            }else{
                setError("");
                setSuccess(true);
                setName("");
            }
        })


    }
    useEffect(() => {
       preload(match.params.categoryId)
    }, [])

        const preload =(categoryId)=>{

            getaCategory(categoryId).then(
                data=>{
                    if(data.error){
                        setError(true)
                    }else{

                        setName(data.name);
                    }
                }
            )

        }
    


    const successMessage =()=>{
            if(success){
                return <h4 className="text-success">Category updated Successfully</h4>
            }
    }

    const warningMessage =()=>{
        if(error){
            return <h4 className="text-danger">Failed to update Category</h4>
        }
    }

    const myCategoryForm = () =>{
            return(
        <form>
            <div className="form-group">

                <p className="lead">Update a Category Here</p>
                <input type="text" className="form-control my-3"
                onChange={handleChange}
                name="photo"
                value={name}
                 autoFocus 
                 required
                  placeholder="For ex. Summer" />
                <button
                onClick={onSubmit}
                className="btn btn-outline-info">Update Category</button>
            </div>
        </form>

            )};

    return (
       <Base title="Create a category Here"
            description="Add a new Category for new Tshirts"
            className="container bg-info p-4">
                <div className="row bg-white rounded">

                    <div className="col-md-8 offset-md-2">

                            {successMessage()}
                            {warningMessage()}
                            {myCategoryForm()}
                            {goBack()}

                    </div>

                </div>
            </Base>
    )
}

export default UpdateCategory; 
