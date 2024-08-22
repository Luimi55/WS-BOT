const fs = require('node:fs');
import configurations from '../conf/config.json' assert { type: 'json' };
import DateHelper from '../helpers/DateHelper';

const {LogDir, TimeZone} = configurations;
const dateHelper = DateHelper();

const LogService = () => {

  const CreateDirIfNotExist = () => {
    if(LogDir != ""){
      if (!fs.existsSync(LogDir)){
        fs.mkdirSync(LogDir);
      }
    } else {
      throw 'Config error: LogDir is not specified'
    }
  }

  
  const WriteLog = (log : string) => {

    try {
      const date = dateHelper.GetTimeZoneDate(TimeZone);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
  
      const fileName = `${year}-${month}-${day}`;
      const fullPath = `${LogDir}/${fileName}`;
      
      CreateLogFileIfNotExist(fullPath)

      const logText = `${dateHelper.GetTimeZoneString(TimeZone)} - ${log}\n`;

      fs.appendFile(fullPath, logText, (error: any) => {
        if (error) throw error;
          console.log(logText)
      });
    } catch (error) {
      console.log(error)
    }

  }
  
  const CreateLogFileIfNotExist = (fullPath : string) => {
    try {
      if (!fs.existsSync(fullPath)) {
        fs.writeFile(fullPath, '', (error: any) => {
            if (error) throw error;
            console.log('Log file created successfully');
        });
      }
    } catch (error) {
      console.log(error)
    }
  }

  return {
    CreateDirIfNotExist,
    WriteLog
  }

}

export default LogService