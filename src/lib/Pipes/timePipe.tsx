import moment from "moment"

const timePipe = (timeString: string, format: string) => {

    if (timeString) {
        if (timeString == 'Invalid date' || timeString == '-') {
            return '-';
        } else {
            let date = moment.utc(timeString).format(format)

            return date;
        }
    }
    return '';

}

export default timePipe;