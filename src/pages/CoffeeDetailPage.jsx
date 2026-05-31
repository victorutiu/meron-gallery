import { useParams, useNavigate } from "react-router-dom"
import "../styles/CoffeeDetailPage.css"
import { setCookie } from "../utils/cookieManager"
import { useEffect, useContext, useState } from "react"
import { CoffeeContext } from "../context/CoffeeContext"
import { useLocation } from "react-router-dom"

function CoffeeDetailPage(){

    const { coffees } = useContext(CoffeeContext)

    const { id } = useParams()
    const navigate = useNavigate()

    const [bean,setBean] = useState(false)

    const coffee = coffees.find(c => c.id === Number(id))

    const location = useLocation()
    const backRoute = location.state?.from || "/coffees"

    const user = JSON.parse(
    localStorage.getItem("user"))

    const isAdmin =
    user?.role === "admin"

    useEffect(() => {
        if (coffee) {
            setCookie("lastViewedCoffee", coffee.name)
        }
    }, [coffee])

    if(!coffee){
        return <h2>Coffee not found</h2>
    }

    return(

        <div className="detail-page">

            <h1 className="detail-logo">
                Meron Gallery.
            </h1>

            <div className="detail-content">

                <div className="detail-info">

                    <h2 className="coffee-name">
                        {coffee.name}
                    </h2>

                    <p>Origin: {coffee.origin}</p>
                    <p>Process: {coffee.process}</p>
                    <p>Price: {coffee.price}</p>
                    <p>Quantity: {coffee.quantity}</p>
                    <p>Status: {coffee.status}</p>

                </div>

                <div className="detail-chart">

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

                <div className="detail-image">

                    <img
                        src="/coffee-bag.png"
                        alt="coffee"
                    />

                </div>

            </div>

            <div className="detail-buttons">

                <button
                    onClick={()=>{
                        if(!isAdmin){
                        alert("Only admins can edit coffee")
                        return
                        }
                        navigate(`/edit/${coffee.id}`, { state: { from: backRoute } })
                    }}
                    >
                    Edit coffee
                </button>

                <button
                    onClick={()=>{
                        if(!isAdmin){
                        alert("Only admins can delete coffee")
                        return
                        }
                        navigate(`/delete/${coffee.id}`, { state: { from: backRoute } })
                    }}
                    >
                    Remove coffee
                </button>

                <button
                    onClick={()=>{
                        setBean(true)
                        setTimeout(()=>{
                            navigate(backRoute)
                        },1200)
                    }}
                >
                    Back
                </button>

            </div>

            {bean && (
                <img
                    src="/coffee-bean.png"
                    className="bean-roll-left"
                />
            )}

        </div>

    )

}

export default CoffeeDetailPage