import corporate from './images/corporate-image.webp';
import { CiCircleList, CiEdit } from 'react-icons/ci';
import { BsCode } from 'react-icons/bs';
import logo from './images/logo.png';

function Home() {
    return (
        <>
            <div className="flex flex-col items-center 2xl:items-start gap-10 2xl:flex-row px-2 2xl:px-64">
                <section className="w-full 2xl:w-1/2 mt-5">
                    <img
                        alt="corporate"
                        className="rounded-2xl w-96 block 2xl:hidden my-5 m-auto"
                        src={corporate}
                    />
                    <h1 className="text-[3.2rem] leading-none font-bold my-10 text-center 2xl:text-left">
                        Let's review <br /> together.
                    </h1>
                    <div className="grid grid-rows-2 grid-cols-3 gap-1 sm:gap-5 w-[280px] sm:w-[450px] m-auto 2xl:m-0">
                        {[
                            'kas 1',
                            'cmsc 11',
                            'cmsc 10',
                            'cmsc 56',
                            'math 18',
                        ].map((subject) => (
                            <button
                                className="aspect-square w-full border-2 rounded-2xl hover:scale-105 hover:bg-red-500 hover:text-white transition ease-in-out duration-500 flex justify-center items-center uppercase"
                                key={subject}
                            >
                                <p>{subject}</p>
                            </button>
                        ))}
                    </div>
                </section>
                <section className="w-1/2 hidden 2xl:block ">
                    {/* <div>
                        <img
                            alt="corporate"
                            className="rounded-2xl w-full mt-32"
                            src={corporate}
                        />
                    </div> */}
                </section>
            </div>
            <div className="mt-24 mb-14 px-2 2xl:px-64 h-[250px] flex flex-col justify-center items-center gap-5 relative overflow-clip">
                <p className="z-20">Want to help your fellow students?</p>
                <button className="text-lg leading-none font-bold text-center border-2 px-10 h-16 rounded-2xl hover:bg-red-500 hover:text-white transition ease-in-out duration-500 z-20">
                    Make your own quiz
                </button>
                <div className="flex gap-5 z-20">
                    <CiCircleList size={30} />
                    <CiEdit size={30} />
                    <BsCode size={30} />
                </div>
                <img
                    alt="uprev"
                    className="absolute opacity-5 -top-[360px]"
                    src={logo}
                />
            </div>
        </>
    );
}

export default Home;
