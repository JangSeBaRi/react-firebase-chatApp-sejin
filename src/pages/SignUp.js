import React, { useEffect, useRef, useState } from "react";
import { db, firebaseApp, firebase } from "../firebase";
import { useForm } from "react-hook-form";
import md5 from "md5";
import { Link, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserProfile } from "../reducers/user";

const SignUp = () => {

    const history = useHistory();
    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();
    const password = useRef();
    password.current = watch("password");

    const [errorsFromSubmit, setErrorsFromSubmit] = useState("");
    const [loading, setLoading] = useState(false);
    const [isAgreeInfo, setIsAgreeInfo] = useState(false);
    const [signupPath, setSignupPath] = useState("SEARCH");

    const updateIsAgreeInfo = () => {
        setIsAgreeInfo((prev) => !prev);
    };

    const onSignupPathChange = (e) => {
        setSignupPath(e.target.value);
    };

    const onSubmit = async (data) => {
        const payload = {
            email: data.email,
            password: data.password,
            nickname: data.nickname,
            isAgreeInfo: isAgreeInfo,
            signupPath: signupPath,
        };
        try {
            setLoading(true);
            //Firebase auth 서비스에서 이메일과 비밀번호로 유저 생성
            let createUser = await firebaseApp
                .auth()
                .createUserWithEmailAndPassword(
                    payload.email,
                    payload.password
                );
            //Firebase auth 서비스에서 생성한 유저에 추가 정보 입력
            firebaseApp.auth().signOut();
            await createUser.user.updateProfile({
                displayName: payload.nickname,
                photoURL: `http://gravatar.com/avatar/${md5(
                    createUser.user.email
                )}?d=identicon`,
            });
            // //Firestore 데이터 저장
            // console.log(payload)
            await db.collection("users").doc(createUser.user.uid).set({                
                uid: createUser.user.uid,
                email: payload.email,
                nickname: payload.nickname,
                isAgreeInfo: payload.isAgreeInfo,
                signupPath: payload.signupPath,
                image: createUser.user.photoURL,
                created: firebase.firestore.Timestamp.now().seconds
            });
            alert("환영합니다. 로그인해주세요.");
        } catch (error) {
            setErrorsFromSubmit(error.message);
            setLoading(false);
            setTimeout(() => {
                setErrorsFromSubmit("");
            }, 5000);
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="form">
                <div style={{ textAlign: "center" }}>
                    <h3>회원가입</h3>
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <label>이메일 (필수)</label>
                    <input
                        type="email"
                        {...register("email", {
                            required: true,
                            pattern:
                                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                        })}
                    />
                    {errors.email && <p>이메일을 입력해주세요.</p>}

                    <label>닉네임 (필수)</label>
                    <input
                        {...register("nickname", {
                            required: true,
                            maxLength: 10,
                        })}
                    />
                    {errors.nickname && errors.nickname.type === "required" && (
                        <p> 닉네임을 입력해 주세요.</p>
                    )}
                    {errors.nickname &&
                        errors.nickname.type === "maxLength" && (
                            <p> 닉네임은 최대 10글자 이내입니다.</p>
                        )}

                    <label>비밀번호 (필수)</label>
                    <input
                        type="password"
                        {...register("password", { required: true })}
                    />
                    {errors.password && errors.password.type === "required" && (
                        <p> 비밀번호를 입력해주세요.</p>
                    )}

                    <label>비밀번호 확인 (필수)</label>
                    <input
                        type="password"
                        {...register("password_confirm", {
                            required: true,
                            validate: (value) => value === password.current,
                        })}
                    />
                    {errors.password_confirm &&
                        errors.password_confirm.type === "required" && (
                            <p> 비밀번호 확인을 입력해주세요.</p>
                        )}
                    {errors.password_confirm &&
                        errors.password_confirm.type === "validate" && (
                            <p> 비밀번호가 일치하지 않습니다.</p>
                        )}

                    {errorsFromSubmit && <p>{errorsFromSubmit}</p>}
                    <div style={{ position: "relative" }}>
                        <label htmlFor="check" style={{ display: "inline" }}>
                            정보동의 여부
                        </label>
                        <input
                            type="checkbox"
                            id="check"
                            checked={isAgreeInfo}
                            onClick={(e) => updateIsAgreeInfo()}
                            style={{ position: "absolute", top: 3, right: 65 }}
                        />
                    </div>
                    <div style={{ marginTop: 5 }}>
                        <label style={{ display: "inline" }}>가입경로</label>
                        <select
                            value={signupPath}
                            onChange={(e) => onSignupPathChange(e)}
                            style={{ marginLeft: 16 }}
                        >
                            <option value={"SEARCH"}>검색</option>
                            <option value={"ADS"}>광고</option>
                            <option value={"ETC"}>이외</option>
                        </select>
                    </div>
                    <input
                        type="submit"
                        value="가입"
                        style={{ marginTop: 40 }}
                        disabled={loading}
                    />
                </form>
                <div
                    style={{
                        flexDirection: "column",
                        textAlign: "center",
                        marginTop: 15,
                    }}
                >
                    이미 아이디가 있습니까?
                    <Link
                        style={{
                            color: "gray",
                            textDecoration: "none",
                            marginLeft: 10,
                        }}
                        to="/users/login"
                    >
                        {" "}
                        여기를 클릭하세요
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
