import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { UserDataContext } from "../context/UserContext"
import axios from "axios"

const UserProtectWrapper = ({children}:{children:React.ReactNode}) => {
    const navigate=useNavigate()
    const context=useContext(UserDataContext)
    if(!context){
      throw new Error("UserProtectWrapper must be used within a UserContext");
    }
    const [isloading,setloading]=useState(true)
    const {setUser}=context
    useEffect(() => {
        axios.get(`${import.meta.env.VITE_BASE_URL}/users/profile`,{
withCredentials:true
        }).then((res)=>{
            if(res.status===200){
                setUser(res.data.user)
                setloading(false)
            }
        }).catch((err)=>{
            console.log(err)
            navigate("/login")
        })
      }, [navigate,setUser]); // Re-run if token or navigate changes
     if(isloading){
      return <>
      Loading..
      </>
     }
  return (
    <>
      {children}
    </>
  )
}

export default UserProtectWrapper
