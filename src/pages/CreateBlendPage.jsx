import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import { CoffeeContext } from "../context/CoffeeContext"
import "../styles/CreateBlendPage.css"

function CreateBlendPage() {

  const { coffees, addBlend } = useContext(CoffeeContext)
  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [quantity, setQuantity] = useState("")

  const [rows, setRows] = useState([
    { coffeeId: "", percentage: "" }
  ])

  /* COFFEE SELECT  */

  function handleCoffeeChange(index, value) {

    const updated = [...rows]
    updated[index].coffeeId = value

    setRows(updated)
  }

  /* PERCENTAGE */

  function handlePercentageChange(index, value) {

    const updated = [...rows]
    updated[index].percentage = value

    setRows(updated)

    /* automatically create new row */

    if (index === rows.length - 1 && value !== "") {
      setRows([
        ...updated,
        { coffeeId: "", percentage: "" }
      ])
    }
  }

  /* CREATE BLEND */

  function handleNext() {

  const usedCoffees = rows
    .filter(r => r.coffeeId !== "" && r.percentage !== "")
    .map(r => {

      const coffee = coffees.find(
        c => c.id === Number(r.coffeeId)
      )

      return {
        coffeeId: coffee.id,
        name: coffee.name,
        origin: coffee.origin,
        percentage: Number(r.percentage)
      }

    })

  const previewBlend = {
    name,
    quantity: quantity + "g",
    author: "Admin",
    status: "Available",
    coffees: usedCoffees
  }

  navigate("/preview-blend", {
    state: { blend: previewBlend }
  })
}

  return (

    <div className="create-page">

      <h1 className="create-logo">
        Meron Gallery.
      </h1>

      <div className="create-container">

        {/* LEFT SIDE */}

        <div className="create-left">

          <div className="create-row">
            <label>Blend name:</label>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="create-select">

            {rows.map((row, index) => (

              <div
                key={index}
                className="coffee-row"
              >

                <select
                  value={row.coffeeId}
                  onChange={(e) =>
                    handleCoffeeChange(
                      index,
                      e.target.value
                    )
                  }
                >

                  <option value="">
                    select coffee
                  </option>

                  {coffees.map(coffee => (

                    <option
                      key={coffee.id}
                      value={coffee.id}
                    >
                      {coffee.name}
                    </option>

                  ))}

                </select>

                <input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="%"
                  value={row.percentage}
                  onChange={(e) =>
                    handlePercentageChange(
                      index,
                      e.target.value
                    )
                  }
                />

              </div>

            ))}

          </div>

          <div className="create-row">
            <label>Quantity</label>

            <input
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>

        </div>


        {/* DESCRIPTION */}

        <div className="create-description">

          <h3>description</h3>

          <p>
            Body, acidity, and sweetness are key components
            in sensory evaluation, particularly in wine and
            coffee, defining the flavor profile, mouthfeel,
            and balance of the product.
          </p>

        </div>

      </div>


      {/* BUTTONS */}

      <div className="create-buttons">

        <button
          onClick={() => navigate("/blends")}
        >
          back
        </button>

        <button
          onClick={handleNext}
        >
          next
        </button>

      </div>

      {/* FLOATING DECORATION IMAGES */}

      <img src="/rarities.png" className="create-floating create-img1" />
      <img src="/rarities.png" className="create-floating create-img2" />
      <img src="/classic-yellow.png" className="create-floating create-img3" />
      <img src="/classic-yellow.png" className="create-floating create-img4" />
      <img src="/green-bag.png" className="create-floating create-img5" />
      <img src="/green-bag.png" className="create-floating create-img6" />
      
    </div>

  )
}

export default CreateBlendPage