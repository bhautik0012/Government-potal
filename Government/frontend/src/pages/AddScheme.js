import React, { useState } from "react";
import { api } from "../config/api";

function AddScheme(){

const [form,setForm] = useState({
name:"",
ministry:"",
description:"",
eligibility:""
})

function handleChange(e){
setForm({...form,[e.target.name]:e.target.value})
}

function submit(e){
e.preventDefault()

api
  .post("/api/admin/add-scheme", form)
  .then(() => alert("Scheme Added"))
  .catch(() => alert("Failed to add scheme"))
}

return(

<div style={{padding:"30px"}}>

<h2>Add Government Scheme</h2>

<form onSubmit={submit}>

<input name="name" placeholder="Scheme Name" onChange={handleChange} /><br/><br/>

<input name="ministry" placeholder="Ministry" onChange={handleChange}/><br/><br/>

<textarea name="description" placeholder="Description" onChange={handleChange}/><br/><br/>

<textarea name="eligibility" placeholder="Eligibility" onChange={handleChange}/><br/><br/>

<button type="submit">Add Scheme</button>

</form>

</div>

)

}

export default AddScheme;