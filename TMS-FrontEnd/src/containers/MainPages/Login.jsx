import React, { useState } from "react";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { useAuth } from "../../context/AuthProvider";
import Alert from "../../components/Alert";

export default function Login() {
    //Get Login Function From Provider
    const { Login } = useAuth()
    // Form State
    const [Form, setForm] = useState({
        email: "",
        password: ""
    })

    const handleSubmit = (e) => {
        e.preventDefault();
        Login(Form)
            .then(() => {
                Alert({ icon: 'success', title: 'Logged in' })
            })
            .catch(err => {
                Alert({ icon: 'error', title: err })
            })
    }

    const handleChange = (e) => {
        setForm({ ...Form, [e.target.name]: e.target.value })
    }

    return (
        <section>
            <div className={`bg-gray-200 h-screen w-full flex justify-center items-center p-5`}>
                <div className={`bg-blue-600 w-full sm:w-1/2 md:w-9/12 lg:w-1/2 shadow-md flex flex-col md:flex-row items-center mx-5 sm:m-0 rounded`}>
                    <div className="w-full md:w-1/2 hidden md:flex flex-col justify-center items-center text-white">
                        <h1 className="text-3xl">Hello</h1>
                        <p className="text-5xl font-extrabold">Welcome!</p>
                    </div>
                    <div className={`bg-white w-full md:w-1/2 flex flex-col items-center py-32 px-8`}>
                        <h3 className={`text-blue-600 text-3xl font-bold  mb-4`}>
                            LOGIN
                        </h3>
                        <form className="w-full flex flex-col justify-center" onSubmit={handleSubmit} >
                            <Input type="email" value={Form.email} onChange={handleChange} name="email" autoComplete="email" title={'Email'} />
                            <Input type="password" value={Form.password} onChange={handleChange} name="password" autoComplete="current-password" title={'Password'} />
                            <Button type="submit" label={'Submit'} />
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}