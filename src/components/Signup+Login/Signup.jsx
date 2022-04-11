import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext';

export default function Signup() {
    const nameRef = useRef()
    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()
    const { signup, currentUser } = useAuth()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    async function handleSubmit(event) {
        event.preventDefault()
        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            setError('passwords do not match')
            return
        }

        setError('')
        setLoading(true)
        const res = await signup(emailRef.current.value, passwordRef.current.value)

        // Not a great way to handle error codes, but fine for now.
        setLoading(false)
        if (res.error) {
            setError(res.message.message.substring(10).replace('auth/', '').replace(/-/g, ' '))
        }
        else {
            navigate('/')
        }
    }

    const redirectIfLoggedIn = () => {
        //navigates to profile if user tries to access signup when already logged in
        currentUser && navigate('/profile')
    }
    // should probably be called before component loads, not in useEffect.
    useEffect(() => {
        redirectIfLoggedIn()
    },[])

    return (
        <>
        <div className="loginContainer">
            <div className="registerHeader">
                <h1>Registrer deg</h1>
            </div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Navn</label><br />
                    <input type="text" ref={nameRef} required />
                </div>
                <div>
                    <label>E-post</label><br />
                    <input type="email" ref={emailRef} required />
                </div>
                <div>
                    <label>Passord</label><br />
                    <input type="password" ref={passwordRef} required />
                </div>
                <div>
                    <label>Gjenta passord</label><br />
                    <input type="password" ref={passwordConfirmRef} required />
                </div>
                <button className="greenBG" disabled={loading} type="submit">Registrer deg</button>
                <div>{error ? error : ''}</div>
            </form>

            <div className="signupSection">Har du allerede en bruker? <Link to="/login">
                <button className="greenBorder">Logg inn</button></Link></div>
            <div>{currentUser && "you're already logged in as: " + currentUser.email}</div>
            </div>
        </>
    )
}