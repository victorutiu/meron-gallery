import { useEffect,
useState }
from "react"

import {
  useNavigate
}
from "react-router-dom"

import
"../styles/HeavyStatisticsPage.css"

function
HeavyStatisticsPage(){

  const navigate =
    useNavigate()

  const [stats,
    setStats]
      = useState([])

  const [time,
    setTime]
      = useState("")

  const [cached,
    setCached]
      = useState(false)

  async function
  loadStatistics(){

    try {

      const res =
        await fetch(
          "/api/statistics/heavy"
        )

      const data =
        await res.json()

      setStats(
        data.data
      )

      setTime(
        data.executionTime
      )

      setCached(
        data.cached
      )

    } catch(err){

      console.log(err)
    }
  }

  useEffect(() => {
    loadStatistics()
  }, [])

  return (

    <div
      className=
      "heavy-page"
    >

      <h1
        className=
        "heavy-logo"
      >
        Meron Gallery.
      </h1>

      <h2>
        Heavy Statistics
      </h2>

      <div
        className=
        "heavy-info"
      >

        <p>
          <b>
            Execution Time:
          </b>{" "}
          {time}
        </p>

        <p>
          <b>
            Cached:
          </b>{" "}
          {
            cached
              ? "Yes"
              : "No"
          }
        </p>

        <p>
          <b>
            Coffees:
          </b>{" "}
          {
            stats.length
          }
        </p>

      </div>

      <div
        className=
        "heavy-table"
      >

        <table>

          <thead>
            <tr>
              <th>
                Coffee
              </th>

              <th>
                Origin
              </th>

              <th>
                Reviews
              </th>

              <th>
                Avg Rating
              </th>

              <th>
                Users
              </th>
            </tr>
          </thead>

          <tbody>

            {
              stats
              .slice(0,20)
              .map(
                (item,i)=>(
                <tr
                  key={i}
                >

                  <td>
                    {
                      item.coffee
                    }
                  </td>

                  <td>
                    {
                      item.origin
                    }
                  </td>

                  <td>
                    {
                      item.reviewCount
                    }
                  </td>

                  <td>
                    {
                      item.averageRating
                    }
                  </td>

                  <td>
                    {
                      item.uniqueUsers
                    }
                  </td>

                </tr>
              ))
            }

          </tbody>

        </table>

      </div>

      <div
        className=
        "heavy-buttons"
      >

        <button
          onClick={
            loadStatistics
          }
        >
          Refresh
        </button>

        <button
          onClick={() =>
            navigate(
              "/statistics"
            )
          }
        >
          Back
        </button>

      </div>

    </div>
  )
}

export default
HeavyStatisticsPage