
class Helper {

    //...date format
    dateFormat(date) {
        const newDate = new Date(date);
        const formattedDate = newDate.toLocaleDateString("en-US", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });

        return formattedDate;
    }


}

export default new Helper();