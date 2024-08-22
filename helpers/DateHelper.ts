const DateHelper = () => {

    const GetTimeZoneDate = (timeZone : string) : Date =>{
        let stringDate : string = new Date().toLocaleString('en-US',{ timeZone: timeZone });
        let resultDate : Date = new Date(stringDate);
        return resultDate;
    }

    const GetTimeZoneString = (timeZone : string) : string =>{
        let stringDate : string = new Date().toLocaleString('en-US',{ timeZone: timeZone });
        return stringDate;
    }


    return {
        GetTimeZoneDate,
        GetTimeZoneString
    }


}

export default DateHelper;