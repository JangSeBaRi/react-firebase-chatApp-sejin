import React, { useState } from 'react'
import { firebaseApp } from '../firebase'
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { setUserProfile, setIsLoading, setClearUser } from '../reducers/user';

const LoginPage = () => {

    const dispatch = useDispatch();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [errorsFromSubmit, setErrorsFromSubmit] = useState("")
    const [loading, setLoading] = useState(false)

    const onSubmit = async (data) => {
        try {
            setLoading(true)
            await firebaseApp.auth().signInWithEmailAndPassword(data.email, data.password)
        } catch (error) {
            setLoading(false)
            if (error.code === 'auth/user-not-found') {
                setErrorsFromSubmit('가입된 메일이 없습니다. 이메일을 확인해주세요.')
            } else if (error.code === 'auth/wrong-password')
                setErrorsFromSubmit('비밀번호를 확인해주세요.')
            setTimeout(() => {
                setErrorsFromSubmit("")
            }, 5000);
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="form">
                <div style={{ textAlign: 'center' }}>
                    <h3>로그인</h3>
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <label>이메일</label>
                    <input
                        type="email"
                        {...register("email", { required: true, pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ })}
                    />
                    {errors.email && <p>이메일을 입력해주세요.</p>}
                    <label>비밀번호</label>
                    <input
                        type="password"
                        {...register("password", { required: true })}
                    />
                    {errors.password && errors.password.type === "required"
                        && <p> 비밀번호를 입력해주세요.</p>}
                    {errorsFromSubmit &&
                        <p>{errorsFromSubmit}</p>
                    }
                    <input
                        type="submit"
                        value="시작"
                        style={{ marginTop: 40 }}
                        disabled={loading}
                    />
                </form>
                <div style={{ flexDirection: 'column', textAlign: 'center', marginTop: 15 }}>
                    계정이 없습니까?<Link style={{ color: 'gray', textDecoration: 'none', marginLeft: 10 }} to="/users/signup"> 여기를 클릭하세요</Link>
                </div>
            </div>
        </div >
    )
};

export default LoginPage;
