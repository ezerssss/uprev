import { doc, getDoc } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import db from '../firebase/db';
import { errorAlert } from '../helpers/errors';
import { PickerConfig } from '../interfaces/picker';
import { CgDanger } from 'react-icons/cg';
import { AiFillCloseCircle } from 'react-icons/ai';
import { ClipLoader } from 'react-spinners';
import { changeSubjectConfig, saveSubjectConfig } from '../helpers/config';
import Swal from 'sweetalert2';
import { ConfigContext } from '../App';

interface PropsInterface {
    handleCloseModal: () => void;
}

function ModalContent(props: PropsInterface) {
    const { handleCloseModal } = props;

    const { setSubjects } = useContext(ConfigContext);

    const [picker, setPicker] = useState<PickerConfig[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [useCustomSubjects, setUseCustomSubjects] = useState<boolean>(false);
    const [customSubjects, setCustomSubjects] = useState<string>('');

    const [selectedCourse, setSelectedCourse] =
        useState<string>('Computer Science');
    const [selectedYear, setSelectedYear] = useState<number>(1);

    useEffect(() => {
        async function getAvailableCourses() {
            try {
                const docRef = doc(db, 'config', 'all');

                const data = (await (await getDoc(docRef)).data()) as Record<
                    string,
                    PickerConfig[]
                >;

                setIsLoading(false);
                setPicker(data.picker);
            } catch (error) {
                errorAlert(error);
                setIsLoading(false);
            }
        }

        getAvailableCourses();
    }, []);

    const yearsConfig = picker.filter(
        (config) => config.course === selectedCourse,
    );

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full text-sm relative">
                <ClipLoader />
            </div>
        );
    }

    function handleCustomSubject() {
        const subjects = customSubjects.split(',').map((s) => s.toLowerCase());

        saveSubjectConfig(subjects);
        if (setSubjects) {
            setSubjects(subjects);
        }
    }

    async function handleSave() {
        try {
            if (useCustomSubjects) {
                handleCustomSubject();
            } else {
                const newSubjects = await changeSubjectConfig(
                    selectedCourse,
                    selectedYear,
                );

                if (setSubjects) {
                    setSubjects(newSubjects);
                }
            }

            await Swal.fire(
                'Success!',
                'Subjects on your home page are now updated.',
                'success',
            );

            handleCloseModal();
        } catch (error) {
            errorAlert(error);
        }
    }

    return (
        <div className="flex items-center justify-center h-full text-sm relative">
            <button
                className="absolute p-2 top-5 right-0 md:right-5"
                onClick={handleCloseModal}
            >
                <AiFillCloseCircle data-tip="Close modal" size={25} />
            </button>
            <div className="w-[320px]">
                <section className="my-3">
                    <p>Course:</p>
                    <select
                        disabled={useCustomSubjects}
                        value={selectedCourse}
                        className="uppercase border p-2 rounded-xl outline-none cursor-pointer my-2 min-w-[200px]"
                        onChange={(event) =>
                            setSelectedCourse(event.target.value)
                        }
                    >
                        {!useCustomSubjects &&
                            picker.map(({ course }) => (
                                <option key={course} value={course}>
                                    {course}
                                </option>
                            ))}
                    </select>
                </section>
                <section className="my-3">
                    <p>Year:</p>
                    <select
                        className="uppercase border p-2 rounded-xl outline-none cursor-pointer my-2 min-w-[200px]"
                        disabled={useCustomSubjects}
                        value={selectedYear}
                        onChange={(event) =>
                            setSelectedYear(parseInt(event.target.value))
                        }
                    >
                        {!useCustomSubjects &&
                            yearsConfig.map(({ years }) =>
                                Array.from(Array(years).keys()).map((year) => (
                                    <option
                                        key={`${selectedCourse},${year + 1}`}
                                        value={year + 1}
                                    >
                                        {(year + 1).toString()}
                                    </option>
                                )),
                            )}
                    </select>
                </section>
                <section>
                    <span
                        className="flex gap-1 items-center ml-1 cursor-pointer"
                        onClick={() => setUseCustomSubjects(!useCustomSubjects)}
                    >
                        <input
                            type="checkbox"
                            className="cursor-pointer"
                            checked={useCustomSubjects}
                            onChange={() =>
                                setUseCustomSubjects(!useCustomSubjects)
                            }
                        />
                        <p className="text-gray-400">Use custom subjects?</p>
                    </span>
                    {useCustomSubjects && (
                        <div className="mt-2">
                            <div className="flex-row gap-2 flex-wrap">
                                <CgDanger color="orange" />
                                <p className="text-orange-500 flex-1">
                                    Careful! Make sure to properly spell the
                                    subject names. Currently, we only support up
                                    to 6 custom subjects.
                                </p>
                            </div>
                            <textarea
                                className="border rounded outline-none p-2 w-full h-20 my-3"
                                disabled={!useCustomSubjects}
                                placeholder="Enter custom subjects"
                                value={customSubjects}
                                onChange={(event) =>
                                    setCustomSubjects(event.target.value)
                                }
                            />
                            <p>
                                Input your subjects separated by a comma. e.g.
                                math 18, cmsc 10, cmsc 11
                            </p>
                        </div>
                    )}
                </section>
                <button
                    className="mt-10 p-2 px-5 border rounded-xl hover:bg-red-500 hover:text-white transition ease-in-out duration-500"
                    onClick={handleSave}
                >
                    Save and Apply
                </button>
            </div>
        </div>
    );
}

export default ModalContent;
