import { useEffect } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice'

const useGetCurrentUser = () => {
    const dispatch = useDispatch()

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_SERVER_URL}/api/auth/me`,
                    { withCredentials: true }
                )
                dispatch(setUserData(res.data))
            } catch (error) {
                dispatch(setUserData(null))
            }
        }
        fetchUser()
    }, [])
}

export default useGetCurrentUser