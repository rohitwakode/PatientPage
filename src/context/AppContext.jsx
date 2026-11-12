import { createContext, useCallback, useEffect, useState } from "react";
import axios from 'axios'
import PropTypes from 'prop-types'
import { normalizeDoctor, normalizePatient } from './apiMappers'
import { getApiErrorMessage } from './apiErrors'
import { notify } from '../components/notificationService'

export const AppContext = createContext()

const AppContextProvider = ({ children }) => {

    const currencySymbol = '₹'
    const backendUrl = (import.meta.env.VITE_BACKEND_URL || '').replace(/\/+$/, '')

    const [doctors, setDoctors] = useState([])
    const [token, setToken] = useState(localStorage.getItem('token') || '')
    const [userData, setUserData] = useState(false)

    // Getting Doctors using API
    const getDoctosData = useCallback(async () => {
        if (!token) {
            setDoctors([])
            return
        }

        try {

            const { data } = await axios.get(`${backendUrl}/patient/doctors`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (!Array.isArray(data)) {
                throw new Error('Doctors API returned an unexpected response')
            }
            setDoctors(data.map(normalizeDoctor))

        } catch (error) {
            console.log(error)
            notify.error(getApiErrorMessage(error))
        }

    }, [backendUrl, token])

    // Getting User Profile using API
    const loadUserProfileData = useCallback(async () => {

        try {

            const { data } = await axios.get(`${backendUrl}/patient/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setUserData(normalizePatient(data))

        } catch (error) {
            console.log(error)
            notify.error(getApiErrorMessage(error))
        }

    }, [backendUrl, token])

    useEffect(() => {
        getDoctosData()
    }, [getDoctosData])

    useEffect(() => {
        if (token) {
            loadUserProfileData()
        }
    }, [loadUserProfileData, token])

    const value = {
        doctors, getDoctosData,
        currencySymbol,
        backendUrl,
        token, setToken,
        userData, setUserData, loadUserProfileData
    }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )

}

AppContextProvider.propTypes = {
    children: PropTypes.node.isRequired
}

export default AppContextProvider