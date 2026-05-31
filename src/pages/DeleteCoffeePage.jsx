import { useParams, useNavigate, useLocation } from "react-router-dom"
import "../styles/DeleteCoffeePage.css"
import { useContext } from "react"
import { CoffeeContext } from "../context/CoffeeContext"

function DeleteCoffeePage(){

    const { coffees, deleteCoffee } = useContext(CoffeeContext)

    const { id } = useParams()
    const navigate = useNavigate()

    const location = useLocation()
    
    const backRoute = location.state?.from || "/coffees"
    const coffee = coffees.find(c => c.id === Number(id))

    function handleDelete(){

        deleteCoffee(Number(id))

        navigate(backRoute)
    }

    return(

        <div className="delete-page">

           <img src="/rarities.png" className="delete-floating img1" />
           <img src="/rarities.png" className="delete-floating img2" />
           <img src="/classic-yellow.png" className="delete-floating img3" />
           <img src="/classic-yellow.png" className="delete-floating img4" />
           <img src="/green-bag.png" className="delete-floating img5" />
           <img src="/green-bag.png" className="delete-floating img6" />

            <div className="delete-content">

                <h2>
                    Are you sure you want to remove this coffee?
                </h2>

                <div className="delete-buttons">

                    <button onClick={handleDelete}>
                        Delete
                    </button>

                    <button onClick={()=>navigate(backRoute)}>
                        Cancel
                    </button>

                </div>

            </div>

        </div>

    )

}

export default DeleteCoffeePage