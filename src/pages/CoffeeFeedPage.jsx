import { useNavigate } from "react-router-dom"
import { useState, useContext } from "react"
import { CoffeeContext } from "../context/CoffeeContext"
import "../styles/CoffeeFeedPage.css"
import "../styles/CoffeeListPage.css"

function CoffeeFeedPage(){

  const { coffees, online } = useContext(CoffeeContext)

  const navigate = useNavigate()

  const [bean,setBean] = useState(false)

  const itemsPerPage = 6
  const [page,setPage] = useState(1)

  const start = (page - 1) * itemsPerPage
  const current = coffees.slice(start, start + itemsPerPage)

  const totalPages = Math.ceil(coffees.length / itemsPerPage)

  return(

    <div className="coffee-page page-transition">

      <div className="coffee-header">

        <div className="coffee-left">
          <h1 className="coffee-logo">
            Meron Gallery.
            <span style={{marginLeft:"15px", fontSize:"16px"}}>
              {online ? "🟢 Online" : "🔴 Offline Mode"}
            </span>
          </h1>
        </div>

        <input
          className="coffee-search"
          placeholder="search..."
        />
        
        <div className="coffee-actions">

          <button
            className="coffee-action-button"
            onClick={()=>navigate("/add")}
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
            onClick={()=>navigate("/coffees")}
          >
            normal view
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
        Browse coffees at Meron Gallery
      </p>

      <div className="feed-container">

        {current.map(coffee => (

          <div
            key={coffee.id}
            className="coffee-feed-card"
            onClick={()=>{
              setBean(true)
              setTimeout(()=>{
                navigate(`/coffee/${coffee.id}`, { state: { from: "/feed" } })
              },1200)
            }}
          >

            <img
              src="/coffee-bag.png"
              alt="coffee"
              className="coffee-feed-image"
            />

            <div className="coffee-feed-info">

              <h3 className="coffee-feed-name">
                {coffee.name}
              </h3>

              <p><b>Origin:</b> {coffee.origin}</p>
              <p><b>Process:</b> {coffee.process}</p>
              <p><b>Price:</b> {coffee.price}</p>
              <p><b>Quantity:</b> {coffee.quantity}</p>
              <p><b>Status:</b> {coffee.status}</p>

            </div>

          </div>

        ))}

      </div>

      <div className="pagination">

        <button
          disabled={page === 1}
          onClick={()=>setPage(page - 1)}
        >
          &lt; Prev
        </button>

        {Array.from({length: totalPages},(_,i)=>(

          <button
            key={i}
            onClick={()=>setPage(i + 1)}
          >
            {i + 1}
          </button>

        ))}

        <button
          disabled={page === totalPages}
          onClick={()=>setPage(page + 1)}
        >
          Next &gt;
        </button>

      </div>

      {bean && (
        <img
          src="/coffee-bean.png"
          className="bean-roll-right"
        />
      )}

    </div>

  )

}

export default CoffeeFeedPage