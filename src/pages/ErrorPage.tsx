import { useRouteError } from 'react-router-dom';

function ErrorPage() {
    const error = useRouteError() as {
        statusText: string | null;
        message: string | null;
    };
    console.error(error);

    return (
        <div className="w-screen h-screen flex flex-col gap-20 justify-center text-center">
            <h1 className="text-6xl">Oops!</h1>
            <p>Sorry, an unexpected error has occurred.</p>
            <p>
                <i>{error?.statusText || error?.message}</i>
            </p>
        </div>
    );
}

export default ErrorPage;
