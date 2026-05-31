import { useParams, useNavigate } from "react-router-dom"
import { useState, useContext } from "react"
import "../styles/EditCoffeePage.css"
import { CoffeeContext } from "../context/CoffeeContext"
import { useLocation } from "react-router-dom"
function EditCoffeePage(){

    const { coffees, updateCoffee } = useContext(CoffeeContext)

    const { id } = useParams()
    const navigate = useNavigate()

    const location = useLocation()
    const backRoute = location.state?.from || "/coffees"

    const coffee = coffees.find(c => c.id === Number(id))

    const [name,setName] = useState(coffee.name)
    const [origin,setOrigin] = useState(coffee.origin)
    const [process,setProcess] = useState(coffee.process)
    const [price,setPrice] = useState(coffee.price.replace(" RON",""))
    const [quantity,setQuantity] = useState(coffee.quantity.replace("g",""))
    const [status,setStatus] = useState(coffee.status)

    const [errors,setErrors] = useState({})

    function handleUpdate(){

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

        updateCoffee({
            ...coffee,
            name,
            origin,
            process,
            price: price + " RON",
            quantity: quantity + "g",
            status
        })

        navigate(backRoute)
    }

    return(

        <div className="edit-page">

            <h1 className="edit-logo">
                Meron Gallery.
            </h1>

            <div className="edit-content">

                <div className="edit-info">

                    <input
                        className="edit-title"
                        value={name}
                        onChange={(e)=>setName(e.target.value)}
                    />
                    {errors.name && <p className="error">{errors.name}</p>}

                    <div className="edit-row">
                        <label>Origin:</label>
                        <input
                            value={origin}
                            onChange={(e)=>setOrigin(e.target.value)}
                        />
                    </div>

                    <div className="edit-row">
                        <label>Process:</label>
                        <input
                            value={process}
                            onChange={(e)=>setProcess(e.target.value)}
                        />
                    </div>

                    <div className="edit-row">
                        <label>Price:</label>
                        <input
                            value={price}
                            onChange={(e)=>setPrice(e.target.value)}
                        />
                    </div>

                    <div className="edit-row">
                        <label>Quantity:</label>
                        <input
                            value={quantity}
                            onChange={(e)=>setQuantity(e.target.value)}
                        />
                    </div>

                    <div className="edit-row">
                        <label>Status:</label>
                        <input
                            value={status}
                            onChange={(e)=>setStatus(e.target.value)}
                        />
                    </div>

                </div>

                <div className="edit-chart">

                    <div className="chart">
                        <div className="bar body"></div>
                        <div className="bar acidity"></div>
                        <div className="bar sweetness"></div>
                        <div className="bar aroma"></div>
                    </div>

                    <div className="chart-labels">
                        <span>Body</span>
                        <span>Acidity</span>
                        <span>Sweetness</span>
                        <span>Aroma</span>
                    </div>

                </div>

                <div className="edit-image">

                    <img
                        src="/coffee-bag.png"
                        alt="coffee"
                    />

                </div>

            </div>

            <div className="edit-buttons">

                <button onClick={handleUpdate}>
                    Update
                </button>

                <button onClick={()=>navigate(backRoute)}>
                    Cancel
                </button>

            </div>

        </div>

    )

}

export default EditCoffeePage