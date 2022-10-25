import logo from '../images/logo.png';
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
                <img src={logo} alt="uprev" className="m-auto w-24" />
                <h1 className="font-bold text-6xl tracking-wide">uprev.</h1>
            </div>

            <div id="login-button">
                <button
                    className="border-2 border-slate-600 rounded-2xl px-6 py-3 w-60 hover:bg-red-500 hover:text-white transition ease-in-out duration-500"
                    onClick={handleLogin}
                >
                    Sign in with Google
                </button>
                <p className="text-center text-[10px] mt-2">
                    Sign in with your @up.edu.ph email
                </p>
            </div>
        </div>
    );
}

export default LoginPage;
