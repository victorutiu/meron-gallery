import { useNavigate } from "react-router-dom"
import { useState, useContext } from "react"
import "../styles/BlendListPage.css"
import { CoffeeContext } from "../context/CoffeeContext"

function BlendListPage() {

  const { blends } = useContext(CoffeeContext)
  const navigate = useNavigate()

  const itemsPerPage = 3
  const [page, setPage] = useState(1)

  const start = (page - 1) * itemsPerPage
  const current = blends.slice(start, start + itemsPerPage)

  const totalPages = Math.ceil(blends.length / itemsPerPage)

  return (

    <div className="blend-page">

      {/* HEADER */}

      <div className="blend-header">

        <div className="blend-left">

          <div>
            <h1 className="blend-logo">Meron Gallery.</h1>
            <p className="blend-subtitle">
              manage blends at Meron Gallery
            </p>
          </div>

        </div>

        <div className="blend-actions">

          <input
            className="blend-search"
            placeholder="search..."
          />

          <button
            className="blend-btn"
            onClick={() => navigate("/create-blend")}
          >
            create blend
          </button>

          <button
            className="blend-btn"
            onClick={() => navigate("/")}
          >
            home
          </button>

        </div>

      </div>


      {/* TABLE */}

      <div className="blend-table">

        <table>

          <thead>
            <tr>
              <th>Name</th>
              <th>Origins</th>
              <th>Quantity</th>
              <th>Author</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>

            {current.map((blend) => (

              <tr
                key={blend.id}
                onClick={() => navigate(`/blend/${blend.id}`)}
              >

                <td>{blend.name}</td>

                <td>
                  {blend.coffees
                    .map(c => c.origin)
                    .join(", ")}
                </td>

                <td>{blend.quantity}</td>

                <td>{blend.author}</td>

                <td>{blend.status}</td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>


      {/* PAGINATION */}

      <div className="blend-pagination">

        <span>
          Showing {blends.length === 0 ? 0 : start + 1}
          -
          {Math.min(start + itemsPerPage, blends.length)}
          {" "}of {blends.length}
        </span>

        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          &lt; Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => (

          <button
            key={i}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </button>

        ))}

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next &gt;
        </button>

      </div>


      {/* FLOATING DECORATION IMAGES */}

      <img src="/rarities.png" className="blends-floating blends-img1" />
      <img src="/rarities.png" className="blends-floating blends-img2" />
      <img src="/classic-yellow.png" className="blends-floating blends-img3" />
      <img src="/classic-yellow.png" className="blends-floating blends-img4" />
      <img src="/green-bag.png" className="blends-floating blends-img5" />
      <img src="/green-bag.png" className="blends-floating blends-img6" />

    </div>

  )
}

export default BlendListPage