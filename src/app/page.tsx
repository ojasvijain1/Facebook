"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import "./style.css";
import "./signUp.css";

interface FormData {
  email: string;
  password: string;

}

interface SignUpFormData {
  email: string;
  password: string;
  fname: string;
  lname: string;
  day: string;
  sex: string;
}

export default function Home() {
  const { register: loginRegister, handleSubmit: handleLoginSubmit, reset: loginReset } = useForm<FormData>();
  const { register: signUpRegister, handleSubmit: handleSignUpSubmit, reset: signUpReset  } = useForm<SignUpFormData>();
  const [showSignUp, setShowSignUp] = useState(false);
  const router = useRouter();
  
  const handleLogin = async (data: FormData) => {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  
    if (res.ok) {
      console.log("OK");
      router.push('/home');
    } 
    
    else if (res.status === 404) {
      const dataResponse = await res.json();
      alert(`${dataResponse.message}`);
      setShowSignUp(true);
      document.querySelector('.infoContainer')?.classList.add('opaque');
      loginReset();
    } 
    
    else if (res.status === 401) {
      const dataResponse = await res.json();
      alert(`${dataResponse.message}`);
      loginReset();
    } 
    
    else {
      console.log("Not ok");
    }
  };

  const handleSignUp = () => {
    setShowSignUp(true);
    document.querySelector('.infoContainer')?.classList.add('opaque');
    console.log("Sign up clicked");
  };
  
  const handleForgotPassword = () => {
    console.log("Forgot Password clicked");
  };

  const onCloseSignUp = () => {
    setShowSignUp(false);
    document.querySelector('.infoContainer')?.classList.remove('opaque');
  };

  const onSignUpSubmit = async (data: SignUpFormData) => {
    console.log("Signing up with:", data);
    const res = await fetch("/api/sign-up", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({data}),
    });
    const resData = await res.json()
    if (res.ok) {
      setShowSignUp(false);
      document.querySelector('.infoContainer')?.classList.remove('opaque');
      signUpReset();
      console.log("Ok");
    }
    else if (res.status === 401) {
      console.log("Inside else if ");
      alert(`${resData.message}`);
      setShowSignUp(false);
      document.querySelector('.infoContainer')?.classList.remove('opaque');
      signUpReset();
    }
    else {
      console.log("Not ok");
    }
  };

  return (
    <>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Facebook - log in or sign up</title>
      <link rel="stylesheet" href="style.css" />
      <div className="bodyContainer">
        <div className="infoContainer">
          <div className="aboutFacebook">
            <div className="imageContainer">
              <img
                src="https://static.xx.fbcdn.net/rsrc.php/y1/r/4lCu2zih0ca.svg"
                alt="facebook-image"
              />
            </div>
            <h3>
              Facebook helps you connect and share with the people in your life.
            </h3>
          </div>
          <div className="entryContainer">
            <div className="formContainer">
              <form onSubmit={handleLoginSubmit(handleLogin)}>
                <div className="emailEntry">
                  <input
                    type="text"
                    id="email"
                    placeholder="Email address or phone number"
                    {...loginRegister("email")}
                  />
                </div>
                <div className="passwordEntry">
                  <input
                    type="password"
                    id="password"
                    placeholder="Password"
                    {...loginRegister("password")}
                  />
                </div>
                <div className="loginbutton">
                  <button type="submit">Log in</button>
                </div>
                <div className="forgotPassword">
                  <button type="button" onClick={handleForgotPassword}>
                    Forgotten password?
                  </button>
                </div>
                <div className="line" />
                <div className="createNew">
                  <button type="button" onClick={handleSignUp}>
                    Create new account
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {showSignUp && (
          <>
            <meta charSet="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Sign Up page</title>
            <link rel="stylesheet" href="signUp.css" />
            <div className="Container">
              <div className="signUpContainer">
                <div className="signUp">
                  <div className="signUpHeading">
                    <img
                      src="https://static.xx.fbcdn.net/rsrc.php/v3/yO/r/zgulV2zGm8t.png"
                      alt="cross"
                      onClick={onCloseSignUp}
                    />
                    <div className="signUpInfo">
                      <div className="heading">Sign Up</div>
                      <div className="info">It's quick and easy</div>
                    </div>
                  </div>
                  <div className="signUpFormContainer">
                    <div className="signUpForm">
                      <form onSubmit={handleSignUpSubmit(onSignUpSubmit)} className="FormSignUp">
                        <div className="formFields">
                          <div className="fullname">
                            <div className="fname">
                              <input
                                type="text"
                                id="fname"
                                placeholder="First name"
                                {...signUpRegister("fname")}
                              />
                            </div>
                            <div className="surname">
                              <input
                                type="text"
                                id="lname"
                                placeholder="Surname"
                                {...signUpRegister("lname")}
                              />
                            </div>
                          </div>
                          <div className="email">
                            <input
                              type="email"
                              id="email"
                              placeholder="Email address"
                              {...signUpRegister("email")}
                            />
                          </div>
                          <div className="password">
                            <input
                              type="password"
                              id="password"
                              placeholder="New password"
                              {...signUpRegister("password")}
                            />
                          </div>
                          <div className="birthdayWrapper">
                            <div className="bdayHeading">Date of birth</div>
                            <div className="selectors">
                              <span className="dataSelectors">
                                <span>
                                  <input type="date" id="day" {...signUpRegister("day")} />
                                </span>
                              </span>
                            </div>
                          </div>
                          <div className="genderWrapper">
                            <div className="genderHeading">Gender</div>
                            <div className="gSelectors">
                              <span className="selectG">
                                <span className="radioGender firstRadioGender">
                                  <label className="genderLabel" htmlFor="female">
                                    Female
                                  </label>
                                  <input
                                    className="radioInput"
                                    type="radio"
                                    id="sex"
                                    value="female"
                                    {...signUpRegister("sex")}
                                  />
                                </span>
                                <span className="radioGender">
                                  <label className="genderLabel" htmlFor="female">
                                    Male
                                  </label>
                                  <input
                                    className="radioInput"
                                    type="radio"
                                    id="Male"
                                    value="male"
                                    {...signUpRegister("sex")}
                                  />
                                </span>
                                <span className="radioGender">
                                  <label className="genderLabel" htmlFor="female">
                                    Custom
                                  </label>
                                  <input
                                    className="radioInput"
                                    type="radio"
                                    id="sex"
                                    value="custom"
                                    {...signUpRegister("sex")}
                                  />
                                </span>
                              </span>
                            </div>
                            <div className="signUpButton">
                              <button type="submit">Sign Up</button>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}