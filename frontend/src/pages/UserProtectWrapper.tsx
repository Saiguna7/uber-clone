import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { UserDataContext } from "../context/UserContext"
import axios from "axios"

const UserProtectWrapper = ({children}:{children:React.ReactNode}) => {
   const token=localStorage.getItem('token')
    const navigate=useNavigate()
    const context=useContext(UserDataContext)
    if(!context){
      throw new Error("UserProtectWrapper must be used within a UserContext");
    }
    const [isloading,setloading]=useState(true)
    const {setUser}=context
    useEffect(() => {
        if (!token) {
          navigate("/login");
          return;
        }
        axios.get(`${import.meta.env.VITE_BASE_URL}/users/profile`,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        }).then((res)=>{
            if(res.status===200){
                setUser(res.data)
                setloading(false)
            }
        }).catch((err)=>{
            console.log(err)
            localStorage.removeItem('token')
            navigate("/login")
        })
      }, [token, navigate,setUser]); // Re-run if token or navigate changes
     if(isloading){
      return <>
      Loading..
      </>
     }
      if (!token) {
        return null; // Prevent rendering children while redirecting
      }
  return (
    <>
      {children}
    </>
  )
}

export default UserProtectWrapper
