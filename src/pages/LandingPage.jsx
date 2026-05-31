import { useNavigate } from "react-router-dom"
import "../styles/LandingPage.css"
import { useEffect, useContext } from "react"
import { setCookie } from "../utils/cookieManager"
import { CoffeeContext } from "../context/CoffeeContext"

function LandingPage() {

  const navigate = useNavigate()

  const { logout } = useContext(CoffeeContext)

  const user = JSON.parse(
    localStorage.getItem("user")
  )

  function goToPage(page){

    navigate(page)

  }

  useEffect(() => {
    setCookie("lastPage", "landing")
  }, [])


  return (
    <div className="page">

      <div className="landing-card">

        {/* HEADER */}
        <div className="header">

          <div className="logo-container">
            <img
              src="/coffee-logo.png"
              alt="logo"
            />

            <h1>Meron Gallery.</h1>
          </div>

          <div className="menu-bar">

            <button
              onClick={() =>
                goToPage("/coffees")
              }
            >
              Coffees
            </button>

            <button
              onClick={() =>
                goToPage("/blends")
              }
            >
              Blends
            </button>

            {!user && (
              <>
                <button
                  onClick={() =>
                    navigate("/login")
                  }
                >
                  Login
                </button>

                <button
                  onClick={() =>
                    navigate("/register")
                  }
                >
                  Register
                </button>
              </>
            )}

            <button
              onClick={() =>
                navigate("/chat")
              }
            >
              Chat
            </button>

            {user?.role === "admin" && (
              <button
                onClick={() =>
                  navigate("/observations")
                }
              >
                Observation List
              </button>
            )}

            {/* LOGOUT */}
            {user && (
              <button
                onClick={logout}
              >
                Logout
              </button>
            )}

          </div>

        </div>


        {/* MAIN CONTENT */}
        <div className="content">

          <div className="left">

            <h2>
              Specialty Coffee Experience
            </h2>

            <p>
              Discover rotating specialty
              coffees served at Meron's
              flagship location in Cluj.
            </p>

            {!user && (
              <button
                className="staff-btn"
                onClick={() =>
                  navigate("/login")
                }
              >
                Staff Login
              </button>
            )}

          </div>


          <div className="right">
            <img
              src="/coffee-shop.jpg"
              alt="coffee shop"
            />
          </div>

        </div>

      </div>

    </div>
  )
}

export default LandingPage