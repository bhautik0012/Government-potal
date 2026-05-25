import React, {useState} from "react";

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

fetch("http://127.0.0.1:5000/add-scheme",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify(form)
})
.then(res=>res.json())
.then(data=>{
alert("Scheme Added")
})
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