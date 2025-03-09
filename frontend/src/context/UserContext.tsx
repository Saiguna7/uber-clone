import { createContext } from "react"

export const UserDataContext = createContext()

const UserContext = ({children}: {children: React.ReactNode}) => {
const user='Sarthal'
  return (
    <div>
      <UserDataContext.Provider value={user}>
      {children}
      </UserDataContext.Provider>
    </div>
  )
}

export default UserContext
