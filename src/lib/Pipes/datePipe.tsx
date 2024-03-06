import moment from "moment"

const datePipe = (timeString: string, format: string) => {

    if (timeString) {
        if (timeString == 'Invalid date' || timeString == '-') {
            return '-';
        } else {
            let date = moment(timeString).format(format)

            return date;
        }
    }
    return '';

}

export default datePipe;