import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import "../styles/CoffeeListPage.css"
import { setCookie, getCookie } from "../utils/cookieManager"
import { CoffeeContext } from "../context/CoffeeContext"

function CoffeeListPage(){

    const { coffees, online } = useContext(CoffeeContext)

    const navigate = useNavigate()

    const [bean,setBean] = useState(false)

    const itemsPerPage = 6
    const [page,setPage] = useState(1)

    const totalPages = Math.ceil(coffees.length / itemsPerPage)

    const start = (page - 1) * itemsPerPage
    const current = coffees.slice(0, page * itemsPerPage)

    const lastCoffee = getCookie("lastViewedCoffee")

    const user = JSON.parse(
    localStorage.getItem("user"))

    const isAdmin =
    user?.role === "admin"

    useEffect(() => {
        setCookie("lastPage", "coffees")
    }, [])

  
    // infinite scroll
    useEffect(()=>{

        function handleScroll(){

            if(
                window.innerHeight + window.scrollY >= document.body.offsetHeight - 200
            ){
                setPage(prev => {
                    if(prev < totalPages){
                        return prev + 1
                    }
                    return prev
                })
            }

        }

        window.addEventListener("scroll", handleScroll)

        return ()=> window.removeEventListener("scroll", handleScroll)

    }, [totalPages])

    return(

        <div className="coffee-page page-transition">

            <div className="coffee-header">

                <h1 className="coffee-logo">
                    Meron Gallery.
                    <span style={{marginLeft:"15px", fontSize:"16px"}}>
                        {online ? "🟢 Online" : "🔴 Offline Mode"}
                    </span>
                </h1>

                <div className="coffee-actions">

                    <input
                        className="coffee-search"
                        placeholder="search..."
                    />

                    <button
                        className="coffee-action-button"
                        onClick={()=>{
                            if(!isAdmin){
                            alert("Only admins can add coffee")
                            return
                            }
                            navigate("/add", { state: { from: "/coffees" } })
                        }}
                        >
                        add coffee
                    </button>

                    <button
                        className="coffee-action-button"
                        onClick={()=>navigate("/statistics")}
                    >
                        statistics
                    </button>

                    <button
                        className="coffee-action-button"
                        onClick={()=>navigate("/feed")}
                    >
                        view feed
                    </button>

                    <button
                        className="coffee-action-button"
                        onClick={()=>navigate("/")}
                    >
                        home
                    </button>

                </div>

            </div>

            <p className="coffee-subtitle">
                Manage coffees at Meron Gallery
            </p>

            {lastCoffee && (
                <p style={{marginBottom:"15px", color:"#777"}}>
                    Last viewed coffee: {lastCoffee}
                </p>
            )}

            <div className="coffee-table">

                <table>

                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Origin</th>
                            <th>Process</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Status</th>
                        </tr>
                    </thead>

                    <tbody>

                        {current.map((coffee)=>(

                            <tr
                                key={coffee.id}
                                onClick={()=>{
                                    setBean(true)
                                    setTimeout(()=>{
                                        navigate(`/coffee/${coffee.id}`, { state: { from: "/coffees" } })
                                    },1200)
                                }}
                            >
                                <td>{coffee.name}</td>
                                <td>{coffee.origin}</td>
                                <td>{coffee.process}</td>
                                <td>{coffee.price}</td>
                                <td>{coffee.quantity}</td>
                                <td>{coffee.status}</td>
                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

            {/* Loading message */}

            {page < totalPages && (
                <p style={{textAlign:"center", marginTop:"20px"}}>
                    Loading more coffees...
                </p>
            )}

            {bean && (
                <img
                    src="/coffee-bean.png"
                    className="bean-roll-right"
                />
            )}

        </div>

    )

}

export default CoffeeListPage