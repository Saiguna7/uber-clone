import { useActionState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CaptainDataContext } from '../context/CaptionContext';
import {CaptainLoginAction} from '../../actions/captain-login-action'
const Captainlogin = () => {
  const navigate=useNavigate()
  const context = useContext(CaptainDataContext);

  if (!context) {
    throw new Error("UserLogin must be used within a UserDataProvider");
  }
  const { setCaptain } = context;
  const sumbmithandler=async(_prevState:{success:boolean; message:string},formData:FormData):Promise<{success:boolean; message:string}>=>{
    try {
      const result = await CaptainLoginAction(formData);
      if (result.success) {
        setCaptain(result.data)
        localStorage.setItem("token", result.data.token);
        navigate('/captain-home')
        return { success: true, message: "Login successful" };
      } else {
        return { success: false, message: result.message || "Login failed" };
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return { success: false, message: "An error occurred during login" };
    } 
  };                                                                                                                                                                                                                            
      const [state,action,isPending]=useActionState(sumbmithandler,{
        success:false,
        message:""
      })
  return (
    <div className='p-7 h-screen flex-col flex justify-between'>
      <div>
      <img
        alt='uber logo'
        className='w-16 mb-10 bg-transparent '
        src='data:image/jpeg;base64,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'
        />
      <form action={action}>
        <h3 className='text-lg font-medium mb-2'>What's your email</h3>
        <input disabled={isPending} type="text" placeholder="Enter your email" required name='email' className='bg-[#eeeeee] mb-7 rounded  px-4 py-2 border w-full text-lg placeholder:text-md'/>
        <h3 className='text-lg font-medium mb-2'>Enter Password</h3>
        <input disabled={isPending} className='bg-[#eeeeee] mb-7 rounded  px-4 py-2 border w-full text-lg placeholder:text-md' type="password" placeholder="Enter your password" required name='password'/>
        <button disabled={isPending} className='bg-[#111] mb-3 text-white font-semibold rounded  px-4 py-2 border w-full text-lg ' type="submit">{isPending?'Login...':'Login'}</button>
      </form>
      {state.message && !state.success && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-2 mb-4">
              <p>{state.message}</p>
            </div>
          )}
          
          {/* Success message display */}
          {state.message && state.success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mt-2 mb-4">
              <p>{state.message}</p>
            </div>
          )}
<p className='text-center text-sm '>Join a fleet? <Link to="/captain-signup" className='text-blue-600'>Register as a Captain</Link></p>
      </div>
      <div>
        <Link to="/login" className='bg-[#d5622d] flex mb-5 items-center justify-center text-white font-semibold rounded  px-4 py-2 border w-full text-lg '>Sign in as User</Link>
      </div>
    </div>
  )
}

export default Captainlogin
