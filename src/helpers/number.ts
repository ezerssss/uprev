export function getHighestNumber(data: any) {
    let highestNumber = 0;

    data?.questions?.forEach((question: any) => {
        if (question.number > highestNumber) {
            highestNumber = question.number;
        }
    });

    return highestNumber;
}
