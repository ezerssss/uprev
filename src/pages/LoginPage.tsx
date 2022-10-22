import logo from '../images/logo.jpg';
import { signInWithRedirect, GoogleAuthProvider } from 'firebase/auth';
import auth from '../firebase/auth';

function LoginPage() {
    async function handleLogin(): Promise<void> {
        const provider = new GoogleAuthProvider();
        signInWithRedirect(auth, provider);
    }

    return (
        <div className="h-screen w-screen p-6 flex justify-center items-center flex-col">
            <div className="text-center" id="login-logo">
                <img src={logo} alt="uprev" className="m-auto w-44" />
                <h1 className="font-bold text-6xl tracking-wide -mt-5">
                    uprev.
                </h1>
            </div>

            <div id="login-button">
                <button
                    className="border-2 border-slate-600 rounded-2xl px-6 py-3 w-60"
                    onClick={handleLogin}
                >
                    Sign in with Google
                </button>
                <p className="text-center text-[10px] mt-1">
                    <i>
                        Use an <b>@up.edu.ph</b> email
                    </i>
                </p>
            </div>
        </div>
    );
}

export default LoginPage;
