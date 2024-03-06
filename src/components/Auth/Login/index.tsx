"use client";
import { Button, TextField } from "@mui/material";
import type { NextPage } from "next";
import { ChangeEvent, useState } from "react";
import styles from "./login.module.css";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const LoginWithEmail: NextPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signIn = async (e: any) => {
    e.preventDefault();
    router.push("/dashboard");

    try {
    } catch (err: any) {
      toast.error(err?.message?.toString() || "Something went wrong");

      console.error(err);
    }
  };
  return (
    <main className={styles.login}>
      <section className={styles.imagecontainer}>
        <div className={styles.imagecontainer1} />
      </section>
      <section className={styles.logincontainer}>
        <div className={styles.logocontainer}>
          <img className={styles.logoIcon} alt="" src="/auth/login/logo.svg" />
        </div>
        <div className={styles.loginform}>
          <div className={styles.textwrapper}>
            <h1 className={styles.welcometext}>Welcome back</h1>
            <div
              className={styles.enterYourEmail}
            >{`Enter your email and password to access your account  `}</div>
          </div>
          <form className={styles.form} onSubmit={signIn}>
            <div className={styles.inputgroup}>
              <div className={styles.email}>
                <label className={styles.lable}>Email</label>
                <TextField
                  className={styles.emailinput}
                  placeholder="Enter email"
                  value={email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setEmail(e.target.value)
                  }
                />
              </div>
              <div className={styles.email}>
                <label className={styles.lable}>Password</label>
                <div className={styles.container}>
                  <TextField
                    className={styles.passwordinput}
                    type={password}
                    placeholder="Enter email"
                    value={password}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setPassword(e.target.value)
                    }
                  />
                  <div className={styles.forgotpasswordbuttoncontainer}>
                    <button className={styles.forgotpasswordbutton}>
                      <p className={styles.text}>Forgot Password?</p>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <Button className={styles.signinbutton} onClick={signIn}>
              Sign In
            </Button>
          </form>
        </div>
      </section>
    </main>
  );
};

export default LoginWithEmail;
