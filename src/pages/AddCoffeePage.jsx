import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import "../styles/AddCoffeePage.css"
import { CoffeeContext } from "../context/CoffeeContext"
import { useLocation } from "react-router-dom"

function AddCoffeePage(){

    const navigate = useNavigate()

    const location = useLocation()
    const backRoute = location.state?.from || "/coffees"

    const { coffees, addCoffee } = useContext(CoffeeContext)

    const [name,setName] = useState("")
    const [origin,setOrigin] = useState("")
    const [process,setProcess] = useState("")
    const [price,setPrice] = useState("")
    const [quantity,setQuantity] = useState("")
    const [status,setStatus] = useState("")

    const [errors,setErrors] = useState({})

    function handleSave(){

        const newErrors = {}

        if(!name.trim()) newErrors.name = "Name is required"
        if(!origin.trim()) newErrors.origin = "Origin is required"
        if(!process.trim()) newErrors.process = "Process is required"

        if(!price.trim() || isNaN(price))
            newErrors.price = "Price must be a number"

        if(!quantity.trim() || isNaN(quantity))
            newErrors.quantity = "Quantity must be a number"

        if(!status.trim())
            newErrors.status = "Status is required"

        setErrors(newErrors)

        if(Object.keys(newErrors).length > 0){
            return
        }

        const newCoffee = {
            name,
            origin,
            process,
            price: price + " RON",
            quantity: quantity + "g",
            status
        }

        addCoffee(newCoffee)

        navigate(backRoute)
    }

    return(

        <div className="add-page">

            <h1 className="add-logo">
                Meron Gallery.
            </h1>

            <div className="add-card">

                <div className="add-form">

                    <div className="add-row">
                        <label>Name:</label>
                        <input
                            value={name}
                            onChange={(e)=>setName(e.target.value)}
                        />
                    </div>
                    {errors.name && <p className="error">{errors.name}</p>}

                    <div className="add-row">
                        <label>Origin:</label>
                        <input
                            value={origin}
                            onChange={(e)=>setOrigin(e.target.value)}
                        />
                    </div>
                    {errors.origin && <p className="error">{errors.origin}</p>}

                    <div className="add-row">
                        <label>Process:</label>
                        <input
                            value={process}
                            onChange={(e)=>setProcess(e.target.value)}
                        />
                    </div>
                    {errors.process && <p className="error">{errors.process}</p>}

                    <div className="add-row">
                        <label>Price:</label>
                        <input
                            value={price}
                            onChange={(e)=>setPrice(e.target.value)}
                        />
                    </div>
                    {errors.price && <p className="error">{errors.price}</p>}

                    <div className="add-row">
                        <label>Quantity:</label>
                        <input
                            value={quantity}
                            onChange={(e)=>setQuantity(e.target.value)}
                        />
                    </div>
                    {errors.quantity && <p className="error">{errors.quantity}</p>}

                    <div className="add-row">
                        <label>Status:</label>
                        <input
                            value={status}
                            onChange={(e)=>setStatus(e.target.value)}
                        />
                    </div>
                    {errors.status && <p className="error">{errors.status}</p>}

                </div>

            </div>

            <div className="add-buttons">

                <button onClick={handleSave}>
                    Save
                </button>

                <button onClick={()=>navigate(backRoute)}>
                    Cancel
                </button>

            </div>

        </div>

    )
}

export default AddCoffeePage