const convertSecondsToHrs=(seconds)=>{
   try{
    let date = new Date(null);
    date.setSeconds(seconds); 
    const hhmmssFormat = date.toISOString().substr(11, 8);
    return hhmmssFormat;
   }
   catch(error)
   { console.log(error)
    throw error
   }
}

module.exports={
    convertSecondsToHrs
}