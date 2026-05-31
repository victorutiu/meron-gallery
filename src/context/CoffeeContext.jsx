import { createContext, useState, useEffect } from "react"

import {
  getCoffees,
  createCoffee,
  updateCoffeeAPI,
  deleteCoffeeAPI,
  loginUser
} from "../services/api"

export const CoffeeContext = createContext()

export function CoffeeProvider({ children }) {

  const [coffees,setCoffees] = useState([])
  const [online, setOnline] = useState(navigator.onLine)

  // ✅ NEW: user state
  const [user, setUser] = useState(null)

  // ------------------------------
  // LOAD USER FROM LOCAL STORAGE
  // ------------------------------
  useEffect(()=>{
    const stored = localStorage.getItem("user")
    if(stored){
      setUser(JSON.parse(stored))
    }
  },[])

  // ------------------------------
  // LOGIN FUNCTION
  // ------------------------------
async function login(
  email,
  password
){

  try {

    const data =
      await loginUser({
        email,
        password
      })

    if(
      data.requiresVerification
    ){
      return {
        requiresVerification:
          true,

        email:
          data.email
      }
    }

  } catch(err){

    console.log(
      "Login failed"
    )

    throw err
  }
}

  // ------------------------------
  // Detect online / offline
  // ------------------------------
  useEffect(()=>{

    function handleOnline(){
      console.log("Back online")
      setOnline(true)
      syncOffline()
    }

    function handleOffline(){
      console.log("Offline mode")
      setOnline(false)
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return ()=>{
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }

  },[])

  // ------------------------------
  // Load coffees
  // ------------------------------
  async function loadCoffees(){

    try{

      const data = await getCoffees(1,50)

      setCoffees(data.data)

      localStorage.setItem("cachedCoffees", JSON.stringify(data.data))

      setOnline(true)

    }catch(err){

      console.log("Server unreachable, loading cached coffees")

      setOnline(false)

      const cached = localStorage.getItem("cachedCoffees")

      if(cached){
        setCoffees(JSON.parse(cached))
      }

    }

  }

  useEffect(()=>{
    if(coffees.length > 0){
      localStorage.setItem("cachedCoffees", JSON.stringify(coffees))
    }
  },[coffees])

  useEffect(()=>{

    const interval = setInterval(async ()=>{

      try{
        await getCoffees(1,1)
        setOnline(true)
      }catch{
        setOnline(false)
      }

    },1000)

    return ()=>clearInterval(interval)

  },[])

  useEffect(()=>{
    loadCoffees()
  },[])

  // ------------------------------
  // WebSocket
  // ------------------------------
  useEffect(()=>{

    const socket = new WebSocket(

    import.meta.env.PROD
      ? "wss://meron-gallery-api.onrender.com"
      : `ws://${window.location.hostname}:8080`

)

    socket.onopen = ()=>{
      console.log("Connected to WebSocket server")
    }

    socket.onmessage = (event)=>{

      const message = JSON.parse(event.data)

      if(message.type === "new-coffee"){

        console.log("New coffee received from server")

        setCoffees(prev => [...prev, message.data])

      }

    }

    socket.onerror = (err)=>{
      console.log("WebSocket error:", err)
    }

    socket.onclose = ()=>{
      console.log("WebSocket disconnected")
    }

    return ()=>socket.close()

  },[])

  // ------------------------------
  // OFFLINE QUEUE
  // ------------------------------
  function saveOfflineOperation(operation){

    const queue = JSON.parse(localStorage.getItem("offlineQueue") || "[]")

    queue.push(operation)

    localStorage.setItem("offlineQueue", JSON.stringify(queue))

  }

  async function syncOffline(){

    const queue = JSON.parse(localStorage.getItem("offlineQueue") || "[]")

    if(queue.length === 0) return

    console.log("Syncing offline operations...")

    for(const op of queue){

      try{

        if(op.type === "create"){
          await createCoffee(op.data)
        }

        if(op.type === "update"){
          await updateCoffeeAPI(op.data.id, op.data)
        }

        if(op.type === "delete"){
          await deleteCoffeeAPI(op.data.id)
        }

      }catch(err){
        console.log("Sync failed for operation:", op)
      }

    }

    localStorage.removeItem("offlineQueue")

    loadCoffees()

  }

  // ------------------------------
  // CRUD FUNCTIONS
  // ------------------------------
  async function addCoffee(coffee){

    try{

      await createCoffee(coffee)
      loadCoffees()

    }catch(err){

      console.log("Offline mode: storing create operation")

      saveOfflineOperation({
        type:"create",
        data:coffee
      })

      setCoffees(prev=>[
        ...prev,
        { ...coffee, id: Date.now() }
      ])

    }

  }

  async function updateCoffee(coffee){

    try{

      await updateCoffeeAPI(coffee.id,coffee)
      loadCoffees()

    }catch(err){

      console.log("Offline mode: storing update operation")

      saveOfflineOperation({
        type:"update",
        data:coffee
      })

      setCoffees(prev=>
        prev.map(c=>c.id===coffee.id ? coffee : c)
      )

    }

  }

  async function deleteCoffee(id){

    try{

      await deleteCoffeeAPI(id)
      loadCoffees()

    }catch(err){

      console.log("Offline mode: storing delete operation")

      saveOfflineOperation({
        type:"delete",
        data:{id}
      })

      setCoffees(prev=>prev.filter(c=>c.id!==id))

    }

  }

  function logout(){

  localStorage.removeItem("user")
  localStorage.removeItem("token")

  sessionStorage.removeItem(
    "appStarted"
  )

  setUser(null)

  window.location.href = "/"
}

  return (
    <CoffeeContext.Provider value={{
      coffees,
      addCoffee,
      updateCoffee,
      deleteCoffee,
      online,
      user,     
      login,
      logout       
    }}>
      {children}
    </CoffeeContext.Provider>
  )

}